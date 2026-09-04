# Deep Research — Durable Automation Delegated Authority 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY
Deep Research ID: `DR-DAAG-01`
Date: 2026-09-04
Phase context: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Primary cluster: Identity × Authorization × Station × AGWS × AI

## 1. Question

When a personal or supervised automation is created/materialized while a Person is authorized, but its execution is delayed, recurring, durable or offline and the creator later changes Role/Station, loses membership, loses authority, departs the organization, or the superior authority envelope changes, what authority may the automation legitimately retain?

Specifically, should G2:

1. pin the creator's authorization/identity snapshot for the lifetime of the automation;
2. always execute as the creator under the creator's current authority; or
3. model the automation as a distinct actor operating under an explicit, revisioned, bounded delegated-authority grant whose creation was itself authorized and whose continued applicability can be requalified?

This research tests the residual authority boundary. It does not define target modules or implementation.

## 2. Why this is architecturally material

The answer changes whether AGWS personalization and AI materialization can accidentally create durable privilege, whether automations survive legitimate staff turnover, how Station/Role changes drain residual authority, how offline Stations behave, and whether provider workload credentials become de facto canonical authority.

Two superficially safe models fail in opposite directions:

- forever pinning the creator's original `ALLOW` preserves stale authority after revocation;
- always binding execution to the current human account makes durable organizational automation depend on a Person who may legitimately leave or change role, even when the organization intended a separately governed service/automation actor.

The unresolved architecture question is therefore not merely token expiry. It is the semantic identity and authority source of durable automated actuation.

## 3. System Builder input corpus

This deep research treats the current G2 corpus as hypotheses/boundaries to test:

- `RESEARCH_PIPELINE_STATE.json`: active adversarial phase explicitly prioritizes stale Role/Station transitions, AI materialization, personal automation promotion, provider-backed actions and partial/UNKNOWN effects.
- `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`: requires explicit handling of user authority loss after starting work, Role/Station changes, personal automation promotion, AI authority misuse and residual authority.
- `PLANNING_A_ADAPTIVE_GOVERNED_WORK_SURFACES_BOUNDARIES.md`: `Enterprise → Station → Role → Person` is monotonic; AI is a materializer, not an authority source; personal action, supervised automation and team workflow are distinct authority levels; Role/Station changes trigger revalidation; promotion is explicit.
- `PLANNING_A_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_BOUNDARIES.md`: Authorization owns current decision semantics, delegation envelopes and temporary grants; previous `ALLOW` is not automatically current after membership/Station/policy changes; residual sessions/tokens/evaluators can form residual authority cohorts.
- `DEEP_RESEARCH_LONG_LIVED_GATE_CRITERIA_EVOLUTION_01.md`: already falsified both universal forever-origin pinning and universal always-latest adoption for general long-lived work; this document specializes the unresolved automation-actor/grant question rather than repeating that result.
- `DEEP_RESEARCH_AUTHORITY_BEARING_DERIVED_CLAIMS_RECURSIVE_TRUST_01.md`: authority-bearing claims require current, scoped, externally rooted, non-amplifying authority closure.
- `DEEP_RESEARCH_TEMPORAL_AUTHORITY_EVIDENCE_SEMANTICS_01.md`: currentness/expiry/revocation evidence must not collapse into one generic timestamp.

## 4. External evidence ledger

