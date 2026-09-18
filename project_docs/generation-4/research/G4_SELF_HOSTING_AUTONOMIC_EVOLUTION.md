# G4 — Self-Hosting, Autonomic Control & Bounded Self-Evolution

Status: `RESEARCH_BACKLOG_ONLY`
Execution authority: NONE

## Thesis

The System Builder may eventually model, observe, diagnose, build, validate, release and upgrade itself through the same governed lifecycle used for client systems.

`System Builder can model System Builder`.

But:

`Self-managing != unrestricted self-modifying` and `Self-model != root authority`.

## Proposed trust layering

```text
ROOT / CONSTITUTIONAL TRUST
  constitution/invariants
  trust keys
  audit root
  release verifier
  recovery authority
          |
          v
BOOTSTRAP SUPERVISOR
          |
          v
SB NODE DAEMON / CONTROLLERS
          |
          v
BUILDER + MANAGED WORKLOADS
```

The layer that mutates ordinary Builder/product state must not be able to unilaterally rewrite the authority that governs that mutation.

## Mutability zones

- Zone 0 — Root/Constitution: ordinary self-write never; external governed authority only.
- Zone 1 — Core architecture: self-proposal only; governance approval required.
- Zone 2 — Product implementation: bounded self-change only after tests/proofs/gates/rollout/rollback.
- Zone 3 — Configuration/projections/optimization: progressively automatable when blast radius and reversibility permit.

## Self-change lifecycle

Do not overwrite running code.

```text
Finding -> Change Candidate -> impact analysis -> isolated branch/workspace
-> implementation -> tests/proofs -> build -> signed candidate artifact
-> shadow/canary -> health/effect verification -> promote OR rollback
```

Mutation means a new revision, not live code surgery.

## A/B generation and golden recovery

```text
Slot A: Builder vN      ACTIVE
Slot B: Builder vN+1    CANDIDATE
```

Promotion occurs only after verification. Preserve a known-good recovery generation independent of the current candidate.

`Current Generation != Golden Recovery Generation`.

A self-healing system requires a recovery path outside the potentially damaged subsystem.

## Supervisor/daemon role

A minimal supervisor should focus on lifecycle primitives: install generation, verify hash/signature/provenance, activate generation, health/proof checks, switch A/B slot, rollback, restart, reboot/recovery coordination and evidence preservation. It should not contain the whole Builder intelligence.

A small native/Rust realization is a future candidate only after requirements and threat model justify it.

## Control-plane update

Research replacement of the SB daemon/control plane while keeping autonomous client runtimes alive where possible.

`Control Plane Upgrade != Client Runtime Restart`.

The constitutional/bootstrap layer should remain smaller and more stable than the Builder it upgrades.

## Autonomy levels

0. Observe self.
1. Diagnose/findings.
2. Propose changes.
3. Materialize candidate branch/patch/tests.
4. Verify automatically.
5. Apply bounded low-risk self-change under policy.
6. Fully autonomous evolution — research only, not assumed desirable.

Prefer long operation at levels 3–5 before considering level 6.

## Adversarial cases

- Builder breaks its own compiler.
- Builder changes the authority protecting it.
- Control-plane update cannot rollback.
- Bad migration prevents recovery by the old generation.
- Observer is disabled by the component being observed.
- Self-update enters a loop.
- Candidate corrupts canonical state.
- Verifier depends on the component being replaced.
- Known-good generation is lost.
- Reboot is ACKed but host never returns.
- Control plane is unavailable while client runtimes are healthy.

## Proof obligations

1. Ordinary Builder cannot alter root trust unilaterally.
2. Every self-change creates a new revision/artifact.
3. Candidate can be tested independently from active generation.
4. Rollback path is verified before promotion.
5. Audit/evidence cannot be silently disabled by candidate.
6. Known-good recovery remains reachable after failed update.
7. Database/schema migration compatibility is explicit.
8. Control-plane failure does not break published runtime autonomy.
9. Self-diagnosis does not create self-change authority.
10. Builder can represent its own lifecycle without one-off semantic hacks.

## Architectural interpretation

The long-term product may resemble an enterprise/operational control substrate rather than an operating-system kernel. It remains above Linux/Windows/cloud/container runtimes and manages systems, deployments, data, workflows, authority and evidence rather than CPU scheduling, virtual memory or device drivers.
