# Changelog editorial — Livro técnico-conceitual da Generation 2

Este histórico registra versões do **texto editorial**. `ChapterVersion != ArchitectureRevision != SystemRevision`.

## 2026-09-05

### CHAPTER_17 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-05.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial após Commercial/FinOps e necessidade de estabelecer um vocabulário didático comum para famílias de teste antes dos capítulos de concorrência, conflitos semânticos e técnicas adversariais.
- **Resumo:** publicado o capítulo que explica teste como pergunta contextualizada e distingue happy path, boundary case, edge case, invalid-input case, failure/partial-failure, concurrency/race, version-skew, misuse/abuse, adversarial case, property/invariant, negative test, negative-space, conflict case, regression, conformance, differential, recovery e scale/resource-exhaustion. O texto separa famílias de cenário de técnicas de exploração, preserva `TestPass != universal proof`, `Signal != ConfirmedConflict`, explicita a relação entre teste, evidence/currentness e coverage, e conecta o vocabulário à campanha adversarial sem transformar o livro em log de pesquisa.
- **Artefatos autoritativos relacionados:** `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `EDGE_CASE_INDEX.md`.

### CHAPTER_16 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-05.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial após segurança/recovery e necessidade de separar a cadeia comercial de uso/entitlement/rating/billing/payment da governança econômica interna de tecnologia/FinOps, evitando colapsar customer price, provider evidence, internal cost e statutory accounting.
- **Resumo:** publicado o capítulo que explica `metering != entitlement != rating != billing != payment`, `entitled != authorized`, usage evidence qualificada, revisão de pricing/rating, charge lineage, billing periods, settlement e `UNKNOWN → reconcile-before-retry`; separa customer-commercial truth de Technology Economic Governance/FinOps e desenvolve economic normalization, allocation/conservation versus attribution, budget versus forecast, commitment exposure, unit economics, showback versus internal chargeback versus customer billing, provider substitution/residual commercial-economic cohorts, correction/supersession e IA/low-code sem amplificação. O texto distingue explicitamente essas fronteiras da situação atual do SB, em que ambos os canonical owners ainda não estão implementados e apenas primitives adjacentes são evidenciadas.
- **Artefatos autoritativos relacionados:** `RESEARCH_PIPELINE_STATE.json`, `PLANNING_A_COMMERCIAL_METERING_ENTITLEMENTS_RATING_BILLING_PAYMENT_BOUNDARIES.md`, `PLANNING_B_COMMERCIAL_METERING_ENTITLEMENTS_RATING_BILLING_PAYMENT_SB_CURRENT_STATE.md`, `PLANNING_A_TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_BOUNDARIES.md`, `PLANNING_B_TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_SB_CURRENT_STATE.md`, `COMMERCIAL_METERING_ENTITLEMENTS_RATING_BILLING_PAYMENT_FULL_PASS_3_REVISIT.md`, `TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_FULL_PASS_3_REVISIT.md`.

### CHAPTER_15 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-05.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial após observabilidade/operação e necessidade de explicar por que disponibilidade, trust, possession de secrets, integridade, recovery e return-to-service são fatos distintos que precisam ser qualificados em conjunto sem colapsar seus semantic owners.
- **Resumo:** publicado o capítulo que separa Security/Resilience, Enterprise Trust/PKI, Secrets/Configuration, Identity, Authorization e Observability; explica trust domains, PKI, chain/hostname/currentness, emissão versus consumer-effective adoption, secret reference versus value/possession, rotation e residual credential cohorts, bootstrap, failure versus compromise, containment/fencing e split-brain, RPO/RTO, recovery-point/path qualification, `UNKNOWN → reconcile-before-retry`, restoration versus return-to-service e reprotection. O texto distingue explicitamente a fundação atual do SB — PostgreSQL positive TLS verification, EnvironmentProfile/SecretResolver, deployment CAS/last-known-good e A→B→A continuity — das semânticas G2 ainda não generalizadas.
- **Artefatos autoritativos relacionados:** `RESEARCH_PIPELINE_STATE.json`, `PLANNING_A_ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_BOUNDARIES.md`, `PLANNING_B_ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_SB_CURRENT_STATE.md`, `PLANNING_A_SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_BOUNDARIES.md`, `PLANNING_B_SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_SB_CURRENT_STATE.md`, `PLANNING_A_SECURITY_RESILIENCE_FAILURE_RECOVERY_BOUNDARIES.md`, `PLANNING_B_SECURITY_RESILIENCE_FAILURE_RECOVERY_SB_CURRENT_STATE.md`.

### CHAPTER_14 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-05.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial após lifecycle/versioning e necessidade de explicar como o SB pode produzir e qualificar evidência operacional sem transformar telemetry, dashboards, alerts ou incident records em verdade canônica dos semantic owners observados.
- **Resumo:** publicado o capítulo que separa signal, telemetry, qualified evidence e operational assessment; explica canonical evidence identity versus provider IDs, freshness/currentness/coverage, `INCONCLUSIVE`, sampling/cardinality/truncation, correlação versus causalidade, SLI/SLO, alert versus incident, acknowledgement versus condition resolution, remediation coordination sem amplificação de autoridade, incident timeline e correction/supersession, relação com desired/observed/effective deployment state e Architecture Reconciliation, limites frente a Security/Compliance/Recovery, provider substitution de telemetry, clock/causal uncertainty, privacy leakage, AI/low-code operational assistance, foundations atuais do pacote `observe` e técnicas adversariais do Full Pass 2.
- **Artefatos autoritativos relacionados:** `RESEARCH_PIPELINE_STATE.json`, `PLANNING_A_OBSERVABILITY_OPERATIONS_INCIDENT_BOUNDARIES.md`, `PLANNING_B_OBSERVABILITY_OPERATIONS_INCIDENT_SB_CURRENT_STATE.md`, `OBSERVABILITY_OPERATIONS_INCIDENT_FULL_PASS_2_REVISIT.md`.

### CHAPTER_13 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-05.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial após providers/deployment e necessidade de explicar mudança empresarial como coexistência governada de revisões independentes, em vez de uma troca escalar `v1 → v2`.
- **Resumo:** publicado o capítulo que explica revision vectors, aplicabilidade histórica, compatibilidade direcional, coexistência e cohorts, migration readiness/currentness, staged transition, cutover, residual authoritative cohorts e drainage, supersession/correction lineage, deprecation versus withdrawal, efeitos `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN`, rollback eligibility versus rollback actuation versus state recovery, roll-forward, version skew, stale-active e non-amplification por IA/low-code. O texto diferencia as fortes foundations atuais de process revision/lineage, release lifecycle e retained-history deployment proof do lifecycle transversal G2 ainda não generalizado.
- **Artefatos autoritativos relacionados:** `RESEARCH_PIPELINE_STATE.json`, `PLANNING_A_LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_BOUNDARIES.md`, `PLANNING_B_LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_SB_CURRENT_STATE.md`, `PLANNING_A_PROCESS_APPLICATION_MODELING_BOUNDARIES.md`, além dos capítulos anteriores como dependências editoriais.

### CHAPTER_12 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-05.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial após deployment/runtime, aprofundando como o SB pode usar serviços externos maduros sem transferir identidade, semântica, autoridade ou verdade empresarial aos providers.
- **Resumo:** publicado o capítulo que explica anti-lock-in como portabilidade qualificada, não hot swap universal; distingue provider realization de semantic ownership; aprofunda canonical IDs versus provider-native IDs, `discovered → advertised → qualified → admitted → bound → effective`, support vectors, currentness/TOCTOU, fallback qualification, lowest-common-denominator abstractions, coexistência, cutover, residual provider cohorts, withdrawal, `UNKNOWN → reconcile-before-retry`, provider acceptance versus domain-effective success, extensions provider-specific e non-amplification por IA/low-code. O texto diferencia a seam provider-neutral já evidenciada no AI Gateway das lacunas G2 ainda não generalizadas.
- **Artefatos autoritativos relacionados:** `RESEARCH_PIPELINE_STATE.json`, `PLANNING_A_PROVIDER_BINDING_CAPABILITY_NEGOTIATION_BOUNDARIES.md`, `PLANNING_B_PROVIDER_BINDING_CAPABILITY_NEGOTIATION_SB_CURRENT_STATE.md`, `PROVIDER_BINDING_CAPABILITY_NEGOTIATION_FULL_PASS_2_REVISIT.md`, além do Capítulo 03 como dependência editorial.

### CHAPTER_11 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-05.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial após a cadeia Build/Artifact/Release, para explicar quando uma release realmente se torna workload operacional efetivo e como autonomia, rollout, readiness, scaling e traffic se relacionam.
- **Resumo:** publicado o capítulo que separa release, deployment e consumer/runtime-effective state; explica DeploymentIdentity versus IDs de realização, Environment/Operational Profile, desired/observed/effective state, deployment generations, workload, retained runtime closure, autonomia qualificada, active deployment versus processo efêmero, stale-writer protection, rollout, readiness, traffic effectiveness, scaling, placement, provider acknowledgement versus convergência, residual runtime cohorts, rollback actuation e escalabilidade com topologia física colapsável. O texto distingue a baseline single-host atualmente evidenciada no SB da semântica G2 distribuída ainda não implementada.
- **Artefatos autoritativos relacionados:** `RESEARCH_PIPELINE_STATE.json`, `PLANNING_A_DEPLOYMENT_ENVIRONMENT_RUNTIME_BOUNDARIES.md`, `PLANNING_B_DEPLOYMENT_ENVIRONMENT_RUNTIME_SB_CURRENT_STATE.md`, além das fronteiras adjacentes de Provider/Binding, Build, Artifact/Release, Lifecycle, Observability, Secrets/Configuration, Trust e Security/Resilience.

### CHAPTER_10 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-05.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial e necessidade de explicar a cadeia source/materials → build → immutable artifact → release → distribution antes de deployment/runtime.
- **Resumo:** publicado o capítulo que separa build result, released artifact, deployed state e runtime-effective state; explica build/material closure, determinismo versus reproducibility, hermeticity/controlled impurity, ArtifactIdentity versus ReleaseIdentity, content addressing, provenance, SBOM, release lifecycle, aliases, withdrawal/rollback eligibility, customer-owned repositories e anti-lock-in, caches, `UNKNOWN → reconcile-before-retry`, provider substitution e non-amplification por IA/low-code. O texto distingue a forte fundação atual do assembler/compiler e Artifact/Release do conjunto G2 ainda não evidenciado.
- **Artefatos autoritativos relacionados:** `RESEARCH_PIPELINE_STATE.json`, `PLANNING_A_BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_BOUNDARIES.md`, `PLANNING_B_BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_SB_CURRENT_STATE.md`, `PLANNING_A_ARTIFACT_RELEASE_SBOM_PROVENANCE_BOUNDARIES.md`, `PLANNING_B_ARTIFACT_RELEASE_SBOM_PROVENANCE_SB_CURRENT_STATE.md`.

### CHAPTER_09 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-05.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial e necessidade de explicar matemática empresarial como semântica transversal antes dos capítulos de build, lifecycle, providers, Commercial/FinOps e técnicas adversariais.
- **Resumo:** publicado o capítulo que separa `StoredFact` de `DerivedValue`, `FormulaDefinition` de `FormulaEvaluation` e `CalculationResult`, explica identidade/revisão/aplicabilidade histórica de fórmulas, live recomputation versus snapshot histórico, decimal/money/rates/units/temporalidade, rounding, `Missing/Null/Unknown/Error`, `EvaluationContext`, pure evaluation versus side effects, `FormulaDependencyGraph`, circularidade, `MaterializationPolicy`, `CalculationEvidence`, qualificação provider-neutral por `ProviderSemanticProfile`, resource bounds, exemplos empresariais e IA/low-code sem amplificação de autoridade. O texto registra a decisão fechada de não criar uma 29ª capability e de manter cálculo como subcapability transversal sob UCA, com mechanics providerizáveis e semantic owners preservados.
- **Artefatos autoritativos relacionados:** `RESEARCH_PIPELINE_STATE.json`, `POST_PLANNING_B_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION_RESEARCH.md`, `MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION_INCREMENT_3_FINAL_RECONCILIATION.md`, `MATHEMATICAL_CALCULATION_BOUNDED_SYNTHESIS_BACKFILL.md`, `PLANNING_A_MATHEMATICAL_CALCULATION_BOUNDED_BOUNDARY_BACKFILL.md`.

## 2026-09-04

### CHAPTER_01 — v1.0.0

- **Versão anterior:** primeira publicação sem versão editorial explícita.
- **Nova versão:** `1.0.0`.
- **Tipo:** PATCH administrativo de versionamento / baseline `1.0.0`.
- **Motivo:** adoção do versionamento semântico editorial obrigatório para capítulos já publicados.
- **Resumo:** identidade `CHAPTER_01` e versão editorial foram formalizadas. O objetivo desta entrada é estabelecer a baseline histórica, não declarar revisão da arquitetura.
- **Artefatos autoritativos relacionados:** `RESEARCH_PIPELINE_STATE.json`, `CAPABILITY_SYNTHESIS.md`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`.

