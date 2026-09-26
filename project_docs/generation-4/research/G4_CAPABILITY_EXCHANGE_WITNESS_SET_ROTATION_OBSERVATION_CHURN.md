# G4 — Conflict-Aware Non-Equivocation Recovery under Witness-Set Rotation and Observation-Domain Churn

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can autonomous runtimes preserve qualified non-equivocation/conflict evidence while witnesses, witness keys, operators, observation domains, network vantage points and transparency/status providers rotate, disappear, overlap or are retrospectively discovered to share a failure domain — without making old witnesses permanently authoritative, without treating a quorum as business truth, and without requiring the Builder or Exchange Plane to remain online?

This document extends the existing G4 work on private revalidation equivocation, witness governance/correlated compromise, private selective revalidation, trust continuity, proof-policy transition, split-brain recovery and historical evidence compaction. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards and mature-system evidence reviewed:

- RFC 9162, Certificate Transparency v2: signed checkpoints/tree heads, consistency proofs and append-only verification. It is used only as evidence that checkpoint authenticity and history consistency can be independently verified; it is not selected architecture.
- RFC 9943, SCITT Architecture (June 2026): transparency-service identity, receipts, non-equivocation goals and the separation between transparent registration and truth/legitimacy of issuer statements.
- The Update Framework Specification: root metadata transitions require authorization under both the currently trusted root and the successor root; clients advance monotonically through root versions, preserving a verifiable trust transition and rollback resistance.
- Sigstore threat/security model: TUF-based distribution and rotation of transparency/CA key material, compromise-time-aware revocation, freshness and recovery; monitoring detects some compromises but does not make monitored content semantically correct.
- Sigstore Rekor sharding documentation: a log generation can be frozen while signing keys rotate and later generations continue; historical entries remain queryable across shards. This is evidence that infrastructure/log generation and historical statement identity need not be identical.
- transparency.dev witness implementation: a witness retains a checkpoint, verifies append-only consistency from its prior checkpoint, then countersigns the new checkpoint. A witness signature is therefore evidence about continuity it observed, not business ownership.
- Google `google-tlog-witness`: production-oriented witness policy explicitly separates log policy from verifier policy. Adding/removing witnesses and rotating witness keys require staged rollout because producer and verifier policies cannot change atomically. Witness-key rotation is handled as overlapping add-then-remove: verifiers first accept old or new, the log moves to the new key, then the old key is removed from verifier policy.
- transparency.dev distributor: distributing witnessed checkpoints is a serving function; configured witness keys constrain accepted checkpoint evidence but do not turn the distributor into the source of business truth.

Emerging Internet-Drafts were inspected only as non-authoritative evidence and are not used as normative support.

No Certificate Transparency deployment, SCITT service, TUF repository, Sigstore/Rekor, transparency.dev witness/distributor, quorum algorithm, Merkle structure, broker or provider is selected.

## 3. Material findings

### 3.1 Witness-set identity is a versioned assurance input, not an eternal authority

A checkpoint cosigned by witness set W1 is qualified under the witness policy/profile that made W1 admissible at that time. Later deployment of W2 does not retroactively erase W1's historical observation, nor does W1 remain authorized forever for new checkpoints.

`Historically qualified witness != indefinitely current witness`.

`Witness-set rotation != historical evidence deletion`.

The proof must bind the witness-policy/profile generation under which the observation was qualified.

### 3.2 Witness-policy transition and log/status transition are distinct state machines

Google's witness-policy rollout provides a mature operational failure case: log/operator policy and verifier policy cannot be changed atomically, so safe witness changes require staged overlap. The implementation-independent lesson is broader:

`Observation-policy cutover != observed-domain semantic cutover`.

A status/log domain may continue the same semantic history while the set of observers qualified to attest non-equivocation changes. Conversely, the witness set may remain stable while the underlying status authority performs a semantic recovery. These transitions must not be conflated.

### 3.3 Rotation overlap is compatibility evidence, not permission union

During W1 -> W2 migration, a verifier may temporarily accept evidence from old or new witnesses so rollout remains live. That overlap is a bounded transition rule, not a permanent union of witness authority.

`Old-or-new accepted during transition != old-or-new admissible forever`.

