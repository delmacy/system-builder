# I1 Exit Gate — Single Task Autonomous

I1 is GO only when all mandatory checks pass:

- [ ] machine task/dependency/evidence/state contracts validated;
- [ ] DAG cycle/missing-predecessor/readiness tests pass;
- [ ] Task Pack reproducible and bounded;
- [ ] model route deterministic for supported low-risk task;
- [ ] OpenCode noninteractive execution healthy;
- [ ] harness enforces repository/path/command boundaries;
- [ ] independent validation cannot be bypassed by executor output;
- [ ] evidence receipt persisted and schema-valid;
- [ ] GitHub branch/PR/check lifecycle traceable;
- [ ] DONE requires verified evidence;
- [ ] successor READY queue recomputed deterministically;
- [ ] controlled failure leaves task FAILED/BLOCKED without corrupting ledger;
- [ ] one representative low-risk System Builder task completes through the full path.

After I1, proceed to I2 only if the proof reduces manual execution effort rather than merely adding orchestration complexity.
