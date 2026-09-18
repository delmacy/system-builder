# G4 — Product UX, Living Canvas & AI-Native Builder R&D

Status: `RESEARCH_BACKLOG_ONLY`
Execution authority: NONE

## Problem

The System Builder can be architecturally mature while remaining difficult to use if raw model complexity leaks directly into the interface.

`Architecture Readiness != Builder UX Readiness != Product Pilot Readiness`.

## Research families

### Living Canvas
Research semantic zoom over the same canonical model:

```text
System -> Environment -> Host/Placement -> Deployment Unit
-> Module -> Capability -> Workflow/Process -> Activity/Rule/Data/Provider
```

Canvas is a projection, never source of truth.

### Lenses
Topology, workflow, authority, data, security, capacity, cost, complexity, evidence, deployment and lifecycle lenses over shared identity.

`Graph != Layer != Lane != Lens != Authority`.

### Progressive disclosure
Research semantic zoom, bounded traversal, lazy loading, context windows, saved views and role-aware projections. Never render the whole enterprise graph by default.

### Inspectors/explainability
Expose identity, owner, revision, currentness, evidence, dependencies, open findings, effective state and why a recommendation/change exists.

### Search/command interaction
Combine exact/structured/full-text/graph/vector retrieval under authorization/currentness. AI may create candidate query/action plans; plans must be inspectable and authorized before side effects.

### AI-native Builder
Candidate functions: elicitation copilot, navigation/query assistant, architecture/change assistant, complexity explanation, semantic linguist, impact-analysis explainer, test/proof assistant, remediation/change candidate generation and documentation/dossier projection.

`AI inference != authority`.

### Preview / Sandbox
Research Structural Preview and Interactive/Sandbox Preview before autonomous compilation/publication.

`Preview != compiled autonomous runtime != Product Proof != Production Readiness`.

Providers, credentials and side effects may use sandbox adapters. Research behavioral-equivalence proof for the subset declared previewable.

### Explore vs Design/Act
Separate inspection from mutation authority. Visibility of topology does not imply permission to change it.

### Productivity
Templates, patterns, reusable compositions, bulk operations, shortcuts, saved lenses, automation, query presets and evidence-aware suggestions.

### Product intelligence
Complexity observatory, findings, drift, currentness, attention queues, semantic search, impact analysis and decision support. Avoid opaque scalar health/quality scores.

## R&D method

```text
Hypothesis -> Prototype -> User/engineering experiment -> Measurement
-> KEEP / REFINE / REJECT
```

Prototype evidence does not become architecture authority automatically.

## Proof obligations

1. Large models remain navigable without loading/rendering everything.
2. Hidden/nonvisible objects do not leak through search/count/autocomplete/AI.
3. Mutation paths show authority, impact and evidence requirements.
4. Stale/PARTIAL/UNKNOWN remain visible.
5. AI suggestions distinguish candidate from canonical fact.
6. Canvas projections are rebuildable from canonical state.
7. Preview distinguishes simulated from compiled/effective behavior.
8. Complex graphs remain explainable through semantic zoom/lenses.
9. Accessibility and keyboard/expert workflows are included.
10. UX performance budgets are measured as interactive workloads.
