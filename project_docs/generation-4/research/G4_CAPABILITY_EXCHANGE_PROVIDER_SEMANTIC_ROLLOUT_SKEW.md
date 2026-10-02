# G4 Capability Exchange — Provider Semantic Rollout Skew and Endpoint-Qualified Authorization Semantics

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select an IAM/provider technology, authorize product work, reopen G3, or define executable architecture.

## 1. Research question

Prior G4 research established that heterogeneous delegation proofs depend on mutable provider semantics and that `mapping unchanged != mapping proof current`. The next unresolved boundary is rollout skew: a provider may distribute authorization changes gradually across regions, accounts, resource providers, caches, control-plane views and effect/data-plane enforcement points.

The question is:

> What evidence proves which authorization semantics actually govern the endpoint where a protected effect is committed when provider rollout is asynchronous, scoped or temporarily divergent?

Core boundary:

`provider semantic change declared != change effective everywhere`.

And conversely:

`control-plane/catalog says old != effect plane necessarily old`.

## 2. Evidence reviewed

Primary/current documentation used in this round:

- Google Cloud IAM access-change propagation: IAM access changes are eventually consistent; recent grants/denies may not be effective everywhere immediately. <https://docs.cloud.google.com/iam/docs/access-change-propagation>
- Google Cloud IAM overview: IAM API reads can return older data and access checks can lag writes. <https://docs.cloud.google.com/iam/docs/overview>
- Google Cloud IAM role model: predefined roles are provider-maintained and automatically updated as permissions/features/services evolve. <https://docs.cloud.google.com/iam/docs/choose-role-type>
- Google Cloud IAM permission change log: provider permission/role universe changes over time. <https://docs.cloud.google.com/iam/docs/permissions-change-log>
- AWS IAM troubleshooting: IAM uses eventual consistency; changes take time to become visible across endpoints, replication zones and Regions, and caching can extend delay. AWS explicitly recommends verifying propagation before production workflows depend on changes. <https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot.html>
- AWS Account Management Regions: IAM data/credentials are propagated when opt-in Regions are enabled; enabling can take minutes to hours, and a Region may report enabled while some services are not immediately usable. AWS partitions have independent IAM instances. <https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-regions.html>
- AWS fault-isolation guidance: global-service data planes can be regionally isolated while a single control plane remains a distinct dependency; static stability is recommended for resilient workloads. <https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/global-services.html>
- Azure RBAC troubleshooting: role assignment changes can take minutes to propagate; management-group DataActions may take hours to reach data planes; managed-identity membership caches can last much longer. <https://learn.microsoft.com/en-us/azure/role-based-access-control/troubleshooting>
- Azure ABAC troubleshooting: conditions are propagated to resource providers and local caches; enforcement may lag the role-assignment change. <https://learn.microsoft.com/azure/role-based-access-control/conditions-troubleshoot>
- Prior G4 artifacts on semantic-mapping proof, provider semantic drift, complete mediation, effect-path discovery, capability envelopes, offline delegation, evidence currentness and selective invalidation.

These are benchmark/failure evidence only; none is selected.

## 3. Material finding: provider semantics need an enforcement locus

A provider semantic snapshot is insufficient if it does not say where the semantics were observed or are claimed to apply.

Candidate concept:

`ProviderSemanticLocus = {provider, partition/sovereign domain, account/tenant, region/location, service/resource-provider, endpoint/effect plane, policy plane, relevant resource scope}`.

Therefore:

`same provider + same role + same policy text != same effective semantics at every locus during rollout`.

A proof used for a protected effect should bind the locus that actually enforces or commits that effect, not merely a global provider name.

## 4. Control-plane observation is not effect-plane proof

Provider systems commonly separate configuration/control planes from service/effect/data planes. Documentation from Google, AWS and Azure demonstrates that a successful policy write or a control-plane read does not imply immediate enforcement everywhere.

Core rule:

`policy accepted != policy effective at target effect locus`.

This extends the existing G4 rule `Provider ACK != effective state` into authorization semantics.

A control-plane snapshot remains valuable provenance and intent evidence. It is not automatically evidence of effect-plane convergence.

## 5. Rollout state is not one global revision

During propagation, two endpoints can legitimately enforce different semantic states without either endpoint being corrupt.

Candidate `ProviderSemanticRolloutState` dispositions:

- `DECLARED_NOT_OBSERVED`
- `OBSERVED_AT_LOCUS`
- `EFFECTIVE_AT_LOCUS`
- `PARTIALLY_PROPAGATED`
- `CONFLICTED_OBSERVATION`
- `UNKNOWN`
- `SUPERSEDED_AT_LOCUS`

A global scalar such as `providerRevision=42` would erase this distinction.

