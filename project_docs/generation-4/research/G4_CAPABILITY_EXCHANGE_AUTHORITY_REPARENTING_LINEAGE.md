# G4 Capability Exchange — Authority Re-parenting and Lineage Preservation

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-22
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select OAuth/OIDC, SPIFFE/SPIRE, Kubernetes identity, a service mesh, gateway, broker, policy engine or provider. It does not reopen G3 and does not authorize product work.

## 1. Research question

Prior G4 research established that transitive membership revocation must follow both authority-delegation lineage and already-materialized consequences. The remaining high-value gap is **authority re-parenting**: endpoint/capability C survives the revocation of lineage `A -> B -> C` because it obtains a new authority edge `D -> C`, while caches, sessions, queued work, retries and observations still carry the old lineage.

Core finding:

`same endpoint identity + new authority edge != old work re-authorized`.

A new authority may authorize **future admission** without retroactively laundering work admitted under a revoked authority lineage.

Equally:

`old lineage revoked != endpoint globally invalid`.

C can legitimately remain usable under D while effects derived solely from A/B remain revoked, draining, unknown or settlement-bound.

## 2. Evidence reviewed

Primary standards/documentation and mature-system behavior:

- RFC 8693 (OAuth 2.0 Token Exchange) explicitly distinguishes delegation from impersonation and permits nested `act` claims to carry delegation history. Crucially, a token exchange is a one-time event and, absent token-specific semantics, does **not** create a tight lifecycle linkage between input and output tokens; later renewal/extension of an input token is not automatically reflected in the output token, and revocation propagation is deployment-specific. This is direct evidence that derived authority artifacts require their own lineage/currentness/revocation semantics rather than inheriting a magical live parent link. <https://www.rfc-editor.org/rfc/rfc8693.html>
- RFC 9470 (OAuth 2.0 Step Up Authentication Challenge Protocol) demonstrates an explicit re-authorization pattern: a resource server can reject an otherwise valid token because its authentication strength/recentness is insufficient and require acquisition of a new token satisfying the current requirement. This is useful evidence for `readmit under new proof` rather than mutating the meaning of the old credential. <https://www.rfc-editor.org/rfc/rfc9470.html>
- Kubernetes projected ServiceAccount tokens are short-lived and can be bound to an object. The TokenReview path can invalidate a bound token immediately when the bound object is deleted, while offline OIDC validation can continue treating the same signed token as valid until expiry. This demonstrates that identity bytes, live authority/currentness and validation mode are distinct proof dimensions. <https://kubernetes.io/docs/concepts/security/service-accounts/>
- SPIRE registration entries bind a SPIFFE ID to selectors and a parent ID; agents cache registration entries and attest workloads before assigning SVIDs. The same SPIFFE ID can therefore be a stable identity label while the attestation/registration basis that authorizes issuance is a separate mutable relation. SVIDs themselves are short-lived identity documents. <https://spiffe.io/docs/latest/deploying/registering/> and <https://spiffe.io/docs/latest/deploying/svids/>

These systems are benchmarks only; none is selected.

## 3. Identity continuity is not authority continuity

Consider:

```text
old lineage: A -> B -> C
new lineage: D ------> C
```

C may retain the same service name, endpoint identity, SPIFFE ID, logical capability ref or provider resource identifier. That continuity is useful for addressing and business identity, but it cannot prove that authority has continued.

`IdentityRef(C) stable != AuthorityLineageRef(C) stable`.

Conversely, changing the authority lineage need not require changing C's business or endpoint identity.

This preserves a clean distinction:

- **identity continuity** — this is still C;
- **authority lineage** — why C is currently permitted to act/receive membership/effect rights;
- **admission lineage** — under which authority proof a specific work item was admitted;
- **effect lineage** — under which admission/authority chain a protected effect may commit;
- **current authority** — which authority edges are presently admissible for new work.

## 4. Re-parenting is a new authority edge, not lineage mutation

A dangerous normalization would rewrite historical lineage:

```text
A -> B -> C  --reparent-->  D -> C
```

as though all old C work had always belonged to D.

That destroys revocation and forensic meaning.

Candidate rule:

`re-parenting appends/supersedes authority edges; it does not rewrite occurrence lineage`.

