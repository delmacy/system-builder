import assert from "node:assert/strict";
import test from "node:test";
import { ReleaseRegistry } from "../../packages/release/index.js";

const artifact = Object.freeze({
  kind: "ReleaseArtifact" as const,
  artifactHash: `sha256:${"a".repeat(64)}`,
  validationEvidenceRef: `sha256:${"b".repeat(64)}`,
});

test("release registry publishes immutable provenance and retrieves equivalent metadata", () => {
  const registry = new ReleaseRegistry();
  const published = registry.publish({
    releaseId: "gestao-tecnica",
    version: "1.0.0",
    artifact,
    publishedAt: "2026-08-16T00:00:00Z",
  });

  assert.deepEqual(published, {
    kind: "PublishedRelease",
    releaseId: "gestao-tecnica",
    version: "1.0.0",
    artifactRef: artifact.artifactHash,
    artifactHash: artifact.artifactHash,
    validationEvidenceRef: artifact.validationEvidenceRef,
    publishedAt: "2026-08-16T00:00:00Z",
    status: "published",
  });
  assert.deepEqual(registry.get("gestao-tecnica", "1.0.0"), published);
  assert.equal(Object.isFrozen(published), true);
});

test("release registry rejects overwrite of an already published identity", () => {
  const registry = new ReleaseRegistry();
  registry.publish({ releaseId: "app", version: "1.0.0", artifact, publishedAt: "2026-08-16T00:00:00Z" });
  assert.throws(
    () => registry.publish({ releaseId: "app", version: "1.0.0", artifact, publishedAt: "2026-08-16T00:01:00Z" }),
    /RELEASE_DUPLICATE_IDENTITY/,
  );
});

test("release lifecycle only permits published -> deprecated -> archived", () => {
  const registry = new ReleaseRegistry();
  registry.publish({ releaseId: "app", version: "1.0.0", artifact, publishedAt: "2026-08-16T00:00:00Z" });
  assert.throws(() => registry.transition("app", "1.0.0", "archived"), /RELEASE_INVALID_TRANSITION/);
  assert.equal(registry.transition("app", "1.0.0", "deprecated").status, "deprecated");
  assert.equal(registry.transition("app", "1.0.0", "archived").status, "archived");
  assert.throws(() => registry.transition("app", "1.0.0", "deprecated"), /RELEASE_INVALID_TRANSITION/);
});
