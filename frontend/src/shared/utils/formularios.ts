import type { AnyFormApi } from '@tanstack/react-form'
import type { FormEvent } from 'react'

interface MetaCampo {
  isTouched: boolean
  errors: readonly unknown[]
}

export function errorDeCampo(meta: MetaCampo): string | undefined {
  if (!meta.isTouched) {
    return undefined
  }
  return meta.errors.find((error): error is string => typeof error === 'string')
}

export function manejarEnvio(evento: FormEvent, form: AnyFormApi): void {
  evento.preventDefault()
  evento.stopPropagation()
  void form.validateAllFields('change').then(() => form.handleSubmit())
}
