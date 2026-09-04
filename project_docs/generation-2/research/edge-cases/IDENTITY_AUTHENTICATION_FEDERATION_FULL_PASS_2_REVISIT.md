# Generation 2 — Identity / Authentication / Federation — Full Pass 2 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Identity / Authentication / Federation
Pass: 2
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md`, adversarial framework and processual/semantic conflict classification.

Research only. No product code, Work Package, TASK, Construction, implementation guard or concrete remediation is authorized by this artifact. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Revisit method

This revisit intentionally used techniques materially different from Full Pass 1:

1. **namespace/reassignment mutation** — vary issuer, subject namespace, pairwise/public identifier mode, email/username aliases, tenant boundary and identifier lifecycle to test whether a locally stable identifier is incorrectly promoted to canonical person identity;
2. **assurance-vector fracture** — keep a session/assertion cryptographically valid while changing authentication method, assurance context, recovery state, trust/key metadata, Station/Role and consuming policy to test whether evidence strength is incorrectly treated as scalar/timeless;
3. **issuer/client mix-up falsification** — exchange otherwise valid authorization responses/tokens among multiple issuers/clients/redirect contexts and test whether flow binding is part of qualified identity evidence;
4. **logout/revocation propagation lag** — terminate or disable upstream identity state while retaining downstream RP sessions, refresh artifacts or offline closures and test whether control-plane completion is mistaken for effective convergence;
5. **recovery identity mutation** — perform reset/recovery/link/unlink after subject proof changes and test whether availability restoration silently changes effective identity or assurance;
6. **IdP substitution differential** — compare two standards-compatible providers whose `sub`, assurance, group, logout, metadata, revocation and recovery semantics differ while residual sessions coexist;
7. **correlation/privacy cross-check** — test whether pairwise/public/provider identifiers, aliases and imported identities can be correlated across Enterprise/tenant/person boundaries without semantic-owner authority;
8. **resource-pressure perturbation** — apply verifier-cache, metadata-refresh, session-index and revocation-propagation pressure and test fail-open/currentness assumptions;
9. **AI/low-code evidence misuse mutation** — feed syntactically valid identity/authentication claims into generated rules and surfaces and test whether evidence is transformed into authorization or cross-person mapping;
10. **duplicate-screen** against the authoritative 115 reusable `G2-CONFLICT-PATTERN-*` inventory before admitting any new material edge/conflict class.

All 12 mandatory clusters are already covered once in Full Pass 2. This was a local Identity revisit, not a designated second cluster rotation; incidental interactions do not artificially advance cluster streaks.

## 2. Evidence refresh

Fresh official specifications reinforce mechanisms already represented by the existing catalogue:

- OpenID Connect Core defines public and pairwise Subject Identifiers and requires pairwise `sub` values to differ by Sector Identifier. Portable inference: subject identifiers are qualified by issuer/sector/provider semantics; aliases such as email or username are not substitutes for canonical person identity: https://openid.net/specs/openid-connect-core-1_0-18.html
- RFC 9700 (OAuth 2.0 Security BCP, January 2025) requires mix-up defenses for clients interacting with multiple authorization servers and binds authorization requests/responses to issuer context. Portable inference: cryptographic/protocol validity without correct issuer/client/flow binding is insufficient identity evidence: https://www.rfc-editor.org/rfc/rfc9700.html
- OpenID Connect Back-Channel Logout 1.0 makes downstream session termination an explicit RP responsibility and notes that back-channel state differs from front-channel state. Portable inference: upstream logout/revocation signal is not itself proof that every residual relying-party session is effectively terminated: https://openid.net/specs/openid-connect-backchannel-1_0-final.html

These sources do not define SB architecture. They strengthen the existing portable distinctions: provider identifiers are non-canonical; authenticated evidence is qualified by issuer/client/assurance/trust/currentness context; authentication is not authorization; and effective revocation/logout requires residual-cohort disposition rather than ACK inference.

## 3. Duplicate-screen results

No genuinely new material local edge-case or reusable ConflictPattern survived the screen.

| Challenged mechanism | Existing authoritative coverage | Disposition |
| --- | --- | --- |
| email/username/provider-subject reassignment, alias collision, merge/split/link ambiguity | `G2-EDGE-IDENTITY-001`; `G2-CONFLICT-PATTERN-IDENTITY-MAPPING-001`; effective-identity and multitenant-scope families | DUPLICATE / NO NEW MATERIAL CLASS |
| pairwise/public `sub` mismatch or cross-sector correlation | identity-mapping, effective-identity, multitenant-scope, privacy-purpose/currentness families | DUPLICATE / NO NEW MATERIAL CLASS |
| assurance/authentication method changes while session remains valid | `G2-EDGE-IDENTITY-002`; `G2-CONFLICT-PATTERN-AUTHENTICATION-CURRENTNESS-001`; qualified-claim/currentness/revision-vector families | DUPLICATE / NO NEW MATERIAL CLASS |
| multi-issuer/client mix-up or confused-deputy response binding | `G2-EDGE-IDENTITY-004..005`; federation-coexistence, provider-qualification, effective-identity, qualified-claim and trust/authority families | DUPLICATE / NO NEW MATERIAL CLASS |
| disable/revoke/logout races leaving RP/refresh/offline residual sessions | `G2-EDGE-IDENTITY-003`, `-006`; authentication-currentness, federation-coexistence, residual-cohort and adoption/convergence families | DUPLICATE / NO NEW MATERIAL CLASS |
| metadata/JWKS/trust rotation under verifier-cache pressure | `G2-EDGE-IDENTITY-004`; currentness, revision-vector, trust-currentness and residual-cohort families | DUPLICATE / NO NEW MATERIAL CLASS |
| IdP substitution preserving standards labels but changing subject/assurance/logout/recovery semantics | `G2-EDGE-IDENTITY-005`; federation-coexistence, provider-qualification, standards/provider-downgrade and semantic-ownership families | DUPLICATE / NO NEW MATERIAL CLASS |
| recovery/reset changes effective identity or assurance | `G2-EDGE-IDENTITY-007`; `G2-CONFLICT-PATTERN-RECOVERY-IDENTITY-AUTHORITY-001`; recovery/authority/SoD families | DUPLICATE / NO NEW MATERIAL CLASS |
| offline acceptance beyond retained currentness horizon | `G2-EDGE-IDENTITY-006`; currentness, qualified-claim, offline-closure and residual-cohort families | DUPLICATE / NO NEW MATERIAL CLASS |
| cross-tenant/person correlation from provider-native identity evidence | identity-mapping, multitenant-scope, privacy-purpose, semantic-ownership and authority families | DUPLICATE / NO NEW MATERIAL CLASS |
| verifier/session/revocation resource exhaustion causes fail-open or indefinite stale acceptance | resource-exhaustion, scheduling/currentness, recovery and authority non-amplification families | DUPLICATE / NO NEW MATERIAL CLASS |
| AI/low-code treats authenticated/group/identity evidence as Role, permission or canonical identity fact | `G2-EDGE-IDENTITY-007`; recovery-identity-authority, permission-composition, presentation-authority and AI/AGWS non-amplification families | DUPLICATE / NO NEW MATERIAL CLASS |

The absence of a new ID is saturation evidence only. It is not a claim that these mechanisms are safe or bug-free; the existing scenarios, owners, severities, detection candidates, proof obligations and future remediation routes remain authoritative.

## 4. Processual / semantic conflict classification

All mandatory conflict families were explicitly screened:

- **structural graph:** account-link/correlation graphs can form ambiguous many-to-many components, already covered by identity-mapping/effective-identity boundedness;
- **state-transition:** login/refresh/logout/disable/revoke/recovery races map to authentication-currentness and residual-cohort/convergence families;
- **semantic ownership:** provider subject/group/email claims remain evidence, not canonical Person/Role/authority truth;
- **rule/formula/condition:** assurance or authentication predicates crossing revision changes map to qualified-claim/currentness/revision-vector families;
- **temporal/ordering:** stale sessions, delayed logout and metadata rotations map to currentness/federation coexistence;
- **resource/capacity:** cache/refresh/revocation pressure maps to resource-exhaustion and scheduling/currentness families;
- **authority/responsibility/SoD:** authentication evidence cannot grant local Role, Station or permission and recovery cannot bypass current authority/SoD;
- **policy/compliance:** consuming policy remains owner of required assurance/currentness and correlation/privacy applicability;
- **data/consistency:** alias/subject reassignment and cross-provider collisions remain identity-mapping/effective-identity problems;
- **provider/integration:** issuer/client/provider substitution remains provider-qualified and non-canonical;
- **version/migration/coexistence:** old and new IdP/session/key epochs remain residual cohorts until dispositioned;
- **exception/compensation/recovery:** reset/recovery/link/unlink cannot silently change assurance or canonical identity;
- **human-procedure/instruction:** manual account linking/recovery remains an authorized evidence-based adoption step, not proof by operator intent;
- **cross-process:** downstream processes consuming stale identity evidence map to currentness/qualified-claim and decision-lineage families;
- **objective/optimization:** availability/SSO convenience/cache hit rate cannot silently override identity correctness, currentness or tenant isolation;
- **AI/low-code composition:** generated mappings/rules/surfaces cannot amplify identity or authorization claims beyond qualified inputs.

No unowned new `ConflictPattern` emerged. `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict` remain preserved. No new preventive invariant candidate is proposed beyond already-catalogued universal identity/authority non-amplification and evidence-qualification principles.

## 5. Cross-capability disposition

No new cross-capability scenario is admitted. The strongest interactions remain covered by existing mandatory clusters, principally:

- Identity × Authorization × Station × AGWS × AI;
- Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution;
- Provider/Binding × external realizations;
- Observability × Security/Recovery × runtime truth.

Because this visit is a local capability revisit and not a designated second cluster rotation, mandatory-cluster streaks remain unchanged. In particular, Identity × Authorization × Station × AGWS × AI remains at eligible no-material streak **1**, not **2**.

## 6. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- Identity / Authentication / Federation eligible no-material streak: **1**;
- mandatory-cluster streaks: **unchanged**;
- material edge scenario inventory: **278**;
- reusable ConflictPattern inventory: **115**;
- combined material findings: **393**;
- HIGH/CRITICAL findings without owner/proof/detection route: **0**;
- Full Pass 2 local coverage after this revisit: **16/28**;
- Full Pass 2 mandatory-cluster coverage: **12/12**;
- completed full passes: **1/8 minimum**;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

This is one eligible no-material revisit only. Identity still requires another consecutive eligible revisit with no new material finding in a later pass, as do campaign-wide capability and high-risk-cluster streak requirements.

## 7. Research-only consequence candidates retained for later phases

No new target architecture is selected. Existing research consequences remain sufficient:

1. keep canonical Person/identity distinct from provider account, issuer subject, email, username, group and token/session identifiers;
2. qualify authentication evidence by issuer/client/flow, assurance, trust/key/metadata, revision and currentness context;
3. preserve authentication as evidence only; authorization/Role/Station remains independently owner-qualified at consequential actuation;
4. preserve residual session/token/provider/key cohorts until effective-state evidence qualifies revocation/logout/cutover convergence;
5. treat recovery/linking/correlation as bounded identity-owner mutations with lineage rather than implicit identity truth;
6. preserve offline horizons and AI/AGWS/provider non-amplification.

## 8. Next rotation candidate

Continue Full Pass 2 with **Authorization / Policy / Organization / Multitenancy**. Use techniques materially different from Full Pass 1 and duplicate-screen against the 115 reusable ConflictPatterns. Challenge allow/deny and inherited-policy composition; Enterprise/Station/Role/Person scope intersections; stale membership/delegation/SoD evidence; grant/revoke/use and policy-evaluation races; resource/action identity ambiguity; tenant/Station isolation under shared providers/caches; long-running work crossing authority/policy revisions; break-glass/delegation expiry; external group claims incorrectly adopted as grants; `PARTIAL/UNKNOWN` distributed enforcement; residual grants/caches/offline authorization; pathological policy graphs/resource pressure; cross-process self-dealing; and AI/low-code composition that widens authority. Do not enter Planning C.