import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { Skeleton } from '../../../shared/components/Skeleton'
import { formatearPrecio } from '../../../shared/utils/formato'
import { TarjetaResumen } from '../components/TarjetaResumen'
import { useResumenPedidos } from '../hooks/usePedidos'

export function AdminResumenPage() {
  const resumen = useResumenPedidos()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Resumen del negocio</h1>

      {resumen.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, indice) => (
            <Skeleton key={indice} className="h-24 w-full" />
          ))}
        </div>
      ) : resumen.isError ? (
        <EstadoError mensaje={handleApiError(resumen.error)} onReintentar={() => void resumen.refetch()} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TarjetaResumen titulo="Pedidos pendientes" valor={resumen.data.pendientes} />
          <TarjetaResumen titulo="En preparación" valor={resumen.data.en_preparacion} />
          <TarjetaResumen titulo="Entregados" valor={resumen.data.entregados} />
          <TarjetaResumen titulo="Cancelados" valor={resumen.data.cancelados} />
          <TarjetaResumen titulo="Pedidos de hoy" valor={resumen.data.pedidos_hoy} />
          <TarjetaResumen titulo="Ingresos (entregados)" valor={formatearPrecio(resumen.data.ingresos_entregados)} />
        </div>
      )}
    </div>
  )
}
