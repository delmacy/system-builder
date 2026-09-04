# Generation 2 — Processual / Semantic Conflict Classification Research

Status: ACTIVE RESEARCH DIRECTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Scope: conflict elicitation, classification, detection signals and future remediation readiness. This artifact does not authorize pre-emptive implementation or correction of hypothetical conflicts.

## 1. Purpose

The principal business-risk hypothesis for System Builder is that increasing process breadth, depth, branching, policies, calculations, providers, human instructions and cross-capability interactions can create conflicts that are not visible when each component is reviewed in isolation.

The System Builder workflow/process model is therefore treated as a governed work algorithm: a composition of states, transitions, conditions, calculations, authority, resources, data, providers, human tasks, exceptions and temporal constraints. The research must identify classes of conflict that can emerge from that composition.

The objective is **not** to solve every hypothetical conflict in advance. The objective is to make conflict classes explicit enough that, when a concrete condition appears, the System Builder can detect or diagnose it, classify it consistently, identify the affected owners, and route it to a bounded correction path.

Canonical research principle:

> Elicit and classify conflict patterns before they occur; remediate a concrete conflict only when evidence shows that its activation conditions are present or a later proof obligation requires a structural guard.

## 2. Conflict pattern versus manifested conflict

Keep these concepts separate:

- `ConflictPattern`: a reusable description of a potentially unsafe or contradictory composition;
- `ActivationCondition`: the concrete conditions under which that pattern can become relevant;
- `ConflictSignal`: evidence suggesting activation or increasing risk;
- `ConflictInstance`: an observed/reproducible occurrence in a specific system/revision/runtime context;
- `ConflictAssessment`: severity, confidence, owners, blast radius, reversibility and evidence currentness;
- `RemediationDisposition`: how an observed conflict should be routed or corrected;
- `PreventiveInvariantCandidate`: optional later architecture/test candidate when research shows the class is sufficiently universal and damaging to justify prevention.

A researched `ConflictPattern` is **not** proof that the system is currently defective and must not automatically create implementation work.

## 3. Conflict lifecycle

Use an explicit lifecycle such as:

`ELICITED_PATTERN -> APPLICABLE/NOT_APPLICABLE/UNKNOWN -> SIGNALLED -> OBSERVED -> CONFIRMED -> ROUTED -> RESOLVED | ACCEPTED_RISK | SUPERSEDED`

Research normally stops at `ELICITED_PATTERN` plus applicability/detection guidance. Moving into concrete correction requires evidence from a client/system context or an authorized later proof/architecture phase.

Do not collapse `SIGNALLED` into `CONFIRMED`. A detector may generate a warning without enough evidence to claim a real conflict.

## 4. Primary conflict families

Every adversarial pass must deliberately search for processual/semantic conflicts, not only conventional edge/failure cases.

### 4.1 Structural graph conflicts

Examples:
- unreachable work/state;
- orphan task/state;
- cycles that were not intentionally declared;
- recursive composition without a bounded termination rule;
- contradictory or overlapping branches;
- two terminal paths claiming incompatible final states;
- fan-in requiring inputs that cannot coexist;
- fan-out that creates duplicate authoritative work;
- process fragments that cannot rejoin consistently;
- dependency graph cycles between process fragments/capabilities.

### 4.2 State-transition conflicts

Examples:
- two transitions enabled simultaneously but mutually incompatible;
- transition allowed from a state whose prerequisites cannot be satisfied;
- state changed externally while a workflow assumes the old state;
- cancel versus approve/complete/payment/allocation race;
- local state says complete while dependent business state remains partial/unknown;
- multiple components believe they own the authoritative transition.

### 4.3 Semantic ownership conflicts

Examples:
- two capabilities claim ownership of the same canonical fact;
- one capability treats provider-native data as canonical while another treats it as realization evidence;
- duplicate business rules with diverging meaning;
- workflow condition contradicts the semantic owner’s invariant;
- UI/form semantics imply a mutation different from the process/data owner semantics;
- AI-generated process introduces a domain invariant not owned by the process model.

### 4.4 Rule / formula / condition conflicts

Examples:
- two conditions overlap and produce incompatible actions;
- no condition handles a reachable value;
- formula result and policy threshold use incompatible units/currency/revisions;
- calculated field uses current inputs where historical snapshot semantics are required;
- circular formula dependencies;
- business formula changed while a long-running workflow still depends on an earlier revision;
- multiple rules are individually valid but jointly impossible to satisfy.

### 4.5 Temporal and ordering conflicts

Examples:
- A requires B before execution while B requires A;
- deadline shorter than mandatory approval/processing chain;
- event ordering assumptions that the transport/provider does not guarantee;
- long-running process crosses policy, schema, formula or authority revisions;
- two timers/escalations trigger incompatible actions;
- retry occurs after a later event has already changed the intended state.

