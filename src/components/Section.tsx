export default function Section({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <section className="mb-6">
            {title && <h3 className="mb-2 text-sm uppercase tracking-wide text-vr-sub">{title}</h3>}
            <div className="rounded-2xl border border-vr-line bg-vr-card p-4">
                {children}
            </div>
        </section>
    )
}
