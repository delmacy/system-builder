# Generation 2 — Process & Application Modeling Full Pass 2 Revisit

Status: ACTIVE RESEARCH — Full Pass 2
Capability: Process & Application Modeling
Paired mandatory cluster: Process/Application × Workflow × Data/Schema
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Canonical distinctions preserved: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; local graph validity does not prove composed semantic liveness; current evidence must remain owner/revision scoped; AI/low-code cannot amplify authority; research does not authorize remediation or target implementation.

## 1. Revisit method and duplicate screen

This revisit deliberately used techniques materially different from Full Pass 1:

- liveness/soundness reasoning under non-graph predicates such as authority, currentness and human obligations;
- temporal intersection analysis for fan-in conditions whose evidence has independent validity windows;
- cross-process effect-adoption/compensation reasoning;
- negative-space review over independently valid fragments rather than local malformed-input testing;
- duplicate screening against the 106 reusable ConflictPatterns already present at revisit start.

Candidates rejected as duplicates rather than inflated into new findings:

- local objective versus enterprise constraint -> existing `G2-CONFLICT-PATTERN-OBJECTIVE-GOVERNANCE-001`;
- brownfield normalized semantics plus residual old realization -> existing representation/migration/coexistence patterns;
- retry after ambiguous external mutation around recovery -> existing `G2-CONFLICT-PATTERN-RECOVERY-CUT-EFFECT-001` and idempotency/effect patterns;
- generic duplicate canonical-fact ownership -> existing `G2-CONFLICT-PATTERN-SEMANTIC-001`;
- generic SoD self-dealing -> existing `G2-CONFLICT-PATTERN-SOD-DELEGATION-001`.

External soundness literature supports the distinction between structural/local validity and global liveness: workflow-net soundness explicitly concerns deadlock/livelock freedom, completion reachability and absence of dead transitions, while richer extensions can make verification substantially harder. Portable implication for SB: a graph that is syntactically well-formed can still be semantically non-live once authority, evidence currentness, cross-process effects or human obligations participate in transition eligibility.

Evidence references (accessed 2026-09-04):

- W.M.P. van der Aalst et al., *Soundness of workflow nets: classification, decidability, and analysis*, Formal Aspects of Computing 23 (2011), DOI 10.1007/s00165-010-0161-4.
- G. Liu et al., *A Branching-Process-Based Method to Check Soundness of Workflow Systems*, IEEE Access 4 (2016), DOI 10.1109/ACCESS.2016.2597061.

## 2. New material local edge cases

### G2-EDGE-PROCESS-007 — structurally reachable work becomes authority-constrained deadlock

- Scenario: every graph transition is structurally reachable and each policy/SoD rule is independently valid, but the reachable runtime state has no currently eligible subject who may legally perform the transition required for progress.
- Preconditions / activation: responsibility assignment, SoD, delegation, Station/Role membership, authority expiry or organizational revision compose such that all outgoing progress transitions require mutually incompatible eligibility predicates.
- Incompatible claims/actions/states: Process Modeling says a progress path exists; Authorization/Organization says no current subject may execute any progress-enabling action.
- Why local validation may miss it: graph reachability commonly treats an enabled transition abstractly and can ignore whether a legally eligible actor can exist under the concurrently applicable authority predicates.
- Expected safe behavior / diagnostic expectation: distinguish structural reachability from authority-qualified liveness; signal `INCONCLUSIVE/BLOCKED` with owner-scoped evidence rather than silently waiting forever or bypassing authority.
- Forbidden behavior: auto-assigning an unauthorized actor, weakening SoD, inventing delegation, or treating timeout/escalation as authority.
- Effect/failure disposition: no canonical progress effect until a current eligible authority path exists or an authorized owner changes the process/organization context.
- Detection candidates: design-time satisfiability analysis over transition responsibility + authority/SoD constraints; pre-execution current authority re-evaluation; runtime stuck-state signal qualified by absence of eligible authorized actors.
- Owners: Process & Application Modeling + Authorization / Policy / Organization; human-procedure owner when mandatory manual work is involved.
- Severity: HIGH–CRITICAL. Confidence: strongly supported. Detectability: static/pre-execution/runtime. Blast radius: task→process/station. Reversibility: easy before effect, potentially migration required for in-flight instances. Time-to-harm: delayed/immediate at blocking point. Misuse likelihood: plausible accidental; adversarial abuse possible through role/delegation changes. Evidence currentness: current authority and process revision required. False-positive risk: medium because intentionally paused/manual-exception states can be legitimate.
- Recovery / future remediation route: route to process/authority owners for explicit reassignment, authorized delegation, process revision or accepted bounded exception; do not synthesize authority automatically.
- Proof obligation: `PROCESS-P2-PROOF-007` — a structurally reachable process state with no legally eligible actor is surfaced as an explicit liveness/authority conflict and cannot progress by implicit authority amplification.
- Architecture consequence candidate: qualified-liveness evidence may need to include authority predicates, but no target mechanism is selected here.
- Saturation status: MATERIAL NEW LOCAL CLASS — local streak remains/resets `0`.

