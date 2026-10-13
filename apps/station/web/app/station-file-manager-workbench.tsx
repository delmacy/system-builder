"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StationIcon } from "@system-builder/ui-icons";
import { Button } from "../../../../packages/ui-core/index";
import { emptyArtifactWorkspace, loadArtifactWorkspace, mutateArtifactWorkspace, readWorkspaceComposition, workspaceDocument,
  WORKSPACE_ROOT, type ArtifactWorkspace, type WorkspaceIntent } from "./station-artifact-workspace";
import { workspaceFolderLabel } from "./station-file-manager-app";
import { requestArtifactDownload } from "./station-editor-files";
import { compareWorkspaceRevisions, workspaceRevisions } from "./station-workspace-revisions";
import { StationRevisionDiff } from "./station-revision-diff";

export function StationFileManagerWorkbench({ onOpen }: { onOpen: (text: string) => void }) {
  const [view, setView] = useState<{ workspace: ArtifactWorkspace; text: string | null }>(() => ({ workspace: emptyArtifactWorkspace(), text: null }));
  const [contentView, setContentView] = useState<"grid" | "list">("grid");
  const [folder, setFolder] = useState(WORKSPACE_ROOT);
  const [selected, setSelected] = useState<string | null>(null);
  const [comparisonRef, setComparisonRef] = useState("");
  const [name, setName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([WORKSPACE_ROOT]);
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
  const navigate = (ref: string) => {
    sequence.current++; setFolder(ref); setSelected(null); setComparisonRef("");
    const ancestors: string[] = [];
    let cursor: string | null = ref;
    while (cursor) {
      ancestors.push(cursor);
      cursor = view.workspace.folders.find(f => f.ref === cursor)?.parentRef ?? null;
    }
    setExpanded(previous => [...new Set([...previous, ...ancestors])]);
  };
  const breadcrumbs = (() => {
    const nodes: { ref: string; name: string }[] = [];
    let cursor: string | null = folder;
    while (cursor) {
      const item = view.workspace.folders.find(f => f.ref === cursor);
      if (!item) break;
      nodes.unshift({ ref: item.ref, name: item.name });
      cursor = item.parentRef;
    }
    return nodes;
  })();
  const hierarchy = (parent: string | null, depth = 0): { ref: string; name: string; depth: number; children: boolean }[] =>
    view.workspace.folders.filter(f => f.parentRef === parent).flatMap(f => [
      { ref: f.ref, name: f.name, depth, children: view.workspace.folders.some(child => child.parentRef === f.ref) },
      ...(expanded.includes(f.ref) ? hierarchy(f.ref, depth + 1) : [])
    ]);
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
  return <section aria-label="Artifact workspace" data-content-view={contentView} className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-none border bg-background">
    <header className="shrink-0 border-b p-2">
      <div role="toolbar" aria-label="File Manager actions" className="flex flex-wrap items-center gap-1">
        <Button variant="ghost" aria-label="Refresh workspace" title="Refresh workspace" onClick={refresh}><StationIcon token="action.refresh" /></Button>
        <Button variant="ghost" aria-label="Import composition" title="Import composition" disabled={!ready} onClick={() => input.current?.click()}><StationIcon token="action.import" /></Button>
        <Button variant="ghost" aria-label="Create folder" title="Create folder" aria-pressed={creatingFolder} disabled={!ready} onClick={() => setCreatingFolder(!creatingFolder)}><StationIcon token="workspace.new-folder" /></Button>
        <Button variant="ghost" aria-label="Up one folder" title="Up one folder" disabled={currentFolder.parentRef === null} onClick={() => navigate(currentFolder.parentRef!)}><StationIcon token="navigation.parent" /></Button>
        <span className="mx-1 h-5 border-l" aria-hidden="true" />
        <Button variant={contentView === "grid" ? "secondary" : "ghost"} aria-label="Icon view" title="Icon view" aria-pressed={contentView === "grid"} onClick={() => setContentView("grid")}><StationIcon token="view.grid" /></Button>
        <Button variant={contentView === "list" ? "secondary" : "ghost"} aria-label="List view" title="List view" aria-pressed={contentView === "list"} onClick={() => setContentView("list")}><StationIcon token="view.list" /></Button>
        <Button className="ml-auto" variant={inspectorOpen ? "secondary" : "ghost"} aria-label="Toggle Inspector" title={inspectorOpen ? "Hide Inspector" : "Show Inspector"} aria-pressed={inspectorOpen} onClick={() => setInspectorOpen(!inspectorOpen)}><StationIcon token="layout.split" /></Button>
        <input ref={input} type="file" accept=".composition.json,application/json" aria-label="Import workspace composition" className="sr-only" onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (file && ready) void importFile(file); }} />
      </div>
      <div aria-label="Current workspace path" className="mt-2 flex min-w-0 items-center gap-2 rounded-md border px-2 py-1 text-sm">
        <StationIcon token="workspace.folder-open" className="shrink-0" />
        {breadcrumbs.map((item, index) => <span key={item.ref} className="flex min-w-0 items-center gap-1">
          {index > 0 ? <span aria-hidden="true" className="text-muted-foreground">/</span> : null}
          <button type="button" className="max-w-48 truncate rounded px-1 hover:bg-accent focus-visible:outline focus-visible:outline-2"
            title={item.name} aria-current={item.ref === folder ? "location" : undefined}
            onClick={() => navigate(item.ref)}>{item.name}</button>
        </span>)}
      </div>
      {creatingFolder ? <form className="mt-2 flex gap-2" onSubmit={event => { event.preventDefault(); if (name.trim() && mutate({ type: "create-folder", ref: "folder:" + crypto.randomUUID(), parentRef: folder, name })) { setName(""); setCreatingFolder(false); } }}>
        <input autoFocus className="min-w-0 flex-1 rounded-md border bg-background px-2" aria-label="New folder name" placeholder="New folder name" value={name} maxLength={160} disabled={!ready} onChange={event => setName(event.target.value)} />
        <Button type="submit" disabled={!ready || !name.trim()}>Create</Button><Button type="button" variant="ghost" onClick={() => setCreatingFolder(false)}>Cancel</Button>
      </form> : null}
    </header>
    <div className={`grid min-h-0 min-w-0 flex-1 overflow-hidden ${inspectorOpen ? "md:grid-cols-[200px_minmax(0,1fr)_280px]" : "md:grid-cols-[200px_minmax(0,1fr)]"}`}>
      <nav aria-label="Workspace folders" className="min-h-0 min-w-0 overflow-auto border-r p-2">
        {hierarchy(null).map(f => <div key={f.ref} className="flex min-w-0 items-center" style={{ paddingLeft: Math.min(12, f.depth) * 12 }}>
          {f.children ? <button type="button" className="w-6 shrink-0 rounded hover:bg-accent" aria-label={expanded.includes(f.ref) ? `Collapse ${f.name}` : `Expand ${f.name}`} aria-expanded={expanded.includes(f.ref)} onClick={() => setExpanded(previous => previous.includes(f.ref) ? previous.filter(ref => ref !== f.ref) : [...previous, f.ref])}>{expanded.includes(f.ref) ? "−" : "+"}</button> : <span className="w-6 shrink-0" />}
          <Button variant={folder === f.ref ? "secondary" : "ghost"} className="h-auto min-w-0 flex-1 justify-start gap-2" aria-current={folder === f.ref ? "location" : undefined} onClick={() => { navigate(f.ref); setExpanded(previous => [...new Set([...previous, f.ref])]); }}>
            <StationIcon token={folder === f.ref ? "workspace.folder-open" : "workspace.folder"} className="shrink-0" /><span className="min-w-0 truncate" title={f.name}>{f.name}</span>
          </Button>
        </div>)}
      </nav>
      <section aria-label="Folder contents" className="min-h-0 min-w-0 overflow-auto p-3">
        <div className={contentView === "grid" ? "grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3" : "space-y-2"}>
          {view.workspace.folders.filter(f => f.parentRef === folder).map(f => <Button key={f.ref} variant="ghost"
            className={contentView === "grid" ? "h-auto min-h-28 w-full flex-col gap-2 rounded-xl border px-3 py-4 whitespace-normal break-words text-center" : "h-auto w-full justify-start gap-3 whitespace-normal break-words"}
            onClick={() => navigate(f.ref)}><StationIcon token="workspace.folder" size={contentView === "grid" ? 42 : 22} className="shrink-0 text-primary" /><span className="min-w-0">{f.name}</span></Button>)}
          {view.workspace.files.filter(f => f.folderRef === folder).map(f => <Button key={f.ref} aria-label={f.name} variant={selected === f.ref ? "secondary" : "ghost"}
            aria-pressed={selected === f.ref}
            className={contentView === "grid" ? "h-auto min-h-28 w-full flex-col gap-2 rounded-xl border px-3 py-4 whitespace-normal break-words text-center" : "h-auto w-full justify-start gap-3 whitespace-normal break-words"}
            onClick={() => selectFile(f.ref)}>
            <StationIcon token="artifact.composition" size={contentView === "grid" ? 42 : 22} className="shrink-0 text-primary" />
            <span className="min-w-0">{f.name}</span><span aria-hidden="true" className="text-xs text-muted-foreground">Composition</span></Button>)}
        </div>
        {!view.workspace.folders.some(f => f.parentRef === folder) && !view.workspace.files.some(f => f.folderRef === folder) ? <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-muted-foreground"><StationIcon token="workspace.folder-open" size={36} /><p className="text-sm">This folder is empty.</p></div> : null}
      </section>
      {inspectorOpen ? <aside aria-label="File Inspector" className="min-w-0 space-y-3 border-t p-4 md:border-l">
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
        <div className="flex flex-wrap gap-2"><Button disabled={!ready} onClick={open}><StationIcon token="artifact.composition" className="shrink-0" />Open in editor</Button>
          <Button variant="outline" disabled={!ready} onClick={() => {
            try { requestArtifactDownload(chosen.text, chosen.name.slice(0, -".composition.json".length)); setMessage("Download requested. Keep the portable file."); }
            catch { setMessage("Unable to request download. Prior files are unchanged."); }
          }}><StationIcon token="action.export" className="shrink-0" />Export composition</Button></div></> : <p className="text-sm text-muted-foreground">Select a composition to inspect or open it.</p>}
      </aside> : null}
    </div>
    <footer className="shrink-0 border-t px-3 py-1"><p role="status" title={message} className="truncate text-xs text-muted-foreground">{message}</p></footer>
  </section>;
}
