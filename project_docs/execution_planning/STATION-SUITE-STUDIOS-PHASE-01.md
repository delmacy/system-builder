# Próxima fase — Studios da suíte completa
ID: STATION-SUITE-STUDIOS-PHASE-01. Data2026-10-12 UTC.
Estado: baseline de objetivo/planejamento admitida pelo proprietário; WPs e construções FORECAST.
Base atualizada após WP16 Closure: 5f14c94314e15cebb6484b8498bc30ded626439c. Proveniência Addendum018.
Autoridade: AGENTS.md; docs/DOCUMENT_AUTHORITY.md; docs/contracts/CONTRACT_INDEX.md; docs/architecture/SUITE_MAP.md; docs/architecture/MASTER_BLUEPRINT.md; project_docs/INTERFACE_MAP.md; project_docs/WBS_METHOD.md; project_docs/WBS_DICTIONARY.md; project_docs/schedule/SPRINT_GENERATION_POLICY.md; module01–12 scope/README.md + WBS.md; project_docs/21-canvas-visual-builder/WBS.md.

## Objetivo verificável
Disponibilizar na Station todas as12 áreas de Studio previstas na Suite Map, com ferramentas especializadas de Design, contratos dos respectivos donos e jornadas operacionais reais.
Cada Studio deve permitir ao builder executar suas jornadas primárias admitidas, validar/consultar a decisão do dono, reabrir a revisão correta e recuperar falhas. Um launcher, formulário ou mock aceito não constitui Studio entregue.
Ao final, uma cadeia de referência atravessa processo observado, Recipe aprovada, análise, definição, montagem, validação, compilação, release, deploy local qualificado, observação, suporte e evolução. O sistema cliente publicado continua operando com Builder/Core/Observe indisponíveis.

## Base entregue e fronteira
WP1–WP16 Station encerram o horizonte até a primeira jornada local de Studio integrada. WP16 fecha candidato técnico Workflow→SDK→Gateway→Design/PostgreSQL→readback/reabertura, com111 heavy0skip/103 Chromium e ownerrestart/falhas/metadados/native/escaping.
Isso não conclui todos os Studios, todoDesign/S4 ou aprovação/publicação de negócio. O Design recebido é técnico e upstream permanece unresolved. A fase nova não reutiliza esse recibo como aprovação de Recipe, validação de release ou autorização universal.
Há fundações de catálogo/montagem/validation/compiler/release/deploy/observe e Support/Evolution no Core; novas interfaces deverão consumir/reusar contratos qualificados. Ausência de arquivo guessed/index ou de UI não prova ausência de módulo; o census individual é obrigatório.

## Cobertura integral da suíte
| Módulo | Área de Studio | Saída sob autoridade do dono | WPs candidatos | WBS de origem |
|---|---|---|---|---|
| SB-01 | Mirror | ProcessMirror | STUDIOS-WP03 | 1.1.1–1.3.3 |
| SB-02 | Recipe | BusinessRecipe | STUDIOS-WP04 | 2.1.1–2.3.3 |
| SB-03 | Analysis | SystemAnalysis | STUDIOS-WP05 | 3.1.1–3.3.3 |
| SB-04 | Design | SystemDefinition | STUDIOS-WP06–WP13 | 4.1.1–4.3.3 |
| SB-05 | Catalog | Business/Software registry entries | STUDIOS-WP02 | 5.1.1–5.3.3 |
| SB-06 | Assembly | AssemblyPlan | STUDIOS-WP14 | 6.1.1–6.3.3 |
| SB-07 | Validation | ValidationEvidence | STUDIOS-WP15 | 7.1.1–7.3.3 |
| SB-08 | Compiler | ReleaseArtifact | STUDIOS-WP16 | 8.1.1–8.3.3 |
| SB-09 | Release | PublishedRelease | STUDIOS-WP17 | 9.1.1–9.3.3 |
| SB-10 | Deploy | DeploymentRecord | STUDIOS-WP18 | 10.1.1–10.3.3 |
| SB-11 | Observe | Observations/findings | STUDIOS-WP19 | 11.1.1–11.3.3 |
| SB-12 | Support & Evolution | Support/Evolution records | STUDIOS-WP20 | 12.1.1–12.3.3 |

