import type { EnvironmentProfile } from "@system-builder/contracts/environment-profile";
import { renderRuntimeFileExecutionSupport, runtimeFileExecutionRoute } from "./file-execution.js";
import { renderRuntimeIntegrationExecutionSupport, runtimeIntegrationExecutionRoute } from "./integration-execution.js";
import { renderPostgresRuntimeStateSupport, type RuntimePostgresStateExecutionRequirement } from "./postgres-state.js";
import type { RuntimeStateRequirement } from "./state-migrations.js";

export * from "./authority-resolution.js";
export * from "./permission-evaluation.js";
export * from "./authority-gated-interaction.js";
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
        candidate.name === requirement.name && candidate.kind === requirement.kind,
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

export function renderAutonomousRuntimeSupport(input: Readonly<{
  runtimeVersion: string;
  environmentRef: string;
  requirements: readonly RuntimeEnvironmentRequirement[];
  stateRequirements?: readonly RuntimeStateRequirement[];
}>): string {
  const requirements = normalizeRequirements(input.requirements);
  const stateRequirements = executionStateRequirements(input.stateRequirements);
  const fileExecutionSupport = renderRuntimeFileExecutionSupport();
  const integrationExecutionSupport = renderRuntimeIntegrationExecutionSupport();
  const postgresStateSupport = renderPostgresRuntimeStateSupport(stateRequirements);

  return `import { createServer } from "node:http";
import process from "node:process";
${fileExecutionSupport}
${integrationExecutionSupport}
${postgresStateSupport}
const runtimeVersion = ${JSON.stringify(requireToken(input.runtimeVersion, "runtime_version"))};
const environmentRef = ${JSON.stringify(requireToken(input.environmentRef, "environment_ref"))};
const requirements = ${JSON.stringify(requirements)};

function resolveBindings() {
  const resolved = [];
  for (const requirement of requirements) {
    const value = process.env[requirement.name];
    if (requirement.required && (!value || value.trim().length === 0)) {
      throw new Error(\`RUNTIME_MISSING_ENVIRONMENT_BINDING:\${requirement.name}\`);
    }
    if (value) resolved.push(requirement.name);
  }
  return resolved.sort();
}

const bindingNames = resolveBindings();
const port = Number(process.env.PORT ?? "3000");
if (!Number.isInteger(port) || port <= 0) throw new Error("RUNTIME_INVALID_PORT");

const server = createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ kind: "RuntimeHealth", status: "UP", runtimeVersion, environmentRef, bindingNames }));
    return;
  }
  if (request.method === "POST" && request.url === ${JSON.stringify(runtimeFileExecutionRoute())}) {
    await handleRuntimeFileExecution(request, response);
    return;
  }
  if (request.method === "POST" && request.url === ${JSON.stringify(runtimeIntegrationExecutionRoute())}) {
    await handleRuntimeIntegrationExecution(request, response);
    return;
  }
  if (request.method === "POST" && request.url === runtimeStateRoute) {
    await handleRuntimeStateExecution(request, response);
    return;
  }
  response.writeHead(404, { "content-type": "application/json" });
  response.end(JSON.stringify({ error: "not-found" }));
});

server.listen(port, "0.0.0.0", () => {
  process.stdout.write(JSON.stringify({ kind: "RuntimeStarted", status: "UP", port, runtimeVersion, environmentRef }) + "\\n");
});
`;
}
