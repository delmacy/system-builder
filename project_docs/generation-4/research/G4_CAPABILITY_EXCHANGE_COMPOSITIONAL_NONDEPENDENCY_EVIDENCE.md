# G4 Capability Exchange — Compositional Non-Dependency Evidence Across Opaque Boundaries

Date: 2026-09-21
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Generation 4 product R&D only
Implementation authority: NONE

## 1. Research question

This consolidation extends the existing dependency-lineage soundness and opaque non-dependency evidence work into the next unresolved problem:

> When a protected guarantee crosses multiple independently owned, partially opaque or privacy-redacted capability boundaries, under what conditions may a consumer safely compose claims that a candidate influence cannot affect that guarantee?

The target is not a global dependency oracle and not a shared business model. The target is an implementation-independent algebra for carrying qualified negative evidence through autonomous boundaries without converting local attestations into global semantic authority.

This document preserves the G4 constitutional boundaries:

- `G3 semantic decision != G4 technology binding`;
- `Research candidate != implementation authority`;
- `Shared primitives != shared business ownership`;
- `Logical Exchange Plane != single broker`;
- `Exchange Plane owns exchange semantics; capability owns business semantics`;
- `Interface compatibility != contract compatibility`;
- `Driver may normalize mechanism but must not fabricate semantic equivalence`;
- `Builder != Runtime`.

## 2. Evidence base

Primary/standards and mature architecture evidence used in this round:

1. **IETF RFC 9334 — Remote ATtestation procedureS (RATS) Architecture**: separates Evidence, Endorser, Reference Values, Verifier, Appraisal Policy, Attestation Result and Relying Party; explicitly supports composite devices and layered environments in which evidence can be collected and appraised through nested boundaries. <https://www.rfc-editor.org/rfc/rfc9334.html>
2. **IETF RFC 9711 — Entity Attestation Token (EAT)**: provides structured attestation claims and freshness concepts; useful as evidence that appraisal output and underlying evidence can be distinct artifacts with different disclosure surfaces. <https://www.rfc-editor.org/rfc/rfc9711.html>
3. **W3C PROV-DM / PROV-O**: provenance is graph-shaped; derivation, attribution, association, specialization and bundles can be represented without collapsing all producers into one authority. Bundles provide a useful benchmark for provenance-about-provenance and independently asserted provenance. <https://www.w3.org/TR/prov-dm/> and <https://www.w3.org/TR/prov-o/>
4. **SPIFFE Federation**: trust domains exchange independently rooted trust bundles; federation does not collapse identities or roots into a single global trust domain. This is a useful operational benchmark for domain-qualified evidence composition. <https://spiffe.io/docs/latest/architecture/spiffe-federation/>
5. **in-toto specification / Attestation Framework**: supply-chain steps produce signed statements about subjects, materials/products and predicates; layouts/policies constrain who may perform steps and what relationships are expected. It is evidence that provenance can be composed from independently produced signed claims while retaining signer/predicate identity. <https://in-toto.io/> and <https://github.com/in-toto/attestation>
6. **SLSA provenance requirements**: dependency completeness and provenance authenticity are distinct properties; a signed or authentic provenance record does not itself prove that every relevant dependency was enumerated. <https://slsa.dev/spec/v1.0/requirements>
7. **Nix `allowedReferences` / `allowedRequisites`**: negative closure checks can exclude unauthorized runtime references/requisites for a specific mechanism, but do not establish universal semantic non-dependence. <https://releases.nixos.org/nix/nix-2.24.0/manual/language/advanced-attributes.html>
8. **W3C Verifiable Credentials Data Model 2.0**: data minimization/selective disclosure is compatible with verification; full disclosure is not a prerequisite for every relying decision. This is a privacy benchmark, not a dependency-proof mechanism. <https://www.w3.org/TR/vc-data-model-2.0/>

