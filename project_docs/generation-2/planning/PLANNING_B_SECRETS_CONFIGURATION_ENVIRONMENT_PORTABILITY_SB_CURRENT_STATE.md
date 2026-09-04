# Planning B — Secrets / Configuration / Environment Portability — SB Current State Reconciliation

Status: **PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED**

Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

## Scope

Repository archaeology only. This document records current System Builder truth and gaps against the Planning A boundary. It does not define target architecture and does not authorize product implementation, Work Packages, TASKs, Construction, PR or worker handoff.

## Evidenced current state

1. `packages/contracts/environment-profile` defines a canonical `EnvironmentProfile` contract at schema version `1.0.0` with `environmentRef`, allowed `runtimeVersions`, and explicit bindings whose kinds are `config` or `secret-reference`. Binding records carry a logical `name`, a `reference`, and optional `requirementKind`.
2. `packages/deploy/secret-resolver.ts` defines a provider-neutral `SecretResolver` interface that resolves a symbolic reference without exposing provider mechanics to callers. `resolveRuntimeSecretEnvironment` selects only `secret-reference` bindings, deterministically orders them, rejects duplicate names, invalid references and empty results, and returns runtime values keyed by logical binding name.
3. Production resolver realizations exist for process environment and file-backed stores. Both require `secret://<name>` symbolic references, fail closed for missing/empty/invalid references, and their serialized evidence exposes reference names rather than secret values. An in-memory resolver exists for bounded/test use behind the same interface.
4. Deploy-local runtime activation resolves secret references before process start, injects resolved values into the child process environment, passes the serialized `EnvironmentProfile` separately through `SYSTEM_BUILDER_ENVIRONMENT_PROFILE`, emits a distinct `SECRET_RESOLUTION_FAILED` diagnostic when resolution fails, and redacts resolved secret values from downstream migration diagnostics/evidence.
5. Current tests and the P10 production SecretResolver closure report establish runtime autonomy with Builder/Observe unavailable and assert that resolved secret material does not enter durable Release/Deployment/provider evidence. The implementation therefore already preserves an important boundary: symbolic secret intent is durable; resolved material is ephemeral runtime realization.
6. The canonical environment contract is intentionally small. Fresh main does not evidence typed configuration value schemas, default/override/overlay precedence, configuration revisions, secret versions/leases/currentness horizons, rotation/revocation lifecycle, consumer-effective adoption evidence, or residual secret/config generation drainage.

## Maturity assessment

**Strong bounded foundation for symbolic secret resolution and portable environment binding, but not yet a complete first-class Secrets / Configuration / Environment Portability semantic owner.**

The current SB already separates symbolic secret reference from resolved material and hides concrete resolver mechanisms behind a replaceable interface. Environment identity and runtime-compatibility intent are also explicit. The larger Generation 2 semantics around revisioned configuration, overlays/effective values, secret lifecycle/currentness, provider qualification/substitution, partial/ambiguous effects and residual cohorts are not evidenced in fresh main.

## Current strengths to preserve

- **KEEP** canonical `EnvironmentProfile` identity through `environmentRef`, runtime compatibility declaration and explicit logical bindings.
- **KEEP** `secret-reference` distinct from secret material.
- **KEEP** symbolic `secret://...` references as durable intent rather than storing resolved values in Release/Deployment evidence.
- **KEEP** the provider-neutral `SecretResolver` boundary and replaceable resolver implementations.
- **KEEP** deterministic fail-closed resolution for missing, empty, malformed or duplicate secret bindings.
- **KEEP** ephemeral process-environment materialization and explicit no-secret-value leakage into durable evidence/diagnostics.
- **KEEP** generated Runtime autonomy from Builder and Observe after activation.

## Gaps and dispositions

### Canonical reference identity versus provider realization

**KEEP + HARDEN.** Fresh main correctly distinguishes the binding `reference` from the resolved material and does not expose provider object IDs in the canonical environment contract. However, `secret://<name>` is currently a simple symbolic naming convention rather than a revisioned canonical reference identity with provenance, applicability and adoption lineage.

### Configuration schema, defaults, overrides and effective values

**GENERALIZE / HARDEN.** `EnvironmentProfile` permits `config` bindings but does not evidence a typed configuration schema, constraints, defaults, overlay layers, explicit precedence or an independently evidenced effective-value state. Current product truth therefore does not yet support `declared configuration != effective configuration` as first-class lineage.

### Environment/profile identity and revisioning

**KEEP + HARDEN.** `environmentRef` is explicit and portable enough to avoid embedding a concrete hosting provider in the contract. Fresh main does not evidence environment/profile revision identity, immutable revision lineage, inherited overlays, currentness or explicit coexistence between profile generations.

### Secret resolution and provider boundary

**KEEP + PROVIDERIZE where qualified.** `SecretResolver` is already a clean provider boundary; process-environment and file-backed stores are realizations behind it. Fresh main does not evidence provider capability descriptors for version selection, dynamic leases, rotation, revocation, audit/currentness, remote store health or controlled provider substitution. Provider feature-name matching must not be treated as semantic equivalence.

### Materialization and consumer-effective adoption

**KEEP + HARDEN.** Deploy resolves values and injects them into a child process environment, which is a concrete materialization boundary. Fresh main does not evidence a lineage distinguishing `resolved -> injected/materialized -> consumer reloaded/effective -> currentness validated`. Process start proves initial possession, not continued currentness after rotation.

### Rotation, renewal, revocation and currentness

**HARDEN.** No first-class secret version, lease, expiry/currentness horizon, rotation intent, revocation state or consumer-effective rotation completion is evidenced. A new provider value therefore has no current SB mechanism proving that all authoritative consumers stopped using the prior generation.

