'use client'
import Pageflow from './Pageflow'

type Author = { handle: string; role: 'poster' | 'member' | 'editor' }
type PostData = {
    id: string
    title?: string
    createdAt?: string
    author: Author
    pages: Array<{ image?: string; imageAlign?: 'left' | 'right' | 'center'; text?: string }>
}

export default function Post({ post }: { post: PostData }) {
    return (
        <section aria-label={post.title ?? 'Post'}>
            <header className="absolute z-10 left-4 top-3 text-sm text-vr-sub pointer-events-none">
                <span className="font-semibold text-vr-text">@{post.author.handle}</span>
                <span className="ml-2 rounded bg-vr-card/70 px-2 py-0.5 border border-vr-line">{post.author.role}</span>
                {post.createdAt && <span className="ml-2">{new Date(post.createdAt).toLocaleString()}</span>}
            </header>
            <Pageflow pages={post.pages} />
            <footer className="absolute z-10 left-4 bottom-3 flex items-center gap-3 text-sm">
                <button className="rounded bg-vr-card/70 px-3 py-1 border border-vr-line">Like</button>
                <button className="rounded bg-vr-card/70 px-3 py-1 border border-vr-line">Repost</button>
            </footer>
        </section>
    )
}
