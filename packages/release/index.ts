import {
  normalizeProcessSystemLineageHop,
  type ProcessSystemLineageHop,
} from "@system-builder/contracts/process-versioning";

import { normalizeReleaseEvidenceProvenance, type ReleaseEvidenceProvenance } from "./evidence-provenance.js";
import { InMemoryReleaseRecordStorage, type ReleaseRecordStorage } from "./storage.js";

export type ReleaseArtifactInput = Readonly<{
  kind: "ReleaseArtifact";
  artifactHash: string;
  validationEvidenceRef: string;
  evidenceProvenance?: ReleaseEvidenceProvenance;
}>;

export type PublishedReleaseStatus = "published" | "deprecated" | "archived";

export type PublishedRelease = Readonly<{
  kind: "PublishedRelease";
  releaseId: string;
  version: string;
  artifactRef: string;
  artifactHash: string;
  validationEvidenceRef: string;
  publishedAt: string;
  status: PublishedReleaseStatus;
  evidenceProvenance?: ReleaseEvidenceProvenance;
}>;

export type ReleaseLineageAdmission = Readonly<{
  kind: "ReleaseLineageAdmission";
  systemDefinitionRef: string;
  releaseIdentityRef: string;
  lineageHop: ProcessSystemLineageHop;
  release: PublishedRelease;
}>;

function requireToken(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`RELEASE_INVALID_${field.toUpperCase()}`);
  return normalized;
}

function identity(releaseId: string, version: string): string {
  return `${releaseId}@${version}`;
}

function assertHash(value: string): void {
  if (!/^sha256:[a-f0-9]{64}$/.test(value)) throw new Error("RELEASE_INVALID_ARTIFACT_HASH");
}

const transitions: Readonly<Record<PublishedReleaseStatus, readonly PublishedReleaseStatus[]>> = {
  published: ["deprecated"],
  deprecated: ["archived"],
  archived: [],
};

export class ReleaseRegistry {
  readonly #storage: ReleaseRecordStorage;

  constructor(storage: ReleaseRecordStorage = new InMemoryReleaseRecordStorage()) {
    this.#storage = storage;
  }

  publish(input: Readonly<{
    releaseId: string;
    version: string;
    artifact: ReleaseArtifactInput;
    publishedAt: string;
  }>): PublishedRelease {
    if (input.artifact.kind !== "ReleaseArtifact") throw new Error("RELEASE_INVALID_ARTIFACT");
    assertHash(input.artifact.artifactHash);
    const releaseId = requireToken(input.releaseId, "release_id");
    const version = requireToken(input.version, "version");
    const key = identity(releaseId, version);
    if (this.#storage.has(key)) throw new Error(`RELEASE_DUPLICATE_IDENTITY:${key}`);
    const evidenceProvenance = input.artifact.evidenceProvenance === undefined
      ? undefined
      : normalizeReleaseEvidenceProvenance(input.artifact.evidenceProvenance);

    const record: PublishedRelease = Object.freeze({
      kind: "PublishedRelease" as const,
      releaseId,
      version,
      artifactRef: input.artifact.artifactHash,
      artifactHash: input.artifact.artifactHash,
      validationEvidenceRef: requireToken(input.artifact.validationEvidenceRef, "validation_evidence_ref"),
      publishedAt: requireToken(input.publishedAt, "published_at"),
      status: "published" as const,
      ...(evidenceProvenance === undefined ? {} : { evidenceProvenance }),
    });
    this.#storage.set(key, record);
    return record;
  }

  get(releaseId: string, version: string): PublishedRelease | undefined {
    const record = this.#storage.get(identity(releaseId.trim(), version.trim()));
    return record === undefined ? undefined : Object.freeze({ ...record });
  }

  admitSystemDefinitionLineage(input: Readonly<{
    releaseId: string;
    version: string;
    systemDefinitionRef: string;
    lineageHop: unknown;
  }>): ReleaseLineageAdmission {
    const releaseId = requireToken(input.releaseId, "release_id");
    const version = requireToken(input.version, "version");
    const systemDefinitionRef = requireToken(input.systemDefinitionRef, "system_definition_ref");
    const releaseIdentityRef = identity(releaseId, version);
    const release = this.#storage.get(releaseIdentityRef);
    if (!release) throw new Error(`RELEASE_NOT_FOUND:${releaseIdentityRef}`);

    const lineageHop = normalizeProcessSystemLineageHop(input.lineageHop);
    if (lineageHop.kind !== "system-definition-to-release") {
      throw new Error("RELEASE_LINEAGE_INVALID_HOP");
    }
    if (lineageHop.from.kind !== "system-definition" || lineageHop.from.identityRef !== systemDefinitionRef) {
      throw new Error("RELEASE_LINEAGE_SYSTEM_DEFINITION_MISMATCH");
    }
    if (lineageHop.to.kind !== "release" || lineageHop.to.identityRef !== releaseIdentityRef) {
      throw new Error("RELEASE_LINEAGE_RELEASE_MISMATCH");
    }

    return Object.freeze({
      kind: "ReleaseLineageAdmission" as const,
      systemDefinitionRef,
      releaseIdentityRef,
      lineageHop,
      release: Object.freeze({ ...release }),
    });
  }

  transition(releaseId: string, version: string, target: PublishedReleaseStatus): PublishedRelease {
    const key = identity(requireToken(releaseId, "release_id"), requireToken(version, "version"));
    const current = this.#storage.get(key);
    if (!current) throw new Error(`RELEASE_NOT_FOUND:${key}`);
    if (!transitions[current.status].includes(target)) {
      throw new Error(`RELEASE_INVALID_TRANSITION:${current.status}->${target}`);
    }
    const next = Object.freeze({ ...current, status: target });
    this.#storage.set(key, next);
    return next;
  }
}