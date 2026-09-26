import { ComponentLabEditorProof } from "../component-lab-editor-proof";

export default function ComponentEditorPage() {
  return (
    <main className="min-h-screen bg-[var(--sb-desktop)] p-6 text-card-foreground">
      <section className="mx-auto max-w-7xl space-y-4">
        <header>
          <h1 className="text-2xl font-semibold">Component Editor</h1>
          <p className="mt-1 text-sm text-muted-foreground">Presentation/composition-only authoring surface. Component contracts remain separate from application manifests and window geometry.</p>
        </header>
        <ComponentLabEditorProof />
      </section>
    </main>
  );
}
