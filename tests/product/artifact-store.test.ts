import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";

const artifactHash = `sha256:${"a".repeat(64)}`;
const files = [
  { path: "runtime-entry.mjs", content: "console.log('ok')", contentHash: `sha256:${"b".repeat(64)}` },
  { path: "manifest.json", content: "{}", contentHash: `sha256:${"c".repeat(64)}` },
] as const;

test("artifact payload repository publishes and retrieves immutable deterministic snapshots", () => {
  const repository = new InMemoryArtifactPayloadRepository();
  const published = repository.publish({ artifactHash, files });
  const retrieved = repository.get(artifactHash);

  assert.deepEqual(published, retrieved);
  assert.deepEqual(retrieved.files.map((file) => file.path), ["manifest.json", "runtime-entry.mjs"]);
  assert.ok(Object.isFrozen(retrieved));
  assert.ok(Object.isFrozen(retrieved.files));
  assert.ok(retrieved.files.every((file) => Object.isFrozen(file)));
  assert.notEqual(retrieved, published);
  assert.notEqual(retrieved.files, published.files);
});

test("artifact payload repository makes identical publication idempotent and rejects conflicting overwrite", () => {
  const repository = new InMemoryArtifactPayloadRepository();
  const first = repository.publish({ artifactHash, files });
  const second = repository.publish({ artifactHash, files: [...files].reverse() });
  assert.deepEqual(first, second);

  assert.throws(
    () => repository.publish({
      artifactHash,
      files: [{ ...files[0], content: "substituted" }],
    }),
    new RegExp(`^Error: ARTIFACT_PAYLOAD_CONFLICT:${artifactHash}$`),
  );
});

test("artifact payload repository fails explicitly for missing artifact", () => {
  const repository = new InMemoryArtifactPayloadRepository();
  const missing = `sha256:${"d".repeat(64)}`;
  assert.throws(
    () => repository.get(missing),
    new RegExp(`^Error: ARTIFACT_PAYLOAD_NOT_FOUND:${missing}$`),
  );
});
