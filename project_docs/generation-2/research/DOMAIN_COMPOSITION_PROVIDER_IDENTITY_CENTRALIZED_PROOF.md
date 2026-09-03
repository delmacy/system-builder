# Generation 2 — Domain Composition / Provider Identity Centralized Proof

Status: RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH_WITHOUT_NEW_PROMOTION
Phase: RESEARCH_ELICITATION / Enterprise Completeness gate

## Research question
Can the Generation 2 taxonomy compose enterprise portal/search/catalog/directory/provider resources across heterogeneous systems without allowing external/provider identifiers to become canonical business identity, while preserving rebinding, ambiguity semantics, lineage, delegated authority and provider substitution?

## Representatives and evidence ledger
1. **SCIM RFC 7643** — distinguishes service-provider-issued stable `id` from client-issued `externalId`; `externalId` is explicitly scoped to the provisioning domain. This is direct evidence that provider identity and cross-domain alias identity are distinct contracts.
2. **Backstage Software Catalog** — catalog entities have catalog identity while annotations reference external systems; entity providers ingest heterogeneous sources and provider names must remain stable because emitted entities are associated with the provider. This demonstrates composition over provider-originated evidence without requiring the external reference to become the catalog entity's canonical identity.
3. **Crossplane managed resources** — Kubernetes managed-resource identity is distinct from `crossplane.io/external-name`, which identifies the resource inside the provider. Creation annotations exist specifically because an external effect can occur before its provider identifier is safely recorded; ambiguous creation is reconciled before further actuation.
4. **OpenSearch cross-cluster / multi-search** — one query surface can span multiple clusters/data sources; independent sub-search failure does not require collapsing source identities into one canonical identifier.
5. **Salesforce external objects / external lookup relationships** — external objects and External ID-based relationships preserve explicit mapping to externally stored records rather than requiring provider-native record identity to become the sole internal business identity.

## Source of truth and typed identity model
Canonical business/domain identity belongs to the domain owner that defines the entity's semantics. External identity is represented as a typed binding/alias, not a replacement key:

`CanonicalIdentity { domain, entityType, canonicalId, revision }`

`ExternalIdentityBinding { canonicalIdentityRef, provider, tenant/account, resourceType/schema, externalId, externalVersion?, bindingRevision, validity/currentness, evidenceRef }`

For directory federation, `Person`, `Role`, `Station`, group/organization and provider directory resource identities remain distinct. SCIM `id` is canonical only inside the SCIM service provider's resource set; SCIM `externalId` is scoped to its provisioning domain and is therefore evidence for mapping, not universal person identity.

## Lifecycle and versioning
A binding lifecycle is `discovered/proposed → matched → qualified → active → stale/suspect → rebound/superseded → retired`, independently revisioned from the canonical entity. Provider substitution or reconnect does not mutate canonical identity; it creates/requalifies bindings. Historical bindings remain replayable against their producing provider/tenant/schema/version and evidence horizon.

## Failure semantics
- missing required mapping → `PARTIAL` or `INCONCLUSIVE`, never synthetic identity;
- multiple plausible canonical matches → `AMBIGUOUS/INCONCLUSIVE`, never first-match wins;
- provider create outcome unknown before external ID persistence → reconcile provider state before retry;
- stale provider/tenant/schema/version binding → deny privileged mutation or require requalification;
- disconnected cache/search hit outside freshness horizon → evidence may remain historically valid but cannot silently establish current binding.

## Extensibility and provider boundaries
Provider adapters own discovery, transport and provider-native identifiers. They do not own canonical business identity. Portal/search/catalog layers may aggregate heterogeneous results, but each result preserves canonical identity when known plus source/binding lineage. Provider-specific identifiers remain typed by provider + tenant/account + resource type/schema + revision/version context.

## Governance, authority and AGWS
`Enterprise → Station → Role → Person` remains monotonic. A Station may expose only a subset of provider-backed capabilities/resources and may delegate bounded administration, but lower layers cannot remap canonical identity, widen provider scope, or synthesize a missing mapping. Adaptive Governed Work Surfaces remains distinct: AI may materialize a governed surface that joins catalog/search/provider results through qualified bindings, but it cannot make an external ID canonical, grant provider-admin authority, or silently merge ambiguous people/resources.

## Observability and evidence
Every resolution should expose canonical identity, selected binding revision, provider/tenant/resource type, mapping method, confidence/qualification status, source evidence, freshness and ambiguity. Search/portal composition must surface partial-source failure rather than presenting an incomplete federation as complete.

## Portability and lock-in
Portability requires canonical identity to survive provider replacement. External IDs are replaceable bindings. A provider-neutral definition that embeds an untyped provider ID as its canonical key is lock-in and fails the proof. Mixed provider support is expected across lookup semantics, external-ID stability, versioning, deletion/tombstones, pagination/search consistency and offline freshness.

## Product-specific mechanisms vs universal primitives
Product-specific: SCIM `id`/`externalId`, Backstage annotations/providers, Crossplane `external-name`, OpenSearch cluster/index addressing, Salesforce External IDs.
Universal: canonical identity, typed external binding, provider/tenant/resource scope, binding revision/currentness, ambiguity state, source lineage, rebinding, reconciliation-before-retry and partial-composition evidence.

