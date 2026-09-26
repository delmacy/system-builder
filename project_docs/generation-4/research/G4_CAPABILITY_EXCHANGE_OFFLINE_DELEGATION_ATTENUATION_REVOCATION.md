# G4 Capability Exchange — Offline Delegation-Chain Attenuation and Revocation

Date: 2026-09-21
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Generation 4 product R&D only
Implementation authority: NONE

## 1. Research question

This consolidation continues `G4_CAPABILITY_EXCHANGE_EFFECT_CAPABILITY_ENVELOPE_PRIVILEGE_DRIFT.md` and specializes prior cross-domain floor/delegated-revocation research:

> How can an autonomous runtime prove that a transitive delegated capability remains no stronger than its legitimate source and remains admissible when issuer/delegator currentness may be temporarily unavailable — including chain truncation, audience/scope translation, heterogeneous provider permission models, break-glass delegation and rejoin reconciliation — without making a central STS/IAM service mandatory for every protected effect?

Constitutional boundaries remain unchanged:

- `G3 semantic decision != G4 technology binding`;
- `Research candidate != implementation authority`;
- `Builder != Runtime`;
- `Shared primitives != shared business ownership`;
- `Logical Exchange Plane != single broker`;
- `Exchange Plane owns exchange semantics; capability owns business semantics`;
- `delegation != impersonation`;
- `offline verification != current authorization`;
- `cryptographic validity != current admissibility`;
- `attenuation proof != revocation proof`;
- `delegation chain present != delegation chain authorized`.

## 2. Evidence base

Primary standards, papers and mature-system documentation reviewed:

1. **RFC 8693 — OAuth 2.0 Token Exchange.** Distinguishes delegation from impersonation, supports subject/actor representation, target `resource`/`audience`, requested scope and nested `act` history. Importantly, prior nested actors are informational for access-control decisions; the consumer must not infer current authority merely from historical actor-chain presence. <https://www.rfc-editor.org/rfc/rfc8693.html>
2. **RFC 7662 — OAuth 2.0 Token Introspection.** `active` is a current authorization-server appraisal that can incorporate expiry and revocation. Caching improves availability/performance at the explicit cost of liveness/currentness, creating a window in which revoked credentials can remain locally accepted. <https://www.rfc-editor.org/rfc/rfc7662.html>
3. **RFC 5280 — Internet X.509 PKI / CRL Profile.** CRL-based revocation is distributed and therefore has publication/observation latency; online status can reduce latency but introduces an online trusted dependency. This is mature evidence that offline validation and immediate revocation are competing guarantees unless another bounded mechanism exists. <https://www.rfc-editor.org/rfc/rfc5280.html>
4. **Macaroons: Cookies with Contextual Caveats for Decentralized Authorization in the Cloud (NDSS 2014).** Demonstrates decentralized delegation with cryptographically chained caveats that attenuate where/when/by whom/for what purpose a credential is usable. This is evidence that attenuation can be locally verifiable without contacting the original issuer for every hop. <https://research.google/pubs/macaroons-cookies-with-contextual-caveats-for-decentralized-authorization-in-the-cloud/>
5. **Eclipse Biscuit specification.** Demonstrates append-only offline attenuation: holders may append checks/restrictions but cannot remove prior blocks without invalidating the cryptographic chain. It also exposes unique revocation identifiers and versioned semantic blocks, showing that offline attenuation and revocation/currentness remain separate mechanisms. <https://doc.biscuitsec.org/reference/specifications.html>
6. **SPIFFE Federation specification.** Foreign trust bundles remain trust-domain qualified and are periodically refreshed; keys may be added/removed, and failed refreshes are retried rather than magically becoming current. This is evidence for local trust continuity with explicit refresh/currentness semantics rather than federation collapsing authority domains. <https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/>
7. **The Update Framework specification.** Uses locally persisted trusted metadata, monotonic version checks and expiration to resist rollback/freeze while permitting offline verification between refreshes. TUF also supports bounded trust delegation. The transferable lesson is that locally durable trust state plus explicit expiry/floors can preserve autonomy without claiming indefinite currentness. <https://theupdateframework.github.io/specification/latest/>
8. Existing G4 artifacts on hierarchical rights, cross-domain floors/delegated revocation, offline security floors, effect-capability envelopes, multi-domain invalidation, evidence caching, revocation storms, policy lifecycle, split-brain/rejoin and complete mediation.

