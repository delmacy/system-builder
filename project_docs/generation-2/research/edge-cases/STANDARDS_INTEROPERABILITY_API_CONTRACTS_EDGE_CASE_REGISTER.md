# Generation 2 — Standards / Interoperability / API Contracts Edge-Case Register

Status: MATERIAL FINDINGS / FULL PASS 1
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Canonical capability: Standards / Interoperability / API Contracts
Disposition: research only — no remediation, Work Package, TASK, Construction or product-code authority.

Canonical distinctions preserved: `contract conformance != provider support qualification != authorization != domain semantic equivalence != effective outcome`; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; `UNKNOWN mutating effect -> reconcile-before-retry` unless the exact qualified operation contract proves retry safety.

## Evidence anchors

- Planning-A boundary: `PLANNING_A_STANDARDS_INTEROPERABILITY_API_CONTRACTS_BOUNDARIES.md`.
- Adversarial framework and conflict-classification directive remain authoritative.
- RFC 9110 (HTTP Semantics, June 2022) distinguishes request-method semantics from resource-specific effects and defines idempotency as the intended effect of multiple identical requests, while explicitly warning that clients should not automatically retry non-idempotent requests absent qualified knowledge that retry is safe or proof that the original was never applied. This supports treating transport/method properties as scoped evidence rather than universal domain-effect guarantees.
- OpenAPI's extension registry includes semantic-interoperability extensions such as `x-jsonld-type`, reinforcing that syntactic schema shape and semantic meaning are separable dimensions rather than interchangeable claims.

Evidence currentness: standards/specification evidence is current for this research pass as of 2026-09-04; applicability to any concrete future provider/client remains revision/profile/currentness-qualified.

## Material local edge cases

### G2-EDGE-STANDARDS-001 — structurally valid exchange with semantic incompatibility
Preconditions: producer and consumer pass syntax/schema validation but attach different domain meaning, units, enum semantics, null semantics, state meaning or postconditions to the same wire shape.
Trigger: exchange is accepted because only syntactic/structural conformance is checked.
Expected safe behavior / diagnostic expectation: semantic conformance remains separately qualified; insufficient semantic evidence yields `PARTIAL`, `NON_CONFORMANT` or `INCONCLUSIVE` rather than full compatibility.
Forbidden behavior: infer domain equivalence from matching path/method/schema/field names or provider feature labels.
Effect/failure disposition: `INCONCLUSIVE` until semantic-owner evidence establishes compatibility; no silent mutation confidence upgrade.
Owners: Standards/API Contracts for conformance claim; transported domain owner for meaning; Provider/Binding for provider admission where applicable.
Evidence/currentness: exact contract/profile, producer/consumer revisions, operation subset and semantic-owner evidence.
Recovery/reconciliation/future route: requalify against the intended semantic profile; route concrete incompatibility to owner-led contract/domain reconciliation.
Blast radius: operation to cross-system process; severity HIGH; misuse likelihood plausible; proof obligation: demonstrate that schema-valid but semantically divergent fixtures cannot be classified fully conformant.

### G2-EDGE-STANDARDS-002 — unknown, duplicate or malformed extensions change required behavior
Preconditions: extensible contract accepts implementation/provider extensions or unknown fields.
Trigger: consumer ignores, duplicates, reorders or interprets an extension differently; extension affects authority, privacy, unit, behavior or outcome semantics.
Expected safe behavior: unknown extensions are ignorable only when the active profile explicitly permits it and semantic invariants are unaffected; duplicates/ambiguous canonicalization are rejected or remain non-conformant/inconclusive.
Forbidden behavior: treat all unknown fields as harmless merely because base parsing succeeds.
Disposition: fail qualification or remain `INCONCLUSIVE` when extension criticality is unknown.
Owners: Standards/API Contracts + semantic owner + Security/Privacy/Authorization when relevant.
Evidence: extension identity/revision, criticality rule, canonicalization and active profile.
Recovery route: explicit extension adoption/mapping or bounded rejection; no silent canonization.
Blast radius: request to system; severity HIGH; misuse likelihood plausible/adversarial; proof: mutation/property corpus covering missing/duplicate/unknown/critical extensions.

