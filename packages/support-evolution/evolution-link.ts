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

const KNOWLEDGE_ALLOWED_FIELDS = new Set([
  "kind", "knowledgeLinkId", "evolutionRequestId", "intakeId", "triageId",
  "processMirrorRef", "processMirrorArtifactType", "processMirrorSchemaId", "processMirrorSchemaVersion",
  "businessRecipeRef", "businessRecipeArtifactType", "businessRecipeSchemaId", "businessRecipeSchemaVersion",
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
    return EvolutionKnowledgeLink.create({
      ...fields,
      evolutionRequestId: request.evolutionRequestId,
      intakeId: request.intakeId,
      triageId: request.triageId,
    });
  },
});
