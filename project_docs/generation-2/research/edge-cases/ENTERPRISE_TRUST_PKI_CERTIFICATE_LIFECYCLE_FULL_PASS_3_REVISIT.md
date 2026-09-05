# Generation 2 — Enterprise Trust / PKI / Certificate Lifecycle — Full Pass 3 Revisit

Status: `MATERIAL FINDING`
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 3
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Authority and scope

This research-only revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, the Full-Pass-1 Enterprise Trust/PKI register and the Full-Pass-2 revisit. It preserves `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, cryptographic validity != canonical identity != business authorization, issued != distributed != consumer-effective != currently trusted, provider acknowledgement != trust convergence, `UNKNOWN -> reconcile-before-retry`, and AI/low-code non-amplification.

No remediation, product code, Work Package, TASK, Construction or Planning C work is authorized or performed. All 12 mandatory clusters were already explicitly covered in Full Pass 3 before this local revisit; the material finding below resets the affected Trust/PKI cross-capability cluster streak but does not create a new cluster pass.

## Techniques rotated from Full Passes 1 and 2

1. **trust-domain namespace partition mutation** — keep each trust bundle and credential individually valid while unioning, splitting or relabeling independently governed trust namespaces;
2. **anchor-set substitution differential** — preserve certificate/path bytes and time while changing only the qualified trust-domain-to-anchor-set binding;
3. **name-constraint escape analysis** — compare otherwise valid paths when a trust source constrains only one name form or when a merged anchor set changes the effective namespace boundary;
4. **presence-semantics trust mutation** — vary `ABSENT`, empty, explicit default and inherited trust-domain/bundle bindings without treating missing configuration as equivalent to an explicit trust relationship;
5. **federation bootstrap/current-bundle braid** — distinguish initial trust establishment from subsequent current bundle use and from canonical identity/authorization;
6. **revocation/currentness and cohort permutations** — re-run old/new anchor, issuer, credential and status evidence combinations against the new namespace-partition hypothesis;
7. **provider substitution and alias collision** — preserve provider-local validity while changing provider/trust-domain labels or mapping multiple domains into one validator store;
8. **resource/cardinality pressure** — test whether bundle/path pruning or validator simplification silently widens trust scope;
9. **AI/low-code trust-composition delta** — compare declared trust relationships with generated/imported bundle unions, aliases and inferred federation;
10. **duplicate-screen** against all 116 pre-existing reusable ConflictPatterns, including `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`.

## External evidence checked

### RFC 5280 — path validity is scoped to supplied trust inputs and naming constraints

RFC 5280 defines path validation relative to a trust anchor and a time in question, while name constraints restrict only the name forms they actually cover. It also warns that constraining one name form does not protect against another. The key portable implication is that local path validity does not itself prove that the validator used the correct enterprise trust namespace or that two independently valid trust-anchor sets may be safely unioned.

Source: RFC 5280, RFC Editor, accessed 2026-09-05.

### SPIFFE Federation — trust bundles from distinct trust domains must remain distinct

The SPIFFE Federation specification states that bundles from different trust domains **MUST NOT** be merged into one larger bundle because doing so would allow one trust domain to forge identities belonging to another in the eyes of a validator using the unified bundle. It also requires the latest available bundle for subsequent connections to a self-serving bundle endpoint and requires clients to know which trust domain an endpoint represents before retrieving its bundle.

This is materially stronger than the already catalogued `cryptographic validity != business authorization` distinction: the unsafe composition can occur inside trust validation itself before Identity or Authorization evaluates the resulting subject.

Source: SPIFFE Federation specification, accessed 2026-09-05.

### RFC 8555 — control authority over certificate lifecycle is not equivalent to certificate identity

ACME separately scopes account-key authority, certificate-key possession and revocation authority. This continues to support existing key-authority/currentness patterns and helps prevent the new namespace finding from being misclassified as a generic proof-of-possession issue.

Source: RFC 8555, RFC Editor, accessed 2026-09-05.

## Duplicate-screen result

Most challenged mechanisms remain covered by the existing catalogue:

| Challenged composition | Existing coverage | Disposition |
| --- | --- | --- |
| stale/wrong trust-anchor generation | `G2-CONFLICT-PATTERN-TRUST-CURRENTNESS-001` + revision/currentness families | DUPLICATE |
| stale/inapplicable OCSP/CRL/staple/cache evidence | `G2-EDGE-TRUST-002` + evidence-currentness families | DUPLICATE |
| old/new issuer, certificate and trust-store cohorts | `G2-CONFLICT-PATTERN-TRUST-COHORT-001` + residual-cohort families | DUPLICATE |
| certificate validity promoted to canonical identity/business permission | `G2-CONFLICT-PATTERN-CRYPTO-AUTHORITY-001` | DUPLICATE |
| compromise/emergency rotation versus continuity | `G2-CONFLICT-PATTERN-TRUST-EMERGENCY-001` | DUPLICATE |
| issuance/revocation `PARTIAL/UNKNOWN` and unsafe retry | `G2-EDGE-TRUST-006` + ambiguous-effect/idempotency families | DUPLICATE |
| `ABSENT/null/default/delete` trust configuration semantics | `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` | DUPLICATE |
| time/resource/AI-generated trust confidence | `G2-EDGE-TRUST-007` + resource/coverage/non-amplification families | DUPLICATE |
| **independently valid trust-domain bundles/anchor sets merged so one namespace can validate identities belonging to another** | not adequately represented by currentness, coexistence, crypto→authorization or generic presence semantics; existing patterns assume the validator's trust-domain scope itself is already correctly partitioned | **NEW MATERIAL CLASS** |

The surviving material class is therefore catalogued below. It is not a `ConflictInstance` and does not assert a current product defect.

## New material local edge scenario

### G2-EDGE-TRUST-008 — trust-domain namespace collapse makes individually valid trust sets jointly unsafe

- **Scenario:** two or more trust bundles/anchor sets are each internally valid for their own declared trust domain, provider, federation peer or organizational scope. A validator, adapter, imported configuration, provider migration, low-code composition or operator convenience union merges them into one effective trust set or loses the domain→bundle binding. A credential from domain B can then satisfy validation for an identity namespace or relying context intended for domain A.
- **Activation conditions:** multiple independently governed trust domains or provider trust stores coexist; bundle/anchor union, aliasing, fallback, migration, federation bootstrap, import, deduplication or generated configuration removes or weakens the domain-scoped binding; the relying path accepts the resulting unified store without proving namespace equivalence.
- **Incompatible claims/actions/states:** each source trust bundle claims “these anchors are valid for domain X”; the composed validator claims “any anchor in the merged set may validate subjects for this relying namespace”. Both local source bundles can remain correct while the composed validator creates authority not granted by either source owner.
- **Why local validation may miss it:** per-bundle signature/path validation, freshness checks and provider health can all pass. The failure is relational: the trust-domain partition and namespace ownership are lost during composition.
- **Expected safe behavior:** preserve explicit trust-domain/namespace→bundle/anchor-set qualification through federation, provider substitution and generated configuration; a union or cross-domain mapping remains `INCONCLUSIVE`/unqualified unless an authorized semantic owner explicitly establishes the broader trust relation and the consuming Identity/Authorization layers independently qualify their claims.
- **Forbidden behavior:** infer namespace equivalence, federation authority or cross-domain identity acceptance from the mere fact that all anchors/bundles are individually valid, compatible in representation, available through one provider, or accepted by one cryptographic library.
- **Failure/effect disposition:** `DENIED | INCONCLUSIVE | PARTIAL` according to current qualified trust-domain policy; never promote a widened anchor union to current enterprise trust by default.
- **Detection stage/candidate:** static trust-domain partition/anchor ownership graph; pre-use domain→bundle→relying-namespace qualification; provider/import semantic diff; runtime signal for credential issuer/domain accepted through a non-owning anchor partition; audit comparison of accepted subject domain against the qualified trust path and declared federation relation.
- **Owner(s):** Enterprise Trust/PKI is semantic owner of trust-domain/bundle qualification; Identity owns canonical subject resolution; Authorization/Organization owns business authority; Provider/Binding owns realization mapping/substitution evidence; Standards/Interoperability owns federation/profile conformance where applicable.
- **Severity:** `CRITICAL`.
- **Confidence:** `strongly supported` by SPIFFE's explicit cross-domain bundle prohibition plus RFC 5280 trust-anchor/name-scope semantics.
- **Detectability:** static + pre-execution + runtime + audit.
- **Blast radius:** relying workload/Station → system → enterprise/federated parties depending on accepted namespace.
- **Reversibility:** potentially irreversible after unauthorized external or durable business effects; trust configuration itself is reversible but downstream effects may not be.
- **Time-to-harm:** immediate once a foreign credential is accepted; latent while the widened trust set remains unused.
- **Misuse likelihood:** plausible accidentally through import/provider consolidation; adversarial if an attacker can cause or exploit trust-set widening.
- **Evidence currentness:** exact trust-domain identity, bundle/anchor revisions, federation/provider binding revision, relying namespace, time/currentness and consumer-effective configuration are required.
- **False-positive risk:** some systems deliberately use a shared trust store or cross-signing/federation relationship. That is legitimate only when the broader namespace/trust relation is explicitly owned and qualified; shared representation alone is not evidence of equivalent authority.
- **Future remediation disposition:** `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; when signalled, require owner-qualified trust-relation evidence or isolate/reconcile the widened partition. No mechanism is selected here.
- **Proof/test candidate:** construct two individually valid domains with colliding or reusable subject forms and prove that merging anchor material cannot make domain-B credentials satisfy domain-A trust claims without explicit governed cross-domain relation.
- **Saturation status:** `MATERIAL / LOCAL STREAK RESET`.

