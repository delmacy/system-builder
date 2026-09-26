# G4 Capability Exchange — In-Flight Policy Composition Change and Mixed-Time Vectors

Date: 2026-09-21
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Generation 4 product R&D only
Implementation authority: NONE

## 1. Research question

This consolidation continues `G4_CAPABILITY_EXCHANGE_MULTI_DOMAIN_INVALIDATION_POLICY_ALGEBRA.md` and asks:

> When a long-running occurrence was admitted under composition policy C1 and C2 later changes override, exemption, `UNKNOWN`, continuation or new-effect semantics while independent trust/policy/provider/currentness domains advance at different times, which semantics remain pinned, which must be requalified, and how can the system avoid both retroactive history rewriting and silent continuation of rights that are no longer admissible?

The question is implementation-independent. It does not select a workflow engine, policy language, broker, controller, database, clock service or migration mechanism.

Constitutional boundaries remain unchanged:

- `G3 semantic decision != G4 technology binding`;
- `Research candidate != implementation authority`;
- `Builder != Runtime`;
- `Shared primitives != shared business ownership`;
- `Logical Exchange Plane != single broker`;
- `Exchange Plane owns exchange semantics; capability owns business semantics`;
- `historical interpretation != continuation authority != new-effect admissibility`;
- `policy revision != global cutover barrier`.

## 2. Evidence base

Primary standards and mature-system documentation reviewed:

1. **OASIS XACML 3.0 Plus Errata 01** — named combining algorithms such as deny-overrides, permit-overrides, ordered variants and indeterminate-aware rules demonstrate that composition semantics are themselves normative. Changing the combining algorithm can change the root decision even when child evidence is unchanged. <https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-en.html>
2. **Camunda 8 process-definition versioning and process-instance migration** — new definitions can coexist with running instances; migration of an active instance is an explicit operation with source/target element mapping. Camunda also documents that active jobs, variables and already-established active-element state are not simply recreated/re-evaluated during migration. This is mature precedent for treating in-flight semantic migration as a deliberate transition rather than assuming deployment of a new definition rewrites running work. <https://docs.camunda.io/docs/components/concepts/process-instance-migration/> and <https://docs.camunda.io/docs/components/best-practices/operations/versioning-process-definitions/>
3. **OAuth 2.0 Token Revocation, RFC 7009** — revocation is intended to invalidate a token immediately at the authorization server, while the RFC explicitly acknowledges propagation delay and notes that revocation policy may cascade to related tokens/grants. The implementation note contrasts online state lookup with short-lived self-contained credentials, making the currentness/continuation trade-off explicit. <https://www.rfc-editor.org/rfc/rfc7009>
4. **OAuth 2.0 Token Introspection, RFC 7662** — `active` is a current authorization-server appraisal, and cached introspection improves performance at the cost of liveness of authorization information. This is precedent for separating historical issuance/admission from current continuation/effect authorization. <https://www.rfc-editor.org/rfc/rfc7662>
5. Existing G4 research on composition-policy lifecycle, in-flight contract evolution, semantic generation handoff, offline security floors, multi-domain invalidation algebra, revocation storms and evidence compaction.

These sources are benchmarks, not technology selections. No XACML, Camunda, OAuth mechanism, PDP/PEP, workflow engine or policy engine is adopted.

## 3. Material delta

Previous G4 work established that composition-policy identity is first-class semantics and that independent domain floors/currentness form a typed vector rather than one global revision. The remaining ambiguity was what happens to a live occurrence when the composition policy itself changes while that occurrence spans time.

This round proposes:

> A long-running occurrence needs a phase-qualified semantic snapshot: historical admission remains bound to the policy and evidence actually used at admission, while continuation and each protected new-effect boundary may require requalification against separately declared current constraints.

Therefore:

`admitted under C1 != every future effect authorized forever by C1`.

and:

`C2 published != historical admission retroactively evaluated as if C2 had existed`.

The unit of change is not the whole occurrence by default. It is the next semantic boundary whose contract says current policy/floor evidence is material.

## 4. Three independent questions

For a long-running occurrence, at least three questions must remain distinct:

1. **Historical admission** — was the occurrence legitimately admitted under the then-applicable policy/evidence?
2. **Continuation** — may already-admitted work continue to make progress under its pinned lineage?
3. **New protected effect** — may the occurrence acquire a new right, emit an irreversible effect, spend conserved capacity, cross a trust boundary or create a new externally visible obligation now?

A policy change can affect these questions differently.

Examples:

- C2 may forbid new admissions while allowing C1 occurrences to finish read-only work;
- C2 may require reauthorization before the next payment/external effect but not before deterministic local computation;
- an emergency security floor may defeat continuation immediately for one effect class even though historical admission remains valid evidence;
- a semantic correction may preserve historical interpretation but require an explicit migration bridge before future effects.

Thus:

`historically valid != currently continuable != authorized for next effect`.

## 5. Occurrence policy lineage

Candidate research model:

`OccurrencePolicyLineage = <admissionPolicyRef, admissionConstraintVector, phasePins, transitionRefs, currentEffectGateRefs>`

The admission snapshot is immutable historical evidence. Later transitions append qualified relations; they do not rewrite the admission record.

A phase/branch may pin different semantic identities where the protected invariants are independent. G4 already rejects one mandatory global generation for an occurrence, so policy lineage should preserve that partial-order property.

`one occurrence != one forever-global policy revision`.

## 6. Mixed-time constraint vectors are normal

A long-running occurrence may legitimately carry evidence observed at different times:

- semantic contract pinned at admission;
- trust bundle refreshed later;
- authorization lease refreshed later still;
- provider generation requalified only when a provider-specific effect is attempted;
- recovery baseline established after a partition;
- composition policy C2 becoming applicable only to new-effect gates.

This is not automatically incoherent. It becomes unsafe when the root guarantee requires a simultaneity/coherence relation that has not been proven.

Therefore:

`mixed-time vector != inconsistent by definition`.

but:

`each component individually current != vector jointly admissible`.

Candidate `VectorCoherencePredicateRef` names any required cross-component temporal relation. If no such relation is material, a global snapshot barrier must not be invented.

## 7. Policy transition modes must be explicit

A C1 -> C2 transition needs a declared policy, not an implicit deployment behavior. Candidate conceptual modes:

- **NEW_ADMISSIONS_ONLY** — C2 governs new occurrences; existing occurrences remain pinned unless another floor defeats them.
- **NEXT_EFFECT_REQUALIFICATION** — existing occurrences may compute/continue, but every named protected effect must pass C2 or a qualified bridge/exemption.
- **PHASE_BOUNDARY** — C2 applies when an occurrence crosses a declared semantic phase boundary.
- **EXPLICIT_MIGRATION** — C1 remains in force for the occurrence until an authorized migration plan maps its live state/obligations to C2.
- **IMMEDIATE_DEFEAT_FOR_SCOPE** — a security/authority change blocks a named continuation/effect scope immediately, subject to the domain's observation/currentness semantics.
- **GRANDFATHER_WITH_HORIZON** — C1 continuation is temporarily permitted until a declared horizon; expiration becomes explicit `REQUALIFICATION_REQUIRED`, not silent extension.

These are research vocabulary, not an API.

## 8. Migration is not reinterpretation

Camunda's explicit migration model is a useful warning: migration names a source definition, target definition and mapping for active state. G4 generalizes:

`migration to C2 != claim that C1 always meant C2`.

A migration should preserve at least:

- source policy/semantic identity;
- target identity;
- live obligations/rights/effects being mapped;
- assumptions and unsupported mappings;
- authority for migration;
- evidence of what was already externally effective;
- post-migration constraint/currentness vector;
- rollback/irreversibility disposition.

Already-settled external effects remain historical facts. Migration cannot erase them.

## 9. Composition-policy change is itself material dependency change

If C1 uses permit-overrides and C2 uses deny-overrides, identical child evidence can yield different root dispositions. XACML demonstrates this directly as a general pattern.

Therefore a cached/compacted root result must depend on `ConstraintCompositionPolicyRef`, not only on child evidence digests.

`children unchanged != root semantics unchanged`.

