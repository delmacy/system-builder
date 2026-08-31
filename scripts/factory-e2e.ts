import { readFileSync } from "node:fs";
import process from "node:process";
import { executeCanonicalFactoryE2E, materializeFactoryE2EInput } from "./factory-e2e-command.js";

function parseInputPath(argv: readonly string[]): string {
  const inputIndex = argv.indexOf("--input");
  const inputPath = inputIndex >= 0 ? argv[inputIndex + 1] : undefined;
  if (!inputPath) throw new Error("usage: npm run factory:e2e -- --input <deterministic-input.json>");
  return inputPath;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "unknown factory E2E command failure";
}

try {
  const inputPath = parseInputPath(process.argv.slice(2));
  const input = materializeFactoryE2EInput(JSON.parse(readFileSync(inputPath, "utf8")));
  const result = executeCanonicalFactoryE2E(input);
  process.stdout.write(`${JSON.stringify({ ok: true, result })}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({ ok: false, error: { code: "FACTORY_E2E_COMMAND_FAILED", message: errorMessage(error) } })}\n`);
  process.exitCode = 1;
}
