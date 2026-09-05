# Generation 2 — UI / Generated Experience / Low-code Builder — Full Pass 3 Revisit

Status: ACTIVE — MATERIAL FINDING
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: UI / Generated Experience / Low-code Builder
Pass: 3
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `UI_GENERATED_EXPERIENCE_LOW_CODE_BUILDER_EDGE_CASE_REGISTER.md`, `UI_GENERATED_EXPERIENCE_LOW_CODE_BUILDER_FULL_PASS_2_REVISIT.md`, adversarial framework and processual/semantic conflict classification.

Research only. No product code, Work Package, TASK, Construction, implementation guard or concrete remediation is authorized by this artifact. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Findings remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Revisit method

This revisit deliberately used techniques materially different from Full Passes 1 and 2:

1. **rendered-versus-submitted semantic differential** — compare the exact value/qualifier shown to the human with the semantic payload actually emitted by each control/provider path;
2. **presence-state mutation through interaction state** — permute editable, read-only, disabled, hidden, omitted, defaulted, explicit-null and explicit-value states and test whether submission preserves the same intended claim;
3. **confirmation-binding falsification** — freeze what the human saw/confirmed, then vary downstream default/schema/formula/policy state before actuation and ask whether the submitted representation still proves the confirmed meaning;
4. **annotation-versus-assertion differential** — challenge form generators that treat schema annotations such as `default`, `readOnly` or presentation hints as if they were canonical validation/mutation semantics;
5. **information-loss non-strengthening check** — erase a rendered value from the transmitted payload and test whether downstream defaulting can silently create a stronger/different fact, authority, decision or mutation;
6. **duplicate-screen** against all 116 reusable `G2-CONFLICT-PATTERN-*`, explicitly including `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`.

All 12 mandatory clusters are already explicitly covered in Full Pass 3. This visit is a local UI rotation and does not increment a mandatory-cluster streak incidentally.

## 2. Evidence refresh

Portable published semantics support the mechanism challenged here:

- WHATWG HTML defines disabled form controls as non-interactive submission participants and explicitly notes that disabled controls can still have their values changed programmatically. The form-elements specification also states that `disabled` prevents a control value from being submitted. This means `rendered value`, `interactive state` and `submitted semantic value` are distinct concerns: https://html.spec.whatwg.org/dev/form-control-infrastructure.html and https://html.spec.whatwg.org/multipage/form-elements.html.
- JSON Schema documents `default`, `readOnly` and `writeOnly` as annotations rather than validation assertions, and its guidance states that `default` is not itself used to fill a missing value during validation; non-validation tools such as form generators may choose how to use it. Therefore a generated form and its downstream consumer can each be locally conformant while giving different operational meaning to absence/default/read-only state: https://json-schema.org/understanding-json-schema/reference/annotations and https://json-schema.org/understanding-json-schema/reference/metadata.
- JSON Schema 2020-12 also distinguishes missing-keyword/default behavior from annotation production and permits dialect/vocabulary differences in evaluation behavior. This reinforces that a renderer cannot treat schema metadata alone as proof of canonical mutation semantics: https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01.

Portable conclusion: the value a human sees and confirms can be semantically lost before actuation without any malformed local component. A disabled/read-only/generated control may display value `A`, the submission may carry `ABSENT`, and a downstream owner may validly interpret absence using default/current semantics `B`. If the human confirmation is later treated as approval of `B`, information loss has strengthened or changed intent.

## 3. New local material edge scenario

### G2-EDGE-UI-011 — Rendered fixed value disappears from submission and downstream default rebinds human intent

