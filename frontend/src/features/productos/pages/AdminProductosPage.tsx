import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { Skeleton } from '../../../shared/components/Skeleton'
import { TablaDatos } from '../../../shared/components/TablaDatos'
import { Alerta } from '../../../shared/ui/Alerta'
import { Button } from '../../../shared/ui/Button'
import { Modal } from '../../../shared/ui/Modal'
import { formatearPrecio } from '../../../shared/utils/formato'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { ProductoForm } from '../components/ProductoForm'
import { StockForm } from '../components/StockForm'
import {
  useActualizarProducto,
  useActualizarStock,
  useCrearProducto,
  useEliminarProducto,
  useProductos,
} from '../hooks/useProductos'
import type { Producto, ProductoCreate, ProductoStockUpdate } from '../types/productos'

export function AdminProductosPage() {
  const productos = useProductos({ skip: 0, limit: 100 })
  const categorias = useCategorias()
  const crear = useCrearProducto()
  const actualizar = useActualizarProducto()
  const actualizarStock = useActualizarStock()
  const eliminar = useEliminarProducto()

  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)
  const [stockDe, setStockDe] = useState<Producto | null>(null)

  const abrirForm = (producto: Producto | null) => {
    crear.reset()
    actualizar.reset()
    setEditando(producto)
    setFormAbierto(true)
  }

  const abrirStock = (producto: Producto) => {
    actualizarStock.reset()
    setStockDe(producto)
  }

  const cerrarForm = () => setFormAbierto(false)
  const cerrarStock = () => setStockDe(null)

  const guardar = (valores: ProductoCreate) => {
    if (editando) {
      actualizar.mutate(
        {
          id: editando.id,
          data: {
            nombre: valores.nombre,
            descripcion: valores.descripcion,
            precio_base: valores.precio_base,
            imagen_url: valores.imagen_url,
            categoria_id: valores.categoria_id,
          },
        },
        { onSuccess: cerrarForm },
      )
    } else {
      crear.mutate(valores, { onSuccess: cerrarForm })
    }
  }

  const guardarStock = (valores: ProductoStockUpdate) => {
    if (stockDe) {
      actualizarStock.mutate({ id: stockDe.id, data: valores }, { onSuccess: cerrarStock })
    }
  }

  const pedirEliminacion = (producto: Producto) => {
    if (window.confirm(`¿Dar de baja el producto "${producto.nombre}"?`)) {
      eliminar.mutate(producto.id)
    }
  }

  const errorGuardado = editando ? actualizar.error : crear.error

  const columnas: ColumnDef<Producto>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nombre', header: 'Nombre' },
    { id: 'categoria', header: 'Categoría', accessorFn: (producto) => producto.categoria.nombre },
    {
      accessorKey: 'precio_base',
      header: 'Precio',
      cell: ({ getValue }) => formatearPrecio(getValue<number>()),
    },
    { accessorKey: 'stock', header: 'Stock' },
    {
      accessorKey: 'disponible',
      header: 'Disponible',
      cell: ({ getValue }) => (getValue<boolean>() ? 'Sí' : 'No'),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variante="secondary" pequeno onClick={() => abrirForm(row.original)}>
            Editar
          </Button>
          <Button variante="secondary" pequeno onClick={() => abrirStock(row.original)}>
            Stock
          </Button>
          <Button
            variante="danger"
            pequeno
            disabled={eliminar.isPending}
            onClick={() => pedirEliminacion(row.original)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
        <Button onClick={() => abrirForm(null)}>Nuevo producto</Button>
      </div>

      {eliminar.isError && <Alerta>{handleApiError(eliminar.error)}</Alerta>}

      {productos.isPending ? (
        <Skeleton className="h-64 w-full" />
      ) : productos.isError ? (
        <EstadoError mensaje={handleApiError(productos.error)} onReintentar={() => void productos.refetch()} />
      ) : (
        <TablaDatos data={productos.data.items} columns={columnas} />
      )}

      <Modal
        abierto={formAbierto}
        titulo={editando ? 'Editar producto' : 'Nuevo producto'}
        onCerrar={cerrarForm}
      >
        <ProductoForm
          inicial={editando}
          categorias={categorias.data ?? []}
          enviando={crear.isPending || actualizar.isPending}
          error={errorGuardado ? handleApiError(errorGuardado) : null}
          onEnviar={guardar}
          onCancelar={cerrarForm}
        />
      </Modal>

      <Modal abierto={stockDe !== null} titulo={`Stock de ${stockDe?.nombre ?? ''}`} onCerrar={cerrarStock}>
        {stockDe && (
          <StockForm
            producto={stockDe}
            enviando={actualizarStock.isPending}
            error={actualizarStock.error ? handleApiError(actualizarStock.error) : null}
            onEnviar={guardarStock}
            onCancelar={cerrarStock}
          />
        )}
      </Modal>
    </div>
  )
}
