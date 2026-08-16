import environmentProfileSchema from "./environment-profile.schema.json";

export const ENVIRONMENT_PROFILE_SCHEMA_VERSION = "1.0.0" as const;

export type EnvironmentBindingKind = "config" | "secret-reference";

export type EnvironmentBinding = Readonly<{
  name: string;
  kind: EnvironmentBindingKind;
  reference: string;
}>;

export type EnvironmentProfile = Readonly<{
  kind: "EnvironmentProfile";
  environmentRef: string;
  runtimeVersions: readonly string[];
  bindings: readonly EnvironmentBinding[];
}>;

export { environmentProfileSchema };
