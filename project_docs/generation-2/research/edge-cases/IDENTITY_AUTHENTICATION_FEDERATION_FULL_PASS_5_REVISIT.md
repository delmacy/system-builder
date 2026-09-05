# Generation 2 — Identity / Authentication / Federation — Full Pass 5 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Identity / Authentication / Federation
Pass: 5
Mandatory cluster explicitly exercised: `Identity × Authorization × Station × AGWS × AI`
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md`, adversarial framework and processual/semantic conflict classification.

Research only. No product code, Work Package, TASK, Construction, implementation guard or concrete remediation is authorized by this artifact. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Full Pass 5 method

This revisit deliberately combined identity semantics with the active `Typed Semantic Graph + ExecutionEnvelope` and `Autonomous Builds × Fleet Observability/Capacity` hypotheses:

1. **subject-evidence lineage fracture** — vary canonical Person, provider subject, RP account, session, credential, assurance and key epochs independently and test whether a graph edge or telemetry attribute is mistaken for canonical identity;
2. **N-wise authority-cut mutation** — keep Identity, Authorization, Station, AGWS and AI individually valid while making their revision/currentness cuts mutually incompatible;
3. **login/refresh/logout/revoke permutation** — distinguish accepted control-plane operations from effective termination of all residual session/token cohorts;
4. **merge/split/link/reassignment braid** — interleave account linking, unlinking, identifier reuse, person merge/split and downstream execution lineage;
5. **offline/currentness subtraction** — remove IdP, metadata, JWKS, introspection or revocation availability while local workflow operation continues under bounded cached evidence;
6. **provider-substitution differential** — compare issuers/providers that share OIDC/OAuth labels but differ in subject namespace, assurance, logout, recovery and revocation semantics;
7. **presence-semantics mutation** — exercise `ABSENT`, explicit null, empty/default values and removed claims across identity/authorization consumers;
8. **Fleet comparability falsification** — aggregate authentication/session telemetry across builds, releases, deployments and tenants and test whether equal-looking IDs/attributes create false semantic identity or authority equivalence;
9. **privacy/correlation accumulation** — combine locally permissible end-user/session observations until fleet-level correlation becomes stronger than any local owner authorized;
10. **AI/low-code authority laundering** — test generated composition that turns authentication evidence, group/profile claims, telemetry hotspots or inferred identity into Role, Station, permission, target-population or recovery authority;
11. **resource/cardinality pressure** — stress session indexes, identity-link graphs, verifier caches and high-cardinality telemetry without allowing pressure to justify silent stale acceptance or cross-tenant collapsing;
12. **duplicate-screen** against all 119 authoritative reusable `G2-CONFLICT-PATTERN-*` before admitting any new finding.

## 2. Fresh evidence

Current official evidence reinforced existing catalogue classes:

- **NIST SP 800-63C-4 (July/August 2025)** distinguishes the RP subscriber account from IdP state, allows RP lifecycle decisions independently, requires authenticated-session context for account linking and requires a verified assertion from the expected IdP before an RP authenticated session is established. Portable principle: federation success does not freeze local canonical identity, lifecycle or authority. Sources: https://www.nist.gov/publications/nist-sp-800-63c-4digital-identity-guidelines-federation-and-assertions and https://pages.nist.gov/800-63-4/sp800-63c/Federation/
- **RFC 9700 (January 2025)** requires issuer binding in multi-authorization-server scenarios and preserves refresh-token grant/revocation lineage. Portable principle: cryptographic/token validity without issuer/client/grant/currentness qualification is insufficient for authority claims. Source: https://www.rfc-editor.org/rfc/rfc9700.html
- **OpenID Connect Core 1.0** makes pairwise `sub` identifiers sector-qualified rather than universal person identifiers. Portable principle: provider/RP subject identifiers cannot be promoted into cross-tenant canonical Person identity without explicit mapping authority. Source: https://openid.net/specs/openid-connect-core-1_0-18.html
- **OpenTelemetry End User semantic conventions** mark `enduser.id` as PII and `enduser.pseudo.id` as linkable PII; the Entity Data Model requires minimally sufficient, repeatable entity identity. Portable principle: observability identity is telemetry identity/evidence, not canonical business identity or authorization, and fleet correlation itself can create privacy risk. Sources: https://opentelemetry.io/docs/specs/semconv/registry/attributes/enduser/ and https://opentelemetry.io/docs/specs/otel/entities/data-model/

These sources do not decide System Builder architecture. They support already-catalogued identity mapping, authentication currentness, federation coexistence, trust namespace, cumulative privacy, semantic ownership and qualified-comparability patterns.

## 3. Autonomous Builds × Fleet Observability/Capacity — research hypothesis

`HIPÓTESE DE ARQUITETURA / EM PESQUISA` only.

The operational lineage remains a useful candidate:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`

