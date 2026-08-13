# I1 Exit Gate — Single Task Autonomous

Decision: **GO**

Assessed: **2026-08-13**

Integrated baseline: `21674b34c55fa024cdc360802065e76ab97fa08d`

All mandatory checks passed:

- [x] machine task/dependency/evidence/state contracts validated — TASK-012 and the 109-test repository verification on the integrated baseline;
- [x] DAG cycle/missing-predecessor/readiness tests pass — TASK-014 tests and TASK-023 full verification;
- [x] Task Pack reproducible and bounded — TASK-015 tests and the proof's `task_pack_sha256`;
- [x] model route deterministic for supported low-risk task — TASK-016 tests and proof route `SELECTED`;
- [x] OpenCode noninteractive execution healthy — TASK-013 plus proof assertion `PROMPT_MODEL_FILE`, `--pure`, bounded agent and controlled successful runner;
- [x] harness enforces repository/path/command boundaries — TASK-017 tests and proof controlled scope violation;
- [x] independent validation cannot be bypassed by executor output — TASK-018 and proof failure decision `FAIL` after adapter success;
- [x] evidence receipt persisted and schema-valid — TASK-019 and the committed I1 proof receipt;
- [x] GitHub branch/PR/check lifecycle traceable — TASK-020 plus implementation PR #52 and state-closure PR #53 with successful named `validate` checks;
- [x] DONE requires verified evidence — TASK-021 legal-transition tests and proof transition to `DONE` from accepted PASS evidence;
- [x] successor READY queue recomputed deterministically — TASK-022 and proof `newly_ready: [TASK-901]`;
- [x] controlled failure leaves task FAILED/BLOCKED without corrupting ledger — proof execution `BLOCKED`, validation `FAIL`, evidence/ledger rejected, task and graph preserved;
- [x] one representative low-risk System Builder task completes through the full path — TASK-023 composes the actual I1 component APIs for TASK-900 and its implementation/state PRs are integrated.

## Evidence index

- Machine proof: `docs/evidence/agentfactory/i1/I1PROOF-974820449e4976808d8fec2846083b9d20f2ee6a9587d74dce0cc70e9481fce7.json`.
- Proof task verification and state evidence: `docs/evidence/tasks/TASK-023.json`.
- Component task evidence: `docs/evidence/tasks/TASK-012.json` through `docs/evidence/tasks/TASK-022.json` for applicable I1 tasks.
- GitHub implementation lifecycle: PR #52, merged as `e2668be5ed9a98284cd9079555d0d67216262bad`, named check `validate` passed.
- GitHub state closure: PR #53, merged as `21674b34c55fa024cdc360802065e76ab97fa08d`, named check `validate` passed.
- Final local gate audit: `npm run verify` passed with 109/109 tests, 24 validated task specifications, architecture gates and build.

## Gate conclusion

The proof replaces manual reconstruction of the I1 component chain with one deterministic coordinator and a machine-readable receipt. It does not grant model merge authority or start sequential scheduling. I1 is accepted; I2 remains separate rolling-wave work and was not started by this gate decision.

After I1, proceed to I2 only if the proof reduces manual execution effort rather than merely adding orchestration complexity.
