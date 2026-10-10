# G4 — Relationship-Proof Concurrency and Conflicting Succession Claims

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How should autonomous capability domains represent and reconcile concurrent or conflicting succession claims such as `A1 -> A2` and `A1 -> A3`, controller compromise, relationship revocation racing with offline effects, and provider migration during divergence, without treating wall-clock latest, resolver availability, or a central identity graph as semantic authority?

This document extends the cross-domain relationship rotation lifecycle, split-brain authority rejoin, semantic-generation handoff, revocation/currentness and evidence-compaction research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, protocols and mature-system evidence reviewed:

- W3C DID Core: verification-method rotation and revocation are lifecycle operations; revocation cannot retroactively rewrite historical versions, and compromise can make attacker and legitimate-controller use indistinguishable during the exposure interval.
- IETF KERI draft: independently verifiable but inconsistent key-event histories are explicit evidence of duplicity; a validator may require one-and-only-one valid history or refuse reliance. Rotation is an establishment event, not a timestamp preference.
- Sigstore threat/security model: identity-provider or signer compromise can produce apparently valid credentials; transparency and independent monitoring provide detection/accountability, while TUF-backed trust-root rotation/revocation supports recovery.
- Sigstore Rekor sharding: a log generation may be frozen while keys/topology rotate without changing the identity of historical entries, illustrating separation between storage/log generation and statement identity.
- IETF SCITT RFC 9943: transparency records issuer statements and receipts but does not prevent dishonest/compromised issuers; it supplies audit evidence rather than semantic truth.
- Prior G4 split-brain, semantic-generation, cross-domain floor, delegation/revocation, relationship rotation and offline-security research.

These are evidence/benchmarks only. No DID method, KERI, Sigstore, TUF, SCITT, transparency log, consensus protocol or identity registry is selected.

## 3. Material findings

### 3.1 Succession is a qualified authority claim, not an ordering fact

Two claims `A1 -> A2` and `A1 -> A3` cannot be resolved merely because one has a later wall-clock timestamp, higher provider-local sequence, or currently reachable resolver.

`Latest timestamp != legitimate successor`.

`Resolver availability != succession authority`.

A succession claim is admissible only under the authority, policy/profile, predecessor frontier and recovery rules governing that identifier/relationship domain.

### 3.2 Concurrent branches are evidence of divergence, not permission to merge

If A2 and A3 both descend from A1, the system must represent a fork until the governing contract proves that the branches are compatible, one is defeated/fenced, or a qualified recovery/reconciliation event supersedes them.

`Two verifiable successors != two jointly admissible successors`.

`Branch mergeability != authority mergeability`.

KERI's duplicity model is a useful benchmark: mutually inconsistent yet individually verifiable histories can be positive evidence that relying on either as current authority is unsafe.

### 3.3 Cryptographic validity does not decide control legitimacy after compromise

A compromised controller can issue syntactically and cryptographically valid succession material. Therefore:

`Signature valid != succession legitimate`.

`Controller key held != controller authority uncontested`.

Recovery/fencing evidence, threshold/recovery authority, transparency witnesses or another declared mechanism may be required. The mechanism remains implementation-independent.

### 3.4 Succession conflict needs an explicit disposition vocabulary

A binary `valid/invalid` loses essential state. Candidate research dispositions include:

- `CURRENT_UNCONTESTED`
- `FORK_DETECTED`
- `RECOVERY_PENDING`
- `DEFEATED/FENCED`
- `HISTORICAL_ONLY`
- `BELOW_RETENTION`
- `UNRESOLVED`
- `UNKNOWN`

These are research vocabulary, not schema/enums.

### 3.5 Conflict scope follows the protected relation/invariant

A fork in authentication-key succession does not automatically invalidate every historical business relationship. Conversely, a fork in the relationship owner/controller itself can make new effects unsafe even when endpoint identities remain resolvable.

`Endpoint succession conflict != universal business-state conflict`.

`Relationship authority conflict != mere key-health incident`.

