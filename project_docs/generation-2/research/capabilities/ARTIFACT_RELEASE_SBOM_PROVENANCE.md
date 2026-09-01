# Artifact / Release / SBOM / Provenance — Generation 2 Research Dossier

Status: FIRST_DEEP_PASS_COMPLETE / NOT_SATURATED

## Research question

What portable semantics let System Builder identify, publish, promote, verify, inventory and retire generated artifacts without confusing logical artifact identity, immutable content identity, release identity, provenance, SBOM, signature/attestation, registry location or provider-specific distribution state?

## Representatives

- SLSA 1.2 + in-toto attestation model — DEEP
- SPDX 3.0.1 — DEEP
- CycloneDX 1.7 — DEEP
- OCI Image/Distribution specifications — DEEP
- Sigstore / cosign — DEEP
- GitHub artifact attestations — DEEP

## Evidence / source ledger

| Representative | Evidence used | Architectural extraction |
|---|---|---|
| SLSA 1.2 / in-toto | Provenance is verifiable information describing where/when/how software was produced; verification binds statement subject digest, predicate type and trusted builder/root | Provenance is a typed claim about immutable subjects and materials, not artifact identity, publication or policy itself. |
| SPDX 3.0.1 | `Element` has URI `spdxId`, creationInfo, external identifiers/references and integrity methods; `Bom`/`Sbom` are explicit collections with roots | BOM identity and BOM contents are separate; inventory is a graph/collection that can carry provenance, licensing and integrity without becoming release authority. |
| CycloneDX 1.7 | BOM has unique serial number and incrementing version; components/services/dependencies/compositions and completeness are represented | SBOM identity/version and product/component identity are distinct; completeness is evidence that must be qualified. |
| OCI | Descriptor binds mediaType, digest and size; digest is content identifier; tag is a human-readable pointer; subject/referrers associate manifests to immutable subjects | Content digest, mutable publication pointer and related attestations are distinct identities/relations. Registry is a distribution provider, not universal semantic authority. |
| Sigstore/cosign | Verification checks artifact digest and signer/certificate identity; keyless signing uses short-lived certs and transparency-log evidence; attestations can be policy-validated | Signature proves integrity/authenticity under a trust policy; it does not by itself prove provenance truth, release approval or semantic compatibility. |
| GitHub artifact attestations | Build provenance and SBOM attestations can be generated and verified; reusable workflows can strengthen SLSA level; offline verification is supported | Hosted attestation service is a provider implementation of portable subject/predicate/trust concepts; runtime/consumer verification must not require permanent control-plane availability. |

## Source of truth

No single artifact mechanism is universal authority. Generation 2 should preserve distinct authorities:

1. logical artifact contract/identity;
2. immutable serialized revision/content digest;
3. provenance/attestation statements about that immutable subject;
4. BOM inventory describing composition;
5. release record describing an approved/promoted set of artifact revisions;
6. publication/distribution bindings such as registry repository/tag/URL;
7. verification policy and verification result/evidence.

A registry tag, GitHub run, signature, SBOM document or SLSA statement must never silently replace the logical artifact identity.

## Identity

- Logical artifact identity is stable across revisions.
- Artifact revision identity is semantic/versioned and may additionally bind one or more algorithm-qualified content digests.
- Content digest identifies bytes/content, not business meaning.
- Release identity identifies a governed publication/promotion decision over one or more immutable artifact revisions.
- Attestation identity is separate from its subject; many attestations may describe the same subject.
- BOM identity/version is separate from component identity/version.
- Mutable aliases such as OCI tags are locators/pointers, never immutable artifact identity.

## Lifecycle

Candidate universal lifecycle:

`produce -> digest -> attest/inventory -> verify -> approve release -> publish/promote -> consume -> supersede/deprecate/revoke trust -> retain/dispose`

These transitions are not one provider transaction. Publication can fail after build succeeds; an attestation can be added after publication; verification policy can change without changing artifact bytes; a release can be superseded while its immutable artifacts remain retrievable.

## Versioning

At least these dimensions must remain independent: artifact semantic version, serialized-content digest, schema/envelope version, provenance predicate version, SBOM specification/document version, release version, signer/trust-root state and provider publication/tag state.

## Failure semantics