This reuses the G4 anti-downgrade principle: coexistence is scoped by transition phase, currentness and operation, not by arbitrary support intersection.

### 3.4 A new witness key needs continuity qualification, not merely a valid signature

A witness key can rotate while the witness/operator role remains continuous. A valid signature from K2 does not by itself prove that K2 is the legitimate successor of K1.

`New witness key valid != same witness continuity proven`.

A future implementation may use a root/trust transition, cross-signature, policy update or other mechanism, but the research requirement is implementation-independent: continuity must be explicitly evidenced under the declared witness policy.

### 3.5 Trust-root rotation and witness rotation are separate dimensions

A witness key may rotate under one stable root; the root authorizing witness policies may itself rotate; the observed log/status authority may rotate independently.

`Witness-key rotation != witness-policy-root rotation != observed-authority rotation`.

Collapsing these into one `generation` would create false continuity or unnecessary global invalidation.

### 3.6 Historical verification can survive witness retirement

Removing witness W from the current policy must not make every old checkpoint unverifiable. Historical verification needs the immutable policy/profile, key qualification and time/currentness evidence sufficient to establish that W was qualified when it observed that checkpoint.

`Witness retired for new observations != old cosignature invalid`.

This mirrors prior G4 trust-continuity work: current admission roots and historical verification roots are different roles.

### 3.7 Retrospective correlation discovery changes assurance, not history

Suppose W1 and W2 were believed independent, then later evidence shows both shared one operator, HSM, network vantage or upstream data source during interval T. The historical checkpoint remains an observed fact, but the independence dimension of its assurance profile is downgraded for T.

`Later-discovered correlation != historical checkpoint never existed`.

`N signatures observed != N independent failure domains proven`.

Root guarantees that materially depended on independence must be selectively requalified; unrelated guarantees need not be globally invalidated.

### 3.8 Correlation is temporal and scoped

Two witnesses may be independent before a merger, correlated during shared hosting, and independent again after separation. A timeless `independent=true/false` loses material semantics.

`Witness independence at T1 != witness independence at T2`.

The relevant assurance input is a qualified failure-domain relation over an interval/profile, not permanent organizational identity.

### 3.9 Observation-domain churn can reduce coverage without proving equivocation

Witness disappearance, network partition, loss of a region or retirement of a monitoring operator can reduce non-equivocation coverage even when no conflicting view has been observed.

`Observer disappeared != fork detected`.

`Coverage reduced != view invalid`.

The correct disposition may degrade from `UNCONTESTED_WITHIN_COVERAGE` to a weaker/expired/unknown coverage claim rather than to `CONTESTED`.

### 3.10 More witnesses do not monotonically mean stronger assurance

Adding witnesses can increase observation diversity, but can also add correlated operators, weaker keys, privacy-visible endpoints or a common upstream dependency. Assurance remains a vector/partial order.

`Larger witness set != universally stronger witness profile`.

Qualification depends on the protected failure assumptions, not cardinality alone.

### 3.11 Witness removal may be a security improvement or an assurance downgrade

Removing a compromised/correlated witness can strengthen future independence, while temporarily reducing quorum availability or observation coverage.

`Witness removed != assurance simply weaker`.

The transition can improve one dimension and degrade another; consumers evaluate the dimensions material to their operation.

### 3.12 A witness-set change cannot silently reset the conflict frontier

If W1 observed branch A and W2 later begins from branch B without proving consistency/recovery from the retained domain frontier, rotation could launder a split view.

`New witness set != clean-slate history`.

A successor observation policy must anchor to a retained checkpoint/conflict frontier or explicit recovery witness sufficient for the domain's continuity rule.

### 3.13 Bootstrap of a new witness is itself a trust event

A new witness starting from `latest` without a qualified prior checkpoint can only prove consistency from its bootstrap point forward. It cannot retroactively attest that earlier history was non-equivocating.

`Witness joined at frontier F != witness observed history before F`.

Coverage claims therefore need temporal bounds and bootstrap provenance.

### 3.14 Witness overlap is useful only if the overlap crosses failure domains

An overlap period between W1 and W2 can preserve continuity, but only if there is qualified evidence linking the old and new observation policies to the same domain frontier. Merely running both sets at the same time does not prove independent continuity when both consume one compromised source.