The evidence supports the architecture-independent principle that composition must preserve claim scope, verifier/appraisal identity, trust domain, freshness and coverage; it does **not** justify choosing RATS, EAT, W3C PROV, SPIFFE, in-toto, SLSA, Nix, VC, a ZK system or any particular broker/provider for System Builder.

## 3. Material delta

Previous work established:

- `dependency list present != dependency set complete`;
- `dependency not disclosed != qualified non-dependency`;
- `proof valid != claim currently admissible`;
- `attestation authority != semantic authority`;
- a privacy-preserving proof can establish a predicate without disclosing the underlying dependency graph, but cannot manufacture completeness of that graph.

This round adds the missing composition rule:

> **Local non-dependency claims compose only over an explicitly compatible influence universe, derivation path, coverage shape, trust/appraisal basis and currentness interval.**

Therefore:

`A excludes X -> B excludes X -> C excludes X`

is **not**, by itself, a proof that `X cannot influence G(A,B,C)`.

Composition can fail because:

- one boundary's `X` denotes a different semantic subject/revision;
- one proof excludes only direct data flow while another includes control/configuration/environment influence;
- an alternative derivation bypasses the attested path;
- a join introduces a new dependency not present in either branch;
- a translator/adapter performs a lossy transformation;
- a verifier/appraisal policy is not admissible in the consuming trust domain;
- one claim expired or fell below a security/profile floor;
- one opaque producer proves absence from a disclosed set whose completeness is itself unqualified;
- the root guarantee depends on a property that no child claim actually covers.

The root consumer must therefore compose **qualified propositions**, not boolean PASS values.

## 4. Candidate composition model

A candidate negative-evidence proposition is modeled conceptually as:

`N = <subject, protectedGuarantee, excludedInfluence, influenceUniverse, coverageShape, derivationScope, semanticProfile, trustDomain, appraisalBasis, evidenceAuthority, validInterval/currentness, limitations>`

This is a research vocabulary, not a schema commitment.

A root capability may derive `NON_DEPENDENT` only when all material paths from the candidate influence to the protected guarantee are either:

1. covered by compatible qualified non-dependency evidence; or
2. excluded by an independently qualified structural/confinement argument; or
3. proven irrelevant by the root guarantee's own contract.

If a material path remains opaque, alternative, expired, incompatible or semantically unresolved, the root disposition remains `UNKNOWN`, `REQUALIFY` or `REBUILD_REQUIRED` according to the local contract. The Exchange Plane may carry this evidence and its qualifications but does not decide the business guarantee.

### 4.1 Composition is path-sensitive

A dependency DAG may contain:

`A -> B -> D`

and

`A -> C -> D`.

Evidence that the B path excludes influence `X` says nothing about the C path. Composition is valid only over the complete material path set for the protected guarantee.

`one clean path != clean derivation`.

### 4.2 Composition is universe-sensitive

Two claims can both say "no dependency on X" while quantifying different universes:

- Claim 1: no filesystem dependency on X;
- Claim 2: no network dependency on X;
- Root guarantee: no semantic influence from X through filesystem, network, environment, generated code or control flow.

The claims are not interchangeable. A root proof may take the intersection of what is actually established, never the union of what consumers hoped was established.

`coverage composition cannot strengthen coverage`.

### 4.3 Composition is freshness-sensitive

A chain is no fresher than the material evidence required by the root proposition. A proof generated yesterday may remain cryptographically valid while its appraisal policy, trust root, plugin revision or semantic profile has become inadmissible.

`chain validity != chain current admissibility`.

No synthetic global timestamp is required. Each material claim retains its own currentness dimensions and the root applies the contract-specific admissibility rule.

### 4.4 Composition is trust-domain-sensitive

SPIFFE federation provides a useful analogy: independent trust domains can recognize each other's identities without becoming one trust domain. G4 should preserve the same separation for evidence.

`federated evidence != merged authority`.

