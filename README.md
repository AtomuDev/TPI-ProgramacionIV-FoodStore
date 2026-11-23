# Food Store

Sistema de pedidos de comida. Trabajo Práctico Integrador de **Programación 4**, Tecnicatura Universitaria en Programación a Distancia (UTN).

Los clientes se registran, recorren el catálogo, arman un carrito y confirman un pedido indicando la dirección de entrega y la forma de pago (efectivo o transferencia). El negocio administra categorías, productos, stock, pedidos y usuarios desde un panel de administración.

- **Alumno:** Abel Tomás Romero
- **Repositorio:** 
- **Video de demostración:** 

## Tecnologías

| | Backend | Frontend |
|---|---|---|
| Lenguaje | Python 3.11 a 3.13 | TypeScript 5.9 (strict) |
| Framework | FastAPI + SQLModel | React 19 + Vite 7 + Tailwind CSS 4 |
| Datos | PostgreSQL 15+ (SQLite opcional en desarrollo) | TanStack Query, Form y Table; Zustand; Axios |
| Seguridad | JWT en cookie HttpOnly, bcrypt, roles | React Router 7 con rutas protegidas por rol |

## Requisitos

- Python 3.11 a 3.13 (SQLModel 0.0.22 no funciona con 3.14)
- PostgreSQL 15 o superior
- Node.js 20.19 o superior
- pnpm 9 o superior (`npm install -g pnpm`)

## Estructura del proyecto

```
TPI-ProgramacionIV-FoodStore/
├── backend/                API REST (FastAPI + SQLModel)
│   ├── app/
│   │   ├── core/           Configuración, base de datos, seguridad, dependencias, Unit of Work base y repositorio base
│   │   ├── db/seed.py      Carga inicial idempotente
│   │   ├── modules/        Un paquete por dominio: auth, categorias, pedidos, productos y usuarios  
│   │   │                   (models, repository, router, schemas, service y unit of work)
│   │   └── main.py         Aplicación, CORS con credenciales y routers bajo /api/v1
│   ├── requirements.txt    Dependencias con versiones fijadas
│   └── .env.example
├── frontend/               Aplicación web (React + TypeScript)
│   ├── src/
│   │   ├── features/       auth, categorias, pedidos, productos y usuarios
│   │   ├── routes/         AppRouter y ProtectedRoute
│   │   ├── shared/         Axios, manejo de errores, componentes de UI y layout
│   │   └── store/          authStore y cartStore (Zustand)
│   ├── package.json y pnpm-lock.yaml
│   └── .env.example
├── .gitignore
└── README.md
```

## Puesta en marcha

Se necesitan dos terminales: una para el backend y otra para el frontend. Primero hay que dejar el backend funcionando.

### 1. Base de datos

Crear una base vacía en PostgreSQL:

```sql
CREATE DATABASE foodstore_db;
```

Las tablas se crean solas al ejecutar el seed o al iniciar la API.

### 2. Backend

Desde la carpeta `backend/`:

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # Windows: copy .env.example .env
```

Editar `backend/.env` y completar `DATABASE_URL` con el usuario y la contraseña de PostgreSQL (ver [variables de entorno](#variables-de-entorno)). Luego:

```bash
python -m app.db.seed
uvicorn app.main:app --reload
```

La API queda en `http://localhost:8000/api/v1`. La documentación interactiva está en `http://localhost:8000/docs` y en `http://localhost:8000/redoc`.

### 3. Frontend

Desde la carpeta `frontend/`:

```bash
pnpm install
cp .env.example .env             # Windows: copy .env.example .env
pnpm dev
```

La aplicación queda en `http://localhost:5173`. Para verificar los tipos y generar el build de producción: `pnpm build` (y `pnpm preview` para servirlo).

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a la base de datos | `postgresql+psycopg2://postgres:TU_PASSWORD@localhost:5432/foodstore_db` (desarrollo: `sqlite:///./foodstore.db`) |
| `SECRET_KEY` | Firma del JWT, mínimo 32 caracteres | `cambiar-esta-clave-de-al-menos-32-caracteres` |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token y de la cookie | `30` |
| `FRONTEND_ORIGIN` | Origen permitido en CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:8000/api/v1` |

## Usuario administrador (seed)

`python -m app.db.seed` es idempotente (se puede ejecutar varias veces sin duplicar datos) y carga:

- Usuario administrador: **`admin`** / **`Admin1234!`** (rol `admin`)
- 4 categorías y 9 productos con stock

Los clientes (rol `user`) se crean desde la pantalla de registro.

## Cómo probarlo

1. Entrar a `http://localhost:5173`, registrarse como cliente, agregar productos al carrito y confirmar el pedido en el checkout.
2. En **Mis pedidos** se ve el detalle y se puede cancelar mientras esté en `PENDIENTE` (el stock se restituye).
3. Iniciar sesión como `admin`: el panel permite ver el resumen, administrar categorías, productos (incluido stock y disponibilidad), usuarios y avanzar o cancelar pedidos.

## Arquitectura y reglas de negocio

**Backend.** Cada dominio sigue la cadena Router → Service → Unit of Work → Repository → Model. El Service abre `with self.uow as uow:`, aplica las reglas y devuelve el schema de salida dentro del bloque. El commit y el rollback ocurren únicamente en el `__exit__` del Unit of Work: ningún Service ni Router llama a `session.commit()`. Las respuestas nunca exponen modelos de tabla, solo schemas.

**Sesión.** El login entrega el JWT en la cookie HttpOnly `access_token` (expira a los 30 minutos). El frontend nunca lee ni guarda el token; solo persiste en `localStorage` los datos del usuario y el carrito. La autorización por rol se aplica en el backend con `require_role`.

**Pedidos.** La creación es transaccional: valida cada producto (activo, disponible y con stock), descuenta el stock y copia `nombre_producto` y `precio_unitario` en cada línea, de modo que los precios no cambian después de creado el pedido. Si algo falla, no se persiste nada. Los pedidos no se borran: se cancelan, y la cancelación restituye el stock.

| Estado | Transiciones válidas | Quién |
|---|---|---|
| `PENDIENTE` | `EN_PREPARACION`, `CANCELADO` | admin; el cliente dueño solo puede cancelar |
| `EN_PREPARACION` | `ENTREGADO`, `CANCELADO` | admin |
| `ENTREGADO`, `CANCELADO` | ninguna (estados terminales) | — |

**Frontend.** Organizado por features (`pages`, `components`, `hooks`, `api`, `types`). TanStack Query gestiona el estado del servidor (catálogo, pedidos, usuarios, resumen) con invalidación tras cada mutación; Zustand gestiona el estado del cliente (sesión y carrito). Axios usa `withCredentials` y un interceptor que limpia la sesión ante un 401 o una cuenta desactivada, y `ProtectedRoute` redirige según sesión y rol.

## API

Todos los endpoints están bajo `/api/v1` y documentados en `/docs` y `/redoc`.

| Módulo | Ruta base | Acceso |
|---|---|---|
| Auth | `/auth` (`register`, `token`, `logout`, `me`) | Público / sesión |
| Usuarios | `/admin/usuarios` (listar, `activar`, `desactivar`) | admin |
| Categorías | `/categorias` | Lectura pública, escritura admin |
| Productos | `/productos` (incluye `PATCH /{id}/stock`) | Lectura pública, escritura admin |
| Pedidos | `/pedidos` (`resumen`, `/{id}/estado`, `/{id}/cancelar`) | Sesión, dueño o admin |
