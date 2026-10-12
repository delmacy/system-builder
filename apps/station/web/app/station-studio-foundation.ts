/** Internal presentation descriptors only. Presence is never a permission grant. */
export type StudioAreaId = "process-context" | "workflow";
export type StudioDescriptor = Readonly<{ id: StudioAreaId; title: string; model: string; source: string }>;
export const INSTALLED_STUDIO_AREAS: readonly StudioDescriptor[] = Object.freeze([
  Object.freeze({ id: "process-context", title: "Process Context", model: "ProcessContext", source: "Station reference context; semantic owner unavailable" }),
  Object.freeze({ id: "workflow", title: "Workflow", model: "SystemDefinition", source: "Design technical candidate; upstream unresolved" }),
]);
export type StudioIdentity = Readonly<{ artifactId: string; artifactVersion: string }>;
export type StudioSelection = StudioIdentity & Readonly<{ ref: string }>;
export type StudioSnapshot = Readonly<{
  area: StudioAreaId; generation: number; identity: StudioIdentity | null;
  selection: StudioSelection | null; contextRef: string | null; dirty: boolean; pending: boolean;
}>;
export type StudioFoundationState = Readonly<{
  active: StudioAreaId; snapshots: Readonly<Record<StudioAreaId, StudioSnapshot | null>>;
}>;
export type StudioFoundationResult =
  Readonly<{ accepted: true; state: StudioFoundationState }> |
  Readonly<{ accepted: false; state: StudioFoundationState; reason: "invalid-snapshot" | "unknown-area" | "stale-snapshot" }>;
function data(input: unknown, names: readonly string[]): Record<string, unknown> | null {
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.getPrototypeOf(input) !== Object.prototype) return null;
  const fields = Object.getOwnPropertyDescriptors(input);
  if (Reflect.ownKeys(fields).length !== names.length ||
      !names.every(n => fields[n]?.enumerable && Object.hasOwn(fields[n]!, "value"))) return null;
  return Object.fromEntries(names.map(n => [n, fields[n]!.value]));
}
const text = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0 && v.length <= 512;
export function validateStudioDescriptors(input: unknown): boolean {
  try {
    if (!Array.isArray(input) || input.length !== 2 || Reflect.ownKeys(input).length !== 3) return false;
    const seen = new Set<string>();
    for (let i = 0; i < 2; i++) {
      const entry = Object.getOwnPropertyDescriptor(input, String(i));
      if (!entry || !Object.hasOwn(entry, "value")) return false;
      const row = data(entry.value, ["id", "title", "model", "source"]);
      const installed = INSTALLED_STUDIO_AREAS.find(d => d.id === row?.id);
      if (!row || !installed || seen.has(installed.id) ||
          row.title !== installed.title || row.model !== installed.model || row.source !== installed.source) return false;
      seen.add(installed.id);
    }
    return true;
  } catch { return false; }
}
export function createStudioFoundation(): StudioFoundationState {
  return Object.freeze({ active: "process-context", snapshots: Object.freeze({ "process-context": null, workflow: null }) });
}
export function switchStudioArea(state: StudioFoundationState, area: string): StudioFoundationResult {
  if (!INSTALLED_STUDIO_AREAS.some(d => d.id === area)) return { accepted: false, state, reason: "unknown-area" };
  return { accepted: true, state: state.active === area ? state : Object.freeze({ ...state, active: area as StudioAreaId }) };
}
function identity(input: unknown): StudioIdentity | null {
  const row = data(input, ["artifactId", "artifactVersion"]);
  return row && text(row.artifactId) && text(row.artifactVersion)
    ? Object.freeze({ artifactId: row.artifactId, artifactVersion: row.artifactVersion }) : null;
}
export function updateStudioSnapshot(state: StudioFoundationState, area: StudioAreaId, input: unknown): StudioFoundationResult {
  const reject = (reason: "invalid-snapshot" | "unknown-area" | "stale-snapshot"): StudioFoundationResult => ({ accepted: false, state, reason });
  try {
    if (!INSTALLED_STUDIO_AREAS.some(d => d.id === area)) return reject("unknown-area");
    const row = data(input, ["area", "generation", "identity", "selection", "contextRef", "dirty", "pending"]);
    if (!row || row.area !== area || typeof row.generation !== "number" ||
        !Number.isSafeInteger(row.generation) || row.generation < 0 ||
        typeof row.dirty !== "boolean" || typeof row.pending !== "boolean" ||
        row.contextRef !== null && !text(row.contextRef)) return reject("invalid-snapshot");
    const id = row.identity === null ? null : identity(row.identity);
    if (row.identity !== null && !id || !id && row.contextRef !== null) return reject("invalid-snapshot");
    let selection: StudioSelection | null = null;
    if (row.selection !== null) {
      const s = data(row.selection, ["artifactId", "artifactVersion", "ref"]);
      if (!s || !id || s.artifactId !== id.artifactId || s.artifactVersion !== id.artifactVersion || !text(s.ref)) return reject("invalid-snapshot");
      selection = Object.freeze({ ...id, ref: s.ref });
    }
    const old = state.snapshots[area];
    if (old && row.generation < old.generation) return reject("stale-snapshot");
    const snapshot: StudioSnapshot = Object.freeze({
      area, generation: row.generation, identity: id, selection,
      contextRef: row.contextRef as string | null, dirty: row.dirty, pending: row.pending,
    });
    if (old && row.generation === old.generation && JSON.stringify(old) !== JSON.stringify(snapshot)) return reject("stale-snapshot");
    if (old && JSON.stringify(old) === JSON.stringify(snapshot)) return { accepted: true, state };
    return { accepted: true, state: Object.freeze({ ...state, snapshots: Object.freeze({ ...state.snapshots, [area]: snapshot }) }) };
  } catch { return reject("invalid-snapshot"); }
}