### G2-EDGE-PROCESS-008 — fan-in requires evidence whose validity windows cannot overlap

- Scenario: a join/transition requires claims from multiple semantic owners; each claim is independently valid when evaluated, but their currentness windows, revision applicability or observation horizons do not overlap, so the conjunction required by the process is never simultaneously qualified.
- Preconditions / activation: process fan-in references independently refreshed policy/data/resource/provider/human evidence; validity horizons differ; refresh of one invalidates or supersedes another before the complete set becomes jointly current.
- Incompatible claims/actions/states: each owner can truthfully report its local predicate as satisfied, yet the process cannot establish that all predicates were simultaneously applicable to the same subject/revision/effect horizon.
- Why local validation may miss it: branch/field validation checks each predicate independently and may not model temporal intersection/currentness compatibility across owners.
- Expected safe behavior / diagnostic expectation: require joint applicability/currentness evidence for the fan-in; if no qualified intersection exists, report explicit `INCONCLUSIVE/BLOCKED` rather than treating sequentially observed truths as simultaneous truth.
- Forbidden behavior: assembling a synthetic success from stale-but-once-true claims, silently extending evidence TTL, or dropping one prerequisite to guarantee progress.
- Effect/failure disposition: transition remains not qualified; evidence remains valid only for its producing subject/revision/horizon.
- Detection candidates: static temporal-constraint intersection analysis where horizons are declared; pre-execution revision/currentness-vector compatibility; runtime detection of perpetual refresh invalidation/starvation.
- Owners: Process Modeling + each native evidence owner + Lifecycle/currentness owner where revisions coexist.
- Severity: HIGH. Confidence: supported. Detectability: static when horizons are bounded, otherwise pre-execution/runtime. Blast radius: workflow instance→process. Reversibility: easy before mutation. Time-to-harm: delayed/cumulative starvation or immediate unsafe advancement. Misuse likelihood: plausible accidental. Evidence currentness: central. False-positive risk: medium where policy intentionally permits sequential evidence rather than simultaneous qualification.
- Recovery / future remediation route: require owner-qualified synchronization/re-evaluation, revise the process requirement, or explicitly document sequential admissibility; do not manufacture temporal overlap.
- Proof obligation: `PROCESS-P2-PROOF-008` — sequentially valid evidence cannot satisfy a simultaneous fan-in unless a declared compatibility/currentness rule proves the joint claim.
- Architecture consequence candidate: temporal applicability is a first-class detection concern for multi-owner joins; no universal synchronization mechanism is prescribed.
- Saturation status: MATERIAL NEW LOCAL CLASS — local streak `0`.

## 3. New material cross-capability edge case

### G2-XEDGE-PROCESS-WORKFLOW-DATA-005 — compensation invalidates an effect another process has already adopted

