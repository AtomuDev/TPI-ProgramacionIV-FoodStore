import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '../features/auth/api/auth'
import type { UserPublic } from '../features/auth/types/auth'
import { queryClient } from '../shared/api/queryClient'

interface AuthState {
  usuario: UserPublic | null
  cargando: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (username, password) => {
        await authApi.login(username, password)
        set({ usuario: await authApi.me() })
      },

      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          set({ usuario: null })
          queryClient.clear()
        }
      },

      checkSession: async () => {
        try {
          set({ usuario: await authApi.me() })
        } catch {
          set({ usuario: null })
        } finally {
          set({ cargando: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
)
