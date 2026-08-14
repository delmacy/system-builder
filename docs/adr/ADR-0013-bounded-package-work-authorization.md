# ADR-0013 — Bounded package work authorization

Status: Accepted

## Context

ADR-0010 established a sound solo trust boundary: every architecture/high-risk
implementation and state PR stops until the owner signs its exact identity.
That was appropriate for bootstrap, but it makes the owner an interactive step
for each routine PR even after scope, DAG, validation and merge rules are
already approved. The owner requires AgentFactory work to be authorized in
bounded packages of 20–50 tasks.

AgentFactory also uses rolling-wave planning. An exact task spec may exist only
after its predecessor integrates, so freezing 20–50 final specs in advance
would either fabricate detail or abandon rolling-wave. Conversely, signing a
vague objective would let the executor expand its own authority. Package
authorization therefore needs an immutable middle layer: planned descriptors
that are specific enough to bound later task contracts but do not invent their
eventual implementation details.

## Options considered

| Option | Result |
| --- | --- |
| Keep exact approval per PR | Secure but rejected as the normal operating model because it prevents bounded unattended execution. |
| Sign a milestone or prose objective | Rejected. It has no deterministic scope, DAG, risk or exhaustion boundary. |
| Freeze 20–50 complete task specs | Rejected. It conflicts with rolling-wave derivation from real integrated outputs. |
| Let the executor append tasks to an approved package | Rejected. The executor would be able to expand its own authority. |
| Sign an immutable descriptor manifest and prove each later task is a bounded refinement | Selected. It preserves rolling-wave while giving deterministic scope and audit boundaries. |

## Decision

### Package plan and signed authority

A `PackageAuthorizationPlan` is canonical, versioned and content-addressed. It
contains:

- repository, package ID/version/hash and governance-policy version;
- exact baseline commit and permitted base branch;
- `valid_from`, `expires_at`, approver/key and execution focus;
- between 20 and 50 ordered, unique task descriptors;
- package-wide risk ceiling, protected paths/contracts and forbidden paths;
- allowed executors/model tiers, total action/attempt/task budgets and maximum
  consecutive failures;
- required validation/check profiles and closure/evidence policy;
- exception classes and revocation policy.

The owner signs one `PackageAuthorizationReceipt` over the entire canonical
plan hash and its authority metadata. The private key remains external and no
signing API is added. The active receipt and plan are loaded from a configured
read-only external store. Missing, malformed, future, expired, mismatched,
unauthorized or revoked authority fails closed.

Each descriptor has a stable `descriptor_id`, WP/milestone, objective and
expected outputs; predecessor descriptor/task and governance gates; allowed and
forbidden path envelopes; maximum risk/files/attempts; executor/model limits;
validation profile; and acceptance/DoD envelope. A descriptor is authority for
one final task only. It cannot be split, transferred, reused or reinterpreted.

### Rolling-wave conformance

A later task spec may use package authority only when a deterministic
`PackageTaskConformance` proves all of the following:

1. its package/descriptor IDs and hashes match the signed plan;
2. every declared predecessor is integrated and its exact evidence is cited;
3. the task objective and outputs refine, and do not broaden, the descriptor;
4. allowed paths are a subset of the descriptor envelope, forbidden paths are
   preserved or narrowed, and risk/files/attempts do not exceed the limits;
5. model/executor, validation, DoR/DoD and governance gates are equal or more
   restrictive;
6. the repository head descends from the package baseline through accepted
   work, and no intervening change touched protected inputs without an accepted
   exception;
7. the descriptor is unused and the package is active, unexpired, unrevoked,
   unsuspended and within every budget.

Conformance is recomputed before preparation, execution, PR eligibility, merge
and state closure. A task spec or output mutation invalidates prior conformance.
Generating a task spec consumes no authority by itself; the descriptor becomes
used only when its accepted implementation identity is recorded. Failed
attempts consume their signed attempt budget and remain append-only evidence.

### Routine PR and state-closure eligibility

For a conforming task, the signed package receipt may satisfy the human work
authorization channel for its implementation PR and its exact state-closure
PR. It never replaces these per-PR facts:

- exact repository/task/package/descriptor/base/head/SHA identity;
- independently executed declared validation;
- successful named required CI checks;
- allowed-path, clean-workspace, DAG and evidence conformance;
- eligible implementation lifecycle before closure;
- exact closure manifest, causal evidence and synchronized `main`.

