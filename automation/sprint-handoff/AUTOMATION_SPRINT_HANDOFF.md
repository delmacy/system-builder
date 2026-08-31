# Automation Sprint Handoff

machine_state: ADVISORY_NEXT_10
next_worker: :10
last_worker: :50
sequence: 334
updated_at: 2026-08-31T22:53:33.497Z
active_pr: null
active_branch: null
active_head_sha: null
deterministic_ci: success
heavy_product_tests: success
last_event: WORKER_OBSERVATION
reason: State-machine v3 migration after PR #528 merge. Recurring-worker coordination is non-blocking: STATE/next_worker/owner/phase/claim/lease are telemetry only; live GitHub Actions plus exact PR/head and latest TASK evidence determine whether to inspect, repair or advance. Clear any legacy claim/lease state and persist OBSERVING telemetry.

## Authority

No state-machine field grants or denies permission to work. next_worker is scheduling telemetry only. Each recurring worker decides whether to mutate by revalidating live GitHub Actions, the exact PR/head, the latest materialized TASK and its required workflow evidence.
