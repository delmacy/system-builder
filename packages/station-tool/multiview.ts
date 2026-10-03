import type { ToolState } from "./index";

export type ToolViewDeclaration = Readonly<{
  ref: string;
  participantRef: string;
  contextRefs: readonly string[];
}>;

export type ToolViewProjection = Readonly<{
  ref: string;
  participantRef: string;
  contextRefs: readonly string[];
  activeContextRef: string;
}>;

function nonEmpty(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${label} must be non-empty`);
  return normalized;
}

export function projectToolViews(tool: ToolState, views: readonly ToolViewDeclaration[]): readonly ToolViewProjection[] {
  const viewRefs = new Set<string>();
  const participantRefs = new Set(tool.participants.map(({ ref }) => ref));
  const contextRefs = new Set(tool.contexts.map(({ ref }) => ref));
  if (!contextRefs.has(tool.activeContextRef)) throw new Error("active tool context is not declared");

  const normalized = views.map((view) => {
    const ref = nonEmpty(view.ref, "tool view ref");
    if (viewRefs.has(ref)) throw new Error("tool view refs must be unique");
    viewRefs.add(ref);
    const participantRef = nonEmpty(view.participantRef, "tool view participant ref");
    if (!participantRefs.has(participantRef)) throw new Error("tool view references unknown participant");
    const declaredContextRefs = view.contextRefs.map((contextRef) => nonEmpty(contextRef, "tool view context ref"));
    if (new Set(declaredContextRefs).size !== declaredContextRefs.length) throw new Error("tool view context refs must be unique");
    for (const contextRef of declaredContextRefs) {
      if (!contextRefs.has(contextRef)) throw new Error("tool view references unknown context");
    }
    if (!declaredContextRefs.includes(tool.activeContextRef)) throw new Error("tool view is incompatible with active context");
    return Object.freeze({ ref, participantRef, contextRefs: Object.freeze(declaredContextRefs), activeContextRef: tool.activeContextRef });
  });

  return Object.freeze(normalized);
}
