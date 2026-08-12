# WBS Dictionary — padrão mestre

O WBS Dictionary é a ponte entre a decomposição de escopo e o backlog executável.

## Identificador
`WP-<capitulo>.<grupo>.<item>-<sequencia>`

## Template obrigatório
```yaml
work_package: WP-XX.X.X-A
parent_wbs: XX.X.X
name: <nome>
status: NOW | ARCHITECTURAL_HOOK | PLANNED | RESEARCH
objective: <resultado verificável>
in_scope: []
out_of_scope: []
inputs: []
outputs: []
predecessors: []
interfaces: []
downstream_consumers: []
acceptance_criteria: []
required_evidence: []
risks: []
notes: []
```

## Regras
1. Work Package é unidade de escopo controlável; task é unidade de execução.
2. Sprint agenda tasks; não altera parentage da WBS.
3. Dependência deve apontar para capability/artefato necessário, não apenas para número de sprint.
4. Se não houver conhecimento para definir acceptance/evidence, usar Planning Package e refinar depois.
5. Nenhum agente executor deve inventar predecessor ou interface ausente; deve bloquear/escalar.