The affected operations are those whose required proof cut intersects the contested authority/relation.

### 3.6 Recovery is a new qualified transition, not retroactive history deletion

A recovery decision can establish a successor frontier and fence losing branches, but it does not erase that effects or statements may have occurred on a compromised branch.

`Recovery winner selected != losing-branch history never happened`.

Historical effects retain provenance, settlement/compensation and incident evidence.

### 3.7 Transparency supplies accountability, not automatic conflict resolution

Sigstore/SCITT demonstrate that append-only transparency can make statements and misuse auditable. But inclusion proves registration/existence, not that the issuer/controller was semantically entitled to make the claim.

`Transparent succession claim != legitimate succession claim`.

`Receipt/inclusion != authority adjudication`.

A future Exchange Plane may carry transparency evidence but cannot turn a log into canonical business authority.

### 3.8 Independent observation can expose equivocation

Conflicting histories may remain hidden if each runtime sees only one branch. Witnesses/monitors/gossip-like comparison can reveal equivocation without requiring a central identity oracle.

`Locally consistent view != globally uncontested view`.

However, detection evidence does not itself choose the winner; it changes the disposition to contested and invokes the declared reconciliation policy.

### 3.9 Relationship revocation racing offline effects needs temporal qualification

If relation R is revoked while an autonomous runtime remains offline, an effect admitted before observation may be historically attributable yet no longer admissible after the revocation's effective floor.

`Effect admitted offline != effect automatically legitimate after reconnect`.

`Revocation observation time != revocation effective time != effect time`.

The existing G4 offline horizon and reconciliation rules apply: queued/unknown work is requalified before new irreversible effects when the relevant horizon/floor has advanced.

### 3.10 A fork can make offline continuation unsafe before local TTL expiry

A locally fresh credential/evidence item may still be defeated by a fork/recovery event unknown to the runtime. Offline autonomy therefore depends on the declared conflict/revocation currentness horizon, not merely cache age.

`Local TTL fresh != globally uncontested authority`.

High-risk effects may require shorter horizons, preallocated rights, or fail-closed behavior; this research does not choose the policy.

### 3.11 Provider migration cannot adjudicate an existing fork by representation choice

Migrating from provider P1 to P2 while A2/A3 are contested must preserve the conflict state and lineage. Mapping only one branch because P2 has a single `subject` field fabricates resolution.

`Provider canonicalization != semantic reconciliation`.

`Single-slot target schema != one legitimate successor`.

An adapter either represents the conflict/lossiness explicitly or reports incompatibility.

### 3.12 Topology and transport changes do not reset conflict identity

A succession fork remains the same semantic conflict if traffic moves from direct RPC to broker, from gateway G1 to G2, or between regions.

`Route change != conflict resolution`.

Stable conflict/evidence lineage is separate from transport correlation IDs.

### 3.13 Conflict detection must not create a global identity graph

Comparing branch commitments or purpose-scoped succession evidence can reveal conflict without requiring a permanent global subject identifier.

`Conflict comparability != global subject correlation permission`.

Privacy/collusion assumptions from prior G4 relationship research continue to apply.

### 3.14 A recovery authority is itself a bounded authority

Possessing authority to recover identifier/control state does not automatically grant business authority, ownership of the subject, or permission to rewrite historical relations.

`Can recover control != owns business entity`.

`Recovery authority != unrestricted mutation authority`.

### 3.15 Threshold/quorum recovery is policy-specific, not count magic

Multiple signatures or witnesses do not create a quorum unless the governing contract declares which authorities count, threshold semantics, independence assumptions and currentness.

`N signatures != qualified quorum`.

Correlated compromise can defeat apparently diverse signers; the existing G4 witness-governance research remains applicable.

### 3.16 Conflict resolution needs explicit fencing for future effects

Selecting A2 as successor is insufficient if A3 can still exercise effects through external systems.

`Succession decision != losing branch fenced`.

Effect-side fencing/revocation must be proven where required, mirroring prior split-brain authority-rejoin findings.

