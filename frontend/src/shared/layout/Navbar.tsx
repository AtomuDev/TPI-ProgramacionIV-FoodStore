import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { Button } from '../ui/Button'

const ENLACES_ADMIN = [
  { to: '/admin/resumen', texto: 'Resumen' },
  { to: '/admin/categorias', texto: 'Categorías' },
  { to: '/admin/productos', texto: 'Productos' },
  { to: '/admin/pedidos', texto: 'Pedidos' },
  { to: '/admin/usuarios', texto: 'Usuarios' },
]

function claseEnlace({ isActive }: { isActive: boolean }): string {
  return `rounded-md px-3 py-1.5 text-sm font-medium ${
    isActive ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:bg-slate-100'
  }`
}

export function Navbar() {
  const navigate = useNavigate()
  const usuario = useAuthStore((state) => state.usuario)
  const logout = useAuthStore((state) => state.logout)
  const cantidadItems = useCartStore((state) =>
    state.items.reduce((suma, item) => suma + item.cantidad, 0),
  )

  const cerrarSesion = async () => {
    navigate('/login')
    await logout().catch(() => undefined)
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/" className="mr-4 text-xl font-bold text-orange-600">
            Food Store
          </Link>
          <NavLink to="/" end className={claseEnlace}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={claseEnlace}>
            Carrito{cantidadItems > 0 && ` (${cantidadItems})`}
          </NavLink>
          {usuario && (
            <NavLink to="/mis-pedidos" className={claseEnlace}>
              Mis pedidos
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {usuario ? (
            <>
              <span className="text-sm text-slate-600">
                {usuario.full_name}{' '}
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold uppercase text-slate-600">
                  {usuario.role}
                </span>
              </span>
              <Button variante="secondary" pequeno onClick={cerrarSesion}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-700 hover:underline">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>

      {usuario?.role === 'admin' && (
        <nav className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2">
            <span className="mr-2 text-xs font-semibold uppercase text-slate-500">Panel</span>
            {ENLACES_ADMIN.map((enlace) => (
              <NavLink key={enlace.to} to={enlace.to} className={claseEnlace}>
                {enlace.texto}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
