import { useState } from 'react'
import { Link } from 'react-router-dom'
import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { Paginacion } from '../../../shared/components/Paginacion'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Alerta } from '../../../shared/ui/Alerta'
import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Modal } from '../../../shared/ui/Modal'
import { formatearFecha, formatearPrecio } from '../../../shared/utils/formato'
import { PedidoDetalle } from '../components/PedidoDetalle'
import { useCancelarPedido, usePedidos } from '../hooks/usePedidos'

const LIMITE = 10

export function MisPedidosPage() {
  const [pagina, setPagina] = useState(0)
  const [detalleId, setDetalleId] = useState<number | null>(null)

  const pedidos = usePedidos({ skip: pagina * LIMITE, limit: LIMITE })
  const cancelar = useCancelarPedido()

  const pedidoDetalle = pedidos.data?.items.find((pedido) => pedido.id === detalleId)
  const totalPaginas = Math.ceil((pedidos.data?.total ?? 0) / LIMITE)

  const pedirCancelacion = (id: number) => {
    if (window.confirm(`¿Cancelar el pedido #${id}?`)) {
      cancelar.mutate(id)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Mis pedidos</h1>

      {cancelar.isError && <Alerta>{handleApiError(cancelar.error)}</Alerta>}

      {pedidos.isPending ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, indice) => (
            <Skeleton key={indice} className="h-20 w-full" />
          ))}
        </div>
      ) : pedidos.isError ? (
        <EstadoError mensaje={handleApiError(pedidos.error)} onReintentar={() => void pedidos.refetch()} />
      ) : pedidos.data.items.length === 0 ? (
        <EstadoVacio titulo="Todavía no hiciste pedidos" descripcion="Cuando confirmes uno, lo vas a ver acá.">
          <Link to="/" className="font-medium text-orange-600 hover:underline">
            Ir al catálogo
          </Link>
        </EstadoVacio>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {pedidos.data.items.map((pedido) => (
              <Card key={pedido.id} className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">Pedido #{pedido.id}</p>
                  <p className="text-sm text-slate-500">{formatearFecha(pedido.created_at)}</p>
                </div>
                <BadgeEstado estado={pedido.estado} />
                <p className="font-semibold text-slate-900">{formatearPrecio(pedido.total)}</p>
                <div className="flex gap-2">
                  <Button variante="secondary" pequeno onClick={() => setDetalleId(pedido.id)}>
                    Ver detalle
                  </Button>
                  {pedido.estado === 'PENDIENTE' && (
                    <Button
                      variante="danger"
                      pequeno
                      disabled={cancelar.isPending}
                      onClick={() => pedirCancelacion(pedido.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </>
      )}

      <Modal
        abierto={pedidoDetalle !== undefined}
        titulo={`Pedido #${detalleId ?? ''}`}
        onCerrar={() => setDetalleId(null)}
      >
        {pedidoDetalle && <PedidoDetalle pedido={pedidoDetalle} />}
      </Modal>
    </div>
  )
}
