# Generation 2 — Secrets / Configuration / Environment Portability Adversarial Edge-Case Register

Status: FULL PASS 1 — MATERIAL FINDINGS / LOCAL STREAK 0 / CLUSTER STREAK 0
Capability: Secrets / Configuration / Environment Portability
Paired cluster: Secrets/Config × Runtime × Provider substitution
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: catalogue/classify/proof obligations only. No target architecture, implementation task, Work Package or remediation is authorized here. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; provider-native key/secret IDs remain realization evidence, not canonical identity. Preserve `Enterprise → Station → Role → Person` and AI/AGWS non-amplification.

## Evidence anchors

- Planning B established a useful current-state foundation: `EnvironmentProfile` distinguishes `config` from `secret-reference`, `SecretResolver` is provider-neutral, resolution fails closed for missing/empty/malformed references, resolved material is injected ephemerally into runtime, and durable evidence avoids storing secret values. Current-state gaps include first-class revision/currentness, rotation/revocation, consumer-effective adoption, residual generations and governed provider substitution.
- HashiCorp Vault documents leased dynamic secrets with TTL, renewability and revocation. Expiry or revocation invalidates the secret; consumers must renew or replace credentials. Vault also warns that force-removing a lease can leave Vault out of sync with the target secret engine, proving control-plane record mutation is not automatically target convergence. https://developer.hashicorp.com/vault/docs/concepts/lease and https://developer.hashicorp.com/vault/docs/commands/lease/revoke
- Vault Agent/Proxy cache documentation explicitly notes stale cache entries can remain when revocation happens outside the proxy/agent observation path, supporting separate provider-currentness and consumer-cache-currentness evidence. https://developer.hashicorp.com/vault/docs/agent-and-proxy/proxy/caching
- AWS Secrets Manager uses staged secret versions (`AWSPENDING`, `AWSCURRENT`, `AWSPREVIOUS`) during rotation, and custom rotation tests the pending version before moving `AWSCURRENT`. This demonstrates rotation is a multi-step lifecycle rather than an atomic name-to-value overwrite. https://docs.aws.amazon.com/secretsmanager/latest/userguide/whats-in-a-secret.html and https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_lambda-functions.html
- Kubernetes documents that Secret and ConfigMap values consumed through environment variables are not updated in already-running containers; restart/rollout is required. Mounted values can also have propagation delay, and `subPath` mounts do not receive updates. Therefore provider/config source update does not prove runtime consumer adoption. https://kubernetes.io/docs/tasks/inject-data-application/distribute-credentials-secure/ and https://v1-36.docs.kubernetes.io/docs/concepts/configuration/configmap/
- Google Secret Manager delayed destruction can place a version into disabled/scheduled-for-destruction state before final destruction, reinforcing that disable/destroy/recover semantics and current eligibility are distinct lifecycle claims. https://docs.cloud.google.com/secret-manager/docs/destroy-secret-version

These representatives are used only for portable semantic evidence; their product-specific mechanisms are not promoted to universal architecture.

## Local material scenarios

