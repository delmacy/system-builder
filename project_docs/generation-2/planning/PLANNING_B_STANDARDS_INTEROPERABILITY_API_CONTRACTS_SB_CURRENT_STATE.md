# Planning B — Standards / Interoperability / API Contracts — SB Current-State Reconciliation

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Canonical capability: Standards / Interoperability / API Contracts
Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

This artifact reconciles current System Builder evidence against the already-closed Planning A boundary. It does not define target architecture, execute product code, materialize Work Packages/TASKs, enter Construction, or advance to Planning C.

## 1. Current-state question

What contract/version/conformance/interoperability semantics are actually present on fresh main, and which Planning A obligations remain unevidenced?

The governing boundary remains:

`contract conformance != provider support qualification != authorization != domain semantic equivalence != effective outcome`.

## 2. Evidence inspected

### 2.1 Public artifact envelope

`specs/contracts/artifact-envelope/artifact-envelope.schema.json` is a JSON Schema 2020-12 public provider-neutral envelope. It has a versioned schema URI, SemVer envelope/artifact/schema versions, stable logical artifact identity, provenance, payload schema reference, optional extensions and `requiredExtensions`. Its description explicitly excludes provider, registry, database and storage identifiers from the core contract.

This is strong evidence for KEEP: SB already distinguishes canonical artifact identity and public contract metadata from provider-native realization identifiers.

### 2.2 Domain contracts as explicit JSON Schemas

Fresh main contains versioned JSON Schema contracts under `packages/contracts/**`, including ProcessMirror and evidence-provenance extensions, plus other domain contract packages. Schema identity and revision are explicit rather than inferred from generated implementation classes or provider APIs.

### 2.3 AI Gateway canonical model contract

`packages/contracts/ai-gateway/index.ts` defines explicit contract-version constants for model I/O, capability advertisement and execution governance. Normalizers reject unsupported versions, unexpected fields, missing required fields and duplicate capability/rule identifiers; arrays/maps are canonicalized deterministically where order is not semantically significant.

The same contract layer includes provider-neutral `ModelRequest` / `ModelResponse`, `ModelCapabilityDescriptor`, a narrow `ModelProviderAdapter`, structured-output schema validation and request/response correlation by canonical `requestId`.

This is real structural/behavioral contract enforcement, not merely documentation.

## 3. Current implemented primitives

Fresh main evidences the following current-state primitives:

- explicit contract/schema identities and revisions;
- SemVer-bearing public envelope and artifact/schema revisions;
- JSON Schema 2020-12 contracts for durable public/domain artifacts;
- exact-field validation and fail-closed unsupported-version rejection in AI Gateway contracts;
- deterministic normalization/canonicalization for capability lists, limits and governance rule sets;
- provider-neutral request/response envelopes separated from provider adapters;
- public extension mechanics (`extensions`, `requiredExtensions`) at the artifact-envelope boundary;
- provider-neutral provenance/producer identifiers in the public artifact contract;
- structured output shape/type validation with explicit `valid`, `invalid`, and `schema-invalid` outcomes;
- canonical request correlation independent of provider response identity.

These are substantive predecessors for Standards / Interoperability / API Contracts.

## 4. What fresh main does not evidence

Repository evidence does not establish a generalized interoperability capability implementing all Planning A semantics. In particular, fresh main does not evidence:

- first-class canonical `ContractIdentity` / `ContractRevision` across all public/internal APIs as a reusable abstraction;
- explicit multidimensional conformance records separating syntactic, structural, behavioral and semantic conformance;
- `CONFORMANT | PARTIAL | NON_CONFORMANT | INCONCLUSIVE` conformance qualification with applicability/currentness horizons;
- producer/consumer compatibility matrices scoped by revisions, profiles, operation subsets and extensions;
- generalized negotiation/downgrade selection with proof that superior security/trust/privacy/authority invariants remain satisfied;
- revisioned extension registries/namespace governance beyond bounded per-contract mechanisms;
- operation-level idempotency-key scope/lifetime, duplicate equivalence, reconciliation/read-back and retry-safety contracts as a reusable platform primitive;
- generic mapping from transport/provider outcomes into `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN` effect dispositions;
- reconcile-before-retry infrastructure for ambiguous remote mutations;
- lineage-bearing conformance test evidence tied to contract, implementation/adapter/provider and test-suite revisions plus currentness;
- generalized protocol/resource identifier mapping/adoption workflow with governed canonicalization decisions;
- explicit API deprecation/withdrawal/coexistence evidence and residual consumer/producer cohort drainage;
- formal distinction between protocol conformance and provider support qualification outside the already-narrow provider seams;
- a repository-wide compatibility profile proving generated-runtime API interoperability independently of Builder control-plane availability.

Absence of these constructs is recorded as an unevidenced current-state gap, not as a target design prescription.

## 5. Identity and provider boundary

Fresh main strongly supports the Planning A rule that external/provider identifiers are not canonical by default. The public artifact envelope explicitly omits provider/registry/database/storage identifiers from core identity, while AI Gateway contracts use canonical request identifiers and provider-neutral descriptors behind a replaceable adapter.

No evidence was found that successful protocol/provider lookup silently adopts an external identifier as canonical domain identity.

