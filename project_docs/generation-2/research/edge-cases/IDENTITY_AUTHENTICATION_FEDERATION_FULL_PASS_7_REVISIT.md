# Generation 2 — Identity / Authentication / Federation — Full Pass 7 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Identity / Authentication / Federation
Pass: 7
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md`, `PHYSICAL_PERIPHERAL_OPERATIONS_INTEGRATION_PLANE_BOUNDARY.md`.

Research only. No product code, Work Package, TASK, Construction, implementation guard or remediation is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `external provider state != canonical authority != physical truth`, and default disposition `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Pass-7 technique rotation

This revisit intentionally changes technique from Pass 6:

1. **namespace/product-space mutation** — permute `{client, site, provider, issuer, provisioning-domain, external account/resource id, canonical subject}` and test collisions/reuse;
2. **negative-inventory falsification** — test pagination/filter/checkpoint gaps where `not observed` is silently strengthened to `not present/revoked`;
3. **desired/accepted/effective identity lifecycle cuts** — separate enrollment/provisioning/deprovision request, provider acceptance, external effective state, residual session/token/grant state and later observation;
4. **provider capability/profile mutation** — remove or alter support for filter, PATCH, deactivation, groups, session revocation, pairwise subject semantics or biometric/reference lifecycle without changing the generic provider label;
5. **late-evidence replay** — reconnect after outage with delayed/duplicated account, grant, login and deprovision events and test whether Fleet rewrites current canonical identity;
6. **site-boundary aliasing** — reuse userName/email/external resource labels across sites/tenants and test accidental correlation or authorization transfer;
7. **queue-class differential analysis** — distinguish provisioning, deprovisioning/revoke, inventory, event ingestion and telemetry queues so aggregate connector health cannot hide security-currentness debt;
8. **AI/low-code claim-strength mutation** — test generated mappings/automations that infer canonical identity, grant ownership or actuation authority from display attributes or provider visibility;
9. **causal non-strengthening** — provider change, login failure, revoke lag and sync drift may correlate, but Fleet co-movement remains hypothesis only;
10. **duplicate-screen** against all 124 authoritative reusable ConflictPatterns before admitting novelty.

## 2. Fresh comparative evidence

External standards reinforce existing families rather than creating a 125th reusable ConflictPattern:

- **SCIM RFC 7643** defines provider-assigned `id` as stable and non-reassignable within the service provider; `externalId` is client-assigned, scoped to the provisioning domain, and its uniqueness is controlled by that client. Bare external identifiers therefore do not establish cross-provider/client/site canonical identity.
- **SCIM RFC 7644** list responses can be partial because of pagination and expose `totalResults`, `startIndex` and `itemsPerPage`. A successful page fetch is not proof of complete external inventory, and absence from one page is not a deprovision/currentness proof.
- **OpenID Connect Core 1.0** defines the stable RP subject key as `(iss, sub)` and explicitly states that email, phone, preferred username and name are not stable unique identifiers. This supports issuer-qualified identity and blocks display-attribute correlation as canonical proof.

Representative sources:
- https://www.rfc-editor.org/info/rfc7643/
- https://www.rfc-editor.org/info/rfc7644/
- https://openid.net/specs/openid-connect-core-1_0.html

These are comparative witnesses only; they do not decide Planning C.

## 3. Autonomous Builds × Fleet Observability/Capacity