### G2-EDGE-SECRETS-001 — symbolic reference, resolved value and provider-native identifier are conflated
- Preconditions / activation: a `secret://...` reference, plaintext value, provider ARN/path/version ID or environment variable name crosses import/UI/automation/provider boundaries without typed distinction.
- Incompatible claims/actions/states: the reference is durable intent, the resolved material is sensitive realization, and the provider-native identifier names a provider object/version; each is locally valid but they are not interchangeable canonical identities.
- Expected safe behavior: preserve typed separation of canonical logical reference, provider realization reference/version and resolved material; ambiguous imports stay `INCONCLUSIVE` pending governed mapping.
- Forbidden behavior: persist resolved value where only a reference belongs; adopt provider key/ARN/version as canonical identity by convenience; display/log/re-export secret material because metadata/reference handling is permitted.
- Owner(s): Secrets / Configuration / Environment Portability; Provider/Binding for provider IDs; Authorization/Governance for reveal/use authority.
- Effect/failure disposition: missing relation or type ambiguity → `INCONCLUSIVE`; value exposure → security incident signal, never semantic success.
- Evidence/currentness: canonical binding/reference, provider binding revision, provider object/version reference, resolution event, materialization target and authority context.
- Recovery/reconciliation: stop propagation, re-resolve typed mapping, rotate/revoke exposed material when a concrete exposure is confirmed, preserve lineage.
- Blast radius: record/runtime → system/external provider. Severity: CRITICAL. Confidence: strongly supported. Detectability: static/pre-execution/runtime/audit. Reversibility: potentially difficult after exposure. Time-to-harm: immediate/latent. Misuse likelihood: plausible accidental; adversarial likely where low-code/export paths exist. False-positive risk: low for typed boundary violations.
- Proof obligation: `SECRETS-ADV-PROOF-001` — reference, provider identity and material value cannot silently substitute for one another or expand reveal authority.

### G2-EDGE-SECRETS-002 — source secret/config revision is current while runtime consumer remains on stale or revoked material
- Preconditions / activation: provider/source rotates, disables, revokes or updates a secret/config while an already-running runtime holds the prior value in environment variables, process memory, mounted subPath, local cache or another non-refreshing realization.
- Incompatible claims/actions/states: source/provider state says revision N+1 is current or N is revoked, while runtime instance remains locally healthy using N.
- Expected safe behavior: source-currentness, resolved/materialized generation and consumer-effective generation remain distinct; stale/expired/revoked consumption becomes `INCONCLUSIVE/DEGRADED/DENY` according to owner policy rather than implicit success.
- Forbidden behavior: provider rotation timestamp proves all consumers adopted it; healthy runtime proves current credential validity; old material is silently trusted beyond bounded currentness.
- Owner(s): Secrets/Config + Deployment/Runtime + Security + Provider/Binding.
- Effect/failure disposition: known stale generation → `PARTIAL` convergence; uncertain adoption/currentness → `INCONCLUSIVE`; confirmed revoked material used for new privileged actuation → deny/fail according to policy.
- Evidence/currentness: source revision/version/lease state, runtime instance identity, materialization generation, reload/restart evidence, observed consumer generation and qualification timestamp.
- Recovery/reconciliation: inventory consumers, re-materialize/restart/reload under owner semantics, verify current generation adoption, fence/drain stale cohorts.
- Blast radius: runtime instance → Station/system/provider resources. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-execution/runtime/audit. Reversibility: bounded if detected before unauthorized effects. Time-to-harm: immediate. Misuse likelihood: likely operationally. False-positive risk: medium where dual-valid overlap is intentionally allowed.
- Proof obligation: `SECRETS-ADV-PROOF-002` — provider/source currentness cannot be promoted to consumer-effective currentness without qualified adoption evidence.

### G2-EDGE-SECRETS-003 — concurrent rotation/restart creates mixed credential/config epochs across authoritative runtime instances
- Preconditions / activation: rolling deployment/restart overlaps secret rotation, config revision adoption, provider failover or autoscaling; instances start at different times and bind different generations.
- Incompatible claims/actions/states: every instance is individually valid under a generation that may still be accepted locally, but the fleet composes incompatible protocol/schema/credential/config assumptions.
- Expected safe behavior: mixed epoch is explicit and bounded; compatibility/coexistence must be qualified before traffic/work is distributed across generations.
- Forbidden behavior: all healthy replicas are assumed semantically equivalent; load balancer health hides generation incompatibility; rollback picks any historical config/secret because it once worked.
- Owner(s): Deployment/Runtime + Secrets/Config + Lifecycle + affected semantic owner.
- Effect/failure disposition: known mixed compatible cohort → qualified coexistence; unknown compatibility → `INCONCLUSIVE/PARTIAL`; incompatible cohort → block/fence according to owner semantics.
- Evidence/currentness: runtime generation, environment/config/secret revision vector, compatibility profile, provider binding and request/effect lineage.
- Recovery/reconciliation: converge or intentionally pin cohorts, requalify compatibility, drain incompatible instances before declaring rollout complete.
- Blast radius: request/instance → system. Severity: HIGH–CRITICAL. Confidence: strongly supported. Detectability: rollout/runtime/audit. Reversibility: usually bounded. Time-to-harm: immediate/cumulative. Misuse likelihood: likely in rolling updates. False-positive risk: medium because dual-generation operation may be intentionally compatible.
- Proof obligation: `SECRETS-ADV-PROOF-003` — runtime health cannot mask unqualified mixed secret/config epochs.

