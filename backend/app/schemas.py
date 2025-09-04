from pydantic import BaseModel, Field

class ItemCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)

class ItemUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)

class ItemOut(BaseModel):
    id: int
    title: str
    class Config:
        from_attributes = True
