from typing import Generic, Optional, Sequence, TypeVar
from sqlalchemy import inspect
from sqlmodel import Session, SQLModel, select

T = TypeVar("T", bound=SQLModel)


class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: type[T]) -> None:
        self.session = session
        self.model = model

    def get_by_id(self, id: int) -> Optional[T]:
        return self.session.get(self.model, id)

    def get_all(self, skip: int = 0, limit: Optional[int] = None) -> Sequence[T]:
        consulta = select(self.model).order_by(*inspect(self.model).primary_key).offset(skip)
        if limit is not None:
            consulta = consulta.limit(limit)
        return self.session.exec(consulta).all()

    def add(self, obj: T) -> T:
        self.session.add(obj)
        self.session.flush()
        self.session.refresh(obj)
        return obj

    def delete(self, obj: T) -> None:
        self.session.delete(obj)
        self.session.flush()
