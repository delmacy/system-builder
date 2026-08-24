import systemDefinitionBaseSchema from "./system-definition.schema.json";
import identitySessionSchema from "./identity-session.schema.json";
import authorityGeneratedInteractionSchema from "./authority-generated-interaction.schema.json";

export const SYSTEM_DEFINITION_ARTIFACT_TYPE = "urn:system-builder:system-definition" as const;
export const SYSTEM_DEFINITION_SCHEMA_ID = "https://system-builder.local/contracts/system-definition/1.0.0/system-definition.schema.json" as const;
export const SYSTEM_DEFINITION_SCHEMA_VERSION = "1.0.0" as const;

export const systemDefinitionSchema = Object.freeze({
  ...systemDefinitionBaseSchema,
  properties: Object.freeze({
    ...systemDefinitionBaseSchema.properties,
    ...identitySessionSchema.properties,
    ...authorityGeneratedInteractionSchema.properties,
  }),
});
