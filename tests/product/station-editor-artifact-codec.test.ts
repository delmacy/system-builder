import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { ARTIFACT_LIMITS, createCompositionArtifact, encodeCompositionArtifact,
  initializeEditorSession, applyEditorSessionMutation, type ArtifactSource, type CompositionArtifact } from "../../packages/station-editor/index.js";
import { initializeCatalogEditorSession, resolveEditorCatalogEntry } from "../../apps/station/web/app/station-editor-catalog.js";
import { exportCatalogArtifact, importCatalogArtifact, reemitCatalogArtifact } from "../../apps/station/web/app/station-editor-artifact.js";

const metadata = { artifactId: "urn:uuid:94dcaf00-513d-4e73-90d3-9676fbc81a33", artifactVersion: "1.0.0",
  provenance: { createdAt: "2026-10-10T18:00:00Z", producer: { id: "urn:system-builder:station", version: "1.0.0" }, inputs: [] } };
function base(ref = "composition:example"): CompositionArtifact {
  const source = resolveEditorCatalogEntry(ref)!;
  const result = exportCatalogArtifact(ref, source.composition, metadata);
  assert.equal(result.accepted, true); if (!result.accepted) throw new Error("unexpected rejection");
  return structuredClone(result.document);
}
function reject(document: unknown, reason?: string) {
  const snapshot = JSON.stringify(document);
  const result = encodeCompositionArtifact(document, resolveEditorCatalogEntry);
  assert.equal(result.accepted, false);
  if (result.accepted) throw new Error("unexpected acceptance");
  if (reason) assert.equal(result.reason, reason);
  assert.equal(JSON.stringify(document), snapshot);
}
test("both real catalogs: edit -> codec -> fresh editor, deterministic and immutable", () => {
  for (const ref of ["composition:example", "composition:button-group"]) {
    const start = initializeCatalogEditorSession(ref, "session:artifact-source");
    assert.ok(start.accepted); if (!start.accepted) throw new Error("unexpected rejection");
    const node = start.session.transaction.draft.nodes[1]!;
    const changed = applyEditorSessionMutation(start.session, start.session.draftRevision,
      { type: "replace-node", node: { ...node, placement: { ...node.placement!, columnSpan: 3 } } }, start.entry.registry);
    assert.ok(changed.accepted); if (!changed.accepted) throw new Error("unexpected rejection");
    const original = JSON.stringify(start.session);
    const encoded = exportCatalogArtifact(ref, changed.session.transaction.draft, metadata);
    assert.ok(encoded.accepted); if (!encoded.accepted) throw new Error("unexpected rejection");
    const decoded = importCatalogArtifact(encoded.text);
    assert.ok(decoded.accepted); if (!decoded.accepted) throw new Error("unexpected rejection");
    assert.deepEqual(decoded.document.payload.graph, changed.session.transaction.draft);
    assert.equal(reemitCatalogArtifact(decoded.document).accepted, true);
    assert.deepEqual(reemitCatalogArtifact(decoded.document), encoded);
    assert.ok(Object.isFrozen(decoded.document.payload.graph.nodes[1]?.placement));
    const fresh = initializeEditorSession({ sessionRef: "session:artifact-reopened", base: {
      applicationRef: decoded.document.payload.applicationRef, compositionRef: ref,
      revision: decoded.document.payload.baseRevision, currentness: "current" }, composition: decoded.document.payload.graph }, start.entry.registry);
    assert.ok(fresh.accepted); assert.equal(JSON.stringify(start.session), original);
    assert.equal(encoded.text.includes("selectedRef"), false); assert.equal(encoded.text.includes("labels"), false);
    const schema = JSON.parse(readFileSync("specs/contracts/artifact-envelope/artifact-envelope.schema.json", "utf8")) as {
      required: string[]; properties: Record<string, { pattern?: string }> };
    assert.ok(schema.required.every(key => Object.hasOwn(decoded.document, key)));
    for (const key of ["artifactId", "artifactVersion", "envelopeVersion"]) {
      assert.match(decoded.document[key] as string, new RegExp(schema.properties[key]!.pattern!));
    }
  }
});
test("opaque optional extension/provenance and compatible future envelope fields survive", () => {
  const doc = { ...base(), envelopeVersion: "1.1.0", futureOptional: { value: [1, true, null] },
    extensions: { "com.example.audit": { score: 0.5, values: ["a", "b"] } },
    provenance: { ...metadata.provenance, actor: { name: "test" } } };
  const first = encodeCompositionArtifact(doc, resolveEditorCatalogEntry); assert.ok(first.accepted);
  if (!first.accepted) throw new Error("unexpected rejection");
  const second = importCatalogArtifact(first.text); assert.deepEqual(second, first);
  if (!second.accepted) throw new Error("unexpected rejection");
  assert.deepEqual(second.document, doc);
  reject({ ...doc, requiredExtensions: ["com.example.audit"] }, "required-extension");
  reject({ ...base(), futureOptional: true }, "invalid-envelope");
});
test("malformed bytes, unsupported versions, missing fields and identities reject", () => {
  for (const text of ["", "{", "null", "[]", "{\"payload\":}"]) assert.equal(importCatalogArtifact(text).accepted, false);
  const doc = base();
  for (const key of ["artifactId", "artifactVersion", "provenance", "schema", "payload"]) {
    const invalid = { ...doc }; delete invalid[key]; reject(invalid);
  }
  reject({ ...doc, envelopeVersion: "2.0.0" }, "unsupported-version");
  reject({ ...doc, artifactId: "a/file/path" }, "invalid-envelope");
  reject({ ...doc, artifactVersion: "01.0.0" }, "invalid-envelope");
  reject({ ...doc, schema: { id: doc.schema.id, version: "3.0.0" } }, "unsupported-version");
  reject({ ...doc, provenance: { ...metadata.provenance, createdAt: "wrong" } }, "invalid-envelope");
  reject({ ...doc, provenance: { ...metadata.provenance, createdAt: "2026-02-30T00:00:00Z" } }, "invalid-envelope");
  reject({ ...doc, payload: { ...doc.payload, applicationRef: "app:foreign" } }, "identity-mismatch");
  reject({ ...doc, payload: { ...doc.payload, compositionRef: "composition:unknown" } }, "unknown-composition");
  for (const revision of [6, 8, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])
    reject({ ...doc, payload: { ...doc.payload, baseRevision: revision } }, "revision-mismatch");
});
test("untrusted graph shapes, components, topology, cycles and slot cardinality reject atomically", () => {
  const doc = base(); const graph = doc.payload.graph;
  for (const graphPatch of [
    { ...graph, extra: true }, { ...graph, rootRef: "node:missing" },
    { ...graph, nodes: [...graph.nodes, graph.nodes[1]] },
    { ...graph, nodes: graph.nodes.map((n, i) => i === 1 ? { ...n, code: "alert(1)" } : n) },
    { ...graph, nodes: graph.nodes.map((n, i) => i === 1 ? { ...n, componentRef: "component:foreign" } : n) },
    { ...graph, nodes: graph.nodes.map((n, i) => i === 1 ? { ...n, placement: { ...n.placement, parentRef: n.ref } } : n) },
    { ...graph, nodes: graph.nodes.map((n, i) => i === 1 ? { ...n, placement: { ...n.placement, slotRef: "unknown" } } : n) },
    { ...graph, nodes: graph.nodes.map((n, i) => i === 1 ? { ...n, placement: { ...n.placement, columnSpan: 5 } } : n) },
    { ...graph, nodes: [...graph.nodes].reverse() },
    { ...graph, nodes: graph.nodes.filter((_, i) => i !== 1) },
  ]) reject({ ...doc, payload: { ...doc.payload, graph: graphPatch } });
  reject({ ...doc, payload: { ...doc.payload, window: {} } }, "invalid-payload");
  const group = base("composition:button-group");
  reject({ ...group, payload: { ...group.payload, graph: { ...group.payload.graph, nodes: group.payload.graph.nodes.map((n, i) =>
    i === 2 ? { ...n, placement: { ...n.placement, slotRef: "button-1" } } : n) } } }, "invalid-graph");
  const source = resolveEditorCatalogEntry("composition:example")!;
  const cycleGraph = { rootRef: "r", nodes: [{ ref: "r", componentRef: "component:grid" },
    { ref: "a", componentRef: "component:grid", placement: { parentRef: "b", slotRef: "content", columnSpan: 1, rowSpan: 1 } },
    { ref: "b", componentRef: "component:grid", placement: { parentRef: "a", slotRef: "content", columnSpan: 1, rowSpan: 1 } }] };
  const cycle = createCompositionArtifact(cycleGraph, { ...source, composition: cycleGraph }, metadata);
  assert.deepEqual(cycle, { accepted: false, reason: "invalid-graph" });
});
test("unsafe metadata keys, accessors, cycles and non-JSON numbers reject before copying", () => {
  for (const key of ["__proto__", "prototype", "constructor"]) {
    const doc = base();
    reject({ ...doc, extensions: JSON.parse(`{"com.example.test":{"${key}":{}}}`) }, "unsafe-key");
  }
  reject({ ...base(), extensions: { "com.example.test": Infinity } }, "invalid-envelope");
  let invoked = false; const extension = Object.defineProperty({}, "x", { enumerable: true, get() { invoked = true; return 1; } });
  const result = encodeCompositionArtifact({ ...base(), extensions: extension }, resolveEditorCatalogEntry);
  assert.equal(result.accepted, false); assert.equal(invoked, false);
  const cyclic: Record<string, unknown> = {}; cyclic.self = cyclic;
  assert.equal(encodeCompositionArtifact({ ...base(), extensions: cyclic }, resolveEditorCatalogEntry).accepted, false);
});
test("UTF-8 document byte budget N-1/N/N+1 includes optional metadata", () => {
  const doc = { ...base(), extensions: { "com.example.padding": "" } };
  const text = JSON.stringify(doc); const initial = new TextEncoder().encode(text).length;
  for (const delta of [-1, 0, 1]) {
    doc.extensions["com.example.padding"] = "x".repeat(ARTIFACT_LIMITS.bytes - initial + delta);
    const result = importCatalogArtifact(JSON.stringify(doc));
    assert.equal(result.accepted, delta <= 0);
    if (!result.accepted) assert.equal(result.reason, "size-limit");
  }
  doc.extensions["com.example.padding"] = "é".repeat(Math.ceil((ARTIFACT_LIMITS.bytes - initial) / 2));
  assert.equal(importCatalogArtifact(JSON.stringify(doc)).accepted, new TextEncoder().encode(JSON.stringify(doc)).length <= ARTIFACT_LIMITS.bytes);
});
test("container depth N-1/N/N+1 and brackets inside strings", () => {
  for (const delta of [-1, 0, 1]) {
    let nested: unknown = "{[\\\"}";
    for (let i = 0; i < ARTIFACT_LIMITS.depth - 2 + delta; i++) nested = [nested];
    const doc = { ...base(), extensions: { "com.example.depth": nested } };
    const result = importCatalogArtifact(JSON.stringify(doc)); assert.equal(result.accepted, delta <= 0);
    if (!result.accepted) assert.equal(result.reason, "depth-limit");
  }
});
test("node and Unicode token budgets isolated with synthetic trusted sources N-1/N/N+1", () => {
  const installed = resolveEditorCatalogEntry("composition:example")!;
  for (const delta of [-1, 0, 1]) {
    const count = ARTIFACT_LIMITS.nodes + delta;
    const graph = { rootRef: "r", nodes: [{ ref: "r", componentRef: "component:grid" }, ...Array.from({ length: count - 1 }, (_, i) => ({
      ref: `n${i}`, componentRef: "component:button", placement: { parentRef: "r", slotRef: "content", columnSpan: 1, rowSpan: 1 } }))] };
    const source: ArtifactSource = { ...installed, composition: graph };
    const result = createCompositionArtifact(graph, source, metadata); assert.equal(result.accepted, delta <= 0);
    if (!result.accepted) assert.equal(result.reason, "node-limit");
    const tokenRef = "😀".repeat(ARTIFACT_LIMITS.token + delta);
    const tokenGraph = { rootRef: tokenRef, nodes: [{ ref: tokenRef, componentRef: "component:grid" }] };
    const tokenResult = createCompositionArtifact(tokenGraph, { ...installed, composition: tokenGraph }, metadata);
    assert.equal(tokenResult.accepted, delta <= 0);
    if (!tokenResult.accepted) assert.equal(tokenResult.reason, "token-limit");
  }
});
