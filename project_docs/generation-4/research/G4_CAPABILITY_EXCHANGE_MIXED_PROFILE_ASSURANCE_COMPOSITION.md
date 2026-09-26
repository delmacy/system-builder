# G4 — Mixed-Profile Assurance Dependency Composition

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How should a root guarantee compose historical/current evidence produced under different assurance profiles and generations when integrity, origin, semantic interpretation, settlement, privacy, currentness and trust properties are independently qualified, without collapsing assurance to one scalar, globally invalidating unrelated evidence, or silently strengthening a weak child claim?

This document extends the existing G4 work on degraded dependency guarantee synthesis, multi-domain evidence composition, distributed guarantee-evidence caching, immutable proof semantics, verifier trust continuity, settlement-witness portability and long-term proof-policy transition. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, mature systems and failure evidence reviewed:

- SLSA v1.2 Tracks and requirements: Build and Source are distinct tracks addressing different threats; progress in one track is intentionally not collapsed into unrelated assurance dimensions. SLSA provenance verification separately checks trusted builder identity, signature, build type and parameters.
- RFC 5280 and RFC 9618 PKIX policy processing: path validity is application/policy qualified; certificate-policy processing forms a policy tree and applications may impose constraints beyond basic path validity. Policy mapping is constrained rather than treated as universal equivalence.
- ETSI EN 319 102-1 signature validation: validation is controlled by explicit constraints; disabled checks must remain visible in the validation report rather than being silently treated as universal success.
- in-toto layouts: evidence is verified against step-specific authorized functionaries, commands, materials/products and thresholds; a valid signature alone is not the entire supply-chain claim. The 2023 audit also documented link-metadata reuse/replay and functionary-verification failure cases, demonstrating that locally valid evidence can be unsafe in the wrong composition context.
- TUF role/metadata model: roles have separate keys, thresholds and delegated scopes; a threshold for one role is not a generic platform-wide quorum.
- NIST assurance-case material: assurance is structured as claims/arguments/evidence rather than a single undifferentiated proof token.
- Existing G4 artifacts, especially `G4_CAPABILITY_EXCHANGE_DEGRADED_DEPENDENCY_GUARANTEE_SYNTHESIS.md`, `G4_CAPABILITY_EXCHANGE_MULTI_DOMAIN_EVIDENCE_COMPOSITION.md`, `G4_CAPABILITY_EXCHANGE_GUARANTEE_EVIDENCE_CACHE_INVALIDATION.md`, `G4_CAPABILITY_EXCHANGE_SETTLEMENT_WITNESS_TRUST_CONTINUITY.md`, and `G4_CAPABILITY_EXCHANGE_LONG_TERM_PROOF_POLICY_TRANSITION.md`.

These sources are architectural evidence only. No SLSA, PKIX/X.509, ETSI AdES, in-toto, TUF, assurance-case notation, solver or proof framework is selected.

## 3. Material findings

### 3.1 Root assurance is predicate-specific composition, not vector-wide minimum

A root operation does not necessarily depend on every assurance dimension of every child. A historical audit query may require semantic resolvability and integrity but not current effect authority. A new irreversible command may require current authority, identity/trust, semantic compatibility and settlement/fencing properties while treating an unrelated privacy dimension as non-material to safety.

`Child assurance vector != root assurance vector by element-wise minimum`.

The root contract must name which child claims and assurance dimensions are material to each root guarantee.

### 3.2 Minimal semantic cut sets extend naturally to assurance dimensions

Prior G4 work established that a minimal semantic cut set is invariant-specific rather than topology-specific. The same rule applies inside evidence profiles.

For a root guarantee `G`, define the minimal sets of qualified child predicates whose failure/degradation can defeat `G`. A child can be weak in a dimension outside those sets without automatically defeating the root.

`Dimension degraded != root guarantee degraded unless dimension is material to that guarantee`.

Conversely, an excellent score in irrelevant dimensions cannot compensate for failure of a required dimension.

### 3.3 Assurance composition is monotone only under declared proof rules

