# G4 Capability Exchange — Multi-Domain Invalidation and Policy Algebra

Date: 2026-09-21
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Generation 4 product R&D only
Implementation authority: NONE

## 1. Research question

This consolidation continues `G4_CAPABILITY_EXCHANGE_REVOCATION_STORMS_PARTITIONED_REQUALIFICATION.md` and asks:

> When one derived/root guarantee simultaneously depends on independent trust, policy, provider, semantic-profile, authority, currentness and recovery domains, how should floors, leases, revocations, exemptions and recovery baselines compose without inventing a global revision, a total order, or a central semantic oracle?

The problem is an implementation-independent algebra of admissibility evidence. It does not select a policy engine, broker, trust system, cache, database, controller or transport.

Constitutional boundaries remain unchanged:

- `G3 semantic decision != G4 technology binding`;
- `Research candidate != implementation authority`;
- `Shared primitives != shared business ownership`;
- `Logical Exchange Plane != single broker`;
- `Exchange Plane owns exchange semantics; capability owns business semantics`;
- `Builder != Runtime`;
- `federated evidence != merged authority`;
- `domain-local revision != global platform revision`.

## 2. Evidence base

Primary standards and mature architectures reviewed:

1. **SPIFFE Federation**: foreign bundles remain associated with their trust domain; bundles from distinct trust domains MUST NOT be merged because doing so would let one domain forge identities belonging to another. Bundle sequence/freshness is domain-local and federation consumers periodically refresh independently. This is direct precedent for keeping trust generations distinct rather than manufacturing a global trust epoch. <https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/>
2. **Kubernetes API resourceVersion/watch**: resource versions establish ordering/currentness within the API server's revision semantics; retained history is finite and `410 Gone` requires rebuilding a baseline. Kubernetes explicitly distinguishes `Exact` from `NotOlderThan`. This supports typed comparison relations instead of treating every revision token as a universally comparable scalar. <https://kubernetes.io/docs/reference/using-api/api-concepts/>
3. **etcd watch progress**: a progress revision is the revision of the local server serving the watch; a partitioned member can lag a quorum read. Thus a locally monotonic watermark is not automatically a globally authoritative currentness statement. <https://etcd.io/docs/v3.7/dev-guide/interacting_v3/>
4. **XACML 3.0 combining algorithms**: `deny-overrides`, `permit-overrides`, ordered variants and extended `Indeterminate` values demonstrate that policy combination is itself named normative semantics. The same child decisions can produce different aggregate decisions under different combining rules; unknown/error state cannot safely be collapsed before combination. <https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html>
5. Existing G4 research on multi-domain evidence composition, composition-policy lifecycle, semantic policy diff, offline security floors, evidence caching, evidence compaction and revocation storms.

These are benchmarks, not technology selections. No SPIFFE/SPIRE, Kubernetes, etcd, XACML, PDP/PEP, policy language, broker or database is adopted.

## 3. Material delta

Previous work introduced sparse `InvalidationVector = { domainRef -> observedMonotonicFloor }` and established that independent domains must not be merged merely because counters happen to match. It did not yet define what happens when a protected root depends on several such domains with different semantics and some domains produce leases, revocations, exemptions or recovery baselines rather than a simple monotonic counter.

This round proposes:

> Multi-domain admission is evaluation of a typed set of independently qualified constraints under an explicit local composition policy; it is not reduction to `max(revision)`, latest timestamp, one boolean, or one platform epoch.

Therefore:

`vector of domain state != global scalar revision`.

and:

`all child evidence valid != root guarantee admissible`.

The root owner must evaluate the conjunction/disjunction/threshold/override semantics actually declared for the protected guarantee, preserving `UNKNOWN`, conflict, currentness and authority scope.

## 4. Typed invalidation constraints

A single `floor` abstraction is insufficient for every domain. Candidate constraint kinds include:

- **minimum generation/floor** — evidence below generation N is inadmissible;
- **explicit revocation/defeat set** — named identities/revisions are defeated even if newer/older ordering is otherwise valid;
- **lease/currentness horizon** — evidence is admissible only until a qualified time/currentness bound;
- **required baseline** — a consumer that lost continuity must establish at least baseline B before protected reuse;
- **exemption/exception** — a narrowly scoped rule that modifies applicability of another constraint;
- **authority transition/fence** — old holder/generation is no longer authorized for a named effect scope;
- **compatibility/profile constraint** — a semantic profile must satisfy an admissibility relation, not merely be numerically recent;
- **recovery disposition** — history gap or unsupported semantics can force `BASELINE_REQUIRED`, `UNKNOWN` or `REBUILD_REQUIRED`.

