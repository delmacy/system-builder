# G4 — Federated Semantic Correction Authority and Historical Semantics Lifecycle

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

When an immutable historical proof/contract profile P1 is genuinely ambiguous, who may publish a correction or successor P1', how should autonomous/federated runtimes authenticate and adopt it without a central semantic oracle, how should competing corrections remain representable, and how can correction supersession/retirement avoid rewriting already-settled historical evidence?

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_PROOF_MIGRATION_BRIDGE_QUALIFICATION.md`, proof-profile portability, normative proof-semantics governance, verifier trust continuity, offline security floors and settlement-closure research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards/processes and mature systems reviewed:

- IETF/RFC Series and RFC Editor errata process: RFCs are archival and are not silently edited after publication. Verified errata are linked to the RFC but not incorporated into the published RFC; significant or consensus-changing corrections require a new RFC/update rather than an erratum. IETF-stream RFCs depend on community rough consensus. This is a strong precedent for separating immutable historical semantic identity from later correction evidence.
- IESG processing of RFC errata: clear technical corrections aligned with original intent may be Verified; unclear changes or those requiring discussion are held or routed through the technical community; changes that may differ from the approved consensus should generally not be handled as errata. This is direct evidence that correction authority is bounded by the type/materiality of change.
- W3C 2025 Process: candidate corrections to Recommendations are informative annotations until they pass the review/approval path required to become normative. Substantive corrections require community review; Recommendations can be revised, superseded, made obsolete or rescinded rather than having history silently rewritten.
- Unicode Conformance Model and Corrigenda: each published Unicode version is absolutely stable; corrigenda may apply to earlier versions but do not retroactively change those versions. Implementations may explicitly claim conformance to a version with a named corrigendum applied. This is a particularly strong precedent for `P1` and `P1 + Correction C` being distinct historical conformance claims.
- Unicode normalization correction machinery: protocol stability can require preserving an older, even known-incorrect behavior, and correction metadata records exact versions/changes. This demonstrates that semantic correction and interoperability/historical compatibility can legitimately diverge.
- WebAssembly specification lifecycle: normative formal semantics, prose and generated artifacts are developed through explicit community/working-group governance; SpecTec reduces artifact drift but does not turn an executable implementation into correction authority. Wasm versioned specifications remain identifiable while future editions evolve.

No IETF, W3C, Unicode or WebAssembly governance process is selected for System Builder. They are evidence for technology-independent boundaries.

## 3. Material findings

### 3.1 Semantic correction authority is scoped governance authority, not runtime or infrastructure authority

A party able to publish, host, route or execute P1' does not thereby possess authority to redefine P1.

`correction transport/publisher != correction authority`.

The authority to establish a correction derives from the governance/trust contract of the semantic profile itself. The Exchange Plane may carry correction evidence; Builder, gateway, registry, broker, driver and adapter do not become semantic legislators by availability or topology.

### 3.2 Immutable historical profile and correction are separate identities

RFC archival practice and Unicode version stability converge on a strong rule:

`correction published != predecessor semantics rewritten`.

P1 remains an immutable historical referent. A material correction is represented as P1' or as an explicit correction overlay C with its own immutable identity and relation to P1. Historical evidence can therefore say `interpreted under P1`, `P1 + C`, or `P1'` without retroactive relabeling.

### 3.3 Editorial clarification and behavior-selecting correction require different authority

A correction that demonstrably changes no admissible behavior is different from one that chooses among previously plausible behaviors or changes accepted/rejected outcomes.

`editorial clarification != semantic correction`.

The IETF errata process explicitly rejects using errata for changes that may differ from original consensus; W3C requires substantive corrections to pass normative review. G4 therefore needs materiality classification before a correction can claim semantic effect.

### 3.4 Candidate correction is evidence, not normative successor

W3C candidate corrections can be visible before becoming normative. This supports a useful state separation:

`correction proposed != correction qualified != correction normative/admissible`.

Autonomous runtimes may learn that an ambiguity exists before they possess sufficient authority evidence to adopt a particular resolution. `KNOWN_AMBIGUITY` and `CANDIDATE_CORRECTION` must not be flattened into P1'.

### 3.5 Correction authority is itself versioned and scoped

The authority competent to resolve ambiguity A at time T may not be authorized for unrelated profile Q, another trust domain, or a later constitutional regime.

Candidate `SemanticCorrectionAuthorityRef` therefore binds authority identity, profile/namespace scope, correction class, validity/currentness horizon and governance provenance.

`authorized to correct P1 != universal semantic authority`.

### 3.6 Federated autonomous runtimes authenticate correction chains locally

