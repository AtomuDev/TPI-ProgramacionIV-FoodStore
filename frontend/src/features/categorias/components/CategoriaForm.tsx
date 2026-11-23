import { useForm } from '@tanstack/react-form'
import { Alerta } from '../../../shared/ui/Alerta'
import { Button } from '../../../shared/ui/Button'
import { Input } from '../../../shared/ui/Input'
import { errorDeCampo, manejarEnvio } from '../../../shared/utils/formularios'
import type { Categoria, CategoriaCreate } from '../types/categorias'

interface CategoriaFormProps {
  inicial: Categoria | null
  enviando: boolean
  error: string | null
  onEnviar: (valores: CategoriaCreate) => void
  onCancelar: () => void
}

export function CategoriaForm({ inicial, enviando, error, onEnviar, onCancelar }: CategoriaFormProps) {
  const form = useForm({
    defaultValues: {
      nombre: inicial?.nombre ?? '',
      descripcion: inicial?.descripcion ?? '',
    },
    onSubmit: ({ value }) => {
      onEnviar({ nombre: value.nombre.trim(), descripcion: value.descripcion.trim() || undefined })
    },
  })

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(evento) => manejarEnvio(evento, form)}
    >
      {error && <Alerta>{error}</Alerta>}

      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) =>
            value.trim().length < 2 || value.trim().length > 100
              ? 'El nombre debe tener entre 2 y 100 caracteres'
              : undefined,
        }}
      >
        {(field) => (
          <Input
            label="Nombre"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={errorDeCampo(field.state.meta)}
          />
        )}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => (
          <Input
            label="Descripción"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <div className="flex justify-end gap-3">
        <Button variante="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
