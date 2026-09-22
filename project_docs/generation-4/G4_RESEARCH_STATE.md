# G4 Research State — System Builder Product R&D

Date: 2026-09-21
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Purpose

Generation 4 follows G3 architectural closure and studies how the System Builder product should realize that semantic substrate with usable interaction, measurable performance, robust data/infrastructure engineering, controlled lifecycle management, bounded self-management and interoperable capability boundaries. G4 does not reopen G3 and does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations or provider adoption.

This file is the compact consolidated state. Detailed evidence, adversarials, trade-offs and source-specific findings live in the dedicated documents under `project_docs/generation-4/research/`; compaction here does not supersede those durable research artifacts.

## Current research families

1. Product UX, Living Canvas & AI-native Builder interaction.
2. Computational Core & Performance Engineering.
3. Data, Persistence, Access & Infrastructure Access Engineering.
4. Data Treatment Engineering.
5. Infrastructure Engineering & Control Plane R&D.
6. Engineering Lifecycle, Product Change & Continuous Improvement.
7. Self-Hosting, Autonomic Control & Bounded Self-Evolution.
8. Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model.

These families may later be deduplicated or recomposed. A research family is not automatically a product module.

### Active product-interface consolidation

The Product UX / Living Canvas family now has a dedicated research artifact:
`research/G4_MAIN_COMPOSITION_CANVAS_3D_RESEARCH.md`.

Current interface hypothesis being researched:

- stable React/DOM shell with Office-style Ribbon, Tool Rail, WorkSurface, Inspector and Status/Activity bar;
- semantic 3D WorkSurface rather than decorative 3D;
- multiple projections of the same canonical model rather than one universal canvas;
- modules represented as flexible-height towers/pillars according to floor participation;
- floor manifestations as context-specific projections of one module identity;
- bounded context as semantic envelope plus internal onion/radial depth;
- capability participation as a cross-cutting axis/shaft, not ownership hierarchy;
- contracts as formal semantics/guarantees of access, exposed through ports/entry points;
- doors/counters as interaction metaphors for admissible boundaries and request/action surfaces;
- workflow/data-flow as trajectories through module structure rather than mandatory onion rings;
- vertical, horizontal and lateral hubs as primary structural interconnection primitives;
- handoffs/gates/evidence and designed-vs-observed conformance as operational overlays;
- server/host basements as deployment foundations from which runtime/module towers emerge;
- twin towers/availability groups for multiple manifestations of one logical module identity;
- explicit separation of visual grouping, semantic grouping and actual deployment mutation;
- desired/observed/effective placement remaining distinct;
- guided 3D navigation, semantic zoom, LOD, clustering, render-on-demand and non-3D accessibility fallbacks;
- permanent `Componentes` inventory/state-lab coverage for reusable canvas/topology elements.

Key research invariants added by this consolidation include `3D semantic != 3D decorative`, `Module Identity != Deployment Placement != Runtime Instance`, `Capability participation != semantic ownership`, `Visual connectability != semantic compatibility`, `Visual proximity != deployment merge`, `Arrange != Group != Deploy`, `Desired != Observed != Effective`, `Transport != Contract`, `Aggregation != silent omission` and `3D mode != mandatory interaction mode`.

This remains research-only and does not authorize renderer/package adoption or frontend implementation.


## Cross-cutting rules

### Constitutional / product boundaries

- `G3 semantic decision != G4 technology binding`; `Research candidate != implementation authority`.
- `Polyglot-ready != Polyglot-from-day-one`; `Measured bottleneck -> qualified specialization candidate`.
- `Builder != Runtime`; published client runtimes remain autonomous.
- `Projection/index/cache/vector/telemetry != canonical truth`; `AI inference != authority`.
- `Self-managing != unrestricted self-modifying`.
- `Shared primitives != shared business ownership`; `Shared lifecycle semantics != shared authority`.
- `Logical Exchange Plane != single broker`; `Exchange Plane owns exchange semantics; capability owns business semantics`.
- `Interface compatibility != contract compatibility`; compatibility is multidimensional.
- Drivers/adapters/gateways may normalize or mediate only declared semantics; they must not fabricate equivalence or become accidental canonical owners.