### CHAPTER_02 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial após o Capítulo 01.
- **Resumo:** publicado o capítulo sobre empresa como sistema versionado, cobrindo ProcessMirror/BusinessRecipe/SystemDefinition, canonicidade, identidade semântica, revisões e revision vectors, lineage, coexistência, desired/observed/effective truth, brownfield e conflitos de composição revelados no Full Pass 2.
- **Artefatos autoritativos relacionados:** `PLANNING_A_PROCESS_APPLICATION_MODELING_BOUNDARIES.md`, `PLANNING_B_PROCESS_APPLICATION_MODELING_SB_CURRENT_STATE.md`, `PROCESS_APPLICATION_MODELING_FULL_PASS_2_REVISIT.md`, `RESEARCH_PIPELINE_STATE.json`.

### CHAPTER_03 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial e necessidade de estabelecer o vocabulário fundamental antes dos capítulos de composição/runtime e low-code.
- **Resumo:** publicado o capítulo que separa Capability, Semantic Owner, Provider e Binding; explica discovery/advertisement/qualification/admission/binding/effectiveness, support vectors, provider acknowledgement versus sucesso semântico, substituição e residual cohorts, anti-lock-in e os limites anti-god-object da Universal Capability Architecture. O texto distingue explicitamente as fronteiras pesquisadas do que Planning B efetivamente evidencia hoje no AI Gateway.
- **Artefatos autoritativos relacionados:** `CAPABILITY_SYNTHESIS.md`, `PLANNING_A_UNIVERSAL_CAPABILITY_ARCHITECTURE_BOUNDARIES.md`, `PLANNING_A_PROVIDER_BINDING_CAPABILITY_NEGOTIATION_BOUNDARIES.md`, `PLANNING_B_PROVIDER_BINDING_CAPABILITY_NEGOTIATION_SB_CURRENT_STATE.md`, `RESEARCH_PIPELINE_STATE.json`.

