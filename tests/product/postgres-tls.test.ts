import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createConnection as createNetConnection, createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TLSSocket } from "node:tls";
import test from "node:test";
import { parsePostgresConnection, postgresQuery } from "../../packages/postgres/index.js";

const postgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;

function opensslAvailable(): boolean {
  try {
    execFileSync("openssl", ["version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const hasOpenSsl = opensslAvailable();
const liveSkip = postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : !hasOpenSsl ? "openssl not available" : false;

type CertMaterial = { keyPath: string; certPath: string };

function generateCa(directory: string): CertMaterial {
  const keyPath = join(directory, "ca.key");
  const certPath = join(directory, "ca.crt");
  execFileSync(
    "openssl",
    ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", keyPath, "-out", certPath, "-days", "2", "-subj", "/CN=System Builder Test CA"],
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

test("transport parses positive sslmode modes deterministically with a required CA source", () => {
  const verifyCa = parsePostgresConnection("postgres://u:p@127.0.0.1:5432/db?sslmode=verify-ca&sslrootcert=/tmp/ca.crt");
  assert.equal(verifyCa.sslMode, "verify-ca");
  assert.equal(verifyCa.ca, "/tmp/ca.crt");
  const verifyFull = parsePostgresConnection("postgres://u:p@127.0.0.1:5432/db?sslmode=verify-full&sslrootcert=/tmp/ca.crt");
  assert.equal(verifyFull.sslMode, "verify-full");
  assert.equal(verifyFull.ca, "/tmp/ca.crt");
});

test("transport rejects unknown and malformed positive sslmode modes deterministically", () => {
  for (const mode of ["verify-everything", "verify-", "VERIFY-CA", "certificate"]) {
    assert.throws(
      () => parsePostgresConnection(`postgres://u:p@127.0.0.1:5432/db?sslmode=${mode}&sslrootcert=/tmp/ca.crt`),
      /POSTGRES_SSLMODE_INVALID/,
      `expected ${mode} to be rejected`,
    );
  }
});

test("transport fails closed for a positive sslmode without a trusted CA source", () => {
  assert.throws(() => parsePostgresConnection("postgres://u:p@127.0.0.1:5432/db?sslmode=verify-ca"), /POSTGRES_SSLMODE_CA_REQUIRED/);
  assert.throws(() => parsePostgresConnection("postgres://u:p@127.0.0.1:5432/db?sslmode=verify-full"), /POSTGRES_SSLMODE_CA_REQUIRED/);
});

test("transport positive sslmode never downgrades when the server refuses TLS", async () => {
  const noTls = await startNoTlsServer();
  try {
    for (const mode of ["verify-ca", "verify-full"]) {
      const url = new URL("postgres://user@127.0.0.1:0/db");
      url.port = String(noTls.port);
      url.searchParams.set("sslmode", mode);
      url.searchParams.set("sslrootcert", "/tmp/unused-ca.crt");
      await assert.rejects(() => postgresQuery(url.toString(), "SELECT 1"), /POSTGRES_TLS_REQUIRED/);
    }
  } finally {
    await noTls.close();
  }
});

function startNoTlsServer(): Promise<ProxyHandle> {
  return new Promise((resolve, reject) => {
    const server = createNetServer((socket) => {
      socket.once("data", () => socket.write(Buffer.from([0x4e])));
      socket.on("error", () => {});
    });
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address === null || typeof address === "string") {
        reject(new Error("no-tls address missing"));
        return;
      }
      resolve({ port: address.port, close: () => new Promise((done) => server.close(() => done())) });
    });
  });
}

test("transport verify-ca positively verifies a trusted server chain", { skip: liveSkip }, async () => {
  assert.ok(postgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-"));
  try {
    const ca = generateCa(directory);
    const server = generateServerCert(directory, ca, "127.0.0.1", "IP:127.0.0.1");
    const proxy = await startTlsTerminationProxy(postgresUrl, server);
    try {
      const url = new URL(postgresUrl);
      url.port = String(proxy.port);
      url.searchParams.set("sslmode", "verify-ca");
      url.searchParams.set("sslrootcert", ca.certPath);
      const rows = await postgresQuery(url.toString(), "SELECT 1");
      assert.deepEqual(rows, [Object.freeze(["1"])]);
    } finally {
      await proxy.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("transport verify-full positively verifies a trusted server chain and hostname", { skip: liveSkip }, async () => {
  assert.ok(postgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-"));
  try {
    const ca = generateCa(directory);
    const server = generateServerCert(directory, ca, "127.0.0.1", "IP:127.0.0.1");
    const proxy = await startTlsTerminationProxy(postgresUrl, server);
    try {
      const url = new URL(postgresUrl);
      url.port = String(proxy.port);
      url.searchParams.set("sslmode", "verify-full");
      url.searchParams.set("sslrootcert", ca.certPath);
      const rows = await postgresQuery(url.toString(), "SELECT 1");
      assert.deepEqual(rows, [Object.freeze(["1"])]);
    } finally {
      await proxy.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("transport verify-full fails closed on hostname mismatch while verify-ca still trusts the chain", { skip: liveSkip }, async () => {
  assert.ok(postgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-"));
  try {
    const ca = generateCa(directory);
    const mismatched = generateServerCert(directory, ca, "wrong.example", "DNS:wrong.example");
    const proxy = await startTlsTerminationProxy(postgresUrl, mismatched);
    try {
      const full = new URL(postgresUrl);
      full.port = String(proxy.port);
      full.searchParams.set("sslmode", "verify-full");
      full.searchParams.set("sslrootcert", ca.certPath);
      await assert.rejects(() => postgresQuery(full.toString(), "SELECT 1"), /POSTGRES_TLS_HOSTNAME_MISMATCH/);

      const chainOnly = new URL(postgresUrl);
      chainOnly.port = String(proxy.port);
      chainOnly.searchParams.set("sslmode", "verify-ca");
      chainOnly.searchParams.set("sslrootcert", ca.certPath);
      const rows = await postgresQuery(chainOnly.toString(), "SELECT 1");
      assert.deepEqual(rows, [Object.freeze(["1"])]);
    } finally {
      await proxy.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("transport positive sslmode fails closed for an untrusted CA without leaking material", { skip: liveSkip }, async () => {
  assert.ok(postgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-"));
  try {
    const trustedCa = generateCa(directory);
    const untrustedDirectory = join(directory, "untrusted");
    mkdirSync(untrustedDirectory);
    const untrustedCa = generateCa(untrustedDirectory);
    const server = generateServerCert(directory, untrustedCa, "127.0.0.1", "IP:127.0.0.1");
    const proxy = await startTlsTerminationProxy(postgresUrl, server);
    try {
      const url = new URL(postgresUrl);
      url.port = String(proxy.port);
      url.searchParams.set("sslmode", "verify-full");
      url.searchParams.set("sslrootcert", trustedCa.certPath);
      const connectionString = url.toString();
      await assert.rejects(() => postgresQuery(connectionString, "SELECT 1"), (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /POSTGRES_TLS_CERT_UNTRUSTED$/);
        assert.equal(error.message.includes(connectionString), false);
        assert.equal(error.message.includes("verify-full"), false);
        return true;
      });
    } finally {
      await proxy.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("transport verify-ca fails closed for an untrusted chain with a deterministic diagnostic", { skip: liveSkip }, async () => {
  assert.ok(postgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-"));
  try {
    const trustedCa = generateCa(directory);
    const untrustedDirectory = join(directory, "untrusted");
    mkdirSync(untrustedDirectory);
    const untrustedCa = generateCa(untrustedDirectory);
    const server = generateServerCert(directory, untrustedCa, "127.0.0.1", "IP:127.0.0.1");
    const proxy = await startTlsTerminationProxy(postgresUrl, server);
    try {
      const url = new URL(postgresUrl);
      url.port = String(proxy.port);
      url.searchParams.set("sslmode", "verify-ca");
      url.searchParams.set("sslrootcert", trustedCa.certPath);
      const connectionString = url.toString();
      await assert.rejects(() => postgresQuery(connectionString, "SELECT 1"), (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /POSTGRES_TLS_CERT_UNTRUSTED$/);
        assert.equal(error.message.includes(connectionString), false);
        assert.equal(error.message.includes("verify-ca"), false);
        return true;
      });
    } finally {
      await proxy.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("transport positive sslmode fails closed when the trusted CA source is unavailable at connect", { skip: liveSkip }, async () => {
  assert.ok(postgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-"));
  try {
    const ca = generateCa(directory);
    const server = generateServerCert(directory, ca, "127.0.0.1", "IP:127.0.0.1");
    const proxy = await startTlsTerminationProxy(postgresUrl, server);
    try {
      const url = new URL(postgresUrl);
      url.port = String(proxy.port);
      url.searchParams.set("sslmode", "verify-full");
      url.searchParams.set("sslrootcert", join(directory, "missing-ca.crt"));
      const connectionString = url.toString();
      await assert.rejects(() => postgresQuery(connectionString, "SELECT 1"), (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /POSTGRES_TLS_CA_UNAVAILABLE$/);
        assert.equal(error.message.includes(connectionString), false);
        assert.equal(error.message.includes(join(directory, "missing-ca.crt")), false);
        assert.equal(error.message.includes("verify-full"), false);
        return true;
      });
    } finally {
      await proxy.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("transport positive sslmode never silently downgrades to the lenient session on the same endpoint", { skip: liveSkip }, async () => {
  assert.ok(postgresUrl);
  const directory = mkdtempSync(join(tmpdir(), "sb-tls-"));
  try {
    const trustedCa = generateCa(directory);
    const untrustedDirectory = join(directory, "untrusted");
    mkdirSync(untrustedDirectory);
    const untrustedCa = generateCa(untrustedDirectory);
    const server = generateServerCert(directory, untrustedCa, "127.0.0.1", "IP:127.0.0.1");
    const proxy = await startTlsTerminationProxy(postgresUrl, server);
    try {
      const lenient = new URL(postgresUrl);
      lenient.port = String(proxy.port);
      lenient.searchParams.set("sslmode", "require");
      const lenientRows = await postgresQuery(lenient.toString(), "SELECT 1");
      assert.deepEqual(lenientRows, [Object.freeze(["1"])]);

      const strict = new URL(postgresUrl);
      strict.port = String(proxy.port);
      strict.searchParams.set("sslmode", "verify-full");
      strict.searchParams.set("sslrootcert", trustedCa.certPath);
      await assert.rejects(() => postgresQuery(strict.toString(), "SELECT 1"), (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /POSTGRES_TLS_CERT_UNTRUSTED$/);
        return true;
      });
    } finally {
      await proxy.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
