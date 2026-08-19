/* global process, console */
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const HEAVY = new Set([
  "active-runtime-promotion.test.ts",
  "artifact-store-postgres.test.ts",
  "capability-runtime-e2e.test.ts",
  "catalog-postgres.test.ts",
  "deploy-postgres.test.ts",
  "deployment-rollback-postgres.test.ts",
  "durable-deployment-state.test.ts",
  "durable-factory-e2e.test.ts",
  "full-autonomous-local-e2e.test.ts",
  "local-deployment.test.ts",
  "local-process-deploy.test.ts",
  "managed-runtime-process.test.ts",
  "p7-durable-deployment-e2e.test.ts",
  "p8-deploy-postgres-transport.test.ts",
  "p8-hardened-activation-e2e.test.ts",
  "p9-active-runtime-promotion-e2e.test.ts",
  "p9-runtime-reconciliation-e2e.test.ts",
  "postgres-state-e2e.test.ts",
  "postgres-tls-rendered-runtime-e2e.test.ts",
  "postgres-tls.test.ts",
  "release-postgres.test.ts",
  "runtime-autonomy-e2e.test.ts",
  "runtime-core.test.ts",
  "runtime-reconciliation.test.ts",
  "secret-resolver-e2e.test.ts",
]);

const scope = process.argv[2] ?? "core";
if (!["core", "heavy", "full"].includes(scope)) {
  console.error(`Unknown scope '${scope}'. Expected: core | heavy | full`);
  process.exit(2);
}

const files = readdirSync(join("tests", "product"))
  .filter((file) => file.endsWith(".test.ts"))
  .sort();

const selected = scope === "full" ? files : files.filter((file) => (scope === "heavy") === HEAVY.has(file));

if (selected.length === 0) {
  console.error(`No test files selected for scope '${scope}'`);
  process.exit(2);
}

const result = spawnSync(
  "npx",
  ["tsx", "--env-file-if-exists=.env", "--test", ...selected.map((file) => join("tests", "product", file))],
  { stdio: "inherit", shell: true },
);
process.exit(result.status ?? 1);