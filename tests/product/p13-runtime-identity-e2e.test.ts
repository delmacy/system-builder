import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileWorkflowRuntimeRelease } from "../../packages/compiler/workflow-runtime.js";
import { runLocalProcessDeployment } from "../../packages/deploy/local-process.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { validateTraceability } from "../../packages/validation/index.js";
import { factoryAnalysis, factoryCatalogRecords, factoryRecipe } from "./fixtures/factory-e2e.js";

const databaseUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const authValue = "p13-identity-e2e-runtime-auth-value";
const runtimeVersion = "0.13.2";
const systemDefinitionRef = "system-definition:p13-runtime-identity-e2e:1";

type RuntimeResponseBody = Readonly<{
  code?: string;
  kind?: string;
  identity?: Readonly<{ id?: string; subjectRef?: string }>;
  session?: Readonly<{ token?: string }>;
  actor?: Readonly<Record<string, unknown> & { id?: string; subjectRef?: string }>;
}>;

const definition = {
  definition: "SystemDefinition" as const,
  analysisRef: "analysis:e2e:1",
  recipeRef: "recipe:e2e:1",
  entities: [{ id: "entity:ticket", name: "Ticket", requirementRefs: ["REQ-1"], fields: [{ name: "title", type: "string" as const, required: true }] }],
  processes: [{ id: "process:ticket", name: "Ticket lifecycle", requirementRefs: ["REQ-2"], states: ["open", "closed"], initialState: "open", transitions: [] }],
  actions: [{ id: "action:update", name: "Update ticket", requirementRefs: ["REQ-1"], effect: { kind: "entity.update" as const, entityRef: "entity:ticket" } }],
  capabilities: [
    { id: "cap-auth", capability: "auth.basic", requirementRefs: ["REQ-1"] },
    { id: "cap-workflow", capability: "workflow.engine", requirementRefs: ["REQ-2"] },
  ],
  views: [],
  permissions: [],
  policies: [],
  integrations: [],
  environmentRequirements: [
    { name: "DATABASE_URL", kind: "secret-reference" as const, required: true },
    { name: "AUTH_PROVIDER", kind: "secret-reference" as const, required: true },
  ],
  authenticationProviders: [{ id: "provider:reference", bindingRef: "AUTH_PROVIDER" }],
  identities: [
    { id: "identity:active", kind: "user" as const, subjectRef: "person:active", active: true, authenticationProviderRef: "provider:reference" },
    { id: "identity:disabled", kind: "service" as const, subjectRef: "service:disabled", active: false, authenticationProviderRef: "provider:reference" },
  ],
  sessionPolicy: { lifetimeSeconds: 2 },
};

function runtimeProjection() {
  return {
    kind: "SystemDefinitionRuntimeProjection" as const,
    systemDefinitionRef,
    entities: definition.entities.map((entity) => ({ id: entity.id, fields: entity.fields.map((field) => ({ name: field.name, type: field.type, required: field.required })) })),
    actions: definition.actions.map((action) => ({ id: action.id, effect: action.effect })),
    processes: definition.processes.map((processModel) => ({ id: processModel.id, states: processModel.states, initialState: processModel.initialState, transitions: processModel.transitions })),
    environmentRequirements: definition.environmentRequirements,
    authenticationProviders: definition.authenticationProviders,
    identities: definition.identities,
    sessionPolicy: definition.sessionPolicy,
  };
}

async function waitForStarted(child: ReturnType<typeof spawn>): Promise<number> {
  const stdout = child.stdout;
  if (!stdout) throw new Error("P13_IDENTITY_STDOUT_UNAVAILABLE");
  stdout.setEncoding("utf8");
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => reject(new Error("P13_IDENTITY_START_TIMEOUT")), 10_000);
    const onData = (chunk: string) => {
      buffer += chunk;
      const newline = buffer.indexOf("\n");
      if (newline < 0) return;
      clearTimeout(timer);
      stdout.off("data", onData);
      try {
        const started = JSON.parse(buffer.slice(0, newline)) as { kind?: string; port?: number };
        if (started.kind !== "RuntimeStarted" || typeof started.port !== "number" || !Number.isInteger(started.port) || started.port <= 0) throw new Error("P13_IDENTITY_START_INVALID");
        resolve(started.port);
      } catch (error) { reject(error); }
    };
    stdout.on("data", onData);
    child.once("error", reject);
    child.once("exit", (code) => { if (code !== null && code !== 0) reject(new Error(`P13_IDENTITY_EXITED:${code}`)); });
  });
}