These are benchmarks and failure evidence only. No OAuth/JWT profile, Macaroon, Biscuit, X.509/CRL/OCSP, SPIFFE/SPIRE, TUF, STS, IAM, policy engine or token format is selected.

## 3. Material delta

Prior G4 research already established that delegated authority cannot exceed legitimate upstream authority and that offline autonomy is bounded by security/currentness horizons. The missing synthesis is how those rules interact **along a transitive chain** when some authorities are temporarily unreachable.

This round proposes:

> A delegated capability is locally admissible only when the runtime can establish both (a) a qualified attenuation derivation from an admissible authority source to the current holder and (b) sufficient currentness/revocation closure for every material authority domain on which that derivation depends.

Therefore:

`attenuation chain valid != delegation currently admissible`.

and:

`delegation non-revoked at last contact != delegation non-revoked now`.

A candidate qualified object is:

`DelegationClosure = <root authority, lineage, hop transforms, attenuation predicates, semantic mappings, audiences/targets, tenant/classification, delegation depth, currentness dependencies, revocation dependencies, local floors, offline horizon, break-glass state, limitations>`.

The closure is evidence/projection. It is not canonical business authority.

## 4. Two independent proof questions: attenuation and admissibility

Delegation has at least two independent safety questions.

### 4.1 Attenuation question

Does each derived capability remain within the authority that the parent was legitimately allowed to delegate?

Conceptually:

`Child <= Delegable(Parent)`

for every hop under the semantics applicable to that hop.

### 4.2 Current admissibility question

Are the root authority, intermediate delegations, trust material, security/profile floors and revocation/currentness assumptions still admissible for the protected effect now?

A cryptographic chain can answer part of the first question while being stale for the second.

Candidate invariant:

`offline attenuation proof cannot manufacture online revocation knowledge`.

Conversely, a fresh revocation check does not prove that an adapter/provider translation preserved attenuation.

## 5. Attenuation is a partial order over named semantic dimensions

The previous effect-capability research established that `<=` is not a numeric ordering. This round makes the consequence explicit for chains.

Material dimensions can include:

- operation/effect set;
- resource/target set;
- audience;
- tenant/trust/classification scope;
- amount/quota/concurrency/rate;
- validity interval;
- delegation depth / further-delegation right;
- provider-specific conditions;
- required policy/security profile;
- effect-specific fencing/currentness predicates.

A child is attenuated only if every material dimension is preserved or narrowed, unless a separately qualified authority explicitly grants a new dimension.

Therefore:

`shorter lifetime + broader audience != attenuated`.

`fewer operation names + stronger provider semantics != necessarily attenuated`.

`same scope string across providers != same authority set`.

## 6. Offline attenuation is feasible; offline currentness is bounded

Macaroons and Biscuit provide mature evidence that a holder can add restrictions without contacting the original issuer. This supports an implementation-independent G4 property:

`delegation attenuation may be locally derivable and locally verifiable`.

However, RFC 7662, RFC 5280 and SPIFFE federation show the complementary limit: revocation/trust state changes elsewhere are not instantaneously knowable to a disconnected validator.

Therefore:

`offline-capable delegation != offline-omniscient delegation`.

For each protected effect, the contract needs a currentness disposition such as:

- locally valid until an explicit bounded horizon;
- requires online status for every new effect;
- permits continuation but not new irreversible effects while disconnected;
- permits only a narrowed offline subset;
- requires requalification/rebuild after the horizon or after continuity is lost.

These are research semantics, not prescribed enums.

## 7. The offline horizon is a guarantee property, not a token property

A token may expire in one hour while the business/security contract allows only five minutes of stale revocation knowledge for a high-impact effect. Conversely, a low-risk read may tolerate longer offline use.

Thus:

`credential expiry != revocation-currentness horizon`.

and:

`offline horizon follows protected guarantee, not credential format`.

