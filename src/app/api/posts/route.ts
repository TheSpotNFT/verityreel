import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

type Page = { image?: string; imageAlign?: 'left' | 'right' | 'center'; text?: string }
type Author = { handle: string; role: 'poster' | 'member' | 'editor' }

function filePath() {
    return path.join(process.cwd(), 'data', 'posts.json')
}

export async function GET() {
    try {
        const data = JSON.parse(fs.readFileSync(filePath(), 'utf-8'))
        return NextResponse.json(data)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as {
            title?: string
            author: Author
            pages: Page[]
        }
        if (!body?.pages?.length) {
            return NextResponse.json({ error: 'No pages' }, { status: 400 })
        }

        const f = filePath()
        const json = JSON.parse(fs.readFileSync(f, 'utf-8'))
        const post = {
            id: 'p-' + crypto.randomUUID(),
            title: body.title ?? 'Untitled',
            author: body.author,
            createdAt: new Date().toISOString(),
            pages: body.pages
        }
        json.posts.unshift(post) // add to top
        fs.writeFileSync(f, JSON.stringify(json, null, 2), 'utf-8')
        return NextResponse.json({ ok: true, id: post.id })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
