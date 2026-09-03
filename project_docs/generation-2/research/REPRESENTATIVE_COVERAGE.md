# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage in prior revisions, capability dossiers and state history remains authoritative; this compact ledger does not revoke omitted cells.

## Artifact-to-Runtime Admission — centralized proof disposition
SLSA v1.2 artifact verification/provenance expectations: `DEEP`; Sigstore policy-controller signature/attestation admission + custom TUF root: `DEEP`; Kubernetes Deployment/Pod desired-vs-observed generation and readiness: `DEEP`; SPIFFE trust-bundle rotation/currentness: `DEEP`; existing Provider/Binding effective-satisfaction research: `DEEP`; existing Deployment/Runtime rollout/reconciliation research: `DEEP`.

Findings `G2-FINDING-ATRA-01..08`. Centralized proof is **RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH** in `ARTIFACT_TO_RUNTIME_ADMISSION_PROOF.md`. No new top-level capability is promoted; `RuntimeAdmissionQualification` is an explicit cross-capability proof/contract over Artifact/Provenance + Enterprise Trust + Provider Binding + Config/Secrets + Standards/Contracts + Deployment + Observability + Lifecycle. Artifact admission remains distinct from observed effective runtime realization.

## Workload-Driven Minimal Runtime Realization — centralized proof disposition
Nix store closure / `why-depends` / closure copy: `DEEP`; Bazel dependency query/closure/path explanation: `DEEP`; Docker multi-stage runtime minimization: `DEEP`; Kubernetes Deployment/autoscaling/RuntimeClass: `DEEP`; Knative Serving autoscaling/scale-to-zero: `DEEP`; AWS Lambda concurrency realization: `DEEP`.

Findings `G2-FINDING-WDRR-01..08`. The four workload-driven realization candidates are dispositioned without top-level promotion: minimal closure merges into Build + Deployment, realization into existing cross-capability owners, OperationalProfile becomes a first-class cross-cutting contract (not a capability), and realization evolution merges into Lifecycle + Deployment. Centralized workload-driven minimal-runtime proof debt is resolved.

## Economic Governance / FinOps / Procurement — structural gap disposition
FinOps Framework: `DEEP`; FOCUS 1.4: `DEEP`; OpenCost: `DEEP`; Microsoft Azure Cost Management: `DEEP`; AWS Cost Management: `TARGETED`; Google Cloud commitment pricing: `TARGETED`; TCO/private-cloud literature: `TARGETED`.

Findings `G2-FINDING-EGFP-01..08`; four candidates. Parent **SPLIT / PARENT_NOT_PROMOTED**. `G2-CAPABILITY-CANDIDATE-TECHNOLOGY-ECONOMIC-GOVERNANCE-FINOPS` is **CROSS_CUTTING / PROMOTED / NOT_SATURATED**. Procurement/Sourcing/Vendor Contract Execution remains specialized/domain-specific; provider billing/optimization mechanics remain providerized; Commercial Metering continues to own customer-commercial billing semantics.

## AI Evaluation / Model / Prompt / Safety Governance — structural gap research
NIST AI RMF Generative AI Profile + AIRC TEVV: `DEEP`; MLflow: `DEEP`; LangSmith: `DEEP`; Microsoft Foundry: `DEEP`; Google Vertex AI: `DEEP`. Parent RESEARCH_COMPLETE / MERGE_INTO_EXISTING_OWNERS / NOT_PROMOTED.

## Privacy / Data Governance / Retention / Legal Hold / Residency
NIST Privacy Framework: `DEEP`; EU GDPR: `DEEP`; Microsoft Purview: `DEEP`; Google Assured Workloads/Data Residency: `DEEP`; AWS Control Tower Data Residency: `DEEP`; OPA: `DEEP`. Parent promoted CROSS_CUTTING / NOT_SATURATED.

## Enterprise Trust / PKI / Certificate Lifecycle
RFC 5280: `DEEP`; RFC 8555 ACME: `DEEP`; SPIFFE/SPIRE: `DEEP`; cert-manager: `DEEP`; Vault PKI: `DEEP`; Smallstep step-ca: `DEEP`. Parent promoted CROSS_CUTTING / NOT_SATURATED.

## Enterprise Completeness / Negative-Space Review
Seven original cycles are complete. Trust, Privacy and Technology Economic Governance are promoted post-cycle-7 owners and remain NOT_SATURATED. AI Evaluation is explicitly merged into existing owners. Workload-driven minimal-runtime realization and Artifact-to-Runtime Admission are now dispositioned by explicit cross-capability contracts/proofs without new semantic owners. Remaining trust/privacy/AI/economic/domain-composition/disconnected-trust centralized proof junctions remain open before synthesis.

## Historical authority
Detailed representative coverage for all other capabilities remains authoritative in their dossiers, earlier ledger revisions and `RESEARCH_PIPELINE_STATE.json` history.