### CHAPTER_04 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial e necessidade de explicar fechamento de dependências e autonomia antes de introduzir grafos executáveis/low-code.
- **Resumo:** publicado o capítulo que explica a assimetria Builder/runtime, closure transitiva, minimal runtime closure, retained runtime closure, autonomia qualificada, Builder-time/build-time/runtime, cumulative context sem cumulative coupling, colapso de topologia física sem colapso semântico, falsa minimalidade, closure inflada e técnicas didáticas de prova. O texto distingue a visão pesquisada da fundação atualmente evidenciada no assembler/compiler do SB.
- **Artefatos autoritativos relacionados:** `PLANNING_A_BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_BOUNDARIES.md`, `PLANNING_B_BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_SB_CURRENT_STATE.md`, `PLANNING_A_DEPLOYMENT_ENVIRONMENT_RUNTIME_BOUNDARIES.md`, `CAPABILITY_SYNTHESIS.md`, `RESEARCH_PIPELINE_STATE.json`.

### CHAPTER_05 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial e necessidade de explicar a diferença entre composição visual e semântica executável antes dos capítulos de workflow, integrações e conflitos processuais.
- **Resumo:** publicado o capítulo sobre low-code, Canvas e grafos executáveis. O texto introduz nós, arestas, guards, estado, efeitos e constraints; separa Canvas, processo canônico e workflow durável; explica `PrimitiveValid != CompositionAdmissible != InvocationAuthorized != EffectQualified`; trata validade por partes, multi-step sem jointly qualified cut, offline replay de intenção superseded, omissão de qualificadores materiais, separação de funções, DerivedValue→StoredFact, ciclos legítimos versus amplificação, UI versus autorização e IA/low-code sem amplificação de autoridade. Também distingue a direção pesquisada do baseline atual de generated views e bindings já evidenciado no SB.
- **Artefatos autoritativos relacionados:** `PLANNING_A_UI_GENERATED_EXPERIENCE_LOW_CODE_BOUNDARIES.md`, `PLANNING_B_UI_GENERATED_EXPERIENCE_LOW_CODE_SB_CURRENT_STATE.md`, `PLANNING_A_PROCESS_APPLICATION_MODELING_BOUNDARIES.md`, `PLANNING_A_WORKFLOW_DURABLE_EXECUTION_BOUNDARIES.md`, `UI_GENERATED_EXPERIENCE_LOW_CODE_BUILDER_EDGE_CASE_REGISTER.md`, `UI_GENERATED_EXPERIENCE_LOW_CODE_BUILDER_FULL_PASS_2_REVISIT.md`, `DEEP_RESEARCH_LOW_CODE_COMPOSITION_AUTHORITY_SEMANTIC_EFFECT_01.md`, `RESEARCH_PIPELINE_STATE.json`.

