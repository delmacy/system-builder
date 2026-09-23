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
| IMP-PAL-006 | Separate Host Execution capability from Connectivity/Tunnel capability, even if initially shipped in one daemon | Data Connection thin proxy vs worker | Avoids one oversized privileged Agent and supports least privilege | MEDIUM | Host Agent architecture review |
| IMP-PAL-007 | Typed generated SDKs over stable semantic identities | OSDK | Improves Station/app/tool developer experience without exposing Core internals | MEDIUM | SDK/tool-platform planning |
| IMP-PAL-008 | Enforce `semantic identity != API/display/provider name` and explicit remapping/version coexistence | OSDK/API-name and interface evolution cases | Avoids brittle cross-environment installs and accidental identity coupling | HIGH | Contract/versioning review |
| IMP-PAL-009 | Cross-resource isolated change set / branch model for coordinated system edits | Global Branching | Useful for Recipe/SystemDefinition/schema/UI/workflow coordinated edits without pretending global atomicity | MEDIUM | Change-governance planning |
| IMP-PAL-010 | Dependency-graph-aware package/install closure | Marketplace dependencies | Strengthens capability/app installation, prerequisites and uninstall safety | MEDIUM | Application Manager/package planning |
| IMP-PAL-011 | Explicit external-effect reconciliation when provider effect and canonical commit/observation diverge | webhook/writeback failure semantics | Reinforces UNKNOWN, effect identity, reconciliation and non-transactional external effects | HIGH | Effect/reconciliation hardening |
| IMP-PAL-012 | AI action execution remains scoped to user/project authority and can require human review | AIP Logic / Pilot | Reinforces `AI inference != authority` with operational execution boundaries | HIGH | AI/Agent execution planning |
| IMP-PAL-013 | Propagate classification/security metadata through derived data, AI context/output, logs, traces and evidence | AIP observability/security caveats | Prevents protected source data from leaking through derived artifacts/telemetry | HIGH | Security/data-governance hardening |
| IMP-PAL-014 | Probabilistic behavior qualification with multidimensional Evals, never one scalar safety score | AIP Evals | Improves AI feature qualification without hiding critical failures | MEDIUM | AI product-proof planning |
| IMP-PAL-015 | Formal portability/exit proof suite for Recipe, SystemDefinition, source, artifact, data, runtime and operations | Palantir platform-centric portability comparison | Converts SB anti-lock-in into testable evidence rather than an architectural slogan | HIGH | Portability/product-proof phase |
| IMP-PAL-016 | Air-gap/disconnected update bundle semantics and explicit stale-policy/security horizons | Apollo Payload Bundler + disconnected environment modes | Supports remote/offline installations without silently treating old policy as current | MEDIUM | Offline/edge planning |
| IMP-PAL-017 | Agent self-update/version-skew/compromise recovery model | Data Connection version-stale metrics + maintenance windows | Needed before large remote fleets; separates software freshness from compatibility/admissibility | MEDIUM | Fleet/Agent hardening |
| IMP-PAL-018 | Preserve `reported != observed != effective` in host/deployment state surfaces | Reported State | Prevents UI/operations from presenting agent reports as proof of business effect | HIGH | Visual observability surfaces |
| IMP-PAL-019 | SuperRepo-style co-versioned developer workspace only as authoring convenience, without collapsing Recipe/Definition/artifact boundaries | SuperRepo | Could improve developer workflow while preserving SB semantic separation | LOW | Developer-experience review |
| IMP-PAL-020 | Maintain autonomous client runtime as an explicit divergence: generated client apps must not require Builder/Core as backend by default | Foundry-as-backend OSDK model | Preserves core SB anti-lock-in/runtime-autonomy objective | CONSTITUTIONAL | Continuous architecture conformance |
| IMP-PAL-021 | Treat relayed/imported environment state as read-only evidence unless independent command authority exists | Apollo `Relayed from another Hub` | Prevents multi-control-plane visibility from silently becoming mutation authority | HIGH | Multi-Core/Agent planning |
| IMP-PAL-022 | Add independent host-local egress/target policy that the Agent process cannot rewrite | Data Connection local agent-proxy allowlist + host firewall | Limits blast radius if central policy or Agent process is compromised | HIGH | Host Agent security hardening |
| IMP-PAL-023 | Upgrade Host Agents through explicit maintenance admission and staggered redundant cohorts | Data Connection automatic/staggered upgrade windows | Bounds update disruption and fleet blast radius | MEDIUM | Fleet lifecycle planning |
| IMP-PAL-024 | Model in-flight work interruption during Agent upgrade/restart and require retry/effect reconciliation | Data Connection upgrade terminates running jobs | Prevents infrastructure restart from silently duplicating business effects | HIGH | Effect/retry hardening |
| IMP-PAL-025 | Make secret/key custody and recovery continuity explicit in Host Agent identity model | agent-worker local encryption-key migration | Prevents backup/reinstall mechanics from silently cloning authority or losing provider access | HIGH | Enrollment/secrets architecture |
| IMP-PAL-026 | Model declared-state authority independently from connectivity/observation authority and require an explicit authority transition before imported state may become locally editable | Apollo Environment edit source (`Edit on this Hub` / `Edit on another Hub` / `Copy of another Hub`) | Prevents a replica/read-only control plane from silently becoming a writer after partition, failover or bundle import | HIGH | Multi-Core/DR authority planning |
| IMP-PAL-027 | Make disconnected import an admission workflow: validate bundle provenance/currentness, compute proposed changes, require policy/human approval where applicable, then emit local ChangePlans | Apollo Source/Target Hub export-import + import change requests/approvals | Prevents possession or successful parsing of a transferred bundle from becoming execution authority | HIGH | Offline bundle/admission planning |
| IMP-PAL-028 | Preserve artifact availability as a qualified precondition distinct from release metadata availability | Apollo bundles may contain only metadata when Source Hub cannot access artifact store; Target Hub then relies on separately delivered images | Prevents metadata-complete disconnected deployments from being presented as executable when artifact closure is missing | MEDIUM | Release artifact/offline planning |
| IMP-PAL-029 | Treat emergency authority takeover as an explicit, audited authority transition with reconciliation obligations | Apollo `Copy of another Hub` can be reconnected and switched to `Edit on this Hub`; `Edit on another Hub` permits bounded break-glass config | Prevents disaster recovery from normalizing implicit split-brain writers | HIGH | DR/break-glass governance |

