# Automation Sprint Handoff

status: READY
worker_slot: :10
started_at: 2026-08-24T15:08:50-03:00
updated_at: 2026-08-24T15:16:30-03:00
lease_until: 2026-08-24T15:16:30-03:00
observed_main_sha: 39eb4e71149b7c857a2534e61a1395a1c99f0a5a
active_branch: task/TASK-257-P13-OFFLINE-FUNCTIONAL-RUNTIME-PROOF
active_pr: 298
active_head_sha: 821dedfc276ac68a433354dbb912b48267a0c2c1
last_completed_step: Recovered TASK-257 from two deterministic validation failures. First fixed the invalid top-level LocalMigrationApplication.status assertion. Deterministic CI #679 then exposed shared-Postgres test-state collision: TASK-257 and predecessor p13-runtime-services-e2e used identical entity/process/record IDs, producing duplicate key on ticket-main and cross-test failures. Isolated only the TASK-257 fixture with unique entity/action/process/transition/job/event/file/integration and record IDs while preserving the same proven workflow route and runtime semantics. New exact head 821dedfc276ac68a433354dbb912b48267a0c2c1. Deterministic CI #680 and Heavy Product Tests #105 are in progress. PR #298 is authoritative into the Sprint; PR #299 remains validation-only and must never be merged. No blocking review threads were present on #298 at the prior head.
next_authorized_step: Revalidate PR #298/#299 at exact head 821dedfc276ac68a433354dbb912b48267a0c2c1 and Deterministic CI #680 / Heavy Product Tests #105. If either fails, diagnose and repair only inside TASK-257 allowed paths, preferring fixture/test isolation over product changes unless evidence proves a product defect. If both PASS and there is no blocker, close PR #299 without merge, squash-merge PR #298 into sprint/P13-RUNTIME-OFFLINE-AUTONOMY-01 with expected-head protection, record the TASK-257 authoritative commit, then create TASK-258 branch exactly from that Sprint commit and execute only TASK-258. Construction B/C, TD-P13-01..04 and new provider/topology remain out of scope.

## Operational model-selection instruction
All TASKs are executed with strong models. `model_tier` is retained only for task-schema compatibility and is not execution routing.

## resume_prompt
Retome delmacy/system-builder em main 39eb4e71149b7c857a2534e61a1395a1c99f0a5a. Construction A sprint/P13-RUNTIME-OFFLINE-AUTONOMY-01 contém TASK-254..256 integradas em 7a7dcb12e0b42c333486408b9f82631d7d4d38c0. TASK-257 está no PR autoritativo #298 e PR validation-only #299, branch task/TASK-257-P13-OFFLINE-FUNCTIONAL-RUNTIME-PROOF, head exato 821dedfc276ac68a433354dbb912b48267a0c2c1. CI #678 falhou por assert de tipo inexistente e foi corrigido; CI #679 revelou colisão real de fixture no Postgres compartilhado com p13-runtime-services-e2e, corrigida isolando IDs da TASK-257 sem alterar produto ou predecessor. Deterministic CI #680 e Heavy #105 estão em andamento. Se ambos PASS e sem blocker, feche #299 SEM merge e faça squash de #298 com expected-head na Sprint; registre o commit autoritativo e só então inicie TASK-258 a partir dele. Não absorva Construction B/C, TD-P13-01..04 ou nova arquitetura/provider/topologia.