A C1 -> C2 change must selectively requalify every live root whose future guarantee materially depends on the changed composition semantics. Historical C1 results remain historical C1 results.

## 10. `UNKNOWN` semantics cannot change invisibly mid-occurrence

A particularly dangerous policy change is changing what `UNKNOWN`, `INDETERMINATE`, stale evidence or unavailable domains mean.

If C1 permitted bounded continuation on `UNKNOWN` for an optional enrichment but C2 makes the same unknown dimension fail-closed for a protected effect, a live occurrence must not continue using the C1 interpretation at a C2-governed effect boundary.

Conversely, C2 becoming more permissive does not retroactively make a historical C1 denial into a successful admission.

`policy became more permissive != previously denied occurrence admitted`.

`policy became stricter != historical admission falsified`.

## 11. Exemptions and grandfathering

Grandfathering is a scoped exemption/transition capability, not an implicit property of being old.

Candidate `GrandfatherEvidenceRef` needs:

- source policy/occurrence scope;
- operations/effects allowed to continue;
- excluded effects;
- authority basis;
- horizon/expiry;
- tenant/classification scope where material;
- revocation semantics;
- whether requalification is required at phase/effect boundaries.

Rules:

`old occurrence != automatically grandfathered`.

`grandfathered continuation != permission for arbitrary new effects`.

`grandfather exemption != security-floor rollback`.

## 12. Revocation and currentness during long-running work

RFC 7009 and RFC 7662 provide mature precedent that authorization can become inactive after issuance/admission and that cached status trades currentness for availability.

G4 generalizes:

`authorization valid at start != authorization valid for every future effect`.

The contract must declare which effects require current authority evidence and the maximum offline/stale horizon, if any. For self-contained/local evidence, the absence of online introspection is not itself revocation proof, but neither is it permission to exceed the declared horizon.

This preserves autonomous runtime operation without turning autonomy into perpetual authority.

## 13. No global cutover barrier by default

Independent branches/domains need not stop together merely because C2 exists.

A global barrier is justified only when a protected invariant spans those branches and requires one common transition point. Otherwise, per-branch/per-effect requalification is preferable because it limits blast radius and preserves availability.

`policy rollout coordination scope follows invariant scope`.

This mirrors earlier G4 generation-handoff research and prevents policy deployment machinery from becoming an accidental global transaction coordinator.

## 14. In-flight retries, queues and delayed delivery

A retry or delayed message preserves the semantic lineage of the original obligation unless explicitly re-admitted/migrated.

But preserving lineage does not guarantee that the next effect remains admissible:

`retry lineage preserved != old effect right preserved forever`.

At delivery/execution time the consumer may need to check the current effect gate while still interpreting payload/obligation semantics under the pinned historical profile.

Therefore:

`interpret under pinned semantics; authorize new effect under declared current gate`.

This avoids both semantic mutation and stale-right resurrection.

## 15. Policy change during partitions

A disconnected runtime may not observe C2 immediately. Safety therefore cannot rely on instant policy broadcast.

The runtime needs locally durable information describing:

- which policy/constraint classes are static-stable for the autonomy horizon;
- which require online/current status;
- local monotonic floors already observed;
- maximum continuation/effect horizon under missing updates;
- behavior when that horizon expires.

On reconnection, observation of C2 does not rewrite effects already produced under a previously admissible local closure. It can, however, require reconciliation/remediation if the governing contract declared a stronger effective-time rule and the runtime lacked current evidence.

`late observation != retroactive history rewrite`.

`late observation may create reconciliation obligation`.

## 16. Candidate vocabulary

Research vocabulary only:

- `OccurrencePolicyLineageRef` — immutable admission-policy lineage plus later qualified transitions.
- `AdmissionPolicySnapshotRef` — exact composition policy and material constraint vector used at admission.
- `PolicyTransitionRef` — relation C1 -> C2 with scope, effective semantics and transition mode.
- `ContinuationGateRef` — policy/constraint predicate governing continued progress.
- `EffectAdmissionGateRef` — current predicate required before a named new protected effect.
- `VectorCoherencePredicateRef` — required cross-domain temporal/coherence relation for one guarantee.
- `PolicyMigrationPlanRef` — explicit mapping of live obligations/rights/state from source to target policy semantics.
- `GrandfatherEvidenceRef` — scoped, expiring authority to continue selected C1 behavior.
- `PolicyObservationRef` — evidence that a runtime observed a policy/floor transition.
- `PolicyTransitionDisposition` — `PINNED`, `REQUALIFICATION_REQUIRED`, `MIGRATION_REQUIRED`, `GRANDFATHERED`, `DEFEATED`, `UNKNOWN`, etc.