| ID | Source | Evidence | Architectural implication |
|---|---|---|---|
| DAAG-E01 | IETF RFC 8693 — OAuth 2.0 Token Exchange | Distinguishes impersonation from delegation. Under delegation, the actor retains an identity separate from the subject and acts representing that subject; composite-token semantics can carry both subject and actor. Delegation/impersonation can be bounded by scope or time. | A durable automation need not masquerade indefinitely as its creator. Separate actor + delegated authority is a mature interoperable semantic pattern. Token/JWT forms remain provider mechanics, not G2 canonical identity. |
| DAAG-E02 | NIST SP 800-207A — Zero Trust for cloud-native applications | Access control must include application/service identities in addition to users and support granular runtime policy enforcement. | Durable automation/service actors can be first-class authorization subjects. Human identity is not the only legitimate runtime principal. |
| DAAG-E03 | AWS IAM — temporary credentials and session revocation | Temporary credentials have bounded lifetimes; role permissions are evaluated when requests are made; active sessions can be revoked, including using token issue time cutoffs. | Possession of an unexpired provider token is not equivalent to permanent semantic authority. Revocation and residual sessions are explicit lifecycle concerns. |
| DAAG-E04 | Google Cloud IAM — short-lived service-account credentials/delegation | Service-account credentials can be created through explicit delegation chains, are short-lived, and each delegate must be authorized to pass authority to the next actor. | Delegation must be non-amplifying and explicit across chains. Short-lived workload credentials are a realization strategy for durable actors, not a reason to store creator credentials. |
| DAAG-E05 | Google Cloud IAM — service-account security guidance | Letting a user impersonate a more privileged service account can elevate privilege; controls must consider whether impersonation grants more authority than the user should possess. | Automation creation/attachment itself is an authority-sensitive act. A user must not bootstrap a durable actor with greater authority than the authorized delegation envelope permits. |
| DAAG-E06 | Kubernetes projected ServiceAccount tokens | Workload tokens are audience-scoped and expiring, with administrators able to bound maximum expiration. | Runtime autonomy can use renewable bounded credentials tied to a workload identity; provider-specific tokens should remain replaceable realization evidence. |
| DAAG-E07 | Cedar authorization model/best practices | Authorization requests distinguish principal, action, resource and request context; agent/on-behalf-of context can be represented without erasing principal semantics. | The current automation actor and the human/delegator/provenance context should remain distinct inputs. A historical UI `ALLOW` is not the request principal for every future act. |

## 5. Competing models

### Model A — forever pin origin-person authority

The automation stores the creator's original identity/authorization decision and continues acting with that authority for its lifetime.

**Strongest evidence for:**

- maximizes replay continuity;
- avoids breaking automation when the creator changes role;
- can reproduce the historical conditions under which creation was admitted.

**Strongest evidence against:**

- converts historical authorization into current actuation authority;
- defeats revocation, Station/Role removal and superior policy changes;
- lets a departing Person leave behind hidden durable privilege;
- turns copied/cached credentials into authority truth;
- contradicts G2's existing rule that a prior `ALLOW` does not remain current after material applicability changes.

**Disposition:** `DO_NOT_BUILD` as a generic authority model. Preserve origin authority only as provenance/historical evidence.

### Model B — always execute as the creator's current Person authority

Every actuation is reauthorized as the original creator under the creator's current Role/Station/membership.

**Strongest evidence for:**

- naturally reacts to user revocation;
- simple mental model for truly personal automations;
- avoids authority outliving the Person when no durable delegation was intended.

**Strongest evidence against:**

- makes organizational automation fail when a creator legitimately transfers/leaves despite explicit durable organizational intent;
- conflates creator/delegator identity with runtime actor identity;
- prevents clean operational ownership transfer;
- encourages retention of human refresh tokens or provider impersonation as runtime coupling;
- cannot represent a team/service automation whose authority was separately admitted.

**Disposition:** `SPECIALIZE`, not universalize. This remains appropriate for explicitly **personal-act-as-me** automation profiles where authority is intentionally Person-bound.

### Model C — distinct automation actor + explicit delegated-authority grant

Creation/materialization is authorized as an act by the Person, but durable execution uses a distinct canonical automation/service actor under an explicit grant/delegation envelope. The grant states scope, actions/resources, Station/tenant applicability, issuer/delegator, issuance authority, revision, validity/revocation/currentness conditions and whether subdelegation is permitted. Each privileged actuation is authorized against current grant applicability and superior constraints.

**Strongest evidence for:**

- reconciles durable organizational continuity with revocation/non-amplification;
- aligns with standards distinguishing actor from subject/delegator;
- allows provider workload identities/tokens to rotate independently;
- supports explicit Person-bound and organization-bound automation profiles;
- makes promotion from Person to team/system a real authority transition rather than a copied provider object;
- permits residual-authority drainage and bounded offline closure.

