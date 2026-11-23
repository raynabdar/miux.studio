'use client'

import { useState } from 'react'
import type { BlogBlockInput } from '@/lib/cms/validation'
import { saveBlogPost, uploadContentImage } from '@/app/(portal)/admin/content/actions'

type PostState = {
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  readTime: string
  authorName: string
  authorRole: string
  seoTitle: string
  seoDescription: string
  status: 'draft' | 'published'
  publishAt: string
  blocks: BlogBlockInput[]
}

const input = 'mt-1 block w-full rounded-xl border border-[#141414]/15 bg-white px-3 py-2 text-sm'
const small = 'rounded-full border border-[#141414]/15 bg-white px-3 py-1 text-xs font-semibold'

const BLOCK_TYPES = [
  ['heading', 'Heading'],
  ['paragraph', 'Paragraph'],
  ['image', 'Image'],
  ['quote', 'Quote'],
  ['code', 'Code'],
  ['ordered-list', 'Ordered list'],
  ['unordered-list', 'Unordered list'],
] as const

type BlockType = (typeof BLOCK_TYPES)[number][0]

function newBlock(type: BlockType): BlogBlockInput {
  switch (type) {
    case 'heading':
      return { type, text: '' }
    case 'paragraph':
      return { type, text: '' }
    case 'image':
      return { type, url: '', alt: '' }
    case 'quote':
      return { type, text: '', cite: '' }
    case 'code':
      return { type, code: '', language: '' }
    default:
      return { type, items: [''] }
  }
}

