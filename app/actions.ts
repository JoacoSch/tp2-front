'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const type = formData.get('type') as string
  const status = formData.get('status') as string
  const notes = (formData.get('notes') as string) || null

  const { error } = await supabase.from('items').insert({
    user_id: user.id,
    title,
    type,
    status,
    notes,
  })

  if (error) throw new Error(error.message)

  redirect('/dashboard')
}

export async function updateItem(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const type = formData.get('type') as string
  const status = formData.get('status') as string
  const notes = (formData.get('notes') as string) || null

  const { error } = await supabase
    .from('items')
    .update({ title, type, status, notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  redirect('/dashboard')
}

export async function upsertProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const display_name = (formData.get('display_name') as string).trim() || null

  let avatar_url: string | undefined = undefined

  const file = formData.get('avatar') as File | null
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer()
    const path = `${user.id}/avatar`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, bytes, { contentType: file.type, upsert: true })

    if (uploadError) throw new Error(uploadError.message)

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    avatar_url = publicUrl
  }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    display_name,
    ...(avatar_url !== undefined && { avatar_url }),
    updated_at: new Date().toISOString(),
  })

  if (error) throw new Error(error.message)

  revalidatePath('/profile')
  revalidatePath('/', 'layout')
}

export async function deleteItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('items').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard')
}