## New reusable ConflictPattern

### G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001 — valid trust partitions compose into an unauthorized larger namespace

- **Family:** structural graph + semantic ownership + authority + provider/integration + version/migration/coexistence + AI/low-code composition.
- **Narrative example:** two federation peers each publish a correct trust bundle. A consolidation layer imports both into one validator pool and later validates an identifier from peer B in a relying context that semantically belongs to peer A. No certificate needs to be malformed and neither peer needs to violate its own policy.
- **Involved capabilities/processes:** Enterprise Trust/PKI, Identity/Federation, Provider/Binding, Standards/Interoperability, Authorization/Organization; optionally Artifact/Release when signing trust domains are similarly collapsed.
- **Preconditions / activation conditions:** at least two independently owned trust namespaces; valid anchor/bundle material; composition step loses or broadens namespace binding; no explicit higher-order owner evidence authorizes equivalence.
- **Incompatible claims/actions/states:** source owner A limits anchor set A to namespace A; source owner B limits anchor set B to namespace B; composed validator treats A∪B as authority for the same relying namespace.
- **Why local validation may miss it:** every source bundle, path, provider response and parser may be correct in isolation; the contradiction appears only in the union of ownership scopes.
- **Detection candidates / required evidence:** trust-namespace ownership graph; anchor/bundle partition constraints; relying-namespace→qualified-bundle relation; provider/import mapping lineage; exact federation/profile revision; accepted-path audit with source-domain provenance.
- **Owner set:** Enterprise Trust/PKI primary; Identity/Federation and Authorization/Organization for downstream claims; Provider/Binding and Standards for realization/profile mappings.
- **Severity:** `CRITICAL`.
- **Confidence:** `strongly supported`.
- **Detectability:** static/pre-execution preferred, runtime/audit as secondary evidence.
- **Blast radius:** system→enterprise/federated parties.
- **Reversibility:** configuration is reversible; effects authorized through widened trust may be potentially irreversible.
- **Time-to-harm:** immediate/latent.
- **Misuse likelihood:** plausible/adversarial.
- **Evidence currentness:** current trust-domain, bundle/anchor, federation/provider-binding and relying-scope revisions required.
- **Static prevention feasibility:** feasible as a bounded invariant on preservation of trust-domain ownership/partition semantics, but must allow explicitly governed shared roots, cross-signing and federation relationships.
- **Known false-positive risks:** legitimate common roots or deliberate cross-domain trust can resemble a collapsed partition if the detector lacks owner-qualified federation/scope evidence.
- **Future remediation disposition:** require additional trust-relation evidence, explicit owner adoption, isolate/repartition or route human reconciliation; no implementation now.
- **Proof/test candidate:** N-wise trust-domain graph mutation where each partition is valid locally but unions are rejected/inconclusive unless an explicit relation authorizes the widened namespace.
- **Saturation status:** `MATERIAL / CATALOGUED`.

