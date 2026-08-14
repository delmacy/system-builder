import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const repoRoot = process.cwd();
const envelopeSchemaPath = join(repoRoot, "specs", "contracts", "artifact-envelope", "artifact-envelope.schema.json");
const fixturesRoot = join(repoRoot, "specs", "contracts", "artifact-envelope", "fixtures");
const validFixture = (name: string): string => join(fixturesRoot, "valid", name);
const invalidFixture = (name: string): string => join(fixturesRoot, "invalid", name);

type Schema = {
  $schema?: string;
  $id?: string;
  title?: string;
  description?: string;
  $comment?: string;
  type?: string | string[];
  const?: unknown;
  minLength?: number;
  pattern?: string;
  minItems?: number;
  uniqueItems?: boolean;
  properties?: Record<string, Schema>;
  required?: string[];
  additionalProperties?: boolean;
  items?: Schema;
  default?: unknown;
};

type InputReference = {
  artifactType?: string;
  artifactId?: string;
  artifactVersion?: string;
  digest?: { algorithm?: string; value?: string };
};

type Envelope = {
  envelopeVersion?: string;
  artifactType?: string;
  artifactId?: string;
  artifactVersion?: string;
  schema?: { id?: string; version?: string };
  provenance?: {
    createdAt?: string;
    producer?: { id?: string; version?: string; operator?: string };
    inputs?: InputReference[];
    operation?: string;
  };
  requiredExtensions?: string[];
  extensions?: Record<string, unknown>;
  payload?: unknown;
};

const SUPPORTED_ENVELOPE_MAJOR = 1;
const KNOWN_REQUIRED_EXTENSIONS: ReadonlySet<string> = new Set(["urn:system-builder:tracing"]);

describe("TASK-010 deterministic public artifact envelope schema", () => {
  it("defines a JSON Schema 2020-12 contract with the ADR-0009 core required fields", () => {
    const schema = asSchema(readJson(envelopeSchemaPath));
    assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
    assert.equal(schema.type, "object");
    assert.equal(schema.additionalProperties, false);
    assert.deepEqual(
      [...(schema.required ?? [])].sort(),
      ["artifactId", "artifactType", "artifactVersion", "envelopeVersion", "payload", "provenance", "schema"],
    );
    for (const versionField of ["envelopeVersion", "artifactVersion"]) {
      assert.equal(schema.properties?.[versionField]?.type, "string");
      assert.equal(typeof schema.properties?.[versionField]?.pattern, "string");
    }
    assert.equal(schema.properties?.schema?.required?.sort().join(","), "id,version");
    assert.equal(schema.properties?.provenance?.required?.sort().join(","), "createdAt,inputs,producer");
    assert.equal(schema.properties?.provenance?.properties?.producer?.required?.sort().join(","), "id,version");
    assert.equal(schema.properties?.requiredExtensions?.uniqueItems, true);
  });

  it("accepts the minimal envelope with an empty input list and identity-tuple formats enforced", () => {
    const fixture = envelope(validFixture("minimal.envelope.json"));
    const result = validateSchema(asSchema(readJson(envelopeSchemaPath)), fixture, "$");
    assert.deepEqual(result.errors, []);
    assert.equal(result.valid, true);
    assert.deepEqual(fixture.provenance?.inputs, []);
    assert.equal(fixture.artifactId, "urn:uuid:5a0e3c9f-1a2b-4c3d-9e8f-0a1b2c3d4e5f");
    assert.deepEqual(consumerCompatibility(fixture).errors, []);
  });

  it("validates unknown optional extensions, preserves them losslessly and honors a known required extension", () => {
    const fixture = envelope(validFixture("optional-extensions.envelope.json"));
    const result = validateSchema(asSchema(readJson(envelopeSchemaPath)), fixture, "$");
    assert.deepEqual(result.errors, []);
    assert.deepEqual(consumerCompatibility(fixture).errors, []);

    const preserved = structuredClone(fixture);
    const revalidated = validateSchema(asSchema(readJson(envelopeSchemaPath)), preserved, "$");
    assert.deepEqual(revalidated.errors, []);
    assert.deepEqual(preserved.extensions?.["urn:example:vendor:quality"], { score: 0.9, tags: ["reviewed"] });
    assert.deepEqual(preserved.extensions?.["com.example.audit"], ["2026-08-14T10:05:00Z"]);
    assert.equal(preserved.provenance?.producer?.operator, "alice");
    assert.equal(preserved.provenance?.operation, "approve");
    assert.deepEqual(preserved.provenance?.inputs?.[0]?.digest, {
      algorithm: "sha256",
      value: "e3b0c44298fc1c149afbf4c8996fb924",
    });
  });

  it("rejects an unknown entry in requiredExtensions with an explicit compatibility error before payload use", () => {
    const fixture = envelope(validFixture("unknown-required-extension.envelope.json"));
    const schemaResult = validateSchema(asSchema(readJson(envelopeSchemaPath)), fixture, "$");
    assert.equal(schemaResult.valid, true);
    const compatibility = consumerCompatibility(fixture);
    assert.equal(compatibility.ok, false);
    assert.deepEqual(compatibility.errors, ["unsupported required extension: urn:third-party:proprietary-policy"]);
    assert.throws(() => interpretPayload(fixture), /unsupported required extension: urn:third-party:proprietary-policy/);
  });

  it("rejects invalid SemVer and non-URI artifact identity", () => {
    const fixture = envelope(invalidFixture("bad-version-and-identity.envelope.json"));
    const result = validateSchema(asSchema(readJson(envelopeSchemaPath)), fixture, "$");
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((error) => error.includes("artifactId") && error.includes("fails pattern")));
    assert.ok(result.errors.some((error) => error.includes("artifactVersion") && error.includes("fails pattern")));
  });

  it("rejects provider/storage-specific fields as mandatory core data and non-UTC provenance", () => {
    const fixture = envelope(invalidFixture("provider-storage.envelope.json"));
    const result = validateSchema(asSchema(readJson(envelopeSchemaPath)), fixture, "$");
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((error) => error.includes("has unexpected property storageLocator")));
    assert.ok(result.errors.some((error) => error.includes("createdAt") && error.includes("fails pattern")));
  });

  it("rejects documents missing a required envelope field", () => {
    const fixture = envelope(invalidFixture("missing-required-field.envelope.json"));
    const result = validateSchema(asSchema(readJson(envelopeSchemaPath)), fixture, "$");
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((error) => error.includes("missing required property payload")));
  });

  it("consumer rejects an unsupported major envelope version without partial interpretation", () => {
    const fixture = envelope(validFixture("minimal.envelope.json"));
    const upgraded = { ...fixture, envelopeVersion: "2.0.0" } as Envelope;
    assert.equal(validateSchema(asSchema(readJson(envelopeSchemaPath)), upgraded, "$").valid, true);
    assert.deepEqual(consumerCompatibility(upgraded).errors, ["unsupported artifact envelope major version: 2.0.0"]);
    assert.throws(() => interpretPayload(upgraded), /unsupported artifact envelope major version: 2\.0\.0/);
  });
});

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8")) as unknown;
}

