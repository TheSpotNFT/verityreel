'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Page, { type PageData } from './Page'

export default function Pageflow({ pages }: { pages: PageData[] }) {
    const ref = useRef<HTMLDivElement>(null)
    const [index, setIndex] = useState(0)
    const snapping = useRef(false)
    const raf = useRef<number | null>(null)
    const timer = useRef<number | null>(null)

    const width = () => {
        const el = ref.current
        return el ? el.clientWidth : 1
    }

    const nearest = () => {
        const el = ref.current
        if (!el) return 0
        return Math.round(el.scrollLeft / width())
    }

    const clamp = (i: number) => Math.max(0, Math.min(i, pages.length - 1))

    const snapTo = useCallback((i: number) => {
        const el = ref.current
        if (!el) return
        const idx = clamp(i)
        snapping.current = true
        el.scrollTo({ left: idx * width(), behavior: 'smooth' })
        setIndex(idx)
        // release lock shortly after smooth scroll starts
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
            // when momentum settles, snap to the closest page
            timer.current = window.setTimeout(snapToNearest, 120) as unknown as number
        })
    }, [snapToNearest])

    // Wheel/trackpad → go exactly one page left/right
    const onWheel = useCallback((e: WheelEvent) => {
        // If vertical wheel dominates (e.g., user is scrolling the feed), let it bubble
        const absX = Math.abs(e.deltaX)
        const absY = Math.abs(e.deltaY)
        const horizontalIntent = absX > absY || e.shiftKey

        if (!horizontalIntent) return // don't hijack vertical scrolling outside

        // We own horizontal: prevent partial scrolls
        e.preventDefault()
        if (snapping.current) return

        const dir = (e.deltaX || e.deltaY) > 0 ? 1 : -1
        const next = clamp(index + dir)
        snapTo(next)
    }, [index, snapTo])

    // Keyboard navigation (when container is focused)
    const onKey = useCallback((e: KeyboardEvent) => {
        if (snapping.current) return
        if (e.key === 'ArrowRight') {
            e.preventDefault()
            snapTo(index + 1)
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            snapTo(index - 1)
        }
    }, [index, snapTo])

    // Setup listeners
    useEffect(() => {
        const el = ref.current
        if (!el) return

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

    return (
        <div className="relative">
            <div
                ref={ref}
                className="pageflow-x flex w-screen overflow-x-auto focus:outline-none"
                tabIndex={0}               // allow arrow-key navigation after click/tap
            >
                {pages.map((p, i) => (
                    <div key={i} className="min-w-screen">
                        <Page page={p} />
                    </div>
                ))}
            </div>

            {/* single overlay indicator that updates with index */}
            <div className="pointer-events-none absolute bottom-3 right-4 text-xs bg-black/55 text-white rounded px-2 py-1">
                {index + 1} / {pages.length}
            </div>
        </div>
    )
}