- **Scenario:** a generated form/wizard renders a material value, qualifier or choice as fixed, read-only, disabled, inherited or otherwise apparently settled. The human reviews/accepts the surface believing that value participates in the action. The selected control/provider serialization path omits the value from the submitted payload. A downstream schema/process/formula/policy owner then applies its own current default or absence semantics, producing a different value/effect than the one the human saw.
- **Preconditions / activation conditions:** a material value is visible or otherwise represented as part of the human decision context; the chosen UI/control/provider path can omit it on submission; `ABSENT/UNSET` is not owner-proven equivalent to the displayed value; downstream evaluation may default, inherit, recompute or otherwise interpret absence.
- **Trigger:** submission/actuation occurs after the UI has rendered or confirmed a value whose explicit semantic assertion is not preserved in the payload/decision lineage.
- **Affected canonical subjects/revisions:** experience/component profile, schema/process/policy/formula revisions, human-confirmation revision/evidence, semantic input/result and any external effect identity.
- **Incompatible claims/actions/states:** UI evidence implies “the human confirmed action with material value A”; submitted representation means “no explicit value supplied”; downstream owner validly derives/inherits/defaults B from absence.
- **Why local validation may miss it:** the renderer can validly display A, the HTML/component layer can validly omit a disabled/read-only value, the payload can validate with the field absent, and the owner can validly apply B as its absence/default rule. The contradiction exists only across the composed render → submit → interpret chain.
- **Expected safe behavior / diagnostic expectation:** bind consequential human confirmation to the owner-qualified semantic values/qualifiers actually relied upon, or preserve an explicit assertion/reference that proves their equivalence. If a material rendered value disappears and equivalence cannot be proven, the dependent decision/mutation remains `INCONCLUSIVE/STALE/UNSUPPORTED` and requires requalification/reconfirmation before effect.
- **Forbidden behavior:** `visible/fixed/disabled` ⇒ “submitted”; missing payload ⇒ “the user accepted the current default”; current default ⇒ “same intent the user saw”; renderer/schema validity ⇒ proof of informed semantic adoption; omission may not strengthen authorization, consent, financial terms, policy applicability or destructive mutation.
- **Effect/failure disposition:** pre-effect `INCONCLUSIVE/NOT_QUALIFIED` when render-to-submit semantic equivalence is missing; if an external/canonical mutation may already have occurred, preserve `PARTIAL/UNKNOWN` as applicable and reconcile before retry, compensation or re-confirmation.
- **Detection candidates:** rendered-value versus emitted-payload semantic diff; control-state serialization truth table; presence/default compatibility matrix; confirmation-lineage check binding exact owner-qualified values; default-injection differential at pre-execution; post-effect audit comparing rendered evidence with producing inputs/results.
- **Owner set:** UI owns faithful projection, intent capture and render/submission lineage; Data/Schema, Process, Formula and Policy/Authorization owners own semantic interpretation/materiality; Standards/Interoperability and Provider/Binding own realization translation where applicable; Lifecycle/Reconciliation joins when revisions differ.
- **Severity:** HIGH–CRITICAL.
- **Confidence:** strongly supported.
- **Detectability:** static/design-time when control and absence semantics are declared; pre-execution when render/submission lineage is available; runtime/post-effect for opaque provider/client serialization.
- **Blast radius:** field/record → workflow/process → billing/compliance/external parties.
- **Reversibility:** easy before effect; bounded compensation or migration after persistence; potentially irreversible for destructive/external/financial action.
- **Time-to-harm:** immediate at actuation or latent when the rebound/defaulted value is consumed downstream.
- **Misuse likelihood:** likely accidental in generated/low-code forms; plausible adversarial downgrade when a composer intentionally selects an omission-prone control/profile.
- **Evidence currentness:** exact rendered experience/component/provider profile revision, raw displayed value and applicability qualifier, control interaction state, emitted payload including presence metadata, downstream default/owner revision, human-confirmation evidence and effect lineage.
- **False-positive risks:** some owners intentionally declare absence equivalent to the displayed/default value; some read-only controls are transmitted through explicit hidden/reference bindings; detector must prove semantic inequivalence or missing equivalence evidence rather than flag every omitted field.
- **Recovery/reconciliation / future remediation route:** on a concrete signal, compare rendered/confirmed semantics to the producing downstream inputs; require owner-qualified re-confirmation/replay only after effect reconciliation; preserve original human-view and payload evidence. No remediation is executed in research.
- **Proof obligation:** `UI-ADV-PROOF-011` — a material value or qualifier presented as part of a consequential human decision cannot disappear across render/submission translation and be rebound to a stronger/different default, authority, fact or effect unless the semantic owners explicitly prove equivalence for that revision/profile.
- **Architecture consequence candidate:** Planning C may evaluate whether consequential UI actions require proofable render→intent→payload semantic binding and presence-aware translation; this is a handoff candidate only, not a chosen target mechanism.
- **Saturation:** MATERIAL; UI local no-material streak remains/reset **0**.

