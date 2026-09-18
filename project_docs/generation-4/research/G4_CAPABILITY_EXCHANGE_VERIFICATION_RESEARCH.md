# G4 — Capability Exchange Semantic Verification & Fault-Model Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the eighth G4 family with an implementation-independent verification strategy for the semantic guarantees already researched across local, RPC, asynchronous and federated realizations. This document does not select a testing product, broker, workflow engine, simulator, property framework or implementation architecture. It defines what future evidence would have to demonstrate before transport/binding substitution, workflow migration, causal compaction, retry/reconciliation or federated recovery can be considered qualified.

Core rule:

```text
Example passed != invariant proven
Same happy-path output != same contract semantics
Deterministic replay != production equivalence
Fault injection != business oracle
Property checker != implementation authority
```

## Evidence classes reviewed

- FoundationDB simulation/testing: deterministic simulation of a whole cluster, controlled time/failures, repeated seeded scenarios and invariant-oriented workloads; demonstrates the value of reproducibility and broad failure exploration without making simulation identical to production.
- Antithesis deterministic simulation testing: deterministic environment, replay, systematic fault injection and property-based/state-space exploration; network partitions, node failures, clock changes and scheduling perturbations are first-class fault dimensions.
- Hypothesis rule-based state machines: generated operations can be chained through stateful models, allowing sequences to depend on previously generated state rather than treating examples independently.
- Jepsen/Elle: broad generated histories plus model-based history checking can expose anomalies missed by narrow hand-written examples; checker coverage remains bounded by the modeled operation set and properties.
- Existing G4 exchange/causal research: ACK != effect; timeout may be UNKNOWN; transport reconnect != convergence; migration is semantic transformation; causal checkpoints intentionally preserve only qualified future proof.

These systems are benchmarks for verification ideas only.

## 1. Verification must be layered

A single test class cannot prove the Exchange Plane hypothesis. Candidate evidence layers:

```text
L0 Contract examples
   deterministic positive/negative examples

L1 Model/property tests
   generated semantic operation sequences
   reference model / oracle

L2 Binding conformance
   same semantic fixture against local / RPC / async / file / stream realizations

L3 Fault-injected histories
   loss / duplication / reorder / partition / crash / clock / delayed response

L4 Recovery and convergence checks
   quiet period -> reconciliation -> authoritative effect comparison

L5 Production-observation qualification
   telemetry/effect evidence used to validate workload and fault assumptions
```

`L0 success != L3 safety`.
`L3 success != production workload representativeness`.
`Production incident absence != invariant proof`.

The objective is complementary evidence, not one universal verifier.

## 2. The semantic oracle must sit above transport

The future harness needs a technology-independent reference model that reasons in contract terms rather than HTTP codes, broker offsets or process-local returns.

Candidate `SemanticHistoryRecord`:

```text
operationId
interactionKind
contractRef + revision
bindingClass
intent / expected semantic transition
pre-state evidence
caller-observed result
transport-observed disposition
participant-observed/effective result
post-state evidence
causation / authority / currentness refs
faults injected
reconciliation result
UNKNOWN/conflict disposition
```

The checker compares the observed history with the `RequiredContractProfile` and workflow/effect invariants.

```text
HTTP 200 != oracle success
Broker confirm != oracle success
Function returned != oracle success
Final rows equal != causal/effect history equivalent
```

This prevents local/in-process tests from becoming an accidentally weaker semantic standard than remote realizations.

## 3. Same-contract metamorphic testing

A high-value portability strategy is to generate one semantic scenario and realize it through multiple eligible bindings.

```text
Semantic Scenario S
        |
        +-> local/in-process history H1
        +-> RPC history H2
        +-> async/broker history H3
        +-> federated history H4

check each Hi against RequiredContractProfile(S)
then compare only dimensions promised equivalent
```

This is deliberately not byte-for-byte history equality. Queueing, retries, timing and intermediate transport states may legitimately differ. The proof obligation is that differences remain inside the declared operational envelope and never change promised business meaning, authority, effect multiplicity, currentness, classification or terminal uncertainty semantics.

Candidate classification:

```text
SEMANTICALLY_EQUIVALENT_FOR_PROFILE
EQUIVALENT_AFTER_QUALIFIED_RECONCILIATION
QUALIFIED_DEGRADATION_OBSERVED
INCOMPATIBLE_BEHAVIOR
ORACLE_INSUFFICIENT
UNKNOWN
```

