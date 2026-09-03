# Generation 2 — Finding Index

Prior stable findings remain authoritative in capability dossiers, earlier index revisions and pipeline history. Compacting this index does not revoke them.

## Enterprise Trust / PKI — post-promotion saturation revisit 01
No new stable finding was minted. Research-by-exception against RFC 5280, RFC 8555/ACME, SPIFFE, cert-manager/trust-manager and Vault PKI found no material architectural primitive, boundary or failure mode beyond the existing `G2-FINDING-ETPKI-*` and `G2-FINDING-ETQP-01..08` families. This is **ELIGIBLE_NO_MATERIAL_FINDING_REVISIT_1_OF_2**; see `ENTERPRISE_TRUST_PKI_POST_PROMOTION_SATURATION_REVISIT_01.md`.

## Domain Composition / Provider Identity — centralized proof disposition
- **G2-FINDING-DCPI-01** — Canonical domain/business identity and provider/external identity are distinct; external IDs are typed aliases/bindings scoped by provider, tenant/account, resource type/schema and revision/currentness.
- **G2-FINDING-DCPI-02** — SCIM service-provider `id`, provisioning-domain `externalId`, and canonical Person/Role/Station identities must not collapse into one universal identifier.
- **G2-FINDING-DCPI-03** — Portal/search/catalog composition may aggregate heterogeneous providers while preserving source lineage; aggregation never grants an external source canonical-identity authority.
- **G2-FINDING-DCPI-04** — Missing, stale or ambiguous mappings yield `PARTIAL/INCONCLUSIVE` or deny privileged mutation, never synthetic identity or first-match canonicalization.
- **G2-FINDING-DCPI-05** — Provider substitution/reconnection preserves canonical identity but creates a new binding qualification event; stale external references cannot remain silently authoritative.
- **G2-FINDING-DCPI-06** — Unknown external create/update outcome requires reconcile-before-retry to prevent duplicate/leaked provider objects and alias divergence.
- **G2-FINDING-DCPI-07** — Provider-identity portability is a mixed support vector across ID stability, mutability, tombstones, lookup/search semantics, versioning, freshness and evidence.
- **G2-FINDING-DCPI-08** — `Enterprise → Station → Role → Person` and AGWS/AI remain non-amplifying: lower layers may consume qualified bindings but cannot remap canonical identity, widen provider scope, synthesize missing mappings or acquire provider-admin/canonical-domain authority.

Disposition: Domain Composition / Provider Identity centralized proof **RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH_WITHOUT_NEW_PROMOTION** in `DOMAIN_COMPOSITION_PROVIDER_IDENTITY_CENTRALIZED_PROOF.md`.

## Current centralized proof families
Technology Economic Governance: `G2-FINDING-TEGP-01..08`; AI Evaluation Qualification: `G2-FINDING-AIQP-01..08`; Privacy Retention/Hold/Residency: `G2-FINDING-PRHR-01..08`; Enterprise Trust Qualification: `G2-FINDING-ETQP-01..08`; Artifact-to-Runtime Admission: `G2-FINDING-ATRA-01..08`; Workload-Driven Runtime Realization: `G2-FINDING-WDRR-01..08`; Economic Governance structural disposition: `G2-FINDING-EGFP-01..08`.

All detailed finding text remains authoritative in the corresponding proof/dossier artifacts and prior index revisions.