### 3.17 Historical proofs retain original branch identity

After reconciliation, old proofs from A3 are not silently rewritten as if issued by A2. They remain attributable to their original branch and evaluated under historical/current policy as appropriate.

`Recovered continuity != proof reinterpretation`.

This preserves auditability and prevents recovery from laundering compromised history.

### 3.18 Compaction must retain unresolved fork questions

A checkpoint/frontier may compact branch history only if every live question remains answerable: predecessor, competing successors, governing profile, recovery/fencing disposition, unresolved external effects and relevant currentness floors.

`Compaction != fork forgetting`.

If evidence needed to adjudicate a live conflict falls below retention, the result is `BELOW_RETENTION/UNRESOLVED`, not a guessed winner.

### 3.19 Normal operation resumes per affected invariant, not globally

A fork affecting one relationship need not stop unrelated capabilities. Conversely, restoring connectivity or resolving endpoint identity does not imply all dependent business obligations are settled.

`One relationship reconciled != platform globally reconciled`.

This preserves autonomous bounded contexts and avoids a central recovery barrier.

### 3.20 The Exchange Plane transports conflict semantics but does not adjudicate business ownership

The logical Exchange Plane may carry branch IDs/commitments, contest/recovery evidence, floors, currentness and reconciliation outcomes. It must not become the canonical identity graph, controller court, or business owner.

`Exchange Plane exposes qualified conflict != Exchange Plane owns succession truth`.

Adjudication authority remains contract/domain-specific.

## 4. Candidate research vocabulary

Research vocabulary only; no schema is authorized.

- `SuccessionClaimRef` — evidence that one endpoint/relationship generation claims to succeed another.
- `SuccessionBranchRef` — domain-scoped branch identity, not a global subject identifier.
- `SuccessionFrontier` — known branch/predecessor/currentness/recovery frontier for one qualified relation/invariant.
- `ConflictEvidenceRef` — evidence that mutually incompatible claims/histories exist.
- `RecoveryAuthorityRef` — reference to the policy/authority permitted to establish recovery transitions.
- `RecoveryDecisionRef` — qualified decision selecting/superseding/fencing branches under declared policy.
- `BranchFenceRef` — evidence that a losing branch can no longer exercise protected effects.
- `SuccessionDisposition` — qualified current/contested/recovery/defeated/historical/unresolved state.

## 5. Candidate proof obligations

1. Succession is resolved by declared authority/policy, never wall-clock latest alone.
2. Provider-local sequence numbers are not compared across independent authority domains as a global order.
3. Concurrent verifiable successors remain explicitly representable as a fork.
4. Cryptographic validity is not relabeled as uncontested control legitimacy.
5. Conflict detection changes disposition without itself choosing a winner.
6. Recovery authority is explicit, bounded and distinct from business ownership.
7. Threshold/quorum recovery declares eligible authorities, threshold, independence and currentness assumptions.
8. A recovery decision preserves historical branch provenance rather than rewriting history.
9. Losing branches are fenced/revoked where future protected effects would otherwise remain possible.
10. Relationship/key/controller conflict scopes only the operations/invariants whose proof cuts depend on it.
11. Historical effects on losing/compromised branches remain facts with settlement/remediation obligations.
12. Transparency inclusion/receipt is treated as accountability evidence, not semantic authority.
13. Independent monitoring/witness evidence can expose equivocation without becoming a central identity owner.
14. Offline operation remains bounded by conflict/revocation currentness horizons, not cache TTL alone.
15. Reconnect requalifies queued/new effects against the current succession/revocation frontier before irreversible execution where required.
16. Provider migration preserves fork/conflict lineage or exposes explicit incompatibility/lossiness.
17. Target schemas/interfaces cannot collapse multiple branches into a fabricated winner.
18. Transport/topology changes preserve semantic conflict identity.
19. Conflict comparison does not introduce a permanent cross-domain subject join key unless independently authorized.
20. Historical proofs remain bound to the branch/profile under which they were produced.
21. Compaction retains enough evidence to answer every live fork/recovery/fencing question.
22. Below-retention conflict evidence yields explicit unresolved behavior rather than guessed succession.
23. Runtime autonomy does not require a central identity/recovery oracle when locally sufficient evidence closure exists.
24. Exchange Plane carries exchange/conflict evidence but does not own business succession/adjudication semantics.

