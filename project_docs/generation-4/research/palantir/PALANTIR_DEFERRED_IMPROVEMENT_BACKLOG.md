# Palantir-Derived Deferred Improvement Backlog

Date: 2026-09-23
Status: `DEFERRED_IMPROVEMENTS / POST-VISUAL`
Source corpus: `project_docs/generation-4/research/palantir/**`

## Sequencing directive

The current product priority is the **Station visual/application environment**. Palantir-derived findings remain research inputs and deferred improvements. They MUST NOT expand the immediate implementation scope, trigger new Core/Agent/infra refactors, or displace the visual milestone unless a finding exposes a correctness/security blocker for the visual work itself.

Research may continue. Implementation promotion is deferred until the visual milestone is materially established and a separate planning gate explicitly promotes an improvement.

Invariant: `Research finding != immediate implementation != new Work Package != authority to refactor Core/Agent`.

## Deferred improvements

| ID | Improvement candidate | Source pattern | Why useful to SB | Priority after visual | Promotion gate |
|---|---|---|---|---|---|
| IMP-PAL-001 | Host Agent secure enrollment with host/Core identity, certificate rotation, revocation, recovery and clone detection | Apollo outbound Agent + environment certificate | Strengthens remote-host control without normalizing inbound root/SSH administration | HIGH | Host Agent planning |
| IMP-PAL-002 | Outbound-only authenticated Agent channel as preferred remote-control topology | Apollo Agent connectivity | Reduces exposed host attack surface and supports NAT/private networks | HIGH | Host Agent/connectivity architecture |
| IMP-PAL-003 | Explicit ChangePlan + Constraints contract before host mutation | Apollo Plan + Constraints | Makes deployment/host changes revision-pinned, auditable and rejectable when stale | HIGH | Core-to-Agent command planning |
| IMP-PAL-004 | Model connectivity separately from health/currentness | Apollo environment connection modes | Prevents offline from being misclassified as failed | MEDIUM | Agent/Observe model |
| IMP-PAL-005 | Staged release channels, cohort ramp-up, recall and bounded blast radius | Apollo release channels | Improves deployment safety and fleet rollout | HIGH | Deployment hardening |
| IMP-PAL-006 | Separate Host Execution capability from Connectivity/Tunnel capability | Data Connection thin proxy vs worker | Supports least privilege | MEDIUM | Host Agent architecture review |
| IMP-PAL-007 | Typed generated SDKs over stable semantic identities | OSDK | Improves developer experience without exposing Core internals | MEDIUM | SDK/tool-platform planning |
| IMP-PAL-008 | Enforce semantic identity != API/display/provider name | OSDK/interface evolution | Avoids brittle installs and identity coupling | HIGH | Contract/versioning review |
| IMP-PAL-009 | Cross-resource isolated change set / branch model | Global Branching | Supports coordinated edits without fake global atomicity | MEDIUM | Change-governance planning |
| IMP-PAL-010 | Dependency-graph-aware package/install closure | Marketplace dependencies | Strengthens installation and uninstall safety | MEDIUM | Application Manager/package planning |
| IMP-PAL-011 | Explicit external-effect reconciliation | webhook/writeback failure semantics | Reinforces UNKNOWN, effect identity and reconciliation | HIGH | Effect/reconciliation hardening |
| IMP-PAL-012 | AI action execution scoped to explicit principal and human review | AIP Logic / Pilot | Reinforces AI inference != authority | HIGH | AI/Agent execution planning |
| IMP-PAL-013 | Propagate classification/security metadata through derived data, AI context/output, logs, traces and evidence | AIP observability/security caveats | Prevents restricted source data leaking through derived artifacts/telemetry | HIGH | Security/data-governance hardening |
| IMP-PAL-014 | Multidimensional probabilistic Evals | AIP Evals | Improves AI qualification without scalar safety collapse | MEDIUM | AI product-proof planning |
| IMP-PAL-015 | Formal portability/exit proof suite | platform-centric portability comparison | Makes anti-lock-in testable | HIGH | Portability/product-proof phase |
| IMP-PAL-016 | Air-gap update bundle semantics and stale-policy horizons | Apollo Payload Bundler | Supports disconnected installations safely | MEDIUM | Offline/edge planning |
| IMP-PAL-017 | Agent self-update/version-skew/compromise recovery model | version-stale metrics + maintenance windows | Separates freshness from compatibility/admissibility | MEDIUM | Fleet/Agent hardening |
| IMP-PAL-018 | Preserve reported != observed != effective | Reported State | Prevents UI from presenting reports as proof | HIGH | Visual observability surfaces |
| IMP-PAL-019 | Co-versioned developer workspace without collapsing Recipe/Definition/artifact boundaries | SuperRepo | Developer workflow convenience | LOW | Developer-experience review |
| IMP-PAL-020 | Generated client apps must not require Builder/Core as backend by default | Foundry-as-backend OSDK model | Preserves runtime autonomy | CONSTITUTIONAL | Continuous architecture conformance |
| IMP-PAL-021 | Relayed/imported state is read-only evidence absent command authority | Relayed from another Hub | Visibility != mutation authority | HIGH | Multi-Core/Agent planning |
| IMP-PAL-022 | Independent host-local egress/target policy Agent cannot rewrite | agent-proxy allowlist + firewall | Limits compromised Agent blast radius | HIGH | Host Agent security hardening |
| IMP-PAL-023 | Explicit maintenance admission and staggered Agent upgrades | upgrade windows | Bounds disruption | MEDIUM | Fleet lifecycle planning |
| IMP-PAL-024 | Model in-flight interruption during Agent restart and reconcile retries/effects | upgrade terminates jobs | Avoids duplicate effects | HIGH | Effect/retry hardening |
| IMP-PAL-025 | Explicit secret/key custody and recovery continuity | agent-worker key migration | Prevents authority cloning/lost provider access | HIGH | Enrollment/secrets architecture |
| IMP-PAL-026 | Declared-state authority independent from connectivity/observation | Environment edit source | Prevents replica silently becoming writer | HIGH | Multi-Core/DR authority planning |
| IMP-PAL-027 | Disconnected import as admission workflow before local ChangePlans | Hub export-import | Bundle possession != execution authority | HIGH | Offline bundle/admission planning |
| IMP-PAL-028 | Artifact availability distinct from release metadata availability | metadata-only bundle | Prevents false executable state | MEDIUM | Release artifact/offline planning |
| IMP-PAL-029 | Emergency takeover as explicit audited authority transition | edit-source takeover | Prevents implicit split-brain writers | HIGH | DR/break-glass governance |
| IMP-PAL-030 | Enrollment/bootstrap authority distinct from resource edit/use authority | Agent creation permissions | Prevents perpetual bootstrap privilege | HIGH | Host Agent enrollment/RBAC planning |
| IMP-PAL-031 | Provider credentials bound to explicit executor recipients | recipient encryption | Prevents silent secret inheritance | HIGH | Secrets/provider credential architecture |
| IMP-PAL-032 | Bundle signing is one proof dimension, not admission verdict | Bundle signing | Signature != currentness/destination/approval | HIGH | Offline bundle/admission planning |
| IMP-PAL-033 | Retryability/idempotency/reconciliation as provider contract dimensions | Actions/Automate effect semantics | Prevents duplicate irreversible effects | HIGH | Effect/reconciliation hardening |
| IMP-PAL-034 | Preview/branch/simulation defaults to no production effects | Branch Actions | Preserves projection != canonical truth | HIGH | Station preview/effect-authority design |
| IMP-PAL-035 | Derived-observability classification policy must conservatively cover every data class a workflow can reach and be requalified when reach changes | AIP/Ontology log markings are explicitly configured and are not inherited from executor/input/accessed data | Prevents prompts, completions, object values and user inputs from leaking through under-classified telemetry | HIGH | Security/observability governance |
| IMP-PAL-036 | Separate workflow execution authority, telemetry-inspection authority and telemetry-policy administration/export authority | AIP observability log-access requirements | Prevents ability to run or edit a workflow from silently becoming blanket access to derived sensitive telemetry | HIGH | Observe/RBAC architecture |

## Immediate visual-work implications

Only representational constraints directly relevant to Station may be consumed now. Existing requirements remain: currentness/evidence distinct from effective truth; connectivity distinct from health; AI suggestion distinct from authorization/effect; semantic identity distinct from display/API names; relayed/imported state distinct from live/direct authority; version freshness distinct from readiness; imported bundles represented through transfer/admission/application states; signature validity distinct from currentness/approval; preview effects visibly suppressed/attempted/observed.

This round adds two representation constraints only: future observability surfaces should distinguish `may execute` from `may inspect telemetry`, and any log/trace/search surface whose absence could be interpreted as proof should expose relevant freshness/retention scope. These are not implementation promotions.

No finding in the current round establishes a correctness/security blocker that requires displacing the Station visual milestone.

## Promotion rule

A deferred improvement moves to executable scope only after: (1) visual/Station milestone evidence exists; (2) fresh repository state is revalidated; (3) deduplication against existing SB contracts; (4) impact/dependency analysis; and (5) explicit Planning & Materialization creates bounded authority.

Until then, all entries are `DEFERRED_IMPROVEMENT`.