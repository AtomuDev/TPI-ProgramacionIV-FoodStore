import { useForm } from '@tanstack/react-form'
import { Alerta } from '../../../shared/ui/Alerta'
import { Button } from '../../../shared/ui/Button'
import { Input } from '../../../shared/ui/Input'
import { errorDeCampo, manejarEnvio } from '../../../shared/utils/formularios'
import type { Producto, ProductoStockUpdate } from '../types/productos'

interface StockFormProps {
  producto: Producto
  enviando: boolean
  error: string | null
  onEnviar: (valores: ProductoStockUpdate) => void
  onCancelar: () => void
}

export function StockForm({ producto, enviando, error, onEnviar, onCancelar }: StockFormProps) {
  const form = useForm({
    defaultValues: { stock: String(producto.stock), disponible: producto.disponible },
    onSubmit: ({ value }) => onEnviar({ stock: Number(value.stock), disponible: value.disponible }),
  })

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(evento) => manejarEnvio(evento, form)}
    >
      {error && <Alerta>{error}</Alerta>}

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
            label="Stock"
            type="number"
            min={0}
            step={1}
            value={field.state.value}
            onBlur={field.handleBlur}
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
