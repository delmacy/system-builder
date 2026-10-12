"use client";
import { useCallback, useRef, useState } from "react";
import { Button, PropertyInspector, type PropertyGroupDefinition } from "@system-builder/ui-core";
import { createStudioFoundation, INSTALLED_STUDIO_AREAS, switchStudioArea, updateStudioSnapshot, type StudioAreaId, type StudioSnapshot } from "./station-studio-foundation";
import { StationWorkflowWorkbench } from "./station-workflow-workbench";
import { StationProcessContextWorkbench } from "./station-process-context-workbench";
import { StationEditorWorkbench, type EditorArtifactOpenRequest } from "./station-editor-workbench";

/** Shared state is a presentation summary; each mounted model owns its draft and selection. */
export function StationStudioWorkbench({ onOpenComposition }: { onOpenComposition?: (text: string) => void } = {}) {
  const [presentation, setPresentation] = useState(() => ({ state: createStudioFoundation(), invalid: { "process-context": false, workflow: false } }));
  const [request, setRequest] = useState<EditorArtifactOpenRequest | null>(null);
  const [editorOpened, setEditorOpened] = useState(false);
  const nextRequest = useRef(0);
  const receive = useCallback((area: StudioAreaId, snapshot: StudioSnapshot) => {
    setPresentation(current => {
      const result = updateStudioSnapshot(current.state, area, snapshot);
      if (result.state === current.state && current.invalid[area] === !result.accepted) return current;
      return { state: result.state, invalid: { ...current.invalid, [area]: !result.accepted } };
    });
  }, []);
  const workflowSnapshot = useCallback((snapshot: StudioSnapshot) => receive("workflow", snapshot), [receive]);
  const contextSnapshot = useCallback((snapshot: StudioSnapshot) => receive("process-context", snapshot), [receive]);
  const consumed = useCallback((id: number) => setRequest(current => current?.id === id ? null : current), []);
  const openComposition = useCallback((text: string) => {
    if (onOpenComposition) { onOpenComposition(text); return; }
    setEditorOpened(true); setRequest({ id: ++nextRequest.current, text });
  }, [onOpenComposition]);
  const { state, invalid } = presentation;
  const active = INSTALLED_STUDIO_AREAS.find(area => area.id === state.active)!;
  const snapshot = invalid[state.active] ? null : state.snapshots[state.active];
  const unavailable = invalid[state.active] ? "Snapshot unavailable" : null;
  const groups: readonly PropertyGroupDefinition[] = [{
    id: "studio-context", label: "Active Studio context",
    rows: [
      { id: "area", label: "Area", value: active.title },
      { id: "model", label: "Model", value: active.model },
      { id: "authority", label: "Source boundary", value: active.source },
      { id: "artifact", label: "Artifact", value: unavailable ?? snapshot?.identity?.artifactId ?? "No artifact open" },
      { id: "version", label: "Artifact version", value: unavailable ?? snapshot?.identity?.artifactVersion ?? "None" },
      { id: "context", label: "Reference context", value: unavailable ?? snapshot?.contextRef ?? "None" },
      { id: "selection", label: "Qualified selection", value: unavailable ?? snapshot?.selection?.ref ?? "None" },
      { id: "draft", label: "Draft", value: unavailable ?? (snapshot?.dirty ? "Unsaved changes or pending fields" : snapshot?.identity ? "Clean" : "No artifact open") },
      { id: "replacement", label: "Replacement", value: unavailable ?? (snapshot?.pending ? "Confirmation pending" : "None") },
    ],
  }];
  return <section aria-label="Studio foundation" className="min-w-0 space-y-4" data-active-area={state.active}>
    <header className="space-y-2"><h1 className="text-xl font-semibold">Studios</h1><p className="text-sm text-muted-foreground">Switch between installed areas. Each area keeps its draft, references and selection. Close or reload requires explicit retained revision reopening.</p></header>
    <nav aria-label="Studio areas" className="flex flex-wrap gap-2">{INSTALLED_STUDIO_AREAS.map(area =>
      <Button key={area.id} aria-pressed={state.active === area.id} aria-controls={"studio-area-" + area.id} variant={state.active === area.id ? "default" : "outline"} onClick={() => setPresentation(current => ({ ...current, state: switchStudioArea(current.state, area.id).state }))}>{area.title}</Button>)}</nav>
    <p role="status" className="text-sm">{active.title} active. {unavailable ? "Shared snapshot unavailable; inspect the owning workbench. Draft preserved." : "Selection and draft stay scoped to this area."}</p>
    <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0">
        <div id="studio-area-process-context" hidden={state.active !== "process-context"}><StationProcessContextWorkbench onOpen={openComposition} onSnapshot={contextSnapshot} /></div>
        <div id="studio-area-workflow" hidden={state.active !== "workflow"}><StationWorkflowWorkbench onSnapshot={workflowSnapshot} /></div>
      </div>
      <PropertyInspector aria-label="Shared Studio Inspector" groups={groups} className="break-all" />
    </div>
    {editorOpened ? <section aria-label="Referenced composition editor"><StationEditorWorkbench artifactRequest={request} onArtifactRequestConsumed={consumed} /></section> : null}
  </section>;
}
