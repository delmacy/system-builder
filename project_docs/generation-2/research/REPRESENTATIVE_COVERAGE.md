# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Universal Capability Architecture — revisit cycle 2
OASIS TOSCA 2.0, Kubernetes declarative APIs/controllers, Kubernetes DRA, OpenTofu provider/state replacement, Crossplane ProviderConfig/Managed Resources, CUE and Backstage Software Catalog: `DEEP`. Revisit result: six material findings (`G2-FINDING-UCA-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Process & Application Modeling — revisit cycle 2
| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| Backstage Software Catalog | DEEP | Separates entity identity, source-controlled representation, typed relations, ownership and system/API/resource boundaries. | Whether projection lifecycle generalizes beyond catalog views. |
| JSON Schema 2020-12 | DEEP | Separates schema resource identity/reference from network location; distinguishes vocabularies, assertions and annotations. | Reference trust/compatibility evidence across model/contract domains. |
| CUE | DEEP | Shows compositional constraints and open/closed structural semantics without runtime execution authority. | Whether SB needs a portable constraint vocabulary or only a semantic boundary. |
| OMG BPMN 2.0/2.0.2 | DEEP | Distinguishes Process, Collaboration and Choreography views and maps shared participants/messages without flattening viewpoints. | Projection identity/freshness and relation to workflow execution IR. |
| Mendix | DEEP | First-pass metamodel/module/domain evidence remains authoritative. | Compare model-unit revision/projection lineage. |
| ServiceNow App Engine | DEEP | First-pass scoped application/data/process evidence remains authoritative. | Scope/override authority. |
| Power Apps / Dataverse | DEEP | First-pass model-driven/solution-layer evidence remains authoritative. | Layering versus semantic projection. |
| Salesforce Platform | DEEP | First-pass metadata/package evidence remains authoritative. | Metadata identity versus provider runtime coupling. |

Revisit result: six material findings (`G2-FINDING-PAM-11..16`); consecutive-no-material-finding count = 0; capability remains NOT SATURATED.

## AI-native Engineering / Agents / Approvals
OpenAI Agents/Responses `DEEP`; Anthropic Claude Code permissions `DEEP`; GitHub Copilot coding agents `DEEP`; Temporal `DEEP`; LangGraph `PARTIAL`.

## Developer / Operator Experience / Self-hosting
Backstage `DEEP`; GitHub Codespaces/Dev Containers `DEEP`; Kubernetes administration `DEEP`; Coolify `DEEP`; Nix Flakes/devShell `DEEP`.

## Architecture Reconciliation as a Capability
ADR lifecycle `DEEP`; evolutionary architecture fitness functions `DEEP`; ArchUnit-style conformance `DEEP`; Kubernetes compatibility/deprecation `DEEP`; repository-native architecture governance `PARTIAL`.