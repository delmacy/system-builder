# FM-01 — Planning Sprint P: baseline funcional e visual

Data: 2026-10-13
Status: PLANNING MATERIALIZED — Construction A não iniciada
Predecessor: programa vertical PR #1200, merge `9e5d0aea`

## Baseline verificado no código

- UI real: `apps/station/web/app/station-file-manager-workbench.tsx`. Estado de pasta ativa, seleção de arquivo, árvore expandida, grade/lista, painel lateral, mensagens de feedback e leitura de arquivo.
- Modelo: `station-artifact-workspace.ts`: `station:artifact-workspace:v1`, limites 4 MiB, 16 pastas, 48 arquivos, profundidade 8 e nome 80. Somente `create-folder` e `append-file` são mutações do contrato; não inventar rename/delete/move sem WP autorizado.
- Histórico de revisões/diferenças: `station-workspace-revisions.ts`, `station-revision-diff.tsx`.
- Leitura/decodificação de composição: reutilizar codec atual do Station Editor e `readWorkspaceComposition`.
- Árvore própria: função `hierarchy`, estado `expanded`, botões expandir/recolher e `navigate`; não utiliza `ui-core/NavigationTree`.
- Biblioteca compartilhada: `NavigationTree` tem seu próprio controle de expansão e seleção externa; substituir diretamente sem adapter de expansão/preferências do File Manager arriscaria descompasso de breadcrumbs, foco e histórico.
- Suítes encontradas: `tests/product/station-artifact-workspace.test.ts`, `tests/product/station-file-manager-app.test.ts` e testes de jornada na `tests/browser/station-editor-workbench.spec.ts`. Não criar suíte fantasma chamada `station-file-manager.spec.ts`.

## Jornadas a preservar e exercitar

1. Primeira abertura sem storage: raiz, estado vazio e feedback acessíveis.
2. Criar pasta válida → navegar por breadcrumb/árvore → exibir conteúdo coerente.
3. Importar arquivo `.composition.json` válido sem duplicar ou corromper versões.
4. Selecionar arquivo → consultar metadados → abrir no Editor.
5. Navegar entre grade/lista sem perder pasta ou seleção indevidamente.
6. Visualizar revisões e diff com identidade/versão corretas.
7. Recusar arquivo inválido, storage indisponível e conflito sem perda silenciosa.
8. Recarregar com storage persistido mantendo pasta válida e artefatos íntegros.
9. Operar com teclado e em viewport 390px, mantendo foco visível.

## Lacunas priorizadas

| Prioridade | Lacuna visual/funcional | Prova necessária |
| --- | --- | --- |
| P0 | Árvore customizada, teclado/foco/disclosure não compartilhados | Contrato de seleção/expansão e navegação por teclado sem regressão |
| P0 | Falta de sequência de localização voltar/avançar | Histórico de pasta sem mutação do workspace |
| P0 | Toolbar compacta e tooltip por teclado ainda não uniformizados | Ícones com aria-label, foco e sem rótulos espremidos |
| P1 | Layout lateral/inspector em 390px e no desktop | Sem sobreposição/scroll horizontal indevido |
| P1 | Ordenação/filtro de arquivos e persistência adequada da seleção | Busca sem interferir na lista canônica |
| P1 | Feedback de erro e comparação em fluxo completo | Playwright real e produto adversarial |
| Fora de escopo | Remote FS, operações rename/move/delete, docking persistente | Backlog; não mostrar botões falsos |

## Matriz de aceitação FM-01

- Construction A: caracterização e testes do File Manager atual, com armazenamento isolado, seleção, pasta, erro e versão; verificar responsividade real.
- Construction B: protótipo de adapter tree/toolbar compartilhadas sem mudança de fonte, com teste de equivalência.
- Test Review: comprovar que as caracterizações são estáveis e revisar impedimentos sem promover funções ausentes.
- Documentation & Enclosure: registrar evidência e liberar FM-02.

## Decisão de arquitetura

A UI pode escolher `NavigationTree` após provar equivalência de IDs, ordem, expansão, seleção, foco, teclado e breadcrumb. Se a API atual de expansão local não for suficiente, estender componente compartilhado com estado controlado opcional (compatível com consumidor anterior) e testar ambos os consumidores. Workspace local permanece autoridade dos dados; Station é apresentação, não Core.

## Milestone

M1 somente após merge das sprints de FM-01, testes reais e revisão da baseline. Este documento não reivindica M1.
