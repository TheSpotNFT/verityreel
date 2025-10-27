import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
    const name = `${crypto.randomUUID()}.${ext}`
    const full = path.join(uploadsDir, name)
    fs.writeFileSync(full, buffer)

    const url = `/uploads/${name}`
    return NextResponse.json({ url })
}
