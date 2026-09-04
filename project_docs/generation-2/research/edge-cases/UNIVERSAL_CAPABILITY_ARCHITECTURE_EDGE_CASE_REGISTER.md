# Generation 2 — Universal Capability Architecture Edge-Case Register

Status: ACTIVE — Full Pass 1 material findings
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Universal Capability Architecture (UCA)
Authority: `RESEARCH_PIPELINE_STATE.json`, `PLANNING_A_UNIVERSAL_CAPABILITY_ARCHITECTURE_BOUNDARIES.md`, `CAPABILITY_SYNTHESIS.md`, adversarial framework and processual/semantic conflict classification.

This is research, not remediation. Every conflict below remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

## 1. Research question

How can universal architecture primitives become unsafe when identity, claims, revisions, evidence, authority, provider realization and lifecycle semantics are individually valid but composed across owners with incompatible scope, revision, currentness or postconditions — and how can UCA remain reusable without becoming a semantic god-object?

## 2. Evidence ledger

Current external evidence was checked against strong published semantics:

- Kubernetes API / workload status: `metadata.generation` and `status.observedGeneration` are distinct; status reflects the generation actually observed by a controller/kubelet, demonstrating why declared revision and observed/effective revision cannot be collapsed. Official: https://kubernetes.io/docs/concepts/workloads/pods/ and https://kubernetes.io/docs/reference/kubernetes-api/apps/deployment-v1/
- Crossplane managed resources: managed-resource identity is distinct from provider external identity; creation can be ambiguous if the external resource was created but its identity/result was not durably recorded, requiring reconciliation rather than blind recreation. Official: https://docs.crossplane.io/latest/managed-resources/managed-resources/
- RFC 9110 HTTP Semantics §9.2.2: idempotency applies to the intended request effect and enables some retries after communication failure, but does not imply that every surrounding side effect or arbitrary provider operation is globally idempotent. Official: https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2
- OpenTelemetry semantic conventions: registered attributes carry type/stability and context-specific requirement levels; a shared vocabulary does not imply universal applicability or that every defined attribute is valid in every semantic context. Official: https://opentelemetry.io/docs/specs/semconv/registry/attributes/ and https://opentelemetry.io/docs/specs/semconv/general/semantic-convention-groups/

Portable conclusion: shared structural vocabulary is useful only when subject, scope, producer revision, applicability, evidence/currentness and owner semantics remain explicit. A universal envelope must not upgrade weaker evidence or erase domain-specific predicates.

## 3. Local material edge scenarios

### G2-EDGE-UCA-001 — Canonical identity collapsed into realization/provider identity

- **Scenario:** a provider-native ID, runtime handle, external name or storage key is reused as canonical semantic identity because the values happen to match.
- **Preconditions:** one semantic subject has one or more realizations; provider substitution/coexistence or import is possible.
- **Trigger:** mapping code or low-code composition copies realization identity into canonical reference without owner adoption.
- **Affected subjects/revisions:** canonical subject, typed identity binding, provider binding revision, lifecycle/coexistence revision.
- **Expected safe behavior:** preserve `CanonicalSemanticIdentity != RealizationIdentity`; identity equivalence remains typed and owner-qualified; ambiguity is `PARTIAL/INCONCLUSIVE` until authorized adoption/reconciliation.
- **Forbidden behavior:** silently promote provider ID into canonical truth or infer identity equivalence from matching strings.
- **Effect/failure disposition:** `INCONCLUSIVE` mapping; no authoritative mutation from ambiguous identity.
- **Owner(s):** semantic owner + Provider/Binding + Lifecycle; UCA owns only the typed distinction.
- **Evidence/currentness:** current binding/adoption evidence with provider, tenant/resource type and revision context.
- **Recovery/reconciliation:** re-resolve bindings against owner truth; quarantine ambiguous aliases; preserve prior lineage.
- **Blast radius:** record → process → system; potentially external duplicate effects.
- **Severity:** CRITICAL.
- **Misuse likelihood:** plausible accidental; adversarial identity-confusion path possible.
- **Proof obligation:** `UCA-ADV-PROOF-001` — substitution/import cannot change canonical identity absent explicit owner adoption.
- **Saturation:** MATERIAL / streak reset to 0.

