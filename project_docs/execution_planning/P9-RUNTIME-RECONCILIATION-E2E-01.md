# P9-RUNTIME-RECONCILIATION-E2E-01 — Runtime Restart Reconciliation

Status: COMMITTED / PRE_CODE_CI_PENDING
Base: `34379b744661468d8f3575facdbb6ed7140f8470`
Branch: `sprint/P9-RUNTIME-RECONCILIATION-E2E-01`
Package: `P9-PACKAGE-01`
Milestone: M10

## Sprint Goal

Prove bounded Deploy-owned restart reconciliation: after a controlled shutdown of the single-host manager, a fresh manager reconstructs durable deployment authority and durable Release/Artifact state, rematerializes exactly the authoritative Runtime, and restores autonomous health without Builder/Observe.

## Predecessor gate

PASS. `P9-ACTIVE-RUNTIME-PROMOTION-01` merged through PR #195 at `34379b744661468d8f3575facdbb6ed7140f8470`; final CI #362 PASS.

## Committed TASKs

1. TASK-125 — authoritative Runtime reconciliation API and positive predecessor proof.
2. TASK-126 — reconciliation fail-closed/retention safety.
3. TASK-127 — durable Factory/Release/Artifact/Deploy restart E2E evidence.

## Growing package proof at exit

`durable Factory output -> managed A -> authority A -> accepted B promotion -> authority B -> stale/failed contender retention -> controlled manager shutdown -> fresh authenticated authority/Release/Artifact reconstruction -> fresh manager rematerializes B -> B health UP with Builder/Observe unavailable`

## Reference restart model

This Sprint does not discover arbitrary external processes. The manager restart boundary is controlled:
- old manager owns and explicitly stops its in-memory managed Runtime before shutdown;
- durable deployment authority, Release and Artifact payload remain persisted;
- fresh manager has no in-memory process state;
- fresh manager reconstructs the durable active DeploymentRecord;
- caller supplies the matching reconstructed PublishedRelease, ReleaseArtifact, verified payload reader and EnvironmentProfile from existing durable repositories;
- reconciliation verifies authority/evidence identity and starts only the authoritative Runtime.

## Final validation

`npm run verify` through GitHub Deterministic CI.

## Stop / escalation

Stop immediately if completing the goal requires generic PID/process discovery, an external process/service manager, load balancer, DNS/reverse proxy, Kubernetes/container scheduler, fleet/cloud topology, shared canonical infrastructure contract, edits to `packages/contracts/**`, or Builder/Runtime L4 topology changes.

## Non-goals

P9 package review, production SecretResolver, TLS certificate hardening, Observe publication, multi-host/fleet orchestration, external traffic switching, production-readiness declaration.
