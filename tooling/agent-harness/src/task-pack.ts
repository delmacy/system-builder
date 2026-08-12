import { createHash } from "node:crypto";
import YAML from "yaml";
import { z } from "zod";
import { taskRecordSchema, type TaskRecord } from "./execution-contracts.js";
import type { NodeReadiness } from "./dag.js";
import type { Task } from "./task.js";

const sourceCommitSchema = z.string().regex(/^[0-9a-f]{40}$/);
const relativePathSchema = z.string().min(1).refine(
  (path) => !path.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(path) && !path.split(/[\\/]/).includes(".."),
  "context path must be repository-relative and cannot contain '..'",
);
const contextEntrySchema = z.object({ path: relativePathSchema, contents: z.string() }).strict();

export const taskPackManifestSchema = z.object({
  schema_version: z.literal(1),
  task_id: z.string().min(1),
  work_package_id: z.string().min(1),
  source_commit: sourceCommitSchema,
  readiness_node_id: z.string().min(1),
  context: z.array(z.object({ path: relativePathSchema, sha256: z.string().regex(/^[0-9a-f]{64}$/) }).strict()),
  task_sha256: z.string().regex(/^[0-9a-f]{64}$/),
  pack_sha256: z.string().regex(/^[0-9a-f]{64}$/),
}).strict();

export type TaskPackManifest = z.infer<typeof taskPackManifestSchema>;

export type TaskPackBuildInput = {
  record: TaskRecord;
  task: Task;
  taskFile: string;
  readiness: NodeReadiness;
  sourceCommit: string;
  context: Array<{ path: string; contents: string }>;
  stopConditions: string[];
};

export type TaskPackBuild = { content: string; manifest: TaskPackManifest };

export function buildTaskPack(input: TaskPackBuildInput): TaskPackBuild {
  const record = taskRecordSchema.parse(input.record);
  const sourceCommit = sourceCommitSchema.parse(input.sourceCommit);
  const taskFile = relativePathSchema.parse(input.taskFile);
  const context = z.array(contextEntrySchema).parse(input.context);
  const stopConditions = z.array(z.string().trim().min(1)).min(1).parse(input.stopConditions);
  assertReady(record, input.readiness);
  assertTaskMatchesRecord(input.task, record);
  assertContextMatchesRecord(context, record);
  const contextBytes = context.reduce((total, entry) => total + Buffer.byteLength(entry.contents), 0);
  if (contextBytes > 300_000) throw new Error(`Task Pack context exceeds 300000 bytes (${contextBytes})`);

  const orderedContext = [...context].sort((left, right) => left.path.localeCompare(right.path));
  const deterministicPayload = {
    schema_version: 1,
    task: record,
    source_commit: sourceCommit,
    readiness: input.readiness,
    stop_conditions: stopConditions,
    execution_result_schema_version: 1,
  } as const;
  const sections = orderedContext.map(
    (entry) => `## ${entry.path}\n\n<context-file path="${entry.path}">\n${entry.contents.trimEnd()}\n</context-file>`,
  );
  const content = [
    `# AgentFactory Task Pack — ${record.task_id}`,
    "",
    "This deterministic pack is bounded by the versioned AgentFactory execution contracts.",
    "The repository remains authoritative; undeclared context must not be inferred.",
    "",
    "## Contract",
    "",
    "```yaml",
    YAML.stringify(deterministicPayload).trimEnd(),
    "```",
    "",
    "## Task specification",
    "",
    `<task-spec path="${taskFile}">`,
    input.task.source.trimEnd(),
    "</task-spec>",
    "",
    "## Authoritative context",
    "",
    ...sections,
    "",
  ].join("\n");
  const manifest = taskPackManifestSchema.parse({
    schema_version: 1,
    task_id: record.task_id,
    work_package_id: record.work_package_id,
    source_commit: sourceCommit,
    readiness_node_id: input.readiness.id,
    context: orderedContext.map((entry) => ({ path: entry.path, sha256: hash(entry.contents) })),
    task_sha256: hash(input.task.source),
    pack_sha256: hash(content),
  });
  return { content, manifest };
}

export function buildLegacyTaskPackContent(
  task: Task,
  sourceCommit: string,
  context: Array<{ path: string; contents: string }>,
): string {
  sourceCommitSchema.parse(sourceCommit);
  const entries = z.array(contextEntrySchema).parse(context);
  return [
    `# Task Pack — ${task.metadata.id}`,
    "",
    `Prepared from commit \`${sourceCommit}\`.`,
    "This pack is bounded by the task contract. The repository remains authoritative.",
    "",
    "## Execution metadata",
    "",
    "```yaml",
    YAML.stringify(task.metadata).trimEnd(),
    "```",
    "",
    ...entries.map(
      (entry) => `## ${entry.path}\n\n<context-file path="${entry.path}">\n${entry.contents.trimEnd()}\n</context-file>`,
    ),
    "",
  ].join("\n");
}

function assertReady(record: TaskRecord, readiness: NodeReadiness): void {
  if (record.state !== "READY") throw new Error(`${record.task_id} TaskRecord is ${record.state}, not READY`);
  if (![record.task_id, record.work_package_id].includes(readiness.id)) {
    throw new Error(`Readiness node ${readiness.id} does not identify ${record.task_id}/${record.work_package_id}`);
  }
  if (readiness.readiness !== "READY" || readiness.blockers.length > 0) {
    throw new Error(`${record.task_id} is not dependency-ready: ${readiness.readiness}`);
  }
}

function assertTaskMatchesRecord(task: Task, record: TaskRecord): void {
  const comparisons: Array<[string, unknown, unknown]> = [
    ["task id", task.metadata.id, record.task_id],
    ["title", task.metadata.title, record.title],
    ["milestone", task.metadata.milestone, record.milestone],
    ["context paths", task.metadata.context_paths, record.context_paths],
    ["allowed paths", task.metadata.allowed_paths, record.allowed_paths],
    ["forbidden paths", task.metadata.forbidden_paths, record.forbidden_paths],
    ["max files", task.metadata.max_files, record.max_files],
    ["validation commands", task.metadata.validation, record.validation_commands],
  ];
  const mismatch = comparisons.find(([, taskValue, recordValue]) => (
    JSON.stringify(taskValue) !== JSON.stringify(recordValue)
  ));
  if (mismatch) throw new Error(`TaskRecord ${mismatch[0]} does not match repository task contract`);
}

function assertContextMatchesRecord(context: Array<{ path: string }>, record: TaskRecord): void {
  const actual = context.map((entry) => entry.path).sort();
  const expected = [...record.context_paths].sort();
  if (new Set(actual).size !== actual.length || JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("Task Pack context must contain each declared context path exactly once");
  }
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