### G2-EDGE-UCA-002 — Qualified claim loses applicability/currentness

- **Scenario:** a valid `PASS/READY/ALLOW/HEALTHY` claim is reused after subject population, policy, provider, topology, schema or evidence horizon changes.
- **Preconditions:** claim was correct for an earlier scope/revision vector.
- **Trigger:** consumer reads only result value and ignores applicability, producing revisions, freshness, coverage or uncertainty.
- **Expected safe behavior:** qualification mismatch yields stale/expired/`INCONCLUSIVE`; current use requires owner-defined requalification.
- **Forbidden behavior:** treat historical success as timeless global truth.
- **Effect/failure disposition:** `INCONCLUSIVE` for current qualification while historical replay remains valid against producing revisions.
- **Owner(s):** claim semantic owner + evidence producer + Lifecycle; UCA owns envelope shape/currentness relation only.
- **Evidence/currentness:** subject/scope, producing revision vector, profile, timestamps/horizon, coverage and uncertainty.
- **Recovery/reconciliation:** recompute/re-evaluate under current applicable revisions without overwriting historical result.
- **Blast radius:** workflow/process/system depending on reused claim.
- **Severity:** CRITICAL.
- **Misuse likelihood:** likely accidental under caching/aggregation.
- **Proof obligation:** `UCA-ADV-PROOF-002` — removing any material applicability/currentness dimension cannot silently preserve a stronger claim.
- **Saturation:** MATERIAL / streak 0.

### G2-EDGE-UCA-003 — Revision-vector truncation creates false compatibility

- **Scenario:** a consumer records one convenient version while semantic validity actually depends on several independently evolving revisions.
- **Preconditions:** policy/schema/provider/formula/runtime/trust or evidence revisions can evolve independently.
- **Trigger:** serialization, cache key, API contract or low-code variable drops one or more producing revisions.
- **Expected safe behavior:** insufficient revision provenance makes compatibility/currentness `INCONCLUSIVE`; owner compatibility rules decide admissible skew.
- **Forbidden behavior:** synthesize compatibility from one surviving version or “latest”.
- **Effect/failure disposition:** block or bounded degradation according to owner policy; never false convergence.
- **Owner(s):** Lifecycle + affected semantic owners; UCA owns revision-vector structure only.
- **Evidence/currentness:** complete material revision dimensions and compatibility evidence.
- **Recovery/reconciliation:** rehydrate producing revisions where possible; otherwise require re-evaluation/migration.
- **Blast radius:** long-running workflow, historical calculation, provider cutover or whole system.
- **Severity:** HIGH–CRITICAL.
- **Misuse likelihood:** likely through convenience abstractions.
- **Proof obligation:** `UCA-ADV-PROOF-003` — material dependency-revision loss is detectable and cannot be coerced to compatible.
- **Saturation:** MATERIAL / streak 0.

### G2-EDGE-UCA-004 — Attempted/accepted/effective/converged/validated lineage collapse

- **Scenario:** provider/API acknowledgement is represented as effective domain state, or observed effect as converged/validated outcome.
- **Preconditions:** remote or asynchronous mutation can partially apply, time out, lag or later fail.
- **Trigger:** generic status abstraction compresses the lineage to `success=true`.
- **Expected safe behavior:** preserve stage identity and explicit `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN`; `UNKNOWN` mutating effect requires reconciliation before unsafe retry.
- **Forbidden behavior:** retry solely because transport response was absent, or report business completion from provider ACK.
- **Effect/failure disposition:** `UNKNOWN` until owner-specific reconciliation proves effect; partial convergence remains explicit.
- **Owner(s):** Integration/Workflow/Deployment/Data/etc. for semantics; Provider/Binding for realization; UCA only supplies common lineage/disposition shape.
- **Evidence/currentness:** attempt identity, provider acknowledgement, observed effect, convergence/validation evidence and idempotency scope/horizon.
- **Recovery/reconciliation:** owner-specific read-after-write/reconciliation; retry only when qualified safe.
- **Blast radius:** external duplicate mutation → system/external parties.
- **Severity:** CRITICAL.
- **Misuse likelihood:** likely accidental when APIs normalize status.
- **Proof obligation:** `UCA-ADV-PROOF-004` — no stage is derivable solely from a weaker prior stage.
- **Saturation:** MATERIAL / streak 0.