### Exchange / effect boundaries

- `Provider ACK != effective state`; `Message/broker acceptance != consumer/business effect`.
- `Trace/correlation != business causation != authority`; `Cross-capability reference != ownership transfer`.
- `Workflow progress != transport progress`; `Compensation != rollback/time reversal`.
- `UNKNOWN` is an evidence-domain disposition, not permission to guess.
- `One interaction kind != one universal linearization point`.
- `Safety != liveness`; `Convergence != invariant preservation`; commutativity is contract/invariant-relative.
- Coordination scope follows the invariant; reservation/escrow is not a universal transaction replacement.
- `Idempotency != fencing`; `Target-local atomicity != cross-domain atomicity`.
- `Right transfer ACK != old holder fenced`; `Fencing token generated != fencing enforced`.
- `Ambiguous rights != free capacity`.

### Evolution / security / evidence boundaries

- `Latest deployment != in-flight semantic migration`; `Schema compatibility != obligation compatibility`.
- `Historical semantic continuity != historical executable continuity`; `Security retirement != semantic settlement`.
- `Signature/provenance valid != currently security-admissible`; `Previously trusted != indefinitely security-admissible`.
- `Offline autonomy != unlimited stale-security operation`; `Security currentness != business authority currentness`.
- `Revocation effective time != runtime observation time`; `Golden/A-B rollback != security-floor rollback`.
- `Evidence sufficient != payload retained`; security evidence is not a retention exemption.
- Historical semantic interpretation, continuation authority and new-effect admissibility remain distinct.

### Privacy / federation / proof boundaries

- `Proof continuity != global identity continuity`; `Dedup scope != global correlation scope`.
- `Proof of predicate != disclosure of source record`; `Federation != trust-domain collapse`.
- `Cryptographically unlinkable != operationally unlinkable`; privacy guarantees name observer/collusion assumptions.
- Rate, quota, cost, concurrency, capacity, issuance, redemption and anti-Sybil guarantees remain separately scoped.
- `Append-only transparency != non-equivocation`; quorum validity does not imply currentness.
- `All domains locally valid != cross-domain compatible state`; evidence aggregation cannot fabricate semantic compatibility.
- `Anti-rollback != anti-downgrade`; old/new policy coexistence is not permission union.
- `Text/AST diff != semantic policy diff`; `Same admitted request set != same guarantee vector`.
- `Proof verification != re-solving`; `Proof valid != translation correct`; producer provenance is distinct from semantic derivation.
- `Verifier installed != verifier qualified`; verifier replacement is a TCB/trust transition.
- `Two verifiers agree != proposition semantically valid`; differential disagreement is evidence, not majority truth.
- `Latest semantics != historical semantics`; proofs bind immutable semantic snapshots.
- `Semantic resolvability != current admissibility`; mutable aliases are not semantic identities.

### Profile negotiation / lifecycle boundaries

- `Supported profile != admissible profile for this interaction`; support, admissibility and preference are distinct.
- `Anti-downgrade != always choose numerically newest`; no common admissible profile does not permit fallback to arbitrary support intersection.
- Negotiation binds immutable semantic identity, peer/trust identity, interaction scope and security/currentness context.
- `Negotiated semantics != transport negotiation`; topology substitution preserves selected semantic identity.
- `Discovered support != negotiated contract`; advertisement is not proof of executed semantics.
- `Previously negotiated != indefinitely admissible`; cached evidence has identity/policy/floor/currentness horizons.
- `Negotiated once != admissible forever`; negotiation evidence has declared pinning scope/lifecycle.
- `Stream continuity != invisible semantic mutation`; queued-work admission semantics remain distinct from delivery-time execution admissibility.
- `Retry/redelivery/failover != new semantic admission`.
- `New implementation present != new semantic profile activated`.
- `Implementation rollback != semantic-profile rollback != security-floor rollback`.
- `Floor publication time != floor effective time != runtime observation time != effect time` where material.
- `Topology/path migration != semantic occurrence migration`.
- `Admission drained != effect obligations drained != historical interpretation drained`.

