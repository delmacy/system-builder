import { readFileSync } from "node:fs";
import process from "node:process";
import { executeFactoryOperatorBootstrap } from "./factory-operator-bootstrap-command.js";

function parseInputPath(argv: readonly string[]): string {
  const inputIndex = argv.indexOf("--input");
  const inputPath = inputIndex >= 0 ? argv[inputIndex + 1] : undefined;
  if (!inputPath) throw new Error("usage: npm run factory:bootstrap -- --input <bootstrap-input.json>");
  return inputPath;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "unknown factory operator bootstrap failure";
}

try {
  const inputPath = parseInputPath(process.argv.slice(2));
  const result = executeFactoryOperatorBootstrap(JSON.parse(readFileSync(inputPath, "utf8")));
  process.stdout.write(`${JSON.stringify(result)}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({ ok: false, error: { code: "FACTORY_OPERATOR_BOOTSTRAP_FAILED", message: errorMessage(error) } })}\n`);
  process.exitCode = 1;
}
