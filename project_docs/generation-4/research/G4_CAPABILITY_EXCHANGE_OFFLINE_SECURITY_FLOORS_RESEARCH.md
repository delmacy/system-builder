# G4 — Offline Security Floors, Revocation and Federated Runtime Autonomy

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Research how an autonomous published runtime can enforce security floors, revocations and anti-rollback/freeze policy while Builder or central control services are unavailable, without converting Builder availability into a runtime dependency and without confusing security admissibility with business authority or semantic settlement.

This is a material subfront of family 8, not a new macro-family. It selects no update framework, PKI, transparency log, identity system, revocation protocol, broker or provider and grants no implementation authority.

Core rules:

```text
Builder unavailable != runtime security policy unavailable
Previously trusted != indefinitely security-admissible
Signature valid != security floor current
Metadata fresh != business authority current
Security floor current != business contract current
Revocation learned != historical effect invalidated
Revocation not yet learned != artifact proven safe now
Offline autonomy != unlimited stale-security operation
Fail-closed != universally correct availability policy
```

## Evidence classes reviewed

- The Update Framework (TUF) specification and security model: trusted root bootstrapping, threshold-signed root rotation, monotonically increasing metadata versions, expiration, rollback/freeze protection, persisted trusted metadata and consistent snapshots.
- Uptane deployment guidance: expiration bounds freeze attacks, metadata/key compromise recovery, rollback resistance and the security significance of a trustworthy time basis for disconnected/embedded clients.
- SPIFFE/SPIRE federation: bootstrap trust bundles, independently associated trust domains, bundle rotation, latest-known bundle use and distribution of trust material to workloads.
- Sigstore/Rekor bundle and security documentation: short-lived signing certificates, transparency evidence, signed timestamps, offline verification bundles and the distinction between historical signing evidence and current execution policy.
- Prior G4 findings on self-hosting secure update, security-forced contract retirement, autonomous runtimes, authority/currentness, finite evidence retention and Exchange Plane semantics.

## 1. Security currentness is its own proof domain

The runtime may simultaneously know that an artifact was validly signed at time T, that it was admitted under a historical contract, and that it has not refreshed security policy since T+N.

These are different facts:

```text
artifactProvenance
historicalAdmission
securityPolicyRevision
securityPolicyFreshness
businessAuthorityRevision
contractRevision
```

Therefore:

```text
Cryptographic authenticity != current execution admissibility
Security-policy freshness != business-authority freshness
```

A Shared Semantic Kernel may carry qualified refs/revisions/evidence for these facts, but it must not collapse them into one generic `version` or `currentness` field.

## 2. Candidate `SecurityAdmissibilityEnvelope`

Research vocabulary, not schema:

```text
securityDomainRef
policyRevision
minimumAdmissibleGeneration
revokedArtifact/provider/key refs or compact revocation evidence
issuedAt / effectiveAt / expiresAt
trustedTimeBasis
issuer/threshold/provenance evidence
previousRevisionRef
rollback/freeze continuity evidence
staleOperationPolicy
  FAIL_CLOSED | BOUNDED_GRACE | PREQUALIFIED_OFFLINE_ONLY | QUARANTINE
scope
  artifact/provider/capability/runtime/tenant/classification
```

The envelope is execution-admissibility evidence. It does not own business semantics, settle workflow obligations, or authorize a business effect by itself.

## 3. Durable local trust state is required for autonomous runtime security

TUF's client model is instructive: clients persist trusted root and metadata locally, reject lower versions, verify expiration, and establish root-key continuity incrementally. The universal lesson is that an autonomous runtime cannot depend on an online Builder lookup for every execution-security decision.

Candidate requirement:

```text
runtime autonomy
requires locally durable:
  trust anchor / continuity state
  last accepted security-policy revision
  anti-rollback state
  applicable security floor
  freshness/expiry evidence
  declared stale-operation policy
```

This material may be provisioned by Builder, deployment infrastructure or another qualified trust source, but runtime correctness must follow the declared topology rather than assume central reachability.

## 4. Offline revocation has an unavoidable information boundary

If runtime R becomes disconnected at t0 and artifact A is revoked centrally at t1 > t0, R cannot know the new fact until it receives causally newer trusted evidence through some channel.

No protocol can simultaneously guarantee all three without an additional assumption:

```text
indefinite disconnection
AND immediate knowledge of arbitrary future revocations
AND continued autonomous execution
```

Therefore the architecture must expose a **stale-security window** instead of hiding it.

Candidate distinction:

