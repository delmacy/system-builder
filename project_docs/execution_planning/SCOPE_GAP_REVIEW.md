# First Horizon — Scope/Dependency Gap Review

## Finding 1 — Ontology/Semantic Registry is a hook, not an M1 implementation prerequisite
The coarse capability DAG expresses a conceptual relationship between semantics and ProcessMirror. For M1, do not require implementation of the full Ontology Registry before ProcessMirror. Preserve only stable semantic hooks: opaque/versionable IDs, namespaces where needed, extensibility and non-silent reinterpretation. Promote the full registry later when real cross-domain cases justify it.

## Finding 2 — Evidence/Provenance is partly satisfied by the public artifact foundation
M1 needs provenance references and evidence traceability in ArtifactEnvelope/ProcessMirror/BusinessRecipe, but not a separate evidence service/runtime. Treat the standalone Evidence/Provenance module as later implementation while its contract semantics are architectural hooks now.

## Finding 3 — Identity/Auth is not a predecessor of the contract spine
User/authentication/runtime identity becomes necessary when implementing runtime capabilities, not when defining the technology-independent/public contract spine. Do not insert it into M1 merely because most applications eventually need authentication.

## Finding 4 — Capability Registry implementation is not required before SystemAnalysis contract
SystemAnalysis can define the shape of matches/gaps before a real search/catalog engine exists. The later Catalog/Capability Registry implementation will consume that contract. Use public identifiers/references, not runtime dependency.

## Finding 5 — TASK-011 is operational tooling, not product scope
The OpenCode adapter hotfix affects executor readiness for TASK-010 when OpenCode is selected. It must not contaminate product architecture or remain in the product DAG after the tooling issue is resolved.

## Finding 6 — Existing M1 chain is sufficiently decomposed for scheduling
TASK-010 and TASK-004..008 each have bounded paths, outputs, acceptance and validation. Activity-level decomposition has now been added. A lower WBS level is only needed locally when an activity proves too broad during task-pack generation.

## Conclusion
No new product module is required to start the first horizon. The main correction is to distinguish architectural hooks from blocking implementation dependencies.
