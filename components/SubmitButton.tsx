'use client'

import { useFormStatus } from 'react-dom'

interface Props {
  label: string
  pendingLabel?: string
}

export default function SubmitButton({ label, pendingLabel }: Props) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2 text-sm transition-colors"
    >
      {pending ? (pendingLabel ?? label) : label}
    </button>
  )
}
