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
Security retirement != semantic settlement
Historical obligation != authority to keep vulnerable executable active
```

## Evidence classes reviewed

- Camunda 8 process-instance migration: active instances require explicit source/target element mapping; active jobs, expressions and input mappings are not automatically recreated or reevaluated; migration can create states not reachable by normal execution and suitability remains operator responsibility.
- Camunda process versioning guidance: old instances may continue on old definitions; supporting implementation resources can nevertheless change underneath older instances unless versioned/qualified separately; production-like migration testing is recommended.
- AWS Step Functions versions/aliases: published versions are immutable snapshots; an execution started with a qualified version is associated with that version at start. Alias routing can shift *new execution* traffic between versions without implying migration of already-running executions.
- Confluent Schema Registry compatibility: backward/forward/full/transitive modes prove structural readability relationships under schema rules; they do not prove changed business preconditions, authority, idempotency, compensation, ordering or effect guarantees.
- Temporal Worker Versioning: pinned executions can remain on the worker deployment version where they started; safe retirement depends on reachability/drain evidence, and newer worker-versioning mechanisms explicitly coordinate safe sunset rather than equating deployment replacement with in-flight rebinding.
- Kubernetes deprecation/version-skew guidance: compatibility windows and migration overlap are bounded; removed APIs require migration, and version-skew policies constrain supported coexistence rather than promising indefinite historical execution.
- NIST SSDF 1.2 draft direction: secure development includes reliable delivery/improvement and vulnerability-risk mitigation, reinforcing that compatibility cannot justify indefinite exposure to known vulnerable software.
- Uptane threat model/update framework: freeze/rollback/partial-update attacks and compromise recovery show that signed/previously valid software is not automatically safe to continue executing after security state changes.
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
security admissibility / revocation state
```

A change can be compatible in one dimension and incompatible in another.

```text
Schema backward-compatible
!= compensation backward-compatible
!= authority backward-compatible
!= effect-guarantee backward-compatible
!= security-admissible executable
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

`LATEST` is not a safe default disposition. Security findings may additionally make `PIN` no longer admissible even though it remains semantically faithful.

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
  securityAdmissibility / revocation evidence
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
security admissibility of the executing artifact/provider
```

Structural schema compatibility is evidence for only the first subset.

## 12. Security-forced retirement: compatibility and security are independent proof domains

A critical vulnerability can invalidate the continued execution of C1 before C1's business obligation horizon ends. The historical contract remains necessary to interpret facts and obligations, but that does **not** imply the vulnerable C1 executable remains admissible.

```text
Historical contract/evidence must remain interpretable
!=
Historical executable must remain runnable
```

This resolves a tension in pin-until-terminal strategies: semantic fidelity is valuable only while the pinned implementation remains within the accepted security policy. Once an artifact/provider is revoked, quarantined or outside its supported security horizon, the system needs a different disposition.

Candidate independent horizons:

```text
admissionHorizon
obligationHorizon
securitySupportHorizon
executableRetentionHorizon
evidenceRetentionHorizon
```

These horizons may end in different orders. In particular:

```text
securitySupportHorizon < obligationHorizon
```

is a first-class case, not an exceptional corruption of the model.

## 13. Candidate security-remediation dispositions

For an outstanding obligation whose historical executable is no longer security-admissible:

```text
PATCH-IN-PLACE-SEMANTICALLY-EQUIVALENT
  replacement artifact proves the same historical RequiredContractProfile

MEDIATED-CONTINUITY
  safe implementation executes through an explicit compatibility/translation layer

FORCED-MIGRATION
  outstanding state/obligation is explicitly transformed to a security-admissible target revision

FORWARD-RECOVERY
  original path cannot safely continue; discharge through a different governed outcome

QUARANTINE / MANUAL-SETTLEMENT
  neither old execution nor automated migration is sufficiently proven
```

Continuing C1 merely because it is historically correct is not a valid disposition after security revocation.

Likewise, emergency deployment of C2 does not automatically migrate C1 occurrences.

