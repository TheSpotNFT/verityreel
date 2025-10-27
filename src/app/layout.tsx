import './globals.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import VhFix from '@/components/VhFix'
import SnapY from '@/components/SnapY'

export const metadata: Metadata = {
  title: 'Verity Reel — Pageflow MVP',
  description: 'Vertical feed with full-screen multi-page posts',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{ ['--header-h' as any]: '64px' }}
        className="min-h-screen bg-vr-bg text-vr-text"
      >

        <VhFix />
        <SnapY />
        <header className="h-[var(--header-h)] border-b border-vr-line flex items-center bg-vr-bg/90 backdrop-blur-md sticky top-0 z-50">
          <div className="w-full px-5 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-2xl font-semibold tracking-tight text-vr-green hover:text-white transition">
                Verity Reel
              </Link>
            </div>

            <nav className="flex items-center gap-3 text-sm">
              <Link href="/" className="px-3 py-1 hover:text-vr-green transition">
                Feed
              </Link>
              <Link
                href="/compose"
                className="rounded-xl bg-vr-card px-4 py-2 border border-vr-line hover:border-vr-green hover:text-vr-green transition"
              >
                Compose
              </Link>
            </nav>
          </div>
        </header>

        <main className="h-[calc(var(--vh,1vh)*100-var(--header-h))] overflow-hidden flex items-stretch justify-center">
          {children}
        </main>


      </body>
    </html>
  )
}
