---
name: sb-validate-station
description: Validar interfaces e jornadas reais do Station/System Builder, investigar regressões visuais ou produzir evidências de um incremento. Usar para testes no navegador, Save/Discard, janelas, editor, catálogo, File Manager e prova de integração desse projeto.
---
# Validar Station com evidências

## Preparar a prova
- Ler a autoridade atual, TASK e contratos dos módulos afetados. Identificar SHA/build, ambiente, URL, origem de storage, predecessor e critérios de aceitação.
- Usar comandos e ferramentas de navegador disponíveis e documentadas; consultar a skill específica da ferramenta quando aplicável. Não assumir sessão autenticada ou acesso ao desktop.
- Executar primeiro as verificações exigidas pela TASK. Construir uma matriz enxuta de comportamento, entrada/ação, resultado esperado e evidência.
- Derivar limites e compatibilidade do código/contrato atual. Não fixar aqui limites, payloads ou números de testes.
- Usar dados sintéticos e contexto isolado para cenários de falha. Preservar dados do usuário; não limpar perfil/browser storage ou arquivos reais para facilitar o teste.

## Exercitar jornadas reais
Selecionar os cenários aplicáveis ao incremento, sem atribuir capacidades que ainda não existem:
- Shell: abrir, focar, minimizar/restaurar, maximizar, mover/redimensionar, fechar/reabrir; verificar bounds e área útil.
- Editor: produzir composição pelo módulo real; selecionar na árvore, editar no Inspector e conferir Preview; provar Apply/Restore e Save/Discard conforme contratos vigentes.
- Histórico: conferir Undo/Redo, identidade, campos, descendentes e visibilidade relevantes, incluindo interação com retenção.
- Workspace: salvar cópia, navegar pastas/arquivos, inspecionar, exportar/importar arquivo real e reabrir no editor. Conferir proteção de draft sujo e handoff consumido.
- Falhas: dados inválidos/corrompidos, incompatibilidade, quota/acesso negado, snapshot obsoleto e operação assíncrona obsoleta; provar que estado anterior e bytes retidos sobrevivem conforme contrato.
- Interação: teclado real e foco visível, viewport estreita, mensagens compreensíveis e lifecycle de janelas quando afetados.

## Registrar e julgar
- Fazer assertions sobre o resultado real, não apenas clique aceito, toast ou screenshot. Vincular export/import ao arquivo efetivamente gerado.
- Corrigir seletores defeituosos mantendo o significado das assertions. Não alterar produto ou suavizar critérios só para acomodar um teste.
- Distinguir IMPLEMENTED, PROVEN, UNPROVEN e MERGED. Prova exige execução observada; PR body e relatos anteriores são evidência declarada, não execução local observada.
- Quando usar CI, conferir SHA e workflow/job, conclusão e logs necessários. Não extrapolar aprovação em Chromium para navegadores/plataformas não executados.
- Registrar no relatório autorizado: cenário, SHA/build, ambiente, comando/workflow, contagem observada, resultado, falha e limitação. Executar regressão adicional somente quando mudança, falha ou preocupação concreta justificar.
- Gerar screenshot/vídeo de execução real quando solicitado ou útil; identificar build e jornada. Não usar imagem gerada para certificar a interface implementada. Persistir conforme regras atuais de arquivos e privacidade.

## Corrigir ou entregar
Corrigir falhas dentro dos limites da TASK e repetir as provas afetadas. Se o contexto for somente validação, preparar a correção para revisão antes de modificar escopo não autorizado. Relatar o que passou, o que falhou, o que ficou sem prova e impacto prático; não declarar produção pronta a partir de uma demonstração.
