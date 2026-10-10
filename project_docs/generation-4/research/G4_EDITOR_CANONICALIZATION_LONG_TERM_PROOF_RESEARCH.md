# G4 — Editor Canonicalization Migration & Long-Term Proof Preservation Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

Continuation of the proprietary-editor Shared Editor Foundation research, especially `G4_EDITOR_TRUST_ROLLOVER_PROOF_LONGEVITY_RESEARCH.md`. This round studies what happens when the bytes/serialization/schema used to bind evidence change over time, and how timestamp/notary/transparency evidence can preserve long-lived proof claims without confusing byte continuity, semantic continuity or current admissibility.

This is P&D documentation only. It creates no implementation, provider, WBS, Work Package, Sprint or TASK authority. The current interface program remains `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`; 3D remains optional.

## External pattern evidence reviewed

- RFC 8785 (JSON Canonicalization Scheme) exists because hashing/signing require an invariant representation; it constrains JSON and deterministic property ordering to create repeatable hashable bytes.
- W3C RDF Dataset Canonicalization similarly normalizes graph datasets so independently represented graphs can be compared, hashed and signed.
- RFC 3161 timestamps a message imprint and binds it to a time/policy; the timestamp authority does not interpret the underlying semantic object merely because it timestamps its digest.
- RFC 4998 Evidence Record Syntax explicitly addresses decades-long evidence, distinguishes timestamp renewal from hash-tree renewal, and requires access to archived objects when the hash binding itself must be renewed.
- RFC 9162 Certificate Transparency provides useful patterns for append-only Merkle commitments, inclusion proofs and consistency proofs, while explicitly warning that inconsistent views/equivocation are a separate concern.

These are pattern evidence only. No canonicalization, timestamp, transparency-log, cryptographic suite or provider is selected by this research.

## F117 — Canonicalization identity is part of proof provenance, not semantic identity

A proof cannot safely record only `hash(subject)`. It needs the exact transformation that produced the hashed bytes.

Candidate research contract:

```text
CanonicalBinding
  semanticSubjectRef
  sourceSchemaRef
  canonicalizationProfileRef
  canonicalizationProfileVersion
  canonicalBytesDigestSet[]
  canonicalizationEvidenceRef?
  generatedAt
```

`same semantics != same bytes` and `same bytes != same semantics`.

A canonicalization profile/version therefore belongs in provenance. It must not become the identity of the business claim itself.

## F118 — Schema migration and canonicalization migration are distinct

A schema may change while canonical bytes remain transformable, or a canonicalization algorithm may change while the semantic schema does not. The foundation should represent separately:

```text
SemanticSchemaMigration
CanonicalizationProfileMigration
StorageEncodingMigration
CryptographicProfileMigration
```

Collapsing these into `format version changed` would make it impossible to say what was actually preserved.

`schema compatibility != canonical-byte equivalence`.

## F119 — Long-lived proof migration needs an explicit bridge, never silent re-hashing

When an old subject is migrated to a new schema/canonicalization, a new digest over the migrated representation does not prove by itself that it means the same thing as the old object.

Candidate:

```text
CanonicalizationBridgeEvidence
  predecessorBindingRef
  successorBindingRef
  transformationRef
  transformationVersion
  semanticPreservationClaim
  verifierQualificationRef
  sourceMaterialAvailability
  disposition = PROVEN | PARTIAL | DISPUTED | IMPOSSIBLE | UNKNOWN
```

`old digest + new digest != proof of semantic equivalence`.

Where semantics cannot be proven equivalent, both historical representations remain independently interpretable and the bridge stays PARTIAL/UNKNOWN rather than fabricating continuity.

## F120 — Proof renewal has at least three materially different modes

The previous distinction between cryptographic renewal and semantic requalification needs one more axis:

1. `TIMESTAMP_RENEWAL`: protects predecessor evidence without re-reading/re-canonicalizing the subject where the binding hash remains acceptable.
2. `BINDING_RENEWAL`: re-reads retained source material and binds it under a new hash/canonicalization profile.
3. `SEMANTIC_REQUALIFICATION`: re-evaluates the actual semantic claim under a qualified verifier/policy.

