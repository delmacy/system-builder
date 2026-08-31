import { readFileSync } from "node:fs";
import process from "node:process";
import {
  diagnoseFactoryOperatorBootstrapFailure,
  executeFactoryOperatorBootstrap,
} from "./factory-operator-bootstrap-command.js";

function parseInputPath(argv: readonly string[]): string {
  const inputIndex = argv.indexOf("--input");
  const inputPath = inputIndex >= 0 ? argv[inputIndex + 1] : undefined;
  if (!inputPath) throw new Error("usage: npm run factory:bootstrap -- --input <bootstrap-input.json>");
  return inputPath;
}

try {
  const inputPath = parseInputPath(process.argv.slice(2));
  const result = executeFactoryOperatorBootstrap(JSON.parse(readFileSync(inputPath, "utf8")));
  process.stdout.write(`${JSON.stringify(result)}\n`);
} catch (error) {
  const diagnostic = diagnoseFactoryOperatorBootstrapFailure(error);
  process.stderr.write(`${JSON.stringify({ ok: false, error: diagnostic })}\n`);
  process.exitCode = 1;
}
