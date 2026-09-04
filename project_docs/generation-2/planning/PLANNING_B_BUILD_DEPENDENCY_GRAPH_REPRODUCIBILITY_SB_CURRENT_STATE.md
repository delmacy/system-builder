# Planning B — Build / Dependency Graph / Reproducibility — SB Current State Reconciliation

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Canonical capability: Build / Dependency Graph / Reproducibility
Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

This artifact is repository archaeology only. It records current System Builder truth against the Planning A semantic boundary. It does not design Generation 2 target architecture, execute product code, create Work Packages/TASKs, enter Construction, open a PR, or touch worker handoff state.

## 1. Current-state verdict

The current SB has a meaningful deterministic build/assembly foundation but not a complete portable Build / Dependency Graph / Reproducibility owner.

The strongest implemented primitives are:

- deterministic capability dependency resolution in `packages/assembly/index.ts`, including root requirements, exact/minimum version constraints, compatibility constraints, transitive requirement propagation, cycle detection, conflict diagnostics, stable candidate ordering and a canonical AssemblyPlan content hash;
- deterministic compiler normalization in `packages/compiler/index.ts`, including sorted components/dependencies/source refs/environment requirements/state requirements/generated paths, canonical JSON, per-file SHA-256 hashes and aggregate ReleaseArtifact hash calculation;
- explicit compiler/runtime version fields in the generated manifest;
- deterministic generation of runtime entrypoint, runtime manifest, environment schema and migration assets;
- validation-evidence gating before compilation and explicit assembly-plan/hash linkage;
- secret values rejected from compiler environment requirements, preserving symbolic secret-reference boundaries;
- product/task evidence asserting that equivalent logical input ordering yields identical generated files/hashes/artifact identity and that generated runtime execution is tested from actual compiler output.

These are substantial KEEP foundations. They prove deterministic behavior for the bounded synthetic compiler contract. They do not yet prove a generalized reproducible-build architecture.

## 2. Evidence from fresh main

### 2.1 Dependency closure and graph behavior

`packages/assembly/index.ts` models candidate dependencies and structured dependency requirements. Resolution iterates requirements to convergence, combines exact/minimum version constraints and compatibility predicates, selects candidates in stable lexical order, detects cycles, emits explicit unresolved/conflict/cycle diagnostics and computes a canonical content hash for the ordered AssemblyPlan.

This is real transitive dependency-graph behavior, not merely a flat component list.

However, current graph identity is capability/provider/version oriented. It does not evidence canonical `BuildInputIdentity` / `MaterialIdentity` covering source trees, package archives, generated inputs, toolchains, compiler binaries, lockfile resolutions, container bases, platform artifacts or independently integrity-qualified external materials.

### 2.2 Compiler determinism

`packages/compiler/index.ts` uses canonical JSON and SHA-256 functions, sorts semantically unordered collections before materialization, emits generated files with content hashes, verifies validation evidence, rejects invalid hashes and derives aggregate artifact identity from canonical metadata plus ordered file hashes.

`compilerVersion` and `runtimeVersion` are explicitly recorded. Environment requirements are normalized and symbolic secret-reference requirements are enforced for runtime state bindings. Generated paths are checked for uniqueness.

This supports a bounded deterministic-output claim for the synthetic compiler.

### 2.3 Existing reproducibility evidence

Historical task specifications around the compiler explicitly require that the same logical inputs in different ordering produce identical generated files, hashes and artifact identity. The repository also describes the Compiler as transforming validated assembly input into reproducible output and includes WBS language to pin toolchain and relevant inputs.

This evidence is useful but must be interpreted narrowly: the implemented compiler function is deterministic over its explicit in-memory inputs. Repository evidence does not establish that arbitrary end-to-end builds are hermetic or reproducible across machines, runner providers, toolchain revisions or time horizons.

### 2.4 Build/result truth separation

Current code returns a `ReleaseArtifact` directly from compiler materialization. Adjacent packages then persist/publish/deploy that artifact. Operationally, the repository has separate Release and Deploy packages, but the compiler type naming compresses build output and ReleaseArtifact creation into one boundary.

Planning A requires `build result != released artifact != deployed/effective runtime`. Current package separation partially supports that distinction operationally, but the compiler contract does not expose a first-class pre-release `BuildResult`/`BuildOutputSet` distinct from release adoption.

## 3. Planning A validation questions — current answers