A parent may never claim more than its derivation supports. However, simple monotonic `min()` is insufficient because composition can use `ALL_OF`, `ANY_QUALIFIED_OF`, threshold-qualified, alternative-provider, historical-only or operation-specific rules.

`No child may be silently strengthened` remains universal.

`Parent assurance = min(children)` is not universal.

The safe rule is proof-rule monotonicity: every parent disposition must be justified by an explicit rule whose premises are satisfied by qualified child evidence.

### 3.4 Partial orders are profile-local and dimension-aware

Long-term proof-policy research established that assurance is not one scalar. This round refines comparison: even within one dimension, comparability can be conditional on immutable semantics and threat model.

A Build assurance profile and a Source assurance profile, for example, address different threats in SLSA. Neither is globally `>` the other. Likewise, a historical-origin profile may be incomparable with a current-authority profile.

`Profile A stronger in dimension X != Profile A dominates Profile B globally`.

`Incomparable != incompatible`.

Two profiles can be jointly useful without either dominating the other.

### 3.5 Mixed generations require semantic bridges, not numeric ordering

Evidence created under P1 and P3 can compose only if the root proof can resolve each profile's immutable meaning and any required relation between them. Numeric profile generation alone does not prove compatibility.

`P3 > P1 numerically != P3 semantically subsumes P1`.

A migration/transition receipt may establish a qualified bridge for some dimensions while leaving others degraded or unresolved.

### 3.6 Historical and current evidence can coexist in one proof without sharing one time horizon

A root guarantee may depend on a historical settlement witness plus current authorization plus a current security floor. These claims naturally have different time semantics.

`One root proof != one universal freshness timestamp`.

The root must retain the temporal qualification of each material premise and the operation's rule for combining them.

### 3.7 Currentness is itself claim-scoped, not a universal assurance dimension value

A signature can remain historically valid while revocation evidence becomes stale for a new-effect decision. Settlement can be final while provider health is currently unknown. Therefore a single `current=true/false` flag is insufficient.

`Evidence current for historical interpretation != current for new-effect admission`.

The consuming capability owns the required currentness predicate for its business operation.

### 3.8 A missing or disabled check cannot be laundered into success

ETSI validation explicitly allows policy to disable checks but requires those disabled checks to be reported. G4 should generalize this discipline.

`Check not required by this root guarantee != check passed`.

`Check unavailable != check passed`.

A dimension can be `NOT_REQUIRED`, `NOT_APPLICABLE`, `UNRESOLVED`, `DEGRADED`, `CONTESTED` or `SUPPORTED`; these dispositions must not be flattened to a boolean success.

### 3.9 Threshold/quorum semantics are claim-local

TUF and in-toto illustrate that thresholds are attached to particular roles/steps and authorized signer sets. A `2-of-3` proof for provenance origin cannot satisfy a `2-of-3` settlement-authority requirement merely because both are numerically identical.

`Same threshold cardinality != same assurance contract`.

Threshold evidence carries claim identity, authority set, scope, failure-domain assumptions and profile semantics.

### 3.10 Policy mapping/translation is not equivalence by declaration

PKIX policy mapping is constrained and processed as part of policy validation; it is not a license to equate arbitrary policies. For G4:

`Assurance-profile mapping != semantic equivalence`.

An adapter can declare a qualified mapping only for dimensions and predicates whose semantics are demonstrably preserved. Lossy or partial mappings remain visible.

### 3.11 Derived guarantees need dimension-level dependency lineage

Prior cache/invalidation research requires enough lineage to selectively defeat derived evidence. Mixed-profile assurance makes that lineage finer-grained: a root proof should be invalidated/degraded only when a changed child dimension is material to the root derivation.

`Child profile changed != global root-proof invalidation`.

`Material premise changed != cached root proof remains current`.

A compact dependency commitment can name profile/predicate/dimension/floor dependencies without retaining all source payload.

### 3.12 Assurance cut sets support selective revalidation

When one trust root, verifier generation or settlement provider changes, revalidation can target the root guarantees whose cut sets include the affected premise. This reduces O(N) global churn while preserving correctness.