`one provider revision != one simultaneous global enforcement state`.

## 6. Scope dimensions are material

Rollout skew may be scoped by:

- partition/sovereign cloud;
- account/tenant/organization;
- region/location;
- service/resource provider;
- resource hierarchy;
- principal/session/cache cohort;
- feature/launch stage;
- API version or endpoint generation;
- canary/ring/percentage rollout;
- control-plane vs effect/data-plane implementation.

These dimensions are not all globally ordered. A proof therefore needs a qualified locus/scope, not an invented total ordering.

## 7. Endpoint-qualified evidence

Candidate evidence classes:

1. **Provider declaration evidence** — release notes, permission logs, rollout notices.
2. **Control-plane observation evidence** — role/policy/catalog reads at a named locus.
3. **Effect-plane authorization evidence** — actual allow/deny result at the endpoint responsible for the protected effect.
4. **Counterexample evidence** — two loci or two observations disagree under equivalent declared inputs.
5. **Propagation-completion evidence** — provider-qualified statement that a named scope has converged, when available.
6. **Inspection-gap evidence** — inability to establish which semantic state a locus enforces.

No class is universal authority.

`effect probe at locus A != proof for locus B`.

And:

`catalog current at control plane != effect plane converged`.

## 8. Effect-plane probes are strong but bounded

A live authorization/effect probe at the same enforcement locus can provide stronger currentness evidence than a remote catalog read, but it remains scoped to tested principal/resource/context/action and may itself traverse caches or alternate paths.

`one successful deny probe != universal deny semantics proven`.

A counterexample, however, is strong defeating evidence: if the supposedly attenuated target authority performs a protected effect outside source authority at the relevant locus, the mapping proof is defeated for that scope.

## 9. Rollout skew changes currentness semantics

Currentness becomes locus-qualified:

`Current(provider semantics, locus L, effect E, context C, horizon H)`.

A runtime can possess fresh evidence for region/account A and stale or unknown evidence for B.

Therefore:

`current somewhere != current where effect occurs`.

This is especially material when failover, routing or provider callbacks can move the commitment locus after admission.

## 10. Routing/failover is a semantic dependency when loci diverge

If traffic can be routed to multiple provider loci with different rollout states, route selection becomes part of the semantic proof.

`same logical provider endpoint != same enforcement locus`.

A failover from A to B may require requalification even when API/interface/credential are unchanged. Conversely, if provider evidence proves semantic equivalence across the failover set, the same mapping proof may remain reusable.

Candidate relation:

`EffectRouteSetRef -> {ProviderSemanticLocusRef...} -> qualified semantic state/evidence`.

## 11. Revocation and permission reduction require stricter treatment

Propagation delay is most dangerous when semantics become more restrictive: revocation, deny, boundary tightening or privilege removal can be visible in one plane while old authority remains effective elsewhere.

Thus:

`revocation configured != revocation effective at every effect locus`.

For high-risk protected effects, the relying contract may require target-locus confirmation, an independently enforced fence/mediation, or suspension until the relevant horizon closes.

Availability pressure cannot turn uncertain revocation propagation into `ALLOW`.

## 12. Permission expansion is also material

A provider rollout can broaden authority first at only part of the fleet. A mapping proof that assumes the old narrower semantics may remain safe at some loci and become invalid at others.

`new permission effective at one locus != mapping globally defeated`.

Selective requalification follows the reachable route/locus set and protected effect dependencies rather than flushing all provider proofs.

## 13. Mixed provider generations are representable

A rollout may create a mixed-generation window:

- control plane exposes semantic generation S2;
- endpoint A enforces S2;
- endpoint B still enforces S1;
- simulator/catalog may represent S2 while a service-local cache remains S1.

G4 should preserve this as evidence rather than fabricate convergence.

`mixed provider generation != provider corruption by definition`.

But:

`mixed provider generation + route ambiguity -> mapping currentness may be UNKNOWN`.

## 14. No provider-global semantic clock

Wall-clock timestamps, release dates or changelog publication times do not create a provider-wide linearization point.

`published at t != effective everywhere at t`.

`observed later != semantically newer everywhere`.

Provider-local version identifiers may be useful when their scope is explicit; they must not be promoted into a synthetic platform revision.

## 15. Autonomous runtime hypothesis

An autonomous runtime may retain:

- last qualified semantic evidence per relevant locus/scope;
- a monotonic local provider-semantic floor;
- allowed stale/currentness horizons per protected effect;
- route/locus constraints;
- defeating/counterexample evidence;
- fallback behavior when a target locus is unknown.

It does not need Builder, Exchange Plane or a central scanner on every effect.

However:

`offline runtime + mutable remote provider != indefinite semantic certainty`.

