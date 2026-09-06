# Generation 2 — Standards / Interoperability / API Contracts — Full Pass 8 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 8
Disposition: research-only; no remediation, Work Package, TASK, Construction or product-code authority.

## Authority and fresh baseline

`RESEARCH_PIPELINE_STATE.json` was read first and treated as sole authority for phase/order/gates/current focus/next action. The branch was revalidated as `research/g2-capability-pipeline` at `25f2abc9ecc00820e8b251547cf967103e4092b6` before persistence. Full Pass 8 was at 25/28 capabilities and 12/12 mandatory clusters, with 7/8 minimum full passes complete, negative-space `NOT_STARTED`, saturation `NOT_SATURATED`, and Planning C blocked.

Preserved distinctions: `Research != remediation`; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; `schema/protocol conformance != semantic equivalence != authority != external/business/physical effect`; `provider reported state != physical truth`; `observed behavior != intended process != approved canonical process`; `AI inference = candidate`; `ExecutionEnvelope != ExecutionState != ExecutionJournal != business truth`.

The existing Elicitation & System Understanding methodology, Operability Elicitation, Legacy Mirroring/Brownfield Assimilation and bounded Physical/Peripheral integration/governance-plane boundary were applied as cross-cutting lenses; none is promoted to a new canonical capability by this revisit.

## Full Pass 8 attack rotation

All candidates were duplicate-screened against the existing 124 ConflictPatterns. This pass rotated the attack shape rather than repeating Full Pass 7:

1. **Dialect/vocabulary support fracture** — keep payload/schema syntax stable while changing the validator's understood vocabularies and assertion behavior. A validator accepting a document is not evidence that every semantic vocabulary was enforced.
2. **Annotation-to-assertion confusion** — treat advisory/annotation metadata as if it had been enforced, especially `format`, deprecation, examples, discriminator hints and extension metadata.
3. **Discriminator/inheritance illusion** — generated clients infer subtype ownership or mandatory semantics from OpenAPI discriminator/allOf structure even where validation does not establish that claim.
4. **Unknown-critical-field survivorship** — old intermediaries accept but ignore new extension fields whose meaning is material to authority, units, uncertainty, temporal applicability, source-of-truth or external-effect disposition.
5. **Directional round-trip fracture** — old client reads new representation successfully but rewrites it while dropping unknown/critical semantics; read compatibility therefore diverges from write/preservation compatibility.
6. **ABSENT/null/default/delete mutation** — serializers, PATCH adapters and generated forms collapse absence, explicit null, default and delete intent into one representation while remaining schema-valid.
7. **Canonical/external identity fracture** — canonical subject/resource identity is held constant while SCIM/provider IDs, usernames, site/resource IDs and protocol-native identifiers rotate or are recycled.
8. **Protocol-success/effect fracture** — successful HTTP/message/provider acknowledgement is challenged against delayed, partial or `UNKNOWN` external state and residual grants/sessions/cohorts.
9. **Temporal/profile skew** — historical payloads, in-flight revisions and dual-version clients are evaluated with today's profile/contract metadata, creating false reinterpretation or false incompatibility.
10. **Physical/Peripheral operation-class strengthening** — a provider label/profile that supports inventory/read/provision/event semantics is adversarially promoted by generated adapters into write/call/actuation authority. This remains forbidden as a default semantic inference.
11. **Pathological contract pressure** — deep composition, many dialects/extensions/profiles, high-cardinality capability matrices and oversized numeric/string domains test whether bounded analysis fails explicitly rather than silently weakening validation.
12. **Elicitation/Production Readiness subtraction** — an apparently complete integration description is stripped of exact version/profile, unknown-field policy, compatibility direction, source-of-truth, owner, evidence/currentness, negative cases, timeout/UNKNOWN/reconciliation and production proof.
13. **AI/low-code semantic erasure** — generated schemas/adapters remain syntactically valid while dropping decision/calculation/workflow kind, unit/vector/uncertainty, provenance strength, tenant/site scope or authority qualifiers.

## Evidence refresh and semantic implications

### JSON Schema 2020-12

The current Draft 2020-12 validation specification explicitly states that structural validation can be insufficient for correct application use. It separates `format-annotation` from `format-assertion`; assertion support is optional unless the assertion vocabulary is required. Core vocabulary handling also distinguishes required vocabularies from optional/unknown vocabulary behavior.

Research implication: **`schema valid` must remain weaker than `semantically qualified for this capability/use/effect`.** Validator configuration/profile is evidence that itself needs version/currentness provenance.

### OpenAPI 3.1.1

OpenAPI 3.1.1 states that `discriminator` cannot change the validation outcome; in the `allOf` parent form it does not cause validation to search child schemas. Therefore code generation or UI tooling cannot safely promote discriminator/inheritance shape into semantic ownership, authority or exhaustive subtype proof.

Research implication: **representation hints and generation conveniences are not canonical semantic authority.**

### Identity/provisioning and physical-provider boundary

Existing SCIM/provider research remains consistent with operation-qualified interoperability: create/update/disable/delete, external-id mapping, version/currentness, grants, sessions and reconciliation are separate concerns. Likewise, provider standards for physical systems cannot be collapsed into a single `supports standard X` flag that implies equivalent resource scope or actuation authority.