async function request(port: number, path: string, method: string, body?: unknown, token?: string) {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["content-type"] = "application/json";
  if (token !== undefined) headers.authorization = `Bearer ${token}`;
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    ...(Object.keys(headers).length === 0 ? {} : { headers }),
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(10_000),
  });
  return { status: response.status, body: await response.json() as RuntimeResponseBody };
}

async function stop(child: ReturnType<typeof spawn>) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => { if (child.exitCode === null) child.kill("SIGKILL"); resolve(); }, 3_000);
    child.once("exit", () => { clearTimeout(timer); resolve(); });
  });
}

test(
  "P13 identity/session grows the real factory chain through authentication session and actor-aware action execution",
  { skip: databaseUrl === undefined },
  async () => {
    if (!databaseUrl) throw new Error("SYSTEM_BUILDER_TEST_POSTGRES_URL_REQUIRED");

    const catalog = new SoftwareCatalogRegistry();
    for (const record of factoryCatalogRecords) catalog.register(record);
    const assembly = assembleSystemDefinition(definition, systemDefinitionRef, (query) => resolveCatalogCandidates(catalog, query));
    assert.equal(assembly.ok, true);
    if (!assembly.ok) return;

    const validation = validateTraceability({
      recipe: factoryRecipe,
      analysis: factoryAnalysis,
      definition,
      assemblyPlan: assembly.plan,
      assemblyPlanRef: assembly.plan.contentHash,
      declaredChecks: [{ id: "p13-runtime-identity-e2e", status: "PASS", evidenceRefs: ["test:p13-runtime-identity-e2e"] }],
    });
    assert.equal(validation.decision, "PASS");

    const compilation = compileWorkflowRuntimeRelease({
      assemblyPlan: assembly.plan,
      validationEvidence: validation,
      compilerVersion: "0.13.2",
      runtimeVersion,
      environmentSchema: definition.environmentRequirements,
      systemDefinitionRuntime: runtimeProjection(),
    });
    const artifacts = new InMemoryArtifactPayloadRepository();
    const payload = artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
    const publishedRelease = new ReleaseRegistry().publish({
      releaseId: "p13-runtime-identity-e2e",
      version: "1.0.0",
      artifact: compilation.artifact,
      publishedAt: "2026-08-23T04:00:00Z",
    });
    const environment = {
      kind: "EnvironmentProfile" as const,
      environmentRef: "environment:p13-runtime-identity-e2e",
      runtimeVersions: [runtimeVersion],
      bindings: [
        { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p13-runtime-database" },
        { name: "AUTH_PROVIDER", kind: "secret-reference" as const, reference: "secret://p13-runtime-auth" },
      ],
    };
    const resolver = new InMemorySecretResolver({
      "secret://p13-runtime-database": databaseUrl,
      "secret://p13-runtime-auth": authValue,
    });

    const missingAuth = await runLocalProcessDeployment({
      publishedRelease,
      releaseArtifact: compilation.artifact,
      artifactPayloadReader: artifacts,
      environment,
      secretResolver: new InMemorySecretResolver({ "secret://p13-runtime-database": databaseUrl }),
      timeoutMs: 10_000,
    });
    assert.equal(missingAuth.ok, false);
    if (!missingAuth.ok) {
      assert.equal(missingAuth.activated, false);
      assert.equal(missingAuth.diagnostic.code, "SECRET_RESOLUTION_FAILED");
      assert.equal(JSON.stringify(missingAuth).includes(authValue), false);
    }

    const deployment = await runLocalProcessDeployment({
      publishedRelease,
      releaseArtifact: compilation.artifact,
      artifactPayloadReader: artifacts,
      environment,
      secretResolver: resolver,
      timeoutMs: 10_000,
    });
    assert.equal(deployment.ok, true);
    if (!deployment.ok) return;
    assert.equal(deployment.health.status, "UP");

    const durableEvidence = JSON.stringify({
      artifact: compilation.artifact,
      payload,
      publishedRelease,
      deployment: { health: deployment.health, migrationApplication: deployment.migrationApplication },
    });
    assert.equal(durableEvidence.includes(databaseUrl), false);
    assert.equal(durableEvidence.includes(authValue), false);

    const directory = await mkdtemp(join(tmpdir(), "p13-runtime-identity-e2e-"));
    let child: ReturnType<typeof spawn> | undefined;
    try {
      const verified = artifacts.getVerified(compilation.artifact);
      for (const file of verified.files) {
        const target = join(directory, file.path);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, file.content, "utf8");
      }
      child = spawn(process.execPath, [join(directory, "runtime-entry.mjs")], {
        cwd: directory,
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
          AUTH_PROVIDER: authValue,
          SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(environment),
          SYSTEM_BUILDER_RUNTIME_PORT: "0",
        },
        stdio: ["ignore", "pipe", "pipe"],
      });
      const port = await waitForStarted(child);

      const created = await request(port, "/entities/entity%3Aticket/ticket-identity-1", "POST", { title: "Initial" });
      assert.equal(created.status, 201);

      const unauthenticated = await request(port, "/actions/action%3Aupdate/ticket-identity-1", "POST", { title: "Denied" });
      assert.equal(unauthenticated.status, 401);
      assert.equal(unauthenticated.body.code, "RUNTIME_UNAUTHENTICATED");

      const malformed = await request(port, "/auth/login", "POST", { providerRef: "provider:reference" });
      assert.equal(malformed.status, 400);
      assert.equal(malformed.body.code, "RUNTIME_AUTH_REQUEST_INVALID");

      const invalidCredential = await request(port, "/auth/login", "POST", {
        providerRef: "provider:reference",
        subjectRef: "person:active",
        credential: "wrong-value",
      });
      assert.equal(invalidCredential.status, 401);
      assert.equal(invalidCredential.body.code, "RUNTIME_AUTH_INVALID_CREDENTIAL");
      assert.equal(JSON.stringify(invalidCredential.body).includes(authValue), false);

      const unmapped = await request(port, "/auth/login", "POST", {
        providerRef: "provider:reference",
        subjectRef: "person:missing",
        credential: authValue,
      });
      assert.equal(unmapped.status, 401);
      assert.equal(unmapped.body.code, "RUNTIME_AUTH_IDENTITY_UNMAPPED");

      const disabled = await request(port, "/auth/login", "POST", {
        providerRef: "provider:reference",
        subjectRef: "service:disabled",
        credential: authValue,
      });
      assert.equal(disabled.status, 401);
      assert.equal(disabled.body.code, "RUNTIME_AUTH_IDENTITY_DISABLED");

      const authenticated = await request(port, "/auth/login", "POST", {
        providerRef: "provider:reference",
        subjectRef: "person:active",
        credential: authValue,
      });
      assert.equal(authenticated.status, 200);
      assert.equal(authenticated.body.kind, "RuntimeAuthenticatedIdentity");
      assert.equal(authenticated.body.identity?.id, "identity:active");
      const token = authenticated.body.session?.token;
      assert.ok(typeof token === "string" && token.length > 0);

      const session = await request(port, "/auth/session", "GET", undefined, token);
      assert.equal(session.status, 200);
      assert.equal(session.body.identity?.id, "identity:active");

      const tampered = await request(port, "/auth/session", "GET", undefined, `${token}-tampered`);
      assert.equal(tampered.status, 401);
      assert.equal(tampered.body.code, "RUNTIME_SESSION_UNKNOWN");
      assert.equal(JSON.stringify(tampered.body).includes(token), false);

      const action = await request(port, "/actions/action%3Aupdate/ticket-identity-1", "POST", { title: "Authenticated" }, token);
      assert.equal(action.status, 200);
      assert.equal(action.body.actor?.id, "identity:active");
      assert.equal(action.body.actor?.subjectRef, "person:active");
      assert.ok(action.body.actor);
      assert.equal("roles" in action.body.actor, false);
      assert.equal("permissions" in action.body.actor, false);
      assert.equal("policyDecision" in action.body, false);

      await new Promise((resolve) => setTimeout(resolve, 2_100));
      const expired = await request(port, "/auth/session", "GET", undefined, token);
      assert.equal(expired.status, 401);
      assert.equal(expired.body.code, "RUNTIME_SESSION_EXPIRED");
      assert.equal(JSON.stringify(expired.body).includes(token), false);
    } finally {
      if (child) await stop(child);
      await rm(directory, { recursive: true, force: true });
    }
  },
);
