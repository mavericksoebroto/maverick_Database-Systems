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

****
****

### HW2 CRUD + JOIN Implementation
HW2 Task:  
- Design an ER model for three tables/entities.  
- Include at least one JOIN operation (INNER JOIN, LEFT JOIN, or RIGHT JOIN).  
- Implement full CRUD operations (Create, Read, Update, Delete) using Flask connected to MySQL.    

****

All files related to this homework are located inside the **`Database Systems HW2`** folder:  
| File | Description |
|-------------|-------------|
| `app.py`                | Main Flask application that handles routes, database connections, and CRUD operations |
| `requirements.txt`      | Lists all Python dependencies required to run the project |
| `templates/index.html`  | Homepage showing records with options to add, edit, and delete data |
| `templates/add.html`    | Form to create new records in the database |
| `templates/edit.html`   | Form to update existing records |
| `templates/show.html`   | Displays joined data from multiple tables (JOIN operation) |
| `.gitignore`            | Specifies files and folders that Git should ignore |
| `.vscode/settings.json` | VS Code workspace configuration |
| `HW2 ER Diagram.png`    | Entity-Relationship Diagram showing the three-entity model and relationships used in this homework |

****

#### Three-Entity ERD Model
![HW2 ER Diagram](Database%20Systems%20HW2/HW2%20ER%20Diagram.png)

****

To run the project:
1. Install dependencies:
```bash
pip install -r requirements.txt
```
2. Create the MySQL database and tables:
```bash
CREATE DATABASE flask_hw2;
USE flask_hw2;

CREATE TABLE Department (
    dept_ID INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

CREATE TABLE Employee (
    emp_ID INT PRIMARY KEY AUTO_INCREMENT,
    emp_name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    dept_ID INT,
    FOREIGN KEY (dept_ID) REFERENCES Department(dept_ID)
);

CREATE TABLE Project (
    project_ID INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(100) NOT NULL,
    emp_ID INT,
    FOREIGN KEY (emp_ID) REFERENCES Employee(emp_ID)
);
```
3. Run the Flask app:
```bash
python app.py
```
4. Open your browser and go to:
```bash
http://127.0.0.1:5000/
```
****

Expected Output:

**Homepage** (`index.html`)
- Displays all employee records with their departments.
- Includes buttons for Add, Update, and Delete actions.

**Add Employee Button** (`add.html`)
- Form to input new employee, department, or project data.
- Submits data into MySQL using INSERT INTO.

**Update Button** (`edit.html`)
- Allows updating existing data using UPDATE query.

**Employee Records Page** (`show.html`)
- Shows combined data from multiple tables using INNER JOIN.

****

Video Demo
[▶ 114-1 Database Systems HW2](https://youtu.be/ZnJfBQJe74o)

### HW3
### HW4

## Final Project Submission Area
