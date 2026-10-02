# G4 — Cross-Domain Floor Composition & Delegated Revocation Authority

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How should a root cross-capability guarantee compose independently governed monotonic security/currentness/profile floors and delegated authority/revocation chains without inventing a global revision, collapsing trust domains, or allowing a gateway/adapter/Exchange Plane to widen, suppress or fabricate authority?

This document extends the distributed evidence-cache and revocation-storm research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, mature-system evidence and prior G4 artifacts reviewed:

- RFC 8693 OAuth 2.0 Token Exchange: delegation vs impersonation, subject/actor separation, target resource/audience, scope/time constraints, and actor-chain representation.
- RFC 7519 JWT: issuer, subject, audience and expiration are independently meaningful claims; token acceptance is audience- and issuer-contextual.
- AWS IAM permissions boundaries, session policies and SCP interaction: boundaries limit maximum permissions rather than granting them; effective permission can be an intersection of independently applicable constraints, with explicit deny overriding allow.
- SPIFFE/SPIRE trust-domain and federation specifications: trust roots and identities remain trust-domain qualified; federation associates a foreign bundle with its declared domain; delegated identity is explicitly powerful impersonation authority and therefore a bounded trust decision.
- Google Zanzibar: authorization state is relation-based and authorization checks preserve causal/external-consistency properties rather than reducing policy to a single global scalar revision.
- OpenFGA agent/delegation guidance as mature implementation experience: an actor remains a first-class principal and delegated access can be separately scoped/revoked rather than copying the delegator's entire identity.
- Prior G4 research on hierarchical rights, offline security floors, evidence minimization, multi-domain evidence composition, policy lifecycle, profile negotiation, derived evidence caching and revocation storms.

These are benchmarks and failure evidence, not technology selections.

## 3. Material findings

### 3.1 Independent floors compose as qualified constraints, not as a scalar maximum

A root operation may depend simultaneously on a tenant authorization floor, a trust-domain key floor, a capability-profile floor and a business-currentness floor. Their tokens may use different ordering rules and may not even be numerically comparable.

Therefore the root evidence must preserve a qualified vector/map of domain constraints or an equivalent commitment. It cannot compute `max(Fa,Fb,Fc)` unless one authority explicitly defines a shared ordered domain.

`Cross-domain floor composition != global revision`.

`Numerically larger token != semantically newer across domains`.

The root guarantee is admissible only when every material dependency claim satisfies the requirement declared for its own domain.

### 3.2 Delegation and impersonation are distinct authority semantics

RFC 8693 provides a useful boundary: delegation keeps the actor distinct from the represented subject; impersonation intentionally makes the actor indistinguishable from the subject within a bounded rights context. G4 should preserve this distinction in exchange evidence.

`Acts for principal != becomes principal`.

A gateway forwarding identity context is not thereby authorized to impersonate that identity. An adapter translating a protocol is not thereby delegated the source capability's business authority.

### 3.3 Delegation may attenuate authority but cannot amplify it

Mature IAM systems provide a strong precedent: a permissions boundary limits maximum authority and does not grant authority by itself; session policies further intersect/attenuate the underlying permissions. This suggests an implementation-independent law for G4 delegation chains:

`Effective delegated authority <= authority legitimately held and delegable by every required upstream constraint`.

A delegate may receive narrower scope, shorter lifetime, smaller audience/resource set, lower quota/effect rights or stronger conditions. It cannot mint a permission absent from the delegator's delegable set merely because it can produce a syntactically valid token/envelope.

`Delegation transform != authority creation`.

### 3.4 Revocation authority is itself scoped authority

Possessing authority to grant or exercise a right does not automatically imply authority to revoke every related right. Revocation may belong to the original issuer, a superior policy authority, the owner of a resource, or another explicitly named authority depending on the contract.

Candidate relation:

`RevocationAuthority(scope) is independently provable from ExerciseAuthority(scope)`.

A capability can delegate effect execution while retaining revocation authority. Conversely, it may delegate bounded sub-delegation/revocation for a child scope if the governing contract explicitly permits it.

`Can exercise != can delegate != can revoke != can widen`.

### 3.5 Revocation must target authority lineage, not transport topology

If A delegates a bounded right to B and B invokes C through gateway G, a later revocation of B's delegated right must invalidate the relevant lineage regardless of whether traffic now uses another gateway, broker, direct call or local optimization.

