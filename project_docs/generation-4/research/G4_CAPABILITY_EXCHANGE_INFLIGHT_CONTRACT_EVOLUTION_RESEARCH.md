# G4 — In-Flight Contract Evolution Across Heterogeneous Effects

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Research how long-lived cross-capability occurrences behave when workflow definitions, contracts, providers, authority rules, compensation semantics or effect guarantees evolve while an occurrence is still active or a participant effect is `UNKNOWN`.

This is a material subfront of family 8, not a new macro-family. It selects no workflow engine, provider, broker, migration mechanism or registry and grants no implementation authority.

Core rules:

```text
New contract available != in-flight occurrence upgraded
Interface/schema compatible != in-flight semantic compatibility
Provider substitution != contract continuity
Definition migration != participant-effect migration
UNKNOWN effect != safe migration boundary
Alias/routing update != existing occurrence rebinding
Migration accepted != business semantics preserved
```

## Evidence classes reviewed

- Camunda 8 process-instance migration: active instances require explicit source/target element mapping; active jobs, expressions and input mappings are not automatically recreated or reevaluated; migration can create states not reachable by normal execution and suitability remains operator responsibility.
- Camunda process versioning guidance: old instances may continue on old definitions; supporting implementation resources can nevertheless change underneath older instances unless versioned/qualified separately; production-like migration testing is recommended.
- AWS Step Functions versions/aliases: published versions are immutable snapshots; an execution started with a qualified version is associated with that version at start. Alias routing can shift *new execution* traffic between versions without implying migration of already-running executions.
- Confluent Schema Registry compatibility: backward/forward/full/transitive modes prove structural readability relationships under schema rules; they do not prove changed business preconditions, authority, idempotency, compensation, ordering or effect guarantees.
- Prior G4 findings on workflow migration, multidimensional contract compatibility, heterogeneous effect composition, provider substitution under `UNKNOWN`, causal frontiers and finite evidence retention.

## 1. Separate occurrence binding from current deployment binding

A long-lived occurrence needs an explicit semantic basis. The provider or workflow version currently selected for new work is not automatically the basis of old work.

Candidate distinction:

```text
CurrentBinding(context, now)
!=
OccurrenceBinding(occurrence, participant, effect-stage)
```

An occurrence may legitimately remain pinned to an older contract/provider while new occurrences use a newer one. Conversely, migration may be necessary when the old implementation can no longer safely discharge outstanding obligations.

Invariant:

`Routing change for new work != migration of existing obligations`.

## 2. Evolution is multidimensional

Treating evolution as one version number hides independent changes. Candidate dimensions include:

```text
workflowDefinitionRevision
interactionContractRevision
schemaRevision
providerOfferRevision
bindingRevision
authorityPolicyRevision
idempotency/dedup horizon
reservation semantics
compensation contract
forward-recovery contract
pivot/irreversibility classification
evidence/currentness requirements
```

A change can be compatible in one dimension and incompatible in another.

```text
Schema backward-compatible
!= compensation backward-compatible
!= authority backward-compatible
!= effect-guarantee backward-compatible
```

## 3. Four candidate evolution dispositions

For each in-flight participant obligation, research should distinguish:

```text
PIN
  continue under the qualified historical contract/binding

MEDIATED_CONTINUITY
  use a declared adapter/translation while preserving required semantics

MIGRATE
  transform occurrence/obligation state to a qualified target contract

FORWARD_RECOVER / MANUAL_SETTLEMENT
  historical semantics cannot be reproduced safely; discharge through an explicitly different governed path
```

`LATEST` is not a safe default disposition.

## 4. UNKNOWN is a migration barrier unless explicitly resolved

If provider B1 is `UNKNOWN`, rebinding to B2 or changing B's contract can duplicate or conflict with an effect that already occurred.

```text
B1(contract C1) = UNKNOWN
contract evolves to C2 / provider B2
```

Before executing under C2/B2, prove at least one of:

- the C1/B1 effect is absent;
- duplicate/cross-version effects are harmless under the invariant;
- both versions share a target-side exclusion/idempotency namespace strong enough for the required horizon;
- a qualified migration protocol transfers the outstanding obligation without creating a second effect right;
- business semantics explicitly accept compensation/manual settlement risk.

