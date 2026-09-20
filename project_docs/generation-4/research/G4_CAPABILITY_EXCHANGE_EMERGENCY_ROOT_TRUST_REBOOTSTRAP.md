# G4 — Emergency Root-Trust Re-bootstrap after Policy-Root Compromise

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How should autonomous System Builder/client runtimes recover when the trust/policy root that normally authorizes verifier-policy succession is itself lost, unavailable, or compromised beyond its threshold, so that no currently trusted in-band policy can safely authorize successor recovery profile P3 — without converting an emergency channel into permanent root authority, without erasing historical evidence, and without making Builder or a central Exchange Plane a mandatory runtime oracle?

This document extends the existing G4 research on offline security floors, verifier trust continuity, witness governance, witness-set rotation, partial witness-policy rollout recovery, semantic-generation handoff, split-brain rejoin, and evidence retention. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, mature systems, and papers reviewed:

- The Update Framework (TUF) Specification 1.0.26: root keys are expected offline; normal root rotation requires the successor root to satisfy both predecessor and successor thresholds; clients persist root metadata monotonically; if a threshold of Root keys is compromised, root must be updated out-of-band and safe recovery is described as extremely difficult. TUF is evidence for trust-continuity and root-compromise boundaries, not a selected G4 implementation.
- TUF FAQ and the paper *Survivable Key Compromise in Software Update Systems*: compromise below a root threshold is recoverable in-band by root rotation; compromise of the root role has qualitatively greater impact and can enable malicious updates, freeze, and metadata inconsistency attacks.
- Uptane Standard 2.0 and deployment guidance: successor Root metadata is dual-authorized by old and new root thresholds during normal migration; high-impact Root roles should use threshold keys, offline storage, separated custodians/material, and bounded expiration. Uptane is automotive evidence for root operational separation, not an adopted protocol.
- Sigstore security/threat model and public trust-root ceremony: the public instance uses TUF, offline threshold root keys, geographically/organizationally distributed key holders, and public/auditable root ceremonies. Sigstore explicitly treats secure distribution of trust material as security-critical and supports out-of-band trusted-root provisioning for air-gapped/custom deployments.
- RFC 5011: trust-anchor addition, revocation, and removal are distinct operations; revocation is immediate/permanent once validly observed, while new trust anchors require hold-down. This is evidence against treating emergency trust introduction and normal trust rotation as equivalent.
- SPIFFE Federation and Trust Domain/Bundle specifications: bootstrap trust can terminate in a statically configured bundle or an out-of-scope process; endpoint/trust-domain/profile configuration is security-sensitive and must not be inferred. This is evidence that an out-of-band bootstrap anchor and transport endpoint are separate concerns.
- NIST SP 800-57 Part 1 Rev. 5 and emergency-revocation terminology: key-management design must explicitly cover compromise, revocation, backup/recovery, cryptoperiods, and protection of trust anchors.

No TUF/Uptane/Sigstore/SPIFFE/DNSSEC mechanism, HSM, ceremony, quorum, emergency key format, broker, gateway, or provider is selected.

## 3. Material findings

### 3.1 Root compromise is a trust-discontinuity class, not ordinary policy rotation

Normal P1 -> P2 root/policy succession can prove continuity through the currently trusted root. Once the currently trusted root threshold is compromised, that proof path is no longer sufficient.

`Compromised root cannot authoritatively prove its own trustworthy replacement`.

A successor signed only by the compromised root may be attacker-authored; a successor not linked to any previously qualified recovery anchor is merely new material, not established continuity.

### 3.2 In-band recovery and emergency re-bootstrap are distinct modes

If compromise remains below the trusted root threshold, normal threshold rotation may still be valid. If the threshold itself is lost/compromised, TUF requires out-of-band root replacement.

`Below-threshold key compromise != root-threshold compromise`.

The transition into emergency mode therefore requires explicit evidence/disposition rather than silently weakening the normal threshold.

### 3.3 Emergency authority must pre-exist the incident or be externally re-established

A recovery key/profile generated after compromise cannot bootstrap itself merely by claiming emergency status.

`Emergency label != emergency authority`.

