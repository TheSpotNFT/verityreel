'use client'
import { useState } from 'react'

type PageDraft = { image?: string; imageAlign?: 'left' | 'right' | 'center'; text?: string }

export default function ComposePage() {
    const [title, setTitle] = useState('')
    const [handle, setHandle] = useState('creator')
    const [pages, setPages] = useState<PageDraft[]>([
        { text: 'Start your story here…', imageAlign: 'center' }
    ])
    const [uploading, setUploading] = useState(false)

    const addPage = () => setPages(p => [...p, { text: '', imageAlign: 'center' }])

    const setPage = (i: number, patch: Partial<PageDraft>) => {
        setPages(prev => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p))
    }

    const onUploadImage = async (i: number, file: File) => {
        setUploading(true)
        try {
            const form = new FormData()
            form.append('file', file)
            const res = await fetch('/api/upload', { method: 'POST', body: form })
            const data = await res.json()
            if (data.url) setPage(i, { image: data.url })
        } finally {
            setUploading(false)
        }
    }

    const submit = async () => {
        const body = {
            title: title || 'Untitled',
            author: { handle, role: 'poster' as const },
            pages
        }
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body)
        })
        if (!res.ok) {
            const e = await res.text()
            alert('Failed: ' + e)
            return
        }
        alert('Posted! Go back to Feed.')
        setTitle('')
        setPages([{ text: 'New page…', imageAlign: 'center' }])
    }

    return (
        <div className="mx-auto max-w-2xl pl-4 pr-4 pt-4">
            <h1 className="text-2xl font-semibold mb-4">Compose (Local Demo)</h1>

            <div className="grid gap-3">
                <label className="text-sm text-vr-sub">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)}
                    className="rounded-lg bg-vr-card border border-vr-line p-3 outline-none" placeholder="Title" />
                <label className="text-sm text-vr-sub">Handle (display)</label>
                <input value={handle} onChange={e => setHandle(e.target.value)}
                    className="rounded-lg bg-vr-card border border-vr-line p-3 outline-none" placeholder="@handle" />
            </div>

            <div className="mt-6 space-y-4">
                {pages.map((p, i) => (
                    <div key={i} className="rounded-xl border border-vr-line p-4 bg-vr-card">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-medium">Page {i + 1}</div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-vr-sub">Image align:</span>
                                <select
                                    value={p.imageAlign ?? 'center'}
                                    onChange={e => setPage(i, { imageAlign: e.target.value as any })}
                                    className="bg-vr-bg border border-vr-line rounded px-2 py-1"
                                >
                                    <option value="left">left</option>
                                    <option value="center">center</option>
                                    <option value="right">right</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <textarea
                                value={p.text ?? ''}
                                onChange={e => setPage(i, { text: e.target.value })}
                                placeholder="Write your page text here…"
                                className="min-h-[120px] rounded-lg bg-vr-bg border border-vr-line p-3"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => e.target.files?.[0] && onUploadImage(i, e.target.files[0])}
                                />
                                {p.image && <span className="text-xs text-vr-sub">Image added ✓</span>}
                                {uploading && <span className="text-xs">Uploading…</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex gap-3">
                <button onClick={addPage} className="rounded bg-vr-card border border-vr-line px-3 py-2">+ Add Page</button>
                <button onClick={submit} className="rounded bg-vr-green text-black px-4 py-2 font-semibold">Publish</button>
            </div>

            <p className="mt-4 text-xs text-vr-sub">
                Local demo: posts append to <code>data/posts.json</code>, images saved under <code>/public/uploads</code>.
            </p>
        </div>
    )
}
