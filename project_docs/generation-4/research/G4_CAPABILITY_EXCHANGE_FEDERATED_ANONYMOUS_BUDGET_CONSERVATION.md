# G4 — Federated Anonymous Budget Conservation & Sybil Resistance

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the existing privacy-preserving abuse/rate/cost-governance research by asking when multiple autonomous issuers/attesters/runtimes may grant privacy-preserving spend rights against shared or overlapping budgets without creating a global identity graph, double issuance, hidden oversubscription or a mandatory online central authority.

This is not a new macro-family. It selects no anonymous-credential scheme, issuer topology, allocator, consensus system, Sybil-defense mechanism, identity provider, broker or database and grants no implementation authority.

## Evidence classes reviewed

- IETF RFC 9576 Privacy Pass Architecture: explicit issuer/attester/origin trust and collusion models; per-origin versus cross-origin tokens; state requirements for cross-origin redemption; anonymity-set partitioning caused by issuer/configuration diversity; multiple issuers as observable metadata.
- IETF Privacy Pass ARC work (current Internet-Draft): anonymous credentials with a bounded number of presentations in a declared presentation context. Evidence of bounded private spend, not a proof of cross-issuer global conservation.
- IETF/CFRG Anonymous Credit Tokens work (2026 Internet-Draft): numerical anonymous credits, partial spending, change and nullifier-based double-spend prevention under an issuer. Evidence that private conserved credit can be represented inside a qualified issuer domain; not a multi-issuer global-budget solution.
- IRTF/CFRG BBS per-verifier linkability work: scoped pseudonyms can support verifier-local longitudinal policy without global presentation linkability. Evidence for scoped correlation, not cross-issuer uniqueness.
- Walfish et al., NSDI 2006 distributed quota enforcement: quota enforcement across distributed nodes is itself a coordination/allocation problem; useful as operational evidence that quota locality and global bound enforcement trade off.
- Existing G4 reservation/escrow, hierarchical rights, privacy federation, collusion/metadata and abuse-governance findings.

## 1. The central impossibility boundary

Consider two mutually disconnected issuers `I1` and `I2`, each authorized to issue unlinkable rights against one hard global budget `B=100`.

If neither issuer can determine how much the other has issued, and both may independently issue up to 100, the global bound is not preserved:

```text
I1 issues 100
I2 issues 100
=> outstanding rights = 200 > B
```

Cryptographic unlinkability does not change the accounting fact.

Candidate boundary:

```text
Strong unlinkability
+ independent offline multi-issuer minting
+ one hard shared global budget
+ no preallocation/shared conservation evidence
=> global conservation NOT proven
```

This is not a claim that anonymous multi-issuer systems are impossible. It means a hard shared bound requires some conservation mechanism outside the act of anonymous presentation: preallocated issuer rights, disjoint scopes, shared admission state, transferable escrow, threshold/co-signed issuance, or explicitly bounded oversubscription.

```text
Privacy mechanism != conservation mechanism
```

## 2. Separate issuance conservation from redemption privacy

A system may preserve privacy at redemption while using stronger coordination at issuance/allocation.

Candidate decomposition:

```text
Root invariant / budget
  -> issuer allocation or issuance authority
      -> privacy-preserving grants
          -> unlinkable/pairwise redemption
```

The verifier does not necessarily need the subject's global identity. But each issuer must be able to prove that the value it grants came from an admitted issuance remainder.

Candidate invariant:

```text
sum(issuer spendable allocations)
+ root spendable remainder
+ UNKNOWN transfers/recoveries
<= admitted global budget
```

Within an issuer allocation, anonymous credits/tokens may hide which qualified subject spends them while preserving the issuer-local amount, if the chosen mechanism actually proves that property.

Thus:

```text
Anonymous redemption != anonymous minting authority
```

## 3. Multi-issuer autonomy requires allocation topology

Implementation-independent strategies fall into distinct semantic classes.

### 3.1 Disjoint budget scopes

Each issuer governs a different invariant scope:

```text
I1 -> region A budget
I2 -> region B budget
```

No shared global quota exists unless a higher-level rule relates the scopes. This maximizes autonomy but changes the invariant.

### 3.2 Preallocated/escrowed issuer rights

A root or parent allocates conserved issuance rights:

```text
B=100
I1 allocation=40
I2 allocation=35
root reserve=25
```

Issuers may operate offline within their allocations. Capacity can become stranded during partitions, but the hard bound survives if transfers/recovery obey the existing G4 hierarchical-rights proof obligations.

