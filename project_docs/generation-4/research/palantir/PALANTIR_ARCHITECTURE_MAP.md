# Palantir Public Architecture Map

Date: 2026-09-23
Status: `RESEARCH / PUBLIC-DOC EVIDENCE`

## Public stack

Palantir's Architecture Center describes the Ontology as the architectural heart integrating **data, logic, action and security** for humans and AI agents. It explicitly rejects the characterization of Ontology as only a thin semantic layer and describes three conceptual parts: Language, Engine and Toolchain.

```text
external operational/data systems
            |
        Foundry data plane
            |
          Ontology
  data + logic + action + security
            |
 applications / workflows / automations / AI
            |
     Foundry / AIP toolchain

software delivery plane:
products/releases -> Apollo Hub -> Plans -> Spoke Agents -> managed entities
                                      <- Reported State -
```

## Structural observations

1. **Ontology is operational, not merely descriptive.** Objects/links model nouns; actions/functions/automations provide verbs and logic; security is evaluated as part of interaction.
2. **Application development is ontology-centered.** OSDK explicitly encourages applications to treat Foundry as their backend. React, Python, Java and OpenAPI clients can consume Ontology APIs.
3. **Pro-code is converging around a monorepo.** SuperRepo (beta) co-locates Ontology-as-code, functions, generated SDK and frontend and packages them for Foundry Marketplace delivery.
4. **Deployment control is separated from application semantics.** Apollo operates Products/Releases/Entities/Environments using Plans, Constraints, Agents and Reported State.
5. **Remote execution is agent-mediated.** Apollo Agents poll outbound, execute Plans and report state. Data Connection has a distinct downloadable agent family for private-source connectivity/worker execution.
6. **Cross-resource development has an explicit branch model.** Global Branching provides isolated multi-application changes and proposal/merge workflows, though public docs identify feature-specific limitations.

## Relationship to SB

The strongest structural overlap is not a one-to-one product mapping but the decomposition into semantic operational model + applications/AI + deployment control plane. SB differs constitutionally because its canonical pipeline begins before the software model (`REAL BUSINESS -> ELICITATION -> PROCESS MIRRORING -> BUSINESS RECIPE`) and is intended to end in a release whose client runtime remains operational without Builder availability.

A useful bounded analogy is:

```text
Palantir Ontology       ~ one mature reference for an operational semantic substrate
Apollo Hub/Agent        ~ one mature reference for control-plane/remote-executor separation
OSDK/SuperRepo          ~ one mature reference for semantic-model-driven application development
Marketplace/DevOps      ~ one mature reference for packaged cross-environment delivery
```

None of these analogies establishes semantic equivalence to SB Capability, SystemDefinition, Compiler, ReleaseArtifact, Core, Station or Host Agent.

## Key divergence hypothesis

Public OSDK documentation says applications treat Foundry as backend. Marketplace Foundry products are portable across Foundry enrollments, and SuperRepo deploys through Marketplace. This is strong **within-platform portability**, but public evidence reviewed so far does not establish an equivalent to SB's constitutional requirement that a generated client runtime continue operating independently when the Builder/control platform is unavailable.

Classification: `ADAPT`, with the runtime-independence difference preserved as a proof obligation rather than marketing claim.

## Primary sources

- Palantir Architecture Center — Overview and Ontology system, accessed 2026-09-23.
- Palantir Ontology SDK — Overview, accessed 2026-09-23.
- Palantir SuperRepo — Overview/Core concepts, accessed 2026-09-23.
- Palantir Apollo — How Apollo works / Agents / Environments, accessed 2026-09-23.
- Palantir Global Branching — Overview, accessed 2026-09-23.