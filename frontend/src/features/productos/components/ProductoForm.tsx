import { useForm } from '@tanstack/react-form'
import { Alerta } from '../../../shared/ui/Alerta'
import { Button } from '../../../shared/ui/Button'
import { Input } from '../../../shared/ui/Input'
import { Select } from '../../../shared/ui/Select'
import { errorDeCampo, manejarEnvio } from '../../../shared/utils/formularios'
import type { Categoria } from '../../categorias/types/categorias'
import type { Producto, ProductoCreate } from '../types/productos'

interface ProductoFormProps {
  inicial: Producto | null
  categorias: Categoria[]
  enviando: boolean
  error: string | null
  onEnviar: (valores: ProductoCreate) => void
  onCancelar: () => void
}

export function ProductoForm({
  inicial,
  categorias,
  enviando,
  error,
  onEnviar,
  onCancelar,
}: ProductoFormProps) {
  const form = useForm({
    defaultValues: {
      nombre: inicial?.nombre ?? '',
      descripcion: inicial?.descripcion ?? '',
      precio_base: inicial ? String(inicial.precio_base) : '',
      imagen_url: inicial?.imagen_url ?? '',
      stock: inicial ? String(inicial.stock) : '',
      disponible: inicial?.disponible ?? true,
      categoria_id: inicial?.categoria_id ?? 0,
    },
    onSubmit: ({ value }) => {
      onEnviar({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim() || undefined,
        precio_base: Number(value.precio_base),
        imagen_url: value.imagen_url.trim() || undefined,
        stock: Number(value.stock),
        disponible: value.disponible,
        categoria_id: value.categoria_id,
      })
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
          onChange: ({ value }) => (value.trim() ? undefined : 'El nombre es obligatorio'),
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

      <form.Field
        name="categoria_id"
        validators={{
          onChange: ({ value }) => (value > 0 ? undefined : 'Seleccioná una categoría'),
        }}
      >
        {(field) => (
          <Select
            label="Categoría"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(Number(e.target.value))}
            error={errorDeCampo(field.state.meta)}
          >
            <option value={0}>Seleccionar...</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </Select>
        )}
      </form.Field>

      <form.Field
        name="precio_base"
        validators={{
          onChange: ({ value }) => {
            if (value.trim() === '' || Number.isNaN(Number(value))) {
              return 'Ingresá el precio'
            }
            return Number(value) < 0 ? 'El precio no puede ser negativo' : undefined
          },
        }}
      >
        {(field) => (
          <Input
            label="Precio"
            type="number"
            min={0}
            step="0.01"
            value={field.state.value}
            onBlur={field.handleBlur}
            placeholder="0"
            onChange={(e) => field.handleChange(e.target.value)}
            error={errorDeCampo(field.state.meta)}
          />
        )}
      </form.Field>

      <form.Field name="imagen_url">
        {(field) => (
          <Input
            label="URL de la imagen (opcional)"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      {!inicial && (
        <>
          <form.Field
            name="stock"
            validators={{
              onChange: ({ value }) =>
                value.trim() !== '' && Number.isInteger(Number(value)) && Number(value) >= 0
                  ? undefined
                  : 'El stock debe ser un entero mayor o igual a 0',
            }}
          >
            {(field) => (
              <Input
                label="Stock inicial"
                type="number"
                min={0}
                step={1}
                value={field.state.value}
                onBlur={field.handleBlur}
                placeholder="0"
                onChange={(e) => field.handleChange(e.target.value)}
                error={errorDeCampo(field.state.meta)}
              />
            )}
          </form.Field>

          <form.Field name="disponible">
            {(field) => (
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                Disponible para la venta
              </label>
            )}
          </form.Field>
        </>
      )}

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
