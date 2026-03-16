import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadi' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Dosya adini olustur
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: 'Gecersiz dosya formati. Izin verilen: ' + allowed.join(', ') }, { status: 400 })
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    const url = `/uploads/${fileName}`
    return NextResponse.json({ url, fileName })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
