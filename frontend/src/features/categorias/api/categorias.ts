import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types/categorias'

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await axiosInstance.get<Categoria[]>('/categorias')
  return data
}

export async function crearCategoria(body: CategoriaCreate): Promise<Categoria> {
  const { data } = await axiosInstance.post<Categoria>('/categorias', body)
  return data
}

export async function actualizarCategoria(id: number, body: CategoriaUpdate): Promise<Categoria> {
  const { data } = await axiosInstance.put<Categoria>(`/categorias/${id}`, body)
  return data
}

export async function eliminarCategoria(id: number): Promise<void> {
  await axiosInstance.delete(`/categorias/${id}`)
}
