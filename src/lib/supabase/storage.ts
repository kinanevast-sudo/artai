// src/lib/supabase/storage.ts

import { createClient } from '@/lib/supabase/client'

export async function uploadMedia(
  userId: string,
  file: File,
  type: 'image' | 'video'
): Promise<string> {
  const supabase = createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  const filePath = `posts/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (uploadError) {
    throw new Error(`Failed to upload media: ${uploadError.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath)

  return publicUrl
}