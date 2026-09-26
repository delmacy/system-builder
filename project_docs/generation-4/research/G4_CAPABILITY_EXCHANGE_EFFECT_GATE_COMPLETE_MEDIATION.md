# G4 Capability Exchange — Effect-Gate Placement and Complete Mediation

Date: 2026-09-21
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Generation 4 product R&D only
Implementation authority: NONE

## 1. Research question

This consolidation continues `G4_CAPABILITY_EXCHANGE_INFLIGHT_POLICY_COMPOSITION_CHANGE.md` and asks:

> How can a capability demonstrate that every path capable of producing a material/protected effect crosses the policy/authority/currentness/floor gate required by that effect, when effects may originate through direct calls, RPC, jobs, retries, brokers, plugins, adapters, legacy integrations, local in-process optimizations or provider callbacks — without requiring one central gateway and without mistaking network interception for semantic authorization?

Constitutional boundaries remain unchanged:

- `G3 semantic decision != G4 technology binding`;
- `Research candidate != implementation authority`;
- `Builder != Runtime`;
- `Shared primitives != shared business ownership`;
- `Logical Exchange Plane != single broker`;
- `Exchange Plane owns exchange semantics; capability owns business semantics`;
- `service-mesh interception != semantic governance`;
- `effect admitted != effect completed`;
- `interface reachable != effect authorized`.

## 2. Evidence base

Primary standards and mature-system documentation reviewed:

1. **OWASP Authorization Cheat Sheet** — recommends validating permissions on every request and warns that one missed authorization path is enough to compromise confidentiality/integrity. This is application-security guidance, not a G4 architecture selection. <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
2. **Istio Ambient authorization / waypoint documentation** — L7 policy is enforced only for traffic that actually reaches the waypoint; Istio documents bypass cases and recommends destination-side policy that requires the waypoint identity when waypoint traversal is a security requirement. This is concrete failure evidence that a capable intermediary is not automatically a complete mediation point. <https://istio.io/latest/docs/ambient/usage/l7-features/> and <https://istio.io/latest/docs/ambient/usage/waypoint/>
3. **Istio L4 policy documentation** — ztunnel and waypoint enforce different policy classes; ztunnel cannot enforce L7 semantics. This demonstrates that enforcement capability and placement are part of the proof, not implementation trivia. <https://istio.io/latest/docs/ambient/usage/l4-policy/>
4. **Istio sidecar-to-ambient migration documentation** — documents enforcement gaps and bypass behavior during topology migration. This is mature operational evidence that a topology change can invalidate a previous mediation assumption even when the application contract is unchanged. <https://istio.io/latest/docs/ambient/migrate/enable-ambient-mode/>
5. **AWS IAM access evaluation documentation** — authorization is evaluated against the request context and applicable policy layers; explicit deny can override allows. This is useful precedent for effect-local enforcement and typed policy context, not an AWS adoption. <https://docs.aws.amazon.com/IAM/latest/UserGuide/access.html>
6. Existing G4 research on effect composition, non-fenceable effects, in-flight contract/policy evolution, multi-domain invalidation, retries, split brain, evidence lineage and degraded-mode guarantees.

These sources are benchmarks only. No mesh, gateway, PDP/PEP, IAM model, framework or transport is selected.

## 3. Material delta

Previous G4 work established:

`historical admission != continuation authority != new-effect admissibility`.

The remaining gap was whether a declared `EffectAdmissionGateRef` is actually unavoidable for every path that can materialize the protected effect.

This round proposes:

> Complete mediation is a property of an effect boundary and its reachable effect paths, not of a named gateway product. A protected effect is safely mediated only when every path capable of materializing that effect either (a) passes an equivalent qualified gate before effect commitment, (b) is structurally incapable of committing the effect, or (c) is explicitly outside the protected effect universe.

Therefore:

`gate exists != gate is complete`.

and:

`all known API routes gated != all effect paths gated`.

