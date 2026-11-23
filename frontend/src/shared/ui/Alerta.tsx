import type { ReactNode } from 'react'

interface AlertaProps {
  tipo?: 'error' | 'exito'
  children: ReactNode
}

export function Alerta({ tipo = 'error', children }: AlertaProps) {
  const estilos =
    tipo === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-green-200 bg-green-50 text-green-700'
  return (
    <div role="alert" className={`rounded-md border px-4 py-3 text-sm ${estilos}`}>
      {children}
    </div>
  )
}
