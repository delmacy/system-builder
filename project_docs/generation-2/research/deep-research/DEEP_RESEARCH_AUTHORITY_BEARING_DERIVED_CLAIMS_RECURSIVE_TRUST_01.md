# Generation 2 Deep Research — Authority-Bearing Derived Claims & Recursive Trust Closure 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

When may a revision-qualified derived claim legitimately participate in authorization, admission, Gate progression, delegation or privileged actuation without allowing the evaluator, provider, AI/AGWS materializer, Station, or an upstream derived claim to manufacture the authority that validates its own result?

More precisely:

- where must authority/trust roots remain external to the derived-claim graph;
- when may a claim about another claim be recursively consumed;
- how does recursive qualification terminate;
- which forms of delegation must be attenuating rather than amplifying;
- how are identity/authentication, appraisal, authorization and actuation kept distinct;
- how do break-glass and disconnected/local Stations preserve bounded authority without silently inventing a new root of trust;
- what evidence proves that evaluator/provider substitution did not weaken the authority closure?

## Why this is architecturally material

`DR-QDCE-01` established strong evidence for a small universal relation:

```text
subject revision
+ evaluator/profile/policy revision
+ evidence/input closure
+ applicability/freshness
      ↓
qualified derived claim
```

and explicitly rejected automatic authority from evaluation success.

That leaves a harder question. Real systems frequently consume derived claims to decide something privileged:

- an attestation result contributes to admission;
- a conformance result contributes to release/deploy authorization;
- an authorization decision enables a protected effect;
- a human approval advances a Gate;
- an identity or credential validation enables a delegated operation;
- a Station-local claim is later accepted by Enterprise reconciliation;
- an AI-produced validation can support, but must not itself authorize, canonical mutation.

If Generation 2 treats any qualified claim as authority-bearing merely because it is signed, trusted, `PASS`, `COMPLIANT` or fresh, a provider/evaluator can become a confused deputy or self-authorizing oracle.

If Generation 2 forbids claims from ever carrying authority weight, it cannot model normal authorization delegation, trust chains, signed credentials, offline bounded authority or multi-stage appraisal.

The architectural problem is therefore not whether derived claims can matter to authority. They plainly can. The problem is **how their authority is rooted, scoped, attenuated, qualified, consumed and terminated**.

## Corpus of SB input

Mandatory Generation 2 corpus reviewed before external research:

- `RESEARCH_PIPELINE_STATE.json` — `phase=RESEARCH_ELICITATION`; six full cycles complete; cycle 7 active. Deep Research must not increment `completed_full_cycles`, mark a capability revisited or declare saturation.
- `RESEARCH_EVIDENCE_METHOD.md` — universal primitives require structural necessity or multi-source corroboration; conflicts must be preserved rather than averaged away.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md` — authority/security proof explicitly requires authentication ≠ authorization, decision/evaluation authority ≠ mutation authority, delegated authority non-amplification, and prevention of cross-tenant/cross-Station/cross-provider escalation.
- `CAPABILITY_DISCOVERY_REGISTER.md`, `FINDING_INDEX.md`, `REPRESENTATIVE_COVERAGE.md`, `CAPABILITY_PROOF_MATRIX.md` and current dossiers/revisits — treated as input hypotheses/evidence inventory rather than automatic conclusions.
- `DR-QDCE-01` — establishes qualified-derived-claim structure but keeps predicate, result, authority and actuation consequences capability-owned.
- `DR-OSEA-01` and `DR-SRFE-01` — offline Station rights are bounded/preallocated and must not be reclaimed or duplicated without exclusion/closure proof.
- `DR-LGCE-01` — historical interpretation may remain pinned while future privileged actuation requires authority/trust requalification.
- `DR-CSEC-01` — Gate progression is based on declared semantic obligations and qualified evidence, not generic completion/ACK.
- prior UCA, Authorization/Policy/Organization, AGWS/Station, Provider/Binding, Identity and Security/Recovery research, which repeatedly require non-amplification and typed authority/freshness boundaries.

This document does not alter breadth rotation state.

## External evidence ledger

### 1. IETF RATS — RFC 9334

Source: https://www.rfc-editor.org/rfc/rfc9334.html

RATS separates:

```text
Attester Evidence
    ↓
Verifier + Appraisal Policy for Evidence
    ↓
Attestation Result
    ↓
Relying Party + Appraisal Policy for Attestation Results
    ↓
