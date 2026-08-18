# Sprint Starter Prompt — reutilizável e atualizado a cada sprint

Este arquivo é a fonte do prompt a colar em uma nova sessão ao iniciar cada sprint. **Atualize-o ao encerrar cada sprint** (veja "Regra de atualização" ao final).

---

## 1. Template reutilizável

```
Você está atuando como executor de sprint no repositório delmacy/system-builder
(em C:\Users\admin\system-builder). O repositório é a fonte da verdade; não
confie em histórico de chat nem em memória.

## Leitura obrigatória, nesta ordem
1. docs/current/PROJECT_STATE.md
2. docs/current/CURRENT_MILESTONE.md
3. docs/current/NEXT_WORK.md
4. project_docs/schedule/SPRINT_GENERATION_POLICY.md
5. project_docs/schedule/SPRINT_MODE.md
6. AGENTS.md (invariantes constitucionais + Sprint Mode)
7. O pacote de sprint ativo (project_docs/execution_planning/<PACKAGE>.md)
8. A definição do sprint ativo e o relatório do sprint anterior
9. Cada spec de TASK a executar (specs/tasks/TASK-<N>-*.md) e seus context_paths
10. docs/architecture/MASTER_BLUEPRINT.md quando arquitetura estiver envolvida

## Sprint a executar
- Pacote: <PACKAGE_ID> (ex.: P9-RUNTIME-RECONCILIATION-E2E-01)
- Branch: sprint/<SPRINT_ID>
- PR: <PR_NUMBER>
- Milestone: <MILESTONE>
- TASKs em ordem de dependência: <TASK-125, TASK-126, TASK-127>
- Base: <SHA do main reconstruído> (merge do sprint anterior)

## Regras de execução
- Siga estritamente o Sprint Mode: um commit por TASK, na ordem de dependência.
- Antes de editar, confirme allowed_paths, forbidden_paths, max_files,
  dependências e comandos de validação de cada TASK.
- Execute somente o escopo do sprint/TASK; descobertas fora de escopo vão para
  backlog, não para o trabalho corrente.
- Não escreva diretamente em main; um sprint = um branch + um PR.
- Rode as validações declaradas de cada TASK antes de avançar.
- Não inicie o próximo sprint sem autorização explícita.
- Validação objetiva: npm run verify via GitHub Deterministic CI (GH Actions).
  Não declare teste local não observado.

## Gate de fechamento
1. CI determinístico no head de fechamento.
2. Confirmar que o PR contém só: materialização + implementação/evidência dos
   TASKs + arquivos de fechamento + docs/current atualizados.
3. Atualizar docs/current/PROJECT_STATE.md, CURRENT_MILESTONE.md e NEXT_WORK.md.
4. Promover a revisão humana do sprint e PARAR. Não mesclar automaticamente.
5. Ao final, entregue o prompt preenchido para a PRÓXIMA sprint (pacote, branch,
   base, TASKs) para colar em nova sessão.
```

---

## 2. Instância atual (preenchida) — próxima sprint

```
Sprint a executar: P10-PRODUCTION-SECRETRESOLVER-01 (1ª construction Sprint do
P10-PACKAGE-01, direção A) — COMMITTED. Gate de pré-requisito: materialização P10
mesclada; main reconstruído; autorização explícita para construção.
Base: <SHA do main reconstruído após o merge da materialização P10>
Direção selecionada: A — Production SecretResolver + TLS/server-identity hardening
(TD-P4-05/TD-P8-02).
Escopo desta Sprint: SecretResolver produtivo (TD-P4-05) — provedores replaceables
process-environment/file-backed, fail-closed, sem vazamento de valor, prova de
integração managed-Runtime. TASKs em ordem de dependência: TASK-128, TASK-129, TASK-130.
Fora de escopo (escalado): TD-P8-02 (positive TLS verification) — NÃO construir;
exige ADR L3/L4-adjacente aceito por humano antes de qualquer construção TLS.
Pendência de governança: nenhuma construção P10 sem materialização mesclada, main
reconstruído e autorização explícita desta Sprint.
```

---

## 3. Histórico de sprints fechadas

| Pacote | PR | Head | TASKs |
|--------|----|------|-------|
| P9-ACTIVE-RUNTIME-PROMOTION-01 | #195 | 34379b7 | TASK-122, 123, 124 |
| P9-RUNTIME-RECONCILIATION-E2E-01 | #196 | a559d1a | TASK-125, 126, 127 |
| P9 Integration & Technical Debt Review | #198 | 6662c64 | revisão + skeleton P10 |
| P9 corretivo SCRAM/TLS | #197 | 898a14f | consolidação transportes (TD-P6-01/TD-P8-02) |
| P10 materialização | — | 0d805f3 | seleção direção A + manifesto + TASK-128/129/130 specs |

*(Sprints anteriores a P9 Sprint 2 são preservados no `main`; registre aqui conforme encerrar cada sprint.)*

---

## 4. Notas de governança ativas

- **PR #196 (sprint/P9-RUNTIME-RECONCILIATION-E2E-01)** — P9 Sprint 3. MESCLADO em `a559d1a`; CI final PASS.
- **PR #197 (sprint/CORRECTION-INFRA-01)** — corretivo traceável (crash Postgres overwrite + consolidação SCRAM/TLS + env config, cross-context). MESCLADO em `898a14f`; head rebasado `0f4161a`; Deterministic CI run `32097697770` validate PASS. Alinhado a `TD-P6-01`/`TD-P8-02` (este permanece aberto: positive TLS verification ainda não provado).
- **PR #198 (review/P9-PACKAGE-01-integration-debt)** — P9 Integration & Technical Debt Review. MESCLADO em `6662c64`; heads validate PASS (runs `32097890123`, `32097982545`, `32098073415`). Reclassifica `TD-P4-06`/`TD-P7-02`/`TD-P6-01`/`TD-P8-02` + novos `TD-P9-01`/`TD-P9-02`; verifica que nenhuma topologia externa/fleet foi absorvida; materializa apenas skeleton `P10-PACKAGE-01`.
- **P10 materialização** — `P10-PACKAGE-01` COMMITTED; direção **A** selecionada (Production SecretResolver + TLS hardening) a partir de evidência integrada; 1ª construction Sprint `P10-PRODUCTION-SECRETRESOLVER-01` (manifesto + TASK-128/129/130 `ready`) materializado em `sprint/P10-PACKAGE-01-materialization`. Nenhuma construção P10 antes do merge da materialização + main reconstruído + autorização explícita.
- **TD-P8-02 (positive TLS verification)** — dívida aberta; mudança de política de verificação de identidade de servidor é L3/L4-adjacente e exige ADR aceito por humano antes de qualquer construção TLS. Não inventar dentro de Sprint.

---

## Regra de atualização (a cada sprint)

Ao encerrar uma sprint (gate de fechamento):
1. Mover a sprint concluída para a seção "Histórico de sprints fechadas".
2. Repreenchimento da "Instância atual" com o próximo pacote/branch/base/TASKs.
3. Atualizar as "Notas de governança" (ex.: status do PR #197, dívidas reclassificadas).
4. Confirmar que docs/current/* refletem o novo estado antes de entregar o prompt.