A long-offline runtime should not need an online Builder or global semantic oracle. It needs a locally verifiable chain from a previously trusted semantic-governance anchor/floor to the correction authority and immutable correction artifact.

`correction widely deployed != correction authenticated`.

Distribution may use RPC, broker, file, registry, gateway or offline media; transport substitution does not change correction authority.

### 3.7 Competing corrections remain first-class conflict

Two independently plausible corrections C1 and C2 can exist when governance is partitioned, compromised or disputed.

`C1 validly signed + C2 validly signed != one correction automatically wins`.

If no qualified authority relation orders them, the result is `CONTESTED_CORRECTION`, not last-write-wins, latest timestamp, majority deployment or registry preference.

### 3.8 Correction conflict can be claim-selective

C1/C2 disagreement may affect only one predicate, encoding edge case or proof rule. Unaffected claims can remain qualified if independence is demonstrated.

`correction conflict exists != whole profile unusable`.

This reuses the existing G4 discipline of ambiguity materiality and minimal semantic cut sets rather than imposing a global freeze.

### 3.9 Adoption time and historical semantic time are distinct

A runtime may learn P1' today while interpreting an occurrence admitted years earlier under P1.

`correction observation/adoption time != historical effect semantic time`.

The runtime records which semantics governed the original admission/effect and separately which correction state it later learned. A correction does not rewrite what the runtime could legitimately know at the historical time.

### 3.10 Correction can change future admissibility without changing historical interpretation

A security or correctness policy may require P1' for new protected effects while preserving P1 interpretation for audit.

`P1 retired for new admission != P1 historically uninterpretable`.

This keeps semantic resolvability, current admissibility and settlement separate.

### 3.11 Explicit correction overlay can be safer than pretending predecessor identity changed

Unicode provides a useful pattern: conformance can be claimed to a stable version with a named corrigendum applied. A G4 correction overlay can similarly make the exact semantic delta explicit when appropriate.

`P1 + C != silently-mutated P1`.

Whether a future product uses overlay or successor identity remains an implementation-independent design choice; the invariant is explicit identity and provenance.

### 3.12 Correction graphs need partial order, not one global revision

Independent profiles/trust domains can evolve separately. A runtime may know `P1 -> P1'` and `Q3 -> Q4` without any meaningful global revision ordering between them.

`semantic correction frontier != global platform version`.

A candidate `SemanticCorrectionFrontierRef` is therefore domain/profile scoped and may contain incomparable branches.

### 3.13 Superseding a correction does not erase its historical governance evidence

If C1 was legitimately normative for an interval and later C2 supersedes it, C1 remains necessary to explain historical decisions.

`correction superseded != correction history erased`.

Compaction may summarize C1 only if every live historical interpretation, audit, settlement and anti-resurrection question remains answerable.

### 3.14 Defeated corrections need negative evidence durability

If Cbad was withdrawn, revoked or defeated because its authority was compromised or its semantics wrong, a snapshot restore must not resurrect it for new effects.

`correction retirement floor != ordinary application state`.

Negative/retirement evidence survives every supported rollback/rejoin path or is subsumed by a stronger durable correction floor.

### 3.15 Governance signatures prove authorization/provenance, not semantic correctness

A qualified correction authority may authorize P1', but its signature does not prove that P1' is logically equivalent to P1 or preserves a particular guarantee.

`correction authorized != correction theorem proven`.

Bridge qualification, counterexamples and guarantee-preservation evidence remain separate proof domains.

### 3.16 Semantic correction and business ownership remain separate

Correcting a cross-capability proof profile does not authorize the correction authority to decide a capability's business state, settle external effects or transfer ownership.

`semantic correction authority != business authority`.

The Exchange Plane still owns exchange semantics only; capability owners retain business semantics/ownership.

### 3.17 Correction discovery can safely precede correction resolution

A runtime that learns only that P1 is materially ambiguous can lower affected guarantees before it learns an accepted correction.

`ambiguity known != resolution known`.

This allows fail-safe qualification without trusting an unverified proposed correction.

### 3.18 Correction resolution must preserve unsupported/old-runtime states

An old runtime may authenticate the existence of C but lack the proof profile/interpreter needed to apply it.

`correction authenticated != correction locally interpretable`.

The safe state is explicit `CORRECTION_UNSUPPORTED/REQUIRES_UPGRADE`, not silently continuing P1 for protected effects and not accepting a gateway's boolean answer as semantic authority.

### 3.19 Governance migration requires continuity or explicit re-bootstrap

If the semantic-governance authority itself changes, a successor authority must be related by a qualified transition from the old authority or by an explicit independent recovery/re-bootstrap process.

`new governance key/committee != automatically authorized correction authority`.

This reuses G4 constitutional/root-trust research without conflating semantic governance with infrastructure identity.

