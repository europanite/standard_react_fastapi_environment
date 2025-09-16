from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer


class Base(DeclarativeBase):
    pass


class Item(Base):
    __tablename__ = "items"
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )  # auto increment
    title: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
