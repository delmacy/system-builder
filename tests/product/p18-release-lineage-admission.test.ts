import assert from "node:assert/strict";
import test from "node:test";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const artifactHash = `sha256:${"a".repeat(64)}`;

function publishRelease(): ReleaseRegistry {
  const registry = new ReleaseRegistry();
  registry.publish({
    releaseId: "orders",
    version: "2.4.0",
    artifact: {
      kind: "ReleaseArtifact",
      artifactHash,
      validationEvidenceRef: "validation:orders-v2.4.0",
    },
    publishedAt: "2026-08-30T03:20:00Z",
  });
  return registry;
}

function validHop() {
  const definition = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition" as const,
    identityRef: "definition:orders-v2",
  };
  const release = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "release" as const,
    identityRef: "orders@2.4.0",
  };
  return {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition-to-release" as const,
    from: definition,
    to: release,
  };
}

test("Release admits a canonical SystemDefinition -> Release lineage hop", () => {
  const registry = publishRelease();
  const admission = registry.admitSystemDefinitionLineage({
    releaseId: "orders",
    version: "2.4.0",
    systemDefinitionRef: "definition:orders-v2",
    lineageHop: validHop(),
  });

  assert.equal(admission.kind, "ReleaseLineageAdmission");
  assert.equal(admission.systemDefinitionRef, "definition:orders-v2");
  assert.equal(admission.releaseIdentityRef, "orders@2.4.0");
  assert.equal(admission.release.releaseId, "orders");
  assert.equal(admission.release.version, "2.4.0");
});

test("Release lineage admission fails closed on forged definition or release identities", () => {
  const registry = publishRelease();
  const hop = validHop();

  assert.throws(() => registry.admitSystemDefinitionLineage({
    releaseId: "orders",
    version: "2.4.0",
    systemDefinitionRef: "definition:billing-v1",
    lineageHop: hop,
  }), /RELEASE_LINEAGE_SYSTEM_DEFINITION_MISMATCH/);

  assert.throws(() => registry.admitSystemDefinitionLineage({
    releaseId: "orders",
    version: "2.4.0",
    systemDefinitionRef: "definition:orders-v2",
    lineageHop: { ...hop, to: { ...hop.to, identityRef: "orders@9.9.9" } },
  }), /RELEASE_LINEAGE_RELEASE_MISMATCH/);
});

test("Release lineage admission rejects non-authoritative metadata substitution", () => {
  const registry = publishRelease();
  const hop = validHop();

  assert.throws(() => registry.admitSystemDefinitionLineage({
    releaseId: "orders",
    version: "2.4.0",
    systemDefinitionRef: "definition:orders-v2",
    lineageHop: {
      ...hop,
      to: { ...hop.to, identityRef: "orders@2.4.0", gitRef: "refs/heads/main" },
    },
  }), /unexpected field gitRef/);
});

test("existing Release publish/get callers remain backward-compatible", () => {
  const registry = publishRelease();
  const release = registry.get("orders", "2.4.0");
  assert.equal(release?.releaseId, "orders");
  assert.equal(release?.version, "2.4.0");
  assert.equal(release?.status, "published");
  assert.equal(release?.artifactHash, artifactHash);
});