### 3.20 No central correction registry is required for runtime autonomy

A registry may improve discovery, caching and routing, but correctness can be based on portable correction artifacts, immutable refs and locally verifiable authority chains.

`correction registry unavailable != runtime semantic amnesia`.

A published runtime may continue within its locally durable correction/security/currentness horizons when Builder/central services are absent.

## 4. Candidate vocabulary

Research vocabulary only:

- `SemanticCorrectionRef` — immutable identity for a correction/clarification artifact.
- `SemanticCorrectionAuthorityRef` — scoped authority capable of qualifying a correction class for named semantic profiles.
- `CorrectionMaterialityRef` — evidence classifying editorial/non-behavioral vs behavior-selecting/substantive correction.
- `CorrectionRelationRef` — explicit relation such as `CLARIFIES`, `CORRECTS`, `SUPERSEDES`, `REVOKES`, `CONTESTS`, `COEXISTS_FOR_SCOPE`.
- `SemanticCorrectionFrontierRef` — profile/trust-domain-scoped set of locally known correction states without global revision semantics.
- `CorrectionAdoptionEvidenceRef` — evidence of local verification, durable activation and observation time.
- `CorrectionConflictRef` — durable identity for competing/incomparable correction claims.
- `CorrectionRetirementFloorRef` — monotonic local floor preventing defeated/retired correction resurrection for protected use.
- `CorrectionAuthorityTransitionRef` — qualified continuity/recovery relation between semantic-governance authorities.
- `HistoricalCorrectionDisposition` — historical state such as `P1`, `P1_WITH_C`, `P1_PRIME`, `KNOWN_AMBIGUITY`, `CONTESTED_CORRECTION`, `UNSUPPORTED_CORRECTION`.

These are structural refs/evidence roles, not shared business entities or concrete components.

## 5. Candidate proof obligations

1. Historical semantic profile identities remain immutable after publication.
2. Every material correction has an immutable identity and explicit relation to its predecessor.
3. Correction materiality is classified before governance rules for adoption are applied.
4. A behavior-selecting/substantive correction cannot be smuggled through an editorial-only authority path.
5. Candidate/proposed correction state remains distinct from normative/admissible correction state.
6. Correction authority is explicitly scoped to profile/namespace, correction class and governance horizon.
7. Transport, registry, Builder, gateway, broker, adapter or driver presence does not establish correction authority.
8. Autonomous runtimes can authenticate correction authority/lineage from locally trusted anchors or an explicit qualified re-bootstrap path.
9. Popularity, deployment count, timestamp recency and majority of peers do not resolve competing corrections.
10. Incomparable qualified corrections remain representable as `CONTESTED_CORRECTION`.
11. Conflict degrades only materially dependent claims when non-materiality of other claims can be established.
12. Correction observation/adoption time remains distinct from historical occurrence/admission/effect time.
13. Historical evidence remains bound to the semantics actually governing it; later correction does not silently relabel it.
14. Retirement for new effects does not erase historical interpretability/audit evidence.
15. Correction supersession/retirement evidence survives every supported resurrection path or is subsumed by a stronger durable floor.
16. Authorization/provenance of a correction remains distinct from theorem/bridge evidence about semantic preservation.
17. Correction authority does not acquire capability business ownership or effect-settlement authority.
18. Learning that an ambiguity exists can lower affected assurance without requiring immediate trust in any proposed correction.
19. A runtime unable to interpret an authenticated correction returns explicit unsupported/rebootstrap disposition.
20. Governance-authority transition is explicitly proven or re-bootstrapped; a new key/committee cannot self-assert continuity.
21. Correction graphs remain profile/trust-domain scoped and do not create a synthetic global platform revision.
22. Compaction preserves every live correction conflict, retirement floor, authority transition and historical interpretation question.
23. Offline/runtime-local correction verification remains possible within declared retention/currentness/security horizons without mandatory Builder availability.
24. If no qualified correction authority or ordering can be established, the system preserves ambiguity/contest rather than fabricating semantic truth.

## 6. Adversarial cases