## Convergent and divergent patterns
Convergent: external references are scoped; provider identity is not globally universal; aggregation preserves source context; mappings require lifecycle/currentness. Divergent: systems vary in whether aliases are client- or provider-issued, whether external IDs are mutable, whether joins are materialized or federated, and how ambiguous external effects are detected.

## Subcapabilities / owner disposition
No new top-level capability is required. Ownership composes across:
- Process & Application Modeling / domain owners — canonical business identity semantics;
- Identity / Authentication / Federation — Person/directory identity and federation mappings;
- Integration & Automation — external object discovery/synchronization;
- Provider / Binding / Capability Negotiation — typed provider binding and requalification;
- Standards / Interoperability / API Contracts — SCIM/schema/protocol identity semantics;
- Adaptive Governed Work Surfaces + UI/Generated Experience — composition/presentation without identity ownership;
- Architecture Reconciliation + Lifecycle — rebinding, stale mapping and provider substitution.

## SB comparison
No fresh-main claim is needed to resolve this taxonomy proof. Repository archaeology remains reserved for Planning B; this proof establishes the required semantics without treating the research branch as product truth.

## Reconciliation hypotheses
- **KEEP** any existing explicit domain identities found in Planning B.
- **HARDEN** external references with provider/tenant/resource/version scope and evidence currentness.
- **GENERALIZE** provider aliases into typed `ExternalIdentityBinding`-like contracts.
- **PROVIDERIZE** discovery/search/provider-native ID mechanics.
- **INTEGRATE** SCIM/directory mappings without collapsing Person/Role/Station identities.
- **REPLACE** only untyped external IDs used as canonical cross-provider business keys.

## Repo-validation questions for Planning B
1. Where does fresh `main` currently establish canonical identity for domain entities, users, organizations and provider-backed resources?
2. Are external IDs typed by provider/tenant/resource type, or stored as unqualified strings?
3. Can provider substitution preserve canonical identity while replacing bindings?
4. Are ambiguous external create/update outcomes reconciled before retry?
5. Do portal/search/catalog results preserve source lineage and partial-failure status?
6. Are Person, Role, Station and directory-provider identities structurally distinct?

## Symbiotic Proof
1. Create canonical business object `C1`; bind provider A external object `A-17`. Replace provider A with B object `B-91`. `C1` remains unchanged while binding revision changes and stale `A-17` cannot authorize current mutation.
2. SCIM directory maps provider resource `id=P123` and provisioning-domain `externalId=HR-77` to canonical Person `PERSON-9`; none of those three identifiers are interchangeable outside their declared scope.
3. Federated portal/search joins two providers and one source fails. The surface returns qualified partial results with source lineage, not a fabricated complete result set.
4. Two external records plausibly map to one Person. Resolution is `AMBIGUOUS/INCONCLUSIVE`; AI/AGWS cannot auto-merge them.
5. Provider create acknowledgement is lost before external ID persistence. Retry is blocked until reconciliation determines whether the resource already exists.
6. Station changes provider binding or reconnects after stale cache horizon. Existing personalization is revalidated against current binding/authority before provider-backed actions resume.

## Stable findings
- **G2-FINDING-DCPI-01** — Canonical domain/business identity and provider/external identity are distinct; external IDs are typed aliases/bindings scoped by provider, tenant/account, resource type/schema and revision/currentness.
- **G2-FINDING-DCPI-02** — SCIM identity is explicitly domain-scoped: service-provider `id`, provisioning-domain `externalId`, and canonical Person/Role/Station identities must not collapse into one universal identifier.
- **G2-FINDING-DCPI-03** — Portal/search/catalog composition may aggregate heterogeneous providers while preserving source lineage; aggregation never grants an external source canonical-identity authority.
- **G2-FINDING-DCPI-04** — Missing, stale or ambiguous identity mappings yield `PARTIAL/INCONCLUSIVE` (or deny privileged mutation), never synthetic identity or first-match canonicalization.
- **G2-FINDING-DCPI-05** — Provider substitution/reconnection preserves canonical identity but creates a new binding qualification event; stale external references cannot remain silently authoritative.
- **G2-FINDING-DCPI-06** — Unknown external create/update outcome is an identity/reconciliation hazard: reconcile-before-retry is required to prevent duplicate/leaked provider objects and alias divergence.
- **G2-FINDING-DCPI-07** — Provider-identity portability is a mixed support vector across ID stability, mutability, tombstones, lookup/search semantics, versioning, freshness and evidence; API/schema similarity is insufficient equivalence proof.
- **G2-FINDING-DCPI-08** — `Enterprise → Station → Role → Person` and AGWS/AI remain non-amplifying: lower layers may consume qualified bindings but cannot remap canonical identity, widen provider scope, synthesize missing mappings or acquire provider-admin/canonical-domain authority.

## Value / risk / priority / next question
Value: removes the final centralized identity-composition ambiguity from the Enterprise Completeness gate.
Risk avoided: provider lock-in, identity collision, accidental account/person merges, duplicate external resources and stale-provider actuation.
Priority: gate-closing.
Next question: with all centralized negative-space proofs dispositioned, perform the explicit Enterprise Completeness gate closure check against its six closure criteria before entering `CAPABILITY_SYNTHESIS`.