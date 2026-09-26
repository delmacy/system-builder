# G4 — Witness / Log Governance & Correlated Compromise

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the issuer-accountability research at its highest-value remaining gap: what a witness quorum actually proves, what independence assumptions it needs, how witness/log generations rotate without split-brain, how checkpoint currentness behaves during partitions, and which non-equivocation claims survive correlated compromise without making one global transparency service a runtime dependency.

This is not a new macro-family. It selects no transparency log, witness network, quorum algorithm, consensus protocol, key-management system, hardware root, cloud, broker or provider and grants no implementation authority.

## Evidence classes reviewed

- C2SP `tlog-witness`, `tlog-cosignature`, `tlog-policy`, and `tlog-proof`: witnesses verify consistency from their previously persisted checkpoint, cosign accepted checkpoints, and verifier policy determines which witness subset/quorum is sufficient.
- RFC 9162 / Certificate Transparency: append-only proofs and the split-view problem remain distinct; isolated locally consistent views do not imply global non-equivocation.
- Transparency.dev witness implementation and production experience: witness state can be compact, but witness key misuse/operation is itself a trust concern; public/staging witness operation demonstrates lifecycle and service-level distinctions.
- CoSi research: decentralized witness cosigning makes acceptance depend on a declared witness set and can tolerate some compromised witnesses only under an explicit threshold/diversity assumption.
- Mog / gossip research: client/auditor comparison can reduce dependence on blindly trusted global auditors; observer connectivity remains part of the anti-equivocation proposition.
- Existing G4 issuer-accountability, privacy/collusion, offline-security, evidence-minimal and federated-budget findings.

Primary references:
- https://c2sp.org/tlog-witness
- https://c2sp.org/tlog-cosignature
- https://c2sp.org/tlog-policy
- https://c2sp.org/tlog-proof
- https://www.rfc-editor.org/rfc/rfc9162
- https://transparency.dev/witnesses/
- https://arxiv.org/abs/1503.08768
- https://arxiv.org/abs/2011.04551

## 1. Central boundary: quorum size is not independence

A `k-of-n` rule is arithmetic over signatures. Its security meaning depends on who controls the signers and which failures can affect them together.

```text
k-of-n signatures
!= k independent trust failures
```

Three witnesses operated by one organization, one cloud account, one HSM policy, one CI/CD chain or one administrative root may constitute one correlated failure domain for the relevant threat.

Therefore G4 should describe witness diversity as a **failure-domain proposition**, not merely a count. Candidate dimensions include operator, administrative authority, credential/key custody, deployment substrate, network path, software lineage, update authority, jurisdiction/organization where relevant, and monitoring channel.

No universal independence metric is claimed. The required diversity is contract/threat-model relative.

## 2. A witness proves consistency with its own remembered frontier

C2SP `tlog-witness` requires a witness to compare a proposed checkpoint with the latest checkpoint it previously accepted, verify the consistency proof, persist the new checkpoint before acknowledging, and avoid state rollback races.

That yields an important narrow statement:

```text
Witness cosigned checkpoint C
=> C was consistent with that witness's qualified prior frontier
```

It does **not** automatically mean:

```text
C is globally latest
C is complete
C is semantically correct
C was observed by every verifier
issuer stayed within minting authority
```

Witnessing therefore belongs to the anti-equivocation/evolution proof domain, not business ownership or conservation by itself.

## 3. Quorum semantics need a failure-domain policy

C2SP `tlog-policy` supports nested groups and threshold/all/any rules. This is useful evidence that quorum policy can express structure richer than a flat count.

Candidate implementation-independent profile:

```text
WitnessPolicy
  logAuthorityRef
  policyRevision
  witnessGeneration
  witnessRefs
  failureDomainClaims
  quorumExpression
  checkpointFreshnessBound
  overlap/rotationRule
  offlineAcceptanceRule
  monitor/gossipAssumption
  compromiseDisposition
  privacy/correlationBudget
```

