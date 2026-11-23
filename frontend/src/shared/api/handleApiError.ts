import axios from 'axios'

const ERROR_GENERICO = 'Ocurrió un error inesperado'

export function handleApiError(error: unknown): string {
  if (!axios.isAxiosError<{ detail?: unknown }>(error)) {
    return ERROR_GENERICO
  }
  if (!error.response) {
    return 'No se pudo conectar con el servidor'
  }

  const detail = error.response.data?.detail
  if (typeof detail === 'string') {
    return detail
  }
  if (Array.isArray(detail)) {
    const mensajes = detail
      .map((item: unknown) =>
        typeof item === 'object' && item !== null && 'msg' in item ? String(item.msg) : '',
      )
      .filter(Boolean)
    if (mensajes.length > 0) {
      return mensajes.join('. ')
    }
  }
  return ERROR_GENERICO
}
