# G4 Palantir Architecture Benchmark — First Pass

Date: 2026-09-23
Status: RESEARCH ACTIVE / NON-EXECUTABLE
Scope: public architecture benchmark only
Authority: evidence source for G4 research; not implementation authority

## Purpose

Study Palantir Foundry, Ontology, AIP and Apollo as a public architectural benchmark for System Builder (SB). The goal is not product imitation. It is to identify transferable primitives, documented trade-offs, platform assumptions, failure semantics and architectural gaps that may strengthen or challenge SB decisions.

This pass intentionally distinguishes:

- Palantir public documentation from inference;
- implemented Palantir capabilities from SB design intent;
- transferable principle from platform-specific mechanism;
- similarity from equivalence;
- broader SB target scope from actual implementation maturity.

## First-pass architecture map

Public documentation supports the following simplified map:

```text
Palantir ecosystem
├── Foundry
│   ├── data integration / lineage / branching
│   ├── Ontology
│   │   ├── objects / links / interfaces
│   │   ├── functions / logic
│   │   ├── actions / writeback / automations
│   │   └── security / permissions
│   ├── Workshop / Slate / custom apps
│   ├── OSDK / REST APIs / Developer Console
│   └── Pilot / application generation
├── AIP
│   ├── Logic
│   ├── Chatbot/agent-style tools
│   ├── model access / evaluation
│   └── tool execution under platform permissions
└── Apollo
    ├── Hub
    ├── Spoke Environments
    ├── Agents
    ├── Plans / constraints
    ├── Reported State
    ├── Release Channels
    └── disconnected/intermittent operation
```

## Strong architectural parallels with SB

### 1. Ontology as operational semantic core — ADAPT / ALREADY COVERED

Palantir's Ontology is explicitly more than a thin semantic layer: it combines data, logic, action and security, with objects/links as semantic primitives and actions/functions as kinetic primitives.

SB already converges on a broader semantic substrate with entities, domains, actions, policies, workflows, authority, evidence and revisions. The transferable principle is not to copy the Ontology model but to preserve a single explicit semantic vocabulary that applications, humans and AI can consume without making presentation surfaces canonical owners.

Relevant public sources:
- https://www.palantir.com/docs/foundry/architecture-center/ontology-system
- https://www.palantir.com/docs/foundry/ontology/core-concepts
- https://www.palantir.com/docs/foundry/object-backend/overview

### 2. Actions as governed mutation boundary — ADOPT PRINCIPLE

Palantir recommends action-mediated edits for consistent governance. Action submission criteria, permissions and transactional Ontology edits are separated from presentation.

This strongly reinforces the SB invariant:

```text
Button != Domain Command
Surface != Authority
Station intent -> Core authority/domain decision -> effect
```

Public documentation also exposes a material edge case: Ontology ACID semantics do not cover arbitrary external side effects. Palantir distinguishes writeback webhooks from post-edit side effects and explicitly notes that an external request may succeed while a later Ontology change fails.

This is directly relevant to SB's existing UNKNOWN/reconciliation/effect-settlement research.

Sources:
- https://www.palantir.com/docs/foundry/action-types/permissions
- https://www.palantir.com/docs/foundry/action-types/consistency-guarantees
- https://www.palantir.com/docs/foundry/action-types/webhooks

### 3. Apollo Hub -> Plan -> Agent -> Reported State — ADAPT

Apollo documents a Hub/Spoke model where Agents execute Plans and report current state. Agents initiate encrypted outbound-only communication from managed environments, and each environment receives a distinct cryptographic identity.

This is a highly relevant benchmark for the emerging SB model:

```text
SB Core
  -> desired operation / command
  -> Host Agent
  -> local provider / OS
  -> observed/reported state
  -> Core
```

Transferable principles:
- outbound-only agent connectivity by default;
- per-host/environment identity;
- command/plan separate from reported/effective state;
- host registration/enrollment as an explicit lifecycle;
- agent failure must not imply workload/runtime failure;
- intermittent/disconnected operation must be first-class rather than treated as an impossible state.

Do not copy Apollo's Kubernetes/Helm assumptions. SB Agent should remain capability/provider based and host-neutral.

Sources:
- https://www.palantir.com/docs/apollo/core/agents
- https://www.palantir.com/docs/apollo/core/environments
- https://www.palantir.com/docs/apollo/managing-environments/environment-connection-settings

### 4. Desired vs Reported and operational constraints — ADOPT PRINCIPLE

Apollo tracks reported state, plans, maintenance windows, suppression windows and constraints before changes are executed.

This reinforces SB's existing separation:

```text
Desired != Observed != Effective
Provider ACK != Effective State
Healthy != Ready != Effective
```

Apollo's constraints are useful evidence for an SB future Host/Deployment Plan admission model, but SB should keep constraint semantics owner-scoped rather than centralizing unrelated business authority in infrastructure orchestration.