`Selective revalidation != selective safety`.

Selective work is safe only because the derivation explicitly proves non-dependence of unaffected guarantees.

### 3.13 False strengthening can occur through omission as well as relabeling

A parent can overclaim not only by changing `DEGRADED` to `SUPPORTED`, but also by dropping a material dimension from the output.

`Dimension omitted != dimension satisfied`.

If a root guarantee requires origin + semantic compatibility + settlement, emitting only `integrity=SUPPORTED` cannot be interpreted as overall success.

### 3.14 Assurance composition must preserve negative and contested evidence

A child `CONTESTED`, `UNKNOWN`, `BELOW_RETENTION` or negative witness can be material even when positive children exist. Composition rules must state whether such a disposition defeats, degrades, blocks or is irrelevant to the root.

`Positive evidence elsewhere != cancellation of material contested evidence`.

There is no generic evidence arithmetic where positives outvote unknowns.

### 3.15 Independent tracks/dimensions enable progress without false global certification

SLSA's track split provides a mature precedent for recognizing improvement in one assurance area without claiming unrelated improvement elsewhere.

For G4, a system may improve proof integrity or verifier diversity while settlement evidence remains unchanged. The product should expose that progress without inventing a platform-wide badge that implies every dimension advanced.

`Dimension progress != universal certification progress`.

### 3.16 Root requirements are consumer-owned; evidence producers describe, not decide sufficiency

SLSA artifact verification compares provenance to consumer expectations. ETSI validation constraints can originate from the relying application. This supports the G4 boundary:

`Evidence producer claim != consumer sufficiency decision`.

The Exchange Plane may transport assurance profiles and derivations; the consuming capability decides whether the resulting vector satisfies its operation contract.

### 3.17 A provider-specific assurance label is a projection

Provider labels such as `verified`, `level 3`, `final`, `trusted`, or `compliant` are meaningful only under their source profile and threat model.

`Provider assurance label != Shared Semantic Kernel universal assurance primitive`.

Adapters may normalize only a proven subset of semantics and must preserve the source profile/provenance needed to audit the mapping.

### 3.18 Mixed-profile proof composition needs explicit assumption closure

A derivation can be locally correct while relying on assumptions that no longer hold: independent verifiers may share one trust root; two witnesses may share one compromised operator; a historical profile may assume a revocation archive that is now below retention.

`Premises satisfied syntactically != assumptions still qualified`.

The root proof's closure includes material failure-domain, trust, temporal and semantic assumptions.

### 3.19 Composition must distinguish evidence sufficiency from evidence availability

A root can have a well-defined proof rule but lack one required premise because a runtime is offline or an archive is unavailable.

`Proof rule known != proof currently satisfiable`.

This should yield a qualified unresolved/degraded disposition, not a fallback to a weaker profile unless the root contract explicitly authorizes that fallback.

### 3.20 No central assurance oracle is required

A runtime can compose mixed-profile evidence locally when it possesses immutable proof rules, normative profile semantics, sufficient child evidence, trust/floor state and dependency closure within their horizons.

`Distributed evidence composition != central assurance service`.

Builder or Exchange Plane unavailability therefore need not prevent local verification, while missing material premises remain explicit rather than guessed.

## 4. Candidate research vocabulary

Research vocabulary only; no product schema is authorized.

- `AssuranceClaimRef` — immutable identity of a claim whose assurance is being evaluated.
- `AssuranceDimensionRef` — identity of a qualified assurance dimension under a normative profile.
- `AssuranceDisposition` — `SUPPORTED`, `DEGRADED`, `CONTESTED`, `UNRESOLVED`, `BELOW_RETENTION`, `NOT_REQUIRED`, `NOT_APPLICABLE` or profile-specific equivalent.
- `AssuranceCompositionRuleRef` — immutable semantics for deriving a parent claim from child claims/dispositions.
- `AssuranceDependencyCommitment` — compact lineage of material claim/profile/dimension/floor dependencies.
- `AssuranceCutSet` — minimal set of premises whose loss/degradation can defeat a named root guarantee.
- `AssuranceBridgeRef` — qualified mapping/transition relation between profile generations for declared dimensions only.
- `AssumptionClosureRef` — material trust, independence, temporal, failure-domain and semantic assumptions of a derivation.
- `RootAssuranceRequirement` — consumer-owned predicate describing sufficient assurance for one operation/guarantee.
- `AssuranceCompositionDisposition` — root result preserving material degraded/unknown/contested dimensions rather than one scalar score.

