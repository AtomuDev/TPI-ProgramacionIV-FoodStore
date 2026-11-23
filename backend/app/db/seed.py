from sqlmodel import Session, select
from app.core.database import create_all_tables, session_factory
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario

CATEGORIAS = {
    "Hamburguesas": "Hamburguesas artesanales con papas",
    "Pizzas": "Pizzas a la piedra",
    "Bebidas": "Gaseosas, aguas y cervezas",
    "Postres": "Dulces para cerrar la comida",
}

PRODUCTOS = [
    ("Hamburguesa Clásica", "Carne, lechuga, tomate y queso", 6500, 30, "Hamburguesas"),
    ("Hamburguesa Doble Cheddar", "Doble carne con cheddar y panceta", 8200, 25, "Hamburguesas"),
    ("Hamburguesa Veggie", "Medallón de lentejas con rúcula", 6900, 20, "Hamburguesas"),
    ("Pizza Muzzarella", "Salsa de tomate y muzzarella", 7800, 15, "Pizzas"),
    ("Pizza Napolitana", "Muzzarella, tomate fresco y ajo", 8900, 15, "Pizzas"),
    ("Gaseosa Cola 500 ml", "Bebida cola helada", 1800, 50, "Bebidas"),
    ("Agua Mineral 500 ml", "Sin gas", 1200, 60, "Bebidas"),
    ("Flan con Dulce de Leche", "Flan casero con crema", 3200, 18, "Postres"),
    ("Brownie con Helado", "Brownie tibio con helado de crema", 4500, 12, "Postres"),
]


def seed() -> None:
    create_all_tables()
    with session_factory() as session:
        crear_admin(session)
        categorias = crear_categorias(session)
        crear_productos(session, categorias)
        session.commit()


def crear_admin(session: Session) -> None:
    existe = session.exec(select(Usuario).where(Usuario.username == "admin")).first()
    if existe is None:
        session.add(
            Usuario(
                username="admin",
                full_name="Administrador",
                email="admin@foodstore.com",
                hashed_password=hash_password("Admin1234!"),
                role="admin",
            )
        )


def crear_categorias(session: Session) -> dict[str, Categoria]:
    categorias: dict[str, Categoria] = {}
    for nombre, descripcion in CATEGORIAS.items():
        categoria = session.exec(
            select(Categoria).where(Categoria.nombre == nombre)
        ).first()
        if categoria is None:
            categoria = Categoria(nombre=nombre, descripcion=descripcion)
            session.add(categoria)
            session.flush()
        categorias[nombre] = categoria
    return categorias


def crear_productos(session: Session, categorias: dict[str, Categoria]) -> None:
    for nombre, descripcion, precio, stock, categoria in PRODUCTOS:
        existe = session.exec(select(Producto).where(Producto.nombre == nombre)).first()
        if existe is None:
            session.add(
                Producto(
                    nombre=nombre,
                    descripcion=descripcion,
                    precio_base=precio,
                    stock=stock,
                    categoria_id=categorias[categoria].id,
                )
            )


if __name__ == "__main__":
    seed()
    print("Seed ejecutado correctamente")