## 4. Effect boundary, not ingress boundary

Authorization at request ingress may be necessary but is not sufficient when the request later creates jobs, retries, callbacks or delegated provider work.

The relevant object is the **effect commitment boundary**: the point beyond which the protected external/business effect can become effective or irrevocably delegated.

Examples include:

- mutation of capability-owned canonical state;
- issuance/transfer/spend of a conserved right;
- external payment/message/device action;
- creation of a durable obligation whose later execution is authorized by that creation;
- release of classified data;
- provider invocation that cannot be reliably recalled after acceptance.

Thus:

`request authorized != downstream effect automatically authorized`.

The contract must say whether authorization is inherited, delegated, refreshed, rechecked or fenced at each material effect boundary.

## 5. Candidate effect-path model

Research-only model:

`EffectPath = <origin, semantic lineage, mediation chain, gate claims, delegation, commitment point, settlement evidence>`

Candidate origins include:

- synchronous inbound call;
- local in-process call;
- IPC/RPC;
- broker/stream delivery;
- scheduled/background job;
- retry/redelivery;
- plugin/extension callback;
- adapter/gateway translation;
- provider callback/webhook;
- legacy/file integration;
- recovery/replay/failover path.

A path is not safe merely because another path to the same effect is gated.

`one mediated path != mediated effect universe`.

## 6. Complete mediation is claim-scoped

There is no useful universal boolean `system is completely mediated`.

Candidate `CompleteMediationClaimRef` binds at least:

- protected effect class;
- capability/contract identity;
- effect-path universe and revision;
- required gate semantics/profile;
- gate placement(s);
- delegation rules;
- topology assumptions;
- plugin/provider/legacy closure assumptions;
- currentness/floor requirements;
- qualification evidence and limitations.

A proof for `payment.commit` says nothing automatically about `document.read`, `notification.send` or `provider.configure`.

## 7. Distributed enforcement is compatible with complete mediation

Complete mediation does **not** imply one central gateway.

Equivalent gates may be placed at multiple effect-local boundaries when they share the declared contract semantics and preserve relevant identity/tenant/authority/currentness context.

For example:

`API -> capability-local gate -> local state effect`

and independently:

`job -> capability-local gate -> provider effect`.

The proof obligation is path coverage and semantic equivalence of the required gate, not centralization.

`distributed enforcement != weaker by definition`.

Conversely:

`central gateway present != complete mediation`.

Internal jobs, callbacks, direct pod/service addresses, recovery paths or local optimizations can bypass it.

## 8. Service mesh is mechanism, not semantic authority

Istio provides particularly useful failure evidence. Its documentation states that waypoint L7 policy only applies to traffic reaching the waypoint, describes bypass cases, and requires an additional destination-side policy when waypoint traversal itself must be mandatory.

G4 generalizes:

`interception capability != proof of unavoidable semantic gate`.

and:

`L4 identity enforcement != L7/business-effect authorization`.

A mesh can contribute transport identity, encryption, routing, policy enforcement and evidence. It cannot infer capability-local business meaning that its policy model does not represent.

If a business invariant says “only the current reservation holder may commit this irreversible effect,” an mTLS principal check alone does not prove the reservation/fencing/currentness predicate.

## 9. Structural exclusion is valid evidence

Not every path needs a duplicate runtime authorization call if the architecture can prove the path cannot commit the protected effect.

Examples of candidate exclusion evidence:

- read-only credential/capability;
- target-side interface physically lacks the mutating operation;
- provider token cannot invoke the protected operation;
- sandbox/OS policy denies the effect channel;
- database role cannot mutate protected relations;
- network path cannot reach the effect endpoint;
- plugin contract/runtime denies the effect primitive.

But:

`mechanism blocks one channel != all channels excluded`.

Structural exclusion must bind to an explicit effect universe and revision; adding a new provider method, callback or local optimization can invalidate it.

## 10. Delegation and durable obligations

