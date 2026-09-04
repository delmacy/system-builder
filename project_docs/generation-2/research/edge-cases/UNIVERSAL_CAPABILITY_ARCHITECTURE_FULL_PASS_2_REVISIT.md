# Generation 2 — Universal Capability Architecture — Full Pass 2 Revisit

Status: ACTIVE — MATERIAL FINDINGS
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Universal Capability Architecture (UCA)
Pass: 2
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `UNIVERSAL_CAPABILITY_ARCHITECTURE_EDGE_CASE_REGISTER.md`, adversarial framework and processual/semantic conflict classification.

Research only. No product code, Work Package, TASK, Construction, implementation guard or concrete remediation is authorized by this artifact. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. New findings remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Revisit method

This revisit deliberately used techniques materially different from Full Pass 1:

1. **lossy round-trip / unknown-semantic mutation** — pass a qualified universal envelope through adapters/serializers that understand different subsets of its qualifiers and extensions;
2. **consistent-cut falsification** — assemble individually valid/current owner revisions into composite vectors and ask whether the combined cut could ever have been simultaneously valid;
3. **authority Cartesian-product analysis** — compose separately qualified subject/resource/action/provider sets and test whether generic normalization silently multiplies effective authority;
4. **duplicate-screen** against the 115 reusable `G2-CONFLICT-PATTERN-*` inventory before creating a new family.

No new mandatory cluster was invented because all 12 mandatory clusters are already covered once in Full Pass 2 and no novel cross-cluster interaction family was required.

## 2. Evidence refresh

Strong published semantics support the portable distinctions used here:

- RFC 5280 requires rejection when a critical X.509 extension is not recognized or cannot be processed, while an unrecognized non-critical extension may be ignored. This demonstrates that unknown semantics need an explicit criticality/disposition contract rather than generic preservation-or-drop behavior: https://www.rfc-editor.org/rfc/rfc5280
- Kubernetes structural schemas may prune unknown fields before persistence unless preservation is explicitly declared; Server-Side Apply separately tracks field ownership/conflicts. This demonstrates that syntactically valid round-trips can silently lose fields or ownership semantics when schema/manager knowledge differs: https://kubernetes.io/blog/2019/06/20/crd-structural-schema/ and https://kubernetes.io/docs/reference/using-api/server-side-apply/
- OpenTelemetry semantic conventions allow a referenced attribute to have a requirement level modified within a specific semantic scope and define conditionally required attributes by applicability conditions. Shared vocabulary therefore does not imply unchanged requirement/applicability semantics across consumers: https://opentelemetry.io/docs/specs/semconv/general/attribute-requirement-level/
- Distributed snapshot/version-vector literature distinguishes locally valid states from a causally consistent global cut; vector/version metadata exists precisely because independently observed revisions cannot be assumed to form one valid global state. Representative references: Chandy & Lamport, *Distributed Snapshots* (1985), and Almeida/Baquero et al. on version vectors.
- RFC 8693 notes that requested OAuth scope across multiple target services is effectively the Cartesian product of scopes and target services. This is a useful portable warning that combining independently meaningful dimensions can enlarge authority semantics multiplicatively rather than additively: https://www.rfc-editor.org/rfc/rfc8693

## 3. New local material edge scenarios

### G2-EDGE-UCA-008 — Critical semantic qualifier is lost or ignored during universal-envelope round-trip

