'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Page, { type PageData } from './Page'

const ALLOWED = new Set(['text', 'cover', 'wrap-left', 'wrap-right', 'split-50', 'grid-2'] as const)

function normalize(p: any): PageData {
    const layout =
        typeof p?.layout === 'string' && ALLOWED.has(p.layout as any)
            ? (p.layout as PageData['layout'])
            : undefined
    return { ...p, layout }
}

export default function Pageflow({ pages }: { pages: any[] }) {
    const safePages: PageData[] = pages.map(normalize)

    const ref = useRef<HTMLDivElement>(null)
    const [index, setIndex] = useState(0)

    const snapToNearest = useCallback(() => {
        const el = ref.current
        if (!el) return
        const w = el.clientWidth || 1
        const next = Math.round(el.scrollLeft / w)
        const clamped = Math.max(0, Math.min(next, safePages.length - 1))
        setIndex(clamped)
    }, [safePages.length])

    const onScroll = useCallback(() => requestAnimationFrame(snapToNearest), [snapToNearest])

    useEffect(() => {
        const handle = () => snapToNearest()
        window.addEventListener('resize', handle)
        window.addEventListener('orientationchange', handle)
        return () => {
            window.removeEventListener('resize', handle)
            window.removeEventListener('orientationchange', handle)
        }
    }, [snapToNearest])

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                const next = Math.min(index + 1, safePages.length - 1)
                el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
                setIndex(next)
            } else if (e.key === 'ArrowLeft') {
                const prev = Math.max(index - 1, 0)
                el.scrollTo({ left: prev * el.clientWidth, behavior: 'smooth' })
                setIndex(prev)
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [index, safePages.length])

    return (
        <div className="relative">
            <div ref={ref} className="pageflow-x flex w-screen overflow-x-auto" onScroll={onScroll}>
                {safePages.map((p, i) => (
                    <div key={i} className="min-w-screen">
                        <Page page={p} />
                    </div>
                ))}
            </div>

            <div className="pointer-events-none absolute bottom-3 right-4 text-xs bg-black/55 text-white rounded px-2 py-1">
                {index + 1} / {safePages.length}
            </div>
        </div>
    )
}
