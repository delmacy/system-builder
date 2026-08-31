import assemblyPlanSchema from "./assembly-plan.schema.json";
import validationEvidenceSchema from "./validation-evidence.schema.json";
import releaseArtifactSchema from "./release-artifact.schema.json";
import publishedReleaseSchema from "./published-release.schema.json";
import deploymentRecordSchema from "./deployment-record.schema.json";

export const FACTORY_BOUNDARY_SCHEMA_VERSION = "1.0.0" as const;
export { assemblyPlanSchema, validationEvidenceSchema, releaseArtifactSchema, publishedReleaseSchema, deploymentRecordSchema };
export * from "./bootstrap.js";
export * from "./e2e.js";
export * from "./journey.js";
export * from "./validation.js";