Historical work retains the authority/admission lineage under which it was accepted unless an explicit re-admission protocol creates a new occurrence/admission generation.

## 5. Re-authorization is not retroactive laundering

Suppose command Q was admitted under `A -> B -> C`, queued, then A is revoked. Later D independently authorizes C.

The existence of `D -> C` does not imply:

`Q(old lineage) -> Q(new lineage)`.

A legitimate migration requires an explicit policy-qualified transition such as:

1. preserve Q's original occurrence/effect identity;
2. classify Q's old authority as revoked/draining/unknown;
3. decide whether the business operation is eligible for re-admission;
4. obtain fresh authority/currentness/evidence under D;
5. create a distinct `ReAdmissionRef` linking old and new admission generations;
6. preserve idempotency/dedup/fencing/settlement relations so re-admission cannot duplicate an effect already committed under the old lineage.

Thus:

`re-authorization != history rewrite`.

`re-admission != retry`.

`same effect identity != same admission authority`.

## 6. RFC 8693: derived credentials are not live parent aliases

RFC 8693 is especially useful because it states that token exchange does not, by itself, create tight linkage between input and output tokens. Output-token validity is not automatically changed by later renewal/extension of input tokens, and revocation propagation requires additional mechanism/policy.

Universal lesson:

`derived authority artifact != live view of parent authority`.

Nested `act` claims can preserve a delegation history trail, but prior actors are informational for the access-control semantics defined by the RFC; they do not themselves re-authorize current access. This reinforces that G4 lineage evidence and current authorization evidence are related but distinct.

## 7. Step-up is evidence for explicit readmission

RFC 9470 permits a resource server to decide that an access token is insufficient for the present context and challenge for stronger or more recent authentication. A new token is then obtained.

The generalizable pattern is:

`old credential still interpretable != old credential admissible for this effect`.

and:

`new stronger credential != semantic mutation of old credential`.

For G4, re-parenting can use the same principle without binding to OAuth: when a protected effect requires a new authority lineage, the system may require explicit re-admission under the new lineage rather than silently attaching the new authority to old work.

## 8. Kubernetes: validation mode changes authority currentness

Kubernetes documents an important split for bound ServiceAccount tokens:

- TokenReview can observe deletion of the bound object and reject the token immediately;
- a consumer performing offline OIDC validation may continue to accept the cryptographically valid token until its expiry.

Therefore:

`same signed token != same current-authority conclusion across validation modes`.

This is a useful adversarial for G4 re-parenting. If C is re-parented after the old parent/object is revoked, possession of an old still-cryptographically-valid artifact cannot be interpreted as proof that work is now authorized by D.

## 9. SPIFFE: stable identity may have a new attestation basis

SPIRE registration entries associate a SPIFFE ID with selectors and a parent ID. Agents cache entries and use attested selectors to decide which SVIDs a workload may obtain.

This supports an implementation-independent distinction:

`stable workload identity != immutable issuance/attestation lineage`.

A workload can remain logically C while the parent/registration/attestation basis changes. G4 must therefore avoid embedding authority ownership into endpoint identity primitives.

## 10. Candidate lineage model

A minimal research model is:

```text
AuthorityEdgeRef
  authorityRef
  subjectOrMemberRef
  scopeRef
  effectScopeRef
  issuedAtRef
  currentnessRef
  revocationRef
  evidenceRef

AdmissionLineageRef
  occurrenceRef
  admissionGenerationRef
  authorityEdgeRefs[]
  contractProfileRef
  securityFloorRef
  currentnessRef

ReAdmissionRef
  priorAdmissionLineageRef
  successorAdmissionLineageRef
  reasonRef
  protectedEffectRef
  settlementEvidenceRef
  dedupFencingEvidenceRef
  disposition
```

These are research primitives, not approved schemas.

The Shared Semantic Kernel candidate should contain only structural refs/lineage/currentness/revision/evidence primitives. It must not acquire domain-specific authorization entities merely to support this model.

## 11. Authority generations are not endpoint generations

Re-parenting suggests a scoped generation relation:

```text
C identity generation:      c7 ------------------------------>
authority generation:       a12 (A/B) ----X    a13 (D) ------>
admission generation Q:     q4 (a12) ------------------------>
new admission Q':                               q5 (a13) ---->
```

