#!/usr/bin/env node
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { argv, stdout } from "node:process";

export const REQUIRED_CHECKS = ["Deterministic CI", "Heavy Product Tests"];
export const WORKERS = [":10", ":30", ":50"];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowIso(event) {
  return event.at ?? new Date().toISOString();
}

function nextWorker(owner) {
  const index = WORKERS.indexOf(owner);
  return index === -1 ? ":10" : WORKERS[(index + 1) % WORKERS.length];
}

function targetAfterOwner(state) {
  if (state.owner === "conformance") {
    return state.resume_owner ?? ":10";
  }
  return nextWorker(state.owner);
}

function readyFor(state, owner) {
  const next = clone(state);
  next.phase = "READY";
  next.lease_until = null;
  next.reason = null;
  next.checks = { deterministic: "pending", heavy: "pending" };
  next.active_pr = null;
  next.active_branch = null;
  next.active_head_sha = null;

  if (next.conformance_due && owner !== "conformance") {
    next.owner = "conformance";
    next.resume_owner = owner;
    next.conformance_due = false;
  } else {
    next.owner = owner;
    if (owner !== "conformance") next.resume_owner = null;
  }
  return next;
}

function accepted(state, event, mutate) {
  const previous = clone(state);
  const next = mutate(clone(state));
  next.sequence = state.sequence + 1;
  next.updated_at = nowIso(event);
  next.last_event = event.type;
  return { accepted: true, previous, next };
}

function ignored(state, reason) {
  return { accepted: false, previous: clone(state), next: clone(state), reason };
}

export function reduceHandoffState(state, event) {
  if (!state || state.version !== 1) throw new Error("Unsupported handoff state version");
  if (!event || typeof event.type !== "string") throw new Error("Event type is required");

  switch (event.type) {
    case "WORKER_CLAIM": {
      if (state.phase !== "READY" || state.owner !== event.owner) {
        return ignored(state, "claim owner/phase mismatch");
      }
      return accepted(state, event, (next) => {
        next.phase = "RUNNING";
        next.lease_until = event.lease_until ?? null;
        next.reason = null;
        return next;
      });
    }

    case "WORKER_HANDOFF": {
      if (!["READY", "RUNNING", "BLOCKED"].includes(state.phase) || state.owner !== event.owner) {
        return ignored(state, "handoff owner/phase mismatch");
      }
      return accepted(state, event, (next) => readyFor(next, targetAfterOwner(next)));
    }

    case "WORKER_BLOCK": {
      if (!["READY", "RUNNING"].includes(state.phase) || state.owner !== event.owner) {
        return ignored(state, "block owner/phase mismatch");
      }
      return accepted(state, event, (next) => {
        next.phase = "BLOCKED";
        next.lease_until = null;
        next.reason = event.reason ?? "worker reported blocker";
        return next;
      });
    }

    case "PR_CI_STARTED": {
      if (!["READY", "RUNNING", "BLOCKED"].includes(state.phase) || state.owner !== event.owner) {
        return ignored(state, "PR owner/phase mismatch");
      }
      return accepted(state, event, (next) => {
        next.phase = "CI_RUNNING";
        next.active_pr = event.pr;
        next.active_branch = event.branch;
        next.active_head_sha = event.head;
        next.lease_until = null;
        next.reason = null;
        next.checks = { deterministic: "pending", heavy: "pending" };
        return next;
      });
    }

    case "CHECK_COMPLETED": {
      if (state.phase !== "CI_RUNNING" || state.active_head_sha !== event.head) {
        return ignored(state, "stale or unrelated check completion");
      }
      if (!REQUIRED_CHECKS.includes(event.workflow)) {
        return ignored(state, "workflow is not a required handoff check");
      }
      return accepted(state, event, (next) => {
        const key = event.workflow === "Deterministic CI" ? "deterministic" : "heavy";
        next.checks[key] = event.conclusion === "success" ? "success" : "failure";

        if (next.checks.deterministic === "failure" || next.checks.heavy === "failure") {
          next.phase = "BLOCKED";
          next.reason = `CI_FAILED:${event.workflow}:${event.conclusion ?? "unknown"}`;
          return next;
        }

        if (next.checks.deterministic === "success" && next.checks.heavy === "success") {
          return readyFor(next, targetAfterOwner(next));
        }
        return next;
      });
    }

    case "PR_CLOSED": {
      if (state.active_pr !== event.pr || state.active_head_sha !== event.head) {
        return ignored(state, "closed PR does not match active PR/head");
      }
      return accepted(state, event, (next) => {
        next.active_pr = null;
        next.active_branch = null;
        next.active_head_sha = null;
        if (!event.merged) {
          next.phase = "BLOCKED";
          next.reason = "ACTIVE_PR_CLOSED_UNMERGED";
        }
        return next;
      });
    }

    case "CONFORMANCE_DUE": {
      if (state.owner === "conformance") return ignored(state, "conformance already owns token");
      return accepted(state, event, (next) => {
        if (next.phase === "READY") {
          next.resume_owner = next.owner;
          next.owner = "conformance";
          next.conformance_due = false;
        } else {
          next.conformance_due = true;
        }
        return next;
      });
    }

    case "CONFORMANCE_COMPLETE": {
      if (state.owner !== "conformance" || !["READY", "RUNNING", "BLOCKED"].includes(state.phase)) {
        return ignored(state, "conformance does not own token");
      }
      return accepted(state, event, (next) => readyFor(next, next.resume_owner ?? ":10"));
    }

    case "LEASE_TICK": {
      if (state.phase !== "RUNNING" || !state.lease_until) return ignored(state, "no active lease");
      const now = new Date(nowIso(event)).getTime();
      const lease = new Date(state.lease_until).getTime();
      if (!Number.isFinite(now) || !Number.isFinite(lease) || now <= lease) {
        return ignored(state, "lease has not expired");
      }
      return accepted(state, event, (next) => {
        next.phase = "READY";
        next.lease_until = null;
        next.reason = "LEASE_EXPIRED_RECOVERED";
        return next;
      });
    }

    default:
      throw new Error(`Unsupported handoff event: ${event.type}`);
  }
}

