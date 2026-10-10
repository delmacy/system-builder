# G4 — Self-Hosting, Autonomic Control & Bounded Self-Evolution

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Last evidence consolidation: 2026-09-17

## Thesis

The System Builder may eventually model, observe, diagnose, build, validate, release and upgrade itself through the same governed lifecycle used for client systems.

`System Builder can model System Builder`.

But:

`Self-managing != unrestricted self-modifying` and `Self-model != root authority`.

## Proposed trust layering

```text
ROOT / CONSTITUTIONAL TRUST
  constitution/invariants
  trust keys
  audit root
  release verifier
  recovery authority
          |
          v
BOOTSTRAP SUPERVISOR
          |
          v
SB NODE DAEMON / CONTROLLERS
          |
          v
BUILDER + MANAGED WORKLOADS
```

The layer that mutates ordinary Builder/product state must not be able to unilaterally rewrite the authority that governs that mutation.

## Mutability zones

- Zone 0 — Root/Constitution: ordinary self-write never; external governed authority only.
- Zone 1 — Core architecture: self-proposal only; governance approval required.
- Zone 2 — Product implementation: bounded self-change only after tests/proofs/gates/rollout/rollback.
- Zone 3 — Configuration/projections/optimization: progressively automatable when blast radius and reversibility permit.

## Self-change lifecycle

Do not overwrite running code.

```text
Finding -> Change Candidate -> impact analysis -> isolated branch/workspace
-> implementation -> tests/proofs -> build -> signed candidate artifact
-> shadow/canary -> health/effect verification -> promote OR rollback
```

Mutation means a new revision, not live code surgery.

## A/B generation and golden recovery

```text
Slot A: Builder vN      ACTIVE
Slot B: Builder vN+1    CANDIDATE
```

Promotion occurs only after verification. Preserve a known-good recovery generation independent of the current candidate.

`Current Generation != Golden Recovery Generation`.

A self-healing system requires a recovery path outside the potentially damaged subsystem.

## Supervisor/daemon role

A minimal supervisor should focus on lifecycle primitives: install generation, verify hash/signature/provenance, activate generation, health/proof checks, switch A/B slot, rollback, restart, reboot/recovery coordination and evidence preservation. It should not contain the whole Builder intelligence.

A small native/Rust realization is a future candidate only after requirements and threat model justify it.

## Control-plane update

Research replacement of the SB daemon/control plane while keeping autonomous client runtimes alive where possible.

`Control Plane Upgrade != Client Runtime Restart`.

The constitutional/bootstrap layer should remain smaller and more stable than the Builder it upgrades.

## Evidence consolidation — secure update systems

This section extracts technology-independent lessons from mature update/control systems. These are research constraints, not adoption decisions.

### TUF: separate update authority from artifact transport

The Update Framework (TUF) separates Root, Targets, Snapshot and Timestamp metadata roles. Root metadata defines trusted keys and signature thresholds; target metadata binds hashes/sizes; snapshot metadata provides a consistent repository view; timestamp metadata is short-lived so stale metadata can be detected. TUF metadata also carries expiration and clients reject metadata older than previously trusted state.

Implications for SB self-update:

- artifact possession is not installation authority;
- root trust should support threshold/independent authorization rather than one online mutable credential;
- update metadata should be signed separately from the release artifact itself;
- a candidate generation should be bound to an internally consistent release set, not assembled from individually valid but mutually inconsistent components;
- freshness/expiry belongs to update metadata, not merely to network/cache TTL;
- recovery of compromised root authority is an out-of-band governance problem, not something the ordinary Builder may solve by granting itself new trust.

Candidate abstract metadata (not a committed schema):

```text
GenerationManifest
  generationId
  monotonicRevision
  artifactRefs[] { digest, size, role }
  compatibilitySet
  schemaCompatibility
  minimumSupervisorProtocol
  issuedAt
  expiresAt
  signerSet
  signatureThreshold
  provenanceRefs
  rollbackTarget
```

`Signed artifact != authorized generation`.

`Individually valid components != compatible generation set`.

### Uptane: partial and mix-and-match updates are first-class threats

Uptane's threat model explicitly includes freeze, rollback, partial-bundle installation and mix-and-match attacks. The generalizable lesson for SB is that self-update safety is not only artifact authenticity. A set of authentic components can still be unsafe if versions are incompatible or only part of a coordinated generation is activated.

Therefore the supervisor should reason about a **generation transaction**:

