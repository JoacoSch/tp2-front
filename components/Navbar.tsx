'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  userEmail?: string
  displayName?: string | null
  avatarUrl?: string | null
}

export default function Navbar({ userEmail, displayName, avatarUrl }: NavbarProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const label = displayName || userEmail || ''
  const initial = label.charAt(0).toUpperCase()

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-violet-400 font-bold text-lg tracking-tight">
          Watchlog
        </Link>

        {userEmail && (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="Mi perfil"
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">
                  {initial}
                </span>
              )}
              <span className="text-zinc-400 text-sm hidden sm:block">{displayName || userEmail}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
