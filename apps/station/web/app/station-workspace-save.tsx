"use client";
import { useEffect, useState } from "react";
import { Button } from "../../../../packages/ui-core/index";
import type { ArtifactResult } from "../../../../packages/station-editor/index";
import { loadArtifactWorkspace, mutateArtifactWorkspace, WORKSPACE_ROOT, type ArtifactWorkspace } from "./station-artifact-workspace";
import { workspaceFolderLabel } from "./station-file-manager-app";

export function StationWorkspaceSave({ blocked, prepare, feedback }: {
  blocked: boolean; prepare: () => ArtifactResult; feedback: (message: string, invalid: boolean) => void;
}) {
  const [snapshot, setSnapshot] = useState<{ workspace: ArtifactWorkspace; text: string | null } | null>(null);
  const [folder, setFolder] = useState(WORKSPACE_ROOT);
  const [name, setName] = useState("My composition.composition.json");
  const [ready, setReady] = useState(false);
  const refresh = () => {
    try {
      const result = loadArtifactWorkspace(window.localStorage);
      if (!result.accepted) { setReady(false); feedback("Workspace unavailable. Keep a portable file and retry Refresh workspace folders.", true); return; }
      setSnapshot({ workspace: result.workspace, text: result.storedText }); setReady(true);
    } catch { setReady(false); feedback("Workspace unavailable. Your draft is unchanged.", true); }
  };
  useEffect(() => {
    try {
      const result = loadArtifactWorkspace(window.localStorage);
      if (result.accepted) { setSnapshot({ workspace: result.workspace, text: result.storedText }); setReady(true); }
    } catch { /* Explicit refresh reports failure without replacing the editor session. */ }
  }, []);
  const save = () => {
    if (blocked || !ready || !snapshot) return;
    const prepared = prepare();
    if (!prepared.accepted) { feedback("Unable to prepare the workspace copy. Your draft is unchanged.", true); return; }
    try {
      const result = mutateArtifactWorkspace(window.localStorage, snapshot.text, { type: "append-file",
        ref: "file:" + crypto.randomUUID(), folderRef: folder, name, text: prepared.text });
      if (!result.accepted) {
        if (result.reason === "storage-conflict" || result.reason === "storage-unavailable") setReady(false);
        feedback(result.reason === "storage-conflict" ? "Workspace changed. Refresh workspace folders before retrying." :
          "Unable to save the copy. Check its name, folder, capacity and storage; prior files and draft are unchanged.", true); return;
      }
      setSnapshot({ workspace: result.workspace, text: result.storedText });
      feedback("Workspace copy saved. Your editing session and history are unchanged.", false);
    } catch { setReady(false); feedback("Workspace unavailable. Your draft and prior files are unchanged.", true); }
  };
  return <section aria-label="Save workspace copy" className="flex min-w-0 flex-wrap items-end gap-3 border-b p-4">
    <label className="min-w-0 flex-1 text-sm">Workspace copy name
      <input className="mt-1 w-full min-w-0 rounded-md border bg-background p-2" value={name} maxLength={160}
        disabled={blocked} onChange={event => setName(event.target.value)} />
    </label>
    <label className="min-w-0 flex-1 text-sm">Workspace folder
      <select className="mt-1 w-full min-w-0 rounded-md border bg-background p-2" value={folder}
        disabled={blocked || !ready} onChange={event => setFolder(event.target.value)}>
        {snapshot?.workspace.folders.map(f => <option key={f.ref} value={f.ref}>{workspaceFolderLabel(snapshot.workspace, f.ref)}</option>)}
      </select>
    </label>
    <Button variant="outline" onClick={refresh} disabled={blocked}>Refresh workspace folders</Button>
    <Button onClick={save} disabled={blocked || !ready}>Save to workspace</Button>
    <p className="w-full text-xs text-muted-foreground">Creates a named independent copy. Existing files are preserved; export portable files for retention.</p>
  </section>;
}
