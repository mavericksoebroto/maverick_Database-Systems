from flask import Flask
from config import Config
from models import db
from routes import bp
from flask_migrate import Migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    migrate = Migrate(app, db)
    app.register_blueprint(bp)

    @app.route("/health")
    def health():
        return {"status":"ok"}

    return app

app = create_app()   # ← THIS MUST BE OUTSIDE the if block

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
