import { randomUUID } from 'node:crypto'

const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

const MAX_BYTES = 2 * 1024 * 1024

export type UploadResult = { ok: true; url: string } | { ok: false; message: string }

// Server-only upload to Supabase Storage using the service role key. Images are
// content-addressed by a random id; MIME and size are validated before upload.
export async function uploadImage(file: File, folder: 'logos' | 'blog'): Promise<UploadResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'cms-media'

  if (!url || !serviceKey) {
    return { ok: false, message: 'Image storage is not configured. Set SUPABASE_SERVICE_ROLE_KEY.' }
  }
  if (!file || file.size === 0) return { ok: false, message: 'Choose an image file.' }
  if (file.size > MAX_BYTES) return { ok: false, message: 'Images must be 2 MB or smaller.' }

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) return { ok: false, message: 'Use a PNG, JPEG, or WebP image.' }

  const path = `${folder}/${randomUUID()}.${ext}`
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': file.type,
      'x-upsert': 'false',
    },
    body: await file.arrayBuffer(),
  })

  if (!response.ok) {
    console.error('[cms] upload failed', response.status, (await response.text()).slice(0, 200))
    return { ok: false, message: 'Upload failed. Check the storage bucket and permissions.' }
  }

  return { ok: true, url: `${url}/storage/v1/object/public/${bucket}/${path}` }
}