Implementation-independent recovery needs either a previously pinned recovery anchor/process, a qualified external/OOB trust-establishment procedure, or explicit human/organizational re-bootstrap whose provenance is independently verifiable. The research does not prescribe which.

### 3.4 Recovery anchor is not the normal operating root

Keeping emergency material online or routinely accepted enlarges the normal attack surface and turns break-glass authority into a permanent bypass.

`Recovery capability != continuous admission authority`.

Emergency material should authorize only a bounded recovery transition/profile and should not automatically authorize business commands, ordinary policy edits, provider selection, or canonical business state.

### 3.5 Emergency trust has scope, purpose, and expiry

A break-glass root that can authorize arbitrary future policy forever becomes a second permanent constitutional root.

`Emergency authority without scope/termination != bounded recovery`.

A candidate recovery grant therefore needs purpose/scope, affected trust domain(s), permitted successor profile/root, activation evidence, validity/expiry or one-shot generation semantics, and explicit retirement/closure evidence.

### 3.6 Root recovery does not erase the compromised interval

Installing P3/P4 through emergency re-bootstrap cannot relabel observations made while the compromised root governed verification.

`Trust re-bootstrap != history rewrite`.

Historical observations retain effective-root/policy lineage and may become historical-only, quarantined, contested, revalidated, or settled according to evidence.

### 3.7 Recovery-root possession is not proof of compromise time

Emergency custodians may prove authority to establish a successor root but do not thereby prove when the old root became compromised.

`Recovery authority != compromise chronology authority`.

Unknown compromise intervals remain representable and continue to bound which historical claims require requalification.

### 3.8 Distribution channel and trust establishment remain separate

A recovery root can be delivered by file, removable media, local admin channel, package, RPC, gateway, or Exchange Plane, but transport success does not establish trust.

`Recovery bytes delivered != recovery root trusted`.

SPIFFE's explicit separation of trust-domain identity, bundle endpoint, and endpoint profile reinforces that endpoint identity cannot safely be inferred into trust identity.

### 3.9 OOB is a trust property, not necessarily an air gap

"Out-of-band" should mean independent from the compromised trust path/failure domain, not merely "copied by USB" or "served on another URL".

`Different transport != independent trust path`.

A USB prepared by the compromised control plane or a second endpoint under the same compromised credentials is not materially OOB.

### 3.10 Emergency quorum diversity must be qualified, not counted

Threshold schemes reduce single-key compromise only when key/custodian/failure-domain assumptions are materially independent. Uptane and Sigstore operational practice distribute root holders and keep root keys offline/separate.

`M-of-N signatures != M independent compromise domains`.

Emergency assurance should retain custody/failure-domain assumptions rather than reduce them to signature count.

### 3.11 Pre-positioned recovery anchors need anti-rollback and anti-resurrection semantics

A long-offline runtime may possess an old emergency anchor that has since been retired or compromised.

`Pinned recovery anchor != indefinitely admissible recovery anchor`.

Recovery-anchor generations/security floors must survive restart/snapshot rollback, and retirement evidence must prevent an obsolete break-glass key from resurrecting authority.

### 3.12 Emergency recovery cannot depend on the compromised control plane's desired state

If Builder/control plane/policy service is within the incident domain, its ACK that P3 is installed is not sufficient recovery proof.

`Compromised-plane ACK != effective root transition`.

Runtimes need locally verifiable recovery closure appropriate to their topology and trust model.

### 3.13 Autonomous runtimes require a bounded long-offline path

A runtime offline across the incident may return with root R1 while connected peers use emergency-established R3. It must not be forced to trust R3 merely because peers call it latest, nor remain forever authoritative under R1.

`Long-offline return != automatic trust reset`.

The runtime needs a qualified recovery chain/closure from its last durable recovery anchor/floor or explicit re-bootstrap handling when no such chain exists.

### 3.14 Root re-bootstrap may deliberately stop protected effects while preserving local service

If a runtime cannot establish sufficient recovery trust, safe behavior can retain local reads/operations whose invariants do not depend on the disputed root while blocking protected cross-capability/new-effect operations.

`Root uncertainty != mandatory total runtime shutdown`.

This preserves Builder/runtime autonomy while keeping hard trust-dependent guarantees explicit.

