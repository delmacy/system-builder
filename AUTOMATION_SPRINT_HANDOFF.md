# Automation Sprint Handoff

status: READY
worker_slot: :50
started_at: 2026-08-24T14:51:16-03:00
updated_at: 2026-08-24T14:57:00-03:00
lease_until: 2026-08-24T14:57:00-03:00
observed_main_sha: 39eb4e71149b7c857a2534e61a1395a1c99f0a5a
active_branch: task/TASK-257-P13-OFFLINE-FUNCTIONAL-RUNTIME-PROOF
active_pr: 298
active_head_sha: aa16e628674f22697e2421c2a6330ec60b6cc64d
last_completed_step: Revalidated main and TASK-257. Deterministic CI #677 failed on head 42217ab4c39fa295ac8da2a2ad7ec5421df1fc30 for two proof-fixture mismatches: generated entity tables were not migrated before HTTP execution, and the negative proof expected a missing external-service binding to fail at startup although existing Runtime semantics validate it at integration use. Heavy Product Tests #102 had passed. Corrected only tests/product/p13-offline-functional-runtime-proof.test.ts within TASK-257 scope: apply the bundle's verified generated PostgreSQL migrations using the existing deploy migration preflight/applier before representative entity/action/workflow/job/event execution, and prove omitted service:notify fails explicitly at /integrations/integration:notify use without Builder/Observe fallback or secret leakage. New exact head aa16e628674f22697e2421c2a6330ec60b6cc64d. Deterministic CI #678 and Heavy Product Tests #103 are IN_PROGRESS on this exact head. PR #298 remains authoritative; PR #299 remains validation-only and must not be merged.
next_authorized_step: Revalidate PR #298/#299 exact head aa16e628674f22697e2421c2a6330ec60b6cc64d and runs Deterministic CI #678 / Heavy Product Tests #103. If a gate fails, diagnose and correct only within TASK-257 allowed paths under the destravamento rule. If both PASS and no blocking review/thread exists, close #299 without merge, squash-merge #298 into sprint/P13-RUNTIME-OFFLINE-AUTONOMY-01 with expected-head protection, record the authoritative TASK-257 commit, then continue in declared dependency order with TASK-258 only after that integration. Construction B/C, TD-P13-01..04 and any new provider/topology remain out of scope.

## Operational model-selection instruction
All TASKs are executed with strong models. `model_tier` is retained only for task-schema compatibility and is not execution routing.

## resume_prompt
Retome delmacy/system-builder em main 39eb4e71149b7c857a2534e61a1395a1c99f0a5a. Construction A Sprint sprint/P13-RUNTIME-OFFLINE-AUTONOMY-01 contém TASK-254..256 integradas em 7a7dcb12e0b42c333486408b9f82631d7d4d38c0. TASK-257 está no PR autoritativo #298, branch task/TASK-257-P13-OFFLINE-FUNCTIONAL-RUNTIME-PROOF, head exato aa16e628674f22697e2421c2a6330ec60b6cc64d. O CI #677 anterior falhou porque a prova não aplicava migrations geradas antes do uso da API e esperava validação de service binding no startup; isso foi reconciliado estritamente na prova usando preflightVerifiedMigrations/applyVerifiedPostgresMigrations e falha explícita no ponto de uso da integração. Deterministic CI #678 e Heavy Product Tests #103 estão IN_PROGRESS nesse head. PR #299 é validation-only e NÃO deve ser mergeado. Se ambos os gates passarem e não houver blocker, feche #299 sem merge e squash-merge #298 com proteção do head; só então avance TASK-258 em ordem de dependência. Não absorva Construction B/C, TD-P13-01..04 ou nova arquitetura/provider/topologia.