from flask import Flask, jsonify
from flask_cors import CORS

from backend.crud.tasks import register_task_routes
from backend.crud.archived import register_archived_routes
from backend.crud.users import register_user_routes

app = Flask(__name__)
CORS(app)

@app.get("/")
def index():
    return jsonify({"message": "Loopy Backend API is running"}), 200

@app.get("/health")
def health():
    return jsonify({"ok": True}), 200

# attach route groups
register_task_routes(app)
register_archived_routes(app)
register_user_routes(app)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(__import__("os").getenv("PORT","5000")))