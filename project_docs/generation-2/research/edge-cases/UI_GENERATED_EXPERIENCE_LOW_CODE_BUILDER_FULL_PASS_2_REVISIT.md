# Generation 2 — UI / Generated Experience / Low-code Builder — Full Pass 2 Revisit

Status: ACTIVE — MATERIAL FINDINGS
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: UI / Generated Experience / Low-code Builder
Pass: 2
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `UI_GENERATED_EXPERIENCE_LOW_CODE_BUILDER_EDGE_CASE_REGISTER.md`, adversarial framework and processual/semantic conflict classification.

Research only. No product code, Work Package, TASK, Construction, implementation guard or concrete remediation is authorized by this artifact. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Findings remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Revisit method

This revisit used techniques intentionally different from Full Pass 1:

1. **multi-step consistent-cut falsification** — validate a wizard/form step-by-step while semantic owners change between steps, then test whether the assembled submission has ever existed under one jointly qualified cut;
2. **offline intent resurrection analysis** — queue local drafts/autosaves/actions, permit newer canonical intent to become effective elsewhere, then reconnect the stale client and replay its locally valid queue;
3. **semantic omission mutation** — remove/hide/disable required qualifiers, warnings, confirmations, instructions or fields while preserving local renderer/schema validity and test whether the resulting action becomes stronger than what the human actually saw/approved;
4. **provider/accessibility differential review** — compare visual, keyboard/accessibility and fallback component paths for equivalent intent and required information;
5. **duplicate-screen** against the 115 reusable `G2-CONFLICT-PATTERN-*` inventory before creating any new pattern.

No new mandatory cluster is introduced. All 12 mandatory clusters have already been challenged once in Full Pass 2; this local revisit only deepens already-owned families.

## 2. Evidence refresh

Portable evidence supports the mechanisms challenged here:

- WAI-ARIA guidance distinguishes presentation semantics from interactive semantics and documents that presentational/hidden treatment can remove semantics from accessibility APIs while visible text or focus behavior may differ. This supports the requirement that accessibility/rendering adaptation cannot silently remove material action meaning: https://www.w3.org/WAI/ARIA/apg/practices/hiding-semantics/
- WAI guidance on accessible names warns that author-supplied naming can hide descendant content from assistive-technology users and that localization must preserve the accessible label. This supports semantic-equivalence checks across generated/localized variants: https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/
- WAI keyboard-interface guidance distinguishes native disabled behavior from `aria-disabled`, including different discoverability/focus behavior. This is evidence that UI state mechanisms are presentation/interaction contracts, not authorization or canonical domain-state proof: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/

These sources do not define System Builder architecture. They demonstrate that individually conformant rendering mechanisms can expose different semantics/interaction affordances, so canonical meaning and authority must remain owner-qualified outside presentation state.

## 3. New local material edge scenarios

### G2-EDGE-UI-008 — Multi-step surface produces no single jointly qualified semantic cut