Disposition: **KEEP + HARDEN**.

## 6. Contract versioning and compatibility

Versioning is explicit in several concrete contracts, and unsupported AI Gateway contract versions fail closed. This is stronger than implicit versioning.

However, current evidence is predominantly exact-version acceptance, not generalized cross-version compatibility. The repository does not evidence compatibility matrices, conditional backward/forward compatibility, profile-aware negotiation, or downgrade qualification.

Disposition: **KEEP + GENERALIZE + DEFER** for generalized compatibility/negotiation until architecture planning.

## 7. Conformance semantics

Current schema/normalizer/test behavior proves syntactic/structural validation in multiple boundaries and some bounded behavioral invariants (exact fields, correlation, deterministic normalization, supported version checks).

It does not prove that the platform represents semantic conformance separately from schema/shape validity. Nor is there generalized evidence currentness with `PARTIAL/INCONCLUSIVE` qualification.

Therefore:

`schema-valid != behaviorally compatible != semantically equivalent`.

Disposition: **KEEP + HARDEN + GENERALIZE**.

## 8. Extensions, downgrade and lifecycle

The public artifact envelope has bounded extension mechanics and distinguishes optional extensions from required extensions. That is valuable current evidence for extensibility.

Fresh main does not establish a generalized extension/profile negotiation lifecycle, policy-bounded downgrade semantics, API deprecation/withdrawal/coexistence windows, or residual consumer drainage.

Disposition: **KEEP** existing bounded extension semantics; **DEFER** generalized downgrade/lifecycle claims pending later architecture work.

## 9. Error, idempotency and ambiguous effects

Current contracts fail closed on invalid/unsupported structural conditions, but the inspected evidence does not implement a generalized remote-effect semantic layer. Transport/provider success cannot therefore be upgraded to universal domain-effective success.

For mutating remote operations, the Generation 2 invariant remains a Planning A requirement rather than a current implementation claim:

`UNKNOWN mutating effect -> reconcile-before-retry` unless the exact operation has qualified idempotency semantics.

Disposition: **DEFER / INTEGRATE** with Integration, Provider/Binding, Workflow and UCA in later phases; do not invent implementation here.

## 10. Generated-runtime autonomy

Existing Planning B runtime evidence proves generated runtime can remain operable without Builder/Observe control-plane availability. That is relevant to interoperability portability, but it is not itself a generalized API conformance proof. No evidence inspected here establishes a complete independent external API compatibility suite across contract revisions/providers.

Disposition: **KEEP** runtime autonomy evidence; **HARDEN** the distinction between operational autonomy and interoperability conformance.

## 11. Authority, trust and AI/AGWS boundaries

No current evidence justifies allowing protocol compatibility, adapter generation or schema validity to create authority. Preserve:

`Enterprise -> Station -> Role -> Person`

as monotonic authority hierarchy. Identity, Authorization, Enterprise Trust/PKI, Security and Privacy owners remain distinct. AI and Adaptive Governed Work Surfaces may generate or explain schema/adapter/test proposals, but current evidence does not grant them authority to declare semantic equivalence, suppress unsupported/partial conditions, adopt external IDs, weaken profile requirements or infer retry safety.

Disposition: **KEEP boundary / DO_NOT_BUILD authority amplification**.

## 12. Planning B dispositions

- **KEEP** versioned provider-neutral public artifact contracts and canonical identity separation.
- **KEEP** JSON Schema 2020-12 domain/public contracts and fail-closed validation.
- **KEEP** AI Gateway versioned request/response/capability/governance contracts and provider adapter seam.
- **KEEP** bounded required/optional extension mechanics.
- **HARDEN** explicit distinction among syntax/structure/behavior/semantics.
- **HARDEN** canonical-vs-external identity separation and protocol-success-vs-domain-outcome separation.
- **GENERALIZE** contract identity/revision, compatibility/conformance evidence and currentness only where later architecture proves a reusable owner is needed.
- **INTEGRATE** interoperability evidence with Provider/Binding, Integration, Lifecycle, Security/Trust, Deployment/Runtime, Architecture Reconciliation and UCA without absorbing their semantics.
- **DEFER** generalized compatibility matrices, negotiation/downgrade, conformance-currentness, idempotency/reconciliation and residual-cohort drainage because they are not present on fresh main.
- **DO_NOT_BUILD** any mechanism that equates schema validity or provider/protocol success with semantic capability equivalence, authorization or effective outcome.
- **REPLACE:** no evidence supports replacement of current contract foundations.
- **PROVIDERIZE:** only concrete protocol/provider mechanics belong behind adapters; canonical contract semantics remain provider-neutral.

## 13. Planning B result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.**

Fresh main contains a meaningful Standards/API-contract foundation: explicit versioned provider-neutral schemas/envelopes, canonical identities, strict structural validation, deterministic normalization, bounded extensions and a replaceable AI provider contract seam. The remaining gaps are generalized compatibility/conformance/currentness, downgrade/lifecycle, operation-specific idempotency/effect reconciliation and residual interoperability-cohort semantics.

No target architecture was invented. No product code, Work Package, executive TASK, Construction, PR or worker handoff was executed.
