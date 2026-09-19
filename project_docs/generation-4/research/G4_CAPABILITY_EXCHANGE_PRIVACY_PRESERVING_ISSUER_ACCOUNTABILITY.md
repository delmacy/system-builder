# G4 — Privacy-Preserving Issuer Accountability & Compromise Containment

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the existing federated anonymous-budget research at its highest-value gap: how an issuer can be held accountable for delegated minting authority, how equivocation can be detected across disconnected verifiers, and how a compromised issuer can be rotated/revoked without turning privacy-preserving grants into a subject-level public ledger.

This is not a new macro-family. It selects no credential scheme, zero-knowledge system, commitment construction, transparency log, consensus protocol, witness topology, issuer implementation, broker or provider and grants no implementation authority.

## Evidence classes reviewed

- IETF RFC 9576 / RFC 9578 Privacy Pass: issuer trust boundaries, configuration/key consistency, key rotation, anonymity-set partitioning and multi-party unlinkability.
- RFC 9162 Certificate Transparency v2: append-only Merkle logs, inclusion/consistency evidence, monitoring, and the explicit split-view limitation requiring cross-observer comparison/gossip-like mechanisms.
- C2SP transparency-log witness/cosignature work: independent witnesses can cosign consistent checkpoints before clients rely on them; benchmark for anti-equivocation, not an adoption decision.
- Camenisch/Hohenberger/Lysyanskaya compact e-cash: offline unlinkable spending and double-spend accountability/exculpability as evidence that privacy and bounded accountability can coexist under explicit cryptographic assumptions.
- Existing G4 hierarchical rights, evidence-minimal reconciliation, privacy federation/collusion, privacy-abuse governance and federated anonymous-budget conservation findings.

Primary references:
- https://www.rfc-editor.org/rfc/rfc9576
- https://www.rfc-editor.org/rfc/rfc9578
- https://www.rfc-editor.org/rfc/rfc9162
- https://c2sp.org/tlog-cosignature
- https://research.ibm.com/publications/compact-e-cash

## 1. Central boundary: accountability has prevention and detection halves

The previous round established that a token can be cryptographically valid even when its issuer exceeded delegated minting authority. This round sharpens the consequence:

```text
After-the-fact auditability
!= pre-issuance conservation
```

Suppose issuer `I` has allocation `A=100`. If `I` is malicious and can independently sign 150 otherwise valid anonymous grants, a later commitment proving that it issued 150 can expose the violation but cannot retroactively preserve the hard budget.

For a hard invariant, one of the following must constrain issuance before or at the issuance linearization point:

- the issuer possesses only conserved/predelegated minting rights;
- issuance consumes externally enforced scarce authority;
- a threshold/co-authorizer participates in issuance;
- an online/shared admission boundary enforces the budget;
- or the contract explicitly accepts bounded oversubscription.

Transparency, commitments and aggregate proofs can improve detection, evidence and settlement. They do not manufacture prevention.

Candidate invariant:

```text
Audit proof of over-minting
!= proof that over-minting was impossible
```

## 2. Separate four accountability propositions

`Issuer accountability` is too broad. G4 should distinguish at least:

1. **Authorization** — was this issuer entitled to mint for budget/revision/scope `B`?
2. **Conservation** — did admitted issuance stay within delegated capacity?
3. **Completeness** — does the issuer's evidence cover every liability/grant that can still be redeemed?
4. **Non-equivocation** — did all relevant observers receive one compatible history/configuration view?

A signature usually proves only issuer control of a key over a statement. It does not by itself prove any of the four propositions above.

```text
Signed grant
!= authorized minting
!= conserved minting
!= complete liability view
!= non-equivocating issuer
```

## 3. Commitments can hide subjects but completeness is the hard part

An issuer may commit to aggregate issuance state without publishing subject identities or individual redemption histories. Conceptually:

```text
IssuerEpochCommitment
  issuerAuthorityRef
  budgetRevision
  epoch/scope
  openingAllocation
  issuedLiabilityCommitment
  UNKNOWN/quarantined liability commitment
  closingRemainderCommitment
  previousCheckpointRef
  proof/evidence refs
```