function displayState(state) {
  if (state.phase === "READY") return state.owner === "conformance" ? "READY_TO_CONF" : `READY_TO_${state.owner.slice(1)}`;
  if (state.phase === "RUNNING") return state.owner === "conformance" ? "RUNNING_CONF" : `RUNNING_${state.owner.slice(1)}`;
  if (state.phase === "CI_RUNNING") return state.owner === "conformance" ? "CI_RUNNING_CONF" : `CI_RUNNING_${state.owner.slice(1)}`;
  return state.owner === "conformance" ? "BLOCKED_CONF" : `BLOCKED_${state.owner.slice(1)}`;
}

export function renderHandoffMarkdown(state) {
  return `# Automation Sprint Handoff\n\n` +
    `machine_state: ${displayState(state)}\n` +
    `phase: ${state.phase}\n` +
    `owner: ${state.owner}\n` +
    `resume_owner: ${state.resume_owner ?? "null"}\n` +
    `sequence: ${state.sequence}\n` +
    `updated_at: ${state.updated_at}\n` +
    `lease_until: ${state.lease_until ?? "null"}\n` +
    `conformance_due: ${state.conformance_due}\n` +
    `active_pr: ${state.active_pr ?? "null"}\n` +
    `active_branch: ${state.active_branch ?? "null"}\n` +
    `active_head_sha: ${state.active_head_sha ?? "null"}\n` +
    `deterministic_ci: ${state.checks.deterministic}\n` +
    `heavy_product_tests: ${state.checks.heavy}\n` +
    `last_event: ${state.last_event ?? "null"}\n` +
    `reason: ${state.reason ?? "null"}\n\n` +
    `## Authority\n\n` +
    `This file is generated by the GitHub handoff reducer. Agents must read STATE.json and must not edit STATE.json, this Markdown, or EVENTS.ndjson directly.\n`;
}

export function renderEventLine(result, event) {
  return JSON.stringify({
    sequence: result.accepted ? result.next.sequence : result.previous.sequence,
    accepted: result.accepted,
    event,
    from: displayState(result.previous),
    to: displayState(result.next),
    reason: result.reason ?? null,
    at: result.accepted ? result.next.updated_at : nowIso(event),
  });
}

function cli() {
  const args = argv.slice(2);
  if (args.length === 0 || args.includes("--help")) return;
  const get = (name) => {
    const index = args.indexOf(name);
    if (index === -1 || !args[index + 1]) throw new Error(`Missing ${name}`);
    return args[index + 1];
  };

  const statePath = get("--state");
  const eventPath = get("--event");
  const handoffPath = get("--handoff");
  const eventsPath = get("--events");
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  const event = JSON.parse(readFileSync(eventPath, "utf8"));
  const result = reduceHandoffState(state, event);

  if (result.accepted) {
    writeFileSync(statePath, `${JSON.stringify(result.next, null, 2)}\n`);
    writeFileSync(handoffPath, renderHandoffMarkdown(result.next));
  }
  appendFileSync(eventsPath, `${renderEventLine(result, event)}\n`);
  stdout.write(`${JSON.stringify({ accepted: result.accepted, state: displayState(result.next), sequence: result.next.sequence, reason: result.reason ?? null })}\n`);
}

if (import.meta.url === `file://${argv[1]}`) cli();
