# Generation 2 — Planning E E1: Semantic / Authority / Revision / Elicitation Proofs

Status: **DECIDED / PASS FOR E1**  
Phase: `PLANNING_E_PRODUCT_PROOF_ACCEPTANCE`  
Decision: `E1`  
Entry branch head revalidated before persistence: `1a8c7a68172f1256021ef667093a0eb8eaa5f260`  
Scope: proof architecture only. No product code, executable tests, Architecture Reconciliation execution, WBS, Work Packages, executive TASKs, Construction or remediation.

## 1. Authority

This record executes only the `next_action` authorized by `RESEARCH_PIPELINE_STATE.json`: Planning E E1. E0 remains the proof constitution. C0/C1 are semantic and elicitation architecture authority; D1/D2 are coexistence/migration authority. Research remains `CLOSED / SATURATED / PASS` after eight full passes over 28/28 capabilities and 12/12 mandatory clusters, with 284 material edge scenarios + 124 reusable `ConflictPattern`s = 408 inherited material findings.

Constitutional distinctions remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `claim != evidence != proof decision`;
- `provenance != truth != currentness != authority`;
- `CanonicalSemanticIdentity != RealizationIdentity`;
- `authentication != authorization`;
- `AI inference = InferredCandidate`, never authority;
- `answered != understood != evidence sufficient != contradiction cleared != implementation-ready != production-ready`;
- `Fleet aggregate != Station/local truth`.

## 2. E1 decision

E1 adopts a typed proof matrix for semantic identity/revision, elicitation sufficiency and authority/trust non-amplification. Every material proof below is revision-, population-, scope- and currentness-qualified under E0 and may resolve only to `PASS | PARTIAL | INCONCLUSIVE | BLOCKED | FAIL | NOT_APPLICABLE | DEFERRED`.

A PASS for one revision, tenant, provider, Station, cohort or evidence horizon does not imply another. Historic proof remains historical evidence; relevant revision/currentness/population changes reopen current acceptance.

## 3. Matrix A — Typed semantic identity, graph and revision

| ID | Claim to prove | Required positive evidence | Mandatory negative/adversarial evidence | Reopen / fail condition |
|---|---|---|---|---|
| E1-SEM-01 | Canonical semantic identity survives provider/runtime substitution | owner-qualified canonical identity and explicit typed realization binding across old/new realizations | equal labels, provider IDs, emails, names or keys cannot merge identities without owner adoption | binding/owner/scope revision, ambiguous reuse, delete/recreate |
| E1-SEM-02 | Definition, revision, occurrence and realization identities remain distinct | immutable revision refs and occurrence lineage | successful parsing/hash/provider equality cannot collapse kinds | identity-kind ambiguity or rewritten history |
| E1-SEM-03 | Cross-capability relations preserve semantic owner and direction | typed relation + owner + source/target refs | embedding foreign fields cannot redefine foreign predicate/lifecycle | owner or relation revision changes |
| E1-SEM-04 | Producing `RevisionVector` remains immutable for historical interpretation | historical evidence/replay resolves using producing vector | current revision cannot silently reinterpret old execution/evidence | missing producing dimension or incompatible supersession |
| E1-SEM-05 | Compatibility is directional and owner-qualified | explicit reader/writer or producer/consumer compatibility evidence | equal version labels/syntax success are insufficient | owner changes compatibility rule |
| E1-SEM-06 | Correction/supersession preserves prior history | lineage from old record/revision to correction/supersession | overwrite/latest-wins path is rejected | orphaned or destructive replacement |
| E1-SEM-07 | Provenance cannot strengthen truth, authority or causality | provenance record interpreted as lineage only | signed/generated/repeated/correlated evidence cannot imply authorized/correct/causal | consumer promotes provenance beyond declared relation |
| E1-SEM-08 | `UNKNOWN`, `PARTIAL` and `INCONCLUSIVE` survive graph/serialization/derivation round trips | round-trip semantic-state preservation | empty/null/false/zero/default cannot substitute for unknown | lossy transformation |

