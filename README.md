# NTNU Database Systems

# 114-1 師大資料庫系統
- Instructor : Prof. Tsai Yun-Cheng
- Name：陳生好
- Department / Year : TAHRD, Class of 116

## Homework Submission Area
### HW1 Python Flask to MySQL Database
HW1 Task:
- Create a table in MySQL (**CREATE TABLE**).
- Build an Insert web page that allows you to input a record from the web.
- Ensure that the inserted data is visible in the MySQL database.

****

All files related to this homework are located inside the **`Database Systems HW1`** folder:
| File | Description |
|-------------|-------------|
| `app.py`                | Main Flask application that handles routes and connects to the MySQL database |
| `requirements.txt`      | Lists all Python dependencies required to run the project                     |
| `templates/index.html`  | Homepage with a form to add new employee data                                 |
| `templates/show.html`   | Displays a table of all employees from the database                           |
| `.gitignore`            | Specifies files and folders that Git should ignore                            |
| `.vscode/settings.json` | VS Code workspace configuration (optional)                                    |
| `.DS_Store`             | macOS system file (can be ignored)                                            |

****

To run the project:
1. Install dependencies:
```bash
pip install -r requirements.txt
```
2. Create the MySQL database:
```bash
CREATE DATABASE flask_demo;
USE flask_demo;
CREATE TABLE IF NOT EXISTS employee (
    employee_ID INT PRIMARY KEY,
    employee_name VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100)
);
```
3. Run the Flask app:
```bash
python3 app.py
```
4. Open your browser and go to:
```bash
http://127.0.0.1:5000/
```
****

Expected Output:

**Homepage** (`index.html`)
- Displays a form to add employee data:
`Employee ID`, `Employee Name`, `First Name`, and `Last Name`.
- When you submit, a success message will appear if data is inserted correctly.

**Show Page** (`show.html`)
- Lists all employees in a formatted table.
- Includes delete buttons to remove employees by ID.

****

Video Demo
[▶ 114-1 Database Systems HW1](https://youtu.be/FwG3LwB8hIU)

### HW2
### HW3
### HW4

## Final Project Submission Area