Research implication: SB remains a semantic/integration/governance plane for identity mapping, provisioning, permission synchronization, inventory/read/event ingestion, brokered access and reconciliation. Specialized VMS/access/BMS/PDV/device-control planes remain external by default. Any future physical actuation requires a separate Planning C decision and safety/authority proof obligations.

## Elicitation & System Understanding lens

Standards/API elicitation remains adaptive and capability-aware. Candidate questions include exact dialect/profile/version; required versus tolerated features; read/write/round-trip/historical compatibility direction; unknown-field behavior; source-of-truth and semantic owner; external identity stability; timeout and `UNKNOWN` semantics; reconciliation route; tenant/site/resource scope; units/vector/uncertainty and temporal qualifiers; coexistence/downgrade policy; privacy/trust constraints; and evidence needed for production readiness.

Answers must retain source/respondent/owner, timestamp/effective period, status/confidence, supporting artifact and supersession lineage where material. Missing answers remain dimension-level `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `CONFLICTED`, `BLOCKED`, `DEFERRED` or `Unknown/OpenQuestion`; they do not become a single false completeness score.

Derived Story/Use Case/Scenario/Requirement/Acceptance/Product-Proof candidates remain traceable through `Source/Elicitation Evidence -> Finding/Answer -> Requirement/Constraint -> Story/Use Case/Scenario -> Semantic Model -> Capability/Workflow/Data/etc. -> Acceptance Criterion -> Test/Product Proof -> Runtime Evidence`. Story text alone is not sufficient specification.

## Brownfield / Mirroring lens

A legacy CSV/XML/JSON/API/schema can be syntactically valid while hiding locale, formula, unit, sentinel-null, identity, precedence, manual override, shadow workflow or off-system approval semantics. Observed legacy behavior and successful import therefore remain evidence/candidates, not approved canonical semantics. Historical payload interpretation must be revision/provenance qualified.

## Duplicate-screen result

**0 new local edge scenarios. 0 new cross-capability scenarios. 0 new reusable ConflictPatterns. 0 new ConflictInstances. 0 new preventive invariant candidates.**

Strong candidates reduced to existing families: conformance-versus-semantics; provider/profile qualification; compatibility direction and semantic round-trip loss; presence/null/default/delete; external/canonical identity mapping; ambiguous external effect and reconciliation; currentness/revision coexistence; analytical kind/unit/vector/uncertainty preservation; provenance/qualified-claim boundaries; tenant/site isolation and authority non-amplification; bounded complexity/inconclusive analysis; AI/low-code semantic strengthening; and elicitation false-completeness/critical-gap detection.

No signal is promoted to confirmed conflict. No canonical capability is added.

## Detection/proof candidates retained

No new detector family is justified. Existing candidates remain sufficient when composed: exact dialect/vocabulary/profile qualification; validator-behavior fixtures; directional compatibility and semantic round-trip matrices; unknown-field preservation tests; ABSENT/null/default/delete tests; canonical↔external identity mapping checks; operation-level provider capability matrices; effect reconciliation for `PARTIAL/UNKNOWN`; residual-client/grant/session/cohort telemetry; revision/currentness qualification; tenant/site isolation; unit/vector/uncertainty preservation; bounded resource analysis; and elicitation critical-gap/contradiction detection.

These are research carry-forward proof obligations only, not remediation authority.

## Saturation disposition

- Standards / Interoperability / API Contracts no-material streak: **remains capped at 2**.
- Mandatory clusters: **12/12 already covered; streaks unchanged/capped at 2**.
- Material totals: **284 edge scenarios + 124 ConflictPatterns = 408**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- Full Pass 8 capability coverage after this revisit: **26/28**.
- Completed full passes: **7/8 minimum**.
- Negative-space: `NOT_STARTED`.
- Saturation: `NOT_SATURATED`.
- Planning C: **BLOCKED**.

## Carry-forward and next action

Planning C must eventually decide portable contract/profile semantics, Elicitation Knowledge Base boundaries, provider capability qualification and bounded Physical/Peripheral integration versus specialized control planes. Planning D must preserve dual-version/coexistence/downgrade, provider migration and free-form + structured elicitation coexistence. Planning E must prove adaptive questioning, contradiction/unresolved handling, semantic round-trip preservation, provider/revoke reconciliation, currentness, tenant/site isolation, critical-gap detection and no false `complete` or accidental physical-actuation expansion.

Subject to fresh state/head revalidation, continue Full Pass 8 with **Lifecycle / Versioning / Evolution / Migration**. Challenge valid-time/transaction-time, retroactive correction, in-flight pinned revisions, schema/workflow/runtime/provider/policy/formula/proof coexistence, graph transformation N→N+1, supersession lineage, residual authoritative cohorts, rollback/cutover, Legacy Mirroring coexistence, source-of-truth movement, external user/grant/resource evolution and deprovisioning, structured/free-form elicitation migration, Production Readiness and AI-generated evolution plans. Lifecycle streak is already capped at 2; do not inflate absent material novelty. Do not enter Planning C.