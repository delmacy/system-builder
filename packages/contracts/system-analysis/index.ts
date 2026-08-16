import systemAnalysisSchema from "./system-analysis.schema.json";

export const SYSTEM_ANALYSIS_ARTIFACT_TYPE = "urn:system-builder:system-analysis" as const;
export const SYSTEM_ANALYSIS_SCHEMA_ID = "https://system-builder.local/contracts/system-analysis/1.0.0/system-analysis.schema.json" as const;
export const SYSTEM_ANALYSIS_SCHEMA_VERSION = "1.0.0" as const;

export { systemAnalysisSchema };
