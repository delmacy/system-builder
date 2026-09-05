# Generation 2 — Edge-Case Index

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Stable IDs use `G2-EDGE-<CAPABILITY>-NNN`, cross-capability IDs use `G2-XEDGE-<CLUSTER>-NNN`, and reusable processual/semantic conflict patterns use `G2-CONFLICT-PATTERN-<FAMILY>-NNN`.

Canonical distinctions: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; provider IDs are non-canonical; `Enterprise → Station → Role → Person`; AI/AGWS cannot amplify authority; `UNKNOWN → reconcile-before-retry`; `StoredFact != DerivedValue`; `FormulaRevision != CalculationResult`. Detailed scenario and ConflictPattern fields remain authoritative in the originating registers and revisit dossiers.

## Full Pass 1 historical index

Full Pass 1 completed **28/28 capabilities** and **12/12 mandatory clusters**. The 28 `*_EDGE_CASE_REGISTER.md` artifacts and prior Git history remain the detailed Full-Pass-1 authority.

## Full Pass 2 — completed revisit index

Full Pass 2 completed **28/28 capabilities** and **12/12 mandatory clusters**. Its duplicate screening increased the reusable ConflictPattern inventory from 103 to **115** and the campaign inventory to **278 material edge scenarios + 115 reusable ConflictPatterns = 393 material findings**. The authoritative Pass-2 per-capability revisit dossiers remain in this directory and preserve detailed activation, detection, owner, severity, currentness, false-positive and future-remediation fields.

## Reusable ConflictPattern inventory

The reusable catalogue is now **119 `G2-CONFLICT-PATTERN-*` families**.

- Full Pass 3 UCA added `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`, covering incompatible `ABSENT/UNSET/UNKNOWN/NOT_APPLICABLE/REDACTED/null/default/delete` interpretations across otherwise valid representation/profile boundaries.
- Full Pass 3 Enterprise Trust / PKI added `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001`, covering composition where individually valid trust partitions become jointly unsafe because a union/import/provider/federation layer loses the domain→bundle/anchor-set ownership boundary and thereby widens the namespace accepted by a validator.
- Full Pass 3 Privacy / Data Governance added `G2-CONFLICT-PATTERN-CUMULATIVE-PRIVACY-001`, covering N-wise/history-dependent composition where individually permissible releases, analyses, views or inferences jointly create material re-identification, sensitive inference or excessive explicitly governed cumulative privacy loss that no component-local qualification established.
- Full Pass 3 Lifecycle / Versioning / Evolution / Migration added `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001`, covering a qualified one-way or operation-specific compatibility relation that becomes unsafe when composition promotes it to undirected/global compatibility for a reversed role, alternate operation, rolling topology, replay or rollback.

A researched pattern is not a concrete defect and does not authorize implementation. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## Full Pass 3 — completed revisit index

Full Pass 3 completed **28/28 capabilities + 12/12 mandatory clusters**. Detailed Pass-3 dossiers remain authoritative. Material additions were `G2-EDGE-UCA-011` + presence-semantics, `G2-EDGE-UI-011`, `G2-EDGE-INTEGRATION-008`, `G2-EDGE-TRUST-008` + trust-namespace-collapse, `G2-EDGE-PRIVACY-008` + cumulative-privacy, and `G2-EDGE-LIFECYCLE-008` + compatibility-direction. The completed-pass inventory became **284 edge scenarios + 119 ConflictPatterns = 403 material findings**.

## Full-Pass-3 material chains

### Presence semantics

`G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` originated in UCA; `G2-EDGE-UI-011` and `G2-EDGE-INTEGRATION-008` are capability-specific manifestations where omission/null/default/delete translation changes canonical intent/effect.

### Trust namespace

`G2-EDGE-TRUST-008` / `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001` capture individually valid trust partitions becoming jointly unsafe when composition loses the trust-domain ownership boundary. Research-only preventive candidate: trust-material composition must not widen namespace/authority merely through union/import/co-location without explicit owner qualification.

### Cumulative privacy

`G2-EDGE-PRIVACY-008` / `G2-CONFLICT-PATTERN-CUMULATIVE-PRIVACY-001` capture individually permissible releases/analyses becoming jointly identifying, inferential or incompatible with an explicitly governed cumulative privacy-loss bound. Detection remains history/recipient/context-aware and signal != confirmed conflict.

