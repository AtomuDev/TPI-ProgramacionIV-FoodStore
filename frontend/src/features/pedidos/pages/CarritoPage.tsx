import { Link, useNavigate } from 'react-router-dom'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { formatearPrecio } from '../../../shared/utils/formato'
import { useCartStore } from '../../../store/cartStore'

export function CarritoPage() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.total())
  const quitar = useCartStore((state) => state.quitar)
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad)
  const vaciar = useCartStore((state) => state.vaciar)

  if (items.length === 0) {
    return (
      <EstadoVacio titulo="Tu carrito está vacío" descripcion="Agregá productos desde el catálogo.">
        <Link to="/" className="font-medium text-orange-600 hover:underline">
          Ir al catálogo
        </Link>
      </EstadoVacio>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Carrito</h1>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Card key={item.producto_id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">{item.nombre}</p>
              <p className="text-sm text-slate-500">{formatearPrecio(item.precio_unitario)} c/u</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variante="secondary"
                pequeno
                aria-label={`Restar uno de ${item.nombre}`}
                onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
              >
                −
              </Button>
              <span className="w-8 text-center font-medium">{item.cantidad}</span>
              <Button
                variante="secondary"
                pequeno
                aria-label={`Sumar uno de ${item.nombre}`}
                onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
              >
                +
              </Button>
            </div>
            <p className="w-28 text-right font-semibold text-slate-900">
              {formatearPrecio(item.precio_unitario * item.cantidad)}
            </p>
            <Button variante="danger" pequeno onClick={() => quitar(item.producto_id)}>
              Quitar
            </Button>
          </Card>
        ))}
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg text-slate-700">
          Total: <span className="text-2xl font-bold text-slate-900">{formatearPrecio(total)}</span>
        </p>
        <div className="flex gap-3">
          <Button variante="secondary" onClick={vaciar}>
            Vaciar carrito
          </Button>
          <Button onClick={() => navigate('/checkout')}>Confirmar pedido</Button>
        </div>
      </Card>
    </div>
  )
}