function asSchema(json: unknown): Schema {
  return json as Schema;
}

function envelope(path: string): Envelope {
  return readJson(path) as Envelope;
}

function consumerCompatibility(envelope: Envelope): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const major = Number(envelope.envelopeVersion?.split(".")[0]);
  if (envelope.envelopeVersion === undefined || !Number.isInteger(major) || major !== SUPPORTED_ENVELOPE_MAJOR) {
    errors.push(`unsupported artifact envelope major version: ${String(envelope.envelopeVersion)}`);
  }
  for (const name of envelope.requiredExtensions ?? []) {
    if (!KNOWN_REQUIRED_EXTENSIONS.has(name)) {
      errors.push(`unsupported required extension: ${name}`);
    }
  }
  return { ok: errors.length === 0, errors };
}

function interpretPayload(envelope: Envelope): unknown {
  const compatibility = consumerCompatibility(envelope);
  if (!compatibility.ok) {
    throw new Error(compatibility.errors.join("; "));
  }
  return envelope.payload ?? null;
}

function validateSchema(schema: Schema, value: unknown, path: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (schema.type !== undefined) {
    const allowed = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!allowed.some((type) => matchesType(type, value))) {
      errors.push(`${path} must be of type ${allowed.join("|")}`);
    }
  }
  if (schema.const !== undefined && value !== schema.const) {
    errors.push(`${path} must equal ${JSON.stringify(schema.const)}`);
  }
  if (typeof value === "string") {
    if (typeof schema.minLength === "number" && value.length < schema.minLength) {
      errors.push(`${path} must be at least ${schema.minLength} characters`);
    }
    if (typeof schema.pattern === "string" && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${path} fails pattern ${schema.pattern}`);
    }
  }
  if (Array.isArray(value)) {
    const items = value as unknown[];
    if (typeof schema.minItems === "number" && items.length < schema.minItems) {
      errors.push(`${path} must contain at least ${schema.minItems} items`);
    }
    if (schema.uniqueItems === true) {
      const seen = new Set<string>();
      for (const item of items) {
        const key = JSON.stringify(item);
        if (seen.has(key)) {
          errors.push(`${path} must contain unique items`);
          break;
        }
        seen.add(key);
      }
    }
    if (schema.items !== undefined) {
      items.forEach((item, index) => {
        errors.push(...validateSchema(schema.items as Schema, item, `${path}[${index}]`).errors);
      });
    }
  }
  if (isObject(value)) {
    for (const [key, subschema] of Object.entries(schema.properties ?? {})) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        errors.push(...validateSchema(subschema, value[key] as unknown, `${path}.${key}`).errors);
      }
    }
    for (const key of schema.required ?? []) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        errors.push(`${path} missing required property ${key}`);
      }
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.prototype.hasOwnProperty.call(schema.properties ?? {}, key)) {
          errors.push(`${path} has unexpected property ${key}`);
        }
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

function matchesType(type: string, value: unknown): boolean {
  switch (type) {
    case "null":
      return value === null;
    case "array":
      return Array.isArray(value);
    case "object":
      return isObject(value);
    case "integer":
      return typeof value === "number" && Number.isInteger(value);
    default:
      return typeof value === type;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}