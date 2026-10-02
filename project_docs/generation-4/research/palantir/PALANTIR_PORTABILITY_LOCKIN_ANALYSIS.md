# Palantir Portability / Lock-in Analysis

Date: 2026-09-23
Status: `RESEARCH / PUBLIC-DOC EVIDENCE`

## Do not use a binary open/closed label

Public documentation shows meaningful interoperability: OSDK in multiple languages, OpenAPI generation, applications hosted outside Foundry, external compute/integrations, Data Connection, webhooks, Marketplace portability across Foundry enrollments, and SuperRepo code hosted where teams choose with their own CI/CD.

At the same time, OSDK documentation explicitly encourages treating Foundry as backend, and SuperRepo/Marketplace artifacts materialize into Foundry platform resources. Therefore portability must be decomposed by dimension.

## Portability dimensions

### Source portability
**Evidence:** SuperRepo code can be hosted in a repository chosen by the team; CLI/CI integration is supported.
**Assessment:** materially portable source workflow.

### Client/API portability
**Evidence:** TypeScript/Python/Java OSDK plus OpenAPI.
**Assessment:** broad client access, but generated semantics remain coupled to Foundry Ontology APIs.

### UI hosting portability
**Evidence:** OSDK apps may be externally hosted; Foundry hosting is optional for supported static apps.
**Assessment:** UI hosting can be external while backend dependency remains.

### Package/environment portability
**Evidence:** Foundry Products are described as deployable across Foundry enrollments; Marketplace handles dependency/input installation.
**Assessment:** strong within-platform portability.

### Semantic identity portability
**Evidence:** OSDK references Ontology entities by API name; Marketplace docs warn name remapping/conflicts can break apps.
**Assessment:** documented coupling hazard. Stable semantic identity and explicit binding/remapping are preferable for SB.

### Runtime/backend independence
**Evidence:** reviewed public OSDK docs describe Foundry as backend. No reviewed source establishes export of an Ontology-backed operational application as a fully independent equivalent backend/runtime.
**Assessment:** `NOT ESTABLISHED` outside platform. Do not infer impossibility.

## SB implications

SB's anti-lock-in requirement should be proven independently across:

1. **Business knowledge:** Recipe export remains meaningful without SB.
2. **System definition:** canonical definition has stable schemas/contracts and migrations.
3. **Source:** generated/custom source belongs to client and can build outside SB.
4. **Artifacts:** release can be verified and deployed without live Builder.
5. **Data:** documented/open export and migration path.
6. **Runtime:** published system continues when Builder/Core/Station are unavailable.
7. **Operations:** third-party observability/deployment tools can replace SB suite components where contracts allow.
8. **Identity/binding:** semantic identity does not depend on mutable provider/API display names.

A product is not anti-lock-in merely because source is visible or APIs are open. Conversely, platform dependency in one dimension does not imply every dimension is closed.

## Failure patterns to import into SB research

- package installs but semantic API names drift;
- generated SDK compiles against a different semantic revision than runtime;
- UI is externally hosted but backend exit remains impossible;
- product is portable between platform environments but not outside the platform;
- dependency graph references existing external products that are not lifecycle-owned by the installation;
- interface substitution passes structural mapping but changes permission/side-effect semantics.

## Classification

Overall: `ADAPT / AVOID SPECIFIC COUPLINGS`.

The useful lesson is to make portability a tested guarantee vector rather than a branding claim.

## Sources

Official Palantir docs accessed 2026-09-23: OSDK overview; Developer Console application/hosting/Marketplace installation; SuperRepo overview/core concepts; Marketplace Foundry Products/install product; Interfaces documentation.