- **Scenario:** a generated wizard or long-lived form validates step A against schema/policy/formula revisions valid at time T1, step B against newer revisions at T2, and final confirmation against another current authority state at T3. Every step was locally valid when visited, but the assembled submission combines values/claims that were never jointly compatible.
- **Activation conditions:** multi-step or long-lived interaction; independently evolving semantic owners; cached per-step validation/derived values; final submit does not requalify the material aggregate revision vector.
- **Incompatible claims/actions/states:** each step says its captured intent/value is valid; the aggregate action assumes all captured pieces are simultaneously valid under one process/schema/policy/formula/authority cut.
- **Why local validation may miss it:** each component validates only its local snapshot and the final UI may check field completeness without testing N-wise semantic compatibility.
- **Expected safe behavior / diagnostic expectation:** distinguish `all steps were individually valid` from `assembled intent is jointly qualified now`; if a compatible cut cannot be proven, surface a stale/incompatible aggregate and require owner-qualified rebase/reconfirmation before canonical mutation.
- **Forbidden behavior:** infer aggregate validity from green per-step checks, recent timestamps or current validity of each owner independently; silently recompute old derived answers under new rules and retain the old human confirmation.
- **Effect/failure disposition:** pre-effect `INCONCLUSIVE/STALE_BASE`; if a mutation may already have started, preserve `PARTIAL/UNKNOWN` and reconcile rather than replaying the whole wizard blindly.
- **Detection candidates:** pre-execution material revision-vector/qualification-join check; dependency-closure check over captured steps; final-confirmation lineage comparison; runtime stale-base signal.
- **Owner(s):** UI for captured-intent lineage and faithful projection; Process/Data/Formula/Authorization owners for semantics; Lifecycle/Reconciliation for compatibility/coexistence.
- **Severity:** HIGH–CRITICAL.
- **Confidence:** strongly supported by existing revision-vector/qualification-join research.
- **Detectability:** pre-execution when dependencies are explicit; runtime/post-effect when a provider mutation began before incompatibility surfaced.
- **Blast radius:** record → workflow/process → financial/external effect.
- **Reversibility:** easy before mutation; migration/compensation or potentially irreversible after external effect.
- **Time-to-harm:** immediate at final submission or latent in later downstream processing.
- **Misuse likelihood:** likely accidental; AI-generated multistep experiences increase composition likelihood.
- **Evidence currentness:** per-step producing revisions, typed values/derived-value provenance, final authority/policy state, aggregate dependency vector and human-confirmation revision.
- **False-positive risk:** revisions can be intentionally backward-compatible; detector must test owner-declared compatibility rather than require one global transaction.
- **Recovery/reconciliation / future remediation route:** governed rebase/revalidation/reconfirmation under current compatible semantics; do not silently reinterpret prior human intent.
- **Proof obligation:** `UI-ADV-PROOF-008` — individually valid step snapshots cannot produce a canonical aggregate unless a material jointly compatible cut or explicit compatibility rule is proven.
- **Duplicate-screen:** maps to existing revision-vector, qualification-join, currentness, qualified-claim, workflow-decision-lineage and human-instruction families. No new reusable ConflictPattern.
- **Saturation:** MATERIAL; UI local streak remains/reset **0**.

### G2-EDGE-UI-009 — Offline autosave/replay resurrects superseded user intent

- **Scenario:** an offline/intermittent client queues autosaves or an action from a previously valid experience. Another client/process later commits a newer authoritative intent, cancellation, correction or policy decision. On reconnection, the old client replays its locally valid queue and can overwrite, reopen or re-trigger the superseded intent.
- **Activation conditions:** offline queue/background sync/local draft; stale base; replay after a newer canonical effect; operation scope that is not proven commutative/idempotent against the newer state.
- **Incompatible claims/actions/states:** offline client claims “this intent was valid and pending”; current owner state claims the intent has been superseded/cancelled/changed.
- **Why local validation may miss it:** queued work was valid when created and reconnect logic may treat delivery success as sufficient without rechecking current semantic applicability.
- **Expected safe behavior / diagnostic expectation:** preserve offline attempt identity, base revision and intended effect separately; requalify applicability/currentness before actuation; classify stale/superseded intent rather than replaying it as current.
- **Forbidden behavior:** connection restoration ⇒ permission to replay; autosave timestamp/latest-writer ⇒ semantic precedence; provider/client retry support ⇒ canonical retry safety.
- **Effect/failure disposition:** `NOT_APPLICABLE/INCONCLUSIVE` before effect where stale state is provable; `UNKNOWN` when reconnection may already have actuated externally; reconcile before retry.
- **Detection candidates:** reconnect-time base/head comparison; operation-id/effect-id lineage; supersession/cancellation relation; current authority/policy check; residual-client cohort telemetry.
- **Owner(s):** UI for offline queue/draft lineage; affected Process/Data/Workflow owner for semantic effect; Integration/Provider when external actuation exists; Lifecycle for residual client cohorts.
- **Severity:** CRITICAL for destructive/financial/authority-sensitive operations; HIGH otherwise.
- **Confidence:** strongly supported by existing stale-base/residual-cohort/replay research.
- **Detectability:** pre-execution on reconnect where current state is reachable; runtime/post-effect when external mutation races reconciliation.
- **Blast radius:** record → workflow/process → external party.
- **Reversibility:** bounded for drafts; compensation/migration or potentially irreversible for external effects.
- **Time-to-harm:** immediate on reconnect/replay.
- **Misuse likelihood:** plausible/likely accidental; adversarial replay becomes possible if stale clients are intentionally retained.
- **Evidence currentness:** queued operation identity, creation/base revision, current supersession state, authority revision, provider/idempotency horizon and client-cohort identity.
- **False-positive risk:** some queued operations are explicitly commutative or designed for offline merge; detector must use operation-specific merge/idempotency semantics.
- **Recovery/reconciliation / future remediation route:** reconcile stale intent with the semantic owner; explicit merge/reapply under current authority when legitimate; never silent resurrection.
- **Proof obligation:** `UI-ADV-PROOF-009` — reconnect/offline replay cannot restore or reapply superseded canonical intent without current applicability and effect-safety qualification.
- **Duplicate-screen:** maps to stale-base, idempotency/effective-identity, residual-cohort, currentness, correction/supersession, replay-eligibility and actuation-convergence families. No new reusable ConflictPattern.
- **Saturation:** MATERIAL; UI local streak remains/reset **0**.

