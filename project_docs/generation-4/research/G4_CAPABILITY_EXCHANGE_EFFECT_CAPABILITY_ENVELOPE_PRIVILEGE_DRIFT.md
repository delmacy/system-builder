# G4 Capability Exchange — Effect-Capability Envelope Minimization and Privilege Drift

Date: 2026-09-21
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Generation 4 product R&D only
Implementation authority: NONE

## 1. Research question

This consolidation continues `G4_CAPABILITY_EXCHANGE_EFFECT_PATH_UNIVERSE_DISCOVERY.md` and asks:

> How can a capability continuously qualify that components which do not need to produce a protected effect cannot acquire the credential, port, resource, provider right, delegation or recovery capability needed to produce it through deployment drift, secret propagation, token exchange, plugin installation, role binding, recovery tooling or topology change — without turning IAM or a central control plane into semantic business authority?

Constitutional boundaries remain unchanged:

- `G3 semantic decision != G4 technology binding`;
- `Research candidate != implementation authority`;
- `Builder != Runtime`;
- `Shared primitives != shared business ownership`;
- `Logical Exchange Plane != single broker`;
- `Exchange Plane owns exchange semantics; capability owns business semantics`;
- `identity possession != business-effect authority`;
- `credential present != effect right justified`;
- `least privilege configured once != privilege drift controlled`.

## 2. Evidence base

Primary standards and mature-system documentation reviewed:

1. **Kubernetes RBAC privilege-escalation prevention** — Kubernetes prevents role creation/update that grants permissions the actor does not already possess unless the actor has explicit `escalate`; binding similarly has explicit privileged semantics. This is mature evidence that rights to *mint or attach rights* are themselves privileged capabilities and must be modeled separately from the final protected operation. <https://kubernetes.io/docs/reference/access-authn-authz/rbac/>
2. **Kubernetes ServiceAccount / projected tokens** — TokenRequest credentials can be short-lived, audience-scoped and bound to a concrete workload object; TokenReview can reject a bound token immediately after the bound object disappears, while offline OIDC validation may continue accepting it until expiration. Kubernetes also permits disabling automatic ServiceAccount token injection. This demonstrates that possession, audience, lifetime, object binding and validation mode materially affect the capability envelope. <https://kubernetes.io/docs/concepts/security/service-accounts/> and <https://kubernetes.io/docs/concepts/storage/projected-volumes/>
3. **Kubernetes RBAC good practices** — `escalate`, `bind`, `impersonate`, CSR approval and certain privileged resource access can create indirect escalation paths. This is failure evidence that an effect-capability inventory limited to direct verbs misses capability-minting and identity-substitution edges. <https://kubernetes.io/docs/concepts/security/rbac-good-practices/>
4. **SPIFFE/SPIRE SVID lifecycle** — workloads receive workload identity and short-lived keys/certificates via the Workload API; keys and trust material rotate. This is useful evidence for minimizing long-lived credential exposure while keeping identity issuance distinct from business authorization. <https://spiffe.io/docs/latest/deploying/svids/> and <https://spiffe.io/docs/latest/spiffe/concepts/>
5. **RFC 9700 — OAuth 2.0 Security Best Current Practice** — access-token privileges should be restricted to the minimum required and audience-restricted; refresh tokens for public clients require sender constraint or rotation. This is standards evidence that capability scope, audience and credential replay properties are independent dimensions. <https://www.rfc-editor.org/rfc/rfc9700.html>
6. **RFC 8693 — OAuth 2.0 Token Exchange** — explicitly distinguishes delegation from impersonation and permits actor/subject chains, target resource/audience and bounded scope/lifetime. This is strong evidence that authority propagation is not equivalent to copying identity and that token-exchange/delegation surfaces are themselves material privilege paths. <https://www.rfc-editor.org/rfc/rfc8693.html>
7. Existing G4 research on complete mediation, effect-path universe discovery, hierarchical rights, authorization/currentness, provider/driver boundaries, opaque evidence, recovery, split-brain, policy floors and evidence requalification.

These are benchmarks only. No Kubernetes RBAC/ServiceAccount mechanism, SPIFFE/SPIRE deployment, OAuth profile, IAM product, STS, token format, policy engine or secret manager is selected.

## 3. Material delta

The previous round introduced `EffectCapabilityEnvelopeRef` as an upper bound over principals/channels/resources that can commit a protected effect. The missing problem was that the envelope itself can drift without any business contract or application interface changing.

This round proposes:

> Effect-capability qualification is not merely a set of current credentials. It is a graph of direct effect capabilities plus capability-acquisition, delegation, impersonation, binding, minting, recovery and substitution edges, each scoped by effect, audience, tenant/trust domain, lifetime/currentness and authority provenance.

Therefore:

`cannot perform E directly != cannot acquire capability for E`.

and:

`credential inventory unchanged != privilege graph unchanged`.

The stronger object is a qualified envelope:

`EffectCapabilityEnvelope = <protected effect, direct holders, acquisition edges, delegation/impersonation edges, mint/bind/escalate rights, audiences, scopes, lifetimes, target constraints, recovery/break-glass channels, structural exclusions, currentness, limitations>`.

## 4. Direct rights and meta-rights must be distinct

A component may lack permission to perform protected effect E while retaining a right that can create or attach that permission.

Examples include:

- creating/updating a role containing E;
- binding another principal to a role containing E;
- impersonating a principal that has E;
- approving/issuing a credential that authenticates as a principal with E;
- exchanging a token into a token accepted by the target of E;
- installing a plugin/provider that inherits an effect-capable host credential;
- enabling recovery tooling that bypasses the normal mediation path.

Kubernetes's explicit `escalate`, `bind` and `impersonate` controls are a useful mature example of this distinction.

Candidate rule:

`meta-capability capable of producing E-right -> material member of E capability envelope`.

A least-privilege review that inspects only final operation verbs is therefore incomplete.

## 5. Delegation is not impersonation

RFC 8693 gives a useful implementation-independent distinction:

- **delegation** preserves the actor as a separate identity acting for a subject;
- **impersonation** allows the actor to act as the subject within the authorized context.

G4 generalizes:

`delegated authority != copied identity`.

The envelope should preserve, where material:

- authority source/subject;
- current actor/holder;
- delegation chain;
- target resource/audience;
- scope/operation;
- tenant/classification constraints;
- lifetime/currentness;
- whether further delegation is permitted;
- proof/authority reference.

Flattening a delegation chain into a single effective principal destroys evidence needed to reason about revocation, responsibility and privilege amplification.

## 6. Capability attenuation must be explicit

A derived credential or delegated right should not silently become stronger than its source unless an independently authorized authority explicitly grants the additional right.

Candidate invariant:

`derived capability <= authorized source capability within declared delegation semantics`.

But `<=` is not a universal numeric ordering. It is a multidimensional relation over operation, target, audience, tenant, classification, time, amount/quota, delegation depth and other contract-specific constraints.

Thus:

`narrower scope + broader audience != automatically attenuated`.

and:

`shorter lifetime != permission to broaden operation rights`.

A translation/adapter/STS may normalize representation but must not fabricate attenuation equivalence.

## 7. Audience and target binding are envelope dimensions

RFC 9700 recommends audience restriction because a bearer accepted by many resource servers has a larger effective capability envelope than a token accepted by one target.

Kubernetes projected ServiceAccount tokens similarly bind an audience and can bind the credential to a workload object.

Generalization:

`same nominal permission + broader acceptance set -> larger effect-capability envelope`.

Therefore a drift from target-specific to broadly reusable credentials is privilege expansion even if the role/scope string is unchanged.

## 8. Lifetime is not revocation

Short-lived credentials reduce exposure but do not by themselves provide immediate revocation.

Kubernetes provides a useful contrast: TokenReview can observe deletion of a bound object and reject the token immediately, whereas independent OIDC validation can continue accepting the same signed token until expiration.

Therefore:

`short-lived != immediately revocable`.

and:

`cryptographically valid != currently admissible`.

The capability envelope records both credential lifetime and the currentness/revocation mechanism relied upon by the protected effect.

## 9. Identity issuance is not business authority

SPIFFE is useful precisely because it demonstrates strong, short-lived workload identity without claiming business authorization semantics.

For G4:

`workload identity qualified != protected effect authorized`.

A workload may prove who it is while the capability owner separately decides whether that identity, delegation and current policy permit effect E.

The Exchange Plane may propagate identity/authority evidence but does not own the business decision.

## 10. Automatic credential propagation is privilege topology

Kubernetes automatically provides ServiceAccount credentials to Pods by default unless automount is disabled. The mechanism is product-specific, but the general failure mode is universal:

`credential injected for convenience -> new capability edge`.

Secret mounts, inherited environment variables, sidecars, host agents, shared sockets, SDK default credentials and instance/workload identity endpoints can all enlarge an effect envelope without changing business code.