## 5. Candidate proof obligations

1. Root assurance is derived per named guarantee/operation and never by a universal element-wise minimum or scalar score.
2. Every root guarantee names the child claims and assurance dimensions material to its proof.
3. A degraded child dimension affects only root guarantees whose derivations materially depend on that dimension.
4. No parent disposition exceeds what an explicit, qualified composition rule proves from its premises.
5. Incomparable profiles remain representable; absence of dominance does not imply incompatibility or equivalence.
6. Mixed profile generations compose only through immutable semantics and explicit qualified bridges where required.
7. Historical and current premises retain independent time/currentness horizons inside one root proof.
8. `NOT_REQUIRED`, `NOT_APPLICABLE`, `UNRESOLVED`, `DEGRADED`, `CONTESTED` and `SUPPORTED` remain distinguishable.
9. Disabled/unavailable checks are never silently relabeled as passed.
10. Threshold/quorum evidence remains bound to its claim, authority set, scope, profile and failure-domain assumptions.
11. Profile/policy mapping is dimension-scoped and cannot fabricate semantic equivalence.
12. Derived evidence retains enough dimension-level dependency lineage for selective invalidation/revalidation.
13. Selective revalidation is justified by explicit non-dependence, not operational convenience.
14. Omission of a material dimension cannot be interpreted as satisfaction of that dimension.
15. Material negative/contested/unknown evidence survives composition according to explicit rules and cannot be outvoted generically by positive evidence.
16. Improvement in one assurance dimension/track does not imply improvement in unrelated dimensions.
17. Evidence producers describe qualified claims; consuming capabilities own operation-specific sufficiency predicates.
18. Provider-native assurance labels remain qualified projections unless their semantics are explicitly mapped and proven.
19. Composition preserves material assumption closure, including trust, independence, temporal and correlated-failure assumptions.
20. Evidence availability and evidence sufficiency remain separate; missing premises yield explicit unresolved/degraded outcomes.
21. Root proof caching cannot survive supersession of a material child premise merely because other dimensions remain strong.
22. Root proof invalidation does not become global when changed evidence is demonstrably outside the root's material dependency closure.
23. Runtime-local composition remains possible with sufficient pre-positioned semantics/evidence/floor closure; Builder availability is not required.
24. Exchange Plane transports composition evidence and rules without becoming business-semantic or assurance-sufficiency authority.

## 6. Adversarial cases

1. Root guarantee computes `min(securityLevel)` across unrelated dimensions and rejects/accepts incorrectly.
2. A child loses revocation currentness but every historical audit proof is globally invalidated despite not depending on current authority.
3. A root payment command remains `SUPPORTED` after its only settlement premise becomes `UNRESOLVED` because integrity is still strong.
4. P3 is assumed to dominate P1 solely because `3 > 1`.
5. Build L3 is treated as proof of Source-track assurance.
6. Two profiles are called incompatible merely because neither globally dominates the other.
7. Historical settlement evidence and current authorization are forced into one freshness timestamp.
8. A disabled revocation check is serialized as `passed=true`.
9. An unavailable check is silently omitted and omission is interpreted as success.
10. `2-of-3` TUF-style role threshold is reused as evidence for an unrelated `2-of-3` business settlement quorum.
11. Adapter maps provider `verified` to universal `SUPPORTED` without preserving the provider profile/threat model.
12. Policy mapping declares two assurance profiles equivalent although one loses privacy or revocation semantics.
13. Child profile changes but root cache is retained despite material dependency on the changed dimension.
14. Child profile changes in an irrelevant dimension and the platform performs a global cache flush/revalidation storm.
15. Parent output drops `CONTESTED` because another child has stronger cryptography.
16. Three positive witnesses numerically outvote one material `UNKNOWN` effect disposition.
17. Assurance badge advances because verifier diversity improved, silently implying settlement assurance also improved.
18. Evidence producer declares its own proof sufficient for an irreversible consumer operation.
19. Two supposedly independent proofs share one compromised trust root but the root derivation omits that assumption.
20. Archive outage is treated as proof-policy failure and triggers fallback to a weaker profile not authorized by the consumer.
21. Root proof is revalidated against `latest` profile semantics rather than the immutable semantics used in its derivation.
22. Offline runtime guesses a missing child disposition because Builder/central assurance service is unavailable.
23. Exchange gateway chooses the strongest-looking vector and thereby becomes assurance/business authority.
24. Provider migration flattens `NOT_REQUIRED`, `UNRESOLVED`, `BELOW_RETENTION` and `SUPPORTED` into one boolean `valid` field.

