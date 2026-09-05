# Generation 2 — Identity / Authentication / Federation — Full Pass 3 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Identity / Authentication / Federation
Pass: 3
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md`, adversarial framework and processual/semantic conflict classification.

Research only. No product code, Work Package, TASK, Construction, implementation guard or concrete remediation is authorized by this artifact. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Revisit method

This revisit deliberately used techniques different from Full Passes 1 and 2:

1. **claim-presence metamorphism** — mutate identity/profile claims across ABSENT, explicit null, empty, defaulted, removed and provider-omitted representations and compare the resulting identity/link/session semantics;
2. **identity graph merge/split braid** — interleave account link, unlink, subject reassignment, alias change and canonical-person adoption while old sessions remain active;
3. **assurance/issuer/key/policy revision-product mutation** — hold one dimension locally valid while changing the others to test whether a cryptographically valid assertion is incorrectly treated as a timeless scalar identity fact;
4. **disable/revoke/login/refresh race permutation** — vary event order and delayed propagation, including replay of refresh artifacts and residual RP sessions;
5. **recovery/reset differential** — compare recovery under changed proofing, device, issuer, Role/Station and trust state without assuming restored access proves restored identity assurance;
6. **IdP degradation/substitution braid** — retain old and new providers simultaneously and mutate subject namespace, assurance, logout, revocation, metadata and profile-presence semantics;
7. **cross-tenant correlation mutation** — test provider-native aliases and pairwise/public identifiers against tenant/person boundaries and semantic-owner authority;
8. **resource-exhaustion/freshness subtraction** — remove timely metadata/JWKS/introspection/revocation evidence under cache/backlog pressure and challenge fail-open or indefinite stale acceptance;
9. **AI/low-code evidence-role inversion** — give generated logic valid authentication/group/profile evidence and test whether it promotes evidence into canonical Person, Role, Station or permission truth;
10. **duplicate-screen** against all 116 authoritative reusable `G2-CONFLICT-PATTERN-*`, explicitly including `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` added earlier in Full Pass 3.

All 12 mandatory clusters are already explicitly covered in Full Pass 3. This is a local Identity revisit only; incidental cluster overlap does not increment a mandatory-cluster streak.

## 2. Evidence refresh

Fresh official evidence reinforces mechanisms already represented by the catalogue:

- RFC 9700 (OAuth 2.0 Security BCP, January 2025) requires clients interacting with multiple authorization servers to bind each authorization request to its issuer and describes refresh-token replay defenses, rotation and revocation relationships. Portable inference: flow/token validity is qualified by issuer/client/grant context and lineage; local cryptographic validity alone does not prove current identity or authority semantics: https://www.rfc-editor.org/rfc/rfc9700.html
- OpenID Connect Back-Channel Logout 1.0 defines `sid` as issuer-contextual and permits logout tokens identified by `iss` + `sub` when `sid` is absent. Portable inference: presence/absence of an identity/session claim can intentionally change operation scope, so representation translation must not collapse ABSENT/null/default semantics: https://openid.net/specs/openid-connect-backchannel-1_0-final.html
- OpenID Connect Core distinguishes issuer-qualified subject identifiers and public/pairwise subject modes. Portable inference retained from prior passes: provider subject, email, username, group and session identifiers are evidence in qualified namespaces, not canonical Person/authorization truth.

These sources do not define SB architecture. They strengthen already catalogued mapping, currentness, coexistence, residual-cohort, authority non-amplification and presence-semantics patterns.

## 3. Duplicate-screen results

No genuinely new material local edge case or reusable ConflictPattern survived.

| Challenged mechanism | Existing authoritative coverage | Disposition |
| --- | --- | --- |
| ABSENT/null/empty/default/remove translation for profile, subject-adjacent or session claims changes effective identity/session mutation | `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` + identity mapping/effective-identity families | DUPLICATE / NO NEW MATERIAL CLASS |
| link/unlink/merge/split while old sessions remain active | `G2-EDGE-IDENTITY-001..003`; identity-mapping, authentication-currentness and residual-cohort families | DUPLICATE / NO NEW MATERIAL CLASS |
| issuer/client/assurance/key/metadata/policy revision product has no single compatible cut | `G2-EDGE-IDENTITY-002`, `-004`, `-005`; qualified-claim/currentness, revision-vector, federation-coexistence and trust families | DUPLICATE / NO NEW MATERIAL CLASS |
| disable/revoke/login/refresh/replay races | `G2-EDGE-IDENTITY-003`, `-006`; authentication-currentness, ambiguous-effect/idempotency and residual-cohort families | DUPLICATE / NO NEW MATERIAL CLASS |
| recovery/reset under changed proofing or authority context | `G2-EDGE-IDENTITY-007`; `G2-CONFLICT-PATTERN-RECOVERY-IDENTITY-AUTHORITY-001` | DUPLICATE / NO NEW MATERIAL CLASS |
| IdP substitution/degradation preserves protocol label but changes identity or presence semantics | `G2-EDGE-IDENTITY-005`; provider-qualification, federation-coexistence, presence-semantics and semantic-ownership families | DUPLICATE / NO NEW MATERIAL CLASS |
| cross-tenant/person correlation through provider aliases or identifier modes | identity-mapping, multitenant-scope, privacy-purpose/currentness and semantic-ownership families | DUPLICATE / NO NEW MATERIAL CLASS |
| metadata/JWKS/introspection/revocation pressure yields stale/unknown evidence | authentication-currentness, trust-currentness, qualified-claim and resource-exhaustion families | DUPLICATE / NO NEW MATERIAL CLASS |
| AI/low-code promotes authentication/group evidence into canonical identity or authorization | `G2-EDGE-IDENTITY-007`; permission-composition, recovery-identity-authority and authority non-amplification families | DUPLICATE / NO NEW MATERIAL CLASS |

The absence of a new ID is saturation evidence only, not evidence that these mechanisms are defect-free.

## 4. Processual / semantic conflict classification

All required conflict families were explicitly screened:

- **structural graph:** many-to-many account/link graphs and residual-session references remain identity-mapping/boundedness problems;
- **state-transition:** login/refresh/logout/disable/revoke/recovery interleavings remain currentness/convergence problems;
- **semantic ownership:** provider-native claims remain evidence and cannot silently become canonical Person/Role/Station truth;
- **rule/formula/condition:** claim-presence predicates and assurance requirements remain qualified by consuming policy/revision;
- **temporal/ordering:** delayed logout/revocation/metadata and reassignment remain currentness/coexistence concerns;
- **resource/capacity:** verifier/introspection/revocation pressure remains resource/currentness boundedness;
- **authority/responsibility/SoD:** authentication evidence cannot grant authorization and recovery cannot bypass current authority/SoD;
- **policy/compliance:** consuming policy owns required assurance/currentness/correlation/privacy constraints;
- **data/consistency:** subject/alias reassignment and merge/split ambiguity remain identity-mapping conflicts;
- **provider/integration:** IdP substitution and profile translation remain provider-qualified and presence-sensitive;
- **version/migration/coexistence:** old/new issuer, key, mapping and session epochs remain residual cohorts until dispositioned;
- **exception/compensation/recovery:** recovery/link/unlink cannot silently change assurance or canonical identity;
- **human-procedure/instruction:** manual linking/recovery is an authorized evidence-based action, not proof by operator intent;
- **cross-process:** downstream decisions using stale identity evidence remain currentness/decision-lineage concerns;
- **objective/optimization:** SSO availability/cache efficiency cannot silently override identity correctness, privacy or currentness;
- **AI/low-code composition:** generated mappings/rules cannot strengthen identity or authority beyond qualified inputs.

No unowned new `ConflictPattern` emerged. No new preventive invariant candidate is elevated.

## 5. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- Identity / Authentication / Federation eligible no-material streak: **1 → 2**;
- mandatory-cluster streaks: **unchanged**;
- material edge scenario inventory: **281**;
- reusable ConflictPattern inventory: **116**;
- combined material findings: **397**;
- HIGH/CRITICAL findings without owner/proof/detection route: **0**;
- Full Pass 3 local coverage after this revisit: **16/28**;
- Full Pass 3 mandatory-cluster coverage: **12/12**;
- completed full passes: **2/8 minimum**;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

Identity now has two consecutive eligible no-material revisits across Full Passes 2 and 3. This satisfies the local streak criterion for this capability only; campaign-wide saturation remains blocked by incomplete Full Pass 3 and other local/cluster streaks.

## 6. Research-only consequence candidates retained

No target architecture is selected. Existing later-phase candidates remain sufficient: preserve canonical Person identity distinct from provider/session/profile identifiers; qualify authentication evidence by issuer/client/assurance/trust/currentness/revision; preserve claim presence semantics where operation scope or mutation meaning depends on omission; independently requalify authorization/Role/Station at consequential actuation; preserve residual sessions/providers/keys until effective convergence; and bound recovery, offline operation and AI/low-code composition by semantic ownership and current authority.

## 7. Next rotation candidate

Continue Full Pass 3 with **Authorization / Policy / Organization / Multitenancy**. Use techniques materially different from Full Passes 1 and 2 and duplicate-screen against all 116 ConflictPatterns, including presence semantics. Challenge allow/deny and inherited-policy composition; Enterprise/Station/Role/Person scope intersections; stale membership/delegation/SoD; grant/revoke/use races; policy evaluation across revision products; resource/action identity ambiguity; tenant/Station isolation under shared providers/caches; long-running work crossing authority/policy revisions; break-glass/delegation expiry; external group claims incorrectly adopted as grants; ABSENT/null/default semantics in policy attributes and obligations; `PARTIAL/UNKNOWN` distributed enforcement; residual grants/caches/offline authorization; pathological policy graphs/resource pressure; cross-process self-dealing; and AI/low-code composition that widens authority. Do not enter Planning C.