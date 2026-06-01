import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardFilters from '@/components/DashboardFilters'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  const list = items ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mi lista</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{list.length} elementos</p>
        </div>
        <Link
          href="/add"
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Agregar
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">Tu lista está vacía</p>
          <p className="text-sm mt-1">Agregá películas, series, libros o podcasts</p>
          <Link href="/add" className="inline-block mt-4 text-violet-400 hover:text-violet-300 text-sm">
            Agregar el primero →
          </Link>
        </div>
      ) : (
        <DashboardFilters items={list} />
      )}
    </div>
  )
}
