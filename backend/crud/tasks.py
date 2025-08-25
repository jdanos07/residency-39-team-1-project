from typing import Dict, Any, List, Optional
from flask import request, jsonify
from datetime import datetime
from .utils import serialize
from backend.client import db, SERVER_TS

COL = "tasks"

# ---- core helpers ----
def create_task(user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    payload = {
        "userId": user_id,
        "title": data.get("title", ""),
        "notes": data.get("notes"),
        "priority": data.get("priority"),
        "dueDate": data.get("dueDate"),
        "state": data.get("state", "Exploring"),
        "createdAt": SERVER_TS,
        "updatedAt": SERVER_TS,
    }
    doc_ref = db.collection(COL).document()  # type: ignore
    doc_ref.set(payload)  # type: ignore
    doc = doc_ref.get()  # type: ignore
    return {**doc.to_dict(), "id": doc.id}  # type: ignore


def get_task(task_id: str) -> Optional[Dict[str, Any]]:
    doc = db.collection(COL).document(task_id).get()  # type: ignore
    if not doc.exists:  # type: ignore
        return None
    return {**doc.to_dict(), "id": doc.id}  # type: ignore


def list_tasks(user_id: str) -> List[Dict[str, Any]]:
    q = db.collection(COL).where("userId", "==", user_id)  # type: ignore
    return [{**d.to_dict(), "id": d.id} for d in q.stream()]  # type: ignore


def delete_task(task_id: str) -> bool:
    ref = db.collection(COL).document(task_id)  # type: ignore
    if not ref.get().exists:  # type: ignore
        return False
    ref.delete()  # type: ignore
    return True

# ---- http routes ----

def register_task_routes(app):
    def bad_request(msg: str):
        return jsonify({"error": msg}), 400

    @app.post("/tasks")
    def create_task_http():
        data = request.get_json(force=True) or {}
        uid = data.get("user_id")
        if not uid:
            return bad_request("user_id is required")
        task = create_task(uid, data)
        return jsonify(serialize(task)), 201

    @app.get("/tasks/<task_id>")
    def get_task_http(task_id: str):
        task = get_task(task_id)
        if not task:
            return jsonify({"error": "task not found"}), 404
        return jsonify(serialize(task)), 200

    @app.delete("/tasks/<task_id>")
    def delete_task_http(task_id: str):
        ok = delete_task(task_id)
        if not ok:
            return jsonify({"error": "task not found"}), 404
        return jsonify({"deleted": True, "id": task_id}), 200

    @app.get("/tasks")
    def list_tasks_http():
        uid = request.args.get("user_id")
        if not uid:
            return bad_request("user_id query param is required")
        tasks = list_tasks(uid)
        return jsonify(serialize(tasks)), 200