# First Horizon — Activity Breakdown

Activities are planning units below Work Package and above final executor task/subtask detail. Existing TASK specs remain authoritative.

## WP-FH-01 — ArtifactEnvelope executable contract
- ACT-01A: reconcile ADR-0009 semantics with JSON Schema 2020-12 representation.
- ACT-01B: implement reusable envelope schema.
- ACT-01C: create valid/invalid identity, SemVer, provenance and extension fixtures.
- ACT-01D: implement deterministic offline fixture validation/compatibility tests.
- ACT-01E: run repository verification and capture evidence.

## WP-FH-02 — ProcessMirror public contract
- ACT-02A: define minimal identity/reference model for observations.
- ACT-02B: model actors, activities, decisions, exceptions and evidence/provenance references.
- ACT-02C: enforce Observed/Reported/Documented/Inferred semantics without approval semantics.
- ACT-02D: create valid/invalid fixtures and public exports.
- ACT-02E: validate ArtifactEnvelope integration and deterministic tests.

## WP-FH-03 — BusinessRecipe public contract
- ACT-03A: define recipe identity, fragments/modules and version references.
- ACT-03B: model approved rules, responsibilities, approvals, exceptions and evidence links.
- ACT-03C: enforce technology-independent boundary and Recipe != SystemDefinition.
- ACT-03D: fixtures/public exports/version-extension tests.
- ACT-03E: traceability test from ProcessMirror evidence into approved recipe statements.

## WP-FH-04 — SystemAnalysis public contract
- ACT-04A: model requirement trace references.
- ACT-04B: model capability matches, gaps, adaptations and custom needs.
- ACT-04C: model integration/security/sizing findings without assembly decisions.
- ACT-04D: fixtures/public exports/tests.
- ACT-04E: traceability test back to BusinessRecipe requirements.

## WP-FH-05 — SystemDefinition public contract
- ACT-05A: model entities/relations/processes/actions.
- ACT-05B: model capability references, views, permissions and policies.
- ACT-05C: model integrations/environment requirements while structurally excluding secrets.
- ACT-05D: enforce Builder/Runtime and Recipe/Definition boundaries.
- ACT-05E: fixtures/public exports/boundary tests and verification.

## WP-FH-06 — Assembly/Release boundary chain
- ACT-06A: define AssemblyPlan minimum public contract.
- ACT-06B: define validation-evidence references and deterministic chain identifiers.
- ACT-06C: define ReleaseArtifact and PublishedRelease separation.
- ACT-06D: define Environment/DeploymentRecord separation and secret exclusion.
- ACT-06E: create linked synthetic fixtures across the full chain.
- ACT-06F: execute end-to-end contract-chain validation and architecture gates.

## Further decomposition rule
Create a lower level only when an activity still contains multiple independently testable outputs, different predecessors/owners, or architectural ambiguity. Do not split merely to increase task count.
