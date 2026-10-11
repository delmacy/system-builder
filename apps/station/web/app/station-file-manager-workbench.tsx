"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../../../packages/ui-core/index";
import { emptyArtifactWorkspace, loadArtifactWorkspace, mutateArtifactWorkspace, readWorkspaceComposition, workspaceDocument,
  WORKSPACE_ROOT, type ArtifactWorkspace, type WorkspaceIntent } from "./station-artifact-workspace";
import { workspaceFolderLabel } from "./station-file-manager-app";
import { requestArtifactDownload } from "./station-editor-files";
import { compareWorkspaceRevisions, workspaceRevisions } from "./station-workspace-revisions";
import { StationRevisionDiff } from "./station-revision-diff";

export function StationFileManagerWorkbench({ onOpen }: { onOpen: (text: string) => void }) {
  const [view, setView] = useState<{ workspace: ArtifactWorkspace; text: string | null }>(() => ({ workspace: emptyArtifactWorkspace(), text: null }));
  const [folder, setFolder] = useState(WORKSPACE_ROOT);
  const [selected, setSelected] = useState<string | null>(null);
  const [comparisonRef, setComparisonRef] = useState("");
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Opening your local workspace…");
  const input = useRef<HTMLInputElement>(null);
  const sequence = useRef(0);
  const refresh = useCallback(() => {
    sequence.current++;
    try {
      const result = loadArtifactWorkspace(window.localStorage);
      if (!result.accepted) { setReady(false); setMessage("Workspace unavailable or invalid. Prior visible files are preserved. Retry Refresh workspace."); return; }
      setView({ workspace: result.workspace, text: result.storedText }); setReady(true); setSelected(null); setComparisonRef("");
      setFolder(current => result.workspace.folders.some(f => f.ref === current) ? current : WORKSPACE_ROOT);
      setMessage("Workspace refreshed.");
    } catch { setReady(false); setMessage("Workspace unavailable. Prior files are unchanged."); }
  }, []);
  useEffect(() => {
    refresh();
    return () => { sequence.current++; };
  }, [refresh]);
  const navigate = (ref: string) => { sequence.current++; setFolder(ref); setSelected(null); setComparisonRef(""); };
  const selectFile = (ref: string) => { setSelected(ref); setComparisonRef(""); };
  const mutate = (intent: WorkspaceIntent, expected = view.text) => {
    try {
      const result = mutateArtifactWorkspace(window.localStorage, expected, intent);
      if (!result.accepted) {
        if (result.reason === "storage-conflict" || result.reason === "storage-unavailable" || result.reason === "invalid-workspace") setReady(false);
        setMessage(result.reason === "storage-conflict" ? "Workspace changed. Refresh workspace before retrying." :
          "Unable to store this item. Check its name, capacity and storage. Prior files are unchanged."); return false;
      }
      setView({ workspace: result.workspace, text: result.storedText }); setReady(true);
      setMessage(intent.type === "create-folder" ? "Folder created." : "Composition imported.");
      return true;
    } catch { setReady(false); setMessage("Workspace unavailable. Prior files are unchanged."); return false; }
  };
  const importFile = async (file: File) => {
    const request = ++sequence.current, target = folder, expected = view.text;
    const result = await readWorkspaceComposition(file);
    if (request !== sequence.current) return;
    if (!result.accepted) { setMessage("Unable to import this composition. Use a valid .composition.json file; prior files are unchanged."); return; }
    if (mutate({ type: "append-file", ref: "file:" + crypto.randomUUID(), folderRef: target, name: file.name, text: result.text }, expected)) setSelected(null);
  };
  const chosen = view.workspace.files.find(f => f.ref === selected);
  const document = useMemo(() => chosen ? workspaceDocument(chosen) : null, [chosen]);
  const revisions = useMemo(() => selected ? workspaceRevisions(view.workspace, selected) : [], [view.workspace, selected]);
  const comparison = useMemo(() => {
    const before = revisions.find(entry => entry.file.ref === comparisonRef);
    return before && chosen ? compareWorkspaceRevisions(before.file.text, chosen.text) : null;
  }, [revisions, comparisonRef, chosen]);
  const open = () => {
    if (!ready || !chosen) return;
    try {
      const current = loadArtifactWorkspace(window.localStorage);
      if (!current.accepted || current.storedText !== view.text) { setReady(false); setMessage("Workspace changed or unavailable. Refresh workspace before opening."); return; }
      const file = current.workspace.files.find(f => f.ref === chosen.ref);
      if (!file || !workspaceDocument(file)) { setMessage("Unable to open this file. Editor unchanged."); return; }
      onOpen(file.text); setMessage("Open requested. Finish any pending confirmation in the editor.");
    } catch { setReady(false); setMessage("Workspace unavailable. Editor unchanged."); }
  };
  const currentFolder = view.workspace.folders.find(f => f.ref === folder)!;
  return <section aria-label="Artifact workspace" className="min-w-0 overflow-hidden rounded-xl border bg-background">
    <header className="space-y-3 border-b p-4">
      <div className="flex flex-wrap items-center gap-3"><h1 className="mr-auto text-lg font-semibold">File Manager</h1>
        <Button variant="outline" onClick={refresh}>Refresh workspace</Button>
        <Button variant="outline" disabled={!ready} onClick={() => input.current?.click()}>Import composition</Button>
        <input ref={input} type="file" accept=".composition.json,application/json" aria-label="Import workspace composition" className="sr-only"
          onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (file && ready) void importFile(file); }} />
      </div>
      <p className="break-words text-sm" aria-label="Current workspace folder">{workspaceFolderLabel(view.workspace, folder)}</p>
      <div className="flex flex-wrap items-end gap-3"><label className="min-w-0 flex-1 text-sm">New folder name
        <input className="mt-1 w-full rounded-md border bg-background p-2" value={name} maxLength={160}
          disabled={!ready} onChange={event => setName(event.target.value)} /></label>
        <Button disabled={!ready} onClick={() => { if (mutate({ type: "create-folder", ref: "folder:" + crypto.randomUUID(), parentRef: folder, name })) setName(""); }}>Create folder</Button>
        <Button variant="outline" disabled={currentFolder.parentRef === null} onClick={() => navigate(currentFolder.parentRef!)}>Up one folder</Button>
      </div>
    </header>
    <div className="grid min-w-0 gap-0 md:grid-cols-[180px_minmax(0,1fr)_280px]">
      <nav aria-label="Workspace folders" className="min-w-0 space-y-1 border-b p-4 md:border-r">
        {view.workspace.folders.map(f => <Button key={f.ref} variant={folder === f.ref ? "secondary" : "ghost"}
          className="h-auto w-full justify-start whitespace-normal break-words text-left" aria-current={folder === f.ref ? "location" : undefined}
          onClick={() => navigate(f.ref)}>{workspaceFolderLabel(view.workspace, f.ref)}</Button>)}
      </nav>
      <section aria-label="Folder contents" className="min-w-0 space-y-2 p-4">
        <h2 className="font-semibold">Files and folders</h2>
        {view.workspace.folders.filter(f => f.parentRef === folder).map(f => <Button key={f.ref} variant="outline"
          className="h-auto w-full justify-start whitespace-normal break-words" onClick={() => navigate(f.ref)}>Folder: {f.name}</Button>)}
        {view.workspace.files.filter(f => f.folderRef === folder).map(f => <Button key={f.ref} aria-label={f.name} variant={selected === f.ref ? "secondary" : "outline"}
          aria-pressed={selected === f.ref} className="h-auto w-full justify-between gap-2 whitespace-normal break-words" onClick={() => selectFile(f.ref)}>
          <span>{f.name}</span><span aria-hidden="true" className="text-xs text-muted-foreground">Composition</span></Button>)}
        {!view.workspace.folders.some(f => f.parentRef === folder) && !view.workspace.files.some(f => f.folderRef === folder) ? <p className="text-sm text-muted-foreground">This folder is empty.</p> : null}
      </section>
      <aside aria-label="File Inspector" className="min-w-0 space-y-3 border-t p-4 md:border-l">
        <h2 className="font-semibold">Inspector</h2>
        {chosen && document ? <><dl className="space-y-2 break-words text-sm">
          <dt>Name</dt><dd>{chosen.name}</dd><dt>Folder</dt><dd>{workspaceFolderLabel(view.workspace, chosen.folderRef)}</dd>
          <dt>Type</dt><dd>Composition</dd><dt>Artifact identity</dt><dd>{document.artifactId}</dd>
          <dt>Artifact version</dt><dd>{document.artifactVersion}</dd><dt>Source composition</dt><dd>{document.payload.compositionRef}</dd>
          <dt>Payload version</dt><dd>{document.schema.version}</dd><dt>Components</dt><dd>{document.payload.graph.nodes.length}</dd>
        </dl><label className="block min-w-0 text-sm">Retained revision
          <select aria-label="Retained revision" className="mt-1 w-full min-w-0 rounded-md border bg-background p-2" value={chosen.ref} disabled={!ready}
            onChange={event => selectFile(event.target.value)}>
            {revisions.map((entry, index) => <option key={entry.file.ref} value={entry.file.ref}>
              {entry.file.name} (v{entry.document.artifactVersion}){index === revisions.length - 1 ? " — latest retained" : ""}
            </option>)}
          </select>
        </label>
        <label className="block min-w-0 text-sm">Comparison base
          <select aria-label="Comparison base" className="mt-1 w-full min-w-0 rounded-md border bg-background p-2" value={comparisonRef} disabled={!ready}
            onChange={event => setComparisonRef(event.target.value)}>
            <option value="">Choose an earlier revision</option>
            {revisions.filter(entry => entry.file.ref !== chosen.ref).map(entry => <option key={entry.file.ref} value={entry.file.ref}>
              {entry.file.name} (v{entry.document.artifactVersion})
            </option>)}
          </select>
        </label>
        <StationRevisionDiff result={comparison} />
        <div className="flex flex-wrap gap-2"><Button disabled={!ready} onClick={open}>Open in editor</Button>
          <Button variant="outline" disabled={!ready} onClick={() => {
            try { requestArtifactDownload(chosen.text, chosen.name.slice(0, -".composition.json".length)); setMessage("Download requested. Keep the portable file."); }
            catch { setMessage("Unable to request download. Prior files are unchanged."); }
          }}>Export composition</Button></div></> : <p className="text-sm text-muted-foreground">Select a composition to inspect or open it.</p>}
      </aside>
    </div>
    <footer className="space-y-2 border-t p-4"><p role="status" className="break-words text-sm">{message}</p>
      <p className="text-xs text-muted-foreground">Stored in this browser. Keep exported portable files; browser data can be cleared.</p></footer>
  </section>;
}
