import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Alerta } from '../../../shared/ui/Alerta'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Input } from '../../../shared/ui/Input'
import { errorDeCampo, manejarEnvio } from '../../../shared/utils/formularios'
import { register } from '../api/auth'

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const form = useForm({
    defaultValues: { username: '', full_name: '', email: '', password: '' },
    onSubmit: async ({ value }) => {
      setError(null)
      setEnviando(true)
      try {
        await register({
          username: value.username.trim(),
          full_name: value.full_name.trim(),
          email: value.email.trim(),
          password: value.password,
        })
        await login(value.username.trim(), value.password)
        navigate('/', { replace: true })
      } catch (e) {
        setError(handleApiError(e))
      } finally {
        setEnviando(false)
      }
    },
  })

  return (
    <Card className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Crear cuenta</h1>
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(evento) => manejarEnvio(evento, form)}
      >
        {error && <Alerta>{error}</Alerta>}

        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) =>
              value.trim().length < 3 || value.trim().length > 50
                ? 'El usuario debe tener entre 3 y 50 caracteres'
                : undefined,
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
          name="full_name"
          validators={{
            onChange: ({ value }) =>
              value.trim().length < 1 || value.trim().length > 100
                ? 'El nombre debe tener entre 1 y 100 caracteres'
                : undefined,
          }}
        >
          {(field) => (
            <Input
              label="Nombre completo"
              autoComplete="name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={errorDeCampo(field.state.meta)}
            />
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => (REGEX_EMAIL.test(value.trim()) ? undefined : 'Ingresá un email válido'),
          }}
        >
          {(field) => (
            <Input
              label="Email"
              type="email"
              autoComplete="email"
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
            onChange: ({ value }) =>
              value.length < 8 ? 'La contraseña debe tener al menos 8 caracteres' : undefined,
          }}
        >
          {(field) => (
            <Input
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={errorDeCampo(field.state.meta)}
            />
          )}
        </form.Field>

        <Button type="submit" disabled={enviando}>
          {enviando ? 'Creando cuenta...' : 'Registrarme'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="font-medium text-orange-600 hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </Card>
  )
}
