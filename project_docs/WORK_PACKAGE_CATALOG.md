# Work Package Catalog — Baseline pré-cronograma

Este catálogo define famílias de Work Packages. IDs concretos de execução são elaborados a partir dos L3/L4 quando o respectivo ramo estiver próximo de NOW, sempre sob a cadência vigente em `project_docs/schedule/SPRINT_GENERATION_POLICY.md`.

## WP-F01 Knowledge capture
Predecessors: semantics/evidence hooks. Outputs: ProcessMirror contracts, capture/validation artifacts.

## WP-F02 Business formalization
Predecessor: F01. Outputs: BusinessRecipe contracts, approval boundaries, rules/policies/process representation.

## WP-F03 Analysis & system definition
Predecessor: F02. Outputs: SystemAnalysis + SystemDefinition, gap/capability requirements.

## WP-F04 Catalog & capability contracts
Predecessor: F03 contracts; parallelizable after stable interfaces. Outputs: manifests, registry semantics, version identities.

## WP-F05 Assembly & validation
Predecessors: F03/F04. Outputs: AssemblyPlan, dependency resolution, validation evidence.

## WP-F06 Compiler/release/deploy
Predecessor: F05. Outputs: deterministic artifact, provenance, release and environment/deployment records.

## WP-R01 Runtime identity/security minimum
Outputs: Subject/User/Organization identity first; credentials/session/authentication second; authorization third. Predecessor for actor-aware runtime capabilities.

## WP-R02 Action/policy execution
Predecessors: R01 contracts + runtime core. Outputs: action and policy decision contracts/execution.

## WP-R03 Workflow/time
Predecessors: R01, R02, scheduler/time contracts. Outputs: state transitions, waits/timers/deadlines, human handoffs.

## WP-R04 Files/documents/evidence
Predecessors: storage abstraction + identity/audit hooks. Outputs: file refs, document/evidence lifecycle.

## WP-R05 Events/audit/notifications/integrations
Predecessors: identity/event contracts; branches can proceed in parallel. Outputs: auditable integration surfaces.

## WP-R06 Data/reporting/indicators
Predecessors: stable runtime data/events. Outputs: operational queries, indicators and Observe feed.

## WP-X01 Cross-cutting architecture hooks
Evidence/provenance, versioning, semantic identity, knowledge boundary, deterministic/human/probabilistic classification, contract evolution, architecture fitness.

## WP-L01 Observe/support/evolution loop
Predecessors: deployed runtime + events/audit. Outputs: technical/business telemetry, support classification, evolution feedback.

## WP-Q01 Verification/certification
Predecessors: vertical factory path. Outputs: end-to-end proof, autonomous-runtime proof, portability/compatibility evidence.

## Decomposition rule
Cada família permanece Planning Package até seu predecessor imediato estar estável. Ao ser promovida para o forecast próximo, seus L3 são revisados contra a implementação já integrada; itens já entregues viram predecessor evidence e não são planejados novamente.

Interfaces/acceptance/riscos independentes podem produzir Work Packages concretos separados. Cada novo Work Package concreto usa por padrão:

`Planning & Materialization -> Construction A -> Construction B -> [optional Construction C] -> Package Integration & Review -> Documentation & Closure`.

Tasks só nascem depois que a Planning Sprint do Work Package confirma gaps/readiness a partir de `main` fresco. Um Work Package forecast não materializa TASKs e não concede execução.
