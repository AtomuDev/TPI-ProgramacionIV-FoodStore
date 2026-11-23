import { Link } from 'react-router-dom'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { Card } from '../../../shared/ui/Card'
import { formatearPrecio } from '../../../shared/utils/formato'
import { useCartStore } from '../../../store/cartStore'
import { CheckoutForm } from '../components/CheckoutForm'

export function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.total())

  if (items.length === 0) {
    return (
      <EstadoVacio titulo="No hay nada para confirmar" descripcion="Tu carrito está vacío.">
        <Link to="/" className="font-medium text-orange-600 hover:underline">
          Ir al catálogo
        </Link>
      </EstadoVacio>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Confirmar pedido</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Datos de entrega</h2>
          <CheckoutForm />
        </Card>
        <Card className="h-fit">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Resumen</h2>
          <ul className="flex flex-col gap-2 text-sm text-slate-700">
            {items.map((item) => (
              <li key={item.producto_id} className="flex justify-between gap-4">
                <span>
                  {item.cantidad} × {item.nombre}
                </span>
                <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
            <span>Total</span>
            <span>{formatearPrecio(total)}</span>
          </p>
        </Card>
      </div>
    </div>
  )
}
