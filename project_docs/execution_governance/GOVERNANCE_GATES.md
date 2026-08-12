# Governance Gates

Mandatory gates are attached to the affected DAG path/task, not used as a reason to freeze unrelated work.

| Gate | Trigger examples | Minimum authority/evidence |
|---|---|---|
| ARCHITECTURE | ADR/public boundary/ownership change | Architect review; ADR when material |
| CONTRACT | public schema/interface/version change | compatibility/contract tests + review |
| DATA | destructive/irreversible migration | migration/backup/rollback evidence + human approval |
| SECURITY | auth/authz/secrets/trust boundary | security review/tests; human approval where material |
| SCOPE | approved deliverable/requirement/acceptance change | change approval + baseline/RTM update |
| RELEASE | production promotion/rollback boundary | release evidence + configured approval policy |
| EVALUATOR | tests/validators/governance controls changed | independent review; executor cannot self-waive |

## Status
`UNSATISFIED | SATISFIED | WAIVED`

A waiver requires explicit authority, rationale, risk acceptance and traceable change/decision evidence. Missing evidence is not an implicit waiver.
