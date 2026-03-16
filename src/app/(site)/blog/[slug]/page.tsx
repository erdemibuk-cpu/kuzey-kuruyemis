import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, Eye, ChevronRight, ArrowLeft, Tag } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!post) return { title: 'Yazi Bulunamadi' }
  return {
    title: `${post.title} - Kuzey Kuruyemis Blog`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author],
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, isPublished: true },
  })

  if (!post) return notFound()

  // Goruntulenme sayisini artir
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  })

  // Son yazilar
  const recentPosts = await prisma.blogPost.findMany({
    where: { isPublished: true, id: { not: post.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const tags = post.tags?.split(',').map(t => t.trim()).filter(Boolean) || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link href="/blog" className="hover:text-primary">Blog</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 line-clamp-1">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        {/* Main Content */}
        <article className="lg:col-span-2">
          {/* Header Image */}
          {post.image && (
            <div className="rounded-2xl overflow-hidden mb-8 h-64 md:h-96">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image})` }}
              />
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, i) => (
                <span key={i} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">{post.title}</h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} />
              {post.viewCount + 1} goruntulenme
            </span>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed
              prose-headings:text-gray-800 prose-headings:font-bold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back */}
          <div className="mt-10 pt-6 border-t">
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              <ArrowLeft size={16} />
              Tum Yazilar
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Recent Posts */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Son Yazilar</h3>
            {recentPosts.length === 0 ? (
              <p className="text-sm text-gray-500">Baska yazi bulunmuyor.</p>
            ) : (
              <div className="space-y-4">
                {recentPosts.map(p => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-3 group">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {p.image ? (
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">📝</div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                        {p.title}
                      </h4>
                      <span className="text-xs text-gray-400 mt-1">
                        {new Date(p.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Categories Quick Links */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              {['Kuruyemisler', 'Kuru Meyveler', 'Baharatlar', 'Kahve & Cay'].map(cat => (
                <li key={cat}>
                  <Link href={`/${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-sm text-gray-600 hover:text-primary transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
