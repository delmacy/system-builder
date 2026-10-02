# G4 — Multi-Domain Evidence / Anti-Equivocation Composition

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the highest-value remaining gap from witness governance: how an autonomous runtime composes independently valid evidence from multiple transparency/trust domains (for example capability contract/effect evidence, issuer/accountability evidence, security/update evidence and authority evidence) when revisions, witness policies, freshness horizons and partitions differ.

This is not a new macro-family. It does not require a global transaction, global transparency service, shared database, broker, consensus system or Builder dependency, and grants no implementation authority.

## Evidence classes reviewed

Primary/standards evidence:

- C2SP `tlog-checkpoint`, `tlog-policy`, `tlog-witness` and `tlog-mirror`: a checkpoint is an origin-scoped append-only frontier; verifier policy qualifies accepted logs/witness quorums; witness consistency is relative to a remembered frontier; mirrors preserve one consistent branch but do not create cross-origin semantic atomicity.
- RFC 9162 Certificate Transparency v2: clients may require SCTs from multiple independent logs to reduce collusion/key-compromise risk, while trust/distrust of those logs remains independently governed; multiple valid SCTs are defense diversity, not one shared transaction.
- The Update Framework (TUF): `snapshot` metadata binds a consistent set of repository metadata versions/hashes and prevents mix-and-match of metadata from different repository states; `timestamp` separately supplies freshness. This is a useful benchmark for an explicitly authored consistency manifest inside one authority domain, not evidence that unrelated domains are automatically mutually compatible.
- Sigstore/Rekor operational documentation: transparency logs can rotate/shard while preserving lookup/verification semantics; a log entry/checkpoint supplies historical transparency evidence, not application-semantic compatibility across independent domains.
- Prior G4 witness governance, issuer accountability, offline security floors, in-flight contract evolution, evidence-minimal reconciliation and causal/effect composition research.

Primary references:
- https://c2sp.org/tlog-checkpoint
- https://c2sp.org/tlog-policy
- https://c2sp.org/tlog-witness
- https://c2sp.org/tlog-mirror
- https://www.rfc-editor.org/rfc/rfc9162
- https://theupdateframework.io/docs/metadata/
- https://docs.sigstore.dev/logging/sharding/
- https://docs.sigstore.dev/about/security/

## 1. Central boundary: local validity does not imply cross-domain compatibility

Suppose a runtime has independently qualified evidence:

```text
Capability domain: C17 = VALID + CURRENT
Issuer domain:     I42 = VALID + CURRENT
Security domain:   S9  = VALID + CURRENT
Authority domain:  A31 = VALID + CURRENT
```

Those propositions are each domain-local. They do not prove that `C17`, `I42`, `S9` and `A31` were intended to be used together.

```text
All domains locally valid
!= cross-domain compatible state
```

Example: `S9` may revoke the provider generation referenced by `C17`; `A31` may revoke an authority admitted by `I42`; or `C17` may require a minimum issuer-policy revision later than `I42` even though both are individually current under their own clocks/policies.

Therefore the composition problem is not solved by a boolean AND over green checks.

## 2. Composition is a vector plus declared predicates, not one synthetic global revision

A candidate implementation-independent model is a **qualified evidence vector**:

```text
EvidenceVector
  capability: { domain, revision/frontier, policyRevision, observedAt, freshness }
  issuer:     { domain, revision/frontier, policyRevision, observedAt, freshness }
  security:   { domain, revision/frontier, policyRevision, observedAt, freshness }
  authority:  { domain, revision/frontier, policyRevision, observedAt, freshness }
```

and separately a set of capability-owned or interaction-contract-owned predicates such as:

```text
requires security >= S8
requires issuerPolicy in compatibleSet(I40..I45)
forbids providerGeneration P3
requires authorityRevision >= A29
```

Research boundary:

```text
Cross-domain composition
!= synthetic global revision number
```

