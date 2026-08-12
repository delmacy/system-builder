# Resource & Agent Management Plan

## Recursos
- Human architect/product authority
- Planner/reviewer AI
- Coding agents/models
- GitHub Actions/CI
- Preview/staging/prod environments
- Database/storage/external providers

## Agent classes
- Architect/planner: pode propor contracts/ADRs; não executa mudança constitucional sem aprovação.
- Implementer: executa WP/task delimitada; não inventa arquitetura.
- Reviewer: verifica diff contra scope/contracts/evidence.
- Integrator: valida interfaces e vertical path.

## Assignment rule
Escolher modelo por risco/complexidade, não por módulo inteiro. Trabalho determinístico e bem especificado pode ir a modelo barato; arquitetura, breaking changes e ambiguous gaps exigem modelo/revisão mais forte.

## Capacity
Planejamento de sprint futuro deve considerar capacidade de CI, limites de paralelismo, custo/token/API e capacidade humana de review como recursos finitos.
