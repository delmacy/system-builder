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
      throw new Error("Usage: cli.ts <next|prepare|verify|close|validate-tasks|architecture> [TASK_ID]");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
function requireTaskId(value: string | undefined, commandName: string): asserts value is string {
  if (!value) throw new Error(`task:${commandName} requires a TASK_ID`);
}
