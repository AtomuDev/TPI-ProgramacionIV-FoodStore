import { useForm } from '@tanstack/react-form'
import { useNavigate } from 'react-router-dom'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Alerta } from '../../../shared/ui/Alerta'
import { Button } from '../../../shared/ui/Button'
import { Input } from '../../../shared/ui/Input'
import { Select } from '../../../shared/ui/Select'
import { errorDeCampo, manejarEnvio } from '../../../shared/utils/formularios'
import { useCartStore } from '../../../store/cartStore'
import { useCrearPedido } from '../hooks/usePedidos'
import type { FormaPago } from '../types/pedidos'
import { esFormaPago, FORMAS_PAGO } from '../utils/constantes'

export function CheckoutForm() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const vaciar = useCartStore((state) => state.vaciar)
  const crearPedido = useCrearPedido()

  const form = useForm({
    defaultValues: {
      direccion_entrega: '',
      forma_pago: 'EFECTIVO' as FormaPago,
      notas: '',
    },
    onSubmit: ({ value }) => {
      crearPedido.mutate(
        {
          items: items.map((item) => ({ producto_id: item.producto_id, cantidad: item.cantidad })),
          forma_pago: value.forma_pago,
          direccion_entrega: value.direccion_entrega.trim(),
          notas: value.notas.trim() || undefined,
        },
        {
          onSuccess: () => {
            vaciar()
            navigate('/mis-pedidos')
          },
        },
      )
    },
  })

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(evento) => manejarEnvio(evento, form)}
    >
      {crearPedido.isError && <Alerta>{handleApiError(crearPedido.error)}</Alerta>}

      <form.Field
        name="direccion_entrega"
        validators={{
          onChange: ({ value }) =>
            value.trim().length < 5 || value.trim().length > 200
              ? 'La dirección debe tener entre 5 y 200 caracteres'
              : undefined,
        }}
      >
        {(field) => (
          <Input
            label="Dirección de entrega"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={errorDeCampo(field.state.meta)}
          />
        )}
      </form.Field>

      <form.Field name="forma_pago">
        {(field) => (
          <Select
            label="Forma de pago"
            value={field.state.value}
            onChange={(e) => {
              if (esFormaPago(e.target.value)) {
                field.handleChange(e.target.value)
              }
            }}
          >
            {FORMAS_PAGO.map((forma) => (
              <option key={forma} value={forma}>
                {forma === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'}
              </option>
            ))}
          </Select>
        )}
      </form.Field>

      <form.Field name="notas">
        {(field) => (
          <Input
            label="Notas (opcional)"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <Button type="submit" disabled={crearPedido.isPending}>
        {crearPedido.isPending ? 'Confirmando...' : 'Confirmar pedido'}
      </Button>
    </form>
  )
}
