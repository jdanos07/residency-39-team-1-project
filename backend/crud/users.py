from flask import jsonify
def register_user_routes(app):
    @app.get("/users")
    def users_list():
        return jsonify([]), 200