### 3.3 Online/shared admission

Issuers consult a shared current allocation state before granting. This can preserve a hard bound but reduces disconnected autonomy and can introduce a central availability/trust dependency. The shared service is an allocation mechanism, not business semantic owner.

### 3.4 Threshold/co-authorized issuance

A grant may require a quorum/threshold of independent authorities. This can reduce unilateral issuer compromise but does not itself solve privacy, liveness, or double issuance unless the threshold protocol also conserves the relevant budget and has explicit failure/currentness semantics.

### 3.5 Bounded oversubscription

The business invariant may tolerate a declared excess envelope:

```text
nominal B=100
partition oversubscription bound <= 5
```

This is not hard conservation. It is a different contract requiring explicit risk ownership and settlement semantics.

## 4. Sybil resistance is scoped to the admission proposition

A verifier wanting to prevent one subject from obtaining N independent grants needs a proposition stronger than redemption anti-replay.

```text
One credential not double-spent
!= one real-world subject received one credential
```

But `one human`, `one device`, `one account`, `one organization`, `one paid subscription`, `one hardware root`, and `one business authority principal` are different propositions. No generic Exchange Plane primitive should collapse them into `uniqueSubject`.

Candidate vocabulary:

```text
AdmissionUniquenessProfile
  uniquenessProposition
  issuerScope
  federationScope
  proofBasis
  reissuance/recovery rules
  rotation semantics
  revocation horizon
  correlation leakage
```

The semantic owner of the budget decides which uniqueness proposition is relevant. An adapter/issuer may prove only the proposition it actually supports.

## 5. Cross-issuer Sybil resistance needs either shared evidence or independent allocations

If `I1` and `I2` independently attest `one grant per subject` but cannot detect that the same subject visits both, the federation does not obtain `one grant per subject globally`.

Candidate rule:

```text
Per-issuer uniqueness
!= federation-wide uniqueness
```

Ways to qualify federation-wide uniqueness include, in principle:

- a shared admission authority or privacy-preserving uniqueness service;
- a federation-scoped nullifier/pseudonym that is stable only for the declared admission scope;
- issuer allocations that make duplicate subjects irrelevant to the global conservation invariant;
- threshold admission using common evidence;
- explicit acceptance of multi-issuer multiplicity.

Each widens correlation, coordination, trust or operational cost differently. G4 should not hide this trade-off behind the word `Sybil-resistant`.

## 6. Federation-scoped nullifiers are privacy budgets, not free primitives

A stable nullifier can let multiple issuers detect repeat admission without learning a global business identity, but it creates a federation-wide correlation surface.

```text
Federation nullifier
!= global business identity
```

but also:

```text
Federation nullifier
!= unlinkable across that federation
```

The scope, retention horizon, rotation/recovery behavior and collusion assumptions therefore belong in the correlation budget. A nullifier stable across unrelated budget domains is overbroad even if it contains no human-readable PII.

## 7. Issuer diversity can itself fingerprint the client

RFC 9576 explicitly warns that issuer identities/configurations partition anonymity sets and that holding tokens from many issuers can leak a vector of client characteristics.

For G4:

```text
More issuers != monotonically more privacy
```

A federation that exposes which issuer granted each right may turn issuer choice into a quasi-identifier. Conversely, hiding issuer provenance completely can prevent the verifier from determining whether the issuer was authorized for the budget scope.

Candidate requirement: prove issuer authorization while revealing no more issuer/grant metadata than the contract requires. This may be direct issuer disclosure, group membership, mediation or another mechanism; no realization is selected.

## 8. Transfer/rebalancing must conserve issuer issuance authority

Moving unused budget from `I1` to `I2` is a rights transfer, not a configuration edit.

```text
I1 allocation 40 -> 20
I2 allocation 35 -> 55
```

Before `I2` may issue the additional 20, the system must prove that those rights are no longer spendable/issuable by `I1`, or conservatively quarantine ambiguous capacity.

Existing G4 rule applies recursively:

```text
Transfer ACK != old holder fenced
```

For anonymous grants already emitted by `I1`, reclaim may be impossible until expiry/redemption/currentness enforcement. Therefore:

```text
Issuer allocation reduced
!= previously issued anonymous rights revoked
```

Rebalancing must account for both unissued allocation and outstanding anonymous grants.

## 9. Ambiguous issuance is a first-class UNKNOWN state

Hard case:

```text
allocator -> I1 allocation/grant request
network timeout
```