A runtime can remain autonomous without claiming that every operation remains admissible for the same duration.

## 8. Chain currentness is not reducible to the leaf credential

For `A -> B -> C`, C's leaf credential may be non-expired while:

- A's trust key was removed;
- A revoked B's parent delegation;
- B lost sub-delegation authority;
- a policy/security floor advanced;
- the target provider changed permission semantics;
- an audience mapping became invalid.

Therefore:

`leaf current != chain current`.

A local `DelegationCurrentnessVectorRef` candidate retains the independent material domains/floors rather than collapsing them into one `validUntil` or global revision.

## 9. Parent revocation defeats descendants by lineage, not by notification fan-out

Biscuit's revocation identifiers illustrate a useful property: descendants can remain linked to revocable ancestry. G4 generalizes this without adopting Biscuit:

`parent delegation defeated -> descendants depending on that parent are defeated for future admission`.

Correctness should not require eagerly rewriting every descendant object. A local floor/revocation set, lineage witness or equivalent defeat predicate may invalidate a descendant at admission time.

This reuses prior G4 revocation-storm research:

`revocation propagation != synchronous descendant mutation`.

The notification path accelerates convergence; the admission rule provides safety.

## 10. Chain truncation must not erase defeating ancestors

For compactness/privacy, systems may not wish to transmit every historical actor/delegator in full. RFC 8693 itself treats older nested actors as informational for access control, which demonstrates that actor history and authorization semantics are not the same object.

G4 therefore separates:

- **actor/history lineage**;
- **authority dependency lineage**;
- **revocation dependency lineage**.

A chain may be compacted only if the retained representation still answers every live safety question required by the protected effect.

Candidate invariant:

`lineage compacted != ancestor revocation dependency forgotten`.

A compacted child may carry commitments/refs/floors rather than full ancestor payloads, but if an ancestor can still defeat the child, that dependency must remain representable.

## 11. Chain privacy and chain safety are separate dimensions

Full delegation chains can expose organizational topology, user relationships or tenant activity. Minimization is desirable, but:

`hidden ancestor != irrelevant ancestor`.

A privacy-preserving proof may establish an attenuation predicate or membership in an admissible issuer set without revealing the entire chain. But it cannot claim current revocation knowledge beyond its evidence horizon.

This reuses prior G4 opaque/non-dependency and privacy-preserving evidence rules: proof minimization cannot strengthen semantic coverage.

## 12. Heterogeneous provider permission models require qualified semantic mapping

A common chain can cross providers whose permission models differ:

`Capability A scope -> adapter -> Provider B role -> Provider C resource action`.

String equality is meaningless when the semantic sets differ.

The adapter/driver may provide a qualified `DelegationSemanticMappingRef` showing which source rights map to which target rights and whether the mapping is lossless, narrowing, broader, partial or unknown.

Rules:

`protocol translation != authority translation`.

`syntactic scope subset != semantic attenuation`.

If target semantics cannot express a source restriction, the system must either:

- obtain explicit target-domain re-authorization under a declared weaker/different guarantee;
- add independent mediation that restores the missing constraint;
- reject the delegation as incompatible;
- retain `PARTIAL/UNKNOWN` rather than fabricate attenuation.

## 13. Re-authorization creates a new authority edge, not a fake attenuation hop

Sometimes a target domain intentionally grants rights that are not derivable by narrowing the source capability. That is legitimate only when explicit.

`source delegation -> target re-authorization` is semantically different from `source delegation -> attenuation`.

The former introduces a new authority root/edge with its own revocation/currentness domain. Treating it as attenuation would incorrectly imply that revoking the original source necessarily revokes the target grant, or that the target grant could not be broader.

Candidate rule:

`non-attenuating translation requires explicit authority transition`.

## 14. Break-glass delegation is a separate authority mode

Break-glass/recovery delegation frequently broadens rights precisely because ordinary authority is unavailable. It must not be hidden inside normal attenuation semantics.

A break-glass capability should carry, where material:

- emergency authority source;
- activation condition/evidence;
- bounded target/effect scope;
- short explicit horizon;
- non-delegability or explicitly bounded delegation depth;
- audit/provenance requirements;
- post-rejoin reconciliation obligation;
- termination/revocation rule.

