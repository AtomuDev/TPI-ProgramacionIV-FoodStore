import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Paginacion } from './Paginacion'

interface TablaDatosProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  paginar?: boolean
  filasPorPagina?: number
}

export function TablaDatos<T>({
  data,
  columns,
  paginar = true,
  filasPorPagina = 10,
}: TablaDatosProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: paginar ? getPaginationRowModel() : undefined,
    initialState: { pagination: { pageSize: filasPorPagina } },
  })

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((grupo) => (
              <tr key={grupo.id}>
                {grupo.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-semibold text-slate-700">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  No hay registros para mostrar
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((fila) => (
                <tr key={fila.id}>
                  {fila.getVisibleCells().map((celda) => (
                    <td key={celda.id} className="px-4 py-3 text-slate-700">
                      {flexRender(celda.column.columnDef.cell, celda.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {paginar && (
        <Paginacion
          pagina={table.getState().pagination.pageIndex}
          totalPaginas={table.getPageCount()}
          onCambiar={table.setPageIndex}
        />
      )}
    </div>
  )
}
