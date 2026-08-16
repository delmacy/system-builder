import assert from "node:assert/strict";
import test from "node:test";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import {
  assemblyPlanSchema,
  deploymentRecordSchema,
  publishedReleaseSchema,
  releaseArtifactSchema,
  validationEvidenceSchema,
} from "../../packages/contracts/factory-boundary/index.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { validateTraceability } from "../../packages/validation/index.js";
import {
  factoryAnalysis,
  factoryCatalogRecords,
  factoryEnvironmentSchema,
  factoryRecipe,
  factorySystemDefinition,
} from "./fixtures/factory-e2e.js";

type JsonSchema = Readonly<{
  type?: "object" | "array" | "string" | "boolean" | "number" | "integer";
  const?: unknown;
  enum?: readonly unknown[];
  additionalProperties?: boolean;
  required?: readonly string[];
  properties?: Readonly<Record<string, JsonSchema>>;
  items?: JsonSchema;
  minLength?: number;
  minItems?: number;
  pattern?: string;
  format?: string;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateSchema(value: unknown, schema: JsonSchema, path = "$" ): readonly string[] {
  const errors: string[] = [];

  if (schema.const !== undefined && value !== schema.const) {
    errors.push(`${path}: expected const ${JSON.stringify(schema.const)}`);
    return errors;
  }

  if (schema.enum !== undefined && !schema.enum.some((candidate) => candidate === value)) {
    errors.push(`${path}: expected one of ${JSON.stringify(schema.enum)}`);
    return errors;
  }

  if (schema.type === "object") {
    if (!isRecord(value)) {
      errors.push(`${path}: expected object`);
      return errors;
    }
    for (const required of schema.required ?? []) {
      if (!(required in value)) errors.push(`${path}.${required}: required property missing`);
    }
    const properties = schema.properties ?? {};
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in properties)) errors.push(`${path}.${key}: additional property not allowed`);
      }
    }
    for (const [key, propertySchema] of Object.entries(properties)) {
      if (key in value) errors.push(...validateSchema(value[key], propertySchema, `${path}.${key}`));
    }
    return errors;
  }

  if (schema.type === "array") {
    if (!Array.isArray(value)) {
      errors.push(`${path}: expected array`);
      return errors;
    }
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${path}: expected at least ${schema.minItems} items`);
    }
    if (schema.items !== undefined) {
      value.forEach((item, index) => errors.push(...validateSchema(item, schema.items!, `${path}[${index}]`)));
    }
    return errors;
  }

  if (schema.type === "string") {
    if (typeof value !== "string") {
      errors.push(`${path}: expected string`);
      return errors;
    }
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${path}: expected minLength ${schema.minLength}`);
    }
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${path}: does not match ${schema.pattern}`);
    }
    if (schema.format === "date-time" && Number.isNaN(Date.parse(value))) {
      errors.push(`${path}: expected date-time`);
    }
    return errors;
  }

  if (schema.type === "boolean" && typeof value !== "boolean") errors.push(`${path}: expected boolean`);
  if (schema.type === "number" && typeof value !== "number") errors.push(`${path}: expected number`);
  if (schema.type === "integer" && (!Number.isInteger(value) || typeof value !== "number")) {
    errors.push(`${path}: expected integer`);
  }
  return errors;
}

function executeFactoryBoundaryChain() {
  const catalog = new SoftwareCatalogRegistry();
  for (const record of factoryCatalogRecords) catalog.register(record);

  const assembly = assembleSystemDefinition(
    factorySystemDefinition,
    "system-definition:schema-conformance:1",
    (request) => resolveCatalogCandidates(catalog, request),
  );
  assert.equal(assembly.ok, true);
  if (!assembly.ok) throw new Error("SCHEMA_CONFORMANCE_ASSEMBLY_FAILED");

  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis: factoryAnalysis,
    definition: factorySystemDefinition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "schema-conformance", status: "PASS", evidenceRefs: ["test:schema-conformance"] }],
  });
  assert.equal(validation.decision, "PASS");

  const compilation = compileSyntheticRelease({
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: factoryEnvironmentSchema,
  });

  const releases = new ReleaseRegistry();
  const publishedRelease = releases.publish({
    releaseId: "schema-conformance-system",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-16T00:00:00Z",
  });

  const deployment = dryRunDeploy({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    environment: {
      environmentRef: "environment:schema-conformance",
      runtimeVersions: ["0.1.0"],
      bindings: [
        { name: "DATABASE_URL", kind: "secret-reference", reference: "secret://database-url" },
        { name: "LOG_LEVEL", kind: "config", reference: "config://log-level" },
      ],
    },
    acceptanceChecks: [{ name: "runtime-health", pass: true }],
    startedAt: "2026-08-16T00:00:01Z",
    completedAt: "2026-08-16T00:00:02Z",
  });
  assert.equal(deployment.ok, true);
  if (!deployment.ok) throw new Error("SCHEMA_CONFORMANCE_DEPLOY_FAILED");

  return {
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    releaseArtifact: compilation.artifact,
    publishedRelease,
    deploymentRecord: deployment.record,
  };
}

test("actual factory outputs conform to canonical public schemas", () => {
  const result = executeFactoryBoundaryChain();
  const cases = [
    ["AssemblyPlan", assemblyPlanSchema, result.assemblyPlan],
    ["ValidationEvidence", validationEvidenceSchema, result.validationEvidence],
    ["ReleaseArtifact", releaseArtifactSchema, result.releaseArtifact],
    ["PublishedRelease", publishedReleaseSchema, result.publishedRelease],
    ["DeploymentRecord", deploymentRecordSchema, result.deploymentRecord],
  ] as const;

  for (const [name, schema, value] of cases) {
    assert.deepEqual(validateSchema(value, schema as JsonSchema), [], `${name} must conform to its canonical schema`);
  }
});

test("schema harness rejects drift from a closed canonical boundary", () => {
  const result = executeFactoryBoundaryChain();
  const invalidAssemblyPlan = { ...result.assemblyPlan, undeclaredField: "drift" };
  const errors = validateSchema(invalidAssemblyPlan, assemblyPlanSchema as JsonSchema);
  assert.ok(errors.some((error) => error.includes("undeclaredField") && error.includes("additional property")));
});
