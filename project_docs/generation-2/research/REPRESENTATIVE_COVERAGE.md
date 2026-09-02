# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Revisit cycle 2 completed capabilities
Universal Capability Architecture; Process & Application Modeling; UI / Generated Experience / Low-code Builder; Workflow & Durable Execution; Integration & Automation; Identity / Authentication / Federation; Authorization / Policy / Organization / Multitenancy; Data / Schema / Migrations; Storage / Documents / Media; Notifications / Events / Messaging; Build / Dependency Graph / Reproducibility; Artifact / Release / SBOM / Provenance; Deployment / Environment / Runtime; Observability / Operations / Incident: prior detailed coverage remains authoritative in capability dossiers and state history. Each revisit produced six material findings; consecutive-no-material = 0; NOT SATURATED.

## Extension / Plugin / Marketplace Architecture — revisit cycle 2
VS Code extensions / Marketplace trust, signatures, host placement and workspace/organization policy: `DEEP`; Backstage backend plugins/modules and capability-owned extension points: `DEEP`; Kubernetes CRD/operator API-version/storage-migration boundaries: `DEEP`; OSGi bundle lifecycle/resolver/wiring: `DEEP`; WordPress activation/deactivation/uninstall state lifecycle: `DEEP`. Revisit result: six material findings (`G2-FINDING-EXT-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Governance / Compliance / Audit — revisit cycle 2
NIST OSCAL assessment/results/POA&M: `DEEP`; HashiCorp Sentinel enforcement/override semantics: `DEEP`; AWS CloudTrail integrity/digest chaining: `DEEP`; Sigstore Rekor transparency/verification: `DEEP`; GitHub Enterprise audit log retention/export: `DEEP`. Revisit result: six material findings (`G2-FINDING-GCA-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Secrets / Configuration / Environment Portability — revisit cycle 2
HashiCorp Vault lease/renew/revoke + response wrapping/Agent bootstrap: `DEEP`; Kubernetes Secrets + External Secrets Operator refresh/materialization/ownership semantics: `DEEP`; AWS Secrets Manager staged asynchronous rotation: `DEEP`; SOPS encrypted configuration + online/offline key identities: `DEEP`; Twelve-Factor Config deploy-time separation: `DEEP`. Revisit result: six material findings (`G2-FINDING-SCEP-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Provider / Binding / Capability Negotiation — revisit cycle 2
OpenTofu/Terraform provider requirements/configuration/lock/state linkage: `DEEP`; Crossplane Provider/ProviderRevision install/activation/health: `DEEP`; Kubernetes Discovery API + mixed-version discovery: `DEEP`; Kubernetes Device Plugin/DRA vendor-independent discovery/allocation: `DEEP`; gRPC Reflection + pluggable name resolution: `DEEP`; Backstage backend service overrides/capability-owned extension points: `DEEP`. Revisit result: six material findings (`G2-FINDING-PBCN-11..16`); consecutive-no-material = 0; NOT SATURATED.

## AI-native Engineering / Agents / Approvals
OpenAI Agents/Responses `DEEP`; Anthropic Claude Code permissions `DEEP`; GitHub Copilot coding agents `DEEP`; Temporal `DEEP`; LangGraph `PARTIAL`.

## Developer / Operator Experience / Self-hosting
Backstage `DEEP`; GitHub Codespaces/Dev Containers `DEEP`; Kubernetes administration `DEEP`; Coolify `DEEP`; Nix Flakes/devShell `DEEP`.

## Architecture Reconciliation as a Capability
ADR lifecycle `DEEP`; evolutionary architecture fitness functions `DEEP`; ArchUnit-style conformance `DEEP`; Kubernetes compatibility/deprecation `DEEP`; repository-native architecture governance `PARTIAL`.