Therefore deployment/configuration changes that alter credential propagation are `EffectCapabilityChangeTriggerRef` candidates.

## 11. Plugin installation is privilege composition

A plugin that executes inside a host process may inherit the host's credentials, network access, filesystem handles or provider clients.

Thus:

`plugin has no declared E permission != plugin cannot exercise host E capability`.

Safe structural exclusion may require a capability boundary that prevents the plugin from acquiring the host's effect channel, or qualified evidence that the plugin runtime/host mediation enforces the declared attenuation.

Signed plugin provenance does not prove least privilege.

## 12. Provider SDK and API growth can enlarge capability without credential change

A credential may remain byte-for-byte identical while a provider introduces a new operation accepted under an existing broad scope.

Therefore:

`credential unchanged != effect capability unchanged`.

Provider API/SDK/permission-model revisions that change what an existing credential can do are material envelope dependencies. This extends previous G4 provider/driver rules: a driver may expose new mechanism, but it cannot silently claim unchanged semantic capability coverage.

## 13. Recovery and break-glass rights are part of the envelope

Recovery, migration, operator and break-glass tools frequently possess broader privileges than steady-state workers.

They cannot be excluded merely because they are rarely active:

`rarely enabled != structurally incapable`.

The envelope therefore distinguishes dormant/conditional capability from absent capability. Activation requires explicit authority/currentness evidence and creates a requalification trigger for complete mediation where relevant.

## 14. Privilege drift is typed

Candidate drift classes:

- **holder drift** — a new principal/component obtains an existing effect capability;
- **scope drift** — operation/resource/tenant/classification scope broadens;
- **audience drift** — the credential becomes accepted by more targets;
- **lifetime drift** — validity or refresh horizon expands;
- **delegation drift** — new token-exchange/delegation/impersonation edges appear;
- **minting drift** — a component gains ability to issue/approve/bind/escalate rights;
- **propagation drift** — secrets/credentials become injected or shared with new workloads/plugins;
- **provider-semantics drift** — the same credential now authorizes new provider operations;
- **recovery drift** — break-glass/recovery paths gain new effect capability;
- **revocation-model drift** — validation changes from current online status to offline-until-expiry or otherwise weakens defeat responsiveness.

These classes must not be collapsed into `role changed=true`.

## 15. Drift detection is not semantic authority

IAM scanners, deployment controllers, secret managers and telemetry systems can detect changes, but they do not decide the business meaning of E.

`privilege drift detected != business contract changed`.

The capability/contract owner defines which envelope dimensions are material for the protected effect. A distributed controller may re-evaluate that declared contract from qualified local evidence.

## 16. Minimization objective

The goal is not a globally minimal permission set in the abstract. It is:

> no principal/component should possess, acquire, mint, delegate or inherit a protected effect capability beyond what is required by its declared role in the effect contract, under the applicable time/tenant/target constraints.

Therefore:

`least privileges by count != least effect capability`.

A single broad credential may be more dangerous than many narrow credentials.

A useful metric candidate is the **qualified capability surface**, not merely role count:

`surface = holders x acquisition paths x accepted targets x effect scope x validity/delegation dimensions`.

This is conceptual, not a prescribed scoring formula.

## 17. Runtime autonomy

Published runtimes must be able to enforce their locally required effect-capability constraints without Builder availability.

That implies locally sufficient evidence for:

- active workload/principal identity;
- locally effective credentials/capabilities;
- local delegation/binding state relevant to E;
- current floors/horizons required by the contract;
- structural exclusions relied upon by mediation proof.

A central IAM/control-plane inventory can accelerate discovery but cannot become mandatory semantic authority for an otherwise autonomous runtime.

Conversely:

`central inventory says minimized != local runtime necessarily minimized`.

Local drift can defeat stale central evidence.

## 18. Portability / exit path

The abstraction must survive replacement of IAM/token/secret/runtime providers.

Portable semantics are therefore expressed in terms of:

- holder/principal;
- protected effect;
- direct capability;
- acquisition/meta-capability;
- delegation/impersonation;
- target/audience;
- scope/tenant/classification;
- lifetime/currentness/revocation model;
- provenance/authority;
- structural exclusion;
- drift trigger.

Kubernetes verbs, SPIFFE IDs, OAuth scopes/claims, cloud IAM actions and OS capabilities are provider realizations, not canonical G4 semantics.

## 19. Candidate vocabulary

Research vocabulary only:

- `EffectCapabilityEnvelopeRef` — qualified direct + acquisition capability closure for a protected effect.
- `EffectCapabilityHolderRef` — principal/component capable of directly committing or acquiring E.
- `EffectCapabilityAcquisitionEdgeRef` — mechanism by which a holder can obtain E capability.
- `MetaCapabilityRef` — capability to mint, bind, escalate, approve, delegate, impersonate or otherwise create an E-capable right.
- `DelegatedEffectCapabilityRef` — effect right preserving actor/subject/delegation lineage.
- `CapabilityAttenuationRef` — qualified relation showing that a derived capability does not exceed its authorized source in material dimensions.
- `CapabilityAudienceRef` — accepted target/resource set for a credential/right.
- `CapabilityCurrentnessRef` — lifetime/revocation/validation evidence for the capability.
- `EffectCapabilityChangeTriggerRef` — material fact whose change requires envelope/mediation requalification.
- `PrivilegeDriftFindingRef` — qualified finding describing expansion/weakening relative to an approved envelope.
- `CapabilityStructuralExclusionRef` — evidence that a principal/path cannot acquire or exercise E capability.
- `CapabilityEnvelopeRevisionRef` — identity of a qualified envelope snapshot/closure.

These are not shared business entities or implementation commitments.

## 20. Candidate proof obligations

1. **PO-ECE-01 — Effect scope:** every envelope is bound to a named protected effect/contract.
2. **PO-ECE-02 — Direct + acquisition closure:** qualification covers direct effect rights and material ways to acquire them.
3. **PO-ECE-03 — Meta-right visibility:** mint/bind/escalate/approve/impersonate/delegate rights remain visible rather than being treated as ordinary administration.
4. **PO-ECE-04 — Delegation lineage:** delegated rights preserve actor/subject/authority lineage where material.
5. **PO-ECE-05 — No invented attenuation:** adapters/STS/drivers cannot claim a derived capability is narrower without qualification across material dimensions.
6. **PO-ECE-06 — Audience binding:** target/audience expansion is treated as capability expansion where it increases effect reachability.
7. **PO-ECE-07 — Lifetime/currentness separation:** expiry, online revocation, object binding and floor/currentness semantics are not collapsed.
8. **PO-ECE-08 — Identity separation:** workload identity evidence never becomes business-effect authority by itself.
9. **PO-ECE-09 — Credential propagation:** automatic/inherited credential exposure is part of envelope qualification.
10. **PO-ECE-10 — Dynamic extension inheritance:** plugins/extensions cannot inherit effect capability without appearing in the qualified envelope or being structurally mediated/excluded.
11. **PO-ECE-11 — Provider semantic drift:** provider permission/API changes that enlarge existing credentials trigger requalification.
12. **PO-ECE-12 — Recovery inclusion:** break-glass/recovery/operator capabilities are included when they can commit E.
13. **PO-ECE-13 — No central oracle:** envelope correctness for an autonomous runtime does not require Builder/IAM-control-plane availability when local evidence is sufficient.
14. **PO-ECE-14 — Structural exclusion scope:** exclusion evidence is effect/mechanism/revision scoped and cannot be generalized beyond its proof.
15. **PO-ECE-15 — Drift currentness:** a `MINIMIZED` disposition binds the envelope revision and material change triggers.
16. **PO-ECE-16 — Delegation depth:** transitive delegation is either bounded/qualified or represented as open/unknown; it is never assumed absent.
17. **PO-ECE-17 — Impersonation risk:** impersonation capability is represented as access to the impersonated rights context, not merely an identity-management operation.
18. **PO-ECE-18 — Credential replay:** sender/audience/target constraints relied upon for minimization are part of the proof, not implementation trivia.
19. **PO-ECE-19 — Unknown preservation:** opaque or unqualified acquisition edges remain `UNKNOWN/PARTIAL`, never silently absent.
20. **PO-ECE-20 — Capability monotonicity:** derived/delegated capability cannot be considered attenuated if any material dimension broadens without separate authority.
21. **PO-ECE-21 — Phase coverage:** bootstrap, steady state, upgrade, recovery and break-glass phases name their capability envelope where materially different.
22. **PO-ECE-22 — Tenant/classification preservation:** acquisition/delegation cannot silently drop tenant or classification restrictions.
23. **PO-ECE-23 — Mediation linkage:** complete-mediation claims depend on the current envelope qualification for the protected effect.
24. **PO-ECE-24 — Portability:** replacement of IAM/token/runtime provider can re-express the envelope without importing provider-specific semantics as canonical truth.

## 21. Adversarial cases

