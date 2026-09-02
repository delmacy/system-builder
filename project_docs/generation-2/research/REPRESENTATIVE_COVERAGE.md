# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Revisit cycle 2
All 25 active capabilities completed cycle 2. Every pass produced material findings; no capability was SATURATED at cycle close.

## Revisit cycle 3
Authoritative completed set after the Developer / Operator Experience / Self-hosting pass: Universal Capability Architecture; Process & Application Modeling; UI / Generated Experience / Low-code Builder; Adaptive Governed Work Surfaces; Workflow & Durable Execution; Integration & Automation; Identity / Authentication / Federation; Authorization / Policy / Organization / Multitenancy; Data / Schema / Migrations; Storage / Documents / Media; Notifications / Events / Messaging; Build / Dependency Graph / Reproducibility; Artifact / Release / SBOM / Provenance; Deployment / Environment / Runtime; Observability / Operations / Incident; Extension / Plugin / Marketplace Architecture; Governance / Compliance / Audit; Secrets / Configuration / Environment Portability; Provider / Binding / Capability Negotiation; Security / Resilience / Failure Recovery; Standards / Interoperability / API Contracts; Lifecycle / Versioning / Evolution / Migration; AI-native Engineering / Agents / Approvals; Developer / Operator Experience / Self-hosting. These 24 capabilities have current-cycle material findings and remain NOT SATURATED.

### Developer / Operator Experience / Self-hosting — revisit 2
K3s air-gap install/upgrade/rollback: `DEEP`; Kubernetes/kubeadm config and upgrade/recovery: `DEEP`; Nix dependency-closure transfer: `DEEP`; GitHub Codespaces/Dev Containers/prebuilds: `DEEP`; Docker Compose topology/secrets: `PARTIAL`; Coolify self-host restore boundary: `DEEP`. Findings `G2-FINDING-DOESH-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED. Focus: qualified offline operation closure; desired-vs-effective topology; phase-scoped secret/trust binding; upgrade/recovery lineage; profile-based environment parity; exportable local diagnostics.

### AI-native Engineering / Agents / Approvals — revisit 2
OpenAI Agents/Workspace Agents: `DEEP`; Model Context Protocol tool/auth/capability negotiation: `DEEP`; Temporal durable execution/version coexistence: `PARTIAL`; LangGraph durable execution/HITL: `PARTIAL`; Google A2A task/artifact interoperability: `PARTIAL`. Findings `G2-FINDING-AIN-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### Lifecycle / Versioning / Evolution / Migration — revisit 2
Kubernetes API deprecation + storage/preferred-version evolution: `DEEP`; Kubernetes component version-skew/upgrade ordering: `DEEP`; RFC 9745 Deprecation + RFC 8594 Sunset: `DEEP`; Terraform moved/import/remove/state continuity: `DEEP`; Terraform provider cross-resource-type state move: `DEEP`; Flyway target/versioned migration/undo/schema history: `DEEP`; Temporal durable execution version coexistence constraint: `PARTIAL`. Findings `G2-FINDING-LVEM-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

## Historical authority
All representatives/findings from prior capability sections and earlier revisions remain authoritative in their dossiers/state history. Compacting this ledger does not revoke coverage.