`Route identity != authority lineage identity`.

The Exchange Plane may carry issuer/delegator/actor/audience/scope/floor/revocation evidence. It does not become the issuer or revocation owner by transporting it.

### 3.6 Delegation chains need explicit attenuation and chain-validity rules

A chain `A -> B -> C` is not valid merely because every adjacent hop has a credential. The root contract must be able to establish that:

- A possessed and was allowed to delegate the relevant authority;
- B's delegated scope did not exceed A's delegable scope;
- B was allowed to sub-delegate if it delegated to C;
- C's target audience/resource/tenant/classification is within the permitted context;
- every material floor/currentness condition is satisfied;
- no applicable revocation/fencing evidence defeats the chain.

`Every hop authentic != chain authorized`.

RFC 8693's actor-chain representation is useful provenance, but historical actors alone do not define current authorization semantics; the consumer must apply the governing policy.

### 3.7 Audience/resource binding prevents confused-deputy widening

A credential/evidence item intended for capability C must not become authority for capability D merely because both understand the same schema or trust the same issuer.

`Issuer trusted != token/evidence valid for every audience`.

This applies beyond OAuth: an exchange envelope carrying delegated authority should preserve target capability/resource/operation scope when that scope is material. Adapter/gateway mediation may narrow or rebind only through an explicitly authorized exchange/translation step; it cannot silently broaden audience.

### 3.8 Cross-domain revocation has no universal propagation order

If trust domain T revokes a key while capability policy P simultaneously removes a permission, those facts may be learned in different orders by different runtimes. Safety cannot depend on a fabricated global timestamp order between T and P.

The runtime instead maintains each domain's monotonic locally observed floor and checks all material constraints before new effect admission.

`Independent revocations observed in different orders != permission to ignore either`.

A derived guarantee can be invalidated by advancement of any material domain even if other domain floors are unchanged.

### 3.9 Delegation lifetime and revocation currentness are independent

A short-lived delegated credential bounds exposure but does not prove that no earlier revocation exists. Conversely, a non-expired credential can be inadmissible because a revocation/security floor advanced.

`Not expired != not revoked`.

`Revocation check current != delegation scope valid`.

Offline operation therefore needs both a bounded credential/effect-right horizon and the claim-specific revocation/currentness rule already established by G4.

### 3.10 Federation does not collapse issuer or revocation domains

SPIFFE federation is a strong precedent for keeping foreign trust bundles associated with their trust-domain identity. A federation relationship allows validation across domains; it does not make one domain the issuer or revocation owner of identities in another domain.

`Federation trust != shared authority namespace`.

Likewise, the Shared Semantic Kernel may define structural refs for issuer, actor, audience, floor and evidence without centralizing the underlying authority.

### 3.11 Delegated identity APIs demonstrate why impersonation is a high-trust capability

SPIRE's Delegated Identity API explicitly allows an authorized delegate to obtain identities for other workloads and therefore impersonate them. The transferable lesson is not to adopt that API, but to treat impersonation/delegated credential issuance as a materially stronger capability than ordinary message forwarding or protocol adaptation.

`Can transport identity evidence != can mint identity evidence`.

A gateway/adapter/driver must never gain minting/impersonation authority merely because of its placement on the request path.

### 3.12 Authorization intersections are not permission unions

AWS IAM demonstrates that independently applicable boundaries/session policies can restrict effective permissions by intersection, with explicit deny able to dominate allow. G4 should not copy AWS policy semantics universally, but the failure lesson is strong:

`Multiple authorities involved != union of their allows`.

For a root contract that requires all named authority domains, missing/negative evidence from one cannot be compensated by a broader allow from another unless the contract explicitly defines an alternative-authority relation.

### 3.13 Alternative authorities require explicit substitution semantics

Some operations may legitimately accept authority from one of several issuers/providers. This is different from an all-of composition and must be explicit.

Candidate dependency forms remain implementation-independent:

- `ALL_OF(A,B,C)` for independently required constraints;
- `ANY_QUALIFIED_OF(A,B)` for declared alternative authorities;
- `THRESHOLD_QUALIFIED(...)` only where the contract defines quorum semantics;
- `DELEGATED_FROM(A, attenuation)` for lineage-preserving delegation.

