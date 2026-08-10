# Gestão Técnica Legacy Audit — 2026-08-10

Source repository: `delmacy/gestaotecnica`.

Evidence baseline: remote `main` commit `2fb3691cbfd0ba19c4a64ce054fc99e90d5e4200`, inspected through the GitHub repository API on 2026-08-10. The maintainer's local checkout was deliberately not used as evidence because it was 28 commits behind and contained unrelated uncommitted work.

## Conclusion

Do **not** start from zero intellectually, and do **not** clone the legacy repository as the new platform.

Treat `gestaotecnica` as a reference quarry containing useful architecture, code, tests and agent-factory experiments. Reuse only after classification and extraction into the new System Builder boundaries.

## Valuable assets found

### Architecture concepts

Legacy `docs/ARCHITECTURE.md` already established useful ideas:

- System Builder platform as immediate focus;
- synthetic demo/client separation;
- modular responsibilities;
- communication through contracts;
- no circular dependencies;
- Registry indexes capabilities;
- Runtime executes published versions only;
- flow `Observed Work -> Process Mirror -> Capability Match -> Enterprise Map -> Adapted Process -> Builder Contract`.

These concepts are compatible with the new blueprint and should be adapted rather than discarded.

### Agent-development assets

Legacy `.agent/` already contains:

- queue/task/sprint concepts;
- bounded task contracts;
- model routing tiers;
- allowed path controls;
- separate deterministic repository-wide validation;
- sprint completion evidence.

The new harness should reuse these lessons while changing the operating topology from GitHub-Actions-first to local-first/OpenCode-first.

### Reusable software candidates

The legacy tree contains promising reusable areas such as:

- platform actions/events/contracts;
- blueprints;
- registry/capabilities;
- workflows/flows;
- modules with manifests/kernel actions;
- database/schema work;
- architecture validation scripts;
- tests.

Every candidate requires a classification audit before copying.

## Evidence-backed inventory

