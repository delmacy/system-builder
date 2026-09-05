# Generation 2 — Universal Capability Architecture — Full Pass 3 Revisit

Status: ACTIVE — MATERIAL FINDING
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Universal Capability Architecture (UCA)
Pass: 3
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `UNIVERSAL_CAPABILITY_ARCHITECTURE_EDGE_CASE_REGISTER.md`, adversarial framework and processual/semantic conflict classification.

Research only. No product code, Work Package, TASK, Construction, implementation guard or concrete remediation is authorized by this artifact. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Findings remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Revisit method

This revisit deliberately used techniques materially different from Full Passes 1 and 2:

1. **semantic-bottom mutation** — distinguish and permute `ABSENT`, `UNSET`, `UNKNOWN`, `NOT_APPLICABLE`, `REDACTED`, explicit `null`, explicit default and explicit zero/false values through universal envelopes;
2. **default-injection differential** — compare the same qualified claim/action after serializers, schema layers, patch formats and low-code forms inject, omit or erase defaults;
3. **representation-operator substitution** — replay the same intended semantic update through full replacement, merge/patch, generated form submission and provider-native adapters and compare the resulting meaning;
4. **monotonicity-under-information-loss check** — ask whether removing presence/disposition information can accidentally strengthen a claim, action or postcondition;
5. **duplicate-screen** against the 115 reusable `G2-CONFLICT-PATTERN-*` inventory before creating a reusable family.

All 12 mandatory clusters were already explicitly covered in Full Pass 3. This revisit is local UCA work; no mandatory-cluster streak is advanced incidentally.

## 2. Evidence refresh

Strong published semantics show that presence/default/null cannot be assumed portable merely because field names and wire types match:

- Protocol Buffers distinguishes explicit and implicit field presence. Under implicit presence, a default scalar value may be indistinguishable in serialization from an unset field, while explicit presence preserves whether a value was actually set. Its documentation explicitly notes that default value, clear and never-set cases can collapse under implicit presence: https://protobuf.dev/programming-guides/field_presence/ and https://protobuf.dev/editions/features/.
- RFC 7396 gives JSON Merge Patch `null` special deletion semantics and warns that the format is not appropriate for all JSON syntaxes that use explicit null values. Thus `null` can mean a mutation operator rather than a domain value depending on representation: https://www.rfc-editor.org/rfc/rfc7396.html.
- OpenTelemetry semantic conventions define `Conditionally Required` attributes whose absence can be legitimate only when the applicability condition is not satisfied; referenced attributes may also have their requirement level changed in a particular semantic scope. Thus absence does not carry one universal meaning: https://opentelemetry.io/docs/specs/semconv/general/attribute-requirement-level/.

Portable conclusion: a universal contract that carries only a value slot but not the owner-qualified presence/disposition semantics can silently transform `unknown/not supplied/not applicable/redacted/delete/default/false` into each other. Local validators can all be correct while the composed meaning is wrong.

## 3. New local material edge scenario

### G2-EDGE-UCA-011 — Presence/default/null collapse strengthens or changes semantic meaning