If the runtime cannot establish that its possible effect loci remain within the proof's admissible horizon, it lowers the affected disposition rather than assuming convergence.

## 16. Rejoin and refresh

When connectivity/inspection returns, refresh is not simply `take latest catalog`.

Candidate sequence:

1. identify relevant effect loci/routes;
2. collect locus-qualified provider evidence;
3. compare against locally retained floors and proof dependencies;
4. preserve conflicting observations;
5. requalify affected mapping proofs selectively;
6. reconcile effects produced during stale/unknown windows;
7. advance floors only on qualified evidence.

`connectivity restored != semantic rollout reconciled`.

## 17. Portability and exit path

The model is provider-independent because it does not require AWS Regions, Google locations or Azure resource providers as universal primitives. Portable concepts are:

- semantic locus;
- route/effect locus set;
- observation scope;
- rollout/currentness disposition;
- provider-semantic floor/horizon;
- propagation/completion evidence;
- inspection gaps and conflicts.

Provider-specific region/account/partition/resource-provider identifiers remain evidence payloads behind those concepts.

Replacing a provider changes evidence adapters and locus taxonomy, not the business authority owner or protected-effect semantics.

## 18. Candidate primitives

Research vocabulary only:

```text
ProviderSemanticLocusRef
ProviderSemanticObservationRef
ProviderSemanticRolloutRef
ProviderSemanticRolloutDisposition
ProviderSemanticConvergenceEvidenceRef
EffectRouteSetRef
EffectEnforcementLocusRef
LocusQualifiedCurrentnessRef
ProviderSemanticConflictRef
ProviderPropagationHorizonRef
ProviderSemanticRequalificationRef
```

These are not schemas, components or implementation commitments.

## 19. Proof obligations

1. **Effect-locus binding:** mapping proof identifies the locus/set where protected effects can be committed.
2. **No global simultaneity assumption:** provider semantic change is not assumed effective everywhere at publication/write time.
3. **Control/effect-plane separation:** control-plane acceptance/readback does not prove effect-plane enforcement.
4. **Scoped currentness:** semantic currentness is qualified by provider/account/partition/region/service/resource/effect scope where material.
5. **Route closure:** every reachable effect locus is covered by admissible evidence or represented as unknown/incompatible.
6. **Failover requalification:** route/failover changes cannot silently move effects to an unqualified locus.
7. **Revocation effectiveness:** configured revocation/deny is not treated as effective until required target-locus evidence/fence exists.
8. **Expansion detection:** authority expansion at any reachable locus triggers selective mapping requalification.
9. **No catalog oracle:** catalog/simulator/control-plane state is evidence, not universal live semantics.
10. **Probe qualification:** effect-plane probes bind principal/resource/context/action/locus/time/path and do not overclaim universality.
11. **Counterexample defeat:** observed out-of-authority effect at a relevant locus defeats containment for affected scope.
12. **Mixed-generation representation:** S1/S2 coexistence remains explicit rather than collapsed to one provider revision.
13. **Conflict preservation:** contradictory locus observations remain contested/unknown until qualified reconciliation.
14. **No timestamp winner:** wall-clock recency alone cannot select semantic truth across loci.
15. **Provider-floor monotonicity:** restore/restart cannot roll local knowledge below an already qualified semantic/security floor.
16. **Horizon boundedness:** stale provider semantics are usable only within declared effect-specific horizons.
17. **Selective invalidation:** rollout drift invalidates only materially dependent proofs/routes/effects.
18. **Autonomous runtime:** central Builder/Exchange Plane/scanner is not mandatory for every effect when local evidence is sufficient.
19. **Inspection-gap preservation:** inaccessible loci remain `UNKNOWN/PARTIAL`, never inferred equivalent.
20. **Partition isolation:** provider partitions/sovereign domains are not merged into one semantic namespace without evidence.
21. **Account/tenant qualification:** account-specific rollout or policy layers remain part of proof scope.
22. **Historical lineage:** effect evidence retains which locus-qualified semantic proof supported the effect.
23. **Rejoin reconciliation:** refresh reconciles mixed/unknown windows and effects rather than merely replacing cached metadata.
24. **Provider portability:** locus/evidence vocabulary survives provider replacement without making provider topology business truth.

## 20. Adversarial cases

