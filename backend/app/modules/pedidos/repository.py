from datetime import datetime
from typing import Optional, Sequence
from sqlmodel import Session, col, func, select
from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def list_by_usuario(
        self, usuario_id: int, estado: Optional[str], skip: int, limit: int
    ) -> tuple[Sequence[Pedido], int]:
        return self._paginar([Pedido.usuario_id == usuario_id], estado, skip, limit)

    def list_all(
        self, estado: Optional[str], skip: int, limit: int
    ) -> tuple[Sequence[Pedido], int]:
        return self._paginar([], estado, skip, limit)

    def count_by_estado(self) -> dict[str, int]:
        filas = self.session.exec(
            select(Pedido.estado, func.count()).group_by(Pedido.estado)
        ).all()
        return {estado: cantidad for estado, cantidad in filas}

    def count_desde(self, desde: datetime) -> int:
        return self.session.exec(
            select(func.count()).select_from(Pedido).where(Pedido.created_at >= desde)
        ).one()

    def sum_total_entregados(self) -> float:
        total = self.session.exec(
            select(func.coalesce(func.sum(Pedido.total), 0.0)).where(
                Pedido.estado == "ENTREGADO"
            )
        ).one()
        return round(float(total), 2)

    def _paginar(
        self, condiciones: list, estado: Optional[str], skip: int, limit: int
    ) -> tuple[Sequence[Pedido], int]:
        if estado:
            condiciones.append(Pedido.estado == estado)
        total = self.session.exec(
            select(func.count()).select_from(Pedido).where(*condiciones)
        ).one()
        pedidos = self.session.exec(
            select(Pedido)
            .where(*condiciones)
            .order_by(col(Pedido.id).desc())
            .offset(skip)
            .limit(limit)
        ).all()
        return pedidos, total
