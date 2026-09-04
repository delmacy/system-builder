# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION

Mandatory clusters initialized for rotation:
1. Process/Application × Workflow × Data/Schema
2. Workflow × Integration × Messaging × external mutation
3. Identity × Authorization × Station × AGWS × AI
4. Data/Schema × Privacy × Storage × Lifecycle
5. Build × Artifact/Release × Deployment × Runtime
6. Provider/Binding × external realizations
7. Secrets/Config × Runtime × Provider substitution
8. Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps
9. Observability × Security/Recovery × runtime truth
10. Extension/Plugin × authority × provider trust × lifecycle
11. Commercial Metering × Entitlements × Rating × Billing × Payment
12. Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution

## Full Pass 1 progress

### Cluster 1 — Process/Application × Workflow × Data/Schema
Status: **CHALLENGED / MATERIAL FINDINGS / STREAK 0**
Register: `project_docs/generation-2/research/edge-cases/PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md`

Material interactions:
- `G2-XEDGE-PROCESS-WORKFLOW-DATA-001` — a long-running instance may cross incompatible process/schema revisions; latest-by-default interpretation is unsafe without applicability evidence.
- `G2-XEDGE-PROCESS-WORKFLOW-DATA-002` — partial migration/backfill creates split semantic populations; migration acknowledgement is not convergence.
- `G2-XEDGE-PROCESS-WORKFLOW-DATA-003` — ambiguous data mutation effect cannot be retried as if `NOT_APPLIED`; require reconcile-before-retry unless qualified idempotency exists.
- `G2-XEDGE-PROCESS-WORKFLOW-DATA-004` — individually valid process paths can claim incompatible canonical postconditions; arrival/completion order cannot choose business truth.

Conflict patterns linked: `G2-CONFLICT-PATTERN-STRUCTURAL-001`, `G2-CONFLICT-PATTERN-VERSION-001`, `G2-CONFLICT-PATTERN-SEMANTIC-001`, `G2-CONFLICT-PATTERN-AI-LOWCODE-001`. These are catalogued detection/remediation candidates, not asserted ConflictInstances.

### Cluster 2 — Workflow × Integration × Messaging × external mutation
Status: **CHALLENGED / MATERIAL FINDINGS / STREAK 0**
Register: `project_docs/generation-2/research/edge-cases/WORKFLOW_DURABLE_EXECUTION_EDGE_CASE_REGISTER.md`

Material interactions:
- `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001` — provider/request/publication acknowledgement does not prove effective/converged business state; workflow terminal progress requires semantic-owner-qualified evidence.
- `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-002` — workflow retry may be locally valid while connector/provider idempotency scope, lifetime or provider generation makes the external mutation non-deduplicated; ambiguous mutation stays `UNKNOWN` until reconciliation.
- `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-003` — compensation/cancellation can race with delayed original/retry deliveries; closure is false while residual authoritative deliveries can reapply the effect.
- `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-004` — provider substitution can leave old subscriptions/messages/attempts authoritative; cutover remains `PARTIAL/INCONCLUSIVE` until residual cohorts are fenced, drained or explicitly dispositioned.

Conflict patterns linked: `G2-CONFLICT-PATTERN-TEMPORAL-001`, `G2-CONFLICT-PATTERN-PROVIDER-001`, `G2-CONFLICT-PATTERN-RECOVERY-001`, `G2-CONFLICT-PATTERN-AUTHORITY-001`. They remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; none is a claimed current ConflictInstance.

### Cluster 3 — Identity × Authorization × Station × AGWS × AI
Status: **CHALLENGED / MATERIAL FINDINGS / STREAK 0**
Register: `project_docs/generation-2/research/edge-cases/ADAPTIVE_GOVERNED_WORK_SURFACES_EDGE_CASE_REGISTER.md`

Material interactions:
- `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-001` — stale identity relationship + cached surface + AI suggestion can preserve obsolete authority unless invocation re-authorizes against qualified current context.
- `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-002` — Station/Role transition racing with proposal approval/promotion can transfer stale authority across scopes unless admission revalidates applicability at commit time.
- `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-003` — visible mandatory guardrail does not prove owner-level enforcement when AI can invoke another path.

### Cluster 4 — Data/Schema × Privacy × Storage × Lifecycle
Status: **CHALLENGED / MATERIAL FINDINGS / STREAK 0**
Register: `project_docs/generation-2/research/edge-cases/DATA_SCHEMA_MIGRATIONS_EDGE_CASE_REGISTER.md`

Material interactions:
- `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001` — erasure and legal-hold/mandatory-retention claims can both be locally valid; authority/applicability evidence must resolve precedence instead of execution order.
- `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-002` — canonical deletion/tombstone can diverge from versioned objects, replicas, caches and backups; source acknowledgement is not enterprise-wide erasure convergence.
- `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-003` — storage/provider substitution can leave stale read/write/restore cohorts authoritative; provider generation is realization evidence, not canonical data identity.
- `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-004` — individually valid retention, archival, residency, minimization and deletion policies can compose into an impossible canonical disposition; a successful provider lifecycle job cannot choose semantic truth.

Conflict patterns linked: `G2-CONFLICT-PATTERN-DATA-001`, `G2-CONFLICT-PATTERN-POLICY-001`, `G2-CONFLICT-PATTERN-REPLICA-001`, `G2-CONFLICT-PATTERN-MIGRATION-001`. They remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; none is a claimed current ConflictInstance.