1. Provider publishes S2 globally; region A enforces S2 while B still enforces S1.
2. Control-plane read returns S2 while target service cache still enforces S1.
3. Simulator returns deny under S2 while live effect endpoint still allows under S1.
4. Revoked role is absent from catalog but cached effect-plane authorization still permits action.
5. New permission appears in managed role first for one account cohort.
6. Canary rollout expands an old permission's effect set for 5% of accounts.
7. Failover moves traffic from qualified region A to unknown region B.
8. Global load balancer changes route after admission but before effect commitment.
9. Provider callback originates from a different semantic locus than request ingress.
10. AWS opt-in Region reports enabled while a required service is not fully provisioned.
11. Runtime treats partition `aws` evidence as proof for `aws-cn`/`aws-us-gov` equivalent semantics.
12. Azure control-plane assignment exists while DataActions remain stale in a downstream data plane.
13. Google IAM policy write succeeds while an access check still reflects prior state.
14. Runtime uses changelog publication timestamp as a global cutover instant.
15. Scanner samples one region and labels provider globally current.
16. Two endpoints disagree and latest timestamp is selected as semantic truth.
17. Provider rollback restores S1 at one locus below a locally retained S2 floor.
18. Offline runtime keeps high-risk effects enabled after locus-specific horizon expires.
19. Route set expands dynamically to a new region without mapping-proof requalification.
20. Region-specific service/API version exposes a mutating operation absent elsewhere.
21. Account-specific preview feature broadens authority while global catalog omits it.
22. Resource-provider cache refresh lags identity-plane refresh.
23. Deny propagates slower than allow and system assumes symmetric rollout.
24. Allow propagates slower than deny and availability logic incorrectly treats failure as incompatibility rather than propagation state.
25. Provider declares convergence but live counterexample demonstrates old semantics at one relevant locus.
26. Central scanner says stale while runtime has newer authenticated target-locus evidence and unnecessarily stops all work.
27. Central scanner says current while runtime has local defeating evidence and ignores it.
28. Rejoin replaces mixed-generation evidence with one latest snapshot and loses effects produced under S1.

## 21. Technology-independent decision rule

A heterogeneous authorization mapping proof may be reused for a protected effect only when:

1. every possible effect commitment locus is known or conservatively bounded;
2. each reachable locus has semantic evidence admissible for the effect's required currentness/floor;
3. route/failover behavior cannot silently select an uncovered locus;
4. control-plane/catalog observations are not promoted to effect-plane convergence without evidence;
5. conflicting/partial rollout remains representable;
6. stale use is explicitly bounded by an effect-specific propagation/currentness horizon;
7. provider drift triggers selective requalification rather than a global provider/platform barrier.

Otherwise the disposition becomes `REQUALIFICATION_REQUIRED`, `PARTIAL/UNKNOWN`, mediated, stale-within-horizon where explicitly allowed, or incompatible.

## 22. Trade-offs

- **Target-locus probes:** stronger evidence of current enforcement, but costly, incomplete and potentially side-effectful unless a safe authorization-check path exists.
- **Provider catalogs/changelogs:** cheap and broad, but may describe intended/current control-plane semantics rather than effect-plane convergence.
- **Conservative propagation windows:** simple and portable, but can reduce availability and still rely on provider timing assumptions.
- **Independent mediation/fencing:** can close high-risk rollout gaps, but adds operational complexity and itself requires complete-mediation proof.
- **Pinned route sets:** improve proof stability, but reduce failover flexibility.
- **Dynamic failover:** improves resilience, but expands the semantic-locus universe requiring qualification.
- **Central scanners:** improve fleet visibility, but cannot become mandatory semantic authority for autonomous runtimes.
- **Local evidence:** preserves autonomy and captures target-specific defeating evidence, but requires durable floor/horizon/reconciliation logic.

## 23. Deduplication

This round does not reopen:

- generic provider semantic drift;
- generic IAM eventual consistency;
- cross-runtime split-brain generally;
- transport routing generally;
- offline security floors generally;
- effect-path discovery generally;
- complete mediation generally;
- provider selection.

The material delta is specifically:

`provider semantic drift -> rollout may be non-simultaneous/scoped -> semantic locus/effect-plane qualification -> route-set closure -> mixed-generation provider state -> locus-specific floors/horizons/requalification without global provider revision or central oracle`.

## 24. Saturation / maturity

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

This gap materially changes the proof boundary: a provider-semantic snapshot now needs a locus/effect-plane qualification when rollout skew is possible. New evidence that merely demonstrates another provider's eventual consistency without changing locus, route, currentness or proof obligations should be absorbed without a new macrofront.

## 25. Next highest-value gap

**Cross-locus effect authorization under route indeterminacy and provider-managed failover.**

Research how to preserve a mapping/effect guarantee when the final provider commitment locus is selected after admission or hidden behind provider-managed global endpoints, including opaque routing, retries that land on another locus, multi-region active/active, callbacks and provider-internal failover. Determine when a guarantee can rely on a qualified equivalence class of loci versus requiring target-side mediation/fencing, and how to represent `UNKNOWN` without forcing a global routing oracle or disabling autonomous runtimes unnecessarily.
