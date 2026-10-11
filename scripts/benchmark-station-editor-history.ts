import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { defineCompositionGraph, type CompositionGraph } from "../packages/station-composition/index.js";
import { resolveEditorCatalogEntry } from "../apps/station/web/app/station-editor-catalog.js";
import { initializeEditorSession, createEditorSetSpanIntent, acceptEditorDraft } from "../packages/station-editor/index.js";
import type { EditorHistory, EditorHistoryResult } from "../packages/station-editor/history.js";
async function main() {
const args = process.argv.slice(2);
if (args.length !== 0 && (args.length !== 2 || args[0] !== "--history-module"))
  throw Error("Usage: node --import tsx scripts/benchmark-station-editor-history.ts [--history-module path]");
const modulePath = args[1] ?? resolve("packages/station-editor/history.ts");
const api = await import(pathToFileURL(resolve(modulePath)).href) as typeof import("../packages/station-editor/history.js");
const samples = 30, warmup = 5, batches = 3;
function ok(result: EditorHistoryResult): EditorHistory { if (!result.accepted) throw Error("history rejected"); return result.history; }
function fixture(shape: string, count: number) {
  const entry = resolveEditorCatalogEntry(shape === "button-group" ? "composition:button-group" : "composition:example");
  if (!entry) throw Error("catalog");
  const graph: CompositionGraph = count === 3 ? entry.composition : defineCompositionGraph({ rootRef: "node:root", nodes: [
    { ref: "node:root", componentRef: "component:grid" },
    ...Array.from({ length: count - 1 }, (_, i) => ({ ref: `node:n-${i + 1}`,
      componentRef: shape === "chain" && i < count - 2 ? "component:grid" : "component:button",
      placement: { parentRef: shape === "chain" && i > 0 ? `node:n-${i}` : "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } })),
  ] });
  const initialized = initializeEditorSession({ sessionRef: "session:benchmark", base: {
    applicationRef: entry!.applicationRef, compositionRef: entry!.compositionRef, revision: entry!.revision,
    currentness: "current" }, composition: graph }, entry!.registry);
  if (!initialized.accepted) throw Error("fixture");
  let history = api.createEditorHistory(initialized.session); const selection = { selectedRef: graph.nodes.at(-1)!.ref };
  function changed(h: EditorHistory, span: number) {
    const proposal = createEditorSetSpanIntent(h.session, selection, h.session.draftRevision, { columnSpan: span, rowSpan: 1 });
    if (!proposal.accepted) throw Error("span intent");
    return api.applyEditorHistoryEdit(h, selection, proposal.intent, entry!.registry);
  }
  for (let i = 0; i < 50; i++) history = ok(changed(history, i % 2 ? 2 : 3));
  assert.equal(history.past.length, 50);
  return { history, changed, entry, fixtureDigest: createHash("sha256").update(JSON.stringify(graph)).digest("hex") };
}
function quantile(values: number[], p: number) { const sorted = [...values].sort((a,b)=>a-b); return sorted[Math.ceil(sorted.length*p)-1]!; }
const rows: unknown[] = [];
for (const [shape, count] of [["example",3],["button-group",3],["children",256],["chain",256]] as const) {
  for (let batch = 1; batch <= batches; batch++) {
    const f = fixture(shape, count); let history = f.history;
    const heapBefore = process.memoryUsage().heapUsed;
    const times: Record<string, number[]> = { undo: [], redo: [], changed: [], rejected: [], checkpoint: [], coldUndo: [] };
    function measure(name: string, operation: () => void, record: boolean) {
      const start = performance.now(); operation(); const ms = performance.now()-start;
      if (record) times[name]!.push(ms);
      assert.ok(history.past.length + history.future.length <= 50);
    }
    for (let i = 0; i < warmup + samples; i++) {
      const record = i >= warmup;
      measure("undo",()=>{ history=ok(api.moveEditorHistory(history,"undo",history.session.draftRevision,f.entry.registry)); },record);
      measure("redo",()=>{ history=ok(api.moveEditorHistory(history,"redo",history.session.draftRevision,f.entry.registry)); },record);
      const span = history.session.transaction.draft.nodes.at(-1)!.placement!.columnSpan === 2 ? 3 : 2;
      measure("changed",()=>{ history=ok(f.changed(history,span)); },record);
      measure("rejected",()=>{ const result=f.changed(history,999); assert.equal(result.accepted,false); assert.strictEqual(result.history,history); },record);
      measure("checkpoint",()=>{ const saved=acceptEditorDraft(history.session,history.session.draftRevision,f.entry.registry); if(!saved.accepted)throw Error("checkpoint"); const checkpoint=api.createEditorHistory(saved.session); assert.equal(checkpoint.past.length+checkpoint.future.length,0); },record);
      const copy=structuredClone(history);
      measure("coldUndo",()=>{ const result=api.moveEditorHistory(copy,"undo",copy.session.draftRevision,f.entry.registry); assert.equal(result.accepted,true); },record);
    }
    rows.push({ shape, count, snapshots:50, batch, samples, warmup, fixtureDigest: f.fixtureDigest,
      heapUsedDeltaBytes: process.memoryUsage().heapUsed - heapBefore,
      operations:Object.fromEntries(Object.entries(times).map(([name,values])=>[name,{medianMs:quantile(values,.5),p95Ms:quantile(values,.95)}])) });
    console.error(`completed ${shape} batch ${batch}`);
  }
}
console.log(JSON.stringify({ node:process.version, modulePath, platform:process.platform, samples, warmup, batches,
  note:"setup and copy creation excluded; coldUndo validates caller copy; checkpoint does not replace measurement history; timings include assertions; heap delta is uncollected allocation, not retained-cache size; no latency guarantee", rows },null,2));

}
void main().catch(error => { console.error(error); process.exitCode = 1; });
