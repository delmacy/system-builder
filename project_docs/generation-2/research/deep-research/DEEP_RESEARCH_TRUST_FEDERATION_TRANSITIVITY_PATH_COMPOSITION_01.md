# Generation 2 Deep Research — Trust Federation Transitivity & Policy-Constrained Path Composition 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY  
Phase at research time: `RESEARCH_ELICITATION`  
Affected owner: `G2-CAPABILITY-CANDIDATE-ENTERPRISE-TRUST-PKI-CERTIFICATE-LIFECYCLE`  
Deep Research ID: `DR-TFTPC-01`

## Question

When Generation 2 connects trust domains, certification authorities, trust-bundle distributors, providers or Stations, may trust legitimately compose across multiple hops, or must every relying relationship be direct and explicitly configured?

More precisely:

- does `A trusts B` plus `B trusts C` ever justify `A accepts C`;
- if it sometimes does, what exact relation is being composed: certification authority, bundle authenticity, identity acceptance, authorization, policy equivalence or provider distribution;
- which path constraints, policy mappings, name/identity scopes, purpose/usages, direction, time/currentness and trust-anchor inputs must survive the composition;
- when is a discovered path only candidate evidence rather than effective trust;
- can provider path building or federation mechanics silently widen portable System Builder trust semantics;
- can a Station, Role, Person or AI create a new effective bridge by composing individually allowed relationships;
- what evidence is required when multiple paths or providers can realize the same declared relationship.

The question is deliberately narrower than “how should PKI work?”. It tests one residual architectural ambiguity that can alter the meaning of `TrustRelationship`, provider conformance and non-amplifying authority.

## Why this is architecturally material

The promoted Enterprise Trust dossier already owns trust domains/relationships, trust-anchor and bundle revisions, issuer/certificate lifecycle, revocation/currentness, consumer-effective generation, provider substitution and disconnected trust horizons. The first post-promotion revisit found no new architecture, and a concurrent second breadth revisit tested AWS Private CA, Google CA Service and Kubernetes rotation/revocation behavior without finding a new primitive.

That corpus, however, leaves a sharp ambiguity around **composition**.

A simplistic non-transitivity rule is false for mature PKIX bridge/cross-certification: certification paths deliberately cross organizational PKIs and can map policy under constraints. A simplistic transitive-closure rule is also false: SPIFFE federation requires explicit trust-domain/bundle association and warns that federation configuration is security-sensitive; identity/authorization relationships do not become globally transitive merely because cryptographic trust can be chained.

If G2 says only “trust relationship” without preserving relation kind and composition semantics, synthesis can accidentally choose either wrong extreme:

```text
A trusts B + B trusts C
        ↓
A trusts C                # unsafe generic closure
```

or:

```text
all trust must be direct  # cannot express bridge/cross-certified PKI
```

The architectural question is therefore whether the existing owner needs a **policy-constrained trust-path composition** refinement, not whether G2 needs another top-level capability.

## SB input corpus

This Deep Research treated the following repository material as hypotheses/evidence input, not automatic conclusion:

- `RESEARCH_PIPELINE_STATE.json`: phase remains `RESEARCH_ELICITATION`; Enterprise Completeness structural criteria pass; post-cycle-7 promoted capabilities are under normal saturation reconciliation. Deep Research must not increment cycles, mark a breadth revisit, or declare saturation.
- `RESEARCH_EVIDENCE_METHOD.md`: universalization requires structural necessity or multi-source corroboration; late research is information-gain driven; contradictions must be preserved rather than averaged away.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md`: material claims require falsification paths, provider substitution, authority/security, offline, version/currentness and evidence proofs.
- Capability Discovery Register, Finding Index, Representative Coverage and Capability Proof Matrix.
- `ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE.md`: already defines `TrustDomainId`, `TrustRelationshipId`, trust/issuer/bundle revisions, `ConsumerEffectiveTrustGeneration`, applicability-scoped `issuer/path` qualification and provider-neutral federation support vectors.
- `ENTERPRISE_TRUST_QUALIFICATION_ROTATION_SUBSTITUTION_OFFLINE_PROOF.md`: `G2-FINDING-ETQP-01..08` establish qualified path/anchor/policy/currentness semantics, provider support vectors, residual drainage, offline horizons and non-amplification.
- `ENTERPRISE_TRUST_PKI_POST_PROMOTION_SATURATION_REVISIT_01.md`: explicitly identifies cross-domain federation as a remaining adversarial direction while finding no exception in its selected representatives.
- concurrent `ENTERPRISE_TRUST_PKI_POST_PROMOTION_SATURATION_REVISIT_02.md`: tests AWS/Google/Kubernetes rotation and revocation but does not test bridge-PKI/path-composition semantics.
- `DEEP_RESEARCH_AUTHORITY_BEARING_DERIVED_CLAIMS_RECURSIVE_TRUST_01.md`: correctly rejects circular/self-rooting trust and “transitive magic”, while leaving room for explicitly rooted and scoped trust chains.
- `DEEP_RESEARCH_RECOVERY_ROOT_ROTATION_HISTORICAL_VERIFICATION_01.md`: historical verification eligibility is distinct from current trust admission.

No product code or current implementation was executed.

## External evidence ledger

### E1 — RFC 5280: constrained composition is real PKIX semantics

Source: https://www.rfc-editor.org/rfc/rfc5280

RFC 5280 path validation starts from an externally selected trust anchor and evaluates a prospective certification path under explicit inputs. The standard includes certificate policies, policy mappings, policy constraints, name constraints, current time and application-specific restrictions. Policy mapping explicitly represents a CA assertion that an issuer-domain policy may be considered equivalent to a subject-domain policy, while policy constraints can prohibit or limit mappings.

Architectural extraction: multi-hop certification is legitimate, but the result is **not graph reachability**. Trust emerges from a consumer-selected anchor plus a path whose accumulated constraints and policy mappings satisfy the relying application.

### E2 — RFC 4158: bridge/mesh path building is powerful but dangerous

Source: https://www.rfc-editor.org/rfc/rfc4158

RFC 4158 describes hierarchical, mesh, bilateral cross-certified and bridge PKIs. Cross-certification can extend trust between infrastructures, but path construction in a mesh can create loops, dead ends and enormous search spaces. Its example graph yields millions of structural paths before semantic pruning. It also notes that longer/more complicated paths can lose assurance or fail due to constraints, policies, CRL availability or revocation.

Architectural extraction: path construction is provider/mechanism work; G2 must own the semantic constraints that make a path acceptable and must never equate “provider found a path” with portable trust qualification.

### E3 — U.S. Federal Bridge PKI: controlled transitivity is an enterprise production pattern

Sources:

- https://www.idmanagement.gov/fpki/
- https://www.idmanagement.gov/implement/announcements/FBCAG5/

The Federal Bridge connects independently operated PKIs through cross-certificates and governed policy relationships. This is not a shared global root copied into every participant. It is a bridge architecture in which relying parties can build paths across organizational PKIs under common-policy and cross-certification governance.

The current FBCA G5 migration is especially useful evidence. Phase 1 began August 27, 2026 with cross-certification between the Federal Common Policy CA G2 and FBCA G5. Phase 2, August 28–September 4, 2026, reissues affiliate cross-certificates and deliberately creates parallel old/new trust paths while relying-party trust stores are updated. Later phases revoke the old G4 cross-certificates and finally the old bridge CA.

Architectural extraction: trust-path composition, path revision, overlap, consumer adoption and retirement are real operational concerns. A bridge edge is revisioned trust infrastructure, not a timeless Boolean relationship.

### E4 — SPIFFE federation: peer acceptance is explicit and domain-bound

Source: https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/

SPIFFE federation requires administrators to configure the foreign trust domain, bundle endpoint URL and endpoint profile. Clients must preserve the association between trust-domain name and the corresponding bundle; tampering with these parameters can break security. A workload validates identities in a foreign trust domain because that foreign domain/bundle relationship was explicitly configured.

Architectural extraction: `A federates with B` does not generally imply `A federates with every domain B federates with`. Peer trust is a configured relationship, not automatic transitive closure.

### E5 — SPIFFE bundle authenticity can itself form a chain

The same SPIFFE federation specification contains a different composition relation. A non-self-serving bundle endpoint can be authenticated using a SPIFFE ID from another trust domain whose bundle was directly configured or obtained through another federation relationship. The specification explicitly describes this as a chain of relationships terminating at a self-serving trust domain, Web PKI, statically configured bundle or an external process. It warns that compromise of an intermediary can compromise the next domain and discourages long chains.

Architectural extraction: even inside one standard, **peer identity acceptance** and **bundle-source authenticity** have different transitivity/composition semantics. A generic `trusted=true` cannot represent both safely.

### E6 — Istio/SPIRE operational federation is explicit

Representative sources:

- https://istio.io/latest/docs/ops/integrations/spire/
- https://spiffe.io/docs/latest/architecture/federation/

Operational federation configures participating trust domains and distributes the corresponding bundles to workloads/proxies. The mechanics differ from bridge PKI, but the same principle holds: the remote trust relationship is explicit and the consumer must receive the applicable bundle.

### E7 — Trust-domain aliases are not universal trust composition

Source: https://istio.io/latest/docs/tasks/security/authorization/authz-td-migration/

Istio trust-domain migration can use aliases so authorization policy treats identities from old/new trust domains as equivalent during migration. That is a scoped identity/authorization interpretation rule. It does not imply that every root, issuer, federation or provider relationship from one domain becomes trusted under the other.

Architectural extraction: identity equivalence/migration and trust-path composition must not be laundered into one generic graph relation.

## Core contradiction

The evidence falsifies both universal extremes:

```text
“Trust is never transitive.”      # false for valid bridge/cross-certified paths
```

and:

```text
“A→B and B→C means A→C.”          # false without relation/policy constraints
```

A more accurate principle is:

> Trust is not generically transitive. Some **typed trust relations** are intentionally composable under explicit path semantics, independently admitted roots, policy/identity/purpose constraints, currentness and relying-party qualification.

This is a semantic property of the trust relationship/path, not a generic graph property.

## Competing models

### Model A — Strict pairwise non-transitivity

Every accepted remote trust domain/CA must be directly bound to each consumer. No multi-hop relationship is semantically meaningful.

Strongest evidence for: simple mental model; low blast radius; matches ordinary SPIFFE peer federation; limits confused-deputy effects.

Strongest evidence against: cannot faithfully represent cross-certified or bridge PKI; forces provider-specific flattening of legitimate path policy; loses provenance of intermediary trust relationships.

Disposition: **REJECT as universal architecture**. Keep as a valid simple/direct profile.

### Model B — Generic transitive trust graph

If a directed path exists from an accepted node to a target, trust follows the path.

Strongest evidence for: superficially matches bridge reachability; easy graph query; scales federation automatically.

Strongest evidence against: RFC 5280 requires policies, mappings, constraints, usages, anchors and time/currentness; RFC 4158 demonstrates path explosion and unintended routes; SPIFFE requires explicit domain/bundle binding; the model conflates certification, distribution, identity acceptance and authorization.

Disposition: **DO_NOT_BUILD**.

### Model C — Relation-specific, policy-constrained path composition

Conceptual shape, not frozen IR:

```text
Consumer requirement Q
+ explicitly admitted root/relationship revision
+ path edges E1..En
+ composition rule for each edge kind
+ accumulated policy/name/purpose/usage constraints
+ provider/path capability
+ revocation/currentness evidence
+ consumer-effective generation
        ↓
