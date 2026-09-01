# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Previous capability coverage remains authoritative in the corresponding dossiers and state file; this ledger is append-oriented as research advances.

## Deployment / Environment / Runtime coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| Kubernetes Deployments | DEEP | Separates desired workload state, observed conditions, provider rollout revisions and rollback scope. | Stateful workload recovery, controller ownership conflicts and multi-cluster portability. |
| Argo CD | DEEP | Shows GitOps desired-state reconciliation, OutOfSync detection, explicit self-heal policy, retry and sync-history identity. | Multi-source ownership, rollback under automated sync and policy/audit integration. |
| OpenTofu | DEEP | Separates provider source/version, provider configuration, durable state/backend and plan/apply reconciliation. | State portability, provider replacement and plan/apply evidence boundaries. |
| HashiCorp Nomad | DEEP | Makes deployment a lifecycle object with health-gated rolling/canary progression, promotion and auto-revert. | Stateful deployments, failure recovery and multi-region consistency. |
| Google Cloud Run | DEEP | Immutable runtime revisions are distinct from mutable traffic activation; supports zero-traffic revisions, gradual rollout and rollback. | Revision retention, provider replacement and stateful dependency boundaries. |
| Vercel Deployments | PARTIAL | Immutable deployment outputs and promotion/rollback demonstrate serving-state activation independent of build output. | Environment binding semantics, retention, runtime evidence export and provider-exit proof. |

Historical representative coverage for prior capabilities is preserved in `RESEARCH_PIPELINE_STATE.json` and their capability dossiers; no prior status is superseded by this compact ledger update.
