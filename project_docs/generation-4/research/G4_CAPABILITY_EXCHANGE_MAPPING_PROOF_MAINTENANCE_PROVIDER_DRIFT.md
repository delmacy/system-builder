# G4 Capability Exchange — Mapping-Proof Maintenance Under Provider Semantic Drift

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select an IAM/provider technology, authorize product work, reopen G3, or define executable architecture.

## 1. Research question

Previous G4 research established that heterogeneous delegation is a directional containment proof over effective authority and that `mapping unchanged != mapping proof current`. The unresolved boundary is maintenance when a provider changes managed roles, permission catalogs, resource-policy layers, API/effect semantics, condition behavior, or evaluation rules without any local artifact revision.

The question is:

> What evidence lets an autonomous runtime continue to rely on a prior semantic-mapping proof, selectively requalify it, or conservatively lower its disposition when provider semantics can drift outside the runtime's release cycle?

Core boundary:

`local artifact unchanged != external authorization semantics unchanged`.

## 2. Evidence reviewed

Primary/current documentation used in this round:

- Google Cloud IAM permissions change log. It records additions/removals/support changes to public permissions and changes to predefined/service-agent roles. The week of 2026-09-15, for example, records new permissions and additions to predefined roles. Source: <https://docs.cloud.google.com/iam/docs/permissions-change-log>.
- Google Cloud guidance on role types. Predefined roles are maintained by Google and updated automatically as permissions/features/services are added; custom roles are not automatically expanded when new permissions appear. Source: <https://docs.cloud.google.com/iam/docs/choose-role-type>.
- Google Cloud product access-control documentation gives the same operational rule for predefined roles: provider-maintained roles may receive permissions as product features evolve. Example: Cloud Logging access control. Source: <https://docs.cloud.google.com/logging/docs/access-control>.
- AWS Service Authorization Reference. Provider action vocabularies include action-to-operation relationships, resource types, condition keys and access levels; one IAM action can control more than one operation and some operations require multiple actions. Sources: <https://docs.aws.amazon.com/service-authorization/latest/reference/list_service-catalog.html> and service-specific reference pages.
- Prior G4 artifacts on semantic policy diff, provider permission-universe binding, complete mediation, effect-path discovery, effect-capability envelopes, offline delegation and heterogeneous semantic-mapping proof.

These are benchmark/failure evidence only; none is selected.

## 3. Material finding: provider semantics are an external dependency with their own revision horizon

A mapping proof is not fully determined by local mapping code, credential text or role name. It depends on an external semantic surface that may evolve independently.

Candidate dependency set:

`ProviderSemanticSurface = {permission universe, managed-role expansion, action->operation relation, resource universe, condition keys/semantics, deny/allow composition, inheritance/resource-policy behavior, principal/session behavior, meta-capabilities, API effect taxonomy}`.

Therefore:

`same role name + same local adapter + same credential != same reachable effect set`.

Google Cloud provides direct operational evidence: predefined roles are provider-maintained and automatically updated, while custom roles do not automatically gain newly introduced permissions. The permissions change log records concrete role/permission additions. This is not an edge case; it is a normal lifecycle property of managed authorization surfaces.

## 4. Stable identifiers are not semantic versions

A provider-managed role identifier is an alias to current provider semantics, not necessarily an immutable semantic snapshot.

`stable role ID != immutable role semantics`.

Likewise, a permission/action identifier is not sufficient if the operation/effect relation, resource applicability or condition semantics can change.

Candidate primitive: `ProviderSemanticSnapshotRef`, qualified by what was actually observed or attested rather than by a mutable provider name alone.

A snapshot may include hashes/digests of role membership, permission catalogs, resource/condition metadata, policy-composition profile and provider/API revision evidence where available. A digest proves equality to captured material, not correctness or completeness of the provider's undocumented semantics.

`catalog hash stable != undocumented behavior proven stable`.

## 5. Change detection is multi-source evidence, not one oracle

No single source is sufficient in the general case.

Candidate evidence classes:

1. **Authoritative provider declarations** — changelogs, role metadata, permission/action catalogs, release notes, API descriptions.
2. **Snapshot/diff evidence** — periodic captures of managed-role membership, permission catalogs, condition/resource metadata and policy layers.
3. **Differential probe/simulator evidence** — targeted counterexample search against representative principals/resources/contexts.
4. **Runtime effect evidence** — observed authorization decisions/effects that can reveal a changed reachable-effect set.
5. **Attestation/contract evidence** — provider statements about versioned semantics or compatibility, when available.
6. **Negative/unknown evidence** — inability to inspect or probe a material semantic layer.

Core rule:

`provider changelog complete enough for operations != complete semantic proof`.

