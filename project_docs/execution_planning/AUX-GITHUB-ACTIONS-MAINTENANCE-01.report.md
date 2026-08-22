# AUX-GITHUB-ACTIONS-MAINTENANCE-01 — Execution Report

Status: TASK-200 VERIFIED / TASK-201 IMPLEMENTED / FINAL CI PENDING
Base: `86bde8830995e5d0a51bd3e3fd27734b5066f9d5`
Branch: `sprint/AUX-GITHUB-ACTIONS-MAINTENANCE-01`
PR: #231

## TASK-200 — first-party Action majors
Authoritative commit: `c11b7745794d808c018120a7dd994e8a90a6eb83`.
Deterministic CI: #526 PASS.

Affected workflows were limited to version-reference maintenance:
- `ci.yml`: `actions/checkout@v4 -> @v7`, `actions/setup-node@v4 -> @v7`;
- `heavy-tests.yml`: `actions/checkout@v4 -> @v7`, `actions/setup-node@v4 -> @v7`;
- `opencode-next-sprint-materialize.yml`: `actions/checkout@v4 -> @v7`, `actions/setup-node@v4 -> @v7`;
- `opencode-sprint-task-loop.yml`: `actions/checkout@v4 -> @v7`, `actions/setup-node@v4 -> @v7`;
- `opencode-work-package-planner-schedule.yml`: `actions/checkout@v4 -> @v7`;
- `opencode-work-package-planner.yml`: `actions/checkout@v4 -> @v7`, `actions/setup-node@v4 -> @v7`.

`opencode-work-package.yml` had no affected v4 reference. No trigger, schedule, permission, concurrency, runner, service, command, job structure or workflow topology was changed by TASK-200.

## TASK-201 — Work Package dispatcher permission audit
Audited workflow: `.github/workflows/opencode-work-package.yml` after TASK-200.

Observed operations are exhaustive for the single job:
1. validate workflow-dispatch inputs using shell pattern/integer checks;
2. expose input values through environment variables;
3. invoke `gh workflow run opencode-sprint-task-loop.yml --repo "$GITHUB_REPOSITORY" --ref main ...` using `GH_TOKEN: ${{ github.token }}`;
4. print status messages.

There is no checkout, repository-content API call, Git push/fetch/commit, issue/PR read/write, PR creation/update/merge, artifact operation, package operation or repository-setting mutation.

### Permission-to-operation matrix
| Declared permission before TASK-201 | Observed operation requiring it | Evidence | Disposition |
| --- | --- | --- | --- |
| `actions: write` | create a workflow dispatch event through `gh workflow run` | GitHub REST `Create a workflow dispatch event` requires repository `Actions: write`; write includes read | KEEP |
| `contents: write` | none | no checkout, Git command, contents endpoint or repository-file operation exists in the workflow | REMOVE |
| `pull-requests: write` | none | no PR command or pull-request endpoint exists in the workflow | REMOVE |

GitHub workflow syntax establishes that once an explicit `permissions` map is present, permissions not specified are set to `none`. Therefore the bounded behavior-preserving minimum for this dispatcher is:

```yaml
permissions:
  actions: write
```

Final TASK-201 disposition: **REDUCE**, narrowly in `.github/workflows/opencode-work-package.yml` only. This does not change owner privilege, repository settings, branch protection, required checks, downstream workflow permissions or any other workflow.

## Governance boundaries preserved
- `main` remains deliberately unprotected during construction;
- branch protection, required checks and broad structural privilege reduction remain DEFERRED to an explicit future pre-commercial maturity gate;
- no repository setting changed;
- no general validation workflow added;
- no dedicated `test:product:full` workflow added;
- no `push: main` duplicate `verify` trigger added;
- no `merge_group` added;
- heavy tests remain nightly/manual rather than a mandatory PR gate;
- P12 Sprint 4 / WBS 12.3.x remains FORECAST ONLY.

## Final verification
Repository-wide `npm run verify` is the declared Sprint exit proof. Connected execution evidence is the Deterministic CI on the authoritative TASK-201/final Sprint head. This report is committed with TASK-201 before that objective CI result; the PR metadata records the final run number and conclusion without requiring an additional TASK commit.
