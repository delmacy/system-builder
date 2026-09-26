"use client";

import { useMemo, useState } from "react";
import { Badge, Button, EditorShell, PropertyInspector, Tree, type PropertyGroupDefinition, type TreeNode } from "../../../../packages/ui-core/index";
import {
  BUTTON_GROUP_DESCRIPTOR,
  ComponentRegistry,
  createComponentEditorState,
  defineCompositionGraph,
  discardCompositionEditorDraft,
  mutateCompositionEditor,
  mutateComponentEditorContract,
  normalizeComponentDescriptor,
  projectCompositionEditorPreview,
  selectCompositionEditorNode,
  validateCompositionGraph,
  type ComponentEditorState,
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
const componentDefinition = Object.freeze({ descriptor: BUTTON_GROUP_DESCRIPTOR, variants: Object.freeze(["default", "compact"]) });
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

function groups(selection: SelectionState, state: ComponentEditorState): readonly PropertyGroupDefinition[] {
  const item = selectedItem(layerCollection, selection);
  if (item === null) return [];
  return [
    { id: "identity", label: "Selected component", rows: [
      { id: "ref", label: "Reference", value: item.ref, readOnly: true },
      { id: "family", label: "Family", value: item.payload.family, readOnly: true },
      { id: "slot", label: "Named slot", value: item.payload.slot, readOnly: true },
    ] },
    { id: "contract", label: "Component contract", rows: [
      { id: "policy", label: "Child policy", value: state.definition.descriptor.childPolicy, readOnly: true },
      { id: "variants", label: "Variants", value: state.definition.variants.join(", "), readOnly: true },
      { id: "slots", label: "Named slots", value: state.definition.descriptor.slots.map((slot) => slot.id).join(", "), readOnly: true },
      { id: "constraints", label: "Column constraints", value: `${state.definition.descriptor.constraints.minColumns}-${state.definition.descriptor.constraints.maxColumns}`, readOnly: true },
    ] },
  ];
}

export function ComponentLabEditorProof() {
  const [component, setComponent] = useState<ComponentEditorState>(() => {
    const initial = createComponentEditorState(componentDefinition, baseGraph, registry);
    return { ...initial, composition: selectCompositionEditorNode(initial.composition, "layer:button-group") };
  });
  const [findings, setFindings] = useState<readonly CompositionGraphFinding[]>([]);
  const [contractMessage, setContractMessage] = useState("Contract ready");
  const editor = component.composition;
  const preview = useMemo(() => projectCompositionEditorPreview(editor), [editor]);
  const validation = useMemo(() => validateCompositionGraph(editor.transaction.draft, registry), [editor]);
  const selection: SelectionState = { selectedRef: editor.selectedNodeRef ?? null };

  const updateComposition = (update: (current: ComponentEditorState["composition"]) => ComponentEditorState["composition"]) =>
    setComponent((current) => ({ ...current, composition: update(current.composition) }));
  const select = (next: SelectionState) => updateComposition((current) => selectCompositionEditorNode(current, next.selectedRef ?? undefined));
  const toggleSpan = () => updateComposition((current) => {
    const node = current.transaction.draft.nodes.find((candidate) => candidate.ref === "layer:button-1");
    if (node === undefined) return current;
    const result = mutateCompositionEditor(current, { type: "replace-node", node: { ...node, placement: { parentRef: "layer:button-group", slotRef: "button-1", columnSpan: node.placement?.columnSpan === 3 ? 2 : 3, rowSpan: 1 } } }, registry);
    if (!result.ok) { setFindings(result.findings); return result.state; }
    setFindings([]); return result.state;
  });
  const mutateContract = (mutation: Parameters<typeof mutateComponentEditorContract>[1], success: string) => setComponent((current) => {
    const result = mutateComponentEditorContract(current, mutation);
    setContractMessage(result.ok ? success : `Rejected safely: ${result.error}`);
    return result.state;
  });
  const togglePolicy = () => mutateContract({ kind: "set-child-policy", childPolicy: component.definition.descriptor.childPolicy === "multiple" ? "single" : "multiple" }, "Child policy updated in local contract draft");
  const toggleVariants = () => mutateContract({ kind: "set-variants", variants: component.definition.variants.includes("dense") ? ["default", "compact"] : ["default", "compact", "dense"] }, "Variant set updated in local contract draft");
  const toggleConstraints = () => {
    const current = component.definition.descriptor.constraints;
    mutateContract({ kind: "set-constraints", constraints: { ...current, recommendedColumns: current.recommendedColumns === 6 ? 5 : 6 } }, "Discrete constraints updated in local contract draft");
  };
  const rejectInvalidSlot = () => mutateContract({ kind: "set-slots", slots: [...component.definition.descriptor.slots, { id: "", childPolicy: "single", acceptsFamilies: ["atomic"] }] }, "Unexpected slot acceptance");
  const rejectInvalid = () => updateComposition((current) => {
    const result = mutateCompositionEditor(current, { type: "replace-node", node: { ref: "layer:invalid", componentRef: "component:missing", placement: { parentRef: "layer:button-group", slotRef: "button-3", columnSpan: 2, rowSpan: 1 } } }, registry);
    if (!result.ok) setFindings(result.findings);
    return result.state;
  });
  const discard = () => { updateComposition((current) => discardCompositionEditorDraft(current)); setFindings([]); };

  return <EditorShell
    className="min-h-[28rem] rounded-lg border"
    aria-label="Component Editor"
    toolbar={<div className="flex flex-wrap items-center gap-2 p-2"><strong className="mr-auto text-sm">Component Editor · {component.definition.descriptor.id}</strong><Button variant="outline" onClick={toggleSpan}>Toggle button-1 span</Button><Button variant="outline" onClick={togglePolicy}>Toggle child policy</Button><Button variant="outline" onClick={toggleVariants}>Toggle dense variant</Button><Button variant="outline" onClick={toggleConstraints}>Toggle constraints</Button><Button variant="ghost" onClick={rejectInvalidSlot}>Reject invalid slot</Button><Button variant="ghost" onClick={discard}>Discard graph draft</Button><Button variant="ghost" onClick={rejectInvalid}>Reject invalid reference</Button></div>}
    palette={<div className="space-y-2 p-3"><p className="text-xs font-semibold">Palette</p>{registry.list().map((entry) => <Badge key={entry.id}>{entry.id}</Badge>)}<p className="pt-2 text-xs text-muted-foreground">Variants: {component.definition.variants.join(" · ")}</p><p className="text-xs text-muted-foreground">Slots: {component.definition.descriptor.slots.map((slot) => slot.id).join(" · ")}</p></div>}
    layers={<div className="p-3"><Tree nodes={layers} collection={layerCollection} selection={selection} expandedRefs={expanded} onSelectionChange={select} ariaLabel="Component Editor layers" /></div>}
    workArea={<div className="space-y-3 p-4"><h3 className="text-sm font-semibold">Component preview</h3><div className="flex flex-wrap gap-2">{preview.nodes.map((node) => <Badge key={node.ref}>{node.ref}</Badge>)}</div><p className="text-xs text-muted-foreground">Preview projects the validated local composition draft; base remains {editor.transaction.base.nodes.length} nodes.</p><p className="text-xs text-muted-foreground">Contract editing is local and bounded: {contractMessage}.</p></div>}
    inspector={<div className="p-3"><PropertyInspector groups={groups(selection, component)} empty="No valid component selected" aria-label="Component Editor properties" /></div>}
    status={<div className="flex flex-wrap gap-2 p-2" role="status"><Badge>child-policy:{component.definition.descriptor.childPolicy}</Badge><Badge>selection:{editor.selectedNodeRef ?? "none"}</Badge><Badge>validation:{validation.length === 0 ? "valid" : `${validation.length} findings`}</Badge><Badge>dirty:{editor.transaction.dirty ? "yes" : "no"}</Badge><Badge>preview:{preview.nodes.length}</Badge>{findings.length > 0 ? <span className="text-xs text-muted-foreground">Rejected safely: {findings[0]?.message}. Base/draft preserved.</span> : null}</div>}
  />;
}
