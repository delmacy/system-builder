# Generation 2 Deep Research — Temporal / Causal / Epoch Ordering Closure 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

Should Generation 2 collapse physical-time evidence, causal order, revision/epoch dominance, provider sequence/revision and fencing generations into one universal `qualified ordering evidence` primitive, or should they remain distinct relations that only share a qualification/provenance envelope?

This is the residual question left by `DR-TAES-01`. That research established that a scalar `timestamp` is not a safe universal truth and tentatively allowed both physical-time and logical/epoch evidence under one temporal-or-ordering relation. The remaining architectural risk is **false comparability**: two values can both look ordered while proving materially different things.

## Why this is architecturally material

The same system may simultaneously carry:

- a trusted timestamp proving that bytes existed no later than physical time `T`;
- a causal edge proving event `A` happened-before event `B` without proving their wall-clock distance;
- a store revision proving update `R12` followed `R11` in one provider's serialization domain;
- a fencing generation proving writer `G9` dominates writer `G8` at one protected sink;
- a workflow revision proving definition `V4` supersedes `V3` by lifecycle policy;
- an event-time watermark estimating completeness before a horizon;
- an HLC value combining physical-clock proximity with logical tie-breaking under bounded-clock assumptions.

If G2 exposes all of these as `order = 12` or `timestamp = ...`, provider adapters can manufacture invalid comparisons. If G2 isolates every relation completely, cross-capability proofs repeatedly reinvent subject, scope, witness, applicability, uncertainty and provenance.

The architectural question is therefore not whether ordering exists, but **what can safely be generalized without claiming comparability that the evidence does not prove**.

## Corpus of SB input

Mandatory Generation 2 material reviewed for this Deep Research:

- `RESEARCH_PIPELINE_STATE.json` — live phase remains `RESEARCH_ELICITATION`; seven full cycles are complete; all pass-1 structural gaps and centralized proofs are dispositioned; Enterprise Completeness closure audit remains the next phase gate. This Deep Research does not alter cycle/revisit/saturation counters.
- `RESEARCH_EVIDENCE_METHOD.md` — late-cycle work must be selective, evidence-driven and adversarial; universal primitives require multi-source corroboration.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md` — ordering/replay, stale evidence, provider substitution, offline closure, determinism and authority claims require explicit falsification paths.
- Capability Discovery Register, Finding Index, Representative Coverage and Capability Proof Matrix — treated as hypothesis/evidence inventories rather than final authority.
- `DR-TCE-01` — provider acknowledgement/commit/order does not automatically equal business effect order.
- `DR-SRFE-01` — timeout is not reclaim proof; fencing/generation can establish stale-owner exclusion without a universal wall clock.
- `DR-LGCE-01` — multi-axis revisions have axis-specific binding/freshness semantics and are not one scalar version.
- `DR-HIC-01` — historical interpretation depends on transitive semantic/validation closure.
- `DR-QDCE-01` — qualified derived claims can share provenance/qualification while predicates/results remain domain-owned.
- `DR-RRHV-01` — historical verification eligibility is distinct from current trust admission; trusted time has exact evidence scope.
- `DR-TAES-01` — occurrence/observation/production/evaluation/invalidity/freshness roles are distinct; physical time and epochs may both prove ordering obligations, but exact unification was deferred.

Deep researches and breadth findings above are input hypotheses. External evidence below is used to falsify both full unification and full isolation.

## External evidence ledger

### E1 — Lamport: causality is a partial order; a total logical order adds convention

Leslie Lamport, “Time, Clocks, and the Ordering of Events in a Distributed System,” *Communications of the ACM* 21(7), July 1978.

Sources:
- https://www.microsoft.com/en-us/research/publication/time-clocks-ordering-events-distributed-system/
- DOI 10.1145/359545.359563

Lamport's happened-before relation is a **partial ordering** induced by local process order and message causality. Logical clocks can respect that relation, and an additional tie-break can construct a total order, but the added total order does not make previously concurrent events causally related.

**Extraction:** `A < B` under a serialization/tie-break domain is not automatically evidence that `A caused B`. A universal relation must preserve the ordering **kind** and domain.

### E2 — Fidge/Mattern/vector clocks: precise causal comparison requires richer structure than scalar order

Colin Fidge, “Timestamps in Message-Passing Systems That Preserve the Partial Ordering,” 1988; Friedemann Mattern, “Virtual Time and Global States of Distributed Systems,” 1988/1989.

Sources:
- https://fileadmin.cs.lth.se/cs/Personal/Amr_Ergawy/dist-algos-papers/4.pdf
- https://paperswelove.org/papers/virtual-time-and-global-states-of-distributed-syst-5323e301/

Vector timestamps distinguish `A happens-before B`, `B happens-before A`, and concurrency. Fidge explicitly argues that a total ordering can be inappropriate when the inherent partial order matters.

**Extraction:** a scalar provider sequence can support deterministic serialization while losing concurrency/causality information. G2 must not infer causal dominance from arbitrary monotonicity.

### E3 — Plausible clocks: causality precision has scalability trade-offs

Francisco Torres-Rojas and Mustaque Ahamad, “Plausible clocks: constant size logical clocks for distributed systems,” *Distributed Computing* 12, 1999.

Source: https://doi.org/10.1007/s004460050065

The paper states that exact causal detection in an N-site distributed system requires vector clocks of size N under the model studied; constant-size plausible clocks trade precision for scalability.

**Extraction:** even within “causal ordering,” assurance strength differs. The envelope should be able to express proof/assurance class or `INCONCLUSIVE`; it should not define one universal causal timestamp representation.

### E4 — Byzantine causality: failure model changes what can be proven

A. Misra and A. D. Kshemkalyani, “Detecting Causality in the Presence of Byzantine Processes: The Synchronous Systems Case,” TIME 2023.

Source: https://doi.org/10.4230/LIPIcs.TIME.2023.11

The work reports impossibility of solving the target causality-detection problem in asynchronous systems with Byzantine processes under the referenced model, then gives a solution under synchronous assumptions using replicated state-machine machinery and vector clocks.

**Extraction:** `causal-before` is not merely a data-format claim; its validity depends on the failure/trust model of the witness mechanism. Qualified evidence must preserve those assumptions when material.

### E5 — W3C PROV Constraints: useful ordering can be relational without physical clocks

W3C Recommendation, “Constraints of the PROV Data Model.”

Source: https://www.w3.org/TR/prov-constraints/

PROV defines ordering constraints such as generation preceding use/invalidation. It explicitly allows minimal clock assumptions and models a `precedes` preorder between provenance events rather than requiring physical timestamps.

**Extraction:** cross-domain provenance can safely generalize **typed event relations**. This supports shared qualification machinery while preserving semantic event identities.

### E6 — etcd revisions: provider-global logical order is useful but scoped

etcd v3.7 API documentation, current documentation in 2026.

Source: https://etcd.io/docs/v3.7/learning/api/

etcd maintains a cluster-wide 64-bit store revision incremented for key-space modifications and calls it a global logical clock. Revisions support MVCC reads, watches, conflict handling and synchronization.

**Extraction:** a provider revision can be strong evidence for order **inside that etcd cluster/key-space history**. It does not become a universal business epoch, physical time, or cross-provider comparable number.

### E7 — PostgreSQL transaction IDs: monotonic-looking identifiers have semantic and lifecycle limits

PostgreSQL 18 documentation, “Transactions and Identifiers,” 2026.

Source: https://www.postgresql.org/docs/current/transaction-id.html

PostgreSQL assigns transaction IDs sequentially when a transaction first writes, not necessarily when it starts. Traditional XIDs are 32-bit and wrap; an epoch is needed for longer-lived ordering. Commit timestamps are separate optional information.

**Extraction:** identifier order, start order and commit-time order are different. Numeric comparison is unsafe without scope, lifecycle and ordering semantics.

### E8 — CockroachDB/HLC: hybrid clocks combine mechanisms but do not erase uncertainty

CockroachDB architecture/RFC material on HLC and uncertainty intervals.

Sources:
- https://github.com/cockroachdb/cockroach/blob/master/docs/RFCS/20200811_non_blocking_txns.md
- https://pkg.go.dev/github.com/cockroachdb/cockroachdb-parser/pkg/util/hlc

CockroachDB uses hybrid logical clocks plus bounded maximum offset. Transactions maintain uncertainty intervals because a timestamp alone may not establish the desired causal/real-time ordering near clock uncertainty boundaries.

**Extraction:** hybrid representations can bridge physical and logical concerns for one realization, but the portable semantic claim remains the relation actually established under bounded assumptions, not the HLC scalar itself.

### E9 — Hybrid vector clocks: combining physical and causal information is an optimization with explicit bounds

S. Yingchareonthawornchai, S. S. Kulkarni, M. Demirbas, “Analysis of Bounds on Hybrid Vector Clocks,” OPODIS 2015.

Source: https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.OPODIS.2015.34

Hybrid vector clocks exploit loosely synchronized physical clocks to reduce vector-clock overhead while retaining bounded causal-tracking properties.

**Extraction:** combined physical/logical mechanisms exist, but their correctness is parameterized by clock skew and representation bounds. They are provider/mechanism realizations, not proof that all ordering kinds are semantically identical.

### E10 — Provider sequence/revision can establish one domain's serialization without causal or temporal universality

The etcd and PostgreSQL cases independently show that monotonic revisions/IDs carry domain-specific semantics. A revision number may be excellent for replay, stale-read detection or fencing within its source domain while being meaningless against a timestamp, vector clock, another provider's offset, or a business lifecycle revision.

**Extraction:** G2 needs **comparison-domain identity** (or an equivalent scope binding) before it can legally compare ordered evidence.

## Competing models

### Model A — One universal ordered scalar

Conceptually:

```text
ordering = 42
```

or:

```text
ordering = 2026-09-03T19:00:00Z
```

**Strongest argument:** trivial ergonomics and sorting.

**Falsification:** Lamport/Fidge distinguish partial causality from arbitrary total order; PostgreSQL XIDs and etcd revisions have source-specific semantics; physical timestamps have uncertainty; provider numbers are not cross-domain comparable.

**Disposition:** **DO_NOT_BUILD** as semantic primitive.

### Model B — One universal relation type with every ordering mechanism as values

Conceptually:

```text
OrderingEvidence {
  left
  relation: BEFORE | AFTER | DOMINATES | CONCURRENT
  right
  value
}
```

**Strongest argument:** one API/envelope for all ordering questions.

**Falsification:** `BEFORE` remains dangerously overloaded. Physical `definitely-before`, causal `happened-before`, provider serialization `revision-before`, lifecycle `superseded-by`, and fencing `generation-dominates` support different inference rules. Transitivity and comparability are not identical across all kinds/scopes.

**Disposition:** **GENERALIZE only the envelope, not one untyped relation algebra**.

### Model C — Fully separate primitives

Every capability/provider defines independent time/order structures with no shared qualification.

**Strongest argument:** maximum semantic precision.

**Falsification:** W3C PROV, QDCE and repeated SB findings show reusable subject/witness/scope/applicability/provenance concerns. Full isolation duplicates stale/current, provider-substitution and evidence qualification logic.

**Disposition:** **DO_NOT fully isolate qualification machinery**.

### Model D — Sibling typed relation families under a common qualified-evidence envelope

Recommended conceptual model, not frozen IR:

```text
QualifiedOrderingEvidence
  subject/event identities
  ordering-kind
  comparison-domain/scope
  witness/mechanism/provider
  evidence/proof class
  assumptions / uncertainty where material
  applicability/freshness
  provenance

