# EAP/WBS — Studios da suíte
Fase STATION-SUITE-STUDIOS-PHASE-01. Data2026-10-12 UTC. Base5f14c94314e15cebb6484b8498bc30ded626439c.
Estado FORECAST de decomposição, objetivo admitido por Addendum018; não scheduler/autoridade de construção.
Método orientado a entregáveis de WBS_METHOD/WBS_DICTIONARY. EAP da fase SS não renumera capítulos01–12/21 ou milestones globais.

## Estrutura e entregáveis
| EAP | Entregável verificável | WP candidato | Parent WBS principal | Saída / aceitação |
|---|---|---|---|---|
| SS.1.1 | Fundação compartilhada dos Studios | STUDIOS-WP01 | 21.1.1 | Shell e ferramentas compartilhadas qualificadas — Abrir duas áreas de domínio mantendo referências/seleção, alternar contexto sem misturar autoridade; owner indisponível preserva draft |
| SS.1.2 | Catalog Studio | STUDIOS-WP02 | 5.3.3 | Entradas catalogadas versionadas e consulta real — Registrar/consultar uma entrada de cada catálogo; reutilizar versão explícita; duplicata/incompatível/acesso negado rejeitados |
| SS.2.1 | Mirror Studio | STUDIOS-WP03 | 1.3.3 | ProcessMirror versionado e rastreável — Mapear processo com fonte auditável, corrigir/reabrir revisão e expor lacuna; observação nunca vira aprovação normativa |
| SS.2.2 | Recipe Studio | STUDIOS-WP04 | 2.3.3 | BusinessRecipe aprovada/versionada e fragments/modules — Propor/revisar/aprovar pelo dono elegível e reabrir mesma versão; pendências e aprovação negada não produzem Recipe aprovada |
| SS.2.3 | Analysis Studio | STUDIOS-WP05 | 3.3.3 | SystemAnalysis versionado, requisitos e gaps — Cada necessidade relevante classificada e ligada à Recipe; gap/incerteza explícitos; versão de origem stale impede conclusão indevida |
| SS.3.1 | Design — Data Studio | STUDIOS-WP06 | 4.1.1 | Trecho de informação validado em SystemDefinition — Editar entidade/relação real por contrato, validar referências e reabrir sem perder comportamento/layout não editado |
| SS.3.2 | Design — Workflow Studio ampliado | STUDIOS-WP07 | 4.1.2 | Comportamento lógico versionado e rastreável — Evoluir fluxo atual com regra contratada, validar/refazer/reabrir e rejeitar referência/transição inválida; layout não muda negócio |
| SS.3.3 | Design — Actions, Jobs & Events Studio | STUDIOS-WP08 | 4.1.2 | Definições lógicas de ações/jobs/eventos — Configurar ação e vínculo evento/job real sem script solto; schema/efeito/permissão/duplicação inválidos rejeitados pelo dono |
| SS.3.4 | Design — Interface Studio | STUDIOS-WP09 | 4.2.1 | Views/forms lógicos e projeções de layout separadas — Compor tela/formulário vinculado a entidade/ação real, validar campos e round-trip; componente/layout não altera regra de processo |
| SS.3.5 | Design — Roles, Rules & Policies Studio | STUDIOS-WP10 | 4.2.2 | Modelo lógico de autoridade/política versionado — Configurar política e observar avaliação real permitida/negada; editar UI ou actorRef nunca concede autorização |
| SS.3.6 | Design — Integration Studio | STUDIOS-WP11 | 4.2.3 | Integrações lógicas e referências seguras — Configurar/validar vínculo real compatível, tratar falha/retry sem efeito duplicado e exportar sem credenciais |
| SS.3.7 | Design — Capabilities & Environment Requirements | STUDIOS-WP12 | 4.3.1 | Requisitos lógicos de ambiente/capabilities — Declarar requisitos e rejeitar incompatibilidade; referência de secret permanece referência, sem resolver/embutir segredo na definição |
| SS.3.8 | Design Studio integrado e publicação de definição | STUDIOS-WP13 | 4.3.3 | SystemDefinition publicável/publicada pelo dono elegível — Views complementares convergem na mesma definição; referências resolvidas, gate válido e publicação real; retenção técnica isolada não basta |
| SS.4.1 | Assembly Studio | STUDIOS-WP14 | 6.3.3 | AssemblyPlan reproduzível — Mesmos inputs produzem mesma composição/hash; conflito/ciclo/gap retorna diagnóstico real sem montagem fictícia |
| SS.4.2 | Validation Studio | STUDIOS-WP15 | 7.3.3 | ValidationEvidence e decisão de gate — Executar/consultar gates reais e rastrear requisito à prova; falha/stale/inconclusivo bloqueia avanço, botão aprovar não substitui evidência |
| SS.4.3 | Compiler Studio | STUDIOS-WP16 | 8.3.3 | ReleaseArtifact e evidência de compilação — Solicitar build real autorizado, recuperar resultado após desconexão e verificar integridade/reprodução; sem secrets no pacote |
| SS.4.4 | Release Studio | STUDIOS-WP17 | 9.3.3 | PublishedRelease imutável e auditável — Publicar/promover versão elegível e auditar origem; estado negado ou artefato adulterado não avança; revisão publicada não é sobrescrita |
| SS.4.5 | Deploy Studio | STUDIOS-WP18 | 10.3.3 | DeploymentRecord e versão ativa comprovada — Implantar em alvo isolado qualificado, verificar saúde/versão ativa e rollback; release não muda e credenciais ficam externas |
| SS.5.1 | Observe Studio | STUDIOS-WP19 | 11.3.3 | Observations/findings e indicadores rastreáveis — Exibir dado real com fonte/tempo/contexto e encaminhar finding; Observe/Builder indisponível não interrompe runtime |
| SS.5.2 | Support & Evolution Studio | STUDIOS-WP20 | 12.3.3 | Support/Evolution records e mudança rastreável — Classificar/resolver caso real e abrir evolução vinculada à origem; mudança de negócio retorna a Mirror/Recipe, sem patch direto fora da pipeline |
| SS.6.1 | Jornada integrada da fábrica com todos os Studios | STUDIOS-WP21 | 7.3.1 | Sistema cliente de referência e trilha completa de evidências — Processo observado→Recipe aprovada→Analysis→Design→Assembly→Validation→Compiler→Release→Deploy→Observe→Support→nova revisão; cliente funciona com Builder desligado |
| SS.6.2 | Qualificação, portabilidade e operação da fase | STUDIOS-WP22 | 21.3.2 | Matriz de qualificação, kit de operação/export/restore e fechamento rastreável — Executar matriz aprovada com medidas/boundaries, recuperar/importar dados e trocar implementação por contrato quando qualificado; limites residuais explícitos |

