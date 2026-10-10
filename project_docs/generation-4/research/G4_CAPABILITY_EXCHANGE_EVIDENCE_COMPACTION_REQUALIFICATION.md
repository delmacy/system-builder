# G4 Capability Exchange — Evidence Compaction and Durable Requalification

Date: 2026-09-21
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Generation 4 product R&D only
Implementation authority: NONE

## 1. Research question

This consolidation continues `G4_CAPABILITY_EXCHANGE_COMPOSITIONAL_NONDEPENDENCY_EVIDENCE.md` and asks:

> After a capability has composed child evidence into a root guarantee, what information must survive compaction so that later revocation, provider revision, appraisal-policy change, semantic-profile retirement, verifier replacement or privacy-governed audit can selectively requalify the root without retaining every raw child artifact forever?

The target is not an evidence warehouse, global dependency graph, central verifier or canonical business database. The target is an implementation-independent **requalification closure**: the minimum durable information that preserves every still-live safety/currentness/audit question while allowing payload and proof detail to be compacted, redacted, archived or erased according to policy.

Constitutional boundaries remain unchanged:

- `G3 semantic decision != G4 technology binding`;
- `Research candidate != implementation authority`;
- `Shared primitives != shared business ownership`;
- `Logical Exchange Plane != single broker`;
- `Exchange Plane owns exchange semantics; capability owns business semantics`;
- `Builder != Runtime`;
- `proof/evidence artifact != canonical business truth`.

## 2. Evidence base

Primary standards and mature architectures reviewed:

1. **IETF RFC 4998 — Evidence Record Syntax (ERS)**: long-lived evidence can be represented as time-ordered preservation chains; Merkle reduction can preserve proof for selected objects without retaining an unreduced tree, but renewal and hash-tree renewal have different requirements. This is strong evidence that compaction can preserve selected verification questions while discarding irrelevant structure, provided the retained proof path and renewal lineage remain sufficient. <https://www.rfc-editor.org/rfc/rfc4998.html>
2. **IETF RFC 9162 — Certificate Transparency v2**: Merkle inclusion proofs establish membership in a committed tree, while consistency proofs establish append-only relation between tree heads. A compact root alone proves neither a particular member nor continuity from an earlier root. <https://www.rfc-editor.org/rfc/rfc9162.html>
3. **IETF RFC 9943 — SCITT Architecture**: signed statements and transparency-service receipts are distinct; a receipt proves registration/inclusion of a statement in a verifiable data structure, not truth of the statement. This separates compact registration evidence from issuer semantics. <https://www.rfc-editor.org/rfc/rfc9943.html>
4. **IETF RFC 9334 — RATS Architecture**: Evidence, Verifier/Appraisal Policy, Attestation Result and Relying Party/Appraisal Policy are distinct roles. Attestation Results can be cached and vendor-neutral, but the relying party still applies its own policy and freshness criteria. <https://www.rfc-editor.org/rfc/rfc9334.html>
5. **W3C PROV / Linking Across Provenance Bundles**: provenance bundles are independently valid islands that may be linked across parties; provenance-about-provenance can therefore remain attributable rather than flattened into one global graph. <https://www.w3.org/TR/prov-dm/> and <https://www.w3.org/TR/prov-links/>
6. **in-toto Attestation Framework / Simple Verification Result**: an attestation binds immutable subjects to typed predicates; the Simple Verification Result records verifier and policy identities but explicitly need not contain enough information to reproduce the verification result. Additional provenance may be generated when reproducibility is required. <https://github.com/in-toto/attestation>
7. Existing G4 work on proof minimization/privacy, archival cryptographic durability, handoff/recovery compaction, distributed guarantee-evidence caching, opaque non-dependency evidence and compositional non-dependency evidence.

These sources are architectural evidence only. No ERS, CT, SCITT, RATS/EAT, W3C PROV, in-toto, transparency log, Merkle store, archive, verifier or provider is selected.

## 3. Material delta

Previous rounds established that root evidence must retain enough child lineage for selective invalidation and that consumer-minimized presentations do not imply producer-forgotten dependency lineage. The missing rule is **what “enough” means after compaction**.

This round proposes:

> A compacted root result is reusable only while its retained requalification closure can still answer every material invalidation predicate that could lower or defeat the root guarantee.

Therefore:

`root PASS retained != root proof still requalifiable`.

and:

`child bytes deleted != child influence safely forgotten`.