Material failure classes include digest mismatch, missing/incomplete provenance, unknown predicate, untrusted builder/signer, expired/revoked trust material, malformed/incomplete SBOM, subject mismatch, mutable tag drift, partial publication, lost attestation/referrer, verification-service outage and release-policy rejection. Fail-open/fail-closed behavior belongs to explicit verification policy and artifact criticality.

## Extensibility

Typed predicates and namespaced metadata are the preferred extension mechanism. New attestation/BOM predicates must not reinterpret core artifact identity. Unknown mandatory semantics must fail explicitly; optional metadata should be preservable.

## Provider boundaries

OCI registries, GitHub attestations, Sigstore transparency services and hosted SBOM stores are provider implementations. Portable core semantics are subject digest, logical identity/revision, typed claim/predicate, producer/builder/signer identity, materials, inventory relationships, release membership, verification policy/result and publication binding.

## Governance

Governance must distinguish producer evidence from approver authority. A valid signature or provenance statement is evidence, not release authorization. Promotion should record who/what approved which immutable subjects under which policy revision. Revocation should normally revoke trust/eligibility or supersede a release rather than mutate immutable historical evidence.

## Observability

Operational evidence should expose publication attempts, immutable digest, release membership, attestation discovery, verification result, policy revision, signer/builder identity, BOM availability/completeness and supersession/revocation state. CI logs are supporting diagnostics, not canonical provenance.

## Portability and lock-in

Portability improves when artifacts and evidence can be exported with algorithm-qualified digests, typed attestations and open BOM formats. Lock-in appears when identity is a registry path/tag, provenance can only be resolved through one hosted API, release approval is implicit in a CI provider, or verification requires unavailable provider state. OCI compatibility improves distribution interoperability but does not make OCI the universal artifact model.

## Product-specific mechanism vs universal primitive

| Product-specific mechanism | Universal primitive |
|---|---|
| OCI repository/tag/referrers | publication binding + immutable subject relation |
| Sigstore Fulcio/Rekor | signer identity evidence + transparency/inclusion evidence |
| GitHub artifact attestation | typed attestation + builder identity + verification evidence |
| SPDX/CycloneDX document | BOM identity + inventory graph + completeness/integrity evidence |
| SLSA level | qualified provenance assurance claim |

## Convergent patterns

- Immutable subjects are digest-bound.
- Evidence is typed and separately identifiable from its subject.
- Producer/build identity is part of provenance trust evaluation.
- Inventory/BOM and provenance answer different questions.
- Verification requires policy/trust context in addition to cryptographic validity.
- Distribution aliases are weaker than immutable references.

## Divergent patterns

- SPDX is a broad interoperable knowledge model; CycloneDX emphasizes modular BOM/use-case representation.
- OCI is distribution/content-addressing infrastructure, not a complete release/governance model.
- Sigstore provides signing/transparency mechanisms, while SLSA defines assurance requirements/provenance semantics.
- GitHub packages these mechanisms into a hosted workflow/control-plane implementation.

## Subcapabilities

1. logical artifact/revision identity
2. immutable content integrity
3. provenance/attestation model
4. SBOM/inventory model and completeness
5. release composition and approval
6. publication/promotion binding
7. signing and signer identity
8. verification policy/result
9. supersession/revocation/deprecation
10. retention/export/offline verification

## System Builder comparison — fresh `main` evidence only

`ADR-0009-public-artifact-envelope.md` already defines a provider-neutral public artifact envelope. It explicitly separates stable `artifactId`, immutable revision tuple `(artifactType, artifactId, artifactVersion)`, schema version, provenance and optional algorithm-qualified digest. It forbids provider/storage locators from becoming logical identity and says provenance is evidence/traceability rather than execution authority. It also rejects OCI as the universal envelope because registry/blob/content-addressing assumptions are not universal.

This is strong evidence for **KEEP + HARDEN** of the constitutional identity/provenance direction. The inspected evidence does **not** prove a canonical Generation-2 release record, SBOM contract, signing/verification policy, promotion/supersession model or portable attestation store. Those remain repository-archaeology questions, not implementation permission.

## Reconciliation hypotheses