- **Scenario:** a capability-specific contract distinguishes `ABSENT/UNSET`, explicit default, explicit `null`, `UNKNOWN`, `NOT_APPLICABLE`, `REDACTED` or a mutation operator such as delete. A universal envelope, serializer, patch layer, generated form or provider adapter normalizes two or more of these states to the same representation. A downstream consumer then applies its own default or interpretation and derives a stronger or different claim/action/state than the producer intended.
- **Activation conditions:** at least two participating layers have different field-presence/default/null semantics; the field materially affects authority, applicability, mutation intent, evidence completeness, postcondition or recovery behavior.
- **Incompatible claims/actions/states:** producer means “value not known/not supplied/not applicable/redacted/delete”; consumer means “explicit false/zero/default/null domain value” or conversely treats an explicit value as absent/clear.
- **Why local validation misses it:** each layer validates the representation it understands; the contradiction appears only across the representation boundary and its default/presence rules.
- **Expected safe behavior:** preserve enough owner-qualified presence/disposition information to distinguish semantically material states; when translation cannot prove equivalence, dependent use remains `INCONCLUSIVE/UNSUPPORTED` rather than inheriting a stronger default interpretation.
- **Forbidden behavior:** infer `false`, zero, empty, default, delete, not-applicable or approval/deny semantics solely from a missing or normalized value; let representation conversion strengthen `PASS/ALLOW/READY/APPLIED` or silently issue a mutation.
- **Effect/failure disposition:** `INCONCLUSIVE/UNSUPPORTED` for the dependent decision or mutation until the producing/consuming semantic owners can prove the presence/default mapping; historical representation remains evidence, not upgraded truth.
- **Detection candidates:** cross-profile presence-state truth table; serialization/patch round-trip semantic diff; default-injection differential; schema/operator compatibility check; mutation-intent replay; property test that information erasure cannot strengthen claim/authority/effect.
- **Owner(s):** producing semantic owner + consuming semantic owner; UCA contract governance owns carriage of typed presence/disposition; Standards/Interoperability and Provider/Binding own realization mapping where applicable; Authorization/Governance joins when the field affects authority/policy.
- **Severity:** HIGH–CRITICAL.
- **Confidence:** strongly supported.
- **Detectability:** static/pre-execution when presence/operator contracts are declared; runtime/post-effect where adapters or generated surfaces normalize dynamically.
- **Blast radius:** record → workflow/process → system; external parties when normalized fields control external mutations or authority.
- **Reversibility:** easy before effect; bounded compensation/migration after canonical or external mutation; potentially irreversible for destructive operations.
- **Time-to-harm:** immediate for mutation/authorization fields; latent for evidence, historical or recovery fields.
- **Misuse likelihood:** likely accidental in generic adapters/low-code; plausible adversarial downgrade or ambiguity exploitation.
- **Evidence currentness:** exact producer/consumer schema/profile revisions, serialization/patch operator, raw presence state, generated/defaulted representation and decision lineage.
- **False-positive risk:** many absent/default states are intentionally equivalent; detector must compare owner-declared semantics and must not globally require distinction where the semantic owners explicitly prove equivalence.
- **Future remediation disposition:** on a concrete signal, require owner-qualified translation/reconciliation, explicit user/human confirmation for ambiguous destructive intent, or revision/profile migration. A later proof obligation may justify a structural guard only if Planning C establishes universality and proportionality.
- **Proof candidate:** `UCA-ADV-PROOF-011` — erasing or normalizing a semantically material presence/disposition state cannot produce a stronger claim, broader authority or more destructive mutation than the source representation proves.
- **Saturation:** MATERIAL; UCA local no-material streak remains/reset **0**.

## 4. New reusable processual / semantic conflict pattern

### G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001 — Individually valid presence/default interpretations conflict after composition

