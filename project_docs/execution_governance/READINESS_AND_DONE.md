# Definition of Ready and Definition of Done

## Task Definition of Ready (DoR)
A task may enter the READY queue only when all applicable conditions hold:

- approved Requirement/WBS/WP traceability exists;
- objective and expected output are unambiguous;
- blocking DAG predecessor gates are SATISFIED or explicitly waived through governance;
- authoritative contracts/spec versions are identified;
- acceptance criteria and expected evidence are defined;
- allowed paths and forbidden paths are defined;
- required tools/executor are available;
- required fixtures/test environment are known;
- unresolved architecture/business decisions are absent;
- risk classification and model/reviewer routing are assigned;
- task size is bounded enough for independent verification.

Failure of a mandatory condition produces `BLOCKED`, not an executor prompt asking the coding agent to invent the missing decision.

## Task Definition of Done (DoD)
A task is DONE only when:

- intended output is implemented within allowed scope;
- required tests/typecheck/lint/schema/contract checks pass;
- no test/evaluator/governance control was weakened merely to obtain green status;
- acceptance criteria are evidenced;
- changed public contracts/configuration are versioned as required;
- security/data gates pass where applicable;
- documentation/ADR/RTM/DAG effects are updated when required;
- executor result/evidence record is complete;
- independent review requirement is satisfied;
- branch/PR integration state satisfies the task contract.

## Sprint/Increment closure
A sprint closes when its Goal and applicable DoD are met. Later discoveries become traceable corrective/successor work; historical sprint scope is not kept indefinitely open.