SS.0 Studios completos no recorte de jornadas admitidas.
SS.1 Fundação/reuso/catálogo; SS.2 Conhecimento/análise; SS.3 Design lógico e ferramentas; SS.4 Montagem/validação/compilação/release/deploy; SS.5 Operação/feedback; SS.6 Jornada integral/qualificação.
Cada leaf aponta ao capítulo dono; Foundation/integração são comuns. Layout e componentes visuais não se tornam fonte de processo. ProcessContext agrega referências/versões qualificadas; arquivo .process monolítico não decidido aqui.

## Cobertura e controle de100%
| Módulo / fronteira | Leafs da fase | Responsabilidade preservada |
|---|---|---|
| SB-01 Mirror | SS.2.1 | ProcessMirror produzido/decidido pelo dono, apresentado pela Station |
| SB-02 Recipe | SS.2.2 | BusinessRecipe produzido/decidido pelo dono, apresentado pela Station |
| SB-03 Analysis | SS.2.3 | SystemAnalysis produzido/decidido pelo dono, apresentado pela Station |
| SB-04 Design | SS.3.1–SS.3.8 | SystemDefinition produzido/decidido pelo dono, apresentado pela Station |
| SB-05 Catalog | SS.1.2 | Business/Software registry entries produzido/decidido pelo dono, apresentado pela Station |
| SB-06 Assembly | SS.4.1 | AssemblyPlan produzido/decidido pelo dono, apresentado pela Station |
| SB-07 Validation | SS.4.2 | ValidationEvidence produzido/decidido pelo dono, apresentado pela Station |
| SB-08 Compiler | SS.4.3 | ReleaseArtifact produzido/decidido pelo dono, apresentado pela Station |
| SB-09 Release | SS.4.4 | PublishedRelease produzido/decidido pelo dono, apresentado pela Station |
| SB-10 Deploy | SS.4.5 | DeploymentRecord produzido/decidido pelo dono, apresentado pela Station |
| SB-11 Observe | SS.5.1 | Observations/findings produzido/decidido pelo dono, apresentado pela Station |
| SB-12 Support & Evolution | SS.5.2 | Support/Evolution records produzido/decidido pelo dono, apresentado pela Station |
SS.1.1/SS.6.1/SS.6.2 cobrem capacidades transversais; não substituem capabilities dos módulos.
A EAP cobre o objetivo inteiro de12 Studios; não admite todas as capacidades futuras do SystemBuilder nem declara atual implementação integral. Decomposição adicional L4+ surge quando contratos/tamanho/provas forem conhecidos.