### G2-EDGE-UI-010 — Generated/adaptive surface omits a material qualifier while remaining locally renderable

- **Scenario:** personalization, responsive adaptation, accessibility transformation, fallback component selection or AI/low-code generation removes/hides/disables a material qualifier, warning, confirmation, instruction or input. The remaining surface is syntactically valid and can submit, but the human is no longer presented with all semantics required to authorize or understand the resulting effect.
- **Activation conditions:** generated/adaptive component path; optional-looking field or content whose semantic owner treats it as conditionally material; renderer/provider profile that lacks or suppresses the qualifier; default/null behavior permits submission.
- **Incompatible claims/actions/states:** UI claims a complete actionable surface; semantic owner requires information/acknowledgement/context not actually presented or captured for this activation condition.
- **Why local validation may miss it:** component/schema validity can pass because the omitted item is technically optional/hidden, while materiality is conditional on process/policy/data/authority context outside the renderer.
- **Expected safe behavior / diagnostic expectation:** material qualifier applicability must survive projection/adaptation; an unsupported presentation path becomes `UNSUPPORTED/INCONCLUSIVE` for that action rather than silently weakening the decision; equivalent accessibility/localized/fallback paths must preserve required meaning and intent.
- **Forbidden behavior:** hidden/disabled/not-rendered ⇒ semantically irrelevant; default/null ⇒ human adoption; renderer fallback ⇒ permission to drop mandatory context; AI summarization ⇒ authority to omit owner-required qualification.
- **Effect/failure disposition:** reject/disable canonical actuation for that path when material semantics cannot be faithfully represented; if effect occurred, preserve exact rendered/interaction evidence and route to assessment rather than asserting informed/qualified adoption.
- **Detection candidates:** design-time projection coverage against conditional semantic obligations; accessibility/localization/provider differential tests; pre-execution required-qualifier proof; audit of rendered qualification versus recorded action.
- **Owner(s):** UI for faithful projection and interaction evidence; Process/Policy/Data/Formula/Authorization owner for qualifier materiality; Provider/Binding for renderer support qualification.
- **Severity:** CRITICAL when omission weakens authority/compliance/safety or financial consent; HIGH otherwise.
- **Confidence:** strongly supported.
- **Detectability:** static/design-time when materiality is declared; pre-execution/runtime when conditions are data-dependent; post-effect audit for opaque generated variants.
- **Blast radius:** task → process/system/external parties.
- **Reversibility:** easy before actuation; potentially irreversible after consequential external action.
- **Time-to-harm:** immediate or latent until omitted qualifier becomes decisive.
- **Misuse likelihood:** likely accidental in adaptive/generated UI; plausible adversarial downgrade path.
- **Evidence currentness:** exact experience/component/provider profile revision, applicability condition, rendered accessibility/localized variant, human interaction evidence and current owner rule/policy revision.
- **False-positive risk:** many fields/instructions are legitimately optional or alternate representations; detector must rely on owner-qualified conditional materiality, not UI presence alone.
- **Recovery/reconciliation / future remediation route:** route to qualified experience regeneration/reconfirmation or explicit owner disposition when a concrete signal exists.
- **Proof obligation:** `UI-ADV-PROOF-010` — projection/adaptation cannot erase a currently material qualifier and still preserve the same authorization/decision/effect strength.
- **Duplicate-screen:** maps to `G2-CONFLICT-PATTERN-PROJECTION-SEMANTICS-001`, `PRESENTATION-AUTHORITY-001`, `HUMAN-INSTRUCTION-001`, qualified-claim/currentness, standards/provider downgrade and AI/low-code non-amplification families. No new reusable ConflictPattern.
- **Saturation:** MATERIAL; UI local streak remains/reset **0**.

