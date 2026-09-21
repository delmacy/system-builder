# G4 — Proof-Preserving Requalification Frontier Compaction Across Trust Domains

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

When autonomous runtimes accumulate compromise, revocation, retirement and requalification evidence from independently evolving trust domains, when may that history be compacted into portable summaries without inventing a global revision, erasing conflicts or observation-time evidence, breaking selective lineage invalidation, leaking stable cross-domain correlation handles, or allowing an old snapshot to resurrect defeated trust?

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_DISTRIBUTED_REQUALIFICATION_ANTI_ENTROPY.md`, `G4_CAPABILITY_EXCHANGE_RETROACTIVE_CRYPTO_COMPROMISE_RESEARCH.md`, and the existing handoff/recovery compaction research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary/mature references reviewed:

- RFC 9162 Certificate Transparency v2: Merkle consistency proofs compactly prove that an older tree is a prefix of a newer append-only tree, with proof size logarithmic in tree size. This demonstrates useful cryptographic history compression, but only for the property committed by that log structure; it does not prove application-semantic admissibility.
- RFC 9942 COSE Receipts: receipts prove properties of a Verifiable Data Structure and permit proof-type agility. This supports treating a compact commitment/receipt as qualified evidence whose semantics are determined by the declared VDS/proof type, not by a universal hash interpretation.
- RFC 9943 SCITT: transparency services provide append-only/non-equivocation/replayability properties; multiple independent transparency services may coexist and relying parties decide which issuers/services to trust. Receipts prove registration/transparency, while application validation remains relying-party policy. This is strong evidence against collapsing independent trust-domain frontiers into one scalar revision.
- The Update Framework (TUF): rollback/freeze/mix-and-match protections rely on versioned, expiring, role-separated metadata and locally remembered trusted state. Snapshot metadata provides a consistent repository view; timestamp metadata supplies freshness. This reinforces that compact state must preserve anti-rollback and freshness dimensions separately.
- Existing G4 distributed requalification research: push invalidation is advisory, security floors are locally monotonic and scope-qualified, conflicts remain representable, observation time differs from compromise time, and below-retention recovery needs a qualified closure rather than fabricated absence.

No Merkle implementation, transparency service, TUF client, VDS, broker, database, compression format or provider is selected.

## 3. Material findings

### 3.1 A compact frontier is a proof-carrying claim about coverage, not a replacement history

A summary may safely stand in for detailed history only for explicitly named questions it can still answer.

`compact frontier != history deleted from semantics`.

Candidate compaction therefore needs declared coverage: trust domain, claim class, normative profile, time/observation interval, conflict coverage, negative/floor coverage and lineage-resolution capability. A digest without this coverage is merely a byte commitment.

### 3.2 Compaction safety is query-relative

The useful criterion is not whether every old event can be reconstructed. It is whether every still-live safety, recovery, historical-interpretation and selective-requalification question remains answerable.

`safe compaction = preservation of live proof obligations`, not `retention of every event`.

This generalizes the existing G4 rule `Recoverable state != retained full history` to requalification knowledge specifically.

### 3.3 Independent trust domains require a vector/frontier, not one synthetic global revision

SCITT explicitly permits multiple transparency services with different relying-party trust choices. TUF roles also separate authority/freshness responsibilities. Therefore a compact closure must not flatten independently governed domains into `securityRevision=42`.

`{domain A frontier, domain B frontier} != global frontier max(A,B)`.

A portable summary may aggregate references, but each component retains domain identity, proof semantics, authority basis and currentness.

### 3.4 Cryptographic consistency proves committed structure, not semantic subsumption

RFC 9162 consistency proofs establish append-only prefix consistency. They do not prove that a later semantic disposition safely subsumes every earlier one.

`append-only consistency != semantic subsumption`.

A G4 compactor needs a separate subsumption predicate: whether retained evidence is sufficient to answer all live questions formerly requiring the compacted detail. A Merkle proof can support integrity/non-equivocation of that evidence, not decide the predicate.

### 3.5 Floors and defeats are not ordinary positive facts and must survive resurrection paths

A compact snapshot that says only `current root = R5` is unsafe if an older runtime can restore R3 without learning why R3 became inadmissible.

`latest positive state != anti-resurrection closure`.

The compact frontier must carry or cryptographically bind the negative/floor evidence necessary to defeat every supported resurrection path, or bind a stronger successor fence that subsumes it.

### 3.6 Conflict cannot be compacted into a winner merely to reduce state

If two qualified findings disagree about compromise interval, authority or currentness, compaction cannot choose one using arrival order, numeric revision, wall clock, majority or storage convenience.

`CONTESTED before compaction -> CONTESTED after compaction`, unless explicit qualified successor evidence resolves the conflict.

A conflict summary may replace detailed conflicting payloads when it retains enough references/commitments to audit the conflict and evaluate later resolution evidence.

### 3.7 Observation-time provenance may be summarized but not rewritten

Different runtimes can have learned the same effective compromise at different times. Global compaction may summarize the finding, but historical runtime decisions still require their local observation/activation evidence.

`shared effective finding != shared observation history`.

A compact cross-runtime frontier therefore must not stamp all historical decisions as though the finding had always been known.

### 3.8 Selective invalidation requires dependency-preserving lineage after compaction

If derived proof P depended materially on trust premise E, later defeat of E must still locate P after detailed events around E have been compacted.

`compaction that destroys material dependency reachability -> unsafe selective requalification`.

The closure may retain a scoped lineage commitment/index rather than raw history, but it must support sound identification of materially dependent live proofs. False positives may cause bounded extra requalification; false negatives can preserve unsafe evidence and are not acceptable for hard claims.

### 3.9 Compaction granularity should follow proof/security domains, not storage partitions

Database shard, broker partition, host, tenant table or log segment boundaries are operational conveniences. They need not align with trust-domain or invariant boundaries.

`storage partition != semantic compaction boundary`.

A compaction unit should be chosen around independently decidable proof obligations and privacy scopes. Physical storage may realize that unit without defining its semantics.

### 3.10 Cross-domain commitments need correlation-scope discipline

A stable global Merkle leaf, subject hash or dependency digest can become a long-lived cross-tenant/cross-domain tracking handle even if payloads are hidden.

`compact commitment != privacy-neutral identifier`.

Portable closures need explicit correlation scope and, where necessary, domain/tenant-scoped commitments or disclosure-on-mismatch techniques. Deduplication convenience cannot silently create a global identity plane.

### 3.11 Minimal disclosure and auditability can coexist only if defeat remains visible

A compact frontier may hide the sensitive identity of the compromised premise while proving that a material dependency is defeated or contested.

`hidden cause != hidden disposition`.

If a consumer's contract requires knowing that a premise is no longer admissible, privacy filtering cannot convert that state to success or absence.

### 3.12 Freshness and append-only consistency are orthogonal

TUF's split between snapshot consistency and timestamp freshness is a useful precedent. A perfectly consistent old compact frontier can still be too stale for a security-sensitive operation.

`internally consistent summary != sufficiently current summary`.

Compaction evidence therefore carries independent currentness/horizon information; consistency proofs do not extend freshness.

### 3.13 Summary supersession must itself be monotonic and rollback-resistant

If closure C2 explicitly supersedes C1 for the same scope, restoring C1 cannot lower the locally remembered floor.

`summary rollback != semantic rollback permission`.

Local activation floors survive application rollback, cache restore and snapshot restore. A newer summary may narrow uncertainty with qualified evidence, but cannot erase the fact that a stronger floor/conflict was previously observed without an explicit authorized requalification relation.

### 3.14 Partial compaction is safer than forcing one universal closure

Some history may be compactable for current admission but still needed for historical effect audit, legal retention, unresolved conflict or proof semantics migration.

`compactable for question Q1 != compactable for Q2`.

The model should permit different retention/summary strata rather than forcing one all-purpose checkpoint.

### 3.15 A summary must declare unsupported historical questions

A closure may intentionally stop supporting detailed queries below a floor. That is valid only if the result is explicit.

`not retained/not provable != false/never happened`.

Candidate dispositions include `BELOW_RETAINED_PROOF_FLOOR`, `UNRESOLVABLE_FROM_SUMMARY`, or `REQUIRES_ARCHIVAL_EVIDENCE`; exact vocabulary remains research-level.

### 3.16 Re-compaction across proof-format or algorithm migration needs bridge evidence

RFC 9942 permits proof-type agility. If C1 uses proof format/algorithm A and C2 uses B, consumers need qualified evidence that C2 covers/subsumes the intended C1 scope; simply hashing C1 into C2 proves inclusion, not semantic equivalence of proof systems.

`new proof format contains old digest != old guarantees preserved`.

Algorithm/proof migration therefore needs an explicit bridge/qualification boundary and preserves historical resolvability where required.

### 3.17 Multi-source compact evidence is not automatically independent evidence

Two receipts/summaries can be generated by nominally different services sharing keys, operators, HSMs, roots or upstream data.

`multiple compact proofs != multiple independent failure domains`.

Existing G4 witness/failure-domain qualification survives compaction; aggregation cannot manufacture independence.

### 3.18 Compaction can reduce operational amplification without weakening semantic horizons

Qualified closures reduce replay bandwidth and long-offline rejoin cost, helping contain requalification storms. But the performance benefit does not authorize stale use.

`smaller reconciliation state != longer security horizon`.

Compression, batching and staged transfer remain operational optimizations under existing currentness and retry/cost budgets.

### 3.19 Portable closure does not imply a central closure issuer

A closure may be produced locally, by a domain authority, by a transparency service, by an archival process or by another qualified component. Its admissibility derives from contractually required evidence, not deployment centrality.

`closure producer != global security oracle`.

The Exchange Plane may transport/bind closures but cannot become canonical compromise authority by doing so.

### 3.20 Compaction correctness should be stated as preservation of named predicates

A useful implementation-independent hypothesis is:

For a history H, closure C, and supported query/predicate set Q, compaction is admissible only if every q in Q yields the same qualified answer from C as from H, including `UNKNOWN/CONTESTED/below-floor` dispositions, under the same declared trust/currentness assumptions.

This is semantic preservation, not byte equality. It provides a future test/proof target without choosing storage or cryptography.

## 4. Candidate vocabulary

Research vocabulary only:

- `RequalificationClosureRef` — portable compact evidence that subsumes a declared portion of requalification history for named questions.
- `ClosureCoverageRef` — explicit trust-domain, claim, profile, temporal, conflict and lineage coverage of a closure.
- `SubsumptionProofRef` — evidence that a successor closure preserves the named obligations/questions of predecessor material.
- `NegativeFloorCommitmentRef` — commitment to revocation/retirement/defeat state required to prevent resurrection.
- `ConflictClosureRef` — compact representation preserving unresolved qualified conflict without choosing a winner.
- `ObservationProvenanceRef` — runtime-local observation/activation evidence retained or referenced across shared compaction.
- `LineageClosureRef` — compact structure preserving material dependency reachability for selective requalification.
- `CorrelationScopeRef` — declares where a compact identifier/commitment may be linkable.
- `ProofMigrationBridgeRef` — qualified relation between predecessor and successor proof/VDS/algorithm regimes.
- `UnsupportedHistoricalQueryDisposition` — explicit result when a compact closure no longer supports a requested historical proof question.

These are candidate structural refs/roles, not shared business entities or concrete components.

## 5. Candidate proof obligations

1. Every closure declares the exact trust-domain/claim/profile/time/conflict/lineage scope it covers.
2. Compaction preserves all named live safety, recovery, historical-interpretation and selective-requalification predicates.
3. Independent trust domains remain separately qualified; aggregation never creates a synthetic global revision.
4. Cryptographic consistency/inclusion proves only committed structure and is not promoted to semantic subsumption.
5. Negative/floor evidence survives every supported resurrection path or is subsumed by a stronger durable fence.
6. Unresolved conflict remains unresolved after compaction absent explicit qualified resolution evidence.
7. Shared compaction does not rewrite runtime-local observation/activation times.
8. Material dependency reachability remains sufficient for sound selective invalidation after compaction.
9. Compaction boundaries follow semantic/proof/privacy obligations rather than storage topology by default.
10. Compact identifiers/commitments have declared correlation scope and do not create accidental global identity handles.
11. Minimal disclosure preserves material defeat/contested disposition required by the consumer contract.
12. Freshness/currentness remains independently checked from structural consistency.
13. Successor closure activation is rollback-resistant under the applicable local floor.
14. Different supported questions may use different retention/summary strata without pretending one closure answers all of them.
15. Unsupported/below-retention historical queries return explicit qualified dispositions, never fabricated negative facts.
16. Proof/VDS/algorithm migration carries explicit bridge/qualification evidence when predecessor guarantees must survive.
17. Aggregating multiple compact proofs does not claim independence without qualified failure-domain evidence.
18. Compaction/reconciliation optimization cannot extend semantic/security freshness or mint retry/cost authority.
19. Closure production/transport does not make producer, gateway, broker or Exchange Plane canonical security/business authority.
20. Long-offline runtimes can validate an admissible closure using locally durable trust/re-bootstrap evidence without Builder availability.
21. A closure digest commits every field material to its advertised semantics or explicitly references independently immutable evidence.
22. Re-compaction preserves predecessor conflict/floor coverage transitively or exposes an explicit loss/incompatibility disposition.
23. Restoring an older closure cannot resurrect evidence already defeated by a stronger locally activated floor.
24. If closure evidence is insufficient to prove subsumption, compaction is rejected or the affected query degrades to `UNKNOWN/CONTESTED/UNRESOLVABLE`, never optimistic success.

## 6. Adversarial cases

1. `securityRevision=max(A,B)` flattens unrelated trust domains.
2. Merkle consistency proof is treated as proof that new semantic policy subsumes old policy.
3. Closure stores only latest trusted root and omits why older roots are defeated.
4. Compactor resolves conflicting compromise intervals by newest timestamp.
5. Compactor drops runtime observation time and rewrites old decisions as if compromise were known earlier.
6. Lineage is removed, so a later compromised dependency cannot locate derived cached proofs.
7. Database shard boundary is used as semantic compaction boundary and splits one proof obligation.
8. Global subject hash in closure correlates the same hidden dependency across tenants.
9. Privacy filter hides `CONTESTED` together with the sensitive cause.
10. Old but internally consistent closure is accepted beyond its security horizon.
11. Application snapshot restore replaces C2 with older C1 and lowers a learned floor.
12. One universal closure drops effect-audit history still required for irreversible external actions.
13. Missing historical evidence below compaction floor is returned as `not compromised`.
14. New proof algorithm includes hash of old closure and claims semantic equivalence without bridge qualification.
15. Two receipts from services sharing the same root/HSM are counted as independent witnesses.
16. Compaction is used to justify extending freshness because replay is expensive.
17. Central compactor becomes mandatory online oracle for every runtime admission.
18. Broker ACK of closure transfer is treated as durable local activation.
19. Re-compaction drops a predecessor conflict marker because current positive state appears healthy.
20. Closure digest omits normative profile identifier, allowing same bytes to be interpreted under changed semantics.
21. Closure advertises full coverage but excludes negative evidence retained in a separate unavailable archive.
22. Long-offline runtime cannot verify closure's proof format and silently trusts gateway translation.
23. Compactor converts `UNKNOWN` into absence to reduce state cardinality.
24. Summary producer claims all peers are converged because they share its closure while an independent trust domain remains unseen.

## 7. Technology-independent decision criteria

A requalification history is a candidate for compaction only when all of the following are demonstrable for the intended scope:

1. **Coverage:** the closure names exactly which trust domains, claims, profiles, intervals and conflict classes it covers.
2. **Predicate preservation:** every still-supported safety/recovery/audit query retains the same qualified answer under declared assumptions.
3. **Anti-resurrection:** defeated evidence cannot re-enter through rollback, restore, stale cache, archival replay or old runtime rejoin.
4. **Lineage sufficiency:** later material dependency defeat can still identify affected live derived evidence soundly.
5. **Conflict preservation:** unresolved conflicts survive as conflicts.
6. **Currentness separation:** structural consistency does not replace freshness/security-horizon checks.
7. **Privacy:** commitments/handles have bounded correlation scope and disclose no more than the contract requires.
8. **Portability:** closure semantics are independent of storage/broker/provider topology and have an exit/re-bootstrap path.
9. **Proof agility:** proof-format/algorithm changes preserve required historical guarantees through qualified bridge evidence.
10. **Autonomy:** an autonomous runtime can validate and activate a closure without mandatory Builder or central Exchange Plane availability.

If any required property cannot be established, retain the relevant detail or expose an explicit unsupported/unknown disposition. Storage pressure alone is not authority to forget semantics.

## 8. Deduplication and non-decisions

This round does not reopen generic log compaction, cache invalidation, archival retention, CT/SCITT adoption, TUF adoption, compromise-window derivation, verifier diversity, business split-brain, effect settlement, or DR. It specializes one unresolved question:

`distributed requalification histories -> proof-preserving cross-domain closure -> anti-resurrection + conflict + lineage + privacy preservation`.

No implementation architecture, provider, storage engine, broker, VDS, cryptographic suite or schema is authorized.

## 9. Maturity and next gap

Material delta exists. The family remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

The next highest-value gap is **closure portability across runtimes that support different verifier/proof generations**: how a long-offline runtime safely consumes a compact closure whose proof/VDS/algorithm generation post-dates its local verifier, without trusting a gateway to reinterpret semantics, forcing permanent retention of every historical verifier, or converting unsupported proof semantics into false incompatibility/success.

## 10. Sources

- RFC 9162 — Certificate Transparency Version 2.0: https://www.rfc-editor.org/rfc/rfc9162.html
- RFC 9942 — COSE Receipts: https://www.rfc-editor.org/rfc/rfc9942.html
- RFC 9943 — An Architecture for Trustworthy and Transparent Digital Supply Chains (SCITT): https://www.rfc-editor.org/rfc/rfc9943.html
- The Update Framework — Security: https://theupdateframework.io/docs/security/
- The Update Framework — Roles and metadata: https://theupdateframework.io/docs/metadata/
