# Automation Sprint Handoff

machine_state: NEXT_CONF
next_worker: conformance
claimed_by: null
claim_until: null
sequence: 112
updated_at: 2026-08-30T10:01:50Z
active_pr: null
active_branch: null
active_head_sha: null
deterministic_ci: success
heavy_product_tests: success
last_event: LEASE_TICK
reason: CLAIM_EXPIRED_RECOVERED

## Authority

Only next_worker selects who may work. Claims, CI, PR metadata and reasons are advisory context and must never create a permanent queue lock.
