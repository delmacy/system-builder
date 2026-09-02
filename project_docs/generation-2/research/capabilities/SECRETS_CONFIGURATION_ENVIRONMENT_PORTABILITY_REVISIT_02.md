# Generation 2 Research — Secrets / Configuration / Environment Portability — Revisit 02

Status: REVISIT_CYCLE_3_PASS_COMPLETE / MATERIAL_NEW_FINDINGS / NOT_SATURATED

## Research question

How should System Builder distinguish semantic configuration intent, secret requirements, provider realization, workload authentication and effective runtime state so generated systems remain portable, autonomous, disclosure-safe and governable across cloud, self-hosted and air-gapped environments?

## Representatives and contribution

| Representative | Coverage | Revisit contribution |
|---|---|---|
| HashiCorp Vault Agent / Proxy / leases | DEEP | Dynamic/leased credentials, auto-auth, renewal, local caching/materialization, use without control-plane dependence. |
| AWS Secrets Manager | DEEP | Version/stage identity, asynchronous rotation, pending/current/previous lineage and incomplete-rotation state. |
| External Secrets Operator + Kubernetes Secret/ConfigMap | DEEP | Provider-backed reconciliation, refresh policy, immutable targets, ownership/deletion, workload-identity authentication options. |
| AWS AppConfig | DEEP | Configuration as a validated and independently deployed artifact with progressive rollout, rollback and effective deployed-version semantics. |
| SPIFFE/SPIRE | DEEP | Short-lived workload identity that can authenticate workloads without distributing a long-lived application secret. |
| SOPS | DEEP | Portable encrypted configuration, multi-provider/offline recipients, key-group thresholds, recipient updates and data-key rotation. |
| Kustomize bases/overlays | DEEP | Layered environment specialization where reusable base intent is separate from environment overlay realization. |

## Evidence/source ledger

- Vault leases attach TTL, renewability and revocation to dynamic secrets; consumers must renew or replace expired leases. Vault Agent/Proxy can auto-authenticate, cache leased credentials, manage renewal and render/inject material locally. Sources: https://developer.hashicorp.com/vault/docs/concepts/lease ; https://developer.hashicorp.com/vault/docs/agent-and-proxy/agent ; https://developer.hashicorp.com/vault/docs/agent-and-proxy/proxy
- AWS Secrets Manager creates new versions, uses staging labels such as `AWSCURRENT`, `AWSPREVIOUS` and `AWSPENDING`, and treats rotation as an asynchronous lifecycle whose incomplete pending state can block later rotations. Sources: https://docs.aws.amazon.com/secretsmanager/latest/userguide/whats-in-a-secret.html ; https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_RotateSecret.html
- External Secrets Operator exposes refresh/lifecycle policy separately from target Secret state; Workload Identity / federation can authenticate provider access without embedding a static provider credential in the application. Sources: https://external-secrets.io/latest/guides/ownership-deletion-policy/ ; https://external-secrets.io/main/provider/google-secrets-manager/
- Kubernetes Secrets and ConfigMaps can be immutable; immutable targets must be replaced rather than mutated. Sources: https://kubernetes.io/docs/concepts/configuration/secret/ ; https://kubernetes.io/docs/concepts/configuration/configmap/
- AWS AppConfig validates configuration before deployment, separates source configuration from deployed configuration, supports gradual deployment and automatic rollback on alarms, and can revert a recent completed deployment. Sources: https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html ; https://docs.aws.amazon.com/appconfig/latest/userguide/deploying-feature-flags.html ; https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-deploying-reverting.html
- SPIFFE Workload API supplies short-lived X.509/JWT SVIDs and rotating trust bundles; workload identity can therefore replace some stored authentication secrets with provider-verifiable identity. Sources: https://spiffe.io/docs/latest/spiffe/concepts/ ; https://spiffe.io/docs/latest/deploying/svids/
- SOPS supports AWS/GCP/Azure/Vault/age/PGP recipients, key groups and threshold decryption, `updatekeys` for recipient changes and `rotate` for data-key rotation, preserving an encrypted artifact that can have online and offline recovery paths. Source: https://github.com/getsops/sops
- Kustomize distinguishes reusable bases from overlays that specialize them without requiring the base to know each environment. Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/

