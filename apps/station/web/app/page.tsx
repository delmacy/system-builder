export default function StationFoundationPage() {
  return (
    <main className="min-h-screen p-8">
      <section
        aria-labelledby="station-foundation-title"
        className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-between rounded-2xl border border-[var(--station-border)] bg-[var(--station-panel)] p-8 shadow-2xl"
      >
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[var(--station-accent)]">
            System Builder Station
          </p>
          <h1 id="station-foundation-title" className="text-4xl font-semibold tracking-tight">
            Visual foundation host
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--station-muted)]">
            The Station frontend host is running. Shell, windowing, commands, semantic icons and
            presentation settings are added by the committed visual Work Package tasks.
          </p>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-[var(--station-border)] pt-5 text-sm">
          <span className="text-[var(--station-muted)]">Canonical system state remains outside this host.</span>
          <strong className="rounded-full border border-[var(--station-border)] px-3 py-1.5 font-medium">
            Core: Disconnected
          </strong>
        </div>
      </section>
    </main>
  );
}