```text
resolve complete generation
 -> verify every artifact
 -> verify cross-component compatibility
 -> stage complete candidate
 -> prove preconditions
 -> activate according to declared order
 -> verify effect
 -> commit generation OR rollback coherently
```

A partially activated generation must be an explicit degraded/recovery state, never silently reported as the desired generation.

### Kubernetes: version skew is an explicit compatibility contract

Kubernetes documents supported version skew and upgrade order between control-plane and node components; for example, some components may intentionally remain older during a live upgrade while newer-than-server combinations are prohibited. The lesson is not to copy Kubernetes version numbers but to make **skew policy explicit**.

For SB research, each independently upgradeable control component should eventually declare something equivalent to:

```text
CompatibilityEnvelope
  component
  protocolRange
  stateSchemaReadRange
  stateSchemaWriteRange
  peerGenerationRange
  downgradeReadableUntil
```

This permits staged control-plane upgrades without assuming `all components same version` and prevents accidental unsupported mixtures.

`Version skew != version drift without policy`.

## Anti-rollback and freshness semantics

A/B rollback and security anti-rollback are different requirements and can conflict.

A security fix may declare generation `N+1` as the minimum safe generation. Operational recovery may still require old binaries, but blindly reactivating `N` could reintroduce a known vulnerability or write incompatible state.

Research therefore needs at least three independent concepts:

```text
CurrentGeneration
GoldenRecoveryGeneration
MinimumPermittedGeneration
```

The golden recovery image may be executable only in restricted rescue mode if it is below `MinimumPermittedGeneration`.

Candidate rules:

1. ordinary update flow never decreases the trusted monotonic generation counter;
2. rollback authorization is explicit and may be narrower than upgrade authority;
3. emergency recovery below the minimum safe generation is a distinct break-glass operation with restricted connectivity/authority and evidence;
4. metadata expiry/freshness failure produces `UPDATE_TRUST_STALE/UNKNOWN`, not permission to accept old metadata;
5. clock uncertainty must not silently weaken expiry checks; time-source trust is part of the update threat model.

## State/schema compatibility is part of self-update

Binary rollback is insufficient when the candidate has mutated durable state.

The update proof must cover at least:

```text
code compatibility
protocol compatibility
canonical model compatibility
DB/schema compatibility
artifact format compatibility
configuration compatibility
secret/key compatibility
observer/evidence compatibility
```

Prefer expand/contract-style transitions where both active and candidate generations can coexist during the bounded rollout window. Destructive migration before candidate acceptance can make A/B rollback fictional.

Candidate lifecycle:

```text
PREPARE_COMPATIBLE_STATE
 -> START_CANDIDATE
 -> SHADOW/CANARY
 -> VERIFY
 -> PROMOTE
 -> OBSERVE_STABILITY_WINDOW
 -> CONTRACT_OLD_COMPATIBILITY
```

`Rollback binary exists != rollback is executable`.

## Promotion is a proof, not a health endpoint

A candidate process returning HTTP 200 is necessary at most, not sufficient for promotion. Promotion evidence should be layered:

```text
Liveness        process can execute
Readiness       dependencies needed for candidate are usable
Compatibility   active/candidate can coexist as declared
Behavioral      bounded product proofs pass
Observability   candidate remains independently observable
Recovery        rollback path is still executable
Effect          routed workload behaves within acceptance envelope
```

The verifier used for promotion must not be exclusively supplied or controlled by the candidate being verified.

## Reboot and boot identity

Host reboot crosses an observability discontinuity. Mature host environments expose machine identity separately from per-boot identity; this supports a useful SB distinction:

```text
HostIdentity != BootEpochIdentity != ServiceInvocationIdentity
```

A reboot operation should preserve a durable operation ID before shutdown and require a **new boot epoch** plus re-attestation/re-observation after reconnect. Reconnecting to the same network address is not proof that the expected host/generation returned.

Candidate reboot evidence:

```text
operationId
expectedHostIdentity
preBootEpoch
requestedGeneration
rebootIssuedAt
postBootEpoch
observedHostIdentity
observedGeneration
postBootProof
```

`Endpoint reachable after reboot != expected host/generation recovered`.

## Failed-update loop containment

Self-update can create a restart/rollback loop that consumes the only recovery path. Research should include an attempt budget external to the candidate:

```text
candidate boot attempt
 -> bounded verification window
 -> bless/promote
 OR
 -> decrement external attempt budget
 -> rollback/recovery slot
```

