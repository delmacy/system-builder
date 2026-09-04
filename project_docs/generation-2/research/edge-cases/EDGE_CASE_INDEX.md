# Generation 2 — Edge-Case Index

Status: ACTIVE
Phase: RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION

Stable IDs use `G2-EDGE-<CAPABILITY>-NNN`, cross-capability IDs use `G2-XEDGE-<CLUSTER>-NNN`, and reusable processual/semantic conflict patterns use `G2-CONFLICT-PATTERN-<FAMILY>-NNN`. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

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
| `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-001` | stale identity relationship + cached surface + AI action suggestion | CRITICAL | Identity + Authorization + AGWS | `XAGWS-ADV-PROOF-001` |
| `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-002` | Station transition races with proposal approval/promotion | CRITICAL | AGWS + Authorization + Identity/Governance | `XAGWS-ADV-PROOF-002` |
| `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-003` | mandatory guardrail is rendered but AI routes around owner-level control | CRITICAL | AGWS + Workflow/Governance/Authorization | `XAGWS-ADV-PROOF-003` |

### Process & Application Modeling
Register: `project_docs/generation-2/research/edge-cases/PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md`

| ID | Material scenario | Severity | Primary owner(s) | Proof obligation |
| --- | --- | --- | --- | --- |
| `G2-EDGE-PROCESS-001` | stale-base semantic overwrite | HIGH | Process Modeling + Lifecycle + affected owners | `PROCESS-ADV-PROOF-001` |
| `G2-EDGE-PROCESS-002` | lossy brownfield normalization promoted as canonical equivalence | HIGH | Process Modeling + Integration + semantic owner | `PROCESS-ADV-PROOF-002` |
| `G2-EDGE-PROCESS-003` | process revision publication falsely implies downstream convergence | CRITICAL | Process + Workflow + Data + Lifecycle | `PROCESS-ADV-PROOF-003` |
| `G2-EDGE-PROCESS-004` | historical revision exists but rollback is no longer eligible | CRITICAL | Lifecycle + Process + affected owners | `PROCESS-ADV-PROOF-004` |
| `G2-EDGE-PROCESS-005` | pathological valid graph exhausts analysis/materialization | HIGH | Process + analysis consumers + FinOps | `PROCESS-ADV-PROOF-005` |
| `G2-EDGE-PROCESS-006` | AI/low-code composition smuggles semantic-owner mutation | CRITICAL | Process + Authorization + semantic owner | `PROCESS-ADV-PROOF-006` |

### Process/Application × Workflow × Data/Schema
| `G2-XEDGE-PROCESS-WORKFLOW-DATA-001` | long-running instance crosses incompatible process/schema revisions | CRITICAL | Workflow + Process + Data + Lifecycle | `XPROCESS-ADV-PROOF-001` |
| `G2-XEDGE-PROCESS-WORKFLOW-DATA-002` | partial schema migration creates split semantic population | CRITICAL | Data + Process + Workflow + Lifecycle | `XPROCESS-ADV-PROOF-002` |
| `G2-XEDGE-PROCESS-WORKFLOW-DATA-003` | retry after ambiguous data mutation replays process transition | CRITICAL | Workflow + Data + Integration | `XPROCESS-ADV-PROOF-003` |
| `G2-XEDGE-PROCESS-WORKFLOW-DATA-004` | valid paths claim incompatible canonical postconditions | CRITICAL | domain/data owner + Process + Workflow | `XPROCESS-ADV-PROOF-004` |

### Processual / semantic conflict patterns discovered in this visit
| ID | Family | Material pattern | Severity range | Detection candidate | Proof |
| --- | --- | --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-STRUCTURAL-001` | structural graph | valid branches produce incompatible terminal claims/fan-in | HIGH–CRITICAL | static postcondition/graph constraint analysis | `PROCESS-CONFLICT-PROOF-001` |
| `G2-CONFLICT-PATTERN-VERSION-001` | version/coexistence | individually valid revisions are composition-incompatible | CRITICAL | revision-vector compatibility/currentness | `PROCESS-CONFLICT-PROOF-002` |
| `G2-CONFLICT-PATTERN-SEMANTIC-001` | semantic ownership | multiple components claim one canonical fact/postcondition | CRITICAL | ownership-reference + competing mutation signals | `PROCESS-CONFLICT-PROOF-003` |
| `G2-CONFLICT-PATTERN-AI-LOWCODE-001` | AI/low-code composition | safe primitives compose into unauthorized semantic mutation | CRITICAL | owner/authority dependency analysis + commit-time revalidation | `PROCESS-CONFLICT-PROOF-004` |

Both Process & Application Modeling and its paired cluster discovered material findings on first visit, so both streaks are `0`. Full Pass 1 remains incomplete.