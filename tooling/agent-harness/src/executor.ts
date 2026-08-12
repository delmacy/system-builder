import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import type { Task } from "./task.js";

export type ExecutorContext = {
  task: Task;
  taskPackPath: string;
  attempt: number;
  verificationFailure?: string;
};

export type ExecutorReport = {
  executor: string;
  attempt: number;
  status: "completed" | "failed";
  summary: string;
};

export interface ExecutorAdapter {
  readonly name: string;
  canHandle(task: Task): boolean;
  execute(context: ExecutorContext): ExecutorReport;
  repair(context: ExecutorContext): ExecutorReport;
  report(): ExecutorReport | undefined;
}

export type CommandResult = {
  status: number | null;
  stdout: string;
  stderr: string;
  error?: Error;
};

export type CommandRunner = (
  executable: string,
  args: string[],
  cwd: string,
  environment?: Record<string, string>,
) => CommandResult;

export type OpenCodePermissionAction = "allow" | "ask" | "deny";
export type OpenCodePatternPermission = Record<string, OpenCodePermissionAction>;
export type OpenCodePermission = {
  "*": OpenCodePermissionAction;
  read: OpenCodePatternPermission;
  edit: OpenCodePatternPermission;
  glob: OpenCodePermissionAction;
  grep: OpenCodePermissionAction;
  list: OpenCodePermissionAction;
  lsp: OpenCodePermissionAction;
  bash: OpenCodePatternPermission;
  task: OpenCodePermissionAction;
  skill: OpenCodePermissionAction;
  question: OpenCodePermissionAction;
  webfetch: OpenCodePermissionAction;
  websearch: OpenCodePermissionAction;
  external_directory: OpenCodePermissionAction;
  doom_loop: OpenCodePermissionAction;
};

export const boundedOpenCodeAgent = "system-builder-bounded";

const forbiddenGitDelivery = [
  "git add*",
  "git commit*",
  "git push*",
  "git merge*",
  "git rebase*",
  "git reset*",
  "git checkout*",
  "git switch*",
  "git restore*",
  "git clean*",
  "git rm*",
  "git mv*",
  "git tag*",
  "git fetch*",
  "git pull*",
] as const;

const safeGitInspection = [
  "git --version*",
  "git status*",
  "git diff*",
  "git log*",
  "git show*",
  "git rev-parse*",
  "git branch --show-current*",
  "git ls-files*",
  "git grep*",
] as const;

export function buildOpenCodeRuntimeConfig(task: Task): Record<string, unknown> {
  const edit: OpenCodePatternPermission = { "*": "deny" };
  for (const path of task.metadata.allowed_paths) edit[path] = "allow";
  for (const path of task.metadata.forbidden_paths) edit[path] = "deny";
  edit[".git/**"] = "deny";
  edit[".agent/**"] = "deny";

  const bash: OpenCodePatternPermission = { "*": "deny", "git *": "deny", "gh *": "deny" };
  for (const pattern of safeGitInspection) bash[pattern] = "allow";
  for (const command of safeValidationCommands(task)) {
    bash[command] = "allow";
    bash[`${command} *`] = "allow";
  }
  for (const pattern of forbiddenGitDelivery) bash[pattern] = "deny";
  bash["gh *"] = "deny";

  const permission: OpenCodePermission = {
    "*": "deny",
    read: { "*": "allow", "*.env": "deny", "*.env.*": "deny", "*.env.example": "allow" },
    edit,
    glob: "allow",
    grep: "allow",
    list: "allow",
    lsp: "allow",
    bash,
    task: "deny",
    skill: "deny",
    question: "deny",
    webfetch: "deny",
    websearch: "deny",
    external_directory: "deny",
    doom_loop: "deny",
  };
  return {
    $schema: "https://opencode.ai/config.json",
    autoupdate: false,
    share: "disabled",
    snapshot: false,
    default_agent: boundedOpenCodeAgent,
    permission,
    agent: {
      [boundedOpenCodeAgent]: {
        description: "Bounded System Builder implementation executor without Git delivery authority",
        mode: "primary",
        permission,
      },
    },
  };
}

export function resolveOpenCodeBashPermission(task: Task, command: string): OpenCodePermissionAction {
  const config = buildOpenCodeRuntimeConfig(task) as { permission: OpenCodePermission };
  let result: OpenCodePermissionAction = "deny";
  for (const [pattern, action] of Object.entries(config.permission.bash)) {
    if (globMatches(command, pattern)) result = action;
  }
  return result;
}

export class OpenCodeExecutor implements ExecutorAdapter {
  readonly name = "opencode";
  private lastReport?: ExecutorReport;

  constructor(
    private readonly root = process.cwd(),
    private readonly executable = process.env.OPENCODE_EXECUTABLE || "opencode",
    private readonly model = process.env.OPENCODE_MODEL,
    private readonly runCommand: CommandRunner = defaultCommandRunner,
  ) {}

  canHandle(task: Task): boolean {
    return ["free", "cheap"].includes(task.metadata.model_tier)
      && task.metadata.risk !== "high"
      && !task.metadata.architecture_impact
      && ["opencode", "any"].includes(task.metadata.executor_preference);
  }