Changelogs may lag, omit undocumented behavior, aggregate multiple changes or describe syntax rather than business effect. Conversely, runtime observation only proves observed behavior and cannot establish non-existence of unexercised permissions.

## 6. Managed role drift and custom-role pinning are different risk profiles

Provider-managed roles trade operational convenience for an externally mutable authority set. Custom/pinned roles can reduce automatic permission-set expansion, but they do not freeze the provider's action semantics, resource model, condition evaluation or policy-composition rules.

Therefore:

`custom role membership pinned != provider authorization semantics pinned`.

A local system may choose to represent these as different drift profiles, but research does not select either model.

Candidate `ProviderSemanticDriftProfile` dimensions:

- managed permission membership mutable/immutable;
- action/effect relation stability;
- resource-universe growth;
- condition-key/evaluation stability;
- policy-layer/composition stability;
- meta-capability growth;
- inspection completeness;
- provider notification/change-log quality;
- offline requalification horizon.

## 7. Permission-universe growth is not uniformly dangerous

A new permission does not automatically defeat every proof. The material question is whether it becomes reachable through the mapped target authority or changes a protected effect/resource/context relation.

`provider changed != global mapping invalidation`.

Candidate selective rule:

- if a new permission is not reachable by the target role/policy/meta-capability closure and does not alter material evaluation semantics, existing proof may remain qualified;
- if a managed role gains the permission, or a broad wildcard now covers it, or a meta-capability can acquire it, requalification is required for affected protected effects;
- if semantic relevance cannot be determined, disposition lowers to `UNKNOWN/PARTIAL` for affected scope rather than assuming safety.

This preserves scalability and autonomous operation without turning every provider release into a platform-wide stop-the-world event.

## 8. Wildcards and future API growth are semantic liabilities

A wildcard such as provider-specific `service:*`, broad resource selectors, or managed administrative roles can automatically encompass future operations/resources.

Thus:

`wildcard evaluated safely yesterday != bounded authority tomorrow`.

A mapping proof involving an open-ended selector needs an explicit future-growth rule. Candidate dispositions include:

- bounded offline use only while a provider-semantic horizon remains valid;
- explicit deny/boundary/mediation that structurally excludes unknown future protected effects;
- requalification on permission-universe growth;
- incompatibility for guarantees that require a closed authority set but cannot obtain one.

## 9. Action-to-effect mapping can drift independently of permission membership

AWS Service Authorization Reference documents that one action may govern more than one operation and some operations require multiple actions. This shows why permission-name membership alone is not the semantic boundary.

A provider can add a new API operation controlled by an existing permission, or change resource/condition applicability without adding a new permission to a role.

Therefore:

`role membership unchanged != reachable effect set unchanged`.

The proof dependency must include the qualified action/permission-to-protected-effect mapping, not merely the list of permission labels.

## 10. Conservative floors without central-oracle dependence

Autonomous runtimes need a locally durable minimum semantic-security state analogous to prior G4 security/profile floors.

Candidate `ProviderSemanticFloor` is not a claim that the runtime knows the latest provider state. It records the minimum provider-semantic revision/evidence set below which the runtime must not roll back.

`meets local floor != globally latest`.

A runtime may continue within a declared horizon when its locally retained proof and provider-semantic evidence remain admissible. Once that horizon expires, or a material drift signal exceeds the retained proof scope, affected effects degrade to requalification-required/unknown rather than silently continuing.

`offline autonomy != indefinite trust in mutable provider semantics`.

No Builder or central Exchange Plane is required for every effect; sufficient evidence can be packaged with the runtime and refreshed through replaceable mechanisms.

## 11. Change signals have different evidentiary strength

Candidate signal classes:

- `DECLARED_CHANGE`: provider states a semantic/catalog/role change;
- `OBSERVED_DIFF`: captured provider metadata differs;
- `BEHAVIORAL_COUNTEREXAMPLE`: probe/runtime evidence demonstrates prior containment no longer holds;
- `ATTESTED_STABILITY`: provider-qualified statement covers a semantic scope/horizon;
- `INSPECTION_GAP`: required surface cannot be observed;
- `SILENCE`: no signal received.

Crucially:

`SILENCE != ATTESTED_STABILITY`.

A missed feed, unavailable API or absent changelog entry cannot be converted into proof of no drift.

## 12. Requalification should be dependency-selective

Candidate lineage:

`MappingProof -> ProviderSemanticSnapshot -> role/policy inputs -> permission/effect relations -> protected effects`.

When drift occurs, requalification follows material dependency edges. A Logging Viewer role change should not invalidate an unrelated storage mapping unless they share a relevant provider-semantic dependency.

This extends prior G4 cache/revocation principles:

`dependency changed != global flush`.

