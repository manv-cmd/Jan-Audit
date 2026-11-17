# JAN Audit — Backend API

FastAPI backend for the **JAN Audit** social audit / public works monitoring portal.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI 0.115 |
| ASGI server | Uvicorn |
| ORM | SQLAlchemy 2 |
| Database | SQLite (file: `jan_audit.db`) |
| Auth | JWT via `python-jose` + `passlib[bcrypt]` |
| Validation | Pydantic v2 |

---

## Quick start

### 1 — Prerequisites

- Python **3.11+**

### 2 — Install

```bash
cd social-audit-portal
pip install -r requirements.txt
```

Or double-click **`start.bat`** (Windows) — it installs and launches in one step.

### 3 — Run

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The first run auto-creates `jan_audit.db` and seeds demo users + sample data.

| URL | Purpose |
|---|---|
| `http://127.0.0.1:8000/docs` | Interactive Swagger UI |
| `http://127.0.0.1:8000/redoc` | ReDoc documentation |
| `http://127.0.0.1:8000/health` | Health check |

---

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Login → returns Bearer token |

### Projects
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/projects` | Any user | List all projects |
| GET | `/projects/{id}` | Any user | Get a single project |
| POST | `/projects` | **Admin** | Create a project |
| PUT | `/projects/{id}` | **Admin** | Update a project |
| DELETE | `/projects/{id}` | **Admin** | Delete project (blocked if findings exist) |

### Findings
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/findings` | Any user | List all findings |
| GET | `/findings/{id}` | Any user | Get a single finding |
| POST | `/findings` | Auditor / Admin | Record a finding |
| DELETE | `/findings/{id}` | Auditor / Admin | Remove a finding |

---

## Demo credentials

All three demo accounts use the password **`Admin@123`**.

| Email | Role |
|---|---|
| `admin@janaudit.in` | Administrator |
| `auditor@janaudit.in` | Auditor |
| `official@janaudit.in` | Official (read-only) |

---

## Project structure

```
social-audit-portal/
├── main.py               ← FastAPI app + CORS + router registration
├── requirements.txt
├── .env                  ← SECRET_KEY, DB URL, token TTL
├── start.bat             ← One-click Windows launcher
├── start.sh              ← Unix launcher
└── app/
    ├── __init__.py
    ├── database.py       ← SQLAlchemy engine + get_db() dependency
    ├── models.py         ← ORM models: User, Project, Finding
    ├── schemas.py        ← Pydantic request/response schemas
    ├── dependencies.py   ← Bearer token resolver, role guards
    ├── id_gen.py         ← Sequential ID generator (JA-YYYY-NNN)
    ├── seed.py           ← Demo seed data (auto-runs on first start)
    ├── core/
    │   ├── config.py     ← Settings from .env
    │   └── security.py   ← JWT + bcrypt helpers
    └── routers/
        ├── auth.py       ← POST /auth/login
        ├── projects.py   ← /projects CRUD
        └── findings.py   ← /findings CRUD
```

---

## Connecting the frontend

In the frontend repo (`JAN-Audit-main/js/config.js`) `DATA_MODE` is already set to `"api"`:

```js
window.JanAuditConfig = Object.freeze({
  API_BASE_URL: "http://127.0.0.1:8000",
  DATA_MODE: "api",          // ← live backend mode
  STORAGE_PREFIX: "jan-audit:"
});
```

Open the HTML files directly in a browser **after** the backend is running, or serve them with any static server:

```bash
# From the JAN-Audit-main folder
python -m http.server 5500
```

Then open `http://localhost:5500/login.html`.

---

## Environment variables (`.env`)

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | (required) | 32-byte hex secret for JWT signing |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `480` | Token TTL (8 hours) |
| `DATABASE_URL` | `sqlite:///./jan_audit.db` | SQLAlchemy connection string |
| `ALLOWED_ORIGINS` | `*` | CORS origins (comma-separated or `*`) |

> **Important**: Generate a fresh `SECRET_KEY` for production:
> ```bash
> python -c "import secrets; print(secrets.token_hex(32))"
> ```
