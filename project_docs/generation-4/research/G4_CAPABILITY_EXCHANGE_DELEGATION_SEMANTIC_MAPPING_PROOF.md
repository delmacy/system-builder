# G4 Capability Exchange — Delegation Semantic-Mapping Proof Across Heterogeneous Permission Models

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select an IAM/policy engine, authorize product work, reopen G3, or define an executable architecture.

## 1. Research question

Previous G4 research established that a delegated effect capability must remain no stronger than its qualified source authority, that attenuation and current revocation are independent proof domains, and that a target-domain re-authorization is not the same thing as attenuation.

The next unresolved boundary is semantic translation. A source capability may be represented as a scope/condition/resource predicate while the target provider exposes roles, actions, ACL entries, resource policies, deny rules, session constraints, hierarchical inheritance, or opaque provider-specific permission semantics.

The question is therefore not merely whether a source token can be converted into a target credential. It is:

> Under what evidence can a consumer conclude that every target effect admitted by a translated capability is contained within the effects permitted by the qualified source capability, for the declared subject/actor/resource/tenant/time/context universe?

Core boundary:

`protocol/credential translation != semantic authority translation proof`.

## 2. Evidence reviewed

Primary/current documentation used in this round:

- AWS IAM policy evaluation logic and permissions boundaries: identity/resource policies can combine by union in some contexts, boundaries/session/SCP/RCP constraints interact by intersection in others, and explicit deny overrides allow. Resource-based grants to some session principals can bypass an implicit deny that a simplistic boundary model would assume applies. Sources: <https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_policy-eval-denyallow.html>, <https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html>.
- AWS IAM Policy Simulator: useful counterexample/testing evidence but explicitly not guaranteed to match every live environment and has coverage limitations. Source: <https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html>.
- Google Cloud IAM deny policies and policy evaluation: deny is a distinct policy type, inherited by resource hierarchy; an unevaluable deny condition is treated as deny. Policy changes are eventually consistent. Sources: <https://docs.cloud.google.com/iam/docs/deny-overview>, <https://docs.cloud.google.com/iam/docs/policy-types>.
- Google Cloud Principal Access Boundary (PAB): constrains resource eligibility but does not itself grant access; enforcement coverage is versioned and permissions outside the enforcement version are not blocked. Sources: <https://docs.cloud.google.com/iam/docs/principal-access-boundary-policies>, <https://docs.cloud.google.com/iam/docs/pab-blocked-permissions>.
- Prior G4 artifacts on contract compatibility, semantic policy diff/proof, proof-carrying policy verification, multi-domain invalidation, complete mediation, effect-path discovery, capability-envelope privilege drift and offline delegation attenuation/revocation.

These systems are benchmarks/failure evidence only; none is selected.

## 3. Material finding: translation is an implication proof, not a name mapping

A safe attenuation claim between heterogeneous models is directionally stronger than syntactic subset testing.

Let `S(x,c)` mean that source authority permits protected effect `x` in material context `c`, and `T(x,c)` mean that the translated target capability can produce `x` in that context. For the declared proof scope, attenuation requires the implication:

`T(x,c) => S(x,c)`.

Equivalently, there must be no material witness for:

`T(x,c) AND NOT S(x,c)`.

This is intentionally directional. The target may be strictly weaker than the source without violating attenuation. Equality is unnecessary unless the interaction contract separately requires semantic equivalence.

Therefore:

`target grants subset by labels != target semantic effect set is subset`.

A source `read` scope and a target `Reader` role are not comparable until their effect/resource/context semantics are qualified. Likewise, a target role containing fewer named permissions may still be stronger if its permissions address a wider resource universe, bypass a condition, enable impersonation, or acquire another capability.

## 4. Effective authority is a composed policy, not an isolated role

AWS and Google Cloud provide concrete evidence that effective permissions arise from composition laws that vary by policy type and principal/resource context. A translation proof that compares only the source scope to one target role is unsound when other applicable policy layers can enlarge, restrict or bypass that result.

Candidate model:

`EffectiveAuthority = Evaluate(policy-set, principal, resource, action/effect, context, policy semantics/profile)`.

A semantic-mapping proof must bind at least:

- source authority identity/revision and semantic profile;
- target permission-model identity/revision and provider/API surface revision;
- principal/actor/delegation context;
- protected effect taxonomy;
- resource universe and hierarchy semantics;
- tenant/classification constraints;
- conditions and their unknown/error semantics;
- allow/deny/default-deny precedence;
- inheritance/resource-policy/session/boundary semantics;
- meta-capabilities relevant to the protected effect;
- currentness/security-floor dependencies;
- unsupported/opaque semantics and proof limitations.

