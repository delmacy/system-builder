# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Historical coverage in prior revisions, capability dossiers and state history remains authoritative; this compact ledger does not revoke omitted cells.

## Enterprise Completeness / Negative-Space Review — pass 1
NIST Cybersecurity Framework 2.0 / SP 1305 supply-chain governance: `DEEP`; FinOps Framework Allocation + Forecasting: `DEEP`; NIST Privacy Framework: `PARTIAL` (structural gap established; multi-representative privacy/retention research still required); NIST AI RMF / AI 600-1 / AIRC TEVV: `DEEP` for frontier-screen scope; RFC 5280 X.509 PKI: `DEEP`; RFC 8555 ACME: `DEEP`; RFC 7644 SCIM: `DEEP`; SLSA provenance/build integrity: `DEEP`; Backstage Catalog / developer-platform composition: `DEEP`.

Findings `G2-FINDING-ENSR-01..08`; four new candidates; no promotions. Result: `PASS_1_COMPLETE / MATERIAL_GAPS_FOUND`; Enterprise Completeness gate remains open. First structural research gap: Enterprise Trust / PKI / Certificate Lifecycle.

## Cycle authority
Cycles 2–7 completed for all 25 active capabilities. Every cycle-7 pass produced material findings; none was saturated.

## Revisit cycle 7
Completed: all 25 active capabilities. Architecture Reconciliation as a Capability was the final revisit and closes cycle 7. No capability is SATURATED because each cycle-7 revisit produced material architectural findings and therefore reset its consecutive-no-material streak.

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