local relying-party decision
```

The Attestation Result is signed by a Verifier and can normalize heterogeneous/vendor-specific evidence, but the Relying Party still applies its own appraisal policy. Trust in the Verifier is therefore not identical to the Relying Party's authorization decision.

**Architectural extraction:** a derived claim may be a trusted input to a later authority decision, but the consumer owns the consequence. Verifier trust does not automatically grant actuation authority.

### 2. PKIX certification-path validation — RFC 5280

Source: https://www.rfc-editor.org/rfc/rfc5280.html

RFC 5280 makes the trust anchor an **input** to certification-path validation. A self-signed certificate representing a trust anchor is not validated as another member of the same path; its trusted status comes from a trustworthy out-of-band procedure. Path processing also carries policy/name constraints and prohibits a certificate from appearing more than once in a prospective path.

**Architectural extraction:** recursive trust does not terminate by asking the graph to prove itself. It terminates at an externally admitted trust anchor/authority root under a declared scope. Cycles are invalid evidence of trust.

### 3. SPIFFE trust domains, bundles and federation

Sources:

- https://spiffe.io/docs/latest/spiffe-specs/spiffe_trust_domain_and_bundle/
- https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/
- https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/

SPIFFE bundles contain keys authoritative for a named trust domain; validators must associate the correct bundle with the SVID's trust domain. Foreign trust requires configured federation/bundles, and absence of a matching bundle means the peer is untrusted. Bundle contents rotate and can revoke all prior keys.

**Architectural extraction:** signatures are not globally self-authenticating. Authority is contextual to a trust domain/bundle mapping that must itself be obtained through an authorized trust configuration. Federation is an explicit trust decision, not transitive magic.

### 4. OAuth 2.0 Token Exchange — RFC 8693

Source: https://www.rfc-editor.org/rfc/rfc8693.html

RFC 8693 explicitly distinguishes delegation from impersonation. The authorization server decides whether token exchange is permitted, validates subject/actor tokens, and can issue a target/audience-scoped token. Nested `act` claims retain delegation history, but only the current actor and top-level claims are used for access-control decisions; historical actors are informational.

It also warns that unauthenticated token exchange can allow a stolen token to be leveraged through an STS, and notes that revocation propagation between input/output tokens is not a universal property.

**Architectural extraction:** delegated authority must be newly authorized at the delegation boundary and scoped to the resulting subject/actor/resource/audience/time. A lineage of prior authority claims is not itself an unlimited authorization chain.

### 5. OAuth Rich Authorization Requests — RFC 9396

Source: https://www.rfc-editor.org/rfc/rfc9396.html

RAR expresses typed, fine-grained authorization requirements and rejects unknown/malformed authorization detail types. Resource/audience/location constraints can scope where authority applies. Authorization Server policy determines interpretation and issuance.

**Architectural extraction:** authority-bearing claims require typed semantics and resource/action scope. A generic `authorized=true` is too weak for portable delegated authority.

### 6. Macaroons — Birgisson et al., NDSS 2014

Sources:

- https://research.google/pubs/macaroons-cookies-with-contextual-caveats-for-decentralized-authorization-in-the-cloud/
- https://www.ndss-symposium.org/ndss2014/ndss-2014-programme/macaroons-cookies-contextual-caveats-decentralized-authorization-cloud/

Macaroons support decentralized delegation by adding caveats that **attenuate and contextually confine** authority — when, where, by whom and for what purpose it may be exercised. Derived macaroons cannot remove earlier caveats without the root secret.

**Architectural extraction:** safe decentralized delegation is naturally monotone in the restrictive direction. Delegation should preserve an attenuation proof: child authority is a subset/refinement of parent authority unless an independent authorized root explicitly grants additional rights.

### 7. The Update Framework (TUF)

Sources:

- https://theupdateframework.github.io/specification/v1.0.28/
- https://theupdateframework.io/docs/metadata/

TUF ships clients with trusted root keys, separates roles, supports signature thresholds, and allows delegated target roles to receive full or partial trust. Root rotation preserves continuity by requiring new root metadata to be signed by thresholds from both old and new root definitions. If a threshold of root keys is compromised, recovery is explicitly out-of-band.

**Architectural extraction:** trust-root mutation is a privileged lifecycle event distinct from ordinary evaluation. Delegated roles receive only role/scope-specific authority. Thresholds can reduce single-evaluator/key authority. Root replacement requires continuity or an external recovery ceremony.

### 8. NIST Zero Trust Architecture

Source: https://pages.nist.gov/zero-trust-architecture/VolumeB/architecture.html

The NIST architecture separates the Policy Engine, which makes the ultimate grant/deny/revoke decision, from the Policy Administrator, which executes the decision, and the Policy Enforcement Point, which guards the resource.

**Architectural extraction:** even after a trusted policy decision exists, actuation/enforcement remains a separate authority-bearing boundary. Decision authority and execution authority should not collapse by default.

### 9. in-toto layout/functionary thresholds

Representative sources:

- https://in-toto.io/docs/examples/debian/
- https://in-toto.io/docs/examples/seattle/

in-toto layouts bind supply-chain steps to authorized functionary public keys and thresholds. Evidence signed by an arbitrary key does not satisfy a step merely because the signature verifies; the layout determines which identities/thresholds are authorized for which step.

**Architectural extraction:** cryptographic authenticity is evidence about producer identity/integrity, not sufficient semantic authority. Authority comes from the independently governed policy/layout binding producer identities to permitted claims.

## Competing models

### Model A — Any qualified/signed claim may directly authorize downstream actuation

Example:

```text
claim.kind = SECURITY_OK
claim.signature = valid
claim.result = PASS
       ↓