RFC 4998 provides a strong analogue: timestamp renewal can cover prior timestamp evidence, while hash-tree renewal requires access to archived data objects again.

`timestamp renewal != binding renewal != semantic requalification`.

## F121 — Timestamp evidence proves bounded existence/order claims, not semantic correctness

A timestamp over an imprint can support a claim such as `this committed representation existed no later than T under policy P`. It does not prove that the representation was semantically correct, authorized, current or effective.

```text
TemporalAttestation
  subjectBindingRef
  imprintRef
  authority/trustDomainRef
  policyRef
  assertedTime
  verificationEvidenceRefs[]
  disposition
```

`timestamped != semantically valid != authorized != effective`.

This prevents Preview, Revision/Diff or Evidence UI from turning a trusted timestamp into a business-truth badge.

## F122 — Transparency evidence and timestamp evidence answer different questions

An append-only transparency structure can prove inclusion and consistency relative to a signed tree state. A timestamp can establish a time-bound commitment. Neither alone proves universal non-equivocation, current admissibility or business semantics.

Candidate evidence kinds:

`TIME_COMMITMENT`, `LOG_INCLUSION`, `LOG_CONSISTENCY`, `WITNESS_OBSERVATION`, `SEMANTIC_QUALIFICATION`.

`included in log != semantically accepted`.

RFC 9162 is especially useful adversarial evidence: append-only Merkle consistency does not by itself prevent a malicious log from presenting inconsistent views to different clients.

## F123 — Proof envelopes need a representation lineage, not one mutable canonical form

Extend the existing `ProofEnvelope` research with:

```text
representationLineage[]
  semanticSnapshotRef
  schemaRef
  canonicalizationProfileRef
  digestSet[]
  predecessorRepresentationRef?
  bridgeEvidenceRef?
  timestamp/transparencyEvidenceRefs[]
```

Historical verification uses the representation/profile actually bound at the time. New tooling may project a migrated representation, but cannot overwrite the historical binding.

`latest canonicalization != historical canonicalization`.

## F124 — Retention can make canonicalization migration impossible without invalidating history

If payload/source material was legitimately erased and only predecessor proof material survives, a future binding renewal may be impossible. That state is representable:

`HISTORICALLY_VERIFIABLE`, `MIGRATABLE`, `MIGRATION_REQUIRED`, `MIGRATION_IMPOSSIBLE`, `UNKNOWN`.

An old proof can remain historically interpretable even when it cannot be migrated to a new canonicalization profile. Conversely, a surviving digest cannot reconstruct erased semantics.

`migration impossible != historical proof false`.

## F125 — Schema evolution can alter semantic projection while preserving raw source bytes

The inverse risk also matters. Retaining identical bytes does not guarantee identical meaning if the schema/interpreter changed. Therefore proof verification must pin the normative schema/semantic snapshot used to interpret those bytes.

Example: an enum value, omitted field default, unit, timezone or permission meaning changes while stored JSON bytes remain identical. Historical interpretation must use the old semantic contract.

`byte equality != semantic equality`.

## F126 — Revision/Diff needs a Representation/Proof Migration projection

Revision/Diff should be able to explain:

- semantic schema changed;
- canonicalization profile changed;
- source bytes changed / unchanged;
- predecessor/successor digests;
- bridge proof status;
- timestamp renewal versus binding renewal;
- retained/deleted source-material coverage;
- affected proof envelopes and publish bundles;
- current versus historical admissibility.

This is a projection over Evidence/Trust/Revision semantics, not ownership transfer to Revision/Diff.

## F127 — Shared editors must expose proof-currentness degradation without blocking unrelated editing

A component/form/workflow can remain editable while some historical proof requires renewal. Shared editor state must distinguish `artifact editable`, `publish admissible`, `proof historically verifiable`, and `proof renewable`.

Therefore `BLOCKED` remains operation-scoped. A blocked publish does not imply disabled editing, and legacy proof status does not imply permission denial.

`BLOCKED != DISABLED`; `READ_ONLY != PERMISSION_DENIED` remain preserved.