### G2-EDGE-UCA-005 — Source-of-truth adoption occurs without owner authority

- **Scenario:** observation, derived assessment, imported/provider fact or AI inference is normalized into canonical state because it arrives in a universal envelope.
- **Preconditions:** evidence is structurally valid and may be current, but is not itself authoritative for canonical mutation.
- **Trigger:** reconciliation or low-code mapping treats “qualified evidence” as permission to overwrite owner truth.
- **Expected safe behavior:** evidence can inform a candidate/adoption decision; canonical mutation requires explicit owner authority and applicable policy.
- **Forbidden behavior:** let UCA, AI, AGWS, provider discovery or reconciliation silently adopt truth.
- **Effect/failure disposition:** no mutation; `Signal != ConfirmedConflict`; unresolved disagreement remains explicit.
- **Owner(s):** affected semantic owner + Authorization/Governance; Architecture Reconciliation may detect drift but not usurp ownership.
- **Evidence/currentness:** provenance/currentness plus explicit adoption authority and decision lineage.
- **Recovery/reconciliation:** route disagreement to owner reconciliation/adoption; preserve both observation and canonical lineage.
- **Blast radius:** record → enterprise policy/financial/security truth.
- **Severity:** CRITICAL.
- **Misuse likelihood:** plausible; elevated under AI/automation.
- **Proof obligation:** `UCA-ADV-PROOF-005` — envelope validity never implies canonical write authority.
- **Saturation:** MATERIAL / streak 0.

### G2-EDGE-UCA-006 — Residual-cohort false closure and rollback false eligibility

- **Scenario:** provider/capability cutover is declared complete or rollback declared safe while old sessions/workers/caches/subscriptions/credentials/replicas or incompatible state can still produce authoritative effects.
- **Preconditions:** coexistence, substitution, offline/local operation or historical rollback target.
- **Trigger:** generic lifecycle state records `cutover=done` or `rollbackAvailable=true` without owner-specific drainage/compatibility evidence.
- **Expected safe behavior:** closure/rollback eligibility remains a qualified current claim over named cohorts, retained dependencies and compatible revisions.
- **Forbidden behavior:** infer safe rollback from artifact existence or cutover from control-plane acknowledgement.
- **Effect/failure disposition:** `PARTIAL/INCONCLUSIVE` until residual cohorts and compatibility obligations are reconciled.
- **Owner(s):** Lifecycle + Provider/Binding + affected domain owners; UCA supplies only drainage/eligibility structures.
- **Evidence/currentness:** cohort inventory, authoritative-effect horizon, retained artifact/state/trust/schema/provider evidence.
- **Recovery/reconciliation:** drain/isolate/reconcile residual cohorts; requalify rollback at actuation time.
- **Blast radius:** system/enterprise/external parties.
- **Severity:** CRITICAL.
- **Misuse likelihood:** plausible during migration/recovery.
- **Proof obligation:** `UCA-ADV-PROOF-006` — closure and rollback are false until current owner-specific postconditions are proven.
- **Saturation:** MATERIAL / streak 0.

### G2-EDGE-UCA-007 — Universal primitive becomes semantic god-object or aggregation magnet

- **Scenario:** shared claim/evidence/support/evaluation structures gradually acquire domain predicates, universal scores, policy precedence or orchestration decisions.
- **Preconditions:** multiple teams reuse UCA and seek convenience/common code.
- **Trigger:** a “generic” evaluator decides HEALTHY/SAFE/LOW_RISK/COMPATIBLE or merges heterogeneous evidence without consumer-owned profile semantics.
- **Expected safe behavior:** UCA remains structural; predicates, thresholds, postconditions, aggregation and authority remain with explicit semantic owners/consumer-owned profiles.
- **Forbidden behavior:** one universal scalar/evaluator or common package silently resolving ownership conflicts.
- **Effect/failure disposition:** reject/flag ownership ambiguity at architecture/proof level; no automatic domain decision.
- **Owner(s):** UCA contract governance + affected semantic owners + Architecture Reconciliation for ownership drift detection.
- **Evidence/currentness:** primitive-use dependency graph, decision provenance, owner/profile references and cross-capability semantic review.
- **Recovery/reconciliation:** route semantics back to owner; preserve structural primitive only; migration is future remediation if a concrete instance exists.
- **Blast radius:** platform-wide semantic coupling and systemic false decisions.
- **Severity:** CRITICAL.
- **Misuse likelihood:** likely cumulative/organizational.
- **Proof obligation:** `UCA-ADV-PROOF-007` — the same primitive can be reused by materially different owners without UCA deciding either domain predicate.
- **Saturation:** MATERIAL / streak 0.

