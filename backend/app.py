from flask import Flask
from config import Config
from models import db
from routes import bp
from flask_migrate import Migrate
from flask_cors import CORS  # ✅ Add this

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Enable CORS for frontend domain
    CORS(app, origins=["https://smart-inventory-system-frontend.onrender.com"])

    # Initialize DB + Migrations
    db.init_app(app)
    migrate = Migrate(app, db)

    # Register routes
    app.register_blueprint(bp, url_prefix="/api")

    # Health check for Render
    @app.route("/health")
    def health():
        return {"status": "ok"}

    return app


# -------------------------------
# Create app (Render needs this)
# -------------------------------
app = create_app()


# ----------------------------------------------------
# TEMPORARY: Create tables on Render the FIRST deploy
# ----------------------------------------------------
# ❗ AFTER the first successful deploy, DELETE THIS BLOCK.
with app.app_context():
    from models import db
    db.create_all()


# Local development entry point
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
