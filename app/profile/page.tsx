import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { upsertProfile } from '@/app/actions'
import SubmitButton from '@/components/SubmitButton'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const initial = (profile?.display_name || user.email || '?').charAt(0).toUpperCase()

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/dashboard" className="text-zinc-400 hover:text-white text-sm transition-colors">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold mt-3">Mi perfil</h1>
      </div>

      <form action={upsertProfile} encType="multipart/form-data" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col items-center gap-3">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Avatar"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-2xl font-bold">
              {initial}
            </span>
          )}
          <div className="space-y-1 w-full">
            <label className="text-sm text-zinc-400">Foto de perfil</label>
            <input
              name="avatar"
              type="file"
              accept="image/*"
              className="w-full text-sm text-zinc-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-violet-600 file:text-white hover:file:bg-violet-500 file:cursor-pointer"
            />
          </div>
        </div>

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

        <SubmitButton label="Guardar cambios" pendingLabel="Guardando..." />
      </form>
    </div>
  )
}
