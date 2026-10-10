# G4 — Composition-Policy Lifecycle, Downgrade & Rollback Safety

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the highest-value gap from multi-domain evidence composition: how composition predicates/manifests themselves evolve across autonomous runtimes, how old/new generations overlap without admitting forbidden combinations, how emergency security changes supersede cached composition rules, and how offline autonomy survives without allowing stale policy to bypass newer security floors.

This is not a new macro-family. It does not select TUF, Uptane, Kubernetes, Sigstore, a policy engine, consensus protocol, broker, gateway or provider, and grants no implementation authority.

## Evidence classes reviewed

Primary/standards and mature-system evidence:

- The Update Framework (TUF) specification: metadata versions cannot roll back; root rotation is chained one version at a time and each new root is authorized by both old and new thresholds; trusted metadata is persisted; expiration limits freeze attacks; timestamp/snapshot roles separate freshness and consistent-set binding; compromised-key recovery may invalidate cached timestamp/snapshot state.
- Uptane Standard / deployment best practices: metadata carries versions and expiration; rollback/freeze checks are mandatory; bounded expiry limits stale trust and enables key revocation/replacement; secure/latest-attested time is itself part of the freshness proof.
- Kubernetes API deprecation and version-skew policies: compatibility windows are explicit, overlap is bounded, upgrade order matters, persisted representations must remain decodable, and supported rollback constrains when storage/preferred versions may advance.
- Sigstore policy-controller documentation: TUF-backed trust roots can rotate automatically; air-gapped use can continue with serialized repository material but rotation then becomes an explicit operational responsibility.
- Prior G4 multi-domain evidence composition, offline security floors, in-flight contract evolution, witness-policy rotation, security retirement and evidence-reconciliation findings.

Primary references:
- https://theupdateframework.io/spec/
- https://theupdateframework.github.io/specification/v1.0.27/
- https://uptane.org/docs/2.0.0/standard/uptane-standard
- https://uptane.org/docs/2.1.0/deployment/best-practices
- https://kubernetes.io/releases/version-skew-policy/
- https://kubernetes.io/docs/reference/using-api/deprecation-policy/
- https://docs.sigstore.dev/policy-controller/overview/

## 1. Composition policy is a governed proof dependency, not a timeless boolean rule

The previous round established that independently valid domain evidence requires explicit compatibility predicates. Those predicates themselves have lineage, authority, currentness and security admissibility.

```text
CompositionPolicy P7 validly signed
!= P7 currently admissible
```

A policy can remain authentic while becoming unsafe because a later security fact invalidates one of the combinations it permits.

Candidate policy evidence therefore needs, conceptually, at least:

```text
policy identity
policy revision / predecessor relation
authority basis
issued / effective / observed time
freshness horizon or currentness rule
required domain predicates
security-floor dependencies
transition relation to predecessor/successor
rollback / recovery disposition
```

This is research vocabulary, not a schema.

## 2. Monotonic revision protects lineage, not semantic safety

TUF provides strong precedent for refusing metadata rollback and persisting trusted versions. But a higher version number is only ordering evidence.

```text
P8 > P7
!= P8 semantically safer than P7
```

A malicious or erroneous authority can publish a newer rule that weakens a security predicate. Therefore policy evolution needs both lineage/anti-rollback and semantic admissibility checks against non-bypassable floors.

```text
Anti-rollback
!= anti-downgrade
```

Rollback is returning to an older revision. Downgrade is accepting weaker guarantees; it can occur in a numerically newer revision.

## 3. Security floors must dominate ordinary composition-policy permission

Suppose cached `P7` permits provider generation `G3`, then security evidence `S10` revokes `G3` effective at `t1`. A runtime still holding authentic P7 must not conclude that P7 can authorize G3 merely because P7 has not expired.

```text
Composition policy permission
cannot widen a newer applicable security floor
```

This suggests an implementation-independent precedence relation:

```text
ordinary compatibility permission
  subject to applicable non-bypassable security constraints
```

The Exchange Plane may evaluate/propagate this relation but does not own the business semantics of the capability or the security domain.

## 4. Policy currentness and security currentness are independent

A runtime may hold:

```text
P7 = policy-current within 24h horizon
S9 = security-current only within 15m horizon
```

If S9 becomes stale, P7 being fresh cannot repair the missing security proof.

```text
Fresh composition policy
!= fresh dependent security evidence
```

Conversely, fresh security evidence does not prove that the runtime has the latest compatibility policy. Interaction admission must evaluate each required proof horizon.

## 5. Overlap is safe only when the overlap set is explicitly admissible

Mature systems use overlap windows to permit rolling upgrades. Kubernetes version-skew policy is an example: specific old/new component combinations are supported, and upgrade order narrows which combinations are valid.

