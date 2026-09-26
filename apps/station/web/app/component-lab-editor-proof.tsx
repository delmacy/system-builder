"use client";

import { useMemo, useState } from "react";
import { Badge, Button, EditorShell, PropertyInspector, Tree, type PropertyGroupDefinition, type TreeNode } from "../../../../packages/ui-core/index";
import {
  BUTTON_GROUP_DESCRIPTOR,
  ComponentRegistry,
  createCompositionEditorState,
  defineCompositionGraph,
  discardCompositionEditorDraft,
  mutateCompositionEditor,
  normalizeComponentDescriptor,
  projectCompositionEditorPreview,
  selectCompositionEditorNode,
  validateCompositionGraph,
  type CompositionEditorState,
  type CompositionGraphFinding,
} from "../../../../packages/station-composition/index";
import { createCollectionIndex, selectedItem, type CollectionItem, type SelectionState } from "../../../../packages/station-interaction/index";

const atomicButton = normalizeComponentDescriptor({
  id: "component:lab-button",
  family: "atomic",
  layout: "none",
  childPolicy: "none",
  constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 1, recommendedRows: 1 },
  slots: [],
});
const registry = new ComponentRegistry([BUTTON_GROUP_DESCRIPTOR, atomicButton]);
const baseGraph = defineCompositionGraph({
  rootRef: "layer:button-group",
  nodes: [
    { ref: "layer:button-group", componentRef: BUTTON_GROUP_DESCRIPTOR.id },
    { ref: "layer:button-1", componentRef: atomicButton.id, placement: { parentRef: "layer:button-group", slotRef: "button-1", columnSpan: 2, rowSpan: 1 } },
    { ref: "layer:button-2", componentRef: atomicButton.id, placement: { parentRef: "layer:button-group", slotRef: "button-2", columnSpan: 2, rowSpan: 1 } },
  ],
});
const layers: readonly TreeNode[] = [{ ref: "layer:button-group", label: "ButtonGroup", children: [
  { ref: "layer:button-1", label: "Button 1" },
  { ref: "layer:button-2", label: "Button 2" },
] }];
type LayerPayload = Readonly<{ family: string; slot: string }>;
const layerCollection = createCollectionIndex<LayerPayload>([
  { ref: "layer:button-group", payload: { family: "collection", slot: "root" } },
  { ref: "layer:button-1", payload: { family: "atomic", slot: "button-1" } },
  { ref: "layer:button-2", payload: { family: "atomic", slot: "button-2" } },
] satisfies readonly CollectionItem<LayerPayload>[]);
const expanded = new Set(["layer:button-group"]);

function groups(selection: SelectionState): readonly PropertyGroupDefinition[] {
  const item = selectedItem(layerCollection, selection);
  if (item === null) return [];
  return [{ id: "identity", label: "Selected component", rows: [
    { id: "ref", label: "Reference", value: item.ref, readOnly: true },
    { id: "family", label: "Family", value: item.payload.family, readOnly: true },
    { id: "slot", label: "Named slot", value: item.payload.slot, readOnly: true },
  ] }];
}

export function ComponentLabEditorProof() {
  const [editor, setEditor] = useState<CompositionEditorState>(() => selectCompositionEditorNode(createCompositionEditorState(baseGraph, registry), "layer:button-group"));
  const [findings, setFindings] = useState<readonly CompositionGraphFinding[]>([]);
  const preview = useMemo(() => projectCompositionEditorPreview(editor), [editor]);
  const validation = useMemo(() => validateCompositionGraph(editor.transaction.draft, registry), [editor]);
  const selection: SelectionState = editor.selectedNodeRef === undefined ? {} : { selectedRef: editor.selectedNodeRef };

  const select = (next: SelectionState) => setEditor((current) => selectCompositionEditorNode(current, next.selectedRef));
  const toggleSpan = () => setEditor((current) => {
    const node = current.transaction.draft.nodes.find((candidate) => candidate.ref === "layer:button-1");
    if (node === undefined) return current;
    const result = mutateCompositionEditor(current, { type: "replace-node", node: { ...node, placement: { parentRef: "layer:button-group", slotRef: "button-1", columnSpan: node.placement?.columnSpan === 3 ? 2 : 3, rowSpan: 1 } } }, registry);
    if (!result.ok) { setFindings(result.findings); return result.state; }
    setFindings([]); return result.state;
  });
  const rejectInvalid = () => setEditor((current) => {
    const result = mutateCompositionEditor(current, { type: "replace-node", node: { ref: "layer:invalid", componentRef: "component:missing", placement: { parentRef: "layer:button-group", slotRef: "button-3", columnSpan: 2, rowSpan: 1 } } }, registry);
    if (!result.ok) setFindings(result.findings);
    return result.state;
  });
  const discard = () => { setEditor((current) => discardCompositionEditorDraft(current)); setFindings([]); };

  return <EditorShell
    className="min-h-[28rem] rounded-lg border"
    aria-label="Shared composition editor proof"
    toolbar={<div className="flex flex-wrap gap-2 p-2"><Button variant="outline" onClick={toggleSpan}>Toggle button-1 span</Button><Button variant="ghost" onClick={discard}>Discard / reset</Button><Button variant="ghost" onClick={rejectInvalid}>Prove invalid rejection</Button></div>}
    palette={<div className="space-y-2 p-3"><p className="text-xs font-semibold">Palette</p>{registry.list().map((component) => <Badge key={component.id}>{component.id}</Badge>)}</div>}
    layers={<div className="p-3"><Tree nodes={layers} collection={layerCollection} selection={selection} expandedRefs={expanded} onSelectionChange={select} ariaLabel="Shared editor layers" /></div>}
    workArea={<div className="space-y-3 p-4"><h3 className="text-sm font-semibold">Preview</h3><div className="flex flex-wrap gap-2">{preview.nodes.map((node) => <Badge key={node.ref}>{node.ref}</Badge>)}</div><p className="text-xs text-muted-foreground">Preview projects the validated local draft; base remains {editor.transaction.base.nodes.length} nodes.</p></div>}
    inspector={<div className="p-3"><PropertyInspector groups={groups(selection)} empty="No valid component selected" aria-label="Shared editor properties" /></div>}
    status={<div className="flex flex-wrap gap-2 p-2" role="status"><Badge>selection:{editor.selectedNodeRef ?? "none"}</Badge><Badge>validation:{validation.length === 0 ? "valid" : `${validation.length} findings`}</Badge><Badge>dirty:{editor.transaction.dirty ? "yes" : "no"}</Badge><Badge>preview:{preview.nodes.length}</Badge>{findings.length > 0 ? <span className="text-xs text-muted-foreground">Rejected safely: {findings[0]?.message}. Base/draft preserved.</span> : null}</div>}
  />;
}