ordering-kind examples (semantic families, not final enum):
  PHYSICAL_TIME_RELATION
  CAUSAL_RELATION
  SERIALIZATION_REVISION_RELATION
  AUTHORITY_FENCING_DOMINANCE
  LIFECYCLE_SUPERSESSION
  COMPLETENESS_FRONTIER
```

Each family owns legal predicates and inference rules. The shared envelope owns qualification, scope and evidence lineage.

**Disposition:** **GENERALIZE narrowly / SPECIALIZE relation families**.

## Strongest evidence for the recommended split

1. **Same envelope need:** every family needs subjects, scope, witness/mechanism, provenance and applicability.
2. **Different inference need:** causality must preserve concurrency; physical time may require uncertainty intervals; fencing dominance is sink-scoped authority exclusion; lifecycle supersession is policy semantics; provider revision is serialization-domain evidence.
3. **Provider divergence:** etcd revision, PostgreSQL XID, HLC, vector clocks and trusted timestamps cannot be compared by raw value while each can satisfy a higher-level proof obligation.
4. **Scientific evidence:** Lamport/Fidge/Mattern and later causality work show that causality is a partial-order property with model-specific proof strength, not generic numeric sorting.

## Strongest evidence against even narrow generalization

A shared envelope can still become a mega-object if it attempts to standardize every predicate, uncertainty model, clock format, vector representation, provider generation or lifecycle rule. The architectural benefit exists only if the generalized layer remains small:

- identify what is ordered;
- identify the relation family;
- identify the comparison domain/scope;
- identify witness/mechanism/evidence;
- qualify applicability/uncertainty/provenance.

Concrete ordering semantics remain capability-owned.

## Contradictions resolved

### C1 — “If two values are monotonic, they are comparable”

**Resolved: false.** Monotonicity is meaningful only within a declared comparison domain and lifecycle. etcd revisions from different clusters or PostgreSQL XIDs from different installations are not universally comparable.

### C2 — “Total order proves causality”

**Resolved: false.** A total logical order can extend a causal partial order by arbitrary tie-breaking. Concurrent events can be serialized without one causing the other.

### C3 — “Causal order can replace physical time everywhere”

**Resolved: false.** Certificate validity, retention periods, human deadlines and trusted-time historical claims may require physical-time evidence.

### C4 — “Physical time can replace fencing/epochs”

**Resolved: false universally.** Sink-enforced fencing generation can prove stale-writer exclusion without synchronized clocks; wall-clock order alone may not prevent an old writer from mutating a sink.

### C5 — “An HLC proves the primitive should be hybrid everywhere”

**Resolved: false.** HLC is a useful realization under explicit clock assumptions. It does not make all consumers require or understand one hybrid scalar.

### C6 — “Provider revision is just another timestamp”

**Resolved: false.** etcd revision is a serialization/MVCC history coordinate; PostgreSQL transaction ID assignment follows first write and has wrap/epoch semantics. Neither is generic occurrence time.

## Invariants

1. **Kind invariant:** ordering evidence must identify which ordering relation family it claims.
2. **Comparison-domain invariant:** raw ordering values are comparable only when the evidence proves a common comparison domain and compatible representation/lifecycle.
3. **No-causal-laundering invariant:** total serialization or physical-time order does not imply causality unless causal evidence supports it.
4. **Concurrency invariant:** a causal model must be able to preserve `CONCURRENT/UNKNOWN`, not force every pair into `<` or `>`.
5. **Uncertainty invariant:** physical-time uncertainty that prevents a required relation must yield `INCONCLUSIVE` or a bounded relation, not false precision.
6. **Fencing invariant:** authority generation dominance is meaningful only for the protected sink/resource and enforcement epoch that rejects stale writers.
7. **Revision-axis invariant:** workflow/schema/policy/provider revisions remain typed axes; one higher numeric revision on one axis does not dominate unrelated axes.
8. **Provider-scope invariant:** provider sequence/revision identifiers remain provider/tenant/resource/cluster scoped unless an explicit bridge proves broader order.
9. **Witness invariant:** ordering evidence is only as strong as the mechanism/failure model that established it.
10. **Historical invariant:** evidence remains bound to the relation semantics and comparison domain current when it was produced; later migration must not reinterpret raw numbers under a new provider.
11. **Simple-system invariant:** a single-process/single-database system may satisfy ordering with local transaction/version evidence without deploying distributed-clock infrastructure.
12. **Non-amplification invariant:** establishing order never grants mutation/authorization authority by itself.

## Failure / adversarial analysis

### F1 — Cross-provider numeric laundering

Provider A emits revision `100`; provider B emits revision `50`. Treating `100 > 50` as global recency is invalid absent a bridge/translation proof.

### F2 — Total-order causal laundering

Two concurrent Station events receive a deterministic merge order. The later sort position must not be presented as evidence that it observed or depended on the earlier event.

### F3 — Clock rollback

An offline Station's wall clock moves backward but its authority/fencing generation advances. Correctness that depends on stale-writer exclusion should follow qualified generation evidence, not local UTC ordering.

### F4 — Generation reuse after restore

A restored provider reuses or rewinds a revision/sequence namespace. Historical raw values become ambiguous unless the comparison domain includes provider-instance/epoch identity.

### F5 — HLC assumption violation

Clock offset exceeds the realization's configured bound. Claims requiring real-time ordering become `INCONCLUSIVE` or fail closed; logical causal order may still remain usable where independently supported.

### F6 — Vector-clock truncation / approximate causality

A scalable approximate clock loses precision and returns a plausible order. It must not be upgraded to exact causality evidence without the assurance class proving that result.

### F7 — Lifecycle-versus-runtime confusion

`WorkflowDefinition V5 supersedes V4` does not imply every in-flight V4 run must be interpreted or migrated as V5. Lifecycle supersession and execution binding are different relations.

### F8 — Fencing-versus-causal confusion

Writer generation G9 dominates G8 at a sink. This does not imply all events emitted by G9 causally follow all events from G8.

## Provider-specific versus portable semantics

### Portable semantics G2 should own or normalize

- identity of ordered subjects/events/revisions;
- relation family / semantic ordering kind;
- comparison domain and scope;
- whether the relation is proven, contradicted, concurrent/unknown or inconclusive where applicable;
- witness/provider/mechanism identity;
- evidence/proof/assurance class;
- assumptions, bounds or uncertainty when required for correctness;
- applicability/freshness/provenance;
- bridge evidence when translating between ordering domains.

### Provider/mechanism semantics G2 should normally delegate

- vector-clock representation and compression;
- HLC implementation;
- etcd revision allocation;
- database transaction/commit timestamp internals;
- Kafka/stream offsets;
- TSA/CT time evidence mechanics;
- lease-clock implementation;
- fencing-token issuance/storage;
- provider-native consistency protocols.

Provider conformance should prove that the mechanism satisfies the portable relation required by the capability. It should not expose the provider's ordering scalar as canonical SB truth.

## Consequences for existing findings / candidates / hypotheses

### `DR-TAES-01`

**HARDEN / SPECIALIZE.** Retain its conclusion that temporal/order evidence deserves shared qualification, but narrow the universal claim: physical-time, causal, serialization/revision, fencing/authority and lifecycle relations are **siblings**, not one relation algebra.

### `DR-QDCE-01`

**MERGE qualification machinery.** Ordering claims are a strong instance of qualified derived/evidence claims. This does not justify a universal evaluator.

### Transaction / Consistency / Concurrency

**KEEP semantic ownership.** Transaction owners decide which order/coordination is required for an invariant. A provider revision may prove one realization's serialization but not business-effect order automatically.

### Lifecycle / Revision / Evolution

**KEEP typed revision axes.** Revision vectors may use ordering evidence, but revision numbers across axes/providers are not cross-comparable by default.

### Station / AGWS authority

**HARDEN offline closure.** Station reconnection must distinguish causal history, local occurrence/witness time and fencing/authority epoch. None substitutes universally for the others.

### Provider / Binding

**HARDEN provider substitution.** Binding migration must carry comparison-domain identity and bridge/requalification evidence. Reusing raw sequence/revision values after provider replacement is forbidden unless proven equivalent.

### Universal Capability Architecture

**GENERALIZE only a small qualified ordering envelope.** Do not promote a new top-level capability solely from this research. Synthesis should prove reuse across at least historical verification, transaction/concurrency, fencing and lifecycle before freezing a primitive.

## Proof obligations

### DR-TCEOC-01 — Causal concurrency survives deterministic total sorting

Two causally independent events are deterministically ordered for display/replay. The system must preserve `CONCURRENT` (or absence of causal relation) and must not infer dependency from sort order.

### DR-TCEOC-02 — Causal edge implies compatible logical order

Given a message/process causal path `A → B`, the selected causal mechanism must prove `A happens-before B`; a contrary order fails validation.

### DR-TCEOC-03 — Scalar logical clock does not prove concurrency

Two events with Lamport scalars but no causal closure must not be reported as causally related solely because one scalar is smaller.

### DR-TCEOC-04 — Exact versus approximate causal assurance

Substitute an approximate/plausible causal mechanism for an exact vector-clock profile. A claim requiring exact causality must be rejected or marked `INCONCLUSIVE/PARTIAL` if precision is insufficient.

### DR-TCEOC-05 — etcd revision scope

Two updates in one etcd cluster prove revision order. Revisions from two independent clusters must be non-comparable absent explicit bridge evidence.

### DR-TCEOC-06 — provider restore creates ordering epoch boundary

Restore a provider so its native revision namespace rewinds/restarts. Historical evidence must remain distinguishable by provider-instance/epoch and must not compare raw revisions across the boundary automatically.

### DR-TCEOC-07 — PostgreSQL XID versus commit/occurrence order

Demonstrate a transaction that starts earlier but receives/writes an XID later or commits in a different order. The system must not label XID assignment as universal occurrence/commit time.

### DR-TCEOC-08 — fencing dominance is sink scoped

Generation `G9` excludes `G8` at sink S1. The same generation values must not imply ordering/authority at unrelated sink S2 without binding evidence.

### DR-TCEOC-09 — fencing does not imply causality

A G9 writer may fence G8 after recovery, but events from G9 are not automatically causally dependent on every G8 event.

### DR-TCEOC-10 — clock uncertainty prevents false `before`

Physical-time intervals overlap under the configured uncertainty bound. A claim requiring definite physical `A before B` must remain `INCONCLUSIVE` unless another mechanism proves the relation.

### DR-TCEOC-11 — HLC provider substitution

Replace an HLC-based provider with a pure logical-revision provider for a requirement that only needs stale-writer/serialization order. Semantics remain valid if the relation is proved; physical-time claims must not silently survive the substitution.

### DR-TCEOC-12 — lifecycle supersession is not in-flight migration

Definition V5 supersedes V4 while a V4 run is active. Supersession evidence alone must not silently rebind the run to V5.

### DR-TCEOC-13 — revision axes are not scalarized

Schema S4, policy P9 and provider binding B3 coexist. No generic `revision=9` may dominate the other axes; compatibility is evaluated per axis/profile.

### DR-TCEOC-14 — offline Station clock rollback

Roll a Station's physical clock backward while preserving monotonic authority/fencing epoch. Operations whose safety depends only on fencing continue correctly; physical-deadline claims requiring trustworthy time fail/requalify separately.

### DR-TCEOC-15 — offline Station causal merge

Two Stations produce concurrent changes offline. Reconciliation must distinguish deterministic merge order from causal observation/dependency and retain conflict semantics where required.

### DR-TCEOC-16 — cross-domain ordering bridge

Translate a provider revision into a canonical lifecycle/effect order only through explicit bridge evidence/profile. Removing or invalidating the bridge makes the derived relation stale/inapplicable.

### DR-TCEOC-17 — historical replay preserves original comparison domain

Replay old evidence after provider substitution. The verifier must interpret the old ordering under its original provider-instance/profile rather than the current provider's numbering rules.

### DR-TCEOC-18 — Byzantine/failure-model downgrade

A causality mechanism proven only under non-Byzantine or synchronous assumptions is used in a profile requiring stronger failure tolerance. Conformance must reject or qualify the mismatch.

### DR-TCEOC-19 — simple-system ergonomics

A single-process/single-database system can satisfy local ordering proofs with transaction/version evidence and no vector-clock/HLC/global-time infrastructure.

### DR-TCEOC-20 — authority non-amplification

A stronger/newer ordering claim (`later`, `dominates`, higher revision) must not by itself authorize mutation, Gate progression or trust admission; capability-owned authorization remains required.

## Falsification paths for material conclusions

The recommended sibling-family model should be rejected or further simplified if synthesis demonstrates that:

1. one relation algebra can express physical, causal, fencing, lifecycle and provider serialization semantics **without** permitting invalid inference or losing domain-specific predicates;
2. a shared qualification envelope provides no measurable reuse across at least three independent capabilities;
3. comparison-domain identity can always be derived unambiguously from existing subject/provider bindings, making an explicit relation field redundant;
4. provider conformance cannot practically map materially different mechanisms to portable relation obligations without leaking provider semantics.

Conversely, stronger universalization would require cross-domain proofs showing safe transitivity/composition rules, not merely similar field shapes.

## Unresolved questions

1. Should comparison-domain identity be explicit in a future UCA primitive, or derivable from provider/binding + subject revision?
2. Does synthesis need a small closed set of relation **families**, or should family identity remain an extensible typed URI/name to avoid freezing distributed-systems taxonomy?
3. Which bridges between domains are safe to compose transitively (for example trusted physical time → authority validity, or provider revision → business effect order), and which must always be capability-specific?
4. How should approximate causal evidence expose precision/false-positive bounds without making every simple system carry scientific clock metadata?
5. Can existing `QualifiedDerivedClaim` + typed evidence references represent this cleanly enough that no distinct `QualifiedOrderingEvidence` object is needed?

## Confidence

**High** confidence in the negative conclusions:

- raw timestamps/revisions/epochs are not universally comparable;
- total order does not imply causality;
- causal, physical-time, fencing and lifecycle ordering support different inference rules;
- provider-local sequence numbers must remain scoped.

**Medium-high** confidence in the positive recommendation that these relations should share a small qualification/provenance envelope. Exact schema, family vocabulary and whether this becomes a named UCA primitive remain synthesis questions and require cross-domain proof.

## Proposed research dispositions

- **KEEP** — capability ownership of causal, transactional, lifecycle, authority/fencing and physical-time predicates.
- **HARDEN** — `DR-TAES-01`: replace tentative single temporal-or-ordering algebra with sibling typed relation families.
- **MERGE** — shared subject/scope/witness/applicability/provenance qualification with `DR-QDCE-01` and existing qualified-evidence machinery.
- **GENERALIZE** — only the small envelope for qualified ordering evidence plus comparison-domain qualification.
- **SPECIALIZE** — physical-time, causal, serialization/revision, fencing/authority, lifecycle supersession and completeness-frontier inference rules.
- **PROVIDERIZE** — vector/HLC implementations, etcd revisions, database XIDs/commit timestamps, stream offsets, TSA/log clocks and fencing-token mechanics.
- **DEFER** — exact UCA schema/name and extensibility model until Capability Synthesis cross-domain proofs.
- **DO_NOT_BUILD** — universal scalar `timestamp/order/revision`, cross-provider numeric comparison, `total-order ⇒ causal-order`, `newer ⇒ authorized`, or a mandatory global/HLC/vector-clock runtime dependency.

## Recommended synthesis statement

> Generation 2 should preserve ordering as **typed, scoped evidence**. Physical-time, causal, serialization/revision, authority/fencing and lifecycle relations are sibling semantic families with different inference rules. They may share a small qualified-evidence envelope for subject, comparison domain, witness, applicability, uncertainty and provenance, but raw values are never universally comparable and provider mechanisms remain realizations rather than canonical semantics.

## Next high-value deep question

The live pipeline state now points to an Enterprise Completeness closure audit rather than another broad proof junction. If further deep research is requested before phase transition, the highest-value residual is **Ordering-Bridge Safety & Transitive Inference**: determine when evidence from one relation family may legitimately discharge an obligation in another (for example TrueTime interval → external-consistency order, provider serialization revision → business-effect order, trusted timestamp → historical authority applicability) and when such bridges must remain explicit capability-owned derived claims to prevent semantic laundering.