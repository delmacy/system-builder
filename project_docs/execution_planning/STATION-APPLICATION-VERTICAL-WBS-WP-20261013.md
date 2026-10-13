# Station — WBS/EAP e Work Packages por Aplicativo

Data: 2026-10-13
Status: baseline de planejamento — WPs posteriores em FORECAST; suas tarefas não estão comprometidas
Predecessor: `STATION-APPLICATION-VERTICAL-DELIVERY-PLAN-20261013.md`

## EAP/WBS (L1–L4)

| WBS | Entrega verificável | WP |
| --- | --- | --- |
| 1 | Fundação da esteira vertical / regras de gates e catálogo | APP-00 |
| 1.1 | Baseline de UI, rotas, estados e contratos herdados | APP-00 |
| 1.2 | Guia de reutilização e qualificação source→Lab→app | APP-00 |
| 2 | File Manager qualificado como aplicação | APP-01 |
| 2.1 | Planning: mapa de jornadas, dados e design | FM-01 |
| 2.1.1 | Inventariar fluxos, árvore, menu, seleção, revision/diff e workspace | FM-01 |
| 2.1.2 | Comparação visual tema atual vs UI alvo e matriz de componentes | FM-01 |
| 2.1.3 | Matriz de testes e regressões, WBS congelada | FM-01 |
| 2.2 | Shell/navegação/gestão de espaço | FM-02 |
| 2.2.1 | Árvore de pastas com contrato de seleção/expansão e teclado | FM-02 |
| 2.2.2 | Breadcrumbs, histórico voltar/avançar, localização, foco | FM-02 |
| 2.2.3 | Split/dock de inspector com largura mínima, 390px e desktop | FM-02 |
| 2.3 | Toolbar e operações de arquivo | FM-03 |
| 2.3.1 | Ícones sem rótulos espremidos, menus e tooltips teclado/hover | FM-03 |
| 2.3.2 | Grade/lista, ordenação, filtro/busca, seleção e estados vazios | FM-03 |
| 2.3.3 | Criar/importar/abrir/exportar e ações contextuais explicitamente autorizadas | FM-03 |
| 2.4 | Versionamento e inspector | FM-04 |
| 2.4.1 | Propriedades e histórico de revisões convergindo com seleção | FM-04 |
| 2.4.2 | Diff comparativo, conflito de gravação e recuperação segura | FM-04 |
| 2.4.3 | Arquivo portátil e roundtrip sem perda de metadados | FM-04 |
| 2.5 | Integração e QA visual | FM-05 |
| 2.5.1 | Jornadas Playwright desktop e 390px, keyboard/a11y | FM-05 |
| 2.5.2 | Erros, limites, inputs malformados, stale/duplo clique e compatibilidade | FM-05 |
| 2.5.3 | Correções, documentação e Enclosure com evidência de HEAD | FM-05 |
| 3 | Component Lab refinado usando demanda real do File Manager | APP-02 |
| 3.1 | Audit source/Lab/Editor e componentes faltantes por prioridade | CL-01 |
| 3.2 | Galerias/estados/tema/responsividade/acessibilidade | CL-02 |
| 3.3 | Qualificação, documentação e encerramento | CL-03 |
| 4 | Component Editor amadurecido | APP-03 |
| 4.1 | Auditoria de catálogos/slots/inspector/preview e matrizes | CE-01 |
| 4.2 | Composição/layout/grids e inserção tipada incrementais | CE-02 |
| 4.3 | Templates, arquivos, versões e portabilidade | CE-03 |
| 4.4 | QA ponta a ponta, UX e encerramento | CE-04 |
| 5 | Studios individuais (um WP por Studio após inventário) | APP-04 |
| 5.1 | Process Studio — execução vertical | PS-01 |
| 5.2 | Workflow Studio — execução vertical | WS-01 |
| 5.3 | UI Studio — execução vertical | US-01 |
| 5.4 | Studios restantes — forecast, IDs somente após auditoria | Forecast |
| 6 | Jornada integrada dos aplicativos finalizados | APP-05 |

## Ordem e dependências

`APP-00 → FM-01 → FM-02 → FM-03 → FM-04 → FM-05 → CL-01 → CL-02 → CL-03 → CE-01 → CE-02 → CE-03 → CE-04 → (PS-01 → WS-01 → US-01 → demais Studios) → APP-05`.

WP é pacote de entrega coesa, não sprint. Cada WP terá Planning, Construction A/B/C (tantas quanto o escopo demonstrar), Test Review e Documentation & Enclosure. Marcos são **estados de chegada entre WPs**, não substituem seus critérios de aceitação.

## Marcos

- M0 — Esteira de um aplicativo por vez aprovada; inventário de riscos e contratos.
- M1 — File Manager planejamento aceito (FM-01 fechado).
- M2 — Navegação e layout utilizáveis (FM-02 fechado).
- M3 — Operações/toolbar qualificadas (FM-03 fechado).
- M4 — Revisões, inspector e roundtrip comprovados (FM-04 fechado).
- M5 — File Manager pronto para uso no escopo declarado (FM-05 fechado).
- M6 — Component Lab qualificado.
- M7 — Component Editor qualificado.
- M8+ — Um marco após cada Studio; integração cruzada ao final.

## Critérios de pronto de cada WP

1. Início: `main` fresco, gaps e worktree/branch sem conflitos, escopo e paths elegíveis definidos.
2. Entregas: APIs reutilizáveis somente com consumidor real; tests + docs; nenhuma mudança no Core sem autoridade própria.
3. QA: testes de comportamento, UI visual, responsividade, teclado, estados de falha e persistência.
4. Fecho: CI exato, PR merged e relatório de limitações. Fluxo interrompe no primeiro WP com gate bloqueante.
