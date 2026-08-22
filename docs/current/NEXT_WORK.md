# Next Work — P12 Controlled Evolution Authorization Gate

The repository is authoritative.

## Current integrated truth
P12 Sprints 1–3 are merged. PR #230 (GitHub Actions validation audit) and PR #231 (bounded workflow maintenance) are also merged. The repository is no longer waiting on either auxiliary PR.

The current integrated support/evolution chain closes operational resolution through WBS 12.2.3. `Evolution` exists only as explicit triage classification; SupportCase/Problem operational paths reject it.

## Planning policy
New Work Packages use the short lifecycle:

`Planning & Materialization -> Construction A -> Construction B -> [optional Construction C] -> Package Integration & Review -> Documentation & Closure`.

P12 is an explicit legacy/grandfathered package because three Construction Sprints were materially executed under the prior cadence.

## Required next action
Do not silently materialize P12 Sprint 4.

When explicitly authorized to proceed:
1. reconstruct fresh `main` after the planning/documentation reconciliation is integrated;
2. re-read P12 package, WBS 12.3.x, Mirror/Recipe/release contracts and actual predecessor implementations;
3. revalidate the forecast path `process-change evidence -> Mirror/Recipe -> version/release -> original request linkage`;
4. materialize at most one P12 Sprint 4 manifest/TASK set if readiness remains valid;
5. execute it under normal Sprint Mode and exact-head CI/review gates;
6. finish P12 with its grandfathered package integration/debt review and repository-memory closure before opening the successor domain for execution.

## Successor Work Package horizon — M13
The next baseline domain after P12 is WBS 13 Autonomous Runtime. The following concrete Work Packages are now elaborated as forecast only:

1. `P13-PACKAGE-01` — Autonomous Runtime Functional Execution — WBS 13.1.1-13.1.3;
2. `P13-PACKAGE-02` — Autonomous Runtime Identity, Authority & Generated Experience — WBS 13.2.1-13.2.3;
3. `P13-PACKAGE-03` — Autonomous Runtime Operational Autonomy — WBS 13.3.1-13.3.3.

They are dependency ordered and non-executable. Each package begins with a Planning & Materialization Sprint that must reconstruct fresh `main`, inventory capability already delivered by earlier phases, classify it as predecessor evidence, identify only real gaps, and materialize at most Construction A.

No P13 TASK set, Sprint manifest or execution branch is created by this forecast.

## Governance boundaries
- Keep `main` deliberately without GitHub branch protection/required checks during the current construction phase unless explicit future maturity authority changes that decision.
- Branch protection, required checks and broad structural privilege reduction remain DEFERRED.
- Do not add a new general validation workflow, duplicate general `push: main` verification, `merge_group` before merge-queue adoption, or mandatory PR-heavy gate without new evidence/authority.
- Planning/Review/Documentation Sprints must not absorb undeclared product implementation.