These are research semantics, not schema or DSL decisions.

`Two signatures present != quorum`.

### 3.14 Revocation of a parent delegation does not require erasing history

If A revokes B's authority at floor F3, prior effects legitimately executed under F2 remain historical facts. The revocation prevents future admissions according to its effective semantics; it does not rewrite provenance or settlement history.

`Delegation revoked != historical effects never occurred`.

Queued/retry obligations admitted before revocation retain their original lineage and are classified under the negotiation/security/effect rules already established by G4 rather than silently becoming newly authorized or silently disappearing.

### 3.15 Exchange mediation may only narrow or explicitly re-authorize

An adapter can translate protocol or representation. A gateway can enforce a trust-zone boundary. The Exchange Plane can route/bind and carry policy context. None may silently convert an authority from one domain into a stronger authority in another.

Permitted classes are conceptually:

- lossless transport of authority evidence;
- attenuation/narrowing that is locally provable;
- explicit re-authorization by a target-domain authority;
- qualified lossy mediation that cannot claim equivalence.

`Protocol translation != authority translation`.

`Authority translation without target authorization != semantic equivalence`.

## 4. Candidate research vocabulary

Research vocabulary only; no schema or enum is authorized.

- `AuthorityDomainRef` — domain that owns interpretation of a named authority/floor.
- `IssuerRef` — authority that issued the relevant credential/evidence.
- `DelegatorRef` — principal/authority from which delegated rights descend.
- `ActorRef` — current acting principal, distinct from represented subject where delegation semantics require it.
- `AudienceRef` / `ResourceRef` — target scope for which authority is intended.
- `DelegationScope` — operations/resources/tenant/classification/effect rights that may be exercised.
- `DelegableScope` — subset the holder may further delegate.
- `RevocationAuthorityRef` — authority qualified to revoke/fence the named lineage/scope.
- `DomainFloorRequirement` — minimum acceptable floor interpreted by one authority domain.
- `AuthorityLineageRef` — stable lineage across transport/provider/topology changes.
- `AttenuationEvidence` — evidence that a derived delegation is no broader than its parent.

## 5. Candidate proof obligations

1. Cross-domain floors remain domain-qualified and are never collapsed into a synthetic scalar/global revision without an explicit shared ordering contract.
2. Every material root guarantee checks each required domain under that domain's satisfaction/comparison semantics.
3. Delegation preserves actor identity when the contract requires delegation rather than impersonation.
4. Impersonation is explicit, bounded and independently authorized; it is never inferred from forwarding position.
5. Delegated authority never exceeds the delegator's legitimately held and delegable authority.
6. Sub-delegation is forbidden unless the parent authority explicitly permits it for the relevant scope.
7. Exercise, delegation, sub-delegation, minting/impersonation and revocation authorities remain independently representable.
8. Revocation evidence is accepted only from an authority qualified for the named lineage/scope.
9. Gateway/adapter/driver/Exchange Plane transport does not make the intermediary an issuer, delegator or revocation authority.
10. Authority lineage survives transport, route, provider and topology substitution.
11. Audience/resource/operation/tenant/classification constraints survive every cross-capability traversal where material.
12. A syntactically valid credential cannot broaden audience or scope by protocol translation.
13. Every hop authenticating successfully is insufficient unless the full delegation chain is authorized and non-revoked.
14. Independent domain floors may be observed in different orders without creating a false global temporal order.
15. A higher locally observed monotonic floor in one domain cannot be rolled back by older delegated evidence.
16. Credential expiry and revocation/currentness are checked as independent dimensions when required.
17. Federation preserves issuer/trust/revocation domain identity and never implies shared business ownership.
18. Multiple independently required authority domains compose according to the declared relation; broad allow in one cannot mask deny/missing evidence in another.
19. Alternative-authority or quorum semantics exist only when explicitly contracted and qualified.
20. Parent-delegation revocation blocks future admissions according to its effective semantics without erasing legitimate historical effects.
21. Queued/retried work retains original authority lineage and is requalified under current revocation/floor rules before new effect where required.
22. Adapter/gateway mediation either preserves authority semantics, provably narrows them, obtains explicit target-domain re-authorization, or exposes incompatibility/lossiness.
23. Offline delegation use remains bounded by both delegation lifetime/effect-right horizon and revocation/currentness horizon.
24. The Shared Semantic Kernel contains structural authority/evidence refs only and does not become the semantic owner of domain-specific permission models.

