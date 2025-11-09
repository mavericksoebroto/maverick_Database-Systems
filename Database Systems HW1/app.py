from flask import Flask, request, jsonify, render_template
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

# MySQL connection settings
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'maverick2005',
    'database': 'flask_demo',
    'port': 3306
}

def get_db_connection():
    """Create a database connection"""
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        print("Database connection error:", e)
        return None

# Home page
@app.route('/')
def index():
    return render_template('index.html')

# API: Add employee
@app.route('/add_employee', methods=['POST'])
def add_employee():
    try:
        data = request.get_json()
        employee_ID = data.get('employee_ID')
        employee_name = data.get('employee_name')
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        if not all([employee_ID, employee_name, first_name, last_name]):
            return jsonify({"error": "Please fill in all fields"}), 400

        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Cannot connect to the database"}), 500

        cursor = conn.cursor()
        insert_query = """
        INSERT INTO employee (employee_ID, employee_name, first_name, last_name)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (employee_ID, employee_name, first_name, last_name))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": f"Employee {employee_name} (ID: {employee_ID}) added successfully!"}), 200

    except mysql.connector.IntegrityError:
        return jsonify({"error": "This employee_ID already exists, please use another ID"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Show all employees
@app.route('/show')
def show():
    conn = get_db_connection()
    if conn is None:
        return "Cannot connect to the database", 500

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employee")
    employees = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('show.html', employees=employees)

# Delete employee
@app.route('/delete_employee/<int:employee_ID>', methods=['POST'])
def delete_employee(employee_ID):
    conn = get_db_connection()
    if conn is None:
        return "Cannot connect to the database", 500

    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM employee WHERE employee_ID = %s", (employee_ID,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": f"Employee ID {employee_ID} deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