### Semantic generation handoff / recovery boundaries

- `Occurrence identity != one global semantic generation`; one occurrence may contain independently pinned branches.
- `Per-branch order != global order`; transport-local ordering cannot be extrapolated into total business order.
- `Cutover scope follows the protected invariant`; independent branches may advance separately.
- `All branch messages arrived != join predicate satisfied`; joins name effect/settlement/currentness requirements.
- `Generation marker observed != old generation fenced`; `Queue drained != old generation fenced`.
- `Batch transport boundary != semantic generation boundary`; batching does not create business atomicity.
- `Connection generation != stream/branch semantic generation`.
- `Delivery attempt generation != obligation semantic generation`; retry/redelivery retains lineage absent explicit migration/re-admission.
- Mixed-generation joins require semantic compatibility and authority/currentness qualification, not schema readability alone.
- Failure during handoff preserves a representable partial frontier rather than false completion.
- `Recoverable state != retained full history`; compacted frontiers may replace detail only when live safety/recovery questions remain answerable.
- `Compaction != semantic forgetting`; below-floor references require explicit behavior rather than fabricated absence.
- Transport replay, deduplication, semantic resolvability and authority/security horizons are independent.
- `Dedup window expired != old obligation became new`.
- `Checkpoint complete != external effects settled`.
- Negative/revocation/fencing evidence outlives resurrection paths or is subsumed by a stronger durable fence.

### Cross-runtime DR / split-brain boundaries

- `Frontier transferred != frontier admissible here`; evidence coverage across payload, progress, semantics, effects, authority, negative evidence and topology is multidimensional.
- `Replica complete for bytes != complete for semantic recovery`; provider-local cursor/checkpoint progress cannot manufacture effect settlement.
- `Endpoint moved != old effect authority fenced`; promotion is an authority transition where conflicting effects can occur.
- `RPO/RTO != semantic safety proof`; expected loss windows do not justify guessing a missing effect's disposition.
- `Failback != undo failover`; divergent post-promotion histories require reconciliation.
- `Connectivity restored != authority reconciled`; reconnection does not make either local latest state globally authoritative.
- `Histories mergeable != effects jointly admissible`; convergent data and irreversible/non-commutative side effects use different reconciliation laws.
- `Leader/lease elected != stale holder externally fenced`; effect-side exclusion must be enforced where the effect occurs or independently proven.
- `Latest timestamp != semantic winner`; wall-clock recency cannot invent ownership, conservation, settlement or security authority.
- Conflict resolution never erases historical external effects; dual-side effects remain facts with provenance/remediation obligations.
- Rejoin admission follows invariant-scoped authority reconciliation; independent invariants need not share a global barrier.

### Partition policy / degraded-mode boundaries

- `Capability degraded != every operation degraded identically`; degraded behavior is operation/interaction/invariant-scoped.
- `Dependency reachable != operation semantically admissible`; reachability, provider health, contract/profile compatibility, currentness, authority, effect rights and settlement are distinct dimensions.
- `Dependency unreachable != every operation must stop`; bounded stale reads, local convergence, preallocated rights or queue-without-effect may remain safe when explicitly contracted.
- `Health check green != operation admissible`; infrastructure health is not semantic/security authority.
- `Circuit open != business permission denied`; resilience path state is operational evidence, not canonical policy truth.
- `Graceful degradation != guarantee weakening by surprise`; hard safety/security/ownership invariants cannot be silently relaxed for availability.
- `Failover target healthy != failover target contract-compatible`; routing failover preserves or explicitly requalifies negotiated semantics.
- `Control plane unavailable != data plane must stop`; statically stable runtime operation may continue from locally durable state within declared currentness/security horizons.
- `Cached control-plane state != indefinitely current authority`; autonomy remains bounded by freshness/security policy.
- `Resource overload != semantic incompatibility`; load shedding and semantic admission are separate dimensions.
- `Borrowable execution capacity != borrowable authority/quota/effect rights`; resource scheduling cannot transfer business rights.
- `Dependency fallback succeeded != caller's original contract satisfied`; downstream degradation/lossiness propagates as qualified evidence through dependency composition.
- `Dependency healthy again != degraded obligations settled`; recovery requalifies queued, divergent, stale and unknown work.
- No central availability/health oracle becomes mandatory semantic authority for autonomous runtimes.