Therefore:

`break-glass activation != parent attenuation`.

and:

`emergency authority != permanent authority-floor reset`.

A runtime may preserve autonomous emergency operation without turning an unavailable central issuer into a prerequisite, provided the emergency authority was locally pre-qualified and bounded.

## 15. Offline mode should prefer pre-qualified attenuation over authority minting

Where possible, a disconnected runtime should derive narrower rights from already qualified local authority rather than minting new broad authority whose legitimacy depends on an unreachable issuer.

Candidate preference:

`offline attenuation from qualified local root > offline authority expansion`.

This is not an implementation mandate. It is a safety ordering: narrowing an already qualified right has a smaller proof burden than expanding it.

Any offline authority expansion requires a distinct locally rooted authority contract (for example, emergency/recovery authority), not an assumption that autonomy implies permission to mint.

## 16. Delegation depth is a security dimension

Unlimited sub-delegation increases the acquisition closure and makes revocation/reconciliation more expensive.

A parent can conceptually permit:

- no sub-delegation;
- bounded depth;
- sub-delegation only to named trust/tenant domains;
- sub-delegation only with strictly stronger caveats;
- explicit target re-authorization rather than continued delegation.

`holder can exercise != holder can sub-delegate`.

If delegation-depth evidence is absent or opaque, the closure remains `UNKNOWN/PARTIAL`; it is never inferred to be zero.

## 17. Rejoin is reconciliation, not retrospective rewriting

When connectivity returns, the runtime may learn that a parent delegation was revoked while it was offline.

The system must distinguish:

- effects legitimately admitted before the revocation became effective;
- effects admitted after effective revocation but before local observation under an explicitly tolerated stale window;
- effects outside the allowed offline horizon;
- queued obligations not yet committed;
- irreversible effects already committed;
- child delegations created while disconnected.

`revocation learned on rejoin != historical effects never occurred`.

and:

`offline stale acceptance != automatically legitimate current acceptance`.

Reconciliation may classify/remediate historical effects while immediately defeating future admissions. It must not erase provenance.

## 18. Effective time, observation time and effect time remain distinct

A revocation may have:

- issuer publication/effective time;
- distribution/availability time;
- runtime observation time;
- effect admission time;
- external effect commitment time.

These times can differ during partition.

No wall-clock comparison alone can invent a global order across independent domains. The contract must state whether the guarantee is based on issuer-effective semantics, locally observed monotonic floors, bounded stale allowance or another explicit rule.

This reuses the G4 multi-domain constraint model rather than creating a global clock.

## 19. Revocation freshness can be narrower than trust freshness

A runtime may still possess a cryptographically valid issuer key while lacking fresh revocation state for one delegation lineage.

Conversely, it may possess current revocation state but stale trust/profile semantics.

Therefore:

`trust root current != delegation status current`.

`delegation status current != policy/profile current`.

The `DelegationCurrentnessVectorRef` candidate keeps these claims independent.

## 20. Revocation availability and authorization availability are not the same SLA

An architecture may tolerate authorization issuance outages while requiring rapid revocation visibility for sensitive effects, or vice versa.

This means a central STS/IAM service need not be on every effect path. A runtime can verify pre-issued/delegated authority locally while periodically refreshing the specific currentness material its contract requires.

Candidate boundary:

`local authorization evaluation != local authority invention`.

This preserves autonomous runtime operation without turning the Exchange Plane into an online PDP/STS oracle.

## 21. Provider-specific revocation mechanisms cannot define canonical semantics

Providers may implement revocation through token introspection, CRLs, key rotation, session invalidation, role versioning, object deletion, deny lists or short expiry.

G4 should retain implementation-independent claims:

- what lineage/scope can be defeated;
- who owns revocation authority;
- when defeat becomes effective under the contract;
- what evidence demonstrates currentness;
- what stale horizon is allowed;
- what descendants are affected;
- what happens after continuity loss.

The driver maps provider mechanisms into these qualified claims. It may report unsupported semantics; it cannot fabricate immediate revocation from expiry-only infrastructure.

