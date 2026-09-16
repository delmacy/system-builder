# WBS — 60 Client Delivery & Software Lifecycle Governance

## 60.0 Client Delivery & Software Lifecycle Governance

### 60.1 Kickoff, context and delivery authority
- **60.1.1** Definir `DeliveryContext` com objetivo, stakeholders, organization, jurisdiction, risk/criticality, deployment and contractual context.
- **60.1.2** Definir project/delivery authority, decision owners, approval boundaries e escalation routes.
- **60.1.3** Vincular kickoff/elicitation/requirements/BusinessRecipe ao delivery lifecycle sem duplicar suas autoridades.
- **60.1.4** Registrar assumptions, constraints, exclusions e unresolved blockers antes da materialização do plano.

### 60.2 Adaptive Delivery Profiles
- **60.2.1** Definir `DeliveryProfile` versionado e composable, com baseline `RAPID`, `STANDARD`, `ENTERPRISE` e `REGULATED`.
- **60.2.2** Permitir que contexto, risco, criticality, organization policy e RulePacks qualifiquem/adicionem gates e artefatos sem mutação silenciosa do perfil-base.
- **60.2.3** Separar mandatory lifecycle requirements de recommendations/advisories e optional practices.
- **60.2.4** Registrar profile resolution evidence e motivo de tailoring/deviation.

### 60.3 Decomposition, DAG and planning
- **60.3.1** Gerar client WBS a partir de requirements/deliverables/outcomes, não de cronograma arbitrário.
- **60.3.2** Construir typed dependency DAG antes de sequencing operacional.
- **60.3.3** Derivar milestones/waves a partir do DAG, readiness e integração esperada.
- **60.3.4** Derivar Work Packages como unidades controláveis de resultado integrado.
- **60.3.5** Tratar `Epic` como optional external/projection alias quando necessário, sem criar autoridade paralela ao Work Package.
- **60.3.6** Materializar Sprint/Task candidates apenas a partir de Work Packages dependency-safe e suficientemente definidos.
- **60.3.7** Derivar schedule forecast de DAG + estimates + capacity/WIP + calendars/constraints; cronograma não pode reescrever escopo/dependências.

### 60.4 Execution, verification and replanning governance
- **60.4.1** Definir Definition of Ready/Done e acceptance/evidence expectations conforme DeliveryProfile.
- **60.4.2** Vincular Tasks a implementation/test/evidence/review outputs verificáveis.
- **60.4.3** Reavaliar downstream plan quando requirement, dependency, risk, resource, architecture, RulePack ou evidence state mudar.
- **60.4.4** Preservar forecast versus committed work e impedir que previsão futura seja tratada como autorização executável.
- **60.4.5** Registrar change/replanning lineage e affected-object graph.

### 60.5 Standards and process RulePacks
- **60.5.1** Consumir capability 43 para resolver process/lifecycle RulePacks aplicáveis ao projeto.
- **60.5.2** Permitir rules que exijam review, approval, segregation, security/privacy/architecture testing, traceability, evidence, retention ou release gates.
- **60.5.3** Separar `ProductRulePack` de `DeliveryProcessRulePack`, permitindo relacionamento sem colapsar produto e processo.
- **60.5.4** Permitir advisory deviations, accepted exceptions e blocking process gates conforme enforcement policy explícita.
- **60.5.5** Produzir normative/process traceability `source -> applicability -> process requirement -> delivery control/gate -> task/test/evidence`.

### 60.6 Release, handoff and delivery dossier
- **60.6.1** Reconciliar requirements, WBS, Work Packages, Tasks, tests, findings, exceptions e release evidence antes do handoff.
- **60.6.2** Produzir `DeliveryDossier` reconstruível por reviewer independente sem depender de chat ou decisão não registrada.
- **60.6.3** Registrar residual risks, normative debt, technical debt e deferred work com owner/reason/review trigger quando aplicável.
- **60.6.4** Preservar lineage entre release/deployment e o plano/evidência que o qualificou.
- **60.6.5** Alimentar support/evolution com backlog e impact context sem transformar backlog futuro em promessa ou autorização automática.
