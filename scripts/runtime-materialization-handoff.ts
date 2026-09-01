import type { EnvironmentProfile } from "../packages/contracts/environment-profile/index.js";
import type { DeploymentRecord, DeployPublishedRelease } from "../packages/deploy/index.js";
import type {
  LocalVerifiableReleaseArtifact,
  LocalVerifiedArtifactPayloadReader,
} from "../packages/deploy/local-process.js";
import type { executeFactoryOperatorBootstrap } from "./factory-operator-bootstrap-command.js";

type UnknownRecord = Record<string, unknown>;
type FactoryOperatorBootstrapResult = ReturnType<typeof executeFactoryOperatorBootstrap>;

export type RuntimeHandoffBinding = Readonly<{
  publishedRelease: DeployPublishedRelease;
  releaseArtifact: LocalVerifiableReleaseArtifact;
  deploymentRecord: DeploymentRecord;
  environment: EnvironmentProfile;
  artifactPayloadReader: LocalVerifiedArtifactPayloadReader;
}>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function requiredString(record: UnknownRecord, field: string, label: string): string {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label}.${field} must be a non-empty string`);
  }
  return value;
}

function assertNoEmbeddedBindingValues(environment: EnvironmentProfile): void {
  for (const binding of environment.bindings) {
    if ("value" in (binding as unknown as UnknownRecord)) {
      throw new Error(`RUNTIME_HANDOFF_ENVIRONMENT_VALUE_NOT_ALLOWED:${binding.name}`);
    }
  }
}

/**
 * Binds only canonical bootstrap/factory evidence to the already-owned Deploy
 * inputs. No artifact read, materialization, process launch or other side effect
 * occurs here.
 */
export function preflightRuntimeMaterializationHandoff(input: Readonly<{
  bootstrap: FactoryOperatorBootstrapResult;
  environment: EnvironmentProfile;
  artifactPayloadReader: LocalVerifiedArtifactPayloadReader;
}>): RuntimeHandoffBinding {
  if (input.bootstrap.ok !== true) throw new Error("RUNTIME_HANDOFF_BOOTSTRAP_NOT_SUCCESSFUL");

  const canonical = input.bootstrap.result;
  const published = asRecord(canonical.publishedRelease, "PublishedRelease");
  const artifact = asRecord(canonical.releaseArtifact, "ReleaseArtifact");
  const deployment = asRecord(canonical.deploymentRecord, "DeploymentRecord");
  const manifest = asRecord(artifact.manifest, "ReleaseArtifact.manifest");

  if (published.kind !== "PublishedRelease") throw new Error("RUNTIME_HANDOFF_PUBLISHED_RELEASE_INVALID");
  if (artifact.kind !== "ReleaseArtifact") throw new Error("RUNTIME_HANDOFF_RELEASE_ARTIFACT_INVALID");
  if (deployment.kind !== "DeploymentRecord") throw new Error("RUNTIME_HANDOFF_DEPLOYMENT_RECORD_INVALID");

  const releaseId = requiredString(published, "releaseId", "PublishedRelease");
  const releaseVersion = requiredString(published, "version", "PublishedRelease");
  const artifactHash = requiredString(artifact, "artifactHash", "ReleaseArtifact");
  const artifactRef = requiredString(published, "artifactRef", "PublishedRelease");
  const publishedArtifactHash = requiredString(published, "artifactHash", "PublishedRelease");
  const artifactValidationRef = requiredString(artifact, "validationEvidenceRef", "ReleaseArtifact");
  const publishedValidationRef = requiredString(published, "validationEvidenceRef", "PublishedRelease");
  const runtimeVersion = requiredString(manifest, "runtimeVersion", "ReleaseArtifact.manifest");
  requiredString(artifact, "assemblyPlanRef", "ReleaseArtifact");

  if (artifactRef !== artifactHash || publishedArtifactHash !== artifactHash) {
    throw new Error("RUNTIME_HANDOFF_ARTIFACT_MISMATCH");
  }
  if (publishedValidationRef !== artifactValidationRef) {
    throw new Error("RUNTIME_HANDOFF_VALIDATION_PREDECESSOR_MISMATCH");
  }

  const expectedReleaseRef = `${releaseId}@${releaseVersion}`;
  if (requiredString(deployment, "publishedReleaseRef", "DeploymentRecord") !== expectedReleaseRef) {
    throw new Error("RUNTIME_HANDOFF_DEPLOYMENT_PREDECESSOR_MISMATCH");
  }
  if (requiredString(deployment, "releaseHash", "DeploymentRecord") !== artifactHash) {
    throw new Error("RUNTIME_HANDOFF_DEPLOYMENT_ARTIFACT_MISMATCH");
  }
  if (deployment.status !== "succeeded") {
    throw new Error("RUNTIME_HANDOFF_DEPLOYMENT_PREDECESSOR_NOT_SUCCESSFUL");
  }
  if (requiredString(deployment, "environmentRef", "DeploymentRecord") !== input.environment.environmentRef) {
    throw new Error("RUNTIME_HANDOFF_ENVIRONMENT_PREDECESSOR_MISMATCH");
  }
  if (!input.environment.runtimeVersions.includes(runtimeVersion)) {
    throw new Error(`RUNTIME_HANDOFF_RUNTIME_INCOMPATIBLE:${runtimeVersion}`);
  }
  assertNoEmbeddedBindingValues(input.environment);

  return Object.freeze({
    publishedRelease: canonical.publishedRelease as DeployPublishedRelease,
    releaseArtifact: canonical.releaseArtifact as LocalVerifiableReleaseArtifact,
    deploymentRecord: canonical.deploymentRecord as DeploymentRecord,
    environment: input.environment,
    artifactPayloadReader: input.artifactPayloadReader,
  });
}
