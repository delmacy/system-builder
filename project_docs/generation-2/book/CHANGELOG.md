# Changelog editorial — Livro técnico-conceitual da Generation 2

Este histórico registra versões do **texto editorial**. `ChapterVersion != ArchitectureRevision != SystemRevision`.

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
