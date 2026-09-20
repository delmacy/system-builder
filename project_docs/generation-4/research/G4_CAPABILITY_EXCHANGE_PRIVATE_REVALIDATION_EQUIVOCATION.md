# G4 — Private Revalidation Conflict and Equivocation across Independently Cached Views

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can autonomous runtimes detect, preserve and reconcile conflicting yet individually valid status/floor/revalidation views without disclosing hidden dependency identity, without requiring an always-online global status oracle, and without treating a transparency log, witness quorum, broker or Exchange Plane as business authority?

This document extends the existing G4 work on private selective revalidation, distributed guarantee-evidence caching, privacy-preserving evidence federation, witness governance, cross-domain floors, split-brain authority rejoin and assurance-proof minimization. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, mature architectures and papers reviewed:

- RFC 6962, Certificate Transparency: append-only Merkle logs, signed tree heads, consistency proofs, monitor/auditor roles, split-view detection through comparison/gossip, and privacy-preserving audit alternatives such as trusted auditors or batched proof requests.
- RFC 9943, SCITT Architecture (June 2026): transparency services, receipts, append-only/non-equivocating verifiable data structures, and the separation between transparent registration and the truth/legitimacy of issuer statements.
- Transparency.dev / Trillian verifiable-log documentation: locally retained golden checkpoints, efficient consistency proofs, split-view failure when isolated clients cannot compare checkpoints, and the distinction between log-operation verification and semantic verification of log entries.
- CONIKS (USENIX Security 2015): key-transparency design evidence for privacy-aware consistency/accountability in user-specific directory views.
- OPTIKS (USENIX Security 2024): practical key-transparency evidence showing that privacy, consistency and scalable operation must coexist with crash tolerance and account lifecycle concerns.
- TAP (USENIX Security 2023): explicit privacy/transparency tension in authenticated data structures and verifiable data services.
- Current IETF transparency/witness work was inspected as emerging evidence only; Internet-Drafts are not treated as standards or binding architecture.
- Existing G4 artifacts, especially `G4_CAPABILITY_EXCHANGE_PRIVATE_SELECTIVE_REVALIDATION.md`, `G4_CAPABILITY_EXCHANGE_WITNESS_GOVERNANCE_CORRELATED_COMPROMISE.md`, `G4_CAPABILITY_EXCHANGE_GUARANTEE_EVIDENCE_CACHE_INVALIDATION.md`, `G4_CAPABILITY_EXCHANGE_SPLIT_BRAIN_AUTHORITY_REJOIN.md`, `G4_CAPABILITY_EXCHANGE_ASSURANCE_PROOF_MINIMIZATION_PRIVACY.md`, and the privacy/evidence-federation research family.

These sources are architectural evidence only. No Certificate Transparency deployment, SCITT service, Trillian, CONIKS, OPTIKS, TAP, witness quorum, gossip protocol, transparency log, Merkle structure, broker or status provider is selected.

## 3. Material findings

### 3.1 Individually valid cached views can still be mutually incompatible

A runtime can hold a correctly signed/cached status view V1 while another runtime holds a correctly signed/cached V2. Signature validity, freshness within a local horizon and successful local verification do not prove that V1 and V2 belong to one compatible history.

`Locally valid view != globally uncontested view`.

The root question is therefore not merely whether each view verifies, but whether the views are mutually consistent under the named status/floor domain's evolution rule.

### 3.2 Consistency is a separate proof dimension from inclusion and authenticity

Transparency-log systems make this separation concrete: inclusion proves that an item belongs to a committed view; signatures authenticate a checkpoint; consistency proves that one checkpoint is a valid evolution of another.

`Included != consistent with another view`.

`Signed checkpoint != non-equivocation proof`.

A future G4 revalidation profile must not collapse origin, inclusion, continuity/non-equivocation and business admissibility into one `verified` boolean.

### 3.3 Non-equivocation evidence does not create business authority

RFC 9943 requires non-equivocation from the transparency substrate, but the transparency service registers statements; it does not thereby make issuer statements true or business-authoritative.

`Non-equivocating status transport != correct business status`.

A malicious or mistaken authority can publish one perfectly consistent history containing wrong claims. Exchange Plane/transparency machinery may prove consistency of exchange evidence; capability/business authority still decides the meaning and admissibility of the underlying status.

