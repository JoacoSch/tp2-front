'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { Film, Tv, BookOpen, Headphones, Layers, Pencil, Trash2, Clock, Play, CheckCheck } from 'lucide-react'
import { deleteItem, updateItemStatus } from '@/app/actions'

const TYPE_ICONS: Record<string, React.ReactNode> = {
  movie:   <Film size={13} />,
  series:  <Tv size={13} />,
  book:    <BookOpen size={13} />,
  podcast: <Headphones size={13} />,
}

const TYPE_LABELS: Record<string, string> = {
  movie: 'Película',
  series: 'Serie',
  book: 'Libro',
  podcast: 'Podcast',
}

const STATUS_STYLES: Record<string, string> = {
  want:        'bg-zinc-700 text-zinc-300',
  in_progress: 'bg-yellow-500/20 text-yellow-300',
  done:        'bg-green-500/20 text-green-300',
}

const STATUSES = [
  { key: 'want',        label: 'Pendiente',   Icon: Clock },
  { key: 'in_progress', label: 'En progreso', Icon: Play },
  { key: 'done',        label: 'Terminado',   Icon: CheckCheck },
]

interface Item {
  id: string
  title: string
  type: string
  status: string
  notes: string | null
  created_at: string
}

export default function ItemCard({ item }: { item: Item }) {
  const [isPending, startTransition] = useTransition()
  const deleteAction = deleteItem.bind(null, item.id)

  function handleStatusChange(status: string) {
    startTransition(async () => {
      await updateItemStatus(item.id, status)
    })
  }

  const typeIcon = TYPE_ICONS[item.type] ?? <Layers size={13} />
  const typeLabel = TYPE_LABELS[item.type] ?? item.type

  return (
    <div className={`bg-zinc-900 border rounded-xl p-4 flex flex-col gap-3 transition-colors ${isPending ? 'opacity-60' : 'border-zinc-800 hover:border-zinc-700'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium leading-tight">{item.title}</h3>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/edit/${item.id}`}
            className="text-zinc-600 hover:text-violet-400 transition-colors"
            title="Editar"
          >
            <Pencil size={14} />
          </Link>
          <form action={deleteAction}>
            <button type="submit" className="text-zinc-600 hover:text-red-400 transition-colors" title="Eliminar">
              <Trash2 size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Type + status badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 text-xs text-zinc-400">
          {typeIcon} {typeLabel}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[item.status] ?? 'bg-zinc-700 text-zinc-300'}`}>
          {STATUSES.find(s => s.key === item.status)?.label ?? item.status}
        </span>
      </div>

      {item.notes && (
        <p className="text-xs text-zinc-500 line-clamp-2">{item.notes}</p>
      )}

      {/* Quick status buttons */}
      <div className="flex gap-1.5 pt-1 border-t border-zinc-800">
        {STATUSES.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => handleStatusChange(key)}
            disabled={item.status === key || isPending}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
              item.status === key
                ? 'bg-violet-600 text-white cursor-default'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* Delete suggestion when done */}
      {item.status === 'done' && (
        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-xs text-green-300">
          <span>Ya lo terminaste, ¿lo eliminás?</span>
          <form action={deleteAction}>
            <button type="submit" className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors font-medium">
              <Trash2 size={11} /> Eliminar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