## 22. Failure to refresh is not evidence of non-revocation

RFC 5280, RFC 7662 and SPIFFE federation all expose versions of the same operational fact: status/trust refresh can fail.

Therefore:

`refresh unavailable != still valid`.

The correct result depends on the declared offline contract:

- continue within bounded horizon;
- narrow operations/effects;
- enter degraded/read-only mode;
- require online requalification;
- become `UNKNOWN/EXPIRED/BELOW_FLOOR`.

Transport failure must never be converted to false success.

## 23. Rollback-resistant local state is part of offline safety

TUF demonstrates a mature pattern: persist trusted versions and reject rollback/freeze rather than accepting older but correctly signed metadata.

G4 generalizes:

`older valid delegation/revocation state != permission to roll back local floor`.

An autonomous runtime must not restore an older snapshot and thereby resurrect delegation authority it had already observed as defeated or below a security/profile floor.

This links delegation closure to existing G4 golden-recovery, compaction and monotonic-floor research.

## 24. Delegation-chain change triggers

A locally cached delegation closure requires requalification when any material dependency changes, including:

- parent delegation revoked/superseded;
- root issuer/trust key removed or floor advanced;
- parent delegable scope narrowed;
- sub-delegation policy/depth changed;
- audience/target binding changed;
- provider permission semantics changed;
- semantic mapping/adapter revision changed;
- tenant/classification mapping changed;
- emergency/break-glass authority activated or terminated;
- currentness horizon expired;
- persisted monotonic floor advanced;
- chain compaction format loses required defeating lineage;
- recovery restores older authority state;
- target capability changes the guarantee required for the protected effect.

`leaf token unchanged != delegation closure unchanged`.

## 25. Candidate vocabulary

Research vocabulary only:

- `DelegationClosureRef` — qualified attenuation + currentness closure for a delegated protected effect.
- `DelegationHopRef` — one authority transfer/attenuation step.
- `DelegationAttenuationProofRef` — evidence that a child remains within the parent's delegable authority across material dimensions.
- `DelegationCurrentnessVectorRef` — domain-qualified trust/revocation/policy/provider currentness dependencies.
- `DelegationRevocationDependencyRef` — ancestor/domain fact capable of defeating the delegated capability.
- `DelegationSemanticMappingRef` — qualified mapping across heterogeneous permission models.
- `DelegationDepthConstraintRef` — whether/how far further delegation is permitted.
- `DelegationOfflineHorizonRef` — guarantee-scoped stale/currentness limit for offline use.
- `DelegationReauthorizationRef` — explicit new target-domain authority edge, distinct from attenuation.
- `DelegationBreakGlassRef` — bounded emergency authority lineage and lifecycle.
- `DelegationCompactionRef` — compact representation preserving live defeat/currentness questions.
- `DelegationRejoinDispositionRef` — classification of offline delegations/effects after current authority state is reacquired.
- `DelegationChangeTriggerRef` — material dependency requiring closure requalification.

These are structural research refs, not shared business entities or implementation commitments.

## 26. Candidate proof obligations

