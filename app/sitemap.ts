import type { MetadataRoute } from 'next'
import { projects, SITE } from '@/lib/data'
import { getPublishedPosts } from '@/lib/cms/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE.url
  const blogPosts = await getPublishedPosts()

  const workEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // lastmod is only emitted where a real publication date exists. Stamping
  // every URL with the current time teaches crawlers to distrust the field.
  const journalEntries: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const published = new Date(post.date)
    return {
      url: `${baseUrl}/blogs/${post.slug}`,
      ...(Number.isNaN(published.getTime()) ? {} : { lastModified: published }),
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  })

  return [
    {
      url: `${baseUrl}`,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...workEntries,
    {
      url: `${baseUrl}/blogs`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...journalEntries,
    {
      url: `${baseUrl}/meeting`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/startups`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/teardown`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sitemap`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/client-terms`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]
}