### G2-EDGE-STANDARDS-003 — encoding, locale, content-type or canonicalization ambiguity
Preconditions: equivalent-looking values can decode differently across charset, Unicode normalization, locale, timezone, decimal separator, media-type parameter or canonical serialization rules.
Trigger: producer and consumer normalize or compare differently.
Expected safe behavior: contract/profile identifies required encoding/canonicalization and preserves ambiguity as failure/inconclusive; signatures, hashes, identities and values are not compared across unqualified canonical forms.
Forbidden behavior: locale-dependent coercion or signature/hash validation over a different canonical representation than the producer used.
Disposition: reject or `INCONCLUSIVE` before semantic use.
Owners: Standards/API Contracts; Data/Schema or domain owner for value semantics; Trust/Security where signed material is involved.
Evidence: exact media type, charset/canonicalization profile, locale/unit/timezone rules and revisions.
Recovery route: normalize only under a declared profile and re-evaluate affected evidence.
Blast radius: record to trust/system; severity HIGH; misuse likelihood plausible; proof: differential parser/canonicalization corpus.

### G2-EDGE-STANDARDS-004 — compatibility matrix and revision skew create false timeless compatibility
Preconditions: producer, consumer, adapter, schema, security profile or semantic profile revisions evolve independently.
Trigger: a historical compatibility result is reused after one dimension changes, or one global `compatible=true` masks a scoped incompatibility.
Expected safe behavior: compatibility is a current qualified relation over revision/profile/use-scope vectors; stale evidence cannot qualify a changed realization.
Forbidden behavior: reuse old conformance evidence as a permanent badge.
Disposition: stale/mismatched evidence -> `INCONCLUSIVE` until requalification.
Owners: Standards/API Contracts; Lifecycle for coexistence/current transition state; semantic owners for affected requirements.
Evidence: complete revision vector and currentness horizon.
Recovery route: re-run qualification or pin/migrate revision through later lifecycle route.
Blast radius: integration surface to enterprise; severity HIGH; misuse likelihood likely in long-lived ecosystems; proof: version-skew matrix demonstrating stale evidence never upgrades current compatibility.

### G2-EDGE-STANDARDS-005 — negotiation/downgrade preserves syntax while weakening required semantics
Preconditions: multiple versions/profiles are mutually understandable at protocol level.
Trigger: negotiation selects an older/weaker profile that drops required authority, privacy, trust, audit, error/effect or semantic guarantees.
Expected safe behavior: negotiated result must satisfy superior semantic/policy/authority/trust requirements; unsupported required dimensions yield partial/non-conformant/inconclusive.
Forbidden behavior: choose the highest common protocol version or easiest fallback when it weakens mandatory semantics.
Disposition: refuse/downgrade qualification rather than silently weaken requirements.
Owners: Standards/API Contracts + Authorization/Governance/Privacy/Trust/Security + semantic owner.
Evidence: offered/selected profiles, superior policy constraints and current support evidence.
Recovery route: select a qualified profile/provider or require explicit owner/governance disposition later.
Blast radius: system/enterprise/external parties; severity CRITICAL where downgrade removes authority/security/privacy controls; misuse likelihood plausible/adversarial; proof: negotiation solver must preserve non-weakening constraints.

### G2-EDGE-STANDARDS-006 — protocol success or method-level idempotency misclassified as canonical effect/retry safety
Preconditions: request receives 2xx/ACK, is queued, or uses a transport method described as idempotent; downstream/domain outcome may remain ambiguous or contain additional side effects.
Trigger: caller records semantic success or retries after timeout solely from protocol/method properties.
Expected safe behavior: map protocol result to explicit effect disposition; preserve `UNKNOWN` and reconcile unless exact operation/profile qualifies domain retry safety and scope/horizon.
Forbidden behavior: `ACK/2xx -> APPLIED`, timeout -> `NOT_APPLIED`, or method-level idempotency -> universal exactly-once domain effect.
Disposition: `UNKNOWN`/`PARTIAL` until canonical postcondition evidence exists.
Owners: Standards/API Contracts for operation contract; domain owner for postcondition; Integration/Provider/Messaging for realization evidence.
Evidence: operation revision, idempotency scope/lifetime/key equivalence, target revision and read-back/reconciliation evidence.
Recovery route: reconcile first; only then retry/compensate through owner-specific route.
Blast radius: duplicate/lost business effect; severity CRITICAL; misuse likelihood likely; proof: ambiguous-effect fault injection showing no unsafe retry path.

