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

function invalid(detail: string): Error { return new Error(`EVOLUTION_LINK:${detail}`); }
function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`);
  return value.trim();
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

export const EvolutionKnowledgeLink = Object.freeze({
  create(fields: EvolutionKnowledgeLinkFields): EvolutionKnowledgeLink {
    const payload = buildKnowledgePayload(fields);
    return Object.freeze({ ...payload, knowledgeLinkId: sha256Canonical(payload) });
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
