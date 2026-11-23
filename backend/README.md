# Food Store: Backend

API REST de Food Store construida con FastAPI y SQLModel sobre PostgreSQL. La guía completa de instalación, ejecución y variables de entorno está en el [README de la raíz](../README.md).

## Ejecución rápida

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # Windows: copy .env.example .env
python -m app.db.seed
uvicorn app.main:app --reload
```

Documentación interactiva en `http://localhost:8000/docs` y `http://localhost:8000/redoc`. Usuario del seed: `admin` / `Admin1234!`.

## Estructura

```
app/
├── core/
│   ├── base_repository.py  BaseRepository[T]: get_by_id, get_all, add y delete
│   ├── config.py           Settings (pydantic-settings) leídas del .env
│   ├── database.py         engine, create_all_tables y session_factory
│   ├── deps.py             get_current_user, get_current_active_user y require_role
│   ├── security.py         Hash bcrypt y JWT
│   └── unit_of_work.py     UnitOfWork base: commit, rollback y close en __exit__
├── db/
│   └── seed.py             Administrador, categorías y productos (idempotente)
├── modules/
│   ├── auth/               router, service y schemas (usa el modelo Usuario)
│   ├── categorias/         misma cadena de archivos que usuarios
│   ├── pedidos/            misma cadena; el service concentra RN-01 a RN-06 y el mapa de transiciones de estados
│   ├── productos/          misma cadena de archivos que usuarios
│   └── usuarios/           models, schemas, repository, unit_of_work, service y router
└── main.py                 Crea la app, registra CORS con credenciales e incluye los routers con el prefijo /api/v1
```

El flujo de dependencias es unidireccional: **Router → Service → Unit of Work → Repository → Model**. Los schemas (SQLModel sin `table=True`) definen la entrada y la salida de cada endpoint.