`Different intermediate topology != semantic failure by definition`.
`Same final value != semantic equivalence by definition`.

## 4. Stateful generation is more valuable than isolated fuzzed calls

Exchange failures depend on history. A generated state machine should be able to compose operations such as:

```text
issue command
observe timeout
partition site
revoke authority
upgrade contract
migrate workflow
compact history
erase payload
retry old command
reconnect federation
request compensation
retire provider
reconcile UNKNOWN
```

The generator must be state-aware: for example, compensation is meaningful only after an eligible prior effect, and migration-after-compaction is meaningful only when a checkpoint exists.

Hypothesis-style rule-based state machines provide evidence that generated rules can consume state produced by prior rules. The universal principle is stateful generation; no Python/Hypothesis adoption is implied.

## 5. Fault model must cover semantic timing, not only network failure

Candidate fault dimensions:

```text
transport
  loss / duplicate / reorder / delay / partition / reconnect

process
  crash / pause / restart / stale worker / concurrent generation

time
  clock skew / jump / deadline expiry / lease expiry

storage
  delayed durability / unavailable projection / compacted history

contract
  revision skew / provider retirement / mediation lossiness

authority
  revoke / expire / tenant-context change / classification change

workflow
  migrate during UNKNOWN / compensate during partition / pivot crossing

retention
  erase payload / expire dedup evidence / compact causal history
```

FoundationDB and deterministic-simulation systems demonstrate the value of controlling failures and time; G4 extends the workload oracle to semantic faults that infrastructure simulators do not know automatically.

`Network healed != semantic fault ended`.
`Clock advanced != authority semantics decided`.
`Storage available != retained evidence sufficient`.

## 6. UNKNOWN must be generated deliberately

A future harness must create ambiguous windows rather than merely assert success/failure:

```text
send K
participant commits effect E
response/ACK disappears
caller records UNKNOWN
optional migration/authority revision/compaction occurs
retry or reconcile K
```

Properties:

1. no false `NOT_EFFECTIVE` is fabricated from timeout;
2. no duplicate external effect is hidden as success;
3. if evidence is insufficient, terminal state remains qualified UNKNOWN/manual rather than guessed;
4. migration does not reinterpret the already-effective action under the target definition;
5. reconciliation can use surviving evidence without requiring forbidden payload resurrection.

Jepsen failure experience is relevant because operations can appear to fail while actually succeeding or can be applied multiple times under client/network failures. The G4 oracle therefore records caller observation separately from authoritative effect evidence.

## 7. CausalCheckpoint needs an operation-sufficiency matrix

A checkpoint is not proven merely because workflow state can be loaded after compaction. Candidate matrix:

| Future operation | Required retained evidence | If missing |
| --- | --- | --- |
| resume forward | active state, current preconditions, contract/authority qualification | `UNKNOWN` / manual / incompatible |
| retry/dedup | semantic intent identity + effect/dedup evidence covering replay horizon | reconcile/manual; never blind retry |
| compensate | original effect evidence + compensation obligation/current contract | forward/manual recovery |
| migrate | source state + completed effects + causal frontier + mapping evidence | pin/manual/incompatible |
| federated reconnect | partition lineage + scoped frontier/checkpoints + current authority/contracts | quarantine/revalidate |
| audit/explain | retained semantic/disposition evidence permitted by policy | qualified non-reproducibility |
| erasure | proof that prohibited payload/identity is absent from checkpoint and derivatives | checkpoint not erasable-safe |

A future property suite should compact at many frontiers and then invoke every operation still legal after that frontier.

```text
Checkpoint loads != checkpoint sufficient
Digest retained != semantic fact reconstructable
Dedup evidence retained != retained long enough
Erasure completed in payload store != checkpoint/fixture corpus erased
```

## 8. Erasure is itself a verification property

Test artifacts can become a shadow retention system. Seeds, minimized counterexamples, traces, captured envelopes and failure snapshots may contain the very payloads the product was required to erase.

Therefore candidate `VerificationArtifactEnvelope` should classify:

```text
scenario/seed identity
synthetic vs production-derived data
classification / tenant scope
retention purpose + expiry
redaction/tokenization status
replay dependency
artifact/checkpoint refs
```

Properties:

- production-sensitive payload is not required merely to reproduce the semantic bug;
- minimized counterexamples preserve the semantic failure while removing unnecessary sensitive content;
- erasure propagates to retained test corpora where policy requires it;
- loss of a forbidden payload can intentionally make an old test non-exactly-replayable without authorizing hidden retention.

