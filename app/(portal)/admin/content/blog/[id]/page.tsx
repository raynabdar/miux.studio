import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireFounder } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import type { BlogBlockInput } from '@/lib/cms/validation'
import BlogEditor from '@/components/cms/blog-editor'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Edit post — Miux Studio Admin',
  robots: { index: false, follow: false },
}

export default async function AdminBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireFounder()
  const { id } = await params
  const isNew = id === 'new'
  const post = isNew ? null : await getDb().blogPostCms.findUnique({ where: { id } })
  if (!isNew && !post) notFound()

  const blocks = Array.isArray(post?.blocks) ? (post.blocks as unknown as BlogBlockInput[]) : []

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin/content" className="hover:text-orange-700">Content</Link>
        <span className="mx-2">/</span>
        <Link href="/admin/content/blog" className="hover:text-orange-700">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">{isNew ? 'New post' : 'Edit post'}</span>
      </nav>
      <h1 className="mb-6 text-2xl tracking-tight sm:text-3xl">{isNew ? 'New post' : post?.title}</h1>
      <BlogEditor
        id={isNew ? '' : id}
        initial={{
          slug: post?.slug ?? '',
          title: post?.title ?? '',
          excerpt: post?.excerpt ?? '',
          category: post?.category ?? '',
          image: post?.image ?? '',
          readTime: post?.readTime ?? '',
          authorName: post?.authorName ?? 'Miux Studio',
          authorRole: post?.authorRole ?? '',
          seoTitle: post?.seoTitle ?? '',
          seoDescription: post?.seoDescription ?? '',
          status: post?.status ?? 'draft',
          publishAt: post?.publishAt ? post.publishAt.toISOString().slice(0, 16) : '',
          blocks,
        }}
      />
    </main>
  )
}
