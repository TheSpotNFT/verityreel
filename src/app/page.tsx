import fs from 'node:fs'
import path from 'node:path'
import Post from '@/components/Post'

type PageData = {
  layout?: 'cover' | 'wrap-left' | 'wrap-right' | 'split-50' | 'grid-2' | 'text'
  image?: string
  images?: string[]
  imageAlign?: 'left' | 'right' | 'center'
  text?: string
  caption?: string
  credit?: string
}

type PostType = {
  id: string
  title?: string
  createdAt?: string
  author: { handle: string; role: 'poster' | 'member' | 'editor' }
  pages: PageData[]
}

function readPosts(): PostType[] {
  try {
    const file = path.join(process.cwd(), 'data', 'posts.json')
    const raw = fs.readFileSync(file, 'utf-8')
    const json = JSON.parse(raw)
    const posts = (json?.posts ?? []) as PostType[]

    // strict reverse-chronological (newest → oldest)
    posts.sort((a, b) => (Date.parse(b.createdAt ?? '') || 0) - (Date.parse(a.createdAt ?? '') || 0))
    return posts
  } catch {
    return []
  }
}

export default function FeedPage() {
  const posts = readPosts()
  return (
    <div id="feed" className="feed-y">
      {posts.length === 0 && (
        <section className="flex items-center justify-center">
          <p>No posts yet.</p>
        </section>
      )}
      {posts.map(p => <Post key={p.id} post={p} />)}
    </div>
  )
}