deploy privileged workload
```

**Strongest evidence for:**

- operationally simple;
- JWTs, signed attestations and policy decisions are often consumed this way in products;
- can reduce online dependencies.

**Strongest evidence against:**

- RFC 9334 deliberately leaves a relying-party appraisal step after a signed Attestation Result;
- RFC 5280 requires trust anchors as external validation inputs;
- in-toto requires policy/layout authorization of functionaries, not arbitrary valid signatures;
- NIST separates policy decision and enforcement;
- this model allows an evaluator/provider to mint the claim that grants itself authority.

**Disposition:** **DO_NOT_BUILD** as universal semantics.

### Model B — Only direct/root policy decisions may ever authorize; derived claims are informational only

**Strongest evidence for:**

- trivially terminates trust recursion;
- reduces confused-deputy risk;
- keeps all authority centralized.

**Strongest evidence against:**

- incompatible with normal credential chains, delegated authorization, offline bounded rights, RATS attestation consumption and threshold/functionary policies;
- destroys runtime autonomy and Station-local bounded operation;
- forces central online authorization for every effect.

**Disposition:** **REJECT as complete architecture**.

### Model C — Authority-bearing consumption is an explicit domain act over a qualified claim graph rooted in externally admitted authority/trust roots

Conceptual shape, not frozen IR:

```text
AuthorityRoot / TrustAnchor / ExplicitGrant
     │
     ├─ scope / tenant / Station / resource / action
     ├─ delegation policy
     ├─ freshness/revocation/evolution rules
     └─ permitted evaluator / issuer / decision roles
             ↓
      qualified derived claims
             ↓
       policy/appraisal join
             ↓
   AuthorityDecision / AdmissionDecision
             ↓
      Enforcement / Actuation
```

A derived claim may contribute authority weight only if the consuming authority domain can prove a path to one or more admitted roots and every edge is allowed, scoped, current and non-amplifying.

**Disposition:** **KEEP / GENERALIZE**.

## Strongest synthesis

The evidence supports a constitutional separation:

> **A claim can carry evidence of authority, delegation or qualification, but authority is exercisable only through an explicit consumption decision whose trust closure terminates in independently admitted roots and whose scope is no broader than those roots/delegations permit.**

A useful shorthand is:

```text
cryptographic validity
        ≠
producer trusted for this claim
        ≠
claim applicable to this subject/revision
        ≠
claim sufficient for this authorization
        ≠
actor authorized to actuate
```

### Trust recursion termination

Recursive claim consumption must eventually terminate in one or more roots that are **not established solely by the same claim graph being evaluated**.

Examples of legitimate roots:

- Enterprise/tenant authority configuration;
- an explicitly admitted trust anchor/bundle;
- an authorized human/governance decision;
- preallocated Station/escrow authority rooted in Enterprise grant lineage;
- a root policy/layout signed/approved under a root-management ceremony;
- a recovery/break-glass authority explicitly configured beforehand or activated through a separately authorized emergency ceremony.

Examples that do **not** form a sufficient root merely by existing:

- `selfSigned=true`;
- evaluator says it is trusted;
- provider account exists;
- AI agent asserts that its own validation is sufficient;
- a Station restored from backup presents its prior local authority without freshness/reconciliation when the contract requires current qualification;
- a chain whose last node points back to an earlier node.

### Root admission is different from ordinary derived-claim evaluation

Root/trust-anchor admission, rotation and revocation are privileged lifecycle operations. They should not be modeled as ordinary `PASS` claims that can be self-produced by the new root.

TUF provides the strongest operational example: normal root rotation requires continuity under both old and new thresholds; catastrophic root compromise requires out-of-band recovery.

### Delegation should be monotone unless a separate root grants more

The portable invariant is not that every delegated credential must use Macaroons or OAuth. It is:

```text
EffectiveChildAuthority
  ⊆