This is research vocabulary, not a schema.

Candidate invariant:

```text
Quorum satisfied
!= independence assumption satisfied
```

A verifier must qualify both the signatures and the policy revision/failure-domain assumptions under which those signatures are meaningful.

## 4. Correlated compromise has a threshold boundary

If a log and enough witnesses to satisfy the verifier's quorum collude, they can potentially present a mutually cosigned fork to a victim population. Witness cosigning protects only while the adversary does not control a quorum capable of authorizing the conflicting view under that policy.

```text
Non-equivocation guarantee
is conditional on quorum-compromise assumptions
```

This must not be documented as absolute `GLOBAL_NON_EQUIVOCATION`.

A useful distinction is:

- **fork prevention for a verifier policy**: a conflicting checkpoint cannot obtain an acceptable quorum unless the declared compromise threshold is exceeded;
- **fork detection later**: incompatible signed/cosigned checkpoints eventually cross an independent observer/monitor/gossip boundary;
- **global latest knowledge**: a stronger currentness proposition not supplied merely by a valid quorum.

These are separate guarantees.

## 5. Witness rotation is a semantic transition, not key replacement

Suppose policy `W1` accepts witnesses `{A,B,C}` and successor `W2` accepts `{D,E,F}`. If both generations are independently acceptable during a transition with no overlap or bridging evidence, the log can potentially obtain:

```text
fork X -> quorum under W1
fork Y -> quorum under W2
```

Each population may see a valid policy-local history.

Therefore:

```text
New witness policy valid
!= old/new histories joined
```

Candidate safe-transition classes include:

1. overlapping witness generations with a declared intersection property;
2. a bridge checkpoint qualified by both old and new policies;
3. an independently governed anchor/monitor boundary that binds the transition;
4. explicit quarantine/manual reconciliation when continuity cannot be proved.

The exact mechanism is not selected. The proof obligation is continuity across the **policy transition**, not merely validity of the new keys.

## 6. Split-brain policy generations are first-class

Witness-policy distribution itself can equivocate. Two runtimes may receive different valid-looking successor policies.

```text
Checkpoint non-equivocation
!= witness-policy non-equivocation
```

Therefore policy lineage needs its own authority/currentness/evidence semantics. A transparency mechanism that protects log checkpoints but distributes witness-policy updates through an unaudited mutable channel leaves a higher-level split-view path.

This does not imply recursive infinite logging. It means the root/constitutional authority for policy revision must be explicit and its continuity proof must terminate at a declared trust anchor.

## 7. Currentness is not provided by cosignature validity

A self-contained checkpoint with a valid witness quorum can be verified offline. C2SP `tlog-proof` explicitly leaves timestamp constraints to application policy.

Therefore:

```text
Quorum-valid checkpoint
!= sufficiently current checkpoint
```

A runtime needs a declared currentness policy, for example a maximum checkpoint age, epoch horizon, monotonic revision floor, or prequalified offline grace. The choice belongs to the capability/security contract.

During a long partition, the runtime may know:

```text
checkpoint valid under W7
checkpoint age = 18h
latest global checkpoint = UNKNOWN
```

It must not rewrite `UNKNOWN latest` as either `CURRENT` or `REVOKED`.

## 8. Offline autonomy requires cached policy + bounded staleness

Runtime autonomy is compatible with witness-based evidence when the runtime carries enough locally durable state to verify a checkpoint and enforce a bounded stale policy without contacting Builder or a global witness service for every interaction.

Candidate local continuity material:

- trusted witness-policy revision / trust anchor;
- latest accepted checkpoint frontier;
- monotonic policy/security floors;
- checkpoint freshness rule;
- accepted transition/bridge evidence;
- quarantine/fail-closed disposition when freshness expires.

```text
Offline verification
!= indefinite offline currentness
```

This reuses the existing G4 offline-security boundary rather than creating a new runtime dependency.

