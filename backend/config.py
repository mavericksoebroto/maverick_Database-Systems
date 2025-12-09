import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "devkey")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "mysql+pymysql://root:maverick2005@localhost/inventory_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
