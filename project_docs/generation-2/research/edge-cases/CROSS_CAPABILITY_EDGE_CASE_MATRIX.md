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

Clusters 1, 2 and 3 discovered material findings, so their no-material streaks are `0`. All other mandatory clusters remain unvisited in Full Pass 1. Full-pass count remains `0`; no cluster is saturated.