Identity evidence attached to an invocation must remain qualified by its producing/consuming context. A fleet record such as `enduser.id`, `subject`, `session_id`, `issuer`, `service.version` or a pseudonymous correlation key is not, by itself, proof that two invocations across builds/deployments/tenants represent the same canonical Person or the same current authority state.

Preserve explicitly:

`semantic topology != build topology != deployment topology != runtime truth != local journal/evidence != exported telemetry != fleet aggregate != control authority`.

Additional retained distinctions:

- `authentication evidence != authorization`;
- `identity proof != current authority`;
- `provider subject != canonical Person`;
- `same telemetry identifier != same canonical identity` without qualified namespace/mapping revision;
- `same canonical Person != comparable authority state` across policy/Station/build epochs;
- `telemetry gap != authentication failure`;
- `Fleet aggregate != runtime truth`;
- `Shared infrastructure != shared truth/authority`.

Local workflow correctness must not depend on SB/Observe/Fleet availability. Local identity/session evidence sufficient for the configured offline policy may support bounded autonomous operation, while export remains optional/providerized and non-blocking. Fleet remains read/analysis plane by default.

## 4. Duplicate-screen results

No candidate survived as a genuinely new material class.

| Challenged composition | Existing coverage | Disposition |
| --- | --- | --- |
| telemetry identifier equality across builds/tenants is treated as canonical Person equality | identity-mapping, trust-namespace, cumulative-privacy, semantic-ownership and qualified-comparability families | DUPLICATE / NO NEW MATERIAL CLASS |
| same Person across builds is aggregated as same authority despite Role/Station/policy revision divergence | `G2-EDGE-IDENTITY-002`; authentication-currentness, revision-vector and authority-currentness families | DUPLICATE / NO NEW MATERIAL CLASS |
| local journal has current identity/session evidence while Fleet is stale, sampled or missing | authentication-currentness plus local-evidence/exported-telemetry/Fleet separation already catalogued | DUPLICATE / NO NEW MATERIAL CLASS |
| Fleet-derived hotspot/risk signal is promoted into authentication denial, Role/Station grant or recovery authority | presentation-authority, authority non-amplification, semantic-ownership and AI/low-code composition families | DUPLICATE / NO NEW MATERIAL CLASS |
| pairwise/provider-native subject IDs are joined across tenants/providers by telemetry enrichment | identity-mapping, trust-namespace and cumulative-privacy families | DUPLICATE / NO NEW MATERIAL CLASS |
| session/revocation telemetry ACK is treated as proof that all runtime cohorts stopped accepting the session | `G2-EDGE-IDENTITY-003`; ambiguous-effect, residual-cohort and convergence families | DUPLICATE / NO NEW MATERIAL CLASS |
| each of Identity, Authorization, Station, AGWS and AI validates its own revision but no jointly qualified cut existed | authentication-currentness, revision-vector, presentation-authority and non-amplification families | DUPLICATE / NO NEW MATERIAL CLASS |
| valid OIDC/OAuth provider substitution changes assurance/subject/logout/recovery semantics | `G2-EDGE-IDENTITY-005`; federation-coexistence, provider-qualification and standards/provider-downgrade families | DUPLICATE / NO NEW MATERIAL CLASS |
| offline token/session remains locally usable beyond qualified currentness horizon | `G2-EDGE-IDENTITY-006`; authentication-currentness and bounded-offline-evidence families | DUPLICATE / NO NEW MATERIAL CLASS |
| AI composes valid identity/profile/group evidence into a wider target population | `G2-EDGE-IDENTITY-007`; AI/AGWS permission-composition and authority-non-amplification families | DUPLICATE / NO NEW MATERIAL CLASS |