For G4, simply allowing `P7 OR P8` during rollout is unsafe if the two policies admit incompatible domain combinations.

```text
old/new policy coexistence
!= union(old permissions, new permissions)
```

A transition needs a qualified overlap relation. Candidate classes:

1. **monotonic restriction** — successor only removes previously admitted combinations;
2. **bridge/dual qualification** — selected combinations satisfy both generations during the transition;
3. **ordered expansion** — a new permission becomes valid only after prerequisite domain/security evidence is current;
4. **breaking transition** — no safe overlap exists; quarantine/drain/migration is required for affected interactions.

These classes are hypotheses, not implementation decisions.

## 6. Expansion and restriction have asymmetric risk

A restrictive emergency policy can often safely stop new admissions before every runtime understands all successor features. An expansive policy creates new authority/admissibility and therefore needs stronger proof that dependencies are ready.

```text
permission removal
!= permission addition
```

A runtime that does not understand a newly introduced predicate must not interpret it as absent and widen permission.

```text
Unknown policy semantics
=> explicit incompatibility / quarantine / bounded fallback
!= ignore unknown field and allow
```

This extends the existing rule that adapters/drivers must not fabricate semantic equivalence.

## 7. Emergency supersession needs a separate security path

A severe vulnerability may require invalidating P7 before the normal composition-policy lifecycle completes. Treating this as an ordinary policy rollout creates a dangerous circular dependency: the unsafe policy would participate in deciding whether its own supersession is admissible.

Candidate distinction:

```text
normal policy evolution
vs
security supersession / revocation floor
```

The latter must derive authority from a security/root-trust path declared independently of ordinary policy permission.

```text
Emergency supersession
!= silent policy rewrite
```

It must retain provenance, effective time, observation time, scope and reconciliation consequences for effects admitted before/after observation.

## 8. Offline autonomy implies bounded stale-policy exposure

An autonomous runtime cannot learn a future policy/security change while disconnected. Therefore the product cannot promise all three simultaneously:

```text
indefinite offline execution
+ immediate future revocation knowledge
+ unrestricted irreversible effects
```

The runtime can instead carry a locally durable policy/security envelope with declared horizons and stale dispositions.

Candidate states:

```text
POLICY_CURRENT
POLICY_VALID_WITHIN_DECLARED_OFFLINE_HORIZON
POLICY_STALE_RESTRICTED
POLICY_SUPERSEDED
POLICY_ROLLBACK_DETECTED
POLICY_SEMANTICS_UNSUPPORTED
POLICY_TRANSITION_UNKNOWN
```

Offline continuation is a contract property, not a loophole around security currentness.

## 9. Recovery state must preserve policy anti-rollback

A/B rollback, VM snapshot restore, golden-image recovery or backup restoration can reintroduce an older composition policy even when the application binary itself is acceptable.

```text
Runtime rollback
!= permission to roll back policy frontier
```

Where anti-rollback is claimed, the runtime needs non-volatile continuity sufficient to reject policy/security state older than the highest qualified frontier it had already accepted, or must explicitly downgrade its disposition to `UNKNOWN/QUARANTINED` when that continuity cannot be proven.

This reuses TUF's persisted trusted-version principle without selecting TUF as the realization.

## 10. Policy rollback and business rollback are different

Rejecting P7 after accepting P8 does not reverse business effects produced under P7 or P8.

```text
Policy rollback rejected
!= historical effects invalidated
```

Historical effects retain the policy revision, evidence vector, effective/observation times and disposition used at effect time. Later policy discovery triggers reconciliation, not history rewriting.

## 11. Policy transition must be scoped by interaction/dependency edges

A composition policy may contain predicates for many capabilities, but a change affecting security/provider compatibility for capability X should not automatically halt capability Y when Y has no dependency on that predicate.

```text
Policy revision global identifier
!= global blast radius
```

A future representation should preserve dependency-scoped transition impact rather than using one platform-wide `policyHealthy` boolean.

## 12. Transition currentness must not become a Builder runtime dependency

Builder may author/distribute research-future policy artifacts, but published runtimes must remain autonomous. A runtime should be able to verify cached policy/security evidence locally for the declared horizon.

Sigstore's documented air-gap case is a useful operational benchmark: serialized trust material can be used offline, but rotation then becomes explicit responsibility rather than magically current.

```text
Builder/control plane unavailable
!= runtime policy verifier unavailable
```

and:

```text
Offline verification possible
!= offline policy freshness infinite
```

## 13. Portability / exit path

Portable meaning should include policy identity/revision lineage, authority/evidence refs, required-domain predicates, non-bypassable floor dependencies, effective/observation times, currentness disposition, transition relation, historical effect binding and rollback/supersession evidence.

