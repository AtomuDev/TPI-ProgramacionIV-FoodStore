from typing import Optional, Sequence
from sqlalchemy import ColumnElement
from sqlmodel import Session, col, func, select
from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def search(
        self,
        search: Optional[str] = None,
        categoria_id: Optional[int] = None,
        disponible: Optional[bool] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[Sequence[Producto], int]:
        condiciones: list[ColumnElement[bool]] = [col(Producto.activo).is_(True)]
        if search:
            condiciones.append(col(Producto.nombre).ilike(f"%{search}%"))
        if categoria_id is not None:
            condiciones.append(col(Producto.categoria_id) == categoria_id)
        if disponible is not None:
            condiciones.append(col(Producto.disponible) == disponible)

        total = self.session.exec(
            select(func.count()).select_from(Producto).where(*condiciones)
        ).one()
        productos = self.session.exec(
            select(Producto)
            .where(*condiciones)
            .order_by(col(Producto.id))
            .offset(skip)
            .limit(limit)
        ).all()
        return productos, total