### CHAPTER_06 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-04.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial e necessidade de explicar a progressão durável do trabalho antes dos capítulos de autorização, dados e evolução.
- **Resumo:** publicado o capítulo que separa processo, workflow, interação, ação, formulário, evento, mensagem e integração; explica instância/histórico durável, waits/timers, human tasks, a cadeia `attempted → accepted → applied/effective → converged → validated`, `UNKNOWN`, reconcile-before-retry, retry/redrive, idempotência qualificada, replay e side-effect boundaries. O texto inclui um exemplo integrado de OS com compra externa e distingue explicitamente a direção pesquisada do baseline atual do workflow do SB, inclusive a exposição de split failure entre mutação e persistência de estado.
- **Artefatos autoritativos relacionados:** `RESEARCH_PIPELINE_STATE.json`, `PLANNING_A_WORKFLOW_DURABLE_EXECUTION_BOUNDARIES.md`, `PLANNING_B_WORKFLOW_DURABLE_EXECUTION_SB_CURRENT_STATE.md`, `PLANNING_A_INTEGRATION_AUTOMATION_BOUNDARIES.md`, `PLANNING_A_NOTIFICATIONS_EVENTS_MESSAGING_BOUNDARIES.md`.

### CHAPTER_07 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-04.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial e necessidade de estabelecer identidade, autenticação, autoridade e escopo organizacional antes dos capítulos de dados, privacidade, segurança e IA.
- **Resumo:** publicado o capítulo que separa identidade/autenticação de autorização; explica identidade canônica versus identifiers de provider, assurance/currentness, `Enterprise → Station → Role → Person`, least privilege, delegation envelope, subdelegação, break-glass, residual authority cohorts, `ALLOW/DENY/INCONCLUSIVE`, policy composition, SoD, Station isolation, offline authorization closure, confused deputy e non-amplification por AGWS/IA. O texto distingue explicitamente a fundação já evidenciada no SB atual dos gaps G2 ainda em pesquisa.
- **Artefatos autoritativos relacionados:** `PLANNING_A_IDENTITY_AUTHENTICATION_FEDERATION_BOUNDARIES.md`, `PLANNING_B_IDENTITY_AUTHENTICATION_FEDERATION_SB_CURRENT_STATE.md`, `PLANNING_A_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_BOUNDARIES.md`, `PLANNING_B_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_SB_CURRENT_STATE.md`, `IDENTITY_AUTHENTICATION_FEDERATION_FULL_PASS_2_REVISIT.md`, `AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_FULL_PASS_2_REVISIT.md`, `RESEARCH_PIPELINE_STATE.json`.