| Area | Evidence on baseline | Class | Decision for System Builder |
|---|---|---|---|
| Compact task metadata | `.agent/tasks/task-contract.md`, `.agent/tasks/task-template.md` | REUSE | Preserve bounded metadata, observable criteria and small scopes in the new repository-backed contract. |
| Model routing | `.agent/policies/model-routing.md` | ADAPT | Preserve risk-based tiers; rename them to provider-neutral `free`, `cheap`, `architecture` and make local OpenCode the normal executor. |
| Cloud AI Factory lifecycle | `.agent/policies/sprint-lifecycle.md`, `.github/workflows/ai-*.yml`, `src/agent-work/**` | RETIRE | Do not migrate the queue database, cloud workers, PR automation or dashboard-shaped operating topology into M0. Retain only task/gate lessons. |
| Scope validation | `scripts/agent/validate-task-scope.mjs` | ADAPT | Reimplement locally with a prepared base commit, tracked plus untracked diff coverage, allowed/forbidden globs and `max_files`. |
| Architecture checks | `scripts/validate-architecture-rules.ts`, `tests/unit/module-boundaries.test.ts`, `tests/unit/registry-boundaries.test.ts` | ADAPT | Keep executable boundary testing, but reject the directory-existence-only gate and avoid accepting known critical violations as a permanent baseline. |
| Action contracts/registry | `src/platform/actions/action-types.ts`, `action-registry.ts`, `contracts/*` | ADAPT | Useful action definition/registry concepts; decouple handler contracts from legacy `WorkspaceContext` and review public versioning before extraction. |
| Canonical events | `src/platform/events/canonical-contract.ts`, `event-writer.ts` | ADAPT | Reuse schema/idempotency ideas; separate the portable event contract from direct Drizzle/database persistence imports. |
| Blueprint package manifest | `src/platform/blueprints/contracts/blueprint-package-manifest.ts` | ADAPT | Preserve version/dependency and secret-rejection ideas; remap semantics across Recipe, Design and Catalog instead of copying the legacy blueprint aggregate. |
| Capability registry | `src/platform/registry/capabilities/schemas.ts`, `lookup.ts` | ADAPT | Preserve lifecycle, manifest and lookup concepts; remove legacy database and workspace assumptions from public catalog contracts. |
| Module manifests | `src/platform/modules/module-manifest.ts`, `manifest-compatibility.ts` | ADAPT | Candidate input for later capability/package resolution, subject to the new SystemDefinition and AssemblyPlan contracts. |
| Workflow contracts/validation | `src/platform/workflows/contracts/*`, `validation/process-graph-validation.ts` | ADAPT | Preserve versioned definition and deterministic graph-validation patterns; split authoring contracts from autonomous runtime execution. |
| Platform kernel | `src/platform/kernel.ts` | RETIRE | Do not copy the central bootstrap. It imports six `src/adaptations/secao-tecnica/flows/*` implementations and registers generic modules/client flows together. Composition must later come from SystemDefinition/AssemblyPlan. |
| Seção Técnica adaptation | `src/adaptations/secao-tecnica/**` | CLIENT_ONLY | Remains in the Gestão Técnica client domain; vocabulary, roles, queues, templates and flows are not factory internals. |
| Feature modules and database schemas | `src/modules/**`, `src/db/**` | CLIENT_ONLY | Keep in the client repository until an individual extraction task proves generic semantics, portability and a target contract. No bulk migration. |
| Contract/unit tests | `tests/unit/action-*.test.ts`, `tests/unit/process-*.test.ts`, `tests/unit/platform/**` | ADAPT | Use as behavior/evidence references when the corresponding new contract is specified; do not copy tests that encode legacy paths or workspace/database assumptions. |
| Gestão Técnica E2E and multi-tenant tests | `tests/e2e/**`, `tests/multi-tenant/**` | CLIENT_ONLY | Retain as client acceptance evidence. Later factory/runtime autonomy tests may invoke the client externally, not absorb these suites. |
| Architecture and capability documentation | `docs/ARCHITECTURE.md`, `docs/capabilities/**`, `docs/agent-work/**` | ADAPT | Mine explicit definitions and lessons task-by-task; the accepted ADRs and Master Blueprint in this repository remain authoritative. |

No legacy source file is authorized for copying by this audit. `REUSE` applies to the compact task-contract information model, not a blanket source migration.

## Critical coupling found

Legacy `src/platform/kernel.ts` directly imports flows from `src/adaptations/secao-tecnica` while also registering generic modules, platform actions, workflows and client flows in one bootstrap.

This violates the new separation because the generic platform kernel knows the client adaptation.

Target correction:

- generic runtime/platform packages expose contracts/registries;
- SystemDefinition/AssemblyPlan determine what a client runtime includes;
- Gestão Técnica-specific flows remain in the client/adaptation domain;
- the compiler/assembler produces a concrete runtime composition without universal packages importing client code.

## Old roadmap limitations

The legacy master plan focused on persistence, vertical slice, workflow, GT, blueprints, governance, integrations and operability. It predates the now-approved explicit chain:

`Mirror -> Recipe -> Analysis -> Design -> Assembly -> Validation -> Compiler -> Release -> Deploy -> Autonomous Runtime`.

The old plan is historical input, not the execution roadmap for this repository.

## Legacy assumptions not automatically inherited

Do not automatically copy:

- one Next.js application for factory + client;
- unified Builder/Runtime database assumptions;
- workspace/multi-tenant choices as universal requirements;
- Jules/Paperclip-specific agent policies;
- GitHub Actions as mandatory execution environment;
- old phase numbering;
- direct kernel registration of client-specific flows.

## Required extraction method

For every candidate file/package from `gestaotecnica`, classify:

- `REUSE`: concept/code fits new contract with minimal change;
- `ADAPT`: useful but must be refactored to new boundary;
- `CLIENT_ONLY`: belongs only to Gestão Técnica;
- `RETIRE`: historical/contradictory or no longer useful.

No bulk copy is permitted before this inventory.