## 4. Material processual / semantic conflict patterns

### G2-CONFLICT-PATTERN-QUALIFIED-CLAIM-001 — Scope-compatible individually, contradictory jointly

- **Family:** semantic ownership + rule/condition + data/currentness.
- **Narrative:** Owner A emits a valid claim for population/revision X; Owner B emits a valid claim for Y. A composite consumer strips applicability and treats both as one global claim, producing contradictory actions.
- **Activation conditions:** claims share a subject label or aggregate key but differ in scope/population/profile/revision/currentness.
- **Incompatible claims/actions/states:** two locally valid qualified claims become mutually exclusive after qualification loss.
- **Why local validation misses it:** each producer validates only its own scope.
- **Detection candidates:** qualification-intersection check; subject/scope/profile/revision compatibility; stale evidence detector.
- **Owner(s):** producing semantic owners + consuming decision owner; UCA only defines qualification structure.
- **Severity:** HIGH–CRITICAL; **confidence:** strongly supported; **detectability:** pre-execution/runtime.
- **Blast radius:** process → system; **reversibility:** bounded to migration depending on effects; **time-to-harm:** immediate/delayed.
- **Misuse likelihood:** likely accidental.
- **Evidence currentness:** must be current for each producer and consumer applicability.
- **False-positive risk:** legitimate claims may intentionally differ by population/profile; detector must compare applicability rather than demand equality.
- **Future remediation disposition:** require explicit consumer-owned reconciliation/precedence or preserve separate claims; do not arbitrarily order results.
- **Proof:** `UCA-CONFLICT-PROOF-001` — N-wise claim composition preserves qualification dimensions and detects incompatible intersections.
- **Saturation:** elicited/material.

### G2-CONFLICT-PATTERN-REVISION-VECTOR-001 — Compatible projections over incompatible hidden revisions

- **Family:** version/migration/coexistence + temporal.
- **Activation conditions:** two owners publish artifacts/claims with matching exposed version but different hidden policy/schema/provider/formula/trust revisions.
- **Incompatible claims/actions/states:** each owner says compatible locally; combined execution cannot satisfy both revision constraints.
- **Detection candidates:** material-revision dependency closure; compatibility matrix over full revision vector; stale-base/currentness checks.
- **Owner(s):** Lifecycle + affected semantic owners.
- **Severity:** CRITICAL; **confidence:** strongly supported; **detectability:** static/pre-execution where dependencies declared, runtime otherwise.
- **Blast radius:** workflow instance → system; **reversibility:** migration required in worst case; **time-to-harm:** latent.
- **Misuse likelihood:** plausible/likely.
- **Evidence currentness:** complete producing/current revision evidence.
- **False-positive risk:** not every revision matters to every claim; materiality must be owner-declared/proven.
- **Future remediation disposition:** require requalification/migration/pinning when a concrete incompatibility is signalled; no universal compatibility predicate in UCA.
- **Proof:** `UCA-CONFLICT-PROOF-002`.
- **Saturation:** elicited/material.

### G2-CONFLICT-PATTERN-CONVERGENCE-SEMANTICS-001 — Shared success vocabulary with incompatible effect stages

