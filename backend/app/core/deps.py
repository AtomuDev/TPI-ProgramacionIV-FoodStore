from fastapi import Depends, HTTPException, Request, status
from sqlmodel import select
from app.core.database import session_factory
from app.core.security import decode_access_token
from app.modules.usuarios.models import Usuario


def get_current_user(request: Request) -> Usuario:
    no_autenticado = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="No autenticado"
    )
    token = request.cookies.get("access_token")
    if not token:
        raise no_autenticado
    payload = decode_access_token(token)
    if payload is None or not payload.get("sub"):
        raise no_autenticado
    with session_factory() as session:
        usuario = session.exec(
            select(Usuario).where(Usuario.username == payload["sub"])
        ).first()
    if usuario is None:
        raise no_autenticado
    return usuario


def get_current_active_user(usuario: Usuario = Depends(get_current_user)) -> Usuario:
    if usuario.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )
    return usuario


def require_role(roles: list[str]):
    def verificar_rol(usuario: Usuario = Depends(get_current_active_user)) -> Usuario:
        if usuario.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tenés permisos para realizar esta acción",
            )
        return usuario

    return verificar_rol
