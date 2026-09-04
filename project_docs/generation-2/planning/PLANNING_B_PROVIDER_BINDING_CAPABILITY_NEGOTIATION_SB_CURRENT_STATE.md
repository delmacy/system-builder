# Planning B — Provider / Binding / Capability Negotiation — SB Current State Reconciliation

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Canonical capability: Provider / Binding / Capability Negotiation
Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

This artifact reconciles only evidenced current System Builder state against the Planning A boundary. It does not define target architecture and does not execute product code, Work Packages, executive TASKs, Construction, PR or worker handoff.

## 1. Current-state evidence

### Provider-neutral AI model I/O contract

Fresh main contains a versioned AI Gateway model I/O contract with canonical `requestId`, `responseId`, input/output payloads and exact-field normalization. Provider implementation details are intentionally absent from the canonical request/response envelope. `ModelProviderAdapter` is a narrow invocation boundary whose provider-specific configuration remains outside the canonical contract.

Disposition: **KEEP + GENERALIZE**. This is strong evidence for a provider-neutral seam, but it is currently specific to the AI model path rather than a generalized Provider/Binding contract shared by all capabilities.

### Explicit capability and limit descriptors

The AI Gateway defines a versioned `ModelCapabilityDescriptor` containing normalized capability names and limits. Capability lists and limit maps are normalized deterministically and malformed/duplicate data fails closed.

Disposition: **KEEP + HARDEN**. The current descriptor establishes a useful support-advertisement primitive. However, capability-name equality and scalar limits do not by themselves prove semantic equivalence, applicability, evidence currentness or multidimensional support qualification.

### Provider replaceability proof

Product tests exercise two interchangeable adapters through the same canonical request semantics and assert equivalent canonical output while provider identity, implementation tag, endpoint, credentials, routing, fallback, approval, authorization and authority remain absent from the canonical envelopes. Provider failure propagates explicitly rather than fabricating fallback or authority.

Disposition: **KEEP**. This is direct product evidence that provider replacement can preserve canonical request semantics at the tested seam.

### Execution governance and fallback separation

The AI Gateway also has explicit routing-eligibility, budget/quota and fallback rules. Their normalization is deterministic; provider-specific fields and hidden default-provider identity are rejected. Fallback must be declared explicitly, and governance policy remains separate from provider identity.

Disposition: **KEEP + INTEGRATE**. This is useful separation of policy from provider mechanics, but it does not itself establish provider qualification/admission, binding identity or provider-substitution lifecycle.

### Provider invocation validation

`invokeModelProvider` normalizes the request before adapter invocation, normalizes the response after invocation and verifies request/response correlation. Invalid provider responses therefore fail closed instead of silently becoming canonical output.

Disposition: **KEEP + HARDEN**. Current validation protects the narrow AI provider boundary, but generalized effect lineage, ambiguous remote mutations and reconcile-before-retry semantics are not evidenced.

## 2. What is evidenced today

Current SB evidences:

- a versioned provider-neutral model request/response contract;
- exact-field fail-closed normalization at the provider seam;
- a narrow replaceable `ModelProviderAdapter` abstraction;
- canonical requests/responses that deliberately exclude provider IDs, endpoints, credentials and authority-bearing fields;
- explicit model capability and limit advertisement;
- deterministic normalization of advertised capabilities and limits;
- provider-replaceability product proof across two adapter implementations;
- explicit provider failure propagation rather than fabricated fallback;
- explicit routing eligibility, quotas and fallback rules separated from provider identity;
- fallback rules that reject hidden provider defaults;
- request/response correlation validation;
- secret/config/provider realization details kept outside the canonical model I/O envelope.

These facts support retaining the existing provider abstraction primitives rather than replacing them.

## 3. Material gaps against Planning A

Fresh-main evidence does **not** establish the following as generalized Provider / Binding / Capability Negotiation semantics:

1. a canonical provider descriptor identity and revision independent from provider-native resource/account IDs;
2. generalized provider discovery and registration lifecycle;
3. multidimensional support vectors covering semantics, failure behavior, consistency, locality, lifecycle, observability, security, privacy, recovery and offline constraints;
4. evidence-backed qualification outcomes `SUPPORTED / PARTIAL / UNSUPPORTED / INCONCLUSIVE`;
5. explicit separation of discovered, advertised, qualified, admitted, bound and effective states across provider-backed capabilities;
6. canonical binding identity, revision and scope independent from domain-object and provider-resource revision;
7. provider-specific realization parameters explicitly attached to a binding rather than capability-specific ad hoc configuration;
8. binding currentness/validity/health evidence with observation time, applicability and validity horizon;
9. canonical-to-provider identity mapping and lineage for reconciliation outside the narrow AI response correlation case;
10. generalized remote effect dispositions `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`;
11. reconcile-before-retry for `UNKNOWN` mutating provider effects;
12. qualified fallback/coexistence semantics proving semantic interchangeability under current requirement vectors;
13. provider substitution lifecycle with candidate qualification, admission, coexistence, cutover, validation and withdrawal;
14. residual authoritative cohort drainage for sessions, workers, queues, callbacks, subscriptions, mappings, in-flight operations or other provider-specific remnants;
15. historical retention of withdrawn provider mappings/evidence as a generalized capability;
16. Station-scoped provider exposure and delegated binding administration under `Enterprise → Station → Role → Person`;
17. provider support/currentness semantics for disconnected/offline operation;
18. generalized provider-admission integration with Authorization, Governance, Security, Trust, Privacy, economic and environment policy;
19. proof that provider acceptance is distinguished from effective domain outcome for arbitrary provider-backed capabilities;
20. generalized provider portability scoring or substitution qualification outside the tested AI adapter seam.

Absence here is an evidence statement, not a target-architecture mandate.