- Scenario: Process A produces canonical effect E; Process B, independently and correctly, observes/adopts E as a prerequisite and performs downstream effect F. Later A enters an otherwise-valid compensation path that removes/reverses E without accounting for B's adoption.
- Preconditions / activation: E is visible/shared across processes; B is allowed to depend on E; A retains local compensation authority; there is no qualified dependency/adoption evidence connecting B's postcondition to A's compensation decision.
- Incompatible claims/actions/states: A's local semantics say E may be compensated; B's current semantics say E is an adopted prerequisite supporting already-effective F.
- Why local validation may miss it: A and B are each locally correct, and the conflict appears only after temporal cross-process adoption of a shared canonical fact/effect.
- Expected safe behavior / diagnostic expectation: compensation eligibility is requalified against current dependent/adopting effects; unresolved dependency yields conflict signal/`INCONCLUSIVE`, not blind reversal.
- Forbidden behavior: compensation assumes semantic isolation merely because A originally produced E; event arrival or completion order must not choose the business truth arbitrarily.
- Effect/failure disposition: compensation may be locally available but globally ineligible/ambiguous until dependent effects are reconciled; already-performed F is not silently rewritten as nonexistent.
- Detection candidates: pre-compensation current dependency/adoption query; runtime/post-effect detection of downstream authoritative references to E; audit lineage linking producing and adopting process revisions.
- Owners: semantic owner of E + Process Modeling + Workflow owners for A/B + Data/Schema owner for canonical reference semantics; domain owner of F where irreversible.
- Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-execution/runtime/post-effect. Blast radius: record→cross-process/system/external parties. Reversibility: bounded compensation to potentially irreversible. Time-to-harm: immediate after reversal. Misuse likelihood: plausible accidental. Evidence currentness: current dependency/adoption evidence required. False-positive risk: medium because some domain effects are explicitly revocable and dependents may already encode revocation semantics.
- Recovery / future remediation route: route to semantic/process owners to serialize, cascade/coordinate a qualified compensation, migrate dependents, or accept/repair the downstream inconsistency; no distributed transaction is prescribed.
- Proof obligation: `XPROCESS-P2-PROOF-005` — compensation eligibility cannot be inferred solely from the producer process when another authoritative process has adopted the effect.
- Saturation status: MATERIAL NEW CLUSTER CLASS — Process/Application × Workflow × Data/Schema streak remains/resets `0`.

## 4. New reusable ConflictPatterns

Default disposition for all: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

### G2-CONFLICT-PATTERN-AUTHORITY-LIVENESS-001 — structural progress conflicts with the set of legally eligible actors

- Family: structural + state-transition + authority/responsibility/SoD + human-procedure.
- Activation conditions: a reachable non-terminal process state requires one or more actions whose combined responsibility/authority predicates admit no current eligible subject.
- Incompatible claims/actions/states: process graph claims progress is available; authority organization claims every candidate actor is forbidden/ineligible.
- Why local validation may miss it: graph soundness and policy validity are commonly checked separately; each can pass while their conjunction eliminates all executable progress paths.
- Detection stage/candidate: static constraint/satisfiability check over graph transitions and declared authority predicates; pre-execution requalification; runtime stuck-state diagnosis.
- Owner set: Process Modeling + Authorization/Organization + relevant human-procedure owner.
- Severity: HIGH–CRITICAL; confidence: strongly supported; detectability: static/pre-execution/runtime; blast radius: task→station/process; reversibility: bounded before effects, migration may be needed in flight; time-to-harm: blocking-point immediate/delayed; misuse likelihood: plausible/adversarial; evidence currentness: current.
- False-positive risks: intentional hold states, queues awaiting future staff, or explicit exception routes can resemble deadlock; detectors must respect declared waiting semantics and future eligibility windows.
- Future remediation disposition: require owner reconciliation/reassignment/authorized delegation/process change or documented exception. Never invent authority.
- Preventive invariant candidate: only for provable no-eligible-actor states that are not declared waits/exceptions; broader prevention could over-constrain legitimate human processes.
- Proof/test candidate: model-check graph × authority predicates across role/station/delegation changes and verify conflict remains a signal until current evidence confirms activation.
- Saturation status: NEW MATERIAL REUSABLE PATTERN.

### G2-CONFLICT-PATTERN-QUALIFICATION-JOIN-001 — individually current claims have no jointly current applicability interval