## Identity model refined

The previous model remains valid, but this revisit requires two additional distinctions:

1. `ConfigurationIntentIdentity` — semantic configuration requirement/default/constraint independent of any environment realization.
2. `ConfigurationDeploymentIdentity` — a validated rollout of one configuration revision into one environment/scope.
3. `SecretRequirementIdentity` — semantic sensitive requirement.
4. `ProviderBindingIdentity` — environment-scoped realization of config/secret/provider capability.
5. `ProviderObjectVersionOrLeaseIdentity` — provider truth.
6. `WorkloadAuthenticationIdentity` — runtime identity used to access providers; may exist without a stored secret.
7. `MaterializationIdentity` — concrete injection/render/reconcile event.
8. `EffectiveRuntimeConfigIdentity` — version/revision the running workload is evidenced to be using.
9. `DecryptingTrustContextIdentity` — key/recipient/trust revision needed to recover encrypted material.

A secret requirement must not be created merely because a provider needs authentication. Where workload identity can satisfy provider authentication, the correct realization may contain **no long-lived secret material at all**.

## Lifecycle

Configuration and secret lifecycles partially overlap but must not be collapsed:

`declare semantic intent -> specialize/overlay -> validate -> bind -> deploy/reconcile -> consume -> observe effective revision -> roll forward/rollback/rebind -> retire`

Secret-specific branches add `issue -> renew/rotate -> revoke/expire`. Workload-identity branches add `attest/authenticate -> issue short-lived identity -> rotate trust/identity -> re-attest`.

Configuration rollout is therefore a first-class lifecycle, not merely a key/value lookup. AppConfig demonstrates semantic validation, staged exposure and rollback independent of code release.

## Versioning and precedence

At least five revision axes may coexist: canonical configuration intent, environment overlay, provider binding, provider value/lease and effective runtime revision. Overlays must record precedence and provenance. A lower-level overlay may specialize only authorized fields; it must not silently mutate canonical intent or weaken higher-level invariants.

For `Enterprise → Station → Role → Person`, effective configuration should be a resolved result with explicit contributing revisions and precedence. Station may narrow provider/config exposure; Role/Person overlays must not gain secret disclosure or provider-binding authority merely because they can personalize a work surface.

## Failure semantics refined

- `CONFIG_VALIDATION_FAILED` — syntactic or semantic validation rejects a revision.
- `CONFIG_ROLLOUT_DEGRADED` — deployment progressed but health/effectiveness evidence triggered halt/rollback.
- `EFFECTIVE_CONFIG_UNKNOWN` — source/deployment state is known but the active runtime revision is not evidenced.
- `OVERLAY_PRECEDENCE_CONFLICT` — two layers claim incompatible authority for the same setting.
- `OVERLAY_AUTHORITY_VIOLATION` — a lower layer attempts to weaken or replace a protected higher-layer value/policy.
- `WORKLOAD_IDENTITY_UNAVAILABLE` — provider access cannot be established through expected runtime identity.
- `TRUST_BUNDLE_OR_ATTESTATION_STALE` — workload identity exists but trust/attestation freshness is not acceptable.
- existing secret failures (`EXPIRED_OR_REVOKED`, `ROTATION_PROPAGATION_INCOMPLETE`, `REBIND_CONTINUITY_UNPROVEN`, etc.) remain authoritative.

Unknown effective state is not equivalent to success and should not be inferred from provider/source health.

## Governance and AI / AGWS boundary

Configuration-edit authority, provider-binding authority, secret-use authority, secret-disclosure authority, secret-creation authority and canonical-domain authority are distinct.