TUF/Uptane metadata, Kubernetes-style skew matrices, OPA/Cedar/Rego-like policy engines, signed JSON, databases, brokers, transparency logs, service meshes, gateways and cloud control planes remain replaceable realization candidates. A replacement may declare `INCOMPATIBLE` rather than silently weaken transition guarantees.

## 14. Candidate proof obligations

Before implementation planning, prove or explicitly bound:

1. composition policy has explicit identity, revision/lineage and authority basis;
2. a cryptographically valid old policy is not automatically currently admissible;
3. revision monotonicity is not treated as proof of semantic non-downgrade;
4. ordinary composition permission cannot widen an applicable newer security floor;
5. policy currentness and each dependent domain currentness remain independently representable;
6. old/new policy overlap admits only explicitly qualified combinations, not the union of permissions;
7. expansion of permission requires dependency readiness evidence appropriate to the new permission;
8. restriction/revocation can take effect without requiring every successor feature to be understood;
9. unknown successor semantics fail explicitly rather than being ignored into broader permission;
10. emergency security supersession derives from a qualified authority path independent of the policy being superseded;
11. supersession preserves effective time, observation time, scope and provenance;
12. offline execution has a declared maximum stale-policy/security exposure for affected irreversible effects;
13. runtime recovery cannot silently restore a policy/security frontier older than the highest frontier already trusted where anti-rollback is promised;
14. loss of anti-rollback continuity produces `UNKNOWN/QUARANTINE` rather than false currentness;
15. policy rollback/revocation does not erase or retroactively rewrite prior business effects;
16. historical effects preserve the policy revision/evidence vector actually used at effect time;
17. policy transition blast radius follows declared dependency edges;
18. a central Builder/composition service is not required on every runtime effect path;
19. policy artifacts and semantics remain portable across policy engines/transports/providers;
20. gateway/adapter/driver cannot reinterpret an unsupported predicate as semantic equivalence.

## 15. Adversarial cases

1. P7 remains signed and unexpired after S10 revokes a provider P7 permits; runtime follows P7 and performs a forbidden effect.
2. P8 has a higher revision than P7 but intentionally weakens a security requirement; implementation equates monotonic version with non-downgrade.
3. Rolling rollout accepts `P7 OR P8`, creating a combination that neither transition author intended.
4. P8 adds a predicate unknown to an old runtime; parser ignores it and allows the operation.
5. Emergency revocation is represented only as P9; a runtime trusts P7 to decide that P9 is unnecessary.
6. Security floor is current but composition policy is stale; aggregate UI displays `green` because one proof domain is fresh.
7. Composition policy is current but security evidence is beyond its 15-minute horizon; runtime treats P-currentness as S-currentness.
8. VM snapshot restores P6 after runtime previously accepted P8; no durable frontier reveals rollback.
9. Golden image contains an old policy/root bundle and overwrites newer local trust state on recovery.
10. A/B application rollback legitimately returns code to generation A but also rolls policy/security state back unintentionally.
11. P8 is revoked after effects were admitted under it; reconciliation deletes those effects instead of preserving historical evidence.
12. New policy expands provider compatibility before the provider/security domain is ready; old runtimes begin routing to an unsafe binding.
13. Restrictive policy is delayed until every runtime can parse unrelated new features, unnecessarily extending vulnerability exposure.
14. One capability predicate changes; a global `policyHealthy=false` stops unrelated capabilities.
15. Gateway caches a normalized `compatible=true` result without the policy revision/security frontier that qualified it.
16. Policy engine migration preserves syntax but changes unknown-field/default semantics and silently widens permissions.
17. Offline runtime exceeds declared policy horizon but continues irreversible effects because the signature remains valid.
18. Runtime reconnects and replaces historical P7 evidence on old effects with current P10, making audit falsely imply P10 governed them.
19. Rollback detector rejects older policy bytes but accepts a numerically newer policy with weaker semantics and calls it safe.
20. Builder outage halts all runtimes because policy evaluation was implemented as a live central RPC despite locally verifiable evidence.

## 16. Deduplication against existing G4 research

This round does not reopen base Exchange Plane vocabulary, domain evidence composition, witness-policy rotation, security-floor propagation, in-flight business-contract migration or historical effect reconciliation. It adds the missing lifecycle layer for the **composition rule itself**: lineage, currentness, anti-rollback, semantic downgrade, old/new overlap, emergency supersession and recovery continuity.

## 17. Maturity and next gap

Material boundaries changed, so this round is not `NO_MATERIAL_DELTA`.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value remaining gap: **semantic non-downgrade and policy-diff proof** — determine how to classify whether a policy change is restrictive, expansive, incomparable or conditionally safe when predicates span independent domains; whether this can be mechanically proven for a useful subset; how unknown/custom predicates degrade the proof; and how to avoid treating syntactic policy diff or SAT satisfiability as proof of business/security semantic preservation.