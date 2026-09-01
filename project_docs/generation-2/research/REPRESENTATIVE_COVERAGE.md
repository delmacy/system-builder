# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Previous capability coverage remains authoritative in the corresponding dossiers and state file; this ledger is append-oriented as research advances.

## Provider / Binding / Capability Negotiation coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| OASIS TOSCA 2.0 | DEEP | Normatively separates typed requirement, typed capability, matching constraints and relationship created by fulfillment. | Negotiation evidence, substitution/external inventory and failure of mandatory dangling requirements. |
| Kubernetes Dynamic Resource Allocation | DEEP | Separates DeviceClass, ResourceClaim/Template, driver-published inventory and concrete allocation while keeping driver parameters behind the driver boundary. | Allocation recovery, prioritized alternatives and driver replacement semantics. |
| OpenTofu provider model | DEEP | Separates provider source address, local name, version constraint, locked revision and configured instance/alias. | Protocol negotiation, provider schema/version migration and replacement evidence. |
| Crossplane Providers | DEEP | Separates provider package/revision/activation, ProviderConfig, managed-resource reference and reconciliation health. | Provider family dependencies, safe removal/abandon semantics and credential migration. |
| SPIFFE/SPIRE | PARTIAL | Shows environment-local selector-to-authority resolution and short-lived material independent of workload source definition. | Keep only if later identity/provider binding synthesis benefits; it is not a generic provider negotiation model. |

Historical representative coverage for prior capabilities is preserved in `RESEARCH_PIPELINE_STATE.json` and their capability dossiers; no prior status is superseded by this compact ledger update.
