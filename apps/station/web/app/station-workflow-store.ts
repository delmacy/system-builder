import { decodeWorkflow, encodeWorkflow, WORKFLOW_LIMITS, type WorkflowDocument } from "@system-builder/station-workflow-authoring";
export const WORKFLOW_STORE_KEY = "station:workflow-candidates:v1";
export const WORKFLOW_STORE_LIMITS = Object.freeze({ revisions: 16, bytes: 4_194_304 });
export interface WorkflowStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export type WorkflowStoreResult = Readonly<{ accepted: true; documents: readonly WorkflowDocument[]; storedText: string | null }> | Readonly<{ accepted: false; reason: "storage-unavailable" | "invalid-store" | "storage-conflict" | "store-limit" | "invalid-document" }>;
const tuple = (d: WorkflowDocument) => JSON.stringify([d.artifactType, d.artifactId, d.artifactVersion]);
export function loadWorkflowCandidates(store: WorkflowStorage): WorkflowStoreResult {
  try {
    const text = store.getItem(WORKFLOW_STORE_KEY);
    if (text === null) return { accepted: true, documents: [], storedText: null };
    if (new TextEncoder().encode(text).length > WORKFLOW_STORE_LIMITS.bytes) return { accepted: false, reason: "store-limit" };
    const data: unknown = JSON.parse(text);
    if (!data || typeof data !== "object" || Array.isArray(data) || Object.keys(data).length !== 2 || (data as { version?: unknown }).version !== 1) return { accepted: false, reason: "invalid-store" };
    const revisions = (data as { revisions?: unknown }).revisions;
    if (!Array.isArray(revisions) || revisions.length > WORKFLOW_STORE_LIMITS.revisions || !revisions.every(x => typeof x === "string")) return { accepted: false, reason: "invalid-store" };
    const documents: WorkflowDocument[] = []; const ids = new Set<string>();
    for (const text of revisions) {
      const r = decodeWorkflow(text); if (!r.accepted || ids.has(tuple(r.document))) return { accepted: false, reason: "invalid-store" };
      ids.add(tuple(r.document)); documents.push(r.document);
    }
    return { accepted: true, documents: Object.freeze(documents), storedText: text };
  } catch { return { accepted: false, reason: "storage-unavailable" }; }
}
/** Full snapshot expected-text detection is best effort; no distributed CAS or automatic repair. */
export function saveWorkflowCandidates(store: WorkflowStorage, inputs: readonly WorkflowDocument[], expectedText: string | null): WorkflowStoreResult {
  const encoded = inputs.map(encodeWorkflow); if (encoded.some(r => !r.accepted)) return { accepted: false, reason: "invalid-document" };
  try {
    const prior = loadWorkflowCandidates(store); if (!prior.accepted) return prior;
    if (prior.storedText !== expectedText) return { accepted: false, reason: "storage-conflict" };
    const revisions = prior.documents.map(d => { const r = encodeWorkflow(d); if (!r.accepted) throw Error("invalid"); return { document: d, text: r.text }; });
    for (const r of encoded) {
      if (!r.accepted) return { accepted: false, reason: "invalid-document" };
      const existing = revisions.find(v => tuple(v.document) === tuple(r.document));
      if (existing && existing.text !== r.text) return { accepted: false, reason: "storage-conflict" };
      if (!existing) revisions.push(r);
    }
    const text = JSON.stringify({ version: 1, revisions: revisions.map(r => r.text) });
    if (revisions.length > WORKFLOW_STORE_LIMITS.revisions || new TextEncoder().encode(text).length > WORKFLOW_STORE_LIMITS.bytes) return { accepted: false, reason: "store-limit" };
    if (store.getItem(WORKFLOW_STORE_KEY) !== expectedText) return { accepted: false, reason: "storage-conflict" };
    store.setItem(WORKFLOW_STORE_KEY, text);
    return { accepted: true, documents: Object.freeze(revisions.map(r => r.document)), storedText: text };
  } catch { return { accepted: false, reason: "storage-unavailable" }; }
}
export async function readWorkflowFile(file: { readonly name: string; readonly size: number; text(): Promise<string> }): Promise<ReturnType<typeof decodeWorkflow> | { accepted: false; reason: "invalid-filename" | "file-read-failed" }> {
  if (!file.name.endsWith(".workflow.json")) return { accepted: false, reason: "invalid-filename" };
  if (!Number.isSafeInteger(file.size) || file.size < 0 || file.size > WORKFLOW_LIMITS.bytes) return { accepted: false, reason: "size-limit" };
  try { return decodeWorkflow(await file.text()); } catch { return { accepted: false, reason: "file-read-failed" }; }
}