```text
KNOWN_CURRENT
KNOWN_REVOKED
VALID_UNTIL(deadline)
STALE_BUT_WITHIN_DECLARED_GRACE
STALE_NOT_ADMISSIBLE
UNKNOWN_SECURITY_CURRENTNESS
```

`UNKNOWN_SECURITY_CURRENTNESS` is not evidence that the artifact is compromised; equally, it is not evidence that no revocation occurred.

## 5. Expiration bounds freeze exposure but creates an availability boundary

TUF and Uptane use metadata expiration to bound how long an attacker can freeze a client on old signed metadata. The generalizable trade-off is direct:

```text
short freshness horizon
  -> faster revocation/freeze bound
  -> greater offline fail-closed pressure

long freshness horizon
  -> more offline availability
  -> larger stale-security exposure window
```

Expiration therefore belongs in the declared operational/security contract. It cannot be chosen as a hidden implementation constant.

For a hard security floor, once freshness evidence expires, continuing to execute under old policy would fabricate current admissibility. The allowed disposition must be explicit: fail closed, restrict to prequalified safe operations, quarantine, or use a separately justified grace policy.

## 6. Trusted time is part of the proof when expiration matters

Expiration is meaningful only relative to a sufficiently trustworthy time basis. Uptane explicitly analyzes time-source compromise: a falsely old time can make expired metadata appear current, while a falsely future time can cause denial of service.

Candidate rule:

```text
Expiry checked != freshness proven
unless time basis is qualified for that policy
```

A runtime therefore needs a declared time/currentness model: trusted wall clock, monotonic elapsed-time evidence anchored to a trusted observation, hardware-backed time, signed time evidence, or another qualified mechanism. G4 does not select one.

Clock rollback after reboot, snapshot restore or VM rollback is an adversarial case, not a mere operations detail.

## 7. Monotonic anti-rollback state must survive reboot/recovery paths

TUF clients refuse metadata versions older than already trusted state. For G4 the implementation-independent property is:

```text
acceptedSecurityRevision cannot silently decrease
```

This state must survive the recovery paths for which anti-rollback is claimed. Restoring an old VM/disk snapshot, A/B generation or golden image must not silently restore an older security floor while business state remains newer.

This intersects self-hosting research:

```text
Golden recovery != permission to restore old trust state
A/B rollback != security-floor rollback
```

If durable monotonic state cannot be guaranteed across a topology, the security claim must be weakened explicitly.

## 8. Trust-root rotation and revocation are different from artifact revocation

TUF root continuity and SPIFFE bundle rotation show that trust material itself evolves. A runtime must distinguish:

```text
artifact/provider revoked
issuer/key revoked or rotated
trust root changed
security policy generation advanced
```

A key rotation does not imply every historically signed artifact was malicious. Conversely, an artifact may be specifically disallowed even when its signature remains cryptographically valid.

Historical verification evidence may remain useful after a signer/key is no longer acceptable for new execution.

## 9. Transparency evidence helps historical proof, not current policy by itself

Sigstore bundles can carry certificates, transparency-log entries and signed timestamps sufficient for offline verification that signing occurred during an allowed certificate-validity window. This is valuable for historical provenance and reproducibility.

But:

```text
Offline signature/transparency proof
!= current security admissibility
```

A transparency entry can prove that an artifact/signature existed and was logged; it does not prove that a later vulnerability, policy revocation or minimum-generation floor has not superseded it.

Therefore historical provenance bundles and current security-floor envelopes are complementary proof domains.

## 10. Federation requires scoped trust, not one global revocation authority

SPIFFE federation is useful as a mature example of independently named trust domains exchanging and rotating trust bundles. The G4 lesson is not SPIFFE adoption; it is that federation can preserve explicit trust-domain ownership rather than requiring one universal root for all runtimes/capabilities.

Candidate topology:

```text
local runtime trust domain
  + explicitly federated security-policy issuers
  + scoped policy authority
  + locally cached continuity state
```

The Exchange Plane may carry security-policy evidence, but must not become the universal security semantic owner merely because it transports it.

`Logical Exchange Plane != single revocation service`.

## 11. Multi-channel dissemination improves availability but not truth by counting messages

Security-floor material may arrive through control-plane sync, package/update channels, federation peers, removable/offline media or other qualified paths. Multiple paths reduce dependence on one central service, but duplicate delivery is not independent authority.

```text
same signed policy via 3 mirrors
!= 3 independent approvals
```

Authority comes from the policy's issuer/threshold/trust chain, not transport count. Mirrors, brokers and gateways remain delivery mechanisms.

A runtime should be able to accept a causally newer valid policy from any qualified transport while preserving monotonicity and scope.

## 12. Fail-closed policy must be operation/risk qualified