- **Scenario:** a UCA envelope contains an extension/qualifier that materially narrows applicability, authority, evidence, effect stage or recovery semantics. An intermediate portability layer does not understand that qualifier and either prunes it, preserves it opaquely but evaluates the rest as sufficient, or reserializes the envelope without preserving its criticality semantics.
- **Activation conditions:** producer and consumer support different semantic profiles/extensions; at least one unknown qualifier materially changes whether the claim/action is admissible.
- **Incompatible claims/actions/states:** producer means “valid only if qualifier Q is understood and satisfied”; intermediate/consumer interprets the surviving base structure as independently valid.
- **Why local validation misses it:** producer validates Q, and consumer validates only the fields it understands; each local validator is internally correct.
- **Expected safe behavior:** inability to understand/process a qualifier declared material to validity makes the composite result `INCONCLUSIVE/UNSUPPORTED` for that use; unknown non-material data may remain ignorable only when the owning semantic contract explicitly permits it.
- **Forbidden behavior:** prune/ignore an unknown material qualifier and preserve `PASS/ALLOW/READY/APPLIED` strength; treat opaque preservation as proof that semantic effect was preserved.
- **Detection candidates:** round-trip semantic-diff test; declared criticality/requirement-level compatibility; profile-capability intersection; unknown-field/unknown-extension audit; producer-vs-consumer qualification comparison.
- **Owner(s):** UCA contract governance for extension/qualification carriage; producing semantic owner for criticality/applicability; consuming decision owner for acceptance; Standards/Interoperability and Provider/Binding where realization conversion occurs.
- **Severity:** CRITICAL.
- **Confidence:** strongly supported.
- **Detectability:** static/pre-execution when profiles are declared; runtime/audit-only for opaque or dynamically introduced qualifiers.
- **Blast radius:** record → workflow/process → system; can extend to external parties for authority/effect qualifiers.
- **Reversibility:** bounded when pre-effect; migration/reconciliation or potentially irreversible after external mutation.
- **Time-to-harm:** immediate or latent until an old/limited consumer handles the envelope.
- **Misuse likelihood:** likely accidental under portability/version skew; plausible adversarial downgrade path.
- **Evidence currentness:** current producer/consumer profile revisions, exact serialized form, conversion path and criticality/applicability metadata.
- **False-positive risk:** not every unknown extension is material; detector must distinguish owner-declared or proof-established material qualifiers from safely ignorable metadata.
- **Effect/failure disposition:** `INCONCLUSIVE/UNSUPPORTED` for the dependent claim/action until semantics are understood/requalified; preserve historical evidence without upgrading current validity.
- **Future remediation disposition:** require profile-aware reconciliation or explicit owner decision when a concrete signal occurs; possible later proof obligation for “unknown critical semantic => fail closed”, but no implementation is created here.
- **Proof candidate:** `UCA-ADV-PROOF-008` — removing or failing to process any qualifier designated material cannot preserve a stronger semantic result.
- **Duplicate-screen:** maps primarily to `G2-CONFLICT-PATTERN-QUALIFIED-CLAIM-001`, `G2-CONFLICT-PATTERN-REVISION-VECTOR-001`, provider-qualification/standards-downgrade/currentness families. No new reusable ConflictPattern required.
- **Saturation:** MATERIAL; UCA local streak remains/reset **0**.

### G2-EDGE-UCA-009 — Individually current revisions form a composite state that never existed as a consistent semantic cut

- **Scenario:** a generic UCA consumer collects the latest/current policy revision from owner A, schema revision from B, provider qualification from C and evidence profile from D. Every component is individually valid at read time, but their causal dependencies mean the assembled vector is a “Frankenstein” state that was never jointly compatible or simultaneously authoritative.
- **Activation conditions:** independently evolving owners; asynchronous propagation; one revision depends on or supersedes another; consumer performs per-owner `latest/current` lookup without a common cut/compatibility relation.
- **Incompatible claims/actions/states:** each owner claims currentness locally while the composite decision assumes a jointly valid revision set that no owner has qualified.
- **Why local validation misses it:** each revision validates against its own lineage; incompatibility exists only in the N-wise cut.
- **Expected safe behavior:** composite qualification must distinguish “all members individually current” from “members jointly compatible for this decision”; absence of a provable compatible cut is `INCONCLUSIVE`, not success.
- **Forbidden behavior:** synthesize a universal current revision from independent `latest` values or timestamps; infer compatibility from recency alone.
- **Detection candidates:** dependency-closure/cut consistency analysis; revision-vector compatibility relation; happens-before/supersession checks; owner-declared compatibility edges; replay of producing decision lineage.
- **Owner(s):** Lifecycle/versioning plus all affected semantic owners; UCA owns only the structural revision-vector/cut representation and must not decide domain compatibility itself.
- **Severity:** HIGH–CRITICAL.
- **Confidence:** strongly supported.
- **Detectability:** pre-execution where dependencies are explicit; runtime/post-effect where causal linkage is incomplete.
- **Blast radius:** workflow instance → process → system; historical reporting and migration decisions may also be affected.
- **Reversibility:** requalification/migration required; downstream irreversible effects may not be automatically reversible.
- **Time-to-harm:** immediate or latent under long-running/offline operation.
- **Misuse likelihood:** likely accidental when `latest` is used as a convenience abstraction.
- **Evidence currentness:** exact material revision vector, supersession/dependency lineage, compatibility evidence and time/source of each observation.
- **False-positive risk:** concurrent independent revisions can be legitimately composable; detector must prove a dependency/incompatibility rather than require one global transaction for all owners.
- **Effect/failure disposition:** `INCONCLUSIVE` until a consumer/owner-qualified compatible cut is established.
- **Future remediation disposition:** future requalification/pinning/migration route when a concrete incompatibility is signalled; no universal serialization mechanism is prescribed in research.
- **Proof candidate:** `UCA-ADV-PROOF-009` — `individually-current(all members)` does not imply `jointly-compatible(composite)`.
- **Duplicate-screen:** refinement of `G2-CONFLICT-PATTERN-REVISION-VECTOR-001` plus temporal/currentness/qualification-join families; no new reusable ConflictPattern.
- **Saturation:** MATERIAL; UCA local streak remains/reset **0**.

### G2-EDGE-UCA-010 — Generic contract composition multiplies authority across subject/resource/action/provider dimensions