- **Family:** data/consistency + semantic ownership + rule/condition + provider/integration + AI/low-code.
- **Narrative:** capability A validly uses missing to mean unknown, capability B validly uses a default value when missing, and an adapter/low-code surface validly follows its serialization or patch semantics. Their composition converts insufficient/ambiguous information into an authoritative value or mutation even though no layer is locally malformed.
- **Involved capabilities/processes:** UCA plus any semantic owner using optional/defaulted values; commonly Data/Schema, UI/Generated Experience, Integration, Provider/Binding, Workflow, Authorization/Policy and AI/low-code composition.
- **Preconditions and activation conditions:** a semantically material field crosses at least one representation/profile boundary whose presence, default, null, redaction or mutation-operator semantics differ; no explicit equivalence relation proves the mapping.
- **Incompatible claims/actions/states:** `unknown/absent/redacted/not-applicable/delete/default/explicit value` are collapsed or substituted, causing incompatible resulting facts, decisions, authorities or effects.
- **Why local validation may miss it:** each producer, adapter and consumer can be valid under its own schema and operator rules; the unsafe meaning exists only in the composed translation.
- **Detection candidates and required evidence:** presence-state compatibility matrix; profile/schema revision comparison; round-trip semantic diff; default-injection mutation testing; patch/operator-aware replay; provenance showing raw source state and normalized consumer state.
- **Owner(s):** producing and consuming semantic owners; UCA contract governance for generic carriage; Standards/Interoperability and Provider/Binding for realization translation; affected policy/authority owner when decisions depend on the field.
- **Severity:** HIGH–CRITICAL.
- **Confidence:** strongly supported.
- **Detectability:** static/pre-execution when schemas/operators are explicit; runtime/post-effect otherwise.
- **Blast radius:** record/task → workflow/process → system/external parties.
- **Reversibility:** easy pre-effect; bounded compensation or migration after persistence/effect; potentially irreversible for destructive external mutation.
- **Time-to-harm:** immediate or latent.
- **Misuse likelihood:** likely accidental; plausible adversarial ambiguity exploitation.
- **Evidence currentness:** current producer/consumer schema/profile revisions, exact wire/patch/operator semantics, transformation lineage and raw versus normalized values.
- **Known false-positive risks:** explicit owner-declared equivalence can legitimately collapse states; `null` or default may be an intentional domain convention; detectors must not treat representation differences alone as conflict proof.
- **Static prevention feasibility:** partially feasible when contracts expose presence/operator semantics, but universal rejection would be over-restrictive because some owners intentionally define equivalences.
- **Future remediation disposition:** `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; when observed, require owner-qualified mapping/reconciliation or explicit acknowledgement; do not invent a universal null/default policy during research.
- **Proof/test candidate:** `UCA-CONFLICT-PROOF-PRESENCE-001` — for every material field crossing a representation boundary, either the source and destination presence/disposition states are proven semantically equivalent for the owner-qualified use or the dependent result cannot strengthen beyond `INCONCLUSIVE/UNSUPPORTED`.
- **Saturation:** ELICITED / MATERIAL.

## 5. Duplicate-screen disposition

The finding is related to existing `QUALIFIED-CLAIM`, `REVISION-VECTOR`, standards/provider downgrade, schema compatibility, semantic ownership and AI/low-code non-amplification families, but it is not equivalent to them:

- `G2-EDGE-UCA-008` covers loss/ignorance of a material qualifier; `G2-EDGE-UCA-011` covers **two values with the same surviving field shape but different presence/default/operator meaning**.
- `G2-CONFLICT-PATTERN-QUALIFIED-CLAIM-001` detects incompatible qualification intersections; the new pattern applies even before a qualified claim exists, including fact mutation and patch/delete intent.
- revision/currentness patterns do not explain a conflict where both sides use the same revision but disagree on what absence/default/null means.

Therefore one new local edge scenario and one reusable ConflictPattern survive duplicate screening. No `ConflictInstance` is asserted.

## 6. Cross-capability linkage

`G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` is linked into `EDGE_CASE_INDEX.md` and `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md` as a cross-cutting composition hazard, but it does **not** create or advance a mandatory-cluster streak in this run. It becomes a candidate interaction to challenge when the regular capability rotation reaches UI/Generated Experience, Integration, Data/Schema, Standards/Interoperability and Provider/Binding again.

## 7. Saturation disposition

- new local material edge scenarios: **1** (`G2-EDGE-UCA-011`);
- new cross-capability scenario IDs: **0**;
- new reusable ConflictPatterns: **1** (`G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`);
- campaign inventory becomes **279 material edge scenarios + 116 reusable ConflictPatterns = 395 material findings**;
- UCA eligible no-material streak: **0** because a material local finding survived duplicate-screen;
- mandatory-cluster streaks: unchanged;
- HIGH/CRITICAL findings without owner/proof/detection route: **0**;
- Planning C: remains **BLOCKED**.

## 8. Research-only architecture consequence candidates

These are not remediation or target-architecture decisions:

1. universal value carriage may need an explicit, owner-qualified presence/disposition vocabulary when absence/default/null materially changes meaning;
2. translation between full-document, patch, provider-native and generated-form representations may need proofable semantic equivalence rather than wire-shape compatibility alone;
3. information loss must not strengthen claim, authority or mutation semantics;
4. UCA remains a carrier of distinctions and provenance, not the owner that decides what `null`, default or absence means for every domain.

## 9. Next rotation candidate

Continue Full Pass 3 with **UI / Generated Experience / Low-code Builder**, using techniques materially different from Full Passes 1 and 2 and duplicate-screen against the now **116** reusable ConflictPatterns. Explicitly challenge generated-form presence/default/null behavior, hidden/disabled versus authority, stale optimistic interactions under `PARTIAL/UNKNOWN`, accessibility/localization semantic drift, `StoredFact != DerivedValue`, revision/profile skew, offline/residual clients, component/provider substitution, graph/resource pressure and AI/low-code composition. Re-test `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` as a duplicate-screen candidate, not as a presumed concrete conflict. Do not enter Planning C.
