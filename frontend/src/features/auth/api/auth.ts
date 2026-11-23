import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { UserCreate, UserPublic } from '../types/auth'

export async function login(username: string, password: string): Promise<void> {
  await axiosInstance.post('/auth/token', new URLSearchParams({ username, password }))
}

export async function register(data: UserCreate): Promise<UserPublic> {
  const { data: usuario } = await axiosInstance.post<UserPublic>('/auth/register', data)
  return usuario
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout')
}

export async function me(): Promise<UserPublic> {
  const { data } = await axiosInstance.get<UserPublic>('/auth/me')
  return data
}
