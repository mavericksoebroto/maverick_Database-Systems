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

****
****

### HW3 Flask + MongoDB (insert_many) Deployment
HW3 Task:
- Complete the MongoDB frontend based on last week’s material.  
- Successfully implement the **`insert_many` feature** to insert multiple user records at once.  
- Deploy the Flask + MongoDB project on Render, and make it available via a public online link.

****

All files related to this homework are located inside the **`Database Systems HW3`** folder:  
| File | Description |
|-------------|-------------|
| `app.py`                | Main Flask application that handles routes, connects to MongoDB Atlas, and implements `insert_one` and `insert_many` features |
| `requirements.txt`      | Lists all Python dependencies required to run the project |
| `templates/index.html`  | Web interface with forms to insert single or multiple users, and display all stored data |
| `.gitignore`            | Specifies files and folders that Git should ignore (e.g., `.venv`, `.DS_Store`) |

****

Environment Variables (on Render):
| Variable | Purpose |
|-----------|----------|
| `MONGODB_URI` | Connection string to MongoDB Atlas |
| `DBNAME` | Database name (`hw3db`) |

****

To run the project:
1. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

2. Set up MongoDB connection (example using environment variables):
    ```bash
    export MONGODB_URI="mongodb+srv://maverick:maverick2005@cluster0.b8g7ual.mongodb.net/?appName=Cluster0"
    export DBNAME="hw3db"
    ```

3. Run the Flask app:
    ```bash
    python3 app.py
    ```

4. Open your browser and go to:
    ```bash
    http://127.0.0.1:5001/
    ```

5. Example JSON for `insert_many`:
```json
[
  {"name": "Alice", "age": 25},
  {"name": "Bob", "age": 30},
  {"name": "Charlie", "age": 22},
  {"name": "Diana", "age": 27},
  {"name": "Ethan", "age": 35},
  {"name": "Fiona", "age": 29}
]
```
****

Expected Output:

**Homepage** (`index.html`)
- Two input sections:
  - Add Single User (`insert_one`) — form to input one record (name + age).
  - Add Multiple Users (`insert_many`) — text area to insert multiple JSON documents at once.
- Below the forms, all records from MongoDB are displayed dynamically with a **Delete** button beside each one.

**MongoDB Atlas**
- Inserted users are visible in the `hw3db.users` collection.
- Supports both single and batch insertion through the web interface.

**Render Deployment**
- The live web app is publicly accessible at:  
  🔗 [https://database-systems-hw3.onrender.com](https://database-systems-hw3.onrender.com)  
- Environment variables (`MONGODB_URI`, `DBNAME`) are securely stored in Render settings.

****

Video Demo
[▶ 114-1 Database Systems HW3](https://youtu.be/-_aaB3jkLio)

****
****

### HW4 Flask + MongoDB (Bulk Delete Feature)
HW4 Task:
- Extend the previous Flask + MongoDB project by adding a **bulk delete (`delete_many`)** feature.
- Allow users to select multiple records using checkboxes and delete them with one action.
- Preserve the original **single delete** functionality.
- Deploy the updated application to **Render** and demonstrate the feature via a video presentation.

****

All files related to this homework are located inside the **`Database Systems HW4`** folder:
| File | Description |
|-------------|-------------|
| `app.py`                | Main Flask application implementing insert, single delete, and bulk delete features |
| `requirements.txt`      | Lists all Python dependencies required to run the project |
| `templates/index.html`  | Web interface with checkbox-based bulk delete and individual delete buttons |
| `.gitignore`            | Specifies files and folders that Git should ignore |

****

To run the project locally:
1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up MongoDB connection:
```bash
export MONGODB_URI="mongodb://localhost:27017"
export DBNAME="hw4db"
```

3. Run the Flask app:
```bash
python3 app.py
```

4. Open your browser and go to:
```bash
http://127.0.0.1:5001/
```

****

Expected Output:

**Homepage** (`index.html`)
- Displays a list of all users stored in MongoDB.
- Each user record includes:
  - A checkbox for bulk deletion.
  - An individual **Delete** button for single-record deletion.
- A **Delete Selected** button deletes all selected users at once.
- Success or error messages appear after each operation.

**MongoDB**
- Deleted records are immediately removed from the database.
- Supports both single and bulk delete operations.

**Render Deployment**
- The application is deployed on Render and publicly accessible at:  
  🔗 [https://database-systems-hw3.onrender.com](https://database-systems-hw3.onrender.com)  
- MongoDB connection is handled via environment variables.

****

Video Demo  [▶ 114-1 Database Systems HW4](https://youtu.be/9rz9k-LcLz0)

****
****

## Final Project Submission Area
### First Proposal of Final Project (Week 12)
[Introduction to the Content](https://www.canva.com/design/DAG4CXETdHg/kgwutq58V9jBhx2OOGmsPw/edit?utm_content=DAG4CXETdHg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
### Final Submission (Week 16)
📦 The Smart Inventory System (SIS) is a full-stack web application built to efficiently manage inventory, suppliers, and sales for small businesses or educational environments. SIS provides real-time insights into stock levels, generates low stock alerts, and allows users to track recent transactions through an interactive dashboard. With export capabilities in both CSV and PDF formats, it combines a modern React frontend with a Flask backend, offering a seamless and responsive inventory management experience.

[Smart Inventory System](https://smart-inventory-system-frontend.onrender.com/)

[Final Project Presentation](https://youtu.be/HwBXlVesJ5Y)
