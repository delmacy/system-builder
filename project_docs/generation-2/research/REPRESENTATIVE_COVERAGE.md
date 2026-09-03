# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Historical coverage in prior revisions, capability dossiers and state history remains authoritative; this compact ledger does not revoke omitted cells.

## Enterprise Trust / PKI / Certificate Lifecycle — structural gap research
RFC 5280 X.509 path validation/trust anchors/revocation: `DEEP`; RFC 8555 ACME issuance/revocation lifecycle: `DEEP`; SPIFFE/SPIRE workload identity, trust bundles and federation: `DEEP`; cert-manager Certificate + Issuer/ClusterIssuer + external issuer model: `DEEP`; HashiCorp Vault PKI multi-issuer/rotation/CRL/OCSP/revocation: `DEEP`; Smallstep step-ca private PKI/ACME and documented limitation profile: `DEEP`; fresh-main SB ADR-0015 PostgreSQL TLS server-identity verification: `DEEP` for bounded comparison.

Findings `G2-FINDING-ETPKI-01..08`; four consolidation candidates; parent candidate **PROMOTED as CROSS_CUTTING / NOT_SATURATED**. Structural conclusion: trust-domain/anchor/issuer/certificate/revocation/rotation/consumer-effective semantics cannot be fully merged into Secrets, Identity or Security without semantic ownership collapse. Provider mechanisms remain providerized; System Builder is not required to implement a bespoke CA.

## Enterprise Completeness / Negative-Space Review — pass 1
NIST Cybersecurity Framework 2.0 / SP 1305 supply-chain governance: `DEEP`; FinOps Framework Allocation + Forecasting: `DEEP`; NIST Privacy Framework: `PARTIAL` (structural gap established; multi-representative privacy/retention research still required); NIST AI RMF / AI 600-1 / AIRC TEVV: `DEEP` for frontier-screen scope; RFC 5280 X.509 PKI: `DEEP`; RFC 8555 ACME: `DEEP`; RFC 7644 SCIM: `DEEP`; SLSA provenance/build integrity: `DEEP`; Backstage Catalog / developer-platform composition: `DEEP`.

Findings `G2-FINDING-ENSR-01..08`; four pass-1 candidates. `G2-FINDING-ENSR-01` is now structurally resolved by promotion of Enterprise Trust / PKI / Certificate Lifecycle, while executable proof backfill remains open. Enterprise Completeness gate remains open. Next structural research gap: Privacy / Data Governance / Retention / Legal Hold / Residency.

## Cycle authority
Cycles 2–7 completed for the original 25 active capabilities. Every cycle-7 pass produced material findings; none was saturated. Enterprise Trust / PKI / Certificate Lifecycle was promoted after cycle 7 from the mandatory Enterprise Completeness structural-gap queue and has one dedicated deep research pass; it is NOT SATURATED.

## Revisit cycle 7
Completed: all 25 capabilities active when cycle 7 began. Architecture Reconciliation as a Capability was the final revisit and closed that cycle. The newly promoted Enterprise Trust capability does not retroactively invalidate completion of the seven-cycle eligibility threshold; it remains explicit unsaturated research/planning input.

### Architecture Reconciliation as a Capability — revisit 6
Kubernetes Deployment/controller status: `DEEP`; HashiCorp Terraform/HCP Terraform saved-plan workflow: `DEEP`; Argo CD reconciliation/diff: `DEEP`; Crossplane managed resources/managementPolicies: `DEEP`; Flux Kustomization/Conditions/dependencies: `DEEP`; fresh-main SB AssemblyPlan/validation/compiler evidence: `DEEP` for the bounded comparison performed. Findings `G2-FINDING-ARC-47..54`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped reconciliation; typed Evidence→Finding→ProductTruth→Gap→Disposition→Plan→ExecutionAttempt→Acceptance→EffectiveState→Proof identities; stale evidence; desired/observed/effective separation; revision-qualified dispositions; reconcile-before-retry; mixed support vectors; residual cohort drainage; offline evidence closure; delegated Station and AGWS/AI non-amplification.

### Developer / Operator Experience / Self-hosting — revisit 6
Kubernetes kubeadm upgrade: `DEEP`; K3s air-gap install/upgrade: `DEEP`; GitLab Self-Managed upgrade paths: `DEEP`; Red Hat OpenShift disconnected updates/mirroring: `DEEP`; HashiCorp Nomad upgrade: `DEEP`; Nomad snapshot/key-management recovery evidence: `DEEP`; prior G2 AI/Lifecycle/Security/Artifact/Deployment/Secrets/Provider research: `DEEP`. Findings `G2-FINDING-DOESH-47..54`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### AI-native Engineering / Agents / Approvals — revisit 6
OpenAI Agents SDK HITL + hosted MCP approval: `DEEP`; LangGraph/LangChain interrupts + HITL: `DEEP`; Microsoft Agent Framework tool/workflow approvals: `DEEP`; Anthropic Claude Code permission architecture: `DEEP`; prior G2 AI/Security/Lifecycle/Provider research: `DEEP`. Findings `G2-FINDING-AIN-47..54`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### Security / Resilience / Failure Recovery — revisit 6
NIST SP 1339 OT Backup Quick Start Guide: `DEEP`; NIST SP 800-61 Rev.3/CSF 2.0 incident-response profile: `DEEP`; CISA StopRansomware Guide: `DEEP`; AWS Backup Restore Testing + Well-Architected REL09-BP04: `DEEP`; etcd v3.7 disaster recovery: `DEEP`; Google Cloud SQL advanced DR / HA split-brain guidance: `DEEP`; Azure Site Recovery failover/test/reprotect: `DEEP`. Findings `G2-FINDING-SRFR-47..54`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### Historical authority
Detailed representative coverage for all other capabilities remains authoritative in their dossiers, earlier ledger revisions and `RESEARCH_PIPELINE_STATE.json` history.