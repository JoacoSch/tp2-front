import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Watchlog',
  description: 'Tu tracker personal de contenido',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="es">
      <body className={`${geist.className} bg-zinc-950 text-white min-h-screen`}>
        <Navbar userEmail={user?.email} />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