**Strongest evidence against / constraints:**

- adds an explicit lifecycle subject and grant relationship;
- can become a privilege-escalation mechanism if users may create actors/grants broader than their own delegable authority;
- stale downstream credentials can continue provider effects unless enforcement/reconciliation is designed around canonical revocation/currentness;
- provider service-account semantics differ, so G2 must not equate provider identities with the canonical automation actor/grant.

**Disposition:** `KEEP + SPECIALIZE + PROVIDERIZE`: keep existing Authorization delegation/grant semantics; specialize them for durable automation actors; providerize tokens/service accounts/workload identities.

## 6. Reconciled invariants

1. `AutomationDefinition != AutomationActor != AutomationAuthorityGrant != ProviderCredential`.
2. `creator/delegator identity != durable runtime actor identity` unless an explicit Person-bound automation profile says otherwise.
3. `authorized creation != perpetual authorized actuation`.
4. Historical creator `ALLOW` is provenance, not current authority.
5. A durable automation grant cannot exceed the issuer's currently delegable envelope at issuance/adoption time.
6. Subdelegation is denied by default unless explicitly authorized by the delegation envelope.
7. Superior Enterprise/Station constraints and capability exposure remain non-amplifying over lower-scope automation grants.
8. Provider token/session validity is neither necessary nor sufficient evidence of canonical grant currentness.
9. Promotion `Person → Role/Team/Station/Enterprise` creates a new admitted authority context/revision; copying an automation/provider ID is not promotion.
10. AI may propose/materialize automation definitions but cannot mint or widen canonical authority grants by inference.
11. Privileged actuation after required authority evidence becomes stale/ambiguous is `DENY` or `INCONCLUSIVE` according to governing policy; never implicit `ALLOW`.
12. Revocation does not retroactively prove a previously timed-out provider mutation was `NOT_APPLIED`; ambiguous effects still require reconciliation before unsafe retry.

## 7. Failure and adversarial analysis

### Creator changes Role but automation is intentionally organizational

If the automation has an independently admitted durable grant issued within a delegation envelope that allowed organizational persistence, a creator's later Role change need not terminate it. The creator remains provenance/delegator, not runtime authority source. The grant and superior constraints must remain current.

If no independent grant exists and the automation profile is Person-bound, the Role/Station change invalidates applicability and requires reauthorization/rebinding or termination.

### Creator leaves the organization

A Person-bound automation fails closed. An independently owned organizational automation may continue only if its grant remains valid and its ownership/delegation policy does not require the former Person's continuing membership. Departure must not silently transfer ownership or broaden authority.

### Station capability exposure is revoked

Even a still-valid lower-scope automation grant cannot override superior Station/Enterprise withdrawal. Execution must fail closed/requalify, and residual runtime/provider credentials become a drainage concern.

### Provider token survives canonical revocation

A token accepted by a provider after canonical authority revocation demonstrates residual provider authority, not valid G2 authority. G2 evidence must record the residual cohort and prevent new canonical actuation; effects already ambiguous remain subject to reconciliation.

### AI creates a syntactically valid automation with broader access

The proposal may be generated, but admission/grant issuance must prove the requested scope lies inside the human's delegable envelope and inherited constraints. AI does not gain `set policy`, `create grant`, `expand Station exposure` or service-account impersonation authority from surface-edit permission.

### Offline Station

Offline execution is safe only when the Station retains an explicit local authorization closure for the automation actor/grant within bounded currentness/revocation assumptions. When those assumptions expire or become unknowable, privileged execution becomes `INCONCLUSIVE`/fail-closed. Reconnect requalifies before broader execution resumes.

### Concurrent revocation versus actuation

The actuation decision/evidence must identify automation actor, grant revision, superior policy/Station revisions and decision currentness. If revocation races with a remote mutation, the effect may be `APPLIED`, `NOT_APPLIED`, `PARTIAL` or `UNKNOWN`; revocation alone cannot infer remote outcome.

## 8. Provider-specific mechanics versus portable semantics

### Portable G2 semantics

