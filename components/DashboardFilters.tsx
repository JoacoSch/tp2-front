'use client'

import { useState, useMemo } from 'react'
import ItemCard from './ItemCard'

interface Item {
  id: string
  title: string
  type: string
  status: string
  notes: string | null
  created_at: string
}

interface Props {
  items: Item[]
}

export default function DashboardFilters({ items }: Props) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === '' || item.type === typeFilter
      const matchesStatus = statusFilter === '' || item.status === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
  }, [items, search, typeFilter, statusFilter])

  const selectClass = 'bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500 transition-colors'

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="search"
          placeholder="Buscar por título..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={selectClass}>
          <option value="">Todos los tipos</option>
          <option value="movie">🎬 Película</option>
          <option value="series">📺 Serie</option>
          <option value="book">📚 Libro</option>
          <option value="podcast">🎙️ Podcast</option>
          <option value="other">✨ Otro</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectClass}>
          <option value="">Todos los estados</option>
          <option value="want">⏳ Pendiente</option>
          <option value="in_progress">▶️ En progreso</option>
          <option value="done">✅ Terminado</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-12 text-zinc-500 text-sm">
          {items.length === 0 ? 'Tu lista está vacía' : 'No hay resultados para esa búsqueda'}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
