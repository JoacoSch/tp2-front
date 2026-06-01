'use client'

import { useState } from 'react'

const PRESET_TYPES = ['movie', 'series', 'book', 'podcast']

interface Props {
  defaultValue?: string
}

export default function TypeSelector({ defaultValue = '' }: Props) {
  const isPreset = PRESET_TYPES.includes(defaultValue)
  const [selected, setSelected] = useState(isPreset ? defaultValue : 'other')
  const [customValue, setCustomValue] = useState(isPreset ? '' : defaultValue)

  const selectClass = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors'

  return (
    <div className="space-y-2">
      <select
        name="type"
        required
        value={selected}
        onChange={e => setSelected(e.target.value)}
        className={selectClass}
      >
        <option value="" disabled>Seleccioná un tipo</option>
        <option value="movie">Película</option>
        <option value="series">Serie</option>
        <option value="book">Libro</option>
        <option value="podcast">Podcast</option>
        <option value="other">Otro</option>
      </select>

      {selected === 'other' && (
        <input
          name="custom_type"
          required
          value={customValue}
          onChange={e => setCustomValue(e.target.value)}
          placeholder="Ej: Anime, Documental, Juego..."
          className={selectClass + ' placeholder:text-zinc-600'}
        />
      )}
    </div>
  )
}
