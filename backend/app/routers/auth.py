from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import get_db
import models
import schemas
from security import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/signup", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED
)
def signup(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    # Explicit password length check to return friendly error
    if len(payload.password) < 6:
        raise HTTPException(
            status_code=400, detail="Password must be at least 6 characters."
        )
    exists = db.scalar(select(models.User).where(models.User.email == payload.email))
    if exists:
        raise HTTPException(status_code=400, detail="Email already registered.")
    user = models.User(
        email=payload.email, hashed_password=hash_password(payload.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/signin", response_model=schemas.Token)
def signin(payload: schemas.SignIn, db: Session = Depends(get_db)):
    user = db.scalar(select(models.User).where(models.User.email == payload.email))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = create_access_token(sub=user.email)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserOut)
def me(authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token.")
    email = decode_token(authorization.split(" ", 1)[1])
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token.")
    user = db.scalar(select(models.User).where(models.User.email == email))
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user