## 7. Trade-offs and portability / exit path

- Dimension-level lineage and cut sets increase metadata/model complexity but avoid both global invalidation storms and false strengthening.
- Fine-grained assurance profiles improve correctness and portability while increasing verifier burden; compact immutable profile identities and derivation commitments are preferable to copying provider-specific schemas into the Shared Semantic Kernel.
- Local composition improves runtime autonomy but requires pre-positioned normative semantics, trust/floor state and sufficient evidence closure.
- Provider-native levels/badges remain useful operational projections, but exit portability requires preserving the qualified claims and threat assumptions behind them.
- Selective revalidation reduces cost only when non-dependence is provable; otherwise conservative degradation is safer than guessed reuse.
- Privacy/retention may intentionally remove evidence needed for future composition; the resulting assurance downgrade must remain explicit rather than motivating indefinite payload retention.

## 8. Deduplication against existing G4 research

This round does not reopen generic dependency graphs, evidence caching, multi-domain composition, proof-policy transition, verifier diversity, settlement finality, privacy federation or profile negotiation.

Material delta is specifically the intersection:

`mixed historical assurance profiles × dimension-level dependency composition × minimal semantic cut sets × partial-order comparison × selective degradation/revalidation`.

The prior documents establish the component boundaries; this document specifies how they compose without a scalar assurance oracle.

## 9. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

The next highest-value gap is **assurance-composition proof minimization and privacy-preserving disclosure**: determine how a runtime can prove that a root assurance predicate is satisfied while disclosing only the material cut-set evidence needed by the consumer, without exposing the entire dependency graph, provider identities, historical trust topology or unrelated assurance dimensions; research how redaction/selective disclosure interacts with auditability, contested/negative evidence, offline verification and later revalidation.

## 10. Sources

- RFC 5280 — Internet X.509 PKI Certificate and CRL Profile: https://www.rfc-editor.org/rfc/rfc5280
- RFC 9618 — Updates to X.509 Policy Validation: https://www.rfc-editor.org/rfc/rfc9618
- ETSI EN 319 102-1 V1.3.1 — Procedures for Creation and Validation of AdES Digital Signatures: https://www.etsi.org/deliver/etsi_en/319100_319199/31910201/01.03.01_60/en_31910201v010301p.pdf
- SLSA v1.2 Tracks: https://slsa.dev/spec/v1.2/tracks
- SLSA v1.2 Requirements: https://slsa.dev/spec/v1.2/requirements
- SLSA v1.1 artifact verification guidance: https://slsa.dev/spec/v1.1/verifying-artifacts
- in-toto Getting Started / verification model: https://in-toto.io/docs/getting-started/
- in-toto 2023 Security Audit: https://in-toto.io/blog/2023/security-audit/
- TUF Roles and Metadata: https://theupdateframework.io/docs/metadata/
- NIST Assurance Case Tools: https://www.nist.gov/itl/csd/secure-systems-and-applications/assurance-case-tools

No source above is adopted as an implementation dependency by this research.