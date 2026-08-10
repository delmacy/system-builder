# Codex Kickoff — TASK-001

Use this only for the first engineering-bootstrap session after TASK-000 is on the default branch.

---

You are the engineering lead for the initial System Builder bootstrap.

This repository is the official source of truth. Assume you have no useful context from prior chats.

First read:

1. `AGENTS.md`
2. `ARCHITECTURE.md`
3. `docs/product/PRODUCT_VISION.md`
4. `docs/architecture/MASTER_BLUEPRINT.md`
5. all accepted `docs/adr/*`
6. `docs/current/PROJECT_STATE.md`
7. `docs/current/CURRENT_MILESTONE.md`
8. `docs/migration/GESTAOTECNICA_LEGACY_AUDIT.md`
9. `specs/tasks/TASK-001-CODEX-BOOTSTRAP.md`

Your mission is TASK-001, not feature development.

Audit the old `delmacy/gestaotecnica` implementation before proposing migration. Reuse good concepts/code/tests, but do not clone its old coupling into this repository.

Build the minimum local-first, agent-agnostic engineering harness and monorepo scaffold necessary for safe future work. The normal future implementation executor will be OpenCode using free/cheap models on the maintainer's desktop; design tasks/context/gates to make that reliable. Codex is the bootstrap/architecture/gatekeeper tier, not the default high-volume coder.

Do not create dashboards, RAG/vector databases, cloud agent services, complex orchestration, Kubernetes or product features during bootstrap.

When architecture is ambiguous, propose an ADR rather than inventing a hidden decision.

Finish with deterministic validation evidence, an updated project state and the next ordered task queue with model tiers.

---