Candidate lineage remains `HIPÓTESE DE ARQUITETURA / EM PESQUISA`:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`.

For identity integrations, an observation/reconciliation cut may additionally need qualified references such as `{client/site, provider/issuer, provider profile/version, provider resource id, provisioning-domain externalId, canonical subject mapping revision, requested/accepted/effective state, observed-at/source-time, completeness/currentness, residual session/grant cohort}`. This is vocabulary for research, not a committed schema.

Preserve:

`semantic topology != build topology != deployment topology != runtime truth != local evidence != exported telemetry != Fleet aggregate != control authority`.

Also:

- `external provider state != canonical authority != physical truth`;
- `provider id != canonical subject`;
- `email/userName/displayName != stable identity proof`;
- `provision request accepted != provider effect converged`;
- `account disabled != all sessions/tokens/grants revoked`;
- `successful sync != complete inventory != current external state`;
- `Fleet visibility != remote actuation authority`.

A correctly configured autonomous client runtime must continue without SB/Observe/Fleet. Export/sync failure changes evidence currentness/completeness; it does not itself block local execution unless an owned local policy requires current upstream evidence for the specific action.

## 4. Queue / flow / capacity mathematics

Identity integration is modeled as multiple queue classes, not one utilization scalar:

`canonical lifecycle change -> connector admission -> provider API -> provider processing -> external query/event observation -> reconciliation -> local evidence/export -> Fleet projection`.

Relevant classes include enrollment/provisioning, deprovision/revoke, directory inventory, session/security events and ordinary telemetry. A connector can show low average utilization while high-priority revoke work violates its currentness deadline because of rate limits, retries, burstiness, pagination, slow tails or priority inversion.

Preserve:

`observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`.

Little's Law and M/M/1-like models remain conditional analytical models. They do not prove revoke convergence, inventory completeness, identity currentness or security safety under non-stationary/bursty/finite-buffer/provider-limited regimes.

## 5. Adversarial candidate screen

| Candidate | Activation / incompatible claims | Detection candidate | Owners | Assessment / disposition |
| --- | --- | --- | --- | --- |
| provider-local account/resource ID is reused or correlated across sites/tenants | bare provider ID, email or userName appears equal while issuer/provisioning-domain/site differs; `same external label -> same canonical subject` | namespace-qualified key, mapping-revision collision audit, provider/issuer/site provenance | Identity + Provider/Binding + client/site owner | CRITICAL, strongly supported, static/pre-execution/runtime, cross-tenant/site blast radius, migration/reconciliation reversibility, immediate harm, plausible/adversarial misuse, currentness must be explicit, medium false-positive risk for explicitly shared identities; **duplicate** of `IDENTITY-MAPPING-001` + cross-tenant/entity-resolution families |
| SCIM/provider pagination omission becomes deprovision proof | inventory page/filter/checkpoint is incomplete; `not observed -> absent/revoked` | total/page/checkpoint completeness, unsupported-filter qualification, repeated reconciliation/gap audit | Identity + Integration + Provider/Binding | HIGH–CRITICAL, strongly supported, runtime/audit, site/system blast radius, bounded reconciliation, cumulative/immediate harm, accidental misuse, evidence incomplete, medium false positives under concurrent mutation; **duplicate** of evidence presence/currentness + provider qualification |
| revoke/deprovision backlog is hidden by healthy aggregate connector | deprovision queue tail exceeds policy horizon while ordinary sync succeeds; `connector healthy -> access lifecycle converged` | per-class oldest-age, residual session/grant inventory, request/effective correlation | Identity + Authorization + Integration/Provider | CRITICAL, supported, runtime/audit, system blast radius, bounded revocation/reconciliation, immediate/delayed harm, plausible misuse, stale/incomplete evidence, medium false positives for explicitly tolerated bounded windows; **duplicate** of `AUTHENTICATION-CURRENTNESS-001`, federation coexistence and resource/capacity families |
| provider accepts account disable but active token/session survives | provider account state and session/token state have different lifecycle semantics; `disabled -> no usable authentication` | provider capability/profile, session/token inventory where supported, local currentness horizon, requalification | Identity + Provider/Binding + Authorization | CRITICAL, strongly supported, pre-execution/runtime/audit, system blast radius, bounded revocation but possibly post-effect compensation, immediate harm, likely misuse, evidence may be partial, low false-positive risk where provider explicitly documents session independence; **duplicate** of currentness/coexistence/residual-cohort patterns |
| provider substitution preserves OIDC/SCIM label but changes subject, deprovision, group or session semantics | same protocol label under different provider profile/version; `protocol support -> semantic substitutability` | capability vector/profile/version qualification, differential contract tests, residual cohort inventory | Identity + Provider/Binding + Standards | CRITICAL, strongly supported, design/pre-execution/runtime, enterprise blast radius, migration required, immediate/latent harm, plausible misuse, current evidence required, low false positives when dimensions explicitly qualified; **duplicate** of provider semantic mismatch + `FEDERATION-COEXISTENCE-001` |
| AI/low-code links a biometric/reference/provider account to canonical identity by display metadata or site coincidence | syntactically valid generated correlation but weak evidence/authority; `likely match -> canonical merge/adoption` | provenance/confidence, owner/authority gate, namespace/identity proof, human reconciliation for ambiguity | Identity + Authorization + AGWS/AI | CRITICAL, supported, design/pre-execution, enterprise blast radius, potentially migration/incident response, immediate harm, plausible/adversarial misuse, evidence often incomplete, high false-positive risk for heuristics; **duplicate** of `IDENTITY-MAPPING-001` + `RECOVERY-IDENTITY-AUTHORITY-001` + AI composition families |
| Fleet sees provider account/device/resource and inferred access path becomes central physical-control authority | integration visibility/resource ownership is misread as permission to actuate specialized system/device | operation-class contract, explicit client/site authority, provider scope and specialized-system ownership | Authorization + Integration + Provider/Binding + external-system owner | CRITICAL, strongly supported, design/pre-execution, site/external-party blast radius, potentially irreversible physical effect, immediate harm, plausible/adversarial misuse, current evidence required, low false-positive risk; **duplicate** of authority non-amplification + provider mismatch; physical boundary remains integration-plane only |
| correlated connector outage and permission drift is treated as causal proof and triggers provider/authority changes | shared incident/topology factors; `co-movement -> causal effect -> control authority` | declared causal graph/model, confounders, temporal ordering, uncertainty, independent policy/authority path | Observability analysis owner + Identity/Provider/Authorization | HIGH, supported, pre-execution/audit, system blast radius, reversible before actuation, delayed/immediate harm, accidental misuse, evidence may be stale, high false-positive risk without assumptions; **duplicate** of analytical-kind conflation + authority non-amplification |

No candidate survives duplicate-screen as a new reusable ConflictPattern.

## 6. Temporal / uncertainty coupling

External identity topology is time-qualified across canonical mappings, provider accounts, sessions/tokens, provider profile versions, site bindings and provisioning/deprovision operations. Historical facts must preserve their observed/effective cut; reconnecting late telemetry must not rewrite which identity evidence an earlier invocation actually consumed.

Planned migration, desired account state and forecasted revoke drain time remain distinct from observed effective state. Missing provider events, pagination gaps, unsupported filters and delayed observations increase uncertainty and may force `PARTIAL/UNKNOWN` rather than negative claims.

## 7. Causal / counterfactual boundary

Fleet may generate hypotheses such as provider outage causing authentication failures, a connector rollout reducing provisioning lag, or a site mapping change increasing denied logins. Any future causal inference requires an explicit causal question/model, intervention, confounders, selection/missingness assumptions, temporal ordering, build/provider/site cohort compatibility and uncertainty/sensitivity analysis.

`correlation/Fleet co-movement != causal proof != control authority`.

Even a valid causal estimate cannot merge identities, revoke sessions, change provider binding, grant access or actuate an external physical system without a separately authorized path.

## 8. Processual / semantic conflict classification

All standing families were screened: structural graph, state-transition, semantic ownership, rule/formula/condition, temporal/ordering, resource/capacity, authority/responsibility/SoD, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/recovery, human procedure, cross-process, objective/optimization and AI/low-code.

The strongest composition remains one where every local element is valid: canonical subject mapping is valid in revision A, provider resource is valid in its namespace, deprovision request is accepted, session is cryptographically valid, connector is healthy, and Fleet dashboard is fresh enough for ordinary telemetry — but these facts do not form one current, complete and authority-compatible cut. This is already represented by identity-mapping/currentness/coexistence/evidence/authority families.

`ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