ParentAuthority ∩ DelegationPolicy ∩ CurrentContext
```

A child/delegate may receive less authority, shorter lifetime, smaller audience, narrower resource/action scope or additional caveats. It cannot obtain additional authority merely by deriving another claim from its own authority.

If extra rights are needed, another independently authorized grant must be joined explicitly.

### Multi-root joins must be explicit

Some actions legitimately require multiple independent roots/claims:

```text
manager approval
+ security conformance
+ deployment role
+ current change window
    ↓
release admission
```

The resulting authority is not owned by any single input evaluator. The owning admission policy defines the join and threshold/quorum/segregation-of-duty rules.

### Decision and enforcement remain separate

Even a valid `PERMIT` or Gate admission does not imply that its evaluator may perform the effect. The actuation path must authenticate an actor and verify that the actor is allowed to consume/execute that decision for the intended resource/action.

This is especially important for AGWS/AI:

```text
AI evaluates / recommends / materializes
        ↓
qualified claim
        X
no automatic authority amplification
        ↓
explicit authorized admission/actuation
```

### Historical authority evidence versus current exercisability

A historical authorization/delegation claim can remain valid evidence of what was permitted at time T1 even after revocation or policy evolution.

It does not follow that the claim remains exercisable at T2.

```text
historically authorized under R1 at T1
           ≠
