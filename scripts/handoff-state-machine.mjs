#!/usr/bin/env node
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { argv, stdout } from "node:process";

export const REQUIRED_CHECKS = ["Deterministic CI", "Heavy Product Tests"];
export const WORKERS = [":10", ":30", ":50", "conformance"];

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

function normalize(state) {
  const next = clone(state);
  next.version = 2;
  next.next_worker ??= state.owner ?? ":10";
  next.claimed_by ??= state.phase === "RUNNING" ? state.owner ?? null : null;
  next.claim_until ??= state.lease_until ?? null;
  next.resume_worker ??= state.resume_owner ?? null;
  next.sequence ??= 0;
  next.updated_at ??= new Date().toISOString();
  next.active_pr ??= null;
  next.active_branch ??= null;
  next.active_head_sha ??= null;
  next.checks ??= { deterministic: "pending", heavy: "pending" };
  next.reason ??= null;
  next.last_event ??= null;
  return syncLegacy(next);
}

function syncLegacy(state) {
  state.owner = state.next_worker;
  state.resume_owner = state.resume_worker ?? null;
  state.lease_until = state.claim_until ?? null;
  state.phase = state.claimed_by === state.next_worker ? "RUNNING" : "READY";
  state.conformance_due = false;
  return state;
}

function accepted(state, event, mutate) {
  const previous = normalize(state);
  const next = mutate(clone(previous));
  next.sequence = previous.sequence + 1;
  next.updated_at = nowIso(event);
  next.last_event = event.type;
  return { accepted: true, previous, next: syncLegacy(next) };
}

function ignored(state, reason) {
  const normalized = normalize(state);
  return { accepted: false, previous: clone(normalized), next: clone(normalized), reason };
}

function claimExpired(state, event) {
  if (!state.claimed_by || !state.claim_until) return true;
  const now = new Date(nowIso(event)).getTime();
  const until = new Date(state.claim_until).getTime();
  return !Number.isFinite(until) || !Number.isFinite(now) || now > until;
}

