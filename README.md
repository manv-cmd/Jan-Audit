# JAN Audit — Social Audit & Public Works Monitoring Portal

A comprehensive fullstack platform for public works monitoring, social auditing, findings management, and verification reporting.

---

## Architecture Overview

```text
Jan-Audit/
├── frontend/                   # Client-side web application
│   ├── assets/                 # Icons, images, and logos
│   ├── css/                    # Modular stylesheets (dashboard, responsive, theme)
│   ├── js/                     # Application logic, auth, API middleware, Chart.js
│   ├── index.html              # Landing redirect
│   ├── login.html              # User authentication portal
│   ├── dashboard.html          # Main auditor/admin overview & metrics
│   ├── projects.html           # Works & project records
│   ├── project-details.html    # Specific project inspection view
│   ├── findings.html           # Audit observations, issues, and evidence
│   ├── reports.html            # Public summary and audit reports
│   └── profile.html            # User account settings
│
└── backend/                    # FastAPI application
    ├── app/
    │   ├── core/               # Configuration & JWT security
    │   ├── routers/            # Auth, projects, and findings endpoints
    │   ├── database.py         # SQLAlchemy SQLite engine session
    │   ├── models.py           # Database entities (User, Project, Finding)
    │   ├── schemas.py          # Pydantic request/response schemas
    │   ├── seed.py             # Default initial data seed
    │   └── id_gen.py           # Custom identifier generators
    ├── main.py                 # ASGI entry point & CORS configuration
    ├── requirements.txt        # Python package dependencies
    ├── start.bat               # Windows quick-launch script
    ├── start.sh                # Linux/macOS quick-launch script
    └── .env.example            # Template environment variables
```

---

## Quick Start

### 1. Backend Setup

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables (optional, defaults provided):
   ```bash
   cp .env.example .env
   ```
5. Start the API server:
   ```bash
   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   * API endpoints will be accessible at `http://127.0.0.1:8000`
   * Interactive API documentation: `http://127.0.0.1:8000/docs`

> **Windows Quickstart:** You can simply double-click [`backend/start.bat`](backend/start.bat) to install dependencies and run the server automatically.

### 2. Frontend Setup

1. In another terminal, navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Serve the frontend with any static HTTP server (e.g., Python):
   ```bash
   python -m http.server 5500
   ```
3. Open `http://127.0.0.1:5500` or open `frontend/login.html` directly in your browser.

---

## Default Credentials

* **Administrator:**
  * Email: `admin@janaudit.in`
  * Password: `Admin@123`
* **Auditor:**
  * Email: `auditor@janaudit.in`
  * Password: `Auditor@123`

---

## Tech Stack

* **Frontend:** Vanilla HTML5, Modern Modular CSS, JavaScript (ES6+), Chart.js, Lucide Icons.
* **Backend:** FastAPI (Python 3.11+), Uvicorn, SQLAlchemy 2, Pydantic v2.
* **Database:** SQLite (default local file) / configurable via `DATABASE_URL`.
* **Security:** JWT (JSON Web Tokens) with password hashing via passlib bcrypt.
