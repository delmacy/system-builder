export const CATALOG_OWNER_VERSION = "1.0.0" as const;
export const CATALOG_OWNER_LIMITS = Object.freeze({ bytes: 65536, depth: 16, ref: 512, items: 32, page: 50 });
export type CatalogFamily = "business" | "software";
export type SoftwarePayload = Readonly<{ capability: string; provider: string; version: string; dependencies?: readonly string[]; dependencyRequirements?: readonly Readonly<{ capability: string; versionConstraint?: Readonly<{ kind: "exact" | "minimum"; version: string }>; compatibility?: Readonly<Record<string,string>> }>[]; compatibility?: Readonly<Record<string,string>> }>;
export type BusinessPayload = Readonly<{ sourceRef: string; revisionNumber: number; immutableContentRef: string }>;
export type CatalogEntry = Readonly<{ contractVersion: typeof CATALOG_OWNER_VERSION; family: CatalogFamily; id: string; version: string; payload: SoftwarePayload | BusinessPayload }>;
export interface CatalogActor { readonly scopeRef: string; readonly actorRef: string; readonly actorRevisionRef: string }
export interface CatalogRegistration extends CatalogActor { readonly commandRef: string; readonly expectedOwnerRevision: string | null; readonly entry: CatalogEntry }
export interface CatalogRecord { readonly scopeRef: string; readonly family: CatalogFamily; readonly id: string; readonly version: string; readonly ownerRevision: string; readonly predecessorOwnerRevision: string | null; readonly text: string; readonly digest: string; readonly retainedAt: string }
export type CatalogReceipt = Readonly<{ status: "retained"; commandRef: string; record: CatalogRecord }> | Readonly<{ status: "rejected"; commandRef: string; reason: "invalid-request" | "denied" | "source-unavailable" | "duplicate" | "stale-owner-revision" | "command-conflict" }> | Readonly<{ status: "unknown"; commandRef: string; reason: "unavailable" }>;
export type CatalogRead<T> = Readonly<{ status: "found"; value: T }> | Readonly<{ status: "absent" | "denied" | "invalid-request" | "unavailable" }>;
export interface CatalogExact extends CatalogActor { readonly family: CatalogFamily; readonly id: string; readonly version: string }
export interface CatalogHead extends CatalogActor { readonly family: CatalogFamily; readonly id: string }
export interface CatalogList extends CatalogActor { readonly family: CatalogFamily; readonly after: string | null; readonly limit: number }
export interface CatalogPage { readonly records: readonly CatalogRecord[]; readonly next: string | null }
const unsafe = new Set(["__proto__", "prototype", "constructor"]);
export function assertCatalogJson(value: unknown, depth = 0): void {
  if (depth > CATALOG_OWNER_LIMITS.depth) throw Error("CATALOG_DEPTH_LIMIT");
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number" && Number.isFinite(value)) return;
  if (typeof value !== "object" || value === null) throw Error("CATALOG_JSON_INVALID");
  if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) throw Error("CATALOG_JSON_INVALID");
  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const key of Reflect.ownKeys(descriptors)) {
    if (Array.isArray(value) && key === "length") continue;
    if (typeof key !== "string" || unsafe.has(key) || !Object.hasOwn(descriptors[key]!, "value") || !descriptors[key]!.enumerable) throw Error("CATALOG_JSON_INVALID");
    assertCatalogJson(descriptors[key]!.value, depth + 1);
  }
  if (Array.isArray(value) && Object.keys(value).length !== value.length) throw Error("CATALOG_JSON_INVALID");
}
export function catalogCanonicalText(value: unknown): string {
  assertCatalogJson(value);
  const sorted = (v: unknown): unknown => Array.isArray(v) ? v.map(sorted) : v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v).sort(([a],[b]) => a.localeCompare(b)).map(([k,x]) => [k,sorted(x)])) : v;
  return JSON.stringify(sorted(value));
}
export function catalogRef(v: unknown): v is string { return typeof v === "string" && v.trim().length > 0 && v.length <= 512 && ![...v].some(c => c.charCodeAt(0) < 32); }
export function catalogFamily(v: unknown): v is CatalogFamily { return v === "software" || v === "business"; }
function object(v: unknown): v is Record<string,unknown> { return !!v && typeof v === "object" && !Array.isArray(v); }
function keys(v: Record<string,unknown>, required: readonly string[], optional: readonly string[] = []): boolean {
  return required.every(k => Object.hasOwn(v,k)) && Object.keys(v).every(k => [...required,...optional].includes(k));
}
function map(v: unknown): boolean { return object(v) && Object.keys(v).length <= 32 && Object.entries(v).every(([k,x]) => catalogRef(k) && catalogRef(x)); }
function refs(v: unknown): boolean { return Array.isArray(v) && v.length <= 32 && v.every(catalogRef) && new Set(v).size === v.length; }
export function encodeCatalogEntry(input: unknown): Readonly<{ accepted: true; entry: CatalogEntry; text: string }> | Readonly<{ accepted: false }> {
  try {
    const text = catalogCanonicalText(input); if (new TextEncoder().encode(text).length > 65536) return { accepted: false };
    const e: unknown = JSON.parse(text);
    if (!object(e) || !keys(e,["contractVersion","family","id","version","payload"]) || e.contractVersion !== CATALOG_OWNER_VERSION || !catalogFamily(e.family) || !catalogRef(e.id) || !catalogRef(e.version) || !object(e.payload)) return { accepted: false };
    const p = e.payload;
    if (e.family === "business") {
      if (!keys(p,["sourceRef","revisionNumber","immutableContentRef"]) || !catalogRef(p.sourceRef) || !catalogRef(p.immutableContentRef) || typeof p.revisionNumber !== "number" || !Number.isSafeInteger(p.revisionNumber) || p.revisionNumber < 1) return { accepted: false };
    } else {
      if (!keys(p,["capability","provider","version"],["dependencies","dependencyRequirements","compatibility"]) || !catalogRef(p.capability) || !catalogRef(p.provider) || !catalogRef(p.version) || p.version !== e.version || e.id !== p.capability+"::"+p.provider+"::"+p.version ||
          p.dependencies !== undefined && !refs(p.dependencies) || p.compatibility !== undefined && !map(p.compatibility)) return { accepted: false };
      if (p.dependencyRequirements !== undefined) {
        if (!Array.isArray(p.dependencyRequirements) || p.dependencyRequirements.length > 32) return { accepted: false };
        for (const d of p.dependencyRequirements) {
          if (!object(d) || !keys(d,["capability"],["versionConstraint","compatibility"]) || !catalogRef(d.capability) || d.compatibility !== undefined && !map(d.compatibility)) return { accepted: false };
          if (d.versionConstraint !== undefined && (!object(d.versionConstraint) || !keys(d.versionConstraint,["kind","version"]) || !["exact","minimum"].includes(String(d.versionConstraint.kind)) || !catalogRef(d.versionConstraint.version))) return { accepted: false };
        }
      }
    }
    const freeze = (v: unknown): void => { if (v && typeof v === "object") { Object.values(v).forEach(freeze); Object.freeze(v); } };
    freeze(e); return { accepted: true, entry: e as CatalogEntry, text };
  } catch { return { accepted: false }; }
}
