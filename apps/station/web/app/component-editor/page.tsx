import { StationEditorWorkbench } from "../station-editor-workbench";

export default function ComponentEditorPage() {
  return (
    <main className="min-h-screen bg-[var(--sb-desktop)] p-4 text-card-foreground sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <header>
          <h1 className="text-2xl font-semibold">Composition Editor</h1>
          <p className="mt-1 text-sm text-muted-foreground">Select a layer, adjust its grid size, then save or discard your changes.</p>
        </header>
        <StationEditorWorkbench />
      </div>
    </main>
  );
}
