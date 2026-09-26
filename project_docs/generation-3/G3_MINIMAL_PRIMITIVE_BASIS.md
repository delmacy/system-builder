# G3 Minimal Primitive Basis

Status: FROZEN / SATURATED.

## Ontological root

No additional universal root is required.

```text
Entity
├─ Continuant-like
│  ├─ Independent Entity
│  │  ├─ Physical/Material Entity
│  │  └─ Non-physical/Social/etc.
│  └─ Dependent Entity
│     ├─ Quality/Property
│     └─ Realizable Aspect
│        ├─ Role
│        └─ Disposition
└─ Occurrent-like
   └─ Process/Activity
```

Orthogonal categories: Relation, Time, Location, Participation, Parthood/Composition, Dependency. Concept represents/classifies/means a thing and is not the represented reality.

Agent is not a root: it composes Entity + agency/responsibility disposition + participation/role. Event is a qualified temporal occurrence/boundary, not a root. Specification/Definition is an Information Entity/Artifact with normative or descriptive function. Quality/Property cannot be reduced to Entity→Value because property occurrence, value, measurement and observation remain distinct. Disposition != Capability != Function != Role != Process.

## Architectural primitive basis

The minimum architectural identity basis is:

```text
CanonicalSemanticIdentity
├─ DefinitionIdentity
├─ OccurrenceIdentity
└─ RealizationIdentity

QualifiedRelation
```

This is a semantic basis, not necessarily a class hierarchy.

- CanonicalSemanticIdentity: which semantic thing?
- DefinitionIdentity: which definition/specification/intention?
- OccurrenceIdentity: which concrete occurrence?
- RealizationIdentity: how/by whom/by what is the semantics realized?
- QualifiedRelation: how do identities relate under governed semantics and conditions?

`QualifiedRelation` MUST NOT degrade into `edge(source,target,type,jsonMetadata)`. A relation kind owns allowed source/target kinds, qualifications, lifecycle and semantics. Relation-schema evolution distinguishes RelationKindRevision from RelationOccurrenceRevision; historical relations remain interpretable under their governing contract revision. Label rename may preserve semantics; semantic change, split/merge or migration requires explicit mapping/disposition/evidence.

## Derived/composed constructs

The following do not require promotion to universal structural primitives:

- State: qualified temporal condition/projection.
- Claim/Finding: assertion roles/compositions.
- Evidence: qualified support role/relation; Artifact != Evidence; Finding != Evidence.
- Constraint: specialized Definition + applicability.
- Obligation: normative constraint/commitment over actor/role/action/target/condition/scope/authority/effective period.
- Decision: domain construct composed as DecisionOccurrence + DecisionDefinition + alternatives + inputs + rationale + authority + disposition + evidence + effective period.
- Artifact: Entity with produced/used-by activity and intended function/context.
- Revision: qualified derivation relation/capability.
- Provenance: qualified relation network.
- Snapshot: bounded temporal/revision projection/artifact.
- Layer/Lens: projection/query configuration.
- Graph: representation/topology.
- Gate: governed constraint/evaluation composition.
- Provider: qualified realization role.
- Binding: qualified relation.
- Release/Deployment/Workspace/ComplexityProfile/Pattern/Waiver/Simulation: domain compositions, not new roots.

ApprovalFlow, retry, acknowledgement, migration, digital thread, backup, clone, rollback, decommission, protocol sessions and sector-specific objects are compositions over this basis unless a future reopening criterion proves otherwise.

## Qualification invariant

Owner, authority, revision, currentness, locality, classification, provenance and effective period are typed contract semantics. They are not an ungoverned universal property bag. UNKNOWN/PARTIAL/CONFLICTED qualifications cannot be silently strengthened.
