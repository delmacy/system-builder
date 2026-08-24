import type { EnvironmentProfile } from "@system-builder/contracts/environment-profile";
import { renderRuntimeFileExecutionSupport, runtimeFileExecutionRoute } from "./file-execution.js";
import { renderRuntimeIntegrationExecutionSupport, runtimeIntegrationExecutionRoute } from "./integration-execution.js";
import { renderPostgresRuntimeStateSupport, type RuntimePostgresStateExecutionRequirement } from "./postgres-state.js";
import type { RuntimeStateRequirement } from "./state-migrations.js";

export * from "./authority-resolution.js";
export * from "./permission-evaluation.js";
export * from "./file-execution.js";
export * from "./integration-execution.js";
export * from "./state-migrations.js";
export * from "./postgres-state.js";

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

export type RuntimeStarted = Readonly<{
  kind: "RuntimeStarted";
  status: "UP";
  port: number;
  runtimeVersion: string;
  environmentRef: string;
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

function executionStateRequirements(
  requirements: readonly RuntimeStateRequirement[] | undefined,
): readonly RuntimePostgresStateExecutionRequirement[] {
  return Object.freeze(
    (requirements ?? [])
      .map((requirement) => Object.freeze({
        capability: requirement.capability,
        storeKind: requirement.storeKind,
        connectionBinding: Object.freeze({ ...requirement.connectionBinding }),
      }))
      .sort((left, right) => left.capability.localeCompare(right.capability) || left.connectionBinding.name.localeCompare(right.connectionBinding.name)),
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

export function renderPersistentAutonomousRuntimeEntrypoint(input: Readonly<{
  runtimeVersion: string;
  requirements: readonly RuntimeEnvironmentRequirement[];
  stateRequirements?: readonly RuntimeStateRequirement[];
}>): string {
  const runtimeVersion = requireToken(input.runtimeVersion, "runtime_version");
  const requirements = normalizeRequirements(input.requirements);
  const stateRequirements = executionStateRequirements(input.stateRequirements);
  const stateRequirement = stateRequirements.find(
    (requirement) => requirement.capability === "state.counter" && requirement.storeKind === "sql",
  );
  const spec = JSON.stringify({ runtimeVersion, requirements, stateRequirements });
  const postgresSupport = renderPostgresRuntimeStateSupport(stateRequirements);
  const fileSupport = renderRuntimeFileExecutionSupport();
  const integrationSupport = renderRuntimeIntegrationExecutionSupport();
  const stateSetup = stateRequirement === undefined
    ? []
    : [`            const stateBindingName = ${JSON.stringify(stateRequirement.connectionBinding.name)};`];
  const stateRoute = stateRequirement === undefined
    ? []
    : [
        "              if (request.method === \"POST\" && request.url === \"/state/counter/increment\") {",
        "                const secretValue = process.env[stateBindingName];",
        "                if (typeof secretValue !== \"string\" || secretValue.length === 0) {",
        "                  response.writeHead(503, { \"content-type\": \"application/json\" });",
        "                  response.end(JSON.stringify({ kind: \"RuntimeDiagnostic\", code: \"RUNTIME_SECRET_UNRESOLVED\", detail: stateBindingName }));",
        "                  return;",
        "                }",
        "                try {",
        "                  const value = await incrementPostgresCounter(secretValue);",
        "                  response.writeHead(200, { \"content-type\": \"application/json\" });",
        "                  response.end(JSON.stringify({ kind: \"RuntimeState\", action: \"counter.increment\", value }));",
        "                } catch (error) {",
        "                  response.writeHead(503, { \"content-type\": \"application/json\" });",
        "                  response.end(JSON.stringify({ kind: \"RuntimeDiagnostic\", code: \"RUNTIME_STATE_DATABASE_FAILED\", detail: error instanceof Error ? error.message : \"POSTGRES_STATE_FAILED\" }));",
        "                }",
        "                return;",
        "              }",
      ];

  return [
    'import { createServer } from "node:http";',
    postgresSupport,
    fileSupport,
    integrationSupport,
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
    "        const requestedPortText = process.env.SYSTEM_BUILDER_RUNTIME_PORT;",
    "        if (requestedPortText === undefined) {",
    "          process.stdout.write(JSON.stringify(health) + \"\\n\");",
    "        } else {",
    "          const requestedPort = Number(requestedPortText);",
    "          if (!Number.isInteger(requestedPort) || requestedPort < 0 || requestedPort > 65535) {",
    "            fail(\"RUNTIME_INVALID_HEALTH_PORT\", requestedPortText);",
    "          } else {",
    ...stateSetup,
    "            const server = createServer(async (request, response) => {",
    "              if (request.method === \"GET\" && request.url === \"/health\") {",
    "                response.writeHead(200, { \"content-type\": \"application/json\" });",
    "                response.end(JSON.stringify(health));",
    "                return;",
    "              }",
    ...stateRoute,
    runtimeFileExecutionRoute,
    runtimeIntegrationExecutionRoute,
    "              response.writeHead(404, { \"content-type\": \"application/json\" });",
    "              response.end(JSON.stringify({ kind: \"RuntimeDiagnostic\", code: \"RUNTIME_ROUTE_NOT_FOUND\", detail: String(request.url || \"\") }));",
    "            });",
    "            server.once(\"error\", (error) => {",
    "              fail(\"RUNTIME_HEALTH_SERVER_FAILED\", error instanceof Error ? error.message : String(error));",
    "            });",
    "            server.listen(requestedPort, \"127.0.0.1\", () => {",
    "              const address = server.address();",
    "              const port = address && typeof address === \"object\" ? address.port : requestedPort;",
    "              process.stdout.write(JSON.stringify({ kind: \"RuntimeStarted\", status: \"UP\", port, runtimeVersion: SPEC.runtimeVersion, environmentRef: environment.environmentRef }) + \"\\n\");",
    "            });",
    "            let stopping = false;",
    "            const shutdown = () => {",
    "              if (stopping) return;",
    "              stopping = true;",
    "              server.close(() => process.exit(0));",
    "            };",
    "            process.once(\"SIGTERM\", shutdown);",
    "            process.once(\"SIGINT\", shutdown);",
    "          }",
    "        }",
    "      }",
    "    }",
    "  }",
    "}",
    "",
  ].filter((line) => line.length > 0).join("\n") + "\n";
}