`Reproducible test != permission to retain production data forever`.

## 9. Determinism has a bounded claim

Deterministic simulation is valuable because a failing execution can be replayed and alternate schedules explored. FoundationDB reports deterministic single-process simulation of full clusters and very large repeated failure campaigns; Antithesis similarly controls nondeterminism and fault injection.

But:

```text
Deterministic simulator replay != proof production scheduler/network matches simulator
Simulator coverage != state-space exhaustion
Seed reproducible != property complete
No counterexample found != invariant mathematically proven
```

The exit path therefore keeps the semantic scenario/oracle portable so it can be run in simpler model tests, deterministic simulation, real multi-process integration and production-shadow/non-destructive validation as appropriate.

## 10. History checking should reason over dependencies, not timestamps alone

Jepsen/Elle demonstrates that broad histories can be checked through inferred dependencies and consistency models, finding anomalies that narrow examples miss. G4 should similarly avoid declaring causal correctness from wall-clock sorting.

Candidate workflow dependency edges:

```text
intent -> accepted interaction
accepted interaction -> effective participant evidence
cause -> derived event/command
migration-source -> migration-target occurrence state
effect -> compensation obligation/effect
partition lineage -> reconnect reconciliation
checkpoint frontier -> post-compaction operation
```

Checker properties may include acyclicity where the contract requires it, no effect without an eligible causal/authority path, no compensation preceding its compensated effect, no target-generation reinterpretation of source-generation history, and no stale queued intent becoming eligible merely because delivery occurred later.

`Timestamp monotonicity != causal correctness`.

## 11. Minimal property families before technology qualification

Candidate universal properties:

1. **Ownership:** Exchange infrastructure never becomes canonical business owner through testing assumptions.
2. **Effect truth:** caller/transport outcomes never overwrite authoritative effect evidence.
3. **Multiplicity:** duplicate delivery/retry cannot silently multiply a non-repeatable effect.
4. **Authority:** effect-time revalidation follows the declared contract and stale authority cannot be inferred current from delivery.
5. **Compatibility:** a binding is accepted only against the required guarantee vector.
6. **Causality:** durable business causation survives telemetry loss and is not inferred from timestamps.
7. **Migration:** already-effective history is not reinterpreted under a target revision.
8. **Compaction:** every still-legal future operation has sufficient retained proof or degrades explicitly.
9. **Erasure:** verification/checkpoint artifacts do not resurrect forbidden data.
10. **Federation:** reconnect classifies/reconciles divergence before stale work becomes executable.
11. **Autonomy:** runtime-local operation continues according to declared topology when Builder/central research services are absent.
12. **Portability:** the same semantic oracle can evaluate more than one realization without embedding one provider's mechanics as truth.

## 12. Failure shrinking must preserve the semantic witness

Property-based systems commonly reduce failing examples. For G4, minimization must not remove the dependency that makes the anomaly meaningful. A reduced case should retain a witness such as:

```text
operations
fault schedule or relevant partial order
contract/authority revisions
observed caller results
authoritative effect evidence
causal dependency edges
violated property
```

If shrinking removes a partition, authority revision or UNKNOWN window that is necessary to explain the violation, the result is not a valid semantic counterexample even if some lower-level assertion still fails.

## 13. Adversarial verification scenarios

1. Local binding passes while RPC timeout produces UNKNOWN after effect.
2. RPC retry and async redelivery both target the same non-repeatable external effect.
3. Workflow migrates after effect but before lost response is reconciled.
4. Partitioned site retains old authority, reconnects, and receives queued work before revocation evidence.
5. Causal history is compacted one operation before a late duplicate arrives.
6. Dedup evidence expires while broker/file replay horizon remains open.
7. Compensation is generated after concurrent business state changed.
8. Checkpoint can resume but cannot prove whether an external effect already happened.
9. Erasure removes payload while minimized failing fixture accidentally retains a copy.
10. Provider upgrade keeps schema/interface but changes deadline or delivery guarantee.
11. Two bindings reach same final row but one produced a duplicate irreversible external effect.
12. Clock skew makes timestamp order disagree with causal order.
13. Deterministic simulator passes, but real multi-process integration exposes an unmodeled external provider behavior.
14. Fault injector heals transport and harness prematurely declares workflow convergence.
15. Old test oracle treats broker ACK as success and therefore masks a consumer/business failure.

