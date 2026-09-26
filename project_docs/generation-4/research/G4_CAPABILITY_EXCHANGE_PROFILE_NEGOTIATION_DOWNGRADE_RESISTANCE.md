# G4 — Proof-Semantics Profile Negotiation & Downgrade-Resistant Federation

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the highest-value gap from normative proof-semantics governance: determine how autonomous capabilities/runtimes can discover, advertise and select immutable proof-semantics profiles under version skew without allowing a peer, intermediary or stale topology to force a weaker-but-still-supported profile; how unsupported theories/extensions remain explicit; how rolling upgrades avoid global lockstep; and how the selected semantic identity survives transport substitution.

This is not a new macro-family. It selects no negotiation protocol, proof language, verifier, service mesh, broker, RPC stack, gateway or provider and grants no implementation authority.

## Evidence classes reviewed

Primary/mature evidence used in this round:

- TLS 1.3 / RFC 8446: authenticated handshake negotiation, explicit `supported_versions`, transcript protection and downgrade sentinels; importantly, interoperability with older endpoints is permitted while attacker-induced downgrade is separately constrained.
- QUIC Compatible Version Negotiation / RFC 9368: endpoints validate version information so an attacker cannot force a version different from the one the endpoints would have chosen absent attack; rollout guidance distinguishes Acceptable, Offered and Fully Deployed versions and explicitly documents downgrade exposure during mixed deployment.
- Kubernetes version-skew policy: bounded asymmetric compatibility windows and upgrade ordering demonstrate that rolling evolution can be explicit without requiring global lockstep.
- TUF metadata roles: snapshot metadata prevents mixing metadata from different repository states, while short-lived timestamp metadata helps detect stale/frozen views; useful precedent for separating integrity, consistency and currentness.
- SPIFFE Federation: trust-domain identity, endpoint profile and location are configured separately; redirected topology must preserve the originally configured identity/authentication semantics.
- HTTP/RFC 6906 profile/content negotiation: representation format/profile selection is useful evidence for explicit capability advertisement but is insufficient as a security downgrade protocol because ordinary HTTP preference negotiation can be ignored or weakened by application semantics.
- Prior G4 contract compatibility, in-flight evolution, offline security floors, semantic policy diff, proof-carrying runtime verification, verifier trust continuity and normative semantics governance.

Representative references:
- https://www.rfc-editor.org/rfc/rfc8446.html
- https://www.rfc-editor.org/rfc/rfc9368.html
- https://kubernetes.io/releases/version-skew-policy/
- https://theupdateframework.io/docs/metadata/
- https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/
- https://www.rfc-editor.org/rfc/rfc6906.html
- https://www.rfc-editor.org/rfc/rfc9110.html

## 1. Supported does not mean admissible for this interaction

The central boundary is:

```text
locally supported profile
!= profile admissible for this exchange
```

A runtime may retain S1 for historical verification or compatibility while policy requires S3-or-newer for a security-sensitive new effect. Therefore negotiation cannot simply compute an arbitrary intersection of supported profiles.

Candidate distinction:

```text
SupportedProfiles
AdmissibleProfiles(interaction, policy, securityFloor, currentness)
PreferredProfiles
SelectedProfile
```

The selected profile must come from the admissible intersection, not merely the supported intersection.

## 2. Negotiation is a policy decision over a compatibility vector

A proof-semantics profile is not a scalar version number. Prior G4 work already separates language, calculus/rules, theories and extensions. Negotiation therefore needs to preserve the complete semantic identity and relevant guarantee vector.

```text
NegotiableProfile
  immutableSemanticsSnapshotRef
  calculus/ruleSetRef
  theorySetRefs[]
  extensionRefs[]
  verifierQualificationClass
  security/admissibility floor
  resource/checking profile
  transition/compatibility evidence refs
```

Research vocabulary only; not a schema commitment.

`highest version wins` is unsafe when profiles are partially ordered, extensions differ, or a newer profile intentionally removes a dangerous feature.

## 3. Downgrade resistance is stronger than preference ordering

TLS 1.3 and QUIC provide the key reusable principle:

```text
negotiated result
should equal the result the honest peers would have selected
without attacker interference
```

A peer/intermediary that can delete advertised stronger profiles must not silently force a weaker profile when both honest endpoints could have selected the stronger admissible profile.