### CHAPTER_08 — v1.0.0

- **Versão anterior:** inexistente.
- **Nova versão:** `1.0.0`.
- **Data:** 2026-09-04.
- **Tipo:** publicação inicial.
- **Motivo:** continuidade do plano editorial e necessidade de separar fato empresarial, schema, representação física, documentos/storage e obrigações de privacy/governance antes dos capítulos de matemática, lifecycle e recovery.
- **Resumo:** publicado o capítulo que separa Data/Schema/Migrations, Storage/Documents/Media, Authorization e Privacy/Data Governance/Retention/Legal Hold/Residency. O texto explica schema declaration versus provider materialization versus migrated population versus consumer-effective compatibility, compatibilidade direcional, default/backfill que pode fabricar fato canônico, identidade de documento versus content hash/provider key, transfer/integrity/retrievability, governed populations, retention/disposition/legal hold/residency, `Authorization ALLOW != Privacy eligibility`, residual copies, common qualified cut entre sinks, restore semanticamente inadmissível apesar de tecnicamente bem-sucedido, brownfield `discover → normalize → explicit adopt` e AI/low-code sem autoridade para inventar StoredFacts. Também distingue as foundations atualmente evidenciadas no SB dos gaps G2 ainda em pesquisa.
- **Artefatos autoritativos relacionados:** `PLANNING_A_DATA_SCHEMA_MIGRATIONS_BOUNDARIES.md`, `PLANNING_B_DATA_SCHEMA_MIGRATIONS_SB_CURRENT_STATE.md`, `PLANNING_A_STORAGE_DOCUMENTS_MEDIA_BOUNDARIES.md`, `PLANNING_B_STORAGE_DOCUMENTS_MEDIA_SB_CURRENT_STATE.md`, `PLANNING_A_PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_BOUNDARIES.md`, `PLANNING_B_PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_SB_CURRENT_STATE.md`, `DATA_SCHEMA_MIGRATIONS_FULL_PASS_2_REVISIT.md`, `RESEARCH_PIPELINE_STATE.json`.