1. **Canonical build inputs/materials separate from provider/filesystem identity?** PARTIAL. AssemblyPlan has canonical content hash and stable source refs, but no generalized material identity model.
2. **Transitive dependency closure explicit and integrity-qualified?** PARTIAL. Capability dependencies are transitively resolved with cycle/conflict handling; material-level integrity and lock/resolution evidence are absent.
3. **Recipe/toolchain/target/runner revisions independently represented?** PARTIAL/NO. `compilerVersion` and `runtimeVersion` exist. No first-class recipe revision, target-platform revision vector or runner qualification identity is evidenced.
4. **Hermeticity or controlled impurity modeled?** NO evidence of first-class network/filesystem/environment/clock/randomness boundaries or impurity classification.
5. **Attempt/provider acceptance/output/validation/reproducibility facts separated?** PARTIAL. Validation-before-compile and produced hashes exist; no general BuildAttempt lifecycle or reproducibility assessment record exists.
6. **Cache provenance/currentness qualification?** NO first-class build-cache semantics found.
7. **Remote build/cache UNKNOWN reconciliation?** NO general remote build/cache effect-disposition model evidenced.
8. **Runner/toolchain/provider substitution qualified?** NO build-specific provider-support/substitution model evidenced.
9. **Minimal generated-runtime closure explicit?** PARTIAL. Compiler emits runtime entrypoint, runtime manifest, environment schema, migrations and capability-derived runtime state requirements. This is useful closure evidence but not a generalized retained-vs-authoring dependency closure.
10. **Build output distinct from release/deployment/effective runtime?** PARTIAL. Release and Deploy are separate downstream packages, but compiler itself emits a `ReleaseArtifact`, so pre-release build identity is compressed.
11. **Secret values excluded?** YES for compiler environment requirements: values are rejected and references are symbolic.
12. **Enterprise → Station → Role → Person / AI-AGWS non-amplification?** NO build-specific implementation evidence found. Existing authority systems may be adjacent, but this capability does not yet expose those hierarchical semantics.

## 4. Maturity assessment

### Implemented / strong bounded baseline

- deterministic capability dependency resolution;
- cycle/conflict/unresolved dependency diagnostics;
- stable normalized AssemblyPlan identity;
- deterministic generated-file ordering/content hashing;
- aggregate artifact hashing;
- explicit compiler/runtime version fields;
- validation-evidence gating;
- symbolic secret-reference handling;
- deterministic runtime/migration materialization.

### Partial

- transitive dependency closure exists for capabilities but not generalized build materials;
- compiler/runtime versions cover only part of a complete build revision vector;
- generated runtime closure is explicit for current synthetic outputs but not proven minimal across all workloads;
- deterministic output is proven for bounded compiler inputs but not elevated to an applicability-scoped reproducibility claim;
- package separation suggests release/deploy boundaries, but compiler output identity is named directly as ReleaseArtifact.

### Not evidenced as current implementation

- canonical material/input identities independent from provider coordinates and filesystem paths;
- integrity-qualified lock/material graph across all source/toolchain/build inputs;
- first-class build recipe revision;
- target/platform and runner revision/qualification vectors;
- hermeticity profile or controlled-impurity ledger;
- network/filesystem/environment/time/randomness fencing semantics;
- BuildAttempt identity and attempt lifecycle;
- provider acceptance vs execution vs output-validation vs reproducibility-assessment lineage;
- rebuild/replay proof records and evidence horizons;
- exact/semantic reproducibility profiles with PARTIAL/INCONCLUSIVE outcomes;
- cache identity/provenance/currentness/support qualification;
- remote cache/build effect dispositions and `UNKNOWN → reconcile-before-retry`;
- build-runner/toolchain provider substitution/coexistence/drainage;
- residual authoritative cache/runner cohorts;
- Enterprise → Station → Role → Person build administration;
- explicit AGWS/AI build-authority non-amplification.

## 5. Portability and providerability

Current assembly candidates explicitly include provider and version, so provider selection is visible and deterministic. That is a useful precursor to provider-neutral execution, but the selected provider/version is embedded into the AssemblyPlan and generated runtime manifest; there is no build-runner provider contract with semantic support qualification.

The current compiler is local/in-process and therefore avoids CI-provider lock-in at this boundary. Yet absence of a remote runner abstraction is not proof of portable runner substitution. There is no evidence that equivalent builds on another runner/toolchain are admitted only after proving sandbox, resolution, cache, environment and reproducibility semantics.

Disposition: KEEP the provider-visible assembly model; GENERALIZE/HARDEN later around semantic material/build identities and qualified execution providers. Do not infer provider portability from lexical provider selection alone.

## 6. Failure and ambiguity semantics

Current assembly/compiler failures are deterministic synchronous errors or diagnostics for invalid input, unresolved capability, constraint conflict, cycle, validation failure, invalid hashes, duplicate paths and missing required secret-reference bindings.

