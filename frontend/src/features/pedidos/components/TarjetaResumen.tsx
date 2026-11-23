import { Card } from '../../../shared/ui/Card'

interface TarjetaResumenProps {
  titulo: string
  valor: string | number
}

export function TarjetaResumen({ titulo, valor }: TarjetaResumenProps) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">{titulo}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{valor}</p>
    </Card>
  )
}
