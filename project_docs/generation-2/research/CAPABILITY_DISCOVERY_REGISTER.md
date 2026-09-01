# Generation 2 — Capability Discovery Register

Promotion requires multi-representative evidence or a clear structural System Builder need. Candidates are not architecture decisions.

Existing candidates through `G2-CAPABILITY-CANDIDATE-IRREVERSIBLE-TRANSITION-PROOF` remain CANDIDATE with prior classifications and promotion conditions recorded in pipeline history and capability dossiers.

| Candidate | Class | Evidence origin | Status | Promotion condition |
|---|---|---|---|---|
| G2-CAPABILITY-CANDIDATE-RECOVERY-OBJECTIVE-PROOF | CROSS_CUTTING | AWS Well-Architected RTO/RPO + PostgreSQL restore prerequisites + NIST Recover lifecycle | CANDIDATE | Promote if architecture reconciliation needs one reusable contract linking recovery objectives to measured recovery evidence across data/deployment/runtime. |
| G2-CAPABILITY-CANDIDATE-RECOVERY-POINT-LINEAGE | CROSS_CUTTING | PostgreSQL base backup/WAL/timeline lineage + generic DR backup/restore requirements | CANDIDATE | Promote if multiple providers need portable identity for recovery points and restored-state lineage without hiding provider-specific restore semantics. |
| G2-CAPABILITY-CANDIDATE-RESILIENCE-POLICY-NEGOTIATION | CORE | Kubernetes disruption guarantees + retry/circuit semantics + AWS DR capability differences | CANDIDATE | Promote if provider negotiation must match explicit resilience requirements to qualified provider offers and reject unsupported semantics. |

This compact register view does not revoke or supersede earlier candidates; `RESEARCH_PIPELINE_STATE.json` and capability dossiers preserve the full inventory.