Core boundary:

`role mapping correct in isolation != effective-authority mapping correct`.

## 5. Deny semantics are first-class

A translation that preserves positive grants while dropping deny semantics is not necessarily attenuating.

Google Cloud deny policies override grants, inherit through resource hierarchy, and treat an unevaluable deny condition as denying the permission. AWS explicit deny similarly overrides allows, but other details of resource/session/boundary composition differ.

Therefore a mapping such as:

`source allow set -> target allow set`

cannot establish attenuation when source safety also depends on deny, boundary, condition, hierarchy or session constraints.

Candidate rule:

`source restriction not representable at target -> no unqualified attenuation claim`.

Permitted research dispositions are:

1. `PROVEN_ATTENUATED` — target effective authority is proven contained in source authority for the declared scope;
2. `MEDIATED_ATTENUATION` — target mechanism alone is insufficient, but an independently qualified mediation/enforcement predicate restores the missing restriction;
3. `TARGET_REAUTHORIZATION` — target authority independently authorizes the effect; lineage must not be misrepresented as attenuation from source;
4. `PARTIAL` / `UNKNOWN` — material semantics are opaque or incompletely modeled;
5. `INCOMPATIBLE` — a required source restriction cannot be preserved or mediated under the declared contract.

`adapter translated successfully` is not a sixth semantic disposition.

## 6. Permission-model coverage is versioned

Google Cloud PAB is a useful failure case: its enforcement version determines which permissions it can block; a permission outside that version is not constrained by the PAB. Provider/API growth can therefore change the effective effect universe even when the mapping document and credential text are unchanged.

This generalizes to:

`mapping unchanged + provider permission universe changed != proof unchanged`.

A semantic mapping must bind a qualified `PermissionUniverseRef` / provider semantics revision and define change triggers. New actions, resource types, condition keys, role composition rules, inheritance behavior, session semantics, deny capabilities or meta-permissions can defeat an older proof.

A provider that adds `resource.commitV2` under an existing broad role can create a new protected-effect path without any source-policy change.

## 7. Unknown and unsupported semantics cannot be converted into allow

A provider may expose custom conditions, proprietary roles, service-specific authorization behavior or APIs whose effect relation is not fully documented. A solver/model may also intentionally cover only a subset.

The proof scope must therefore distinguish:

- `MODELED` semantics;
- `STRUCTURALLY_EXCLUDED` semantics;
- `OPAQUE_BUT_ATTESTED` semantics;
- `UNSUPPORTED` semantics;
- `UNKNOWN` semantics.

No composition rule may silently transform the latter two into semantic equivalence.

`schema understood != policy semantics understood`.

`simulator says allowed/denied != complete live semantic proof`.

AWS explicitly warns that Policy Simulator results can differ from the live environment and documents unsupported/partial simulation cases. Simulation is useful qualification/counterexample evidence, not an oracle of complete equivalence.

## 8. Conditions require semantic, not textual, translation

Conditions may depend on tags, principal attributes, request attributes, time, network context, resource hierarchy, audience, tenant, classification or provider-specific state. Even when both sides expose a condition language, textual or AST translation is insufficient.

Candidate obligation:

For every source restriction material to attenuation, prove one of:

- target predicate implies the source restriction over the declared context universe;
- an independent mediation point enforces the missing restriction before the protected effect commitment boundary;
- the restricted cases are structurally impossible;
- the mapping is explicitly incompatible/unknown.

Condition error semantics are material. `unknown -> deny`, `unknown -> false`, fail-open, fail-closed and provider-specific error handling are not equivalent.

## 9. Resource hierarchy and identity shape are semantic inputs

`resource=A/*` cannot be translated safely without knowing whether descendants are inherited, whether resource-based policies can independently grant access, whether aliases/cross-account references expand the resource set, and how tenant boundaries map.

Similarly, translating a workload principal into a role/session principal may alter the evaluation law itself. AWS provides a concrete example: some resource-based grants to session principals interact differently with permissions boundaries than grants to role ARNs.

Thus:

`same human-readable actor != same authorization principal semantics`.

`same resource name != same resource-set semantics`.

## 10. Mapping proof must include acquisition/meta-capability closure

Prior G4 work established that an effect-capability envelope includes direct capabilities plus material acquisition/meta-capabilities. Semantic mapping must preserve this closure.

A target role that cannot directly perform `E` is not attenuated if it can bind/escalate/impersonate/mint/install a capability that can perform `E` and the source authority forbids that acquisition path.

Candidate implication therefore applies to reachable protected effects, not merely directly named actions:

`ReachableTargetEffectSet(mapping, meta-capability closure) subseteq QualifiedSourceEffectSet`.

This prevents adapters from declaring success because direct action lists look narrower while target privilege-acquisition edges are stronger.

## 11. Proof artifact hypothesis

Candidate primitive: `DelegationSemanticMappingProofRef`.

A durable proof/evidence envelope may need:

```text
DelegationSemanticMappingProof
  sourceAuthorityRef
  sourceSemanticProfileRef
  targetPermissionModelRef
  targetProviderRevisionRef
  protectedEffectSetRef
  principalMappingRef
  resourceUniverseRef
  permissionUniverseRef
  contextUniverseRef
  sourceRestrictions[]
  targetEffectivePolicyInputs[]
  metaCapabilityClosureRef
  mappingRules[]
  mediationRequirements[]
  structuralExclusions[]
  unsupportedSemantics[]
  counterexampleSearchEvidence[]
  disposition
  verifierRef
  proofProfileRef
  currentnessVectorRef
  changeTriggers[]
  limitations[]
```

This is a research vocabulary candidate, not a schema/API commitment.

The adapter may carry/reference this evidence but does not become semantic authority. The target capability/provider remains responsible for its own policy semantics; the source capability remains owner of the source business authority; the relying capability/contract decides whether the qualified mapping satisfies its guarantee.

`adapter owns translation mechanism != adapter owns either domain's business semantics`.

## 12. Requalification triggers

A mapping proof should be selectively defeated/requalified when a material dependency changes, including:

- source policy/authority semantics or floor;
- target provider/API permission universe;
- managed/predefined role contents;
- resource hierarchy/inheritance rules;
- deny/condition evaluation semantics;
- principal/session/resource-policy composition semantics;
- target policy attachments relevant to effective authority;
- meta-capability/acquisition graph;
- mediation point or complete-mediation proof;
- tenant/classification mapping;
- mapping/adapter revision;
- proof/verifier semantic profile;
- opaque-provider attestation/currentness.

`credential unchanged != mapping proof current`.

`role name unchanged != role semantics unchanged`.

## 13. Proof obligations

Candidate obligations refined in this round:

1. **Directional containment:** every target-reachable protected effect in proof scope is permitted by the qualified source authority.
2. **Effective-policy completeness:** all target policy layers material to the decision are represented or explicitly unknown.
3. **Deny preservation:** material source deny/boundary semantics survive translation, are mediated, or cause incompatibility.
4. **Condition implication:** target/mediated predicates imply source restrictions under the declared context universe.
5. **Unknown preservation:** unsupported/opaque predicates never become implicit allow/equivalence.
6. **Resource-set containment:** translated target resources do not exceed the source-authorized resource/tenant/classification universe.
7. **Principal semantics:** actor/subject/session/impersonation differences remain explicit.
8. **Meta-capability closure:** target privilege-acquisition edges cannot reach protected effects outside source authority.
9. **Provider-universe binding:** proof names the target permission/API semantics revision it covers.
10. **No role-name authority:** stable role/scope names do not substitute for semantic revision evidence.
11. **Mediation completeness:** any restriction restored externally is covered by complete-mediation evidence at the effect commitment boundary.
12. **Target re-authorization honesty:** independently granted target authority is represented as a new authority edge, not fabricated attenuation.
13. **No proof strengthening:** `PARTIAL/UNKNOWN/UNSUPPORTED` cannot become `PROVEN_ATTENUATED` through adapter normalization.
14. **Counterexample scope:** solver/simulator results name the modeled universe and assumptions; absence of a found counterexample is not unbounded proof.
15. **Currentness separation:** semantic mapping validity and current revocation/security admissibility remain independent dimensions.
16. **Version-skew rule:** rolling source/target versions have explicit admissible mapping pairs or explicit incompatibility.
17. **Local/remote equivalence:** an in-process/local optimization cannot bypass a mapping restriction required by the remote/provider realization.
18. **Audit lineage:** effect evidence can identify the mapping/proof profile used without making correlation a global identity proof.
19. **Autonomous runtime closure:** a client runtime can carry sufficient mapping evidence for its declared offline horizon without mandatory Builder/central Exchange Plane availability.
20. **Portability:** proof semantics are not defined solely by one provider's role vocabulary; provider-specific inputs remain replaceable evidence.
21. **Change detection:** permission-universe/provider semantic changes defeat only materially dependent proofs rather than requiring global invalidation.
22. **Business ownership:** neither adapter, gateway, IAM nor Exchange Plane becomes canonical owner of source/target business semantics.
23. **No interface inference:** interface/schema compatibility never establishes authorization-contract compatibility.
24. **Failure representability:** `UNKNOWN`, `PARTIAL`, `INCOMPATIBLE`, stale and contested mapping states remain representable at runtime boundaries.

