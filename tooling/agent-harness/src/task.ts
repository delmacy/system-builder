import { readFileSync, readdirSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import YAML from "yaml";
import { z } from "zod";

const nonEmptyList = z.array(z.string().min(1)).min(1);

export const taskStatusSchema = z.enum([
  "draft",
  "ready",
  "running",
  "verification",
  "completed",
  "blocked",
  "failed",
  "superseded",
]);

export const taskMetadataSchema = z.object({
  id: z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/),
  title: z.string().min(1),
  status: taskStatusSchema,
  priority: z.number().int().nonnegative(),
  milestone: z.string().min(1),
  model_tier: z.enum(["free", "cheap", "architecture"]),
  risk: z.enum(["low", "medium", "high"]),
  architecture_impact: z.boolean(),
  executor_preference: z.enum(["opencode", "codex", "any"]),
  depends_on: z.array(z.string()),
  context_paths: nonEmptyList,
  allowed_paths: nonEmptyList,
  forbidden_paths: z.array(z.string()),
  max_files: z.number().int().positive().max(50),
  validation: nonEmptyList,
});

export type TaskMetadata = z.infer<typeof taskMetadataSchema>;

export type Task = {
  file: string;
  metadata: TaskMetadata;
  source: string;
  body: string;
};

const requiredSections = [
  "Objective",
  "Context",
  "Current behavior",
  "Required change",
  "Inputs / contracts",
  "Outputs / contracts",
  "Acceptance criteria",
  "Non-goals",
  "Evidence expected",
  "Escalation",
] as const;

export function parseTask(file: string): Task {
  const source = readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match?.[1] || match[2] === undefined) {
    throw new Error(`${file}: missing YAML frontmatter`);
  }
  const metadata = taskMetadataSchema.parse(YAML.parse(match[1]));
  const body = match[2];
  const missing = requiredSections.filter(
    (section) => !new RegExp(`^#(?:#)? ${escapeRegExp(section)}\\s*$`, "mi").test(body),
  );
  if (missing.length > 0) {
    throw new Error(`${file}: missing sections: ${missing.join(", ")}`);
  }
  if (!basename(file).startsWith(metadata.id)) {
    throw new Error(`${file}: filename must start with ${metadata.id}`);
  }
  return { file, metadata, source, body };
}
export function loadTasks(root = process.cwd()): Task[] {
  const directory = resolve(root, "specs/tasks");
  return readdirSync(directory)
    .filter((name) => /^TASK-[0-9]{3}.*\.md$/.test(name))
    .map((name) => parseTask(join(directory, name)))
    .sort((a, b) => a.metadata.priority - b.metadata.priority || a.metadata.id.localeCompare(b.metadata.id));
}

export function validateTaskCatalog(tasks: Task[]): void {
  const ids = new Set<string>();
  for (const task of tasks) {
    if (ids.has(task.metadata.id)) throw new Error(`Duplicate task id: ${task.metadata.id}`);
    ids.add(task.metadata.id);
  }
  for (const task of tasks) {
    for (const dependency of task.metadata.depends_on) {
      if (!ids.has(dependency)) throw new Error(`${task.metadata.id}: unknown dependency ${dependency}`);
      if (dependency === task.metadata.id) throw new Error(`${task.metadata.id}: task cannot depend on itself`);
    }
  }
  detectCycles(tasks);
}

export function readyTasks(tasks: Task[]): Task[] {
  const completed = new Set(
    tasks.filter((task) => task.metadata.status === "completed").map((task) => task.metadata.id),
  );
  return tasks.filter(
    (task) => task.metadata.status === "ready" && task.metadata.depends_on.every((id) => completed.has(id)),
  );
}

export function repoPath(root: string, file: string): string {
  return relative(root, file).replaceAll("\\", "/");
}

export function getTask(tasks: Task[], taskId: string): Task {
  const task = tasks.find((candidate) => candidate.metadata.id === taskId);
  if (!task) throw new Error(`Unknown task: ${taskId}`);
  return task;
}

function detectCycles(tasks: Task[]): void {
  const graph = new Map(tasks.map((task) => [task.metadata.id, task.metadata.depends_on]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): void => {
    if (visiting.has(id)) throw new Error(`Dependency cycle includes ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of graph.get(id) ?? []) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of graph.keys()) visit(id);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
