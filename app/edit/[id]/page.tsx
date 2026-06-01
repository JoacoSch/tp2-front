import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { updateItem } from '@/app/actions'
import SubmitButton from '@/components/SubmitButton'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: item } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!item) notFound()

  const action = updateItem.bind(null, id)

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/dashboard" className="text-zinc-400 hover:text-white text-sm transition-colors">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold mt-3">Editar elemento</h1>
      </div>

      <form action={action} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Título *</label>
          <input
            name="title"
            required
            defaultValue={item.title}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Tipo *</label>
          <select
            name="type"
            required
            defaultValue={item.type}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          >
            <option value="movie">🎬 Película</option>
            <option value="series">📺 Serie</option>
            <option value="book">📚 Libro</option>
            <option value="podcast">🎙️ Podcast</option>
            <option value="other">✨ Otro</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Estado *</label>
          <select
            name="status"
            required
            defaultValue={item.status}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          >
            <option value="want">⏳ Quiero ver/leer</option>
            <option value="in_progress">▶️ En progreso</option>
            <option value="done">✅ Terminado</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Notas</label>
          <textarea
            name="notes"
            rows={3}
            defaultValue={item.notes ?? ''}
            placeholder="Opcional — quién te lo recomendó, por qué lo querés ver..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600 resize-none"
          />
        </div>

        <SubmitButton label="Guardar cambios" pendingLabel="Guardando..." />
      </form>
    </div>
  )
}