1. Worker cannot call `payment.commit`, but can bind itself to a role that can.
2. Operator cannot mutate business state directly, but has `impersonate` over a service identity that can.
3. Plugin declares read-only behavior but inherits the host's broad provider token.
4. Sidecar receives the same mounted secret as the main workload despite not needing E.
5. Broad cloud/workload identity credential is accepted by several targets while the design assumes one target.
6. Token lifetime is shortened and the system falsely claims immediate revocation.
7. Offline signature validation continues accepting a bound token after its workload/object should be defeated.
8. STS token exchange adds a delegation edge not present in the original role inventory.
9. Delegation chain is flattened and revoking the intermediate actor no longer invalidates the derived authority correctly.
10. Derived token has shorter expiry but broader resource audience and is mislabeled attenuated.
11. Provider adds a new mutating API under an existing broad scope; no IAM document changes.
12. Plugin installation grants code access to an already-open provider client/socket.
13. Recovery utility receives database owner credentials and bypasses the capability boundary.
14. Break-glass credential is dormant in a vault and therefore omitted from the envelope despite being activatable.
15. Automatic ServiceAccount/default credential injection gives a helper process effect reachability.
16. Secret copy remains after workload decommissioning and can be replayed elsewhere.
17. Role removal is observed centrally but a runtime-local cached credential remains usable within a longer horizon.
18. IAM scanner reports no direct E permission while missing `bind/escalate/impersonate` meta-rights.
19. Same OAuth `scope` string is treated as equivalent across providers whose resource/audience semantics differ.
20. Identity rotation is interpreted as authorization revocation even though the new identity receives equivalent rights automatically.
21. Credential rotation is interpreted as privilege reduction although the accepted target set broadened.
22. A driver normalizes two providers into one `canWrite=true` flag and hides that one credential can create sub-credentials.
23. A tenant-scoped delegated capability is translated into a provider token lacking tenant restriction.
24. Debug endpoint can request arbitrary token exchange and is omitted because it is not on the normal business call path.
25. Recovery failover restores an old role/binding snapshot below the local privilege floor.
26. Central control plane says a workload is deprivileged while the autonomous runtime has already received a local replacement credential.
27. Network policy blocks one target path, but the same credential is usable through a provider SDK endpoint outside that path.
28. Signed/approved plugin provenance is mistaken for proof that the plugin cannot exercise host privileges.

## 22. Trade-offs

### 22.1 Short-lived vs operational continuity

Short-lived credentials reduce exposure but increase dependence on issuance/rotation availability. Autonomous runtimes therefore need explicit issuance-outage behavior and cannot equate long-lived fallback credentials with unchanged security posture.

### 22.2 Fine-grained capabilities vs operational complexity

Narrow audience/scope/tenant credentials reduce blast radius but increase policy, rotation and debugging complexity. The research target is qualified effect-capability minimization, not maximal fragmentation.

### 22.3 Central inventory vs local truth

Central IAM inventory improves fleet analysis but can lag local runtime state. Local qualification preserves autonomy but increases distributed reconciliation work. Neither side is globally authoritative by topology alone.

### 22.4 Static prevention vs dynamic detection

Structural exclusion and least privilege are stronger than discovering drift after the fact, but dynamic provider/configuration systems prevent complete static closure in many deployments. Detection remains complementary evidence, not a substitute for exclusion.

## 23. Deduplication against existing G4 research

This document does **not** reopen:

- generic authorization-aware data access;
- effect-path discovery itself;
- complete-mediation gate semantics;
- generic credential/token implementation selection;
- provider compatibility generally;
- offline security floors;
- recovery authority reconciliation;
- opaque non-dependency proof;
- generic IAM architecture.

The material delta is specifically:

`effect-path universe -> effect-capability envelope -> direct + acquisition/meta-right closure -> delegation/impersonation/attenuation -> typed privilege drift -> selective mediation requalification without central semantic IAM authority`.

## 24. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This materially strengthens the complete-mediation line, but does not saturate family 8.

Highest-value next gap:

> **delegation-chain attenuation and revocation under autonomous/offline runtimes** — determine how a runtime can prove that a transitive delegated capability remains no stronger than its source and remains admissible when issuer/delegator revocation/currentness information may be temporarily unavailable, including chain truncation, audience/scope translation, provider-specific permission models, break-glass delegation and rejoin reconciliation, without making a central STS/IAM service mandatory for every effect.

## 25. Research posture

No implementation is authorized by this document. Any future adoption requires explicit planning authority, provider qualification and repository process.
