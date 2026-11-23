import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  pequeno?: boolean
}

const ESTILOS: Record<Variante, string> = {
  primary: 'bg-orange-600 text-white hover:bg-orange-700',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export function Button({
  variante = 'primary',
  pequeno = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const tamano = pequeno ? 'px-3 py-1 text-sm' : 'px-4 py-2'
  return (
    <button
      type={type}
      className={`rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${tamano} ${ESTILOS[variante]} ${className}`}
      {...props}
    />
  )
}
