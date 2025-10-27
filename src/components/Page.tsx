'use client'
import Image from 'next/image'
import clsx from 'clsx'

export type PageData = {
    layout?: 'cover' | 'wrap-left' | 'wrap-right' | 'split-50' | 'grid-2' | 'text'
    image?: string
    images?: string[]
    imageAlign?: 'left' | 'right' | 'center'
    text?: string
    caption?: string
    credit?: string
}

export default function Page({ page }: { page: PageData }) {
    const layout =
        page.layout ??
        (page.imageAlign === 'left' ? 'wrap-left'
            : page.imageAlign === 'right' ? 'wrap-right'
                : page.image ? 'cover' : 'text')

    return (
        <div className="shrink-0 w-full h-full overflow-hidden pb-12">
            {layout === 'cover' && <Cover page={page} />}
            {layout === 'wrap-left' && <Wrap page={page} side="left" />}
            {layout === 'wrap-right' && <Wrap page={page} side="right" />}
            {layout === 'split-50' && <Split50 page={page} />}
            {layout === 'grid-2' && <Grid2 page={page} />}
            {layout === 'text' && <TextOnly page={page} />}
        </div>
    )
}

/* Cover */
function Cover({ page }: { page: PageData }) {
    const { image, caption, credit } = page
    return (
        <div className="relative h-full w-full bg-black">
            {image && (
                <Image
                    src={image}
                    alt={caption ?? ''}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                />
            )}
            {(caption || credit) && (
                <div className="absolute bottom-3 left-0 right-0 px-4 text-xs text-zinc-200/90">
                    <span className="bg-black/55 rounded px-2 py-1">
                        {caption}{credit ? ` — ${credit}` : ''}
                    </span>
                </div>
            )}
        </div>
    )
}

/* Wrap */
function Wrap({ page, side }: { page: PageData; side: 'left' | 'right' }) {
    const { image, text, caption } = page
    return (
        <div className="h-full w-full p-4 bg-vr-card">
            {image && (
                <img
                    src={image}
                    alt={caption ?? ''}
                    loading="lazy"
                    decoding="async"
                    className={clsx('rounded-lg border border-vr-line',
                        side === 'left' ? 'float-left-wrap' : 'float-right-wrap')}
                />
            )}
            {text && <div className="leading-relaxed text-[16px] md:text-[18px] whitespace-pre-wrap">{text}</div>}
            <div className="clear-both" />
        </div>
    )
}

/* Split 50/50 */
function Split50({ page }: { page: PageData }) {
    const { image, text, caption } = page
    return (
        <div className="h-full w-full bg-vr-card">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="relative min-h-[40vh] md:h-full border-b md:border-b-0 md:border-r border-vr-line">
                    {image && (
                        <Image
                            src={image}
                            alt={caption ?? ''}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            priority
                        />
                    )}
                </div>
                <div className="p-5 md:p-7 overflow-hidden">
                    {text && <div className="leading-relaxed text-[16px] md:text-[18px] whitespace-pre-wrap">{text}</div>}
                    {caption && <div className="mt-3 text-xs text-vr-sub">{caption}</div>}
                </div>
            </div>
        </div>
    )
}

/* Grid 2 */
function Grid2({ page }: { page: PageData }) {
    const imgs = page.images?.slice(0, 2) ?? (page.image ? [page.image] : [])
    return (
        <div className="h-full w-full bg-vr-card">
            <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-[2px] h-[68%] md:h-[70%]">
                {imgs.map((src, i) => (
                    <div key={i} className="relative">
                        <Image src={src} alt="" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority={i === 0} />
                    </div>
                ))}
            </div>
            {page.text && (
                <div className="h-[32%] md:h-[30%] p-4 overflow-hidden leading-relaxed text-[16px] md:text-[18px] whitespace-pre-wrap">
                    {page.text}
                </div>
            )}
        </div>
    )
}

/* Text only */
function TextOnly({ page }: { page: PageData }) {
    return (
        <div className="h-full w-full p-6 md:p-10 bg-vr-card">
            <p className="leading-relaxed text-[18px] md:text-[20px] whitespace-pre-wrap">{page.text ?? ''}</p>
        </div>
    )
}