AI/AGWS may safely materialize a typed logical requirement, choose among already-authorized bindings/options, or request an allowed configuration overlay. It must not reveal secret values, mint provider credentials, create new secret material, change cryptographic recipients, broaden Station provider exposure, or weaken Enterprise/Station constraints without explicit escalated authority.

Evidence should contain identifiers/revisions/status and redaction lineage, never plaintext or reversible sensitive derivatives.

## Portability and offline/self-hosted operation

Three portable realization modes recur:

- online provider resolution using workload identity or bounded bootstrap;
- deployment-local materialization/cache/reconciliation that continues independently of Builder availability;
- encrypted portable configuration with local/offline decryption trust for air-gapped recovery.

Provider replacement must preserve semantic requirement, capability compatibility, authentication mode, trust/recovery, rollout/freshness and effective-consumption proof. Replacing one provider locator with another is insufficient.

## Product-specific mechanisms vs universal primitives

Product-specific: Vault mounts/lease IDs/Agent, AWS ARNs/stages/AppConfig deployment numbers, ExternalSecret fields, Kubernetes Secret/ConfigMap names, SPIFFE IDs/SVID formats, SOPS recipient syntax/key groups, Kustomize patch syntax.

Universal: semantic configuration intent, governed overlay, precedence/provenance, config deployment/rollout identity, logical secret requirement, provider binding, workload authentication realization, version/lease/freshness, effective runtime revision evidence, rollback/rebind continuity, disclosure-safe evidence and trust/recovery context.

## Convergent patterns

- Source truth and effective runtime truth are distinct.
- Runtime/provider authentication can be fulfilled by short-lived identity rather than stored application secrets.
- Configuration deserves validation/rollout/rollback semantics separate from code release.
- Environment specialization is a layered realization of reusable intent, not permission to fork canonical meaning.
- Provider health does not prove effective consumer freshness.
- Offline autonomy requires local trust/recovery, not only a portable ciphertext or cached locator.

## Subcapabilities added/refined

- Semantic configuration intent and schema/constraints.
- Governed environment/Station/Role/Person overlays with precedence lineage.
- Configuration validation, rollout, health observation and rollback.
- Secret/config provider binding and rebind continuity.
- Workload identity / credential-elimination realization.
- Lease/rotation/revocation/freshness propagation.
- Effective runtime revision evidence without content disclosure.
- Offline decrypting trust/recovery continuity.
- Sensitive evidence/redaction contracts.

## Reconciliation hypotheses

- **KEEP** — deploy-varying configuration and secrets remain external to immutable product/release content.
- **HARDEN** — require effective runtime revision/freshness evidence and explicit unknown state.
- **GENERALIZE** — introduce semantic configuration intent plus governed overlays independent of provider/env syntax.
- **GENERALIZE** — distinguish workload authentication requirement from secret requirement so secretless provider access is possible.
- **PROVIDERIZE** — Vault, cloud secret managers, AppConfig-like configuration delivery, workload identity systems and key systems remain provider realizations.
- **INTEGRATE** — configuration deployment/revision evidence binds to Environment/Deployment and Station exposure without transferring canonical authority.
- **DEFER** — generic fleet-wide configuration experimentation UI until product need is proven.
- **DO_NOT_BUILD** — proprietary Vault/KMS/workload-identity authority when mature providers can fulfill the provider plane.

## Repository-validation questions

- Is deploy configuration modeled as typed semantic intent or only concrete environment-variable names/values?
- Can Environment/Deployment evidence identify the effective config revision actually consumed by a runtime?
- Does any current runtime credential exist solely to authenticate to a provider that could instead accept workload identity?
- Are provider locators, key IDs or secrets present in portable SystemDefinition/IR, generated source, release metadata or logs?
- Is there an explicit precedence model for environment/Station/Role/Person configuration specialization?
- Can generated runtimes restart/refresh in self-hosted or air-gapped operation without Builder-issued credentials?
- Can AI or a personalized work surface request a secret value, provider credential or binding change without an explicit authority escalation today?

