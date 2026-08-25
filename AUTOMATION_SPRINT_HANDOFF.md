# Automation Sprint Handoff

status: READY
worker_slot: :10
started_at: 2026-08-24T23:11:59-03:00
updated_at: 2026-08-24T23:16:30-03:00
lease_until: 2026-08-24T23:16:30-03:00
observed_main_sha: bb733323ea7918032a1de6632814c6d172c52093
active_branch: sprint/P14-EVIDENCE-PROVENANCE-CONTRACT-01
active_pr: 328
active_head_sha: 16a726882a9b530f55d4be1c33309f11eccec9dc
last_completed_step: Revalidated TASK-268 exact head cdc18632055b6e485cac9a819214bb0183a9331c with Deterministic CI #709 PASS and Heavy Product Tests #134 PASS; closed validation-only PR #327 without merge. Executed TASK-269 in dependency order as one atomic authoritative commit 16a726882a9b530f55d4be1c33309f11eccec9dc on sprint/P14-EVIDENCE-PROVENANCE-CONTRACT-01. TASK-269 adds optional provider-neutral correlationRef/locationHint semantics to non-artifact source references while preserving sourceId/sourceType identity, keeping ArtifactEnvelope provenance.inputs authoritative for artifact inputs, rejecting ambiguous duplicate sourceId values and malformed optional references, and requiring no provider/storage identifiers or secret values. Opened validation-only draft PR #328. Deterministic CI #710 and Heavy Product Tests #135 are in progress on the exact head.
next_authorized_step: Revalidate PR #328 exact head 16a726882a9b530f55d4be1c33309f11eccec9dc and runs Deterministic CI #710 / Heavy Product Tests #135. If both PASS and there is no blocker/head drift, close #328 WITHOUT MERGE, retain 16a726882a9b530f55d4be1c33309f11eccec9dc as authoritative TASK-269 commit, and execute TASK-270 next in dependency order. If a gate fails, diagnose and apply only bounded TASK-269 fixes, reconstructing a single authoritative TASK-269 commit if required. Do not execute TASK-271+, promote Construction B/C, implement WBS 14.3, or absorb TD-P13-01..04.

## Operational model-selection instruction
All TASKs are executed with strong models. `model_tier` is retained only for task-schema compatibility and is not execution routing.

## resume_prompt
Retome delmacy/system-builder em main bb733323ea7918032a1de6632814c6d172c52093, Construction A na branch sprint/P14-EVIDENCE-PROVENANCE-CONTRACT-01. TASK-267 está concluída no commit d7057ad7a19c293052b7f992732995f29c03f038. TASK-268 está concluída no commit cdc18632055b6e485cac9a819214bb0183a9331c com CI #709 e Heavy #134 PASS; PR #327 foi fechado sem merge. TASK-269 foi executada como commit autoritativo único 16a726882a9b530f55d4be1c33309f11eccec9dc; PR #328 é validation-only/draft e NÃO deve ser mergeado. CI #710 e Heavy #135 estão em andamento no head exato. Se ambos PASS, fechar #328 sem merge e executar somente TASK-270. TASK-269 adiciona correlationRef/locationHint opcionais e provider-neutral aos sources, mantém sourceId/sourceType como identidade/kind, rejeita duplicatas ambíguas e referências opcionais malformadas, não cria provider/storage dependency e não toca provenance.inputs core de ADR-0009. Construction B/C, WBS 14.3 e TD-P13-01..04 permanecem fora de escopo.