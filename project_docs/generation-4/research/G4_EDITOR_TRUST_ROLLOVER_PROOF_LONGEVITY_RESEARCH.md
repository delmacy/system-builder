# G4 — Editor Trust Rollover, Split-Brain Recovery & Proof Longevity Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

Continuation of the proprietary-editor Shared Editor Foundation research, especially `G4_EDITOR_VERIFIER_PRIVACY_FINDINGS_UX_RESEARCH.md`. This round focuses on trust-anchor rollover, split-brain trust recovery, cryptographic agility and long-lived proof envelopes used across Workflow Designer, Componentes, View/Page Builder, Form Builder, Rules/Decision Editor, System/Module Designer, Elicitation, Preview/Sandbox and Revision/Diff.

This is P&D documentation only. It creates no implementation, provider, WBS, Work Package, Sprint or TASK authority. `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool` remains the current product-interface program; 3D remains optional.

## External pattern evidence reviewed

- NIST SP 800-131A treats transitions between algorithms/key lengths as planned lifecycle work rather than exceptional break-glass behavior; NIST also preserves old algorithm specifications where historical protected information may still need handling after new-use termination.
- NIST SP 800-57 Part 1 treats trust anchors, compromise, archival and key lifecycle as distinct key-management concerns.
- Sigstore uses a TUF-governed trust root to distribute changing verification material. Its threat model explicitly includes threshold root signing, offline root keys, key rotation, compromise-time-aware revocation and freshness against stale trust metadata.
- Sigstore's policy-controller supports remotely updated TUF roots and also air-gapped serialized roots, where rotation becomes an explicit/manual lifecycle concern.
- Controlled Identifier guidance describes verification-method rotation as adding new verification material before deactivating old material, reinforcing overlap rather than instantaneous replacement.
- in-toto distinguishes signed metadata, authorized functionaries and verification rules; signed bytes alone do not establish semantic admissibility.

These are architectural pattern evidence only. No cryptographic suite, vendor, legal regime or provider is selected by this research.

## F105 — Trust-root rollover is a versioned trust transition, not key replacement in place

A verifier trust domain needs immutable trust-set revisions. Candidate research contract:

```text
TrustSetRevision
  trustDomainId
  revisionId
  predecessorRevisionRefs[]
  anchorRefs[]
  acceptedAlgorithmProfiles[]
  thresholdPolicy?
  effectiveFrom
  acceptanceWindow
  historicalVerificationPolicy
  status = PROPOSED | OVERLAP | CURRENT | RETIRED | COMPROMISED | UNKNOWN
  qualificationEvidenceRefs[]
```

Rollover creates a new revision and an overlap/cutover relationship. It does not mutate the historical trust set that was used to admit an old proof.

`new anchor present != old anchor retired`.

## F106 — Generation, admission and historical verification have different cryptographic floors

A single `algorithm allowed/denied` flag collapses materially different questions. The foundation should distinguish at least:

```text
CryptographicAdmissibility
  newProofGeneration
  newProofAdmission
  historicalVerification
  requalification
  migration/renewal
```

An algorithm can be prohibited for new proof generation while historical proofs remain interpretable under a bounded policy. Conversely, compromise can make historical claims require retrospective review.

`not allowed for new proof != historical proof false`.

## F107 — Proof envelopes need crypto-agile identity and semantic identity separately

A long-lived proof must not make one digest/signature algorithm part of the semantic identity of the claim.

Candidate envelope:

```text
ProofEnvelope
  proofSemanticId
  claimSemanticSnapshotRef
  subjectRevisionRefs[]
  verifierQualificationRef
  trustSetRevisionRef
  evidenceManifestRef
  digestSet[] = {algorithm, digest, scope}
  signature/attestationRefs[]
  timestamp/orderingEvidenceRefs[]
  renewalRefs[]
  retention/disclosureRef
  verificationDisposition
```

`claim identity != hash algorithm != signature key`.

Multiple digest/signature representations may coexist during transition without creating two business claims.

## F108 — Proof renewal preserves lineage; it does not rewrite the original proof

When cryptographic material approaches retirement, a surviving proof can be renewed/re-attested where policy and retained evidence permit. Renewal creates a new envelope linked to the predecessor and states what was actually revalidated.