## 9. Witness availability and witness authority are distinct

A witness may be unavailable, retired, reset, or rotated without being compromised. Production/staging witness documentation provides practical evidence that service-level expectations differ across witness deployments.

Therefore:

```text
Witness unavailable
!= witness malicious
Witness reachable
!= witness trustworthy
```

A quorum policy must declare whether temporary loss reduces liveness only, whether degraded quorums are allowed, and whether changing quorum to regain availability weakens the security proposition.

Emergency `2-of-3 -> 1-of-3` is not an operational tweak; it is a contract/security change.

## 10. Diversity can leak topology and partition anonymity sets

Publishing the exact witness combination used for each holder/tenant/request can become a correlation surface. Rare quorum combinations, region-specific witnesses, private witness URLs, key IDs or transition epochs may fingerprint populations.

```text
Witness diversity
!= privacy-neutral metadata
```

Privacy-preserving operation should prefer coarse ecosystem/policy-level checkpoint evidence where possible rather than per-holder witness selection. Correlation-budget analysis must include witness policy revision, cosignature set, checkpoint epoch and retrieval path.

This does not justify hiding the security policy from verifiers; it requires explicit trade-offs between auditability, routing diversity and metadata exposure.

## 11. Monitor and witness are not synonyms

A witness typically gates/cosigns consistency against a remembered frontier. A monitor can inspect broader log contents, policy behavior, omissions or application-specific invariants.

```text
Witness consistency approval
!= semantic/content monitoring
```

Combining both roles in one process may be operationally convenient, but the contracts remain distinct. A witness should not become business authority merely because it observed a checkpoint; a monitor finding is evidence requiring the declared escalation/reconciliation path.

## 12. A global witness service is not required by the logical plane

The Exchange Plane hypothesis requires portable anti-equivocation semantics, not one mandatory witness network.

Possible realizations include:

- ecosystem-local witness groups;
- federated witness groups with explicit trust domains;
- verifier gossip/client audits;
- independently anchored checkpoints;
- synchronous coordination for the narrow cases that truly require preventive global agreement;
- combinations of these.

```text
Logical anti-equivocation contract
!= one global transparency service
```

A generated client runtime must continue according to its declared local policy when Builder/central services are unavailable.

## 13. Candidate guarantee vocabulary

Avoid a boolean `nonEquivocating=true`. Candidate research vocabulary:

```text
AntiEquivocationGuarantee
  LOCAL_CHAIN_CONSISTENCY
  QUORUM_COSIGNED_UNDER_POLICY
  FORK_PREVENTION_UNDER_DECLARED_COMPROMISE_BOUND
  FORK_DETECTABLE_ON_OBSERVER_INTERSECTION
  CHECKPOINT_CURRENT_WITHIN_BOUND
  POLICY_TRANSITION_CONTINUITY_PROVEN
  GLOBAL_LATEST_UNKNOWN
```

These can coexist. None should silently imply the others.

## 14. Proof obligations

Before implementation planning, prove or explicitly bound:

1. quorum count is not treated as proof of independent failure domains;
2. the witness failure-domain assumptions relevant to the threat model are declared;
3. a witness cosignature proves only the consistency/currentness properties actually checked;
4. checkpoint completeness/business correctness is not inferred from append-only consistency;
5. the maximum tolerated correlated compromise is explicit for each quorum policy;
6. fork prevention and eventual fork detection are not conflated;
7. witness-policy revision itself has authority, lineage and anti-rollback/currentness semantics;
8. old/new witness generations cannot independently authorize incompatible histories without a declared disposition;
9. rotation has overlap, bridge, independent anchor, or explicit incompatibility/quarantine evidence;
10. quorum degradation for availability is treated as a security-contract change;
11. witness unavailability is not automatically classified as compromise;
12. offline runtimes preserve the latest qualified policy/checkpoint frontier across reboot, A/B rollback and recovery;
13. valid but stale checkpoints remain representable as stale/UNKNOWN rather than current;
14. checkpoint freshness policy is explicit and does not require live Builder reachability unless the contract declares it;
15. monitor findings do not become business authority by convenience;
16. witness/log/gateway metadata stays within the declared correlation budget;
17. a compromised log plus quorum-sized witness coalition is included in the threat model and not described as impossible;
18. verifier populations that never intersect observers are not promised eventual fork detection without another qualified mechanism;
19. replacement witness/log implementations may declare `INCOMPATIBLE` when quorum/currentness/rotation guarantees weaken;
20. the logical Exchange Plane remains realization-independent and does not require a single global witness service.