A consumer may accept an attestation from another domain under a local relying policy. The foreign verifier does not thereby become semantic authority over the consumer's business guarantee.

### 4.5 Composition is derivation-sensitive

W3C PROV bundles are a useful benchmark for keeping provenance assertions attributable to their asserting context. G4 should similarly avoid flattening independently asserted evidence into an unattributed global graph.

A derived root evidence object should retain enough lineage to answer:

- which child propositions were used;
- which semantic profiles/revisions they bound;
- which verifier/appraisal/trust basis qualified them;
- which coverage shapes were intersected;
- which unresolved/opaque paths remain;
- which root rule performed the composition.

This enables selective invalidation without requiring disclosure of hidden dependency internals.

## 5. Alternative derivations and joins

Opaque-boundary composition becomes unsafe if the model assumes one derivation when the producer may choose among several.

Candidate rule:

> A non-dependency claim is qualified against a declared derivation scope or derivation family; provider substitution, optimization, fallback, generated-code path, feature flag or runtime mode that changes the material derivation invalidates/requalifies the claim unless explicitly covered.

For joins, branch-local non-dependency is insufficient when the join predicate itself introduces dependence. Examples include:

- ordering/timing-sensitive joins;
- threshold/quorum logic;
- conflict-resolution rules;
- latest-wins policies;
- cross-branch identity resolution;
- authorization/classification intersection;
- compensation/settlement logic.

`branch independence != join independence`.

The join contract is itself a semantic derivation step and must contribute evidence.

## 6. Opaque chains and privacy-preserving aggregation

The consumer does not necessarily need the internal dependency graph of every provider. It needs enough evidence to determine whether the required proposition is established.

A privacy-preserving chain may therefore expose:

- stable semantic subject/profile identifiers scoped to the interaction;
- a coverage shape rather than private node names;
- a commitment/proof/attestation reference rather than raw dependency contents;
- verifier/appraisal-policy identity;
- trust-domain identity;
- currentness/freshness limits;
- explicit limitations and unresolved classes.

However:

`aggregate proof != aggregate completeness`.

Even if multiple proofs are cryptographically aggregated, the root must still establish that the union of material derivation paths and influence classes is covered. Cryptographic aggregation may reduce proof size or disclosure; it does not perform semantic coverage reasoning automatically.

Privacy also constrains identifiers. Stable global commitments, proof handles or opaque component identifiers can become correlation handles. Candidate evidence references should therefore support purpose/tenant/trust-domain scoping or rotation where global linkability is unnecessary.

## 7. Composition operators — candidate research algebra

The following operators are conceptual only.

### `QUALIFY(N, P)`

Checks whether proposition `N` is admissible under relying policy `P`: semantic identity, trust/appraisal basis, security/profile floor, currentness and limitations.

### `INTERSECT_COVERAGE(N1...Nn)`

Computes only the coverage established by all propositions needed for the root path. It must never promote `PARTIAL` or `OPAQUE` to `COMPLETE`.

### `COMPOSE_PATH(N1...Nn)`

Composes compatible propositions along one material derivation path while retaining provenance of each contributing claim.

### `CLOSE_PATH_SET(paths, G)`

Determines whether every material path relevant to protected guarantee `G` is qualified, structurally excluded or contractually irrelevant. Missing paths produce `UNKNOWN`, not success.

### `DERIVE_ROOT(G, evidenceSet, rule)`

Produces root evidence under capability-local semantic authority. The derivation rule and its inputs remain inspectable/replayable enough for later invalidation and requalification.

These operators deliberately avoid a boolean global oracle.

## 8. Proof obligations

Candidate proof obligations added/refined by this round:

1. **PO-CNE-01 — Subject identity preservation:** composed claims refer to the same qualified semantic subject/revision or declare a valid translation relation.
2. **PO-CNE-02 — Influence-universe compatibility:** composition never treats differently scoped influence universes as equivalent.
3. **PO-CNE-03 — Coverage non-amplification:** composition cannot claim coverage stronger than the evidence actually establishes.
4. **PO-CNE-04 — Material-path closure:** every material derivation path for the protected guarantee is covered, excluded or explicitly irrelevant before `NON_DEPENDENT` is derived.
5. **PO-CNE-05 — Alternative-derivation qualification:** fallback/provider substitution/optimization/generated-code/feature-mode alternatives are included or force requalification.
6. **PO-CNE-06 — Join qualification:** branch-local independence does not bypass dependencies introduced by join/merge/conflict/settlement logic.
7. **PO-CNE-07 — Trust-domain preservation:** evidence federation does not merge trust roots or semantic authority.
8. **PO-CNE-08 — Appraisal identity preservation:** verifier and appraisal-policy identity survive composition where material.
9. **PO-CNE-09 — Currentness preservation:** cryptographic validity cannot override expired/revoked/below-floor semantic or security admissibility.
10. **PO-CNE-10 — Opaque-state preservation:** `OPAQUE`, `PARTIAL`, `UNKNOWN` and limitation metadata cannot disappear during aggregation.
11. **PO-CNE-11 — Root authority locality:** only the owning capability/contract can decide whether composed evidence satisfies its business guarantee.
12. **PO-CNE-12 — Exchange-plane non-authority:** routing/carrying/validating envelope mechanics cannot turn the Exchange Plane into a semantic oracle.
13. **PO-CNE-13 — Provenance of derivation:** root evidence retains references to contributing claims and the composition rule sufficient for selective requalification.
14. **PO-CNE-14 — Selective invalidation:** supersession of one material child claim invalidates/lower-qualifies only derived claims whose proof lineage depends on it.
15. **PO-CNE-15 — Privacy boundedness:** composition does not require disclosure beyond the minimum needed by the relying policy, while redaction never fabricates completeness.
16. **PO-CNE-16 — Correlation boundedness:** proof/evidence identifiers do not become unnecessary global correlation handles.
17. **PO-CNE-17 — Completeness independence:** signature, ZK validity, attestation authenticity or proof aggregation never substitutes for dependency/path completeness qualification.
18. **PO-CNE-18 — Translation explicitness:** adapters translating evidence vocabularies declare lossy/non-equivalent mappings; unsupported semantics remain incompatible/unknown.
19. **PO-CNE-19 — Offline autonomy:** a runtime with locally sufficient qualified evidence closure may continue according to declared horizons without a mandatory central verifier/Builder/exchange service.
20. **PO-CNE-20 — Failure representability:** verifier outage, missing child proof, stale claim, incompatible coverage or unresolved alternative remains representable without false success.

## 9. Mandatory adversarial cases

1. B and C each return `PASS`; A assumes global non-dependence although their influence universes differ.
2. One provider proves no filesystem dependency while silently using network configuration.
3. An aggregate proof hides that one branch is `OPAQUE`.
4. A foreign verifier is trusted for device integrity but its result is reused as business semantic authority.
5. A valid old proof survives after a plugin revision adds a new external lookup.
6. Provider failover selects an alternative derivation not covered by the original claim.
7. Feature flag changes generated code while semantic interface remains identical.
8. Two clean branches are joined by latest-wins logic that introduces clock/currentness dependence.
9. Threshold/quorum join introduces membership dependence absent from branch proofs.
10. Adapter maps two distinct coverage classes into one generic `complete=true` field.
11. ZK aggregation proves all supplied predicates but one material path was never supplied.
12. Signed provenance authenticates an incomplete dependency set and is treated as completeness proof.
13. Stable opaque proof handle becomes a cross-tenant correlation identifier.
14. One trust domain rotates/revokes its verifier key; cached aggregate remains cryptographically parseable and is falsely treated as current.
15. Root evidence loses child appraisal-policy identities during compaction.
16. Exchange gateway caches a root `PASS` after one child proof is superseded.
17. Local in-process optimization bypasses a boundary where the distributed path would have required qualification.
18. A central verifier outage blocks autonomous runtime operation despite locally sufficient evidence closure.
19. Redaction removes the only marker indicating that runtime-data dependencies were outside coverage.
20. A composition engine treats missing evidence as logical negation rather than `UNKNOWN`.
21. Two independent attestations cover the same path, giving an illusion of diversity while another path is uncovered.
22. A provider exposes a new version under the same interface and same schema but changes appraisal assumptions.
23. A join depends on tenant/classification context lost by one branch's privacy-preserving proof.
24. Evidence compaction retains only root result and destroys the lineage needed for later selective invalidation.