QUALIFIED_PATH | DENIED | INCONCLUSIVE
```

Strongest evidence for: directly models PKIX bridge/cross-certification; preserves SPIFFE explicit peer bindings while allowing bundle-authenticity ancestry; reuses existing qualified-evidence machinery; keeps provider mechanics replaceable.

Cost/risk: requires typed relations and composition rules; path search can be expensive; providers support different constraints; the simple system must not inherit bridge-PKI ceremony.

Disposition: **KEEP + HARDEN + GENERALIZE narrowly inside Enterprise Trust**.

## Candidate semantic refinement

The strongest case is not a new capability or UCA-wide primitive. It is a refinement of the existing Enterprise Trust relationship/path model:

```text
TrustRelationship
  relation kind
  direction
  subject / issuer / trust-domain scope
  purpose / usage scope
  governing policy revision
  composition semantics
  mapping / accumulated constraints
  provider support evidence
  authority / provenance
  lifecycle / currentness
```

`composition semantics` is intentionally research-level wording. Synthesis may determine that it is derived from relation kind plus a trust-policy profile rather than persisted as a dedicated field.

## Invariants

### I1 — No untyped transitivity

`A accepts B` and `B accepts C` cannot produce A→C acceptance unless the relevant relation kind supports composition and the relying policy authorizes it.

### I2 — Reachability is not qualification

```text
path exists != path qualifies
```

A cryptographically discoverable route is candidate evidence only.

### I3 — Constraints cannot disappear silently

A composed path accumulates/narrows constraints or applies an explicitly authorized mapping. Intermediate edges cannot silently erase purpose, name, assurance, usage, authority or freshness restrictions.

### I4 — Qualification is consumer-relative

The same target certificate/identity may qualify for one consumer and fail for another because anchors, policy mappings, purposes or provider capabilities differ.

### I5 — Trust path is not authorization

A fully valid path authenticating a remote identity is still input to a separate capability-owned authorization decision.

### I6 — Bundle provenance is not peer acceptance

Authenticating who served a foreign bundle does not by itself authorize workloads from the serving domain.

### I7 — Provider path construction is mechanics

A provider finding a native path cannot widen the portable admitted trust scope.

### I8 — Lower layers cannot create a bridge

`Enterprise → Station → Role → Person` remains non-amplifying. A lower layer can narrow delegated trust scope but cannot add an intermediary, policy mapping, alias or composition rule that creates new effective trust.

### I9 — Path composition is revisioned

Changes to relationships, cross-certificates, mappings, roots, provider binding, revocation/currentness or consumer generation can invalidate a prior path qualification without changing target certificate bytes.

### I10 — Historical path validity is separate from current acceptance

Retired cross-certificates/root material may remain historical verification evidence while being forbidden for new current authority.

## Failure and adversarial analysis

1. **Transitive laundering:** A trusts B only as a bundle distributor; B accepts C identities. A generic union causes A to accept C. Expected: `DENY`.
2. **Policy-mapping widening:** signatures are valid, but a bridge maps high-assurance local policy into weaker remote policy not authorized by the consumer. Expected: `DENY`.
3. **Constraint erasure:** provider constructs a path but cannot enforce an SB-required name/purpose constraint. Expected: provider `PARTIAL/INCOMPATIBLE`; no portable PASS.
4. **Path explosion:** cross-certificates create many graph-reachable paths. Expected: bounded/qualified search; timeout/exhaustion becomes `INCONCLUSIVE`, never PASS.
5. **SPIFFE bundle pooling:** bundles from several domains are merged without preserving `<TrustDomain, Bundle>`. Expected: `DENY` even if a signature happens to verify.
6. **Non-self-serving endpoint compromise:** intermediary A serves B's bundle and is compromised. Expected: evidence exposes distribution ancestry; downstream B qualification becomes compromised/inconclusive according to policy.
7. **Provider substitution:** old provider selects/enforces path P1; replacement provider only supports P2 or lacks a required constraint. Expected: fresh provider qualification, not label equivalence.
8. **Parallel bridge migration:** old/new FBCA-style paths coexist. Expected: each path generation is separately qualified; old retirement awaits required consumer convergence/drainage.
9. **Offline Station:** Station retains old path/bundle data past currentness horizon. Expected: privileged remote trust degrades/denies/becomes inconclusive; no new federation inferred offline.
10. **Alias laundering:** a migration alias for one authorization scope is interpreted as trust in all issuers/federations of the aliased domain. Expected: `DENY`.

## Provider-specific mechanics vs portable semantics

Portable G2 semantics should retain trust relationship identity/revision, relation kind/direction, trust-domain/issuer/subject scope, purpose/usage/policy applicability, governed composition semantics where applicable, admitted roots, constraint-qualified path result, revocation/currentness, consumer-effective generation, provider support vector, historical lineage, drainage, authority and provenance.

Providerized mechanics include RFC 5280 path-building algorithm choice, AIA/SIA discovery, bridge-CA/cross-certificate topology, native OID mapping, SPIFFE bundle endpoints, SPIRE federation configuration, Envoy/SDS bundle distribution, service-mesh aliases, CA-native alternate-chain selection, trust-store caching and path preference.

The provider may expose richer mechanics, but provider reachability/path success is never canonical G2 trust truth.

## Consequences for existing findings/candidates/hypotheses

### Enterprise Trust capability

**KEEP** the promoted owner. No new top-level capability is justified.

**HARDEN** `TrustRelationship` / `EnterpriseTrustQualification` so synthesis cannot interpret every relationship as either uniformly direct or uniformly transitive.

### `G2-FINDING-ETQP-01`

Refine `issuer/path` meaning: path qualification is consumer-policy-qualified composition over typed trust edges and accumulated constraints, not only certificate-list validation.

### `G2-FINDING-ETQP-06`

Provider portability should include path-composition, policy-mapping, cross-certification and constraint-support behavior. Two implementations saying “X.509 supported” may not be semantically substitutable.

### `G2-FINDING-ETQP-08`

Non-amplification extends to federation composition. Lower layers cannot introduce a bridge/intermediary/alias/composition rule that widens Enterprise trust.

### `DR-ABRT-01`

Preserve “no transitive magic”, but make the boundary explicit: **authorized constrained path composition is legitimate** when its edges/constraints terminate in independently admitted roots. Mere graph reachability or cycles remain invalid trust proof.

### Historical verification

`DR-RRHV-01` remains unchanged: a retired composed path can remain historical verification material without remaining current authority.

### UCA

**DO_NOT_GENERALIZE** a generic `TrustGraph`, `TransitiveRelation` or UCA-wide transitivity algebra. UCA may host provenance/applicability envelopes; Enterprise Trust owns the path semantics.

### Saturation interaction

This Deep Research does **not** count as a post-promotion breadth revisit, does not edit the no-material streak and does not declare or revoke saturation itself.

A concurrent breadth revisit 02 declared Enterprise Trust saturated after testing AWS/Google/Kubernetes rotation/revocation representatives. This artifact exposes an orthogonal bridge/federation composition question that revisit did not test. The breadth/state authority must decide whether this hardening is already normatively entailed by existing `TrustRelationship + issuer/path + policy` semantics or constitutes a material finding that requires reopening/reset under the normal saturation rule.

## Proof obligations / falsification paths

### DR-TFTPC-01 — No generic transitive closure
Given A→B and B→C relationships of incompatible kinds, prove no A→C effective trust is inferred.

### DR-TFTPC-02 — Valid bridge composition
Construct a multi-hop PKIX path with authorized policy mappings/constraints from a declared anchor to a remote target; prove QUALIFIED when every obligation closes.

### DR-TFTPC-03 — Policy-map mismatch
Keep signatures valid but change one mapping so the relying policy no longer propagates. Expected: DENIED.

### DR-TFTPC-04 — Name/purpose constraint preservation
Introduce an intermediate exclusion for the target namespace/purpose. Provider path discovery may succeed; G2 qualification must deny.

### DR-TFTPC-05 — Reachability versus admitted path
Provide a longer graph-reachable alternate path outside admitted relationship/path policy. Expected: DENIED.

### DR-TFTPC-06 — Path-explosion boundedness
Use a dense cross-certified graph. Prove bounded provider/search behavior and that exhaustion/timeout yields INCONCLUSIVE rather than PASS.

### DR-TFTPC-07 — SPIFFE explicit peer federation
A accepts B. B accepts C. C identity presented to A remains untrusted unless A has an authorized acceptance relationship that permits it.

### DR-TFTPC-08 — SPIFFE chained bundle authenticity
Authenticate B's bundle endpoint through intermediary A. Evidence must retain ancestry while not implying acceptance of A identities.

### DR-TFTPC-09 — Trust-domain/bundle binding attack
Swap/pool bundles across domain names. Expected: DENIED despite possible cryptographic verification.

### DR-TFTPC-10 — Endpoint-profile downgrade
Change an authorized SPIFFE endpoint profile to a weaker profile without approval. Expected: DENIED/INCONCLUSIVE according to policy.

### DR-TFTPC-11 — Provider substitution
Evaluate one portable trust requirement on two path providers. If one cannot enforce required mappings/constraints, it is PARTIAL/INCOMPATIBLE rather than silently weaker.

### DR-TFTPC-12 — Cross-sign migration overlap
Old/new bridge paths coexist. Prove separate revision qualification and old-path retirement only after required consumer-effective convergence.

### DR-TFTPC-13 — Revoked bridge edge
Revoke one cross-certificate while target bytes remain unchanged. Current paths depending on that edge become DENIED/INCONCLUSIVE.

### DR-TFTPC-14 — Historical replay after retirement
Retire an old bridge edge for current authority while retaining evidence for a signature from its valid interval. Historical verification may succeed; new actuation must fail.

### DR-TFTPC-15 — Station non-amplification
Station has delegated trust in A/B but no bridge-creation authority. It adds B→C and tries to accept C. Expected: DENIED/escalated.

### DR-TFTPC-16 — Offline horizon
Disconnected Station may use already-authorized paths only inside declared local closure/currentness horizon; beyond it privileged remote trust becomes DENIED/DEGRADED/INCONCLUSIVE.

### DR-TFTPC-17 — Alias is not trust-edge creation
Introduce an old/new trust-domain alias for one migration policy. Prove it does not import roots, issuers or federations from the aliased domain.

### DR-TFTPC-18 — Authorization remains separate
Remote identity has a qualified composed trust path but lacks action/resource authorization. Authentication succeeds; mutation is denied.

### DR-TFTPC-19 — Consumer-relative divergence
Two consumers share target bytes/provider but use different anchors/policies. Prove one may QUALIFY and the other DENY without contradiction.

### DR-TFTPC-20 — Simple-system ergonomics
Single root + issuer + consumer with no federation must not require bridge/path-composition ceremony beyond a direct/simple profile.

### DR-TFTPC-21 — Provider-success contradiction
Provider reports path valid but an SB-required constraint is unsupported/stale. G2 result must be DENIED/INCONCLUSIVE, not normalized provider success.

### DR-TFTPC-22 — Cycle is not trust proof
Create A→B→C→A relationships without independently admitted applicable root/closure. The cycle alone must never establish trust.

## Confidence

**High** confidence that generic transitive trust is unsafe; strict universal non-transitivity is also inaccurate; path composition must be consumer/purpose/policy/constraint/root/currentness qualified; SPIFFE peer federation and bundle-authenticity ancestry are distinct relation semantics; provider substitution must preserve constraint/composition behavior; and no new top-level capability is justified.

**Medium** confidence on whether G2 needs a persisted `composition semantics` field versus deriving it from relation kind plus trust-policy revision. That belongs to synthesis or an explicitly reopened breadth question.

## Explicit research dispositions

- **KEEP** — Enterprise Trust / PKI / Certificate Lifecycle as semantic owner.
- **HARDEN** — `TrustRelationship` and `EnterpriseTrustQualification` with relation-kind/direction/path-composition semantics where required.
- **MERGE** — result/provenance/applicability with existing qualified-derived-claim/evidence machinery.
- **GENERALIZE narrowly** — policy-constrained trust-path composition inside Enterprise Trust, not UCA-wide generic transitivity.
- **SPECIALIZE** — PKIX bridge/cross-cert mapping, SPIFFE peer federation, SPIFFE bundle-authenticity chaining, identity aliases and authorization relationships as distinct relation families.
- **PROVIDERIZE** — path building, AIA/SIA discovery, bridge mechanics, OID mapping, bundle endpoints, SDS, native trust stores/path preference.
- **DEFER** — exact IR/schema for composition mode, max-path constraints and path-selection policy until synthesis compares simple and enterprise profiles.
- **DO_NOT_BUILD** — generic `trusted=true`; automatic `A→B + B→C => A→C`; pooled anonymous bundles; provider path success as canonical trust; UCA `TrustGraph`; Station/AI-created bridge authority.

## Unresolved questions

1. Should portable trust policy state a maximum path depth, or is that operational/provider policy rather than semantic truth?
2. Which path constraints belong in canonical trust semantics versus provider support/conformance profiles?
3. For SPIFFE non-self-serving bundle endpoints, should distribution ancestry be first-class evidence or provenance attached to the bundle revision?
4. When a provider cannot expose the exact selected path, what minimum evidence can prove portable conformance?
5. Can one small portable vocabulary cover PKIX policy mapping and non-PKIX federation without becoming a mega-model?
6. Which federation/path changes invalidate only future current trust versus making some historical claims unverifiable?

## Recommendation for the next deep question

**Trust-Path Selection Determinism & Provider Divergence.** When several simultaneously valid chains, anchors or cross-signatures exist, determine whether different TLS/PKIX/provider implementations can choose paths that differ materially in policy, revocation state, algorithm constraints or historical/current applicability, and what portable evidence prevents provider substitution from silently changing effective trust.

Pursue it only if the live state/breadth authority does not already close the issue; do not reopen Enterprise Trust broadly by habit.
