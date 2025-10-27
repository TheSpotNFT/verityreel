'use client'
import Pageflow from './Pageflow'

type Author = { handle: string; role: 'poster' | 'member' | 'editor' }
type PostData = {
    id: string
    title?: string
    createdAt?: string
    author: Author
    pages: Array<{
        layout?: any
        image?: string
        images?: string[]
        imageAlign?: 'left' | 'right' | 'center'
        text?: string
        caption?: string
        credit?: string
    }>
}

function formatDate(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function Post({ post }: { post: PostData }) {
    return (
        <section aria-label={post.title ?? 'Post'} className="relative w-screen h-screen overflow-hidden">
            {/* Header Bar */}
            <header className="absolute top-0 left-0 w-full flex justify-between items-start p-4 z-10 pointer-events-none">
                <div className="pointer-events-auto bg-black/55 backdrop-blur rounded-lg px-3 py-1.5 border border-vr-line">
                    <span className="text-sm font-semibold text-white">@{post.author.handle}</span>
                </div>
                <div className="pointer-events-auto bg-black/55 backdrop-blur rounded-lg px-3 py-1.5 border border-vr-line text-[11px] text-vr-sub">
                    {formatDate(post.createdAt)}
                </div>
            </header>

            {/* Pageflow content */}
            <Pageflow pages={post.pages} />

            {/* Optional footer (like buttons) */}
            <footer className="absolute bottom-4 left-4 z-10 flex gap-3">
                <button className="rounded bg-black/55 backdrop-blur px-3 py-1 border border-vr-line text-sm hover:border-vr-green transition">
                    Like
                </button>
                <button className="rounded bg-black/55 backdrop-blur px-3 py-1 border border-vr-line text-sm hover:border-vr-green transition">
                    Repost
                </button>
            </footer>
        </section>
    )
}