## F128 — Preview/Sandbox must pin schema + canonicalization assumptions

Preview evidence must name the semantic schema revision and canonicalization/binding assumptions it exercised. A preview using migrated fixtures cannot silently satisfy evidence requirements for the historical representation, and a preview under old semantics cannot prove the new schema migration.

`preview representation compatibility != runtime semantic continuity`.

## Semantic bridge impact

The cross-app chain becomes:

```text
Workflow/View/Form/Component/Rule revision
 -> typed semantic bindings
 -> immutable semantic snapshot
 -> schema + canonicalization binding
 -> digest/signature/timestamp/transparency evidence
 -> qualified verifier/trust revision
 -> PublishBundle authorization
 -> runtime EffectOccurrence
 -> effect verification / retention / renewal
 -> Revision/Diff representation lineage
```

Ownership remains separated: editors own their artifact semantics; canonicalization produces a representation; trust/evidence qualifies proof; Permission/Policy owns authority; runtime evidence owns observed effect claims; Revision/Diff only projects lineage.

## Required scenarios / adversarials

1. Property order changes but semantics do not: canonical profile should prevent meaningless digest drift where its contract supports that normalization.
2. Unicode/number handling changes between serializers: do not call representations equivalent without the pinned canonicalization profile.
3. Schema v2 renames a field with proven semantics-preserving transformation: bridge can qualify continuity without rewriting the v1 historical binding.
4. Schema v2 changes an omitted-field default: identical source bytes can have different meaning; semantic equivalence must not be inferred.
5. Old canonicalization profile is retired but source payload survives: binding renewal may create a successor representation with explicit bridge lineage.
6. Old profile is retired and source payload was legitimately deleted: report migration impossible/historical-only according to policy.
7. Timestamp is valid but semantic verifier later finds the claim wrong: timestamp remains evidence of existence/time, not correctness.
8. Transparency inclusion exists but two clients observe inconsistent tree views: inclusion alone does not establish global non-equivocation.
9. New digest is computed over migrated data but transformation provenance is missing: successor digest does not prove continuity.
10. Preview passes against schema v3 while production bundle is pinned to v2: preview evidence is not silently portable.
11. Component Editor displays a stale proof badge while editing remains allowed: publish qualification, not generic UI enablement, decides the block.
12. Revision/Diff compares v1 and v3 through an unproven v1->v2 bridge: transitive continuity remains UNKNOWN/PARTIAL rather than assumed.
13. Timestamp renewal succeeds before TSA/key retirement while semantic payload is unavailable: temporal continuity can survive without pretending semantic requalification.
14. Hash binding algorithm becomes weak: renewal requiring source data cannot be replaced by timestamping only the weak digest and calling it equivalent.
15. Responsive UI hides advanced evidence panels: migration/currentness blocker and keyboard path to its explanation remain reachable.

## Reusable primitives and editor integration

### Shared primitive

- `CanonicalizationProfileRef`, `SchemaRevisionRef`, `CanonicalBindingRef`, `RepresentationLineageRef`, `TemporalAttestationRef`, migration/bridge disposition badges.

### Editor infrastructure

- Representation Lineage browser;
- semantic/canonicalization diff facets;
- proof-migration findings and affected-set projection;
- Binding Browser support for pinned schema/canonicalization identity;
- Preview evidence manifest extensions;
- keyboard/non-drag navigation through predecessor/successor proof lineage.

### Proprietary apps

- Workflow Designer: pins workflow semantic revision and evidence requirements; event-log serialization does not redefine workflow meaning.
- Componentes: pins component schema/variant semantics and exposes migration/evidence state without duplicating semantic identity per view.
- View/Page and Form Builder: schema/binding migration findings remain separate from visual diff.
- Rules/Decision: expression/rule semantics must be pinned independently from source-text serialization.
- System/Module Designer: dependency manifests can require representation/semantic profiles without owning their trust.
- Elicitation: may propose migration/remediation, never assert semantic equivalence by itself.
- Preview/Sandbox: pins schema/canonicalization fixtures and substitutions.
- Revision/Diff: primary projection for representation lineage and bridge evidence.

