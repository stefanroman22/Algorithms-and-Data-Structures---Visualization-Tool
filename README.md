# Algorithms and Data Structures – Visualization Tool

This project explores how the teaching of graph algorithms and data structures can be enhanced through engaging, interactive, and accessible approaches, particularly for university students who often find these abstract concepts challenging to grasp.

The project was developed as a Bachelor's Thesis project art Radboud University - Nijmegen under the proffesional guidance of Dr. Lucia Cavallaro and Prof. Frits Vaandrager.

Link: [https://stefanroman22.github.io/Algorithms-and-Data-Structures---Visualization-Tool/]


---

##  Project Overview

This tool provides step-by-step visualizations of essential graph algorithms (e.g., DFS, BFS, Dijkstra, Bellmand-Ford, 2-Colroing, Prim, Kruskal) and basic data structures (e.g., stack, array, queue). It combines theoretical explanations with animated demonstrations and quizzes to reinforce learning.

The project is structured around three core modules:
-  **Theory** – provides concise interactive explanations of algorithms.
-  **Visualization** – animates the execution of algorithms on user-provided or random input.
-  **Quizzes** – tests users' understanding with dynamically generated questions.

---

## Project Folder Structure

###  1. General Project Root

| Folder            | Description |
|-------------------|-------------|
| `src/`            | React + TypeScript frontend code, including all UI components. |
| `django-backend/` | Django backend project, including all apps and API logic. |
| `README.md`       | Project documentation file. |
| `requirements.txt`| Python package dependencies for the backend. |

---

### 2. Frontend – `src/`

| Folder              | Description |
|---------------------|-------------|
| `components/`       | Reusable React components such as buttons, navbars, algorithm visualizers, etc. |
| `pages/`            | Page-level .tsx components (e.g., Home, Quiz, Visualizer). |
| `styles/`           | All .css files for all .tsx filed from  `pages/`  |
| `data/`             | All intersting facts used for landapge |

---

### 3. Backend – `django-backend/`

####  `backend/`
| File/Folder       | Description |
|-------------------|-------------|
| `settings.py`     | Django configuration (apps, database, middleware). |
| `urls.py`         | Root URL routing for the entire backend. |
| `wsgi.py` / `asgi.py` | Entry points for WSGI/ASGI servers. |

####  `quizzes/` – Django app for quiz management
| File/Folder       | Description |
|-------------------|-------------|
| `models.py`       | Defines the database models for quizzes, questions, and answers. |
| `serializers.py`  | Converts models to/from JSON for the REST API. |
| `views.py`        | Handles API logic for creating, submitting, and grading quizzes. |
| `urls.py`         | URL routing specific to the quiz app. |
| `migrations/`     | Auto-generated files to manage database schema changes. |

####  `feedback/` – Django app for collecting user feedback
| File/Folder       | Description |
|-------------------|-------------|
| `models.py`       | Database model for storing feedback entries. |
| `views.py`        | Handles feedback form submission logic. |
| `admin.py`        | Registers feedback model with Django admin. |
| `migrations/`     | Schema history for the feedback app. |

####  `media/`
| Folder            | Description |
|-------------------|-------------|
| `media/`          | Stores uploaded files (e.g., if users upload graphs or screenshots). |


---

##  How to Run the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/stefanroman22/Algorithms-and-Data-Structures---Visualization-Tool.git
cd Algorithms-and-Data-Structures---Visualization-Tool
```

### 2. Setup the backend (Django)
```bash
cd django-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### 3. Setup the frontend (TypeScript)
Open a new terminal:
```bash
cd Algorithms-and-Data-Structures---Visualization-Tool
npm install
npm run dev
```
### 4. Open up browser
```bash
  http://localhost:5173/ - for frontend
  http://localhost:8080/ - for backend
  Note: actual port number might differ, so check the terminal after running npm run dev for frontedn and python manage.py runserver for backend
```
---

##  Technologies Used

###  **Frontend**
- **HTML/CSS** – For structure and layout.
- **TypeScript + React.js** – Enables component-based UI and type safety.
- **D3.js** – Used for animating graph algorithms and data structures.

###  **Backend**
- **Django (Python)** – Handles user management, quiz logic, and stores persistent data via REST APIs.
- **Django REST Framework** – Simplifies API development and user authentication.

These technologies were chosen for:
- Ease of integration between React and Django.
- Strong typing (TypeScript) for large-scale frontend.
- Rich visualization capabilities (D3.js).
- Rapid API development and user/session management (Django).

---

##  Key Features

###  Interactive Modules
- Theory + animations combined for each algorithm.
- Users can step through algorithm execution in real-time.

###  Algorithm Visualizations
- Graph algorithms: DFS, BFS, Dijkstra, Bellman-Ford, Kruskal, Prim, 2-Color.
- Data structures: Array, Stack, Queue.

###  Custom Graph Input
- Users can create custom graphs or generate random ones.
- Full control over start node, edge weights, and execution steps.

### Quizzes and Progress
- Each algorithm comes with a 10-question multiple-choice quiz.
- Final score + feedback on incorrect answers is shown.

### Accesibility 
- All the textual content withing the tool uses dyslexia-friendly fonts (e.g., Arial, Comic Sans)
- The algorithmic visualization have incorparted dynamic dimension resizing and high contrast-ration for color-blind users
---

##  Contributions and Development

As we make the implementation open-source we allow future reserachers, educators or even students to build on top of our implemnentation with the aim of enhancing learning even 
further in the field of Computer Science.

Future improvements may include:
- complexity and correctness analysys of graph algorithms explained visually and inteactively
- empirical study to tell whether our tool it is really efficient in enhancing learning 

Limitations of the project:
- restricted selction of topics covered (only 7 graph algorithms and 3 data structures)
- desktop only usage 

---

##  Contact

If you have questions or want to collaborate, feel free to open an issue or reach out via GitHub.