- KEEP — ADR-0009 logical identity, semantic version, provider-neutral provenance and extension rules.
- HARDEN — algorithm-qualified immutable content evidence and subject binding across generated deliverables.
- GENERALIZE — provenance into typed attestations/verification evidence without turning every evidence object into the public artifact envelope.
- INTEGRATE — SPDX/CycloneDX as standard projections where product proof requires BOM interoperability; do not invent a proprietary SBOM ontology first.
- PROVIDERIZE — registry publication, signing service, transparency service and hosted attestation storage.
- DEFER — mandatory Sigstore/OCI/GitHub dependence; select providers only after target architecture and product-proof acceptance.
- DO_NOT_BUILD — a proprietary cryptographic signing protocol or proprietary SBOM standard.

## Repository validation questions

- Which generated outputs already receive content digests, and are those digests preserved across build/deploy evidence?
- Is there a canonical release identity distinct from artifact version and deployment record?
- Are release membership and promotion/rollback decisions represented durably?
- Does any current contract model SBOM or dependency inventory beyond package lockfiles?
- Can attestations/signatures be attached/discovered without changing artifact identity?
- Which trust/policy revision governs verification before deployment?
- Can generated systems export artifacts + provenance + BOM and verify them without the SB control plane?

## Symbiotic Proof

A valid proof should generate one system release containing multiple immutable artifact revisions, export its provenance and SBOM in open representations, publish through at least one provider, verify subjects and policy offline or independently of the SB control plane, republish the same immutable subjects through a second distribution provider without changing logical artifact/release identity, reject a digest/tag substitution, and preserve superseded release evidence without granting it current deployment eligibility.

## Stable findings

- G2-FINDING-ARTIFACT-01 — Logical Artifact, Artifact Revision and Content Digest Are Distinct Identities
- G2-FINDING-ARTIFACT-02 — Release Identity Is a Governed Composition, Not an Artifact Alias
- G2-FINDING-ARTIFACT-03 — Provenance Is a Typed Claim About a Subject, Not Artifact Authority
- G2-FINDING-ARTIFACT-04 — SBOM Identity and Component Identity Must Remain Separate
- G2-FINDING-ARTIFACT-05 — SBOM Completeness Must Be Qualified Evidence
- G2-FINDING-ARTIFACT-06 — Signature Validity and Release Authorization Are Separate Decisions
- G2-FINDING-ARTIFACT-07 — Verification Requires Policy and Trust Context Beyond Cryptographic Validity
- G2-FINDING-ARTIFACT-08 — Mutable Publication Aliases Must Never Replace Immutable Subject References
- G2-FINDING-ARTIFACT-09 — Supersession/Revocation Should Preserve Immutable Historical Evidence
- G2-FINDING-ARTIFACT-10 — Artifact Autonomy Requires Exportable and Independently Verifiable Evidence

## Candidate discoveries

- `G2-CAPABILITY-CANDIDATE-RELEASE-COMPOSITION-PROMOTION` — CROSS_CUTTING. Multi-representative structural need: release approval/promotion is distinct from build, artifact identity and deployment.
- `G2-CAPABILITY-CANDIDATE-ARTIFACT-VERIFICATION-POLICY` — CROSS_CUTTING. SLSA + Sigstore + GitHub show verification requires explicit trust/policy context.
- `G2-CAPABILITY-CANDIDATE-SBOM-COMPLETENESS-EVIDENCE` — CROSS_CUTTING. SPDX/CycloneDX plus provenance completeness patterns show inventory presence alone is insufficient.

Existing candidates strengthened: `BINDING-PROVENANCE`, `GENERATED-EXPERIENCE-LINEAGE`, `DURABLE-EXECUTION-EVIDENCE`, `AUTHORIZATION-DECISION-EVIDENCE`, `SCHEMA-MIGRATION-PROVENANCE`, `CONTENT-INTEGRITY-PROVENANCE`, `LOGICAL-PHYSICAL-CONTENT-LINEAGE`, `MESSAGE-DELIVERY-EVIDENCE`, `BUILD-ACTION-IDENTITY`, `REPRODUCIBILITY-QUALIFICATION`, `BUILD-INPUT-PROVENANCE`.

## Value / risk / priority / next question

Value: very high — generated-system autonomy, supply-chain trust, provider replacement and reproducibility depend on this boundary.

Risk: high if release, signature, registry and artifact identities collapse; that would create hidden control-plane/provider lock-in and ambiguous rollback/audit semantics.

Priority: foundational cross-cutting input to Deployment, Governance, Security, Lifecycle and Product Proof.

Next research question: Deployment / Environment / Runtime — determine how immutable releases become environment-specific deployments without leaking provider/runtime identity back into portable artifact semantics.