If the allocator cannot prove whether I1 obtained authority to issue 10 units, those 10 cannot immediately be reissued elsewhere under a hard invariant.

Likewise:

```text
I1 creates anonymous grant
local crash before durable issuance evidence
```

The client may possess a valid grant while the issuer ledger does not prove it. Recovery that simply restores the apparent balance can double issuance.

Candidate rule:

```text
UNKNOWN issuance != free budget
```

Issuance protocols therefore need a declared linearization/evidence point or a conservative ambiguity disposition. Redemption unlinkability must not erase the minimum conservation witness required at issuance.

## 10. Issuer compromise has two different blast radii

Compromise can affect:

1. **privacy** — link or tag clients, choose identifying metadata/configurations;
2. **conservation** — mint grants beyond admitted issuer allocation.

These are independent failure domains.

A verifier accepting any cryptographically valid token from a compromised issuer may still violate the global budget even if token unlinkability remains excellent.

Candidate boundary:

```text
Token cryptographically valid
!= issuer remained within issuance authority
```

Possible future qualifications include short issuance horizons, allocation certificates, threshold issuance, externally auditable aggregate issuance commitments, revocation/security floors or bounded issuer liability. None is selected here.

## 11. Privacy-preserving aggregate evidence is useful but not magic

A federation may benefit from proving aggregate statements such as:

```text
issuer I consumed <= allocation A during epoch E
```

without publishing every subject or redemption. Zero-knowledge/range-proof/commitment techniques may eventually be candidates, but an aggregate proof is only as meaningful as:

- the completeness of inputs committed by the issuer;
- the authority that allocated A;
- anti-equivocation/currentness guarantees;
- treatment of outstanding/UNKNOWN grants;
- proof that multiple issuer views cannot omit the same hidden liability.

```text
Aggregate proof valid
!= hidden ledger complete by default
```

This remains a research direction, not a cryptographic design decision.

## 12. Offline federation has a three-way trade-off

For one hard global budget, the following combination is not available for free:

```text
A. strong cross-issuer unlinkability
B. independent offline issuer autonomy with dynamic minting
C. exact hard global conservation under arbitrary partitions
```

A and C can coexist if issuance authority is preallocated or otherwise conserved before partition. B and C can coexist with stronger shared identity/coordination assumptions. A and B can coexist if the invariant tolerates bounded oversubscription or scopes are disjoint.

Candidate rule:

```text
Offline issuer autonomy consumes predelegated issuance authority;
it does not create future global budget.
```

This mirrors the existing runtime-rights rule and keeps the Exchange Plane from becoming a central online dependency.

## 13. Candidate `FederatedBudgetProfile`

Research vocabulary only:

```text
FederatedBudgetProfile
  semanticBudgetOwnerRef
  invariantScope
  budgetRevision
  hardLimit / oversubscriptionEnvelope
  issuerAuthorityScope
  issuerAllocationModel
  admissionUniquenessProfileRef
  grant/redemption privacy profile
  correlation/dedup/nullifier scopes
  offlineIssuanceAllowance
  outstandingGrantAccounting
  transfer/rebalancing semantics
  issuance UNKNOWN disposition
  issuer compromise disposition
  revocation/currentness horizon
  aggregate evidence profile
  settlement/reconciliation predicate
```

This is not a schema proposal.

## 14. Proof obligations

Before implementation planning, prove or explicitly bound:

1. every issuer grant is backed by admitted issuance authority for the same invariant/budget revision;
2. independent issuers cannot each spend the same unallocated global remainder;
3. offline issuance is bounded by predelegated rights or by an explicit oversubscription envelope;
4. per-issuer anti-replay/double-spend does not masquerade as federation-wide Sybil resistance;
5. the exact admission uniqueness proposition is declared rather than inferred from `identity`;
6. federation-wide uniqueness, when required, has a proof mechanism whose correlation scope is explicit;
7. nullifier/pseudonym scope is no wider or longer-lived than the admission proposition requires;
8. issuer identity/configuration metadata does not silently collapse the claimed anonymity set;
9. issuer authorization can be verified without fabricating global subject identity;
10. rebalancing removes/quarantines old issuer authority before successor capacity becomes spendable;
11. outstanding anonymous grants remain accounted for when issuer allocation is reduced or retired;
12. ambiguous issuance consumes/quarantines capacity until settlement rather than becoming free budget;
13. issuer crash/recovery cannot recreate grants already delivered to clients but absent from a restored local ledger;
14. issuer compromise cannot silently turn cryptographic validity into unlimited minting authority;
15. aggregate proofs, if used, prove the declared completeness/conservation property rather than merely arithmetic over issuer-selected inputs;
16. provider/issuer replacement can declare `INCOMPATIBLE` if it cannot preserve conservation plus privacy guarantees;
17. revocation/security-floor changes distinguish unissued authority from already-issued offline rights;
18. settlement after partition preserves both effect/grant history and the effective/observed times of revocation or budget revision;
19. FinOps/abuse analytics do not reconstruct a universal subject graph merely to reconcile issuer totals;
20. client runtimes remain autonomous from Builder availability; any shared allocator/issuer service is required only when the declared runtime topology/contract says so.

