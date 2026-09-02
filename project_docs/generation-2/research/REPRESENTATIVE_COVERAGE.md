# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Revisit cycle 2
All 25 active capabilities completed cycle 2. Every pass produced material findings; no capability was SATURATED at cycle close.

## Revisit cycle 3
All 25 active capabilities completed cycle 3 after the Architecture Reconciliation as a Capability pass. Every capability produced material new findings in this cycle; therefore no capability satisfies the two-consecutive-no-material saturation condition at cycle close.

### Architecture Reconciliation as a Capability — revisit 2
ArchUnit 1.4.x: `DEEP`; Open Policy Agent bundles/decision logs/local evaluation: `DEEP`; Argo CD desired/live diff and sync separation: `DEEP`; Terraform/HCP Terraform drift and refresh-only: `DEEP`; AWS Well-Architected lenses/milestones: `DEEP`; ADR/MADR lifecycle practice: `PARTIAL`. Findings `G2-FINDING-ARAC-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED. Focus: desired/remembered/observed architecture identity; evidence freshness/coverage; non-actuating reconciliation authority; revision-bound exceptions; cross-plane lineage; portable offline conformance closure.

### Developer / Operator Experience / Self-hosting — revisit 2
K3s air-gap install/upgrade/rollback: `DEEP`; Kubernetes/kubeadm config and upgrade/recovery: `DEEP`; Nix dependency-closure transfer: `DEEP`; GitHub Codespaces/Dev Containers/prebuilds: `DEEP`; Docker Compose topology/secrets: `PARTIAL`; Coolify self-host restore boundary: `DEEP`. Findings `G2-FINDING-DOESH-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED. Focus: qualified offline operation closure; desired-vs-effective topology; phase-scoped secret/trust binding; upgrade/recovery lineage; profile-based environment parity; exportable local diagnostics.

### AI-native Engineering / Agents / Approvals — revisit 2
OpenAI Agents/Workspace Agents: `DEEP`; Model Context Protocol tool/auth/capability negotiation: `DEEP`; Temporal durable execution/version coexistence: `PARTIAL`; LangGraph durable execution/HITL: `PARTIAL`; Google A2A task/artifact interoperability: `PARTIAL`. Findings `G2-FINDING-AIN-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### Lifecycle / Versioning / Evolution / Migration — revisit 2
Kubernetes API deprecation + storage/preferred-version evolution: `DEEP`; Kubernetes component version-skew/upgrade ordering: `DEEP`; RFC 9745 Deprecation + RFC 8594 Sunset: `DEEP`; Terraform moved/import/remove/state continuity: `DEEP`; Terraform provider cross-resource-type state move: `DEEP`; Flyway target/versioned migration/undo/schema history: `DEEP`; Temporal durable execution version coexistence constraint: `PARTIAL`. Findings `G2-FINDING-LVEM-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

## Revisit cycle 4
Cycle 4 is open with 1/25 capabilities revisited.

### Universal Capability Architecture — revisit 3
OASIS TOSCA 2.0 requirement/capability/relationship: `DEEP`; Kubernetes desired generation / observedGeneration / conditions: `DEEP`; OpenFeature provider/evaluation-context/status v0.9.x: `DEEP`; OpenTelemetry Resource/Entity identity: `DEEP`; Crossplane ProviderConfig/ManagedResource/external resource: `DEEP`; SPIFFE trust domains/bundles/federation: `DEEP`; OPA bundle persistence/activation/status: `DEEP`. Findings `G2-FINDING-UCA-23..28`; material new findings, consecutive-no-material = 0; NOT SATURATED. Focus: consolidate ontology rather than promote candidate inflation — one revision-bound realization lineage, evidence qualification contract, decision-vs-execution authority separation, generic context resolution with specialized Station hierarchy, profile/context/operation compatibility, qualified local closure and provider-neutral semantic contracts.

## Historical authority
All representatives/findings from prior capability sections and earlier revisions remain authoritative in their dossiers/state history. Compacting this ledger does not revoke coverage.