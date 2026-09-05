# Generation 2 — Enterprise Trust / PKI / Certificate Lifecycle — Full Pass 4 Revisit

Status: `ELIGIBLE NO-NEW-MATERIAL REVISIT`
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 4
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Authority and scope

This research-only revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, the Full-Pass-1 Enterprise Trust/PKI register and the Full-Pass-2/3 revisits. It preserves `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, cryptographic validity != canonical identity != business authorization, issued != distributed != consumer-effective != currently trusted, provider acknowledgement != trust convergence, `UNKNOWN -> reconcile-before-retry`, and AI/low-code trust non-amplification.

No remediation, product code, Work Package, TASK, Construction, Planning C or bounded architecture backfill is authorized or performed.

## Techniques materially different from Full Passes 1–3

1. **qualified trust-cut subtraction** — hold certificate/path bytes constant while selectively removing current anchor, revocation, relying-namespace or consumer-adoption evidence;
2. **revocation-freshness braid** — permute `thisUpdate`, `nextUpdate`, local clock, offline cache horizon and profile-specific no-revocation semantics without assuming unavailable means good or revoked;
3. **rotation partial-order mutation** — reorder publish-new-anchor, issue-new-credential, distribute-new-bundle, retire-old-key and revoke-old-material steps to expose locally valid but globally unsafe sequences;
4. **trust-domain/provider transposition** — keep cryptographic material valid while changing provider, bundle endpoint, alias or relying namespace and verify that domain→bundle ownership is not inferred from transport location or representation;
5. **authority/crypto claim separation** — challenge certificate/SVID/signature validity against stale or absent canonical Identity, Organization and Authorization claims;
6. **residual-cohort evidence subtraction** — model disconnected workloads, stale trust stores and delayed revocation/status adoption after central rotation acknowledgement;
7. **presence-semantics mutation** — vary `ABSENT`, empty, explicit default and inherited trust configuration without equating omission to an explicit trust relation;
8. **resource/cardinality pressure** — large chain, bundle, responder and status sets where pruning, fallback or cache pressure could silently weaken coverage;
9. **human-procedure conflict analysis** — emergency continuity instructions versus compromise containment, rotation and revocation procedures;
10. **AI/low-code trust delta analysis** — generated federation, provider substitution or trust-store union that is syntactically valid but widens authority or loses namespace ownership;
11. **targeted N-wise cluster review** — Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution, including independently valid signed artifacts/identities whose trust-domain partitions must remain qualified;
12. **duplicate-screen** against all 119 reusable ConflictPatterns, especially `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001`.

## External evidence checked

### SPIFFE Federation — trust-domain-to-bundle binding remains a first-class security property

Current SPIFFE Federation documentation requires bundles from different trust domains to remain distinct, requires the trust-domain/bundle association to be preserved, warns that pooling bundles allows one trust domain to impersonate identities from another, and states that endpoint URL/profile/trust-domain parameters cannot be safely inferred from each other. It also requires clients to track current bundle material over time. This strongly reinforces `G2-EDGE-TRUST-008` and `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001`; it does not establish a new conflict family.

Source: SPIFFE Federation specification, accessed 2026-09-05.

### SPIFFE Trust Domain and Bundle — key reuse and rotation do not erase namespace ownership

SPIFFE defines a trust domain as an identity namespace backed by authoritative keys, requires validators to choose the bundle for the SVID's trust domain, and notes that bundle contents change as keys rotate. It warns that key reuse across trust domains degrades isolation. This remains covered by trust currentness, trust cohorts and namespace-collapse patterns.

Source: SPIFFE Trust Domain and Bundle, accessed 2026-09-05.

### RFC 6960 — OCSP evidence has explicit temporal semantics

RFC 6960 defines `thisUpdate`, `nextUpdate` and `producedAt`; responses past `nextUpdate` or with `thisUpdate` in the future relative to local time should be treated as unreliable. It also requires status-signing authority to be qualified. This reinforces existing revocation/currentness and authority-evidence classes rather than creating a new one.

Source: RFC 6960, RFC Editor, accessed 2026-09-05.

### RFC 9608 — absence of revocation data is profile semantics, not universal failure

RFC 9608 defines `noRevAvail` for profiles where revocation information is intentionally unavailable and updates path-validation behavior accordingly. Therefore missing revocation evidence cannot be assigned one universal meaning detached from certificate/profile semantics. This remains covered by `G2-EDGE-TRUST-002` plus presence/currentness qualification.

Source: RFC 9608, RFC Editor, accessed 2026-09-05.

## Duplicate-screen result against 119 reusable ConflictPatterns

No genuinely new material local edge scenario, cross-capability scenario, reusable ConflictPattern or preventive invariant survived duplicate-screening.

| Challenged composition | Existing coverage | Disposition |
| --- | --- | --- |
| path valid under stale/retired anchor or bundle generation | `G2-CONFLICT-PATTERN-TRUST-CURRENTNESS-001` + revision/currentness families | DUPLICATE |
| OCSP/CRL/status cache stale, unavailable, future-dated or profile-inapplicable | `G2-EDGE-TRUST-002` + evidence-currentness/presence semantics | DUPLICATE |
| old/new certificate, issuer and trust-store cohorts overlap | `G2-CONFLICT-PATTERN-TRUST-COHORT-001` + residual-cohort/convergence families | DUPLICATE |
| compromise containment versus continuity/offline procedure | `G2-CONFLICT-PATTERN-TRUST-EMERGENCY-001` | DUPLICATE |
| cryptographic validity promoted to canonical identity/business permission | `G2-CONFLICT-PATTERN-CRYPTO-AUTHORITY-001` | DUPLICATE |
| issuance/renewal/revocation `PARTIAL/UNKNOWN` retried unsafely | `G2-EDGE-TRUST-006` + ambiguous-effect/idempotency families | DUPLICATE |
| `ABSENT/null/default` trust configuration changes effective relation | `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` | DUPLICATE |
| provider/federation import loses trust-domain→bundle binding | `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001` | DUPLICATE |
| key reuse/shared trust material weakens namespace isolation | `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001` + trust-domain ownership semantics | DUPLICATE |
| artifact signature valid under a foreign/merged trust partition | `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001` + artifact attestation/qualification patterns | DUPLICATE |
| huge trust/status graphs force pruning/fallback/sampled verification | `G2-EDGE-TRUST-007` + resource/coverage boundedness families | DUPLICATE |
| AI/low-code widens trust, infers federation or treats crypto evidence as authority | trust namespace non-amplification + crypto-authority + AI/low-code composition families | DUPLICATE |

## Processual / semantic conflict classification screen

All required families were deliberately screened: structural graph; state-transition; semantic ownership; rule/formula/condition; temporal/ordering; resource/capacity; authority/responsibility/SoD; policy/compliance; data/consistency; provider/integration; version/migration/coexistence; exception/compensation/recovery; human-procedure/instruction; cross-process; objective/optimization; AI/low-code composition.

The strongest composed conflict remains the Full-Pass-3 namespace-collapse class: each trust bundle, signed artifact, credential, provider response and local validator can be valid in isolation while the composition loses the qualified trust-domain boundary and manufactures a broader authority set. This is already catalogued with activation conditions, incompatible claims, owners, severity, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive controls and future remediation disposition.

No `ConflictInstance` is asserted. No detector signal is treated as a confirmed conflict.

## Explicit cluster revisit — Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution

This revisit explicitly challenged the mandatory cluster rather than merely touching it incidentally.

N-wise composition tested:

- a credential remains cryptographically valid while its canonical Identity mapping is stale or absent;
- an artifact signature remains valid while the signing trust domain/provider binding changes;
- a provider substitution preserves bytes/digest but changes the trust-domain/anchor ownership context;
- old and new trust/provider cohorts coexist while different Identity or Artifact consumers observe different generations;
- a merged trust store validates both domains but lacks explicit owner-qualified federation/equivalence;
- revocation or bundle currentness is `PARTIAL/UNKNOWN` while artifact or identity acceptance is attempted;
- AI/low-code selects or combines trust/provider sources based on feature compatibility rather than semantic authority.

All surviving risk maps to existing patterns: trust namespace collapse, trust currentness/cohorts, crypto-vs-authority, provider qualification, attestation qualification, residual cohorts and ambiguous effects. No new cross-capability scenario ID is justified.

## Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new preventive invariant candidates: **0**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Enterprise Trust / PKI / Certificate Lifecycle eligible local no-material streak: **0 → 1**;
- `Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution` cluster streak: **1 → 2** because this cluster was explicitly revisited;
- material edge scenario inventory: **284**;
- reusable ConflictPattern inventory: **119**;
- combined material findings: **403**;
- Full Pass 4 capability coverage after this visit: **20/28**;
- Full Pass 4 mandatory cluster coverage: **12/12**;
- completed full passes: **3/8 minimum**;
- negative-space review: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: `BLOCKED`.

This is an eligible no-new-material revisit, not a claim that PKI/trust is defect-free. One further eligible no-material local revisit is still required for the Trust capability because its Full-Pass-3 material finding reset the local streak.

## Next research target

Continue only Full Pass 4 with **Privacy / Data Governance / Retention / Legal Hold / Residency**. Use techniques materially different from Full Passes 1–3 and duplicate-screen against all 119 patterns, especially cumulative-privacy, presence-semantics, trust-namespace-collapse and compatibility-direction where applicable. Challenge purpose/use and legal-basis currentness, retention versus legal hold, residency/provider substitution, disposal across replicas/backups/caches, restore resurrection, derived/inferred data, subject-linkage ambiguity, provider ACK versus effective erasure, offline horizons, cumulative/mosaic disclosure, resource pressure, human-procedure/cross-process conflicts and AI/low-code compositions that broaden use or weaken obligations. Preserve research-only disposition and do not enter Planning C.
