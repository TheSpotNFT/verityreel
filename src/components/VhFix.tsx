'use client'
import { useEffect } from 'react'

export default function VhFix() {
    useEffect(() => {
        const set = () => {
            const vh = window.innerHeight * 0.01
            document.documentElement.style.setProperty('--vh', `${vh}px`)
        }
        set()
        window.addEventListener('resize', set)
        window.addEventListener('orientationchange', set)
        return () => {
            window.removeEventListener('resize', set)
            window.removeEventListener('orientationchange', set)
        }
    }, [])
    return null
}