currently authorized under R2 at T2
```

This follows `DR-LGCE-01` and prevents audit history from becoming a perpetual capability token.

## Contradictions resolved

### “Signed by a trusted verifier” versus “authorized to decide”

A signature establishes integrity/authenticity relative to a trust configuration. It does not establish that the signer is normatively permitted to issue every claim kind.

Resolution: claim consumption must join signer/evaluator identity with an **authority-to-issue/evaluate-this-predicate** binding.

### “Attestation PASS” versus “admission PERMIT”

RATS explicitly separates these stages.

Resolution: attestation/conformance result is evidence; admission/authorization remains a separate domain decision unless a domain profile intentionally and explicitly collapses the stages for a simple local system.

Even in the collapsed implementation, conceptual ownership remains separable for proof and migration.

### “Delegation history” versus “current actor authority”

RFC 8693 retains nested delegation history but tells access-control consumers to consider top-level claims/current actor, not all historical actors as independent grants.

Resolution: lineage is audit/provenance; current effective authority must be re-derived from current claim/policy context.

### “Self-signed root” versus “self-authorized root”

RFC 5280 treats trust-anchor status as an external input even when represented by a self-signed certificate.

Resolution: self-signature proves possession/integrity, not root admission. Root admission is governed externally.

### “Offline autonomy” versus “local sovereign authority”

`DR-OSEA-01` shows that disconnected operation can remain safe when authority/rights were bounded and preallocated.

Resolution: Station-local closure can act as a **delegated root for a bounded scope/time/resource set**, but its authority derives from Enterprise lineage and cannot expand offline. Reconnect may require requalification/reconciliation before privileged continuation.

### “Break-glass” versus “bypass all policy”

Emergency access must be able to override selected ordinary controls, otherwise it is not break-glass. But treating it as an unscoped superuser would destroy non-amplification.

Resolution: break-glass is a separate, explicitly admitted emergency authority path with constrained scope, strong authentication, reason/incident binding, expiry, immutable audit and post-event review. It is not a derived claim self-issued by the blocked actor/evaluator.

## Invariants

1. **External-root termination:** every authority-bearing claim path terminates in one or more independently admitted authority/trust roots; cycles never prove authority.
2. **Issuer/evaluator role binding:** valid identity/signature is insufficient; the issuer/evaluator must be authorized for the exact claim/predicate/profile/scope.
3. **Delegation non-amplification:** delegated authority cannot exceed the union of explicitly joined parent/root grants after scope/context restrictions.
4. **Typed authority:** authority is scoped by at least subject/actor, action/operation, resource/scope, tenant/Station/trust domain and applicable revision/context where material.
5. **Decision ≠ enforcement:** producing a permit/admission result does not grant the producer mutation/actuation authority.
6. **Authentication ≠ authorization:** identity proof alone never confers operation authority.
7. **Evidence ≠ authority:** conformance, attestation, readiness and other claims influence authority only through explicit consuming policy.
8. **No self-authorizing evaluator:** an evaluator/provider cannot add itself to the trusted evaluator/root set through the claim it emits.
9. **No recursive cycles:** claim dependency/trust graphs used for authority must reject cycles or otherwise demonstrate a well-founded ordering that terminates externally.
10. **Freshness/revocation qualification:** current privileged actuation uses the required currentness semantics for roots, delegations and claims; historical validity is preserved separately.
11. **Explicit multi-root joins:** quorum, threshold, segregation-of-duty and multi-approval rules belong to the consuming authority policy and preserve independent root identities.
12. **Provider substitution cannot weaken trust:** replacing issuer/verifier/provider requires equivalent-or-explicitly-migrated trust, predicate and scope semantics; weaker assurance becomes partial/inconclusive, never silently sufficient.
13. **Offline authority remains bounded:** disconnected Station/edge authority cannot grow beyond pre-established delegation/rights closure.
14. **Break-glass is rooted and bounded:** emergency authority has an independent admission path, explicit scope/expiry/evidence and review requirements.
15. **AI/AGWS non-amplification:** AI generation/validation may produce evidence or proposals but cannot mint the authority that authorizes its own canonical mutation unless an external policy/root explicitly grants that operation.
16. **Historical immutability:** revocation or re-evaluation does not rewrite prior authority evidence; it changes current applicability/exercisability.
17. **Unknown is safe:** incomplete trust closure, missing root material, stale delegation or ambiguous provider qualification produces `INCONCLUSIVE/UNAUTHORIZED` according to domain policy, never optimistic authority.
18. **Simple-system ergonomics:** one local root + one local policy/evaluator/enforcer may satisfy the model without distributed PKI/policy infrastructure; conceptual separation must remain testable.

## Failure / adversarial analysis

### Self-authorizing provider

Provider P emits `TRUSTED_PROVIDER=true` signed by P, then uses that claim to satisfy the policy that permits P to issue release attestations.

Required outcome: reject. Trust in P for that predicate must be rooted in an independently admitted binding.

### Circular claim graph

`C1` is trusted because `C2` says evaluator E1 is trusted; `C2` is trusted because `C1` says evaluator E2 is trusted.

Required outcome: no authority. The graph has no independent root/well-founded termination.

### Signature laundering

A key trusted for `BUILD_ATTESTATION` signs `PAYMENT_APPROVAL=PASS`.

Required outcome: signature validates cryptographically but authority consumption rejects claim-kind/profile/scope mismatch.

### Attestation-to-actuation confused deputy

Verifier V can produce `DEVICE_HEALTHY`; V then invokes a privileged operation because its result is healthy.

Required outcome: V's evaluation authority does not grant operation authority. Resource-side authorization checks the actor separately.

### Delegation amplification

Station S has `read inventory` and derives a child token/claim with `write inventory`.

Required outcome: reject because child authority is not a subset of parent + allowed delegation policy.

### Mixed-root escalation

Actor joins two individually valid claims whose scopes were intentionally non-composable, attempting to synthesize broader authority.

Required outcome: consuming policy must define whether grants compose; generic union is forbidden.

### Stale delegated token after revocation

A valid historical delegated claim is replayed after current policy requires revocation freshness.

Required outcome: historical evidence remains, current actuation denied/inconclusive according to required revocation/currentness semantics.

### STS confused deputy

A stolen subject token is exchanged by an unauthenticated actor to mint a token for another audience.

Required outcome: token-exchange boundary authenticates/authorizes the exchanging actor and target delegation; possession alone cannot expand scope.

### Root rollover attack

A new trust root signs metadata declaring itself authoritative but has no continuity from the old trusted root and no authorized out-of-band recovery ceremony.

Required outcome: reject.

### Root compromise recovery

Current root threshold is compromised.

Required outcome: ordinary in-band derived claims cannot repair trust because attacker controls the path. Recovery requires an independently authorized recovery/root-rebootstrap ceremony with explicit evidence.

### Offline Station clone

Two restored copies of one Station present identical delegated authority and attempt to actuate exclusive rights.

Required outcome: authority alone is insufficient for exclusive resource ownership; `DR-SRFE-01` fencing/generation/rights closure still applies.

### AGWS/AI self-approval

AI materializes a canonical change, evaluates its own output `SAFE`, and attempts to consume that result as approval.

Required outcome: unless policy explicitly authorizes self-approval for that exact low-risk operation/profile, evaluator identity and approver authority fail segregation/non-amplification join.

### Break-glass laundering

An ordinary actor labels a request `emergency=true` to bypass policy.

Required outcome: label is not authority. Emergency authority must be separately authenticated/admitted, scoped, expiring and evidenced.

## Provider-specific versus portable semantics

### Portable semantics recommended

- typed authority/trust root identity;
- root scope/trust-domain/tenant/Station binding;
- authority-to-issue/evaluate predicate/profile binding;
- typed delegation lineage;
- attenuation/non-amplification relation;
- subject/actor/resource/action/audience applicability;
- trust/delegation revision and freshness/revocation qualification;
- explicit claim-support/admission/authorization relationships;
- threshold/quorum/multi-root join expression at consuming policy level;
- authority decision separate from actuation/enforcement identity;
- external-root/well-founded trust-closure proof;
- explicit break-glass authority path;
- offline/local delegated-authority closure;
- `INCONCLUSIVE/UNAUTHORIZED` when closure is insufficient.

### Provider/mechanism-specific

- X.509 chain/path syntax and CA constraints;
- SPIFFE SVID/bundle formats;
- OAuth/JWT token exchange and `act` serialization;
- Macaroon HMAC/caveat construction;
- TUF metadata roles/key thresholds;
- in-toto layout/functionary key representation;
- OPA/Rego authorization rules;
- specific PKI/KMS/HSM products;
- specific credential revocation mechanisms;
- provider emergency-access implementation.

Generation 2 should own semantic authority requirements/evidence and delegate credential issuance, cryptographic path validation, policy evaluation and enforcement mechanics to mature providers where appropriate.

## Consequences for existing findings/candidates/hypotheses

### Universal Capability Architecture

- **KEEP/HARDEN** `TypedClaim`, evidence qualification and qualified-derived-claim relation from `DR-QDCE-01`.
- **GENERALIZE** an authority/trust-closure relation that binds claim consumption to externally rooted authority without making every claim authority-bearing.
- **DO_NOT_BUILD** a universal `trusted=true`, universal `PASS→actuate`, or recursive evaluator that can establish its own roots.

### Authorization / Policy / Organization / Multitenancy

- **KEEP/HARDEN** semantic ownership of permit/deny/delegation/obligation and resource/action scope.
- **GENERALIZE** explicit authority-to-issue/evaluate bindings and attenuation proof for delegated authority.
- **KEEP DISTINCT** authorization decision from authentication, attestation and enforcement.

### Identity / Authentication / Federation

- **KEEP** identity/trust proof as input to authorization, not authorization itself.
- **GENERALIZE** trust-domain/root/bundle currentness and federation admission as explicitly governed dependencies.
- **PROVIDERIZE** PKIX/SPIFFE/OIDC credential mechanisms.

### AGWS / Station authority

- **KEEP/HARDEN** Enterprise → Station → Role → Person non-amplification.
- **GENERALIZE** Station-local authority closure as bounded delegated authority rooted in Enterprise lineage.
- **MERGE** with `DR-OSEA-01`/`DR-SRFE-01`: authority to attempt an operation never replaces conserved-right/fencing proof required by resource invariants.

### Workflow / longitudinal Gates

- **MERGE** authority-bearing approvals/claims into effect/Gate obligation evaluation, but keep Gate progression policy as consuming owner.
- **KEEP** human approval evidence distinct from authority of the human to make that decision.

### Provider / Binding

- **HARDEN** provider substitution to require trust/predicate/scope equivalence or explicit requalification/migration.
- **DO_NOT_BUILD** provider self-registration as trusted evaluator through provider-emitted evidence alone.

### Security / Resilience / Failure Recovery

- **GENERALIZE** root compromise, trust-bootstrap, root rotation/revocation and break-glass as first-class proof concerns.
- **KEEP DISTINCT** root recovery from normal credential/claim evaluation.

### AI-native Engineering / Agents / Approvals

- **KEEP/HARDEN** non-amplification: AI may evaluate/recommend/materialize but cannot infer approval authority from successful self-evaluation.
- **SPECIALIZE** explicit low-risk self-approval profiles only when an external authority policy deliberately grants them.

No new top-level capability is recommended from this research alone.

## Proposed research dispositions

| Subject | Disposition | Rationale |
|---|---|---|
| Qualified derived-claim envelope | **KEEP / HARDEN** | strong prior cross-domain evidence; authority question adds constraints rather than replacing it |
| Authority/trust closure rooted externally | **GENERALIZE** | structurally repeated across PKIX, RATS, SPIFFE, OAuth delegation, TUF and in-toto |
| Delegation attenuation/non-amplification | **GENERALIZE** | portable invariant independent of token mechanism |
| Root admission/rotation/recovery | **SPECIALIZE** under Security/Lifecycle/Authorization ownership | privileged lifecycle semantics differ from ordinary claim evaluation |
| Threshold/quorum/multi-party authority | **SPECIALIZE** in consuming policies | useful pattern, not universal requirement for every claim |
| Credential/path/policy mechanisms | **PROVIDERIZE** | PKIX, SPIFFE, OAuth, Macaroons, TUF, in-toto, OPA remain mechanisms/realizations |
| Universal evaluator-owned trust | **DO_NOT_BUILD** | enables circular/self-validation and semantic ownership collapse |
| Generic `PASS → authority` | **DO_NOT_BUILD** | confuses evidence with authorization/actuation |
| Self-signed/self-asserted root admission | **DO_NOT_BUILD** | authenticity does not establish trusted-root status |
| Global automatic union of grants | **DO_NOT_BUILD** | violates scope/non-composability and can amplify authority |
| Break-glass as ordinary flag | **DO_NOT_BUILD** | emergency authority requires independent root, scope and audit |

## Proof obligations — DR-ABRT

### DR-ABRT-01 — External-root termination

Construct a chain of three derived authority-supporting claims rooted in one configured Enterprise trust/authority root. Verify successful closure. Remove the root admission while preserving every derived claim/signature. Current authority must fail/inconclude; signatures alone must not preserve authority.

### DR-ABRT-02 — Circular self-validation

Create `C1 → C2 → C1` where each claim says the other's evaluator is trusted. No external root exists. Closure must reject the cycle rather than treating mutual validation as trust.

### DR-ABRT-03 — Authorized evaluator scope

Trust evaluator E only for `BUILD_CONFORMANCE`. Have E issue cryptographically valid `PAYMENT_APPROVAL`. Signature verification succeeds but authority consumption must reject predicate/profile scope.

### DR-ABRT-04 — RATS two-stage appraisal

Produce a valid attestation result from an authorized verifier. Configure relying-party policy to deny admission for another independent condition. Device remains unattested-to-admission despite valid attestation; attestation result does not bypass relying-party policy.

### DR-ABRT-05 — Decision versus actuation

Grant service E permission to evaluate authorization policy but no protected mutation permission. E emits `PERMIT`. Attempt direct mutation as E must fail. A separately authorized enforcement actor may consume the permit and act within scope.

### DR-ABRT-06 — Delegation attenuation

Parent grant allows `{read A, read B}`. Delegate child to `{read A}` with shorter expiry. Pass. Attempt child `{write A}` or `{read C}` without another root grant. Must reject amplification.

### DR-ABRT-07 — Explicit multi-root augmentation

Parent P lacks `write A`; independent root R explicitly grants `write A` under a policy that allows join. Verify effective authority only when both roots/joins are present and current. Removing R must remove the extra authority without rewriting history.

### DR-ABRT-08 — Non-composable grant protection

Create two valid grants marked non-composable or scoped to distinct audiences. Generic union must not create broader authority. Only an explicit consuming policy may compose them.

### DR-ABRT-09 — Root rotation continuity

Rotate root revision R1→R2 using required continuity/threshold policy. Accept. Present an R2 that is only self-signed by new keys with no R1 authorization. Reject unless an explicitly authorized recovery ceremony is invoked.

### DR-ABRT-10 — Root compromise recovery

Model threshold-root compromise. Demonstrate that ordinary in-band claims from compromised roots cannot establish a trustworthy replacement. Recovery requires separately admitted out-of-band/recovery authority evidence.

### DR-ABRT-11 — Trust-domain mismatch

Present a valid SPIFFE/X.509-style identity from trust domain TD-B to a policy that only admits TD-A. Cryptographic validity under TD-B must not satisfy TD-A authority.

### DR-ABRT-12 — Token-exchange confused deputy

Attempt to use a stolen subject token to request broader/new-audience delegated authority through an STS without an authorized actor. Exchange must reject or remain within explicitly allowed delegation; possession cannot create broader scope.

### DR-ABRT-13 — Historical revocation separation

Persist a valid delegated decision at T1. Revoke root/delegation at T2. Audit still proves the T1 authorization event; new actuation at T2 fails currentness/revocation join.

### DR-ABRT-14 — Offline Station bounded root

Disconnect Station S with pre-authorized bounded local authority. Allowed local action succeeds within scope. Attempt scope expansion or new authority grant while disconnected; reject. Reconnect under changed policy and require requalification before further privileged actuation when profile demands it.

### DR-ABRT-15 — Station clone and exclusive rights

Clone a Station snapshot containing identical delegated authority. Both clones authenticate successfully. Attempt consumption of one exclusive/escrowed resource. Authority claim alone must not satisfy ownership; fencing/generation/right closure prevents duplicate actuation.

### DR-ABRT-16 — AGWS/AI self-approval

AI actor generates a change and emits its own `SAFE/VALID` claim. Policy requires an independent approver. Attempt canonical mutation using only AI claim; reject. Then test an explicitly configured low-risk policy that does permit self-evaluation for a narrow action and prove scope cannot expand.

### DR-ABRT-17 — Break-glass root and expiry

Ordinary actor supplies `emergency=true`; reject. Activate separately authenticated emergency authority with reason/incident ID, narrow action/resource scope and expiry; permit only within bounds; retain immutable evidence and require post-event review artifact.

### DR-ABRT-18 — Provider substitution with weaker trust semantics

Provider P1 supports issuer-role binding, revocation currentness and audience restriction. Substitute P2 lacking revocation/currentness. P2 must be reported partial/inconclusive for profiles requiring those properties, never translated into equivalent `trusted` authority.

### DR-ABRT-19 — Threshold/quorum independence

Policy requires two independent approvers from distinct authority domains. Supply two signatures/claims controlled by the same underlying root/actor. Must not satisfy independence merely because two claim IDs/signatures exist.

### DR-ABRT-20 — Simple-system ergonomics

Implement conceptually one local root, one local policy function and one enforcement point in-process. Demonstrate subject/evaluator/root scope, no self-authorization and decision/effect separation without requiring network PKI, distributed policy servers or enterprise ceremony.

## New architecture/product-proof implications

The existing cross-capability **Station/AGWS authority** product proof should eventually include at least:

```text
Enterprise root
  → bounded Station delegation
  → Role/Person action
  → AI/AGWS validation support
  → explicit authorized admission
  → actuation
