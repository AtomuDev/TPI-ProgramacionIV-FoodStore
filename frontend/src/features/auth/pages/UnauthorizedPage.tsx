import { Link } from 'react-router-dom'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'

export function UnauthorizedPage() {
  return (
    <EstadoVacio titulo="Sin permiso" descripcion="No tenés permisos para acceder a esta pantalla.">
      <Link to="/" className="font-medium text-orange-600 hover:underline">
        Volver al inicio
      </Link>
    </EstadoVacio>
  )
}
