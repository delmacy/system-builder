# G4 — Observation-Policy Rollback/Recovery after Partial Witness-Policy Rollout

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How should autonomous runtimes recover when a witness/verifier policy rollout is only partially deployed, the successor policy is later discovered compromised, correlated or otherwise below the required assurance floor, and the observed status domain continued to evolve while some runtimes used predecessor policy P1 and others used successor/transitional policy P2 — without treating verifier-policy rollback as semantic-history rollback, without erasing valid historical observations, and without requiring a global stop-the-world or central Exchange Plane oracle?

This document extends the existing G4 research on witness-set rotation/observation churn, private revalidation equivocation, witness governance/correlated compromise, security floors, profile negotiation, semantic-generation handoff, recovery/compaction and split-brain reconciliation. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards and mature-system evidence reviewed:

- The Update Framework (TUF) specification and security guidance: trust expires rather than remaining permanent; root metadata advances through explicit trusted transitions; compromised role keys are revoked/replaced by root metadata; compromise of a root threshold may require out-of-band recovery. TUF is evidence for compromise-resilient trust transitions, not a selected G4 implementation.
- Sigstore threat/security model: TUF distributes and rotates CA/transparency key material; compromise-time-aware revocation can preserve verification of legitimate pre-compromise signatures while freshness prevents replay of obsolete trust material. Monitoring detects some misbehavior but does not create semantic truth.
- RFC 5011, Automated Updates of DNSSEC Trust Anchors: adding trust anchors uses hold-down before trust; valid revocation is immediate and permanent at the resolver; a revoked key is retained temporarily for safe removal. This is evidence that trust addition, revocation and physical/configuration removal are different lifecycle events.
- RFC 6781 DNSSEC Operational Practices: rollover needs staged overlap and cache propagation; old material is revoked before removal under RFC 5011-style rollover. This is evidence against instantaneous global cutover assumptions.
- Google `google-tlog-witness`: log and verifier policies cannot update atomically. Production witness-set changes use a staged sequence: relax verifier policy if necessary, move log policy after verifier bake, then tighten verifier policy. The repository explicitly requires waiting for production verifier rollout and offline proof material to catch up.
- transparency.dev/C2SP tlog-policy: log/witness identities and quorum are policy inputs; URLs are operational details, and offline verification does not require URLs. This supports separation of verifier policy identity from serving topology.
- Torchwood litewitness operational guidance: removing a known log is deliberately unsupported because re-adding it can risk signing a split view; disabling keys is preferred. This is mature failure-oriented evidence that deleting observation history/state can reopen equivocation hazards.

No TUF repository, Sigstore service, DNSSEC mechanism, transparency log, witness implementation, quorum algorithm, broker, provider or concrete rollback protocol is selected.

## 3. Material findings

### 3.1 Policy rollback is not time reversal

If runtimes R1/R2 verified checkpoints under P2 and P2 is later judged compromised or below floor, reinstalling P1 cannot make the P2 interval disappear.

`Verifier-policy rollback != observation-history rollback`.

Historical P2-qualified observations remain facts with provenance and qualification state. Their current admissibility may be downgraded, but they are not silently rewritten as P1 observations.

### 3.2 Security-floor rollback is a distinct decision

Returning the verifier implementation/configuration to an older policy does not authorize lowering a locally observed security floor.

`Policy package rollback != security-floor rollback`.

A runtime that learned `P2_COMPROMISED_AFTER/T` or a stronger minimum admissible profile cannot accept P1 merely because P1 was previously trusted unless an explicit recovery policy proves P1 is admissible for the relevant operation/time/authority context.

### 3.3 Partial rollout creates a policy frontier, not one global current version

During P1 -> transitional P1/P2 -> P2 rollout, different runtimes can legitimately be on different verifier generations. The recoverable state is therefore a frontier such as `{R1:P1, R2:P1/P2, R3:P2}` plus the observed-domain checkpoints each verifier admitted.