  execute(context: ExecutorContext): ExecutorReport {
    return this.invoke(context, false);
  }

  repair(context: ExecutorContext): ExecutorReport {
    if (!context.verificationFailure) throw new Error("OpenCode repair requires verification failure evidence");
    return this.invoke(context, true);
  }

  report(): ExecutorReport | undefined {
    return this.lastReport;
  }

  buildPrompt(context: ExecutorContext, repair: boolean): string {
    const failure = repair
      ? `\n## Verification failure to repair\n\n${context.verificationFailure?.slice(0, 16_000)}\n`
      : "";
    return [
      `# Bounded executor instruction — ${context.task.metadata.id}`,
      "",
      `Execution attempt: ${context.attempt}.`,
      "Use only the attached Task Pack and repository files explicitly declared by it.",
      "Respect allowed_paths, forbidden_paths, max_files and every acceptance criterion.",
      "Do not broaden scope or make architecture decisions beyond the task.",
      "Do not run git commit, git push, gh, create or modify a Pull Request, or merge anything.",
      "Git delivery belongs exclusively to the System Builder harness.",
      "Do not access undeclared external context. Stop and report missing context instead of guessing.",
      "Implement the bounded change, then report files changed, checks attempted and blockers.",
      `allowed_paths: ${context.task.metadata.allowed_paths.join(", ")}`,
      `forbidden_paths: ${context.task.metadata.forbidden_paths.join(", ") || "none"}`,
      `max_files: ${context.task.metadata.max_files}`,
      failure,
      "The complete authoritative Task Pack is attached with --file. Do not substitute chat context for it.",
    ].join("\n");
  }

  private invoke(context: ExecutorContext, repair: boolean): ExecutorReport {
    const version = this.runCommand(this.executable, ["--version"], this.root);
    if (version.error || version.status !== 0) {
      throw new Error(
        `OpenCode is unavailable or not executable (${version.error?.message || version.stderr || `exit ${version.status}`}). `
        + "Install/configure it locally or set OPENCODE_EXECUTABLE; no repository credential is required.",
      );
    }
    const args = [
      "run", this.buildPrompt(context, repair), "--pure", "--format", "json", "--agent", boundedOpenCodeAgent,
      "--title", `${context.task.metadata.id}-attempt-${context.attempt}`,
    ];
    if (this.model) args.push("--model", this.model);
    args.push("--file", context.taskPackPath);
    const result = this.runCommand(this.executable, args, this.root, {
      OPENCODE_CONFIG_CONTENT: JSON.stringify(buildOpenCodeRuntimeConfig(context.task)),
    });
    const summary = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    this.lastReport = {
      executor: this.name,
      attempt: context.attempt,
      status: result.status === 0 && !result.error ? "completed" : "failed",
      summary: summary || result.error?.message || `OpenCode exited with ${result.status}`,
    };
    return this.lastReport;
  }
}

function defaultCommandRunner(
  executable: string,
  args: string[],
  cwd: string,
  environment: Record<string, string> = {},
): CommandResult {
  const invocation = process.platform === "win32" ? windowsInvocation(executable, args, cwd) : { executable, args };
  const result = spawnSync(invocation.executable, invocation.args, {
    cwd,
    encoding: "utf8",
    shell: false,
    env: { ...process.env, ...environment },
  });
  return {
    status: result.status,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? "",
    ...(result.error ? { error: result.error } : {}),
  };
}

function safeValidationCommands(task: Task): string[] {
  return task.metadata.validation.filter((command) => /^(?:npm|pnpm|yarn) run [a-zA-Z0-9:_-]+$/.test(command));
}

function globMatches(value: string, pattern: string): boolean {
  const expression = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*");
  return new RegExp(`^${expression}$`).test(value);
}

function windowsInvocation(executable: string, args: string[], cwd: string): { executable: string; args: string[] } {
  let resolved = executable;
  if (!/[\\/]/.test(executable)) {
    const lookup = spawnSync("where.exe", [executable], { cwd, encoding: "utf8", shell: false });
    resolved = lookup.stdout?.split(/\r?\n/).find(Boolean)?.trim() || executable;
  }
  const powershellWrapper = resolved.toLowerCase().endsWith(".cmd")
    ? resolved.replace(/\.cmd$/i, ".ps1")
    : `${resolved}.ps1`;
  if (existsSync(powershellWrapper)) {
    return { executable: "powershell.exe", args: ["-NoProfile", "-NonInteractive", "-File", powershellWrapper, ...args] };
  }
  if (resolved.toLowerCase().endsWith(".ps1")) {
    return { executable: "powershell.exe", args: ["-NoProfile", "-NonInteractive", "-File", resolved, ...args] };
  }
  if (resolved.toLowerCase().endsWith(".cmd") || !/\.[a-z0-9]+$/i.test(resolved)) {
    return {
      executable: "definitely-missing-safe-opencode-wrapper",
      args: [],
    };
  }
  return { executable: resolved, args };
}
