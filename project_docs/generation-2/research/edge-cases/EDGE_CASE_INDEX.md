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

### Processual / semantic conflict patterns discovered in Process Modeling visit
| ID | Family | Material pattern | Severity range | Detection candidate | Proof |
| --- | --- | --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-STRUCTURAL-001` | structural graph | valid branches produce incompatible terminal claims/fan-in | HIGH–CRITICAL | static postcondition/graph constraint analysis | `PROCESS-CONFLICT-PROOF-001` |
| `G2-CONFLICT-PATTERN-VERSION-001` | version/coexistence | individually valid revisions are composition-incompatible | CRITICAL | revision-vector compatibility/currentness | `PROCESS-CONFLICT-PROOF-002` |
| `G2-CONFLICT-PATTERN-SEMANTIC-001` | semantic ownership | multiple components claim one canonical fact/postcondition | CRITICAL | ownership-reference + competing mutation signals | `PROCESS-CONFLICT-PROOF-003` |
| `G2-CONFLICT-PATTERN-AI-LOWCODE-001` | AI/low-code composition | safe primitives compose into unauthorized semantic mutation | CRITICAL | owner/authority dependency analysis + commit-time revalidation | `PROCESS-CONFLICT-PROOF-004` |

### Workflow & Durable Execution
Register: `project_docs/generation-2/research/edge-cases/WORKFLOW_DURABLE_EXECUTION_EDGE_CASE_REGISTER.md`

| ID | Material scenario | Severity | Primary owner(s) | Proof obligation |
| --- | --- | --- | --- | --- |
| `G2-EDGE-WORKFLOW-001` | duplicate/out-of-order signal advances incompatible transition | CRITICAL | Workflow + Messaging + Integration | `WORKFLOW-ADV-PROOF-001` |
| `G2-EDGE-WORKFLOW-002` | timer/cancellation/approval race creates incompatible terminal claims | CRITICAL | Workflow + Authorization + temporal realization | `WORKFLOW-ADV-PROOF-002` |
| `G2-EDGE-WORKFLOW-003` | activity effect succeeds but durable transition persistence fails | CRITICAL | Workflow + Integration/Data + Provider Binding | `WORKFLOW-ADV-PROOF-003` |
| `G2-EDGE-WORKFLOW-004` | in-flight instance crosses workflow/provider/schema/policy revision skew | CRITICAL | Workflow + Lifecycle + Provider/Data/Auth owners | `WORKFLOW-ADV-PROOF-004` |
| `G2-EDGE-WORKFLOW-005` | human-task authority drifts while task remains open | CRITICAL | Workflow + Authorization/Identity | `WORKFLOW-ADV-PROOF-005` |
| `G2-EDGE-WORKFLOW-006` | valid fan-out/retry composition exhausts queue/provider/cost capacity | HIGH | Workflow + Provider/Runtime + FinOps | `WORKFLOW-ADV-PROOF-006` |

### Workflow × Integration × Messaging × external mutation
| ID | Material scenario | Severity | Primary owner(s) | Proof obligation |
| --- | --- | --- | --- | --- |
| `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001` | provider acknowledgement mistaken for effective business state | CRITICAL | Integration + Workflow + target owner + Messaging | `XWORKFLOW-ADV-PROOF-001` |
| `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-002` | idempotency scope mismatch duplicates external mutation | CRITICAL | Integration + Provider/Binding + Workflow | `XWORKFLOW-ADV-PROOF-002` |
| `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-003` | compensation races with delayed original/retry message | CRITICAL | Workflow + Messaging + Integration + Lifecycle | `XWORKFLOW-ADV-PROOF-003` |
| `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-004` | provider substitution leaves residual old subscriptions/messages authoritative | HIGH–CRITICAL | Provider/Binding + Integration + Messaging + Workflow + Lifecycle | `XWORKFLOW-ADV-PROOF-004` |

### Processual / semantic conflict patterns discovered in Workflow visit
| ID | Family | Material pattern | Severity range | Detection candidate | Proof |
| --- | --- | --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-TEMPORAL-001` | temporal/state-transition | locally valid transitions become jointly contradictory under race/order skew | HIGH–CRITICAL | transition conflict graph + commit/currentness + late-event classification | `WORKFLOW-CONFLICT-PROOF-001` |
| `G2-CONFLICT-PATTERN-PROVIDER-001` | provider/integration | retry/idempotency semantics composition-incompatible across owners/providers | CRITICAL | semantic support + idempotency scope/horizon compatibility | `WORKFLOW-CONFLICT-PROOF-002` |
| `G2-CONFLICT-PATTERN-RECOVERY-001` | exception/recovery | compensation/recovery conflicts with residual authoritative work | CRITICAL | residual-cohort inventory + post-recovery convergence | `WORKFLOW-CONFLICT-PROOF-003` |
| `G2-CONFLICT-PATTERN-AUTHORITY-001` | authority/human procedure | durable assignment conflicts with current authority/responsibility | HIGH–CRITICAL | commit-time authority/currentness + SoD analysis | `WORKFLOW-CONFLICT-PROOF-004` |