Therefore:

`UNKNOWN + new version != retry on new version`.

## 5. Migration must preserve already-created obligations

Camunda's migration model is instructive: mapping active elements does not recreate jobs or reevaluate expressions/input mappings. More generally, changing a definition cannot retroactively change facts/effects that already happened.

Candidate invariant:

```text
Past effect evidence remains interpreted under its historical contract,
while future obligations may move only through an explicit migration rule.
```

A migrated occurrence therefore may be mixed-version by construction:

```text
A effect -> C1 historical
B pending -> migrated C1 -> C2
C future -> C2
```

The model must represent this instead of pretending the entire history was always C2.

## 6. Compensation evolution is especially dangerous

If C1 declared an effect compensable but C2 changes compensation semantics, an occurrence that already executed the original effect cannot silently inherit the new compensation contract.

```text
Effect E happened under C1
C2 changes inverse/compensation behavior
```

Required qualification asks whether C2 compensation is valid for an E produced under C1, whether a historical compensator must remain available, or whether only forward/manual recovery remains legitimate.

`New compensator exists != old effect safely compensable by it`.

## 7. Pivot and irreversibility revisions cannot rewrite history

If a later contract classifies an operation differently, already-realized effects retain their historical physical/business reality.

```text
C1: E classified compensable
E occurs
C2: E classified irreversible
```

The revision may change future recovery policy, but cannot make the historical effect un-happen or retroactively prove an unavailable compensation.

Likewise, changing a future step from reversible to pivot can make migration unsafe unless all required pre-pivot evidence/reservations already exist.

## 8. Version pinning has an obligation horizon

AWS Step Functions provides a mature example of immutable workflow versions associated at execution start, while aliases shift traffic for new executions. For G4 the general principle is:

```text
Admission horizon != obligation horizon
```

A contract/provider revision may stop accepting new work while still being needed to interpret or discharge old obligations.

Retirement therefore requires an inventory of outstanding obligations, not merely zero new admissions.

## 9. Pinning does not necessarily pin implementation resources

Camunda guidance warns that older process instances can use newer supporting implementations when references are unchanged. This yields an important G4 boundary:

`Definition pinned != implementation semantics pinned`.

A qualified historical occurrence may need explicit provider/worker/artifact binding evidence, or a proof that the newer implementation remains compatible with the historical required contract profile.

## 10. Candidate `OccurrenceContractLineage`

Research vocabulary, not schema:

```text
occurrenceRef
admissionContractRevision
workflowDefinitionRevision
participantObligations[]
  capabilityRef
  historicalContractRevision
  currentRequiredContractRevision
  provider/binding revision
  disposition: PIN | MEDIATE | MIGRATE | FORWARD_RECOVER | MANUAL
  effectState: NOT_ATTEMPTED | EFFECTIVE | REJECTED | UNKNOWN | CONFLICTED
  migrationEvidenceRefs[]
  authority/currentness basis
  idempotency/reservation horizons
  compensation/forward-recovery contract refs
causalFrontierRef
settlementPredicateRevision
```

The key property is per-obligation lineage rather than one mutable occurrence version.

## 11. Compatibility test for in-flight migration

A target revision is a migration candidate only if the required dimensions for the outstanding obligation are preserved or explicitly mediated:

```text
payload/schema readability
business pre/postconditions
authority and tenant/classification semantics
effect identity and idempotency namespace
ordering/causality assumptions
reservation/fencing semantics
deadline/currentness semantics
UNKNOWN/reconciliation behavior
compensation/forward-recovery behavior
evidence/settlement obligations
```

Structural schema compatibility is evidence for only the first subset.

## 12. Adversarial cases