A global scalar would fabricate total ordering between domains whose changes may be independent and would tend to create a central authority accidentally.

## 3. Domain checkpoint and composition evidence are different proof objects

A transparency checkpoint answers questions about one log/origin and its evolution. A composition witness answers a different question: which domain frontiers/revisions were jointly admitted for a particular contract/release/interaction class.

```text
Domain checkpoint valid
!= composition predicate satisfied
```

A candidate `CompositionEvidence` may reference domain-qualified frontiers and the rule/revision under which they were accepted. It must not copy domain-owned business state into the Shared Semantic Kernel.

This is research vocabulary, not a schema.

## 4. TUF snapshot is a useful pattern, but only where one authority intentionally authors a set

TUF `snapshot` metadata prevents an attacker from mixing metadata versions that never belonged to one repository snapshot. It demonstrates an important general principle:

```text
Consistent set requires an authored/bound consistency relation
```

However, applying one global snapshot across autonomous capability, issuer, security and authority domains would silently create a global transaction/authority. Therefore G4 should distinguish:

1. **authored composition**: an artifact/release/contract intentionally binds minimum/exact compatible revisions;
2. **predicate composition**: independent domains remain autonomous and a verifier evaluates declared compatibility predicates;
3. **coordinated transition**: a narrow hard invariant genuinely requires a jointly authorized transition;
4. **unknown/incompatible**: no proof exists that the observed domain states compose safely.

```text
No global snapshot
!= no composition discipline
```

## 5. Multiple logs provide diversity, not semantic atomicity

RFC 9162 recommends SCTs from multiple logs to reduce the effectiveness of CA+log collusion and log compromise. Those logs can be trusted/distrusted independently.

This supports:

```text
Multiple valid transparency domains
!= one atomic semantic state
```

Redundant logging of the same proposition can improve evidence diversity. Different domains carrying different propositions instead require explicit compatibility rules. The Exchange Plane must not infer that two signed/current checkpoints are mutually compatible merely because both verify.

## 6. Currentness is domain-relative and composition has a weakest-required-proof boundary

Different domains legitimately have different freshness horizons:

```text
security currentness <= 15 min
issuer/accountability <= 6 h
capability contract <= 7 d
historical effect evidence <= retention policy
```

The composition result should preserve each domain's currentness rather than collapse it into one timestamp.

For an interaction, only required domains participate. A read-only query may not require the same issuer/accountability evidence as an irreversible spend. Therefore:

```text
Composition freshness
is interaction-contract relative
```

and:

```text
One stale required domain
!= every domain invalid
```

The correct result may be `COMPOSITION_NOT_CURRENT`, `PARTIAL/UNKNOWN`, `INCOMPATIBLE`, or a narrower operation set, while unrelated capabilities continue safely.

## 7. Fork/staleness containment should follow dependency edges

If issuer domain `I` forks, capabilities that do not consume issuer evidence should not automatically stop. If security domain `S` becomes stale and a capability requires fresh `S`, that capability's affected effects must follow its stale-security disposition.

Candidate principle:

```text
Domain failure blast radius
follows declared proof dependencies
```

This preserves modularity and prevents one transparency domain from becoming a platform-wide hidden singleton.

A composition dependency graph is therefore preferable to an implicit rule that every interaction depends on every global domain.

## 8. `UNKNOWN` must survive cross-domain composition

Suppose `C17` requires `S >= S8`, the runtime has `S9`, but the security checkpoint is beyond its freshness horizon. The runtime cannot safely rewrite this as either compatible or revoked.

```text
Locally valid + stale required evidence
=> composition may be UNKNOWN/NOT_CURRENT
```

Likewise, if one domain fork is detected, prior effects do not disappear and unaffected domain evidence does not become false. Reconciliation must preserve effective time, observation time and which composition rule was used when the effect occurred.

## 9. Cross-domain compatibility is not necessarily symmetric or transitive

Examples:

- security policy `S9` may permit provider `P4`, while provider contract `C17` does not satisfy a new security requirement;
- release `R5` may explicitly support issuer policies `I40..I45`, while issuer policy `I44` has no knowledge of release `R5`;
- adapter mediation may make `C17 -> I44` acceptable under a qualified loss/translation rule without implying `I44 -> C17` or compatibility with `C18`.

Therefore compatibility should be evaluated as declared predicates/relations, not assumed equivalence classes.

```text
A compatible-with B
!= B compatible-with A
!= transitive compatibility
```

## 10. Composition manifests must not become accidental business authority

A release or interaction contract may bind refs such as minimum security revision, issuer policy profile or accepted authority roots. That binding is a statement about admissible dependencies, not ownership of those domains.

```text
Composition reference
!= ownership transfer
```

The Shared Semantic Kernel may need stable primitives for domain-qualified refs, revision/currentness/evidence refs and qualified relations. It should not contain issuer accounts, security policies, capability business entities or global workflow state merely to make composition convenient.

## 11. Reconciliation after one domain forks

Candidate sequence when a previously accepted domain later proves forked/stale:

1. preserve the exact evidence vector and composition-rule revision observed at effect time;
2. classify which dependency edges are affected;
3. obtain newer/non-equivocating evidence where possible;
4. re-evaluate the historical composition predicate without rewriting what the runtime knew then;
5. classify affected effects as still valid under declared grace, policy violation, `UNKNOWN`, compensation/forward-recovery candidate, or manual review according to capability-owned semantics;
6. keep unaffected domains/capabilities operating when their proof dependencies remain satisfied.

```text
One domain forked
!= whole platform history false
```

## 12. Preventive coordination is required only for genuinely joint hard invariants

Some transitions may require that two authorities change together, for example a security floor and a provider generation where either intermediate combination is forbidden. In that narrow case, a jointly authorized transition/bridge can be justified.

But this must not be generalized into a global transaction across all transparency domains.

```text
Joint hard invariant
=> qualified joint transition may be required

Independent evidence domains
!= global two-phase commit requirement
```

This reuses the existing G4 rule that coordination scope follows the invariant.

## 13. Topology and transport remain realization details

Composition semantics can be carried through local files, signed bundles, RPC, broker messages, replicated metadata, offline media or other transports. The proof meaning must survive transport substitution.

A gateway/adapter may gather or translate evidence formats, but it must not manufacture missing compatibility:

```text
Evidence aggregation
!= semantic compatibility fabrication
```

A service mesh can secure transport and propagate identity context; it cannot decide cross-domain business/security compatibility unless that decision is explicitly delegated by a contract.

## 14. Candidate composition dispositions

Avoid a single boolean `allGreen`:

```text
COMPOSITION_QUALIFIED_CURRENT
COMPOSITION_QUALIFIED_WITH_DECLARED_STALE_GRACE
COMPOSITION_PARTIAL_UNKNOWN
COMPOSITION_INCOMPATIBLE
COMPOSITION_FORK_SUSPECTED
COMPOSITION_POLICY_TRANSITION_PENDING
COMPOSITION_QUARANTINED
```

These are candidate research vocabulary only.

## 15. Proof obligations

Before implementation planning, prove or explicitly bound:

1. locally valid domain evidence is not treated as proof of mutual compatibility;
2. each interaction declares which evidence domains it actually requires;
3. each required domain preserves its own identity, revision/frontier, policy revision and currentness;
4. no synthetic global revision silently creates a total order/authority across autonomous domains;
5. cross-domain compatibility predicates have explicit ownership and revision;
6. composition refs do not transfer canonical business ownership;
7. a domain checkpoint is not treated as a composition proof;
8. redundant logs of one proposition are distinguished from different domains carrying different propositions;
9. stale required evidence remains stale/UNKNOWN rather than green because other domains are current;
10. one stale/forked domain does not halt capabilities with no declared dependency on it;
11. blast radius follows declared proof dependencies;
12. compatibility directionality/non-transitivity is representable;
13. adapter/gateway format translation cannot fabricate missing semantic compatibility;
14. historical effect evidence preserves the evidence vector and composition rule observed at effect time;
15. later fork/revocation does not rewrite historical runtime knowledge;
16. jointly coordinated transition is required only where a named hard invariant proves it necessary;
17. offline runtimes can verify cached composition evidence within declared freshness horizons without Builder reachability;
18. composition-policy revision itself has authority/currentness/anti-rollback semantics;
19. replacement transparency technologies can preserve domain-qualified refs and dispositions without changing promised meaning;
20. no composition mechanism becomes canonical business truth or a mandatory global runtime service by convenience.