1. **PO-ODAR-01 — Root legitimacy:** every delegated closure identifies an admissible root authority or explicit target-domain re-authorization.
2. **PO-ODAR-02 — Hop attenuation:** each attenuation hop proves `child <= delegable(parent)` across every material semantic dimension.
3. **PO-ODAR-03 — No synthetic total order:** attenuation is a qualified partial order, not a scalar rank.
4. **PO-ODAR-04 — No silent widening:** any broadened dimension requires independent explicit authority rather than being mislabeled attenuation.
5. **PO-ODAR-05 — Delegation depth:** sub-delegation authority/depth is explicit; exercise authority alone never implies sub-delegation.
6. **PO-ODAR-06 — Audience/target preservation:** translation never broadens accepted targets without explicit authority.
7. **PO-ODAR-07 — Tenant/classification preservation:** restrictions survive every hop or incompatibility/lossiness remains visible.
8. **PO-ODAR-08 — Semantic mapping qualification:** heterogeneous provider permission models require qualified mapping; string/schema similarity is insufficient.
9. **PO-ODAR-09 — Attenuation/currentness separation:** cryptographic/local attenuation proof never substitutes for revocation/currentness evidence.
10. **PO-ODAR-10 — Chain currentness:** leaf validity cannot hide stale/defeated material ancestors.
11. **PO-ODAR-11 — Domain-qualified currentness:** trust, revocation, policy/profile and provider-semantic horizons remain independently representable.
12. **PO-ODAR-12 — Bounded offline use:** offline delegation is permitted only within the protected guarantee's declared horizon/mode.
13. **PO-ODAR-13 — Failure-safe unknown:** unavailable refresh beyond the permitted horizon yields explicit degraded/unknown/inadmissible state, never false non-revocation.
14. **PO-ODAR-14 — Monotonic local floor:** restore/cache refresh cannot roll back a higher locally observed defeat/security/profile floor.
15. **PO-ODAR-15 — Parent defeat:** revocation/defeat of a material parent invalidates dependent descendants for future admission without requiring synchronous descendant mutation.
16. **PO-ODAR-16 — Compaction safety:** chain compaction preserves every ancestor/dependency capable of defeating live authority, directly or through a qualified commitment/ref.
17. **PO-ODAR-17 — History/current authority separation:** actor/delegation history is not itself current access-control authority.
18. **PO-ODAR-18 — Re-authorization identity:** non-attenuating target grants are modeled as new authority edges with independent revocation/currentness.
19. **PO-ODAR-19 — Break-glass separation:** emergency authority is explicit, bounded and cannot silently reset ordinary security floors.
20. **PO-ODAR-20 — Rejoin classification:** effects/delegations created while disconnected are reconciled without erasing historical facts or automatically legitimizing stale admissions.
21. **PO-ODAR-21 — Retry/queue lineage:** queued/retried work preserves the original delegation lineage and requalifies current effect authority where required.
22. **PO-ODAR-22 — Provider honesty:** drivers/adapters report unsupported revocation/attenuation semantics instead of fabricating equivalence.
23. **PO-ODAR-23 — No central semantic oracle:** autonomous runtimes can evaluate locally sufficient delegation closure within declared horizons without Builder/Exchange Plane/STS availability.
24. **PO-ODAR-24 — Portability:** replacing token/IAM/provider technology preserves the structural attenuation, currentness, revocation and lineage semantics.

## 27. Adversarial cases

1. A->B->C is cryptographically valid, but B never possessed sub-delegation authority.
2. Child token expires sooner but broadens audience and is incorrectly called attenuated.
3. Source `read` maps to a provider role that also permits mutation; adapter reports lossless attenuation.
4. Parent delegation is revoked while offline; non-expired child continues irreversible effects indefinitely.
5. Runtime can verify signatures locally and treats that as fresh revocation knowledge.
6. Introspection outage is converted into `active=true` instead of bounded stale/unknown behavior.
7. CRL/trust-bundle refresh fails and stale status is treated as current forever.
8. Leaf credential is current but ancestor issuer key has crossed the local trust floor.
9. Chain compaction drops an ancestor revocation identifier still capable of defeating the leaf.
10. Privacy redaction hides a parent and middleware interprets hidden as irrelevant.
11. Nested actor history is treated as authorization from every historical actor.
12. Token exchange preserves `scope` text while silently changing resource/audience semantics.
13. Provider A and provider B use the same role name with different effect rights; string equality is treated as attenuation proof.
14. Target-domain re-authorization is mislabeled attenuation, causing source revocation to be incorrectly assumed to revoke the target grant.
15. Target-domain re-authorization is broader than source authority but hidden behind an adapter.
16. Break-glass mode mints permanent broad child authority and never terminates it after rejoin.
17. Emergency authority is inferred from runtime autonomy rather than pre-qualified local authority.
18. Disconnected runtime creates unlimited sub-delegations because delegation depth was omitted.
19. Parent revocation notification is missed; no local admission-time defeat rule exists.
20. Revocation is learned on rejoin and historical external effects are deleted from provenance as if they never happened.
21. Rejoin treats every offline effect as valid merely because it occurred within token expiry.
22. Recovery restores an older delegation/revocation snapshot and resurrects authority below an already observed floor.
23. Provider changes permission semantics under an unchanged token/scope; cached attenuation proof is reused.
24. Adapter version changes semantic mapping but leaf token hash remains unchanged, so no requalification occurs.
25. Tenant restriction is lost during token exchange but actor/subject lineage remains intact, hiding cross-tenant widening.
26. Offline mode permits reads and irreversible writes under the same stale-currentness horizon without contract justification.
27. STS is removed from the effect path for autonomy, but the runtime has no local trust/revocation closure and silently accepts anything signed by an old key.
28. Exchange Plane becomes mandatory online revocation oracle, violating declared autonomous-runtime topology even though locally sufficient bounded evidence could have been used.

