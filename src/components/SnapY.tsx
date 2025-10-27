'use client'
import { useEffect, useRef } from 'react'

export default function SnapY({ feedId = 'feed' }: { feedId?: string }) {
    const locking = useRef(false)
    const raf = useRef<number | null>(null)
    const timer = useRef<number | null>(null)

    useEffect(() => {
        const feed = document.getElementById(feedId)
        if (!feed) return

        const viewH = () => feed.clientHeight

        const snapTo = (targetIndex: number) => {
            const h = viewH()
            const max = Math.max(0, Math.round((feed.scrollHeight - h) / h))
            const idx = Math.max(0, Math.min(targetIndex, max))
            locking.current = true
            feed.scrollTo({ top: idx * h, behavior: 'smooth' })
            window.setTimeout(() => { locking.current = false }, 260)
        }

        const nearestIndex = () => {
            const h = viewH()
            return Math.round(feed.scrollTop / h)
        }

        // Wheel -> snap a whole post at a time
        const onWheel = (e: WheelEvent) => {
            e.preventDefault() // stop partial scrolls
            if (locking.current) return
            const dir = e.deltaY > 0 ? 1 : -1
            snapTo(nearestIndex() + dir)
        }

        // Touch/track inertia: when scrolling stops, force nearest snap
        const onScroll = () => {
            if (locking.current) return
            if (raf.current) cancelAnimationFrame(raf.current)
            raf.current = requestAnimationFrame(() => {
                if (timer.current) window.clearTimeout(timer.current)
                timer.current = window.setTimeout(() => snapTo(nearestIndex()), 120) as unknown as number
            })
        }

        // Keyboard support (optional)
        const onKey = (e: KeyboardEvent) => {
            if (locking.current) return
            if (e.key === 'PageDown' || e.key === 'ArrowDown') {
                e.preventDefault(); snapTo(nearestIndex() + 1)
            } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
                e.preventDefault(); snapTo(nearestIndex() - 1)
            }
        }

        feed.addEventListener('wheel', onWheel, { passive: false })
        feed.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('keydown', onKey)

        return () => {
            feed.removeEventListener('wheel', onWheel as any)
            feed.removeEventListener('scroll', onScroll as any)
            window.removeEventListener('keydown', onKey)
            if (raf.current) cancelAnimationFrame(raf.current)
            if (timer.current) window.clearTimeout(timer.current)
        }
    }, [feedId])

    return null
}