## 16. Adversarial cases

1. Capability, issuer and security checkpoints are all green, but security policy revokes the provider referenced by the capability contract.
2. Runtime computes `all(checkpoint.valid)` and authorizes an irreversible effect.
3. A global `platformRevision=52` hides that issuer and security domains advanced independently.
4. Composition service is unavailable and every client runtime stops despite cached qualified evidence.
5. Security evidence is stale; fresh issuer evidence causes the aggregate status to be labelled current.
6. Issuer domain forks, and an unrelated read-only capability is halted because every capability implicitly depends on every domain.
7. Security domain forks, but gateway serves the last green aggregate without exposing fork suspicion.
8. A release manifest pins exact issuer revision forever and blocks safe independent issuer evolution even though a range/predicate would suffice.
9. Compatibility predicate is changed without revisioning, making old effects appear to have been admitted under the new rule.
10. Adapter translates revision identifiers but silently drops the security-domain origin, creating collisions.
11. Two domains use revision `42`; aggregator mistakes numeric equality for semantic alignment.
12. Domain A says B is acceptable, and implementation assumes compatibility is symmetric.
13. A->B and B->C are valid mediations; implementation assumes A->C is valid without proof.
14. Global snapshot service starts storing capability business state to simplify composition and becomes accidental canonical owner.
15. Runtime reconnects after partition and overwrites the historical evidence vector with latest frontiers.
16. Later security revocation causes prior effects to be deleted instead of reconciled according to effective/observation time.
17. Multiple independent logs attest the same artifact and verifier mistakes diversity for cross-domain atomicity.
18. One joint transition genuinely requires coordination, but asynchronous independent updates expose a forbidden intermediate combination.
19. Conversely, a platform-wide transaction is imposed for unrelated domains, destroying availability/autonomy without preserving any named invariant.
20. Gateway returns `200 OK / compatible=true` although one required domain is `UNKNOWN` because its verifier timed out.

## 17. Portability / exit path

Portable semantics are domain-qualified evidence refs, revision/frontier and policy revision, currentness/freshness disposition, compatibility-predicate identity/revision, dependency edges, composition disposition, historical observed/effective times and reconciliation evidence.

Merkle logs, C2SP formats, CT, TUF, Rekor, witness networks, consensus systems, databases, brokers, service meshes, RPC protocols and cloud services remain realization details. A replacement may declare `INCOMPATIBLE` rather than collapse a multidomain proof into a weaker boolean.

## 18. Deduplication against existing G4 research

This round does not reopen witness quorum governance, issuer conservation/accountability, security floors, in-flight contract evolution, causal workflow or base Exchange Plane vocabulary. It adds the missing composition layer: **how independently governed proof domains are jointly qualified without pretending they share one revision, one currentness horizon, one authority or one global transaction**.

## 19. Maturity and next gap

Material boundaries changed, so this round is not `NO_MATERIAL_DELTA`.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value remaining gap: **composition-policy lifecycle and downgrade/rollback safety** — determine how composition predicates/manifests themselves evolve across autonomous runtimes, how old/new composition-policy generations overlap without admitting forbidden combinations, how emergency security changes supersede cached composition rules, and how to preserve offline autonomy without allowing a stale composition policy to bypass newer domain security floors.