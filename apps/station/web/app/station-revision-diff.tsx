import type { RevisionDiffResult } from "./station-workspace-revisions";

export function StationRevisionDiff({ result }: { result: RevisionDiffResult | null }) {
  if (!result) return null;
  return <section aria-label="Revision comparison" className="min-w-0 space-y-2 rounded-md border p-3 text-sm">
    <h3 className="font-semibold">Revision comparison</h3>
    {!result.accepted ? <p>Unable to compare these revisions. Choose compatible files.</p> : <>
      <p>{result.changes.length === 0 ? "No differences." : `${result.changes.length} changed paths.`}</p>
      {result.truncated ? <p className="font-medium">Comparison truncated at 512 paths. Export both files to inspect the complete documents.</p> : null}
      <ol className="max-h-72 min-w-0 space-y-3 overflow-auto" aria-label="Changed paths">
        {result.changes.map(change => <li key={change.path} className="min-w-0 break-words border-t pt-2 [overflow-wrap:anywhere]">
          <p><strong>{change.kind}</strong> <code>{change.path || "/"}</code></p>
          {Object.hasOwn(change, "before") ? <p>Before: <code>{JSON.stringify(change.before)}</code></p> : null}
          {Object.hasOwn(change, "after") ? <p>After: <code>{JSON.stringify(change.after)}</code></p> : null}
        </li>)}
      </ol>
      <p className="text-xs text-muted-foreground">Includes version and provenance metadata. Arrays compare by index; no automatic merge.</p>
    </>}
  </section>;
}
