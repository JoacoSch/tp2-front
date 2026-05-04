import { deleteItem } from '@/app/actions'

const TYPE_LABELS: Record<string, string> = {
  movie: '🎬 Película',
  series: '📺 Serie',
  book: '📚 Libro',
  podcast: '🎙️ Podcast',
  other: '✨ Otro',
}

const STATUS_STYLES: Record<string, string> = {
  want: 'bg-zinc-700 text-zinc-300',
  in_progress: 'bg-yellow-500/20 text-yellow-300',
  done: 'bg-green-500/20 text-green-300',
}

const STATUS_LABELS: Record<string, string> = {
  want: 'Pendiente',
  in_progress: 'En progreso',
  done: 'Terminado',
}

interface Item {
  id: string
  title: string
  type: string
  status: string
  notes: string | null
  created_at: string
}

export default function ItemCard({ item }: { item: Item }) {
  async function handleDelete() {
    'use server'
    await deleteItem(item.id)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium leading-tight">{item.title}</h3>
        <form action={handleDelete}>
          <button
            type="submit"
            className="text-zinc-600 hover:text-red-400 transition-colors text-sm shrink-0"
            title="Eliminar"
          >
            ✕
          </button>
        </form>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-zinc-400">{TYPE_LABELS[item.type] ?? item.type}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[item.status] ?? 'bg-zinc-700 text-zinc-300'}`}>
          {STATUS_LABELS[item.status] ?? item.status}
        </span>
      </div>

      {item.notes && (
        <p className="text-xs text-zinc-500 line-clamp-2">{item.notes}</p>
      )}
    </div>
  )
}