No new `G2-EDGE-*`, `G2-XEDGE-*`, `G2-CONFLICT-PATTERN-*` or preventive invariant is warranted.

## 5. Processual / semantic conflict classification

All required conflict families were screened:

- **structural graph:** subject/account/session/link graph reachability is not proof of canonical identity or current realizability;
- **state-transition:** login/refresh/logout/revoke/link/unlink/recovery races preserve residual cohorts and effective-state ambiguity;
- **semantic ownership:** identity providers and telemetry exporters produce evidence; canonical Person/Role/Station/permission semantics remain with their owners;
- **rule/formula/condition:** claim predicates remain namespace/revision/currentness qualified;
- **temporal/ordering:** session and key/provider epochs may cross authority changes and delayed telemetry;
- **resource/capacity:** verifier/session-index/telemetry pressure must not silently weaken currentness or tenant isolation;
- **authority/responsibility/SoD:** authentication and fleet analytics cannot grant or restore authority;
- **policy/compliance:** privacy, correlation, assurance and offline horizons remain policy-qualified;
- **data/consistency:** alias/subject/account reassignment and telemetry joins require mapping lineage;
- **provider/integration:** provider label equality is insufficient for federation-semantic substitutability;
- **version/migration/coexistence:** old/new issuer, mapping, key and session cohorts remain explicit until dispositioned;
- **exception/compensation/recovery:** recovery of access cannot silently restore withdrawn Role/Station/tenant authority;
- **human-procedure/instruction:** contradictory recovery/linking instructions are signals requiring bounded reconciliation, not automatic truth;
- **cross-process:** downstream actions preserve the identity/authority evidence cut actually consumed;
- **objective/optimization:** SSO availability, fleet visibility, cost and low friction cannot silently outrank identity correctness, isolation or SoD;
- **AI/low-code composition:** AI cannot strengthen identity/telemetry evidence into canonical identity or authority.

No unowned material conflict family emerged. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

## 6. Mandatory cluster — Identity × Authorization × Station × AGWS × AI

The remaining Full Pass 5 mandatory cluster was explicitly exercised N-wise.

Primary falsification target: every component independently validates a current-looking artifact, but the combined subject/authorization/Station/work-surface/AI action depends on revisions that never formed one qualified authority cut. This remains covered by authentication-currentness, revision-vector, presentation-authority, semantic ownership and AI authority-non-amplification patterns.

The cluster streak was already at the saturation threshold of 2; this pass preserves it at **2**, without artificial inflation.

## 7. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new preventive invariants: **0**;
- Identity / Authentication / Federation no-material streak: **2 (preserved; already satisfied)**;
- `Identity × Authorization × Station × AGWS × AI` no-material streak: **2 (preserved; explicitly exercised in Full Pass 5)**;
- material edge scenario inventory: **284**;
- reusable ConflictPattern inventory: **119**;
- combined material findings: **403**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 5 capability coverage after this revisit: **16/28**;
- Full Pass 5 mandatory-cluster coverage after this revisit: **12/12**;
- completed full passes: **4/8 minimum**;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

## 8. Future remediation route vocabulary retained

Research does not remediate these hypotheses. Existing future dispositions remain sufficient: require qualified namespace/mapping evidence; re-evaluate authority/currentness at consequential actuation; retain and drain residual provider/session cohorts; require human reconciliation for ambiguous identity linking/recovery; preserve local evidence during Fleet outages; treat sampled/stale Fleet observations as analytical signals only; prohibit telemetry-derived authority amplification unless a later proof obligation establishes an explicit governed policy path.

## 9. Next rotation candidate

Continue Full Pass 5 with **Authorization / Policy / Organization / Multitenancy**. Challenge allow/deny/inheritance, Enterprise/Station/Role/Person intersections, stale membership/delegation/SoD, grant/revoke/use races, tenant isolation under shared infrastructure, long-running authority revisions, break-glass, external-group evidence, `ABSENT/null/default`, `PARTIAL/UNKNOWN`, residual/offline authorization, pathological policy graphs/resource pressure, contradictory human procedures, objective conflicts, Fleet-derived placement/risk signals and AI/low-code compositions that widen authority. Preserve Fleet as non-authoritative read/analysis plane by default and do not enter Planning C.