### G2-EDGE-SECRETS-004 — rotation/revocation/provider mutation effect is `UNKNOWN` and blind retry strengthens ambiguity
- Preconditions / activation: remote rotate/revoke/create/update request times out, asynchronous provider operation is queued, control-plane acknowledgement is lost, or provider-side failure leaves effect uncertain.
- Incompatible claims/actions/states: caller cannot distinguish `APPLIED`, `NOT_APPLIED`, `PARTIAL` or `UNKNOWN`, while retry may create a second version/credential, advance staging twice, revoke the wrong generation or break overlap assumptions.
- Expected safe behavior: ambiguous mutating effect stays `UNKNOWN`; reconcile provider/version/lease state before retry unless operation-specific idempotency scope and horizon are qualified.
- Forbidden behavior: timeout means `NOT_APPLIED`; repeated rotate/revoke is assumed harmless; control-plane record deletion is treated as proof target credential invalidation.
- Owner(s): Secrets/Config + Provider/Binding + Integration/Security where external credentials are actuated.
- Effect/failure disposition: exact `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN`; `UNKNOWN → reconcile-before-retry`.
- Evidence/currentness: operation attempt/idempotency key, provider binding/version, target secret/version/lease state, downstream credential validity evidence and observation time.
- Recovery/reconciliation: query provider and target state, correlate versions/leases, fence duplicate generations, retry only under qualified semantics.
- Blast radius: credential/object → system/external resource. Severity: CRITICAL. Confidence: strongly supported. Detectability: runtime/post-effect. Reversibility: provider dependent. Time-to-harm: immediate. Misuse likelihood: plausible/likely under network failure. False-positive risk: low where effect truly cannot be proven.
- Proof obligation: `SECRETS-ADV-PROOF-004` — ambiguous rotation/revocation cannot be coerced to failure or success and cannot trigger unsafe retry.

### G2-EDGE-SECRETS-005 — recovery/rollback revives historically valid but currently revoked, expired or incompatible secret/config state
- Preconditions / activation: deployment/data/runtime rollback, disaster restore or offline bootstrap restores an earlier environment profile, secret reference, cached credential, config file or provider binding.
- Incompatible claims/actions/states: historical state is byte-for-byte recoverable and was once valid, while current authority/trust/provider/schema/policy state may reject it.
- Expected safe behavior: recoverability is distinct from current eligibility; restored secret/config dependencies are requalified against current authorization, trust, lifecycle, provider support and runtime compatibility before becoming effective.
- Forbidden behavior: historical snapshot means safe rollback; restored old credentials bypass current revocation; recovery reintroduces a withdrawn provider path without detection.
- Owner(s): Security/Recovery + Secrets/Config + Lifecycle + Authorization/Trust + Provider/Binding.
- Effect/failure disposition: restored but not requalified → `PARTIAL/INCONCLUSIVE`; currently forbidden generation → deny/fence.
- Evidence/currentness: restore source revision, current policy/authority/trust, secret/version state, provider binding, runtime compatibility and post-restore adoption evidence.
- Recovery/reconciliation: restore into bounded state, requalify, rotate/rebind as needed, then promote only after current eligibility proof.
- Blast radius: runtime → enterprise/external systems. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-recovery/post-effect. Reversibility: potentially difficult after revived credential use. Time-to-harm: immediate. Misuse likelihood: plausible during incident recovery. False-positive risk: low when current revocation/incompatibility evidence exists.
- Proof obligation: `SECRETS-ADV-PROOF-005` — historical availability cannot imply current secret/config rollback eligibility.

