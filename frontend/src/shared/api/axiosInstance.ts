import axios, { type AxiosError } from 'axios'
import { useAuthStore } from '../../store/authStore'

interface ErrorBody {
  detail?: unknown
}

const RUTAS_DE_SESION = ['/auth/token', '/auth/me']
const CUENTA_DESACTIVADA = 'Cuenta de usuario desactivada'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorBody>) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const detail = error.response?.data?.detail

    const sesionVencida = status === 401 && !RUTAS_DE_SESION.some((ruta) => url.includes(ruta))
    const cuentaDesactivada = status === 400 && detail === CUENTA_DESACTIVADA

    if (sesionVencida || cuentaDesactivada) {
      useAuthStore.setState({ usuario: null })
    }
    return Promise.reject(error)
  },
)
