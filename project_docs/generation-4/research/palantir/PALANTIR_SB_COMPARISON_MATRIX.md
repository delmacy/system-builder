# Palantir / System Builder Bounded Comparison Matrix

Date: 2026-09-23
Status: `RESEARCH / NON-COMPETITIVE-CLAIM`

This matrix compares publicly documented mechanisms with current SB repository architecture. It does not rank products and does not infer undocumented Palantir behavior.

| Concern | Public Palantir evidence | SB repository direction | Research disposition |
|---|---|---|---|
| Business understanding | Ontology represents operational world/decisions; Machinery/process tooling exists | Explicit Elicitation -> ProcessMirror -> approved technology-independent BusinessRecipe | `OPEN QUESTION`: determine how far Palantir public tooling covers pre-model elicitation/approval semantics |
| Semantic operational model | Ontology integrates data, logic, action, security | SystemDefinition + semantic/capability/action/authority contracts; BusinessRecipe remains separate | `ADAPT`, do not collapse Recipe into runtime ontology |
| Polymorphism | Interfaces with property/link/action constraints and mappings | Capability/contracts/providers with multidimensional compatibility | `ADAPT`; SB requires stronger guarantee semantics |
| Application development | Workshop/Developer Console/OSDK/React/Pilot/SuperRepo | Station apps/studios/tools plus generated client UI/runtime | `ADAPT`; preserve Station != client runtime |
| AI | AIP Logic/Pilot with scoped execution/evals and governed Ontology interaction | AI candidate, contracts formalize, deterministic engines execute | `ALREADY COVERED`, benchmark maturity |
| Remote deployment | Apollo Hub -> Plans -> Spoke Agents -> managed Entities | Core -> qualified plan/authority -> Host Agent/providers -> hosts/runtimes hypothesis | `ADOPT PRINCIPLE`, not topology copy |
| Observed state | Agent Reported State: version/config/liveness/readiness | Desired/Observed/Effective/Currentness/Evidence separated | `ALREADY COVERED` |
| Disconnected operation | Connected/Intermittent/No connection expected/Relayed modes | Autonomous runtime + bounded offline security/currentness + reconciliation | `ADAPT`; SB has broader semantic/security proof ambitions |
| Release safety | channels, constraints, ramped rollout, health promotion, recall, rollback plans | immutable release/provenance; deployment/evidence research | `ADAPT`, major maturity benchmark |
| Packaging | Marketplace products, dependency graph, linked products, inputs/outputs | AssemblyPlan/ReleaseArtifact/capability closure | `ADOPT PRINCIPLE` |
| Cross-resource change | Global Branching and proposals | versioned Recipe/Definition/system evolution; future Station workflow | `ADAPT` |
| Data connectivity | Data Connection sources, agents, sync, webhooks/writeback | provider/adapters, compatibility-first legacy integration | `ADAPT` |
| External effects | webhook/writeback/side-effect mechanisms | explicit effect identity, UNKNOWN/reconcile, ACK != effective | `ALREADY COVERED`; use Palantir cases as adversarial evidence |
| Runtime autonomy from builder | OSDK docs frame Foundry as backend; Marketplace portability across Foundry enrollments | constitutional: published runtime operates when SB unavailable | `FUNDAMENTAL DIFFERENCE / PUBLIC EVIDENCE`; Palantir equivalent not established |
| Anti-lock-in | broad APIs/SDKs/OpenAPI/external hosting/interoperability; platform-centric Ontology backend | contracts/data/artifacts portable; suite modules replaceable; runtime autonomous | `DIFFERENT EMPHASIS`; research actual export/exit boundaries |
| Host breadth | Apollo Spokes publicly Kubernetes-oriented; separate Data Connection agents | Host Agent hypothesis spans Windows/Linux/VPS/workstation/container/K8s providers | `OPEN QUESTION`; avoid `Host = Kubernetes` assumption |

## Fundamental non-equivalences to preserve

1. `Ontology != BusinessRecipe`. Recipe is approved technology-independent business knowledge.
2. `Apollo Agent != automatically SB Host Agent`. The authority, provider and host-scope contracts differ.
3. `OSDK application != generated autonomous client runtime`.
4. `Marketplace Product != automatically SB ReleaseArtifact`; SB artifact closure includes runtime autonomy/provenance requirements.
5. `Palantir Interface != SB Capability Contract`; SB compatibility is intentionally multidimensional.
6. `Reported healthy != semantically Effective`; health is one evidence dimension.

## Current conclusion

Palantir is a high-value architectural benchmark because its public platform industrializes several problem classes SB is researching: operational semantic models, governed human+AI actions, remote agents, staged release orchestration, cross-resource application development and enterprise integration. The strongest apparent SB divergence is the constitutional pipeline extending from pre-software business knowledge to an independently operable client runtime. That divergence remains a design/proof target for SB, not a demonstrated product superiority claim.