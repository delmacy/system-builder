# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage in prior revisions, capability dossiers and state history remains authoritative; this compact ledger does not revoke omitted cells.

## AI Evaluation / Model / Prompt / Safety Governance — structural gap research
NIST AI RMF Generative AI Profile + AIRC TEVV/metrology: `DEEP`; MLflow Prompt Registry + GenAI Evaluation (provider-neutral/open-source): `DEEP`; LangSmith datasets/experiments/evaluators/model-prompt-tool metadata: `DEEP`; Microsoft Foundry evaluation runs/safety metrics/human feedback/threshold-qualified pass-fail: `DEEP`; Google Vertex AI model evaluation with ground-truth dataset and batch inference outputs: `DEEP`.

Findings `G2-FINDING-AIEG-01..08`; four consolidation candidates. Parent candidate **RESEARCH_COMPLETE / MERGE_INTO_EXISTING_OWNERS / NOT_PROMOTED**. Structural conclusion: explicit applicability-qualified AI evaluation contracts are mandatory, but semantic ownership composes without collapse across AI-native Engineering, Governance/Compliance/Audit, Artifact/Provenance, Lifecycle, Observability and Provider Binding. Provider evaluators/judges/safety classifiers remain providerized.

## Privacy / Data Governance / Retention / Legal Hold / Residency — structural gap research
NIST Privacy Framework: `DEEP`; EU GDPR purpose/storage/erasure/restriction/legal-claims: `DEEP`; Microsoft Purview retention/records/eDiscovery: `DEEP`; Google Assured Workloads/Data Residency: `DEEP`; AWS Control Tower Data Residency: `DEEP`; OPA provider-neutral policy boundary: `DEEP`. Parent promoted `CROSS_CUTTING / NOT_SATURATED`.

## Enterprise Trust / PKI / Certificate Lifecycle — structural gap research
RFC 5280: `DEEP`; RFC 8555 ACME: `DEEP`; SPIFFE/SPIRE: `DEEP`; cert-manager: `DEEP`; Vault PKI: `DEEP`; Smallstep step-ca: `DEEP`. Parent promoted `CROSS_CUTTING / NOT_SATURATED`.

## Enterprise Completeness / Negative-Space Review
Seven cycles are complete for the original 25 capabilities. Enterprise Trust and Privacy/Data Governance were promoted after cycle 7 and remain NOT_SATURATED. AI Evaluation / Model / Prompt / Safety Governance has now received dedicated multi-representative disposition and is not promoted; its qualification proof junction remains backfill-required. Economic Governance and workload-driven runtime/proof obligations remain open.

## Historical authority
Detailed representative coverage for all other capabilities remains authoritative in their dossiers, earlier ledger revisions and `RESEARCH_PIPELINE_STATE.json` history.