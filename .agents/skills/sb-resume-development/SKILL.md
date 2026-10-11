---
name: sb-resume-development
description: Retomar ou diagnosticar desenvolvimento interrompido do System Builder/Station em delmacy/system-builder. Usar quando o usuário disser continue, travou, onde paramos ou pedir status de um WP, Sprint, TASK ou PR desse projeto.
---
# Retomar desenvolvimento do System Builder

## Reconstruir a verdade atual
1. Identificar o ambiente e o acesso disponível. Descobrir ferramentas antes de assumir um conector ou executar comandos. Respeitar o computador, worktree e branch explicitamente escolhidos na sessão.
2. Ler AGENTS.md e instruções dos diretórios envolvidos. Seguir a ordem atual de leitura; localizar docs/DOCUMENT_AUTHORITY.md, docs/contracts/CONTRACT_INDEX.md e docs/current/NEXT_WORK.md. Se caminhos mudarem, procurar com rg ou busca do conector.
3. Ler autoridades citadas pelo ponteiro, WP, Sprint, TASK, todos os context_paths aplicáveis e contratos/ADRs. Tratar histórico e memória como pistas, nunca como estado atual.
4. Observar main, branch/HEAD, PRs abertos e predecessores integrados. Em checkout local, conferir status, diff, worktrees, processos e locks pelo protocolo vigente. Preservar alterações de outros workers; recuperar locks apenas pelo procedimento documentado.
5. Relacionar checks ao SHA exato e à base atual. Distinguir em execução, aprovado, falhou e não observado. Consultar logs da falha antes de diagnosticar; não repetir uma ação com efeitos enquanto seu resultado estiver pendente.

## Decidir e continuar
- Classificar a interrupção: implementação pendente; falha de teste; CI em execução; conflito; lock; acesso indisponível; encerramento/merge pendente; pacote já encerrado.
- Reconhecer autorizações existentes de commits, merges e execução do WP. Continuar ações necessárias dentro delas sem pedir confirmação repetida.
- Para código pendente, seguir sb-execute-work-package; para prova visual, seguir sb-validate-station se disponíveis. Se ausentes, seguir diretamente as regras atuais do repositório.
- Para PR pronto, conferir diff, limites da TASK, evidências, estado de revisão e todos os gates exigidos. Integrar apenas quando autorizado, usando SHA esperado; verificar depois o merge e main.
- Se WP já encerrou, informar a conclusão e o próximo trabalho elegível. Não iniciar um WP apenas porque aparece em forecast.
- Se faltar acesso, preservar o trabalho e informar exatamente o que foi observado e o que falta verificar. Não afirmar que há execução em segundo plano.

## Relatar
Responder em português: resultado, WP/TASK/PR e SHA relevante, provas observadas, impedimento concreto e próximo passo. Diferenciar IMPLEMENTED_ON_SPRINT_BRANCH, CI_PASS e MERGED; usar PROVEN/UNPROVEN por comportamento. Nunca inventar contagens, causa do travamento ou testes locais.

## Manter a skill estável
Usar o repositório como autoridade de escopo e estado. Não gravar aqui números de WP, versões da stack, HEADs ou locks transitórios. Não tratar esta skill como autorização de operações.
