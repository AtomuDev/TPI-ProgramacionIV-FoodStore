import { Button } from '../ui/Button'

interface EstadoErrorProps {
  mensaje: string
  onReintentar?: () => void
}

export function EstadoError({ mensaje, onReintentar }: EstadoErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center"
    >
      <p className="font-medium text-red-700">{mensaje}</p>
      {onReintentar && (
        <Button variante="secondary" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
