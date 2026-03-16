import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || null,
        image: data.image || null,
        author: data.author || 'Admin',
        tags: data.tags || null,
        isPublished: data.isPublished ?? false,
      },
    })
    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
