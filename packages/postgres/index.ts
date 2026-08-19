import { createHash, createHmac, pbkdf2Sync, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { createConnection, type Socket } from "node:net";
import { connect as createTlsConnection, type TLSSocket } from "node:tls";

export type PostgresSslMode = "disable" | "prefer" | "require" | "verify-ca" | "verify-full";

export type PostgresConnection = Readonly<{
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  sslMode: PostgresSslMode;
  ca?: string;
}>;

export type PostgresRow = readonly (string | null)[];

type PostgresSocket = Socket | TLSSocket;
type ScramState = { clientFirstBare: string; clientNonce: string; serverSignature?: string };

function errorCode(prefix: string, code: string): string {
  return `${prefix}_POSTGRES_${code}`;
}

export function parsePostgresConnection(connectionString: string, prefix = "POSTGRES"): PostgresConnection {
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error(errorCode(prefix, "URL_INVALID"));
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error(errorCode(prefix, "URL_INVALID"));
  }
  const user = decodeURIComponent(url.username || "");
  const password = decodeURIComponent(url.password || "");
  const database = decodeURIComponent(url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname);
  const port = url.port ? Number(url.port) : 5432;
  const sslModeValue = url.searchParams.get("sslmode") ?? "disable";
  if (sslModeValue !== "disable" && sslModeValue !== "prefer" && sslModeValue !== "require" && sslModeValue !== "verify-ca" && sslModeValue !== "verify-full") {
    throw new Error(errorCode(prefix, "SSLMODE_INVALID"));
  }
  if (!url.hostname || !user || !database || !Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(errorCode(prefix, "URL_INVALID"));
  }
  if (sslModeValue === "verify-ca" || sslModeValue === "verify-full") {
    const ca = url.searchParams.get("sslrootcert") ?? "";
    if (!ca) throw new Error(errorCode(prefix, "SSLMODE_CA_REQUIRED"));
    return Object.freeze({ host: url.hostname, port, user, password, database, sslMode: sslModeValue, ca });
  }
  return Object.freeze({ host: url.hostname, port, user, password, database, sslMode: sslModeValue });
}

function cstring(value: string): Buffer {
  return Buffer.from(`${value}\0`, "utf8");
}

function startup(config: PostgresConnection): Buffer {
  const fields = Buffer.concat([
    cstring("user"),
    cstring(config.user),
    cstring("database"),
    cstring(config.database),
    cstring("client_encoding"),
    cstring("UTF8"),
    Buffer.from([0]),
  ]);
  const message = Buffer.allocUnsafe(8 + fields.length);
  message.writeInt32BE(message.length, 0);
  message.writeInt32BE(196608, 4);
  fields.copy(message, 8);
  return message;
}

function sslRequest(): Buffer {
  const message = Buffer.allocUnsafe(8);
  message.writeInt32BE(8, 0);
  message.writeInt32BE(80877103, 4);
  return message;
}

function queryMessage(sql: string): Buffer {
  const text = Buffer.from(`${sql}\0`, "utf8");
  const message = Buffer.allocUnsafe(5 + text.length);
  message[0] = 81;
  message.writeInt32BE(4 + text.length, 1);
  text.copy(message, 5);
  return message;
}

function passwordMessage(password: string): Buffer {
  const text = Buffer.from(`${password}\0`, "utf8");
  const message = Buffer.allocUnsafe(5 + text.length);
  message[0] = 112;
  message.writeInt32BE(4 + text.length, 1);
  text.copy(message, 5);
  return message;
}

function saslInitialMessage(mechanism: string, response: string): Buffer {
  const mechanismBytes = cstring(mechanism);
  const responseBytes = Buffer.from(response, "utf8");
  const message = Buffer.allocUnsafe(1 + 4 + mechanismBytes.length + 4 + responseBytes.length);
  message[0] = 112;
  message.writeInt32BE(message.length - 1, 1);
  mechanismBytes.copy(message, 5);
  message.writeInt32BE(responseBytes.length, 5 + mechanismBytes.length);
  responseBytes.copy(message, 9 + mechanismBytes.length);
  return message;
}

function saslResponseMessage(response: string): Buffer {
  const responseBytes = Buffer.from(response, "utf8");
  const message = Buffer.allocUnsafe(5 + responseBytes.length);
  message[0] = 112;
  message.writeInt32BE(4 + responseBytes.length, 1);
  responseBytes.copy(message, 5);
  return message;
}

function postgresErrorCode(payload: Buffer): string {
  let offset = 0;
  while (offset < payload.length && payload[offset] !== 0) {
    const field = String.fromCharCode(payload[offset]!);
    offset += 1;
    const end = payload.indexOf(0, offset);
    if (end < 0) break;
    const value = payload.toString("utf8", offset, end);
    if (field === "C") return value;
    offset = end + 1;
  }
  return "UNKNOWN";
}

