import Image from 'next/image'
import type { ContentBlock } from '@/lib/cms/defaults'

export default function BlogPostBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6 text-[#2B2A27]">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={index} className="pt-4 text-2xl font-semibold tracking-tight text-[#141414]">
                {block.text}
              </h2>
            )
          case 'paragraph':
            return (
              <p key={index} className="text-base leading-relaxed text-[#5C5A55]">
                {block.text}
              </p>
            )
          case 'image':
            return (
              <figure key={index} className="space-y-2">
                <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] border border-[#141414]/10">
                  <Image src={block.url} alt={block.alt || ''} fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
                </div>
                {block.alt && <figcaption className="text-xs text-[#8A857C]">{block.alt}</figcaption>}
              </figure>
            )
          case 'quote':
            return (
              <blockquote key={index} className="border-l-2 border-orange-500/60 pl-4">
                <p className="text-lg italic leading-relaxed text-[#141414]">{block.text}</p>
                {block.cite && <cite className="mt-2 block text-xs not-italic text-[#8A857C]">{block.cite}</cite>}
              </blockquote>
            )
          case 'code':
            return (
              <pre key={index} className="overflow-x-auto rounded-[16px] bg-[#141414] p-4 text-xs leading-relaxed text-[#F6F5F0]">
                <code>{block.code}</code>
              </pre>
            )
          case 'ordered-list':
            return (
              <ol key={index} className="list-decimal space-y-1.5 pl-6 text-base leading-relaxed text-[#5C5A55]">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ol>
            )
          case 'unordered-list':
            return (
              <ul key={index} className="list-disc space-y-1.5 pl-6 text-base leading-relaxed text-[#5C5A55]">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