### 3.4 Conflict detection requires comparison across observation domains

A split view can remain internally consistent for each isolated runtime. Detection requires some crossing of observation boundaries: gossip, independent witnesses, monitors, mirrors, later reconciliation, or another mechanism that allows incompatible commitments to meet.

`No conflict observed locally != proof no conflicting view exists`.

This makes the observer/coverage model part of the assurance claim. A runtime cannot claim global non-equivocation merely because its own chain is consistent.

### 3.5 Comparison can preserve privacy when commitments are view-scoped rather than subject-scoped

RFC 6962 demonstrates that clients can compare signed tree heads/consistency commitments without revealing the exact certificate being checked. The implementation-independent lesson is that conflict detection can sometimes operate on a domain/view commitment rather than a subject-specific lookup.

`View consistency comparison != mandatory disclosure of hidden dependency identity`.

This is especially useful for private revalidation: the runtime may compare status-generation commitments while keeping the particular hidden premise local.

### 3.6 Privacy can still leak through view uniqueness and gossip topology

A commitment that is nominally subject-free can identify a tenant, rare cohort, provider or hidden dependency if its domain is too small or its refresh/gossip route is distinctive.

`Opaque checkpoint != anonymous checkpoint`.

Privacy analysis must include checkpoint scope, cohort size, witness set, endpoint, timing, cache behavior and peer topology.

### 3.7 A witness signature is evidence about a view, not an endorsement of business content

Witnessing/cosigning can make it harder for a status authority to maintain isolated forks, but a witness normally attests to a checkpoint/continuity rule, not to every business fact represented beneath it.

`Witness cosigned view != witness endorses every status claim`.

The witness role must therefore remain structurally separate from issuer/business authority and from consumer policy.

### 3.8 Witness quorum is only as independent as its failure domains

Prior G4 witness-governance research remains controlling: N signatures do not imply N independent observations when witnesses share operator, software, trust root, network vantage, administration or upstream source.

`Witness count != witness independence`.

A future non-equivocation assurance profile must declare correlated-failure assumptions rather than treating cardinality as a universal strength scalar.

### 3.9 Quorum disagreement is evidence, not majority truth

If witnesses or monitors present incompatible checkpoints, choosing the larger group is not a generic semantic resolution rule.

`Majority checkpoint != business-semantic winner`.

Disagreement establishes conflict/uncertainty under the witness profile. Authority-specific recovery rules decide how the status domain progresses; the Exchange Plane does not adjudicate by vote.

### 3.10 Conflict evidence must be monotonic against local rollback

Once a runtime has observed cryptographically incompatible views or a higher conflict/security floor, restart, failover, snapshot restore or cache refresh must not silently return it to `UNCONTESTED` using an older individually valid view.

`Conflict observed != conflict forgotten by rollback`.

Conflict/floor evidence requires durable local monotonic treatment until explicitly resolved/subsumed by qualified recovery evidence.

### 3.11 Conflict and staleness are independent dispositions

Two views may be compatible but one stale; two fresh views may conflict; a stale view may also be part of a known fork.

`STALE != CONFLICTED`.

`FRESH != UNCONTESTED`.

Revalidation needs separate currentness and consistency/equivocation dimensions rather than a single freshness bit.

### 3.12 Conflict evidence should defeat only materially dependent proofs

Discovery that status domain D equivocated does not invalidate every proof in the runtime. Derived proofs whose material cut sets do not depend on D remain unaffected.

`Domain fork detected != global proof invalidation`.

For dependent proofs, disposition depends on whether the root predicate needs current uncontested status, historical interpretation only, a qualified branch, or another explicit rule.

### 3.13 Hidden dependency privacy must survive conflict escalation

When D is hidden from the consumer, the runtime may need to disclose that a material hidden premise is `CONTESTED` without revealing which provider/subject/status slot caused it.

`Conflict disclosure != mandatory dependency disclosure`.

However, privacy cannot suppress a material defeat condition. An authorized audit/recovery path may use a deeper disclosure profile when required.

### 3.14 Conflict proofs themselves can become tracking handles

A stable fork identifier, witness receipt set or checkpoint hash reused across unrelated consumers can correlate otherwise minimized presentations.

`Conflict evidence identifier != privacy-neutral identifier`.