Candidate obligation: bind the offer set, relevant policy/floor context and selected immutable profile into authenticated exchange evidence or an equivalently protected negotiation transcript.

This does not require TLS/QUIC adoption; it extracts the semantic property.

## 4. Anti-downgrade is not 'always choose newest'

```text
anti-downgrade != numerically newest profile
```

A newer profile may be experimental, incompatible, missing a required theory, or not fully deployed. A legitimate old peer may support only S1. The correct result can be explicit incompatibility, a bounded compatibility profile, or a qualified mediation path.

The security property is not maximal version selection; it is prevention of unauthorized weakening relative to declared admissibility and preference policy.

## 5. Negotiation must fail closed when no admissible common profile exists

```text
no common admissible profile
!= permission to fall back to any common supported profile
```

Candidate dispositions:

```text
NEGOTIATED(profileRef)
INCOMPATIBLE_NO_COMMON_PROFILE
INCOMPATIBLE_SECURITY_FLOOR
UNSUPPORTED_THEORY_OR_EXTENSION
NEGOTIATION_EVIDENCE_INVALID
CURRENTNESS_UNKNOWN
QUALIFIED_MEDIATION_REQUIRED
```

For a security-sensitive interaction, `UNKNOWN` remains non-authorizing.

## 6. Rolling upgrade needs deployment-state distinctions

QUIC RFC 9368 materially sharpens the G4 model by separating versions that are acceptable, offered and fully deployed. During a mixed rollout, endpoints can legitimately encounter old and new instances, and the RFC explicitly notes a downgrade window for versions not fully deployed.

G4 should therefore avoid a binary `supported=true` rollout model. Candidate states include:

```text
KNOWN
ACCEPTABLE_FOR_INBOUND
OFFERABLE
PREFERRED
FULLY_DEPLOYED_FOR_SCOPE
RETIRING
HISTORICAL_ONLY
SECURITY_REVOKED
```

These are research semantics, not implementation states.

A profile may be locally executable but not safe to advertise for new effects. Removal likewise needs staged withdrawal so in-flight work and old peers are handled explicitly.

## 7. Version skew is a bounded contract, not accidental tolerance

Kubernetes provides mature operational evidence that skew can be intentionally asymmetric and role-specific. Different component relationships have different permitted windows, and upgrade order follows those constraints.

Reusable principle:

```text
version skew allowance = declared relationship-specific contract
```

For G4, capability A may permit profile S2/S3 with B while another security boundary requires exact S3. There should be no platform-wide assumption that one skew number fits every capability or interaction class.

## 8. Semantic profile identity must survive transport substitution

The Exchange Plane hypothesis requires local call, IPC, HTTP/gRPC, broker, stream or file exchange to be realizations of an exchange contract where qualified.

Therefore:

```text
transport negotiation != semantic negotiation
```

HTTP/2 vs HTTP/3, direct call vs broker, or sidecar vs ambient routing must not silently change the selected proof semantics. The immutable profile identity belongs to exchange evidence/contract context, not to a transport-specific side channel that disappears when topology changes.

Local/in-process optimization must execute under the same semantic profile selection rules as remote deployment unless the contract explicitly declares a different operational guarantee.

## 9. Gateway, mesh and broker must not renegotiate semantics invisibly

An intermediary may route, enforce quotas, authenticate, translate protocol or provide delivery machinery. It must not silently select a weaker semantic profile merely because both endpoints technically support it.

```text
gateway route selection != authority to weaken semantics
service mesh negotiation != business/proof semantic governance
broker compatibility != semantic compatibility
```

If an adapter performs semantic mediation, the mediation relation and lossiness must be explicit evidence, and the target capability decides whether the mediated guarantee is admissible.

## 10. Unsupported theory/extension is a compatibility fact, not a translation invitation

If peer A requires extension E2 and peer B understands only E1:

```text
unsupported E2
-> explicit incompatibility or qualified mediation
```

A driver/adapter cannot map E2 to E1 merely because the syntax is similar. A mediation path needs a declared relation such as conservative reduction, proof translation with qualification, or lossiness that policy explicitly accepts.

`protocol translation succeeded` remains weaker than `semantic contract preserved`.

## 11. Negotiation evidence needs peer and scope binding

A previously successful negotiation with capability B must not automatically authorize capability C or another tenant/classification scope.

Candidate binding dimensions:

```text
initiator capability/trust identity
responder capability/trust identity
contract/interaction kind
immutable selected profile
relevant offer/admissibility evidence
security-floor/currentness evidence
policy/authority context
negotiation time/horizon
correlation/causation refs where applicable
```

Correlation remains distinct from identity proof and authority.

## 12. Capability advertisement must not become canonical truth

Peer advertisements are claims about support/deployment state. They are not canonical business state and do not prove actual effect semantics by themselves.

```text
peer advertises S3 != peer executed effect under S3
```

The selected profile and later proof/effect evidence remain separate. A stale discovery cache, registry or gateway must not convert advertised support into false successful execution.

## 13. Currentness and consistency remain independent

TUF provides useful precedent: snapshot metadata prevents mixing repository states, while timestamp freshness addresses stale/freeze views. Applied abstractly:

```text
consistent capability/profile view != sufficiently current view
```

A negotiation can be internally consistent yet too stale for the interaction's security horizon. Conversely, a fresh advertisement from one source does not prove a coherent multi-artifact profile if its theory/rule dependencies are mixed across revisions.

## 14. Federation bootstrap requires identity before capability claims

SPIFFE Federation provides a useful trust-boundary precedent: trust domain, endpoint profile and endpoint location are separate parameters; redirects must preserve the expected authenticated identity semantics.

For G4:

```text
network endpoint reached != intended semantic peer authenticated
```

Capability/profile negotiation must be bound to the intended peer/trust context. Discovery or topology redirection cannot silently substitute another semantic authority merely because it offers a compatible interface.

## 15. Cached negotiation is bounded evidence

Negotiating every message may be unnecessary, but cached results need explicit invalidation dimensions:

- peer identity/trust binding changed;
- selected profile or dependency was security-superseded;
- local/peer admissibility floor advanced;
- contract/policy changed;
- cache/currentness horizon expired;
- deployment scope changed during rollout;
- required theory/extension qualification changed.

```text
previously negotiated != indefinitely admissible
```

Offline operation may use locally durable negotiation/qualification evidence only within declared horizons, preserving the earlier G4 autonomy/security-floor boundary.

## 16. Selection policy must resist preference manipulation

An ordered offer list alone is insufficient if an attacker can truncate or reorder it. The policy should be defined independently of wire ordering, for example as a deterministic selection over authenticated candidate sets and local admissibility rules.

Candidate conceptual function:

```text
select(
  localAdmissible,
  peerAdmissibleClaims,
  contractRequirements,
  securityFloor,
  transitionEvidence,
  deploymentState
) -> selectedProfile | explicitFailure
```

No algorithm is selected. The obligation is that the result be reproducible/auditable from qualified inputs and not depend on unauthenticated preference manipulation.

## 17. Capability/profile discovery and negotiation are different stages

Discovery can answer where a capability/provider might be and what it claims to support. Negotiation establishes what this interaction will use.

```text
discovered support != negotiated contract
```

A registry, service discovery system or schema registry may narrow candidates but cannot replace bilateral/qualified contract selection where security or semantics require it.

## 18. Negotiation and business effect remain separate

Even after a profile is selected:

```text
profile negotiated != command accepted
command accepted != business effect
business effect != convergence
```

This preserves prior G4 exchange boundaries. Negotiation evidence can establish the semantic rules under which later evidence should be interpreted; it cannot prove the later effect occurred.

## 19. Candidate proof obligations

Before implementation planning, prove or explicitly bound:

1. a locally supported profile is not automatically admissible for every interaction;
2. profile selection uses immutable semantic identities, not mutable `latest` aliases;
3. no common admissible profile yields explicit failure/qualified mediation rather than silent fallback;
4. attacker removal/reordering of stronger advertised profiles cannot force an unauthorized weaker selection;
5. selection is bound to authenticated peer/trust identity and interaction scope;
6. language/rule/theory/extension dimensions remain visible through negotiation;
7. unsupported semantics cannot be fabricated by driver/adapter/provider translation;
8. security floors override compatibility preference for new effects;
9. historical-only profiles remain usable for qualified audit without becoming new-effect negotiation candidates;
10. rollout state distinguishes locally acceptable, offered/preferred and fully deployed profiles where required;
11. version-skew policy is relationship/interaction-specific rather than a universal platform number;
12. selected semantic identity survives direct-call/RPC/broker/stream/file transport substitution;
13. gateways/meshes/brokers cannot silently renegotiate semantic guarantees;
14. local/in-process optimization does not bypass the same semantic selection/admissibility rules;
15. cached negotiation evidence expires or invalidates when peer identity, policy, security floor, profile dependency or deployment scope changes;
16. consistent negotiation evidence is separately checked for currentness;
17. discovery advertisements are claims, not canonical truth or proof of executed semantics;
18. topology redirects preserve intended peer/trust identity and cannot substitute semantic authority silently;
19. rolling upgrade can proceed without global lockstep while keeping downgrade exposure explicit and bounded;
20. profile negotiation evidence remains distinct from command ACK, effect proof and convergence evidence;
21. client runtime autonomy does not require live Builder/central registry access when locally qualified negotiation/profile material is within horizon;
22. retirement of a weak profile cannot be bypassed by a peer merely advertising it as supported.