### Cross-app semantic integration

Highest complexity remains P3: preserving semantic identity across independently versioned artifacts while schema, canonicalization, crypto, trust, retention and runtime evidence evolve on different clocks.

## Componentization / complexity

- **P0 LOW/MEDIUM — shared primitives:** schema/profile refs, migration/currentness badges, timestamp/inclusion evidence labels.
- **P1 MEDIUM/HIGH — editor infrastructure:** Representation Lineage, proof migration findings, semantic/canonicalization diff facets, Preview evidence manifest.
- **P2 HIGH/VERY HIGH — proprietary adapters:** artifact-specific schema transformations, binding compatibility, rule/workflow semantic interpretation.
- **P3 EXTREME — cross-app integration:** qualified semantic bridges, historical verification after source erasure, transitive migration chains, trust/time/transparency composition, bundle-wide proof currentness.

State explosion hotspot: `artifact revision × schema revision × canonicalization profile × digest profile × verifier/trust revision × retention state × environment × proof claim`. The UI must summarize qualified states and permit drill-down rather than materialize this Cartesian product as component variants.

## Componentes metadata candidates — delta

```text
semanticSchemaRequirementRefs[]
canonicalizationProfileRequirementRefs[]
representationBridgeRequirementRefs[]
temporalEvidenceRequirementRefs[]
proofMigrationPolicyRef?
historicalRepresentationRequirement?
```

These augment existing evidence/currentness/trust metadata; they do not create a second component identity.

## Proof obligations

1. Historical proof verification reproduces the exact schema/canonicalization interpretation originally bound where retained evidence permits.
2. Re-hashing a migrated representation never proves semantic equivalence without qualified bridge evidence.
3. Byte equality never substitutes for semantic equality when interpretation contracts changed.
4. Timestamp validity cannot manufacture semantic correctness, authority or runtime effect.
5. Transparency inclusion/consistency cannot silently manufacture universal non-equivocation.
6. Timestamp renewal, binding renewal and semantic requalification remain distinguishable in lineage and UI.
7. Source erasure that makes migration impossible remains explicit; no digest reconstructs deleted semantics.
8. Transitive representation migration propagates PARTIAL/UNKNOWN when any required bridge is unproven.
9. Preview evidence is pinned to schema/canonicalization assumptions and cannot silently satisfy a different runtime/publish profile.
10. Proof-currentness blockers are operation-scoped and do not collapse BLOCKED/DISABLED/READ_ONLY/PERMISSION_DENIED.
11. Every lineage/migration action and explanation has keyboard/non-drag access with semantic focus restoration.
12. Revision/Diff exposes semantic, representation, crypto and trust changes as separate facets rather than one generic `changed` flag.

## Research maturity / saturation

`EDITOR_CANONICALIZATION_LONG_TERM_PROOF = ADVANCED_EMERGING / MATERIAL_DELTA`.

High-confidence conclusions:

- canonicalization profile/version is proof provenance, not business semantic identity;
- schema migration, canonicalization migration and cryptographic migration are distinct;
- long-lived proof renewal separates timestamp renewal, binding renewal and semantic requalification;
- timestamp/transparency evidence proves bounded properties and cannot manufacture semantic truth;
- historical representations remain immutable lineage nodes rather than being overwritten by latest canonical form;
- retention can legitimately make migration impossible without making historical proof false;
- shared editor infrastructure can project representation lineage without owning artifact semantics.

Remaining material gaps:

1. bounded trust-fork reconciliation authority/quorum models across Factory, Client and offline runtimes;
2. qualified semantics for transitive bridge composition across long migration chains and partial source retention;
3. user-facing blast-radius prioritization for mass representation/proof migration;
4. empirical scale budgets for proof-lineage and bridge indexes;
5. exact policy for independent timestamp/transparency witnesses without creating mandatory central online authority.

Next vector: bounded trust-fork reconciliation across Factory/Client/offline runtimes, with explicit authority, quorum/currentness and recovery semantics. Research remains non-executable.