## 14. Security revocation is not semantic erasure

Revoking an executable/provider means it must not perform further effects under the revoked security posture. It does not rewrite prior effects, remove their historical contract identity, or make unresolved obligations disappear.

```text
Artifact revoked != prior effect invalidated
Artifact revoked != obligation settled
Artifact deleted != evidence deleted
Security patch installed != occurrence migrated
```

A durable record may therefore need to preserve C1 contract identity, artifact/provenance digest, migration evidence and historical effect evidence while the C1 executable itself is disabled or removed.

This supports a stronger separation:

```text
HistoricalSemanticEvidence
!= HistoricalExecutableArtifact
!= HistoricalSensitivePayload
!= CurrentSecurityAdmissibility
```

## 15. Forced migration needs a semantic proof, not an emergency exception

Security urgency can shorten the time available for migration but cannot fabricate equivalence. A forced migration candidate must still prove or explicitly qualify:

- interpretation of existing state under the target revision;
- preservation of already-realized effects and causal lineage;
- treatment of pending/`UNKNOWN` effects;
- idempotency/reservation/fencing continuity or incompatibility;
- compensation validity for effects created under the old revision;
- authority/currentness under the new execution boundary;
- target security admissibility and provenance;
- no downgrade/freeze path that can reactivate the revoked artifact silently.

If those proofs are unavailable, quarantine/forward recovery/manual settlement is safer than pretending that security urgency grants semantic compatibility.

## 16. Anti-rollback / anti-freeze implication

Uptane's threat model is instructive: an attacker can try to keep presenting properly signed but old update material (freeze) or exploit partial update state. For G4, a previously trusted artifact may later become explicitly revoked or below a minimum security generation.

Candidate rule:

```text
Signature/provenance valid
!= artifact currently admissible
```

Occurrence pinning must therefore not bypass a minimum-security/revocation policy merely because the artifact hash matches historical evidence. A runtime that is autonomous from Builder availability still needs locally available, durable security-admissibility material sufficient to reject known-revoked generations according to the declared topology.

This does **not** make the Exchange Plane or Builder the owner of business semantics; it adds an orthogonal execution-admissibility proof.

## 17. Safe retirement resembles reachability/drain evidence, but is stricter

Temporal worker-versioning experience provides a useful operational pattern: versioned workers can be pinned, traffic can move gradually, and old versions can be sunset when they are safe to remove. The universal lesson is not Temporal adoption; it is that retirement should be evidence-based.

Candidate retirement predicate:

```text
no new admissions to revoked/retiring revision
AND outstanding obligations inventoried
AND each obligation has disposition
AND no unresolved task/effect requires old executable semantics without qualified successor
AND late/replay paths cannot route to revoked artifact
AND rollback policy cannot reactivate it below security floor
AND required historical evidence remains interpretable
```

Zero live workers or zero new traffic is insufficient by itself.

## 18. Compatibility windows are bounded operational tools, not eternal obligations

Kubernetes deprecation/version-skew policies provide a mature counterexample to indefinite compatibility: supported overlap is deliberately bounded, and removed APIs require migration. The generalizable lesson is:

```text
Compatibility window != promise of indefinite executable coexistence
```

G4 therefore needs a declared retirement posture for long-lived obligations. A product that permits arbitrarily long workflows cannot assume every historical executable remains supportable forever; it needs migration/recovery/quarantine semantics capable of closing the gap between business obligation lifetime and security support lifetime.

## 19. Adversarial cases

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
17. Critical CVE revokes C1 while a multi-month occurrence is pinned to C1.
18. C1 is disabled for security, but delayed/replayed work still routes to a stale C1 worker.
19. Emergency C2 deployment is schema-compatible but changes effect ACK/idempotency semantics.
20. Rollback tooling restores a vulnerable C1 artifact because its signature/hash remains historically valid.
21. C1 is deleted before its contract/effect evidence is exported; late reconciliation becomes uninterpretable.
22. Security patch preserves interface shape but changes compensation behavior for effects created by C1.
23. Migration is postponed indefinitely in the name of compatibility, extending exposure beyond security policy.
24. Forced migration proceeds despite an unresolved C1 `UNKNOWN`, creating duplicate cross-version effects.
25. Runtime is disconnected from Builder and lacks durable revocation/security-floor material, so it keeps executing a known-vulnerable generation.

