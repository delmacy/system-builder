"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../../packages/ui-core/index";
import type { ArtifactResult, CompositionArtifact } from "../../../../packages/station-editor/index";
import { loadArtifactWorkspace, workspaceDocument, type ArtifactWorkspace } from "./station-artifact-workspace";
import { appendWorkspaceRevision, compareWorkspaceRevisions, type RevisionEntry, type RevisionDiffResult } from "./station-workspace-revisions";
import { StationRevisionDiff } from "./station-revision-diff";

export function StationWorkspaceRevisionSave({ blocked, compositionRef, draftRevision, prepare, feedback }: {
  blocked: boolean; compositionRef: string; draftRevision: number;
  prepare: (previous: CompositionArtifact) => ArtifactResult;
  feedback: (message: string, invalid: boolean) => void;
}) {
  const [snapshot, setSnapshot] = useState<{ workspace: ArtifactWorkspace; text: string | null } | null>(null);
  const [target, setTarget] = useState("");
  const [name, setName] = useState("My revision.composition.json");
  const [ready, setReady] = useState(false);
  const [comparison, setComparison] = useState<{ target: string; draftRevision: number; result: RevisionDiffResult } | null>(null);
  useEffect(() => {
    try {
      const loaded = loadArtifactWorkspace(window.localStorage);
      if (loaded.accepted) { setSnapshot({ workspace: loaded.workspace, text: loaded.storedText }); setReady(true); }
    } catch { /* Explicit refresh reports storage errors without replacing the draft. */ }
  }, []);
  const targets = useMemo(() => {
    const heads = new Map<string, RevisionEntry>();
    for (const file of snapshot?.workspace.files ?? []) {
      const document = workspaceDocument(file);
      if (document?.payload.compositionRef === compositionRef) heads.set(document.artifactId, { file, document });
    }
    return [...heads.values()];
  }, [snapshot, compositionRef]);
  const chosen = targets.find(entry => entry.file.ref === target);
  const refresh = () => {
    try {
      const loaded = loadArtifactWorkspace(window.localStorage);
      if (!loaded.accepted) { setReady(false); feedback("Revision workspace unavailable. Your draft and prior files are unchanged.", true); return; }
      setSnapshot({ workspace: loaded.workspace, text: loaded.storedText }); setTarget(""); setComparison(null); setReady(true);
      feedback("Revision targets refreshed. Choose the retained head and review differences before retrying.", false);
    } catch { setReady(false); feedback("Revision workspace unavailable. Your draft and prior files are unchanged.", true); }
  };
  const compare = () => {
    if (blocked || !chosen) return;
    const candidate = prepare(chosen.document);
    if (!candidate.accepted) { feedback("Unable to prepare this revision. Your draft is unchanged.", true); return; }
    setComparison({ target, draftRevision, result: compareWorkspaceRevisions(chosen.file.text, candidate.text) });
  };
  const save = () => {
    if (blocked || !ready || !snapshot || !chosen) return;
    const candidate = prepare(chosen.document);
    if (!candidate.accepted) { feedback("Unable to prepare this revision. Your draft is unchanged.", true); return; }
    if (candidate.document.artifactVersion === chosen.document.artifactVersion) { feedback("No changed graph to save as a revision.", false); return; }
    try {
      const result = appendWorkspaceRevision(window.localStorage, snapshot.text, { baseRef: chosen.file.ref,
        ref: "file:" + crypto.randomUUID(), name, text: candidate.text });
      if (!result.accepted) {
        if (["storage-conflict", "revision-conflict", "storage-unavailable", "invalid-workspace"].includes(result.reason)) setReady(false);
        feedback(result.reason === "storage-conflict" || result.reason === "revision-conflict"
          ? "Revision conflict. Your draft is preserved. Refresh revision targets, review differences and explicitly retry, or keep an independent copy / Save As file."
          : "Unable to save revision. Check the name, capacity and storage. Your draft and prior revisions are unchanged.", true); return;
      }
      setSnapshot({ workspace: result.workspace, text: result.storedText }); setReady(false); setComparison(null);
      feedback("Workspace revision saved. Earlier revisions, draft and history are unchanged. Refresh revision targets before another save.", false);
    } catch { setReady(false); feedback("Revision workspace unavailable. Your draft and prior revisions are unchanged.", true); }
  };
  return <section aria-label="Save workspace revision" className="min-w-0 space-y-3 border-b p-4">
    <div className="flex min-w-0 flex-wrap items-end gap-3">
      <label className="min-w-0 flex-1 text-sm">Revision target
        <select aria-label="Revision target" className="mt-1 w-full min-w-0 rounded-md border bg-background p-2" value={target} disabled={blocked || !ready}
          onChange={event => { setTarget(event.target.value); setComparison(null); }}>
          <option value="">Choose a retained composition</option>
          {targets.map(entry => <option key={entry.file.ref} value={entry.file.ref}>{entry.file.name} (v{entry.document.artifactVersion})</option>)}
        </select>
      </label>
      <label className="min-w-0 flex-1 text-sm">Revision file name
        <input className="mt-1 w-full min-w-0 rounded-md border bg-background p-2" value={name} maxLength={160}
          disabled={blocked} onChange={event => setName(event.target.value)} />
      </label>
      <Button variant="outline" onClick={refresh} disabled={blocked}>Refresh revision targets</Button>
      <Button variant="outline" onClick={compare} disabled={blocked || !ready || !chosen}>Compare draft with revision</Button>
      <Button onClick={save} disabled={blocked || !ready || !chosen}>Save workspace revision</Button>
    </div>
    <p className="text-xs text-muted-foreground">Appends a revision of the explicitly chosen identity. Latest retained file follows storage order; imports can change it. Existing revisions stay intact.</p>
    <StationRevisionDiff result={!blocked && comparison?.target === target && comparison.draftRevision === draftRevision ? comparison.result : null} />
  </section>;
}
