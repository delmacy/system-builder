# Station — Programa de Entrega Vertical por Aplicativo

Data: 2026-10-13
Status: PLANNING / PROPOSTA MATERIALIZADA; execução das Construction sprints depende da aprovação do planejamento e da reconciliação do último `main`
Responsável técnico: Station visual workbench
Primeiro aplicativo: File Manager

## Decisão de abordagem

Trocar a expansão horizontal simultânea de telas pelo fluxo **um aplicativo principal por vez**. Cada aplicação percorre Planning → Constructions A/B/C/... → Test Review → Documentation & Enclosure. O catálogo compartilhado (`@system-builder/ui-core`, `@system-builder/ui-icons`) é evoluído somente por necessidade comprovada do aplicativo em foco. Um componente novo exige contrato, demonstração no Lab e teste da aplicação consumidora, sem duplicar a implementação.

A conclusão da WP-COMPONENT-CATALOG-COMPLETENESS é uma qualificação delimitada de fundação; não representa paridade completa com shadcn ou prontidão de todos os componentes. Preserve explicitamente SOURCE_ONLY, LAB_PROVEN, EDITOR_READY, DEFERRED e UNPROVEN.

## Objetivos e limites

1. Concluir um **File Manager utilizável e visualmente coeso**, com comportamento de desktop, antes de promover outro aplicativo ao papel principal.
2. Padronizar toolbars, menus, ícones, navegação, panes e inspeção; reutilizar `ui-core` e `ui-icons` em todas as ferramentas.
3. Manter Station como cliente/apresentação. O armazenamento local de artefatos e o modelo de revisões já existentes não são substituídos; autoridade canônica e decisões de negócio pertencem ao Core onde aplicável.
4. Fazer o Component Lab evoluir como laboratório/registro de componentes consumidos e seus estados de qualificação, não como segunda equipe de criação de telas independentes.
5. Avançar ao Component Editor somente após o File Manager superar os gates. Depois, avançar aos Studios um a um.

Não objetivos deste programa: sistema de arquivos remoto real, substituição de Windows/Linux Explorer, docking de janelas flutuantes sem contrato, edição arbitrária de formatos, execução de ações de negócio no preview, expansão indiscriminada de bibliotecas upstream.

## Baseline de código em 2026-10-13

- `apps/station/web/app/station-file-manager-workbench.tsx`: pastas, navegação e árvore própria, grade/lista, seleção, painel de propriedades, importação, abertura, revisões e diff.
- `apps/station/web/app/station-artifact-workspace.ts`, `station-workspace-revisions.ts`, `station-revision-diff.tsx`: contratos atuais de armazenamento/revisão.
- `packages/ui-core/navigation-tree.tsx`: componente de árvore compartilhado com seleção controlada e expansão local; compatibilidade funcional deve ser demonstrada antes de substituir a árvore do File Manager.
- `packages/ui-core/workstation.tsx`, `industrial.ts`: primitives de split, dock, toolbar e filtro. `@system-builder/ui-icons`: tokens sem CDN/runtime.
- `apps/station/web/app/station-editor-workbench.tsx`: Editor já possui draft/history/inspector/preview e roundtrip qualificado para três campos; usar como predecessor futuro, não reescrever.

## Governança serial

Somente **um WP de aplicação ativo em Construction**. Pesquisa curta e atualização de documentação sobre aplicativos seguintes são permitidas, mas nada de grandes sprints de implementação em paralelo. Para cada WP: WBS aprovada, tarefas derivadas após revalidação de `main`, PRs incrementais com commits, exatidão de HEAD nos testes, sete workflows quando aplicáveis, merge não destrutivo, teste manual visual em 390px e desktop, QA e documentação. Gates verdes são necessários, não suficientes: provar comportamento, aparência, usabilidade e persistência.

Novas capacidades reutilizáveis ganham contrato e evidência no Component Lab, e são testadas no File Manager antes de promoção. Se uma API compartilhada demandar migração incompatível, registrar decisão/ADR e versionar.

## Sequência do programa

- **APP-01 File Manager:** aplicar UX integrada e encerrar aplicação. É o NOW.
- **APP-02 Component Lab:** auditar componentes ausentes, melhorar catálogo/estados, acessibilidade e exemplos de uso real. Só entra em Construction após APP-01.
- **APP-03 Component Editor:** ampliar biblioteca editável, slots/layout/Inspector/preview/templates, sem perturbar canonical graph/history.
- **APP-04 Studios:** fila individual por Studio (Process, Workflow, UI e outros conforme inventário atualizado), um por vez, mantendo cross-studio Process Context sem mistura de autoridade.
- **APP-05 Integration/Production Review:** jornadas cruzadas quando os aplicativos necessários estiverem qualificados; não significa publicar em Core automaticamente.

## Definition of Done por aplicativo

- Fluxos de usuário aceitos, inclusive estados vazios/loading/erro/conflito.
- Identidade visual do tema atual, compact/normal, keyboard/focus, tooltips acessíveis, 390px e desktop.
- Nenhum dado existente perdido; testes de gravação/reabertura, concorrência/conflitos, migração e histórico aplicáveis.
- Matriz de testes unitários/produto, browser Playwright, a11y e visual com evidência vinculada.
- Documentação, limitações, relatório final e PR(s) integrados na `main`.
- Só encerrar quando os critérios se verificarem no aplicativo real, não apenas no Component Lab.

## Regra de mudança de foco

Se um bloqueio externo aparecer, registrar impedimento e concluir o trabalho seguro restante dentro do mesmo WP. Não saltar para outro aplicativo por conveniência. Uma intervenção de segurança/CI pode interromper o trabalho, mas deve ficar visível no registro de governança.
