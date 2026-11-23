import { useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { Paginacion } from '../../../shared/components/Paginacion'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Alerta } from '../../../shared/ui/Alerta'
import { Modal } from '../../../shared/ui/Modal'
import { Select } from '../../../shared/ui/Select'
import { PedidoDetalle } from '../components/PedidoDetalle'
import { TablaPedidos } from '../components/TablaPedidos'
import { useCambiarEstadoPedido, usePedidos } from '../hooks/usePedidos'
import type { EstadoPedido, Pedido } from '../types/pedidos'
import { ESTADOS, ETIQUETA_ESTADO, esEstadoPedido } from '../utils/constantes'

const LIMITE = 10

export function AdminPedidosPage() {
  const [pagina, setPagina] = useState(0)
  const [estado, setEstado] = useState<EstadoPedido | undefined>(undefined)
  const [detalleId, setDetalleId] = useState<number | null>(null)

  const pedidos = usePedidos({ skip: pagina * LIMITE, limit: LIMITE, estado })
  const cambiarEstado = useCambiarEstadoPedido()

  const pedidoDetalle = pedidos.data?.items.find((pedido) => pedido.id === detalleId)
  const totalPaginas = Math.ceil((pedidos.data?.total ?? 0) / LIMITE)

  const filtrarPorEstado = (valor: string) => {
    setEstado(esEstadoPedido(valor) ? valor : undefined)
    setPagina(0)
  }

  const pedirCambio = (pedido: Pedido, nuevoEstado: EstadoPedido) => {
    if (nuevoEstado === 'CANCELADO' && !window.confirm(`¿Cancelar el pedido #${pedido.id}?`)) {
      return
    }
    cambiarEstado.mutate({ id: pedido.id, estado: nuevoEstado })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
        <div className="w-56">
          <Select label="Filtrar por estado" value={estado ?? ''} onChange={(e) => filtrarPorEstado(e.target.value)}>
            <option value="">Todos</option>
            {ESTADOS.map((opcion) => (
              <option key={opcion} value={opcion}>
                {ETIQUETA_ESTADO[opcion]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {cambiarEstado.isError && <Alerta>{handleApiError(cambiarEstado.error)}</Alerta>}

      {pedidos.isPending ? (
        <Skeleton className="h-64 w-full" />
      ) : pedidos.isError ? (
        <EstadoError mensaje={handleApiError(pedidos.error)} onReintentar={() => void pedidos.refetch()} />
      ) : (
        <>
          <TablaPedidos
            pedidos={pedidos.data.items}
            procesando={cambiarEstado.isPending}
            onVerDetalle={(pedido) => setDetalleId(pedido.id)}
            onCambiarEstado={pedirCambio}
          />
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