- canonical automation actor identity;
- delegation/grant identity and revision;
- issuer/delegator provenance;
- action/resource/scope/Station/tenant bounds;
- non-amplification and subdelegation rules;
- validity/revocation/currentness/applicability;
- authority requalification at privileged actuation boundaries;
- promotion/adoption lineage;
- residual-authority/effect reconciliation evidence.

### Providerized mechanics

- OAuth token exchange/composite-token encoding;
- service accounts/workload identities;
- STS/token brokers;
- IAM role sessions;
- JWT/OIDC/SPIFFE or other credential formats;
- token TTL/rotation/cache implementation;
- provider-native revocation APIs.

Provider feature names or credential IDs must not become canonical authority identity.

## 9. Consequences for existing findings/candidates/hypotheses

### Adaptive Governed Work Surfaces

`KEEP` the existing authority ladder. `SPECIALIZE` supervised automation/promotion semantics so AGWS references an admitted automation actor/grant owned by Authorization rather than treating the Person's surface authority as durable runtime authority.

### Authorization / Policy / Organization / Multitenancy

`KEEP` `DelegationEnvelope` and `TemporaryAuthorityGrant` concepts. `GENERALIZE/SPECIALIZE` them enough to represent durable automation grants whose lifecycle can outlive a Person session while remaining bounded by superior policy. This is a refinement of the existing owner, not evidence for a new canonical capability.

### Identity / Authentication / Federation

`SPECIALIZE` identity treatment so Person/delegator and automation/workload actor are separate subjects with explicit provenance/delegation relations. Authentication of the automation actor does not grant authority by itself.

### Integration & Automation / Workflow

`KEEP` execution/effect ownership. Execution must consume current qualified authority for the automation actor and retain ambiguous-effect reconciliation independent of authority revocation.

### AI / low-code hypothesis

`HARDEN` non-amplification: AI can author/propose automation semantics but cannot infer an authority grant, promote scope or select a more privileged workload identity without explicit admission.

### Provider / Binding

`PROVIDERIZE` service-account/session/token mechanics. Qualification must test revocation latency, residual sessions, audience/scope, credential renewal and provider substitution without changing canonical actor/grant identity.

### Taxonomy

`DO_NOT_PROMOTE` a new top-level Durable Automation Authority capability. The evidence fits existing Authorization ownership with cross-capability contracts.

## 10. Proof obligations

### DR-DAAG-01 — stale creator authority cannot actuate by historical ALLOW

Create a Person-bound automation, then remove the Person's Role/Station authority before the next privileged act. Expected: no actuation under historical creation evidence; result is denied/requalification-required with exact stale revisions recorded.

### DR-DAAG-02 — legitimate organizational grant survives creator departure without impersonation

Create an organizational automation under an explicitly permitted durable grant, then remove the creator from the organization. Expected: automation continues only as its own actor under the still-current grant; evidence retains creator/delegator lineage without authenticating as that Person.

### DR-DAAG-03 — non-amplifying grant issuance

Attempt to create an automation grant broader than the issuer's delegable action/resource/Station envelope. Expected: fail closed; no provider credential or automation activation is produced.

### DR-DAAG-04 — superior Station withdrawal fences lower automation

Withdraw Station capability exposure while lower-scope grant remains nominally valid. Expected: new privileged actuation denied/requalified; lower grant cannot override superior revision.

### DR-DAAG-05 — residual provider credential after canonical revocation

Keep a provider workload/session credential technically valid after canonical grant revocation. Expected: canonical path refuses new actuation and records residual authority cohort; provider credential validity is not accepted as authorization proof.

### DR-DAAG-06 — promotion creates new authority context

Promote a Person automation to Role/team scope. Expected: explicit new automation/grant revision/admission under target authority; simply copying provider automation identity or metadata is rejected.

### DR-DAAG-07 — subdelegation denied unless explicit

An automation actor tries to mint/delegate another actor/grant. Expected: denied unless the current grant explicitly permits bounded subdelegation; resulting child authority must be a subset.

### DR-DAAG-08 — offline currentness horizon

