# ADR-0012 — Real-run AgentFactory authority integration

Status: Accepted

## Context

The I2 sequential coordinator intentionally requires two authorities before a
task is reconciled: bootstrap completion in the task spec/`TASK_LEDGER.json`
and accepted AgentFactory AFEV, causal ledger, hardened PR identities, state
closure and readiness receipts. This prevented false success in the first real
candidate run.

TASK-010 executed through the real Supervisor after TASK-035 qualified the
selected OpenCode model at the CLI boundary. Implementation PR #99 and state
PR #100 passed required CI, received distinct exact signed approvals and merged.
The bootstrap orchestrator now returns `DONE`. The Supervisor nevertheless
terminated `BLOCKED` with `EVIDENCE_MISSING` immediately after `task:close`
because no `docs/evidence/agentfactory/TASK-010` authority existed.

The observed gap has three parts:

1. the real runtime reads AFEV/ledger/readiness but never materializes them;
2. bootstrap `task:close` marks the task completed before the remaining state
   branch actions, so the coordinator attempts final reconciliation too early;
3. independent validation may correctly return `REVIEW_REQUIRED` when an
   evaluator changes. The existing evidence builder then returns
   `NEEDS_DECISION`; a later exact durable approval makes the PR lifecycle
   eligible but is not represented as a resolution of that validation gate.

Runtime event files cannot fill this gap. ADR-0011 makes them ignored wake and
diagnostic state, never repository completion authority. Treating bootstrap
evidence as AFEV or hand-authoring historical receipts would violate the
repository-memory and causal-evidence invariants.

## Options considered

| Option | Result |
| --- | --- |
| Alias `docs/evidence/tasks/<TASK-ID>.json` as AFEV | Rejected. It has a different schema, identity and causal meaning and would make dual-authority reconciliation fictitious. |
| Keep AgentFactory authority only under ignored `.agent/runtime` | Rejected. It would be local, mutable and absent from reviewed repository history. |
| Add an unreviewed post-merge backfill command | Rejected. It would write completion authority after the governed lifecycle and could fabricate history. |
| Add a third authority-only PR after state closure | Rejected. It creates another external gate, allows bootstrap `DONE` to precede final authority for longer, and complicates successor selection without adding review value. |
| Include a deterministic authority closure bundle in the existing state PR | Selected. The same exact state PR/SHA, CI and approval gate integrates bootstrap closure and AgentFactory authority atomically. |

## Decision

### One versioned authority closure bundle

The existing `state/<TASK-ID>-close` PR is the single Git integration boundary
for both bootstrap closure and final AgentFactory authority. Before its commit,
the runtime materializes an append-only bundle under
`docs/evidence/agentfactory/<TASK-ID>/` containing:

- the persisted real attempt receipt(s), including AFATT when an execution or
  validation attempt did not reach accepted final evidence;
- one final AFEV bound to the task/work-package, source commit, implementation
  head commit, change fingerprint and independently executed validation;
- `ledger.json`, whose accepted transitions are causally bound to persisted
  execution, validation and lifecycle observations;
- `readiness.json`, recomputed from the accepted final ledger/evidence and the
  repository DAG without changing unrelated READY branches.

The state commit contains these files plus the existing bootstrap task spec,
task evidence and `TASK_LEDGER.json`. Git delivery must stage an exact computed
allowlist; broad staging remains forbidden. Repeated materialization is
byte-identical and append-only. Existing content at an expected path must match
exactly or stop with divergence.

The state PR lifecycle receipt still binds branch, base, head, required checks,
review channel and exact approval. No bundle is treated as integrated until
that PR merges and synchronized `main` contains the exact files.

### Governance resolution of review-required validation

The evidence boundary gains a versioned governance-resolution input for the
specific case where independent validation is technically successful but its
decision is `REVIEW_REQUIRED`. Resolution is valid only when it binds:

- the original immutable validation receipt and change fingerprint;
- the exact implementation PR number, branch and head SHA;
- successful named required checks;
- an eligible hardened lifecycle decision whose review channel is independent
  GitHub approval or valid durable human approval.

That resolution may produce final AFEV `DONE`; it cannot turn a failed command,
scope violation, missing evaluator, content mutation, invalid approval or
non-eligible PR into success. `PASS` validation continues without this extra
input. The downstream implementation must version and validate this amendment
explicitly; it may not silently mutate an existing validation receipt.

### Closure-pending coordinator state

Bootstrap completion is not final reconciliation. When the task spec/ledger is
completed but the local orchestrator still has deterministic closure actions
(`CLOSED` through state merge/sync), the sequential coordinator may delegate
exactly one such action before applying final AFEV/ledger/readiness
reconciliation. This is a governed amendment to the coordinator decision order,
not a bypass:

- only the already-selected task may advance;
- implementation PR identity must already be eligible and merged;
- state PR CI/review/approval external gates still stop;
- missing/divergent authority after state merge remains terminal;
- no successor is selected until the integrated bundle and both authorities
  reconcile.

The Supervisor kernel, callback-as-wake rule, recovery-only heartbeat, lease,
retry classification and terminal immutability remain unchanged.

### TASK-010 disposition and fresh proof

Pipeline `system-builder-i2-task-010-r1` remains terminal failed-proof evidence.
Its events and payloads are not rewritten, resumed or reclassified. TASK-010's
merged artifact and bootstrap `DONE` remain valid as the prerequisite for
TASK-004, but no historical AgentFactory AFEV is backfilled.

After the implementation task for this ADR is integrated and state-closed, a
fresh readiness assessment may authorize the intended TASK-004 -> TASK-005 ->
TASK-006 plan. That new plan must generate the closure bundle prospectively.
I2 passes only after at least TASK-004 and TASK-005 reconcile sequentially and
TASK-005 readiness is derived from integrated TASK-004 evidence.

### Owner-requested package authorization is separate

The owner requested work authorization at a bounded package level, normally
20–50 frozen task contracts, rather than a new signature for every routine
task/PR. That requirement changes approval and delegation policy, not the
authority-materialization defect decided here. It must be materialized as a
separate architecture/governance change with package identity, task allowlist,
expiry/revocation, risk ceiling, exception gates and audit semantics. Until it
is accepted and implemented, ADR-0010 remains authoritative and per-PR durable
approval cannot be inferred from package intent.

## Consequences

- A state PR becomes the atomic reviewed repository boundary for all final
  task authority, avoiding a third PR and dual-authority timing window.
- State delivery expands from three fixed bootstrap files to an exact
  task-specific closure manifest; Git workflow and tests must be amended under
  the downstream task contract.
- Evidence/governance and coordinator ordering receive narrow versioned
  amendments. Existing fail-closed evidence, ledger, readiness, GitHub,
  approval and Supervisor behavior remains mandatory.
- TASK-010 is accepted product output but not counted as successful I2
  sequential proof.
- I3, parallel scheduling and TASK-004 execution remain prohibited until the
  downstream implementation and fresh readiness gate are integrated.

## Required downstream implementation boundary

The next rolling-wave task must be bounded to the real runtime/closure bridge,
the minimum evidence-governance amendment, exact state manifest delivery,
coordinator closure-pending ordering and focused integration tests. It must not
execute TASK-004, alter the Supervisor kernel, broaden retry authority, weaken
CI/approval, or implement package authorization.

## Rollback

Disable the prospective authority materializer and continue manual bootstrap
orchestration. The coordinator must then stop `EVIDENCE_MISSING`; it may not
fall back to aliasing bootstrap evidence or ignored runtime files. Preserve all
terminal events and any integrated append-only bundles.