## 14. Proof obligations

Before implementation planning, prove or explicitly bound:

1. semantic oracle is independent of transport/provider-specific success signals;
2. same-contract fixtures compare only declared-equivalent dimensions while exposing qualified operational differences;
3. stateful generation reaches migration/UNKNOWN/compaction/federation combinations rather than only isolated calls;
4. fault model includes authority, contract, retention and workflow transitions in addition to infrastructure faults;
5. every UNKNOWN path has an explicit reconciliation property and cannot collapse to guessed success/failure;
6. CausalCheckpoint sufficiency is tested per future operation class and compaction frontier;
7. dedup evidence horizon is tested against maximum supported replay/redelivery horizon;
8. erasure includes verification artifacts, minimized failures and checkpoint derivatives where applicable;
9. deterministic replay claims remain scoped to the simulated model/environment;
10. history checking uses causal/dependency evidence where ordering semantics matter rather than wall-clock order alone;
11. minimized counterexamples retain a valid semantic witness;
12. conformance suites can be exported and run against multiple bindings/providers without making one implementation the oracle;
13. autonomous runtime verification does not require Builder availability unless the declared topology explicitly requires a service;
14. no passing test suite is promoted to architecture/implementation authority without the later explicit G4 planning gate.

## 15. Portability / exit path

The verification strategy is portable only if the following are technology-neutral artifacts or can be exported:

```text
RequiredContractProfile
semantic scenario/state-machine model
fault model
SemanticHistoryRecord
property/invariant definitions
causal/effect witness
binding observation adapter
counterexample + seed/schedule where applicable
checkpoint-sufficiency result
reproducibility/retention qualification
```

Provider-specific harnesses may map native telemetry into these observations, but provider telemetry must not redefine the semantic oracle.

A future technology is easier to replace when the same semantic histories and properties can qualify its successor.

## 16. Material delta and maturity

This round adds a **seventh deep evidence consolidation** to the eighth G4 family. Material delta:

- turns prior same-contract fixtures into a layered semantic verification strategy rather than a list of examples;
- introduces a transport-independent semantic history/oracle boundary;
- proposes metamorphic same-scenario qualification across local/RPC/async/federated realizations without requiring identical operational histories;
- adds stateful generation across authority revision, migration, UNKNOWN, compaction, erasure and reconnect;
- separates infrastructure fault injection from semantic fault modeling;
- makes UNKNOWN an intentionally generated proof state;
- converts CausalCheckpoint sufficiency into an operation-by-operation matrix;
- treats retained test/counterexample artifacts as a privacy/erasure surface;
- bounds deterministic simulation claims and keeps real-integration evidence complementary;
- introduces dependency/history checking and semantic-witness-preserving minimization.

Family remains `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated. No property-testing framework, deterministic simulator, workflow engine, broker, checker or provider was selected.

Highest-value remaining gap: **formalize the reference-model boundary and linearization/effect points for each interaction kind (`COMMAND`, `QUERY`, `EVENT`, `STREAM`, `ARTIFACT_REF`)**, especially where external irreversible effects, partial observation and asynchronous currentness mean there may be no single universal linearization point. This should determine which properties can be checked as safety invariants, which require eventual/liveness assumptions, and which must remain qualified `UNKNOWN` under finite evidence.

## Sources / evidence class

- FoundationDB — Simulation and Testing: https://apple.github.io/foundationdb/testing.html
- FoundationDB — Client Testing / deterministic simulation caveats: https://apple.github.io/foundationdb/client-testing.html
- Antithesis — Deterministic simulation testing: https://antithesis.com/docs/resources/deterministic_simulation_testing/
- Antithesis — Controlling faults: https://antithesis.com/docs/product/writing_tests/controlling_faults/
- Antithesis — Writing tests: https://antithesis.com/docs/product/writing_tests/
- Hypothesis — Rule-based state machines: https://hypothesis.readthedocs.io/en/latest/stateful.html
- Jepsen — PostgreSQL 12.3 / Elle-generated histories: https://jepsen.io/analyses/postgresql-12.3
- Jepsen — jetcd 0.8.2 failure evidence: https://jepsen.io/analyses/jetcd-0.8.2
- Jepsen — consistency models/phenomena: https://jepsen.io/consistency

These sources constrain verification research only and do not authorize adoption.