`Temporal overlap != independent continuity proof`.

### 3.15 Verifier-policy rollout must represent partial deployment explicitly

During staged rollout, some runtimes may still enforce P1 while others enforce transitional P1/P2 or target P2. That version skew is expected operationally and must remain representable.

`Different verifier policy generation != automatic domain fork`.

However, the effective assurance of a proof depends on the policy generation actually used by the verifier, not on the policy the control plane intended to deploy.

### 3.16 Policy ACK is not effective witness-policy convergence

A runtime acknowledging receipt of a new witness policy does not prove it has durably activated it, preserved the required old frontier, or used it for a protected effect.

`Witness-policy ACK != effective verifier state`.

This is a specialized instance of the G4 `Provider ACK != effective state` rule.

### 3.17 Offline runtimes need transition closure, not permanent old-witness authority

An offline runtime may continue using W1-qualified checkpoints only within its declared currentness/non-equivocation horizon. To cross a W1 -> W2 transition after reconnection, it needs enough transition evidence to validate continuity from its retained frontier.

`Offline possession of W1 keys != permission to trust W1 forever`.

The Builder or central Exchange Plane need not be online if the necessary transition closure is locally available.

### 3.18 Root-style dual authorization is a useful pattern, not a universal mandate

TUF demonstrates a mature trust transition in which successor root metadata is authorized under both old and new root thresholds, allowing clients to advance from their existing trusted state without trusting an unlinked new root.

The implementation-independent lesson is:

`Successor trust profile should be linked from currently trusted state when continuity is claimed`.

G4 does not require TUF or dual signatures for every witness transition; the exact proof depends on the profile and failure model.

### 3.19 Compromise time matters for retrospective witness qualification

If witness W is compromised, historical observations before the qualified compromise interval may remain usable while later ones degrade. A blanket `W revoked` bit can destroy useful history or preserve unsafe history.

`Witness revoked now != every historical observation untrustworthy`.

`Compromise discovered now != compromise began now`.

Unknown compromise start yields `UNRESOLVED/CONTESTED` assurance where the protected claim depends on W.

### 3.20 Serving topology changes do not imply observation-identity changes

A witness URL can change without changing the witness key/policy identity; Google's witness policy treats URL changes as log-side operational changes that need not alter verifier identity. Conversely, the same URL can serve a different key/profile.

`Endpoint changed != witness identity changed`.

`Endpoint stable != witness semantics stable`.

Routing remains operational metadata unless the contract explicitly makes it semantic.

### 3.21 Distributor/mirror migration cannot manufacture observation diversity

Moving checkpoint distribution to a new CDN, mirror or distributor improves availability but does not create a new independent witness if it republishes the same cosignatures.

`New distributor != new observer`.

The Exchange Plane may distribute witness evidence without becoming one of the witnesses or the authority that defines truth.

### 3.22 Privacy can regress during witness-set churn

A transition may introduce a witness/operator with a unique endpoint, rare cohort, callback pattern or new metadata that makes previously minimized status domains linkable.

`Non-equivocation continuity preserved != privacy profile preserved`.

Witness-policy migration must therefore requalify privacy/correlation assumptions as well as consistency coverage.

### 3.23 Conflict settlement and witness-policy settlement are independent

After a fork, authority may choose/fence a future branch while witness-policy migration is still incomplete; or witnesses may rotate cleanly while the business/status conflict remains unresolved.

`Witness-policy converged != business conflict settled`.

`Business recovery selected != all verifiers migrated`.

Recovery evidence and observation-policy evidence remain distinct dimensions.

### 3.24 No witness-set controller becomes global business authority

A controller may reconcile desired/observed witness policy, distribute keys/profiles and report rollout state. It cannot infer business truth from policy convergence or select the semantic winner of a fork.

`Witness-policy controller != status-domain authority`.

This preserves the Capability Exchange Plane boundary: exchange/evidence semantics may be shared; business semantics and canonical ownership remain capability-local.

## 4. Candidate research vocabulary

Research vocabulary only; no schema or implementation is authorized.