These constraint kinds have different comparison and composition laws. They must not be normalized into one integer merely for implementation convenience.

## 5. Partial order, not total order

Within a single domain, a specification may define a monotonic order. Across domains there is generally no meaningful comparison:

`trustA:17` and `policyB:42` are not ordered.

Likewise, a lease expiry, an explicit revocation and a semantic-profile incompatibility are not comparable values.

Candidate model:

`DomainState = <domainRef, constraintKind, semanticIdentity, value, authorityRef, currentness, evidenceRef>`

and a root carries a sparse `ConstraintVector` only for material domains.

The only valid comparisons are those explicitly defined by each domain contract or by a qualified cross-domain mapping. Absence of a comparison relation means `INCOMPARABLE`, not `equal`, `older` or `newer`.

## 6. Composition policy is first-class semantics

XACML is useful as a mature warning: the same decisions can combine differently under deny-overrides, permit-overrides, ordered rules and indeterminate-aware rules. G4 should not adopt XACML automatically, but should preserve the lesson:

`same child dispositions + different combining policy -> potentially different root disposition`.

Therefore a root guarantee needs an explicit `ConstraintCompositionPolicyRef` (research vocabulary only) identifying how relevant domain constraints combine.

Examples of implementation-independent relations:

- `ALL_REQUIRED`: every material domain must satisfy its local admissibility predicate;
- `ANY_SUFFICIENT`: one independently sufficient derivation/support set is enough;
- `THRESHOLD`: k-of-n qualified domains/witnesses are required under declared independence assumptions;
- `DENY/DEFEAT_OVERRIDES`: one qualified defeat blocks admission even when other domains permit;
- `EXPLICIT_PRECEDENCE`: one named authority/domain can override another only where the contract explicitly grants that jurisdiction;
- `CONDITIONAL`: composition depends on operation, tenant, classification, effect class or support-set branch.

These names are conceptual, not a proposed API.

## 7. `UNKNOWN` and conflict must survive composition

Unknown is not false and is not permission. Conflict is not solved by picking the newest timestamp.

A combining policy must define what happens when a material child is:

- `SATISFIED`;
- `DEFEATED`;
- `UNKNOWN`;
- `INCOMPARABLE`;
- `CONTESTED`;
- `EXPIRED`;
- `BASELINE_REQUIRED`;
- `UNSUPPORTED`.

For protected effects, a composition rule that converts a material `UNKNOWN` into success requires an explicit proof that the unknown dimension is irrelevant or an alternative support set independently satisfies the guarantee.

`unknown child hidden by aggregation != qualified success`.

XACML's extended `Indeterminate` states are a useful precedent for retaining potential effect information through combination instead of flattening errors early.

## 8. Exemptions are scoped capabilities, not magic bypasses

An exemption can be legitimate, but only within an authority's declared jurisdiction and with explicit scope.

Candidate `ExemptionEvidenceRef` needs at least:

- target constraint/domain;
- operation/guarantee scope;
- tenant/classification/effect scope where material;
- issuer/authority basis;
- validity/currentness horizon;
- whether it suppresses admission failure, changes a floor, or merely allows degraded behavior;
- audit/provenance and revocation semantics.

Rules:

`exemption in domain A != permission to override domain B`.

`exemption from freshness != exemption from authorization`.

`exemption accepted != underlying defeat erased`.

An exemption should normally modify local appraisal of a constraint; it must not mutate historical evidence or transfer business ownership.

## 9. Recovery baselines do not reset independent floors

After a continuity gap, a consumer may establish a new baseline for one domain. That does not roll back or satisfy unrelated domains automatically.

Example:

- trust domain T has floor 9;
- policy domain P requires baseline 31 after lost history;
- provider domain D has generation >= 12;
- authority domain A has an explicit fence against holder H7.

Obtaining `Baseline(P=31)` says nothing by itself about T, D or A.

Therefore:

`baseline recovered in one domain != vector requalified`.

A root is reusable only when its material constraint vector is re-evaluated under the current composition policy.

## 10. Multi-domain currentness is a vector

SPIFFE and etcd reinforce that freshness/currentness is source/domain-qualified. A root may simultaneously be:

