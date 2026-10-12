---
{
  "id": "TASK-734",
  "title": "Plan Catalog Studio and qualify public owner prerequisites",
  "status": "completed",
  "priority": 734,
  "milestone": "STATION-STUDIOS-WP02",
  "model_tier": "architecture",
  "risk": "high",
  "architecture_impact": true,
  "executor_preference": "any",
  "depends_on": [
    "TASK-733"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/CONTRACT_INDEX.md",
    "docs/current/NEXT_WORK.md",
    "docs/contracts/018-station-suite-studios/ADDENDUM.md",
    "project_docs/execution_planning/STATION-SUITE-STUDIOS-WORK-PACKAGES-01.md",
    "project_docs/execution_planning/STATION-SUITE-STUDIOS-READINESS-01.md",
    "docs/architecture/SUITE_MAP.md",
    "docs/architecture/MASTER_BLUEPRINT.md",
    "docs/adr/ADR-0016-station-core-gateway-boundary.md",
    "docs/adr/ADR-0018-design-candidate-owner-service.md",
    "project_docs/05-catalog/scope/README.md",
    "project_docs/05-catalog/WBS.md",
    "project_docs/schedule/SPRINT_MODE.md",
    "project_docs/schedule/SPRINT_GENERATION_POLICY.md",
    "packages/catalog/index.ts",
    "packages/catalog/postgres.ts",
    "packages/catalog/storage.ts",
    "packages/catalog/knowledge-promotion-admission.ts",
    "packages/catalog/knowledge-promotion-preadmission.ts",
    "packages/catalog/process-revision-admission.ts",
    "apps/station-gateway/index.ts",
    "apps/station-gateway/design-owner.ts"
  ],
  "allowed_paths": [
    "project_docs/execution_planning/STATION-STUDIOS-WP02-PLAN-01.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP02-READINESS-01.md",
    "project_docs/execution_planning/CATALOG-OWNER-WP1-PLAN-01.md",
    "docs/adr/ADR-0019-catalog-owner-service.md",
    "docs/contracts/018-station-suite-studios/WP02-EXECUTION.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP02-PLANNING-01.md",
    "project_docs/execution_planning/STATION-STUDIOS-WP02-PLANNING-01.report.md",
    "docs/current/NEXT_WORK.md",
    "specs/tasks/TASK-734-STATION-STUDIOS-WP02-PLANNING.md"
  ],
  "forbidden_paths": [
    "packages/**",
    "apps/**",
    "tests/**",
    ".github/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 9,
  "validation": [
    "npm run verify"
  ]
}
---

## Objective
Plan owner-authorized Studios WP02 from actual Catalog public/domain/provider readiness and materialize only first eligible work.
## Context
WP01closed; Add018suiteforecast and explicitWP02implementation request. Repositoryauthority defines ownedprerequisites and L3/L4 ADR escalation.
## Current behavior
Software domain/PG and Business/process canonical admission functions exist; actualauthenticatedtwofamilyowner/readback/result and trustedupstream notqualified.
## Required change
Produce bounded Studio package/dictionaryscope/forecasts/evidence/readiness; identify separated Catalogowner prerequisite and concrete ADR0019PROPOSED decision. Do not implement or materialize productConstruction with missingauthority.
## Inputs / contracts
Catalog publicmodules, canonicalknowledge/process contracts, currentStation protocol/Gateway/SDK, phase/WBS/readiness.
## Outputs / contracts
Planning/readiness/report, proposedownedservicepackage/ADR, executionrequestresolution and onecurrentNEXT decisiongate. No newpublicschema/APIcode.
## Acceptance criteria
Distinguish domain/provider evidence from servicequalifiedreadiness, retain Business/Software separation and upstreamhuman authority, concrete proposalreviewablebeforeaskingacceptance.9exactdocs/max9 and no forbiddenproductwrites. OwnalltriggeredgatesPASS beforemerge.
## Non-goals
SilentnewbackendinStation, acceptanceofADRfromproposal, fabricatedeligibleBusiness source, ProductConstruction or futureTASKIDs.
## Evidence expected
Freshauthority/census, domain/provider/Gatewaysource review, observedCI and no guessedmoduleabsence/full localverify claims.
## Escalation
Unaccepted publiccontract/architecture/ownerdecision blocksConstruction; explicitADR/prerequisiteproposal and ownerdecision required perAGENTS.