## 4. Matrix B — Elicitation Knowledge Base, adaptive routing and no-false-complete

| ID | Claim to prove | Required positive evidence | Mandatory negative/adversarial evidence | Acceptance blocker |
|---|---|---|---|---|
| E1-ELI-01 | `QuestionDefinition` and `QuestionOccurrence` retain independent identities/revisions | occurrence points to producing question revision and concrete context | current wording cannot be retroactively claimed as historical wording | missing producing revision where material |
| E1-ELI-02 | Information kinds remain epistemically distinct | `Fact/Claim/Assumption/InferredCandidate/Decision/Requirement/Constraint/OpenQuestion/Conflict/Unknown/OutOfScope/Deferred` persist distinctly | AI/stakeholder repetition cannot auto-promote kind | unauthorized promotion |
| E1-ELI-03 | Promotion between kinds is governed and provenance-bearing | owner/authority, evidence and transition lineage | `InferredCandidate -> Requirement` or `Assumption -> Fact` without explicit qualification fails | missing decision authority/evidence |
| E1-ELI-04 | Contradictions remain explicit until owner disposition | both competing records + contradiction record + owner/route | summarization/recency/confidence cannot silently choose winner | hidden or unowned HIGH/CRITICAL contradiction |
| E1-ELI-05 | Adaptive routing triggers follow-up on ambiguity/critical gaps | deterministic mandatory/applicability/follow-up rules plus qualified AI candidates | ambiguous answer cannot terminate wizard; loops/duplicate routing detected | critical route unreachable or owner incorrect |
| E1-ELI-06 | Cross-capability questions route without cloning owner truth | discovery context links to target semantic owner | capability A cannot become owner of B predicate by asking the question | duplicate owner truth |
| E1-ELI-07 | Stakeholder coverage is source-class aware | required owner/operator/support/security/privacy/finance/customer/provider/audit perspectives where applicable | high answer count from one class cannot substitute for missing critical owner/source | applicable critical source class untouched without disposition |
| E1-ELI-08 | Negative-space evidence is discoverable and non-canonical until adopted | shadow spreadsheets, scripts, verbal approvals, off-channel paths, workarounds and manual procedures retain provenance | observed workaround cannot become approved process automatically | hidden high-impact path or unsupported adoption |
| E1-ELI-09 | Coverage is multidimensional, never scalar authority | per object/capability/revision dimensions remain inspectable | `95% complete` cannot override one HIGH/CRITICAL `CONFLICTED/BLOCKED/PARTIAL` dimension | aggregate hides critical unresolved dimension |
| E1-ELI-10 | `NOT_APPLICABLE`, `DEFERRED`, `OUT_OF_SCOPE` remain distinct | rationale, owner, applicability scope and revisit trigger where applicable | N/A cannot hide gap; Deferred cannot equal Resolved | unjustified critical N/A or Deferred treated closed |
| E1-ELI-11 | Stage sufficiency gates are distinct | evidence for abstraction, architecture, implementation and publish/operation evaluated separately | earlier-stage sufficiency cannot imply later-stage sufficiency | missing stage-critical dimensions |
| E1-ELI-12 | Derived artifacts remain traceable and contradiction-aware | story/use case/scenario/requirement/acceptance links to evidence, owner, revision and unresolved state | happy-path story/use-case cannot erase failure/authority/privacy/operability constraints | unsupported synthetic artifact or broken lineage |
| E1-ELI-13 | Wizard/AI cannot mark complete with HIGH/CRITICAL unresolved gaps | close decision enumerates critical dimensions and dispositions | fluent conversation, confidence or absence of more AI questions cannot satisfy gate | unresolved critical gap/contradiction/evidence-currentness failure |
| E1-ELI-14 | Brownfield assimilation remains evidence-first | discover -> identify -> extract -> map -> fidelity -> propose -> owner adopt lineage | observed schema/form/log/process cannot become canonical by import success | unknown/lossy mapping promoted to truth |

## 5. Matrix C — Identity, authentication, federation and authority