```text
ProofRenewal
  predecessorProofRef
  renewalReason
  sourceEvidenceAvailable
  semanticRevalidationScope
  newDigest/signatureProfile
  renewedAt
  renewalVerifierQualificationRef
  result = RENEWED | PARTIAL | IMPOSSIBLE | UNKNOWN
```

Re-signing an old digest without sufficient source/provenance must not be presented as fresh semantic requalification.

`cryptographic renewal != semantic requalification`.

## F109 — Tombstones also require crypto agility and cannot become eternal proof by hash alone

A retained tombstone/digest may establish that a referenced byte sequence was once bound to an envelope, but it cannot reconstruct deleted semantics. If its algorithm becomes inadmissible, a migration is possible only if enough trustworthy predecessor material remains to bind old identity to a new digest/profile.

Candidate states:

`VERIFIABLE`, `HISTORICALLY_INTERPRETABLE`, `CRYPTOGRAPHICALLY_LEGACY`, `RENEWAL_REQUIRED`, `RENEWAL_IMPOSSIBLE`, `UNKNOWN`.

`digest retained != semantic proof retained` remains invariant.

## F110 — Split-brain trust is a first-class reconciliation state

Offline/partitioned Clients can legitimately observe different trust-set revisions. Reconnection must not choose whichever side has the numerically newest revision or wall-clock timestamp.

```text
TrustFork
  trustDomainId
  commonAncestorRef
  branchARef
  branchBRef
  affectedProof/admissionSets
  conflictingAnchor/policyChanges[]
  securityFloorObservations[]
  reconciliationAuthorityRef?
  disposition = COMPATIBLE_OVERLAP | REQUIRES_RECONCILIATION | QUARANTINED | UNKNOWN
```

`connectivity restored != trust reconciled`.

If one branch revoked an anchor while another admitted new proofs through it, those occurrences remain historical facts. Reconciliation determines their admissibility/remediation; it does not erase them.

## F111 — Anti-rollback for trust metadata must survive restart, cache loss and offline operation

A runtime/editor that has observed a stronger minimum trust/security floor must not silently accept an older trust revision merely because a cache was restored, a snapshot was rolled back or the control plane is unreachable.

The research therefore needs a monotonic `ObservedTrustFloor` concept separate from ordinary cache freshness.

`older metadata validly signed != admissible after stronger floor observed`.

Offline operation may continue only within explicitly retained trust/currentness horizons; absence of fresh trust metadata becomes `STALE/UNKNOWN`, not permission to downgrade.

## F112 — Cross-domain bridges are versioned dependencies of proofs and publishes

`TrustBridgeQualification` itself needs revision identity. If Factory changes the bridge that accepts Client-domain proofs, old bundles remain pinned to the bridge revision actually used. A new bridge revision can invalidate current publish readiness without rewriting historical admission.

This extends impact-graph edges with at least:

`DEPENDS_ON_TRUST_SET`, `DEPENDS_ON_TRUST_BRIDGE`, `DEPENDS_ON_ALGORITHM_PROFILE`, `DEPENDS_ON_RENEWAL_POLICY`.

## F113 — Shared Editor Foundation needs a Trust Transition/Diff projection

Revision/Diff should project trust transitions alongside artifact/effect history without owning trust semantics. Candidate views:

- trust-set revision diff;
- anchor added/retired/revoked;
- algorithm-profile transition;
- overlap/cutover window;
- affected verifier qualifications;
- affected proof envelopes/bundles;
- historical-only versus new-admission impact;
- renewal coverage and impossible-renewal set;
- split-brain branches and reconciliation evidence.

A visually small trust-policy change can have a very large semantic blast radius, so Impact Diff must consume these edges.

## F114 — Preview/Sandbox must pin trust assumptions but cannot prove production trust state

Preview may emulate verifier/trust decisions to test UX and binding behavior, but its result must declare the trust-set revision/profile/substitutions used. Production publish/effect qualification rechecks the actual environment/trust domain.

`preview trust simulation != production trust qualification`.

A Preview passing under a synthetic anchor cannot satisfy a production authorization gate unless the production contract explicitly accepts that evidence class.

## F115 — Trust transition UX must distinguish BLOCKED, STALE, UNKNOWN and PERMISSION_DENIED

Examples:

- retired algorithm requiring renewal: `BLOCKED` for new publish, possibly historically interpretable;
- trust metadata beyond freshness horizon: `STALE` or `UNKNOWN` depending on available basis;
- user cannot inspect anchor details: `PERMISSION_DENIED`/disclosure-limited, not UNKNOWN trust truth;
- verifier unavailable: operational unavailability does not automatically revoke qualification.