No current product defect is asserted.

## 9. Planning C / D / E handoff candidates

Research-only carry-forward:

- **Planning C:** integration-observability identity model with explicit provider/issuer/provisioning-domain/client/site namespaces; desired/accepted/effective/residual identity lifecycle; currentness/completeness; per-operation queue pressure; no central actuation authority; vector facts preserved before scalarization.
- **Planning D:** provider migration must preserve mapping lineage, provider-profile/version differences, residual sessions/grants/accounts, pagination/checkpoint reconciliation, site/tenant boundaries and offline cohorts.
- **Planning E:** proofs should challenge cross-site identifier reuse, display-attribute correlation, incomplete pagination, unsupported provider scope/filter, stale green sync, deprovision/revoke backlog, residual tokens/sessions, delayed/duplicated events, provider substitution, AI-generated identity merge, Fleet outage and causal overclaim.

These are proof/architecture consequence candidates, not implementation instructions.

## 10. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- new preventive invariants: **0**;
- Identity / Authentication / Federation no-material streak: **2 (preserved; capped, not inflated)**;
- mandatory-cluster streaks: **2 (preserved; all 12 already covered in Full Pass 7)**;
- material edge scenario inventory: **284**;
- reusable ConflictPattern inventory: **124**;
- combined material findings: **408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 7 capability coverage after this revisit: **16/28**;
- completed full passes: **6/8 minimum**;
- target: **12**, no maximum;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

## 11. Next rotation

Continue Full Pass 7 with **Authorization / Policy / Organization / Multitenancy**. Carry Typed Semantic Graph/Federation/Execution-Proof, Autonomous Builds/Fleet, vector/graph/queue-capacity mathematics, temporal/uncertainty, causal non-strengthening, Legacy Mirroring/Brownfield and the bounded Physical/Peripheral integration-plane lens into external grants/roles/groups/site scopes, provisioning/deprovision policy, stale external permission state, cross-tenant/site mapping, provider scope mismatch, break-glass/SoD, admission/fairness, policy propagation queues and AI/low-code authority amplification. Authorization streak is already 2 and must remain capped absent material novelty. Planning C remains blocked.