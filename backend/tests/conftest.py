import os
import tempfile
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import get_db
from app.models import Base

@pytest.fixture(scope="session")
def _test_db_url():
    fd, path = tempfile.mkstemp(prefix="testdb_", suffix=".sqlite3")
    os.close(fd)
    url = f"sqlite+pysqlite:///{path}"
    try:
        yield url
    finally:
        try:
            os.remove(path)
        except FileNotFoundError:
            pass

@pytest.fixture(scope="session")
def _engine(_test_db_url):
    engine = create_engine(_test_db_url, future=True)
    Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()

@pytest.fixture()
def db_session(_engine):
    TestingSessionLocal = sessionmaker(bind=_engine, autoflush=False, autocommit=False)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

@app.dependency_overrides[get_db]
def _override_get_db():
    from app.database import SessionLocal
    raise RuntimeError("Use client fixture that injects session") 

@pytest.fixture()
def client(db_session, monkeypatch):
    def _get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _get_db
    with TestClient(app) as c:
        db_session.execute(text("SELECT 1"))
        yield c
    app.dependency_overrides.clear()