### 3.15 Emergency recovery and business settlement remain separate

A newly trusted root/profile can restore verifier authority without deciding which of two business branches or irreversible external effects is canonical.

`Trust restored != business conflict settled`.

Exchange Plane/recovery tooling may carry evidence and enforce corridor admission but cannot acquire capability-local business ownership.

### 3.16 Recovery closure should be self-contained enough for the declared autonomy horizon

Air-gapped Sigstore policy-controller deployments can be provisioned with serialized TUF roots/repositories or explicit keys/certificates OOB. Generalized for G4, a recovery closure may need enough root-transition, compromise, profile, and currentness evidence for local verification without live Builder access.

`Offline-verifiable recovery != online central trust oracle`.

The closure remains evidence, not canonical business truth.

### 3.17 Emergency authority should be extinguishable without deleting its evidence

After P3/P4 becomes normally governed, the emergency anchor/process should cease authorizing new transitions while its activation/usage evidence remains retained for audit and historical verification.

`Emergency authority retired != emergency evidence erased`.

This is the root-level analogue of witness retirement without historical forgetting.

### 3.18 Emergency closure must prevent silent re-entry

Once normal governance is restored, the same emergency credential/process must not silently reactivate on a future ordinary failure unless a new qualified emergency activation occurs.

`Used once != reusable forever`.

One-shot generation, explicit re-arming, expiry, or another bounded mechanism is required at the semantic level; concrete realization remains open.

### 3.19 Root recovery can require client/runtime software recovery too

TUF warns that threshold root compromise may imply attackers installed arbitrary software. Therefore replacing trust metadata alone may not restore trustworthy verification if the verifier/runtime itself was modified.

`Root metadata repaired != verifier/runtime TCB repaired`.

Recovery proof must name whether executable integrity/reinstallation/attestation is in scope; otherwise assurance remains qualified.

### 3.20 Recovery can create compatibility skew

Sigstore's 2024 TUF root update showed that a legitimate root-format/specification transition could strand older clients. Emergency recovery can likewise produce runtimes unable to parse/verify the new root/profile.

`Recovery root valid != every installed verifier can process it`.

Compatibility/readiness evidence is separate from trust authorization; unsupported runtimes may require software update or remain restricted.

### 3.21 Recovery bootstrap must not infer semantic identity from location

SPIFFE explicitly warns that trust domain, endpoint URL, and endpoint profile cannot safely be inferred from one another.

`Same recovery URL != same trust root`; `new URL != new trust identity`.

A gateway/mirror/CDN can distribute recovery material without becoming its authority.

### 3.22 Emergency action requires evidence of who/what authorized it, but identity alone is insufficient

A public ceremony or named custodian proves provenance only to the extent its identity/authentication process is qualified; it does not by itself prove the recovery policy is semantically safe.

`Ceremony provenance != recovery semantic correctness`.

Policy/profile semantics, scope, compatibility, and business ownership remain separately verified.

### 3.23 Recovery anchors are domain-qualified

A root for one trust/capability domain cannot be pooled into a universal root store for convenience. SPIFFE explicitly preserves `<trust-domain, bundle>` binding to prevent cross-domain impersonation.

`Trusted somewhere != trusted for every domain`.

Emergency root federation must preserve domain, tenant/classification, and authority scope.

### 3.24 No permanent Builder dependency is introduced

Builder may help author/distribute recovery evidence, but a published runtime's declared recovery path must remain possible from locally durable/OOB trust closure where topology requires autonomy.

`Emergency recovery support != Builder runtime authority`.

## 4. Candidate research vocabulary

Research vocabulary only; no schema or implementation is authorized.