- Family: temporal + data/consistency + rule/condition + semantic ownership.
- Activation conditions: a process condition requires multiple owner-qualified claims simultaneously, but their subject revisions/validity horizons have an empty intersection or incompatible applicability relation.
- Incompatible claims/actions/states: each owner truthfully says its local claim is/was valid; the composed process claims the conjunction is valid now.
- Why local validation may miss it: per-claim validators do not prove temporal/revision co-applicability across owners.
- Detection stage/candidate: static horizon/constraint intersection where declarative; pre-execution currentness-vector join; runtime starvation/refresh-loop signal.
- Owner set: Process Modeling + all native claim owners + Lifecycle/currentness.
- Severity: HIGH; confidence: supported; detectability: static/pre-execution/runtime; blast radius: workflow instance→process; reversibility: easy before effects; time-to-harm: delayed starvation or immediate unsafe action; misuse likelihood: plausible; evidence currentness: central.
- False-positive risks: sequential evidence is legitimate when the business rule explicitly defines accumulation rather than simultaneity.
- Future remediation disposition: require explicit synchronization/re-evaluation, revise temporal semantics, or preserve `INCONCLUSIVE`; no universal TTL or clock policy is selected.
- Preventive invariant candidate: not universal enough to globally reject sequential evidence; detection/diagnosis is preferred unless the process explicitly declares simultaneous qualification.
- Proof/test candidate: mutation/property corpus with disjoint/overlapping evidence windows and revision changes around fan-in.
- Saturation status: NEW MATERIAL REUSABLE PATTERN.

### G2-CONFLICT-PATTERN-CROSS-PROCESS-COMPENSATION-001 — producer compensation conflicts with downstream semantic adoption

- Family: cross-process + exception/compensation/recovery + data/consistency + temporal + semantic ownership.
- Activation conditions: process A produces E; process B adopts E and establishes F; A later attempts compensation/reversal of E under local rules that do not account for B's current dependency.
- Incompatible claims/actions/states: A claims E is compensable; B/domain owner claims E currently supports an authoritative dependent state/effect.
- Why local validation may miss it: both process definitions and transitions are locally valid; the dependency is created dynamically by cross-process adoption after E becomes visible.
- Detection stage/candidate: pre-compensation dependency/adoption qualification; runtime canonical-reference observation; post-effect lineage/audit comparison.
- Owner set: semantic owner of E + Process/Workflow owners + Data/Schema + dependent-effect owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-execution/runtime/post-effect; blast radius: cross-process/system/external parties; reversibility: bounded→potentially irreversible; time-to-harm: immediate; misuse likelihood: plausible; evidence currentness: current dependency graph required.
- False-positive risks: explicitly revocable facts/effects with contractually defined downstream revocation behavior are legitimate; dependency observation must distinguish hard adoption from informational reference.
- Future remediation disposition: route to owners for coordinated compensation/cascade/migration/reconciliation or accepted risk. Do not prescribe global transactionality.
- Preventive invariant candidate: not universal as a blanket prohibition on compensation; current dependency qualification is the stronger portable candidate.
- Proof/test candidate: two-process race corpus where adoption occurs before/during/after compensation and includes irreversible F.
- Saturation status: NEW MATERIAL REUSABLE PATTERN.

## 5. Cluster and saturation result

This revisit discovers three genuinely new material classes after duplicate screening:

- two local Process/Application findings (`G2-EDGE-PROCESS-007..008`);
- one Process/Application × Workflow × Data/Schema finding (`G2-XEDGE-PROCESS-WORKFLOW-DATA-005`);
- three reusable ConflictPatterns.

Therefore:

- Process & Application Modeling eligible local no-material streak remains/resets to `0`;
- Process/Application × Workflow × Data/Schema eligible cluster no-material streak remains/resets to `0`;
- Full Pass 2 coverage advances to 2/28 capabilities and 2/12 mandatory clusters;
- no HIGH/CRITICAL finding lacks an owner, detection route or proof obligation;
- no `ConflictInstance` is asserted;
- no remediation, Work Package, TASK, Construction or target implementation is created;
- Planning C remains blocked.