Some systems authorize creation of a durable obligation now and execute it later. In that case the semantic gate may legitimately be at obligation creation rather than at every transport attempt — **only if the contract explicitly grants a durable effect right** and defines its revocation/fencing/currentness semantics.

Therefore:

`job created under valid authority != job always executable forever`.

Possible contracts include:

- authority is consumed into a durable scoped right at creation;
- authority must be rechecked at execution;
- authority is valid until a named horizon/floor;
- execution requires both original delegation evidence and a current gate.

Retries preserve obligation identity but cannot mint new authority.

## 11. Provider ACK and effect commitment

The gate must be placed before the point at which the protected effect becomes irrevocably delegated under the contract.

If a provider's ACK only means queue acceptance, it is not necessarily the effect commitment point. If provider acceptance itself transfers an irrevocable right or makes cancellation unreliable, the commitment boundary may be earlier.

`Provider ACK != effective state` remains unchanged.

The contract must name the provider-side semantic point relevant to authorization, fencing and settlement.

## 12. Topology changes require mediation requalification

Moving from sidecar to waypoint, RPC to in-process call, broker to direct callback, or gateway to local adapter can preserve interface behavior while changing which enforcement points are traversed.

Therefore:

`transport/topology substitution != mediation-proof preservation`.

A topology change is transparent only when the complete-mediation claim remains true for the same protected effect universe.

This directly guards against a local optimization that bypasses a gate previously enforced only on the remote path.

## 13. Discovery evidence vs proof of completeness

Static call graphs, route inventories, traces, service-mesh telemetry, broker subscriptions and code search are useful for discovering candidate effect paths, but none alone proves completeness.

`observed paths != all possible paths`.

A stronger qualification can combine:

- declared effect capabilities/ports;
- generated/build-time path inventory;
- static analysis where applicable;
- runtime observation/fuzzing;
- least-privilege structural constraints;
- target-side enforcement;
- plugin/provider attestations;
- negative-path tests;
- topology manifests;
- explicit opaque/unknown closure.

Unknown path coverage remains `UNKNOWN`/`REQUALIFICATION_REQUIRED`; it is not converted to success because no bypass was observed.

## 14. Opaque plugins/providers

For a proprietary or opaque component, complete mediation cannot be fabricated.

Possible qualified outcomes:

- component has no authority/channel to produce the effect;
- component's effect path is gated by a target-side boundary outside the component;
- component supplies qualified evidence/attestation for its internal mediation;
- effect class is outside the component's contract;
- closure remains `OPAQUE`, forcing a stricter external gate or preventing the complete-mediation claim.

`plugin signed/trusted != plugin effect paths fully mediated`.

## 15. Gate semantic equivalence

Two gates with the same interface are not necessarily equivalent. They may use different policy revisions, stale authority data, different `UNKNOWN` semantics, different tenant/classification context or weaker currentness floors.

Thus:

`same gate API != same gate guarantee`.

A distributed mediation proof needs contract-level equivalence for the protected effect, not merely common middleware.

## 16. Failure behavior

A gate failure must preserve explicit dispositions such as `DENIED`, `UNKNOWN`, `STALE`, `UNAVAILABLE`, `INCOMPATIBLE`, `BELOW_FLOOR` or `REQUALIFICATION_REQUIRED` where material.

`gate unavailable != effect allowed`.

Whether bounded stale/offline operation is allowed remains effect/contract-specific and follows previously researched currentness horizons.

Operational fail-open may be legitimate only for effects explicitly classified as safe under that degraded guarantee; it cannot silently weaken a protected invariant.

## 17. Candidate vocabulary

Research vocabulary only:

- `ProtectedEffectRef` — named effect class whose commitment requires a declared guarantee.
- `EffectCommitmentBoundaryRef` — semantic point after which the effect/right is effective or irrevocably delegated.
- `EffectPathRef` — one qualified path capable of reaching a commitment boundary.
- `EffectPathUniverseRef` — declared universe/revision of candidate effect paths.
- `EffectAdmissionGateRef` — policy/authority/currentness predicate required before commitment.
- `MediationPointRef` — concrete/logical enforcement point implementing a gate contract.
- `CompleteMediationClaimRef` — scoped claim that all material paths are gated or structurally excluded.
- `StructuralExclusionEvidenceRef` — evidence that a path cannot produce the protected effect.
- `DelegatedEffectRightRef` — durable scoped right created by an earlier authorized decision.
- `MediationCoverageRef` — coverage/limitations of the path inventory and enforcement proof.
- `GateEquivalenceRef` — qualification that distinct mediation points preserve the required gate guarantee.
- `MediationRequalificationRef` — result required after topology/provider/path-universe change.

None is a shared business entity or implementation commitment.

## 18. Candidate proof obligations

1. **PO-EGCM-01 — Effect-local scope:** complete mediation is proven per protected effect/contract, not asserted globally.
2. **PO-EGCM-02 — Path coverage:** every path capable of committing the protected effect is gated, structurally excluded or explicitly outside scope.
3. **PO-EGCM-03 — Commitment placement:** the required gate occurs before irrevocable/effective delegation of the protected effect.
4. **PO-EGCM-04 — No ingress substitution:** request-ingress authorization is not treated as proof for later independent effect paths.
5. **PO-EGCM-05 — Retry lineage:** retry/redelivery cannot create a bypass or mint new effect authority.
6. **PO-EGCM-06 — Job semantics:** durable jobs state whether authority is captured, refreshed, bounded or rechecked at execution.
7. **PO-EGCM-07 — Provider semantics:** provider ACK semantics are distinguished from effect commitment/settlement.
8. **PO-EGCM-08 — Distributed equivalence:** multiple mediation points preserve the gate guarantee required for the protected effect.
9. **PO-EGCM-09 — No gateway assumption:** a central gateway is neither required nor sufficient for complete mediation.
10. **PO-EGCM-10 — Mesh limitation:** transport/service-mesh policy is not promoted to business-semantic authorization beyond its modeled attributes.
11. **PO-EGCM-11 — Local/remote parity:** in-process/local optimization cannot bypass a gate required on the remote realization of the same effect contract.
12. **PO-EGCM-12 — Callback coverage:** provider/webhook/callback/recovery paths are included when they can commit the effect.
13. **PO-EGCM-13 — Plugin opacity:** opaque plugin/provider closure remains explicit unless externally fenced or qualified.
14. **PO-EGCM-14 — Structural exclusion scope:** negative/exclusion evidence identifies effect universe, mechanism and revision.
15. **PO-EGCM-15 — Path-universe evolution:** adding/changing a path invalidates or requalifies affected complete-mediation claims.
16. **PO-EGCM-16 — Gate identity/currentness:** policy/profile/tenant/authority/classification/floor/currentness context survives to the mediation point.
17. **PO-EGCM-17 — Unknown honesty:** missing path coverage or unavailable gate evidence cannot become `ALLOW` by omission.
18. **PO-EGCM-18 — Delegation boundedness:** delegated effect rights are scoped, identifiable, revocable/fenceable where promised, and cannot silently expand.
19. **PO-EGCM-19 — Target-side enforcement:** where bypass is possible, a target-side or otherwise unavoidable constraint must close the bypass for the protected effect.
20. **PO-EGCM-20 — Topology requalification:** transport/deployment changes preserve or explicitly requalify mediation coverage.
21. **PO-EGCM-21 — Evidence portability:** mediation proof is not inseparably tied to one mesh/gateway/provider implementation.
22. **PO-EGCM-22 — Capability ownership:** gate enforcement does not transfer business-semantic ownership to gateway/mesh/Exchange Plane.
23. **PO-EGCM-23 — Builder independence:** runtime can enforce promised gates for its declared autonomy horizon without Builder availability.
24. **PO-EGCM-24 — Effect evidence:** admission evidence and effect/settlement evidence remain separate; a successful gate does not assert that the effect occurred.