Run a privileged automation on a disconnected Station beyond its qualified local authority/currentness horizon. Expected: `INCONCLUSIVE`/fail-closed for acts requiring current central revocation knowledge; reconnect triggers requalification.

### DR-DAAG-09 — AI cannot mint authority

AI materializes an automation proposal requesting a provider/service identity with broader rights than the human's delegated envelope. Expected: proposal cannot become admitted grant/credential; escalation names the owning authorization decision.

### DR-DAAG-10 — revocation race with ambiguous external mutation

Revoke authority while a remote effect times out. Expected: remote disposition remains `UNKNOWN` until reconciliation; system must not retry merely because authority is now revoked nor label the first effect `NOT_APPLIED` without evidence.

### DR-DAAG-11 — provider substitution preserves canonical automation authority identity

Replace one workload-identity/token provider with another. Expected: automation actor/grant identity and authority semantics remain stable; provider-specific credentials are reissued/requalified and incompatible revocation/currentness semantics yield `PARTIAL/INCONCLUSIVE`, not silent weakening.

### DR-DAAG-12 — concurrent Role/Station change stale-decision fencing

Race a Role/Station revision against actuation using a cached authorization decision. Expected: decision applicability identifies its revision vector/currentness; stale decision cannot authorize a new privileged effect after material context change unless explicit equivalence has been qualified.

## 11. Falsification paths

The recommendation should be revised if strong multi-system evidence demonstrates either:

1. that independently governed durable organizational automation cannot be safely represented as a separate actor/grant without reintroducing creator authority; or
2. that all relevant enterprise automation classes are structurally Person-bound and cannot legitimately outlive creator membership/Role/Station context.

Current standards and mature provider evidence contradict both propositions. Provider implementations differ in credential encoding, revocation latency and service/workload identity lifecycle, but that divergence strengthens rather than weakens the need for portable grant/actor semantics.

## 12. Unresolved questions

1. Exact canonical name/schema: `AutomationActor`, generic `WorkloadActor`, or a profile of an existing principal/subject primitive should remain open to Planning C/reconciliation.
2. Which automation classes require per-act authorization versus checkpoint/lease-style bounded authorization closure should be capability/profile-specific and needs later product-proof design.
3. Revocation propagation SLO/currentness horizons for external providers remain provider-qualification concerns.
4. Ownership-transfer semantics for organizational automations need lifecycle/governance detail without converting creator change into silent authority transfer.
5. Break-glass automation grants and emergency recovery should reuse existing recovery-authority research rather than create a parallel bypass model.

## 13. Confidence

**HIGH** for the architectural distinction:

`creator authorization/provenance != durable automation actor != delegated authority grant != provider credential`.

**MEDIUM-HIGH** for making an explicit automation/workload actor profile mandatory for durable organizational automation; exact primitive naming and whether it should reuse a generic non-human principal abstraction remain open.

## 14. Research dispositions

- `KEEP` — existing monotonic `Enterprise → Station → Role → Person` authority and explicit delegation semantics.
- `SPECIALIZE` — durable automation as a distinct actor under explicit grant; retain a separate Person-bound “act as me” automation profile where intended.
- `GENERALIZE` — existing delegation/grant semantics sufficiently to cover durable non-human automation actors without inventing a new top-level capability.
- `PROVIDERIZE` — service accounts, workload identities, STS/token exchange, credential TTL/rotation/revocation implementation.
- `DO_NOT_BUILD` — indefinite creator impersonation, cached historical `ALLOW` as future actuation authority, or promotion by copying provider automation identity.
- `DEFER` — exact canonical actor/grant schema and checkpoint-vs-per-act authorization strategy to target architecture/product-proof design.

These are research recommendations only and do not override contradictory repository source-of-truth or later architecture gates.

## 15. Next high-value deep question

**Revocation under disconnected Station execution:** when a durable automation grant has a bounded offline authorization closure but revocation occurs centrally during disconnection, what lease/epoch/evidence model permits useful offline automation without turning bounded autonomy into indefinite stale privilege? This should reconcile existing Station fencing/escrow research with durable automation authority rather than reopening generic offline authorization.