- `WitnessPolicyProfileRef` — immutable identity of witness qualification/quorum/failure-domain semantics for a bounded observation domain.
- `WitnessPolicyGeneration` — ordered transition identity within one witness-policy lineage; not a global platform generation.
- `WitnessKeyContinuityRef` — evidence that a successor witness key legitimately continues a witness role under a named profile.
- `WitnessQualificationInterval` — interval/profile over which a witness/key/failure-domain qualification is claimed.
- `ObservationCoverageRef` — evidence describing which observation domains/failure assumptions a checkpoint was exposed to; not proof of business correctness.
- `WitnessPolicyTransitionRef` — evidence linking predecessor and successor witness-policy profiles and their bounded overlap/cutover semantics.
- `WitnessBootstrapFrontier` — earliest qualified checkpoint/frontier from which a witness can claim observed continuity.
- `CorrelationRevisionRef` — evidence that previously assumed witness independence/failure-domain relations were revised, including effective/known intervals where available.
- `HistoricalWitnessQualificationRef` — closure sufficient to verify why a retired witness was qualified for a historical checkpoint without re-authorizing it for current observations.
- `ObservationPolicyDisposition` — qualified state such as `CURRENT`, `TRANSITIONING`, `DEGRADED_COVERAGE`, `CONTESTED`, `UNKNOWN`, `CURRENTNESS_EXPIRED`, `HISTORICAL_ONLY`.

## 5. Candidate proof obligations

1. Every witness/cosignature claim binds the immutable witness-policy/profile under which it was qualified.
2. Retired witnesses may remain historically verifiable without retaining authority for new checkpoints.
3. Witness-policy transition and observed-domain semantic/recovery transition remain separate state machines.
4. Transition overlap is bounded by explicit phase/currentness rules and never becomes permanent permission union.
5. A successor witness key cannot inherit identity/qualification solely because it is valid or served from the same endpoint.
6. Witness-key, witness-policy-root and observed-authority rotations remain separately represented where material.
7. Historical verification retains enough policy/key/time context to qualify old witness observations after retirement.
8. Retrospective discovery of correlated failure domains selectively downgrades dependent assurance without rewriting historical checkpoint existence.
9. Witness independence/failure-domain relations are time/profile scoped rather than timeless booleans.
10. Loss of observation coverage is represented separately from positive equivocation evidence.
11. Witness-set cardinality is never treated as a universal assurance scalar.
12. Removal of a compromised/correlated witness can improve some assurance dimensions while degrading availability/coverage; the vector remains explicit.
13. A witness-policy rotation cannot reset or bypass an already retained conflict/security frontier.
14. A new witness cannot claim non-equivocation coverage before its qualified bootstrap frontier without independent historical evidence.
15. Transition overlap counts toward continuity only under declared failure-domain/coverage assumptions.
16. Verifier policy generation/version skew remains explicit and does not by itself imply a status-domain fork.
17. Policy distribution/ACK does not prove durable activation, frontier preservation or protected-effect use.
18. Offline runtimes can validate permitted transitions from locally retained closure, but old witness authority expires according to declared horizons.
19. Claimed trust continuity from predecessor to successor is backed by explicit transition evidence; unlinked replacement is treated as a new/unresolved trust domain.
20. Witness compromise/revocation preserves compromise-time uncertainty and historical qualification intervals rather than applying a timeless boolean.
21. Endpoint/distributor/mirror changes cannot fabricate witness identity or observation independence.
22. Witness-policy migration requalifies privacy/correlation assumptions when topology/operator metadata changes.
23. Business conflict settlement and witness-policy convergence remain independently representable.
24. No witness-policy controller, distributor, gateway, monitor, quorum or Exchange Plane becomes canonical business owner by virtue of broader observation.

## 6. Mandatory adversarial cases