The durable unit is not necessarily the full child proof. It is the smallest qualified closure that preserves the ability to decide whether a future change is material to the root.

## 4. Requalification closure

A candidate `RequalificationClosure` is conceptually:

`<rootSubject, rootPredicate, derivationRuleRef, materialPremiseRefs, dependencyCommitments, semantic/profile refs, trust/appraisal refs, coverage/limitation shape, currentness/floor dependencies, negative/defeat dependencies, preservation refs, privacy/retention disposition>`.

This is research vocabulary, not a schema commitment.

The closure must preserve the distinction between:

- **proof reproduction** — rerun/reconstruct the original derivation;
- **proof verification** — verify an already materialized derivation;
- **selective requalification** — decide whether a changed dependency/policy/floor can invalidate or lower the result;
- **forensic explanation** — explain how/why the historical result was reached;
- **business re-execution** — execute the underlying business operation again.

These are not equivalent obligations.

`requalification sufficiency != full reproducibility`.

A compact closure may be sufficient to detect that verifier V or profile P was superseded even when raw private evidence is unavailable. Conversely, a root digest with no dependency binding may remain integrity-verifiable but be useless for selective requalification.

## 5. Compaction safety criterion

Compaction is safe only relative to a declared set of **live future questions**. Examples:

- Has a material trust root/verifier/appraisal policy been revoked or retired?
- Did a semantic/profile floor advance above one material premise?
- Did a provider revision alter a derivation family or coverage shape?
- Was a negative/non-dependency claim superseded?
- Did a privacy/retention rule lawfully erase evidence required for a stronger future claim?
- Can this historical result still be interpreted, even if it is no longer admissible for new effects?

Candidate criterion:

`COMPACT(E -> C)` is admissible only if every live invalidation/requalification predicate `q` that could change the root disposition remains decidable from `C` plus explicitly declared external dependencies, or the loss is represented by an explicit lower disposition such as `REQUALIFICATION_LIMITED`, `REBUILD_REQUIRED`, `HISTORICALLY_RESOLVABLE_ONLY` or `UNKNOWN`.

This yields a key invariant:

`compaction may reduce detail; it may not silently reduce the set of detectable defeat conditions`.

## 6. Merkle/commitment lessons: compactness is not semantics

RFC 4998 and RFC 9162 show that cryptographic trees can retain compact membership/continuity proofs. They do not establish business semantics.

- a Merkle root without the relevant inclusion path does not prove membership of a particular child;
- an inclusion proof does not prove that the child statement is semantically true;
- a consistency proof does not prove current admissibility;
- a compact commitment does not reveal which semantic dependency changed unless the dependency can be mapped to the commitment/proof lineage;
- deleting raw children can be safe for one future question and unsafe for another.

Thus:

`cryptographic compaction != semantic requalification closure`.

A commitment can be part of the closure, but the semantic identity of what was committed and the relation to the root derivation remain necessary.

## 7. Result summaries and proof-carrying summaries

RATS Attestation Results and in-toto Simple Verification Results provide useful precedents for **summary evidence**: a verifier can issue a result without reproducing all source evidence. But such summaries have bounded semantics.

Candidate G4 distinction:

1. **Result-only summary** — records disposition, subject, predicate/profile, verifier/appraisal identity and currentness. Cheap and privacy-preserving, but may require external/private lineage for later selective requalification.
2. **Dependency-carrying summary** — additionally retains commitments/refs to all material premise classes and defeat dependencies. Supports selective invalidation without raw child disclosure.
3. **Proof-carrying summary** — retains a machine-checkable derivation or equivalent evidence sufficient for local verification under an immutable semantics profile.
4. **Forensic closure** — retains enough historical evidence/provenance to reconstruct or audit the original decision beyond ordinary runtime needs.

These form neither a universal strength scalar nor a mandatory hierarchy. Privacy, portability, storage cost, auditability and requalification independence trade off differently.

`more retained bytes != stronger assurance`.

## 8. Negative evidence has asymmetric retention value

Positive premises often become irrelevant when superseded by a stronger current proof. Negative/fencing/revocation/non-dependency evidence may be needed specifically to prevent resurrection of stale work or stale authority.

Candidate rule:

> A negative premise may be compacted away only when a stronger durable fact subsumes the exact future safety question it answered.

Examples:

- an old revocation list entry may be subsumed by a monotonic local floor that permanently excludes the revoked generation;
- a fencing proof may be subsumed by an irreversible effect-side epoch/fence that stale holders cannot cross;
- a non-dependency proof cannot be dropped merely because the current root result is `PASS` if a future provider revision could reintroduce the excluded influence.

`latest positive state != subsumption of historical negative evidence`.

## 9. Selective invalidation without a global graph

A runtime need not retain a central global dependency graph. It needs a local/scoped reverse index or equivalent discoverability mechanism from material dependency identity/class to affected compacted roots.

Candidate architecture-independent options include:

- purpose-scoped dependency commitments with local reverse mapping;
- per-root compact dependency manifests;
- partitioned indexes by trust/profile/provider/floor class;
- proof-carrying summaries whose premise identities are inspectable;
- archive references for colder/forensic dependencies.

The invariant is behavioral, not technological:

`dependency superseded -> every locally reusable derived root materially depending on it becomes discoverably requalified before unsafe reuse`.

This does not require synchronous O(N) broadcast. It can be satisfied by lazy floor checks, generation tokens, partition epochs, local reverse indexes or other mechanisms, provided false-current reuse is prevented.

## 10. Revocation/floor advancement and lazy requalification

Global eager invalidation is neither necessary nor reliable. A compact root can carry minimum required generations/floors for its material dependencies. A runtime can reject/requalify the root lazily when local monotonic observations exceed those bindings.

`invalidation event missed != stale root remains admissible forever`.

However:

- one global epoch is unsafe when trust/profile/provider domains evolve independently;
- a coarse partition epoch may over-invalidate but must not under-invalidate;
- floor advancement cannot be rolled back by restoring an old compacted cache;
- offline autonomy remains bounded by locally durable floor/currentness closure.

## 11. Privacy and erasure

Compaction is attractive partly because retaining complete evidence graphs can leak topology, identity, provider relationships and business context. But privacy-driven deletion changes assurance when deleted material is still required for a live proof question.

Candidate rule:

`lawful erasure can lower future proof capability; it cannot be represented as if proof capability were unchanged`.

Possible outcomes include:

- root remains fully requalifiable because retained commitments/summary are sufficient;
- root remains historically interpretable but cannot support new-effect admission;
- root requires authorized progressive disclosure from a separate archive;
- root becomes `REBUILD_REQUIRED` or `UNKNOWN` for a stronger claim.

A privacy-preserving compact commitment must itself be correlation-scoped where global equality is not required.

## 12. Archival handoff and crypto aging

Compaction and archival preservation are different axes. A semantically sufficient compact closure can still become cryptographically unverifiable as algorithms/keys/profiles age. RFC 4998 shows why preservation chains and renewal may be needed.

`semantic compaction != cryptographic preservation`.

Conversely, perfectly renewed cryptographic evidence can preserve an inadequately scoped semantic summary forever without making it sufficient.

`cryptographically durable insufficiency != sufficient evidence`.

Archival renewal must preserve the identity of the compacted semantic closure and its historical authority; it cannot reinterpret the closure under a new proof profile silently.

## 13. Autonomous runtime closure

A published runtime must not require Builder availability merely to requalify locally materialized evidence. The runtime's declared topology should therefore identify which requalification dependencies must be locally durable for its autonomy horizon, such as:

- immutable semantic/profile identities;
- locally durable monotonic floors;
- qualified trust/verifier material;
- compact dependency/requalification closure;
- preservation evidence needed within the promised horizon.

If the runtime lacks a required dependency, the state is explicit rather than guessed.

`central archive unavailable != false success`.

`local closure sufficient != globally latest`.

## 14. Candidate vocabulary

Research vocabulary only:

- `RequalificationClosureRef` — reference to the compact material needed to evaluate future invalidation predicates for a derived result.
- `MaterialPremiseSetRef` — qualified set/commitment of premise identities/classes used by a derivation.
- `DefeatDependencyRef` — dependency whose revocation/supersession/currentness change can lower or defeat the root result.
- `SubsumptionEvidenceRef` — proof that a stronger durable fact makes retention of an older premise unnecessary for a named future question.
- `CompactionProfileRef` — immutable semantics defining what a compact form preserves, omits and can still answer.
- `RequalificationDisposition` — e.g. `CURRENT`, `REQUALIFY`, `REBUILD_REQUIRED`, `HISTORICALLY_RESOLVABLE_ONLY`, `REQUALIFICATION_LIMITED`, `UNKNOWN`.
- `DependencyGenerationRef` — domain-qualified monotonic generation/floor used for cheap stale-result detection without implying a global revision.
- `PrivateLineageRef` — scoped reference to non-public lineage retained for authorized requalification/audit.
- `PreservationChainRef` — qualified cryptographic preservation lineage for compact evidence.