External presentations need correlation scoping/minimization just like ordinary revalidation handles. Internal durable evidence may be richer when needed for recovery/audit.

### 3.15 Gossip is an acceleration/detection mechanism, not an always-online correctness dependency

Autonomous runtimes may be offline or partitioned. Requiring live gossip before every operation would violate the declared autonomy model.

`No live gossip path != immediate proof of conflict`.

Operations may continue only within their pre-positioned evidence/currentness/non-equivocation horizon and invariant-specific degraded-mode policy. Expiry becomes explicit `UNKNOWN/CURRENTNESS_EXPIRED`, not fabricated safety.

### 3.16 Witnessed checkpoints can extend confidence horizons only under an explicit profile

A checkpoint seen by qualified independent witnesses may provide stronger evidence against isolated split views than a lone authority signature, but only for the exact checkpoint/domain/continuity semantics and witness assumptions.

`Witnessed != indefinitely current`.

`Witnessed != business-authorized`.

Witness evidence has its own currentness, qualification and trust lifecycle.

### 3.17 Transparency/log availability and semantic availability are distinct

A log can be unavailable while a locally cached qualified checkpoint remains usable within horizon. Conversely, a reachable log can publish a view that is below a local floor, conflicted or semantically inadmissible.

`Transparency service reachable != revalidation admissible`.

Infrastructure health does not become semantic authority.

### 3.18 Mirrors improve serving durability but do not create independent truth automatically

Replicating the same log/checkpoint across mirrors improves availability. It does not create independent authority if every mirror serves one operator's commitment.

`N mirrors != N independent witnesses`.

Durability, observation diversity and business authority remain separate dimensions.

### 3.19 Log/checkpoint key rotation must preserve continuity without creating a global identity oracle

A status/transparency domain may rotate signing keys. Consumers need evidence that a new checkpoint identity legitimately continues the old domain or explicitly starts a new one.

`New valid key != same continuity domain by assumption`.

`Same continuity domain != permission for cross-domain global identity`.

Continuity evidence remains domain-scoped and subject-independent where possible.

### 3.20 Compaction cannot erase the last evidence of equivocation

Once conflicting views were observed, ordinary cache eviction cannot discard the only evidence needed to prevent resurrection of the defeated/contested branch.

`Cache expiry != conflict settlement`.

Conflict evidence may be compacted only when a stronger recovery/fencing/frontier witness subsumes every live safety/recovery question.

### 3.21 Recovery chooses a qualified future, not a rewritten past

If authority later declares branch B authoritative and fences A, both historical observations remain facts.

`Recovery winner != losing view never existed`.

Derived historical effects produced under A remain subject to the existing G4 settlement/compensation rules; recovery cannot launder them into non-occurrence.

### 3.22 Provider substitution must preserve or explicitly downgrade non-equivocation semantics

Replacing a provider that offers independently checkable continuity with one that exposes only mutable latest-state queries changes the guarantee even if both return the same status schema.

`Same status interface != same equivocation resistance`.

Adapters/drivers must surface this downgrade or incompatibility; they may not synthesize missing consistency semantics.

### 3.23 No one transparency service or witness quorum may become a platform-wide oracle

Different capabilities/status domains may have different authorities, privacy requirements, retention rules and non-equivocation mechanisms.

`Shared non-equivocation primitive != shared business authority`.

The Exchange Plane may carry checkpoint/consistency/witness evidence and route reconciliation, but it does not own the canonical status of every capability.

### 3.24 Non-equivocation assurance is scoped by coverage and observer assumptions

A meaningful claim names at least the status domain, view/epoch, continuity rule, observer/witness assumptions, retained checkpoint/floor, currentness horizon and known conflict disposition.

`Consistent with my checkpoint != globally non-equivocating forever`.

This prevents a local consistency proof from being promoted into a stronger global claim than the evidence supports.

## 4. Candidate research vocabulary

Research vocabulary only; no product schema is authorized.

