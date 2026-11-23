import { useCartStore } from '../../../store/cartStore'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { formatearPrecio } from '../../../shared/utils/formato'
import type { Producto } from '../types/productos'

export function ProductoCard({ producto }: { producto: Producto }) {
  const agregar = useCartStore((state) => state.agregar)
  const sinStock = !producto.disponible || producto.stock <= 0

  return (
    <Card className="flex flex-col gap-3">
      {producto.imagen_url ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="h-40 w-full rounded-md object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-md bg-slate-100 text-sm text-slate-400">
          Sin imagen
        </div>
      )}
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase text-orange-600">{producto.categoria.nombre}</p>
        <h3 className="font-semibold text-slate-900">{producto.nombre}</h3>
        {producto.descripcion && <p className="text-sm text-slate-500">{producto.descripcion}</p>}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">{formatearPrecio(producto.precio_base)}</span>
        <span className="text-xs text-slate-500">{sinStock ? 'Sin stock' : `Stock: ${producto.stock}`}</span>
      </div>
      <Button disabled={sinStock} onClick={() => agregar(producto)}>
        Agregar al carrito
      </Button>
    </Card>
  )
}
