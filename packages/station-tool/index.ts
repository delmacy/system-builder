export type ToolParticipantRole = string;

export type ToolParticipant = Readonly<{
  ref: string;
  role: ToolParticipantRole;
}>;

export type ToolCommandRoute = Readonly<{
  commandId: string;
  targetRef: string;
}>;

export type ToolContext = Readonly<{
  ref: string;
  participantRef: string;
  routes: Readonly<Record<string, ToolCommandRoute>>;
}>;

export type ToolDefinition = Readonly<{
  id: string;
  requiredRoles: readonly ToolParticipantRole[];
  participants: readonly ToolParticipant[];
  contexts: readonly ToolContext[];
  activeContextRef: string;
}>;

export type ToolState = Readonly<{
  id: string;
  participants: readonly ToolParticipant[];
  contexts: readonly ToolContext[];
  activeContextRef: string;
}>;

export type ToolRestorationSnapshot = Readonly<{
  toolId: string;
  participants: readonly Readonly<{ ref: string; role: ToolParticipantRole }>[];
  contexts: readonly Readonly<{ ref: string; participantRef: string; routeRefs: readonly string[] }>[];
  activeContextRef: string;
}>;

function nonEmpty(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${label} must be non-empty`);
  return normalized;
}

export function createTool(definition: ToolDefinition): ToolState {
  const id = nonEmpty(definition.id, "tool id");
  const requiredRoles = definition.requiredRoles.map((role) => nonEmpty(role, "tool role"));
  if (new Set(requiredRoles).size !== requiredRoles.length) throw new Error("tool required roles must be unique");

  const participants = definition.participants.map((participant) => Object.freeze({
    ref: nonEmpty(participant.ref, "participant ref"),
    role: nonEmpty(participant.role, "participant role"),
  }));
  if (new Set(participants.map(({ ref }) => ref)).size !== participants.length) throw new Error("tool participant refs must be unique");

  for (const role of requiredRoles) {
    if (participants.filter((participant) => participant.role === role).length !== 1) {
      throw new Error(`tool required role ${role} must have exactly one participant`);
    }
  }

  const participantRefs = new Set(participants.map(({ ref }) => ref));
  const contexts = definition.contexts.map((context) => {
    const ref = nonEmpty(context.ref, "tool context ref");
    const participantRef = nonEmpty(context.participantRef, "tool context participant ref");
    if (!participantRefs.has(participantRef)) throw new Error(`tool context ${ref} references unknown participant`);

    const routeEntries = Object.entries(context.routes).map(([routeRef, route]) => [
      nonEmpty(routeRef, "tool route ref"),
      Object.freeze({ commandId: nonEmpty(route.commandId, "command id"), targetRef: nonEmpty(route.targetRef, "command target ref") }),
    ] as const);
    if (new Set(routeEntries.map(([routeRef]) => routeRef)).size !== routeEntries.length) {
      throw new Error(`tool context ${ref} route refs must be unique after normalization`);
    }
    const routes = Object.fromEntries(routeEntries);
    return Object.freeze({ ref, participantRef, routes: Object.freeze(routes) });
  });
  if (new Set(contexts.map(({ ref }) => ref)).size !== contexts.length) throw new Error("tool context refs must be unique");

  const activeContextRef = nonEmpty(definition.activeContextRef, "active context ref");
  if (!contexts.some(({ ref }) => ref === activeContextRef)) throw new Error("active context must reference a declared context");

  return Object.freeze({ id, participants: Object.freeze(participants), contexts: Object.freeze(contexts), activeContextRef });
}

export function activateToolContext(tool: ToolState, contextRef: string): ToolState {
  const next = nonEmpty(contextRef, "active context ref");
  if (!tool.contexts.some(({ ref }) => ref === next)) throw new Error("active context must reference a declared context");
  return Object.freeze({ ...tool, activeContextRef: next });
}

export function qualifyToolCommand(tool: ToolState, routeRef: string): ToolCommandRoute {
  const active = tool.contexts.find(({ ref }) => ref === tool.activeContextRef);
  if (!active) throw new Error("active tool context is not declared");
  const route = active.routes[nonEmpty(routeRef, "tool route ref")];
  if (!route) throw new Error("tool route is not declared for active context");
  return route;
}

export function snapshotToolForRestoration(tool: ToolState): ToolRestorationSnapshot {
  return Object.freeze({
    toolId: tool.id,
    participants: Object.freeze(tool.participants.map(({ ref, role }) => Object.freeze({ ref, role }))),
    contexts: Object.freeze(tool.contexts.map(({ ref, participantRef, routes }) => Object.freeze({
      ref,
      participantRef,
      routeRefs: Object.freeze(Object.keys(routes).sort()),
    }))),
    activeContextRef: tool.activeContextRef,
  });
}

export function restoreToolContext(tool: ToolState, snapshot: ToolRestorationSnapshot): ToolState {
  const toolId = nonEmpty(snapshot.toolId, "restoration tool id");
  if (toolId !== tool.id) throw new Error("restoration snapshot references a stale tool identity");

  const participantRefs = new Set<string>();
  for (const participant of snapshot.participants) {
    const ref = nonEmpty(participant.ref, "restoration participant ref");
    const role = nonEmpty(participant.role, "restoration participant role");
    if (participantRefs.has(ref)) throw new Error("restoration participant refs must be unique");
    participantRefs.add(ref);
    const declared = tool.participants.find((candidate) => candidate.ref === ref);
    if (!declared || declared.role !== role) throw new Error("restoration participant is stale or incompatible");
  }
  if (participantRefs.size !== tool.participants.length) throw new Error("restoration participant set is incomplete");

  const contextRefs = new Set<string>();
  for (const context of snapshot.contexts) {
    const ref = nonEmpty(context.ref, "restoration context ref");
    const participantRef = nonEmpty(context.participantRef, "restoration context participant ref");
    if (contextRefs.has(ref)) throw new Error("restoration context refs must be unique");
    contextRefs.add(ref);
    const declared = tool.contexts.find((candidate) => candidate.ref === ref);
    if (!declared || declared.participantRef !== participantRef) throw new Error("restoration context is stale or incompatible");

    const routeRefs = context.routeRefs.map((routeRef) => nonEmpty(routeRef, "restoration route ref"));
    if (new Set(routeRefs).size !== routeRefs.length) throw new Error("restoration route refs must be unique");
    const declaredRouteRefs = Object.keys(declared.routes).sort();
    if (routeRefs.length !== declaredRouteRefs.length || [...routeRefs].sort().some((routeRef, index) => routeRef !== declaredRouteRefs[index])) {
      throw new Error("restoration routes are stale or incompatible");
    }
  }
  if (contextRefs.size !== tool.contexts.length) throw new Error("restoration context set is incomplete");

  const activeContextRef = nonEmpty(snapshot.activeContextRef, "restoration active context ref");
  if (!contextRefs.has(activeContextRef) || !tool.contexts.some(({ ref }) => ref === activeContextRef)) {
    throw new Error("restoration active context is stale or unknown");
  }

  if (tool.activeContextRef === activeContextRef) return tool;
  return Object.freeze({ ...tool, activeContextRef });
}