- `RootTrustRef` — immutable identity of a qualified trust-root generation/profile.
- `RecoveryAnchorRef` — pre-positioned or externally established anchor qualified only for emergency recovery scope.
- `EmergencyActivationRef` — evidence that a bounded emergency recovery mode was validly activated for a named incident/domain/scope.
- `RootCompromiseRef` — evidence/disposition that a root key set or threshold is lost, compromised, or below required assurance, with known/unknown effective interval.
- `EmergencyRootTransitionRef` — evidence linking the last admissible root/recovery anchor to a successor recovery root/profile without pretending normal in-band continuity.
- `RecoveryAuthorityScope` — explicit domain, operation, successor, time/generation, and action bounds of emergency authority.
- `RecoveryAnchorFloorRef` — monotonic minimum recovery-anchor generation/admissibility state retained locally.
- `EmergencyClosureRef` — locally sufficient package of root-transition, activation, compromise, currentness, compatibility, and retirement evidence for autonomous verification.
- `EmergencyRetirementRef` — evidence that a break-glass authority can no longer authorize new recovery transitions while its historical evidence remains verifiable.
- `RootRecoveryDisposition` — qualified state such as `NORMAL`, `EMERGENCY_REQUIRED`, `EMERGENCY_ACTIVE`, `RECOVERY_ROOT_ADMITTED`, `TCB_REVALIDATION_REQUIRED`, `HISTORICAL_ONLY`, `RETIRED`, `UNKNOWN`, `CONTESTED`.

## 5. Candidate proof obligations

1. Root-threshold compromise cannot be recovered by trusting a successor solely because the compromised root signed it.
2. Below-threshold compromise and threshold/root compromise use distinct recovery semantics.
3. Emergency authority is established from a previously qualified recovery anchor/process or independently qualified OOB re-bootstrap, never self-asserted post-compromise.
4. Recovery anchors do not acquire ordinary business/policy authority outside their declared emergency scope.
5. Emergency authority has explicit purpose/domain/action/time-or-generation bounds and a termination path.
6. Root re-bootstrap preserves historical effective-root/policy lineage rather than rewriting the compromised interval.
7. Recovery authority does not fabricate compromise chronology; unknown intervals remain explicit.
8. Delivery/transport of recovery material cannot substitute for trust establishment.
9. OOB qualification demonstrates independence from the compromised trust/failure path rather than mere transport diversity.
10. Threshold/quorum assurance records material custody/failure-domain assumptions and does not infer independence from signature count.
11. Retired/compromised recovery anchors cannot regain authority after restart, snapshot rollback, stale cache, or long disconnection.
12. Control-plane/Builder ACK cannot prove effective recovery when that plane is inside the incident domain.
13. Long-offline runtimes rejoin through qualified recovery closure or explicit re-bootstrap; neither peer majority nor "latest" is sufficient.
14. Operations not materially dependent on disputed root trust may continue only under their own declared invariants/horizons; protected effects fail closed/qualified when evidence is insufficient.
15. Root trust recovery does not select canonical business state or settle irreversible effects.
16. Declared autonomous runtimes can verify sufficient recovery closure without mandatory live Builder/central Exchange Plane access.
17. Emergency authority can be retired without deleting activation/transition evidence needed for audit/history.
18. A used/retired emergency mechanism cannot silently reactivate without a new qualified activation.
19. Root recovery assurance names whether verifier/runtime executable integrity is established; repaired metadata alone cannot imply repaired TCB.
20. A valid recovery root/profile is not considered deployable on a runtime that cannot parse/verify its semantics; compatibility is explicit.
21. Endpoint/gateway/mirror continuity cannot manufacture root identity or trust continuity.
22. Custodian/ceremony provenance remains separate from semantic correctness of the recovery policy/profile.
23. Recovery roots/anchors remain trust-domain and authority-scope qualified; they are not pooled into accidental universal authority.
24. Emergency recovery does not introduce a permanent Builder dependency into published client runtimes.

## 6. Mandatory adversarial cases

