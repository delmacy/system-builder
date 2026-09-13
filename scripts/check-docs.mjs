import { access, readFile, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import process from "node:process";
import console from "node:console";

const root = process.cwd();
const errors = [];

const requiredCurrentFiles = [
  "AGENTS.md",
  "docs/current/PROJECT_STATE.md",
  "docs/current/CURRENT_MILESTONE.md",
  "docs/current/NEXT_WORK.md",
  "docs/current/RISKS.md",
  "docs/current/TASK_LEDGER.json",
];

function repoPath(relativePath) {
  return path.join(root, relativePath);
}

async function assertReadable(relativePath) {
  try {
    await access(repoPath(relativePath), constants.R_OK);
  } catch {
    errors.push(`${relativePath}: required current authority file is missing or unreadable`);
  }
}

function stripMarkdownDecoration(value) {
  return value.replace(/[`*_]/g, "").trim();
}

function parseLifecycleMetadata(content) {
  const lines = content.split(/\r?\n/).slice(0, 80);
  const metadata = new Map();

  for (const line of lines) {
    const match = line.match(/^\s*(?:[-*]\s*)?(?:\*\*)?([A-Za-z][A-Za-z0-9 _-]{1,40})(?:\*\*)?\s*[:=]\s*(.+?)\s*$/);
    if (!match) continue;
    metadata.set(match[1].toLowerCase().replace(/[ -]+/g, "_"), stripMarkdownDecoration(match[2]));
  }

  return metadata;
}

async function validateCurrentMarkdown(relativePath) {
  const content = await readFile(repoPath(relativePath), "utf8");
  if (!content.trim()) {
    errors.push(`${relativePath}: current authority document is empty`);
    return;
  }

  if (!/^#\s+\S/m.test(content)) {
    errors.push(`${relativePath}: current authority document has no top-level heading`);
  }

  const metadata = parseLifecycleMetadata(content);
  const status = (metadata.get("status") ?? metadata.get("document_status") ?? "").toUpperCase();

  if (["SUPERSEDED", "DEPRECATED", "ARCHIVED", "CONDITIONAL_REFERENCE"].includes(status)) {
    errors.push(`${relativePath}: docs/current cannot declare lifecycle status ${status}`);
  }
}

async function validateTaskLedger() {
  const relativePath = "docs/current/TASK_LEDGER.json";
  try {
    const content = await readFile(repoPath(relativePath), "utf8");
    JSON.parse(content);
  } catch (error) {
    errors.push(`${relativePath}: invalid JSON (${error instanceof Error ? error.message : String(error)})`);
  }
}

async function walkMarkdown(relativeDirectory) {
  const absoluteDirectory = repoPath(relativeDirectory);
  let entries;
  try {
    entries = await readdir(absoluteDirectory, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkMarkdown(relativePath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(relativePath);
    }
  }
  return files;
}

async function validateLifecycleMarkers(relativePath) {
  const content = await readFile(repoPath(relativePath), "utf8");
  const metadata = parseLifecycleMetadata(content);
  const status = (metadata.get("status") ?? metadata.get("document_status") ?? "").toUpperCase();

  if (status === "SUPERSEDED") {
    const replacement = metadata.get("superseded_by") ?? metadata.get("replacement") ?? metadata.get("successor");
    if (!replacement) {
      errors.push(`${relativePath}: SUPERSEDED requires superseded_by/replacement/successor metadata`);
    }
  }

  if (status === "DEPRECATED") {
    const replacement = metadata.get("replacement") ?? metadata.get("superseded_by") ?? metadata.get("successor");
    if (!replacement) {
      errors.push(`${relativePath}: DEPRECATED requires replacement/superseded_by/successor metadata`);
    }
  }

  if (status === "CONDITIONAL_REFERENCE") {
    const condition = metadata.get("activation_condition") ?? metadata.get("condition") ?? metadata.get("active_when");
    if (!condition) {
      errors.push(`${relativePath}: CONDITIONAL_REFERENCE requires activation_condition/condition/active_when metadata`);
    }
  }
}

for (const relativePath of requiredCurrentFiles) {
  await assertReadable(relativePath);
}

for (const relativePath of [
  "docs/current/PROJECT_STATE.md",
  "docs/current/CURRENT_MILESTONE.md",
  "docs/current/NEXT_WORK.md",
  "docs/current/RISKS.md",
]) {
  try {
    await validateCurrentMarkdown(relativePath);
  } catch (error) {
    errors.push(`${relativePath}: could not be validated (${error instanceof Error ? error.message : String(error)})`);
  }
}

await validateTaskLedger();

for (const rootDirectory of ["docs/current", "project_docs/schedule"]) {
  for (const relativePath of await walkMarkdown(rootDirectory)) {
    await validateLifecycleMarkers(relativePath);
  }
}

if (errors.length > 0) {
  console.error("Documentation verification failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Documentation verification passed.");
