# Palantir Ontology / Semantic System Study

Date: 2026-09-23
Status: `RESEARCH / PUBLIC-DOC EVIDENCE`

## Public model

Palantir documents Ontology as a system integrating **data, logic, action and security**, conceptually grouped into Language, Engine and Toolchain. Objects/properties/links represent operational nouns/relations; functions/actions/automations provide logic and verbs; security governs interaction.

This is closer to an operational semantic substrate than to a conventional read-only semantic layer.

## Findings

### P-O01 — Nouns plus verbs
**Primitive:** semantic identity + relationships + executable/authorized operations.

**SB relation:** supports keeping Entity/Domain semantics connected to Commands/Actions without collapsing `Button != Domain Command` or `Action definition != execution authority`.

**Classification:** `ALREADY COVERED / ADAPT`.

### P-O02 — Interface as polymorphic contract
Ontology Interfaces can require properties, link constraints and action-type constraints. Concrete object types map implementations to interface requirements. Interfaces may extend multiple interfaces.

**Primitive:** structural/behavioral contract with explicit implementation mapping.

**SB relation:** useful evidence for capability-facing contracts and provider/object substitution, but SB must preserve its stronger rule that interface/schema compatibility alone is not full contract compatibility.

**Classification:** `ADAPT`.

### P-O03 — Interface action constraint does not fabricate semantic uniformity
Palantir documentation explicitly warns that satisfying concrete actions can have distinct rules, permissions and side effects and should be reviewed for semantic match. Some interface-action surfaces also have current product limitations.

**Primitive:** contract-shape satisfaction != behavioral equivalence.

**SB relation:** strongly reinforces `Adapter normalization != fabricated semantic equivalence` and multidimensional compatibility.

**Classification:** `ADOPT PRINCIPLE`.

### P-O04 — Interface evolution can break implementations/consumers
Adding required properties/link/action constraints can require coordinated implementation updates; docs recommend new interface versions when downstream consumers cannot update simultaneously.

**Primitive:** explicit contract evolution and coexistence.

**SB relation:** supports immutable/versioned semantic contracts and compatibility proofs instead of mutable-latest assumptions.

**Classification:** `ALREADY COVERED`.

### P-O05 — Operational write loops create effect ambiguity
Ontology Actions can invoke external webhooks/writeback. Public webhook/action docs expose the need to reason about external request success/failure separately from local semantic mutation.

**Primitive:** external effect acknowledgement != canonical state transition completion.

**SB relation:** direct fit with existing `Provider ACK != effective state`, `AUTHORIZED != EXECUTED != EFFECTIVE != OBSERVED`, `UNKNOWN -> reconcile` research.

**Classification:** `ALREADY COVERED`, high-value validation.

### P-O06 — Semantic model is a platform backend
OSDK generated bindings expose Ontology entities/actions/functions to applications. This gives strong developer ergonomics and type coupling, but application compatibility becomes sensitive to Ontology API identity/evolution.

**Primitive:** generated semantic client contract.

**SB relation:** attractive for generated typed clients, but SB should bind stable semantic identities/revisions rather than let mutable human-readable/provider names become canonical identity.

**Classification:** `ADAPT`.

## SB boundary

Do not collapse:

```text
BusinessRecipe -> Palantir Ontology analogy
```

BusinessRecipe is explicitly technology-independent approved business knowledge. A Palantir Ontology is an operational platform model combining data, logic, actions and security. The closer SB comparison is some future composition across SystemDefinition + semantic registry + action/authority contracts, not BusinessRecipe itself.

## Open research

- Exact Ontology provenance/lineage semantics across edits/actions/data sync.
- Permission inheritance and classification propagation through AI/output/log surfaces.
- Branch merge/conflict semantics for Ontology plus dependent apps.
- Transaction boundaries of multi-object actions versus external side effects.
- Interface version coexistence and runtime resolution in large fleets.

## Sources

Official Palantir docs accessed 2026-09-23: Architecture Center — Ontology system; Interfaces — create/implement/extend/edit/interface action constraints; Action types — actions on interfaces/webhooks; OSDK overview.