None is a shared business entity or implementation commitment.

## 17. Candidate proof obligations

1. **PO-IPC-01 — Historical non-rewrite:** C2 cannot retroactively relabel a legitimately evaluated C1 admission as though C2 had governed it.
2. **PO-IPC-02 — No perpetual pinning:** C1 admission does not imply unlimited continuation or new-effect authority.
3. **PO-IPC-03 — Policy identity binding:** admission, continuation and effect results identify the exact composition-policy semantics used.
4. **PO-IPC-04 — Phase-qualified applicability:** transition scope states whether C2 governs new admission, continuation, phase boundaries, named effects or explicit migration only.
5. **PO-IPC-05 — Current effect authority:** every protected effect requiring current authorization/floor evidence checks that evidence at its declared gate.
6. **PO-IPC-06 — Mixed-time honesty:** vectors preserve per-component observation/currentness; they are not flattened into a false global timestamp.
7. **PO-IPC-07 — Coherence explicitness:** if a guarantee requires simultaneous/coherent evidence across domains, that relation is named and proven; otherwise no global barrier is invented.
8. **PO-IPC-08 — Unknown preservation:** changing `UNKNOWN` handling is a semantic policy change and cannot apply invisibly to an already-pinned decision boundary.
9. **PO-IPC-09 — Grandfather authority:** grandfathering is explicit, scoped, expiring/revocable where declared, and cannot override unrelated security/authority floors.
10. **PO-IPC-10 — Migration evidence:** migration preserves source/target identity, live-state mapping, unsupported mappings, authority and already-effective external effects.
11. **PO-IPC-11 — Migration non-reinterpretation:** migration does not assert that source semantics always equaled target semantics.
12. **PO-IPC-12 — Retry lineage:** retries/redelivery preserve original obligation semantics absent explicit migration/re-admission.
13. **PO-IPC-13 — Retry current gate:** preserved lineage does not bypass current effect-admission requirements.
14. **PO-IPC-14 — Compaction dependency:** compacted/root evidence retains composition-policy identity and enough transition lineage for later requalification.
15. **PO-IPC-15 — Selective requalification:** C1 -> C2 invalidates/requalifies only roots/branches/effects materially dependent on changed composition semantics.
16. **PO-IPC-16 — Partition boundedness:** disconnected runtimes cannot exceed declared policy/security/currentness horizons merely because C2 is unreachable.
17. **PO-IPC-17 — Late-observation honesty:** delayed observation of C2 is represented separately from C2 effective semantics and effect time.
18. **PO-IPC-18 — No synthetic total time:** policy publication, effective time, runtime observation, admission, phase transition and effect time remain distinct where material.
19. **PO-IPC-19 — Capability ownership:** Exchange Plane/gateway/verifier may transport/evaluate transition evidence but cannot decide capability-local business migration/settlement by convenience.
20. **PO-IPC-20 — Builder independence:** runtime continuation/requalification for its promised autonomy horizon does not require Builder availability.
21. **PO-IPC-21 — Alternative support sets:** a C1-dependent branch can be defeated while another independently sufficient C2-qualified support set remains usable when explicitly proven.
22. **PO-IPC-22 — Security floor monotonicity:** implementation/policy rollback cannot lower a locally durable security/authority floor.
23. **PO-IPC-23 — External-effect preservation:** migration/requalification never erases an already-produced external effect from historical truth.
24. **PO-IPC-24 — Transport invariance:** direct call, IPC, RPC, broker, stream or file transport does not alter the declared transition semantics.

## 18. Adversarial cases

