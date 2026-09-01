# Generation 2 — Capability Discovery Register

Promotion requires multi-representative evidence or a clear structural System Builder need. Candidates are not architecture decisions.

Existing candidates through `G2-CAPABILITY-CANDIDATE-SBOM-COMPLETENESS-EVIDENCE` remain CANDIDATE with their prior classifications and promotion conditions recorded in pipeline history and capability dossiers.

| Candidate | Class | Evidence origin | Status | Promotion condition |
|---|---|---|---|---|
| G2-CAPABILITY-CANDIDATE-DEPLOYMENT-RECONCILIATION-EVIDENCE | CROSS_CUTTING | Kubernetes + Argo CD + OpenTofu + Nomad | CANDIDATE | Recur in Observability/Governance/Reconciliation and remain distinct from generic deployment history. |
| G2-CAPABILITY-CANDIDATE-RUNTIME-ACTIVATION-PROMOTION | CROSS_CUTTING | Cloud Run + Nomad + Vercel + SB DeploymentActivationDecision | CANDIDATE | Recur in Lifecycle/Provider Negotiation and prove ownership distinct from release publication. |
| G2-CAPABILITY-CANDIDATE-DEPLOYMENT-RECOVERY-CONTRACT | CROSS_CUTTING | Kubernetes rollback + Nomad auto-revert + Cloud Run traffic rollback | CANDIDATE | Recur in Security/Failure Recovery and Lifecycle with explicit safety/precondition semantics. |

This compact register view does not revoke or supersede earlier candidates; `RESEARCH_PIPELINE_STATE.json` is the authoritative candidate inventory.
