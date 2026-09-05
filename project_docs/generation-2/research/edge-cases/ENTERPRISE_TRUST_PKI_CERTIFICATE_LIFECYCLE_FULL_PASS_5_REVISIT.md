# Generation 2 — Enterprise Trust / PKI / Certificate Lifecycle — Full Pass 5 Revisit

Status: `ELIGIBLE NO-NEW-MATERIAL REVISIT`
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 5
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Authority and scope

Research only. This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, prior Trust/PKI registers, and `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`. It preserves `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, cryptographic validity != semantic authority, path validity != workflow/effect proof, and Fleet aggregate != runtime truth/control authority. No product code, Work Package, TASK, Construction, remediation or Planning C work was performed.

## Techniques rotated for Full Pass 5

1. proof-domain subtraction: hold a valid certificate/signature constant while removing semantic-authority/effect-proof obligations;
2. trust-rotation proof braid: permute signer rotation, trust-root publication, proof-bundle creation, verifier refresh, revocation and offline verification;
3. split-view verifier cohorts: old/new trust stores validate different proof bundles during federation/provider substitution;
4. proof-of-possession/enrollment transposition: preserve possession while changing canonical identity/organization/authority mapping;
5. trust-domain binding mutation: preserve bytes and cryptographic validity while changing trust-domain/provider association;
6. recovery-cut trust mutation: restore journals/proof bundles across key compromise/rotation without assuming historical signature validity establishes current authority;
7. clock/currentness mutation across certificate validity, revocation/status evidence and journal timestamps;
8. PARTIAL/UNKNOWN issuance, rotation, revocation and bundle-distribution effects;
9. resource/cardinality pressure over chains, trust bundles, revocation/status and proof verification;
10. human-procedure conflict: emergency continuity versus compromise containment and proof-verifier policy;
11. AI/low-code trust amplification: generated trust-store/federation/proof policies that widen authority while remaining syntactically valid;
12. duplicate-screen against all 123 reusable ConflictPatterns, including the four new formal-assurance/federation/analytical patterns.

## External evidence checked

### SPIFFE Federation and Trust Domain/Bundle

SPIFFE Federation requires explicit binding among trust-domain name, bundle endpoint/profile and retrieved bundle; bundles from different trust domains must not be merged because that enables cross-domain impersonation. Bundle contents evolve during key rotation and clients are expected to refresh them. This supports existing trust-namespace, currentness, cohort and provider-substitution families rather than a new conflict class.

Sources: SPIFFE Federation and SPIFFE Trust Domain and Bundle, accessed 2026-09-05.

### Sigstore verification and trust model

Sigstore verification separately checks artifact signature, certificate identity/issuer/root and transparency-log inclusion. Its security model also makes clear that OIDC/Fulcio compromise can lead to unauthorized certificates and that transparency makes misuse detectable rather than magically semantically authorized. This reinforces the distinction `valid signature/certificate/log proof != canonical business authority/effect proof`.

Sources: Sigstore Overview, Security Model and Policy Controller, accessed 2026-09-05.

## Duplicate-screen result against 123 reusable ConflictPatterns

No distinct 124th reusable pattern survived duplicate-screening.

| Challenged composition | Existing coverage / disposition |
| --- | --- |
| valid proof-bundle signature promoted to semantic workflow/effect proof | `G2-CONFLICT-PATTERN-PROOF-CLAIM-CONFLATION-001` + crypto-authority families — DUPLICATE |
| child/parent proof signatures remain valid across incompatible trust/revision profiles | `G2-CONFLICT-PATTERN-CERTIFICATE-COMPOSITION-001` + trust-currentness/revision families — DUPLICATE |
| federated handoff authenticates both parties but effect/responsibility remains ambiguous | `G2-CONFLICT-PATTERN-FEDERATED-CONTINUITY-001` — DUPLICATE |
| proof verifier accepts old signer/trust cohort after rotation or compromise | trust-currentness + trust-cohort + residual-cohort families — DUPLICATE |
| provider substitution preserves certificate bytes but loses trust-domain ownership binding | trust-namespace-collapse + provider-qualification families — DUPLICATE |
| proof-of-possession/enrollment credential treated as canonical identity/business authority | crypto-authority + identity-mapping/auth-currentness families — DUPLICATE |
| recovery restores valid historical proof/journal under withdrawn authority | recovery-cut-effect + proof-claim + currentness families — DUPLICATE |
| certificate/path/revocation status is PARTIAL/UNKNOWN and verifier silently assumes valid | ambiguous-effect + evidence-currentness/presence families — DUPLICATE |
| clock skew changes certificate/status/journal ordering interpretation | temporal/currentness families — DUPLICATE |
| resource pressure causes trust/proof verification pruning or fallback | boundedness/resource-coverage families — DUPLICATE |
| operator continuity runbook conflicts with compromise containment | trust-emergency/human-procedure families — DUPLICATE |
| AI/low-code merges trust stores or broadens accepted proof profile | trust-namespace + authority non-amplification + AI-composition families — DUPLICATE |

## Processual / semantic conflict screen

All required families were deliberately screened: structural graph; state-transition; semantic ownership; rule/formula/condition; temporal/ordering; resource/capacity; authority/responsibility/SoD; policy/compliance; data/consistency; provider/integration; version/migration/coexistence; exception/compensation/recovery; human-procedure/instruction; cross-process; objective/optimization; AI/low-code composition.

The strongest candidate remains a composition in which certificate/path/signature/transparency evidence is individually valid but the consumer strengthens that narrow cryptographic claim into current semantic authority, workflow completion or external-effect proof. This is already covered by proof-claim conflation plus trust/currentness/crypto-authority families. No `ConflictInstance` is asserted.

## Formal-assurance / federation proof-obligation refinements

These are research refinements, not preventive invariants or implementation requirements:

1. a proof-bundle verifier profile should identify the trust-domain/signer identity and trust-policy revision used for verification, not only `signature_valid=true`;
2. historical signature validity should remain distinct from current signer authorization after rotation/revocation/organizational change;
3. parent/child proof composition should qualify both proof semantics and verifier/trust profile, including unresolved `UNKNOWN`;
4. offline verification should expose trust/revocation evidence horizon and must not silently claim currentness beyond it;
5. federation/provider substitution should preserve explicit trust-domain→bundle/anchor ownership through proof verification and recovery cuts.

## Autonomous Builds × Fleet Observability/Capacity lens

Trust/proof telemetry exported to Fleet is evidence, not authority. A fleet aggregate may report signature/path verification rates, stale trust-store cohorts, revocation/currentness gaps, verifier latency, proof failures and resource pressure, but it must preserve build/release/deployment/trust-policy dimensions before semantic aggregation. A local autonomous build must continue correctly if SB/Observe/Fleet is unavailable. Export failure must not block workflow; offline trust/currentness uncertainty remains local evidence to be handled by the qualified runtime contract. Shared infrastructure does not imply shared trust namespace or shared authority.

## Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new preventive invariant candidates: **0**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Enterprise Trust / PKI / Certificate Lifecycle local no-material streak: **1 → 2**;
- mandatory cluster streaks: already satisfied at **2**; no inflation;
- material edge inventory: **284**;
- reusable ConflictPattern inventory: **123**;
- combined material findings: **407**;
- Full Pass 5 capability coverage after this visit: **20/28**;
- Full Pass 5 mandatory cluster coverage: **12/12**;
- completed full passes: **4/8 minimum**;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: `BLOCKED`.

## Next research target

Continue only Full Pass 5 with **Privacy / Data Governance / Retention / Legal Hold / Residency**. Duplicate-screen all 123 ConflictPatterns and carry Typed Semantic Graph/Federation/Workflow proof plus Autonomous Builds/Fleet into purpose/use/legal-basis currentness, retention versus legal hold, residency/provider substitution, deletion across replicas/backups/caches, restore resurrection, derived/inferred data, subject-linkage ambiguity, proof/journal privacy, telemetry minimization, offline buffering, cumulative/mosaic disclosure, resource pressure, human/cross-process conflicts and AI/low-code compositions. Do not enter Planning C.