1. B1 is `UNKNOWN`; deployment switches to B2; B2 succeeds; B1 later proves effective.
2. Schema remains backward compatible but C2 changes `accepted` from durable effect to queued acknowledgement.
3. Workflow definition is pinned but a worker implementation is replaced in place and changes idempotency scope.
4. C1 effect happened; C2 removes or changes the compensator.
5. Authority is revoked between migration planning and first C2 effect.
6. Migration maps active nodes successfully but required historical variables/evidence were compacted.
7. Alias shifts all new traffic to V2 and an operator assumes old V1 executions also moved.
8. A provider retires C1 before its obligation horizon closes.
9. C1 and C2 use different idempotency namespaces; retry after migration duplicates an old effect.
10. Reservation created under C1 is interpreted as stronger under C2 without target requalification.
11. Pivot classification moves earlier in C2 while occurrence already passed the corresponding point under C1.
12. A lossy adapter makes C1 payload readable by C2 but drops authority/classification metadata.
13. Settlement predicate changes while occurrence is partially effective, making an old unresolved obligation appear complete.
14. Historical contract executable is deleted while a late compensation obligation remains possible.
15. Migration succeeds technically but creates a state unreachable under the target definition's normal admission rules.
16. Builder is unavailable; autonomous runtime must continue pinned obligations without consulting a central latest-version service.

## 13. Proof obligations

Before implementation planning, prove or explicitly bound:

1. every in-flight obligation has an identifiable historical semantic basis;
2. routing/deployment changes for new work cannot silently rebind existing obligations;
3. migration is explicit per outstanding obligation and not inferred from interface/schema compatibility;
4. `UNKNOWN` effects cannot be retried on a new provider/revision without cross-version duplicate/conflict proof;
5. past effects remain attributable to their historical contract even after migration;
6. compensation/forward-recovery semantics are qualified against the revision that produced the effect;
7. authority/currentness is revalidated at migration/effect boundaries required by contract;
8. idempotency, reservation and fencing namespaces/horizons survive migration or incompatibility is explicit;
9. definition pinning does not silently rely on mutable supporting implementation semantics;
10. contract retirement accounts for outstanding obligation horizon;
11. retained evidence is sufficient for migration/reconciliation without requiring prohibited infinite sensitive-data retention;
12. migration cannot turn a previously `UNKNOWN` disposition into success/failure by assumption;
13. autonomous runtimes can interpret pinned obligations without Builder availability according to the declared topology;
14. if no qualified migration exists, the occurrence remains pinned, forward-recovers, quarantines or goes manual rather than inheriting latest semantics.

## 14. Portability / exit path

Portable state should preserve contract identifiers/revisions, occurrence/participant lineage, historical effect evidence, migration mappings, authority/currentness basis, idempotency/reservation namespaces, compensation/forward-recovery obligations and explicit unresolved states. Provider-specific deployment IDs remain binding evidence rather than canonical business truth.

A provider/engine replacement is qualified only when it can interpret or deliberately migrate these obligations. Importing the latest workflow definition alone is insufficient.

## 15. Trade-offs

| Strategy | Strength | Cost | Primary risk |
|---|---|---|---|
| pin until terminal | preserves historical semantics best | old runtime/provider support | security/operational drag |
| explicit migration | reduces version population | proof + tooling + testing | semantic drift/unreachable state |
| mediation | can bridge versions/providers | adapter complexity | silent lossy equivalence |
| forward recovery | useful after irreversible change | long-lived obligations | outcome differs from original path |
| manual quarantine | safest under insufficient proof | low availability/operator cost | stranded work/resources |

No strategy is the default.

## 16. Material research position

Material delta exists. Version evolution for long-lived heterogeneous effects is not primarily a deployment problem; it is an **obligation-lineage problem**. New routing, aliases, schemas, providers or workflow definitions may govern new admissions while old occurrences remain bound to historical semantic obligations. Migration must be explicit and multidimensional, particularly around `UNKNOWN`, idempotency/reservation namespaces, authority, compensation and irreversible effects.

Central rule:

```text
Latest deployment state does not rewrite historical effect semantics.
An in-flight obligation changes semantic basis only through an explicit,
qualified migration/mediation/recovery disposition.
```

This remains research, not implementation authority.

## 17. Highest-value remaining gaps

1. model/property-based fixtures for mixed-version occurrences, especially `UNKNOWN -> provider/contract migration -> late old effect`;
2. contract retirement and security patching when pinning old executables conflicts with vulnerability remediation;
3. evidence-minimal migration when historical payloads have been erased but obligations remain;
4. multi-party negotiation when two capabilities evolve independently and no direct revision overlap remains;
5. synthesis/deduplication of family-8 vocabulary into a compact implementation-independent contract model once new evidence stops changing boundaries.