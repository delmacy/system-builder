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

## Successor Work Package horizon
The next baseline domain after P12 is WBS 13 Autonomous Runtime. Forecast Work Packages may be elaborated in advance from existing WBS and implementation evidence, but they remain non-executable until P12 closes and each package Planning Sprint confirms actual gaps/readiness from fresh `main`.

## Governance boundaries
- Keep `main` deliberately without GitHub branch protection/required checks during the current construction phase unless explicit future maturity authority changes that decision.
- Branch protection, required checks and broad structural privilege reduction remain DEFERRED.
- Do not add a new general validation workflow, duplicate general `push: main` verification, `merge_group` before merge-queue adoption, or mandatory PR-heavy gate without new evidence/authority.
- Planning/Review/Documentation Sprints must not absorb undeclared product implementation.