Design agrupa sete conjuntos de ferramentas: dados; workflows; actions/jobs/events; interfaces/forms; roles/rules/policies; integrações; capabilities/requisitos de ambiente. Um WP adicional integra esses trechos e qualifica a publicação da definição. São views/ferramentas do mesmo bounded context, não novos donos.
Catalog e Compiler são cobertos explicitamente. Consoles/assistentes de build, deploy e observação podem ser Studios funcionais sem exigir canvas para toda operação.
12 áreas não significam12 Next.js apps, processos, containers ou repositórios. Preferir monorepo/shell, fronteiras públicas e implementações substituíveis.

## Inclui
- Jornadas de autoria/revisão/consulta/decisão e retenção/reabertura por área, com proveniência e versões qualificadas.
- Compartilhamento de Explorer, Inspector, contexto, seleção, histórico/draft, comparação, ferramentas, layout e catálogo conforme capacidades reais.
- Integração do SDK/Gateway com donos prontos; gaps de API/backend/auth/storage/lifecycle encaminhados a Work Packages dos respectivos donos.
- Gate real de negócio para Recipe, definição publicável, ValidationEvidence, builds/releases/deploy e feedback; permissões verificadas no servidor para cada ação.
- Prova operacional integrada, autonomia de cliente, portabilidade/import/restore, limites/boundaries e operação documentada.

## Exclui como promessa implícita
IA/MCP autorando autonomamente, colaboração simultânea/universal, catálogo universal, formato monolítico .process, rollout de produção pública/multitenancy/IAM/TLS não qualificado, todo provider/secrets manager e certificação externa/global.
Requirements/integrations/deploy tratam referências seguras; credenciais não entram em artefatos nem browserlocalStorage. Quando um contrato exigir novo incremento/schema/ADR, sua Planning o admite explicitamente antes de código.
Escopo de cada Studio é definido pelo seu conjunto de jornadas/contratos e limites aceitos, não pela estética da tela.

## Critérios de chegada da fase
1. As12 áreas possuem jornadas reais verificadas e reabertura por revisão correta; nenhuma área é substituída por stub/testdouble no exit.
2. Observação≠regra aprovada≠análise≠definição≠release; cada decisão/efeito tem dono/ator/contexto/evidência elegível.
3. Sem perda de metadados não editados, sem sucesso fictício em stale/unknown/denied/disconnected, sem sobrescrita silenciosa.
4. Cadeia integral utiliza artifacts/serviços reais, gates reais e cliente autônomo com factorydesligada; falha não produz publicação/deploy indevido.
5. Portabilidade, segurança, acessibilidade/browsers/performance e recuperação passam a matriz escolhida; resíduos e limites declarados.
6. Todos os WPs executados têm Review/Closure próprios e memória reconciliada; não inferir conclusão de backend inteiro de uma UI.

## Planejamento e caminho
EAP: STATION-SUITE-STUDIOS-WBS-01.md. Dicionário/DAG/WPs: STATION-SUITE-STUDIOS-WORK-PACKAGES-01.md. Readiness: STATION-SUITE-STUDIOS-READINESS-01.md.
Previsão22 WPs da experiência Station,110 sprints padrão; até132 se todos precisarem de C. São candidatos, não duração/calendário ou tarefas comprometidas. Packages dos donos para readiness não estão artificialmente contados como já feitos nem dentro dessa estimativa; divisão/quantidade será refinada.
Só a Planning atual é COMMITTED. Primeiro próximo candidato STUDIOS-WP01 Planning; cada WP segue Planning→A→B→C somente necessária→Review→Closure. Futuras construções não autorizadas por esse documento.
