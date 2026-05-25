import datetime as dt
import os

import bcrypt
from jose import jwt

SECRET_KEY = os.getenv("AUTH_SECRET", "dev-secret")
ALGO = "HS256"
EXPIRE_MIN = int(os.getenv("AUTH_EXPIRE_MINUTES", "60"))


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        return False


def create_access_token(sub: str) -> str:
    now = dt.datetime.now(dt.UTC)
    payload = {"sub": sub, "iat": now, "exp": now + dt.timedelta(minutes=EXPIRE_MIN)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGO)


def decode_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
        return payload.get("sub")
    except Exception:
        return None