- current for provider generation;
- stale-but-allowed for catalog metadata;
- expired for authorization evidence;
- unknown for a foreign trust bundle because refresh is unavailable.

Flattening these into `fresh=true/false` destroys guarantee information.

Candidate `CurrentnessVectorRef` is sparse and domain-qualified. It does not create a global clock or global revision.

Time-based leases additionally require explicit clock/time authority and uncertainty assumptions. A timestamp from one domain does not order another domain's semantic generation.

## 11. Federation and local relying policy

SPIFFE explicitly keeps foreign trust bundles distinct. G4 generalizes the boundary:

`federation imports evidence, not jurisdiction`.

A foreign domain can authoritatively state facts inside its declared domain (for example, its own trust bundle generation). The local capability/contract decides whether and how those facts affect a local guarantee.

Thus two layers remain separate:

1. **source-domain authority** — whether the evidence is authentic/current according to the source domain;
2. **local materiality/appraisal** — whether that source-domain state satisfies or defeats this root guarantee.

The Exchange Plane may transport both evidence and policy references but cannot choose the local business result merely because it sees all domains.

## 12. Delegated requalification without authority transfer

A capability may delegate computation of a requalification result to a verifier/controller/provider, but delegation needs a contract:

- exact root/guarantee and constraint vector evaluated;
- composition-policy identity/revision;
- input evidence/currentness vector;
- verifier qualification/profile;
- result and unresolved/unknown dimensions;
- validity horizon and provenance.

The result is evidence for the capability owner. It does not transfer ownership:

`delegated evaluation != delegated semantic ownership`.

If the delegate cannot evaluate one material domain, the result must preserve that limitation rather than return a synthetic global `PASS`.

## 13. Policy conflicts

Conflicts can arise at several levels and must not be conflated:

- two source authorities make incompatible claims inside the same declared domain;
- two domains impose constraints that cannot simultaneously be satisfied;
- local composition policies disagree across capability boundaries;
- an exemption purports to override a constraint outside its jurisdiction;
- old and new composition-policy revisions coexist during rollout.

Candidate dispositions include `CONTESTED`, `NO_COMMON_ADMISSIBLE_STATE`, `UNKNOWN`, `BASELINE_REQUIRED` and `POLICY_INCOMPATIBLE`.

A conflict is not solved by latest timestamp, numerically largest revision, majority deployment or central registry preference unless that resolution law is itself part of the governing contract.

## 14. Cross-capability propagation

When Capability A depends on a guarantee exported by Capability B, A should not need B's entire internal invalidation vector. B can export a qualified guarantee result carrying the material dimensions required by the cross-capability contract.

But compression cannot fabricate compatibility:

`B says PASS != A may discard B's guarantee/profile/currentness scope`.

A needs enough information to know whether B's result remains admissible under A's contract and whether later defeat evidence can selectively requalify it.

This preserves capability-local ownership while allowing bounded evidence exchange.

## 15. Candidate vocabulary

Research vocabulary only:

- `ConstraintDomainRef` — domain in which one constraint's comparison/authority semantics are defined.
- `ConstraintKind` — floor, revocation set, lease, baseline, fence, compatibility, exemption or other explicitly defined class.
- `ConstraintVectorRef` — sparse set of material domain-qualified constraints for one root guarantee.
- `ConstraintCompositionPolicyRef` — immutable identity of the rule that composes child constraint dispositions.
- `ConstraintDisposition` — `SATISFIED`, `DEFEATED`, `UNKNOWN`, `INCOMPARABLE`, `CONTESTED`, `EXPIRED`, `BASELINE_REQUIRED`, `UNSUPPORTED`, etc.
- `ExemptionEvidenceRef` — scoped authority evidence modifying appraisal of one constraint.
- `CurrentnessVectorRef` — sparse domain-qualified currentness evidence.
- `ConstraintConflictRef` — evidence that simultaneously material constraints/claims cannot currently be reconciled under the declared policy.
- `DelegatedRequalificationRef` — qualified result of delegated evaluation without ownership transfer.
- `CrossDomainMappingRef` — explicit contract defining when values/claims from distinct domains can be related.

None is a shared business entity or implementation commitment.

## 16. Candidate proof obligations

