# Planning B — Architecture Reconciliation as a Capability — SB Current State Reconciliation

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Fresh main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`
Scope: repository reconciliation only. No target architecture, product code, Work Package, TASK, Construction, PR or worker handoff.

## Planning A boundary carried forward
Architecture Reconciliation owns evidence-qualified comparison between explicitly identified desired/product truth and observed/effective truth, drift identity/classification, owner routing, ambiguous-outcome reconciliation, governed normalization/adoption proposal lineage, correction/supersession and scoped closure. It does not own the underlying semantic truths, provider/runtime actuation, telemetry production, governance policy, recovery qualification or domain semantics.

## Fresh-main evidence
Fresh main has a substantive repository-first reconciliation discipline rather than a first-class generalized Architecture Reconciliation subsystem.

- `docs/adr/ADR-0006-repository-as-memory.md` makes the repository canonical durable project memory and requires durable decisions, contracts/specs/code/gates, fresh-session reconstructability and state updates at task/milestone completion.
- `project_docs/schedule/SPRINT_MODE.md` requires fresh-main planning to reconcile repository memory, architecture boundaries, dependencies, risks and readiness before new construction; package integration/review explicitly checks end-to-end regression, contract/schema drift, architecture fitness, dependency accuracy, debt, security/trust, CI health, documentation consistency and risks; documentation closure must reconcile current-state documents and refuses closure while repository memory is stale.
- Package integration review artifacts such as `P17-PACKAGE-01-INTEGRATION-REVIEW-01.md` record exact fresh-main/reviewed-head/merge identities, exact-head validation evidence, tree equivalence, explicit review findings, technical-debt carry-forward, exclusions, and a bounded GO disposition. They distinguish reviewed evidence from integrated state and prevent unrelated finding/debt absorption by inference.
- The repository contains ADRs as durable architecture-decision records and repeated package/sprint reports that bind decisions, evidence, non-goals, dependency/risk context and closure status to repository history.

These mechanisms demonstrate real evidence -> review finding -> disposition -> repository-memory reconciliation workflows at planning/review/closure boundaries. They also demonstrate that acceptance/merge/tree-equivalence evidence is recorded separately from semantic review findings.

## What is already strong enough to KEEP
1. **Repository as canonical project memory.** Durable architecture and execution truth is intentionally reconstructable from versioned repository artifacts rather than chat state.
2. **Fresh-main reconciliation gates.** Planning and successor promotion are conditioned on re-reading current integrated state rather than blindly trusting prior forecasts.
3. **Explicit architecture-review dimensions.** Package review already calls out architecture fitness, contract/schema drift, dependency accuracy, technical debt, security/trust, risks and documentation consistency.
4. **Evidence-bound review identity.** Review artifacts record base/head/merge SHA and exact-head CI evidence, reducing ambiguity about what was actually assessed.
5. **Bounded dispositions and exclusions.** Review documents distinguish GO/no-go, carried debt, explicit exclusions and non-absorption of unrelated findings.
6. **Closure blocked by stale memory.** Documentation closure explicitly requires current repository-memory consistency before a package can be closed.
7. **ADR-backed durable rationale.** Architectural decisions are represented separately from transient execution status and remain part of the durable authority chain.

Disposition: **KEEP**.

## Material gaps against Planning A
Fresh main does **not** evidence a generalized first-class canonical reconciliation record with all of the following semantics:

- canonical reconciliation subject identity plus semantic owner, intended revision/applicability scope, realization/binding revision and observation horizon;
- typed cross-capability comparison results such as `CONFORMANT`, `DRIFTED`, `PARTIAL`, `INCONCLUSIVE`;
- canonical drift identity/classification independent of prose review findings;
- evidence envelopes carrying provenance/currentness/coverage/uncertainty sufficient to replay a reconciliation assessment;
- generic stale/current evidence qualification or contradiction resolution across independently changing evidence producers;
- generalized `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` effect classification and cross-capability reconcile-before-retry semantics;
- governed normalization/adoption proposal lineage when observed reality should become canonical desired truth;
- correction/supersession semantics for reconciliation records and producing evidence;
- explicit reopen semantics when prior closure becomes stale because revisions, applicability, providers or evidence horizons change;
- residual authoritative cohort inventory that can mechanically keep reconciliation open;
- deterministic machine-readable handoff from architecture finding to semantic/realization owner without collapsing ownership into one architecture god-object;
- generalized proof-obligation records linking architecture findings to dependency/risk/non-goal/acceptance evidence across capabilities;
- Enterprise -> Station -> Role -> Person authority semantics for reconciliation visibility, proposal authority and remediation routing.

Current package-review and repository-memory practices provide disciplined process evidence, but most Architecture Reconciliation semantics remain document/process conventions rather than canonical reusable product/platform primitives.

## Contradiction and stale-state behavior
The repository strongly rejects stale repository memory at closure and requires fresh-main revalidation before promoting successor work. This is a meaningful precursor to currentness-aware reconciliation. However, contradiction handling is largely human/document procedural: no generalized evidence-currentness model or canonical `INCONCLUSIVE` assessment record is evidenced.

Likewise, package review can carry debt/findings forward and prevent unrelated absorption, but no general correction/supersession/reopen graph for architecture reconciliation itself is evidenced.

Disposition: **HARDEN + GENERALIZE** the existing repository-first reconciliation discipline into reusable semantics only where later target architecture explicitly authorizes it; Planning B does not invent that target.

## Finding-to-planning handoff
The repository already has bounded handoff discipline: package review findings can become carried debt, corrective work or successor planning, and missing capability is explicitly returned to construction/change control rather than smuggled into review/closure. This is strong behavioral evidence for separation between assessment and actuation.

What remains unevidenced is a canonical machine-readable owner-routing/proof-obligation record spanning semantic owners and realization owners.

Disposition: **KEEP + INTEGRATE**.

## Provider and external identity
No evidence found that provider/runtime identifiers are promoted to canonical architecture identity by default. Existing repository evidence instead anchors architectural/review truth to SB-owned repository identities, revisions and commit/tree evidence.

Disposition: **KEEP** provider/external IDs non-canonical unless an owning semantic capability explicitly authorizes adoption.

## Authority and AI / AGWS
No repository evidence establishes generalized `Enterprise -> Station -> Role -> Person` reconciliation authority, Station-scoped reconciliation exposure or delegated remediation/normalization authority. These remain gaps rather than inferred implementation.

No evidence grants AI or Adaptive Governed Work Surfaces authority to manufacture evidence, turn ambiguous state into PASS, silently adopt observed state as canonical or bypass semantic-owner validation.

Disposition: **HARDEN / INTEGRATE later only with explicit authority**; preserve AI/AGWS non-amplification.

## Disposition summary
- **KEEP:** repository-as-memory, fresh-main revalidation, ADR decision records, exact-head evidence binding, explicit review findings/exclusions/debt carry-forward, stale-memory closure blocking, assessment/actuation separation.
- **HARDEN:** currentness qualification, contradiction handling, reopen/correction/supersession, evidence provenance/coverage and scoped closure semantics.
- **GENERALIZE:** reconciliation subject/drift/effect/evidence/closure records across capabilities without absorbing domain ownership.
- **INTEGRATE:** deterministic finding/proof-obligation routing into bounded planning and semantic/realization owners.
- **PROVIDERIZE:** none evidenced as a primary need here; provider-specific observations remain inputs owned by their realization capabilities.
- **REPLACE:** none. Existing repository-first reconciliation discipline is valuable and should not be discarded.
- **DEFER:** target shape, machine-readable schema and runtime/platform realization to Planning C or later authorized phases.
- **DO_NOT_BUILD:** no architecture reconciliation god-object, universal canonical configuration database, automatic observed-state adoption, generic actuation controller or universal scalar architecture score.

## Current-state conclusion
`PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED`.

Fresh main already demonstrates disciplined repository-memory reconciliation, explicit architecture review, exact evidence anchoring, bounded dispositions and closure blocking on stale state. It does not yet demonstrate Architecture Reconciliation as a generalized first-class capability with canonical reconciliation subjects, typed drift/effect outcomes, currentness-qualified evidence, correction/reopen/supersession lineage, residual-cohort closure or machine-readable owner routing. The evidence therefore supports `KEEP + HARDEN + GENERALIZE + INTEGRATE`, not `REPLACE` and not invented target architecture.

Planning C remains blocked. Mandatory post-Planning-B Mathematical Expressions / Rules / Calculation research remains queued after all 28 Planning B capabilities close.