### Residual credential/configuration generations and drainage

**HARDEN / DEFER implementation.** Fresh main does not inventory old process environments, process memory, files, caches, generated manifests, CI/CD variables, bootstrap bundles or offline copies as residual cohorts. Provider/environment replacement cannot yet prove drainage of still-effective old material.

### Failure, partial effect and ambiguity

**KEEP + HARDEN.** Local resolution has explicit deterministic failure (`SECRET_RESOLUTION_FAILED`) before runtime activation. That is stronger than treating missing secret material as a generic runtime crash. However, current resolvers are local/read-oriented and do not evidence general `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` semantics for remote create/update/delete/rotate/revoke mutations. Ambiguous remote mutations therefore remain a gap and require `UNKNOWN -> reconcile-before-retry` unless exact idempotency is qualified.

### Offline/self-hosted portability

**KEEP + GENERALIZE.** File-backed/process-environment resolvers and autonomous generated Runtime provide a useful self-hosted/offline-compatible foundation. Fresh main does not evidence bounded stale-cache horizons, disconnected lease renewal semantics, bootstrap dependency closure, reconnect reconciliation or proof that an offline value remains currently authorized/trusted.

### Provider/environment substitution

**GENERALIZE / HARDEN.** The canonical contract avoids concrete provider IDs and `SecretResolver` is replaceable, which lowers lock-in. Fresh main does not evidence a governed substitution protocol with dual binding/coexistence, support-vector comparison, cutover evidence, consumer-effective adoption and old-provider drainage.

### Authorization and hierarchical governance

**INTEGRATE.** The secret/config capability itself does not evidence complete `Enterprise -> Station -> Role -> Person` authority over read/write/rotate/revoke/expose operations, nor Station delegated administration. These remain owned by Authorization/Organization and must constrain any secret/config administration. AI/AGWS cannot reveal values, extend stale horizons, adopt provider IDs or create authority beyond effective inherited permissions.

### Rollback/recovery qualification

**HARDEN / INTEGRATE.** Fresh main proves deployment/runtime activation and adjacent migration/recovery behaviors, but no secret/config-specific rule requalifies a historical value/profile against current authorization, trust, schema, provider support and dependent runtime state before rollback or restore.

## Planning A validation questions — current answers

1. **Canonical references distinct from values/provider IDs?** **PARTIAL/PASS foundation.** Symbolic secret references are distinct from values and provider IDs; broader revisioned canonical reference semantics are absent.
2. **Explicit typed revisions and overlays?** **NO evidence.** Environment schema is versioned, but secret/config instances and overlay precedence are not first-class.
3. **Resolution/materialization/consumer-effective lineage separate?** **PARTIAL.** Resolution and process materialization are distinct in code; consumer-effective/currentness evidence is absent.
4. **Rotation/revocation and residual cohorts explicit?** **NO evidence.**
5. **Bounded stale/offline horizons?** **NO evidence.**
6. **Ambiguous provider mutations reconciled before retry?** **NO general evidence; current local resolvers do not establish this remote-mutation semantic.**
7. **Provider substitution without changing canonical reference identity?** **Architecturally plausible from the interface, but not proven as governed lifecycle.**
8. **Bootstrap dependencies explicit enough for autonomous/offline closure?** **PARTIAL.** Autonomous runtime and local/file/env resolution are proven; dependency/lease/currentness closure is not first-class.
9. **Enterprise -> Station -> Role -> Person authority enforced for secret/config administration?** **Not evidenced by this capability implementation.**
10. **Rollback/recovery requalified against current authority/trust/schema/provider state?** **NO secret/config-specific evidence.**

## Boundaries preserved

- Identity / Authentication owns canonical principal identity and authentication assurance; possession of a secret does not prove identity.
- Enterprise Trust / PKI owns trust anchors, certificate/path validity and revocation; materialized certificate/key bytes do not establish trust by themselves.
- Authorization / Organization owns who may resolve, expose, rotate, revoke or administer configuration/secret references.
- Deployment / Runtime owns workload placement, activation and desired/effective runtime state; secret/config owns reference/value/materialization semantics consumed by runtime.
- Provider / Binding owns provider discovery, qualification, admission, fallback and cutover; `SecretResolver` implementations are realizations, not canonical identity.
- Lifecycle owns reusable revision/coexistence/deprecation primitives; this capability owns secret/config-specific currentness and residual-generation semantics.
- Security / Recovery owns security posture, fencing and recovery qualification.
- Governance owns policy/control obligations and evidence requirements.
- UCA supplies reusable identity/evidence/revision/support-vector/effect-disposition contracts and remains anti-god-object.
- Adaptive Governed Work Surfaces remains distinct from generic configuration administration and cannot amplify authority.

## Current-state disposition

Predominant disposition: **KEEP + HARDEN + GENERALIZE + INTEGRATE**, with **PROVIDERIZE** for qualified secret/config store realizations. No fresh-main evidence justifies `REPLACE`. `DEFER` applies only to implementation of residual-cohort/drainage mechanics until target architecture and dependency planning establish their owner relationships; it does not defer the semantic requirement.

## Planning-B conclusion

`PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED`.

Fresh main contains a materially useful Generation 1 foundation: canonical environment profiles, symbolic secret references, replaceable resolvers, fail-closed resolution, ephemeral runtime injection, no durable secret-value leakage and autonomous runtime execution. Planning B nevertheless finds material gaps in configuration/effective-value semantics, revision/currentness, rotation/revocation, provider qualification/substitution, ambiguous remote effects and residual-generation drainage. Target architecture must not be inferred in this phase.