## Symbiotic Proof

A generated runtime declares semantic `database.endpoint`, `primary-database-auth` and `feature-policy` requirements. Enterprise owns protected defaults and allowed provider classes; Station selects an authorized local realization; Role/Person can specialize only allowed non-sensitive presentation/runtime settings. Environment A authenticates to Vault using workload identity and receives dynamic DB credentials; Environment B uses AWS Secrets Manager; Environment C runs air-gapped with SOPS-encrypted config and locally held recovery identity. `feature-policy` is deployed as a validated configuration revision with staged rollout and rollback. Evidence proves contributing overlay revisions, binding, provider version/lease and effective runtime config revision without exposing secret material. Replacing Vault with another provider or moving between environments changes bindings/realizations, not portable semantic requirements.

## Stable findings

- **G2-FINDING-SCEP-17 — Configuration Intent, Environment Overlay, Configuration Deployment and Effective Runtime Revision Are Distinct Identities.** Treating configuration as raw deploy key/value data loses validation, rollout, rollback, precedence and effective-state evidence.
- **G2-FINDING-SCEP-18 — Governed Overlay Precedence Must Preserve Provenance and Be Non-Amplifying Across Enterprise → Station → Role → Person.** Environment/personal specialization cannot silently fork canonical intent or weaken higher-level constraints.
- **G2-FINDING-SCEP-19 — Workload Authentication Is Not Necessarily a Secret Requirement; Short-Lived Workload Identity Can Eliminate Stored Provider Credentials.** A universal model that always asks for a secret would create unnecessary secret material and lock-in.
- **G2-FINDING-SCEP-20 — Provider/Deployment Success Does Not Prove Effective Consumer State; Effective Config/Secret Revision Needs Disclosure-Free Evidence or Explicit UNKNOWN.** Content observation is unnecessary and unsafe when version/revision lineage can prove freshness.
- **G2-FINDING-SCEP-21 — Configuration Rollout Is a Governed Runtime Change Lifecycle With Validation, Progressive Exposure, Health Evaluation and Rollback Independent of Code Release.** Config changes can alter product behavior materially and need their own proof boundary.
- **G2-FINDING-SCEP-22 — Offline Runtime Autonomy Requires a Local Authentication/Trust/Recovery Path, Not Merely Cached Configuration or Encrypted Ciphertext.** Air-gapped/self-hosted continuity must prove decryptability, identity/trust freshness and provider-local operation after Builder loss.

## Capability candidates

- `G2-CAPABILITY-CANDIDATE-WORKLOAD-IDENTITY-CREDENTIAL-ELIMINATION` — CROSS_CUTTING / CANDIDATE. Identity, Secrets, Provider Binding and Runtime Autonomy should test a generic requirement→workload-identity realization that avoids unnecessary stored credentials.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-CONFIGURATION-ROLLOUT` — CROSS_CUTTING / CANDIDATE. Configuration validation, staged deployment, health-based rollback and effective revision evidence recur independently of code release.
- `G2-CAPABILITY-CANDIDATE-CONFIGURATION-OVERLAY-PRECEDENCE-LINEAGE` — CROSS_CUTTING / CANDIDATE. Enterprise/Station/environment/Role/Person specialization requires reusable precedence, non-amplification and provenance semantics.

## Value / risk / priority / next question

Value: VERY_HIGH. Secrets/configuration are foundational to portable generated runtimes, while workload identity can reduce secret surface entirely.

Risk: VERY_HIGH if configuration, secret material, provider authentication and effective runtime state collapse into one model; this would create avoidable credentials, hidden drift and false freshness claims.

Priority: FOUNDATION before Provider/Binding synthesis and target runtime architecture.

Next question: test in Provider / Binding / Capability Negotiation whether `workload identity`, `secret resolution`, `configuration rollout` and `offline materialization` should be negotiated as independent provider capabilities composed under one logical requirement rather than flattened into a single provider type.