## 6. Adversarial cases

1. A1 signs A2 and A3 concurrently; middleware chooses the later timestamp.
2. Provider P1 assigns sequence 20 to A2 and P2 assigns 30 to A3; system treats 30 as globally newer.
3. Both branches are cryptographically valid, so both are accepted for protected effects.
4. Compromised controller signs A3 and signature validity is treated as proof of legitimate recovery.
5. Transparency log inclusion of A3 is treated as authority adjudication.
6. Two isolated runtimes each see one internally consistent branch and both continue irreversible effects indefinitely.
7. Conflict monitor detects equivocation and silently selects its preferred branch despite lacking recovery authority.
8. Recovery quorum counts three signatures that share one compromised administrative/root trust domain.
9. A2 is selected but A3 retains external effect credentials and continues acting.
10. Recovery deletes historical A3 effects from projections/audit evidence.
11. Relationship R is revoked while runtime is offline; queued effects execute before floor reconciliation.
12. Local credential TTL remains fresh after a remote fork/recovery and is treated as uncontested authority.
13. Provider migration to a single-subject schema drops A3 and claims the fork is resolved.
14. Adapter merges A2/A3 attributes into a synthetic identity record.
15. Gateway route change generates a new conflict ID and loses linkage to the unresolved fork.
16. Trace/correlation ID used for conflict tracking becomes a global subject identifier.
17. Recovery key/controller is granted business-owner permissions by convenience.
18. Old proof from A3 is rewritten as proof from A2 after recovery.
19. Compaction drops the predecessor/frontier needed to prove A2 and A3 were competing successors.
20. Below-retention evidence is translated into `A2 wins` rather than `UNRESOLVED`.
21. Endpoint identity conflict unnecessarily stops unrelated capabilities with independent invariants.
22. Endpoint conflict resolves, so system assumes external effects are settled too.
23. Exchange Plane stores canonical identity graph to simplify fork resolution.
24. Builder availability becomes mandatory to adjudicate every runtime succession conflict despite autonomous-runtime claims.

## 7. Portability / exit path

This hypothesis does not require DID, KERI, Sigstore, TUF, SCITT, Certificate Transparency, a blockchain, consensus service, identity graph, broker, gateway or centralized resolver.

Any future realization must preserve:

- authority-qualified succession rather than timestamp/provider-order selection;
- explicit fork/contest/recovery/fencing states;
- separation of cryptographic validity, transparency, currentness and semantic authority;
- bounded recovery authority and invariant-scoped effect fencing;
- historical provenance and unresolved-effect preservation;
- bounded offline autonomy and reconnect requalification;
- provider/transport substitution without fabricated reconciliation;
- privacy-scoped conflict comparison without global identity collapse;
- compaction only when live fork/recovery questions remain answerable.

## 8. Deduplication against existing G4 research

This round does not reopen generic split-brain, key rotation, revocation, transparency, provider migration or relationship privacy. The material delta is their intersection at a **contested relationship/identifier succession frontier**: competing successors may each be internally valid, and recovery requires explicit authority plus future-effect fencing while preserving historical branch facts and runtime autonomy.

## 9. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

The next high-value gap is **succession-conflict propagation through dependent relationship proofs and cached derived guarantees**: determine how a newly discovered fork invalidates or downgrades derived `same-subject`, `owns`, `controls`, delegation and authorization proofs without O(N) synchronous fan-out; how recovery/fencing propagates selectively; and how autonomous runtimes represent `contested ancestor`, `recovery pending`, `branch fenced` and `historical-only` across offline horizons without creating a central identity/conflict oracle.

No implementation, provider, identity model, cryptographic construction, consensus mechanism or architecture binding is authorized by this research.