# Palantir-Derived Deferred Improvement Backlog

Date: 2026-09-23
Status: `DEFERRED_IMPROVEMENTS / POST-VISUAL`
Source corpus: `project_docs/generation-4/research/palantir/**`

## Sequencing directive

The current product priority is the **Station visual/application environment**. Palantir-derived findings remain research inputs and deferred improvements. They MUST NOT expand the immediate implementation scope, trigger new Core/Agent/infra refactors, or displace the visual milestone unless a finding exposes a correctness/security blocker for the visual work itself.

Research may continue. Implementation promotion is deferred until the visual milestone is materially established and a separate planning gate explicitly promotes an improvement.

Invariant:

```text
Research finding
  != immediate implementation
  != new Work Package
  != authority to refactor Core/Agent

Visual Station milestone
  -> review deferred improvements
  -> prioritize
  -> materialize only selected items
```

## Deferred improvements

| ID | Improvement candidate | Source pattern | Why useful to SB | Priority after visual | Promotion gate |
|---|---|---|---|---|---|
| IMP-PAL-001 | Host Agent secure enrollment with host/Core identity, certificate rotation, revocation, recovery and clone detection | Apollo outbound Agent + environment certificate | Strengthens remote-host control without normalizing inbound root/SSH administration | HIGH | Host Agent planning |
| IMP-PAL-002 | Outbound-only authenticated Agent channel as preferred remote-control topology | Apollo Agent connectivity | Reduces exposed host attack surface and supports NAT/private networks | HIGH | Host Agent/connectivity architecture |
| IMP-PAL-003 | Explicit ChangePlan + Constraints contract before host mutation | Apollo Plan + Constraints | Makes deployment/host changes revision-pinned, auditable and rejectable when stale | HIGH | Core-to-Agent command planning |
| IMP-PAL-004 | Model connectivity separately from health/currentness: CONNECTED / INTERMITTENT / EXPECTED_OFFLINE / RELAYED | Apollo environment connection modes | Prevents offline from being misclassified as failed and preserves stale/unknown semantics | MEDIUM | Agent/Observe model |
| IMP-PAL-005 | Staged release channels, cohort ramp-up, recall and bounded blast radius | Apollo release channels | Improves deployment safety and fleet rollout | HIGH | Deployment hardening |
| IMP-PAL-006 | Separate Host Execution capability from Connectivity/Tunnel capability, even if initially shipped in one daemon | Apollo Agent + Data Connection Agent split | Avoids one oversized privileged Agent and supports least privilege | MEDIUM | Host Agent architecture review |
| IMP-PAL-007 | Typed generated SDKs over stable semantic identities | OSDK | Improves Station/app/tool developer experience without exposing Core internals | MEDIUM | SDK/tool-platform planning |
| IMP-PAL-008 | Enforce `semantic identity != API/display/provider name` and explicit remapping/version coexistence | OSDK/API-name and interface evolution cases | Avoids brittle cross-environment installs and accidental identity coupling | HIGH | Contract/versioning review |
| IMP-PAL-009 | Cross-resource isolated change set / branch model for coordinated system edits | Global Branching | Useful for Recipe/SystemDefinition/schema/UI/workflow coordinated edits without pretending global atomicity | MEDIUM | Change-governance planning |
| IMP-PAL-010 | Dependency-graph-aware package/install closure | Marketplace dependencies | Strengthens capability/app installation, prerequisites and uninstall safety | MEDIUM | Application Manager/package planning |
| IMP-PAL-011 | Explicit external-effect reconciliation when provider effect and canonical commit/observation diverge | webhook/writeback failure semantics | Reinforces UNKNOWN, effect identity, reconciliation and non-transactional external effects | HIGH | Effect/reconciliation hardening |
| IMP-PAL-012 | AI action execution remains scoped to user/project authority and can require human review | AIP Logic / Pilot | Reinforces `AI inference != authority` with operational execution boundaries | HIGH | AI/Agent execution planning |
| IMP-PAL-013 | Propagate classification/security metadata through derived data, AI context/output, logs, traces and evidence | AIP observability/security caveats | Prevents protected source data from leaking through derived artifacts/telemetry | HIGH | Security/data-governance hardening |
| IMP-PAL-014 | Probabilistic behavior qualification with multidimensional Evals, never one scalar safety score | AIP Evals | Improves AI feature qualification without hiding critical failures | MEDIUM | AI product-proof planning |
| IMP-PAL-015 | Formal portability/exit proof suite for Recipe, SystemDefinition, source, artifact, data, runtime and operations | Palantir platform-centric portability comparison | Converts SB anti-lock-in into testable evidence rather than an architectural slogan | HIGH | Portability/product-proof phase |
| IMP-PAL-016 | Air-gap/disconnected update bundle semantics and explicit stale-policy/security horizons | Apollo disconnected environments | Supports remote/offline installations without silently treating old policy as current | MEDIUM | Offline/edge planning |
| IMP-PAL-017 | Agent self-update/version-skew/compromise recovery model | Apollo operational maturity gap benchmark | Needed before large remote fleets | MEDIUM | Fleet/Agent hardening |
| IMP-PAL-018 | Preserve `reported != observed != effective` in host/deployment state surfaces | Reported State | Prevents UI/operations from presenting agent reports as proof of business effect | HIGH | Visual observability surfaces |
| IMP-PAL-019 | SuperRepo-style co-versioned developer workspace only as authoring convenience, without collapsing Recipe/Definition/artifact boundaries | SuperRepo | Could improve developer workflow while preserving SB semantic separation | LOW | Developer-experience review |
| IMP-PAL-020 | Maintain autonomous client runtime as an explicit divergence: generated client apps must not require Builder/Core as backend by default | Foundry-as-backend OSDK model | Preserves core SB anti-lock-in/runtime-autonomy objective | CONSTITUTIONAL | Continuous architecture conformance |

## Immediate visual-work implications

Only findings that directly constrain the Station visual layer may be consumed now:

1. UI must show **currentness and evidence** instead of treating reported state as effective truth.
2. Connectivity state and health must be different visual concepts.
3. AI-suggested actions must remain visibly distinct from authorized/effective actions.
4. Station surfaces must not encode mutable display/API names as canonical semantic identity.
5. Visual application/tool architecture must keep room for future Host Agent, release-channel, package/dependency and reconciliation surfaces without implementing those backends now.

Everything else remains deferred.

## Promotion rule

A deferred improvement moves to executable scope only after:

1. visual/Station milestone evidence exists;
2. fresh repository state is revalidated;
3. the improvement is deduplicated against existing SB capability/contracts;
4. impact and dependency analysis is performed;
5. explicit Planning & Materialization creates bounded authority.

Until then, all entries are `DEFERRED_IMPROVEMENT`.
