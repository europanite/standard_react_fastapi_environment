FROM python:3.12-slim AS backend-base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# psycopg(binaries)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY app/ /app/
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

RUN echo "== after base copy ==" && ls -la

RUN echo "== before dev copy ==" && ls -la
COPY requirements.test.txt .
RUN echo "== after dev copy ==" && ls -l
COPY requirements.test.txt ./

# uvicorn

# ===== pytest =====
FROM backend-base AS backend-test
RUN pip install --no-cache-dir -r requirements.test.txt