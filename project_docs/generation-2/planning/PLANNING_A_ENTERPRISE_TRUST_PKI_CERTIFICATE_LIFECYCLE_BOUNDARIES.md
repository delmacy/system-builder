# Generation 2 — Planning A — Enterprise Trust / PKI / Certificate Lifecycle Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Enterprise Trust / PKI / Certificate Lifecycle

This document defines semantic ownership only. It makes no current-product claim and authorizes no implementation work.

## Ownership

Enterprise Trust / PKI owns portable enterprise-trust intent and the qualified lifecycle of trust domains, trust relationships, anchors/bundles, issuer generations, certificate identities/profiles, enrollment and issuance facts, path/currentness/revocation qualification, renewal/rotation, overlapping trust generations, consumer-effective adoption, residual cohort drainage, provider substitution, and bounded disconnected-operation evidence.

Canonical trust identity is distinct from provider-native certificate, issuer, resource, store, or deployment identifiers unless an explicit governed adoption transition establishes otherwise.

## Source of truth

Portable trust intent and policy revisions are canonical owner truth. Provider state is realization evidence. Relying-party adoption is effective-state evidence. None silently overwrites another.

A trust claim is applicability-scoped and revision-qualified across the applicable policy, trust material generation, issuer generation, credential identity, provider binding, relying population, evidence source and evidence horizon. Possession of credential material does not itself prove current trust, and provider acknowledgement does not itself prove relying-party effectiveness.

Stale, expired, revoked, path-invalid, unavailable or partially converged evidence yields DENY, DEGRADE or INCONCLUSIVE according to superior policy; it is never silently coerced to trusted.

## Lifecycle and versioning

The portable lifecycle remains `request/authorize → issue → distribute/materialize → consumer-observe → qualify → renew/rotate with overlap → requalify → drain residual consumers → retire old generation → retain evidence`.

Request, authorization, issuance, materialization, effective use and validation are distinct facts. Versioning is a vector: policy revision, anchor/bundle revision, issuer generation, credential/profile identity, revocation evidence generation, provider-binding revision and consumer-effective generation may evolve independently.

Rotation and provider substitution require explicit overlap/cutover where coexistence is needed. Closure requires evidence that old authoritative consumers have drained or have an explicit governed residual disposition.

## Authority and hierarchy

Issuance, revocation, trust-policy change, anchor admission, provider administration, rotation and emergency trust changes are distinct authorities.

`Enterprise → Station → Role → Person` remains monotonic and non-amplifying. A Station may expose or narrow only trust capabilities explicitly delegated by superior policy. Lower scopes cannot introduce unapproved trust material, weaken currentness requirements, extend evidence horizons, gain provider administration authority or reinterpret unknown evidence as trusted.

AI and Adaptive Governed Work Surfaces may request or consume qualified trust relationships inside existing authority, but cannot manufacture trust evidence, change canonical trust policy or amplify authority.

## Offline and degraded operation

Disconnected operation may use retained trust evidence only inside explicitly authorized horizons and scopes. Offline mode cannot extend validity, evidence freshness, policy currency or delegated authority because upstream evidence is unavailable. Horizon expiry degrades or fails closed according to superior policy. Reconnection forces requalification when relevant revisions or evidence may have changed.

## Provider boundary and portability

Providers own their native trust-service realization and resource lifecycle. System Builder's portable responsibility remains trust intent, typed lineage, support requirements, qualification and proof obligations.

Provider equivalence is a support vector rather than a feature-name match. Qualification may include hierarchy/profile support, enrollment semantics, status/currentness behavior, trust-material distribution, workload integration, delegated administration, disconnected behavior, evidence export/replay, overlap/rotation behavior and drainage observability. Provider substitution is a fresh qualification event.

## Capability boundaries

- **Identity / Authentication / Federation:** owns canonical subject identity, authentication assurance, sessions and federation. PKI owns certificate/path/anchor/issuer qualification. A certificate may contribute authentication evidence without becoming canonical Person identity.
- **Authorization / Policy / Organization / Multitenancy:** owns permission decisions and delegated organizational authority. Valid trust evidence does not itself grant business authorization.
- **Security / Resilience / Failure Recovery:** owns security posture, containment, degraded-mode and recovery qualification; it consumes trust facts without owning them.
- **Secrets / Configuration / Environment Portability:** owns secure reference/value and configuration realization; storing credential material does not prove current trust.
- **Provider / Binding / Capability Negotiation:** owns provider discovery, support qualification, admission, binding and cutover; PKI owns trust-specific requirements and postconditions.
- **Deployment / Environment / Runtime:** owns runtime desired/effective state and readiness; PKI owns trust readiness consumed by workloads. Materialization is not automatically consumer-effective trust.
- **Standards / Interoperability / API Contracts:** owns protocol and conformance contracts; protocol compatibility does not by itself prove enterprise trust acceptance.
- **Governance / Compliance / Audit:** owns obligations, controls, assessments, exceptions and audit lineage; it references PKI evidence without replacing PKI truth.
- **Developer / Operator Experience / Self-hosting:** owns bootstrap, diagnostics and disconnected operational ergonomics while preserving trust semantics.
- **Universal Capability Architecture:** supplies reusable identity, revision, evidence, provider-binding and drainage primitives without owning trust policy.

## Failure semantics

Later phases must preserve distinguishable states for rejected or unknown issuance, non-effective materialization, invalid path, validity-window failure, confirmed revocation, unavailable/stale status evidence, trust material not adopted by consumers, partially converged rotation, residual old-generation consumers, provider support no longer qualified and disconnected evidence horizon exceeded.

Ambiguous mutating effects remain subject to reconcile-before-retry unless idempotency is explicitly qualified. Retirement is incomplete while authoritative residual consumers remain undispositioned.

## Non-goals

This capability does not own canonical human identity, business authorization, generic secret persistence, generic runtime orchestration, every security control, compliance assessment, provider selection, protocol standards or a mandatory native trust-service implementation. Native and external providers may realize the capability behind portable contracts.

## Planning B repository-validation questions

Deferred to fresh `main`; no answer is inferred here:

1. Which contracts distinguish portable trust identity/policy from provider-native trust identifiers?
2. Are path/currentness/revocation and stale/unknown outcomes first-class?
3. Does runtime readiness distinguish material availability from consumer-effective trust?
4. Is provider substitution modeled with qualification, overlap/cutover and residual drainage?
5. Which current transport/runtime contracts carry trust provenance and autonomous-runtime trust closure?
6. Are issuance, revocation, anchor admission, provider administration and rotation authorities independently expressible?
7. Which tests prove generated-runtime transport-trust parity, and what remains transport-specific?
8. Are disconnected evidence horizons explicit or implied by cached material?

## Proof obligations carried forward

Later phases must support proof of provider-neutral trust identity, current path/status qualification, issuance distinct from effective use, overlap-based rotation, consumer adoption, residual drainage, provider replacement without canonical identity loss, bounded disconnected operation, reconnect requalification and non-amplifying Station/Role/Person delegation.

## Planning A decision

**PASS_FOR_CAPABILITY.** Enterprise Trust / PKI / Certificate Lifecycle has a distinct semantic owner, source-of-truth model, lifecycle/versioning, failure semantics, provider boundary and non-goals. It remains CROSS_CUTTING without absorbing adjacent owners.