None is a shared business entity or implementation commitment.

## 15. Candidate proof obligations

1. **PO-ECR-01 — No silent defeat loss:** compaction cannot erase a still-live condition capable of lowering/defeating the root result.
2. **PO-ECR-02 — Root semantic identity:** compact evidence remains bound to immutable root subject/predicate/profile identity.
3. **PO-ECR-03 — Derivation identity:** the composition/derivation rule remains identifiable where needed for requalification.
4. **PO-ECR-04 — Material premise discoverability:** every premise class whose supersession can affect the root remains discoverable directly or through a qualified commitment/index.
5. **PO-ECR-05 — Negative evidence preservation:** negative/revocation/fencing/non-dependency evidence survives until a stronger durable fact explicitly subsumes its safety role.
6. **PO-ECR-06 — Subsumption proof:** deletion by subsumption is itself justified by durable evidence naming the question that is no longer live.
7. **PO-ECR-07 — Currentness independence:** cryptographic integrity of a compact result cannot substitute for current admissibility of its dependencies.
8. **PO-ECR-08 — Domain-qualified generations:** cheap generation/floor checks never invent one global platform revision across independent domains.
9. **PO-ECR-09 — Monotonic floor survival:** restore/restart/cache recovery cannot lower locally durable security/profile/authority floors.
10. **PO-ECR-10 — Selective invalidation:** a changed dependency lowers only roots materially dependent on it, unless a coarser invalidation scope is intentionally conservative.
11. **PO-ECR-11 — No under-invalidation:** optimization/partitioning may over-invalidate but cannot leave a materially stale root falsely current.
12. **PO-ECR-12 — Privacy-scoped lineage:** retained commitments/refs do not become unnecessary global correlation handles.
13. **PO-ECR-13 — Erasure honesty:** lawful deletion that removes required future proof material lowers the declared requalification capability explicitly.
14. **PO-ECR-14 — Summary-role clarity:** verifier/result summaries remain evidence; they do not become canonical business truth or semantic authority.
15. **PO-ECR-15 — Appraisal provenance:** verifier/appraisal-policy identity survives when material to later requalification.
16. **PO-ECR-16 — Coverage preservation:** `OPAQUE`, `PARTIAL`, `UNKNOWN`, coverage-shape and limitation information cannot disappear during compaction.
17. **PO-ECR-17 — Alternative derivation awareness:** a compact closure binds the derivation family or forces requalification when provider/fallback/feature-mode changes it.
18. **PO-ECR-18 — Archive separation:** semantic compaction and cryptographic preservation remain separately qualified.
19. **PO-ECR-19 — Historical authority preservation:** archival renewal cannot relabel preservation authority as original evidence/business authority.
20. **PO-ECR-20 — Offline autonomy:** locally sufficient requalification closure supports declared offline operation without a mandatory Builder/central verifier/archive.
21. **PO-ECR-21 — Missing closure explicitness:** unavailable private lineage, expired preservation evidence or unsupported proof semantics yields an explicit lower disposition.
22. **PO-ECR-22 — Transport independence:** file/RPC/broker/stream transport of compact evidence does not alter its semantic identity.
23. **PO-ECR-23 — Exchange-plane non-ownership:** Exchange Plane may route/cache/index refs but does not own root business sufficiency or canonical lineage.
24. **PO-ECR-24 — Bounded support:** compaction profile declares which future questions it promises to preserve; it does not claim infinite future auditability.

## 16. Adversarial cases

