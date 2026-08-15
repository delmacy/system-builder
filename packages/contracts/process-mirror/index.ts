import processMirrorSchema from "./process-mirror.schema.json";

export const PROCESS_MIRROR_ARTIFACT_TYPE = "urn:system-builder:process-mirror" as const;
export const PROCESS_MIRROR_SCHEMA_ID = "https://system-builder.local/contracts/process-mirror/1.0.0/process-mirror.schema.json" as const;
export const PROCESS_MIRROR_SCHEMA_VERSION = "1.0.0" as const;

export { processMirrorSchema };