`Partial verifier rollout != one global policy generation`.

Recovery must reason from per-runtime/per-domain effective policy evidence rather than an intended control-plane target.

### 3.4 Intended deployment state cannot reconstruct effective assurance

Google's staged witness-policy rollout explicitly distinguishes verifier policy, log policy and offline proof material and requires bake periods between them. Therefore a desired-state controller or deployment ACK cannot prove which policy actually qualified a protected observation.

`Desired P2 everywhere != P2 effectively governed every observation`.

Protected evidence needs effective-policy lineage where the distinction is material.

### 3.5 Compromise discovery time and compromise effective interval are different

Sigstore's compromise-time-aware trust model supports retaining legitimate pre-compromise evidence. Generalized for G4:

`Compromise discovered at Td != compromise began at Td`.

If the start is known, evidence can be requalified by interval. If unknown, affected P2-dependent claims become `UNRESOLVED/CONTESTED` rather than universally valid or universally invalid.

### 3.6 A predecessor policy is not automatically a safe fallback

P1 may be cryptographically intact yet below a newer mandatory security floor, missing a newly required witness diversity assumption, or unable to interpret checkpoints emitted after P2 cutover.

`Previously safe P1 != currently admissible P1`.

Rollback candidates must satisfy current operation-specific security, semantic, continuity and observation requirements.

### 3.7 Recovery may require a successor P3 rather than P1 rollback

When P2 is compromised after domain progress, safest recovery can be a new P3 that fences P2 for future admission, carries forward the last uncontested/conflict frontier, preserves historical P2 evidence as qualified history, and defines how P1/P2 runtimes rejoin.

`Recovery != necessarily restore predecessor`.

This avoids conflating rollback availability with trust recovery.

### 3.8 Trust addition, revocation and removal are separate phases

RFC 5011 adds a hold-down before a new anchor becomes trusted, makes observed valid revocation immediate/permanent, and retains revoked material for a removal interval. The implementation-independent lesson is:

`Trusted -> revoked -> physically removed` is not one transition.

G4 should preserve the distinction between current admission authority, revocation/fencing evidence and historical verification material.

### 3.9 Compromised policy evidence may remain historically necessary

A P2 key/profile may be prohibited for new observations while still required to prove that a checkpoint or conflict was actually observed during the incident interval.

`No longer trusted for admission != erase from evidence closure`.

Historical verification must not silently re-authorize P2 for current use.

### 3.10 Recovery must preserve the strongest observed conflict frontier

If any qualified runtime observed incompatible branches while P2 was active, a runtime that only saw P1 cannot erase that conflict by becoming the recovery source.

`Older uncontested view != proof newer conflict never occurred`.

Conflict evidence is monotonic unless explicitly subsumed by stronger settlement/fencing evidence.

### 3.11 Policy compromise does not itself select a business branch

Discovering that P2 witnesses were correlated/compromised can weaken confidence in checkpoints they cosigned, but does not make P1's branch the business truth.

`P2 disqualified != P1 branch wins`.

Branch settlement remains owned by the observed capability/status authority under its declared reconciliation law.

### 3.12 Quarantine is different from invalidation

When P2 assurance becomes uncertain, affected observations may be quarantined from new protected effects while remaining queryable as historical evidence.

`Quarantined evidence != nonexistent evidence`.

This supports forensic/reconciliation use without granting new authority.

### 3.13 Recovery scope follows material dependency

Only proofs/effects whose minimal semantic cut set depended on P2's disputed assurance require requalification.

`P2 compromised != global platform invalidation`.

Unrelated capability-local evidence, independent witness domains and proofs whose required guarantees do not depend on P2 remain usable when their own floors are satisfied.

### 3.14 Offline runtimes need a recovery closure, not live central arbitration

An offline runtime returning with P1 or P2 state needs enough durable transition evidence to determine: its retained frontier, relevant compromise interval, current admissible recovery profile, and whether its queued/new effects require re-admission.