### 4.6 Resource and capacity conflicts

Examples:
- two processes allocate the same indivisible resource;
- workforce, equipment, inventory, quota or budget is double-booked;
- local optimizations jointly exceed enterprise capacity;
- reservation/consumption/release semantics disagree across modules;
- valid fan-out causes pathological resource or cost explosion;
- capacity assumptions become stale between plan and actuation.

### 4.7 Authority, responsibility and separation-of-duty conflicts

Examples:
- same role can request and approve a restricted action;
- process assigns responsibility to a subject that lacks execution authority;
- multiple roles are each waiting for the other to act;
- inherited Enterprise/Station constraints conflict with local workflow configuration;
- user loses authority while work is in flight;
- delegation overlaps or contradicts organizational responsibility;
- UI exposes an action whose authoritative policy denies it.

### 4.8 Policy and compliance conflicts

Examples:
- retention requires deletion while legal hold forbids it;
- operational process requires data movement while residency policy forbids the destination;
- business SLA conflicts with mandatory governance/security approval;
- cost policy selects a provider that security/privacy policy disallows;
- local exception conflicts with a superior inherited control.

These conflicts require explicit precedence/authority evidence; they must not be resolved by arbitrary rule ordering.

### 4.9 Data and consistency conflicts

Examples:
- two process paths mutate the same fact with incompatible postconditions;
- derived value is used as stored fact without declared materialization semantics;
- stale read drives a destructive mutation;
- schema/data revision incompatible with active process revision;
- duplicate identities refer to the same real-world subject;
- imported/brownfield data carries contradictory semantics.

### 4.10 Integration / provider conflicts

Examples:
- two providers expose the same feature label but incompatible semantics;
- provider success acknowledgement conflicts with downstream observed/effective state;
- substitution leaves residual old provider cohorts authoritative;
- external system permits transitions the canonical process forbids;
- retry/idempotency assumptions differ between workflow and provider contract;
- external identifier collision or identity drift.

### 4.11 Version / migration / coexistence conflicts

Examples:
- old workflow + new schema;
- old formula + new policy;
- old runtime + new provider binding;
- two revisions coexist but write incompatible canonical states;
- migration cutover while residual old consumers remain authoritative;
- rollback restores code but not compatible data/config/provider state.

### 4.12 Exception / compensation / recovery conflicts

Examples:
- compensating one effect invalidates another completed process branch;
- retries and compensation race;
- exception route bypasses mandatory control;
- disaster recovery revives an obsolete/withdrawn authority state;
- two owners independently recover the same resource and create duplication.

### 4.13 Human-procedure and instruction conflicts

Examples:
- two valid instructions tell the operator to perform incompatible actions;
- process instruction is ambiguous at a decision point;
- responsibility is unclear or duplicated;
- instruction order conflicts with actual system prerequisites;
- manual workaround changes state outside the expected workflow;
- escalation paths create circular responsibility.

This family is important because SB models organizational work, not only machine execution.

### 4.14 Cross-process conflicts

Examples:
- two independently correct processes compete for the same resource/fact/authority;
- one process’s terminal state violates another process’s prerequisite;
- shared event triggers multiple processes whose effects are incompatible;
- local SLA optimization causes global workflow starvation;
- one process compensates an effect another process now treats as authoritative.

### 4.15 Objective / optimization conflicts

Examples:
- minimize cost versus meet latency/SLA;
- maximize utilization versus preserve resilience capacity;
- minimize inventory versus maintain service availability;
- maximize automation versus separation-of-duty requirements;
- local department objective conflicts with enterprise policy/objective.

Do not let a scoring/ranking engine silently choose among objectives without explicit priority/policy semantics.

### 4.16 AI / low-code composition conflicts

Examples:
- generated workflow is syntactically valid but semantically contradictory;
- AI composes existing safe actions into an unsafe sequence;
- drag-and-drop creates a cycle/deadlock/unreachable branch;
- generated formula contradicts process policy;
- AI optimizes one goal while violating another owner’s invariant;
- user creates a valid-but-dangerous automation loop;
- personalization changes effective sequence/visibility in a way that conflicts with mandatory process semantics.

## 5. Conflict dimensions for classification

Classify each material conflict pattern/instance along multiple dimensions rather than one magic score:

- `scope`: local capability | cross-capability | cross-process | enterprise-wide;
- `type`: structural | semantic | state | temporal | data | resource | authority | policy | formula | provider | version | recovery | human-procedure | objective | AI/low-code;
- `activation`: static/configuration | runtime/data-dependent | temporal | concurrency-dependent | provider-dependent | revision-dependent | human-dependent;
- `severity`: LOW | MEDIUM | HIGH | CRITICAL;
- `confidence`: hypothesis | supported | strongly supported | observed/confirmed;
- `detectability`: static | pre-execution | runtime | post-effect | audit-only;
- `blast_radius`: record | task | workflow instance | process | station | system | enterprise | external parties;
- `reversibility`: easy | bounded compensation | migration required | potentially irreversible;
- `time_to_harm`: immediate | delayed | cumulative | latent;
- `misuse_likelihood`: accidental | plausible | likely | adversarial;
- `evidence_currentness`: current | stale | incomplete | unknown;
- `owner_set`: semantic owner(s), realization owner(s), policy/authority owner(s).

