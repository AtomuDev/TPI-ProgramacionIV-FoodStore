import type { EstadoPedido, FormaPago } from '../types/pedidos'

export const FORMAS_PAGO: FormaPago[] = ['EFECTIVO', 'TRANSFERENCIA']

export const ESTADOS: EstadoPedido[] = ['PENDIENTE', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO']

export const ETIQUETA_ESTADO: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

export const SIGUIENTE_ESTADO: Partial<Record<EstadoPedido, EstadoPedido>> = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'ENTREGADO',
}

export function esFormaPago(valor: string): valor is FormaPago {
  return FORMAS_PAGO.some((forma) => forma === valor)
}

export function esEstadoPedido(valor: string): valor is EstadoPedido {
  return ESTADOS.some((estado) => estado === valor)
}

export function puedeCancelarseComoAdmin(estado: EstadoPedido): boolean {
  return estado === 'PENDIENTE' || estado === 'EN_PREPARACION'
}