### G2-EDGE-SECRETS-006 — valid but pathological configuration/secret composition exhausts runtime resources or leaks authority through AI/low-code surfaces
- Preconditions / activation: extremely large environment/config payload, thousands of bindings, recursive/interpolated references, repeated provider lookups, high-cardinality secret mounts, or AI/low-code composition exports/logs/reuses values across scopes.
- Incompatible claims/actions/states: each binding or transformation may be locally valid while aggregate size/dependency/provider load exceeds bounded runtime capacity or crosses reveal/use authority boundaries.
- Expected safe behavior: resource and authority bounds remain explicit; exhaustion becomes bounded failure/degradation without fallback to plaintext persistence, skipped validation or wider authority; AI/AGWS may manipulate references only within effective authority and must not reveal/materialize values absent explicit permission.
- Forbidden behavior: truncate/skip validation silently; dump environment for diagnostics; AI converts references to literal secret values; personal automation republishes secrets to team/system scope; capacity pressure disables redaction/currentness checks.
- Owner(s): Secrets/Config + Runtime/Operations + Authorization + AGWS/AI + FinOps for external lookup/cost pressure.
- Effect/failure disposition: bounded rejection may be `NOT_APPLIED`; partial materialization stays `PARTIAL`; authority/currentness ambiguity stays `INCONCLUSIVE`.
- Evidence/currentness: binding count/size/dependency graph, provider quota/currentness, runtime limits, effective authority scope, redaction/exposure audit evidence.
- Recovery/reconciliation: reject/throttle/batch, clear partial materialization, rotate confirmed exposed values, require owner-qualified redesign for pathological composition.
- Blast radius: instance → enterprise/external parties. Severity: CRITICAL. Confidence: supported. Detectability: static/pre-execution/runtime/audit. Reversibility: resource effects bounded; exposure may be difficult. Time-to-harm: immediate/cumulative. Misuse likelihood: likely accidental and plausible adversarial. False-positive risk: medium for large but intentionally bounded deployments.
- Proof obligation: `SECRETS-ADV-PROOF-006` — scale pressure or AI/low-code composition cannot weaken secret/config authority, redaction, typing or currentness semantics.

## Cross-capability material scenarios — Secrets/Config × Runtime × Provider substitution

### G2-XEDGE-SECRETS-RUNTIME-PROVIDER-001 — provider rotation is complete while consumer-effective adoption is only partial
- Activation: provider marks a new secret version current or revokes the old version while runtime instances consume values through env/process cache/mounts with differing refresh semantics.
- Incompatible claims: provider lifecycle is locally complete; runtime fleet lifecycle is not necessarily converged.
- Safe behavior: provider-current, materialized and consumer-effective generations remain separately evidenced; convergence stays `PARTIAL/INCONCLUSIVE` until authoritative consumers are qualified.
- Forbidden behavior: provider `current` label or successful rotation equals fleet-wide adoption.
- Owners: Secrets/Config + Runtime + Provider/Binding + Security.
- Effect/failure disposition: provider mutation `APPLIED` with fleet adoption `PARTIAL/INCONCLUSIVE` is valid and must not be collapsed.
- Evidence/currentness: provider version/stage/lease, runtime cohort generation, refresh mechanism, restart/reload observations and bounded currentness horizon.
- Recovery/reconciliation: inventory/reload/restart/drain consumers, verify effective generation and revoke/fence old generation under owner semantics.
- Blast radius: instance → system. Severity: CRITICAL. Confidence: strongly supported. Detectability: runtime/audit. Reversibility: bounded before external misuse. Time-to-harm: immediate. Misuse likelihood: likely. False-positive risk: medium for intentional overlap windows.
- Proof: `XSECRETS-ADV-PROOF-001`.