1. Attacker compromises the current root threshold and signs attacker-controlled P3; clients accept it as normal continuity.
2. One root key is compromised below threshold; operator unnecessarily enters break-glass mode and bypasses surviving threshold protections.
3. Emergency key is generated after the incident and accepted solely because it is labeled `recovery`.
4. Break-glass key remains online and can authorize ordinary policy changes indefinitely.
5. Emergency root can authorize business commands/provider bindings beyond trust recovery.
6. Recovery package installs P3 and relabels all P2-era observations as P3-qualified.
7. Emergency custodians assert an exact compromise time without independent evidence.
8. Recovery bundle arrives over HTTPS/USB and transport possession is treated as trust proof.
9. "OOB" mirror uses the same compromised IAM/HSM/control-plane credentials as the failed path.
10. Three emergency signatures are counted as independent although all custodians share one organization/HSM/admin plane.
11. Offline runtime restores a snapshot containing a retired recovery anchor and accepts an attacker-signed emergency root.
12. Builder reports recovery complete even though its own trust/control plane is in the compromise domain.
13. Long-offline runtime accepts peer-majority P3 with no qualified chain to its pinned recovery anchor.
14. Long-offline runtime keeps using compromised R1 forever because no live Builder is available.
15. Root uncertainty shuts down unrelated capability-local operations whose guarantees do not depend on the root.
16. New root is trusted and Exchange Plane declares one divergent business branch canonical.
17. Runtime requires live central service to verify every post-recovery interaction, violating published autonomy.
18. Emergency key is retired by deleting all evidence, making later audit/forensics unable to prove how P3 became trusted.
19. Same emergency credential silently reactivates months later during an unrelated outage.
20. Root metadata is repaired while attacker-modified verifier/runtime binary remains authoritative.
21. P3 uses a newer format/algorithm unsupported by old runtimes; deployment ACK is treated as successful trust recovery.
22. Recovery endpoint keeps same URL but serves a different root; clients infer continuity from location.
23. A recovery root trusted for domain A is pooled and used to validate domain B.
24. Ceremony participants are authenticated but sign a semantically overbroad recovery policy; provenance is mistaken for policy safety.

## 7. Technology-independent recovery hypothesis

A bounded emergency recovery flow can be modeled as:

```text
last locally durable root/floor
  -> detect/qualify root-threshold failure
  -> enter EMERGENCY_REQUIRED for affected guarantees
  -> resolve previously qualified RecoveryAnchorRef or independent OOB re-bootstrap
  -> verify EmergencyActivationRef + RecoveryAuthorityScope
  -> admit EmergencyRootTransitionRef / successor RootTrustRef
  -> persist monotonic RecoveryAnchorFloorRef
  -> requalify verifier/runtime TCB compatibility/integrity as required
  -> requalify affected observations/effects selectively
  -> restore normal root-governed succession
  -> emit EmergencyRetirementRef
  -> retain historical emergency/compromise evidence
```

The Exchange Plane may transport and expose this evidence, enforce corridor admission, and report dispositions. It does not own the root's business domains, choose business winners, or become a global root oracle.

## 8. Portability / exit-path implications

A portable design should preserve independently exportable:

- immutable root/recovery-anchor identities and generations;
- threshold/custody/failure-domain assumptions;
- emergency activation and bounded scope;
- compromise interval/disposition evidence;
- transition and retirement evidence;
- local monotonic recovery/security floors;
- historical effective-policy/root lineage;
- compatibility/TCB qualification state;
- trust-domain/tenant/classification binding.

Replacing TUF-like metadata, an HSM vendor, PKI, gateway, broker, Builder deployment, or recovery transport must not require rewriting the semantic meaning of prior recovery evidence.

## 9. Deduplication against existing G4 research

This round does not reopen generic key rotation, witness-set rotation, policy rollback, offline security floors, profile negotiation, split-brain settlement, or evidence compaction. The material delta is specifically:

`loss/compromise of policy-root authority × independent emergency re-bootstrap × bounded break-glass authority × long-offline runtime recovery × emergency-authority retirement × TCB requalification`.

Existing rules remain intact: `Builder != Runtime`; `Shared primitives != shared business ownership`; `Logical Exchange Plane != single broker`; `AI inference != authority`; `Provider ACK != effective state`; `Exchange Plane owns exchange semantics, capability owns business semantics`.

## 10. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This closes the immediate question of how root-threshold compromise differs from ordinary policy rollback and establishes bounded emergency-authority/retirement proof obligations. It does not saturate family 8.

Next highest-value gap: **recovery-anchor compromise/loss and mutually inconsistent emergency roots** — the second-order failure where the normal root is compromised and two independently plausible OOB recovery authorities produce incompatible successor roots for disconnected runtime populations. Research should determine how to represent competing recovery-root claims without majority-truth shortcuts, how to bound protected effects while the constitutional root itself is disputed, how historical emergency evidence participates in settlement, and what can be proven locally without a global oracle.