- `StatusViewCommitment` — commitment to a domain-qualified status/floor view without implying business correctness.
- `ConsistencyEvidenceRef` — evidence that two view commitments satisfy the domain's declared evolution relation.
- `EquivocationEvidenceRef` — evidence that two commitments cannot both belong to one admissible evolution under the declared rule.
- `ObservationDomainRef` — scope describing who/what observed a commitment and under which trust/privacy assumptions.
- `GoldenCheckpointRef` — locally durable accepted checkpoint used as a lower bound for future continuity checks; not global authority.
- `WitnessProfileRef` — immutable semantics/qualification assumptions for witnesses, including correlated-failure model.
- `WitnessObservationRef` — witness evidence for a specific commitment/continuity claim, not endorsement of business content.
- `NonEquivocationDisposition` — qualified state such as `UNCONTESTED_WITHIN_COVERAGE`, `CONTESTED`, `UNKNOWN`, `CURRENTNESS_EXPIRED`, `BELOW_RETENTION`, `RECOVERY_PENDING`.
- `ConflictFrontier` — monotonic local/domain-qualified frontier preventing rollback to a view already known to be contested.
- `RecoveryContinuityRef` — evidence that a post-conflict view legitimately continues or supersedes the contested domain under the domain authority's recovery semantics.

## 5. Candidate proof obligations

1. Local signature/inclusion validity is never represented as proof of cross-runtime non-equivocation.
2. Consistency/non-equivocation, authenticity, inclusion, currentness and business admissibility remain separate assurance dimensions.
3. Conflict detection can compare domain/view commitments without requiring disclosure of hidden subject/dependency identity when the selected mechanism supports it.
4. View/checkpoint commitments have explicit privacy/correlation scope; they do not become global tracking identifiers by convenience.
5. Absence of observed conflict is qualified by observer/coverage assumptions and is never represented as universal proof of no fork.
6. A witness attests only to the declared checkpoint/continuity semantics; witness participation does not imply endorsement of underlying business claims.
7. Witness independence is qualified by correlated-failure assumptions rather than signature count alone.
8. Witness/monitor disagreement produces qualified conflict evidence and is not resolved by generic majority voting.
9. Once a runtime observes qualified equivocation/conflict evidence, rollback/restart/cache restoration cannot silently restore `UNCONTESTED` state.
10. Currentness and equivocation state remain independent; fresh views may conflict and stale views may be uncontested only within bounded coverage.
11. Conflict in dependency domain D degrades only root proofs materially dependent on D under their declared cut sets.
12. Privacy minimization cannot suppress a material `CONTESTED/UNKNOWN/BELOW_RETENTION` disposition.
13. Conflict evidence exposed externally is minimized/scoped so it does not become a stable cross-domain correlation handle.
14. Offline operation does not require live gossip, but remains bounded by explicit non-equivocation/currentness horizons and operation-specific invariants.
15. Witnessed/checkpointed evidence has explicit qualification and expiry/retirement semantics and never implies indefinite currentness.
16. Log/mirror/service reachability is never treated as semantic/business admissibility.
17. Mirrors/replicas do not count as independent witnesses unless their failure/observation domains satisfy the declared witness profile.
18. Checkpoint/log key rotation has explicit continuity evidence; new key validity alone cannot fabricate continuity.
19. Conflict evidence is retained or compacted into a stronger recovery/fencing witness before deletion can permit branch resurrection.
20. Recovery preserves historical conflict/effect facts and cannot rewrite the losing branch out of audit/settlement history.
21. Provider substitution requalifies non-equivocation guarantees; adapters/drivers cannot fabricate missing consistency semantics.
22. No transparency service, witness quorum, monitor, gateway or Exchange Plane becomes canonical business-status owner merely by observing more views.
23. A non-equivocation claim names its domain, continuity rule, observation/witness assumptions, frontier/checkpoint and currentness horizon.
24. Autonomous client runtimes can retain enough local evidence closure to verify permitted status continuity while Builder/central services are unavailable.

## 6. Mandatory adversarial cases

