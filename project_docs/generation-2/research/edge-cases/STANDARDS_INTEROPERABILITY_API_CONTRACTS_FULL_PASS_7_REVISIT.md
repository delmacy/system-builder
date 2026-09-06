# Generation 2 — Standards / Interoperability / API Contracts — Full Pass 7 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 7
Disposition: research-only; no remediation, Work Package, TASK, Construction or product-code authority.

## Authority and fresh baseline

This revisit followed `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` as the sole authority for phase/order/gates/current focus/next action. Immediately before research, the branch was `research/g2-capability-pipeline` at `61a274879c79e354a42a3c05b3dd804921d9fdb6`, with Full Pass 7 at 25/28 capabilities and 12/12 mandatory clusters, 6/8 minimum full passes complete, negative-space `NOT_STARTED`, saturation `NOT_SATURATED`, and Planning C blocked.

Required standing artifacts were re-read: `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `edge-cases/ADVERSARIAL_SATURATION_STATE.json`, and the prior Standards Full Pass 6 revisit. The Elicitation & System Understanding methodology is already materialized as a cross-cutting research lens with dedicated taxonomy, traceability and coverage artifacts; this revisit therefore applies that lens rather than duplicating it.

Preserved distinctions: `Research != remediation`; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; `contract conformance != semantic equivalence != authority != business effect`; `provider reported state != physical truth`; `observed behavior != intended process != approved canonical process`; `AI inference = candidate`; `lineage relation != authority != causal proof`; `ExecutionEnvelope != ExecutionState != ExecutionJournal != business truth`.

## Rotated Full Pass 7 attack techniques

The pass deliberately changed attack shape from Full Pass 6 and duplicate-screened all 124 reusable ConflictPatterns through these lenses:

1. **Profile-support vector mutation** — a provider that truthfully advertises a standard/profile was challenged with operation-level support differences, optional facets, conditional features and narrower authorization semantics. A profile label is not a portable capability proof.
2. **Schema-valid semantic erasure** — values remained syntactically/schema valid while dropping quantity kind, unit/currency/timezone, uncertainty kind, decision hit policy, temporal applicability, provenance strength, source-of-truth or external-effect disposition.
3. **Unknown/extension survivorship** — intermediaries were challenged with ignore/preserve/fail behavior for unknown fields, custom vocabularies and problem-detail extensions. Forward compatibility remains representation/path dependent.
4. **Directional compatibility and downgrade** — old/new clients and providers were permuted so read compatibility, write compatibility, preservation compatibility and semantic compatibility could diverge. No symmetric/global compatibility was inferred.
5. **Canonicalization and representation negotiation** — content negotiation, schema format, bindings and generated client models were varied while preserving wire success. Representation agreement is weaker than canonical business-semantic agreement.
6. **Physical/peripheral scope qualification** — SCIM-like user provisioning and OPC UA/ONVIF-like roles/resources were tested so `read`, `provision`, `grant`, `session/broker`, `write/call` and `actuate` cannot collapse into one feature flag. Specialized VMS/access/BMS/PDV/device-control planes remain external/provider-specific by default.
7. **External identity remapping** — stable canonical subject IDs were held constant while external IDs, usernames, node IDs, site IDs, camera/door/resource IDs and provider accounts changed. External identity is mapping evidence, not canonical identity.
8. **Temporal applicability** — contracts/profiles/policies valid at T2 were applied adversarially to historical T1 payloads, in-flight pinned revisions and planned T3 configurations. Current metadata cannot silently reinterpret historical/in-flight semantics.
9. **Effect ambiguity and reconciliation** — successful protocol responses, accepted PATCHes, provider acknowledgements and message correlation were challenged against delayed/partial/unknown domain effects and residual sessions/grants/cohorts.
10. **Pathological negotiation pressure** — deep schema recursion, large extension sets, many profiles/bindings/content types and high-cardinality capability matrices were tested against bounded analyzer/resource budgets. `INCONCLUSIVE`/qualification-required remains preferable to weakened validation.
11. **Elicitation-sufficiency falsification** — a system description was marked apparently complete while omitting version/profile negotiation, unknown-field policy, source-of-truth, authority owner, downgrade semantics, evidence currentness, negative cases, external effect/reconciliation or production-readiness evidence. Coverage must remain dimensioned rather than collapse to a single completeness score.
12. **AI/low-code generation mutation** — generated adapters/contracts remained syntactically valid while strengthening optional provider behavior into mandatory canonical semantics, promoting inferred mappings, dropping extension semantics, or turning read/provision/broker into physical actuation authority.

## Fresh evidence and portable principles

### JSON Schema

Draft 2020-12 explicitly separates vocabularies and `format` annotation from `format` assertion. Structural validation can therefore be insufficient for correct application use, and unsupported required vocabularies can require refusal rather than silent partial interpretation. Unknown/custom semantic keywords cannot be treated as portable semantics merely because a validator accepts the instance.

Portable principle: **schema validity is an input to semantic qualification, not proof of semantic equivalence or operational correctness.**

### OpenAPI / HTTP problem details

OpenAPI 3.1.1 keeps `discriminator` from changing validation outcome and does not make `allOf` a semantic inheritance/ownership proof. RFC 9457 deliberately requires clients to ignore unrecognized Problem Details extension members, which is useful for evolution but means extension-dependent semantics require explicit bilateral qualification when they are material.

Portable principle: **composition/extension mechanics cannot silently carry business authority, ownership or mandatory semantic meaning.**

### AsyncAPI / messaging

AsyncAPI distinguishes application message headers/payload schemas, protocol bindings and correlation identifiers. Correlation is useful for tracing/matching, but does not establish effect identity, authorization, ordering, exactly-once business mutation or causal proof.

Portable principle: **message contract + correlation != domain completion evidence.**

### SCIM provisioning

RFC 7644 supports version-qualified resources, PATCH operations and optional bulk behavior discoverable through provider configuration. This reinforces that interoperability is capability- and provider-qualified: operation presence, concurrency/version behavior and bulk support cannot be inferred from the label `SCIM compatible` alone.

Portable principle: **identity provisioning must carry operation support, identity mapping, version/currentness, failure disposition and reconciliation semantics.**

### OPC UA / physical-provider boundary

OPC UA explicitly separates authentication from authorization, maps Roles to Permissions and allows permissions/access restrictions to vary by node, session/application and implementation support. Servers may implement none, part or all of role-management mechanisms.

Portable principle: **standard role/profile support does not imply equivalent read/write/call authority across providers/resources.** This directly supports the bounded Physical/Peripheral integration plane: SB may model identities, grants, inventory, telemetry and brokered sessions while specialized control remains provider-side unless a later Planning C decision explicitly admits an actuation capability with safety/authority proofs.

## Elicitation & System Understanding lens

For Standards/API boundaries, the Knowledge Base must be able to route adaptive questions such as:

- Which exact profile/dialect/version is required and which is merely accepted?
- Is compatibility required for read, write, round-trip preservation, historical replay or all of them?
- What happens to unknown fields/extensions, and which are semantically critical?
- Who owns canonical meaning when provider-native identifiers/roles/features differ?
- Is protocol success evidence of request acceptance only, or of effective external state?
- Which operations are read/query, provisioning, grant/revoke, broker/session, write/call or physical actuation?
- What is the source-of-truth and reconciliation route for `PARTIAL/UNKNOWN`?
- What units, uncertainty, temporal revision and provenance qualifiers must survive the boundary?
- Which old/new clients/providers coexist, and what downgrade paths are forbidden?
- What evidence proves production readiness, deprovisioning/revoke convergence, no cross-site/tenant leakage and no silent semantic loss?

Missing answers should remain `OpenQuestion`, `Unknown`, `Conflict` or dimension-level `PARTIAL/BLOCKED`, not be auto-promoted to `Requirement RESOLVED` or global `complete`.

## Legacy Mirroring lens

Brownfield sources may expose valid CSV/XLSX/JSON/XML/API representations while carrying locale, unit, formula, hidden-rule, identity and source-precedence semantics not expressible in the transport schema. A successful import/adapter conformance result therefore cannot promote inferred mappings or observed legacy behavior to canonical truth. Historical payloads must remain revision/provenance qualified; recomputation with current formulas/contracts is not assumed safe.

## Typed semantic graph / execution model disposition

No target architecture is selected. Standards/API evidence remains consistent with the existing hypothesis that portable semantics may benefit from typed relations carrying revision, validity, provenance strength, quantity/analytical kind, authority/source-of-truth and provider qualification. PostgreSQL relational graph remains the baseline hypothesis; this revisit produced no evidence requiring GraphDB. Canvas/Fleet remain projections/read-analysis surfaces, not authority.

`CapabilityUse/Invocation`, `ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal`, external provider state and physical/business truth remain distinct. Inter-system continuity remains contract-versioned federation between autonomous systems without mandatory shared mutable state.

## Duplicate-screen result

**0 new local edge scenarios. 0 new cross-capability scenarios. 0 new reusable ConflictPatterns. 0 new ConflictInstances. 0 new preventive invariant candidates.**

Strong candidates reduced to existing families:

- profile label / optional facet / provider support overclaim -> conformance-semantics, provider qualification and capability-negotiation families;
- schema-valid semantic erasure -> conformance-semantics, analytical-kind, presence, provenance and qualified-claim families;
- unknown extension loss -> compatibility-direction/currentness/semantic-loss families;
- protocol acknowledgement -> canonical effect -> ambiguous-effect/reconciliation and proof-claim conflation families;
- SCIM/OPC/ONVIF support -> universal read/write/actuation authority -> authority amplification/provider false-equivalence families;
- external IDs promoted to canonical identity -> identity-mapping/semantic-ownership families;
- current profile applied to historical/in-flight traffic -> temporal/currentness/revision coexistence families;
- AI-generated syntactic contract silently dropping required semantics -> AI/low-code composition + conformance/authority families;
- elicitation marked complete without owner/currentness/failure/negative-case evidence -> existing false-completeness/qualified-evidence/ownership gaps already carried by the elicitation research lens.

No signal is promoted to confirmed conflict.

## Detection candidates / proof obligations

No new detector family is justified. Existing candidates remain sufficient when composed: profile/dialect/vocabulary intersection checks; directional compatibility matrices; semantic round-trip/differential corpora; unknown-field preservation tests across actual representation paths; operation-level provider capability matrices; currentness/revision qualification; canonical↔external identity mapping checks; source-of-truth/authority qualification; unit/quantity/uncertainty preservation; exact-vs-inferred lineage checks; `PARTIAL/UNKNOWN` effect reconciliation; residual-client/grant/session/cohort telemetry; bounded complexity analysis; cross-tenant/site isolation checks; and elicitation critical-gap detection.

Proof obligations remain future Planning C/D/E inputs, not implementation authority.

## Saturation disposition

- Standards / Interoperability / API Contracts local no-material streak: **remains capped at 2**.
- Mandatory clusters: **12/12 already covered; streaks unchanged/capped at 2**.
- Material totals: **284 edge scenarios + 124 ConflictPatterns = 408**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- Full Pass 7 capability coverage after this revisit: **26/28**.
- Completed full passes: **6/8 minimum**.
- Negative-space: `NOT_STARTED`.
- Saturation: `NOT_SATURATED`.
- Planning C: **BLOCKED**.

## Carry-forward

Planning C must eventually consume qualified contract/profile semantics, provider capability matrices, physical integration/control-plane boundaries, Legacy Mirroring semantic preservation, and the Elicitation Knowledge Base model without promoting this revisit to a canonical capability change. Planning D must preserve coexistence/migration/downgrade and structured+free-form elicitation coexistence. Planning E must include proofs for adaptive question routing, contradiction/unresolved handling, contract semantic preservation, provider/revoke reconciliation, currentness, tenant/site isolation, and no false `complete`/no accidental actuation expansion.

## Next-action candidate

Subject to immediate fresh state/head revalidation before persistence, continue Full Pass 7 with `Lifecycle / Versioning / Evolution / Migration`. Carry temporal/provenance/decision/units/vector/uncertainty/graph-revision, Legacy Mirroring, bounded Physical/Peripheral integration-plane, Operability Elicitation and Elicitation & System Understanding lenses. Challenge revision coexistence, supersession/correction, historical reinterpretation, migration/cutover, residual authoritative cohorts, rollback eligibility, bilateral provider/client migration, source-of-truth movement, permission/grant lifecycle, external resource identity evolution, structured elicitation migration, and AI-generated evolution plans. Lifecycle streak is already capped at 2; do not inflate absent material novelty. Do not enter Planning C.