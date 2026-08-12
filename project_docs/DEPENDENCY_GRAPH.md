# Dependency Graph — baseline de precedência

Este grafo é de escopo/capability, não cronograma. Ele será refinado até Work Package antes da criação de sprints.

## Backbone da fábrica
`35 Ontology/Semantics` → `13 Evidence/Provenance` → `01 Process Mirror` → `02 Business Recipe` → `03 System Analysis` → `04 System Design` → `05 Catalog` → `06 Assembly` → `07 Validation` → `08 Compiler` → `09 Release` → `10 Deploy` → `11 Observe` → `12 Support/Evolution`.

Relações importantes: 14 Process Versioning atravessa 01–12; 15 Deterministic/Human/Probabilistic Boundary atravessa 02–12; 19 Knowledge Boundary restringe 01/02/05/17; 36 Contract Evolution governa contratos produzidos ao longo da cadeia; 37 Dependency/Impact Graph consome identidades e lineage de 13/14/36; 38 Digital Thread conecta Evidence→Recipe→Definition→Release→Runtime.

## Runtime foundation
`30 Identity/Organization/Authorization` → `21 Workflow Engine`, `23 Policy/Rule Engine`, `28 Audit Trail` e qualquer capability que exija actor/authority.

`34 Scheduler/Time` → timers/deadlines de `21 Workflow Engine`, notificações temporais de `31 Notifications`, validade de `24 Document/Evidence Engine`.

`33 Files/Object Storage` → documentos/binários de `24 Document/Evidence Engine`.

`22 Action Engine` + `23 Policy/Rule Engine` + `30 Identity` + `34 Scheduler/Time` → execução completa de `21 Workflow Engine`.

`26 Integration Layer` depende de contracts/identity/security mínimos e é consumido por actions, workflows e sistemas gerados.

`29 Data/Reporting/Indicators` depende dos modelos de dados/eventos do runtime e alimenta `11 Observe` e `16 Process Economics`.

## Factory assurance
`07 Validation` → `08 Compiler` → `09 Release` → `10 Deploy`.

`45 Test Generation/Verification Lab` → amplia 07 Validation.
`46 Runtime Compatibility Certification` requer 08/09 e valida autonomia do runtime.
`47 Disaster Recovery/Continuity` requer runtime/deployment/storage maduros.
`42 Security/Trust Plane` atravessa compiler, release, deploy, runtime, integrations e extensions.

## Reuse and ecosystem
`05 Catalog` + `25 Capability Registry/SDK` + `36 Contract Evolution` → `48 Extension/Plugin Ecosystem`.

`19 Knowledge Boundary` + `20 Process Versioning` + catálogos → `54 Knowledge Feedback/Pattern Promotion`.

`49 Multi-organization/Federation` requer 30 Identity/Organization/Authorization maduro.
`50 Localization/Jurisdiction` informa policy, time, documents, reporting e federation.

## Intelligence/learning
`11 Observe` + `29 Data/Reporting` + `16 Process Economics` → `39 Simulation/What-if`, `40 Process Mining/Conformance`, `41 Decision Intelligence`.

`39/40/41` + dados confiáveis → `42 Optimization Engine` quando aplicável; optimization nunca recebe autoridade humana implícita.

`17 Experiment/Improvement` consome Observe/Analysis e retroalimenta Recipe/Analysis.

## Factory management
`55 Architecture Fitness Functions` protege invariantes desde cedo.
`56 Platform Self-Observation/Factory Observatory` depende do Agent Engineering/harness e métricas da fábrica.
`57 Factory Economics/Reuse Metrics` depende de releases, catalog/reuse e observabilidade da fábrica.
`58 Governance of Change` governa baseline, contracts, architecture e mudanças.
`59 System Builder Self-Hosting` é tardio: requer pipeline ponta a ponta e runtime autônomo suficientemente maduros.

## Regra de identidade antes de autenticação
Qualquer implementação futura de Auth deve ter predecessor explícito no modelo mínimo de `30 Identity/Organization/Authorization`: `Subject/User identity → credential/session/authentication → authorization`. Isso evita construir autenticação sem entidade/identidade estável.
