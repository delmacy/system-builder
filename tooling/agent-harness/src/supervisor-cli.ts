#!/usr/bin/env node
import { resolve } from "node:path";
import { createSupervisorRuntime, type SupervisorRuntimeOptions } from "./supervisor-runtime.js";

type RuntimeFactory = (options: SupervisorRuntimeOptions) => ReturnType<typeof createSupervisorRuntime>;

export function runSupervisorCommand(argv: string[], factory: RuntimeFactory = createSupervisorRuntime): unknown {
  const [command, ...tokens] = argv;
  if (!command || !["start", "status", "callback", "heartbeat", "resume"].includes(command)) throw new Error(usage());
  const flags = parseFlags(tokens);
  const root = resolve(flags.root ?? process.cwd());
  const planPath = required(flags, "plan");
  const runtime = factory({ root, planPath });

  switch (command) {
    case "start":
      return runtime.supervisor.start(required(flags, "pipeline"), required(flags, "correlation"));
    case "status":
      {
        const pipelineId = required(flags, "pipeline");
        const events = runtime.store.readEvents(pipelineId);
        return { projection: runtime.supervisor.status(pipelineId) ?? null, last_event: events.at(-1)?.event ?? null };
      }
    case "callback":
      return runtime.supervisor.callback({
        schema_version: 1,
        pipeline_id: required(flags, "pipeline"),
        event_id: required(flags, "event"),
        correlation_id: required(flags, "correlation"),
        reason: required(flags, "reason"),
      });
    case "heartbeat":
      return runtime.supervisor.heartbeat();
    case "resume":
      return runtime.supervisor.resume(required(flags, "pipeline"));
    default:
      throw new Error(usage());
  }
}

function parseFlags(tokens: string[]): Record<string, string> {
  const flags: Record<string, string> = {};
  for (let index = 0; index < tokens.length; index += 2) {
    const key = tokens[index];
    const value = tokens[index + 1];
    if (!key?.startsWith("--") || !value || value.startsWith("--")) throw new Error(usage());
    const name = key.slice(2);
    if (!["root", "plan", "pipeline", "correlation", "event", "reason"].includes(name) || flags[name] !== undefined) throw new Error(usage());
    flags[name] = value;
  }
  return flags;
}

function required(flags: Record<string, string>, name: string): string {
  const value = flags[name];
  if (!value) throw new Error(`SUPERVISOR_ARGUMENT_REQUIRED:--${name}\n${usage()}`);
  return value;
}

function usage(): string {
  return "Usage: supervisor-cli.ts <start|status|callback|heartbeat|resume> --plan <PATH> [--pipeline <ID>] [--correlation <ID>] [--event <AFEVT-ID>] [--reason <TEXT>]";
}

if (require.main === module) {
  try {
    console.log(JSON.stringify(runSupervisorCommand(process.argv.slice(2)), null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