1. Two runtimes receive different signed status snapshots that are each locally valid and fresh.
2. A status authority signs two divergent heads for different regions/tenants.
3. Both fork branches extend consistently for hours; isolated clients see no local failure.
4. A gateway maps both branches to `status=valid` and drops checkpoint identity.
5. A witness cosigns a checkpoint and consumers interpret that as endorsement of every business status beneath it.
6. Three witnesses share one operator/network/upstream and are counted as three independent votes.
7. Two witnesses disagree and the Exchange Plane chooses the majority branch as business truth.
8. Runtime observes a fork, restarts from an old snapshot and forgets the conflict.
9. One view is fresh-but-conflicted; another is stale-but-consistent; implementation reduces both to one boolean `valid`.
10. Conflict in provider A triggers global invalidation of proofs that do not depend on A.
11. Hidden dependency is revealed because conflict escalation sends provider-specific callbacks.
12. Stable fork/checkpoint ID links presentations across tenants.
13. Gossip endpoint timing reveals that a rare hidden dependency was revalidated.
14. Runtime stays offline beyond the non-equivocation/currentness horizon but continues irreversible effects to avoid contacting a witness.
15. Witness checkpoint is old but still signed; adapter reports it as current.
16. Transparency service is reachable and healthy but serves a view below the runtime's locally retained floor.
17. Five mirrors of one operator are treated as five independent witnesses.
18. Log signing key rotates and clients assume the new key belongs to the same continuity domain without transition evidence.
19. Cache eviction deletes the only fork evidence; losing branch later reappears through archive replay.
20. Recovery selects branch B and compaction deletes evidence that branch A produced an irreversible historical effect.
21. Provider migration moves from consistency proofs to mutable `GET /status/latest`; adapter preserves the same `verified=true` contract.
22. One platform-wide transparency log becomes mandatory for all capability status, making runtime autonomy and failure isolation depend on it.
23. Monitor reports no conflict because it observed only one network vantage; result is advertised as globally non-equivocating.
24. Broker outage prevents witness updates and timeout is converted into `UNCONTESTED` instead of `UNKNOWN/CURRENTNESS_EXPIRED`.

## 7. Transport/topology implications

- Direct/local calls can reuse locally cached view commitments, but local execution does not remove the need for explicit continuity/currentness semantics.
- RPC can fetch status/consistency evidence, but request/response reachability is not proof of non-equivocation.
- Brokers/streams can disseminate checkpoints and conflict notices, but redelivery/order do not create global consistency or authority.
- File/artifact exchange can carry immutable checkpoint/consistency bundles for offline runtimes; artifact availability does not imply currentness.
- Gateways may mediate trust zones and privacy-preserving routing, but must not adjudicate the winning business branch.
- Witnesses/monitors/mirrors are optional realization roles for particular profiles, not mandatory platform components.

Transport remains replaceable only when the promised authenticity, continuity/non-equivocation, privacy, currentness and offline-verifiability semantics survive substitution.

## 8. Portability / exit path

A portable non-equivocation/revalidation design should preserve, independent of provider:

- immutable status-domain/view identity and declared evolution semantics;
- locally durable accepted frontier/checkpoint;
- consistency or conflict evidence in a provider-exportable form where the profile promises independent verification;
- witness/observer qualification metadata and correlated-failure assumptions;
- explicit currentness/retention horizons;
- privacy/correlation scope of externally exchanged commitments;
- recovery/supersession evidence after a fork;
- historical conflict/effect evidence required by settlement/audit.

Provider exit must not require the old provider to remain online forever. If independent verification is not portable, that limitation is part of the contract rather than hidden behind an interface-compatible replacement.

## 9. Deduplication against existing G4 research

This round does not reopen generic revocation, caching, witness governance, split-brain recovery, transparency, privacy federation or proof minimization. The new material intersection is:

`independently cached private status views × equivocation detection × observer/witness coverage × offline autonomy × privacy-preserving conflict evidence`.

Existing conclusions remain authoritative: invalidation delivery is not omniscient; witness count does not imply independence; conflict evidence is not majority truth; Exchange Plane does not own business semantics; and privacy minimization cannot suppress material negative/contested evidence.

## 10. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

Material boundaries changed in this round: non-equivocation is now an explicit assurance dimension separate from authenticity/inclusion/currentness; observer coverage is part of the claim; conflict evidence is monotonic locally; privacy-preserving view comparison is possible in principle without subject disclosure; and witness/transparency mechanisms remain evidence infrastructure rather than business authority.

Next highest-value gap:

**conflict-aware non-equivocation recovery under witness-set rotation and observation-domain churn** — research how a runtime preserves confidence when witnesses/operators/network vantage sets rotate, disappear or become correlated after the fact; how historical checkpoints remain qualified without making old witnesses permanently authoritative; and how recovery from discovered witness compromise avoids either global invalidation or false continuity, especially across offline runtimes and provider migration.
