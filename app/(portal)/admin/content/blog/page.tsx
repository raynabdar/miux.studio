import type { Metadata } from 'next'
import Link from 'next/link'
import { requireFounder } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import { deleteBlogPost } from '../actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog — Miux Studio Admin',
  robots: { index: false, follow: false },
}

const fmt = (date: Date | null) => (date ? date.toISOString().slice(0, 16).replace('T', ' ') : '—')

export default async function AdminBlogPage() {
  await requireFounder()
  const posts = await getDb().blogPostCms.findMany({ orderBy: { updatedAt: 'desc' } })

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin/content" className="hover:text-orange-700">Content</Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">Blog</span>
      </nav>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl tracking-tight sm:text-3xl">Blog posts</h1>
        <Link
          href="/admin/content/blog/new"
          className="rounded-full bg-[#141414] px-4 py-2 text-xs font-semibold text-[#F6F5F0]"
        >
          New post
        </Link>
      </header>

      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#141414]/10 bg-white/70 p-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold">{post.title}</p>
              <p className="text-[11px] text-[#8A857C]">
                /blogs/{post.slug} · {post.status} · publish {fmt(post.publishAt)} · updated {fmt(post.updatedAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/content/blog/${post.id}`}
                className="rounded-full border border-[#141414]/15 bg-white px-3 py-1 text-xs font-semibold hover:border-orange-500/50"
              >
                Edit
              </Link>
              <form action={deleteBlogPost}>
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className="rounded-full border border-[#141414]/15 bg-white px-3 py-1 text-xs font-semibold">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
        {posts.length === 0 && (
          <li className="text-sm text-[#8A857C]">No posts yet — the public journal shows the built-in posts.</li>
        )}
      </ul>
    </main>
  )
}