## 10. Relationship to Shared Semantic Kernel and Capability Exchange Plane

### Shared Semantic Kernel candidate scope

The kernel may need only extremely stable structural primitives sufficient to refer to:

- semantic subjects/revisions;
- evidence/provenance/authority refs;
- trust/appraisal refs;
- currentness/floor refs;
- qualified relation/derivation refs;
- coverage/limitation dispositions;
- opaque references and correlation-safe handles.

It should **not** own domain-specific dependency graphs, business entities, workflow state or global guarantee truth.

### Capability Exchange Plane candidate scope

The Exchange Plane may carry and enforce exchange-level requirements around:

- evidence envelope integrity;
- routing/binding;
- trust/tenant/classification context propagation;
- proof/evidence references;
- currentness and limitation metadata;
- incompatibility/unknown dispositions;
- reconciliation/requalification triggers.

It should not decide whether `PayrollEligibility`, `AssetAvailability`, `OrderSettlement` or any other business guarantee is semantically satisfied.

## 11. Technology/transport implications without binding

The composition law is independent of whether evidence crosses:

- direct in-process calls;
- IPC;
- HTTP/gRPC;
- broker/queue/event bus;
- stream;
- file/artifact exchange;
- gateway/adapter boundary.

Transport substitution is allowed only if the promised evidence semantics survive. A local call may omit serialization overhead, but it cannot omit semantic qualifications merely because both capabilities happen to share a process.

`local optimization != semantic boundary erasure`.

Similarly, service mesh identity/encryption/retry does not establish dependency noninterference, coverage completeness or business guarantee satisfaction.

## 12. Deduplication / non-goals

This round does not reopen:

- generic dependency-lineage completeness;
- generic opaque proof/privacy research;
- global identity/privacy federation;
- correction authority;
- proof-profile negotiation;
- supply-chain implementation selection;
- cache implementation;
- provider selection;
- G3 canonical semantics.

The specific delta is:

`qualified local non-dependency evidence -> multi-boundary path-sensitive composition -> coverage/trust/currentness-preserving root derivation without a global semantic oracle`.

## 13. Maturity assessment

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

This gap materially changes the proof model: negative evidence is no longer treated as a boundary-local artifact that can be transitively trusted. It becomes a composable but non-amplifying proposition whose validity depends on path closure, coverage compatibility, trust/appraisal basis, currentness and root-capability semantics.

No implementation technology is selected.

## 14. Next highest-value gap

The next highest-value gap is **evidence compaction and durable requalification after composition**:

- how much child proof lineage must survive after a root non-dependency result is materialized;
- how to compact private/opaque evidence without losing selective invalidation capability;
- how revocation, verifier replacement, provider revision and policy-floor changes propagate through compacted derived evidence;
- how to prevent compaction from turning `derived evidence` into unexplained canonical truth;
- how autonomous runtimes retain enough local closure for offline requalification/recovery without retaining sensitive source evidence indefinitely.

This should be researched against provenance bundle models, transparency/non-equivocation systems, signed-attestation chains, revocation/status mechanisms, incremental computation/dependency invalidation and privacy-preserving proof lifecycle patterns before any implementation planning.