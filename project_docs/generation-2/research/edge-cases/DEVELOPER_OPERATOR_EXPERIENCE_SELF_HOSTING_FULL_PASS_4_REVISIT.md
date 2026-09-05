# Generation 2 — Developer / Operator Experience / Self-hosting — Full Pass 4 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 4
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Scope and authority

This revisit follows the authoritative `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, prior Developer/Operator registers/revisits, `EDGE_CASE_INDEX.md`, `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md`, and `ADVERSARIAL_SATURATION_STATE.json`.

Canonical distinctions preserved: operator-visible state != effective runtime/business truth; install/upgrade/runbook acknowledgement != qualified convergence; diagnostic/support evidence != complete/current truth; backup existence != qualified recovery; local/root/provider capability != Enterprise authorization; `ABSENT/UNSET/null/default/delete` are not interchangeable; a trust-store union must not silently widen accepted namespace; cumulative support evidence can exceed the privacy meaning of any single capture; `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` remain distinct; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; AI/low-code cannot amplify authority.

## Techniques materially different from Full Passes 1–3

1. **Operational epistemic-gap mutation** — preserve a successful operator command while independently varying runtime effect, business convergence, security posture and recovery posture to test whether UI/CLI success is over-promoted to truth.
2. **Topology-context transposition** — replay an otherwise valid command/runbook against a different current context, namespace, host, cluster, provider or Station to test whether execution target identity remains explicit and qualified.
3. **Revision-vector intersection analysis** — vary CLI, docs, installer, runtime, API, plugin/provider and schema revisions independently and ask whether a jointly supported vector exists rather than assuming pairwise support composes globally.
4. **Procedure commutativity/partial-order probe** — swap individually valid drain, stop, backup, migrate, rotate, upgrade, restore, restart and verify steps and test whether order carries semantic preconditions.
5. **Evidence-horizon subtraction** — age or disconnect revocation, support-matrix, policy, artifact, entitlement, provider and diagnostic evidence while preserving apparent operability.
6. **Diagnostic observer-effect probe** — challenge whether troubleshooting, collection or repair actions can themselves mutate load, cache, timing, storage, credentials or state and thereby change the evidence being interpreted.
7. **Multi-operator authority braid** — interleave two legitimate operators, break-glass/local-root access, delegation changes and AI-generated procedures around the same administrative subject.
8. **Residual-control-plane search** — look for old agents, scheduled jobs, credentials, configs, providers, hooks or automation that remain capable after declared upgrade/cutover/recovery.
9. **N-wise operational conflict screen** — explicitly revisit structural, state, semantic-owner, formula/condition, temporal, resource, authority/SoD, policy, data, provider, version, recovery, human-procedure, cross-process, objective and AI/low-code conflict families even when every local operation is valid.

## Current external evidence differential

Current mature-system evidence reinforces existing families rather than establishing a new reusable conflict class:

- Kubernetes Version Skew Policy (current page covering maintained 1.37/1.36/1.35 branches) makes support dependent on the joint component topology. Mixed `kube-apiserver` versions can narrow supported `kubelet`, controller and `kubectl` versions, and upgrade order has explicit prerequisites. Portable consequence: independently supported component versions do not imply a globally supported operational revision vector. Source: https://kubernetes.io/releases/version-skew-policy/
- Kubernetes multi-cluster access documentation models a context as the combination of cluster, user and namespace, and warns that untrusted kubeconfig can cause code execution or file exposure. Portable consequence: operational target/context identity and trust provenance are part of the actuation contract, not incidental UI state. Source: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
- Kubernetes 1.36 mixed-version proxy work explicitly exists to route requests across heterogeneous API-server versions during partial upgrades. Portable consequence: mixed-version operability can be intentionally supported while still requiring qualification of which peer/version actually realizes a request; apparent availability does not collapse revision identity. Source: https://kubernetes.io/blog/2026/04/22/kubernetes-v1-36-release/

These sources deepen existing operator-revision, context/identity, compatibility-direction, trust/currentness and qualified-effect patterns. They do not prove a concrete System Builder defect.

## Adversarial challenges and duplicate-screen against all 119 reusable ConflictPatterns

### 1. Successful operator command without qualified effect

An installer, restart, restore or administrative command can return success while business convergence, security posture, provider cutover or residual-cohort state remains incomplete or unknown.

Duplicate-screen: existing qualified-claim/effect-convergence, `G2-CONFLICT-PATTERN-ADMIN-EFFECT-001`, runtime-truth and residual-cohort families cover the mechanism. No new reusable pattern survives.

### 2. Context transposition of a valid command

A command can be locally valid but target the wrong cluster/namespace/host/provider/Station because current context, environment or credential selection differs from the procedure's intended subject.

Duplicate-screen: semantic ownership, effective identity/authority, trust-namespace collapse and provider-binding/context families already cover the loss of subject→context qualification. No new pattern.

### 3. Pairwise support does not imply N-wise operational compatibility

CLI↔API, API↔runtime, runtime↔provider and provider↔schema pairs can each be supported while no common revision vector is supported across the complete reachable topology.

Duplicate-screen: revision-vector/currentness and `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001` already cover operation- and direction-qualified compatibility. No additional operational compatibility pattern is needed.

### 4. Procedure order changes meaning

Drain, backup, migrate, rotate, restart, restore and verify steps may each be valid but unsafe or semantically different when reordered, concurrently executed or repeated after partial effects.

Duplicate-screen: existing temporal/ordering, operator-revision, recovery qualification, `PARTIAL/UNKNOWN` reconciliation and human-procedure families cover this conflict.

### 5. Troubleshooting changes the observed system

A diagnostic action may alter load, cache state, timing, credentials, storage pressure or process state, so evidence collected after the action can differ from the pre-diagnostic condition.

Duplicate-screen: this is a capability-specific manifestation of existing operator-evidence/currentness, observability runtime-truth, semantic-ownership and intervention/effect-lineage patterns. Detection candidate remains evidence provenance that records collection method/time and any mutating diagnostic action. `Signal != ConfirmedConflict`; no new pattern.

### 6. Offline/self-hosted operation outlives qualification evidence

An air-gapped or intermittently connected installation can remain functional after revocation, policy, support, artifact, entitlement or provider evidence becomes stale.

Duplicate-screen: existing offline-horizon/currentness and retained-closure families remain sufficient.

### 7. Multiple legitimate operators create an unsafe composed authority path

Two operators can each possess legitimate but distinct authority, while delegation changes, break-glass access or local-root capability allow their interleaved actions to bypass intended SoD or produce competing administrative effects.

Duplicate-screen: authority/responsibility/SoD, Enterprise→Station→Role→Person, confused-deputy and simultaneous-mutation patterns already classify the activation conditions. No new family.

### 8. Residual automation survives cutover or recovery

Old agents, hooks, schedules, credentials or provider bindings can remain capable after the operator declares migration, upgrade or restore complete.

Duplicate-screen: residual-cohort/coexistence and convergence patterns already cover the risk and its detection route.

### 9. `ABSENT/null/default/delete` operational configuration

A CLI/config adapter may interpret omission as preserve while the target interprets it as default, clear or delete, producing a mutation different from operator intent.

Duplicate-screen: direct manifestation of `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` plus semantic-owner and revision/profile qualification. No new material ID.

### 10. Trust and cumulative-evidence composition

Co-locating kubeconfigs, credentials or trust bundles can widen the accepted namespace if ownership is lost; accumulating logs/support bundles can expose relationships not present in any single authorized capture.

Duplicate-screen: directly covered by `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001` and `G2-CONFLICT-PATTERN-CUMULATIVE-PRIVACY-001`, together with existing operator-evidence controls.

### 11. AI/low-code operational loop or authority amplification

Generated runbooks can recursively retry, broaden target cohorts, reorder prerequisites, hide `UNKNOWN`, select a more privileged credential or optimize availability/cost while weakening safety/recovery requirements.

Duplicate-screen: existing AI/low-code composition, resource-boundedness, objective conflict, authority non-amplification, human-procedure and reconcile-before-retry patterns remain sufficient.

## Conflict classification completeness

The revisit explicitly searched all required processual/semantic conflict families: structural graph; state-transition; semantic ownership; rule/formula/condition; temporal/ordering; resource/capacity; authority/responsibility/SoD; policy/compliance; data/consistency; provider/integration; version/migration/coexistence; exception/compensation/recovery; human-procedure/instruction; cross-process; objective/optimization; and AI/low-code composition.

No new material ConflictPattern survived duplicate-screen. Existing authoritative pattern records retain activation conditions, incompatible claims/actions/states, detection candidates, owner sets, severity/confidence/detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive controls and future remediation disposition. This revisit creates no `ConflictInstance`, no remediation and no implementation guard.

## Detection candidates retained for future architecture/proof work

Research-only candidates include: explicit target/context identity before administrative actuation; qualified joint revision-vector checks; evidence provenance including collection/intervention method; post-effect convergence rather than command-ACK promotion; residual agent/config/provider cohort discovery; authority/SoD re-evaluation at material actuation boundaries; stale/offline evidence detection; reconciliation for `PARTIAL/UNKNOWN`; bounded loop/cardinality guards as later proof candidates where justified; and lineage for AI-generated operational procedures. These are detection/proof candidates, not implementation instructions.

## Saturation disposition

- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- New preventive invariants: **0**.
- HIGH/CRITICAL finding lacking owner/proof/detection route: **0**.
- Developer / Operator Experience / Self-hosting local eligible no-material streak: remains **2**; already satisfied and not inflated.
- Mandatory cluster streaks: **unchanged**; all 12 remain explicitly covered in Full Pass 4 and already at streak **2**.
- Full Pass 4 capability coverage after this revisit: **24/28**.
- Full Pass 4 mandatory cluster coverage: **12/12**.
- Material inventory remains **284 edge scenarios + 119 ConflictPatterns = 403 material findings**.
- Completed full passes: **3/8 minimum**; target reference 12; no maximum.
- Negative-space: `NOT_STARTED`.
- Saturation: `NOT_SATURATED`.
- Planning C remains blocked.

## Exact next action

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 4. Revisit **Provider / Binding / Capability Negotiation** using techniques materially different from Full Passes 1–3 and duplicate-screen against all **119** reusable ConflictPatterns. Challenge discovery→qualification→admission→binding currentness, canonical capability identity versus realization identity, semantic portability versus feature-label equality, bind/rebind/withdraw/cutover races, provider acknowledgement versus canonical/effective state, residual old-provider cohorts, fallback degradation, provider-native identifiers, quota/capacity/cost pressure, `PARTIAL/UNKNOWN`, retry/idempotency scope, offline qualification horizons, trust/privacy/governance under substitution, compatibility direction, presence semantics, cumulative telemetry/privacy exposure, human provider-operations instructions, cross-process provider contention/objective conflicts and AI/low-code provider selection/composition that weakens semantics or authority. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict` and research-only disposition. Absent genuinely new material, preserve Provider/Binding local streak at its already-satisfied value **2**. Do not enter Planning C.