## 6. Conflict detection research

Research should identify possible detection mechanisms without requiring immediate implementation:

### Static / design-time candidates
- graph cycle/deadlock/unreachable-state analysis;
- rule overlap/gap/contradiction analysis;
- formula dependency/type/unit checks;
- authority/separation-of-duty analysis;
- version compatibility matrix;
- resource ownership/allocation conflict analysis;
- policy precedence/unsatisfied-obligation analysis;
- provider semantic support mismatch;
- pairwise/N-wise cross-capability constraint checking.

### Pre-execution candidates
- current authority re-evaluation;
- resource/capacity requalification;
- current provider support/health qualification;
- formula/schema/policy revision compatibility;
- stale evidence detection;
- rollback/recovery eligibility qualification.

### Runtime candidates
- conflicting simultaneous mutations;
- unexpected state transition;
- duplicate/competing authoritative effects;
- deadlock/starvation/backlog signatures;
- residual old revision/provider cohort activity;
- current behavior diverging from declared process invariant.

### Post-effect / audit candidates
- process postcondition not satisfied despite successful execution acknowledgement;
- historical result inconsistent with producing formula/policy revision;
- authority/policy path inconsistent with recorded execution;
- cross-process side effects that violated another process invariant.

A detector signal is evidence, not automatic proof of a conflict.

## 7. Required conflict record

Use stable IDs such as:

- `G2-CONFLICT-PATTERN-<FAMILY>-NNN` for reusable patterns;
- `G2-CONFLICT-INSTANCE-<SYSTEM>-NNN` only when an observed concrete instance later exists.

Each pattern should record:

- name and family;
- narrative example;
- involved capabilities/processes;
- preconditions and activation conditions;
- incompatible claims/actions/states;
- why local validation may miss it;
- detection candidates and required evidence;
- severity range and likely blast radius;
- authority/semantic owners;
- whether static prevention is feasible, expensive or undesirable;
- recommended disposition when observed;
- proof/test candidate;
- known false-positive risks;
- saturation status.

## 8. Research versus correction policy

The adversarial phase SHALL NOT open implementation work merely because a hypothetical conflict pattern is discovered.

Default disposition for a newly elicited pattern is:

`CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

A stronger preventive architecture requirement may be proposed only when research shows that:

1. the conflict class is broadly applicable rather than domain-specific;
2. harm is material;
3. detection/prevention can be represented without over-constraining legitimate processes;
4. the invariant has a clear semantic owner;
5. the prevention cost/complexity is justified.

Otherwise preserve the pattern so a concrete future instance can be diagnosed and corrected with context.

## 9. Remediation readiness

For each conflict family, research should identify a future bounded remediation vocabulary, without executing remediation now. Candidate dispositions include:

- reject invalid composition;
- warn / require explicit acknowledgement;
- require additional evidence;
- require human reconciliation;
- require owner selection / semantic adoption;
- serialize or coordinate conflicting mutations;
- re-evaluate authority/policy/resource state;
- pin or migrate revision;
- reconcile UNKNOWN effect before retry;
- compensate bounded effect;
- isolate/quarantine a provider/process path;
- open controlled evolution/migration;
- accept documented risk under authorized exception.

## 10. Adversarial saturation integration

Every full adversarial pass must ask both:

1. `How can this capability/process fail or be misused?`
2. `How can this capability/process conflict with another correct capability/process, rule, objective, authority, resource or revision?`

Maintain a dedicated processual/semantic conflict catalogue and link material findings into `EDGE_CASE_INDEX.md` and `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md`.

Saturation for high-risk cross-capability clusters cannot be claimed while new material conflict families continue to emerge.

The final adversarial negative-space review must explicitly ask whether any material conflict family remains unclassified or has no owner/detection route.

## 11. Planning C handoff

Planning C should consume the conflict classification as a design input, but must distinguish:

- universal invariants worth preventing statically;
- conditions worth warning about;
- conflicts requiring runtime observation/reconciliation;
- domain-specific conflicts that should remain configurable/diagnosable rather than globally forbidden.

This distinction prevents System Builder from becoming an over-restrictive process engine while still making complex process conflicts diagnosable and governable.

## 12. Canonical principle

> The System Builder should not pretend to solve every future process conflict in advance. It should understand enough about conflict structure to recognize, classify, explain and route a concrete conflict when the activation conditions appear.
