# Legacy Reuse Map — TASK-001 Decision

Evidence baseline: `delmacy/gestaotecnica@2fb3691cbfd0ba19c4a64ce054fc99e90d5e4200`. This is a decision map for future extraction tasks, not an authorization to bulk copy.

| Legacy area | Target | Initial class |
|---|---|---|
| `src/platform/actions` | `packages/actions` / runtime-core | ADAPT |
| `src/platform/events` | shared/runtime event contracts | ADAPT |
| `src/platform/contracts` | future `packages/contracts` inputs | ADAPT |
| `src/platform/blueprints` | Recipe/Design/Catalog depending on semantics | ADAPT |
| `src/platform/registry` | SB-05 Catalog | ADAPT |
| `src/platform/capabilities` | capability SDK/catalog | ADAPT |
| `src/platform/workflows` / `flows` | workflow/runtime-core | ADAPT |
| `src/modules/*` | remain in client until audited individually | CLIENT_ONLY |
| `src/adaptations/secao-tecnica/*` | Gestão Técnica client repository/domain | CLIENT_ONLY |
| `src/platform/kernel.ts` | Assembly/runtime composition concepts only | RETIRE/REWRITE |
| `.agent/tasks/task-contract.md` | new task contract information model | REUSE |
| `.agent/policies/model-routing.md` | harness model routing | ADAPT |
| `.agent/policies/sprint-lifecycle.md` | task/milestone lifecycle | ADAPT |
| GitHub Actions AI factory and `src/agent-work/**` | historical reference only for M0 | RETIRE |
| architecture validation scripts | `tooling/agent-harness` gates | ADAPT |

The detailed file-level evidence and cautions are recorded in `GESTAOTECNICA_LEGACY_AUDIT.md`. Each future extraction requires its own task, target public contract and tests.
