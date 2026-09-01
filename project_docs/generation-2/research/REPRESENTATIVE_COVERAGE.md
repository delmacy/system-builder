# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Previous capability coverage remains authoritative in the corresponding dossiers and state file; this ledger is append-oriented as research advances.

## Artifact / Release / SBOM / Provenance coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| SLSA 1.2 / in-toto | DEEP | Separates immutable subjects, materials, builder identity and typed provenance; verification requires subject digest plus trusted builder/root context. | Source provenance, delegation, provenance distribution/loss and trust-root rotation. |
| SPDX 3.0.1 | DEEP | Explicit Element/BOM/SBOM identities, creation info, relationships, external refs and integrity methods provide an interoperable inventory graph. | Profiles, serialization interoperability, completeness and mapping to generated runtime composition. |
| CycloneDX 1.7 | DEEP | BOM serial identity/version, component/service/dependency graph and composition/completeness semantics distinguish BOM lifecycle from product lifecycle. | Attestation/declarations, VEX interplay, formulation and completeness across generated systems. |
| OCI Image + Distribution specs | DEEP | Digest-bound descriptors, mutable tags, subject/referrers and registry distribution cleanly expose immutable content vs publication alias. | Referrer portability across registries, garbage collection/retention, multi-registry promotion and non-container artifacts. |
| Sigstore / cosign | DEEP | Digest-bound signatures, signer identity, keyless certificates, transparency evidence and attestation verification expose trust-policy boundaries. | Revocation/trust-root rotation, offline bundles, private transparency infrastructure and provider replacement. |
| GitHub artifact attestations | DEEP | Hosted implementation of SLSA/SBOM attestations with verification and offline path demonstrates providerizable provenance services. | Attestation lifecycle deletion/retention, private-repo portability and migration away from GitHub control plane. |

Historical representative coverage for prior capabilities is preserved in `RESEARCH_PIPELINE_STATE.json` and their capability dossiers; no prior status is superseded by this compact ledger update.