### G2-XEDGE-SECRETS-RUNTIME-PROVIDER-002 — provider substitution leaves old credentials/config paths materially usable after nominal cutover
- Activation: new secret/config provider or environment binding becomes active while old credentials, files, mounted paths, caches, service accounts, API keys or resolver endpoints still work.
- Incompatible claims: canonical binding says provider B is active; old provider A remains capable of authenticating, serving stale config or accepting privileged mutation.
- Safe behavior: provider IDs remain non-canonical; cutover is `PARTIAL/INCONCLUSIVE` until residual old-provider credential/config cohorts are fenced, drained or explicitly dispositioned.
- Forbidden behavior: changing binding/reference pointer proves substitution complete; old path is ignored because no new workload is intended to use it.
- Owners: Provider/Binding + Secrets/Config + Runtime + Security/Lifecycle.
- Effect/failure disposition: nominal binding `APPLIED`; residual authority present → substitution `PARTIAL/INCONCLUSIVE`.
- Evidence/currentness: old/new provider bindings, credential/version inventory, runtime resolver paths, access/audit evidence and old-provider revocation/fencing status.
- Recovery/reconciliation: reconcile residual use, disable/fence old provider paths, rotate dependent credentials, verify target-provider consumer-effective state.
- Blast radius: Station/system → external resources. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-cutover/runtime/audit. Reversibility: potentially difficult after unauthorized old-path use. Time-to-harm: immediate/latent. Misuse likelihood: plausible/likely during migration. False-positive risk: low when old path remains demonstrably usable.
- Proof: `XSECRETS-ADV-PROOF-002`.

### G2-XEDGE-SECRETS-RUNTIME-PROVIDER-003 — offline/disconnected runtime exceeds currentness horizon but remains locally healthy
- Activation: runtime loses access to secret/config provider or trust/renewal path and continues using cached/local material beyond its qualified lease/currentness/refresh horizon.
- Incompatible claims: autonomous runtime is locally available; secret/config evidence is stale or no longer provably authorized/current.
- Safe behavior: disconnected operation is governed by explicit bounded currentness/lease semantics per dependency; beyond the bound status degrades/denies sensitive operations rather than silently extending trust.
- Forbidden behavior: runtime autonomy means indefinite credential validity; provider outage automatically authorizes stale secret reuse; reconnect blindly overwrites newer state.
- Owners: Secrets/Config + Runtime + Security/Trust + Provider/Binding.
- Effect/failure disposition: currentness unknown/stale → `INCONCLUSIVE/DEGRADED/DENY` according to policy; reconnect mutations with ambiguous effects reconcile first.
- Evidence/currentness: last qualified retrieval/renewal, lease/expiry, provider reachability, offline policy horizon, runtime operation sensitivity and reconnect state.
- Recovery/reconciliation: reconnect, requalify current generation/authority, reconcile provider/runtime revisions, rotate/fence stale material if needed.
- Blast radius: instance → external systems. Severity: HIGH–CRITICAL. Confidence: strongly supported. Detectability: runtime. Reversibility: workload dependent. Time-to-harm: delayed then immediate. Misuse likelihood: plausible. False-positive risk: medium because bounded offline operation can be intentionally authorized.
- Proof: `XSECRETS-ADV-PROOF-003`.

