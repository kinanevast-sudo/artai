'use client'

import React, { useState, useRef } from 'react'
import { Upload, Search, Trash2, Copy, Grid3x3, List, Film, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ConfirmModal } from '@/components/ui/modal'
import { cn, formatBytes } from '@/lib/utils'

const SAMPLE_MEDIA = [
  { id: '1', url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=400', file_name: 'team-photo.jpg', file_type: 'image', file_size_bytes: 1240000, created_at: '2026-04-01T10:00:00Z', width: 1920, height: 1080 },
  { id: '2', url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=400', file_name: 'office-meeting.jpg', file_type: 'image', file_size_bytes: 890000, created_at: '2026-04-02T10:00:00Z', width: 1600, height: 900 },
  { id: '3', url: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?w=400', file_name: 'workspace.jpg', file_type: 'image', file_size_bytes: 2100000, created_at: '2026-04-03T10:00:00Z', width: 2400, height: 1600 },
  { id: '4', url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?w=400', file_name: 'product-shot.jpg', file_type: 'image', file_size_bytes: 1560000, created_at: '2026-04-04T10:00:00Z', width: 1920, height: 1280 },
  { id: '5', url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=400', file_name: 'campaign-hero.jpg', file_type: 'image', file_size_bytes: 3200000, created_at: '2026-04-05T10:00:00Z', width: 3000, height: 2000 },
  { id: '6', url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=400', file_name: 'event-promo.jpg', file_type: 'image', file_size_bytes: 980000, created_at: '2026-04-06T10:00:00Z', width: 1200, height: 800 },
]

export default function MediaPage() {
  const [media, setMedia] = useState(SAMPLE_MEDIA)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = media.filter(m => {
    const matchSearch = !search || m.file_name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || m.file_type === filter
    return matchSearch && matchFilter
  })

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    toast.success(`${e.dataTransfer.files.length} file(s) uploaded!`)
  }

  const handleDelete = (id: string) => {
    setMedia(media.filter(m => m.id !== id))
    setDeleteId(null)
    toast.success('Media deleted')
  }

  const totalSize = media.reduce((sum, m) => sum + m.file_size_bytes, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {media.length} files &middot; {formatBytes(totalSize)} used
          </p>
        </div>
        <Button onClick={() => fileRef.current?.click()}>
          <Upload size={14} />
          Upload Media
        </Button>
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden"
          onChange={() => toast.success('Files uploaded!')} />
      </div>

      {/* Drag & Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
          dragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50'
        )}
      >
        <Upload size={28} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {dragging ? 'Drop files here' : 'Drag & drop or click to upload'}
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, MP4 up to 100MB</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search media..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<Search size={14} />}
          className="max-w-xs"
        />
        <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {(['all', 'image', 'video'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn('px-4 py-2 text-sm font-medium capitalize', filter === f ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800')}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden ml-auto">
          <button onClick={() => setView('grid')} className={cn('p-2', view === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800')}>
            <Grid3x3 size={16} />
          </button>
          <button onClick={() => setView('list')} className={cn('p-2', view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800')}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Media grid */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square">
              <img src={item.url} alt={item.file_name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => { navigator.clipboard.writeText(item.url); toast.success('URL copied!') }}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                  <Copy size={14} />
                </button>
                <button onClick={() => setDeleteId(item.id)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-red-500/80 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{item.file_name}</p>
                <p className="text-white/60 text-xs">{formatBytes(item.file_size_bytes)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['File', 'Type', 'Size', 'Dimensions', 'Date', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={item.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{item.file_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.file_type === 'image' ? 'info' : 'default'} size="sm">
                      {item.file_type === 'image' ? <ImageIcon size={11} /> : <Film size={11} />}
                      {item.file_type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatBytes(item.file_size_bytes)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.width}×{item.height}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { navigator.clipboard.writeText(item.url); toast.success('Copied!') }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Copy size={14} />
                      </button>
                      <button onClick={() => setDeleteId(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Media"
        message="This will permanently delete this file. Are you sure?"
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