A range/zero-knowledge proof might establish arithmetic such as `issued <= allocation` while hiding grant details. But the proof is meaningful only if the committed input set is complete.

A malicious issuer can otherwise prove perfect arithmetic over a ledger from which it simply omitted privately issued grants.

Candidate boundary:

```text
Aggregate arithmetic proof valid
!= issuance ledger complete
```

Completeness therefore needs an issuance-path property: every redeemable grant must leave some conservation witness that cannot be omitted from the issuer's accountable state, or issuance remains merely retrospectively auditable under issuer honesty assumptions.

No commitment/ZK construction is selected.

## 4. Transparency gives visibility, not automatic conservation

RFC 9162 is useful as a mature benchmark: append-only Merkle history supports compact inclusion and consistency evidence, and monitors can detect suspect issuance. It explicitly does not make the log operator incapable of showing inconsistent views to isolated clients; cross-observer comparison is needed to expose split views.

For G4:

```text
Append-only log
!= complete issuance log by itself
Append-only log
!= non-equivocation by itself
Transparency
!= conservation
```

A transparency mechanism can answer narrower questions such as:

- was checkpoint/grant-class evidence committed by a declared time?
- does checkpoint N extend checkpoint N-1?
- did the issuer publish mutually inconsistent signed heads?
- was an issuer configuration/key authorized for an epoch?

It cannot prove that an unlogged private issuance never occurred unless redemption/admission rules make unlogged issuance unusable or another independent witness constrains issuance.

## 5. Split-view resistance needs an observer assumption

Disconnected verifier `V1` may see issuer history `H1`; verifier `V2` may see internally consistent history `H2`. If they never compare checkpoints, each can accept its own valid chain.

```text
Locally consistent history
!= globally non-equivocating history
```

Candidate anti-equivocation classes:

- verifier gossip / later checkpoint comparison;
- independent monitors/witnesses;
- quorum/cosigned checkpoints;
- anchoring into another independently governed append-only history;
- synchronous shared admission/consensus where the contract truly requires prevention rather than later detection.

Each changes trust, liveness, privacy and offline autonomy. Witnessing does not need subject-level records: coarse issuer/budget/epoch commitments may suffice if the proof obligation is conservation/non-equivocation rather than individual attribution.

## 6. Privacy-preserving accountability should prefer liability commitments over subject logs

The previous evidence-minimization rule still applies. An accountability system should not retain identities merely because a budget must be audited.

Candidate decomposition:

```text
subject/admission evidence (capability-owned, scoped)
        |
        v
privacy-preserving grant
        |
        v
issuer liability/conservation witness
        |
        v
aggregate/federated checkpoint
```

The federation may need to know that issuer `I` carries 37 units of outstanding liability under revision `R`; it does not automatically need to know which 37 subjects hold them.

```text
Liability accountability
!= holder identity disclosure
```

If double-spend attribution or legal settlement genuinely requires holder disclosure, that is a separate declared proof purpose and privacy contract, not a hidden property of the Exchange Plane.

## 7. Exculpability matters as much as blame

Compact e-cash research is useful because it distinguishes detecting double spending from falsely accusing an honest user. G4 should generalize the principle:

```text
Accountability mechanism
must support evidence of violation
without making accusation-by-correlation sufficient
```

Issuer compromise, replay, verifier duplication, transport retry and holder double spend are distinct causes. A duplicate redemption observed by two providers must not automatically prove malicious holder behavior unless the credential contract provides that attribution guarantee.

Candidate rule:

```text
Duplicate effect/grant observation
!= proven holder abuse
```

## 8. Compromise containment has two clocks

Issuer compromise introduces at least:

```text
compromiseEffective/estimatedTime
revocationEffectiveTime
observerKnowledgeTime
```

Historical grants may have been legitimately issued before compromise, maliciously over-minted after compromise, or remain impossible to classify individually without breaking unlinkability.

Therefore revocation dispositions need explicit classes, for example:

