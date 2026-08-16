import systemDefinitionSchema from "./system-definition.schema.json";

export const SYSTEM_DEFINITION_ARTIFACT_TYPE = "urn:system-builder:system-definition" as const;
export const SYSTEM_DEFINITION_SCHEMA_ID = "https://system-builder.local/contracts/system-definition/1.0.0/system-definition.schema.json" as const;
export const SYSTEM_DEFINITION_SCHEMA_VERSION = "1.0.0" as const;

export { systemDefinitionSchema };
