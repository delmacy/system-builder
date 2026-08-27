import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION,
  normalizeDataKnowledgeBoundaryDescriptor,
} from "../../packages/contracts/ai-gateway/data-knowledge-boundary.js";
import {
  AI_GATEWAY_MODEL_IO_VERSION,
  normalizeModelRequest,
} from "../../packages/contracts/ai-gateway/index.js";

test("data/knowledge boundary normalizes deterministically without provider or secret semantics", () => {
  assert.deepEqual(normalizeDataKnowledgeBoundaryDescriptor({
    contractVersion: AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION,
    boundaryId: "boundary:general-assistant",
    allowedDataClasses: ["public", "internal-approved"],
    allowedKnowledgeRefs: ["knowledge:z", "knowledge:a"],
  }), {
    contractVersion: "1.0.0",
    boundaryId: "boundary:general-assistant",
    allowedDataClasses: ["internal-approved", "public"],
    allowedKnowledgeRefs: ["knowledge:a", "knowledge:z"],
  });
});

test("data/knowledge boundary fails closed for malformed, unknown and duplicate input", () => {
  assert.throws(() => normalizeDataKnowledgeBoundaryDescriptor(null), /must be an object/);
  assert.throws(() => normalizeDataKnowledgeBoundaryDescriptor({
    contractVersion: AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION,
    boundaryId: "boundary:a",
    allowedDataClasses: ["public", "public"],
    allowedKnowledgeRefs: [],
  }), /must not contain duplicates/);
  assert.throws(() => normalizeDataKnowledgeBoundaryDescriptor({
    contractVersion: AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION,
    boundaryId: "boundary:a",
    allowedDataClasses: ["public"],
    allowedKnowledgeRefs: [],
    providerId: "provider:hidden",
  }), /unexpected field providerId/);
  assert.throws(() => normalizeDataKnowledgeBoundaryDescriptor({
    contractVersion: AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION,
    boundaryId: "boundary:a",
    allowedDataClasses: ["public"],
    allowedKnowledgeRefs: [],
    credential: "secret",
  }), /unexpected field credential/);
});

test("boundary contract remains independent from predecessor model request normalization", () => {
  const request = normalizeModelRequest({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:345",
    input: { prompt: "hello" },
  });
  assert.equal(request.requestId, "request:345");

  const boundary = normalizeDataKnowledgeBoundaryDescriptor({
    contractVersion: AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION,
    boundaryId: "boundary:a",
    allowedDataClasses: [],
    allowedKnowledgeRefs: [],
  });
  assert.equal("approved" in boundary, false);
  assert.equal("authorized" in boundary, false);
  assert.equal("providerId" in boundary, false);
  assert.equal("credential" in boundary, false);
});
