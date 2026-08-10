#!/usr/bin/env node
import { relative } from "node:path";
import {
  closeTask,
  nextTask,
  prepareTask,
  validateArchitecture,
  validateTasks,
  verifyTask,
} from "./harness.js";
import { branchTask, commitTask, openTaskPullRequest, pushTask, taskGitStatus } from "./git-workflow.js";
import { OpenCodeExecutor } from "./executor.js";
import { LocalTaskOrchestrator } from "./orchestrator.js";
import { LocalHarnessAdapter } from "./orchestrator-runtime.js";

const [command, taskId] = process.argv.slice(2);

try {
  switch (command) {
    case "next": {
      const task = nextTask();
      if (!task) {
        console.log("No ready task has all dependencies completed.");
        break;
      }
      console.log(JSON.stringify({ file: relative(process.cwd(), task.file).replaceAll("\\", "/"), ...task.metadata }, null, 2));
      break;
    }
    case "prepare": {
      requireTaskId(taskId, command);
      const output = prepareTask(taskId);
      console.log(`Prepared ${relative(process.cwd(), output)}`);
      break;
    }
    case "verify": {
      requireTaskId(taskId, command);
      const receipt = verifyTask(taskId);
      console.log(JSON.stringify(receipt, null, 2));
      break;
    }
    case "close": {
      requireTaskId(taskId, command);
      const evidence = closeTask(taskId);
      console.log(`Closed ${taskId}; evidence: ${relative(process.cwd(), evidence)}`);
      break;
    }
    case "branch": {
      requireTaskId(taskId, command);
      console.log(JSON.stringify(branchTask(taskId), null, 2));
      break;
    }
    case "status": {
      requireTaskId(taskId, command);
      console.log(JSON.stringify(taskGitStatus(taskId), null, 2));
      break;
    }
    case "commit": {
      requireTaskId(taskId, command);
      console.log(`Committed ${taskId}: ${commitTask(taskId)}`);
      break;
    }
    case "push": {
      requireTaskId(taskId, command);
      console.log(`Pushed ${taskId}: ${pushTask(taskId)}`);
      break;
    }
    case "pr": {
      requireTaskId(taskId, command);
      console.log(JSON.stringify(openTaskPullRequest(taskId), null, 2));
      break;
    }
    case "advance": {
      requireTaskId(taskId, command);
      console.log(JSON.stringify(orchestrator().advance(taskId), null, 2));
      break;
    }
    case "run": {
      const selectedTaskId = taskId ?? nextTask()?.metadata.id;
      if (!selectedTaskId) throw new Error("No ready task has all dependencies completed.");
      console.log(JSON.stringify(orchestrator().run(selectedTaskId), null, 2));
      break;
    }
    case "validate-tasks": {
      console.log(`Validated ${validateTasks()} task specifications.`);
      break;
    }
    case "architecture": {
      validateArchitecture();
      console.log("Architecture gates passed.");
      break;
    }
    default:
      throw new Error("Usage: cli.ts <next|prepare|verify|close|branch|status|commit|push|pr|advance|run|validate-tasks|architecture> [TASK_ID]");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
function requireTaskId(value: string | undefined, commandName: string): asserts value is string {
  if (!value) throw new Error(`task:${commandName} requires a TASK_ID`);
}

function orchestrator(): LocalTaskOrchestrator {
  return new LocalTaskOrchestrator(new LocalHarnessAdapter(), [new OpenCodeExecutor()]);
}