## 20. Adversarial cases

1. attacker strips S3 from an offer so peers fall back to mutually supported S1;
2. intermediary reorders preferences so weaker S2 wins over admissible S3;
3. peer advertises S3 but executes/verifies under S2;
4. `latest` alias changes between negotiation and proof verification;
5. two peers advertise the same language version with different theory revisions;
6. gateway terminates RPC and silently maps S3 request to S1 backend;
7. service mesh is treated as semantic governance because it authenticated transport endpoints;
8. broker strips profile metadata and consumer assumes its local default;
9. in-process fast path bypasses negotiation enforced on remote calls;
10. cached successful negotiation survives security revocation of the selected profile;
11. stale service discovery says S3 is deployed although traffic can reach S2-only replicas;
12. rolling deployment offers S3 before all reachable instances can honor it;
13. profile S1 is retained for historical audit and accidentally remains selectable for new effects;
14. adapter translates unknown E2 extension to syntactically similar E1 without semantic proof;
15. HTTP content negotiation returns a representation despite an unmet semantic profile requirement and caller treats it as compatible;
16. peer's supported-set advertisement is signed but stale beyond the interaction security horizon;
17. topology redirect reaches a different trust domain that advertises compatible schemas;
18. negotiation succeeds for tenant A and cached result is reused for tenant B with a stricter classification floor;
19. negotiation evidence proves selected profile but is mistaken for proof that the command took effect;
20. central registry outage blocks autonomous runtime although exact peer/profile bindings remain locally qualified and current;
21. one central negotiator outage disables all cross-capability traffic by architecture rather than declared dependency;
22. malicious peer keeps advertising a retired weaker profile hoping old clients will select it.

## 21. Material synthesis

Durable boundaries added by this round:

```text
Supported profile != admissible profile for this interaction
Anti-downgrade != always choose numerically newest
No common admissible profile != fallback to any common supported profile
Negotiated semantics != transport negotiation
Version skew allowance = relationship-specific contract
Discovered support != negotiated contract
Peer advertises profile != effect executed under profile
Consistent profile view != sufficiently current profile view
Network endpoint reached != intended semantic peer authenticated
Previously negotiated != indefinitely admissible
Profile negotiated != business effect
```

The implementation-independent hypothesis is therefore: profile negotiation belongs to exchange semantics, but selection is a policy-constrained, downgrade-resistant agreement over immutable semantic identities and guarantee dimensions, not ordinary feature discovery. Rolling upgrades can avoid global lockstep by declaring bounded skew and staged deployment states, while security floors and authenticated negotiation evidence prevent weaker compatibility support from becoming an attacker-controlled downgrade path. The selected semantic identity must survive topology and transport changes; gateways, meshes, brokers and adapters may carry or mediate it only under declared authority and compatibility evidence.

## 22. Maturity and next gap

This round materially changes the federation/version-skew boundary, so it is not `NO_MATERIAL_DELTA`.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value remaining gap: **negotiation evidence lifecycle under concurrent rollout, partition and rollback** — determine how an already-selected profile is treated when one peer advances/retirements occur mid-session or mid-workflow; how long-lived streams and asynchronous queued work pin or renegotiate semantic profiles; how partitioned runtimes reconcile negotiation evidence after security-floor advancement; and how profile rollback/recovery avoids both global lockstep and silent reinterpretation of in-flight obligations.

No negotiation protocol, proof language, verifier, service mesh, broker, RPC stack, gateway or provider is selected.