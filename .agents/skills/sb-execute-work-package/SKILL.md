---
name: sb-execute-work-package
description: Planejar ou executar um Work Package autorizado do System Builder/Station com Sprints, TASKs, commits, testes, PRs e encerramento. Usar para pedidos como faça o WP, conclua a Sprint ou continue a implementação nesse projeto.
---
# Executar Work Package do System Builder

## Admitir a execução
- Reconstruir estado atual conforme sb-resume-development, se disponível, e a cadeia de autoridade vigente de delmacy/system-builder.
- Confirmar o WP solicitado e autorização da sessão. Separar autorização de execução/merge de prontidão técnica: autorização não torna forecast executável.
- Ler WP/Sprint/TASK, context_paths, documentação dos módulos, WBS e contratos/ADRs aplicáveis. Confirmar allowed_paths, forbidden_paths, max_files, dependências e comandos de validação antes de escrever.
- Derivar a cadência da política atual. Aplicar Planning, Construction A/B, C quando justificada, Integration & Review, Documentation & Closure somente enquanto essa cadência estiver vigente.
- Materializar apenas o próximo Sprint elegível após predecessor integrado e revalidação de main. Não criar escopo com planos ou uma skill.

## Construir incrementos
1. Inspecionar alterações pendentes e adquirir exclusividade conforme protocolo atual. Preservar trabalho alheio e utilizar o ambiente/branch autorizado; não escrever diretamente em main.
2. Declarar um objetivo observável e prova de integração com o predecessor real. Usar a implementação existente para produzir artefatos de teste, evitando fixtures que substituam o módulo que se pretende provar.
3. Implementar somente a TASK comprometida. Atualizar documentação e evidências necessárias dentro de seus limites.
4. Verificar comportamentos positivos, entradas inválidas, limites e regressões relevantes. Derivar valores de fronteira dos limites reais; incluir abaixo/no limite/acima onde necessário.
5. Executar validações declaradas e corrigir falhas dentro do escopo. Não remover assertions, pular testes ou reduzir gates para conseguir aprovação.
6. Criar um commit autoritativo por TASK e uma branch/PR por Sprint conforme política vigente. Usar argumentos estruturados ou body-file em descrições; conferir diff antes de publicar.
7. Acompanhar CI do SHA exato e prova da base/candidato requerida. Registrar resultado e logs relevantes; se validação local for limitada pelo ambiente, não chamá-la de PASS.
8. Integrar somente com autorização vigente, revisão aplicável e todos os gates exigidos aprovados. Usar SHA esperado e conferir main após o merge.
9. Revalidar main e elegibilidade antes de promover o próximo Sprint, sem exceder o WP autorizado.

## Revisar e encerrar
- Revisar integração ponta a ponta, compatibilidade, contratos, limites Station/Core/Host e Builder/Runtime, dependências, riscos, dívida e desempenho relevante.
- Promover Construction C apenas quando evidências atuais mostrarem necessidade para o objetivo do WP. Não esconder funcionalidade atrasada em Review ou Closure.
- Reconciliar os documentos exigidos pela política atual, incluindo o único ponteiro de execução e relatórios. Registrar limitações com responsável/próxima disposição quando definidos.
- Declarar WP encerrado apenas após integração validada da Closure e consistência da memória do repositório.
- Entregar resultado, PRs/SHAs relevantes, testes observados e residual. Não certificar todo Station/Editor/WBS a partir de um incremento limitado.

## Tratar impedimentos
Continuar correções rotineiras dentro da autorização. Para conflito real de autoridade, expansão de escopo, mudança contratual/arquitetural não admitida ou operação irreversível não autorizada, preparar evidência e decisão concreta antes de escalar. Não contornar rejeições automáticas por outro canal; explicar ação rejeitada e motivo observado. Nunca pedir aprovação baseada apenas em risco hipotético.

## Separar procedimento de autoridade
Não alterar regras do repositório, contratos, gates ou permissões por esta skill. Não programar recorrências ou delegar agentes por padrão; essas ações exigem autorização aplicável.
