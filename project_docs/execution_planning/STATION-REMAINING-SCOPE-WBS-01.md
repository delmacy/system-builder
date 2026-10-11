# Station — EAP do escopo restante, WPs e sprints

Data: 2026-10-11. Estado: FORECAST de planejamento; sem autorização de construção.
Solicitação: proprietário pediu a decomposição do que falta em work packages e sprints.
Base verificada: main d11717034c525d90761869f045e665b51c1e547c, encerramento WP7 (#1069).

## Autoridade e alcance

AGENTS.md; docs/DOCUMENT_AUTHORITY.md; docs/contracts/CONTRACT_INDEX.md;
docs/current/NEXT_WORK.md; project_docs/schedule/SPRINT_MODE.md;
project_docs/schedule/SPRINT_GENERATION_POLICY.md;
docs/architecture/MASTER_BLUEPRINT.md; docs/architecture/STATION_FRONTEND_FOUNDATION.md;
docs/contracts/002-station-visual-factory/ADDENDUM.md;
project_docs/21-canvas-visual-builder/WBS.md.

Esta EAP organiza o horizonte Station até o primeiro Studio especializado integrado.
Não representa a conclusão de todo o System Builder, nem transforma escopo diferido em aceito.
WP8–WP16 são identificadores candidatos de continuidade, sujeitos à confirmação na respectiva Planning.
As extensões precisam de addendum aceito antes da decomposição executável; alterações L4 precisam de ADR.
Somente a Planning elegível poderá materializar TASKs e a primeira Construction Sprint.
NEXT_WORK permanece o único scheduler; este documento não inicia WP8 nem altera seu estado.

Limite desta edição documental: um arquivo, este plano; proibidos produto, contratos aceitos,
TASKs, NEXT_WORK e outros arquivos. Validação: git diff --check e conferência de rastreabilidade,
dependências, contagem e ausência de afirmações de implementação. Nenhum teste de produto novo.

## Ponto de partida entregue

Shell Station e fundamentos de componentes existem. WP1–WP7 entregaram editor compartilhado,
catálogo instalado limitado, grade/span, Layers/Inspector/Preview, salvar/abrir local e arquivo,
histórico efêmero de 50 entradas, adicionar/remover/reordenar, melhoria interna de validação
e texto de botões suportados. Última prova: 98 testes do editor, 44 jornadas Chromium e CI final.
Essas provas não certificam todo S4, acessibilidade universal ou escala ilimitada.

## EAP orientada a entregas

| EAP | Entrega restante | WP candidato | Rastreabilidade / admissão |
|---|---|---|---|
| R.1.1 | Propriedades de componentes tipadas | WP8 | 21.2.1/21.2.3; novo addendum delimita campos e tipos |
| R.1.2 | Catálogo ampliado e composições reutilizáveis | WP9 | Gramática 001 e 21.2.1; incremento delimita descritores/templates |
| R.1.3 | Movimentação entre contêineres compatíveis | WP10 | 21.2.1/21.2.3; incremento de autoria estrutural |
| R.2.1 | Organização e navegação de recursos | WP11 | Horizonte arquitetural File Manager; contrato de recurso/armazenamento antes de construir |
| R.2.2 | Revisões, comparação e conflitos | WP12 | 21.3.1–21.3.3; contrato de versões e dono da retenção |
| R.3.1 | Documento de processo e suas projeções | WP13 | 21.1.1/21.1.2 e Blueprint; contrato semântico e ADR se mudar fronteiras |
| R.3.2 | Explorer/Inspector genéricos para modelos | WP14 | 21.1.3/21.2.1/21.2.2; contrato de capacidades e referências |
| R.4.1 | Primeiro Studio especializado | WP15 | Promoção C10 e domínio escolhido exigem admissão explícita |
| R.4.2 | Jornada Studio → serviço proprietário → reabertura | WP16 | Contratos reais dos donos; não concede autoridade de negócio ao Station |
| R.Q | Qualidade, segurança e desempenho | Todos | Critérios transversais e revisão por pacote; limites sempre explícitos |

Componentes visuais e processos permanecem artefatos/contextos distintos. O processo pode ser
o contexto compartilhado por views de Studios; um eventual .process deve referenciar suas
partes com identidade/versões validadas. Extensão, formato monolítico versus manifesto e
armazenamento não estão decididos por esta previsão. BusinessRecipe != SystemDefinition.

## Pacotes, construção e provas de saída

Cada linha prevê Planning, Construction A, Construction B, Review e Closure.
As duas construções abaixo são objetivos candidatos, não TASKs comprometidas.

| WP | Objetivo e dependências | Construction A | Construction B | Prova de saída |
|---|---|---|---|---|
| WP8 | Editar um conjunto pequeno de propriedades; depende WP7 + admissão | Definir campos/tipos para descritores selecionados; validação, intents, codec e histórico | Controles no Inspector, convergência e retenção | Editar → desfazer/refazer → salvar → reabrir; inválidos sem mutação; versão anterior com tratamento explícito |
| WP9 | Ampliar reutilização; depende WP8 | Descritores source-owned de um conjunto escolhido e regras de slots | Navegação, instalação e uma composição reutilizável admitida | Instalar composição real, editar e reabrir; incompatibilidade/referência desconhecida rejeitada |
| WP10 | Reparenting seguro; depende WP9 | Operação atômica com compatibilidade, ciclos, identidade e seleção | Controle de movimentação, feedback e integração com histórico | Mover entre pais válidos e reabrir; ciclo/slot inválido preservam estado; undo restaura hierarquia |
| WP11 | Resource Explorer/File Manager mínimo; depende WP9, podendo ocorrer depois WP10 por execução serial | Contrato de recurso, IDs, hierarquia e adapter de retenção escolhido | Listar, organizar e abrir recurso na ferramenta correta; operações destrutivas delimitadas | Criar/organizar/abrir artefato real; referências quebradas, acesso negado e falha de escrita tratados |
| WP12 | Contexto de versões; depende WP11 e WP10 para regressão do editor | Revisões, comparação determinística e detecção de atualização concorrente | UI de diff/conflito e decisão explícita de retenção | Duas revisões reais, conflito detectado sem sobrescrita silenciosa e recuperação; sem prometer merge automático |
| WP13 | Contexto portátil de processo; depende WP12 + contratos semânticos | Definir processo/referências/ownership e codec/adapter semântico | Abertura do contexto e projeções separadas de layout | Reabrir processo e referências preservando semântica; ausentes/stale explícitos; layout não altera negócio |
| WP14 | Explorer/Inspector compartilhados; depende WP13 | Registro de projeções/capacidades e seleção por identidade | Superfícies compartilhadas para views distintas do mesmo contexto | Alternar views mantendo referências e contexto coerentes; sem duplicar verdade canônica |
| WP15 | Primeiro Studio; depende WP14 + escolha do domínio/C10 | Slice de domínio e operações através do contrato proprietário | Views e autoria especializada sobre ferramentas compartilhadas | Uma jornada de domínio completa no Studio, validada e reaberta; regras inválidas rejeitadas |
| WP16 | Prova integrada operacional; depende WP15 + serviço/API proprietário pronto | Adapter real, comando/consulta e estados de falha/concorrência | Jornada navegador→API→dados→resposta e recuperação | Autoria válida chega ao dono correto e reaparece; indisponibilidade/negativa/versão stale provadas sem sucesso fictício |

WP8 inicialmente exclui ações executáveis, CSS livre e catálogo remoto. Planning escolherá
os campos exatos; texto WP7 não será reimplementado. WP9 escolherá quantidade/tipos com base
na prova necessária, sem admitir um catálogo universal. WP11 não escolhe implicitamente
Git, filesystem, servidor ou provider. WP12 não equivale a colaboração simultânea.
WP16 não inclui publicar/deployar runtimes nem remodelar um backend existente; lacunas dos
serviços serão encaminhadas ao pacote proprietário e bloquearão a dependência correspondente.

## Cadência e critérios de cada sprint

Identificação candidata: STATION-WP<n>-PLAN-01, CONSTRUCTION-A-01, CONSTRUCTION-B-01,
INTEGRATION-REVIEW-01 e DOCUMENTATION-CLOSURE-01. C só nasce por necessidade comprovada.

| Sprint | Entrega | Gate de conclusão |
|---|---|---|
| Planning | Fresh main; addendum/ADR necessários; goal, exclusões, DAG, riscos, provas; materializar só A | Escopo admitido, dependências integradas e TASKs A com paths/max_files/validações |
| Construction A | Primeiro incremento integrado indicado na tabela | Testes positivos/negativos e predecessores; relatório; verify e CI do head; PR integrado |
| Construction B | Jornada de usuário e round-trip do pacote | Prova crescente de navegador/contratos; regressão herdada; verify e CI; PR integrado |
| Construction C, opcional | Gap de construção indispensável identificado após B | Nova materialização bounded; mesmos gates; não inserir funções atrasadas em Review |
| Integration & Review | Auditar pacote, compatibilidade, arquitetura, dívida e prontidão | Sem blockers; limites documentados; go/no-go de fechamento com evidência |
| Documentation & Closure | Reconciliar contratos, WBS, operação, relatórios e NEXT_WORK | CI final e integração; sem função nova; encerramento e próxima Planning elegível |

Um branch sprint/<SPRINT-ID>, um commit autoritativo por TASK, um PR por sprint.
Só a sprint ativa é COMMITTED. Próximas sprints/WPs continuam FORECAST, mesmo com dependências previstas.
Nenhuma duração em dias/semanas é fixada: cinco sprints são unidades de entrega, não calendário.

## Dependências e milestones candidatos

Linha crítica prevista: WP8 → WP9 → WP10 → WP11 → WP12 → WP13 → WP14 → WP15 → WP16.
A dependência técnica mínima de WP11 é WP9; a linha acima escolhe continuidade serial.
Não há autorização de execução paralela. A prontidão dos contratos/serviços pode alterar o caminho.

| Milestone candidato | Pacotes | Estado de chegada verificável |
|---|---|---|
| H1 — Autoria visual ampliada | WP8–WP10 | Compor catálogo admitido, editar propriedades e mover estrutura, mantendo round-trip e histórico |
| H2 — Recursos e revisões | WP11–WP12 | Localizar/organizar artefatos e comparar revisões com conflitos explícitos |
| H3 — Contexto de processo compartilhado | WP13–WP14 | Abrir processo portátil e views complementares com semântica separada de layout |
| H4 — Primeiro Studio integrado | WP15–WP16 | Jornada real de domínio através do serviço proprietário, com retenção/reabertura e falhas provadas |

H1–H4 são nomes deste forecast, não renumeração de milestones globais M1/M2 ou de fases Station S3/S4.

## Estimativa e fronteira de conclusão

Previsão: nove novos WPs, 45 sprints padrão; até 54 se todos exigirem uma Construction C.
Com os sete WPs anteriores, seriam 16 WPs Station até H4. Essa soma não conta as fases anteriores
como WPs novos, não fixa a contagem final e não significa 54 sprints já comprometidas.
Pacotes podem ser divididos/replanejados quando contratos, tamanho e evidência forem conhecidos.

Fora deste horizonte: suite completa de Studios, produção de clientes autônomos, deploy/runtime,
IA/MCP autorando, secrets/provider managers, colaboração simultânea, catálogo universal,
certificação externa e conformidade global. São programas dos donos respectivos, não funções
ocultas de WP16. Qualidade transversal cobre teclado/foco, identidade, validação fail-closed,
compatibilidade, recuperação e desempenho/memória sob limites declarados; navegador adicional
e acessibilidade ampliada terão matriz concreta na Planning, sem certificação presumida.

## Riscos e próximo passo

- WP8–WP10: crescimento de payload e restrições de slots; versionar explicitamente e provar leitores.
- WP11–WP12: ownership, corrupção, concorrência e retenção; escolher contratos antes de adapters.
- WP13–WP16: autoridade semântica e serviço real; reusar donos existentes, admitir extensões e ADRs necessários.
- Todos: sessões longas, memória, catálogo maior e UI overflow; definir limites e medidas por pacote.

Próximo passo recomendado: Planning WP8, começando pela admissão dos campos tipados e
contrato de compatibilidade. O pedido atual conclui somente esta decomposição; implementação
continua fora da autorização deste documento.