## Immediate visual-work implications

Only representational constraints directly relevant to Station may be consumed now:

1. UI must show **currentness and evidence** instead of treating reported state as effective truth.
2. Connectivity state and health must be different visual concepts.
3. AI-suggested actions must remain visibly distinct from authorized/effective actions.
4. Station surfaces must not encode mutable display/API names as canonical semantic identity.
5. Visual application/tool architecture must keep room for future Host Agent, release-channel, package/dependency and reconciliation surfaces without implementing those backends now.
6. Relayed/imported state must be visually distinguishable from live/direct state; visibility must not imply command authority.
7. Software-version freshness must not be collapsed into health/readiness or semantic compatibility.
8. A control-plane surface must distinguish `authoritative/editable`, `upstream-managed`, and `read-only copy`; connectivity alone must not visually imply declared-state authority.
9. A transferred/imported bundle must be represented as pending/proposed/admitted/applied states rather than visually collapsing file arrival into effective deployment.

No finding in the current round establishes a correctness/security blocker that requires displacing the Station visual milestone.

## Promotion rule

A deferred improvement moves to executable scope only after:

1. visual/Station milestone evidence exists;
2. fresh repository state is revalidated;
3. the improvement is deduplicated against existing SB capability/contracts;
4. impact and dependency analysis is performed;
5. explicit Planning & Materialization creates bounded authority.

Until then, all entries are `DEFERRED_IMPROVEMENT`.