A central dependency index may accelerate discovery but cannot become the only semantic authority. Runtimes retain enough local lineage to know whether their own proofs are affected within declared horizons.

## 13. Differential probes are counterexample finders, not equivalence proofs

Provider simulators and live probes can discover semantic drift, especially where documentation is incomplete. But finite probes cannot establish universal containment over an open resource/context universe.

`no differential mismatch observed != semantic equivalence proven`.

Probe evidence must bind:

- provider/account/tenant/environment;
- principal and policy state;
- resource/context sample universe;
- tested actions/effects;
- time/currentness;
- simulator/live path identity;
- unsupported dimensions.

A found counterexample is strong defeating evidence. Absence of one is bounded qualification evidence only.

## 14. Opaque provider behavior requires explicit uncertainty

Some providers will not expose a complete permission lattice, role revision history, policy evaluator, or machine-readable action/effect catalog. G4 must not force a universal authorization language or invent precision.

Possible qualified outcomes:

- `CURRENT_PROVEN` — proof dependencies are sufficiently current for declared scope;
- `CURRENT_MEDIATED` — missing provider restriction is restored by independently qualified complete mediation;
- `STALE_WITHIN_HORIZON` — provider semantics may have advanced, but bounded stale use is explicitly allowed for this effect class;
- `REQUALIFICATION_REQUIRED` — a material drift/change signal defeats reuse;
- `PARTIAL/UNKNOWN` — provider surface is materially opaque;
- `INCOMPATIBLE` — required containment cannot be established.

`opaque != compatible by default`.

## 15. Proof artifact hypothesis

Candidate primitives, not schemas/APIs:

```text
ProviderSemanticSnapshotRef
ProviderSemanticFloorRef
ProviderSemanticDriftProfileRef
ProviderSemanticChangeEvidenceRef
ManagedRoleSnapshotRef
PermissionUniverseSnapshotRef
ActionEffectMappingRef
ProviderSemanticHorizonRef
MappingProofRequalificationRef
ProviderInspectionGapRef
```

A mapping-proof record may need to bind these refs alongside the existing source authority, target permission model, protected-effect set, currentness vector and limitations.

## 16. Proof obligations

Candidate obligations refined in this round:

1. **External semantic dependency:** mapping proof explicitly names provider semantic surfaces material to containment.
2. **No stable-name inference:** stable role/permission identifiers never substitute for immutable semantic revision evidence.
3. **Managed-role currentness:** provider-managed role membership is current/qualified for the declared horizon.
4. **Permission-universe binding:** proof scope names the permission/API universe it covers.
5. **Action-effect binding:** action/permission labels are mapped to protected effects under a qualified provider semantic profile.
6. **Resource growth handling:** new resource types/hierarchy relations cannot silently broaden target authority.
7. **Condition evolution handling:** new/changed condition keys or error semantics trigger requalification when material.
8. **Policy-composition handling:** deny/allow/resource/session/boundary semantics are dependencies, not assumed constants.
9. **Meta-capability closure:** provider drift that adds privilege-acquisition edges is included.
10. **Wildcard future-growth rule:** open-ended selectors have an explicit requalification/mediation/horizon rule.
11. **Selective invalidation:** only proofs materially dependent on changed semantics are lowered/requalified.
12. **No silence proof:** absence of a provider change signal is not proof of stability.
13. **Changelog qualification:** provider release notes/changelogs are evidence with declared completeness limits.
14. **Probe qualification:** differential probes/simulators are bounded counterexample evidence, not universal semantic oracles.
15. **Counterexample defeat:** observed target effect outside source authority defeats attenuation for the affected scope immediately subject to evidence authenticity.
16. **Inspection-gap preservation:** inaccessible/opaque semantic layers remain `UNKNOWN/PARTIAL` rather than fabricated equivalence.
17. **Floor monotonicity:** restart/restore cannot roll a runtime below a provider-semantic floor it already observed.
18. **Offline boundedness:** autonomous operation uses explicit provider-semantic horizons rather than indefinite cached trust.
19. **No central oracle:** Builder/Exchange Plane/provider scanner may distribute evidence but is not mandatory semantic authority for each effect.
20. **Provider portability:** proof vocabulary survives provider replacement; provider-specific catalogs remain evidence inputs.
21. **Adapter non-authority:** adapter can normalize evidence and detect drift but cannot declare unsupported semantics equivalent.
22. **Historical lineage:** effect evidence can identify which provider-semantic snapshot/mapping proof supported an effect without making that snapshot canonical business truth.
23. **Version-skew representation:** old/new provider semantics can coexist as qualified states; there is no fabricated global provider revision.
24. **Failure representability:** stale, contested, unknown, partially inspected and incompatible mapping states remain representable.

## 17. Adversarial cases