- stop new issuance immediately;
- reject all grants from compromised generation after a declared security floor;
- honor already-issued grants until a bounded horizon;
- require additional currentness/evidence for redemption;
- quarantine high-risk/UNKNOWN grants;
- forward-recover/manual-settle where hard invariants cannot otherwise be preserved.

```text
Issuer key revoked
!= every historical anonymous grant fraudulent
Issuer key revoked
!= outstanding liability erased
```

## 9. Rotation must not silently deanonymize historical holders

RFC 9576 treats issuer configuration/key diversity as an anonymity-set partitioning surface. Rotation is necessary for compromise containment but can itself fingerprint clients if epochs/configurations become too fine-grained.

For G4:

```text
Security rotation
!= permission to widen holder correlation
```

A successor issuer/key needs enough lineage to verify budget authority and outstanding liability, but not a reverse map from old grants to subjects by default.

Candidate portable state across rotation:

- issuer authority lineage;
- allocation/budget revision;
- aggregate outstanding liability;
- checkpoint/non-equivocation evidence;
- accepted old-generation horizon/currentness policy;
- UNKNOWN/quarantine amount;
- settlement rules.

Subject-level issuance history is not automatically part of this transfer.

## 10. Prevention versus retrospective verification matrix

| Property | Can be retrospective only? | Hard-invariant implication |
|---|---|---|
| Detect signed split views | Yes, if conflicting checkpoints later meet | Detects equivocation; does not prevent effects already admitted |
| Prove append-only extension | Yes | Proves history relation, not completeness of hidden issuance |
| Prove arithmetic over committed totals | Yes | Useful only if commitment completeness is separately qualified |
| Prevent issuer spending same delegated capacity twice | Not safely for a hard bound if issuer can mint unilaterally | Requires conserved authority/enforcement at issuance |
| Stop compromised issuer immediately while all verifiers are offline | No | Requires bounded stale-security window/prequalified offline policy |
| Preserve holder unlinkability across rotation | Potentially | Depends on metadata/configuration and migration design |
| Attribute holder double spend | Potentially, scheme-specific | Must be explicit; duplicate observation alone is insufficient |

This matrix is the main material delta: G4 should not label a mechanism `accountable` without declaring whether the property is preventive, detect-after-fact, or both.

## 11. Candidate `IssuerAccountabilityProfile`

Research vocabulary only:

```text
IssuerAccountabilityProfile
  issuerAuthorityRef
  budget/invariant revision
  issuance linearization/evidence point
  conservation enforcement class
  liability commitment scope
  completeness assumption/proof
  checkpoint chain
  anti-equivocation observer model
  witness/quorum assumptions
  privacy/correlation budget
  outstanding/UNKNOWN liability treatment
  compromise/revocation disposition
  key/configuration rotation semantics
  historical-grant acceptance horizon
  accusation/exculpability semantics
  retention/erasure policy
  settlement/reconciliation predicate
```

This is not a schema proposal.

## 12. Proof obligations

Before implementation planning, prove or explicitly bound:

1. issuer cryptographic validity is not treated as proof of minting authority;
2. every redeemable grant is backed by conserved authority or the contract declares bounded oversubscription;
3. the issuance linearization/evidence point is explicit;
4. aggregate arithmetic proofs cannot omit liabilities without violating a separately qualified completeness mechanism;
5. `UNKNOWN` issuance remains consumed/quarantined;
6. transparency/checkpoint evidence is not presented as prevention when it only detects later;
7. split-view resistance names the required observer/gossip/witness assumption;
8. disconnected verifiers do not infer global non-equivocation from local consistency alone;
9. checkpoint/witness metadata does not expose subject-level issuance by default;
10. issuer/key/configuration rotation does not silently partition anonymity beyond the declared correlation budget;
11. successor issuers inherit conserved outstanding liability without receiving a universal holder identity graph;
12. revocation distinguishes unissued authority, outstanding legitimate grants and suspected over-minted liability;
13. compromise time, revocation effective time and observer knowledge time remain distinguishable;
14. offline verifiers have a bounded stale-security policy for issuer revocation;
15. duplicate redemption/effect evidence is not automatically elevated to holder culpability;
16. any double-spend attribution mechanism includes an exculpability/false-accusation model;
17. evidence retention is purpose-bounded and does not turn accountability into indefinite subject logging;
18. witness/log/provider replacement can declare `INCOMPATIBLE` when non-equivocation/completeness guarantees weaken;
19. a malicious issuer plus malicious log/witness coalition is included in the stated threat model rather than assumed away silently;
20. client runtime autonomy remains compatible with the declared checkpoint/currentness horizon and does not require live Builder reachability for every redemption.