## 20. Proof obligations

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
14. if no qualified migration exists, the occurrence remains pinned only while security-admissible, otherwise forward-recovers, quarantines or goes manual rather than inheriting latest semantics;
15. security revocation disables future execution without erasing historical semantic/effect evidence;
16. a replacement artifact proves the historical RequiredContractProfile or declares explicit mediation/migration lossiness;
17. rollback/freeze paths cannot reactivate an artifact below the applicable security floor;
18. safe retirement is based on obligation/reachability evidence, not merely zero new traffic or process absence;
19. security support horizon and business obligation horizon are both representable when they diverge;
20. autonomous runtimes possess enough local trust/revocation evidence to enforce the declared security floor while Builder/central services are unavailable.

## 21. Portability / exit path

Portable state should preserve contract identifiers/revisions, occurrence/participant lineage, historical effect evidence, migration mappings, authority/currentness basis, idempotency/reservation namespaces, compensation/forward-recovery obligations, explicit unresolved states, artifact/provenance identities and security-revocation/admissibility evidence required by the declared topology. Provider-specific deployment IDs remain binding evidence rather than canonical business truth.

A provider/engine replacement is qualified only when it can interpret or deliberately migrate these obligations. Importing the latest workflow definition alone is insufficient. Exportability must not require retaining an executable known to be unsafe merely to preserve historical interpretability.

## 22. Trade-offs

| Strategy | Strength | Cost | Primary risk |
|---|---|---|---|
| pin until terminal | preserves historical semantics best while admissible | old runtime/provider support | security/operational drag |
| patch-equivalent historical contract | removes vulnerable implementation while preserving semantics | strong conformance proof | hidden behavioral drift |
| explicit migration | reduces version population/exposure | proof + tooling + testing | semantic drift/unreachable state |
| mediation | can bridge versions/providers | adapter complexity | silent lossy equivalence |
| forward recovery | useful after irreversible/security-forced change | long-lived obligations | outcome differs from original path |
| manual quarantine | safest under insufficient proof | low availability/operator cost | stranded work/resources |

No strategy is the default.

## 23. Material research position

Material delta exists. Version evolution for long-lived heterogeneous effects is not primarily a deployment problem; it is an **obligation-lineage problem with an independent execution-security horizon**. New routing, aliases, schemas, providers or workflow definitions may govern new admissions while old occurrences remain bound to historical semantic obligations. Migration must be explicit and multidimensional, particularly around `UNKNOWN`, idempotency/reservation namespaces, authority, compensation and irreversible effects.

Security adds a non-negotiable orthogonal constraint: preserving historical meaning does not authorize indefinite execution of vulnerable code. Contract/effect evidence may outlive the executable; when security support ends before the business obligation, the occurrence needs a qualified patch-equivalent implementation, mediation, forced migration, forward recovery or quarantine/manual settlement.

Central rules:

```text
Latest deployment state does not rewrite historical effect semantics.
An in-flight obligation changes semantic basis only through an explicit,
qualified migration/mediation/recovery disposition.

Historical semantic continuity does not imply historical executable continuity.
Security retirement does not settle or erase the obligation it interrupts.
```

This remains research, not implementation authority.

## 24. Highest-value remaining gaps

1. model/property-based fixtures for security-forced retirement, especially `UNKNOWN -> revoke old executable -> migrate/mediate -> late old effect`;
2. evidence-minimal migration when historical payloads have been erased but obligations remain;
3. multi-party negotiation when two capabilities evolve independently and no direct revision overlap remains;
4. distributed/offline propagation of security floors and revocations without turning Builder availability into a runtime dependency;
5. synthesis/deduplication of family-8 vocabulary into a compact implementation-independent contract model once new evidence stops changing boundaries.