1. Managed role gains a new mutating permission; local role name and adapter are unchanged.
2. New API operation is controlled by an old broad permission.
3. Permission list is unchanged but resource applicability expands.
4. New resource type becomes covered by an existing wildcard.
5. Condition key changes meaning while policy text remains identical.
6. Unknown-condition behavior changes from fail-closed to fail-open.
7. Resource-policy evaluation changes while identity role membership is stable.
8. Session-principal semantics change and bypass a boundary assumed by the mapping.
9. New meta-permission enables impersonation/bind/mint through an existing managed role.
10. Provider changelog records a permission addition but runtime ignores it because no local artifact changed.
11. Changelog is unavailable and absence is treated as no change.
12. Provider announces a change after it is already effective; runtime backdates false certainty.
13. Scanner captures role membership but omits resource policies.
14. Scanner lacks privilege to inspect one policy layer and reports an empty set.
15. Differential simulator says deny while live provider allows via unsupported policy layer.
16. Finite probes miss a resource/context combination that broadens authority.
17. Wildcard policy automatically includes a future destructive action.
18. Custom role membership is pinned, but old permission acquires a new mutating operation.
19. Runtime restores a snapshot below a previously observed provider-semantic floor.
20. Offline runtime keeps high-risk effects enabled indefinitely after its semantic horizon expires.
21. Central scanner outage stops all runtimes despite locally sufficient evidence.
22. Central scanner says current but autonomous runtime has newer local defeating evidence.
23. Provider A changes semantics and global invalidation unnecessarily flushes provider B proofs.
24. Adapter silently maps newly unknown provider behavior to previous known semantics.
25. Managed role revision differs by cloud region/account rollout while proof assumes global simultaneity.
26. Provider rollback reintroduces older semantics below a locally retained floor.
27. API catalog changes but generated SDK remains old, hiding a reachable direct provider path.
28. Documentation describes permission syntax correctly but omits a business-significant side effect of the operation.

## 18. Technology-independent decision rule

A prior heterogeneous mapping proof may remain reusable only when the relying contract has qualified evidence that:

1. provider semantic dependencies material to the protected effect remain within the proof's declared snapshot/horizon;
2. no observed or declared drift expands the target reachable-effect/resource/context set beyond source authority;
3. opaque/uninspected changes remain represented as uncertainty;
4. provider-specific changes trigger selective requalification rather than global invalidation;
5. locally retained floors prevent rollback while bounded offline horizons prevent indefinite stale trust.

Otherwise the disposition lowers to mediated, stale-within-horizon, requalification-required, partial/unknown or incompatible as appropriate.

## 19. Trade-offs

- **Managed roles:** easier operations and provider alignment, but externally mutable authority membership.
- **Custom/pinned roles:** tighter membership control, but maintenance burden and no guarantee that underlying permission semantics remain frozen.
- **Polling/catalog snapshots:** better drift visibility, but provider/API cost and no proof of undocumented semantics.
- **Changelog subscriptions:** low operational cost, but not a semantic-completeness oracle.
- **Differential probing:** useful for counterexamples and opaque surfaces, but incomplete and potentially expensive/rate-limited.
- **Conservative horizons/floors:** preserve safety/autonomy, but can reduce availability during prolonged provider-evidence outages.
- **Central evidence service:** efficient distribution, but dangerous if promoted to semantic authority or runtime hard dependency.

## 20. Portability / exit path

The portable asset is not an AWS/Google/Azure role model. It is the proof obligation vocabulary: protected effects, source authority, target effective authority, provider semantic snapshots, change evidence, floors/horizons, unknown states and selective requalification lineage.

A provider can be replaced when another provider can supply or mediate evidence sufficient for the same declared guarantee. Provider-specific role/action catalogs remain replaceable inputs rather than canonical business semantics.

## 21. Deduplication against existing G4 research

This round does not reopen generic semantic-policy diff, effect-path discovery, privilege drift, offline revocation, evidence caching, or the base heterogeneous mapping proof. The material delta is narrower:

`heterogeneous mapping proof -> externally mutable provider semantic surface -> multi-source drift evidence -> selective proof requalification + local floors/horizons -> autonomous operation without provider-doc/scanner oracle`.

## 22. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

This round materially changes proof maintenance and workload assumptions: mapping proof is now explicitly dependent on externally mutable provider semantics, with selective requalification and bounded offline operation rather than immutable role-name assumptions.

Next highest-value gap:

**provider semantic rollout skew and regional/account-specific divergence** — how mapping proofs remain safe when provider changes are gradually rolled out, canary/account/region scoped, undocumented in timing, or temporarily inconsistent across control/data planes; how to bind observed semantics to the actual effect endpoint without fabricating a provider-global revision or requiring central synchronization.
