'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Page, { type PageData } from './Page'

export default function Pageflow({ pages }: { pages: PageData[] }) {
    const ref = useRef<HTMLDivElement>(null)
    const [index, setIndex] = useState(0)
    const snapping = useRef(false)
    const raf = useRef<number | null>(null)
    const timer = useRef<number | null>(null)

    const width = () => (ref.current ? ref.current.clientWidth : 1)
    const clamp = (i: number) => Math.max(0, Math.min(i, pages.length - 1))
    const nearest = () => {
        const el = ref.current
        if (!el) return 0
        return Math.round(el.scrollLeft / width())
    }

    const snapTo = useCallback((i: number) => {
        const el = ref.current; if (!el) return
        const idx = clamp(i)
        snapping.current = true
        el.scrollTo({ left: idx * width(), behavior: 'smooth' })
        setIndex(idx)
        window.setTimeout(() => (snapping.current = false), 260)
    }, [pages.length])

    const snapToNearest = useCallback(() => {
        if (snapping.current) return
        snapTo(nearest())
    }, [snapTo])

    const onScroll = useCallback(() => {
        if (snapping.current) return
        if (raf.current) cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(() => {
            if (timer.current) window.clearTimeout(timer.current)
            timer.current = window.setTimeout(snapToNearest, 120) as unknown as number
        })
    }, [snapToNearest])

    // Wheel fallback: map any wheel gesture to left/right page
    const onWheel = useCallback((e: WheelEvent) => {
        if (pages.length <= 1) return
        // treat the stronger axis as intent; default to deltaY for mice
        const absX = Math.abs(e.deltaX), absY = Math.abs(e.deltaY)
        const axis = absX > absY ? e.deltaX : e.deltaY
        if (axis === 0) return
        e.preventDefault()
        if (snapping.current) return
        snapTo(index + (axis > 0 ? 1 : -1))
    }, [index, snapTo, pages.length])

    // Keyboard: ← →
    const onKey = useCallback((e: KeyboardEvent) => {
        if (snapping.current || pages.length <= 1) return
        if (e.key === 'ArrowRight') { e.preventDefault(); snapTo(index + 1) }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); snapTo(index - 1) }
    }, [index, snapTo, pages.length])

    useEffect(() => {
        const el = ref.current; if (!el) return
        el.addEventListener('scroll', onScroll, { passive: true })
        el.addEventListener('wheel', onWheel, { passive: false })
        window.addEventListener('keydown', onKey)

        const onResize = () => snapToNearest()
        window.addEventListener('resize', onResize)
        window.addEventListener('orientationchange', onResize)

        return () => {
            el.removeEventListener('scroll', onScroll as any)
            el.removeEventListener('wheel', onWheel as any)
            window.removeEventListener('keydown', onKey)
            window.removeEventListener('resize', onResize)
            window.removeEventListener('orientationchange', onResize)
            if (raf.current) cancelAnimationFrame(raf.current)
            if (timer.current) window.clearTimeout(timer.current)
        }
    }, [onScroll, onWheel, onKey, snapToNearest])

    // Click handlers for explicit nav
    const goPrev = () => snapTo(index - 1)
    const goNext = () => snapTo(index + 1)

    return (
        <div className="relative h-full w-full">
            <div
                ref={ref}
                className="pageflow-x flex h-full w-full overflow-x-auto focus:outline-none select-none"
                tabIndex={0}
            >
                {pages.map((p, i) => (
                    <div key={i} className="min-w-full h-full">
                        <Page page={p} />
                    </div>
                ))}
            </div>

            {/* Page indicator */}
            <div className="pointer-events-none absolute bottom-3 right-3 text-xs bg-black/55 text-white rounded px-2 py-1">
                {index + 1} / {pages.length}
            </div>

            {/* Click nav buttons (auto-hide on small screens if you want) */}
            {pages.length > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Previous page"
                        onClick={goPrev}
                        disabled={index === 0}
                        className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-vr-line bg-black/35 backdrop-blur text-white hover:border-gray-300 disabled:opacity-40"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        aria-label="Next page"
                        onClick={goNext}
                        disabled={index === pages.length - 1}
                        className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-vr-line bg-black/35 backdrop-blur text-white hover:border-gray-300 disabled:opacity-40"
                    >
                        ›
                    </button>
                </>
            )}
        </div>
    )
}