function tlsVerificationCode(error: unknown): string {
  const code = (error as { code?: string } | null | undefined)?.code;
  if (code === "ERR_TLS_CERT_ALTNAME_INVALID") return "TLS_HOSTNAME_MISMATCH";
  return "TLS_CERT_UNTRUSTED";
}

function dataRow(payload: Buffer): PostgresRow {
  const count = payload.readInt16BE(0);
  let offset = 2;
  const row: Array<string | null> = [];
  for (let index = 0; index < count; index += 1) {
    const length = payload.readInt32BE(offset);
    offset += 4;
    if (length === -1) {
      row.push(null);
      continue;
    }
    row.push(payload.toString("utf8", offset, offset + length));
    offset += length;
  }
  return Object.freeze(row);
}

function md5Password(password: string, user: string, salt: Buffer): string {
  const inner = createHash("md5").update(`${password}${user}`, "utf8").digest("hex");
  return `md5${createHash("md5").update(Buffer.concat([Buffer.from(inner, "utf8"), salt])).digest("hex")}`;
}

function scramName(value: string): string {
  return value.replaceAll("=", "=3D").replaceAll(",", "=2C");
}

function hmac(key: Buffer, value: string): Buffer {
  return createHmac("sha256", key).update(value, "utf8").digest();
}

function xor(left: Buffer, right: Buffer): Buffer {
  const result = Buffer.allocUnsafe(left.length);
  for (let index = 0; index < left.length; index += 1) result[index] = left[index]! ^ right[index]!;
  return result;
}

function scramFields(message: string): Map<string, string> {
  const result = new Map<string, string>();
  for (const item of message.split(",")) {
    const separator = item.indexOf("=");
    if (separator > 0) result.set(item.slice(0, separator), item.slice(separator + 1));
  }
  return result;
}

function connectPostgres(config: PostgresConnection, prefix: string): Promise<PostgresSocket> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const socket = createConnection({ host: config.host, port: config.port });
    const timer = setTimeout(() => finish(undefined, new Error(errorCode(prefix, "TIMEOUT"))), 5000);
    function finish(value?: PostgresSocket, error?: Error): void {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) {
        socket.destroy();
        reject(error);
      } else if (value !== undefined) {
        resolve(value);
      }
    }
    socket.once("error", () => finish(undefined, new Error(errorCode(prefix, "SOCKET_FAILED"))));
    socket.once("connect", () => {
      if (config.sslMode === "disable") {
        finish(socket);
        return;
      }
      socket.write(sslRequest());
      socket.once("data", (chunk) => {
        const response = chunk[0];
        if (response === 78) {
          if (config.sslMode === "require" || config.sslMode === "verify-ca" || config.sslMode === "verify-full") {
            finish(undefined, new Error(errorCode(prefix, "TLS_REQUIRED")));
          } else {
            finish(socket);
          }
          return;
        }
        if (response !== 83) {
          finish(undefined, new Error(errorCode(prefix, "TLS_NEGOTIATION_FAILED")));
          return;
        }
        if (config.sslMode === "verify-ca" || config.sslMode === "verify-full") {
          let ca: string;
          try {
            ca = readFileSync(config.ca ?? "", "utf8");
          } catch {
            finish(undefined, new Error(errorCode(prefix, "TLS_CA_UNAVAILABLE")));
            return;
          }
          const secure = createTlsConnection({
            socket,
            servername: config.host,
            rejectUnauthorized: true,
            ca,
            ...(config.sslMode === "verify-ca" ? { checkServerIdentity: () => undefined } : {}),
          });
          secure.once("secureConnect", () => finish(secure));
          secure.once("error", (error) => finish(undefined, new Error(errorCode(prefix, tlsVerificationCode(error)))));
        } else {
          const secure = createTlsConnection({ socket, servername: config.host, rejectUnauthorized: false });
          secure.once("secureConnect", () => finish(secure));
          secure.once("error", () => finish(undefined, new Error(errorCode(prefix, "TLS_FAILED"))));
        }
      });
    });
  });
}