### Data / Schema / Migrations
Register: `project_docs/generation-2/research/edge-cases/DATA_SCHEMA_MIGRATIONS_EDGE_CASE_REGISTER.md`

| ID | Material scenario | Severity | Primary owner(s) | Proof obligation |
| --- | --- | --- | --- | --- |
| `G2-EDGE-DATA-001` | stale read drives incompatible canonical write | CRITICAL | Data/domain owner + Process/Workflow | `DATA-ADV-PROOF-001` |
| `G2-EDGE-DATA-002` | duplicate/imported identity collision creates conflicting canonical subjects | HIGH–CRITICAL | Data/master/reference + domain identity owner | `DATA-ADV-PROOF-002` |
| `G2-EDGE-DATA-003` | partial migration/backfill produces split semantic population | CRITICAL | Data/Schema + Lifecycle + affected owners | `DATA-ADV-PROOF-003` |
| `G2-EDGE-DATA-004` | irreversible data evolution makes rollback falsely safe | CRITICAL | Lifecycle + Data/Schema + affected owners | `DATA-ADV-PROOF-004` |
| `G2-EDGE-DATA-005` | StoredFact and DerivedValue are silently interchanged | CRITICAL | Data owner + Calculation + domain owner | `DATA-ADV-PROOF-005` |
| `G2-EDGE-DATA-006` | large valid backfill exhausts capacity and creates unsafe mixed-state fallback | HIGH | Data + Operations/Storage + FinOps | `DATA-ADV-PROOF-006` |

### Data/Schema × Privacy × Storage × Lifecycle
| ID | Material scenario | Severity | Primary owner(s) | Proof obligation |
| --- | --- | --- | --- | --- |
| `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001` | erasure request conflicts with legal hold/mandatory retention | CRITICAL | Privacy/Governance + Records/Lifecycle + Data | `XDATA-ADV-PROOF-001` |
| `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-002` | canonical deletion/tombstone diverges from residual replicas/versions | CRITICAL | Storage + Data/Lifecycle + Privacy | `XDATA-ADV-PROOF-002` |
| `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-003` | provider/storage substitution leaves stale authoritative replica | CRITICAL | Provider/Binding + Storage + Data/Lifecycle | `XDATA-ADV-PROOF-003` |
| `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-004` | individually valid lifecycle policies compose into impossible canonical state | HIGH–CRITICAL | Governance/Privacy/Records + Data | `XDATA-ADV-PROOF-004` |