## 15. Adversarial cases

1. I1 and I2 each issue the full global budget while partitioned.
2. The same subject obtains one valid grant from each issuer; every issuer-local uniqueness check passes.
3. A federation-wide nullifier solves duplicate admission but becomes a permanent cross-capability tracking key.
4. Issuer choice fingerprints a rare client population despite unlinkable redemption tokens.
5. A malicious issuer encodes identifying metadata in configuration/key choice.
6. I1 transfers 20 units to I2 but continues issuing from a stale pre-transfer state.
7. Allocation transfer is UNKNOWN; root gives the same 20 units to I2 anyway.
8. I1 emitted grants before crash, restored an older ledger and emits replacements for the same capacity.
9. I1's key is valid but compromised; it mints beyond its allocation and verifiers equate signature validity with budget validity.
10. Revocation stops new issuance but already-issued anonymous rights remain spendable longer than policy claims.
11. An aggregate proof covers only the issuer's chosen ledger and omits an outstanding offline grant set.
12. Two issuers use different budget revisions and both believe their grants are current.
13. Issuer retirement deletes allocation evidence while long-lived anonymous grants remain outstanding.
14. A client splits one intended budget across many issuers because federation admission has no shared uniqueness proposition.
15. Cross-origin tokens are redeemable at multiple origins but double-spend state is local to each origin.
16. Dedup/nullifier state is shared globally for convenience, defeating the declared privacy scope.
17. Short issuer epochs protect compromise but make issuer/key configuration itself a high-entropy fingerprint.
18. A successor issuer treats predecessor UNKNOWN grants as absent and remints capacity.
19. A broker/gateway routes by issuer ID and leaks issuer choice even though the application payload hides it.
20. Builder outage is incorrectly treated as reason to invalidate already-delegated runtime/issuer rights even though the published topology promised offline autonomy.

## 16. Portability / exit path

Portable semantics are the invariant/budget revision, issuer authority and allocation scope, hard-versus-oversubscribed guarantee, admission uniqueness proposition, grant/redemption privacy profile, nullifier/correlation scope, offline issuance allowance, outstanding-grant accounting, transfer/rebalancing rules, UNKNOWN issuance treatment, compromise/revocation horizon and settlement predicate.

Privacy Pass, ARC, ACT, BBS pseudonyms, blind signatures, zero-knowledge proofs, consensus systems, escrow counters, identity providers and cloud rate-limit services remain realization details. A replacement must be allowed to declare `INCOMPATIBLE` rather than silently widening correlation or weakening conservation.

## 17. Deduplication against existing G4 research

This round does not reopen generic identity architecture, reservation/escrow, hierarchical rights, privacy federation, commercial metering or abuse governance. It composes those findings around one previously under-specified boundary: **who may mint privacy-preserving spend capacity when several autonomous issuers overlap one invariant**.

Material additions are:

- `Privacy mechanism != conservation mechanism`;
- `Anonymous redemption != anonymous minting authority`;
- `Per-issuer uniqueness != federation-wide uniqueness`;
- `Token cryptographically valid != issuer remained within issuance authority`;
- `UNKNOWN issuance != free budget`;
- a hard shared budget under partitions requires preallocated/conserved issuance authority, shared admission coordination, disjoint scopes or an explicitly weaker oversubscription contract.

## 18. Maturity and next gap

This subfront is materially advanced but not saturated. The next highest-value gap is **privacy-preserving issuer accountability and compromise containment without subject-level disclosure**: determine what aggregate/commitment/transparency evidence can prove that an issuer stayed within delegated minting authority, how to prevent issuer equivocation across disconnected verifiers, how to rotate/revoke a compromised issuer without deanonymizing historical holders, and which guarantees fundamentally require online/shared state versus can be checked after the fact.