1. C2 is deployed and the system rewrites all historical C1 admissions as C2 decisions.
2. C1 admission is treated as lifetime authorization for every later external effect.
3. C2 changes `UNKNOWN` from bounded-continue to fail-closed, but old workers silently keep C1 behavior at new effect boundaries.
4. C2 is more permissive and previously denied C1 occurrences are silently resurrected.
5. A global platform epoch stops unrelated capabilities although only one invariant changed.
6. A long-running occurrence combines a fresh trust bundle with expired authorization and is summarized as `fresh=true`.
7. Independent current evidence is assumed jointly coherent although the guarantee required same-snapshot semantics.
8. Same numeric revision in two domains is used as a cutover marker.
9. Grandfathering is inferred solely from occurrence age.
10. A grandfather exemption intended for read-only continuation is used to authorize a payment.
11. A policy migration updates the definition pointer but does not map live obligations/rights.
12. Migration recreates/re-evaluates active work and duplicates an already-created external job/effect.
13. Migration hides an unsupported mapping by calling it equivalent.
14. A queued C1 command is delivered after C2 and is interpreted as a brand-new C2 obligation without migration.
15. The opposite error: a queued C1 command uses stale C1 authority to create a new protected effect after the relevant floor advanced.
16. A retry is assigned a new semantic identity and bypasses old dedup/fencing evidence.
17. A disconnected runtime extends its policy horizon indefinitely because the Builder is unavailable.
18. On reconnect, C2 observation is backdated and used to claim that all partition-time effects were impossible/nonexistent.
19. Policy publication timestamp is treated as universal effective time across trust domains.
20. Gateway selects C2 for an occurrence because it is latest, despite capability-local transition policy requiring explicit migration.
21. A composition-policy cache key contains child evidence but omits policy identity, so C1 root PASS is reused under C2.
22. Root evidence compaction retains `PASS` but drops C1/C2 transition lineage.
23. Policy rollback restores C1 and accidentally rolls back a newer security floor.
24. Provider failover changes which current-effect gate is material, but the occurrence retains the old provider's evidence.
25. A local in-process path skips requalification that the remote deployment path performs.
26. Two branches of one occurrence are forced through one global policy generation although their invariants are independent.
27. Two branches that jointly conserve a right advance independently even though their invariant actually requires coordinated cutover.
28. A verifier returns `valid=true` after evaluating C2 but does not expose that one material domain was still pinned to stale C1-era evidence.

## 19. Portability and exit path

The hypothesis is intentionally provider-neutral.

A future implementation must be able to replace workflow engines, policy engines, transports, storage engines, brokers, clocks or deployment topology while preserving:

- immutable admission-policy identity;
- explicit transition/migration relations;
- phase/effect gate semantics;
- typed multi-domain currentness/floors;
- historical effect provenance;
- grandfather/exemption scope;
- representable `UNKNOWN`/conflict/migration-required states;
- runtime-local closure sufficient for the declared autonomy horizon.

A provider that cannot expose enough semantics to preserve these guarantees is not equivalent merely because it exposes the same interface.

## 20. Deduplication against existing G4 research

This document does not reopen:

- generic composition-policy lifecycle;
- generic in-flight contract/schema evolution;
- semantic-generation handoff;
- offline security floors;
- revocation-storm propagation;
- evidence compaction;
- multi-domain constraint algebra;
- split-brain effect settlement.

The material delta is specifically:

`typed multi-domain policy algebra -> composition-policy change while occurrences are live -> immutable historical admission + separately current continuation/effect gates -> mixed-time vector coherence -> explicit migration/grandfathering without global cutover or silent stale-right continuation`.

## 21. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

This round materially changes the boundary model: a long-running occurrence is no longer treated as either wholly pinned forever or wholly reinterpreted on policy deployment. Historical admission, continuation and new-effect authority are distinct, with explicit transition semantics and vector coherence obligations.

The next high-value gap is **effect-gate placement and proof of complete mediation**: how to demonstrate that every externally material effect path actually crosses the required current policy/authority/floor gate when effects can originate through direct calls, jobs, retries, plugins, adapters, legacy integrations, local optimizations or provider callbacks — without requiring one central gateway and without confusing service-mesh interception with semantic authorization.