| ID | Claim to prove | Required positive evidence | Mandatory negative/adversarial evidence |
|---|---|---|---|
| E1-AUTH-01 | External identity remains distinct from canonical subject identity | owner-qualified mapping revision, scope and assurance context | equal email/username/provider subject cannot auto-link or reuse deleted identity |
| E1-AUTH-02 | Authentication never manufactures authorization | authenticated session evidence remains input to explicit policy evaluation | authenticated=true, valid token or IdP group cannot independently grant canonical permission |
| E1-AUTH-03 | Federation/link/unlink/recovery/deprovision are revision/currentness-aware | mapping lifecycle, unlink/recovery evidence, stale-session handling | old token/session cannot retain authority after authoritative revoke beyond declared horizon |
| E1-AUTH-04 | Organization/multitenancy scope is semantic, not a label | tenant/site/Station/resource scopes are owner-qualified | global provider IDs/groups cannot imply cross-tenant/cross-site role equivalence |
| E1-AUTH-05 | Delegation and break-glass are bounded and non-amplifying | issuer basis, scope, expiry/revoke, SoD and post-event evidence | delegation beyond delegator, silent expiry extension or ungoverned emergency path fails |
| E1-AUTH-06 | Separation of duties survives coexistence/residual authority | evaluate union of current and residual grants/sessions/groups | target-safe policy cannot PASS while legacy path violates SoD |

## 6. Matrix D — Trust/PKI, secrets/config and security/resilience

| ID | Claim to prove | Required positive evidence | Mandatory negative/adversarial evidence |
|---|---|---|---|
| E1-TRUST-01 | Cryptographic validity is distinct from enterprise trust/authorization | trust-domain/anchor/bundle/policy revision and verifier scope | valid certificate/signature cannot alone prove trust or permission |
| E1-TRUST-02 | Rotation is population convergence | new generation admitted, consumer adoption, old generation fence/revoke, residual drain and reconciliation | provider reports new version cannot imply complete rotation |
| E1-TRUST-03 | Revocation/deprovision is end-to-end propagation | canonical state + provider state + sessions/tokens/credentials/caches/offline population evidence | request/ACK cannot imply enforced/drained |
| E1-SEC-01 | Secret reference, material generation, desired config and effective consumer state remain distinct | stable reference + generation + distribution/effective revision evidence | desired config or provider write ACK cannot imply effective runtime state |
| E1-SEC-02 | `ABSENT != NULL != DEFAULT != DELETE` where domain distinguishes them | round-trip provider mapping evidence | empty string/omission/tombstone/inherited default cannot be silently conflated |
| E1-SEC-03 | Degraded/recovery modes cannot amplify authority | explicit fail-closed or bounded degraded policy, fencing and recovery evidence | outage/offline cannot mint broader/stale authority |
| E1-SEC-04 | Restore success does not prove authority/trust currentness | recovery-cut revision + post-restore reconciliation of revoke/rotation/config/trust events | backup-restored credentials/grants cannot outrank post-backup revocations |

## 7. Matrix E — Revision/currentness/population/locality properties

These properties apply across every E1 proof family:

1. **revision property** — PASS is pinned to the applicable sparse revision vector; relevant revision change reopens current acceptance;
2. **population property** — sampled/cohort proof cannot silently expand beyond its declared population;
3. **currentness property** — stale evidence becomes `INCONCLUSIVE/BLOCKED/PARTIAL` according to the claim, not silently PASS;
4. **locality property** — tenant/site/Station proof cannot be generalized to another scope;
5. **Fleet property** — aggregate Fleet evidence cannot hide critical member `FAIL/UNKNOWN/BLOCKED`;
6. **offline property** — disconnected local authority/evidence is bounded by explicit local closure/currentness and reconciled on reconnect;
7. **coexistence property** — old/new writers, sessions, grants, trust bundles, secret generations and policy caches are explicit residual cohorts;
8. **non-strengthening property** — graph transforms, summaries, AI, providers, cryptography and reconciliation may not create stronger semantic/authority claims than their qualified evidence allows.

## 8. Separate Production Readiness proof matrix

