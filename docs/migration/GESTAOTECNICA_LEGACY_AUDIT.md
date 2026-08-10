# Gestão Técnica Legacy Audit — 2026-08-10

Source repository: `delmacy/gestaotecnica`.

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