```

with negative variants for delegation amplification, stale reconnect claims and AI self-approval.

The **provider replacement** product proof should include replacement of an identity/verifier/policy provider whose trust semantics differ, proving that the SB rejects weaker currentness/revocation/scope support instead of normalizing both to `trusted=true`.

The **offline/autonomous closure** proof should show that local delegated authority can be sufficient without Builder availability while remaining bounded and requalifiable.

## Unresolved questions

1. **Exact UCA primitive boundary:** should authority-root/trust-closure be one generic graph relation reused by Authorization, Security, Identity and Station, or should UCA only expose generic claim dependencies while each owner implements its own root semantics? This should be resolved during Capability Synthesis with cross-domain schema/proof attempts.
2. **Union/intersection algebra:** some authority scopes can be treated as sets; others contain obligations, limits, contextual predicates or risk conditions for which naïve subset/union logic is invalid. A universal authority algebra is not yet supported.
3. **Revocation propagation:** RFC 8693 explicitly does not make revocation propagation a universal STS property. G2 still needs profile-specific requirements for bounded/offline credentials versus current online authorization.
4. **Threshold independence:** counting signatures is insufficient if supposedly independent authorities share a root, operator, provider account or compromised control plane. Independence evidence needs further synthesis with topology/blast-radius/security findings.
5. **Emergency recovery root:** exact governance for catastrophic root compromise or offline emergency operation remains capability/policy-specific and should not be generalized prematurely.
6. **Human authority evidence:** identity + role + approval signature may still be insufficient where separation-of-duty, qualification/licensing or temporal assignment is required. Authorization/AGWS synthesis must retain these dimensions.
7. **Capability tokens versus policy decisions:** Generation 2 should avoid selecting one mechanism universally until synthesis tests both object-capability/delegated-credential and policy-decision realizations against the same portable requirements.

## Confidence

- **HIGH** — trust/authority recursion must terminate in independently admitted roots rather than circular/self-validation.
- **HIGH** — cryptographic validity/authentication is not sufficient authorization; issuer/evaluator role/scope binding is required.
- **HIGH** — evaluator/decision authority and actuation authority must remain separable.
- **HIGH** — delegated authority must not silently amplify; narrower/attenuating delegation is strongly supported across independent mechanisms.
- **HIGH** — offline authority can remain safe only when bounded by previously rooted delegation/rights and cannot expand itself while disconnected.
- **MEDIUM-HIGH** — a portable trust-closure relation is useful across domains, but its exact UCA representation should wait for Capability Synthesis.
- **MEDIUM** — one universal attenuation algebra across all authorization types is unlikely; current evidence supports the invariant more strongly than one representation.

## Recommended disposition

**KEEP / HARDEN** the qualified-derived-claim relation from `DR-QDCE-01`.

**GENERALIZE** the additional invariant that any authority-bearing consumption must prove an externally rooted, scoped, current and non-amplifying trust/authority closure.

**SPECIALIZE** root admission/rotation/recovery, thresholds, break-glass and detailed authorization semantics under their owning capabilities.

**PROVIDERIZE** PKIX, SPIFFE, OAuth token exchange, Macaroons, TUF, in-toto, OPA and specific credential/policy/enforcement mechanics.

**DO_NOT_BUILD** universal `trusted=true`, self-authorizing evaluators/providers, generic `PASS → actuation`, self-signed-root-as-trust, automatic grant union or unrooted break-glass.

This is a research recommendation, not final target-architecture authority.

## Recommended next deep question

**Threshold Independence & Common-Cause Authority Failure.** When a policy requires `2-of-3`, dual control, four-eyes approval, distinct trust domains or independent providers, what evidence proves the authorities are materially independent rather than three credentials controlled by the same administrator/control plane/root key/provider account? Reconcile quorum/threshold authorization, organizational separation of duty, provider/failure-domain topology, Station/Enterprise authority, shared KMS/HSM/control-plane dependencies and correlated compromise. Determine whether G2 needs a typed `independence/failure-domain qualification` on multi-party authority joins or whether this should remain capability-specific.