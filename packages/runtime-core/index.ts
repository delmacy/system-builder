import type { EnvironmentProfile } from "@system-builder/contracts/environment-profile";

export type RuntimeEnvironmentRequirement = Readonly<{
  name: string;
  kind: "config" | "secret-reference";
  required: boolean;
}>;

export type RuntimeHealth = Readonly<{
  kind: "RuntimeHealth";
  status: "UP";
  runtimeVersion: string;
  environmentRef: string;
  bindingNames: readonly string[];
}>;

export type RuntimeBootstrapDiagnostic = Readonly<{
  code:
    | "RUNTIME_INVALID_ENVIRONMENT_PROFILE"
    | "RUNTIME_VERSION_INCOMPATIBLE"
    | "RUNTIME_MISSING_ENVIRONMENT_BINDING"
    | "RUNTIME_INLINE_VALUE_NOT_ALLOWED";
  detail: string;
}>;

export type RuntimeBootstrapResult =
  | Readonly<{ ok: true; health: RuntimeHealth }>
  | Readonly<{ ok: false; diagnostic: RuntimeBootstrapDiagnostic }>;

function requireToken(value: string, field: string): string {
  const token = value.trim();
  if (token.length === 0) throw new Error(`RUNTIME_INVALID_${field.toUpperCase()}`);
  return token;
}

function normalizeRequirements(
  requirements: readonly RuntimeEnvironmentRequirement[],
): readonly RuntimeEnvironmentRequirement[] {
  return Object.freeze(
    requirements
      .map((requirement) =>
        Object.freeze({
          name: requireToken(requirement.name, "environment_name"),
          kind: requirement.kind,
          required: requirement.required,
        }),
      )
      .sort((left, right) => left.name.localeCompare(right.name) || left.kind.localeCompare(right.kind)),
  );
}

export function bootstrapAutonomousRuntime(input: Readonly<{
  runtimeVersion: string;
  environment: EnvironmentProfile;
  requirements: readonly RuntimeEnvironmentRequirement[];
}>): RuntimeBootstrapResult {
  const runtimeVersion = requireToken(input.runtimeVersion, "runtime_version");
  const environment = input.environment;
  if (environment.kind !== "EnvironmentProfile" || environment.environmentRef.trim().length === 0) {
    return Object.freeze({
      ok: false,
      diagnostic: Object.freeze({ code: "RUNTIME_INVALID_ENVIRONMENT_PROFILE", detail: environment.environmentRef }),
    });
  }
  if (!environment.runtimeVersions.includes(runtimeVersion)) {
    return Object.freeze({
      ok: false,
      diagnostic: Object.freeze({ code: "RUNTIME_VERSION_INCOMPATIBLE", detail: runtimeVersion }),
    });
  }

  const bindings = [...environment.bindings].sort(
    (left, right) => left.name.localeCompare(right.name) || left.kind.localeCompare(right.kind),
  );
  for (const binding of bindings) {
    if ("value" in (binding as unknown as Record<string, unknown>)) {
      return Object.freeze({
        ok: false,
        diagnostic: Object.freeze({ code: "RUNTIME_INLINE_VALUE_NOT_ALLOWED", detail: binding.name }),
      });
    }
  }

  for (const requirement of normalizeRequirements(input.requirements).filter((item) => item.required)) {
    const binding = bindings.find(
      (candidate) =>
        candidate.name === requirement.name &&
        candidate.kind === requirement.kind &&
        candidate.reference.trim().length > 0,
    );
    if (!binding) {
      return Object.freeze({
        ok: false,
        diagnostic: Object.freeze({ code: "RUNTIME_MISSING_ENVIRONMENT_BINDING", detail: requirement.name }),
      });
    }
  }

  return Object.freeze({
    ok: true,
    health: Object.freeze({
      kind: "RuntimeHealth",
      status: "UP",
      runtimeVersion,
      environmentRef: environment.environmentRef,
      bindingNames: Object.freeze(bindings.map((binding) => binding.name)),
    }),
  });
}

export function renderAutonomousRuntimeEntrypoint(input: Readonly<{
  runtimeVersion: string;
  requirements: readonly RuntimeEnvironmentRequirement[];
}>): string {
  const runtimeVersion = requireToken(input.runtimeVersion, "runtime_version");
  const requirements = normalizeRequirements(input.requirements);
  const spec = JSON.stringify({ runtimeVersion, requirements });

  return [
    '"use strict";',
    `const SPEC = ${spec};`,
    "function fail(code, detail) {",
    "  process.stderr.write(JSON.stringify({ kind: \"RuntimeDiagnostic\", code, detail }) + \"\\n\");",
    "  process.exitCode = 1;",
    "}",
    "let environment;",
    "try {",
    "  environment = JSON.parse(process.env.SYSTEM_BUILDER_ENVIRONMENT_PROFILE || \"\");",
    "} catch {",
    "  fail(\"RUNTIME_INVALID_ENVIRONMENT_PROFILE\", \"parse\");",
    "}",
    "if (!process.exitCode) {",
    "  if (!environment || environment.kind !== \"EnvironmentProfile\" || typeof environment.environmentRef !== \"string\" || environment.environmentRef.trim().length === 0) {",
    "    fail(\"RUNTIME_INVALID_ENVIRONMENT_PROFILE\", \"shape\");",
    "  } else if (!Array.isArray(environment.runtimeVersions) || !environment.runtimeVersions.includes(SPEC.runtimeVersion)) {",
    "    fail(\"RUNTIME_VERSION_INCOMPATIBLE\", SPEC.runtimeVersion);",
    "  } else if (!Array.isArray(environment.bindings)) {",
    "    fail(\"RUNTIME_INVALID_ENVIRONMENT_PROFILE\", \"bindings\");",
    "  } else {",
    "    const bindings = [...environment.bindings].sort((a, b) => String(a.name).localeCompare(String(b.name)) || String(a.kind).localeCompare(String(b.kind)));",
    "    const inline = bindings.find((binding) => binding && typeof binding === \"object\" && Object.prototype.hasOwnProperty.call(binding, \"value\"));",
    "    if (inline) {",
    "      fail(\"RUNTIME_INLINE_VALUE_NOT_ALLOWED\", String(inline.name || \"unknown\"));",
    "    } else {",
    "      const missing = SPEC.requirements.filter((requirement) => requirement.required).find((requirement) => !bindings.some((binding) => binding && binding.name === requirement.name && binding.kind === requirement.kind && typeof binding.reference === \"string\" && binding.reference.trim().length > 0));",
    "      if (missing) {",
    "        fail(\"RUNTIME_MISSING_ENVIRONMENT_BINDING\", missing.name);",
    "      } else {",
    "        const health = { kind: \"RuntimeHealth\", status: \"UP\", runtimeVersion: SPEC.runtimeVersion, environmentRef: environment.environmentRef, bindingNames: bindings.map((binding) => binding.name) };",
    "        process.stdout.write(JSON.stringify(health) + \"\\n\");",
    "      }",
    "    }",
    "  }",
    "}",
    "",
  ].join("\n");
}
