# Generation 2 — Edge-Case Index

Status: ACTIVE
Phase: RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION

Stable IDs use `G2-EDGE-<CAPABILITY>-NNN` and cross-capability IDs use `G2-XEDGE-<CLUSTER>-NNN`.

Every material entry includes owner(s), expected safe behavior, forbidden behavior, effect/failure disposition, authority boundary, evidence/currentness, recovery/reconciliation, blast radius, severity/misuse likelihood and proof obligation in its per-capability register.

## Full Pass 1 — indexed material findings

### Adaptive Governed Work Surfaces

Register: `project_docs/generation-2/research/edge-cases/ADAPTIVE_GOVERNED_WORK_SURFACES_EDGE_CASE_REGISTER.md`

| ID | Material scenario | Severity | Primary owner(s) | Proof obligation |
| --- | --- | --- | --- | --- |
| `G2-EDGE-AGWS-001` | stale Role/Station context leaves a previously valid surface actionable | CRITICAL | Authorization + Identity + AGWS | `AGWS-ADV-PROOF-001` |
| `G2-EDGE-AGWS-002` | lower-layer overlay removes or neutralizes inherited mandatory component | HIGH | AGWS + Lifecycle + Authorization | `AGWS-ADV-PROOF-002` |
| `G2-EDGE-AGWS-003` | AI proposal mixes valid layout intent with unauthorized semantic mutation | CRITICAL | AGWS + referenced semantic owners + Authorization | `AGWS-ADV-PROOF-003` |
| `G2-EDGE-AGWS-004` | usage-driven promotion converts personal automation into shared authority | CRITICAL | AGWS + Authorization + Integration/Workflow | `AGWS-ADV-PROOF-004` |
| `G2-EDGE-AGWS-005` | provider-backed action times out and surface retries an `UNKNOWN` mutation | CRITICAL | Integration + Provider/Binding + AGWS | `AGWS-ADV-PROOF-005` |
| `G2-EDGE-AGWS-006` | pathological overlay/component graph exhausts resolution resources and induces unsafe fallback | HIGH | AGWS + UI + Authorization | `AGWS-ADV-PROOF-006` |

### Identity × Authorization × Station × AGWS × AI

| ID | Material scenario | Severity | Primary owner(s) | Proof obligation |
| --- | --- | --- | --- | --- |
| `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-001` | stale identity relationship + cached surface + AI action suggestion | CRITICAL | Identity + Authorization + AGWS | `XAGWS-ADV-PROOF-001` |
| `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-002` | Station transition races with proposal approval/promotion | CRITICAL | AGWS + Authorization + Identity/Governance | `XAGWS-ADV-PROOF-002` |
| `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-003` | mandatory guardrail is rendered but AI routes around owner-level control | CRITICAL | AGWS + Workflow/Governance/Authorization | `XAGWS-ADV-PROOF-003` |

AGWS and its paired high-risk cluster both discovered material findings in their first real visit, therefore both no-material saturation streaks remain `0`. Full Pass 1 is not complete until all 28 canonical capabilities and all mandatory clusters are challenged.