export function reduceHandoffState(rawState, event) {
  if (!rawState || ![1, 2].includes(rawState.version)) throw new Error("Unsupported handoff state version");
  if (!event || typeof event.type !== "string") throw new Error("Event type is required");
  const state = normalize(rawState);

  switch (event.type) {
    case "WORKER_CLAIM": {
      if (state.next_worker !== event.owner) return ignored(state, "claim next_worker mismatch");
      if (state.claimed_by && state.claimed_by !== event.owner && !claimExpired(state, event)) {
        return ignored(state, "token already claimed");
      }
      return accepted(state, event, (next) => {
        next.claimed_by = event.owner;
        next.claim_until = event.lease_until ?? null;
        next.reason = null;
        return next;
      });
    }

    case "WORKER_HANDOFF": {
      if (state.next_worker !== event.owner) return ignored(state, "handoff next_worker mismatch");
      return accepted(state, event, (next) => {
        next.next_worker = nextWorker(event.owner);
        next.claimed_by = null;
        next.claim_until = null;
        next.reason = null;
        return next;
      });
    }

    case "WORKER_BLOCK": {
      if (state.next_worker !== event.owner) return ignored(state, "block next_worker mismatch");
      return accepted(state, event, (next) => {
        next.reason = event.reason ?? "worker reported blocker";
        next.next_worker = nextWorker(event.owner);
        next.claimed_by = null;
        next.claim_until = null;
        return next;
      });
    }

    case "PR_CI_STARTED": {
      if (state.next_worker !== event.owner && state.claimed_by !== event.owner) {
        return ignored(state, "PR owner is not current token holder");
      }
      return accepted(state, event, (next) => {
        next.active_pr = event.pr;
        next.active_branch = event.branch;
        next.active_head_sha = event.head;
        next.checks = { deterministic: "pending", heavy: "pending" };
        next.reason = null;
        next.next_worker = nextWorker(event.owner);
        next.claimed_by = null;
        next.claim_until = null;
        if (next.next_worker === "conformance") next.resume_worker = null;
        return next;
      });
    }

    case "CHECK_COMPLETED": {
      if (!REQUIRED_CHECKS.includes(event.workflow)) {
        return ignored(state, "workflow is not a required handoff check");
      }
      if (state.active_head_sha && state.active_head_sha !== event.head) {
        return ignored(state, "stale or unrelated check completion");
      }
      return accepted(state, event, (next) => {
        const key = event.workflow === "Deterministic CI" ? "deterministic" : "heavy";
        next.checks[key] = event.conclusion === "success" ? "success" : "failure";
        if (next.checks.deterministic === "failure" || next.checks.heavy === "failure") {
          next.reason = `CI_FAILED:${event.workflow}:${event.conclusion ?? "unknown"}`;
        } else if (next.checks.deterministic === "success" && next.checks.heavy === "success") {
          next.reason = null;
        }
        return next;
      });
    }

    case "PR_CLOSED": {
      if (state.active_pr !== event.pr) return ignored(state, "closed PR does not match active PR");
      return accepted(state, event, (next) => {
        next.active_pr = null;
        next.active_branch = null;
        next.active_head_sha = null;
        next.checks = { deterministic: "pending", heavy: "pending" };
        next.reason = event.merged ? null : "ACTIVE_PR_CLOSED_UNMERGED";
        return next;
      });
    }

    case "CONFORMANCE_DUE": {
      if (state.next_worker === "conformance") return ignored(state, "conformance already next");
      return accepted(state, event, (next) => {
        next.resume_worker = next.next_worker;
        next.next_worker = "conformance";
        next.claimed_by = null;
        next.claim_until = null;
        return next;
      });
    }

    case "CONFORMANCE_COMPLETE": {
      if (state.next_worker !== "conformance" && state.claimed_by !== "conformance") {
        return ignored(state, "conformance does not hold token");
      }
      return accepted(state, event, (next) => {
        next.next_worker = next.resume_worker ?? nextWorker("conformance");
        next.resume_worker = null;
        next.claimed_by = null;
        next.claim_until = null;
        next.reason = null;
        return next;
      });
    }

    case "LEASE_TICK": {
      if (!state.claimed_by || !state.claim_until || !claimExpired(state, event)) {
        return ignored(state, "no expired claim");
      }
      return accepted(state, event, (next) => {
        next.claimed_by = null;
        next.claim_until = null;
        next.reason = "CLAIM_EXPIRED_RECOVERED";
        return next;
      });
    }

    default:
      throw new Error(`Unsupported handoff event: ${event.type}`);
  }
}

function displayState(state) {
  const normalized = normalize(state);
  const who = normalized.next_worker === "conformance" ? "CONF" : normalized.next_worker.slice(1);
  return normalized.claimed_by === normalized.next_worker ? `CLAIMED_${who}` : `NEXT_${who}`;
}

export function renderHandoffMarkdown(state) {
  const s = normalize(state);
  return `# Automation Sprint Handoff\n\n` +
    `machine_state: ${displayState(s)}\n` +
    `next_worker: ${s.next_worker}\n` +
    `claimed_by: ${s.claimed_by ?? "null"}\n` +
    `claim_until: ${s.claim_until ?? "null"}\n` +
    `sequence: ${s.sequence}\n` +
    `updated_at: ${s.updated_at}\n` +
    `active_pr: ${s.active_pr ?? "null"}\n` +
    `active_branch: ${s.active_branch ?? "null"}\n` +
    `active_head_sha: ${s.active_head_sha ?? "null"}\n` +
    `deterministic_ci: ${s.checks.deterministic}\n` +
    `heavy_product_tests: ${s.checks.heavy}\n` +
    `last_event: ${s.last_event ?? "null"}\n` +
    `reason: ${s.reason ?? "null"}\n\n` +
    `## Authority\n\n` +
    `Only next_worker selects who may work. Claims, CI, PR metadata and reasons are advisory context and must never create a permanent queue lock.\n`;
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
