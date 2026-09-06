# Generation 2 — Edge-Case Index

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Stable IDs use `G2-EDGE-<CAPABILITY>-NNN`, cross-capability IDs use `G2-XEDGE-<CLUSTER>-NNN`, and reusable processual/semantic conflict patterns use `G2-CONFLICT-PATTERN-<FAMILY>-NNN`.

Canonical distinctions: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; provider IDs are non-canonical; `Enterprise → Station → Role → Person`; AI/AGWS cannot amplify authority; `UNKNOWN → reconcile-before-retry`; `StoredFact != DerivedValue`; `FormulaRevision != CalculationResult`; proof/integrity claim != semantic/effect claim; local evidence != exported telemetry != Fleet aggregate; provenance/lineage != authority != causal proof.

## Completed-pass history

- Full Pass 1: 28/28 capabilities + 12/12 mandatory clusters.
- Full Pass 2: 28/28 + 12/12; catalogue increased to 115 patterns.
- Full Pass 3: 28/28 + 12/12; inventory reached 284 edge scenarios + 119 ConflictPatterns = 403.
- Full Pass 4: 28/28 + 12/12; no material additions.
- Full Pass 5: 28/28 + 12/12; inventory reached 284 + 123 = 407.
- Full Pass 6: 28/28 + 12/12; UCA provenance research added `G2-CONFLICT-PATTERN-PROVENANCE-EDGE-OVERATTRIBUTION-001`; inventory reached 284 + 124 = 408.

Detailed per-pass dossiers and prior Git history remain authoritative for scenario-level fields.

## Reusable ConflictPattern inventory

