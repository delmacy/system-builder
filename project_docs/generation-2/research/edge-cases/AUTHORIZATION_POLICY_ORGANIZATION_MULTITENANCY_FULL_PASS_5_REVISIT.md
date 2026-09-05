# Generation 2 — Authorization / Policy / Organization / Multitenancy — Full Pass 5 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Authorization / Policy / Organization / Multitenancy
Pass: 5
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_EDGE_CASE_REGISTER.md`, adversarial framework and processual/semantic conflict classification.

Research only. No product code, Work Package, TASK, Construction, implementation guard or concrete remediation is authorized. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Full Pass 5 research lens

This revisit deliberately carried the priority hypothesis **Typed Semantic Graph + ExecutionEnvelope + Autonomous Builds/Fleet Observability** into authorization without adopting it as target architecture.

The challenge model separated:

`canonical subject/resource/action/scope semantics -> policy/relationship revision -> CapabilityUse/operation -> BuildRevision/Release -> RuntimeRealization/Deployment -> authorization decision/effect -> local evidence -> exported telemetry -> Fleet aggregate`

The following distinctions were held invariant during the probes:

- authentication evidence != authorization;
- external/provider group or subject != canonical Person/Role/Station/Enterprise authority;
- semantic graph identity != provider policy-store identity;
- `CapabilityDefinition != CapabilityUse/Invocation`;
- graph definition != runtime authorization state;
- policy/relationship revision != current runtime enforcement convergence;
- runtime truth != local evidence != exported telemetry != Fleet aggregate != control authority;
- shared infrastructure != shared truth;
- Fleet-derived risk/capacity/placement signal != grant/deny/control authority;
- Graph semantics != GraphDB/storage-provider choice.

## 2. Techniques rotated for Pass 5

1. **typed relation-cut substitution** — evaluate a locally valid authorization query after removing or replacing one typed relationship edge, entity slice, tenant qualifier or revision reference while preserving syntactic validity;
2. **causal-cut braid** — interleave resource mutation, relationship/policy mutation, authorization decision and downstream actuation to search for old-grant/new-object and new-grant/old-object contradictions;
3. **semantic/build/deployment identity fracture** — hold `CanonicalCapabilityRef` constant while varying build, deployment, provider, tenant/workspace and policy revision, looking for unsafe Fleet or cache equivalence;
4. **shared-infrastructure adversarial projection** — place multiple tenants on shared runtime/control-plane resources and remove one logical isolation dimension at a time without assuming namespace/cluster/database as the universal tenancy primitive;
5. **policy-graph slice incompleteness** — bound the entity/relationship slice used by authorization and test whether omitted reachable entities can change the result while the local request remains type-valid;
6. **long-running envelope revision crossing** — admit work under revision R1, then change membership, delegation, SoD or inherited constraints before later capability uses/effects;
7. **external evidence downgrade** — substitute IdP/group/token/telemetry/Fleet attributes for canonical grants and test whether evidence is accidentally promoted to authority;
8. **objective-pressure inversion** — optimize latency, availability, cache reuse, colocated placement or Fleet balancing while currentness/tenant/SoD constraints remain fixed;
9. **AI/low-code authority-delta composition** — compose individually permitted capability uses/relations/policies into a graph whose transitive reachable authority is compared with the delegator envelope;
10. **duplicate-screen** against all 119 authoritative reusable `G2-CONFLICT-PATTERN-*` families.

All 12 mandatory clusters were already explicitly exercised in Full Pass 5 before this revisit. The Authorization capability's local and Identity × Authorization × Station × AGWS × AI streaks were already at 2; this revisit does not inflate them.

## 3. Evidence refresh

Fresh official and consolidated evidence supports existing classes rather than a new family.

### 3.1 Relationship graph revision and causal ordering

Google's Zanzibar paper describes a uniform relationship-oriented authorization model whose decisions respect causal ordering of user actions and provide external consistency across ACL and object changes. Portable inference: a relationship graph is not safe merely because the graph shape is valid; the relationship/object revision cut used for a consequential decision matters. Source: Google Research / USENIX ATC 2019, accessed 2026-09-05.

OpenFGA documents immutable authorization models and strongly recommends passing a specific `authorization_model_id`; its best-practices documentation states that pinning the model ID gives consistent behavior until a deliberate switch. Portable inference: `latest` is not a sufficient revision contract for long-running or cross-build work. Sources: OpenFGA Immutable Authorization Models and Tuples/API Best Practices, updated 2026-09-04 and accessed 2026-09-05.

### 3.2 Typed entity graph and incomplete slices

Cedar validation uses schema knowledge about principal/resource/context types and allowed parent-child relationships, but validation is separate from request evaluation. Its documentation also notes that missing entity data can cause evaluation errors and that policies validated before a schema change can later behave differently. Cedar level validation explicitly bounds relationship/entity dereference depth so an application can compute a sufficient slice of entity data. Portable inference: a typed semantic graph may support static and pre-execution checks, but a type-valid request over an incomplete or stale entity slice does not prove a current authorization result. Sources: Cedar Policy Validation and Policy Level Validation, accessed 2026-09-05.

### 3.3 Shared infrastructure without shared truth

Kubernetes multi-tenancy guidance treats namespaces as one logical isolation mechanism but explicitly states that isolation requires authorization, networking, quotas and other controls, and that some resources are non-namespaced. It also describes virtual control planes when namespace isolation is insufficient. Portable inference: shared cluster/control-plane infrastructure does not itself define tenant truth or prove anti-cross-tenant isolation; tenancy must remain an explicit semantic scope with qualified realization evidence. Source: Kubernetes Multi-tenancy documentation, accessed 2026-09-05.

These sources do not prescribe System Builder target architecture, GraphDB, a policy engine, or a Fleet control plane.

## 4. Duplicate-screen results

No genuinely new material local edge, cross-capability scenario, reusable ConflictPattern or preventive invariant survived duplicate-screening.

| Challenged mechanism | Existing authoritative coverage | Disposition |
| --- | --- | --- |
| relationship/object revisions form a causally inconsistent authorization cut | `G2-EDGE-AUTHZ-002,003,006`; authority-currentness, revision-vector, temporal/order and adoption/convergence patterns | DUPLICATE / NO NEW MATERIAL |
| authorization query is type-valid but entity/relationship slice is incomplete | `G2-EDGE-AUTHZ-003,007`; qualified-claim/currentness, presence-semantics and resource-bound graph families | DUPLICATE / NO NEW MATERIAL |
| canonical capability is same while build/deployment/provider/policy revision differs | `G2-EDGE-AUTHZ-006`; semantic identity, compatibility-direction, provider-qualification and revision-coexistence families | DUPLICATE / NO NEW MATERIAL |
| shared cluster/runtime resource causes tenant alias or scope leakage | `G2-EDGE-AUTHZ-004`; `G2-CONFLICT-PATTERN-MULTITENANT-SCOPE-001`; trust-namespace and cross-tenant identity families | DUPLICATE / NO NEW MATERIAL |
| long-running `ExecutionEnvelope` crosses grant/revoke/delegation/SoD revision | `G2-EDGE-AUTHZ-002,003,005,006`; authority-currentness and SoD/delegation patterns | DUPLICATE / NO NEW MATERIAL |
| provider group/token/Fleet attribute is promoted from evidence into canonical grant | `G2-EDGE-AUTHZ-002,004`; semantic-ownership, effective-identity and authority-currentness families | DUPLICATE / NO NEW MATERIAL |
| latency/availability/Fleet placement optimization weakens isolation/currentness | `G2-EDGE-AUTHZ-001,003,004,007`; objective-conflict, policy-precedence, resource and multitenant-scope families | DUPLICATE / NO NEW MATERIAL |
| AI/low-code composes allowed nodes/edges into transitive authority wider than delegator | `G2-EDGE-AUTHZ-005,007`; permission-composition, SoD/delegation and AI/AGWS non-amplification families | DUPLICATE / NO NEW MATERIAL |
| GraphDB or graph projection is treated as canonical authority merely because traversal is convenient | semantic ownership + provider-realization + canonical/provider identity families | DUPLICATE / NO NEW MATERIAL |

The strongest apparent new candidate was **authorization decision over an incomplete typed relationship slice**. It does not justify a new ConflictPattern: activation, owners, detection and remediation route are already covered by incomplete/currentness evidence plus policy-graph/resource bounds. The research consequence is to preserve slice sufficiency/currentness as an explicit proof concern if graph semantics later survive Planning C.

## 5. Processual / semantic conflict classification

All required conflict families were challenged explicitly.

- structural: policy/relationship cycles, unreachable responsibility and unbounded graph traversal;
- state/transition: grant/revoke/use and break-glass expiry races;
- semantic ownership: external relationships/Fleet attributes versus canonical organization authority;
- rule/formula/condition: allow/deny/inheritance and `ABSENT/null/default` attribute semantics;
- temporal/ordering: causally inconsistent relationship/object cuts and long-running revision crossing;
- resource/capacity: pathological policy graphs, cache/control-plane pressure and noisy-neighbor effects;
- authority/responsibility/SoD: role closure, delegation, emergency paths and AI-composed transitive reach;
- policy/compliance: superior inherited constraints versus local availability/cost objectives;
- data/consistency: stale or incomplete entity slices;
- provider/integration: provider policy-store identity, feature labels and group claims versus portable semantics;
- version/migration/coexistence: pinned versus latest model, residual/offline enforcement cohorts;
- exception/recovery: revived obsolete authority evidence after recovery/offline operation;
- human-procedure: contradictory manual grant/revoke/break-glass instructions;
- cross-process: separately valid workflows sharing authority/resource scopes;
- objective/optimization: Fleet capacity/latency placement versus least privilege/isolation/currentness;
- AI/low-code: safe fragments forming unsafe transitive authority.

No new material family, unowned universal primitive or owner gap was found. No `ConflictInstance` is claimed and no bounded Planning-A backfill is required.

## 6. Priority hypothesis disposition

The Typed Semantic Graph + ExecutionEnvelope + Autonomous Builds/Fleet Observability hypothesis **survives this capability revisit as a research hypothesis only**.

Evidence supports carrying the following questions forward if saturation ultimately passes:

1. a semantic graph can represent typed subjects, resources, scopes, capability uses, policy/relationship revisions and provenance, but its definition must remain separate from live authorization/enforcement state;
2. `ExecutionEnvelope` should carry bounded canonical references/revisions/context needed for a capability use, while detailed authorization evidence/journal remains separate rather than accumulating without bound;
3. long-running actions need explicit checkpoint semantics for current versus pinned/grandfathered authority — the graph alone cannot choose that policy;
4. graph persistence can remain relational initially; no evidence here requires GraphDB;
5. Fleet can aggregate authorization-risk/currentness/isolation diagnostics, but a Fleet observation is not a grant, deny, tenant identity or runtime authority;
6. shared infrastructure can be economical without shared truth only when semantic tenant/workspace boundaries and realization isolation evidence remain explicit;
7. cross-build metrics and authorization diagnostics require build/release/deployment/provider/policy-revision qualification before semantic aggregation.

These are Planning C decision inputs, not decisions taken in this phase.

## 7. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new preventive invariants: **0**;
- Authorization local no-material streak: **remains capped at 2**;
- `Identity × Authorization × Station × AGWS × AI` cluster streak: **remains capped at 2**;
- all other mandatory-cluster streaks: **unchanged**;
- material edge inventory: **284**;
- reusable ConflictPattern inventory: **119**;
- combined material findings: **403**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 5 capability coverage after this revisit: **17/28**;
- Full Pass 5 mandatory-cluster coverage: **12/12**;
- completed full passes: **4/8 minimum**;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

## 8. Next rotation candidate

Continue Full Pass 5 with **Governance / Compliance / Audit**. Carry Typed Semantic Graph + ExecutionEnvelope and Autonomous Builds/Fleet Observability into typed control/obligation/evidence relationships; audit provenance versus runtime truth; inherited control precedence; waiver/exception scope and expiry; remediation acknowledgement versus effective closure; policy/control revision products; shared-infrastructure tenant evidence; Fleet aggregate/compliance signal versus canonical evidence; `ABSENT/null/default`; `PARTIAL/UNKNOWN`; residual/offline cohorts; high-cardinality evidence/resource pressure; conflicting human procedures/objectives; and AI/low-code that bypasses, fabricates or mis-scopes controls. Duplicate-screen against all 119 ConflictPatterns. Preserve already-satisfied streaks at 2 absent genuinely new material. Do not enter Planning C.