The evaluator emits an append-only, content-derived `PackageUseReceipt` for
each task/PR/state action. It binds package/plan/descriptor/task, source and
head commits, PR number/refs/SHA, validation/check observations, decision,
policy version and the prior use-receipt hash. It is audit evidence, not a new
signature and not authority by itself. Merge remains an action, never approval.

### Exception and acceptance boundary

Package intent authorizes bounded work; it does not pre-accept decisions whose
content did not exist when the package was signed.

| Situation | Package authority | Required result |
| --- | --- | --- |
| Routine implementation/refactor/tests inside descriptor and risk ceiling | Sufficient with all normal technical gates | Continue and record package-use evidence. |
| Exact deterministic state closure of a conforming task | Sufficient with exact closure and CI/evidence gates | Continue once, then reconcile `main`. |
| Drafting an architecture proposal explicitly named by a descriptor | Authorizes proposal work only | Stop before accepting/merging the ADR decision. |
| ADR/public contract/security or evaluator-policy decision; destructive data/release action | Insufficient | Exact independent review or signed PR/SHA decision. |
| Waiver, scope/path/DAG drift, risk above ceiling, changed protected baseline or unknown descriptor | Insufficient | Stop; amend/reissue package or obtain a bounded exact exception. |
| Failed validation/checks, invalid evidence, identity mismatch or missing authority | Never sufficient | Block; approval cannot override the failure. |

An exact exception receipt binds the package, descriptor/task, observed PR/SHA,
exception class, rationale, limited authority and expiry. It cannot amend the
package or authorize later unrelated work. Accepting an ADR may unlock already
planned downstream descriptors, but it does not retroactively approve them.

### Expiry, revocation, suspension and exhaustion

- Expiry is checked at every action. Work already integrated remains historical
  evidence; no new action may begin after expiry.
- A signed append-only revocation receipt takes effect immediately for the
  named package/version/hash. No cached positive result may bypass it.
- Key removal or policy-version rotation invalidates new uses according to the
  active policy without rewriting historical receipts.
- The package suspends on protected-baseline change, authority divergence,
  budget violation or the configured consecutive-failure threshold. Resume
  requires an exact signed resolution; heartbeat/callback cannot resume it.
- The package is exhausted when every descriptor is used or any total budget is
  consumed. Unused authority cannot move to another package.

### Audit chain and one-action execution

Every attempt, task spec, implementation PR, state PR, closure bundle, ledger
transition and readiness receipt must cite package ID/hash and descriptor ID.
Package use receipts form an append-only causal chain. Divergent content at an
occupied identity stops. Supervisor invocations still perform at most one safe
action; callbacks remain wake hints and heartbeat remains recovery-only.

### Activation and migration

ADR-0010 remains the active authorization mechanism until the downstream
implementation task adds versioned schemas/evaluators, external-store loading,
lifecycle integration, conformance/audit evidence and focused proof. That task
must preserve `TEAM_INDEPENDENT` and exact `SOLO_DURABLE` as conservative
fallback/exception channels.

The first real package may be signed only after the implementation and proof
are integrated. It must contain 20–50 concrete descriptors derived from
accepted WPs/DAG. Including later-milestone descriptors does not make them
READY: execution focus, predecessors and governance gates remain mandatory.

## Threat model

The design prevents an executor with repository/GitHub credentials from
signing authority, changing a signed plan, inventing descriptors, widening a
task, reusing an exhausted slot, ignoring revocation, accepting its own ADR,
or using successful merge/CI as approval. It does not protect against owner-key
compromise; rotation/revocation and external key custody remain required.

## Consequences

- Routine conforming implementation and closure PRs can progress without a new
  owner signature while retaining exact per-PR technical evidence.
- Rolling-wave remains authoritative because task detail is derived from real
  predecessor outputs, within a previously signed descriptor envelope.
- Architecture/security/contract/evaluator decisions and deviations still stop
  for exact acceptance.
- Package planning has a higher up-front cost, but owner interaction becomes
  proportional to packages and exceptions rather than every PR.

## Required downstream implementation boundary

The next task must implement the minimum package plan/receipt/conformance/use
schemas, fail-closed evaluator, external read-only loading, lifecycle channel
integration and tests. It must prove routine implementation plus state closure,
and exception/revocation/expiry/drift failures. It must not sign the first real
package, execute WP-I2-06, alter Supervisor scheduling, start TASK-004/I3 or
weaken ADR-0010, CI, evidence, DAG or state closure.

## Rollback

Disable package mode and evaluate new work through `TEAM_INDEPENDENT` or exact
`SOLO_DURABLE`. Preserve all package plans, receipts and use chains as history;
do not delete, rewrite or reinterpret them.
