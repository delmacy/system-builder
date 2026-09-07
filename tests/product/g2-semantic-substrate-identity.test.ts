import assert from "node:assert/strict";
import test from "node:test";
import {
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeCanonicalSemanticIdentityRef,
  normalizeDefinitionRef,
  normalizeOccurrenceRef,
  normalizeRealizationIdentityRef,
} from "../../packages/contracts/semantic-substrate/index.js";

test("G2 semantic identity keeps canonical, definition, occurrence and realization identities distinct", () => {
  const canonical = normalizeCanonicalSemanticIdentityRef({
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    semanticOwner: " capability:orders ",
    semanticKind: " process ",
    canonicalRef: " orders.fulfillment ",
  });
  const definition = normalizeDefinitionRef({
    ...canonical,
    definitionRef: "orders.fulfillment@definition-1",
  });
  const occurrence = normalizeOccurrenceRef({
    ...canonical,
    occurrenceRef: "orders.fulfillment#occurrence-42",
  });
  const realization = normalizeRealizationIdentityRef({
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    semanticOwner: canonical.semanticOwner,
    semanticKind: canonical.semanticKind,
    realizationProvider: "provider:runtime-a",
    realizationRef: canonical.canonicalRef,
  });

  assert.deepEqual(canonical, {
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    semanticOwner: "capability:orders",
    semanticKind: "process",
    canonicalRef: "orders.fulfillment",
  });
  assert.equal(definition.canonicalRef, canonical.canonicalRef);
  assert.equal(occurrence.canonicalRef, canonical.canonicalRef);
  assert.equal(realization.realizationRef, canonical.canonicalRef);
  assert.ok(Object.isFrozen(canonical));
  assert.ok(Object.isFrozen(definition));
  assert.ok(Object.isFrozen(occurrence));
  assert.ok(Object.isFrozen(realization));
  assert.notDeepEqual(realization, canonical);
});

test("G2 semantic identity normalization is deterministic and fail-closed", () => {
  const input = {
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    semanticOwner: "capability:orders",
    semanticKind: "process",
    canonicalRef: "orders.fulfillment",
  } as const;

  assert.deepEqual(
    normalizeCanonicalSemanticIdentityRef(input),
    normalizeCanonicalSemanticIdentityRef({ ...input }),
  );
  assert.throws(
    () => normalizeCanonicalSemanticIdentityRef({ ...input, semanticOwner: " " }),
    /semanticOwner must be a non-empty string/,
  );
  assert.throws(
    () => normalizeCanonicalSemanticIdentityRef({ ...input, semanticKind: " " }),
    /semanticKind must be a non-empty string/,
  );
  assert.throws(
    () => normalizeCanonicalSemanticIdentityRef({ ...input, canonicalRef: " " }),
    /canonicalRef must be a non-empty string/,
  );
  assert.throws(
    () => normalizeCanonicalSemanticIdentityRef({ ...input, provider: "runtime-a" }),
    /unexpected field provider/,
  );
});

test("equal provider or realization values cannot substitute canonical semantic identity", () => {
  const realization = normalizeRealizationIdentityRef({
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    semanticOwner: "capability:orders",
    semanticKind: "process",
    realizationProvider: "provider:runtime-a",
    realizationRef: "orders.fulfillment",
  });

  assert.throws(
    () => normalizeCanonicalSemanticIdentityRef(realization),
    /unexpected field realizationProvider|unexpected field realizationRef/,
  );
  assert.throws(
    () => normalizeRealizationIdentityRef({
      contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
      semanticOwner: "capability:orders",
      semanticKind: "process",
      realizationProvider: " ",
      realizationRef: "orders.fulfillment",
    }),
    /realizationProvider must be a non-empty string/,
  );
});