### Degraded dependency graph / guarantee synthesis boundaries

- `Dependency graph != orchestration ownership`; graph edges express required claims, not authority to own downstream business workflows.
- `Dependency graph != call graph`; semantic requirements can exist without a synchronous call and calls can be operationally incidental.
- `All dependencies returned != end-to-end guarantee satisfied`; root guarantees are constrained by material currentness, compatibility, authority, effect and settlement evidence.
- Hard, optional, alternative, conditional, effect-settlement, currentness/authority and resource-guard relations remain distinct.
- `Optional enrichment != hard dependency`; optionality is scoped to a root operation/guarantee and cannot be generalized globally.
- `Critical path != minimal semantic cut set`; a cut set is defined per protected invariant/guarantee rather than latency/topology centrality.
- `Fallback available != fallback contract-equivalent`; transparent substitution requires the required guarantee vector to remain satisfied.
- Guarantee synthesis cannot strengthen downstream evidence: `PARTIAL -> COMPLETE`, `UNKNOWN effect -> SETTLED`, or stale authority -> current authority requires explicit proof/irrelevance, never relabeling.
- `Retryable locally != safe to retry end-to-end`; retry ownership, stable effect identity and idempotency/dedup/fencing remain explicit.
- Retry/fallback attempt, time, concurrency, cost and queue budgets are end-to-end resources; child layers cannot silently mint additional budget.
- `Graph acyclic structurally != no feedback cycle`; retries, fallback recursion, queues, health flapping and recovery can form dynamic amplification loops.
- Bulkheads/circuit breakers/timeouts/backoff/jitter protect execution and failure domains but do not become business-semantic authority.
- Fan-out/fan-in completion depends on declared branch requirements/dispositions, not response count alone.
- Distributed/local admission from immutable contracts and locally sufficient evidence remains valid; no central graph/availability oracle is mandatory for autonomous runtimes.
- Recovery requalifies queued/retry obligations and drains backlog under bounded resource budgets rather than blindly reopening all paths.

### Distributed guarantee evidence cache / invalidation boundaries

- `Cache hit != current/admissible evidence`; reuse is scoped to the exact claim, operation, tenant/trust/classification, profile and authority context.
- `Same dependency != same cache key`; catalog currentness, provider health, authorization, effect settlement and profile compatibility are distinct claims.
- `Cache entry fresh for dimension X != fresh for dimension Y`; semantic, identity, security, business-currentness, effect and settlement horizons remain independent.
- `Invalidation sent != invalidation observed everywhere`; correctness for revocation/security-sensitive claims cannot rely solely on broadcast invalidation delivery.
- `Stale-but-allowed != current`; bounded stale use remains explicit in the root guarantee and may be prohibited by claim class.
- `Cached absence != proof of non-occurrence`; negative evidence is claim-scoped, bounded and distinct from `UNKNOWN`.
- A required minimum revision/currentness/security floor defeats cached evidence below that floor regardless of TTL.
- `Meets dependency floor != globally latest`; dependency-local tokens never create a synthetic global platform revision.
- `Older fetched evidence != permission to roll back local floor`; monotonic security/profile observations survive refresh/restart/rollback.
- Trust material from independent trust domains remains domain-qualified and cannot be merged for cache convenience.
- Derived/root evidence retains enough input lineage to detect material dependency supersession without requiring a central graph oracle.
- `Dependency changed != global cache flush`; only proof lineage materially dependent on the changed evidence is invalidated/lowered.
- `Cache stampede control != permission to extend semantic freshness`; coalescing, jitter and background refresh are operational containment.
- Offline cache reuse remains bounded by claim-specific horizons and locally sufficient security/currentness evidence.
- Provider/transport substitution requalifies provider-specific claims while independently immutable evidence may remain reusable when justified.
- Cache persistence/recovery cannot resurrect revoked or superseded evidence.