`Reconnect != trust reset`.

The closure may be transported through the Exchange Plane, but the plane does not decide business truth.

### 3.15 Recovery evidence itself needs anti-rollback protection

An attacker who can replay pre-incident P2 policy could otherwise make a recovered runtime forget the compromise.

`Recovery package received != recovery floor durably advanced`.

Locally observed compromise/revocation/recovery generations must survive restart, snapshot restore and cache refresh according to the existing monotonic-floor rules.

### 3.16 A stale runtime may be safe to read but unsafe to effect

A P1 runtime behind the recovery frontier may retain historical/read utility while being barred from issuing new protected effects until it obtains sufficient recovery closure.

`Readable history != new-effect authority`.

This reuses G4's separation of semantic resolvability, continuation authority and new-effect admissibility.

### 3.17 Transitional `P1 OR P2` acceptance must be phase-bounded

The relaxed verifier policy used for rollout availability cannot survive incident recovery as an indefinite fallback. Otherwise a compromised P2 remains admissible through the compatibility window.

`Transition compatibility != incident recovery authority`.

Recovery must close or supersede transitional unions explicitly.

### 3.18 A policy controller cannot declare recovery complete from deployment convergence

Even when every runtime reports P3 installed, unresolved P2-derived effects, quarantined observations, old offline runtimes and historical conflict evidence may remain.

`Verifier convergence != incident settlement`.

Recovery completion is vector-valued: policy deployment, security floor, observation continuity, conflict settlement and external-effect settlement are separate.

### 3.19 Effect lineage survives verifier-policy recovery

A command admitted under P2 and delivered after P3 recovery does not become a P3 command merely because execution occurs later.

`Delivery under P3 != admission under P3`.

Queued/in-flight work preserves its admission/policy lineage or undergoes explicit re-admission under P3.

### 3.20 Duplicate recovery/retry must not duplicate business effects

If incident tooling resubmits P2-era work, the original stable effect identity and idempotency/fencing requirements remain binding.

`Recovery replay != new business obligation`.

Transport retry and semantic re-admission remain separate.

### 3.21 Recovery cannot rely on deleting old witness state

Torchwood's refusal to remove a known log because re-addition can enable split-view risk generalizes to G4: destructive deletion of observer/frontier state can erase the evidence needed to reject an old conflicting branch.

`Observer disabled != observer history forgotten`.

Compaction may subsume history only with a stronger durable recovery/fencing witness.

### 3.22 Serving topology is not recovery identity

Moving recovery metadata to a new URL, mirror or gateway does not create a new trust domain, and keeping the same URL does not prove continuity.

`Recovery endpoint continuity != trust continuity`.

Immutable policy/recovery identity and qualified transition evidence remain primary.

### 3.23 Stop-the-world is not a universal proof obligation

Independent capabilities/invariants may recover separately when their evidence closure is sufficient. A global barrier is justified only by a genuinely shared invariant/failure domain.

`Shared incident != mandatory global transaction`.

This preserves autonomous runtimes and avoids making the Exchange Plane a global coordinator.

### 3.24 Recovery may intentionally reduce availability

For operations whose required guarantee depends on disputed P2 evidence and lacks a safe P1/P3 closure, the correct state may be `UNKNOWN/QUARANTINED/REVALIDATION_REQUIRED` rather than false success.

`Availability pressure != permission to fabricate trust continuity`.

## 4. Candidate research vocabulary

Research vocabulary only; no schema or implementation is authorized.

