# Escopo — AI Gateway

## Inclui
Provider adapters, capability abstraction, routing, quotas/cost metadata, prompt/context envelopes, structured output validation e policy hooks.

## Não inclui
Compiler/runtime obrigatório dependente de IA ou lógica empresarial escondida em prompts.

## Entradas
Requests de elicitation/análise/sugestão e provider configuration.

## Saídas
Responses estruturadas, metadata de modelo/custo e evidência de execução.

## Critério de conclusão
Trocar provider não exige alterar contratos centrais do negócio e falha de IA não quebra caminhos determinísticos.