A single platform-wide response to stale security evidence is too coarse. Candidate classes:

```text
HARD_STOP
  no further effect under stale security evidence

PREQUALIFIED_OFFLINE
  only effects whose risk/authority/security envelope explicitly permits bounded offline operation

READ/OBSERVE_ONLY
  local observation allowed; mutations/effects blocked

QUARANTINE
  preserve state/evidence, admit no new external effects
```

This is not a business-policy decision for the Exchange Plane. Capability/security policy owns which operations qualify; the Exchange Plane can propagate/enforce the declared exchange-side restriction.

## 13. Reconnect is a security reconciliation event

When a partitioned runtime reconnects, receiving a newer security floor can reveal that effects were produced during a stale window after central revocation.

Those effects cannot be erased by updating metadata.

Candidate reconciliation record needs:

```text
runtime security revision used for each effect
central revocation effective time/revision
local trusted-time basis
artifact/provider identity
business authority/contract basis
external effect disposition
affected tenant/classification
recovery/notification/audit disposition
```

Possible outcomes include `EFFECT_VALID_UNDER_DECLARED_GRACE`, `SECURITY_POLICY_VIOLATION`, `REQUIRES_REVIEW`, `COMPENSATE/FORWARD_RECOVER`, or `UNKNOWN`. Security reconciliation must not fabricate business rollback.

## 14. Revocation effective time and observation time must remain distinct

A runtime can learn at t3 that a policy says artifact A was revoked effective at t1. If it executed A at t2 while disconnected, two timelines exist:

```text
policy effective time: t1
runtime observation time: t3
```

The architecture must preserve both. Otherwise it cannot distinguish a runtime that ignored known revocation from one operating inside a declared stale window.

```text
Revocation effective earlier
!= runtime knew earlier
```

This distinction supports audit and recovery without weakening the central security policy.

## 15. Security floor propagation does not replace business authority propagation

A runtime may possess current security policy and stale business authority, or vice versa.

```text
security floor current + authority stale
  -> business effect may still be inadmissible

authority current + security floor stale
  -> execution artifact may be inadmissible
```

Both proof domains must satisfy the required interaction profile. Neither can stand in for the other.

## 16. Client/runtime independence from Builder remains achievable, but bounded

The Builder may produce/sign/package policy material, but a generated runtime must not require live Builder reachability to execute every effect. Autonomy can be preserved by carrying durable trust state and bounded security-policy validity locally.

However:

```text
Autonomous != infinitely disconnected with full authority
```

The product must expose the maximum disconnected security horizon implied by its policy. If a deployment requires immediate global revocation, that requirement is incompatible with arbitrary offline autonomous execution unless another always-reachable qualified revocation channel exists.

This is a topology/contract fact, not a failure of the Builder abstraction.

## 17. Candidate proof obligations

Before implementation planning, prove or explicitly bound:

1. a runtime can verify execution-security admissibility without live Builder access for the declared offline horizon;
2. trusted security-policy revisions cannot silently roll back across normal restart, A/B update and declared recovery paths;
3. stale/fresh/expired/unknown security currentness are representable and never collapsed into a boolean signature check;
4. expiration/freshness decisions have a qualified time basis;
5. revocation effective time and runtime observation time remain separately evidenced;
6. a disconnected runtime cannot claim knowledge of revocations it has not received;
7. the maximum stale-security window is explicit for each policy/topology class;
8. expiration causes the declared fail-closed/restricted/quarantine behavior rather than silent indefinite trust;
9. historical signature/provenance evidence remains interpretable without authorizing execution below the current security floor;
10. trust-root/key rotation has continuity/threshold proof and cannot be substituted by an unqualified mirror/gateway;
11. federation preserves scoped trust-domain ownership and does not create an accidental global semantic owner;
12. reconnect reconciles effects produced under stale security evidence without rewriting history;
13. current security policy cannot substitute for current business authority/contract evidence, or vice versa;
14. security-floor distribution remains transport-replaceable and no single broker/control-plane path is constitutionally required unless a deployment explicitly chooses that topology;
15. runtime recovery/rollback cannot reactivate a generation that durable local security state already rejected;
16. policy compaction/retention preserves enough continuity evidence to reject rollback while respecting finite-retention requirements;
17. offline grace cannot exceed the evidence/time horizon on which its safety claim depends;
18. a policy issuer compromise/recovery path can advance trust without requiring acceptance of lower previously seen generations.

## 18. Adversarial cases