- **Scenario:** several capability fragments are individually authorized: a subject set, a resource set, an action set and one or more provider bindings. A generic UCA/AI/low-code composition flattens or merges them and unintentionally authorizes the Cartesian product rather than the narrower pairings originally approved.
- **Activation conditions:** authority is represented as independently reusable dimensions or lists; original grants have pairing/context constraints; generic composition/normalization loses those relations.
- **Incompatible claims/actions/states:** each grant is valid for its own tuple, while the merged contract implies additional tuples that no authority owner approved.
- **Why local validation misses it:** every subject/resource/action/provider element is recognized and allowed somewhere; the unsafe authority appears only in their recombination.
- **Expected safe behavior:** authority remains tuple-/context-qualified; generic capability reuse cannot infer cross-product permission from unioned components; unproven combinations are denied/`INCONCLUSIVE` according to the owning policy semantics.
- **Forbidden behavior:** union subjects, resources, actions, scopes or providers and then treat every combination as authorized; allow AI/low-code to amplify authority by composition of individually valid fragments.
- **Detection candidates:** relational authority-closure analysis; N-wise grant tuple comparison; scope/audience/provider pairing validation; least-authority differential between source grants and composed contract; AI/low-code composition review.
- **Owner(s):** Authorization/Policy and affected semantic owners; Provider/Binding for realization constraints; UCA only carries typed capability/authority references and must not widen them.
- **Severity:** CRITICAL.
- **Confidence:** strongly supported.
- **Detectability:** static/pre-execution if grants are relationally represented; runtime/audit otherwise.
- **Blast radius:** task → process → station/system/enterprise; external parties when provider actions are included.
- **Reversibility:** easy before execution; bounded to potentially irreversible after privileged/external mutation.
- **Time-to-harm:** immediate.
- **Misuse likelihood:** plausible accidental; adversarially attractive.
- **Evidence currentness:** current authority/grant revisions, tuple constraints, delegated scope, provider binding and composition provenance.
- **False-positive risk:** some policies intentionally define product-style grants; detector must compare against owner-declared combination semantics rather than forbid products universally.
- **Effect/failure disposition:** deny/`INCONCLUSIVE` for combinations not explicitly derivable from authority semantics; no canonical mutation from widened inferred permission.
- **Future remediation disposition:** future owner requalification or explicit grant/rewrite when a concrete signal exists; potential proof obligation for non-amplification of generic composition.
- **Proof candidate:** `UCA-ADV-PROOF-010` — composed effective authority is a subset of authority derivable from the source grants under owner semantics, never a convenience Cartesian superset.
- **Duplicate-screen:** maps to `G2-CONFLICT-PATTERN-UCA-OWNERSHIP-001`, permission-composition/provider-composition-authority, multitenant-scope and AI/low-code authority families. No new reusable ConflictPattern required.
- **Saturation:** MATERIAL; UCA local streak remains/reset **0**.

## 4. Duplicate-screen / conflict catalogue disposition

No new `G2-CONFLICT-PATTERN-*` is added in this revisit. The three scenarios are material capability-specific manifestations/refinements of already catalogued reusable families:

- qualification loss/currentness and standards/provider downgrade;
- revision-vector/temporal compatible-cut ambiguity;
- semantic ownership and generic/AI authority non-amplification;
- provider qualification/binding and multitenant scope where applicable.

Therefore the reusable ConflictPattern inventory remains **115**. This is deliberate deduplication, not absence of material findings.

## 5. Saturation disposition

- new local material edge scenarios: **3** (`G2-EDGE-UCA-008..010`);
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- UCA eligible no-material streak: **0** because material local findings survived duplicate-screen;
- mandatory cluster streaks: unchanged; no new mandatory cluster created;
- HIGH/CRITICAL findings without owner/proof/detection route: **0**;
- Planning C: remains **BLOCKED**.

## 6. Research-only architecture consequence candidates

These are not remediation or target architecture decisions:

1. universal envelopes may need explicit semantic criticality/requirement/applicability metadata so unknown material semantics cannot be silently erased;
2. “current revision set” may need to remain a qualified compatibility claim over a material revision vector rather than a bag of latest versions;
3. generic capability/authority contracts need a proofable non-amplification property across relational subject/resource/action/provider constraints;
4. UCA must continue to carry structure and lineage without becoming the semantic owner that decides domain compatibility, authority or truth.

## 7. Next rotation candidate

Continue Full Pass 2 with **UI / Generated Experience / Low-code Builder**, using techniques materially different from its Full Pass 1 review and duplicate-screen against the 115 reusable ConflictPatterns. Challenge lossy projection of authority/qualification into UI state, stale-base/optimistic interaction under ambiguous effects, accessibility/localization semantics that alter action meaning, hidden/disabled controls versus authorization, generated-form ownership of derived versus stored facts, revision/profile skew between UI/process/schema/policy/formula, offline residual client cohorts, low-code graph/resource explosion and AI-generated surfaces/actions that widen authority or erase critical qualifiers. Do not enter Planning C.
