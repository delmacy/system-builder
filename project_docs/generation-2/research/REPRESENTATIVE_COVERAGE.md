# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Previous capability coverage remains authoritative in the corresponding dossiers and state history; this ledger is append-oriented as research advances.

## AI-native Engineering / Agents / Approvals coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| OpenAI Responses / Agents platform | DEEP | Explicit tool-mediated agent architecture and provider/model separation. | Exact approval/tool governance primitives and model revision provenance. |
| Anthropic Claude Code permissions / auto mode | DEEP | Concrete default approval, sandbox and classified permission boundary demonstrates intent/authority separation. | Classifier evidence, policy revision and safe delegated-authority envelopes. |
| GitHub Copilot cloud/coding agents | DEEP | Delegated task/session, policy enablement, PR/review, security validation, signed commits and audit/session provenance. | Automation authority, workflow-run approval and cross-agent provider replacement. |
| LangGraph durable execution / HITL | PARTIAL | Durable checkpoint and interrupt/resume are useful evidence for agent-specific human-in-loop orchestration. | Primary-source checkpoint identity, replay and state migration semantics. |
| Temporal durable execution | DEEP | Durable history/replay provides strong boundary for deterministic orchestration around nondeterministic/probabilistic activities. | AI-specific activity retry/idempotency and external side-effect evidence. |

## Developer / Operator Experience / Self-hosting coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| Backstage Catalog / Software Templates / TechDocs | DEEP | Separates catalog ownership/discovery and golden-path scaffolding from runtime authorization; docs-as-code demonstrates portable operator/developer knowledge near code. | Permission framework, template execution evidence and portable handoff integration. |
| GitHub Codespaces / Dev Containers | DEEP | Repository-defined repeatable environment, explicit realization lifecycle and recommended-secret declarations provide strong definition-vs-realization evidence. | Dev Container specification portability outside hosted Codespaces and rebuild/migration evidence. |
| Kubernetes administration / diagnostics | DEEP | Explicit node health, operator debug authority, upgrade backups and recovery mechanics show diagnostics/recovery are governed operations. | Support bundle conventions, cluster backup completeness and delegated operator roles. |
| Coolify self-hosted lifecycle | DEEP | Concrete self-host install/update/backup/restore boundaries reveal control-plane-vs-application state separation and recovery prerequisites. | Export/migration portability, rollback evidence and managed-workload recovery scope. |
| Nix Flakes / devShell | DEEP | Declarative reproducible environment inputs establish a strong provider-independent concept of development-environment definition versus realization. | Cross-platform realization, lock/update evidence and interaction with devcontainer-style manifests. |

Historical representative coverage for prior capabilities is preserved in prior dossiers/state; no earlier status is superseded by this compact ledger update.
