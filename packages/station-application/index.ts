export type ApplicationToolDeclaration = Readonly<{
  ref: string;
  toolId: string;
}>;

export type ApplicationToolContribution = Readonly<{
  ref: string;
  toolRef: string;
  toolId: string;
}>;

export type ApplicationManifestDefinition = Readonly<{
  id: string;
  componentRegistryRef: string;
  tools: readonly ApplicationToolDeclaration[];
  contributions: readonly ApplicationToolContribution[];
}>;

export type ApplicationManifest = Readonly<{
  id: string;
  componentRegistryRef: string;
  tools: readonly ApplicationToolDeclaration[];
  contributions: readonly ApplicationToolContribution[];
}>;

function nonEmpty(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${label} must be non-empty`);
  return normalized;
}

export function createApplicationManifest(definition: ApplicationManifestDefinition): ApplicationManifest {
  const id = nonEmpty(definition.id, "application id");
  const componentRegistryRef = nonEmpty(definition.componentRegistryRef, "component registry ref");
  if (id === componentRegistryRef) throw new Error("application identity must be distinct from component registry identity");

  const tools = definition.tools.map((tool) => Object.freeze({
    ref: nonEmpty(tool.ref, "application tool ref"),
    toolId: nonEmpty(tool.toolId, "application tool id"),
  }));
  if (new Set(tools.map(({ ref }) => ref)).size !== tools.length) throw new Error("application tool refs must be unique");
  if (new Set(tools.map(({ toolId }) => toolId)).size !== tools.length) throw new Error("application tool identities must be unambiguous");
  if (tools.some(({ toolId }) => toolId === id)) throw new Error("application identity must be distinct from tool identity");

  const declaredByRef = new Map(tools.map((tool) => [tool.ref, tool] as const));
  const contributions = definition.contributions.map((contribution) => {
    const ref = nonEmpty(contribution.ref, "tool contribution ref");
    const toolRef = nonEmpty(contribution.toolRef, "tool contribution tool ref");
    const toolId = nonEmpty(contribution.toolId, "tool contribution tool id");
    const declared = declaredByRef.get(toolRef);
    if (!declared) throw new Error(`tool contribution ${ref} references unknown or stale tool`);
    if (declared.toolId !== toolId) throw new Error(`tool contribution ${ref} is incompatible with declared tool identity`);
    if (ref === id || ref === componentRegistryRef || tools.some((tool) => tool.ref === ref || tool.toolId === ref)) {
      throw new Error(`tool contribution ${ref} cannot impersonate application, registry, or tool identity`);
    }
    return Object.freeze({ ref, toolRef, toolId });
  });
  if (new Set(contributions.map(({ ref }) => ref)).size !== contributions.length) {
    throw new Error("tool contribution refs must be unique");
  }

  const orderedTools = Object.freeze([...tools].sort((left, right) => left.ref.localeCompare(right.ref)));
  const orderedContributions = Object.freeze([...contributions].sort((left, right) => left.ref.localeCompare(right.ref)));
  return Object.freeze({ id, componentRegistryRef, tools: orderedTools, contributions: orderedContributions });
}