1. **PO-MDI-01 — No synthetic global revision:** independent domain generations are never collapsed into one ordering token unless an explicit semantics defines that mapping.
2. **PO-MDI-02 — Typed constraints:** floors, leases, explicit revocations, fences, baselines, exemptions and compatibility constraints preserve their distinct semantics.
3. **PO-MDI-03 — Domain-local comparability:** values are compared only under a declared domain or qualified cross-domain relation.
4. **PO-MDI-04 — Composition identity:** every protected aggregate result binds the exact composition-policy identity/revision used.
5. **PO-MDI-05 — Unknown preservation:** a material `UNKNOWN`/`UNSUPPORTED` cannot become success without proof of irrelevance or an independently sufficient support set.
6. **PO-MDI-06 — Conflict honesty:** incompatible qualified claims remain representable as conflict; timestamp/majority/latest do not invent a winner.
7. **PO-MDI-07 — Exemption jurisdiction:** an exemption affects only the constraint/domain/operation/effect scope authorized by its issuer.
8. **PO-MDI-08 — Exemption non-erasure:** applying an exemption does not delete or rewrite the underlying defeat/revocation evidence.
9. **PO-MDI-09 — Independent recovery:** rebuilding a baseline for one domain cannot lower or satisfy another domain's floor implicitly.
10. **PO-MDI-10 — Currentness vector:** freshness is preserved per material domain/dimension; no boolean freshness summary may strengthen evidence.
11. **PO-MDI-11 — Time qualification:** lease/expiry semantics identify clock/time authority and uncertainty assumptions.
12. **PO-MDI-12 — Foreign authority containment:** federated source evidence is authoritative only within its declared source jurisdiction; local materiality remains local.
13. **PO-MDI-13 — No bundle/authority merge:** trust or policy material from distinct domains remains distinguishable after exchange/cache/compaction.
14. **PO-MDI-14 — Delegation transparency:** delegated requalification exposes policy/input scope, verifier qualification, unresolved dimensions and horizon.
15. **PO-MDI-15 — Delegation non-ownership:** delegated evaluation cannot mutate canonical business truth or become root business owner by convenience.
16. **PO-MDI-16 — Cross-capability compression:** exported root evidence retains enough guarantee/profile/currentness/lineage information for the consumer's declared appraisal and later requalification.
17. **PO-MDI-17 — Composition-policy evolution:** rolling policy revisions do not silently reinterpret historical results; old/new results bind their policy identity.
18. **PO-MDI-18 — Transport substitution:** direct call, RPC, broker, stream or file exchange cannot alter constraint-composition semantics.
19. **PO-MDI-19 — Offline boundedness:** local autonomous admission uses only locally sufficient constraint/currentness closure for the declared horizon; missing online-required dimensions block or degrade explicitly.
20. **PO-MDI-20 — Floor durability:** restore/restart/cache rollback cannot lower any locally durable monotonic floor in its own domain.
21. **PO-MDI-21 — Support-set awareness:** alternative sufficient derivations are evaluated independently; defeat of one branch does not automatically defeat another qualified branch.
22. **PO-MDI-22 — No hidden override:** adapter/gateway/driver normalization cannot inject an undeclared precedence or exemption between domains.
23. **PO-MDI-23 — Admission/convergence separation:** root admission disposition is distinct from cleanup/requalification backlog progress.
24. **PO-MDI-24 — Client-runtime autonomy:** the runtime can evaluate the declared local composition policy for its promised autonomy horizon without requiring Builder or a central Exchange Plane oracle.

## 17. Adversarial cases