1. Gateway receives C1 and silently rewrites P1 payloads as P1'.
2. Builder publishes a correction and is treated as normative authority merely because it generated the runtime.
3. Registry marks `latest=P1'` and runtimes treat recency as semantic authority.
4. A substantive behavior change is labeled editorial to bypass review/authority requirements.
5. Candidate correction is cached as normative before governance completion.
6. P1 bytes/document are mutated in place after correction, destroying historical identity.
7. C1 and C2 are both validly authorized by partitioned governance branches; majority deployment chooses C1.
8. Latest timestamp chooses C2 despite no authority relation ordering C1/C2.
9. A correction conflict affecting one predicate freezes unrelated capability operations globally.
10. Runtime learns C after executing under P1 and retroactively labels old effects as admitted under P1'.
11. P1 is retired for new effects and old audit evidence becomes unreadable.
12. Cbad is revoked but snapshot restore resurrects it for protected effects.
13. Compaction keeps only `current=P1'` and deletes evidence that Cbad was defeated.
14. Correction authority signs P1' and signature is treated as proof that P1' preserves all P1 guarantees.
15. Correction committee uses its semantic role to settle capability business conflicts.
16. Runtime learns that P1 is ambiguous but keeps reporting full assurance until a preferred correction arrives.
17. Old runtime authenticates C but cannot execute its proof semantics; gateway returns `valid=true` and becomes semantic oracle.
18. New correction authority self-signs its own succession from the old authority after the old root is lost.
19. Broker outage prevents correction discovery and is misreported as `no correction exists`.
20. Stable global correction ID is reused across privacy/trust domains and leaks cross-tenant correlation.
21. Adapter translates C1 into C2 syntax and silently drops a material correction condition.
22. Service mesh identity is treated as proof that the sender has semantic-correction authority.
23. Correction is superseded, but queued work admitted under it is relabeled under the successor rather than preserving lineage.
24. Two independent trust domains legitimately use different corrections, and a central registry flattens them into one platform-wide winner.

## 7. Technology-independent correction lifecycle hypothesis

A candidate lifecycle is:

`AMBIGUITY/DEFECT OBSERVED -> CORRECTION PROPOSED -> MATERIALITY CLASSIFIED -> AUTHORITY QUALIFIED -> TECHNICAL/SEMANTIC REVIEW -> CORRECTION ADMITTED FOR DECLARED SCOPE -> DISTRIBUTED/OBSERVED LOCALLY -> OPTIONAL SUPERSESSION/RETIREMENT -> HISTORICAL PRESERVATION`.

This is not a required workflow engine or product state machine. It expresses proof boundaries that any realization should preserve.

A correction is locally usable for a protected claim only when the runtime can establish at least:

1. immutable predecessor semantic identity;
2. immutable correction/successor identity;
3. correction materiality/class;
4. authority identity and authority scope;
5. authority continuity/recovery evidence;
6. correction relation and affected semantic scope;
7. local security/currentness/admissibility floors;
8. interpreter/proof-profile support;
9. unresolved competing correction state;
10. local durable activation/observation evidence where historical reasoning depends on it.

## 8. Trade-offs and portability / exit path

### Immutable predecessor + explicit correction graph

Pros: historical auditability, offline verification, no mutable alias, precise long-lived proof lineage.

Costs: more metadata, explicit correction graph traversal, migration complexity.

Exit path: plain immutable artifacts plus explicit relations can be exported independently of a registry/provider.

### Central correction registry

Pros: simple discovery and operational distribution.

Risks: accidental semantic oracle, availability dependency, cross-domain flattening, correlation surface.

Boundary: acceptable as replaceable discovery/index infrastructure only; correctness cannot depend on registry preference alone.

### Federated correction authorities

Pros: autonomy and domain-local governance.

Risks: competing corrections, long-offline skew, more complex settlement.

Boundary: conflicts remain explicit; no majority/recency rule is inferred.

### Formal correction theorem

Pros: stronger evidence that correction preserves or refines named guarantees.

Risks: formalization/translation TCB, workload, incomplete model.

Boundary: theorem evidence complements but does not replace correction authorization, materiality classification or business ownership.

## 9. Deduplication against existing G4 research

This document does not reopen:

- generic normative-semantics identity/governance;
- generic proof migration bridge qualification;
- verifier diversity;
- generic root/emergency-root recovery;
- profile negotiation/downgrade resistance;
- archival cryptographic durability;
- business split-brain settlement;
- distributed cache invalidation.

The material delta is specifically:

`historical semantic ambiguity -> scoped correction authority -> candidate/normative correction distinction -> competing federated corrections -> offline local adoption -> supersession/retirement without historical rewrite or central semantic oracle`.

## 10. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This closes a material gap in who may resolve semantic ambiguity and how that resolution can propagate without mutating historical meaning. It does not authorize an SDO-like governance subsystem, correction registry, consensus protocol, proof language or provider.

Highest-value remaining gap exposed by this round:

**cross-capability semantic correction dependency and transitive requalification** — when profile P1 is corrected to P1', determine how to identify downstream contracts/bridges/closures/cached guarantee evidence that semantically depended on the corrected clause, without treating every textual/reference dependency as material, without requiring a central dependency oracle, and without allowing a correction authority to acquire business ownership over downstream capabilities.
