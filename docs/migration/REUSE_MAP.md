# Legacy Reuse Map — Initial Hypothesis

This is a starting hypothesis for Codex audit, not an implementation authorization.

| Legacy area | Target | Initial class |
|---|---|---|
| `src/platform/actions` | `packages/actions` / runtime-core | ADAPT |
| `src/platform/events` | shared/runtime event contracts | ADAPT |
| `src/platform/contracts` | `packages/contracts` | REUSE/ADAPT |
| `src/platform/blueprints` | Recipe/Design/Catalog depending on semantics | ADAPT |
| `src/platform/registry` | SB-05 Catalog | ADAPT |
| `src/platform/capabilities` | capability SDK/catalog | ADAPT |
| `src/platform/workflows` / `flows` | workflow/runtime-core | ADAPT |
| `src/modules/*` | reusable software capabilities | audit individually |
| `src/adaptations/secao-tecnica/*` | Gestão Técnica client repository/domain | CLIENT_ONLY |
| `src/platform/kernel.ts` | Assembly/runtime composition concepts only | RETIRE/REWRITE |
| `.agent/tasks/*` | new task contract inspiration | ADAPT |
| `.agent/policies/model-routing.md` | harness model routing | REUSE/ADAPT |
| `.agent/policies/sprint-lifecycle.md` | task/milestone lifecycle | ADAPT |
| GitHub Actions AI factory | later remote orchestration reference | DEFER |
| architecture validation scripts | `tooling/agent-harness` gates | REUSE/ADAPT |

Codex TASK-001 must turn this hypothesis into evidence-backed inventory before any substantial migration.
