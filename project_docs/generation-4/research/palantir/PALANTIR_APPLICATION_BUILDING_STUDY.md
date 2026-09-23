# Palantir Application Building / DevOps Study

Date: 2026-09-23
Status: `RESEARCH / PUBLIC-DOC EVIDENCE`

## Surfaces reviewed

Developer Console, Ontology SDK (OSDK), React applications, SuperRepo, Marketplace/Foundry Products and Global Branching.

## Findings

### P-APP01 — Generated SDK from semantic model
OSDK provides generated typed access to Ontology objects/actions/functions for TypeScript, Python and Java, plus OpenAPI for other languages. Public docs explicitly frame Foundry as the application's backend.

**Transferable primitive:** generated client contract from versioned semantic definition.

**SB classification:** `ADAPT` — valuable for Station/apps/runtime SDKs, but generated code must not create mandatory Builder-runtime dependency.

### P-APP02 — SuperRepo shortens cross-layer iteration
SuperRepo (beta) places Ontology-as-code, functions, generated OSDK and frontend in one pro-code monorepo, with local preview and CLI-driven deployment. Ontology-as-code is source of truth for entities defined there.

**Transferable primitive:** co-version strongly coupled source definitions while preserving explicit artifact boundaries.

**SB classification:** `ADAPT`. SB already has monorepo/factory concepts, but `BusinessRecipe != SystemDefinition != generated code` must remain visible rather than collapsed into one repository abstraction.

### P-APP03 — Package is a dependency graph, not a zip
Marketplace installation models product outputs, inputs, linked products, versions and installation jobs. Foundry Products are described as self-contained packages with dependency metadata and cross-enrollment portability.

**Transferable primitive:** typed package inputs/outputs + dependency graph + install evidence.

**SB classification:** `ADOPT PRINCIPLE` for ReleaseArtifact/Capability packaging.

### P-APP04 — API-name coupling is a documented portability hazard
OSDK applications reference Ontology entities by API name. Marketplace may rename conflicting API names, and Palantir docs warn this can break installed applications. Guidance includes preserving source API names, fully-qualified names, separate spaces or interfaces.

**Transferable lesson:** human/API name != stable semantic identity; installation remapping must be explicit and validated.

**SB classification:** `AVOID` as canonical identity pattern; use stable identity + alias/name mappings.

### P-APP05 — Global Branching attempts end-to-end change isolation
Global Branching allows supported resources across applications to change on one branch and be tested/reviewed/merged together. Public docs also expose integration limitations, demonstrating that cross-resource branching is not automatically universal.

**Transferable primitive:** system-change branch spanning semantic model + dependent resources with explicit unsupported surfaces.

**SB classification:** `ADAPT` for future SystemDefinition/Recipe/Definition/release revision workflows.

### P-APP06 — Foundry-hosted UI can be static while backend remains platform
Developer Console can host static frontend assets; server-side behavior remains Foundry/external services. This cleanly separates UI hosting from backend semantics but reinforces platform dependency for OSDK-backed behavior.

**SB classification:** `OPEN QUESTION` for Station hosting modes; not a client-runtime architecture model.

## Portability boundary

Public evidence supports:

```text
source/definitions -> Marketplace Product -> another Foundry enrollment
```

and external applications can be hosted outside Foundry while calling Foundry through OSDK/API.

Public evidence reviewed does **not** establish:

```text
Foundry-built operational application -> exported autonomous backend/runtime with no Foundry dependency
```

Therefore comparison with SB must say `NOT ESTABLISHED`, not `Palantir cannot do this`.

## Sources

Official Palantir docs accessed 2026-09-23: OSDK overview; OSDK React applications; Developer Console overview/hosting/Marketplace installation; SuperRepo overview/core concepts; Marketplace Foundry products/install product; Global Branching overview.