# Food Store: Frontend

Aplicación web de Food Store construida con React, TypeScript (strict), Vite y Tailwind CSS. La guía completa de instalación, ejecución y variables de entorno está en el [README de la raíz](../README.md).

## Ejecución rápida

```bash
pnpm install
cp .env.example .env    # Windows: copy .env.example .env
pnpm dev                # http://localhost:5173
```

`pnpm build` verifica los tipos y genera el build de producción. Requiere el backend corriendo en `http://localhost:8000`.

## Estructura

```
src/
├── features/         Un dominio por carpeta, cada una con pages, components, hooks, api y types
│   ├── auth/         Login, registro y pantalla de sin permiso
│   ├── categorias/   ABM de categorías
│   ├── pedidos/      Carrito, checkout, mis pedidos, pedidos admin y resumen
│   ├── productos/    Catálogo y ABM de productos (con stock y disponibilidad)
│   └── usuarios/     Gestión de usuarios (activar y desactivar)
├── routes/           AppRouter y ProtectedRoute
├── shared/
│   ├── api/          axiosInstance (withCredentials + interceptor de 401), handleApiError y queryClient
│   ├── components/   EstadoError, EstadoVacio, Paginacion, Skeleton y TablaDatos
│   ├── layout/       MainLayout y Navbar
│   ├── ui/           Alerta, BadgeEstado, Button, Card, Input, Modal y Select
│   └── utils/        Formato de precios y fechas, helpers de formularios
├── store/            authStore y cartStore (Zustand con persist)
├── App.tsx           Llama a checkSession al montar y renderiza AppRouter
└── main.tsx          QueryClientProvider
```

## Pantallas

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/login`, `/register` | Inicio de sesión y registro | Público |
| `/` | Catálogo con búsqueda, filtro por categoría y paginación | Público |
| `/carrito` | Carrito (persiste al recargar) | Público |
| `/checkout` | Confirmar pedido | Sesión |
| `/mis-pedidos` | Pedidos propios con detalle y cancelación en `PENDIENTE` | Sesión |
| `/admin/resumen` | Indicadores del negocio | admin |
| `/admin/categorias`, `/admin/productos` | ABM, con cambio de stock y disponibilidad | admin |
| `/admin/pedidos` | Pedidos con filtro por estado y cambio de estado | admin |
| `/admin/usuarios` | Activar y desactivar usuarios | admin |
| `/unauthorized` | Sin permiso | Público |

## Estado

- **TanStack Query** gestiona los datos del servidor (catálogo, pedidos, usuarios y resumen) con invalidación en cada mutación.
- **Zustand** gestiona el estado del cliente: `authStore` (persiste solo el usuario, nunca el token) y `cartStore`.
- La única llamada dentro de un `useEffect` es `checkSession`, al montar la aplicación.