- `EffectiveObservationPolicyRef` — immutable policy/profile actually used to qualify an observation.
- `ObservationPolicyFrontier` — set of effective policy generations and domain checkpoints known across independently progressing runtimes; not a global total order.
- `PolicyCompromiseRef` — qualified evidence of compromise/correlation/floor failure, including known/unknown effective interval.
- `PolicyRecoveryProfileRef` — immutable successor recovery policy, potentially P3 rather than predecessor P1.
- `RecoveryTransitionRef` — evidence linking predecessor/incident/recovery policy states without rewriting historical observations.
- `HistoricalPolicyQualificationRef` — evidence sufficient to explain why an observation was admitted under a retired/compromised policy at the time.
- `RecoveryFloorRef` — monotonic local minimum recovery/security state below which old policy material cannot regain current authority.
- `QuarantinedObservationRef` — retained observation whose historical existence is preserved but whose current admissibility is restricted pending settlement/revalidation.
- `RecoveryClosureRef` — locally sufficient package of transition, compromise interval, frontier and current policy evidence for autonomous rejoin.
- `PolicyRecoveryDisposition` — qualified state such as `CURRENT`, `TRANSITIONING`, `QUARANTINED`, `REVALIDATION_REQUIRED`, `CONTESTED`, `UNKNOWN`, `HISTORICAL_ONLY`, `SETTLED`.

## 5. Candidate proof obligations

1. Verifier-policy rollback never rewrites or deletes observations actually qualified under the rolled-back policy.
2. Policy/configuration rollback and security-floor rollback remain distinct and require independent authority.
3. Partial rollout is represented as an effective per-runtime/domain policy frontier rather than one fabricated global version.
4. Desired-state/ACK evidence cannot substitute for proof of the policy that actually governed a protected observation/effect.
5. Compromise discovery time and effective compromise interval remain distinct; uncertainty is represented explicitly.
6. A predecessor policy is reused only if it satisfies current security, semantic, continuity and operation-specific floors.
7. Recovery may introduce a successor P3 without pretending P1 was continuously authoritative through the incident.
8. Trust addition, revocation/fencing and historical-material removal remain separate lifecycle operations.
9. Retired/compromised policy material can remain historically verifiable without retaining new-admission authority.
10. The strongest retained conflict frontier cannot be erased by rollback to an older uncontested runtime/view.
11. Disqualification of an observation policy cannot select the canonical business branch by itself.
12. Quarantined evidence remains representable/queryable as evidence while being barred from unauthorized new effects.
13. Requalification/invalidation is selective to proofs materially dependent on the disputed policy assurance.
14. Offline runtimes can rejoin from durable recovery closure without requiring Builder/central Exchange Plane availability.
15. Recovery/compromise floors survive restart, snapshot rollback, stale cache refresh and replay of older policy material.
16. Historical readability/semantic resolvability remains separate from continuation and new-effect authority.
17. Transitional old-or-new acceptance is phase-bounded and cannot silently persist as incident recovery policy.
18. Policy deployment convergence does not imply conflict/effect/incident settlement.
19. In-flight/queued obligations retain admission-policy lineage across recovery or undergo explicit re-admission.
20. Recovery replay preserves stable effect identity and declared idempotency/dedup/fencing requirements.
21. Observer/witness frontier state is not destructively forgotten while it can still prevent branch resurrection.
22. Endpoint/mirror/gateway changes cannot manufacture recovery/trust continuity.
23. Recovery barriers are scoped to the protected invariant/failure domain; no global stop-the-world is assumed.
24. When required recovery evidence is insufficient, `UNKNOWN/QUARANTINED/REVALIDATION_REQUIRED` remains representable instead of false success.

## 6. Mandatory adversarial cases

