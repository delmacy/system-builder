# Current Execution Milestone — M12 Controlled Evolution Sprint 4

## Integrated predecessor truth
P12 Sprints 1-3 are merged. Sprint 3 `P12-SUPPORT-RESOLUTION-01` merged through PR #229 at `7763177596cb684d3e3c6f9a55042337a865c2bc` after Deterministic CI #507 PASS.

Auxiliary GitHub Actions audit/maintenance and planning reconciliation are integrated through:
- PR #230: `86bde8830995e5d0a51bd3e3fd27734b5066f9d5`;
- PR #231: `58fcfd837ebb91bec21172916090f71f75970ef5`;
- PR #232: `932987117aed79d5af5ad3965bb87da740989318`, CI #528 PASS.

## Current integrated capability
P12 is integrated through WBS 12.2.3:
`DeploymentFinding|human request -> SupportEvidenceIntake -> explicit SupportTriageDecision(Support|Maintenance|Evolution) -> SupportCaseRecord|ProblemRecord for Support/Maintenance -> explicit permission/cause/resolution/evidence`.

`Evolution` is intentionally rejected by SupportCase/Problem operational-resolution paths.

## Active committed Sprint
`P12-CONTROLLED-EVOLUTION-LINKAGE-01` is **COMMITTED / MATERIALIZED** from base `932987117aed79d5af5ad3965bb87da740989318`.

Committed TASKs: TASK-202..211.

Sprint Goal: close WBS 12.3.1-12.3.3 as deterministic evidence/linkage:
`process-change request -> Evolution triage -> EvolutionRequestEvidence -> ProcessMirror/BusinessRecipe linkage -> PublishedRelease linkage -> original request linkage`.

The Sprint consumes existing public ProcessMirror/BusinessRecipe contract identities and Release public evidence. It does not invent a Mirror/Recipe execution engine, alter shared schemas, publish/deploy releases, or mutate production.

## Planning policy
New Work Packages use:
`Planning & Materialization -> Construction A -> Construction B -> [optional Construction C] -> Package Integration & Review -> Documentation & Closure`.

P12 remains grandfathered under its legacy cadence.

## GitHub governance boundary
`main` deliberately remains without GitHub branch protection/required checks during construction. Branch protection, required checks and broad structural privilege reduction remain DEFERRED. No new general validation workflow, duplicate `push: main`, premature `merge_group` or mandatory PR-heavy gate is authorized.

## Current gate
1. Validate and integrate the Sprint 4 materialization planning PR on its exact head.
2. Reconstruct fresh `main`.
3. Create `sprint/P12-CONTROLLED-EVOLUTION-LINKAGE-01` only from that integrated materialization truth.
4. Execute TASK-202..211 in dependency order with one authoritative commit per TASK.
5. Run repository-wide verification and stop at Sprint Review on exact TASK-211 closure head.

Do not start P13 or P12 package Integration & Technical Debt Review before Sprint 4 is merged.
