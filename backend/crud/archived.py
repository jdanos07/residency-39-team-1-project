from flask import request, jsonify
from backend.client import db, SERVER_TS
from .utils import serialize
from typing import Dict, Any, Optional, List

COL = "archive"

# minimal archive helpers

def add_archive(user_id: str, ref_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    p = {**payload, "userId": user_id, "refType": ref_type, "createdAt": SERVER_TS}
    doc = db.collection(COL).document()  # type: ignore
    doc.set(p)
    snap = doc.get()
    return {**snap.to_dict(), "id": snap.id}  # type: ignore


def delete_archived_entry(archive_id: str) -> bool:
    ref = db.collection(COL).document(archive_id)  # type: ignore
    if not ref.get().exists:  # type: ignore
        return False
    ref.delete()
    return True


def list_archived_for_user(user_id: str, ref_type: Optional[str] = None) -> List[Dict[str, Any]]:
    q = db.collection(COL).where("userId", "==", user_id)  # type: ignore
    if ref_type:
        q = q.where("refType", "==", ref_type)
    return [{**d.to_dict(), "id": d.id} for d in q.stream()]  # type: ignore


def register_archived_routes(app):
    def bad_request(msg: str):
        return jsonify({"error": msg}), 400

    @app.post("/archive")
    def add_archive_http():
        data = request.get_json(force=True) or {}
        uid = data.get("user_id")
        ref = data.get("ref_type")
        payload = data.get("payload", {})
        if not uid or not ref:
            return bad_request("user_id and ref_type are required")
        entry = add_archive(uid, ref, payload)
        return jsonify(serialize(entry)), 201

    @app.delete("/archive/<archive_id>")
    def delete_archive_http(archive_id: str):
        ok = delete_archived_entry(archive_id)
        if not ok:
            return jsonify({"error": "archive entry not found"}), 404
        return jsonify({"deleted": True, "id": archive_id}), 200

    @app.get("/archive")
    def list_archive_http():
        uid = request.args.get("user_id")
        ref_type = request.args.get("ref_type")
        if not uid:
            return bad_request("user_id query param is required")
        entries = list_archived_for_user(uid, ref_type=ref_type)
        return jsonify(serialize(entries)), 200