1. Runtime disconnects at t0; artifact is revoked at t1; runtime executes at t2; reconnects at t3.
2. Attacker freezes runtime on old but validly signed policy metadata.
3. VM snapshot restore rolls security revision back while business database remains current.
4. Golden recovery image contains an older trusted root/security floor.
5. Local wall clock rolls backward and expired metadata appears current.
6. Compromised time source reports a falsely future time and causes fail-closed denial of service.
7. Artifact signature and transparency proof remain valid after artifact-specific revocation.
8. Signing key rotates; runtime mistakes rotation for revocation of every historical effect.
9. Runtime receives newer policy through a secondary transport while primary control plane is partitioned and incorrectly rejects it because transport identity changed.
10. Three mirrors repeat the same stale signed policy and runtime treats mirror count as quorum authority.
11. Security metadata expires during a long-running occurrence after a pre-pivot effect but before an irreversible next effect.
12. Runtime has current security floor but stale tenant/business authority and proceeds anyway.
13. Runtime has current authority but expired security policy and treats authorization as execution admissibility.
14. Reconnect updates security state and silently marks effects made in stale window invalid without governed business recovery.
15. Policy compaction deletes revision continuity needed to prove rollback.
16. Federation peer changes trust bundle while disconnected runtime keeps accepting identities under removed key material beyond declared horizon.
17. Builder is unavailable but runtime incorrectly blocks despite possessing still-valid local policy evidence.
18. Builder is reachable but compromised/stale mirror attempts to deliver lower security revision.
19. A/B rollback restores old executable and old local metadata together, bypassing floor unless monotonic state is external/durable to that rollback boundary.
20. Security policy is newer but applies to another tenant/classification/security domain; runtime applies it globally by convenience.

## 19. Portability / exit path

Portable state should preserve security-domain identity, policy revision/continuity, minimum generation, scoped revocation evidence, effective/expiry times, trusted-time basis, issuer/threshold evidence, stale-operation policy, historical artifact/provenance refs and reconciliation evidence. Provider-specific update endpoints, brokers, PKI products, storage systems and transport IDs remain replaceable realization details.

Export must be sufficient for a replacement runtime/control plane to continue anti-rollback and offline-freshness reasoning without resetting trust history to zero. If a replacement cannot import the required monotonic/trust continuity state, that loss must be explicit and may require re-bootstrap under a stronger out-of-band procedure.

## 20. Trade-offs

| Strategy | Strength | Cost / risk |
|---|---|---|
| very short expiry + fail closed | tight freeze/revocation bound | poor disconnected availability; time-source sensitivity |
| bounded offline grace | explicit availability/security trade-off | nonzero stale-revocation exposure |
| prequalified offline operations | preserves limited autonomy | policy complexity; risk of over-broad qualification |
| multiple qualified dissemination paths | removes single transport dependency | more trust/distribution operations; does not create new authority |
| local durable monotonic trust state | rollback resistance during disconnection | recovery/snapshot design complexity |
| transparency/offline provenance bundle | strong historical verification | does not answer current admissibility alone |
| federated scoped trust | preserves domain autonomy | bundle/key rotation and stale-peer handling complexity |

No strategy is a default or technology selection.

## 21. Material research position

Material delta exists. Runtime autonomy and prompt revocation are not free simultaneously: a disconnected runtime cannot learn an arbitrary future revocation without some reachable qualified channel. G4 should therefore model **bounded security currentness** rather than pretend that valid signatures or historical provenance imply indefinite admissibility.

The implementation-independent hypothesis is:

```text
Autonomous runtime security =
  durable local trust continuity
  + monotonic anti-rollback state
  + scoped security-floor/revocation evidence
  + qualified time/freshness basis
  + explicit stale-operation policy
  + reconciliation after reconnect
```

This preserves `Builder != Runtime`: Builder availability need not be consulted per effect. It also prevents the opposite error of treating autonomy as indefinite delegated security authority.

Central invariants:

```text
Previously trusted != indefinitely admissible
Offline autonomy != unlimited stale-security operation
Signature/provenance valid != security policy current
Security currentness != business authority currentness
Reconnect != retroactive erasure of stale-window effects
```

This remains research, not implementation authority.

## 22. Highest-value remaining gaps

1. evidence-minimal security reconciliation when privacy/retention has erased payloads but effect/security lineage must remain provable;
2. multi-party security-policy negotiation where autonomous systems have different floors/trust domains and no direct policy overlap;
3. model/property-based fixtures for reboot/snapshot rollback, expiry, time skew, freeze, delayed revocation and reconnect;
4. synthesis with self-hosting A/B/golden-recovery research so rollback proof and runtime security floor use one non-duplicated vocabulary;
5. family-8 vocabulary synthesis once further evidence stops changing boundaries.