Sources:
- https://www.palantir.com/docs/apollo/core/plans-and-constraints
- https://www.palantir.com/docs/apollo/core/release-channels
- https://www.palantir.com/docs/apollo/managing-environments/suppression-windows-and-cancelling-plans/index.html

### 5. Branching across data/ontology/application lifecycle — ADAPT

Foundry uses branching/proposals for datasets and Ontology evolution. Pilot also uses branch-scoped ontology generation before promotion to main.

This is useful for SB's editable candidate -> review -> validated/published progression and supports preserving draft/candidate state independently from canonical production state.

Important difference: SB should bind revisions across BusinessRecipe, SystemDefinition, capabilities, release artifacts and autonomous runtime lineage rather than adopting a single platform-native branch abstraction everywhere.

Sources:
- https://www.palantir.com/docs/foundry/data-integration/branching
- https://www.palantir.com/docs/foundry/ontologies/branching-ontology
- https://www.palantir.com/docs/foundry/pilot/deploy-an-application

### 6. AI tool calling under permissions — ADOPT PRINCIPLE / ALREADY COVERED

AIP Logic states that LLMs do not directly execute tools; they request tools and AIP executes those calls under permission controls. Palantir also supports deterministic action blocks outside the LLM path and systematic AIP evaluations.

This closely aligns with SB's existing rule:

```text
AI interprets / proposes
contracts formalize
authority validates
engines execute
```

SB should preserve the stronger invariant that AI inference is a candidate and never silently becomes canonical authority.

Sources:
- https://www.palantir.com/docs/foundry/logic/blocks
- https://www.palantir.com/docs/foundry/logic
- https://www.palantir.com/docs/foundry/aip-evals/create-suite

## Important differences / candidate SB advantages in architecture intent

These are not claims of product superiority. They are differences between public Palantir architecture and SB's explicit target rules.

### A. Runtime independence / anti-lock-in — SB TARGET IS STRONGER

Palantir custom applications may be hosted outside Foundry and can use REST APIs or OSDK from other runtimes, but their documented operational backend remains Foundry/Ontology. Pilot-generated production applications are configured against Developer Console/OAuth and operate on live data through the Ontology.

SuperRepo/Marketplace portability is described across Foundry enrollments; public docs do not establish equivalent portability of a complete generated business system that can leave Palantir and continue independently without a Foundry runtime/backend.

SB's target is different:

```text
Builder may disappear
published client runtime continues
client may internalize/operate system independently
```

This should remain a constitutional differentiator and must be proven by artifact/runtime tests, not marketing language.

Sources:
- https://www.palantir.com/docs/foundry/app-building/overview
- https://www.palantir.com/docs/foundry/developer-console/overview
- https://www.palantir.com/docs/foundry/developer-console/deploy-custom-application-on-foundry
- https://www.palantir.com/docs/foundry/pilot/overview
- https://www.palantir.com/docs/foundry/superrepo/core-concepts

### B. Business elicitation / process mirroring -> generated system — SB TARGET APPEARS BROADER

Palantir publicly documents ontology creation, operational application building and prompt-driven app generation. This first pass did not find a publicly documented equivalent to SB's intended full chain:

```text
real business
-> elicitation
-> process mirroring
-> Business Recipe
-> human validation
-> SystemDefinition
-> capability resolution
-> assembly/compiler
-> portable release artifact
-> autonomous runtime
```

Pilot can generate ontology entities, design and frontend from prompts, but its documented destination remains an OSDK/Foundry application.

This is a research gap to confirm, not a final conclusion.

### C. Builder as software factory vs platform as operational substrate — DIFFERENT CENTER OF GRAVITY

Palantir's public architecture treats Ontology/Foundry as the enduring operational substrate for applications, workflows and agents.

SB's intended center is a factory/control plane that produces autonomous systems. This means SB must solve harder export/closure problems:
- dependency closure;
- generated runtime identity;
- semantic snapshot pinning;
- provider substitution;
- migration away from Builder;
- standalone auth/data/workflow/storage operation;
- support/evolution without mandatory Builder availability.

If SB cannot prove these, the claimed differentiation disappears.

### D. Host Agent scope — SB SHOULD GENERALIZE, NOT COPY APOLLO

Apollo Entities publicly focus on Helm charts and Assets and examples center on Kubernetes environments.

SB Host Agent should operate at a broader host capability layer:
- Windows services / Linux systemd;
- containers;
- processes;
- filesystem;
- certificates;
- network;
- storage;
- local databases;
- hardware/peripherals where allowed;
- arbitrary provider adapters.

This broader target increases complexity and attack surface. It requires stronger capability manifests, least privilege, host policy and explicit effect boundaries.

## Areas where Palantir currently appears stronger/more mature than SB

This comparison is implementation maturity, not architecture breadth.

