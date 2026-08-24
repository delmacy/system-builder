# Automation Sprint Handoff

status: READY
worker_slot: :50
started_at: 2026-08-24T13:50:04-03:00
updated_at: 2026-08-24T14:10:30-03:00
lease_until: 2026-08-24T14:10:30-03:00
observed_main_sha: 39eb4e71149b7c857a2534e61a1395a1c99f0a5a
active_branch: task/TASK-257-P13-OFFLINE-FUNCTIONAL-RUNTIME-PROOF
active_pr: none
active_head_sha: 7a7dcb12e0b42c333486408b9f82631d7d4d38c0
last_completed_step: TASK-254 and TASK-255 were integrated into sprint/P13-RUNTIME-OFFLINE-AUTONOMY-01 as b746ea8bd1ff8e8ae001e5b0d9acc83c889f551c and 03d0908806edc15fba1a1691bc1160c8a62f7605. TASK-256 exact head b2a4d81454ee8e9d7aeff2d8e481a60e2071bdd8 passed Deterministic CI #676 and Heavy Product Tests #101 with no blocking review threads. Validation-only PR #297 was closed without merge; PR #296 was squash-merged into the Sprint with authoritative TASK-256 commit 7a7dcb12e0b42c333486408b9f82631d7d4d38c0. Created task/TASK-257-P13-OFFLINE-FUNCTIONAL-RUNTIME-PROOF exactly from that Sprint head; no TASK-257 product change has been made yet.
next_authorized_step: Execute only TASK-257 from 7a7dcb12e0b42c333486408b9f82631d7d4d38c0. Prove representative entity/API/action/workflow and job/event/file/integration behavior using local RuntimeModel/configuration with Builder/Observe unavailable; missing local/external binding must fail explicitly, secret values must not appear in evidence, and no provider/topology/public contract/service class may be introduced. Allowed paths packages/runtime-core/**, tests/product/** and TASK-257 spec. Run exact-head CI/Heavy and integrate only if all gates pass. Do not start TASK-258 before TASK-257 integrates; Construction B/C and TD-P13-01..04 remain out of scope.

## Operational model-selection instruction
All TASKs are executed with strong models. `model_tier` is retained only for task-schema compatibility and is not execution routing.

## resume_prompt
Retome delmacy/system-builder em main 39eb4e71149b7c857a2534e61a1395a1c99f0a5a. Construction A Sprint `sprint/P13-RUNTIME-OFFLINE-AUTONOMY-01` está em 7a7dcb12e0b42c333486408b9f82631d7d4d38c0, com TASK-254=b746ea8bd1ff8e8ae001e5b0d9acc83c889f551c, TASK-255=03d0908806edc15fba1a1691bc1160c8a62f7605 e TASK-256=7a7dcb12e0b42c333486408b9f82631d7d4d38c0 integradas. A branch `task/TASK-257-P13-OFFLINE-FUNCTIONAL-RUNTIME-PROOF` já existe exatamente nesse base e ainda não possui mudança de produto. Execute somente TASK-257 conforme o spec: prova funcional representativa offline usando RuntimeModel/configuração local, sem Builder/Observe, sem segredos resolvidos, sem novo provider/topology/contrato/classe de serviço. Depois valide exact-head e integre apenas com CI/Heavy/reviews verdes. Não execute TASK-258+ antes disso; Construction B/C e TD-P13-01..04 permanecem fora de escopo.