- **Family:** state-transition + provider/integration + recovery.
- **Activation conditions:** two owners use common success/status structures but bind “success” to different lineage stages (accepted vs applied vs converged vs validated).
- **Incompatible claims/actions/states:** upstream success triggers downstream irreversible action while required effective/converged state is absent or `UNKNOWN`.
- **Detection candidates:** typed lineage-stage compatibility; effect-disposition requirement; post-effect reconciliation evidence.
- **Owner(s):** each domain owner + Provider/Binding/Integration as applicable.
- **Severity:** CRITICAL; **confidence:** strongly supported; **detectability:** design-time if contracts typed, runtime/post-effect otherwise.
- **Blast radius:** external parties/system; **reversibility:** potentially irreversible; **time-to-harm:** immediate.
- **Misuse likelihood:** likely accidental.
- **Evidence currentness:** operation attempt + provider/observed/convergence evidence within operation-specific horizon.
- **False-positive risk:** synchronous operations may legitimately collapse some stages only when their qualified contract proves equivalence.
- **Future remediation disposition:** require typed stage semantics/reconciliation for the concrete path; avoid blanket retry or generic success mapping.
- **Proof:** `UCA-CONFLICT-PROOF-003`.
- **Saturation:** elicited/material.

### G2-CONFLICT-PATTERN-UCA-OWNERSHIP-001 — Universal contract usurps semantic owner

- **Family:** semantic ownership + authority + AI/low-code + objective/optimization.
- **Activation conditions:** a common primitive/evaluator/reconciler receives evidence from multiple owners and is given convenience logic to choose canonical truth, precedence, risk score or action.
- **Incompatible claims/actions/states:** locally valid owner claims are flattened into one platform decision lacking an authorized owner/policy.
- **Detection candidates:** architecture dependency/decision provenance analysis; owner reference required for domain predicates; universal-scalar/evaluator detection; authority-envelope check.
- **Owner(s):** UCA contract governance + affected semantic owners + Authorization/Governance.
- **Severity:** CRITICAL; **confidence:** supported/strongly supported; **detectability:** static/design-time plus audit.
- **Blast radius:** enterprise-wide; **reversibility:** migration required; **time-to-harm:** cumulative/latent.
- **Misuse likelihood:** likely organizational; AI can amplify composition pressure.
- **Evidence currentness:** current owner taxonomy/boundaries and decision provenance.
- **False-positive risk:** shared structural validation is legitimate; detector must distinguish structural invariants from domain predicates.
- **Future remediation disposition:** route concrete semantic decisions back to explicit owners; retain UCA structural contract only; no hypothetical code change authorized here.
- **Proof:** `UCA-CONFLICT-PROOF-004`.
- **Saturation:** elicited/material.

## 5. Cross-capability deep-dive decision

No new mandatory cluster is added in this visit. The findings are intentionally cross-owner but are best represented as reusable UCA-local composition patterns rather than a quota-style new cluster. The existing 12 mandatory clusters already exercise the principal concrete realizations of identity/authority, provider effects, lifecycle, evidence, recovery, economics and runtime truth.

Future passes should link these UCA patterns when revisiting any cluster that exhibits qualification stripping, revision truncation, status-stage collapse or owner usurpation.

## 6. Architecture consequence candidates — research only

1. Preserve typed identity binding and never canonize provider IDs by convenience.
2. Preserve full material qualification: subject/scope/profile/revision/currentness/coverage/uncertainty.
3. Treat revision vectors as dependency-sensitive rather than a universal global version.
4. Preserve attempted/accepted/applied/converged/validated lineage and `UNKNOWN → reconcile-before-retry`.
5. Keep source-of-truth adoption an explicit owner-authorized transition.
6. Keep residual-cohort closure and rollback eligibility current, owner-qualified claims.
7. Keep UCA structural and reject semantic god-object/evaluator drift.
8. Preserve `Enterprise → Station → Role → Person` and non-amplifying authority; AI/AGWS/UCA/provider mechanisms cannot create new authority.

These are detection/proof candidates for later architecture work, not implementation directives.

## 7. Saturation disposition

- Full Pass: 1
- Capability visit: first adversarial local visit
- Local material findings: 7
- New reusable conflict patterns: 4
- New mandatory cross-capability cluster: none
- Local no-material streak: 0 (reset by findings)
- HIGH/CRITICAL without owner/proof: 0
- Capability saturation: NOT SATURATED
- Planning C: remains BLOCKED