## 4. Duplicate-screen / conflict catalogue disposition

`G2-EDGE-UI-011` is material as a new UI-specific scenario because the earlier UI findings do not test the case where the human **did see and apparently confirm** a material value but the submission representation silently converts that confirmation into `ABSENT` and downstream semantics rebound it:

- `G2-EDGE-UI-010` covers omission of a material qualifier from the presented/generated surface; UI-011 covers loss **after presentation**, between human confirmation and semantic submission.
- `G2-EDGE-UI-008` covers multi-step values that never shared one compatible revision cut; UI-011 can occur within one revision purely because control/payload/default semantics differ.
- `G2-EDGE-UI-007` covers `DerivedValue → StoredFact` materialization; UI-011 also applies to stored input, inherited policy parameters, authority qualifiers and destructive mutation intent.

However, the reusable semantic family is already captured by `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`: individually valid producer/UI/serializer/consumer presence/default interpretations conflict after composition. Related `PROJECTION-SEMANTICS`, `PRESENTATION-AUTHORITY`, `QUALIFIED-CLAIM`, revision/currentness and AI/low-code non-amplification patterns further bound the scenario. Therefore:

- new reusable ConflictPatterns: **0**;
- no `ConflictInstance` is asserted;
- no structural prevention is mandated in research;
- default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 5. Cross-capability linkage

No new mandatory cluster or `G2-XEDGE-*` ID is required. `G2-EDGE-UI-011` is linked as a concrete UI manifestation of the cross-cutting presence-semantics interaction spanning:

- UI / Generated Experience / Low-code Builder;
- UCA generic carriage;
- Data/Schema and Process semantic interpretation;
- Mathematical Expressions/Formula when absent values cause recomputation/defaulting;
- Authorization/Policy when omitted qualifiers change effective authority or decision strength;
- Standards/Interoperability and Provider/Binding when realization controls serialization behavior.

The interaction deepens already-covered mandatory clusters, especially `Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps` and Provider/Binding external realizations, but this local revisit does **not** advance or reset their streaks incidentally.

## 6. Saturation disposition

- new local material edge scenarios: **1** (`G2-EDGE-UI-011`);
- new cross-capability scenario IDs: **0**;
- new reusable ConflictPatterns: **0**;
- campaign inventory becomes **280 material edge scenarios + 116 reusable ConflictPatterns = 396 material findings**;
- UI eligible no-material streak: **0** because a material local finding survived duplicate-screen;
- mandatory-cluster streaks: unchanged;
- HIGH/CRITICAL findings without owner/proof/detection route: **0**;
- Planning C: remains **BLOCKED**.

## 7. Negative-space contribution

Future final negative-space review must explicitly check whether any generated/adaptive interaction can still strengthen an action by losing information **after** presentation but before semantic actuation — including disabled/read-only controls, hidden transport bindings, client/provider serializers, offline queues, accessibility/localization variants and AI-generated forms. The review must require owner and detection/remediation routes without assuming every omission is a concrete conflict.

## 8. Next rotation candidate

Continue Full Pass 3 with **Integration & Automation**, using techniques materially different from Full Passes 1 and 2 and duplicate-screen against all **116** reusable ConflictPatterns, including presence semantics. Challenge compound trigger/action graphs; correlation and idempotency identity through provider substitution; admission-versus-actuation currentness; enable/disable/update races with residual callbacks/registrations; callback authenticity versus semantic staleness; partial batch effects and compensation ownership; manual redrive after downstream adoption; offline connector queues; provider quota/backpressure/reordering; presence/default/null/delete translation across connector payloads; graph/resource/cardinality pressure; and AI/low-code automation that widens authority, fan-out, target population or external mutation scope. Do not enter Planning C.