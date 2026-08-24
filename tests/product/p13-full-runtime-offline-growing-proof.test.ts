import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import test from "node:test";

const predecessorProofs = Object.freeze([
  "runtime-autonomy-e2e.test.ts",
  "p13-offline-functional-runtime-proof.test.ts",
  "p13-offline-generated-experience-proof.test.ts",
  "p13-local-health-observe-optionality.test.ts",
]);

const forbiddenEvidence = Object.freeze([
  "resolved-secret-must-not-leak",
  "postgres://resolved-user:resolved-password@localhost/runtime",
  "BEGIN CERTIFICATE",
]);

test("TASK-260 certifies the complete compiled Runtime offline autonomy growing proof", () => {
  const result = spawnSync(
    "npx",
    [
      "tsx",
      "--env-file-if-exists=.env",
      "--test",
      "--test-concurrency=1",
      ...predecessorProofs.map((file) => join("tests", "product", file)),
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
        SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
      },
      encoding: "utf8",
      timeout: 120_000,
    },
  );

  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  const evidence = `${stdout}\n${stderr}`;

  assert.equal(
    result.status,
    0,
    `TASK-260 predecessor proof failed\nstdout:\n${stdout}\nstderr:\n${stderr}`,
  );
  assert.equal(result.signal, null);
  assert.equal(result.error, undefined);

  for (const proof of predecessorProofs) {
    assert.equal(evidence.includes(proof.replace(".test.ts", "")), false, "proof output must remain bounded to test evidence rather than local paths");
  }
  for (const forbidden of forbiddenEvidence) {
    assert.equal(evidence.includes(forbidden), false, forbidden);
  }

  assert.match(evidence, /pass/i);
  assert.doesNotMatch(evidence, /Builder lookup/i);
  assert.doesNotMatch(evidence, /Observe lookup/i);
});