## Dicionário comum e fronteiras
Entradas: contratos/outputdos donos, artifacts/revisões elegíveis, catálogo/capabilities, perfil de autoridade/contexto e componentes Station reutilizáveis.
Saídas: modelo/draft/projeção e comando/query qualificados, artifacts/decisões reais, evidências positivas/negativas/compatibilidade e operações.
Aceitação transversal: janela/conteúdo acessível, identity/context/source/revision/completeness/currentness coerentes, schemas versionados, zero segredo em artefato, falha sem perda/sucesso fictício e reabertura/restart do dono quando durable.
Cada WP deve ampliar prova crescente e regredir predecessores. Toda função nova vai em Construction, inclusive gaps encontrados em revisão; Review/Closure não escondem implementation.

## Milestones da fase
| Marco | Pacotes | Estado de chegada |
|---|---|---|
| SS-M1 — Fundação/catálogo | WP01–WP02 | ferramentas/contexto compartilhados e dois catálogos distintos operáveis |
| SS-M2 — Conhecimento qualificado | WP03–WP05 | Mirror rastreável, Recipe aprovada pelo dono, Analysis classificada |
| SS-M3 — Design integrado | WP06–WP13 | sete conjuntos de ferramentas convergem em definição publicável/publicada elegível |
| SS-M4 — Fabricação e entrega | WP14–WP18 | montagem/gates/build/release/deploy reais com integridade e rollback |
| SS-M5 — Operação e evolução | WP19–WP20 | dado real observado e caso/evolução voltam à pipeline correta |
| SS-M6 — Suíte operacional qualificada | WP21–WP22 | jornada integral, autonomia de cliente, portabilidade/recuperação e matriz medida |
Nomes SS-M não renumeram H1–H4/M1/M2 históricos. Marco é estado verificável, não data/sprint.

## Resíduos e planning packages
Readiness de cada dono/serviço, semantic schemas/versions, amplitude das regras/actions/conectores, publicação, perfil auth e matriz de operação são refinados na Planning. Se acceptance/interface não puder ser definida, criar PlanningPackage/ARCHITECTURAL_HOOK, nunca inventar backend dentro da UI.
Próximo elegível WP01 Planning conforme NEXT_WORK, sem tarefas product futuras comprometidas.