The reusable catalogue remains **124 `G2-CONFLICT-PATTERN-*` families**. Default disposition is `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

Cross-cutting stable IDs especially relevant to later passes:

- `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`;
- `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001`;
- `G2-CONFLICT-PATTERN-CUMULATIVE-PRIVACY-001`;
- `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001`;
- `G2-CONFLICT-PATTERN-PROOF-CLAIM-CONFLATION-001`;
- `G2-CONFLICT-PATTERN-FEDERATED-CONTINUITY-001`;
- `G2-CONFLICT-PATTERN-CERTIFICATE-COMPOSITION-001`;
- `G2-CONFLICT-PATTERN-ANALYTICAL-KIND-CONFLATION-001`;
- `G2-CONFLICT-PATTERN-PROVENANCE-EDGE-OVERATTRIBUTION-001`.

The complete 124-pattern authority remains the originating registers/dossiers plus `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`.

## Full Pass 7 — active

### Adaptive Governed Work Surfaces

Authority: `ADAPTIVE_GOVERNED_WORK_SURFACES_FULL_PASS_7_REVISIT.md`.

Result: eligible no-new-material. Queue aging/fairness, stale work ranking, temporal graph slices, forecast/counterfactual kinds, vector scalarization and AI/low-code prioritization all duplicate-screened into the existing 124 patterns. Local and mandatory-cluster streaks remain capped at 2.

### Process & Application Modeling

Authority: `PROCESS_APPLICATION_MODELING_FULL_PASS_7_REVISIT.md`.

Result: eligible no-new-material. Temporal reachability, retroactive graph correction, uncertain predicates, nested queue networks, deadline/service-time feasibility, fan-out/fan-in stability, revision-pinned parent/child mappings, non-commutative canonical writes, provenance subtraction, semantic-kind permutation, vector scalarization and federated responsibility crossing duplicate-screened into existing patterns. `Process/Application × Workflow × Data/Schema` materially exercised; streak remains capped at 2.

### Workflow & Durable Execution

Authority: `WORKFLOW_DURABLE_EXECUTION_FULL_PASS_7_REVISIT.md`.

Result: eligible no-new-material. Wait/subscription revision crossing, dynamic graph rewrite, retry/event/effect identity permutation, UNKNOWN external mutation, child-proof revision composition, late-child fan-in, cancellation/external adoption, compensation eligibility, queue-network retry storms, uncertainty-kind preservation, provenance relation discipline, formal-profile strengthening and stale-reference online conformance duplicate-screened into existing patterns. `Workflow × Integration × Messaging × external mutation` materially exercised; streak remains capped at 2.

### Data / Schema / Migrations

Authority: `DATA_SCHEMA_MIGRATIONS_FULL_PASS_7_REVISIT.md`.

Result: eligible no-new-material. Full Pass 7 used bitemporal correction, validity overlap/gap, declared-versus-enforced constraint state, snapshot/stream collision, stable-key/schema revision crossing, queue-network migration pressure, in-flight schema pins, dimensional transformations, uncertainty-kind preservation, provenance relation permutation, restore/migration races, journal-schema evolution, privacy/lifecycle completeness and AI/low-code shape-preserving semantic changes.

PostgreSQL 18 temporal and `NOT ENFORCED` constraint semantics strengthen the distinction `constraint declared != constraint enforced != population validated != semantic invariant satisfied`. Debezium snapshot-window collision handling strengthens ordering/currentness and migration-coexistence families. Neither creates a 125th pattern.

Existing Data IDs remain authoritative: `G2-EDGE-DATA-001..008` and `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..005`; no new ID was warranted in this revisit. `Data/Schema × Privacy × Storage × Lifecycle` was materially exercised and remains streak-capped at 2.

### Storage / Documents / Media

Authority: `STORAGE_DOCUMENTS_MEDIA_FULL_PASS_7_REVISIT.md`.

Result: eligible no-new-material. Full Pass 7 permuted byte identity against multipart layout, copy mechanics, checksum/ETag, provider version and canonical revision; challenged temporal provider-binding validity, partial multipart state, stale derived previews/indexes/transcodes, retention/legal-hold propagation, restore/hydration eligibility, queue/I/O stability, offline evidence splicing, cross-tenant realization aliasing and AI/low-code shape-preserving semantic changes.

Fresh S3 evidence shows multipart ETag is not whole-object MD5 and that copy can change checksum while bytes remain unchanged. This strengthens `integrity/representation evidence != canonical semantic identity/equivalence`. Azure version/container-scoped immutability semantics strengthen scope-qualified retention/hold reasoning. No 125th pattern was warranted.

Existing Storage IDs remain authoritative: `G2-EDGE-STORAGE-001..008` and `G2-XEDGE-PROVIDER-STORAGE-001..004`; no new ID was warranted. `Provider/Binding × external realizations` was materially exercised and remains streak-capped at 2.

## Campaign state

- completed full passes: **6/8 minimum**; target **12**, no maximum;
- active full pass: **7**;
- Full Pass 7 capability coverage: **5/28**;
- Full Pass 7 mandatory-cluster coverage: **5/12**;
- material edge scenarios: **284**;
- reusable ConflictPatterns: **124**;
- combined material findings: **408**;
- HIGH/CRITICAL without semantic owner/proof obligation/detection route: **0**;
- adversarial negative-space review: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- `PLANNING_C_TARGET_ARCHITECTURE`: **BLOCKED**.

## Next rotation

Continue Full Pass 7 with **Secrets / Configuration / Environment Portability** and explicitly exercise `Secrets/Config × Runtime × Provider substitution`. Challenge temporal validity, alias/latest versus pinned versions, rotation/revocation while autonomous/offline builds remain active, bootstrap/recovery circularity, provider namespace/type mismatch, residual credential/config cohorts, local evidence without secret leakage, `ABSENT/null/default/delete`, `PARTIAL/UNKNOWN`, shared-infrastructure tenant attribution, queue/resource pressure, stale config projections, human runbooks and AI/low-code composition of individually permitted references into aggregate or cross-tenant authority. Duplicate-screen all 124 patterns. Do not inflate already-satisfied streaks absent material novelty. Do not enter Planning C.