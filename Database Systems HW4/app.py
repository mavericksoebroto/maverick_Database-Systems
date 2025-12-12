import os, json
from flask import Flask, render_template, request, redirect, url_for, flash
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
app.secret_key = "devkey"  # For flash messages

# --- MongoDB connection ---
MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
DBNAME = os.environ.get("DBNAME", "hw3db")

client = MongoClient(MONGODB_URI)
db = client.get_database(DBNAME)
users = db.get_collection("users")

# --- Routes ---
@app.route("/", methods=["GET"])
def index():
    items = list(users.find().sort("_id", -1))
    return render_template("index.html", items=items)

@app.route("/insert_one", methods=["POST"])
def insert_one():
    name = request.form.get("name", "").strip()
    age = request.form.get("age", "").strip()
    if not name or not age.isdigit():
        flash("Please enter a valid name and numeric age.")
        return redirect(url_for("index"))
    users.insert_one({"name": name, "age": int(age)})
    flash("Added successfully!")
    return redirect(url_for("index"))

@app.route("/insert_many", methods=["POST"])
def insert_many():
    data = request.form.get("bulk_json", "").strip()
    try:
        json_data = json.loads(data)
        if isinstance(json_data, list):
            users.insert_many(json_data)
            flash(f"Inserted {len(json_data)} users!")
        else:
            flash("Input must be a JSON array (list).")
    except Exception as e:
        flash(f"Error: {str(e)}")
    return redirect(url_for("index"))

@app.route("/delete/<id>", methods=["POST"])
def delete(id):
    users.delete_one({"_id": ObjectId(id)})
    flash("Deleted successfully!")
    return redirect(url_for("index"))

@app.route("/delete_many", methods=["POST"])
def delete_many():
    ids = request.form.getlist("selected_ids")  # list of IDs
    if not ids:
        flash("No users selected for deletion.")
        return redirect(url_for("index"))

    try:
        object_ids = [ObjectId(i) for i in ids]
        result = users.delete_many({"_id": {"$in": object_ids}})
        flash(f"Deleted {result.deleted_count} user(s)!")
    except Exception as e:
        flash(f"Error deleting users: {str(e)}")

    return redirect(url_for("index"))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=5001, debug=True)