## Preventive invariant candidate disposition

A bounded candidate is elevated for later architecture consideration only:

> **Trust-domain partition non-amplification:** combining, importing, negotiating or substituting valid trust material must not widen the namespace or authority for which that material is trusted unless the broader relation is explicitly qualified by the Enterprise Trust semantic owner and remains independently subject to Identity/Authorization qualification.

Rationale against over-constraint: this does **not** forbid shared roots, cross-signing, federation, provider consolidation or explicit enterprise-wide trust. It forbids inferring broader authority merely from set union, representational compatibility or provider co-location. The class is universal enough across PKI/federation/artifact trust, materially damaging, has a clear Trust semantic owner, and can be represented without banning legitimate explicit trust relationships.

This is a `PreventiveInvariantCandidate`, not an implementation decision.

## Cross-capability linkage

No new mandatory cluster is created. `G2-EDGE-TRUST-008` materially affects `Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution`: trust-domain/anchor namespace collapse can allow an otherwise valid identity credential or signed artifact from one partition to be accepted in another during provider/federation substitution. The cluster had a no-material streak of 1 after the earlier Full-Pass-3 Artifact/Release revisit; this material cross-capability deepening resets that affected cluster streak to **0**.

`Provider/Binding × external realizations` is linked as an affected surface but is **not reset** here because the new pattern is specifically about trust-namespace ownership; provider substitution is one activation mechanism, not the semantic owner of the conflict. A future explicit Provider/Binding cluster revisit must challenge the new pattern.

