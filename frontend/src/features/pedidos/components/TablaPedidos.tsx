import type { ColumnDef } from '@tanstack/react-table'
import { TablaDatos } from '../../../shared/components/TablaDatos'
import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { Button } from '../../../shared/ui/Button'
import { formatearFecha, formatearPrecio } from '../../../shared/utils/formato'
import type { EstadoPedido, Pedido } from '../types/pedidos'
import { puedeCancelarseComoAdmin, SIGUIENTE_ESTADO } from '../utils/constantes'

interface TablaPedidosProps {
  pedidos: Pedido[]
  procesando: boolean
  onVerDetalle: (pedido: Pedido) => void
  onCambiarEstado: (pedido: Pedido, estado: EstadoPedido) => void
}

const ETIQUETA_AVANCE: Partial<Record<EstadoPedido, string>> = {
  EN_PREPARACION: 'Pasar a preparación',
  ENTREGADO: 'Marcar entregado',
}

export function TablaPedidos({ pedidos, procesando, onVerDetalle, onCambiarEstado }: TablaPedidosProps) {
  const columnas: ColumnDef<Pedido>[] = [
    { accessorKey: 'id', header: 'N°' },
    {
      accessorKey: 'usuario_id',
      header: 'Cliente',
      cell: ({ getValue }) => `Usuario #${getValue<number>()}`,
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => <BadgeEstado estado={row.original.estado} />,
    },
    { accessorKey: 'forma_pago', header: 'Pago' },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ getValue }) => formatearPrecio(getValue<number>()),
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha',
      cell: ({ getValue }) => formatearFecha(getValue<string>()),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const pedido = row.original
        const siguiente = SIGUIENTE_ESTADO[pedido.estado]
        return (
          <div className="flex flex-wrap gap-2">
            <Button variante="secondary" pequeno onClick={() => onVerDetalle(pedido)}>
              Detalle
            </Button>
            {siguiente && (
              <Button pequeno disabled={procesando} onClick={() => onCambiarEstado(pedido, siguiente)}>
                {ETIQUETA_AVANCE[siguiente]}
              </Button>
            )}
            {puedeCancelarseComoAdmin(pedido.estado) && (
              <Button
                variante="danger"
                pequeno
                disabled={procesando}
                onClick={() => onCambiarEstado(pedido, 'CANCELADO')}
              >
                Cancelar
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return <TablaDatos data={pedidos} columns={columnas} paginar={false} />
}