### Cluster 5 — Build × Artifact/Release × Deployment × Runtime
Status: **CHALLENGED / MATERIAL FINDINGS / STREAK 0**
Register: `project_docs/generation-2/research/edge-cases/BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_EDGE_CASE_REGISTER.md`

Material interactions:
- `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-001` — build output, release, deployment and runtime-effective identities can all be locally valid yet refer to different lifecycle stages/revisions; no upstream identity proves downstream convergence.
- `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-002` — a retained/reproducible artifact can be historically valid while its current dependency/config/schema/provider/trust state makes rollback ineligible.
- `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-003` — desired deployment may be `APPLIED` while residual old runtime cohorts remain authoritative, so fleet convergence stays `PARTIAL/INCONCLUSIVE` until observed and drained/qualified.
- `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-004` — runner/toolchain/provider substitution can preserve nominal build interface while changing output/runtime semantics; semantic equivalence requires qualified differential evidence.

Conflict patterns linked/adopted: new `G2-CONFLICT-PATTERN-BUILD-PROVENANCE-001`, `G2-CONFLICT-PATTERN-EFFECTIVE-IDENTITY-001`, `G2-CONFLICT-PATTERN-SUPPLY-CHAIN-001`; existing `G2-CONFLICT-PATTERN-VERSION-001`, `G2-CONFLICT-PATTERN-MIGRATION-001`, `G2-CONFLICT-PATTERN-RECOVERY-001`, `G2-CONFLICT-PATTERN-SUPPORT-001`, `G2-CONFLICT-PATTERN-CURRENTNESS-001` and `G2-CONFLICT-PATTERN-AI-LOWCODE-001` remain applicable without duplication. All remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; no current ConflictInstance is asserted.

### Cluster 6 — Provider/Binding × external realizations
Status: **CHALLENGED / MATERIAL FINDINGS / STREAK 0**
Register: `project_docs/generation-2/research/edge-cases/STORAGE_DOCUMENTS_MEDIA_EDGE_CASE_REGISTER.md`
Concrete slice: Storage / Documents / Media realization.

Material interactions:
- `G2-XEDGE-PROVIDER-STORAGE-001` — provider write/copy/restore ACK can be fully correct under its local contract yet insufficient to prove the stronger canonical claim of durable, current, integrity-valid and consumer-effective object availability. Required claim profile and current provider evidence must match; otherwise preserve `PARTIAL/INCONCLUSIVE/UNKNOWN`.
- `G2-XEDGE-PROVIDER-STORAGE-002` — provider substitution can leave old versions, caches, signed access paths and restore sources materially authoritative after the new binding becomes nominally active. Cutover is not convergence until residual cohorts are fenced, drained or explicitly dispositioned.
- `G2-XEDGE-PROVIDER-STORAGE-003` — two providers can advertise the same nominal feature while differing materially in versioning, integrity, immutability, multipart, range, consistency or restore semantics. Matching names/API shapes do not prove portable semantic support.
- `G2-XEDGE-PROVIDER-STORAGE-004` — bytes can remain durable while key/credential/access-path rotation makes the canonical revision effectively unreachable. Storage durability, authorization and reachability are separate qualifications.

Conflict patterns linked/adopted: `G2-CONFLICT-PATTERN-PROVIDER-002`, `G2-CONFLICT-PATTERN-REPRESENTATION-001`, `G2-CONFLICT-PATTERN-SUPPORT-001`; existing `G2-CONFLICT-PATTERN-REPLICA-001`, `G2-CONFLICT-PATTERN-MIGRATION-001` and `G2-CONFLICT-PATTERN-RECOVERY-001` remain applicable without duplication. All remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; no current ConflictInstance is asserted.

### Cluster 7 — Secrets/Config × Runtime × Provider substitution
Status: **CHALLENGED / MATERIAL FINDINGS / STREAK 0**
Register: `project_docs/generation-2/research/edge-cases/SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_EDGE_CASE_REGISTER.md`

Material interactions:
- `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-001` — provider rotation can be `APPLIED` while runtime fleet adoption remains `PARTIAL/INCONCLUSIVE`; env snapshots, caches and mount semantics prove source-currentness and consumer-effective currentness are distinct.
- `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-002` — provider substitution can leave old credentials, files, resolver paths and service accounts materially usable after nominal cutover; provider IDs remain non-canonical and residual authority must be reconciled.
- `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-003` — disconnected runtime can remain locally healthy after secret/config currentness or lease evidence becomes stale; autonomy cannot silently extend trust or authorization beyond an explicit bound.
- `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-004` — provider-native key/secret/version identity can accidentally become canonical binding identity, breaking portable substitution and potentially leaking authority assumptions.

Conflict patterns linked/adopted: new `G2-CONFLICT-PATTERN-CURRENTNESS-001`, `G2-CONFLICT-PATTERN-SECRET-BOUNDARY-001`, `G2-CONFLICT-PATTERN-AUTHORITY-002`; existing `G2-CONFLICT-PATTERN-MIGRATION-001`, `G2-CONFLICT-PATTERN-RECOVERY-001`, `G2-CONFLICT-PATTERN-SUPPORT-001` and `G2-CONFLICT-PATTERN-AI-LOWCODE-001` remain applicable without duplication. All remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; no current ConflictInstance is asserted.

Clusters 1–7 discovered material findings, so their no-material streaks are `0`. Mandatory clusters 8–12 remain unvisited in Full Pass 1. Full-pass count remains `0`; no cluster is saturated.