## 15. Adversarial cases

1. Three witness keys are `2-of-3`, but all are controlled by one cloud account compromised together.
2. Witnesses have different operators but share one deployment pipeline signing authority.
3. Log and two required witnesses collude and cosign a private fork for one tenant.
4. Old policy `W1` and new policy `W2` have disjoint witnesses and each cosigns a different successor checkpoint.
5. Policy distributor shows `W2a` to runtime A and `W2b` to runtime B while both appear locally authorized.
6. Runtime verifies a six-month-old quorum-signed checkpoint and labels it current.
7. Runtime is offline beyond the declared freshness horizon but continues privileged effects because signatures still verify.
8. Witness crashes and loses its latest frontier, then accepts a rollback/fork after restore.
9. Golden recovery restores old witness-policy state while business state remains newer.
10. Emergency operations weaken `3-of-5` to `1-of-5` without changing the advertised guarantee.
11. A rare tenant-specific witness combination fingerprints the tenant despite unlinkable grants.
12. Witness endpoint/key rotation creates tiny anonymity epochs.
13. Monitor detects conflicting checkpoints, but automated controller treats the finding as proof that every holder grant is fraudulent.
14. Witness cosigns an append-only history containing semantically invalid over-minting and verifier mistakes consistency for conservation.
15. Two verifier populations remain partitioned indefinitely; documentation promises eventual detection without any observer intersection.
16. One witness is counted twice through nested groups under aliases, inflating apparent quorum diversity.
17. New witness generation accepts a bridge signed only by the already-compromised old quorum.
18. Checkpoint is current, but witness policy itself has been revoked and runtime checks only checkpoint age.
19. Builder outage blocks runtime because verifier requires live central witness lookup despite a declared offline horizon.
20. Global witness service outage halts every client system even though their contracts allowed ecosystem-local cached verification.

## 16. Portability / exit path

Portable semantics are witness-policy identity/revision, failure-domain assumptions, quorum expression, checkpoint frontier, currentness horizon, transition/bridge evidence, compromise threshold, observer-intersection assumptions, privacy/correlation budget and offline disposition.

Merkle logs, C2SP formats, witness networks, CoSi, gossip protocols, hardware witnesses, confidential computing, cloud KMS/HSMs, consensus systems and external anchors remain realization details. Replacement may declare `INCOMPATIBLE` rather than silently weakening independence, non-equivocation, currentness or rotation continuity.

## 17. Deduplication against existing G4 research

This round does not reopen issuer conservation, anonymous credentials, evidence retention, privacy-preserving federation, offline security floors or the base Exchange Plane vocabulary. It adds the missing governance layer above issuer accountability: **what witness quorum means under correlated failure, how witness-policy generations preserve continuity, and how autonomous runtimes qualify checkpoint currentness without central online dependency**.

## 18. Maturity and next gap

Material boundaries changed, so this round is not `NO_MATERIAL_DELTA`.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value remaining gap: **anti-equivocation policy composition across multiple autonomous transparency domains** — determine how a runtime combines checkpoints/evidence from capability-local, issuer-local and security/update logs when their witness policies, currentness horizons and partitions differ; prevent `all green locally` from being mistaken for a globally compatible state; and define reconciliation when one domain forks or becomes stale while other domains continue safely.