That is strong fail-fast behavior for local deterministic execution.

There is no current evidence of remote build mutation ambiguity because the compiler path examined is in-process. Therefore `UNKNOWN → reconcile-before-retry` is not currently implemented as a build-domain concern. It remains a gap for any future remote runner/cache realization; Planning B must not invent such a realization.

Missing or partial generalized reproducibility evidence must not be read as PASS. Current truth is that bounded deterministic compilation is evidenced, while broader hermetic/reproducible build status is unevidenced and therefore would be `INCONCLUSIVE` under the Planning A semantics.

## 7. Workload-driven minimal runtime closure

Current compiler emits a concrete runtime closure consisting of generated assembly metadata, environment schema, executable runtime entrypoint, runtime manifest and migration assets when state requirements exist. Runtime capability materialization can derive state requirements from selected assembly capabilities, reducing caller-only knowledge.

This is a valuable KEEP/GENERALIZE precursor to workload-driven closure.

What is not evidenced is a complete graph proving which package/toolchain/build-time dependencies were discarded as authoring-only versus which runtime libraries/assets/providers are strictly required. Consequently, current output can be called autonomous under existing runtime proofs, but not yet a generalized mathematically minimal runtime closure.

## 8. Boundary preservation

- **Artifact / Release / SBOM / Provenance** remains owner of release/adoption lifecycle, SBOM/attestation/signature/distribution. Current compiler's `ReleaseArtifact` naming should not be interpreted as collapsing that semantic owner.
- **Deployment / Environment / Runtime** owns desired/effective placement and health. Compiler success is not deployment proof.
- **Provider / Binding / Capability Negotiation** owns provider discovery/admission/binding/support qualification; Build owns build-domain requirements and evidence.
- **Lifecycle / Versioning / Evolution / Migration** owns generic revision/coexistence primitives; Build owns build-profile applicability.
- **Security / Resilience / Failure Recovery** owns compromise/recovery policy; Build contributes input integrity and reproducibility evidence.
- **Developer / Operator Experience / Self-hosting** owns ergonomics and operational tooling; Build owns closure/determinism semantics.
- **UCA** supplies generic identity/revision/evidence/effect/support primitives without absorbing Build ownership.
- **AGWS** remains distinct and may not convert build requests or AI proposals into undelegated dependency/toolchain/release authority.

## 9. Evidenced dispositions

### KEEP

- deterministic assembly graph resolution and diagnostics;
- canonical AssemblyPlan hashing;
- canonical JSON/file hashing and stable compiler normalization;
- validation evidence gate;
- explicit compiler/runtime versions;
- secret-reference-only compiler environment boundary;
- generated runtime/migration closure primitives.

### HARDEN

- make deterministic compiler evidence explicitly applicability-scoped rather than treating deterministic function output as universal reproducibility;
- preserve strict separation of validation, output integrity and downstream effective runtime truth;
- strengthen closure evidence so every retained runtime dependency can be explained.

### GENERALIZE

- capability dependency graph toward canonical material/build-input graph semantics without replacing the working assembler;
- version fields toward a complete build revision vector when target architecture is later authorized;
- current generated-runtime closure toward workload-driven retained dependency closure.

### INTEGRATE

- integrate later with Artifact/Release provenance, Provider support qualification, Lifecycle revisions, Security material status and Evidence/Provenance semantics while preserving owner boundaries.

### PROVIDERIZE

Not currently justified for the compiler itself. A future runner/cache realization may be providerized only after semantic qualification; Planning B records the gap without inventing the provider contract.

### REPLACE

No evidence supports replacing the current deterministic assembler/compiler foundation.

### DEFER

- exact target model for material identities, build attempt, hermeticity profiles, cache contracts, runner qualification and reproducibility evidence belongs to later target-architecture phases after Planning B closes.

### DO_NOT_BUILD

- do not build a second generic package manager, CI service or container ecosystem merely to satisfy this capability;
- do not canonize external runner IDs/cache keys/package coordinates as portable identities by default.

## 10. Reconciliation conclusion

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Fresh main contains a strong deterministic assembly/compiler baseline and explicit evidence for bounded identical-output behavior. It does not yet implement the full semantic owner defined in Planning A: canonical material graph, complete build revision vector, hermeticity/controlled impurity, build-attempt lineage, cache qualification, applicability-scoped reproducibility claims, rebuild evidence, remote ambiguity reconciliation or qualified runner/toolchain substitution remain gaps.

The correct path is predominantly **KEEP + HARDEN + GENERALIZE + INTEGRATE**, with no evidence for replacement and no target architecture invented in this phase.
