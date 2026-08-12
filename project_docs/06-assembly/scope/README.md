# Escopo — Assembly

## Inclui
Resolução de capabilities, versões, dependências, adapters, componentes, migrations e conflitos; geração da Bill of Materials.

## Não inclui
Compilar binários, fazer deploy ou decidir regras de negócio.

## Entradas
SystemDefinition, Software Catalog e políticas de compatibilidade.

## Saídas
AssemblyPlan reproduzível com resolução completa ou erros explícitos.

## Critério de conclusão
A mesma definição/catalog snapshot produz a mesma composição lógica.