Feature/semantic proof does not establish production readiness. E1 carries the following independent dimensions for the capabilities in scope:

| Dimension | E1 proof obligation |
|---|---|
| `OBSERVABILITY` | expose semantic-owner decision/evidence/currentness and critical unresolved/contradiction states without scalar masking |
| `OWNERSHIP` | each critical identity/policy/trust/secret/elicitation claim has accountable semantic owner and decision authority |
| `FAILURE_HANDLING` | ambiguous identity, stale policy, routing failure, evidence outage and provider failure preserve `UNKNOWN/PARTIAL/BLOCKED` rather than unsafe defaults |
| `RECOVERY` | restore/reconnect/reconciliation does not resurrect stale authority or erase contradictions/history |
| `CAPACITY` | identity sync, owner review, contradiction resolution, revoke/rotation and evidence requalification queues expose depth, oldest age, capacity and finite-drain condition |
| `CURRENTNESS` | declared horizons exist for evidence, sessions/tokens, policy, trust bundles, config and local/offline snapshots |
| `SECURITY` | non-amplification, tenant isolation, SoD, trust and secret boundaries remain effective under normal/degraded paths |
| `RECONCILIATION` | residual cohorts and local/Fleet divergence have explicit terminal dispositions and evidence |
| `CHANGE_SAFETY` | relevant revision/provider/topology/trust/question changes reopen only affected claims and preserve history |
| `COST` | proof/evidence collection may expose bounded cost but cost pressure cannot suppress mandatory safety/authority/currentness proof |
| `DOCUMENTATION` | owner, rationale, evidence classes, limitations, reopen conditions and operator routes remain inspectable |

No readiness percentage may override a critical failed/unresolved dimension.

## 9. Inherited adversarial findings and duplicate-screen disposition

E1 introduces **no new material research finding**. The mandatory elicitation adversarials and authority/trust cases exercised here duplicate-screen into the existing inherited conflict-pattern inventory and are translated into proof obligations, not new research IDs. Therefore:

- new material findings: `0`;
- new `ConflictPattern`: `0`;
- `ConflictInstance`: `0`;
- remediation: `0`;
- saturation streak reset: `none`.

The inherited 408 material findings remain proof-route inputs. A future concrete observed violation may become a `Signal` and, after classification/evidence, potentially a `ConfirmedConflict`; E1 does not make that promotion.

## 10. E1 acceptance decision

**E1 = DECIDED / PASS FOR E1.**

Pass rationale:

- typed semantic identity/revision and owner-preserving graph claims have explicit positive/negative/adversarial proof routes;
- Elicitation/System Understanding has explicit no-false-complete, contradiction, provenance/currentness, adaptive-routing, stakeholder, negative-space, cross-artifact and stage-sufficiency proofs;
- Identity/AuthN/Federation, Authorization/Policy/Organization/Multitenancy, Trust/PKI, Secrets/Configuration and Security/Resilience have explicit authority non-amplification and residual/currentness proof routes;
- local/Station/Fleet, Brownfield, AI candidate semantics and separate Production Readiness Coverage remain preserved;
- no executable test, remediation or product work was performed.

## 11. Planning E carry-forward

E2+ must consume E0/E1 rather than weaken them. In particular, later proof matrices must preserve typed semantic owner/revision, `UNKNOWN/PARTIAL/INCONCLUSIVE`, currentness/population qualification, no-scalar-masking, residual-cohort closure and non-strengthening.

The sole next Planning E action is **E2 — Data / Workflow / External-Effect / Messaging proofs**. E2 should translate applicable C3/D3 obligations into proof matrices for schema/data migration, durable workflow execution, effect identity, `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN`, reconcile-before-retry, idempotency scope/horizon, replay/ordering, messaging/events/notifications, batch partiality, in-flight producing revisions, offline/Fleet effects, queue drainability, Brownfield evidence and separate Production Readiness Coverage.

Do not execute E3+, Architecture Reconciliation, WBS, Work Packages, executive TASKs, Construction, product code or executable tests in the same action.