### G2-XEDGE-SECRETS-RUNTIME-PROVIDER-004 — provider-native secret/key/version identity becomes canonical binding identity and breaks portable substitution
- Activation: provider ARN/path/key ID/version ID is persisted in business/process truth or used as stable identity across environments/providers.
- Incompatible claims: provider-native identifier is valid realization identity; canonical secret/config intent must survive provider/environment substitution without semantic identity drift.
- Safe behavior: provider IDs remain typed non-canonical realization references unless explicitly adopted through a governed semantic owner process.
- Forbidden behavior: migration requires rewriting business/process identity solely because provider object ID changes; accidental string equality collapses distinct provider objects; provider ID grants reveal/use authority.
- Owners: Secrets/Config + Provider/Binding + Standards/Interoperability; Authorization for use/reveal decisions.
- Effect/failure disposition: unqualified mapping → `INCONCLUSIVE`; conflicting mapping → explicit conflict signal, not implicit adoption.
- Evidence/currentness: canonical reference identity, provider binding/revision, provider object/version ID and mapping/adoption lineage.
- Recovery/reconciliation: reconstruct mapping from canonical intent, preserve old realization lineage, rebind under qualified provider support.
- Blast radius: binding → system/migration. Severity: HIGH–CRITICAL. Confidence: strongly supported. Detectability: static/import/migration. Reversibility: migration dependent. Time-to-harm: latent/cutover. Misuse likelihood: likely as convenience coupling. False-positive risk: low where canonical adoption is absent.
- Proof: `XSECRETS-ADV-PROOF-004`.

## Processual / semantic conflict patterns

