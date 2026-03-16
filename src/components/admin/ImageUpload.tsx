'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (res.ok) {
        onChange(data.url)
      } else {
        alert(data.error || 'Yukleme hatasi')
      }
    } catch {
      alert('Yukleme sirasinda hata olustu')
    }
    setUploading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>}

      {value ? (
        <div className="relative group">
          <div className="w-full h-40 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <img src={value} alt="" className="w-full h-full object-contain" />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100"
            >
              Degistir
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            dragOver ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-accent/50 hover:bg-gray-50'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="text-accent animate-spin" />
              <span className="text-xs text-gray-500">Yukleniyor...</span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload size={18} className="text-gray-400" />
              </div>
              <span className="text-xs text-gray-500">Surukle & birak veya tikla</span>
              <span className="text-[10px] text-gray-400">PNG, JPG, WEBP (maks. 5MB)</span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

interface MultiImageUploadProps {
  values: { url: string; alt: string }[]
  onChange: (images: { url: string; alt: string }[]) => void
  label?: string
}

export function MultiImageUpload({ values, onChange, label }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    const newImages = [...values]

    for (let i = 0; i < files.length; i++) {
      try {
        const formData = new FormData()
        formData.append('file', files[i])
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (res.ok) {
          newImages.push({ url: data.url, alt: '' })
        }
      } catch {}
    }

    onChange(newImages.filter(img => img.url))
    setUploading(false)
  }

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files)
  }

  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {values.filter(v => v.url).map((img, i) => (
          <div key={i} className="relative group aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
            {i === 0 && (
              <span className="absolute bottom-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Ana Gorsel
              </span>
            )}
          </div>
        ))}

        {/* Add button */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-accent/50 hover:bg-gray-50 transition-colors"
        >
          {uploading ? (
            <Loader2 size={20} className="text-accent animate-spin" />
          ) : (
            <>
              <Upload size={20} className="text-gray-400" />
              <span className="text-[10px] text-gray-400">Gorsel Ekle</span>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
        className="hidden"
      />
    </div>
  )
}