`authority generation advanced != all occurrences advanced`.

This reuses G4 semantic-generation research: occurrence/admission branches may remain pinned independently. There is no need for one global topology or authority revision.

## 12. Queued and in-flight work

When authority is re-parented, queued/in-flight work falls into at least these categories:

- **already committed** — settlement/reconciliation, not re-admission;
- **possibly committed** — `UNKNOWN` until effect settlement/fencing resolves ambiguity;
- **admitted but not effect-capable yet** — may be eligible for explicit re-admission;
- **retry scheduled after ambiguous attempt** — cannot be re-parented blindly because duplicate-effect risk remains;
- **pure query/read with declared stale-authority continuation** — may continue if contract explicitly permits it;
- **new work** — can be admitted directly under the new lineage.

`queue position != authority right`.

`delivery after re-parenting != admission under new authority`.

## 13. Lineage laundering adversarial

Lineage laundering occurs when a system uses continuity of endpoint identity, route, credential subject, resource ID or business object to make old work appear authorized by a new authority edge without a proof-bearing transition.

Examples:

- old queued command is stamped with current C authority at delivery time;
- retry obtains a fresh D credential but retains no evidence that the first attempt was under revoked A/B;
- adapter strips old delegation chain and emits only current actor;
- cache key is endpoint ID only, so old proof is reused after re-parenting;
- gateway reconstructs authority from current route configuration rather than preserved admission lineage;
- settlement record attributes an effect to D solely because D was current when ACK arrived.

Candidate invariant:

`current authority may authorize a new admission; it may not rewrite the authority lineage of an already-admitted occurrence`.

## 14. Independent reauthorization and dual authority

A transition may temporarily have both old and new authority edges valid:

```text
A -> B -> C
D ------> C
```

Dual authority is not automatically a conflict. It becomes material when the two edges grant overlapping protected-effect rights with different revocation/currentness/settlement semantics.

The proof must classify whether the edges are:

- equivalent for the named protected effect;
- disjoint by scope;
- ordered/preferred but both valid;
- overlapping with explicit migration rules;
- conflicting;
- unknown.

`two valid parents != union of permissions by default`.

The capability owns the business semantics deciding whether two authority grants can jointly authorize an operation. The Exchange Plane only preserves and transports the qualified authority/evidence context.

## 15. Re-parenting and retries

A retry is particularly dangerous because transport machinery often rebuilds credentials/routes at attempt time.

Candidate rule:

`retry may refresh mechanism; it must not silently refresh semantic authority lineage`.

If retry after re-parenting is permitted, the contract must specify whether it:

- remains under the original admission lineage;
- requires explicit re-admission under the new lineage;
- is forbidden until settlement of the previous attempt;
- can continue only for non-effecting interactions.

A fresh token or connection does not by itself answer this question.

## 16. Re-parenting and settlement

ACK time is not authority attribution time.

An effect can be:

1. admitted under A/B;
2. committed at C;
3. A revoked;
4. D authorizes C;
5. ACK arrives.

Attributing that effect to D because D is current at step 5 is false lineage.

`current authority at observation != authority at admission/commitment`.

Settlement evidence should retain admission/effect lineage or explicitly report that attribution is unknown.

## 17. Target-side mediation

A commitment-adjacent gate can simplify re-parenting but does not erase history.

If every protected effect checks a current `AdmissionLineageRef`/authority predicate immediately before commitment, then old queued work cannot exploit a newly current D edge unless explicitly re-admitted.

This yields:

`universal commitment gate -> endpoint identity continuity need not imply authority continuity`.

The gate can be capability-local/runtime-local/provider-local. It need not be a central Exchange Plane proxy.

## 18. Offline autonomy

Published runtimes must remain autonomous from Builder availability. Re-parenting therefore cannot require a central online authority-history oracle for every operation.

Candidate local durable state includes:

- current qualified authority edges;
- monotonic revocation floors;
- admission lineage for unresolved protected effects;
- re-admission evidence where used;
- currentness/security horizons;
- settlement/fencing evidence required to avoid duplicate effects.

If the runtime cannot establish that new D authority is current or cannot classify unresolved old-lineage effects, it degrades only the affected operations rather than fabricating authority.

## 19. Portability / exit path

The model remains portable when provider-specific mechanisms map to qualified structural evidence:

- token exchange -> authority derivation/re-admission evidence;
- SPIFFE/SPIRE registration -> identity/attestation issuance evidence;
- Kubernetes TokenReview -> live bound-token currentness evidence;
- offline JWT/OIDC validation -> cryptographic validity with weaker live-revocation claim;
- gateway/mesh credentials -> transport/peer evidence only unless stronger semantics are explicitly proven.

A provider that cannot preserve or expose required lineage may still be used for interactions whose guarantee does not require it. It must not be normalized to stronger semantics.

## 20. Candidate dispositions

- `REPARENTED_NEW_ADMISSION_ONLY` — new lineage is valid for new admissions; old work retains old lineage.
- `REPARENTED_EXPLICIT_READMISSION` — selected old work has been re-admitted with a proof-bearing successor lineage.
- `REPARENTED_DUAL_AUTHORITY_QUALIFIED` — both lineages are valid with explicit overlap semantics.
- `REPARENTED_OLD_LINEAGE_DRAINING` — old work may continue only under declared continuation semantics.
- `REPARENTED_OLD_LINEAGE_FENCED` — old lineage cannot commit the protected effect.
- `REPARENTED_PARTIAL` — only some scopes/effects/occurrences have qualified transitions.
- `REPARENTED_UNKNOWN` — lineage attribution/currentness or prior effect settlement is materially unknown.
- `REPARENTED_CONTESTED` — observations contradict the asserted lineage transition.
- `REPARENTED_INCOMPATIBLE` — required lineage guarantee cannot be provided.

## 21. Proof obligations

1. Endpoint/capability identity continuity is not promoted to authority continuity.
2. Re-parenting creates/supersedes authority edges; it does not rewrite historical occurrence/admission lineage.
3. Current authority for new work and authority lineage of already-admitted work remain separate claims.
4. New authority D does not retroactively authorize work admitted solely under revoked A/B.
5. Explicit re-admission, when allowed, creates a successor admission generation with a durable relation to the prior admission.
6. Re-admission preserves stable effect identity or otherwise proves why duplicate-effect risk is impossible.
7. Ambiguous prior attempts are settled/fenced before re-admission can create conflicting effects.
8. Retry/redelivery does not silently adopt the authority current at retry time.
9. Credential refresh/rotation does not imply semantic re-admission.
10. Token/credential cryptographic validity is distinguished from live authority/currentness.
11. Derived credentials/tokens do not inherit a fabricated live parent linkage when the mechanism does not provide one.
12. Delegation history evidence and current authorization evidence remain distinct.
13. Stable workload/service identity may survive changes in attestation/issuance parent without implying authority continuity.
14. Cache keys for authority evidence include lineage/generation/scope, not endpoint identity alone.
15. Revocation floors for old lineage cannot be rolled back by snapshots/caches after re-parenting.
16. Independent D->C authorization is represented as a new authority edge/currentness domain.
17. Dual-parent overlap semantics are explicit for the protected effect; permissions are not unioned by convenience.
18. Scope-disjoint parents remain distinguishable and cannot authorize outside their declared scopes.
19. ACK/observation time is not used to rewrite admission/effect authority attribution.
20. Settlement evidence retains the authority/admission lineage relevant at commitment or reports attribution unknown.
21. Queued work retains admission lineage across route/provider/credential changes.
22. In-flight work retains lineage across authority-generation handoff.
23. A commitment-adjacent gate may require current lineage but does not erase historical lineage/evidence.
24. Every effect-capable bypass is included before claiming universal lineage enforcement.
25. Provider/adapter translation preserves lineage distinctions it can represent and exposes lossiness otherwise.
26. Unsupported lineage semantics yield explicit partial/unknown/incompatible disposition rather than endpoint-identity substitution.
27. Exchange Plane transports/qualifies lineage evidence but does not become business authorization owner.
28. Capability owns the business rule deciding whether re-admission/dual authority is acceptable.
29. Shared Semantic Kernel remains limited to structural identity/ref/revision/time/provenance/currentness/authority-lineage primitives.
30. Runtime autonomy is preserved with locally durable lineage/floors/evidence; Builder is not an online dependency.
31. Offline operation cannot fabricate a new D authority edge from endpoint continuity alone.
32. Re-parenting proof is effect/scope/tenant/classification qualified where those dimensions affect authority.
33. Authority-generation change is not promoted to one global system generation.
34. Historical interpretation of old lineage may remain available after its authority is retired.