This state separation must be reused by Workflow, Componentes, Form, View, Rules, Preview and Revision/Diff instead of each editor inventing badges.

## F116 — Trust-root operations require non-drag, reviewable and recoverable interaction paths

Anchor rollover/reconciliation is high-impact. Drag/drop may assist ordering or mapping but cannot be the only interaction. Required equivalent flows include list/tree/Inspector and command-driven review with keyboard operation, explicit before/after state, affected-set navigation and focus restoration by semantic identity.

Responsive collapse must never hide the critical distinction between `activate new anchor`, `retire old anchor`, `revoke compromised anchor` and `accept historical proof only`.

## Semantic bridge impact

The existing cross-app chain is extended without collapsing ownership:

```text
Artifact revisions
 -> typed bindings
 -> PublishBundle qualification
 -> TrustSetRevision + TrustBridgeQualification
 -> qualified verifier
 -> ProofEnvelope / Preview evidence
 -> authorization / publish
 -> runtime EffectOccurrence
 -> authoritative effect verification
 -> proof renewal / retention / disclosure
 -> privacy-safe correlation / conformance
 -> Revision/Diff + findings
```

Workflow owns workflow semantics; View/Form/Component own interaction artifacts; Command/Action owns effect intent; Permission/Policy owns authority; trust-domain governance owns trust transitions; Evidence owns proof lineage; Preview remains simulation; Revision/Diff is projection; Elicitation may propose remediation but cannot activate trust changes.

## Required scenarios / adversarials

1. New anchor is installed but old anchor remains inside overlap: both can be admissible only under declared transition policy; do not infer cutover from presence.
2. Old anchor is compromised with compromise time known: new admissions fail; historical proofs before/after the affected interval are classified according to explicit review policy.
3. Client remains offline across rollover and returns with a validly signed but stale trust root: do not silently downgrade local/Factory floor.
4. Two partitions each rotate trust differently: reconnection creates `TrustFork`; newest timestamp does not choose a winner.
5. Algorithm is retired for generation but old evidence must remain readable: historical verification path stays distinct from new-admission path.
6. Proof envelope contains only a legacy digest and payload was deleted: report renewal impossible/legacy according to policy; do not fabricate a modern digest.
7. Payload survives and legacy proof has qualified provenance: renewal can bind a new digest while retaining predecessor lineage.
8. A verifier is re-signed by a new anchor but its semantic verifier contract changed: cryptographic continuity does not imply semantic equivalence; requalification is required.
9. Trust bridge changes after a PublishBundle was qualified: historical bundle remains pinned; a not-yet-effective candidate becomes stale/requalification-required.
10. Preview uses synthetic trust material and passes while production anchor is revoked: preview remains valid only for its declared simulation claim; production publish is blocked/unknown as appropriate.
11. Responsive UI collapses the trust panel: revoke/retire/activate distinctions remain reachable and labelled through keyboard-accessible commands.
12. Focused proof disappears from a filtered list after renewal: focus restores to semantic proof lineage/renewal object, not a recycled DOM row.
13. Trust metadata update ACK is received but only part of runtime fleet observes it: `ACK != effective trust rollout`; fleet/currentness evidence remains partial.
14. Historical proof was accepted under trust revision R5; R7 tightens policy: current admissibility can change without rewriting the R5 historical fact.
15. Key rotation succeeds cryptographically but evidence retention policy deletes the source needed for future semantic requalification: UI exposes the resulting longevity limitation.

## Reusable primitives and editor integration

### Shared primitive

- `TrustSetRevisionRef`, `AlgorithmProfileRef`, `ObservedTrustFloor`, proof longevity/currentness badges, renewal disposition, trust-fork disposition.

### Editor infrastructure

- Trust/Evidence Inspector extensions;
- Trust Transition/Diff projection;
- Proof Lineage/Renewal browser;
- impact-graph edges for trust/algorithm dependencies;
- shared command qualification for activate/retire/revoke/reconcile;
- findings groups for trust-transition blast radius.

### Proprietary apps

