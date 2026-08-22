import { sha256Canonical } from "@system-builder/deterministic";
import { EvolutionRequestEvidence } from "./evolution-request.js";

export type EvolutionKnowledgeLinkFields = Readonly<{
  evolutionRequestId: string;
  intakeId: string;
  triageId: string;
  processMirrorRef: string;
  processMirrorArtifactType: string;
  processMirrorSchemaId: string;
  processMirrorSchemaVersion: string;
  businessRecipeRef: string;
  businessRecipeArtifactType: string;
  businessRecipeSchemaId: string;
  businessRecipeSchemaVersion: string;
}>;
export type EvolutionKnowledgeLinkFromRequestFields = Omit<EvolutionKnowledgeLinkFields, "evolutionRequestId" | "intakeId" | "triageId">;
export type EvolutionKnowledgeLink = Readonly<{
  kind: "EvolutionKnowledgeLink";
  knowledgeLinkId: string;
  evolutionRequestId: string;
  intakeId: string;
  triageId: string;
  processMirrorRef: string;
  processMirrorArtifactType: string;
  processMirrorSchemaId: string;
  processMirrorSchemaVersion: string;
  businessRecipeRef: string;
  businessRecipeArtifactType: string;
  businessRecipeSchemaId: string;
  businessRecipeSchemaVersion: string;
}>;

export type EvolutionReleaseLinkFields = Readonly<{
  knowledgeLinkId: string;
  evolutionRequestId: string;
  intakeId: string;
  triageId: string;
  processMirrorRef: string;
  businessRecipeRef: string;
  releaseId: string;
  version: string;
  artifactRef: string;
}>;
export type EvolutionReleaseLink = Readonly<{
  kind: "EvolutionReleaseLink";
  releaseLinkId: string;
  knowledgeLinkId: string;
  evolutionRequestId: string;
  intakeId: string;
  triageId: string;
  processMirrorRef: string;
  businessRecipeRef: string;
  releaseId: string;
  version: string;
  artifactRef: string;
}>;

