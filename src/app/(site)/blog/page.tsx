import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, User, Eye, ArrowRight, Tag } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog - Kuzey Kuruyemis',
  description: 'Kuruyemis, saglikli beslenme ve lezzetli tarifler hakkinda en guncel yazilar.',
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Blog</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Kuruyemis dunyasindan haberler, saglikli beslenme onerileri ve lezzetli tarifler
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Henuz blog yazisi bulunmuyor.</p>
          <Link href="/" className="btn-primary">Anasayfaya Don</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={`group ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                {/* Image */}
                <div className={`relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 ${index === 0 ? 'h-64 md:h-80' : 'h-48'}`}>
                  {post.image ? (
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${post.image})` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl opacity-30">📝</span>
                    </div>
                  )}
                  {post.tags && (
                    <div className="absolute top-3 left-3 flex gap-2">
                      {post.tags.split(',').slice(0, 2).map((tag, i) => (
                        <span key={i} className="bg-primary/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {post.viewCount}
                    </span>
                  </div>

                  <h2 className={`font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors ${index === 0 ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-1 text-accent font-medium text-sm mt-auto">
                    Devamini Oku
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
