# Generation 2 — Capability Discovery Register

Promotion requires multi-representative evidence or a clear structural System Builder need. Candidates are not architecture decisions.

Existing candidates through `G2-CAPABILITY-CANDIDATE-BUILD-INPUT-PROVENANCE` remain CANDIDATE with their prior classifications and promotion conditions recorded in pipeline history and capability dossiers.

| Candidate | Class | Evidence origin | Status | Promotion condition |
|---|---|---|---|---|
| G2-CAPABILITY-CANDIDATE-RELEASE-COMPOSITION-PROMOTION | CROSS_CUTTING | SLSA/in-toto + OCI publication distinction + GitHub attestations + SB ADR-0009 | CANDIDATE | Recur in Deployment/Lifecycle/Governance and prove a release composition authority distinct from artifact and deployment identity. |
| G2-CAPABILITY-CANDIDATE-ARTIFACT-VERIFICATION-POLICY | CROSS_CUTTING | SLSA verification + Sigstore/cosign + GitHub artifact attestations | CANDIDATE | Recur in Security/Governance/Product Proof with explicit trust-root, fail-open/closed and policy-revision semantics. |
| G2-CAPABILITY-CANDIDATE-SBOM-COMPLETENESS-EVIDENCE | CROSS_CUTTING | SPDX 3.0.1 + CycloneDX 1.7 + provenance completeness patterns | CANDIDATE | Recur in Governance/Security/Product Proof and remain distinct from generic provenance. |

This compact register view does not revoke or supersede earlier candidates; `RESEARCH_PIPELINE_STATE.json` is the authoritative candidate inventory.