### Processual / semantic conflict patterns discovered in Data visit
| ID | Family | Material pattern | Severity range | Detection candidate | Proof |
| --- | --- | --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-DATA-001` | data/consistency | competing canonical writes are locally valid but jointly violate owner invariants | HIGH–CRITICAL | revision/precondition conflict + invariant re-evaluation | `DATA-CONFLICT-PROOF-001` |
| `G2-CONFLICT-PATTERN-POLICY-001` | policy/compliance | valid privacy/retention/residency obligations produce incompatible dispositions | HIGH–CRITICAL | obligation-set intersection + precedence/authority evidence | `DATA-CONFLICT-PROOF-002` |
| `G2-CONFLICT-PATTERN-REPLICA-001` | provider/data/recovery | canonical lifecycle state conflicts with residual physical realizations | CRITICAL | replica/cohort inventory + delete/restore conformance | `DATA-CONFLICT-PROOF-003` |
| `G2-CONFLICT-PATTERN-MIGRATION-001` | version/migration | old/new cohorts are individually valid but composition-incompatible | CRITICAL | revision-vector/cohort compatibility matrix | `DATA-CONFLICT-PROOF-004` |

### Storage / Documents / Media
Register: `project_docs/generation-2/research/edge-cases/STORAGE_DOCUMENTS_MEDIA_EDGE_CASE_REGISTER.md`

| ID | Material scenario | Severity | Primary owner(s) | Proof obligation |
| --- | --- | --- | --- | --- |
| `G2-EDGE-STORAGE-001` | provider-native object/version identity mistaken for canonical logical object/content revision | HIGH–CRITICAL | Storage + Provider/Binding + domain owner | `STORAGE-ADV-PROOF-001` |
| `G2-EDGE-STORAGE-002` | concurrent content and metadata revisions form a semantically impossible composite | CRITICAL | Storage + metadata owner + Lifecycle | `STORAGE-ADV-PROOF-002` |
| `G2-EDGE-STORAGE-003` | multipart/chunked fragments accepted while canonical completion remains `UNKNOWN/PARTIAL` | HIGH–CRITICAL | Storage + Provider/Binding | `STORAGE-ADV-PROOF-003` |
| `G2-EDGE-STORAGE-004` | integrity evidence is stale, absent or representation-scope mismatched | CRITICAL | Storage + Security + provider realization | `STORAGE-ADV-PROOF-004` |
| `G2-EDGE-STORAGE-005` | oversized content/rendition graph exhausts resources and induces unsafe degradation | HIGH | Storage + Runtime/Operations/Provider + FinOps | `STORAGE-ADV-PROOF-005` |
| `G2-EDGE-STORAGE-006` | recoverable bytes exist but restore is not currently eligible/semantically usable | CRITICAL | Storage + Security/Recovery + Lifecycle + Governance/Secrets | `STORAGE-ADV-PROOF-006` |

### Provider/Binding × external realizations — Storage slice
| ID | Material scenario | Severity | Primary owner(s) | Proof obligation |
| --- | --- | --- | --- | --- |
| `G2-XEDGE-PROVIDER-STORAGE-001` | provider ACK is stronger locally than canonical object qualification actually proved | CRITICAL | Storage + Provider/Binding + qualified evidence | `XSTORAGE-ADV-PROOF-001` |
| `G2-XEDGE-PROVIDER-STORAGE-002` | provider substitution leaves old/new versions, caches or restore sources authoritative | CRITICAL | Provider/Binding + Storage + Lifecycle + Secrets/Security | `XSTORAGE-ADV-PROOF-002` |
| `G2-XEDGE-PROVIDER-STORAGE-003` | same provider feature label hides incompatible storage semantics/limits | HIGH–CRITICAL | Provider/Binding + Storage + Standards | `XSTORAGE-ADV-PROOF-003` |
| `G2-XEDGE-PROVIDER-STORAGE-004` | durable bytes become effectively unreachable after key/access-path rotation | CRITICAL | Storage + Secrets + Security + Provider/Binding + Authorization | `XSTORAGE-ADV-PROOF-004` |

### Processual / semantic conflict patterns discovered/adopted in Storage visit
| ID | Family | Material pattern | Severity range | Detection candidate | Proof |
| --- | --- | --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-PROVIDER-002` | provider/semantic/integrity | provider ACK conflicts with stronger canonical object qualification | HIGH–CRITICAL | support-profile check + bounded post-effect integrity/currentness evidence | `STORAGE-CONFLICT-PROOF-001` |
| `G2-CONFLICT-PATTERN-REPRESENTATION-001` | semantic/version/integrity | logical content, metadata, rendition and provider versions are valid alone but incompatible together | HIGH–CRITICAL | revision-vector/applicability + typed rendition lineage | `STORAGE-CONFLICT-PROOF-002` |
| `G2-CONFLICT-PATTERN-SUPPORT-001` | provider/capability negotiation | nominal feature equivalence conflicts with required semantic support | HIGH–CRITICAL | multidimensional support-vector + provider-differential conformance | `STORAGE-CONFLICT-PROOF-003` |

Storage / Documents / Media and Provider/Binding × external realizations discovered material findings on first visit, so both streaks are `0`. Full Pass 1 progress is 5/28 capabilities and 5/12 mandatory clusters; the full-pass count remains `0`.