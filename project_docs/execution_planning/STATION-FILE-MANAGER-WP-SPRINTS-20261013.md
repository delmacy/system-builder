# File Manager — Planejamento detalhado das WPs e sprints

Data: 2026-10-13
Status: PLANNING / Construction não iniciada; sprints abaixo são previsão e serão materializadas progressivamente
Escopo: File Manager integrado da Station, não um sistema de arquivos remoto genérico

## Capacidade existente a preservar

O File Manager já mantém workspace local, pastas, criação, importação de composições, grade/lista, seleção, inspector, revisões, comparação e abertura/exportação de artefatos. Preservar `station-artifact-workspace.ts`, `station-workspace-revisions.ts`, `station-revision-diff.tsx`, formato portátil, validação e proteção a conflitos. A árvore atual em `station-file-manager-workbench.tsx` é específica do app; `ui-core/navigation-tree.tsx` já existe, mas precisa de adaptação baseada em contrato ou evolução do componente compartilhado.

## FM-01 — Planning & Baseline

- **Planning Sprint P:** inventário de telas/casos de uso/arquivos/fluxos; diagrama de navegação, estados de seleção e foco, matriz de componentes atuais versus necessários, design baseline e exemplos de referência; mapa de riscos e testes. Sem mudanças em contratos de dados.
- **Construction A:** criar harness de caracterização do comportamento atual e snapshots visuais não frágeis das telas reais.
- **Construction B:** protótipo de integração de árvore e toolbar em modo seguro/isolado; comprovar compatibilidade de eventos, sem migração de persistência.
- **Test Review:** revisar fluxos, teclado/390px, conflitos e regressões.
- **Documentation & Enclosure:** baseline e aceite de escopo FM-02…FM-05.

Gate FM-01: jornada atual inventariada, prova de não regressão e decisão explícita sobre reuso de árvore.

## FM-02 — Navegação, layout, árvore

- **Planning Sprint P:** conferir contratos com FM-01 e fontes; calibrar CSS/theme e APIs de focus/expansion.
- **Construction A:** árvore acessível (expansão/colapso, seleção, foco persistente, Home/End, setas, disabled, ids estáveis) e integração com workspace real; evitar árvore paralela.
- **Construction B:** breadcrumbs, histórico de localização com voltar/avançar, seleção consistente entre nav/contents e estados de pasta vazia.
- **Construction C:** panes/inspector controlados em largura/colapso; desktop/390px sem sobreposição; tema atual.
- **Test Review:** regressões com pastas profundas, reparent visual inexistente, keyboard, aria, mobile e dados inválidos.
- **Documentation & Enclosure:** concluir M2.

Gate FM-02: navegação end-to-end comprovada, sem perda de seleção/arquivos e sem alterar autoridade da fonte.

## FM-03 — Toolbar, galeria e operações

- **Planning Sprint P:** revalidar pacote de ícones e precedentes de WP-ICON-01, mapear comandos existentes; sem inserir comandos falsos.
- **Construction A:** toolbar com icon-only quando compacta; hover/focus tooltip, ícone/aria-label, menus com overflow, order de tab e estados disabled.
- **Construction B:** modos grade/lista, ordenação, busca/filtro local, seleção persistente quando possível, navegação por teclado, ações contextuais.
- **Construction C:** criar pasta, importar, abrir, exportar e guardar revisões existentes; estados de progresso, erro, arquivo incorreto e concorrência.
- **Test Review:** seleção/ações após filtros, botões icon-only, 390px, arquivos grandes/erro e atalhos sem usurpar shell.
- **Documentation & Enclosure:** concluir M3.

Gate FM-03: toolbar profissional utilizável sem labels espremidas; ações reais sem inventar backend.

## FM-04 — Revisões e propriedades

- **Planning Sprint P:** reconfirmar `ArtifactWorkspace`, revisão, storage e reader.
- **Construction A:** inspector de arquivo/pasta com tipagem correta, metadados e histórico.
- **Construction B:** visão de revisões e diff com seleção consistente, versão e origem explícitas.
- **Construction C:** roundtrip import/save/open/export com erro/conflito preservando estado; compatibilidade com Editor.
- **Test Review:** dados malformados, rollback lógico, stale storage, duas abas e integridade de versão.
- **Documentation & Enclosure:** concluir M4.

Gate FM-04: nenhuma perda silenciosa de dados, comparação e reabertura consistentes.

## FM-05 — QA final e qualificação

- **Planning Sprint P:** congelar matriz de aceitação e comparações visuais do tema.
- **Construction A:** regressões Playwright de jornadas reais (desktop, 390px, teclado, seleção, versões, erro).
- **Construction B:** correções de a11y, responsividade, foco, contraste, carregamento e estados.
- **Construction C:** smoke completo na Station/Shell, integração entre File Manager e Editor, memória/performances proporcionais, arquivos portáteis.
- **Test Review:** revisão de arquitetura, auditoria dos gates, diferenças de tema e funcionalidades adiadas.
- **Documentation & Enclosure:** relatório com evidência de CI/PR e aceite M5.

Gate FM-05: File Manager fechado como aplicativo, não apenas componentes de laboratório.

## Ritmo de execução

Cada sprint gera commit incremental, PR com HEAD exato e validação apropriada; em um mesmo WP é permitido realizar increments de Construction em sequência e executar o CI integrado ao final, contanto que os testes locais/seguros e o controle do PR sejam preservados. O encerramento de WP exige CI de todas as gates obrigatórias no último HEAD. Se o CI estiver falhando, registrar falha, corrigir e não realizar merge.

## Dependência entre aplicações

O Component Lab recebe os novos componentes de FM-02/FM-03 conforme sejam necessários e provados no File Manager. Sua **WP própria** só começa depois de M5. O Component Editor e os Studios não são alterados durante FM-02…FM-05 exceto por conserto de regressão diretamente comprovada ou migração compartilhada contratada. Sem workstreams paralelos de interface.