All patterns below remain `ELICITED_PATTERN` with disposition `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. They are not asserted current defects.

### G2-CONFLICT-PATTERN-CURRENTNESS-001 — provider/source currentness versus consumer-effective generation divergence
- Family / scope: temporal + version/coexistence + security; cross-capability.
- Narrative: source/provider truth correctly marks generation N+1 current or N revoked while runtime correctly reports itself healthy using materialized N. Both local claims can be true, but their composition can violate current credential/config requirements.
- Activation conditions: asynchronous refresh/restart, env snapshot, stale cache/mount, lease expiry/revocation, rolling deployment or provider substitution.
- Incompatible claims/actions/states: `provider/source current` versus `runtime consumer-effective generation`; optionally old generation still accepted by some downstreams.
- Why local validation misses it: provider validates its lifecycle; runtime health validates process availability; neither alone proves cross-owner generation convergence.
- Detection candidates: runtime cohort generation inventory; lease/version/currentness comparison; rollout/reload evidence; residual stale-consumer signals.
- Owner(s): Secrets/Config + Runtime + Provider/Binding + Security/Lifecycle.
- Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-execution/runtime/audit. Blast radius: instance → system. Reversibility: bounded migration/rotation unless stale credential causes external effect. Time-to-harm: immediate/latent. Misuse likelihood: likely accidental. Evidence currentness: must include provider/source state and consumer observation from compatible time window. False-positive risk: medium under explicitly qualified overlap windows.
- Future remediation disposition: require currentness/adoption reconciliation; fence or drain stale cohorts when concrete activation is confirmed; allow explicit bounded coexistence where owner policy proves compatibility.
- Proof candidate: `SECRETS-CONFLICT-PROOF-001` — locally valid provider/source and runtime generation claims cannot silently compose into false convergence.

### G2-CONFLICT-PATTERN-SECRET-BOUNDARY-001 — reference/value/provider-identity semantic boundary collapse
- Family / scope: semantic ownership + security + provider; local/cross-capability.
- Narrative: a secret reference, resolved value and provider object/version identifier are each legitimate artifacts but composition layers treat them as interchangeable strings, causing identity drift, persistence/exposure or lock-in.
- Activation conditions: generic key-value UI, import/export, templating/interpolation, logging, AI/low-code composition, provider adapters or environment serialization without typed semantics.
- Incompatible claims/actions/states: durable intent identity, sensitive material value and provider realization identity are assigned the same semantic role.
- Why local validation misses it: each subsystem may validate string format/access independently while cross-layer semantic typing is lost.
- Detection candidates: typed-flow/static analysis; durable-artifact scans for resolved values; provider-ID-to-canonical-reference mapping checks; redaction/exposure audit.
- Owner(s): Secrets/Config + Provider/Binding + Authorization/Governance; AGWS/AI when composition is involved.
- Severity: HIGH–CRITICAL. Confidence: strongly supported. Detectability: static/pre-execution/runtime/audit. Blast radius: record → enterprise/external provider. Reversibility: exposure may require rotation and can be difficult. Time-to-harm: immediate/latent. Misuse likelihood: plausible accidental/adversarial. Evidence currentness: current serialization/binding/authority evidence. False-positive risk: low when typed contract explicitly declares a literal non-secret value.
- Future remediation disposition: classify and block/route concrete typed-boundary violations; rotate confirmed exposed material; preserve provider IDs as non-canonical unless explicit adoption is proven.
- Proof candidate: `SECRETS-CONFLICT-PROOF-002` — typed secret/config intent cannot collapse into value/provider identity through generic composition.

### G2-CONFLICT-PATTERN-AUTHORITY-002 — reveal, rotate, bind and deploy privileges compose into separation-of-duty bypass
- Family / scope: authority/responsibility/separation-of-duty + human procedure + AI/low-code; Station/system.
- Narrative: actors/automations each hold individually legitimate privileges (for example bind a reference, deploy a runtime, rotate a secret, inspect diagnostics), but their composition can reveal secret material, self-approve a privileged change or redirect workloads to attacker-controlled/config-incompatible material.
- Activation conditions: overlapping delegated roles, stale Role/Station context, low-code automation chaining, emergency override, AI action proposal, provider-admin credentials or deployment privilege combined with secret-binding control.
- Incompatible claims/actions/states: each action is locally authorized; combined sequence violates superior separation-of-duty or non-reveal intent.
- Why local validation misses it: per-action authorization does not prove composition-level policy compatibility.
- Detection candidates: authority/action dependency graph; SoD policy intersection; commit-time `Enterprise → Station → Role → Person` re-evaluation; audit correlation across bind/rotate/deploy/reveal operations.
- Owner(s): Authorization/Organization + Secrets/Config + Deployment/Runtime + Governance; AGWS/AI for proposal/materialization paths.
- Severity: CRITICAL. Confidence: supported. Detectability: static/pre-execution/audit. Blast radius: Station → enterprise/external systems. Reversibility: potentially difficult after exposure/privileged external effects. Time-to-harm: immediate. Misuse likelihood: plausible accidental and adversarial. Evidence currentness: current role/station/policy plus action-chain evidence. False-positive risk: medium because emergency/admin break-glass flows may intentionally aggregate powers under explicit higher-order control.
- Future remediation disposition: require explicit SoD/current-authority assessment for a concrete composition; route exceptions through superior governance rather than arbitrary action ordering.
- Proof candidate: `SECRETS-CONFLICT-PROOF-003` — individually authorized secret/config/runtime actions cannot imply composition-level authorization.

Existing `G2-CONFLICT-PATTERN-MIGRATION-001`, `G2-CONFLICT-PATTERN-RECOVERY-001`, `G2-CONFLICT-PATTERN-SUPPORT-001` and `G2-CONFLICT-PATTERN-AI-LOWCODE-001` also apply and are reused rather than duplicated.

## Research disposition and saturation

- Local material edge scenarios: **6**.
- Cross-capability material scenarios: **4**.
- Newly catalogued materially distinct conflict patterns: **3**.
- Reused conflict patterns: migration, recovery, provider-support and AI/low-code composition.
- HIGH/CRITICAL scenarios without owner/proof: **0**.
- Local no-material streak: **0** because this visit found material scenarios.
- Cluster no-material streak: **0** because this visit found material interactions/conflicts.
- Full Pass 1 is not complete and no saturation claim is made.

No architecture implementation is prescribed. The findings only establish future proof/detection/remediation routes when concrete activation conditions or later architecture obligations justify them.
