import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Alerta } from '../../../shared/ui/Alerta'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Input } from '../../../shared/ui/Input'
import { errorDeCampo, manejarEnvio } from '../../../shared/utils/formularios'

function destinoTrasLogin(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state && typeof state.from === 'string') {
    return state.from
  }
  return '/'
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const form = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: async ({ value }) => {
      setError(null)
      setEnviando(true)
      try {
        await login(value.username.trim(), value.password)
        navigate(destinoTrasLogin(location.state), { replace: true })
      } catch (e) {
        setError(handleApiError(e))
      } finally {
        setEnviando(false)
      }
    },
  })

  return (
    <Card className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Iniciar sesión</h1>
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(evento) => manejarEnvio(evento, form)}
      >
        {error && <Alerta>{error}</Alerta>}

        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => (value.trim() ? undefined : 'Ingresá tu nombre de usuario'),
          }}
        >
          {(field) => (
            <Input
              label="Usuario"
              autoComplete="username"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={errorDeCampo(field.state.meta)}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => (value ? undefined : 'Ingresá tu contraseña'),
          }}
        >
          {(field) => (
            <Input
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={errorDeCampo(field.state.meta)}
            />
          )}
        </form.Field>

        <Button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        ¿No tenés cuenta?{' '}
        <Link to="/register" className="font-medium text-orange-600 hover:underline">
          Registrate
        </Link>
      </p>
    </Card>
  )
}
