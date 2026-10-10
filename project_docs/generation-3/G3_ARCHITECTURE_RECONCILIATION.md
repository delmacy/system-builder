# G3 Architecture Reconciliation

Status: FINAL / IMPLEMENTATION-INDEPENDENT.

## Architectural intent

G3 seeks structural, behavioral, governance, compositional and evolutionary completeness sufficient to synthesize diverse enterprise systems by composition rather than sector enumeration. System Builder is a metamodel/assembler/compiler-generator/governance/lifecycle manager. The published client runtime remains autonomous from the Builder.

Broad architecture is established up front; future implementation is narrow, incremental and evidence-gated. `Sequential Governance != Serial Execution`. This document does not materialize planning.

## Implementation-independent target flow

```text
Real business / external reality
  -> elicitation + observations + artifacts
  -> qualified knowledge/evidence
  -> approved BusinessRecipe
  -> analysis + decisions
  -> SystemDefinition
  -> capability/contract resolution
  -> validated assembly
  -> reproducible artifact/release
  -> deployment/realization
  -> autonomous runtime
  -> occurrences/effects/observations
  -> reconciliation/assurance
  -> governed evolution/revision
```

This preserves the repository Master Blueprint while making semantic ownership and proof boundaries explicit.

## Canonical semantic spine

`CanonicalSemanticIdentity -> DefinitionIdentity / OccurrenceIdentity / RealizationIdentity`, connected by governed QualifiedRelations and typed qualifications for owner, revision, currentness, locality, provenance, authority and effective period.

A Definition states what is specified/intended; an Occurrence identifies what happened; a Realization identifies how/by whom/by what semantics are realized. Observation and Evidence qualify knowledge about reality; Projection presents/derives it. None is silently interchangeable.

## Knowledge-to-action boundary

`Evidence -> AnalysisOccurrence -> AnalyticalResult/Finding -> CandidateAction -> DecisionOccurrence -> AuthorizedChange -> Action/Execution -> External/Internal Effect -> Observation -> Reconciliation`.

AI may assist elicitation, analysis, mapping and candidate generation. AI inference is never authority. Deterministic contracts increasingly dominate after SystemDefinition, consistent with the Master Blueprint.

## Runtime/operations boundary

LogicalComponent != DeploymentUnit != Artifact != RuntimeUnit != Host/Provider. AssemblyPlan != DeploymentTopology != Packaging/BuildPlan != Release != DeploymentPlan != RuntimeTopology. Provider APIs and host/workload mechanisms are realizations behind capability contracts; they cannot redefine canonical semantic identity.

Control follows `candidate change -> desired -> actuation -> acknowledgement -> observe -> reconcile -> effective evidence`. ACK != effect/convergence. If an external mutation may have occurred and the effect is UNKNOWN, reconcile before retry.

## Information and retrieval boundary

File/StoredObject/Blob != Document != Dataset != Evidence != CanonicalData. SemanticIdentity != ContentIdentity != StorageIdentity. Search/index/vector/Canvas/Digital Thread/complexity graphs are rebuildable or governed projections over canonical relations and qualified evidence; index != source of truth.

## Governance boundary

Approval, Handoff, Escalation, Delegation, Review, Veto, Acknowledgement, Dual Control, Exception and Determination are compositions over Condition/Decision/Authority/Role/Constraint/Obligation/Occurrence/Action/Transition/Evidence/QualifiedRelation. No universal ApprovalFlow primitive is required.

A representative chain is:

`Condition -> Applicable Constraint -> Required Authority Set -> Decision Occurrence(s) -> Satisfied Obligation -> Authorized Action -> Execution -> Effective State/Observation`.

## Composition boundary

Assumption–guarantee is a proof vocabulary over capability contracts rather than a new universal primitive pair. Producer claims retain identity/revision/currentness/locality/provenance; consumers validate required qualifications and fail closed when assumptions are not satisfied or are UNKNOWN. Mediation transforms qualified representations but does not gain semantic authority by transformation.

## Evolution and digital thread

Revision != Identity; Correction != Historical Erasure; Realization Replacement != Semantic Replacement. Digital Thread is historical typed traversal across owner-controlled relations, definitions, occurrences, decisions, realizations and evidence; it is not a parallel canonical store. Migration is a governed process/realization with preservation proofs. Rollback != Undo. Decommission retains historical identity and irreversible effects while proving bounded cleanup obligations.

## Portability axes

G3 separately requires data portability, semantic portability, definition portability, integration/provider portability, operational autonomy, evolutionary portability and evidence/history portability. `ImplementationLanguage != SemanticIdentity`: replacing TypeScript with Rust may be expensive but must not require rediscovering system meaning.

## Eight-family physical freedom

The eight capability families in `G3_CAPABILITY_SYNTHESIS.md` are conceptual ownership boundaries. Initial implementation may remain a modular monolith with PostgreSQL and rebuildable projections; later workers/services/providers/topologies may be separated when justified without changing semantic contracts. Logical composition never mandates physical topology.