## 28. Trade-offs

### 28.1 Immediate revocation vs autonomous availability

Immediate revocation generally requires an online/current distribution path or an effect-local mechanism capable of enforcing a newer floor. Offline verification improves availability but necessarily admits a bounded stale-information problem unless the right is structurally incapable of the sensitive effect.

The product architecture must expose this trade-off rather than advertise both guarantees without qualification.

### 28.2 Full lineage vs privacy/size

Full chains maximize diagnosability and selective revocation but expose topology/relationships and increase payload/storage cost. Compaction/privacy proofs may reduce disclosure only if live revocation/currentness dependencies remain answerable.

### 28.3 Fine-grained revocation vs operational state

Per-delegation revocation narrows blast radius but increases state/distribution cost. Coarser issuer/key/floor revocation is operationally simpler but invalidates more authority. G4 should model the semantic scope and let future providers qualify the mechanism.

### 28.4 Offline attenuation vs semantic translation burden

Cryptographic attenuation can be elegant inside one permission model. Cross-provider chains require semantic mapping; the hard problem shifts from signature verification to proving that target rights are no broader than source rights.

### 28.5 Short horizons vs disconnected usability

Short stale-currentness horizons improve revocation responsiveness but reduce autonomous availability during partitions. The correct horizon is effect/guarantee-specific, not a platform-wide constant.

## 29. Portability / exit path

The hypothesis does not require OAuth/JWT, Macaroons, Biscuit, X.509, SPIFFE, TUF, cloud IAM, a central STS, a service mesh, a broker or a shared policy database.

Any future realization must preserve:

- root/delegator/actor/holder distinctions where material;
- attenuation across named semantic dimensions;
- explicit sub-delegation depth/authority;
- audience/resource/tenant/classification constraints;
- provider-semantic mapping qualification;
- independent revocation/currentness dependencies;
- bounded offline horizons;
- monotonic locally observed floors;
- lineage sufficient for descendant defeat;
- explicit re-authorization when attenuation cannot express the transition;
- emergency/break-glass authority as a separate bounded mode;
- rejoin reconciliation without historical erasure;
- autonomous local evaluation when locally sufficient evidence exists.

## 30. Deduplication against existing G4 research

This document does **not** reopen:

- generic effect-capability envelope discovery/minimization;
- cross-domain floor composition generally;
- generic token/credential provider selection;
- authorization-aware data access;
- offline security floors generally;
- revocation-storm fan-out;
- evidence compaction generally;
- split-brain/rejoin generally;
- privacy-preserving evidence generally;
- complete-mediation path discovery.

The material delta is specifically:

`effect-capability envelope -> transitive delegation closure -> multidimensional attenuation proof + independent currentness/revocation closure -> bounded offline use -> heterogeneous semantic mapping -> explicit re-authorization/break-glass -> rejoin reconciliation without central STS/IAM semantic authority`.

## 31. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This materially strengthens family 8 but does not saturate it.

Highest-value next gap:

> **delegation semantic mapping proof across heterogeneous permission models** — determine how to prove, cache and requalify that a source capability restriction is preserved when translated into target-provider roles/scopes/ACLs whose permission lattice is only partially known, dynamically extensible or opaque; include target API growth, deny/condition semantics, non-monotonic policies, lossy adapters and independent target re-authorization, without requiring one universal authorization language or making the adapter semantic authority.

## 32. Research posture

No implementation is authorized by this document. Any future adoption requires explicit planning authority, provider qualification and repository process.