## 13. Adversarial cases

1. Issuer allocation is 100; malicious issuer signs 150 valid anonymous grants and publishes a commitment covering only 100.
2. Aggregate proof verifies `issued <= allocation` over an issuer-selected incomplete ledger.
3. Issuer shows checkpoint H1 to V1 and H2 to V2; both chains are locally valid during a long partition.
4. Transparency log is append-only in each fork but equivocates between verifier populations.
5. Issuer and its only witness collude, making witness signatures cosmetically independent.
6. Revocation stops new key publication but stale offline verifiers continue accepting old-generation grants indefinitely.
7. Successor issuer receives old holder identities to reconcile liability, defeating unlinkability unnecessarily.
8. Rotation creates tiny key epochs that fingerprint rare clients.
9. Compromised issuer over-mints after compromise but before revocation observation; reconciliation rewrites all old grants as fraudulent.
10. Legitimate pre-compromise holders are rejected without a declared compensation/settlement policy.
11. Outstanding grants disappear from issuer allocation accounting when the issuer is retired.
12. Two monitors retain different checkpoints but never exchange them, so equivocation remains undetected.
13. A checkpoint proves inclusion but verifier treats it as proof that no hidden issuance exists.
14. Broker retry causes duplicate redemption evidence and holder is falsely classified as a double spender.
15. Two providers redeem the same replay because nullifier/dedup scope is inconsistent; holder is blamed for provider state fragmentation.
16. Log/witness retention includes subject identifiers even though only aggregate liability was required.
17. Witness quorum changes during compromise and old/new quorums each authorize incompatible histories.
18. A compromised issuer key remains cryptographically valid and verifiers equate key validity with current security admissibility.
19. Builder outage is treated as reason to reject previously qualified offline grants despite declared runtime autonomy.
20. Audit later proves over-minting, but documentation incorrectly claims the hard budget was preserved during the interval.

## 14. Portability / exit path

Portable semantics are issuer authority lineage, budget/invariant revision, issuance evidence point, conservation class, liability/completeness proposition, checkpoint history, anti-equivocation observer assumptions, outstanding/UNKNOWN liability, compromise/revocation horizon, privacy/correlation budget, exculpability semantics and settlement predicate.

Merkle transparency logs, witness cosignatures, Privacy Pass, e-cash, blind signatures, zero-knowledge/range proofs, threshold signatures, consensus systems and cloud key services remain realization details. Replacement may declare `INCOMPATIBLE` rather than silently weakening conservation, completeness, non-equivocation or privacy.

## 15. Deduplication against existing G4 research

This round does not reopen:

- the Shared Semantic Kernel/Exchange Plane foundational vocabulary;
- hierarchical rights/escrow/fencing;
- evidence-minimal retention/erasure;
- privacy-preserving federation and metadata/collusion budgets;
- abuse/rate/cost governance;
- the hard boundary for federated anonymous budget conservation.

It adds the missing accountability layer: **which issuer claims can be prevented at issuance, which can only be detected later, what completeness/non-equivocation assumptions make aggregate evidence meaningful, and how compromise containment preserves liability without forcing subject disclosure**.

## 16. Maturity and next gap

Material boundaries changed, so this round is not `NO_MATERIAL_DELTA`.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value remaining gap: **witness/log governance and correlated compromise under autonomous federation** — determine quorum/witness independence assumptions, witness rotation and split-brain behavior, privacy leakage from checkpoint topology, how offline runtimes decide which checkpoint/witness set is sufficiently current, and which anti-equivocation guarantees survive correlated compromise or long partitions without making one global transparency service a runtime dependency.