### G2-EDGE-STANDARDS-007 — deprecation/withdrawal, pathological contracts and generated adapters leave residual incompatible cohorts
Preconditions: contract is deprecated/withdrawn or regenerated while old clients, adapters, caches or provider integrations remain active; contract/negotiation graphs can be very large or cyclic.
Trigger: cutover declares success before old authoritative cohorts drain, or AI/low-code generates syntactically valid adapters/profiles that create cycles, expansion or semantic drift.
Expected safe behavior: withdrawal is lifecycle-qualified; residual authoritative cohorts remain explicit; generated artifacts remain proposals subject to semantic/authority qualification; resource-bounded analysis may return inconclusive rather than approximate unsafely.
Forbidden behavior: declare migration complete from publication alone, silently accept generated semantic mappings, or consume unbounded contract graphs until failure.
Disposition: partial/inconclusive coexistence state; bounded failure for pathological graphs.
Owners: Standards/API Contracts + Lifecycle + Provider/Binding + relevant semantic/authority owners.
Evidence: client/cohort inventory, revision graph, generated mapping provenance, current binding/use evidence and resource limits.
Recovery route: drain/migrate/requalify cohorts; human/owner reconciliation for ambiguous generated semantics.
Blast radius: system/enterprise; severity HIGH; misuse likelihood plausible; proof: residual-cohort and graph-exhaustion tests plus generated-adapter semantic-differential review.

## Reusable processual / semantic ConflictPatterns

### G2-CONFLICT-PATTERN-CONFORMANCE-SEMANTICS-001 — local conformance claims jointly imply false semantic equivalence
Family: semantic ownership + cross-capability/provider.
Activation conditions: producer and consumer each satisfy their local syntactic/structural contract, but domain meanings/postconditions differ or are unqualified.
Incompatible claims/actions/states: `wire/profile conformant` versus `domain semantics equivalent/effect acceptable`.
Why local validation may miss it: each side validates only its own shape/protocol constraints and neither owns the transported domain truth.
Detection candidates: static semantic-profile diff; pre-execution revision/profile qualification; runtime postcondition divergence; post-effect semantic reconciliation.
Owners: Standards/API Contracts + transported domain owner + Provider/Binding where external.
Assessment: severity HIGH; confidence strongly supported; detectability static/pre-execution plus post-effect; blast radius process/system; reversibility bounded compensation to migration-required; time-to-harm immediate/delayed; misuse plausible; evidence currentness required.
False-positive risk: semantically irrelevant representational differences can appear incompatible if profiles are over-constrained.
Future remediation disposition: require additional semantic evidence, explicit mapping/adoption or owner reconciliation; do not globally reject all syntactic variation.
Proof candidate: cross-implementation corpus where equal schemas carry deliberately divergent units/enums/postconditions.
Saturation: MATERIAL / STREAK 0.

### G2-CONFLICT-PATTERN-NEGOTIATION-NONWEAKENING-001 — individually compatible profiles compose into policy/authority weakening
Family: policy/compliance + authority + version/provider.
Activation conditions: two endpoints have a mutually supported fallback/downgrade, while superior authority, privacy, trust, audit or domain policy requires a stronger semantic profile.
Incompatible claims: `protocol-compatible fallback allowed` versus `superior invariant must remain satisfied`.
Why local validation may miss it: endpoint negotiation sees capability intersection but not all inherited cross-owner constraints.
Detection candidates: static profile constraint model; pre-execution negotiation result × current policy/authority/trust vector; runtime downgrade telemetry; audit comparison.
Owners: Standards/API Contracts + Authorization/Governance/Privacy/Trust/Security as applicable.
Assessment: severity CRITICAL; confidence strongly supported; detectability pre-execution/runtime; blast radius system/enterprise/external parties; reversibility potentially irreversible for disclosure/authority effects; time-to-harm immediate; misuse plausible/adversarial; evidence must be current.
False-positive risk: optional semantics may legitimately be omitted when not required by active scope.
Future remediation disposition: reject or require explicit authorized exception/alternative profile; no automatic implementation work.
Proof candidate: negotiation search demonstrating no selected profile weakens active mandatory constraints.
Saturation: MATERIAL / STREAK 0.

