import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ItemCarrito } from '../features/pedidos/types/pedidos'

interface ProductoParaCarrito {
  id: number
  nombre: string
  precio_base: number
}

interface CartState {
  items: ItemCarrito[]
  agregar: (producto: ProductoParaCarrito) => void
  quitar: (productoId: number) => void
  cambiarCantidad: (productoId: number, cantidad: number) => void
  vaciar: () => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (producto) =>
        set((state) => {
          const existe = state.items.some((item) => item.producto_id === producto.id)
          if (existe) {
            return {
              items: state.items.map((item) =>
                item.producto_id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                producto_id: producto.id,
                nombre: producto.nombre,
                precio_unitario: producto.precio_base,
                cantidad: 1,
              },
            ],
          }
        }),

      quitar: (productoId) =>
        set((state) => ({ items: state.items.filter((item) => item.producto_id !== productoId) })),

      cambiarCantidad: (productoId, cantidad) =>
        set((state) => ({
          items:
            cantidad < 1
              ? state.items.filter((item) => item.producto_id !== productoId)
              : state.items.map((item) =>
                  item.producto_id === productoId ? { ...item, cantidad } : item,
                ),
        })),

      vaciar: () => set({ items: [] }),

      total: () =>
        get().items.reduce((suma, item) => suma + item.precio_unitario * item.cantidad, 0),
    }),
    { name: 'cart-storage' },
  ),
)
