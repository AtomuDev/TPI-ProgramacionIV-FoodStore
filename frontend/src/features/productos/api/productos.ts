import { axiosInstance } from '../../../shared/api/axiosInstance'
import type {
  FiltrosProductos,
  Producto,
  ProductoCreate,
  ProductosPaginados,
  ProductoStockUpdate,
  ProductoUpdate,
} from '../types/productos'

export async function listarProductos(filtros: FiltrosProductos): Promise<ProductosPaginados> {
  const { data } = await axiosInstance.get<ProductosPaginados>('/productos', {
    params: { ...filtros, search: filtros.search || undefined },
  })
  return data
}

export async function crearProducto(body: ProductoCreate): Promise<Producto> {
  const { data } = await axiosInstance.post<Producto>('/productos', body)
  return data
}

export async function actualizarProducto(id: number, body: ProductoUpdate): Promise<Producto> {
  const { data } = await axiosInstance.put<Producto>(`/productos/${id}`, body)
  return data
}

export async function actualizarStock(id: number, body: ProductoStockUpdate): Promise<Producto> {
  const { data } = await axiosInstance.patch<Producto>(`/productos/${id}/stock`, body)
  return data
}

export async function eliminarProducto(id: number): Promise<void> {
  await axiosInstance.delete(`/productos/${id}`)
}