### G2-CONFLICT-PATTERN-CONTRACT-EFFECT-001 — protocol acknowledgement/idempotency conflicts with canonical effect state
Family: state-transition + provider/integration + exception/recovery.
Activation conditions: transport reports success/failure or method-level idempotency while canonical mutation effect is partial/unknown, changed by later events, or outside the qualified idempotency scope/horizon.
Incompatible claims: `request accepted/retryable` versus `canonical effect not proven / retry may duplicate or overwrite`.
Why local validation may miss it: protocol libraries validate message exchange, not domain postconditions or later state transitions.
Detection candidates: operation-contract static review; pre-retry effect/current target requalification; runtime duplicate/effect correlation; post-effect reconciliation.
Owners: Standards/API Contracts + domain owner + Integration/Provider/Messaging realization owner.
Assessment: severity CRITICAL; confidence strongly supported; detectability pre-execution/runtime/post-effect; blast radius transaction/process/system; reversibility bounded compensation to potentially irreversible; time-to-harm immediate; misuse likely; currentness mandatory.
False-positive risk: an exact operation contract may genuinely prove domain-level idempotency for the relevant scope.
Future remediation disposition: reconcile `UNKNOWN`, then retry/compensate only under current qualified semantics.
Proof candidate: fault injection around lost responses, late ACKs and API-revision changes.
Saturation: MATERIAL / STREAK 0.

### G2-CONFLICT-PATTERN-CONTRACT-COEXISTENCE-001 — valid contract revisions coexist but residual clients preserve incompatible authority/effects
Family: version/migration/coexistence + provider/integration + authority.
Activation conditions: old/new API/contract revisions are individually valid for some scopes, yet residual clients/adapters/providers still produce authoritative effects after withdrawal/cutover or use incompatible semantics.
Incompatible claims: `new contract effective/old withdrawn` versus `old cohort remains able to affect canonical truth`.
Why local validation may miss it: publication/deprecation checks do not observe all runtime consumers, cached adapters or provider routes.
Detection candidates: static compatibility/coexistence matrix; pre-cutover cohort inventory; runtime old-revision traffic/effect detection; post-cutover reconciliation.
Owners: Lifecycle + Standards/API Contracts + Provider/Binding + affected semantic/authority owners.
Assessment: severity HIGH; confidence strongly supported; detectability pre-execution/runtime; blast radius process/system/enterprise; reversibility migration required; time-to-harm delayed/cumulative; misuse plausible; currentness required.
False-positive risk: read-only historical clients may remain safely active if their scope cannot create authoritative effects.
Future remediation disposition: keep coexistence explicit, drain/migrate/requalify affected cohorts, or accept bounded exception with owner evidence.
Proof candidate: cutover simulation proving old authoritative cohorts cannot be silently omitted.
Saturation: MATERIAL / STREAK 0.

## Cross-capability deepening

No 13th mandatory cluster is introduced. These findings materially deepen existing clusters:

- Provider/Binding × external realizations: protocol/feature compatibility cannot substitute for portable semantic support qualification.
- Workflow × Integration × Messaging × external mutation: request/event acknowledgement, ordering and idempotency semantics remain scoped and cannot manufacture canonical effect certainty.
- Identity × Authorization × Station × AGWS × AI: negotiated/generated contracts cannot weaken inherited authority or promote external IDs into canonical identity.
- Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution: trust/profile compatibility and signature/canonicalization evidence remain revision/currentness-qualified.
- Data/Schema × Privacy × Storage × Lifecycle: schema/API compatibility, privacy obligations and residual old clients must be evaluated across coexistence/cutover.

All affected mandatory-cluster no-material streaks remain 0 because this pass produced material deepening.

## Preventive-invariant disposition

No concrete remediation is authorized. Two universal/material candidates are retained for Planning-C consideration only, subject to owner reconciliation: (1) conformance/compatibility claims must remain dimensioned and revision/currentness-qualified rather than boolean; (2) negotiation must not weaken active superior invariants. These are architecture-consequence candidates, not implementation decisions.

## Pass disposition

Local material findings: 7.
New reusable ConflictPatterns: 4.
Local no-material streak: 0.
Affected mandatory-cluster streaks: 0.
HIGH/CRITICAL without owner/proof/detection route: 0.
Full Pass 1 remains incomplete until all 28 canonical capabilities are challenged.
Planning C remains blocked.
