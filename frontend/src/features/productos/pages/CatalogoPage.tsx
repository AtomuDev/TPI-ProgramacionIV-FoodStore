import { useState, type FormEvent } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { Paginacion } from '../../../shared/components/Paginacion'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Input } from '../../../shared/ui/Input'
import { Select } from '../../../shared/ui/Select'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { ProductoCard } from '../components/ProductoCard'
import { useProductos } from '../hooks/useProductos'

const LIMITE = 8

export function CatalogoPage() {
  const [pagina, setPagina] = useState(0)
  const [texto, setTexto] = useState('')
  const [search, setSearch] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)

  const categorias = useCategorias()
  const productos = useProductos({
    skip: pagina * LIMITE,
    limit: LIMITE,
    search,
    categoria_id: categoriaId,
  })

  const buscar = (evento: FormEvent) => {
    evento.preventDefault()
    setSearch(texto.trim())
    setPagina(0)
  }

  const cambiarCategoria = (valor: string) => {
    setCategoriaId(valor ? Number(valor) : undefined)
    setPagina(0)
  }

  const totalPaginas = Math.ceil((productos.data?.total ?? 0) / LIMITE)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Catálogo</h1>

      <form onSubmit={buscar} className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-72">
          <Input
            label="Buscar producto"
            placeholder="Ej: pizza"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            label="Categoría"
            value={categoriaId ?? ''}
            onChange={(e) => cambiarCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.data?.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      {productos.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: LIMITE }, (_, indice) => (
            <Card key={indice} className="flex flex-col gap-3">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-9 w-full" />
            </Card>
          ))}
        </div>
      ) : productos.isError ? (
        <EstadoError mensaje={handleApiError(productos.error)} onReintentar={() => void productos.refetch()} />
      ) : productos.data.items.length === 0 ? (
        <EstadoVacio
          titulo="No encontramos productos"
          descripcion="Probá con otra búsqueda o con otra categoría."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productos.data.items.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </>
      )}
    </div>
  )
}
