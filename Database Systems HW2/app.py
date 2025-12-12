from flask import Flask, render_template, request, redirect
import mysql.connector

app = Flask(__name__)

 # ✅ Connect to MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",          # change if needed
    password="maverick2005",  # change this to your actual MySQL password
    database="flask_demo"
)
cursor = db.cursor(dictionary=True)

# ✅ Home route: show employees with department + project join
@app.route('/')
def index():
    query = """
    SELECT e.employee_id, e.employee_name, e.first_name, e.last_name,
           d.department_name, p.project_name
    FROM employee e
    LEFT JOIN department d ON e.department_id = d.department_id
    LEFT JOIN project p ON d.department_id = p.department_id
    ORDER BY e.employee_id;
    """
    cursor.execute(query)
    employees = cursor.fetchall()
    return render_template('index.html', employees=employees)

# ✅ Create new employee
@app.route('/add', methods=['POST'])
def add_employee():
    employee_name = request.form['employee_name']
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    department_id = request.form['department_id']

    cursor.execute("""
        INSERT INTO employee (employee_name, first_name, last_name, department_id)
        VALUES (%s, %s, %s, %s)
    """, (employee_name, first_name, last_name, department_id))
    db.commit()
    return redirect('/')

# ✅ Update employee
@app.route('/update/<int:id>', methods=['POST'])
def update_employee(id):
    employee_name = request.form['employee_name']
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    department_id = request.form['department_id']

    cursor.execute("""
        UPDATE employee
        SET employee_name=%s, first_name=%s, last_name=%s, department_id=%s
        WHERE employee_id=%s
    """, (employee_name, first_name, last_name, department_id, id))
    db.commit()
    return redirect('/')

# ✅ Delete employee
@app.route('/delete/<int:id>')
def delete_employee(id):
    cursor.execute("DELETE FROM employee WHERE employee_id = %s", (id,))
    db.commit()
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