## 22. Adversarial cases

1. A->B->C is revoked; D->C becomes valid; old queue entries are stamped with D at delivery.
2. Retry obtains a D credential after an ambiguous A/B attempt and duplicates the effect.
3. Endpoint ID C is used as the only cache key, causing old proof reuse.
4. Adapter drops nested delegation lineage and preserves only current actor.
5. Gateway derives authority from current routing config rather than admission lineage.
6. ACK arrives after re-parenting and effect is falsely attributed to D.
7. Old token remains cryptographically valid offline after its bound authority object was deleted.
8. TokenReview would reject an old bound token, but an offline validator still accepts it until expiry.
9. New SPIFFE SVID has the same SPIFFE ID but derives from changed registration/parent semantics; consumer assumes identical authority.
10. D grants a narrower scope than A/B, but old queued work is re-admitted without scope re-evaluation.
11. D grants broader scope; adapter treats broader grant as proof that old work was always valid.
12. Both A/B and D are temporarily valid and implementation unions their permissions.
13. Re-admission creates a new occurrence ID and defeats dedup for an already-committed old attempt.
14. Re-admission reuses effect ID but target fence state was not transferred.
15. Old-lineage revocation floor is lost on restore after D becomes current.
16. Break-glass path bypasses commitment-adjacent lineage check.
17. Queue strips tenant/classification metadata during re-parenting.
18. New authority is current for reads but old write queue is also released.
19. A/B lineage is historical-only, but reporting code treats it as current authority.
20. D is independently authorized, but its evidence horizon expires while endpoint identity remains stable.
21. Token exchange output is assumed to be automatically revoked when input token is revoked, contrary to mechanism guarantees.
22. Token exchange output is assumed independent even though deployment-specific revocation propagation actually applies; driver hides this stronger coupling.
23. Step-up/new credential is obtained but old request is replayed without explicit binding to the new admission.
24. Current authority edge is reconstructed from latest provider state during audit, rewriting historical attribution.
25. Same resource ID is deleted/recreated under a new authority owner; stale lineage binds by name rather than qualified identity/revision.
26. D authorizes C in another tenant/classification domain and adapter ignores the boundary.
27. Authority edge changes while an HTTP/2/multiplexed session carries both old- and new-admission streams.
28. Service mesh refreshes transport identity and is mistaken for authority re-admission.
29. Offline runtime invents D authority because it sees C still reachable.
30. Central Exchange Plane becomes mandatory authority oracle, violating runtime autonomy.
31. Capability delegates business re-admission policy to a generic gateway.
32. Historical old-lineage evidence is deleted immediately after re-parenting although unresolved effects still require settlement.
33. Re-parenting succeeds for membership but not for effect authority; implementation treats them as one dimension.
34. New parent D is valid but cannot prove delegation/impersonation semantics required by the protected effect; adapter fabricates equivalence.

## 23. Deduplication against existing G4 research

This round does not reopen:

- generic membership-authority revocation;
- transitive residual revocation horizon;
- generic token/credential revocation;
- semantic-generation handoff;
- retry/idempotency/fencing fundamentals;
- provider semantic drift;
- route-set assurance;
- identity federation generally.

Material delta:

`transitive revocation -> descendant independently reauthorized -> stable endpoint identity with changed authority parent -> historical admission lineage must survive -> explicit re-admission rather than lineage laundering -> settlement/fencing protects ambiguous old effects`.

## 24. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This closes the immediate conceptual gap that endpoint continuity plus independent re-authorization could silently wash away old authority lineage. It establishes a provider-independent distinction between current authority, historical admission authority and explicit re-admission.

The next high-value gap is **re-admission proof composition for unresolved effects**: when old-lineage work is eligible to move under a new authority but the prior attempt is `UNKNOWN`/possibly committed, determine the minimal proof bundle that permits re-admission without duplicate/conflicting effects across heterogeneous providers whose idempotency/fencing/settlement guarantees differ. This should refine when re-admission is safe, must remain deferred, or is impossible, without turning the Exchange Plane into a transaction coordinator.
