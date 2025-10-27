'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Page from './Page'

type PageType = { image?: string; images?: string[]; layout?: string; imageAlign?: 'left' | 'right' | 'center'; text?: string }

export default function Pageflow({ pages }: { pages: PageType[] }) {
    const ref = useRef<HTMLDivElement>(null)
    const [index, setIndex] = useState(0)

    const snapToNearest = useCallback(() => {
        const el = ref.current
        if (!el) return
        const w = el.clientWidth || 1
        const next = Math.round(el.scrollLeft / w)
        const clamped = Math.max(0, Math.min(next, pages.length - 1))
        setIndex(clamped)
    }, [pages.length])

    // Update on scroll
    const onScroll = useCallback(() => {
        // Throttle a bit with rAF for smooth UI
        requestAnimationFrame(snapToNearest)
    }, [snapToNearest])

    // Recalculate on resize (viewport changes)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const handle = () => snapToNearest()
        window.addEventListener('resize', handle)
        window.addEventListener('orientationchange', handle)
        return () => {
            window.removeEventListener('resize', handle)
            window.removeEventListener('orientationchange', handle)
        }
    }, [snapToNearest])

    // Optional: keyboard nav (← →)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                const next = Math.min(index + 1, pages.length - 1)
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
    }, [index, pages.length])

    return (
        <div className="relative">
            <div
                ref={ref}
                className="pageflow-x flex w-screen overflow-x-auto"
                onScroll={onScroll}
            >
                {pages.map((p, i) => (
                    <div key={i} className="min-w-screen">
                        <Page page={p} />
                    </div>
                ))}
            </div>

            {/* Single global indicator that updates with scroll */}
            <div className="pointer-events-none absolute bottom-3 right-4 text-xs bg-black/55 text-white rounded px-2 py-1">
                {index + 1} / {pages.length}
            </div>
        </div>
    )
}
