from flask import Flask #type: ignore
from controllers.quests_controller import quests_bp
from controllers.mentor_controller import mentor_bp
from controllers.users_controller import users_bp
from controllers.goals_controller import goals_bp
from controllers.quests_crud_controller import quests_crud_bp

app = Flask(__name__)
app.register_blueprint(quests_bp)
app.register_blueprint(mentor_bp)
app.register_blueprint(users_bp)
app.register_blueprint(goals_bp)
app.register_blueprint(quests_crud_bp)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