## 14. Adversarial cases

1. Source `read` maps to target `Viewer`; target role later gains export of sensitive raw data.
2. Source restricts tenant A; target role is resource-global.
3. Source deny overrides allow; adapter exports only positive grants.
4. Source condition `classification <= internal` has no target equivalent and is silently dropped.
5. Target condition evaluation fails open while source fails closed.
6. Target policy simulator reports deny but live resource policy grants the session principal.
7. Permission boundary is assumed to constrain a resource-based session grant when provider semantics do not.
8. Provider adds a new mutating action under an existing broad permission/role.
9. PAB/boundary enforcement version does not cover the newly introduced permission.
10. Role name remains unchanged while managed role contents change.
11. Target resource hierarchy gains a descendant inherited by the translated grant.
12. Resource alias/cross-account binding expands reachable resources without mapping revision.
13. Target role cannot execute E directly but can impersonate a principal that can.
14. Target role can bind/escalate/mint another role with E.
15. Plugin receives target credential and exercises an effect omitted from the adapter's static action map.
16. Adapter maps unknown custom condition to `true` for compatibility.
17. Adapter maps `UNKNOWN` provider semantics to source `allow` because schema is compatible.
18. Source and target both use `admin` but mean different effect/resource universes.
19. Translation narrows action names but broadens audience/tenant/resource set.
20. Target re-authorization is recorded as source attenuation, so source revocation incorrectly appears sufficient to revoke target authority.
21. Break-glass target authority is folded into ordinary delegation mapping.
22. Cached mapping proof survives target API/permission-model revision.
23. Offline runtime restores an older mapping proof below a locally observed provider/security floor.
24. Gateway enforces missing condition for HTTP but background job calls provider directly.
25. Local/in-process provider bypasses adapter restriction applied to RPC path.
26. Two providers expose same interface but one uses deny-overrides and the other allow-oriented semantics.
27. Static proof covers current policy attachments but omits dynamically attached resource policy.
28. Central Exchange Plane is made the only mapping oracle, breaking autonomous runtime operation despite locally sufficient evidence.

## 15. Technology-independent decision rule

A cross-model delegation can be called **attenuated** only when the relying contract has qualified evidence that:

1. the target effective-authority semantics are sufficiently modeled for the protected effect scope;
2. all target-reachable protected effects, including material meta-capability closure, imply source permission under the declared context/resource/principal universe;
3. every source restriction material to the guarantee is preserved, structurally excluded, or restored by complete mediation;
4. unsupported/opaque semantics are represented without invented equivalence;
5. the proof is current for the relevant source/target semantic revisions and security/currentness floors.

Otherwise the correct disposition is mediated, independently re-authorized, partial/unknown, or incompatible.

## 16. Portability / exit path

No universal authorization language is required by this hypothesis. A provider-specific model may be analyzed by native documentation, formal model, simulator, conformance corpus, opaque attestation, or other qualified evidence. The portable contract is the **proof obligation and evidence vocabulary**, not a requirement that every provider expose the same role/scope/ACL syntax.

Likewise, an adapter is replaceable if a successor can produce evidence satisfying the same qualified mapping obligation. The Exchange Plane may route/reference mapping evidence and propagate its identity/currentness, but it does not decide business permission semantics globally.

## 17. Deduplication against existing G4 work

This round does not reopen:

- generic contract compatibility;
- semantic policy diff in one common modeled language;
- proof-carrying runtime verification;
- multi-domain invalidation algebra;
- complete mediation/effect-path discovery;
- effect-capability privilege drift;
- offline delegation attenuation/revocation.

Material delta is narrower:

`heterogeneous permission models -> effective-authority semantic mapping -> directional containment/implication proof -> deny/condition/resource/principal/meta-capability preservation -> provider-universe version binding -> explicit mediated/reauthorized/unknown outcomes without universal auth language or adapter semantic ownership`.

## 18. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

The next high-value gap exposed by this round is **mapping-proof maintenance under opaque managed-role/provider-policy evolution**: how a runtime detects and requalifies semantic drift when provider-managed roles, undocumented service authorization behavior, resource-policy layers or permission catalogs can change without a local artifact revision; how to combine provider changelogs, permission catalogs, differential probes/simulators, runtime denials, attestations and conservative floors without treating provider documentation or a central scanner as an omniscient semantic oracle.
