from flask import Flask
from config import Config
from models import db
from routes import bp
from flask_migrate import Migrate
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=["https://smart-inventory-system-frontend.onrender.com"])

    db.init_app(app)
    migrate = Migrate(app, db)

    app.register_blueprint(bp, url_prefix="/api")

    @app.route("/health")
    def health():
        return {"status": "ok"}

    return app

app = create_app()

# ❌ Removed db.create_all() — avoids data reset on deploy

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