1. Operational semantic layer already deployed at enterprise scale.
2. Unified action/security model across applications.
3. Mature branching/proposal/review workflows.
4. Hub/Spoke/Agent deployment lifecycle and disconnected-environment semantics.
5. Release channels, maintenance windows, constraints and suppressions.
6. Rich application-building spectrum: no-code, low-code, React/OSDK, external apps.
7. AI tooling tied into semantic objects/actions and evaluation.
8. Integrated lineage/governance/security in an operational platform.
9. Marketplace/product packaging and multi-enrollment delivery.
10. Extensive failure-mode documentation around external effects, concurrency and branching.

SB should use these as proof targets rather than imitate UI/products.

## Palantir public limitations / trade-offs relevant to SB

### External effects are not globally transactional

Palantir explicitly documents that external write may succeed while Ontology mutation subsequently fails, and side effects can run after users observe a successful Ontology edit.

Transferable lesson: SB needs explicit effect identity, UNKNOWN/reconciliation and compensation policies rather than pretending one transaction can span arbitrary systems.

### Some permission/security features remain evolving/beta

Public docs identify limitations such as interface-action restrictions and beta read/write authorizations. This is evidence that broad semantic polymorphism plus fine-grained authority is difficult in practice.

Transferable lesson: do not let SB interface/capability abstraction outrun its authority semantics.

### Portability is primarily platform-to-platform

Marketplace/Foundry products are described as portable across Foundry enrollments. That is useful portability, but it is not equivalent to platform-independent runtime autonomy.

Transferable lesson: SB should explicitly test `portable across SB deployments` and `operational without SB` as separate properties.

### Apollo's product/environment model is not a general business semantic model

Apollo is strong at software delivery/operations; Ontology is strong at enterprise operations. The public architecture is a suite of powerful layers, not necessarily one compile pipeline from business understanding to standalone generated runtime.

This is where SB's integrated factory pipeline may remain distinct if implemented.

## Candidate transferable pattern register

| Pattern | SB disposition | Reason |
|---|---|---|
| Hub/Spoke + outbound-only Agent | ADAPT | excellent Host Agent security/topology baseline |
| Per-environment agent identity | ADOPT PRINCIPLE | strong enrollment/trust primitive |
| Plan separate from Reported State | ADOPT PRINCIPLE | reinforces desired/observed/effective |
| Release Channels | ADAPT | useful promotion abstraction |
| Maintenance/Suppression constraints | ADAPT | useful deployment admission semantics |
| Ontology actions as governed write boundary | ADOPT PRINCIPLE | maps to Commands/Actions/Authority |
| Ontology as data+logic+action+security | ADAPT | valuable completeness test for SB semantic substrate |
| Global Branching/proposals | ADAPT | useful semantic change/governance benchmark |
| OSDK generated from selected semantic subset | ADAPT | candidate for generated client/tool SDKs |
| AI requests tools; platform executes | ADOPT PRINCIPLE | already consistent with SB AI boundary |
| AIP Evals | ADAPT | candidate AI product-proof methodology |
| Marketplace portable across enrollments | ADAPT | benchmark for package/product portability, insufficient for SB autonomy |
| Foundry as permanent backend for generated apps | AVOID AS CONSTITUTIONAL DEFAULT | conflicts with SB autonomous-runtime/anti-lock-in objective |

## High-value gaps for next cycles

1. Apollo Plan state machine, retries, rollback, partial rollout and version skew.
2. Agent enrollment/revocation/rotation/upgrade and compromised-agent recovery.
3. Disconnected/air-gapped bundle semantics and stale-policy limits.
4. Ontology interfaces/polymorphism vs SB capability/domain/type system.
5. Action transaction/concurrency/retry semantics vs SB effect model.
6. Ontology lineage/currentness/provenance compared with SB evidence model.
7. AIP human review, evaluation, tool approval and agent memory semantics.
8. Pilot/SuperRepo generated artifact ownership and source-code export boundaries.
9. Marketplace dependency resolution/version compatibility.
10. Process/business elicitation capabilities: confirm presence or absence of a BusinessRecipe-like layer.
11. Multi-tenant/organization isolation and cross-enrollment federation.
12. Cost/resource governance and capacity orchestration.
13. Publicly documented restore/DR/failover semantics for Foundry/Apollo control planes.
14. Precise conditions under which applications/workloads continue during Foundry/Apollo outages.

## First-pass conclusion

Palantir is currently the closest public architectural benchmark found for the combined SB ambition. Several SB ideas have strong analogues: semantic/kinetic enterprise model, governed actions, AI tool boundaries, distributed control-plane agents, reported state, release channels and branch-governed evolution.

The strongest apparent SB distinction is not feature count. It is the intended transformation:

```text
business understanding
-> formal system definition
-> capability composition
-> generated release
-> autonomous portable runtime
```

Palantir's public architecture instead centers Foundry/Ontology as the persistent operational substrate.

This distinction is valuable only if SB eventually proves independent runtime closure, migration/export and continued operation without the Builder.
