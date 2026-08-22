# Package Integration & Review Sprint Template

Goal: assess the complete Work Package outcome across recently integrated Construction Sprints rather than add unrelated feature scope.

## Preconditions
- required Construction Sprints are merged;
- optional third Construction Sprint has either been completed or explicitly skipped because fresh evidence showed it unnecessary;
- exact integrated `main` is known;
- package growing proof is available.

## Inspect
- end-to-end integration and regression;
- contract/schema drift and compatibility;
- architecture fitness and dependency accuracy;
- duplicated abstractions and obsolete code;
- regressions/test gaps;
- security/trust;
- CI reliability;
- documentation consistency;
- performance where relevant;
- technical debt;
- unresolved risks;
- actual-vs-forecast effort and rework.

## Outputs
- findings with severity/disposition;
- bounded corrections if strictly necessary to prove the already-built Package Goal;
- corrective Work Packages/TASKs for larger gaps;
- updated risks/DAG/readiness/forecast;
- explicit go/no-go for Documentation & Closure.

## Boundary
A missing product capability required by the Package Goal is not review work. Return it to explicit construction/change control instead of hiding it here.

Documentation & Closure follows this Sprint after a `GO` disposition.