### Delegation semantic-mapping boundaries

- `Protocol/credential translation != semantic authority translation proof`; heterogeneous permission models require a qualified semantic relation, not a name conversion.
- Attenuation is directional containment over an explicit protected-effect/resource/context universe: every target-reachable protected effect must imply source permission; equality is not required unless separately contracted.
- `Role/scope name equality != authorization semantic equivalence`; effective authority includes material allow/deny, conditions, resource hierarchy, session/resource policies, boundaries and principal semantics.
- `Target grants fewer labels != target authority is weaker`; resource breadth, audience, impersonation and meta-capability closure can make it stronger.
- Material source deny/boundary/condition semantics must survive translation, be restored by complete mediation, be structurally excluded, or yield `PARTIAL/UNKNOWN/INCOMPATIBLE`.
- `Unknown/unsupported provider semantics != allow`; adapter normalization cannot strengthen evidence.
- `Target re-authorization != attenuation`; independently granted target authority creates a new authority/currentness/revocation edge.
- Mapping proof includes material meta-capability/acquisition closure; inability to execute an effect directly does not prove inability to acquire it.
- `Mapping unchanged != mapping proof current`; provider/API permission-universe growth, managed-role changes or evaluation-rule changes can defeat prior evidence.
- Simulator/conformance results are bounded qualification/counterexample evidence, not an omniscient live semantic oracle.
- Provider-specific authorization vocabularies may remain provider-specific; portability is in proof obligations/evidence vocabulary, not a mandatory universal authorization language.
- Adapter/gateway/Exchange Plane may transport or verify mapping evidence but do not become canonical owners of either domain's business authority.

## Research progression

```text
G3 CLOSED/FROZEN
 -> G4 research inventory
 -> workload / user / operational evidence
 -> benchmarks + prototypes + failure cases
 -> implementation-independent product architecture
 -> provider/technology comparison
 -> explicit planning authorization
 -> WBS / Work Packages / implementation
```

## Current maturity

- **Data/Persistence/Access:** `RESEARCH_ACTIVE`, not saturated.
- **Data Treatment:** `RESEARCH_ACTIVE`, not saturated.
- **Infrastructure Engineering:** `RESEARCH_ACTIVE`, not saturated.
- **Computational Core/Performance:** representative SB empirical benchmarks remain absent. `RESEARCH_ACTIVE`, not saturated.
- **Lifecycle/Continuous Improvement:** `RESEARCH_ACTIVE`, not saturated.
- **Self-Hosting/Autonomic Evolution:** `RESEARCH_ACTIVE`, not saturated.
- **Product UX/AI-native Builder:** `RESEARCH_ACTIVE`, not saturated.
- **Shared Semantic Kernel / Capability Exchange Plane:** material deep-evidence consolidation now extends through heterogeneous delegation semantic-mapping proof: directional effective-authority containment, deny/condition/resource/principal/meta-capability preservation, provider permission-universe version binding, explicit mediated/target-reauthorized/unknown outcomes and autonomous-runtime evidence closure without a universal authorization language or central semantic IAM oracle. `RESEARCH_ACTIVE`, not saturated.

## Latest material consolidation — 2026-09-21

### Delegation semantic-mapping proof across heterogeneous permission models

Evidence classes: AWS IAM primary documentation on effective policy evaluation, permissions boundaries, resource/session policy interaction and simulator limitations; Google Cloud IAM primary documentation on deny policies, Principal Access Boundaries, enforcement versions and policy evaluation; prior G4 semantic-policy proof, complete-mediation, effect-path, capability-envelope and offline-delegation research.