1. A root depends on trust-domain generation 17 and provider generation 17; implementation compares integers and treats them as the same epoch.
2. Global `maxRevision` advances because one tenant changes policy and invalidates unrelated tenants/platform domains.
3. A valid provider floor is treated as satisfying an expired authorization lease.
4. A new semantic profile is numerically larger and is assumed compatible even though its guarantee vector differs.
5. Foreign trust bundle B is merged with A for cache convenience, allowing B's authority to be misapplied to A identities.
6. A local SPIFFE-like bundle sequence is promoted to platform-wide currentness.
7. A partitioned replica reports a monotonic local watermark and it is treated as quorum/global currentness.
8. `UNKNOWN` authorization status is flattened to `false`, then a permit-overrides rule accidentally hides the uncertainty.
9. `UNKNOWN` is flattened to `true` for availability during partition.
10. A deny/defeat in one mandatory domain is hidden because another domain returned `PASS` and the implementation uses permit-overrides by default.
11. A non-security exemption is interpreted as permission to ignore a security revocation.
12. An exemption issuer revokes the exemption, but compacted root evidence retains only final `PASS` and cannot detect the change.
13. Recovery baseline for policy P resets a higher locally persisted trust floor T.
14. Restoring an old snapshot reintroduces a lower provider floor while newer policy state remains, creating a mixed-time vector presented as coherent.
15. Gateway receives all child evidence and starts resolving conflicts by latest timestamp, becoming a semantic oracle.
16. Adapter maps `CONTESTED` and `INCOMPARABLE` to generic error, then retry selects another provider and returns success without preserving the conflict.
17. Delegated verifier supports only three of four material domains but returns one boolean `valid=true`.
18. Two capabilities use different composition-policy revisions for the same exported guarantee and schema compatibility hides the semantic mismatch.
19. Broker redelivery evaluates an old root under a new policy without binding either policy identity to the occurrence.
20. Local/in-process optimization bypasses the same multi-domain admission policy enforced on RPC paths.
21. Alternative derivation B is independently sufficient, but defeat of derivation A causes global root failure because support sets were flattened.
22. Conversely, fallback B is merely available, not guarantee-equivalent, but is treated as independently sufficient.
23. Time-based lease uses wall clock after a backward clock jump and silently extends authority.
24. One domain's refresh outage is interpreted as revocation even though its contract says `UNKNOWN`; another implementation interprets the same outage as success.
25. Cross-capability `PASS` drops tenant/classification scope and is reused for another tenant.
26. A shared database stores all domain states in one `revision` column and accidental sorting becomes policy precedence.
27. Control plane publishes a global epoch for operational convenience; runtimes begin treating it as semantic currentness authority.
28. Exchange Plane caches a conflict resolution and later serves it as canonical business truth after source-domain evidence changes.

## 18. Direct call / RPC / broker / stream / gateway implications

The constraint algebra is transport-independent, but operational behavior remains visible:

- **direct/in-process** can evaluate locally with low latency but must not bypass policy identity/currentness checks;
- **RPC** can fetch current domain evidence synchronously, but timeout remains `UNKNOWN`/declared degraded behavior rather than semantic denial/success by accident;
- **broker/event** can distribute domain changes efficiently, but delivery/ACK does not prove every consumer has observed them;
- **stream/watch** supports incremental convergence, but compacted history requires baseline recovery;
- **gateway** can enforce trust-zone passage and carry policy context, but cannot own cross-domain business conflict resolution;
- **adapter** can translate representations, but must preserve constraint kind, domain, disposition and lossiness;
- **file/offline exchange** can carry signed/qualified baselines for autonomous runtimes, bounded by currentness/security horizons.

No transport is the Capability Exchange Plane itself.

## 19. Portability and exit path

A future implementation remains portable if:

- constraint/domain identities and composition semantics are explicit rather than encoded in one vendor's revision token;
- domain evidence can be exported with provenance/currentness/authority metadata;
- local runtimes can evaluate the declared policy without mandatory central service availability inside their autonomy horizon;
- unknown/conflict/baseline-required states survive provider migration;
- policy/composition revisions are immutable/versioned rather than mutable aliases;
- changing policy engine, broker, trust provider or database does not change the promised guarantee vector without explicit requalification.

A provider that only exports `allow/deny` or one global revision may be operationally useful but is not semantically substitutable where G4 requires multidomain evidence and requalification.

## 20. Deduplication against existing G4 research

This document does not reopen:

- generic multi-domain evidence composition;
- semantic policy-diff proof;
- proof-carrying policy verification;
- generic offline security floors;
- evidence cache invalidation;
- evidence compaction;
- revocation-storm fan-out mechanics;
- split-brain authority reconciliation.

Its material delta is narrower:

`domain-qualified invalidation state -> heterogeneous constraint kinds -> partial-order/vector composition -> explicit combining policy -> scoped exemptions/conflicts -> delegated requalification without authority transfer`.

## 21. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

This round materially changes the boundary model: one sparse invalidation vector is not enough unless each element retains its constraint type and the root binds an explicit composition policy. A global revision is rejected not only as too coarse, but as semantically undefined across incomparable domains.

The next high-value gap is **policy-composition change under in-flight obligations and mixed-time vectors**: how a long-lived occurrence whose support set was admitted under composition policy C1 should behave when C2 changes override/exemption/unknown semantics while independent domain floors advance at different times, without retroactively rewriting admission, silently extending old rights, or requiring a global cutover barrier.