1. Root `PASS` is retained while every child identity/appraisal ref is deleted; a later verifier compromise cannot be propagated.
2. Merkle root is retained but the inclusion path for a material child is discarded.
3. Inclusion proof is treated as proof that the included statement was semantically true.
4. Consistency proof is treated as currentness/revocation proof.
5. A Simple Verification Result survives but its policy identity is omitted, making changed policy indistinguishable.
6. Appraisal-policy identifier survives but mutable `latest` semantics behind it changed.
7. Privacy cleanup deletes the marker that one dependency class was `OPAQUE`.
8. `UNKNOWN` child is compacted into absence and later interpreted as non-dependency.
9. Negative fencing evidence is deleted after a successful effect although stale work can still be replayed.
10. Old revocation evidence is deleted without a stronger durable floor that prevents authority resurrection.
11. One global cache epoch invalidates unrelated domains and is later optimized to skip checks, accidentally under-invalidating another domain.
12. A provider revision changes derivation family while compact root retains only interface/schema identity.
13. Feature flag introduces a new external dependency without changing root proof identifier.
14. Restoring an old cache restores an older security floor and makes stale roots admissible again.
15. Central reverse index is lost and runtimes cannot discover which compact roots depend on a compromised verifier.
16. Exchange Plane becomes mandatory owner of every dependency edge to make invalidation convenient.
17. Stable dependency commitment reused across tenants reconstructs a hidden cross-tenant topology.
18. Archive re-signs compact result and the new archive signature is mistaken for new business authorization.
19. Cryptographic renewal preserves a semantically incomplete root forever and consumers infer completeness from longevity.
20. Lawful erasure removes source bytes required for future renewal/revalidation but root remains labeled `FULLY_REQUALIFIABLE`.
21. Offline runtime misses invalidation broadcast and has no local floor/horizon check, so stale root remains current indefinitely.
22. Coarse partition epoch is advanced, but one root silently depends on a different partition not represented in its closure.
23. Root proof contains all positive premises but compaction drops a contested/defeat witness because it was not on the successful derivation path.
24. Provider substitution reuses compact root because RPC interface is identical although verifier/trust/coverage semantics differ.
25. Audit requires raw lineage that retention policy never promised to preserve; system fabricates a reconstructed history.
26. Forensic archive is available but classified; normal runtime treats inability to read it as proof that no defeating evidence exists.
27. Compaction stores full canonical business payload “for future proof” and becomes an accidental shared database.
28. A central verifier outage blocks a runtime whose local compact closure was otherwise sufficient.

## 17. Decision criteria for retention level

A candidate retention decision should ask, in order:

1. What root guarantee/predicate is being protected?
2. Which future events can materially lower/defeat it?
3. Which dependency identities/classes must remain discoverable to detect those events?
4. Which negative/contested/unknown facts must survive?
5. Can a stronger monotonic floor/fence/closure subsume an older premise?
6. Is raw child evidence required, or is a commitment/result/proof summary sufficient?
7. Which audit/reproduction questions are contractually promised?
8. What privacy/classification/erasure limits apply?
9. What cryptographic preservation horizon is promised?
10. What closure must be local for autonomous runtime operation?

Only then should a concrete storage/index/archive/proof mechanism be qualified.

## 18. Deduplication and non-goals

This round does **not** reopen:

- generic evidence-cache invalidation or stampede control;
- handoff frontier compaction;
- archival cryptographic algorithm renewal;
- privacy-preserving selective disclosure;
- proof-carrying policy verification;
- verifier diversity/trust continuity;
- dependency completeness/non-dependency semantics.

It connects those prior findings around one narrower question: **what must survive after a composed root result is compacted so future material changes can still be detected and qualified?**

No new macro-family is created.

Non-goals:

- no evidence database selection;
- no Merkle/transparency-log adoption;
- no central invalidation service;
- no mandatory online verifier/archive;
- no canonical shared dependency graph;
- no product code/schema/API authorization.

## 19. Portability and exit path

The semantic contract should remain portable across concrete implementations by preserving exportable immutable identities/refs for root predicate, derivation profile, material dependency classes, appraisal/trust basis, floors/currentness, limitations, preservation lineage and explicit dispositions.

A provider exit is acceptable only if exported compact evidence remains independently interpretable/requalifiable to the promised level, or the downgrade is explicit before migration.

`provider can export bytes != evidence exit path proven`.

## 20. Maturity and next gap

This round produces a material delta and remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.

The evidence-compaction question is now materially bounded by a **requalification closure** rather than “retain all lineage” versus “retain only root PASS”. The remaining highest-value gap is narrower:

> **revocation/floor propagation over very large derived-evidence DAGs under correlated partitions and revocation storms** — determine safe lazy/eager invalidation algorithms and bounded-work proofs that avoid synchronous O(N) fan-out, preserve autonomous runtimes, prevent stale derived proofs, and do not turn dependency indexes or the Exchange Plane into a central semantic authority.

No implementation is authorized by this research.