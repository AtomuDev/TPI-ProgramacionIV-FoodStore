import type { ColumnDef } from '@tanstack/react-table'
import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { Skeleton } from '../../../shared/components/Skeleton'
import { TablaDatos } from '../../../shared/components/TablaDatos'
import { Alerta } from '../../../shared/ui/Alerta'
import { Button } from '../../../shared/ui/Button'
import { useAuthStore } from '../../../store/authStore'
import type { UserPublic } from '../../auth/types/auth'
import { useActivarUsuario, useDesactivarUsuario, useUsuarios } from '../hooks/useUsuarios'

export function AdminUsuariosPage() {
  const usuarioActual = useAuthStore((state) => state.usuario)
  const usuarios = useUsuarios()
  const activar = useActivarUsuario()
  const desactivar = useDesactivarUsuario()

  const columnas: ColumnDef<UserPublic>[] = [
    { accessorKey: 'username', header: 'Usuario' },
    { accessorKey: 'full_name', header: 'Nombre' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Rol' },
    {
      accessorKey: 'disabled',
      header: 'Estado',
      cell: ({ getValue }) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            getValue<boolean>() ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}
        >
          {getValue<boolean>() ? 'Desactivado' : 'Activo'}
        </span>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const usuario = row.original
        if (usuario.disabled) {
          return (
            <Button
              variante="secondary"
              pequeno
              disabled={activar.isPending}
              onClick={() => activar.mutate(usuario.id)}
            >
              Activar
            </Button>
          )
        }
        if (usuario.id === usuarioActual?.id) {
          return null
        }
        return (
          <Button
            variante="danger"
            pequeno
            disabled={desactivar.isPending}
            onClick={() => desactivar.mutate(usuario.id)}
          >
            Desactivar
          </Button>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>

      {activar.isError && <Alerta>{handleApiError(activar.error)}</Alerta>}
      {desactivar.isError && <Alerta>{handleApiError(desactivar.error)}</Alerta>}

      {usuarios.isPending ? (
        <Skeleton className="h-48 w-full" />
      ) : usuarios.isError ? (
        <EstadoError mensaje={handleApiError(usuarios.error)} onReintentar={() => void usuarios.refetch()} />
      ) : (
        <TablaDatos data={usuarios.data} columns={columnas} />
      )}
    </div>
  )
}