## 6. Adversarial cases

1. Gateway sees a user token and begins issuing equivalent user authority to downstreams without explicit delegation authority.
2. Adapter changes protocol and silently widens audience from capability C to the whole platform.
3. B receives `read` from A and sub-delegates `write` to C because the token format permits arbitrary scopes.
4. B may exercise a right but is assumed to possess revocation authority over A's other delegates.
5. Revocation service accepts a syntactically valid revocation from an authority outside the named lineage/domain.
6. A trust-domain floor `42` and policy-domain floor `17` are compared numerically and collapsed to global `42`.
7. Root guarantee caches only one global floor and misses advancement of a second independent authority domain.
8. Parent delegation is revoked but a child credential remains non-expired and continues effectful work indefinitely.
9. Credential is short-lived but was revoked immediately after issuance; runtime treats `exp` as proof of non-revocation.
10. Every hop in A->B->C authenticates, but B was never allowed to sub-delegate.
11. Actor chain is retained as provenance but consumer treats a historical actor as current authority.
12. Impersonation is mislabeled as delegation, hiding which service actually performed the action.
13. Delegation is mislabeled as impersonation, destroying actor accountability/provenance.
14. Federated trust bundle is interpreted as permission for foreign domain to issue local business roles.
15. Gateway migration changes token audience handling and old evidence is reused without requalification.
16. Two broad allows from different domains are unioned even though the root contract requires both constraints simultaneously.
17. One of three signatures is missing but middleware invents a `2-of-3` quorum not declared by the contract.
18. Parent revocation deletes historical audit evidence and makes prior settled effects appear never to have happened.
19. Retry after revocation is treated as new admission and receives fresh authority without preserving the original obligation lineage.
20. Offline runtime keeps using delegated rights after its revocation-currentness horizon expires because the credential itself has not expired.
21. Exchange Plane compromise fabricates a higher authority floor and consumers treat transport metadata as issuer truth.
22. Exchange Plane suppresses a revocation/floor advancement while cached derived proofs remain within unrelated business-data TTL.
23. Adapter cannot represent a target-domain condition and silently drops it while claiming authority equivalence.
24. SPIRE-like delegated identity power is granted to an ordinary sidecar/gateway merely because it already handles identity material.

## 7. Portability / exit path

The hypothesis is implementation-independent. It does not require OAuth/JWT, AWS IAM, SPIFFE/SPIRE, Zanzibar/OpenFGA, macaroons, a centralized authorization server, a shared policy database, a service mesh, a broker or a particular cryptographic credential format.

Any future realization must preserve:

- domain-qualified floors and comparison semantics;
- explicit actor/subject/delegator/issuer/audience distinctions where material;
- monotonic attenuation or explicit target-domain re-authorization;
- independently scoped exercise/delegation/revocation/minting authority;
- transport-independent authority lineage;
- explicit revocation/currentness horizons;
- historical evidence without granting stale future authority;
- autonomous runtime evaluation from locally sufficient evidence when the topology promises autonomy.

## 8. Deduplication against existing G4 research

This round does not reopen:

- hierarchical effect-right conservation: it reuses conserved-right/fencing semantics and focuses on delegated authorization/revocation lineage;
- multi-domain evidence composition: it specializes composition to independently ordered authority floors and delegation chains;
- offline security floors: it reuses bounded offline currentness and adds delegated-right/currentness interaction;
- policy lifecycle/profile negotiation: it reuses anti-rollback/non-downgrade and immutable semantic identities;
- evidence caching/revocation storms: it reuses monotonic floor invalidation and adds cross-domain composition plus revocation ownership;
- privacy/federation research: it preserves trust-domain separation without introducing a new privacy family.

## 9. Maturity and next gap

Material delta: **YES**.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

The next highest-value gap is **delegation-chain compaction and revocation discovery under long-lived/offline workflows**: determine what minimal durable lineage must survive when A->B->C->D chains are compacted, how a late revocation of an ancestor is discovered without retaining every credential forever, how audience/scope attenuation remains provable after compaction, and how offline autonomous runtimes distinguish `ancestor unresolved`, `revoked`, `below-retention` and `still admissible` without a mandatory central authorization oracle.
