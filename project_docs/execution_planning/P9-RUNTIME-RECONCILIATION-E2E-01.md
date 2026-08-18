# P9-RUNTIME-RECONCILIATION-E2E-01 — Runtime Restart Reconciliation

Status: PASS / FINAL_CI_PASS / READY_FOR_HUMAN_REVIEW
Base: `34379b744661468d8f3575facdbb6ed7140f8470`
Branch: `sprint/P9-RUNTIME-RECONCILIATION-E2E-01`
Package: `P9-PACKAGE-01`
Milestone: M10

## Sprint Goal

Prove bounded Deploy-owned restart reconciliation: after a controlled shutdown of the single-host manager, a fresh manager reconstructs durable deployment authority and durable Release/Artifact state, rematerializes exactly the authoritative Runtime, and restores autonomous health without Builder/Observe.

## Predecessor gate

PASS. `P9-ACTIVE-RUNTIME-PROMOTION-01` merged through PR #195 at `34379b744661468d8f3575facdbb6ed7140f8470`; final CI #362 PASS.

## TASK results

1. TASK-125 `e8d19463bf39ab7270d2dc07f6a4e14a3f1412b9` — CI #365 PASS.
2. TASK-126 `56e68c4e4def1645749fe865362eaf06590dc6ff` — CI #366 PASS.
3. TASK-127 `3121e632766a81f1ff3c025b0c09510feae305a6` — CI #367 PASS.

Pre-code materialization CI #363 PASS.

## Growing package proof achieved

`durable Catalog -> Assembly -> Validation -> Compiler -> durable Release/Artifact -> managed A -> authority A -> accepted B promotion -> authority B -> stale C + failed D retention -> controlled manager shutdown -> fresh authenticated Deploy/Release/Artifact reconstruction -> fresh manager rematerializes B -> B health UP with Builder/Observe unavailable`

## Reference restart model

The proof remains intentionally bounded:
- old manager owns and explicitly stops its managed Runtime before shutdown;
- deployment authority, Release and Artifact payload remain durable;
- fresh manager starts with no in-memory process state;
- fresh manager reconstructs durable active B and matching reconstructed Release/Artifact evidence;
- reconciliation rematerializes only authoritative B;
- no generic process discovery, PID scan, unmanaged-process adoption, external service manager or traffic topology is introduced.

## Final validation

Run repository-wide `npm run verify` through GitHub Deterministic CI on the closure head. If PASS, verify PR scope/reviews, promote the single Sprint PR to human Sprint Review and stop.

## Stop / escalation

Do not materialize the P9 Integration & Technical Debt Review or any successor package until this Sprint passes human review, merges and `main` is freshly reconstructed.
