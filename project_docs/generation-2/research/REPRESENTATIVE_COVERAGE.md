# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Previous capability coverage remains authoritative in the corresponding dossiers and state file; this ledger is append-oriented as research advances.

## Governance / Compliance / Audit coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| Open Policy Agent / Gatekeeper model | DEEP | Separates policy evaluation from host enforcement and supports portable policy/data decision architecture. | Bundle/signing lifecycle, decision-log completeness and Gatekeeper-specific enforcement evidence. |
| Kyverno | DEEP | Strong contrast between preventive admission and detective/background policy reporting. | Policy exceptions, admission evidence retention and mutation/generation authority. |
| AWS CloudTrail + Audit Manager | DEEP | Explicit control-to-evidence mapping, multiple evidence sources and documented incompleteness/inconclusive states. | Evidence integrity/export, assessment delegation and framework versioning. |
| Azure Policy | PARTIAL | Assignment/evaluation/compliance/remediation/exemption model exposes governance lifecycle distinctions. | Versioned definitions/initiatives, exemptions and remediation authority in greater depth. |
| OpenFGA | DEEP | Immutable authorization-model revisions and explicit model-ID pinning provide a governance/authorization boundary contrast. | Decision evidence and migration interplay; do not conflate authorization with compliance. |

Historical representative coverage for prior capabilities is preserved in `RESEARCH_PIPELINE_STATE.json` and their capability dossiers; no prior status is superseded by this compact ledger update.
