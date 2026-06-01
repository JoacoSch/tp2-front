import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { upsertProfile } from '@/app/actions'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/dashboard" className="text-zinc-400 hover:text-white text-sm transition-colors">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold mt-3">Mi perfil</h1>
      </div>

      <form action={upsertProfile} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Email</label>
          <input
            value={user.email ?? ''}
            disabled
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Nombre para mostrar</label>
          <input
            name="display_name"
            defaultValue={profile?.display_name ?? ''}
            placeholder="Tu nombre o apodo"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg py-2 text-sm transition-colors"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  )
}
