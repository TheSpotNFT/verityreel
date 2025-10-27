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
        <section className="relative w-screen h-[calc(var(--vh,1vh)*100-var(--header-h))] overflow-hidden">
            {/* Centering shell that matches the feed section height */}
            <div className="frame-shell">
                {/* The phone-like frame that holds horizontal pages */}
                <div className="phone-frame relative bg-vr-card">
                    {/* Overlays are positioned relative to the frame */}
                    <header className="absolute top-0 left-0 w-full flex justify-between items-start p-3 md:p-4 z-10 pointer-events-none">
                        <div className="pointer-events-auto bg-black/55 backdrop-blur rounded-lg px-2.5 py-1.5 border border-vr-line">
                            <span className="text-sm font-semibold text-white">@{post.author.handle}</span>
                        </div>
                        <div className="pointer-events-auto bg-black/55 backdrop-blur rounded-lg px-2.5 py-1.5 border border-vr-line text-[11px] text-vr-sub">
                            {formatDate(post.createdAt)}
                        </div>
                    </header>

                    {/* Pageflow fills the frame */}
                    <Pageflow pages={post.pages} />

                    {/* Optional footer actions inside the frame */}
                    <footer className="absolute bottom-3 left-3 z-10 flex gap-3">
                        <button className="rounded bg-black/55 backdrop-blur px-3 py-1 border border-vr-line text-sm hover:border-vr-green transition">
                            Like
                        </button>
                        <button className="rounded bg-black/55 backdrop-blur px-3 py-1 border border-vr-line text-sm hover:border-vr-green transition">
                            Repost
                        </button>
                        <button className="rounded bg-black/55 backdrop-blur px-3 py-1 border border-vr-line text-sm hover:border-vr-green transition">
                            Comments
                        </button>
                    </footer>
                </div>
            </div>
        </section>
    )
}
