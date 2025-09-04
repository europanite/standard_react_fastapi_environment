# ［standard_react_fastapi_environment］(https://github.com/europanite/standard_react_fastapi_environment) 

**full-stack development environment** using:

- **FastAPI** for the backend API
- **PostgreSQL** as the database
- **React Native (Expo Web)** for the frontend UI
- **Docker Compose** to orchestrate all services

---

## 📦 Services

- **backend**: FastAPI + SQLAlchemy  
  - Port: `8000`  
  - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

- **frontend**: React Native (Expo Web)  
  - Port: `8081`  
  - Web UI: [http://localhost:8081](http://localhost:8081)

- **db**: PostgreSQL  
  - Port: `5432`  
  - Data is persisted in `./db_data`

---

## 🚀 Getting Started

Build and start all services:

```bash
# First-time build
docker compose up --build

# Subsequent runs
docker compose up
```

Then open:

- Backend API: http://localhost:8000/docs
- Frontend UI: http://localhost:8081

---

# Features

- Full CRUD: Create, Read, Update, Delete records (id, title)
- REST API with Swagger UI (/docs)
- Hot Reloading: Code changes in backend and frontend are reflected immediately in containers

---
# License
- Apache License 2.0