## 4. Conflict catalogue / duplicate-screen disposition

No new `G2-CONFLICT-PATTERN-*` is added. The three scenarios are material UI-specific manifestations/refinements of already catalogued reusable families:

- revision-vector/currentness/qualification-join and decision-lineage;
- stale-base, replay eligibility, idempotency/effective identity and correction/supersession;
- projection semantics, human instruction, presentation authority and qualified-claim downgrade;
- residual cohorts/provider substitution and AI/low-code authority non-amplification.

Accordingly the reusable ConflictPattern inventory remains **115**. This is deliberate deduplication, not absence of material findings.

## 5. Cross-capability disposition

No new cross-capability scenario or mandatory cluster is required. `G2-EDGE-UI-008..010` deepen interactions already represented by:

- `Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps`;
- `Identity × Authorization × Station × AGWS × AI`;
- `Process/Application × Workflow × Data/Schema`;
- `Workflow × Integration × Messaging × external mutation`;
- `Provider/Binding × external realizations`.

Because this revisit was not the designated second eligible no-material revisit for those cluster rotations and produced local material findings, mandatory-cluster streak counters remain unchanged rather than being artificially incremented/reset by incidental linkage.

## 6. Saturation disposition

- new local material edge scenarios: **3** (`G2-EDGE-UI-008..010`);
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- UI eligible no-material streak: **0**;
- mandatory-cluster streaks: unchanged;
- HIGH/CRITICAL findings without owner/proof/detection route: **0**;
- Planning C: remains **BLOCKED**.

## 7. Research-only architecture consequence candidates

These are handoff candidates, not remediation or implementation decisions:

1. long-lived/multi-step experiences may need aggregate qualification lineage rather than per-control/per-step validity alone;
2. offline/client-side queues may need to preserve semantic intent/base/effect identity sufficiently for currentness and supersession assessment before replay;
3. generated/adaptive experiences may need a proofable `material semantic obligation preserved` property across visual, accessibility, localization and provider/fallback realizations;
4. UI remains a projection/intent-capture owner and must not become the semantic owner that decides policy, process truth, StoredFact materialization or effect success.

## 8. Next rotation candidate

Continue Full Pass 2 with **Integration & Automation** using techniques materially different from Full Pass 1 and duplicate-screen against the 115 reusable ConflictPatterns. Challenge compound automation graphs in which individually safe triggers/actions create aggregate duplicate or cyclic effects; cross-provider retries whose idempotency/effect identities do not survive substitution; admission-versus-actuation currentness gaps; concurrent enable/disable/update with delayed callbacks and residual registrations; callback authenticity plus semantic staleness; partial batch effects and compensation ownership; manual redrive/replay after downstream adoption; offline connector queues; provider quota/backpressure causing reordering/starvation; and AI/low-code automation composition that widens authority, fan-out or external mutation scope. Do not enter Planning C.