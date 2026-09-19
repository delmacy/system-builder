# Generation 4 — System Builder Product R&D

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`

Generation 4 is the research-and-development layer for the **System Builder product itself** after Generation 3 architectural scope closure. It does not reopen G3 and does not authorize product implementation, Work Packages, Sprints, TASKs, migrations, provider adoption or architecture replacement.

## Purpose

G3 answers primarily what must be representable, governed, traceable, executable and provable in the System Builder model.

G4 asks how the Builder product should realize that architecture with acceptable usability, performance, persistence, infrastructure engineering, operational safety, maintainability and product intelligence.

## Current research state

See `G4_RESEARCH_STATE.md` for the consolidated research status, boundaries and maturity.

## Active G4 research families

1. **Product UX, Living Canvas & AI-Native Builder**
   - `research/G4_PRODUCT_UX_AI_NATIVE_BUILDER.md`
2. **Computational Core & Performance Engineering**
   - `research/G4_COMPUTATIONAL_CORE_PERFORMANCE_ENGINEERING.md`
3. **Data, Persistence, Access & Infrastructure Access**
   - `research/G4_DATA_INFRA_ACCESS_ENGINEERING_BACKLOG.md`
   - `research/G4_AUTHORIZATION_AWARE_DATA_ACCESS.md`
4. **Data Treatment Engineering**
   - `research/G4_DATA_TREATMENT_ENGINEERING_BACKLOG.md`
   - `research/G4_DATA_TEMPORAL_STREAMING_SEMANTICS.md`
   - `research/G4_DATA_RETENTION_ERASURE_REPRODUCIBILITY.md`
5. **Infrastructure Engineering & Control Plane**
   - `research/G4_INFRASTRUCTURE_ENGINEERING_BACKLOG.md`
6. **Engineering Lifecycle, Product Change & Continuous Improvement**
   - `research/G4_ENGINEERING_LIFECYCLE_CONTINUOUS_IMPROVEMENT.md`
7. **Self-Hosting, Autonomic Control & Bounded Self-Evolution**
   - `research/G4_SELF_HOSTING_AUTONOMIC_EVOLUTION.md`
8. **Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model**
   - `research/G4_CAPABILITY_EXCHANGE_PLANE_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_CONTRACT_COMPATIBILITY.md`
   - `research/G4_CAPABILITY_EXCHANGE_CAUSAL_WORKFLOW_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_VERIFICATION_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_REFERENCE_MODEL_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_EFFECT_COMPOSITION_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_HIERARCHICAL_RIGHTS_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_NON_FENCEABLE_EFFECTS_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_HETEROGENEOUS_EFFECT_COMPOSITION_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_INFLIGHT_CONTRACT_EVOLUTION_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_OFFLINE_SECURITY_FLOORS_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_EVIDENCE_MINIMAL_SECURITY_RECONCILIATION.md`
   - `research/G4_CAPABILITY_EXCHANGE_PRIVACY_PRESERVING_EVIDENCE_FEDERATION.md`
   - `research/G4_CAPABILITY_EXCHANGE_PRIVACY_COLLUSION_METADATA_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_PRIVACY_ABUSE_GOVERNANCE_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_FEDERATED_ANONYMOUS_BUDGET_CONSERVATION.md`
   - `research/G4_CAPABILITY_EXCHANGE_PRIVACY_PRESERVING_ISSUER_ACCOUNTABILITY.md`
   - `research/G4_CAPABILITY_EXCHANGE_WITNESS_GOVERNANCE_CORRELATED_COMPROMISE.md`
   - `research/G4_CAPABILITY_EXCHANGE_MULTI_DOMAIN_EVIDENCE_COMPOSITION.md`

These are research families, not committed product modules. Future synthesis may merge, split or providerize them.

## Governing rules

1. `G3 semantic decision != G4 technology binding`.
2. `Research candidate != implementation authority`.
3. `Polyglot-ready != polyglot-from-day-one`.
4. `Measured hotspot -> candidate specialization`; language or database preference alone does not justify migration.
5. Canonical meaning must remain portable across storage, query, index, runtime and infrastructure providers.
6. Generated client runtimes remain autonomous from Builder availability.
7. G4 findings should prefer provider-neutral contracts, migration paths, evidence, benchmarks and exit criteria before adoption.
8. `Self-managing != unrestricted self-modifying`.
9. `Shared lifecycle semantics != shared authority`.
10. UI/Canvas/AI/index/cache/telemetry remain projections or assistants, never silent canonical authority.
11. `Shared primitives != shared business ownership`.
12. `Logical Exchange Plane != single broker`.
13. `Interface compatibility != contract compatibility`.
14. Drivers/adapters/gateways may mediate mechanisms or semantics only within declared guarantees; they must not fabricate equivalence or become accidental canonical business owners.
15. Exchange semantics may be shared; business semantics and business ownership remain capability-local.
16. `Compatibility is multidimensional`; schema/version acceptance alone does not prove semantic, authority, delivery, ordering, temporal or operational substitutability.
17. Provider/binding capability advertisement is an offer requiring qualification against the required contract profile.
18. `Trace/correlation != business causation != authority`; observability propagation cannot become business proof by convenience.
19. `Compensation != rollback`; compensating work is a new governed effect with its own authority, currentness and evidence.
20. `Workflow progress != transport progress`; orchestration/choreography remain business coordination semantics above the logical Exchange Plane.
21. `Same happy-path output != semantic conformance`; binding qualification requires a transport-independent oracle, fault/currentness evidence and explicit treatment of `UNKNOWN`.
22. `One interaction kind != one universal linearization point`; admission, durability, authoritative effect, caller observation, settlement and convergence are distinct proof positions unless a contract proves otherwise.
23. `Safety != liveness`; eventual progress requires explicit environmental/fairness assumptions, while finite missing evidence may legitimately remain qualified `UNKNOWN`.
24. `Convergence != invariant preservation`; deterministic replica agreement cannot substitute for capability-owned business correctness.
25. `Commutativity is contract/invariant-relative`; same final bytes, disjoint writes or mergeability do not prove business effects commute.
26. Coordination scope must follow the invariant: independent/commutative execution, causal ordering, reservation/escrow, scoped serialization or compensation/manual reconciliation are qualified alternatives rather than one global default.
27. `Idempotency != fencing`; retry safety does not prove stale-holder exclusion, conflicting-intent ordering or exclusive reservation ownership.
28. `Target-local atomicity != cross-domain atomicity`; conditional writes, one-shot tokens or target reservations qualify only the effect/invariant scope they actually enforce.
29. Non-fenceable external domains must reduce autonomy, quarantine uncertainty or reject offline delegation/reallocation when no target-side equivalent can preserve the required hard invariant.
30. `Latest deployment != in-flight semantic migration`; running obligations remain on their qualified historical basis until explicit pinning, mediation, migration, forward recovery or manual settlement changes that basis.
31. `Schema compatibility != obligation compatibility`; authority, effect identity, idempotency/reservation namespace, compensation and settlement semantics must be qualified independently.
32. `Historical semantic continuity != historical executable continuity`; an old contract/effect may remain interpretable after its vulnerable executable is revoked.
33. `Security retirement != semantic settlement`; revoking an artifact/provider stops future execution but does not erase prior effects or outstanding obligations.
34. `Signature/provenance valid != currently security-admissible`; rollback/freeze protection and security floors remain independent from historical artifact identity.
35. `Previously trusted != indefinitely security-admissible`; offline runtimes require bounded security currentness rather than perpetual trust in historical signatures.
36. `Offline autonomy != unlimited stale-security operation`; maximum disconnected security horizon and stale-operation policy must be explicit.
37. `Security currentness != business authority currentness`; each is an independent proof domain required according to the interaction contract.
38. `Revocation effective time != runtime observation time`; reconnect must preserve both and reconcile stale-window effects without rewriting history.
39. `Golden/A-B rollback != security-floor rollback`; anti-rollback trust state must survive every recovery boundary for which that guarantee is claimed.
40. `Evidence sufficient != payload retained`; security reconciliation should preserve the minimum policy-authorized witness for declared proof purposes rather than full business history by default.
41. `Security evidence store != retention exemption`; audit/security witnesses remain sensitive governed data with their own retention, access and erasure semantics.
42. `No witness != no effect`; expired, erased or unavailable evidence must preserve qualified uncertainty instead of fabricating absence.
43. `Signed/tamper-evident != non-sensitive/permanently retainable`; witness integrity, confidentiality, currentness and retention are independent proof domains.
44. `Proof continuity != global identity continuity`; cross-runtime reconciliation should use the narrowest correlation scope that satisfies the declared proof purpose.
45. `Dedup scope != global correlation scope`; recognizing sameness for retry/reconciliation does not justify a platform-wide stable identifier.
46. `Proof of predicate != disclosure of source record`; selective evidence may satisfy a contract without exposing unrelated business/tenant metadata.
47. `Federation != trust-domain collapse`; issuer/trust-domain bindings and authority scopes remain distinct across federated verification.
48. `Cryptographic key rotation != semantic identity rotation != correlation-reference rotation`; each has separate continuity and erasure obligations.
49. `Cryptographically unlinkable != operationally unlinkable`; timing, routing, trace, size, status queries and issuer/configuration metadata remain correlation surfaces.
50. `Backpressure != abuse attribution`; capacity pressure and malicious/business abuse are separate proof domains.
51. `Accountability for bounded resource consumption != global subject linkability`; privacy-preserving spend may be bounded without universal subject correlation.
52. `Privacy mechanism != conservation mechanism`; unlinkable grants still require qualified issuance authority when they consume a shared invariant budget.
53. `Anonymous redemption != anonymous minting authority`; offline issuers may spend only predelegated issuance capacity unless the contract explicitly allows oversubscription.
54. `Per-issuer uniqueness != federation-wide uniqueness`; anti-Sybil claims must name the uniqueness proposition and federation scope they actually prove.
55. `Token cryptographically valid != issuer remained within issuance authority`; issuer compromise and over-minting are independent from token-format validity.
56. `UNKNOWN issuance != free budget`; ambiguous grant/allocation consumes or quarantines capacity until settlement.
57. `After-the-fact auditability != pre-issuance conservation`; detection evidence cannot retroactively preserve a hard budget.
58. `Aggregate arithmetic proof valid != issuance ledger complete`; completeness needs an independently qualified issuance-path property.
59. `Append-only transparency != non-equivocation by itself`; isolated observers may accept different locally consistent histories unless the observer model exposes forks.
60. `Liability accountability != holder identity disclosure`; aggregate outstanding liability may be governed without a universal subject graph.
61. `Duplicate observation != proven holder abuse`; attribution requires a declared evidence/exculpability contract.
62. `k-of-n signatures != k independent trust failures`; quorum arithmetic must not fabricate witness independence.
63. `New witness policy valid != old/new histories joined`; witness-generation rotation needs explicit transition continuity.
64. `Checkpoint non-equivocation != witness-policy non-equivocation`; policy lineage/distribution is its own split-view surface.
65. `Quorum-valid checkpoint != sufficiently current checkpoint`; validity and freshness/currentness remain independent proof domains.
66. `Witness consistency approval != semantic/content monitoring`; witnesses do not become business authority by observing a consistent checkpoint.
67. `All domains locally valid != cross-domain compatible state`; independent proof validity is not a composition proof.
68. `Cross-domain composition != synthetic global revision number`; autonomous proof domains retain independent lineage/currentness.
69. `Domain checkpoint valid != composition predicate satisfied`; domain evolution evidence and cross-domain admissibility are distinct proof objects.
70. `Multiple valid transparency domains != one atomic semantic state`; evidence diversity does not create semantic atomicity.
71. `One stale/forked domain != every domain invalid`; failure blast radius follows declared proof dependencies.
72. `Evidence aggregation != semantic compatibility fabrication`; gateways/adapters cannot invent missing composition guarantees.
73. `Joint hard invariant != global transaction requirement`; coordinate only the domains required by the named invariant.

## Product direction being researched

The Builder may evolve from a system generator into a broader **operational systems control substrate** capable of modeling, assembling, compiling, deploying, observing, operating and evolving systems — potentially including itself — while remaining above and interoperable with ordinary operating systems, cloud providers, container runtimes and external infrastructure.

The Shared Semantic Kernel / Capability Exchange Plane hypothesis explores whether replaceable suite capabilities can share a very small structural language and explicit interaction contracts while remaining independently owned and deployable. The logical plane is not a requirement for a central broker, shared database or ESB. Contract compatibility is a guarantee vector rather than a schema/version boolean. Long-lived occurrences additionally require per-obligation contract lineage. Security support is an independent horizon. Autonomous runtime security requires locally durable trust continuity, bounded security-policy freshness and explicit reconciliation after disconnection. Late security reconciliation should retain only purpose-qualified witness material. Federated evidence exchange needs purpose-bounded correlation. Privacy-preserving resource governance must distinguish issuance conservation from redemption privacy. Issuer accountability separates preventive conservation from retrospective detection. Witness governance makes quorum security conditional on declared correlated-failure assumptions. Multi-domain evidence composition additionally keeps independently valid capability/issuer/security/authority evidence as a qualified vector with explicit compatibility predicates rather than fabricating one global revision or transaction.

This is a research hypothesis, not a product claim or implementation authorization.

## Research workflow

```text
G3 architecture closure
        |
        v
G4 research inventory
        |
        v
benchmarks / prototypes / failure cases
        |
        v
implementation-independent product architecture
        |
        v
provider / technology qualification
        |
        v
explicit planning authorization
        |
        v
WBS / Work Packages / implementation
```

Do not materialize G4 automatically from these documents.