- Workflow Designer: pins evidence/verifier requirements, never owns trust roots.
- Componentes/View/Form: expose trust-dependent bindings/states only through shared qualification projections.
- Rules/Decision: policy/rule revision may depend on qualified trust evidence but cannot reinterpret signature validity as business truth.
- System/Module Designer: declares trust-domain integration requirements/bridges without making topology a trust grant.
- Preview/Sandbox: pins simulated trust assumptions and clearly labels substitutions.
- Revision/Diff: primary projection for trust transition, impact and proof lineage.
- Elicitation: may create remediation proposals from stale/legacy trust findings; cannot activate them.

### Cross-app semantic integration

The highest complexity remains the interaction of immutable artifact revisions, trust-set revisions, verifier qualification, authorization, effect evidence, retention and historical/current admissibility. This is a P3 concern and must not be hidden inside React component state.

## Componentization / complexity

- **P0 LOW/MEDIUM — shared primitives:** trust revision refs, lifecycle/status badges, algorithm-profile labels, proof-renewal states.
- **P1 MEDIUM/HIGH — editor infrastructure:** Trust Transition viewer, Proof Lineage browser, impact/finding aggregation, keyboard-accessible trust commands.
- **P2 HIGH/VERY HIGH — proprietary app adapters:** app-specific proof requirements, trust-aware Preview qualification, Revision/Diff semantic projections.
- **P3 EXTREME — cross-app integration:** anti-rollback floors, split-brain reconciliation, retrospective compromise impact, cross-domain bridge revisioning, crypto-agile proof longevity under retention constraints.

State explosion hotspot: `trust revision × verifier revision × algorithm profile × claim kind × environment × authority policy × evidence retention/currentness`. UI must project qualified summaries and drill-down rather than encode this Cartesian product as ad-hoc component variants.

## Componentes metadata candidates — delta

```text
trustSetRequirementRefs[]
trustBridgeRequirementRefs[]
algorithmProfileRequirementRefs[]
proofLongevityPolicyRef?
proofRenewalPolicyRef?
historicalVerificationRequirement?
trustCurrentnessRequirement?
```

These augment, rather than duplicate, existing verifier/evidence/permission/currentness metadata.

## Proof obligations

1. Rollover cannot silently convert an old proof into a proof under the new trust revision.
2. Historical verification remains reproducible against the trust revision/policy actually used, subject to retained evidence and security policy.
3. Stronger observed trust/security floor cannot be rolled back by stale cache/snapshot metadata.
4. Split-brain trust reconciliation never uses wall-clock/latest-version alone to manufacture authority.
5. Revocation/compromise preserves historical occurrences while applying explicit prospective/retrospective admissibility policy.
6. Proof renewal preserves predecessor lineage and declares whether semantics were revalidated or only cryptographic protection renewed.
7. Deleted source evidence cannot be reconstructed from a digest; renewal limitations remain explicit.
8. Trust/algorithm changes propagate through the impact graph to affected bundles/proofs/findings without global invalidation where dependency lineage proves irrelevance.
9. Preview trust assumptions are visible and cannot satisfy production truth implicitly.
10. Every trust-critical action has keyboard/non-drag equivalent, stable semantic focus and responsive access.
11. `ACK != effective rollout` for trust metadata distribution.
12. Cross-domain bridge acceptance remains claim/scope/revision-qualified; trust is not accidentally transitive.

## Research maturity / saturation

`EDITOR_TRUST_ROLLOVER_PROOF_LONGEVITY = ADVANCED_EMERGING / MATERIAL_DELTA`.

High-confidence conclusions:

- trust rollover is a versioned semantic/security transition, not in-place key mutation;
- generation, new admission and historical verification require separate algorithm policies;
- proof semantic identity must survive digest/signature rotation;
- split-brain trust is a reconciliation problem, not a latest-wins problem;
- anti-rollback requires durable observed floors beyond ordinary cache freshness;
- proof renewal and semantic requalification are distinct;
- retention can make future renewal/requalification impossible, which must remain representable;
- shared editor infrastructure can project trust transitions without owning trust semantics.

Remaining material gaps:

1. precise trust-fork reconciliation authority/quorum models across Factory/Client/offline runtimes;
2. timestamp/notary/transparency evidence needed for very-long-lived proofs after signer/key retirement;
3. migration semantics when canonical serialization itself changes, not only hash/signature algorithms;
4. user-facing blast-radius prioritization for mass proof renewal;
5. empirical scale budgets for trust-impact propagation and proof-lineage indexes.

Next vector: long-lived proof preservation under canonicalization/schema changes and timestamp/transparency evidence, followed by bounded trust-fork reconciliation models. Research remains non-executable.