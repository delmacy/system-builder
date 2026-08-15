import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  executorAdapterResultSchema,
  executorRequestSchema,
  type ExecutorAdapterResult,
  type ExecutorRequest,
} from "./execution-contracts.js";
import { developmentScopeAllowsTask } from "./human-approval.js";
import type { Task } from "./task.js";
import {
  OpenCodeModelError,
  type OpenCodeModelResolution,
  type OpenCodeModelResolver,
  type OpenCodeModelSelector,
} from "./opencode-models.js";

export type ExecutorContext = {
  task: Task;
  taskPackPath: string;
  attempt: number;
  verificationFailure?: string;
  request?: ExecutorRequest;
};

export type ExecutorReport = {
  executor: string;
  attempt: number;
  status: "completed" | "failed";
  summary: string;
  result?: ExecutorAdapterResult;
  request?: ExecutorRequest;
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
  timedOut?: boolean;
};

export type CommandRunner = (
  executable: string,
  args: string[],
  cwd: string,
  environment?: Record<string, string>,
  timeoutMs?: number,
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

export type OpenCodeModelExecutionPolicy = {
  resolver: OpenCodeModelResolver;
  selectors: Readonly<Record<string, OpenCodeModelSelector>>;
  overrideModel?: string;
};

export const boundedOpenCodeAgent = "system-builder-bounded";
export const defaultOpenCodeTimeoutMs = 15 * 60 * 1000;
export const maxOpenCodeTimeoutMs = 30 * 60 * 1000;
export const maxOpenCodeAttempts = 3;

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
    private readonly executable = "opencode",
    private readonly model?: string,
    private readonly runCommand: CommandRunner = defaultCommandRunner,
    private readonly timeoutMs = defaultOpenCodeTimeoutMs,
    private readonly modelPolicy?: OpenCodeModelExecutionPolicy,
  ) {
    if (!Number.isInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > maxOpenCodeTimeoutMs) {
      throw new Error(`OpenCode timeout must be an integer between 1 and ${maxOpenCodeTimeoutMs} ms`);
    }
  }

  canHandle(task: Task): boolean {
    const routine = ["free", "cheap"].includes(task.metadata.model_tier)
      && task.metadata.risk !== "high"
      && !task.metadata.architecture_impact
      && ["opencode", "any"].includes(task.metadata.executor_preference);
    return routine || developmentScopeAllowsTask(this.root, task, this.name);
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
    const request = context.request ? this.validateRequest(context) : undefined;
    if (context.attempt > maxOpenCodeAttempts) {
      return this.reportFailure(context, request, "BLOCKED", null, "ATTEMPT_LIMIT_EXCEEDED", "OpenCode attempt limit exceeded", false);
    }
    const version = this.runCommand(this.executable, ["--version"], this.root, undefined, this.timeoutMs);
    if (version.error || version.status !== 0) {
      return this.reportFailure(
        context,
        request,
        "BLOCKED",
        version.status,
        "ADAPTER_UNAVAILABLE",
        `OpenCode is unavailable or not executable (${version.error?.message || version.stderr || `exit ${version.status}`}). `
          + "Install/configure it locally or set OPENCODE_EXECUTABLE; no repository credential is required.",
        false,
      );
    }
    let selectedModel = request?.route.model ?? this.model;
    let modelResolution: OpenCodeModelResolution | null = null;
    const selector = this.modelPolicy?.selectors[context.task.metadata.id];
    if (selector) {
      try {
        const explicitModel = request?.route.model ?? this.model;
        const overrideModel = this.modelPolicy!.overrideModel;
        modelResolution = this.modelPolicy!.resolver.resolve({
          selector,
          ...(explicitModel ? { explicitModel } : {}),
          ...(overrideModel ? { overrideModel } : {}),
        });
        selectedModel = modelResolution.selected_model;
      } catch (error) {
        if (error instanceof OpenCodeModelError) {
          return this.reportFailure(context, request, error.retryable ? "FAILED" : "BLOCKED", null, error.code, error.message, error.retryable);
        }
        throw error;
      }
    } else if (request?.route.model && this.model && request.route.model !== this.model) {
      return this.reportFailure(
        context,
        request,
        "BLOCKED",
        null,
        "MODEL_CONFIGURATION_CONFLICT",
        `Executor request model ${request.route.model} does not match configured model ${this.model}`,
        false,
      );
    }
    const args = [
      "run", this.buildPrompt(context, repair), "--pure", "--format", "json", "--agent", boundedOpenCodeAgent,
      "--title", `${context.task.metadata.id}-attempt-${context.attempt}`,
    ];
    if (selectedModel) args.push("--model", modelResolution ? qualifyOpenCodeModel(selectedModel) : selectedModel);
    args.push("--file", context.taskPackPath);
    const result = this.runCommand(this.executable, args, this.root, {
      OPENCODE_CONFIG_CONTENT: JSON.stringify(buildOpenCodeRuntimeConfig(context.task)),
    }, this.timeoutMs);
    if (result.timedOut || (result.error as NodeJS.ErrnoException | undefined)?.code === "ETIMEDOUT") {
      return this.reportFailure(
        context,
        request,
        "TIMED_OUT",
        result.status,
        "EXECUTION_TIMEOUT",
        `OpenCode exceeded the ${this.timeoutMs} ms execution timeout`,
        context.attempt < maxOpenCodeAttempts,
        result,
        modelResolution,
      );
    }
    if (result.error || result.status !== 0) {
      return this.reportFailure(
        context,
        request,
        "FAILED",
        result.status,
        result.error ? "PROCESS_ERROR" : "NONZERO_EXIT",
        result.error?.message || result.stderr || `OpenCode exited with ${result.status}`,
        context.attempt < maxOpenCodeAttempts,
        result,
        modelResolution,
      );
    }
    const summary = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    const adapterResult = executorAdapterResultSchema.parse({
      schema_version: 1,
      task_id: context.task.metadata.id,
      attempt: context.attempt,
      adapter: "opencode",
      status: "SUCCEEDED",
      exit_code: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      model_resolution: modelResolution,
      failure: null,
    });
    this.lastReport = {
      executor: this.name,
      attempt: context.attempt,
      status: "completed",
      summary: summary || "OpenCode completed successfully",
      result: adapterResult,
      ...(request ? { request } : {}),
    };
    return this.lastReport;
  }

  private validateRequest(context: ExecutorContext): ExecutorRequest {
    const request = executorRequestSchema.parse(context.request);
    if (request.task_id !== context.task.metadata.id || request.attempt !== context.attempt) {
      throw new Error("Executor request task/attempt does not match executor context");
    }
    if (resolve(this.root, request.task_pack_path) !== resolve(context.taskPackPath)) {
      throw new Error("Executor request Task Pack path does not match executor context");
    }
    if (request.route.executor !== "opencode" || request.route.decision !== "SELECTED") {
      throw new Error("OpenCode requires an explicitly selected opencode route");
    }
    if (JSON.stringify(request.scope.allowed_paths) !== JSON.stringify(context.task.metadata.allowed_paths)
      || JSON.stringify(request.scope.forbidden_paths) !== JSON.stringify(context.task.metadata.forbidden_paths)
      || request.scope.max_files !== context.task.metadata.max_files
      || JSON.stringify(request.validation_commands) !== JSON.stringify(context.task.metadata.validation)) {
      throw new Error("Executor request scope/validation does not match the task contract");
    }
    return request;
  }

  private reportFailure(
    context: ExecutorContext,
    request: ExecutorRequest | undefined,
    status: "FAILED" | "TIMED_OUT" | "BLOCKED",
    exitCode: number | null,
    code: string,
    message: string,
    retryable: boolean,
    command: CommandResult = { status: exitCode, stdout: "", stderr: "" },
    modelResolution: OpenCodeModelResolution | null = null,
  ): ExecutorReport {
    const result = executorAdapterResultSchema.parse({
      schema_version: 1,
      task_id: context.task.metadata.id,
      attempt: context.attempt,
      adapter: "opencode",
      status,
      exit_code: exitCode,
      stdout: command.stdout,
      stderr: command.stderr,
      model_resolution: modelResolution,
      failure: { code, message, retryable },
    });
    const summary = [command.stdout, command.stderr, message].filter(Boolean).join("\n").trim();
    this.lastReport = {
      executor: this.name,
      attempt: context.attempt,
      status: "failed",
      summary,
      result,
      ...(request ? { request } : {}),
    };
    return this.lastReport;
  }
}

function qualifyOpenCodeModel(model: string): string {
  const providerPrefix = "opencode/";
  return model.startsWith(providerPrefix) ? model : `${providerPrefix}${model}`;
}

function defaultCommandRunner(
  executable: string,
  args: string[],
  cwd: string,
  environment: Record<string, string> = {},
  timeoutMs = defaultOpenCodeTimeoutMs,
): CommandResult {
  const invocation = process.platform === "win32" ? windowsInvocation(executable, args, cwd) : { executable, args };
  const result = spawnSync(invocation.executable, invocation.args, {
    cwd,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
    env: { ...process.env, ...environment },
    timeout: timeoutMs,
  });
  const error = result.error as NodeJS.ErrnoException | undefined;
  return {
    status: result.status,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? "",
    ...(result.error ? { error: result.error } : {}),
    ...(error?.code === "ETIMEDOUT" ? { timedOut: true } : {}),
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
    const lookup = spawnSync("where.exe", [executable], { cwd, encoding: "utf8", shell: false, windowsHide: true });
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