# Social Audit — Separated Frontend Auth & Middleware

## Frontend structure
- `index.html` — UI
- `auth.js` — registration, login, logout and JWT token storage
- `middleware.js` — frontend API interceptor/middleware
- `script.js` — dashboard, project CRUD and findings
- `style.css` — responsive styling

## Backend structure
- `main.py` — routes and application setup
- `auth.py` — backend JWT/password authentication
- `middleware.py` — backend request logging/timing
- `models.py` — SQLAlchemy models
- `schemas.py` — Pydantic schemas

## Frontend middleware
All protected API calls go through `apiRequest()` in `middleware.js`.
It automatically attaches `Authorization: Bearer <JWT>`, handles 401 errors, and measures request time.

## Run

```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Then open `frontend/index.html`. Swagger: http://127.0.0.1:8000/docs

1. Start the FastAPI backend.
2. Register a user from the frontend.
3. Login to receive a JWT.
4. frontend/middleware.js automatically attaches the token to protected API requests.
5. Backend auth.py validates the token.
6. Backend middleware.py logs requests and adds processing time.
7. Project CRUD and findings operate only for authenticated users.