export default function BlogEditor({ id, initial }: { id: string; initial: PostState }) {
  const [post, setPost] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const set = <K extends keyof PostState>(key: K, value: PostState[K]) =>
    setPost((current) => ({ ...current, [key]: value }))

  const updateBlock = (index: number, block: BlogBlockInput) =>
    setPost((current) => ({
      ...current,
      blocks: current.blocks.map((item, i) => (i === index ? block : item)),
    }))

  const moveBlock = (index: number, direction: -1 | 1) =>
    setPost((current) => {
      const target = index + direction
      if (target < 0 || target >= current.blocks.length) return current
      const blocks = [...current.blocks]
      ;[blocks[index], blocks[target]] = [blocks[target], blocks[index]]
      return { ...current, blocks }
    })

  const removeBlock = (index: number) =>
    setPost((current) => ({ ...current, blocks: current.blocks.filter((_, i) => i !== index) }))

  const addBlock = (type: BlockType) =>
    setPost((current) => ({ ...current, blocks: [...current.blocks, newBlock(type)] }))

  async function upload(file: File, apply: (url: string) => void) {
    setUploading(true)
    setError('')
    const data = new FormData()
    data.set('file', file)
    const result = await uploadContentImage(data)
    setUploading(false)
    if (result.ok) apply(result.url)
    else setError(result.message)
  }

  const payload = JSON.stringify({
    ...post,
    image: post.image,
    publishAt: post.publishAt,
    blocks: post.blocks,
  })

  return (
    <form action={saveBlogPost} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="payload" value={payload} />

      <section className="grid gap-3 rounded-[24px] border border-[#141414]/10 bg-white/70 p-6 sm:grid-cols-2">
        <label className="text-xs text-[#5C5A55]">Title
          <input name="title" value={post.title} onChange={(e) => set('title', e.target.value)} className={input} required />
        </label>
        <label className="text-xs text-[#5C5A55]">Slug
          <input value={post.slug} onChange={(e) => set('slug', e.target.value)} placeholder="my-post" className={input} required />
        </label>
        <label className="text-xs text-[#5C5A55] sm:col-span-2">Excerpt
          <textarea value={post.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={2} className={input} required />
        </label>
        <label className="text-xs text-[#5C5A55]">Category
          <input value={post.category} onChange={(e) => set('category', e.target.value)} className={input} />
        </label>
        <label className="text-xs text-[#5C5A55]">Read time
          <input value={post.readTime} onChange={(e) => set('readTime', e.target.value)} placeholder="6 min read" className={input} />
        </label>
        <label className="text-xs text-[#5C5A55]">Author
          <input value={post.authorName} onChange={(e) => set('authorName', e.target.value)} className={input} />
        </label>
        <label className="text-xs text-[#5C5A55]">Author role
          <input value={post.authorRole} onChange={(e) => set('authorRole', e.target.value)} className={input} />
        </label>
        <label className="text-xs text-[#5C5A55] sm:col-span-2">Featured image URL
          <input value={post.image} onChange={(e) => set('image', e.target.value)} placeholder="https://" className={input} />
        </label>
        <label className="text-xs text-[#5C5A55]">Upload featured image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className={`${input} py-1`}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void upload(file, (url) => set('image', url))
            }}
          />
        </label>
        <label className="text-xs text-[#5C5A55]">Status
          <select
            value={post.status}
            onChange={(e) => set('status', e.target.value === 'published' ? 'published' : 'draft')}
            className={input}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label className="text-xs text-[#5C5A55]">Publish at (optional, UTC)
          <input
            type="datetime-local"
            value={post.publishAt}
            onChange={(e) => set('publishAt', e.target.value)}
            className={input}
          />
        </label>
        <label className="text-xs text-[#5C5A55]">SEO title
          <input value={post.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} className={input} />
        </label>
        <label className="text-xs text-[#5C5A55]">SEO description
          <input value={post.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} className={input} />
        </label>
      </section>

      <section className="space-y-3">
        {post.blocks.map((block, index) => (
          <div key={index} className="rounded-2xl border border-[#141414]/10 bg-white/70 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A857C]">
                {index + 1} · {block.type.replace('-', ' ')}
              </span>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveBlock(index, -1)} className={small}>↑</button>
                <button type="button" onClick={() => moveBlock(index, 1)} className={small}>↓</button>
                <button type="button" onClick={() => removeBlock(index)} className={small}>Remove</button>
              </div>
            </div>
            {block.type === 'heading' && (
              <input
                value={block.text}
                onChange={(e) => updateBlock(index, { type: 'heading', text: e.target.value })}
                placeholder="Section heading"
                className={input}
              />
            )}
            {block.type === 'paragraph' && (
              <textarea
                value={block.text}
                onChange={(e) => updateBlock(index, { type: 'paragraph', text: e.target.value })}
                rows={4}
                className={input}
              />
            )}
            {block.type === 'quote' && (
              <div className="grid gap-2">
                <textarea
                  value={block.text}
                  onChange={(e) => updateBlock(index, { type: 'quote', text: e.target.value, cite: block.cite })}
                  rows={2}
                  className={input}
                />
                <input
                  value={block.cite}
                  onChange={(e) => updateBlock(index, { type: 'quote', text: block.text, cite: e.target.value })}
                  placeholder="Cite (optional)"
                  className={input}
                />
              </div>
            )}
            {block.type === 'code' && (
              <div className="grid gap-2">
                <textarea
                  value={block.code}
                  onChange={(e) => updateBlock(index, { type: 'code', code: e.target.value, language: block.language })}
                  rows={5}
                  className={`${input} font-mono text-xs`}
                />
                <input
                  value={block.language}
                  onChange={(e) => updateBlock(index, { type: 'code', code: block.code, language: e.target.value })}
                  placeholder="Language"
                  className={input}
                />
              </div>
            )}
            {block.type === 'image' && (
              <div className="grid gap-2">
                <input
                  value={block.url}
                  onChange={(e) => updateBlock(index, { type: 'image', url: e.target.value, alt: block.alt })}
                  placeholder="https://"
                  className={input}
                />
                <input
                  value={block.alt}
                  onChange={(e) => updateBlock(index, { type: 'image', url: block.url, alt: e.target.value })}
                  placeholder="Alt text"
                  className={input}
                />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className={`${input} py-1`}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void upload(file, (url) => updateBlock(index, { type: 'image', url, alt: block.alt }))
                  }}
                />
              </div>
            )}
            {(block.type === 'ordered-list' || block.type === 'unordered-list') && (
              <textarea
                value={block.items.join('\n')}
                onChange={(e) =>
                  updateBlock(index, {
                    type: block.type,
                    items: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
                  })
                }
                rows={4}
                placeholder="One item per line"
                className={input}
              />
            )}
          </div>
        ))}
        {post.blocks.length === 0 && (
          <p className="text-sm text-[#8A857C]">No blocks yet. Add at least one below.</p>
        )}
      </section>

      <section className="rounded-2xl border border-[#141414]/10 bg-white/70 p-4">
        <p className="mb-2 text-sm font-semibold">Add a block</p>
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map(([type, label]) => (
            <button key={type} type="button" onClick={() => addBlock(type)} className={small}>
              + {label}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="text-xs text-red-700">{error}</p>}
      {uploading && <p className="text-xs text-[#8A857C]">Uploading image…</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-[#141414] px-5 py-2 text-xs font-semibold text-[#F6F5F0]"
        >
          Save post
        </button>
        <span className="text-[11px] text-[#8A857C]">
          Drafts and scheduled posts stay off the public journal until published.
        </span>
      </div>
    </form>
  )
}