## 4. Current-state truth boundaries

Fresh-main evidence supports these current boundaries:

`canonical request/response != provider implementation identity`;

`governance/routing policy != provider identity`;

`provider adapter failure != permission to invent fallback`.

The broader Planning A constitutional boundary remains only partially implemented:

`discovered != advertised != qualified != admitted != bound != effective`.

The current AI Gateway proves advertisement and adapter invocation, but not the full generalized qualification/admission/binding lifecycle.

Likewise, feature-name matching is not evidence of semantic equivalence. The current descriptor uses strings such as capability names; therefore Planning B must not infer that equal strings across two providers prove equivalent semantics beyond the explicit replaceability tests that exist.

## 5. Provider identity and portability

The strongest current portability evidence is negative leakage control: product tests intentionally assert that canonical AI request/response objects do not expose provider identity or implementation-specific details. This is consistent with provider IDs remaining non-canonical.

However, no generalized canonical provider descriptor or binding identity was evidenced. Provider-specific identities still appear in adjacent implementation/configuration areas where necessary, but the inspected provider abstraction does not yet establish a common mapping/revision model that can be replayed across arbitrary capability substitution.

Provider replaceability is therefore **proven for the tested AI adapter seam**, not globally for every provider-backed capability.

## 6. Failure, partiality and ambiguity

The current adapter seam fails closed for malformed responses and propagates provider exceptions explicitly. That is positive current-state behavior.

No generalized evidence was found for:

- `PARTIAL` provider support qualification;
- `INCONCLUSIVE` qualification caused by stale or missing evidence;
- `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` provider mutation effects;
- reconcile-before-retry after ambiguous remote mutation;
- provider-operation lineage sufficient to prove a later domain-effective outcome.

Therefore `UNKNOWN → reconcile-before-retry` remains a Generation 2 gap, not a claim about current implementation.

## 7. Enterprise → Station → Role → Person, AGWS and AI

The AI Gateway governance seam does not evidence the complete `Enterprise → Station → Role → Person` provider-administration hierarchy or Station-scoped capability exposure. Provider eligibility cannot be inferred merely from adapter reachability or capability advertisement.

Adaptive Governed Work Surfaces and AI remain non-amplifying. Existing AI provider abstraction does not grant AI authority to admit providers, widen Station exposure, convert provider IDs into canonical identity, fabricate support/currentness evidence, suppress partiality or retry an ambiguous mutation.

Disposition: **INTEGRATE** with Authorization/Policy, Governance, Secrets/Configuration, Lifecycle and AGWS boundaries later; do not place their semantic truth inside Provider/Binding.

## 8. Capability-boundary reconciliation

- **Integration & Automation** owns connector/action/trigger automation semantics; Provider/Binding owns provider realization qualification/binding where such realization exists.
- **Deployment / Environment / Runtime** owns desired/observed/effective workload truth and deployment-provider actuation/convergence.
- **Secrets / Configuration / Environment Portability** owns secret/config references, values, overlays, revisions and environment configuration semantics.
- **Standards / Interoperability / API Contracts** owns protocol/contract conformance; Provider/Binding may consume that conformance as one support dimension.
- **Lifecycle / Versioning / Evolution / Migration** owns reusable revision/coexistence/migration/withdrawal semantics used by binding lifecycle.
- **Architecture Reconciliation as a Capability** owns later product-truth-versus-target reconciliation and gap disposition.
- **Universal Capability Architecture** is the cross-cutting home for reusable identity/revision/evidence/effect/currentness primitives; Provider/Binding must not become a semantic god-object.
- Domain owners retain semantic success: provider acknowledgement or adapter response is not universal proof of domain-effective outcome.

## 9. Evidenced dispositions

| Disposition | Current-state decision |
|---|---|
| KEEP | versioned model I/O contract; exact normalization; narrow replaceable adapter seam; capability/limit descriptor; request/response correlation; explicit failure propagation; explicit fallback policy |
| HARDEN | capability advertisement with semantic qualification/currentness; response/effect evidence; fail-closed unsupported/partial handling; provider health/currentness semantics |
| GENERALIZE | provider descriptor concepts, binding identity/scope/revision, qualification/admission, provider-to-canonical mapping and replaceability patterns beyond AI |
| PROVIDERIZE | provider-specific realization mechanics only behind qualified adapters/bindings; current AI adapter is evidence of this direction at one seam |
| INTEGRATE | Authorization/Policy, Governance, Security/Trust/Privacy, Secrets/Configuration, Integration, Deployment, Standards, Lifecycle, Observability and UCA |
| REPLACE | none evidenced |
| DEFER | generalized hot substitution where domain state/evidence requirements cannot yet prove safe equivalence |
| DO_NOT_BUILD | feature-name-equality-as-equivalence; provider ID as canonical domain identity; hidden default-provider authority; provider acknowledgement as universal effective success; automatic retry of ambiguous mutation without reconciliation |

## 10. Planning B result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Fresh main has a substantive provider-neutral abstraction in the AI Gateway, with explicit capability/limit descriptors, deterministic normalization, narrow adapters, replaceability proofs, fail-closed response validation and governance/fallback separation. These are meaningful foundations and should be retained/generalized rather than replaced.

The generalized Generation 2 Provider / Binding / Capability Negotiation capability remains only partially represented. Canonical provider descriptor/binding identity and revision, evidence-backed support qualification, admission, currentness, generalized effect dispositions, reconcile-before-retry, safe provider substitution, residual cohort drainage and hierarchical Station exposure remain unevidenced gaps.

No new research finding or capability candidate is created by this reconciliation. Planning B must continue in canonical order with **Standards / Interoperability / API Contracts**. Planning C remains blocked; when Planning B reaches 28/28, the mandatory next phase is `RESEARCH_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION`.