const KNOWLEDGE_ALLOWED_FIELDS = new Set([
  "kind", "knowledgeLinkId", "evolutionRequestId", "intakeId", "triageId",
  "processMirrorRef", "processMirrorArtifactType", "processMirrorSchemaId", "processMirrorSchemaVersion",
  "businessRecipeRef", "businessRecipeArtifactType", "businessRecipeSchemaId", "businessRecipeSchemaVersion",
]);
const RELEASE_LINK_ALLOWED_FIELDS = new Set([
  "kind", "releaseLinkId", "knowledgeLinkId", "evolutionRequestId", "intakeId", "triageId",
  "processMirrorRef", "businessRecipeRef", "releaseId", "version", "artifactRef",
]);
const RESOLVED_VALUE_MARKERS: readonly RegExp[] = [
  /-{5}BEGIN/i, /password\s*[:=]/i, /passwd\s*[:=]/i, /token\s*[:=]/i, /apikey\s*[:=]/i, /api_key\s*[:=]/i,
  /secret\s*[:=]/i, /client_secret\s*[:=]/i, /authorization\s*[:=]/i, /credential\s*[:=]/i,
  /bearer\s+[a-z0-9._-]+/i, /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i,
];
function invalid(detail: string): Error { return new Error(`EVOLUTION_LINK:${detail}`); }
function isRecordLike(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`);
  const normalized = value.trim();
  if (RESOLVED_VALUE_MARKERS.some((marker) => marker.test(normalized))) throw invalid(`RESOLVED_VALUE:${field}`);
  if (normalized.length >= 20 && /^[A-Za-z0-9+/]+={1,2}$/.test(normalized)) throw invalid(`RESOLVED_VALUE:${field}`);
  return normalized;
}
function buildKnowledgePayload(fields: EvolutionKnowledgeLinkFields) {
  return Object.freeze({
    kind: "EvolutionKnowledgeLink" as const,
    evolutionRequestId: requiredString(fields.evolutionRequestId, "evolutionRequestId"),
    intakeId: requiredString(fields.intakeId, "intakeId"),
    triageId: requiredString(fields.triageId, "triageId"),
    processMirrorRef: requiredString(fields.processMirrorRef, "processMirrorRef"),
    processMirrorArtifactType: requiredString(fields.processMirrorArtifactType, "processMirrorArtifactType"),
    processMirrorSchemaId: requiredString(fields.processMirrorSchemaId, "processMirrorSchemaId"),
    processMirrorSchemaVersion: requiredString(fields.processMirrorSchemaVersion, "processMirrorSchemaVersion"),
    businessRecipeRef: requiredString(fields.businessRecipeRef, "businessRecipeRef"),
    businessRecipeArtifactType: requiredString(fields.businessRecipeArtifactType, "businessRecipeArtifactType"),
    businessRecipeSchemaId: requiredString(fields.businessRecipeSchemaId, "businessRecipeSchemaId"),
    businessRecipeSchemaVersion: requiredString(fields.businessRecipeSchemaVersion, "businessRecipeSchemaVersion"),
  });
}
function knowledgeFieldsFromRecord(value: Record<string, unknown>): EvolutionKnowledgeLinkFields {
  return Object.freeze({
    evolutionRequestId: requiredString(value["evolutionRequestId"], "evolutionRequestId"),
    intakeId: requiredString(value["intakeId"], "intakeId"),
    triageId: requiredString(value["triageId"], "triageId"),
    processMirrorRef: requiredString(value["processMirrorRef"], "processMirrorRef"),
    processMirrorArtifactType: requiredString(value["processMirrorArtifactType"], "processMirrorArtifactType"),
    processMirrorSchemaId: requiredString(value["processMirrorSchemaId"], "processMirrorSchemaId"),
    processMirrorSchemaVersion: requiredString(value["processMirrorSchemaVersion"], "processMirrorSchemaVersion"),
    businessRecipeRef: requiredString(value["businessRecipeRef"], "businessRecipeRef"),
    businessRecipeArtifactType: requiredString(value["businessRecipeArtifactType"], "businessRecipeArtifactType"),
    businessRecipeSchemaId: requiredString(value["businessRecipeSchemaId"], "businessRecipeSchemaId"),
    businessRecipeSchemaVersion: requiredString(value["businessRecipeSchemaVersion"], "businessRecipeSchemaVersion"),
  });
}
function buildReleasePayload(fields: EvolutionReleaseLinkFields) {
  return Object.freeze({
    kind: "EvolutionReleaseLink" as const,
    knowledgeLinkId: requiredString(fields.knowledgeLinkId, "knowledgeLinkId"),
    evolutionRequestId: requiredString(fields.evolutionRequestId, "evolutionRequestId"),
    intakeId: requiredString(fields.intakeId, "intakeId"),
    triageId: requiredString(fields.triageId, "triageId"),
    processMirrorRef: requiredString(fields.processMirrorRef, "processMirrorRef"),
    businessRecipeRef: requiredString(fields.businessRecipeRef, "businessRecipeRef"),
    releaseId: requiredString(fields.releaseId, "releaseId"),
    version: requiredString(fields.version, "version"),
    artifactRef: requiredString(fields.artifactRef, "artifactRef"),
  });
}
function releaseFieldsFromRecord(value: Record<string, unknown>): EvolutionReleaseLinkFields {
  return Object.freeze({
    knowledgeLinkId: requiredString(value["knowledgeLinkId"], "knowledgeLinkId"),
    evolutionRequestId: requiredString(value["evolutionRequestId"], "evolutionRequestId"),
    intakeId: requiredString(value["intakeId"], "intakeId"),
    triageId: requiredString(value["triageId"], "triageId"),
    processMirrorRef: requiredString(value["processMirrorRef"], "processMirrorRef"),
    businessRecipeRef: requiredString(value["businessRecipeRef"], "businessRecipeRef"),
    releaseId: requiredString(value["releaseId"], "releaseId"),
    version: requiredString(value["version"], "version"),
    artifactRef: requiredString(value["artifactRef"], "artifactRef"),
  });
}

export const EvolutionKnowledgeLink = Object.freeze({
  create(fields: EvolutionKnowledgeLinkFields): EvolutionKnowledgeLink {
    const payload = buildKnowledgePayload(fields);
    return Object.freeze({ ...payload, knowledgeLinkId: sha256Canonical(payload) });
  },
  validate(value: unknown, requestValue?: unknown): EvolutionKnowledgeLink {
    if (!isRecordLike(value)) throw invalid("KNOWLEDGE:NOT_OBJECT");
    for (const key of Object.keys(value)) if (!KNOWLEDGE_ALLOWED_FIELDS.has(key)) throw invalid(`KNOWLEDGE:UNKNOWN_FIELD:${key}`);
    if (value["kind"] !== "EvolutionKnowledgeLink") throw invalid("KNOWLEDGE:KIND");
    const normalized = EvolutionKnowledgeLink.create(knowledgeFieldsFromRecord(value));
    if (typeof value["knowledgeLinkId"] !== "string" || value["knowledgeLinkId"] !== normalized.knowledgeLinkId) throw invalid("KNOWLEDGE:ID");
    if (requestValue !== undefined) {
      const request = EvolutionRequestEvidence.validate(requestValue);
      if (request.evolutionRequestId !== normalized.evolutionRequestId || request.intakeId !== normalized.intakeId || request.triageId !== normalized.triageId) {
        throw invalid("KNOWLEDGE:EVOLUTION_LINKAGE");
      }
    }
    return normalized;
  },
  fromEvolutionRequest(requestValue: unknown, fields: EvolutionKnowledgeLinkFromRequestFields): EvolutionKnowledgeLink {
    const request = EvolutionRequestEvidence.validate(requestValue);
    return EvolutionKnowledgeLink.create({ ...fields, evolutionRequestId: request.evolutionRequestId, intakeId: request.intakeId, triageId: request.triageId });
  },
});

export const EvolutionReleaseLink = Object.freeze({
  create(fields: EvolutionReleaseLinkFields): EvolutionReleaseLink {
    const payload = buildReleasePayload(fields);
    return Object.freeze({ ...payload, releaseLinkId: sha256Canonical(payload) });
  },
  validate(value: unknown, knowledgeValue?: unknown): EvolutionReleaseLink {
    if (!isRecordLike(value)) throw invalid("RELEASE:NOT_OBJECT");
    for (const key of Object.keys(value)) if (!RELEASE_LINK_ALLOWED_FIELDS.has(key)) throw invalid(`RELEASE:UNKNOWN_FIELD:${key}`);
    if (value["kind"] !== "EvolutionReleaseLink") throw invalid("RELEASE:KIND");
    const normalized = EvolutionReleaseLink.create(releaseFieldsFromRecord(value));
    if (typeof value["releaseLinkId"] !== "string" || value["releaseLinkId"] !== normalized.releaseLinkId) throw invalid("RELEASE:ID");
    if (knowledgeValue !== undefined) {
      const knowledge = EvolutionKnowledgeLink.validate(knowledgeValue);
      if (
        knowledge.knowledgeLinkId !== normalized.knowledgeLinkId || knowledge.evolutionRequestId !== normalized.evolutionRequestId ||
        knowledge.intakeId !== normalized.intakeId || knowledge.triageId !== normalized.triageId ||
        knowledge.processMirrorRef !== normalized.processMirrorRef || knowledge.businessRecipeRef !== normalized.businessRecipeRef
      ) throw invalid("RELEASE:KNOWLEDGE_LINKAGE");
    }
    return normalized;
  },
  fromPublishedRelease(knowledgeValue: unknown, releaseValue: unknown): EvolutionReleaseLink {
    const knowledge = EvolutionKnowledgeLink.validate(knowledgeValue);
    if (!isRecordLike(releaseValue)) throw invalid("RELEASE:EVIDENCE_NOT_OBJECT");
    if (releaseValue["kind"] !== "PublishedRelease") throw invalid("RELEASE:EVIDENCE_KIND");
    return EvolutionReleaseLink.create({
      knowledgeLinkId: knowledge.knowledgeLinkId,
      evolutionRequestId: knowledge.evolutionRequestId,
      intakeId: knowledge.intakeId,
      triageId: knowledge.triageId,
      processMirrorRef: knowledge.processMirrorRef,
      businessRecipeRef: knowledge.businessRecipeRef,
      releaseId: requiredString(releaseValue["releaseId"], "releaseId"),
      version: requiredString(releaseValue["version"], "version"),
      artifactRef: requiredString(releaseValue["artifactRef"], "artifactRef"),
    });
  },
});
