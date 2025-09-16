from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/items", tags=["items"])


@router.post("", response_model=schemas.ItemOut, status_code=status.HTTP_201_CREATED)
def create_item(payload: schemas.ItemCreate, db: Session = Depends(get_db)):
    item = models.Item(title=payload.title)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("", response_model=List[schemas.ItemOut])
def list_items(
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    q: str | None = None,
):
    stmt = select(models.Item)
    if q:
        stmt = stmt.where(models.Item.title.ilike(f"%{q}%"))
    stmt = stmt.order_by(models.Item.id.desc()).limit(limit).offset(offset)
    return db.scalars(stmt).all()


@router.get("/{item_id}", response_model=schemas.ItemOut)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(models.Item, item_id)
    if not item:
        raise HTTPException(404, "Item not found")
    return item


@router.put("/{item_id}", response_model=schemas.ItemOut)
def update_item(
    item_id: int, payload: schemas.ItemUpdate, db: Session = Depends(get_db)
):
    item = db.get(models.Item, item_id)
    if not item:
        raise HTTPException(404, "Item not found")
    item.title = payload.title
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(models.Item, item_id)
    if not item:
        raise HTTPException(404, "Item not found")
    db.delete(item)
    db.commit()
    return None
