FROM python:3.12-slim AS backend-base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# psycopg(binaries)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ /app/

# uvicorn

# ===== pytest =====
FROM backend-base AS backend-test
COPY requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements-dev.txt