The candidate cannot reset its own failure budget before independent promotion evidence exists.

This is a technology-independent requirement; bootloader-specific mechanisms remain provider realizations.

## Autonomy levels

0. Observe self.
1. Diagnose/findings.
2. Propose changes.
3. Materialize candidate branch/patch/tests.
4. Verify automatically.
5. Apply bounded low-risk self-change under policy.
6. Fully autonomous evolution — research only, not assumed desirable.

Prefer long operation at levels 3–5 before considering level 6.

## Adversarial cases

- Builder breaks its own compiler.
- Builder changes the authority protecting it.
- Control-plane update cannot rollback.
- Bad migration prevents recovery by the old generation.
- Observer is disabled by the component being observed.
- Self-update enters a loop.
- Candidate corrupts canonical state.
- Verifier depends on the component being replaced.
- Known-good generation is lost.
- Reboot is ACKed but host never returns.
- Control plane is unavailable while client runtimes are healthy.
- Valid old metadata is replayed to freeze updates.
- Individually signed components are mixed into an incompatible generation.
- Only part of a coordinated generation activates.
- A/B rollback violates a security anti-rollback floor.
- Candidate resets its own boot-attempt counter and loops forever.
- Old binary starts successfully but cannot read state written by the candidate.
- Clock corruption makes expired update metadata appear fresh.

## Proof obligations

1. Ordinary Builder cannot alter root trust unilaterally.
2. Every self-change creates a new revision/artifact.
3. Candidate can be tested independently from active generation.
4. Rollback path is verified before promotion.
5. Audit/evidence cannot be silently disabled by candidate.
6. Known-good recovery remains reachable after failed update.
7. Database/schema migration compatibility is explicit and rollback is proven against actual durable state.
8. Control-plane failure does not break published runtime autonomy.
9. Self-diagnosis does not create self-change authority.
10. Builder can represent its own lifecycle without one-off semantic hacks.
11. Update authorization is verified independently from artifact transport/storage.
12. Complete generation consistency prevents partial/mix-and-match activation from becoming effective truth.
13. Metadata freshness and monotonic revision prevent silent freeze/rollback.
14. Supported version skew and upgrade order are explicit for independently upgradeable components.
15. Promotion requires independent layered evidence beyond process liveness.
16. Reboot completion proves host identity, a new boot epoch and expected generation/effect.
17. Candidate cannot unilaterally reset the external failed-update/boot-attempt budget.
18. Security anti-rollback floor and operational recovery generation are represented separately.

## Open research gaps after this consolidation

Highest-value remaining questions in this family:

1. Root-of-trust realization matrix: offline keys, threshold signing, hardware-backed keys, recovery ceremony and compromise rotation without binding G4 to one implementation.
2. Durable-state migration protocols: expand/contract, dual-read/write hazards, irreversible data transforms and proof of downgrade readability.
3. Promotion evidence design: stability windows, canary population, failure budgets and how much verification remains outside the candidate.
4. Supervisor protocol: smallest stable API needed for install/activate/rollback/reboot/recover while keeping Builder intelligence outside the bootstrap root.
5. Fleet update coordination: waves, failure domains, quorum/capacity preservation and stopping rules.
6. Time trust during disconnected/offline operation and safe handling of expired update metadata.

## Sources / evidence class

Primary specifications and mature-system documentation consulted in this consolidation:

- The Update Framework, Roles and metadata: https://theupdateframework.io/docs/metadata/
- The Update Framework Specification index (latest listed v1.0.33 at research time): https://theupdateframework.io/spec/
- Uptane Standard for Design and Implementation 2.1.0, threat model including freeze/rollback/partial-bundle/mix-and-match attacks: https://uptane.org/assets/files/uptane-standard.2.1.0-47b4fe14eccc61fe82dcacaf7c43404a.pdf
- Kubernetes Version Skew Policy: https://kubernetes.io/releases/version-skew-policy/
- systemd machine/boot/invocation identity documentation: https://www.freedesktop.org/software/systemd/man/253/sd_id128_get_machine.html

These sources inform failure models and boundaries; none is selected as an SB provider or mandatory implementation.

## Architectural interpretation

The long-term product may resemble an enterprise/operational control substrate rather than an operating-system kernel. It remains above Linux/Windows/cloud/container runtimes and manages systems, deployments, data, workflows, authority and evidence rather than CPU scheduling, virtual memory or device drivers.
