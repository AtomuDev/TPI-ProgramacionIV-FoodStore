import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { Skeleton } from '../../../shared/components/Skeleton'
import { TablaDatos } from '../../../shared/components/TablaDatos'
import { Alerta } from '../../../shared/ui/Alerta'
import { Button } from '../../../shared/ui/Button'
import { Modal } from '../../../shared/ui/Modal'
import { CategoriaForm } from '../components/CategoriaForm'
import {
  useActualizarCategoria,
  useCategorias,
  useCrearCategoria,
  useEliminarCategoria,
} from '../hooks/useCategorias'
import type { Categoria, CategoriaCreate } from '../types/categorias'

export function AdminCategoriasPage() {
  const categorias = useCategorias()
  const crear = useCrearCategoria()
  const actualizar = useActualizarCategoria()
  const eliminar = useEliminarCategoria()

  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState<Categoria | null>(null)

  const abrirForm = (categoria: Categoria | null) => {
    crear.reset()
    actualizar.reset()
    setEditando(categoria)
    setFormAbierto(true)
  }

  const cerrarForm = () => setFormAbierto(false)

  const guardar = (valores: CategoriaCreate) => {
    if (editando) {
      actualizar.mutate({ id: editando.id, data: valores }, { onSuccess: cerrarForm })
    } else {
      crear.mutate(valores, { onSuccess: cerrarForm })
    }
  }

  const pedirEliminacion = (categoria: Categoria) => {
    if (window.confirm(`¿Dar de baja la categoría "${categoria.nombre}"?`)) {
      eliminar.mutate(categoria.id)
    }
  }

  const errorGuardado = editando ? actualizar.error : crear.error

  const columnas: ColumnDef<Categoria>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nombre', header: 'Nombre' },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: ({ getValue }) => getValue<string | null>() ?? '—',
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variante="secondary" pequeno onClick={() => abrirForm(row.original)}>
            Editar
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
        <h1 className="text-2xl font-bold text-slate-900">Categorías</h1>
        <Button onClick={() => abrirForm(null)}>Nueva categoría</Button>
      </div>

      {eliminar.isError && <Alerta>{handleApiError(eliminar.error)}</Alerta>}

      {categorias.isPending ? (
        <Skeleton className="h-48 w-full" />
      ) : categorias.isError ? (
        <EstadoError mensaje={handleApiError(categorias.error)} onReintentar={() => void categorias.refetch()} />
      ) : (
        <TablaDatos data={categorias.data} columns={columnas} />
      )}

      <Modal
        abierto={formAbierto}
        titulo={editando ? 'Editar categoría' : 'Nueva categoría'}
        onCerrar={cerrarForm}
      >
        <CategoriaForm
          inicial={editando}
          enviando={crear.isPending || actualizar.isPending}
          error={errorGuardado ? handleApiError(errorGuardado) : null}
          onEnviar={guardar}
          onCancelar={cerrarForm}
        />
      </Modal>
    </div>
  )
}
