# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage in prior revisions, capability dossiers and state history remains authoritative; this compact ledger does not revoke omitted cells.

## Domain Composition / Provider Identity — centralized proof
SCIM RFC 7643 identity and `externalId` scoping: `DEEP`; Backstage Catalog entity/provider/external-reference semantics: `DEEP`; Crossplane managed-resource vs external-name identity and ambiguous-create reconciliation: `DEEP`; OpenSearch cross-cluster/multi-search federation: `DEEP`; Salesforce external-object / External ID relationships: `DEEP`.

Findings `G2-FINDING-DCPI-01..08`. Domain-composition/provider-identity centralized proof is **RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH_WITHOUT_NEW_PROMOTION** in `DOMAIN_COMPOSITION_PROVIDER_IDENTITY_CENTRALIZED_PROOF.md`.

## Technology Economic Governance — centralized proof
FinOps Framework Allocation / Forecasting / Rate Optimization: `DEEP`; FOCUS 1.4 normalization/effective-cost/commitment semantics: `DEEP`; OpenCost allocation/custom on-prem pricing: `DEEP`; AWS Cost Management amortized/net-amortized semantics: `DEEP`; Microsoft Cost Management actual/amortized reservation and savings-plan semantics: `DEEP`; Google Cloud Billing/CUD model and data-latency semantics: `DEEP`; on-prem/internal-rate evidence via OpenCost + FinOps Data Center guidance: `DEEP`.

Findings `G2-FINDING-TEGP-01..08`. Technology-economic centralized proof resolved.

## AI Evaluation Qualification / Stale-Evidence Rejection — centralized proof
MLflow: `DEEP`; LangSmith: `DEEP`; Microsoft Foundry: `DEEP`; NIST AI RMF / AIRC TEVV: `DEEP`; Google Vertex AI: `TARGETED`. Findings `G2-FINDING-AIQP-01..08`; proof resolved.

## Privacy Retention / Hold / Residency — centralized proof
EU GDPR: `DEEP`; Microsoft Purview: `DEEP`; NARA: `DEEP`; Google Cloud residency: `DEEP`; AWS Control Tower residency: `DEEP`; OPA: `DEEP`. Findings `G2-FINDING-PRHR-01..08`; proof resolved.

## Enterprise Trust Qualification / Rotation / Substitution / Offline — centralized proof
RFC 5280: `DEEP`; SPIFFE: `DEEP`; cert-manager/trust-manager: `DEEP`; Vault PKI: `DEEP`. Findings `G2-FINDING-ETQP-01..08`; proof resolved.

## Artifact-to-Runtime Admission — centralized proof disposition
SLSA v1.2: `DEEP`; Sigstore policy-controller: `DEEP`; Kubernetes generation/readiness: `DEEP`; SPIFFE trust currentness: `DEEP`; Provider/Binding research: `DEEP`; Deployment/Runtime research: `DEEP`. Findings `G2-FINDING-ATRA-01..08`; proof resolved.

## Workload-Driven Minimal Runtime Realization — centralized proof disposition
Nix: `DEEP`; Bazel: `DEEP`; Docker: `DEEP`; Kubernetes: `DEEP`; Knative: `DEEP`; AWS Lambda: `DEEP`. Findings `G2-FINDING-WDRR-01..08`; proof resolved.

## Structural-gap dispositions
Technology Economic Governance / FinOps: promoted CROSS_CUTTING / NOT_SATURATED. AI Evaluation: merged into existing owners / not promoted. Privacy/Data Governance: promoted CROSS_CUTTING / NOT_SATURATED. Enterprise Trust/PKI: promoted CROSS_CUTTING / NOT_SATURATED.

## Enterprise Completeness / Negative-Space Review
Seven original cycles are complete. All structural gaps and centralized proof junctions discovered by the pass-1 falsification are now dispositioned. Explicit gate closure still requires checking the six Enterprise Completeness closure criteria before synthesis.

## Historical authority
Detailed representative coverage for all other capabilities remains authoritative in their dossiers, earlier ledger revisions and `RESEARCH_PIPELINE_STATE.json` history.