1. W1 is removed and every old checkpoint it signed becomes unverifiable because clients retained only the current witness list.
2. W1 remains accepted forever after removal because historical verification and current admission use one trust set.
3. W1 key K1 rotates to K2; clients accept K2 solely because it appears at the old URL.
4. Attacker substitutes K2 at the same endpoint during rotation and fabricates continuity.
5. Log moves to W2 while old verifiers still require W1, causing availability failure.
6. Verifiers accept W2 before the log can produce W2 cosignatures, causing rollout failure.
7. Transitional `W1 OR W2` policy is never tightened and becomes permanent downgrade surface.
8. New W2 witnesses bootstrap from a forked latest checkpoint and thereby launder the fork as a fresh history.
9. W1 and W2 overlap in time but share one upstream/operator; overlap is falsely counted as independent continuity.
10. Three witnesses later prove to have shared one HSM/operator during interval T, but historical assurance remains labeled three-independent.
11. Retrospective correlation causes a global invalidation of unrelated proofs that never depended on witness independence.
12. Witness disappears; runtime converts reduced coverage directly to `CONTESTED` although no fork evidence exists.
13. Witness disappears; runtime keeps claiming unchanged non-equivocation coverage forever.
14. Witness-policy ACK is recorded before durable activation; protected effects execute under the old policy while telemetry reports convergence.
15. Offline runtime retains W1 forever and rejects every legitimate W2 transition after a long disconnection.
16. Offline runtime silently trusts W2 without a chain/transition from its retained W1 frontier.
17. Witness compromise discovered at T2 is applied from time zero, destroying valid historical evidence without basis.
18. Witness compromise discovered at T2 is assumed to begin exactly at T2, preserving potentially compromised earlier evidence.
19. New CDN/distributor is counted as a new independent witness although it only republishes old cosignatures.
20. Stable distributor URL is treated as witness identity while the signing key/profile changes underneath it.
21. Witness-set migration preserves consistency but introduces a unique per-tenant callback that destroys privacy.
22. Witness-policy convergence is treated as proof that the underlying business/status fork is settled.
23. Business recovery selects branch B, but old witness policy can still authorize branch A checkpoints for new effects.
24. Exchange Plane chooses the witness set with the most signatures as the business-semantic winner.

## 7. Portability and exit path

The implementation-independent contract should preserve enough information that witness/transparency mechanisms can be replaced without changing capability business ownership:

- immutable observation/witness policy identity and qualification semantics;
- retained domain/conflict frontier independent of serving endpoint;
- explicit predecessor/successor transition evidence;
- historical witness/key qualification intervals and compromise uncertainty;
- declared observer/failure-domain assumptions rather than vendor-specific quorum labels;
- privacy/correlation profile for observation and refresh topology;
- separation between checkpoint/continuity evidence and business status/effect truth.

A provider that cannot preserve a required dimension must declare a downgrade/incompatibility. An adapter may translate representation or protocol but cannot fabricate historical witness qualification, independence, non-equivocation coverage or business authority.

## 8. Deduplication against existing G4 research

This round does not reopen generic witness governance, transparency, split-brain recovery, trust-root rotation, profile negotiation, private revalidation or evidence compaction. The material delta is specifically:

`witness-set/key rotation × staged verifier-policy rollout × retrospective correlation × observation-coverage churn × offline continuity`.

The prior artifact established that independently valid cached views can equivocate. This round establishes how that assurance survives changes in the observer population and its trust/failure-domain assumptions.

## 9. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

The next highest-value gap is **observation-policy rollback/recovery after partial witness-policy rollout**: how to recover when some runtimes advanced to P2, others remain on P1, the P2 witness set is later found compromised/correlated, and the observed status domain itself may have progressed meanwhile. Research should distinguish safe verifier-policy rollback from security-floor rollback, preserve historical P2 observations without continuing P2 authority, and avoid forcing a global stop-the-world barrier across autonomous runtimes.

## 10. Source pointers

- RFC 9162 — Certificate Transparency Version 2.0: https://www.rfc-editor.org/rfc/rfc9162.html
- RFC 9943 — SCITT Architecture: https://www.rfc-editor.org/rfc/rfc9943.html
- The Update Framework Specification: https://theupdateframework.github.io/specification/latest/
- Sigstore threat model: https://docs.sigstore.dev/about/threat-model/
- Sigstore Rekor sharding: https://docs.sigstore.dev/logging/sharding/
- transparency.dev witness: https://github.com/transparency-dev/witness
- Google transparency-log witness policy repository: https://github.com/google/google-tlog-witness
- transparency.dev distributor: https://github.com/transparency-dev/distributor