## 19. Adversarial cases

1. API gateway checks authorization, but a cron job calls the provider directly.
2. RPC path is gated; an in-process optimization invokes the same mutation without middleware.
3. Sidecar/waypoint policy is assumed mandatory, but direct workload addressing bypasses it.
4. Mesh proves mTLS identity and is treated as proof of a capability-local reservation/fencing predicate.
5. Broker consumer checks policy, but replay/recovery code writes directly to canonical state.
6. Retry worker receives a stale token and treats retry lineage as perpetual authority.
7. Job creation was authorized, but execution months later is assumed authorized despite a revocation/floor change.
8. Provider ACK means queued, but system treats it as effect settlement and stops authorization/fencing checks too early.
9. Provider acceptance is irrevocable, but the gate is performed only after the call.
10. Plugin gains a new outbound effect API while its interface version remains unchanged.
11. Signed plugin is assumed internally mediated without evidence.
12. Legacy file importer bypasses the command boundary and mutates canonical business state.
13. Database administrator/service credential permits writes that bypass capability-local policy.
14. Recovery script replays old effects through a privileged path not present in normal routing.
15. Callback endpoint trusts provider identity but does not bind tenant/occurrence/effect lineage.
16. Gateway outage causes fail-open direct routing for a protected effect.
17. Two gates expose the same API, but one uses stale policy/floor data.
18. `UNKNOWN` from the gate is coerced to `ALLOW` to preserve availability.
19. Static call graph omits reflection/generated/plugin paths and is labeled complete.
20. Runtime traces do not observe a dormant admin/recovery path and absence is treated as proof.
21. Network policy blocks one endpoint but an alternate local socket/provider SDK can produce the same effect.
22. New broker/subscription is added without invalidating the previous mediation claim.
23. Topology migration creates a temporary enforcement gap that is hidden as rollout detail.
24. A gateway accumulates business workflow because it is mistaken for the owner of every effect gate.
25. Exchange Plane centralizes authorization state and becomes mandatory for otherwise autonomous runtimes.
26. Adapter translates policy response but drops classification/tenant/currentness metadata.
27. Driver/provider reports unsupported fencing semantics as equivalent to the required gate.
28. Gate passes successfully and is recorded as proof that the external effect actually happened.

## 20. Portability and exit path

The hypothesis deliberately avoids binding complete mediation to a service mesh, API gateway, policy engine, language middleware, broker or cloud IAM product.

A portable future contract would describe:

- protected effect and commitment boundary;
- required gate guarantee vector;
- effect-path universe and coverage evidence;
- mediation/exclusion/delegation semantics;
- topology assumptions;
- requalification triggers;
- admission versus settlement evidence.

Concrete mechanisms can then be replaced if they preserve those claims.

`mechanism replacement != semantic gate replacement`.

## 21. Deduplication

This round does not reopen:

- generic authorization-aware data access;
- service-mesh/provider selection;
- effect composition/fencing semantics themselves;
- in-flight policy lifecycle;
- retry/idempotency research;
- dependency-lineage completeness;
- opaque non-dependency evidence;
- degraded-mode contracts.

The material delta is narrower:

`current effect gate -> all effect-producing paths -> complete-mediation qualification -> distributed/target-side enforcement -> topology/path-universe requalification without central semantic gateway`.

## 22. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This gap is materially advanced but not saturated. The next high-value gap is **effect-path universe discovery and change detection under generated/dynamic execution**: how to maintain a sufficiently sound inventory of effect-capable paths when code generation, reflection, plugins, provider SDKs, configuration, recovery tooling and deployment topology can create or remove paths, while avoiding both omniscient static analysis and a central runtime oracle.

No implementation, provider adoption, WBS, Work Package, Sprint, TASK or migration is authorized by this document.