1. P2 is discovered compromised; operator reinstalls P1 and relabels all P2 observations as P1-qualified.
2. Runtime learned a P2 compromise floor, restores an old snapshot and begins accepting P2 again.
3. P1 is restored although a newer security floor explicitly retired P1.
4. P1 cannot validate post-cutover checkpoints but gateway reports recovery success because P1 package installed.
5. Control plane reports P2 deployed everywhere although some runtimes still effectively verified under P1.
6. P2 compromise is discovered today and every historical P2 observation is invalidated regardless of compromise interval.
7. Unknown compromise start is flattened to `safe-before-discovery`.
8. P2 is disqualified and Exchange Plane automatically selects P1's observed branch as business truth.
9. Runtime with an older uncontested P1 checkpoint overwrites a newer retained P2-era conflict witness.
10. Transitional `P1 OR P2` verifier policy remains indefinitely active after P2 compromise.
11. Recovery tooling deletes P2 witness/frontier state, allowing a previously rejected branch to be reintroduced later.
12. P3 is accepted only because it is served from the same URL as P1/P2.
13. New recovery mirror is counted as an independent recovery witness although it republishes identical evidence.
14. P2-era command is redelivered under P3 and treated as a fresh P3-authorized business obligation.
15. Incident replay duplicates a payment/external effect because recovery minted a new effect identity.
16. All runtimes install P3; incident is declared settled while irreversible P2-era external effects remain unresolved.
17. Offline P1 runtime reconnects and is granted new-effect authority before learning the P2 compromise/recovery floor.
18. Offline P2 runtime remains indefinitely authoritative because it possesses a historically valid P2 policy bundle.
19. P2 compromise in one observation domain triggers global invalidation of unrelated capability evidence.
20. Recovery controller blocks the whole platform even though affected invariants are capability-local and independent.
21. Availability pressure converts `REVALIDATION_REQUIRED` into success without recovery evidence.
22. Revoked P2 key is physically deleted immediately, making historical conflict evidence unverifiable.
23. Retained P2 key is interpreted as still authorized for current admission merely because historical verification needs it.
24. Gateway/controller accumulates canonical business state while coordinating policy recovery and becomes an accidental semantic owner.

## 7. Trade-offs and portability/exit path

- Stronger monotonic recovery floors reduce downgrade risk but can make rollback/air-gapped recovery harder; therefore emergency recovery must be an explicit qualified transition, not an implicit `use older config` escape hatch.
- Retaining historical policy/key/frontier evidence increases storage/governance burden but avoids both unverifiable history and accidental reauthorization. Compaction should preserve the minimum recovery questions, not raw history by default.
- Fine-grained selective quarantine/requalification is operationally more complex than global invalidation but preserves autonomy and availability for unaffected capabilities.
- A P3 successor can be safer than P1 rollback after compromise, but introduces another transition that must be verifiable from locally retained trust/recovery closure.
- Provider-neutral recovery requires exportable immutable policy identities, compromise/recovery evidence, frontier summaries and effect lineage. No cloud, broker, mesh, transparency vendor or Builder service may be the only place where recovery meaning exists.
- Direct local verification, RPC retrieval, broker distribution, file/bundle exchange or gateway delivery may transport recovery closure. Transport substitution must not change the promised recovery semantics.

## 8. Deduplication against existing G4 research

This round does not reopen generic trust-root rotation, witness governance, split-brain recovery, security floors, profile negotiation, handoff, caching or private equivocation. The material delta is specifically:

`partial witness/verifier-policy rollout × successor-policy compromise × policy rollback vs security-floor rollback × historical P2 preservation × autonomous rejoin`.

Existing rules are reused rather than duplicated: `Provider ACK != effective state`; historical semantic continuity/continuation/new-effect admissibility remain separate; monotonic floors survive restart/rollback; conflict evidence is not majority truth; Exchange Plane owns exchange/evidence semantics rather than business truth.

## 9. Maturity and next gap

Material delta: **YES**.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated. This round materially changes recovery boundaries and proof obligations for a failure mode not captured by clean witness rotation alone.

Next highest-value gap: **recovery-profile provenance and emergency trust re-bootstrap after loss/compromise of the policy root itself**, especially when no currently trusted policy can authorize P3, some autonomous runtimes are long-offline, and out-of-band/manual recovery must avoid both permanent brick state and an emergency bypass that becomes an unrestricted root-of-trust backdoor. Research should compare threshold/offline roots, break-glass ceremonies, pinned recovery anchors, physical/OOB channels, compromise-time uncertainty, rebootstrap lineage, and decommissioning of emergency authority without selecting a concrete PKI/provider.