Material delta:

- reframed heterogeneous delegation translation as a directional implication/containment proof: target-reachable protected effects must imply source permission over a declared principal/resource/context universe;
- separated isolated role/scope mapping from **effective authority**, which may depend on allow/deny, boundaries, session/resource policies, hierarchy, conditions and principal shape;
- made source deny/condition semantics first-class: a target unable to represent a material restriction cannot receive an unqualified attenuation claim;
- introduced explicit outcomes `PROVEN_ATTENUATED`, `MEDIATED_ATTENUATION`, `TARGET_REAUTHORIZATION`, `PARTIAL/UNKNOWN` and `INCOMPATIBLE` rather than treating adapter success as semantic success;
- bound mapping evidence to provider/API/permission-universe semantics because managed-role contents and newly introduced permissions can defeat a prior proof without changing credential text;
- extended containment to meta-capability/acquisition closure so bind/escalate/impersonate/mint paths cannot escape the source authority envelope;
- preserved unknown/opaque provider semantics rather than converting schema compatibility or simulator output into invented equivalence;
- required complete-mediation evidence when an external gate restores a restriction absent from the target permission model;
- preserved autonomous runtime operation by making mapping proof/evidence locally carryable for declared horizons rather than requiring Builder/Exchange Plane online authorization;
- kept adapters, gateways and IAM providers as translation/enforcement mechanisms rather than semantic owners of business authority.

No AWS IAM, Google Cloud IAM/PAB, universal authorization language, policy engine, solver, gateway, adapter framework or provider was selected.

Highest-value remaining gap: **mapping-proof maintenance under opaque managed-role/provider-policy evolution** — determine how autonomous runtimes detect and requalify semantic drift when provider-managed roles, undocumented service authorization behavior, resource-policy layers or permission catalogs change without a local artifact revision, combining provider changelogs/catalogs, differential probes/simulators, runtime evidence, attestations and conservative floors without treating provider documentation or a central scanner as an omniscient semantic oracle.

## Prior material progression — compact index

Detailed durable evidence remains in the family documents indexed by `README.md`. Prior material deltas include reservation/escrow and fencing; effect composition; interaction reference models; semantic verification; causal workflow; multidimensional compatibility; hierarchical rights; non-fenceable/heterogeneous effects; in-flight evolution; security retirement/offline floors; evidence-minimal reconciliation; privacy-preserving evidence federation; collusion/metadata side channels; privacy-preserving abuse/rate/cost governance; federated anonymous budget conservation/Sybil resistance; privacy-preserving issuer accountability/compromise containment; witness/log governance/correlated compromise; multi-domain evidence composition; composition-policy lifecycle/downgrade/rollback safety; semantic non-downgrade/policy-diff proof; proof-carrying runtime verification; verifier trust continuity/diversity; normative proof-semantics governance/ambiguity containment; downgrade-resistant proof-semantics profile negotiation; negotiation-evidence lifecycle; semantic-generation handoff; handoff recovery/compaction; cross-runtime frontier transfer/disaster recovery; split-brain authority rejoin; operation-scoped degraded-mode capability contracts; degraded dependency-graph/end-to-end guarantee synthesis; distributed guarantee-evidence caching; revocation-storm/partition requalification; multi-domain invalidation algebra; in-flight policy composition change; effect-gate complete mediation; dynamic effect-path universe discovery; effect-capability privilege drift; offline delegation attenuation/revocation; and heterogeneous delegation semantic-mapping proof.

## Non-goals

- no Rust rewrite decision;
- no graph/vector/search/stream/service-mesh/central-exchange/etcd/Kubernetes adoption decision;
- no workflow/saga/migration/checkpoint/event-store/circuit-breaker engine adoption decision;
- no global serial-history/linearizability or global transaction requirement for all exchange interactions;
- no mandatory central broker/ESB/shared archive/availability/guarantee/cache/IAM oracle;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.