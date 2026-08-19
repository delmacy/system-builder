import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createConnection as createNetConnection, createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TLSSocket } from "node:tls";
import test from "node:test";
import { postgresQuery } from "../../packages/postgres/index.js";
import {
  renderPersistentAutonomousRuntimeEntrypoint,
  type RuntimeEnvironmentRequirement,
  type RuntimeStarted,
  type RuntimeStateRequirement,
} from "../../packages/runtime-core/index.js";

const authenticatedPostgresUrl = process.env.SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL;

function opensslAvailable(): boolean {
  try {
    execFileSync("openssl", ["version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const hasOpenSsl = opensslAvailable();
const liveSkip = authenticatedPostgresUrl === undefined ? "SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL not configured" : !hasOpenSsl ? "openssl not available" : false;

type CertMaterial = { keyPath: string; certPath: string };

function generateCa(directory: string): CertMaterial {
  const keyPath = join(directory, "ca.key");
  const certPath = join(directory, "ca.crt");
  execFileSync(
    "openssl",
    ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", keyPath, "-out", certPath, "-days", "2", "-subj", "/CN=System Builder Runtime Test CA"],
    { stdio: "ignore" },
  );
  return { keyPath, certPath };
}

function generateServerCert(directory: string, ca: CertMaterial, subject: string, san: string): CertMaterial {
  const keyPath = join(directory, `server-${san.replaceAll(":", "-")}.key`);
  const csrPath = join(directory, `server-${san.replaceAll(":", "-")}.csr`);
  const certPath = join(directory, `server-${san.replaceAll(":", "-")}.crt`);
  const extPath = join(directory, `server-${san.replaceAll(":", "-")}.ext`);
  writeFileSync(extPath, `subjectAltName=${san}\n`);
  execFileSync("openssl", ["req", "-newkey", "rsa:2048", "-nodes", "-keyout", keyPath, "-out", csrPath, "-subj", `/CN=${subject}`], { stdio: "ignore" });
  execFileSync(
    "openssl",
    ["x509", "-req", "-in", csrPath, "-CA", ca.certPath, "-CAkey", ca.keyPath, "-CAcreateserial", "-out", certPath, "-days", "2", "-extfile", extPath],
    { stdio: "ignore" },
  );
  return { keyPath, certPath };
}

type ProxyHandle = { port: number; close: () => Promise<void> };

function startTlsTerminationProxy(upstreamUrl: string, server: CertMaterial): Promise<ProxyHandle> {
  const upstream = new URL(upstreamUrl);
  const key = readFileSync(server.keyPath);
  const cert = readFileSync(server.certPath);
  return new Promise((resolve, reject) => {
    const netServer = createNetServer((downstream) => {
      let secure: TLSSocket | undefined;
      let upstreamSocket: ReturnType<typeof createNetConnection> | undefined;
      downstream.once("data", () => {
        downstream.write(Buffer.from([0x53]));
        secure = new TLSSocket(downstream, { isServer: true, key, cert });
        upstreamSocket = createNetConnection({ host: upstream.hostname, port: Number(upstream.port) });
        upstreamSocket.on("error", () => secure?.destroy());
        secure.on("error", () => upstreamSocket?.destroy());
        secure.pipe(upstreamSocket);
        upstreamSocket.pipe(secure);
      });
      downstream.on("error", () => {});
    });
    netServer.on("error", reject);
    netServer.listen(0, "127.0.0.1", () => {
      const address = netServer.address();
      if (address === null || typeof address === "string") {
        reject(new Error("proxy address missing"));
        return;
      }
      resolve({ port: address.port, close: () => new Promise((done) => netServer.close(() => done())) });
    });
  });
}

const requirements: readonly RuntimeEnvironmentRequirement[] = Object.freeze([
  Object.freeze({ name: "DATABASE_URL", kind: "secret-reference", required: true }),
]);

const stateRequirements: readonly RuntimeStateRequirement[] = Object.freeze([
  Object.freeze({
    kind: "RuntimeStateRequirement",
    capability: "state.counter",
    storeKind: "sql",
    connectionBinding: Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" }),
    migrations: Object.freeze([]),
  }),
]);

function runtimeEnvironment(environmentRef: string): unknown {
  return {
    kind: "EnvironmentProfile",
    environmentRef,
    runtimeVersions: ["0.1.0"],
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference", reference: "secret://postgres-tls-rendered-runtime" },
    ],
  };
}

function waitForJsonLine(stream: NodeJS.ReadableStream, timeoutMs = 8_000): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => reject(new Error("RUNTIME_TEST_STDOUT_TIMEOUT")), timeoutMs);
    stream.setEncoding("utf8");
    stream.on("data", (chunk: string) => {
      buffer += chunk;
      const newline = buffer.indexOf("\n");
      if (newline < 0) return;
      clearTimeout(timer);
      try {
        resolve(JSON.parse(buffer.slice(0, newline)) as unknown);
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function ensureCounterTable(): Promise<void> {
  assert.ok(authenticatedPostgresUrl);
  await postgresQuery(authenticatedPostgresUrl, "CREATE TABLE IF NOT EXISTS runtime_counter (id INTEGER PRIMARY KEY, value INTEGER NOT NULL)");
}

function renderEntrypoint(directory: string): string {
  const source = renderPersistentAutonomousRuntimeEntrypoint({
    runtimeVersion: "0.1.0",
    requirements,
    stateRequirements,
  });
  writeFileSync(join(directory, "runtime-entry.mjs"), source, "utf8");
  return source;
}

function spawnRenderedRuntime(directory: string, databaseUrl: string) {
  return spawn(process.execPath, [join(directory, "runtime-entry.mjs")], {
    cwd: directory,
    env: {
      ...process.env,
      SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(runtimeEnvironment("environment:postgres-tls-rendered-runtime")),
      SYSTEM_BUILDER_RUNTIME_PORT: "0",
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
      DATABASE_URL: databaseUrl,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

test("rendered autonomous Runtime performs verify-full positive verification and authenticates SCRAM over a verified session", { skip: liveSkip }, async () => {
  assert.ok(authenticatedPostgresUrl);
  const upstream = new URL(authenticatedPostgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-runtime-"));
  try {
    const ca = generateCa(directory);
    const server = generateServerCert(directory, ca, "127.0.0.1", "IP:127.0.0.1");
    const proxy = await startTlsTerminationProxy(authenticatedPostgresUrl, server);
    await ensureCounterTable();
    const source = renderEntrypoint(directory);
    assert.equal(source.includes(authenticatedPostgresUrl), false);
    assert.equal(source.includes(decodeURIComponent(upstream.password)), false);
    assert.equal(source.includes(decodeURIComponent(upstream.username)), false);
    assert.equal(source.includes(readFileSync(ca.certPath, "utf8")), false);

    const url = new URL(authenticatedPostgresUrl);
    url.host = "127.0.0.1";
    url.port = String(proxy.port);
    url.searchParams.set("sslmode", "verify-full");
    url.searchParams.set("sslrootcert", ca.certPath);
    const databaseUrl = url.toString();

    try {
      const child = spawnRenderedRuntime(directory, databaseUrl);
      let stderr = "";
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk: string) => { stderr += chunk; });
      const started = await waitForJsonLine(child.stdout) as RuntimeStarted;
      assert.equal(started.kind, "RuntimeStarted");
      assert.equal(started.status, "UP");
      assert.equal(child.exitCode, null);

      const response = await fetch(`http://127.0.0.1:${started.port}/state/counter/increment`, { method: "POST" });
      assert.equal(response.status, 200);
      const state = await response.json() as { kind: string; action: string; value: number };
      assert.equal(state.kind, "RuntimeState");
      assert.equal(state.action, "counter.increment");
      assert.equal(Number.isInteger(state.value) && state.value >= 1, true);

      child.kill("SIGTERM");
      const [exitCode] = await once(child, "close") as [number | null, NodeJS.Signals | null];
      assert.equal(exitCode, 0);
      assert.equal(stderr.includes(authenticatedPostgresUrl), false);
      assert.equal(stderr.includes(decodeURIComponent(upstream.password)), false);
      assert.equal(stderr.includes(decodeURIComponent(upstream.username)), false);
    } finally {
      await proxy.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("rendered autonomous Runtime performs verify-ca chain-trust positive verification over a verified session", { skip: liveSkip }, async () => {
  assert.ok(authenticatedPostgresUrl);
  const upstream = new URL(authenticatedPostgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-runtime-"));
  try {
    const ca = generateCa(directory);
    const server = generateServerCert(directory, ca, "wrong.example", "DNS:wrong.example");
    const proxy = await startTlsTerminationProxy(authenticatedPostgresUrl, server);
    await ensureCounterTable();
    renderEntrypoint(directory);

    const url = new URL(authenticatedPostgresUrl);
    url.host = "127.0.0.1";
    url.port = String(proxy.port);
    url.searchParams.set("sslmode", "verify-ca");
    url.searchParams.set("sslrootcert", ca.certPath);
    const databaseUrl = url.toString();

    try {
      const child = spawnRenderedRuntime(directory, databaseUrl);
      let stderr = "";
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk: string) => { stderr += chunk; });
      const started = await waitForJsonLine(child.stdout) as RuntimeStarted;
      assert.equal(started.kind, "RuntimeStarted");

      const response = await fetch(`http://127.0.0.1:${started.port}/state/counter/increment`, { method: "POST" });
      assert.equal(response.status, 200);
      const state = await response.json() as { kind: string; action: string; value: number };
      assert.equal(state.kind, "RuntimeState");
      assert.equal(state.action, "counter.increment");
      assert.equal(Number.isInteger(state.value) && state.value >= 1, true);

      child.kill("SIGTERM");
      const [exitCode] = await once(child, "close") as [number | null, NodeJS.Signals | null];
      assert.equal(exitCode, 0);
      assert.equal(stderr.includes(decodeURIComponent(upstream.password)), false);
    } finally {
      await proxy.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("rendered autonomous Runtime fails closed deterministically on verify-full hostname mismatch without leaking credentials", { skip: liveSkip }, async () => {
  assert.ok(authenticatedPostgresUrl);
  const upstream = new URL(authenticatedPostgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-runtime-"));
  try {
    const ca = generateCa(directory);
    const server = generateServerCert(directory, ca, "wrong.example", "DNS:wrong.example");
    const proxy = await startTlsTerminationProxy(authenticatedPostgresUrl, server);
    renderEntrypoint(directory);

    const url = new URL(authenticatedPostgresUrl);
    url.host = "127.0.0.1";
    url.port = String(proxy.port);
    url.searchParams.set("sslmode", "verify-full");
    url.searchParams.set("sslrootcert", ca.certPath);
    const databaseUrl = url.toString();

    try {
      const child = spawnRenderedRuntime(directory, databaseUrl);
      let stderr = "";
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk: string) => { stderr += chunk; });
      const started = await waitForJsonLine(child.stdout) as RuntimeStarted;
      assert.equal(started.kind, "RuntimeStarted");

      const response = await fetch(`http://127.0.0.1:${started.port}/state/counter/increment`, { method: "POST" });
      assert.equal(response.status, 503);
      const diagnostic = await response.json() as { kind: string; code: string; detail: string };
      assert.equal(diagnostic.kind, "RuntimeDiagnostic");
      assert.equal(diagnostic.code, "RUNTIME_STATE_DATABASE_FAILED");
      assert.match(diagnostic.detail, /POSTGRES_TLS_HOSTNAME_MISMATCH/);
      assert.equal(diagnostic.detail.includes(authenticatedPostgresUrl), false);
      assert.equal(diagnostic.detail.includes(decodeURIComponent(upstream.password)), false);
      assert.equal(diagnostic.detail.includes(decodeURIComponent(upstream.username)), false);

      child.kill("SIGTERM");
      const [exitCode] = await once(child, "close") as [number | null, NodeJS.Signals | null];
      assert.equal(exitCode, 0);
      assert.equal(stderr.includes(authenticatedPostgresUrl), false);
    } finally {
      await proxy.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("rendered autonomous Runtime fails closed for verify-full when the trusted CA source is unavailable", { skip: liveSkip }, async () => {
  assert.ok(authenticatedPostgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-runtime-"));
  try {
    const ca = generateCa(directory);
    const server = generateServerCert(directory, ca, "127.0.0.1", "IP:127.0.0.1");
    const proxy = await startTlsTerminationProxy(authenticatedPostgresUrl, server);
    renderEntrypoint(directory);

    const url = new URL(authenticatedPostgresUrl);
    url.host = "127.0.0.1";
    url.port = String(proxy.port);
    url.searchParams.set("sslmode", "verify-full");
    url.searchParams.set("sslrootcert", join(directory, "missing-ca.crt"));
    const databaseUrl = url.toString();

    try {
      const child = spawnRenderedRuntime(directory, databaseUrl);
      let stderr = "";
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk: string) => { stderr += chunk; });
      const started = await waitForJsonLine(child.stdout) as RuntimeStarted;
      assert.equal(started.kind, "RuntimeStarted");

      const response = await fetch(`http://127.0.0.1:${started.port}/state/counter/increment`, { method: "POST" });
      assert.equal(response.status, 503);
      const diagnostic = await response.json() as { kind: string; code: string; detail: string };
      assert.equal(diagnostic.kind, "RuntimeDiagnostic");
      assert.equal(diagnostic.code, "RUNTIME_STATE_DATABASE_FAILED");
      assert.match(diagnostic.detail, /POSTGRES_TLS_CA_UNAVAILABLE/);
      assert.equal(diagnostic.detail.includes(join(directory, "missing-ca.crt")), false);

      child.kill("SIGTERM");
      const [exitCode] = await once(child, "close") as [number | null, NodeJS.Signals | null];
      assert.equal(exitCode, 0);
      assert.equal(stderr.includes(authenticatedPostgresUrl), false);
    } finally {
      await proxy.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("rendered autonomous Runtime rejects a positive sslmode without a CA source deterministically", { skip: liveSkip }, async () => {
  assert.ok(authenticatedPostgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-runtime-"));
  try {
    const source = renderEntrypoint(directory);
    assert.equal(source.includes("verify-full"), true);
    const url = new URL(authenticatedPostgresUrl);
    url.searchParams.set("sslmode", "verify-full");
    const databaseUrl = url.toString();
    const child = spawnRenderedRuntime(directory, databaseUrl);
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => { stderr += chunk; });
    try {
      const started = await waitForJsonLine(child.stdout) as RuntimeStarted;
      assert.equal(started.kind, "RuntimeStarted");
      const response = await fetch(`http://127.0.0.1:${started.port}/state/counter/increment`, { method: "POST" });
      assert.equal(response.status, 503);
      const diagnostic = await response.json() as { kind: string; code: string; detail: string };
      assert.equal(diagnostic.code, "RUNTIME_STATE_DATABASE_FAILED");
      assert.match(diagnostic.detail, /POSTGRES_SSLMODE_CA_REQUIRED/);
      assert.equal(diagnostic.detail.includes(databaseUrl), false);
      assert.equal(stderr.includes(databaseUrl), false);
    } finally {
      if (child.exitCode === null) child.kill("SIGTERM");
      await once(child, "close").catch(() => {});
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