export async function postgresQuery(
  connectionString: string,
  sql: string,
  prefix = "POSTGRES",
): Promise<readonly PostgresRow[]> {
  const config = parsePostgresConnection(connectionString, prefix);
  const socket = await connectPostgres(config, prefix);
  return new Promise((resolve, reject) => {
    let settled = false;
    let sent = false;
    let buffer = Buffer.alloc(0);
    const rows: PostgresRow[] = [];
    let scram: ScramState | undefined;
    const timer = setTimeout(() => finish(new Error(errorCode(prefix, "TIMEOUT"))), 5000);
    function finish(error?: Error): void {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      if (error) reject(error);
      else resolve(Object.freeze(rows));
    }
    socket.once("error", () => finish(new Error(errorCode(prefix, "SOCKET_FAILED"))));
    socket.write(startup(config));
    socket.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 5) {
        const type = String.fromCharCode(buffer[0]!);
        const length = buffer.readInt32BE(1);
        const total = 1 + length;
        if (length < 4 || buffer.length < total) return;
        const payload = buffer.subarray(5, total);
        buffer = buffer.subarray(total);
        if (type === "R") {
          if (payload.length < 4) {
            finish(new Error(errorCode(prefix, "AUTH_FAILED:PROTOCOL")));
            return;
          }
          const auth = payload.readInt32BE(0);
          if (auth === 0) continue;
          if (auth === 3) {
            if (!config.password) {
              finish(new Error(errorCode(prefix, "PASSWORD_REQUIRED")));
              return;
            }
            socket.write(passwordMessage(config.password));
            continue;
          }
          if (auth === 5) {
            if (!config.password || payload.length < 8) {
              finish(new Error(errorCode(prefix, "PASSWORD_REQUIRED")));
              return;
            }
            socket.write(passwordMessage(md5Password(config.password, config.user, payload.subarray(4, 8))));
            continue;
          }
          if (auth === 10) {
            if (!config.password) {
              finish(new Error(errorCode(prefix, "PASSWORD_REQUIRED")));
              return;
            }
            const mechanisms = payload.subarray(4).toString("utf8").split("\0").filter(Boolean);
            if (!mechanisms.includes("SCRAM-SHA-256")) {
              finish(new Error(`${errorCode(prefix, "AUTH_UNSUPPORTED")}:10`));
              return;
            }
            const clientNonce = randomBytes(18).toString("base64");
            const clientFirstBare = `n=${scramName(config.user)},r=${clientNonce}`;
            scram = { clientFirstBare, clientNonce };
            socket.write(saslInitialMessage("SCRAM-SHA-256", `n,,${clientFirstBare}`));
            continue;
          }
          if (auth === 11) {
            if (scram === undefined) {
              finish(new Error(`${errorCode(prefix, "AUTH_FAILED")}:SCRAM_STATE`));
              return;
            }
            const serverFirst = payload.subarray(4).toString("utf8");
            const fields = scramFields(serverFirst);
            const nonce = fields.get("r");
            const salt = fields.get("s");
            const iterationsText = fields.get("i");
            const iterations = iterationsText === undefined ? Number.NaN : Number(iterationsText);
            if (nonce === undefined || !nonce.startsWith(scram.clientNonce) || salt === undefined || !Number.isInteger(iterations) || iterations <= 0) {
              finish(new Error(`${errorCode(prefix, "AUTH_FAILED")}:SCRAM_CHALLENGE`));
              return;
            }
            const clientFinalWithoutProof = `c=biws,r=${nonce}`;
            const authMessage = `${scram.clientFirstBare},${serverFirst},${clientFinalWithoutProof}`;
            const saltedPassword = pbkdf2Sync(config.password, Buffer.from(salt, "base64"), iterations, 32, "sha256");
            const clientKey = hmac(saltedPassword, "Client Key");
            const storedKey = createHash("sha256").update(clientKey).digest();
            const proof = xor(clientKey, hmac(storedKey, authMessage)).toString("base64");
            scram.serverSignature = hmac(hmac(saltedPassword, "Server Key"), authMessage).toString("base64");
            socket.write(saslResponseMessage(`${clientFinalWithoutProof},p=${proof}`));
            continue;
          }
          if (auth === 12) {
            if (scram?.serverSignature === undefined) {
              finish(new Error(`${errorCode(prefix, "AUTH_FAILED")}:SCRAM_STATE`));
              return;
            }
            if (scramFields(payload.subarray(4).toString("utf8")).get("v") !== scram.serverSignature) {
              finish(new Error(`${errorCode(prefix, "AUTH_FAILED")}:SCRAM_SIGNATURE`));
              return;
            }
            continue;
          }
          finish(new Error(`${errorCode(prefix, "AUTH_UNSUPPORTED")}:${auth}`));
          return;
        } else if (type === "E") {
          const code = postgresErrorCode(payload);
          finish(new Error(`${sent ? errorCode(prefix, "QUERY_FAILED") : errorCode(prefix, "AUTH_FAILED")}:${code}`));
          return;
        } else if (type === "D") {
          rows.push(dataRow(payload));
        } else if (type === "Z") {
          if (!sent) {
            sent = true;
            socket.write(queryMessage(sql));
          } else {
            finish();
            return;
          }
        }
      }
    });
  });
}

export function sqlLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}