## Conflict-family screen

All required conflict families were explicitly screened: structural graph, state-transition, semantic ownership, rule/formula/condition, temporal/ordering, resource/capacity, authority/responsibility/SoD, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure/instruction, cross-process, objective/optimization and AI/low-code composition.

All non-namespace candidates duplicate-screened into existing families. The new namespace-collapse class has owner, detection route, currentness requirements, false-positive controls and future remediation disposition. A detector signal remains a signal until concrete evidence confirms activation.

## Saturation disposition

- New local material edge scenarios: **1** — `G2-EDGE-TRUST-008`.
- New cross-capability scenario IDs: **0** — linkage is recorded against the existing mandatory cluster rather than inventing a scenario solely to reset a streak.
- New reusable ConflictPatterns: **1** — `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001`.
- New preventive invariant candidates: **1** — trust-domain partition non-amplification, research-only.
- Enterprise Trust / PKI / Certificate Lifecycle local no-material streak: **1 → 0**.
- Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution cluster streak: **1 → 0**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- Material edge scenario inventory after this visit: **282**.
- Reusable ConflictPattern inventory after this visit: **117**.
- Combined material findings after this visit: **399**.
- Full Pass 3 capability coverage after this visit: **20/28**.
- Full Pass 3 mandatory cluster coverage: **12/12**.
- Completed full passes: **2/8 minimum**.
- Negative-space review: `NOT_STARTED`.
- Saturation: `NOT_SATURATED`.
- Planning C: `BLOCKED`.

## Next research target

Continue Full Pass 3 with **Privacy / Data Governance / Retention / Legal Hold / Residency**. Use techniques materially different from Full Passes 1 and 2 and duplicate-screen against all **117** reusable ConflictPatterns, explicitly including `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` and `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001` where trust/identity/residency ownership intersects data handling.

Challenge purpose/use and consent/legal-basis currentness; retention × legal-hold precedence; disposition across replicas/backups/caches/provider residuals; residency/cross-border placement during provider substitution and disaster recovery; subject-linkage ambiguity; provider acknowledgement versus effective erasure; policy revision skew; restore/recovery resurrecting disposed data; offline enforcement horizons; derived/inferred data and AI reuse outside qualified purpose; `ABSENT/null/default/delete` privacy semantics; lineage/cardinality/resource exhaustion; human procedures that conflict with hold/residency; and AI/low-code composition that weakens purpose, hold, deletion or residency constraints. Preserve research-only disposition and do not enter Planning C.