### Compatibility direction

`G2-EDGE-LIFECYCLE-008` / `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001` capture a supported relation such as A→B/read/forward being promoted to a scalar pairwise compatibility claim and reused for B→A/write/rollback or another reachable cohort. Legitimate asymmetric compatibility remains allowed; no `ConflictInstance` is asserted.

## Full Pass 4 — active revisit index

| Capability | Revisit artifact | Pass-4 material result | Local streak after revisit | Cluster disposition |
| --- | --- | --- | ---: | --- |
| Adaptive Governed Work Surfaces | `ADAPTIVE_GOVERNED_WORK_SURFACES_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** | no mandatory cluster counted; Identity × Authorization × Station × AGWS × AI remains **2** |
| Process & Application Modeling | `PROCESS_APPLICATION_MODELING_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** | Process/Application × Workflow × Data/Schema **1→2** |
| Workflow & Durable Execution | `WORKFLOW_DURABLE_EXECUTION_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** | Workflow × Integration × Messaging × external mutation **1→2** |
| Data / Schema / Migrations | `DATA_SCHEMA_MIGRATIONS_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** | Data/Schema × Privacy × Storage × Lifecycle **1→2** |

The four completed Pass-4 revisits duplicate-screened all **119** reusable ConflictPatterns, explicitly including presence semantics, trust-namespace collapse, cumulative privacy and compatibility direction. No material ID has been added in Full Pass 4 so far.

### Data / Schema / Migrations — Pass 4

The revisit challenged declared constraint versus historically validated invariant, multi-version semantic cuts, presence/default provenance, online schema changes crossing long writes, dual-write/CDC common-cut qualification, identity/key reuse, retention/legal-hold/residency intersections, correction after downstream adoption, restore of disposed obsolete cohorts, directed rollback compatibility, provider substitution with `PARTIAL/UNKNOWN`, resource/cardinality pressure and human/AI migration plans.

A strong industrial witness is PostgreSQL `NOT VALID`: a constraint can be declared and enforced for subsequent writes while historical rows have not yet been validated. This reinforces qualified-evidence/currentness/convergence semantics but does not create a new reusable family. PostgreSQL logical replication likewise separates replication transport from DDL/schema convergence. Duplicate-screen therefore found **0 new local edges, 0 new cross-capability scenarios and 0 new ConflictPatterns**.

Data / Schema / Migrations local streak advances **1→2** and explicit Data/Schema × Privacy × Storage × Lifecycle cluster streak advances **1→2**. `Signal != ConfirmedConflict` remains mandatory.

## Campaign state

- completed full passes: **3/8 minimum**; target reference **12**, no maximum;
- active full pass: **4**;
- Full Pass 3: **28/28 capabilities + 12/12 mandatory clusters — complete**;
- Full Pass 4: **4/28 capabilities + 3/12 mandatory clusters**;
- material edge scenarios: **284**;
- reusable ConflictPatterns: **119**;
- combined material findings: **403**;
- HIGH/CRITICAL without semantic owner/proof obligation/detection route: **0**;
- local streaks at **2** now include AGWS, Process, Workflow and Data plus the previously saturated local capabilities recorded in `ADVERSARIAL_SATURATION_STATE.json`;
- local streaks at 0 after material findings: UCA, UI, Integration, Enterprise Trust/PKI, Privacy and Lifecycle;
- mandatory cluster streaks at **2** include Identity × Authorization × Station × AGWS × AI, Process/Application × Workflow × Data/Schema, Workflow × Integration × Messaging × external mutation, Data/Schema × Privacy × Storage × Lifecycle and Provider/Binding × external realizations; Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution remains **0**; remaining values are state-authoritative;
- adversarial negative-space review: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- `PLANNING_C_TARGET_ARCHITECTURE`: **BLOCKED**.

## Next rotation

The authoritative next action is maintained by `RESEARCH_PIPELINE_STATE.json` and `ADVERSARIAL_SATURATION_STATE.json`: continue Full Pass 4 with **Storage / Documents / Media** and explicitly exercise **Provider/Binding × external realizations** for this pass without inflating its already-satisfied streak beyond 2. Duplicate-screen against all **119** reusable ConflictPatterns. Do not enter Planning C.
