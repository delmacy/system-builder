# Generation 2 — Build / Dependency Graph / Reproducibility Adversarial Edge-Case Register

Status: FULL PASS 1 — MATERIAL FINDINGS / LOCAL STREAK 0 / CLUSTER STREAK 0
Capability: Build / Dependency Graph / Reproducibility
Paired cluster: Build × Artifact/Release × Deployment × Runtime
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No target architecture, implementation task, Work Package or remediation is authorized here. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; provider/runner IDs, cache keys and run IDs are realization identities, not canonical build identity. Preserve `Enterprise → Station → Role → Person`, AI/AGWS non-amplification, qualified evidence/currentness, and `UNKNOWN → reconcile-before-retry`.

## Evidence anchors

- Planning A defines Build as owner of canonical build/material identity, dependency closure, recipe/toolchain/runner qualification, reproducibility claims, cache applicability/currentness and workload-driven runtime closure; it explicitly preserves `build result != released artifact != deployed state != runtime-effective state`.
- Fresh-main anchor `d8760c7f08757bb164a758ae0c3f0a4a1752464b` documents deterministic dependency resolution and reproducible ReleaseArtifact intent; ADR-0007 states `build once, deploy many`, while compiler tasks require reproducible hashes and autonomous runtime output. These are implementation/current-state evidence only, not proof that all adversarial cases are solved.
- SLSA Build Provenance requires build inputs/parameters and resolved dependencies to be represented in provenance; dependencies fetched during build execution count as dependencies, and control-plane/cache influence that changes the build definition should be represented rather than hidden. https://slsa.dev/spec/v1.2-rc2/build-provenance
- SLSA Build Requirements distinguish provenance completeness and trusted control-plane generation; user-controlled build steps must not be able to forge trusted provenance fields. https://slsa.dev/spec/v1.2-rc1/build-requirements
- Nix sandbox documentation explicitly isolates builds from the host filesystem to prevent undeclared dependencies such as `/usr/bin`, providing mature evidence that ambient host state is a material reproducibility risk. https://releases.nixos.org/nix/nix-2.31.3/manual/command-ref/conf-file.html
- Reproducible Builds' `SOURCE_DATE_EPOCH` specification exists because wall-clock timestamps are a common nondeterministic input and must be replaced by a source-derived deterministic value where applicable. https://reproducible-builds.org/specs/source-date-epoch/

These representatives support portable principles only; their product-specific mechanisms are not promoted as universal architecture.

## Local material scenarios

### G2-EDGE-BUILD-001 — undeclared ambient dependency changes output while declared graph remains unchanged
- Preconditions / activation: build reads host filesystem, mutable registry/tag, network response, locale/timezone, environment variable, clock/randomness or tool discovered outside the declared material closure.
- Incompatible claims/actions/states: declared dependency graph and recipe are unchanged while effective inputs differ between executions.
- Expected safe behavior: effective input outside declared closure either fails the applicable hermetic profile or is recorded as controlled impurity that weakens the reproducibility claim to `INCONCLUSIVE/DEGRADED`.
- Forbidden behavior: matching declared graph or successful runner execution is treated as proof of reproducibility despite unqualified ambient influence.
- Owner(s): Build / Dependency Graph / Reproducibility; Provider/Binding for runner support; Secrets/Config where sensitive environment material is involved.
- Effect/failure disposition: hidden material discovered → reproducibility claim `INCONCLUSIVE`; explicit controlled impurity → profile-qualified weaker claim.
- Evidence/currentness: canonical material closure, recipe/toolchain revision, runner profile, observed external input identities/currentness and output digest set.
- Recovery/reconciliation: reconstruct effective closure, quarantine/qualify ambient input, rebuild under declared profile and compare outputs.
- Blast radius: artifact → release/runtime fleet. Severity: CRITICAL. Confidence: strongly supported. Detectability: static/runtime/post-build differential. Reversibility: bounded before release; potentially broad after deployment. Time-to-harm: immediate/latent. Misuse likelihood: likely accidental, plausible adversarial. False-positive risk: medium where controlled impurity is intentional and fully declared.
- Proof obligation: `BUILD-ADV-PROOF-001` — no stronger reproducibility claim may survive an effective input that is absent from the applicable material/impurity evidence.

### G2-EDGE-BUILD-002 — duplicate/cyclic/conditional dependency graph resolves differently across tools or evaluation order
- Preconditions / activation: dependency graph includes cycles, duplicate canonical subjects under different coordinates, optional/conditional edges, peer/platform constraints or generated dependencies whose evaluation order differs.
- Incompatible claims/actions/states: every resolver step may be locally valid while global closure differs or becomes non-terminating/ambiguous.
- Expected safe behavior: closure identity includes conditions and selected revisions; cycles/conflicts/ambiguous aliases are explicit and cannot be normalized away by traversal order.
- Forbidden behavior: first-wins/last-wins/order-dependent resolution silently selects canonical truth; pathological recursion degrades into partial authoritative output.
- Owner(s): Build + Standards/API compatibility where contracts drive resolution + Lifecycle for version semantics.
- Effect/failure disposition: unresolved/conflicting closure → `NOT_APPLIED/INCONCLUSIVE`; partial graph may be accepted only under an explicitly weaker non-release-eligible profile.
- Evidence/currentness: graph nodes/edges, conditions, resolver/toolchain revision, selected material revisions and conflict diagnostics.
- Recovery/reconciliation: resolve owner-level identity/version conflict, bound recursion, rebuild closure deterministically.
- Blast radius: build → multiple artifacts. Severity: HIGH–CRITICAL. Confidence: supported. Detectability: static/pre-build. Reversibility: easy before release. Time-to-harm: immediate. Misuse likelihood: likely accidental, plausible low-code generated. False-positive risk: medium for intentional cycles represented with bounded semantics.
- Proof obligation: `BUILD-ADV-PROOF-002` — traversal order, duplicate coordinates or cycle handling cannot silently decide canonical dependency closure.

### G2-EDGE-BUILD-003 — poisoned or stale cache is accepted because key matches while provenance/currentness no longer applies
- Preconditions / activation: cache entry was produced under older recipe/toolchain/policy/provider/material state, compromised source, revoked dependency or incomplete provenance but retains a matching cache key.
- Incompatible claims/actions/states: cache-key match is locally true while producing revision vector/current eligibility is false or unknown.
- Expected safe behavior: cache identity, provenance, producing revision vector, integrity and currentness are qualified independently; insufficient evidence yields `INCONCLUSIVE` and cannot strengthen release eligibility.
- Forbidden behavior: cache hit equals reproducible build; cache provider success equals trusted output; eviction request equals proof no stale authoritative cache remains.
- Owner(s): Build + Security/Recovery + Provider/Binding + Lifecycle.
- Effect/failure disposition: known inapplicable cache → reject; uncertain provenance/currentness → `INCONCLUSIVE`; remote invalidation effect may be `UNKNOWN` and requires reconciliation.
- Evidence/currentness: cache subject digest, producing build/material vector, cache provider/binding, trust/currentness evidence and invalidation observations.
- Recovery/reconciliation: inventory cache cohorts, fence invalid entries, rebuild from qualified closure, verify old cache cannot remain authoritative.
- Blast radius: build population → release fleet. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-build/post-build/audit. Reversibility: bounded before promotion. Time-to-harm: immediate. Misuse likelihood: likely operationally; adversarial plausible. False-positive risk: medium where old cache remains intentionally equivalent under explicit proof.
- Proof obligation: `BUILD-ADV-PROOF-003` — cache-key equality alone never establishes build equivalence, integrity or current eligibility.

### G2-EDGE-BUILD-004 — concurrent source/build/release mutation creates provenance subject skew
- Preconditions / activation: source branch/tag, generated schema, lockfile, build recipe, toolchain image or release candidate changes while a build is resolving/fetching/publishing.
- Incompatible claims/actions/states: build starts from one revision vector but provenance/SBOM/release packaging captures another or mixes materials from both.
- Expected safe behavior: producing inputs are pinned or captured as an immutable attempt-specific vector; post-build release adoption verifies artifact subject and provenance refer to the same output/material lineage.
- Forbidden behavior: mutable branch/tag at completion time rewrites provenance of already-produced bytes; successful release packaging implies build inputs were coherent.
- Owner(s): Build + Artifact/Release/SBOM/Provenance + Lifecycle.
- Effect/failure disposition: mixed or unprovable vector → `INCONCLUSIVE`; already-published mismatched metadata is a correction/supersession signal, not silent overwrite.
- Evidence/currentness: attempt start/end vector, material digests, output digest, provenance/SBOM subject, release adoption lineage.
- Recovery/reconciliation: compare immutable identities, supersede incorrect metadata/release if concrete mismatch is confirmed, rebuild/re-adopt as needed.
- Blast radius: release consumers → runtime fleet. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-release/post-build/audit. Reversibility: bounded before widespread deployment. Time-to-harm: immediate/latent. Misuse likelihood: plausible/likely in concurrent pipelines. False-positive risk: low when immutable identities disagree.
- Proof obligation: `BUILD-ADV-PROOF-004` — provenance/SBOM/release subject must be tied to the exact producing build/material vector rather than mutable names.

### G2-EDGE-BUILD-005 — remote build/publication effect is ambiguous and blind retry creates competing authoritative outputs
- Preconditions / activation: remote runner/cache/artifact service times out after possible build completion/upload/publication; response is lost or provider reports partial state.
- Incompatible claims/actions/states: caller cannot prove `APPLIED` or `NOT_APPLIED`, while retry may execute against changed dependencies/toolchain or publish a second output under the same intent.
- Expected safe behavior: mutating effect remains `UNKNOWN`; reconcile attempt/output/publication identities before retry unless operation-specific idempotency scope and horizon are qualified.
- Forbidden behavior: timeout means failure; second build is equivalent because intent string is unchanged; latest publication automatically wins canonical truth.
- Owner(s): Build + Artifact/Release + Provider/Binding + Integration.
- Effect/failure disposition: exact `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`; `UNKNOWN → reconcile-before-retry`.
- Evidence/currentness: build attempt ID, provider run/output IDs as realization evidence, output digests, publication subject, idempotency semantics and observation time.
- Recovery/reconciliation: query provider/artifact state, correlate outputs to material vector, adopt exactly one qualified lineage or mark ambiguous cohort non-authoritative.
- Blast radius: artifact/release → runtime fleet. Severity: CRITICAL. Confidence: strongly supported. Detectability: runtime/post-effect. Reversibility: provider dependent. Time-to-harm: immediate. Misuse likelihood: plausible under normal network failure. False-positive risk: low when effect genuinely cannot be proven.
- Proof obligation: `BUILD-ADV-PROOF-005` — ambiguous remote build/publication effects cannot be coerced to failure/success or blindly replayed.

### G2-EDGE-BUILD-006 — pathological build graph or AI/low-code generated build step exhausts resources or expands authority
- Preconditions / activation: extremely large dependency closure, generated fan-out, recursive code generation, unbounded network fetches, expensive compilation, dependency confusion, AI-added install script or build step requests broader secrets/network/filesystem access.
- Incompatible claims/actions/states: individual dependencies/steps are syntactically valid while aggregate work exceeds bounded resources or crosses delegated authority/supply-chain trust.
- Expected safe behavior: resource and authority limits remain explicit; capacity pressure produces bounded failure/degradation; AI/low-code proposals cannot grant material/secret/network/runner authority or bypass provenance/trust admission.
- Forbidden behavior: disable sandbox/provenance/integrity checks to make build finish; generated step inherits broad runner credentials; hidden dependency is accepted because AI suggested it.
- Owner(s): Build + Authorization + Security/Supply-chain + AGWS/AI + FinOps + Provider/Binding.
- Effect/failure disposition: bounded rejection may be `NOT_APPLIED`; partial outputs are non-authoritative; authority/trust ambiguity stays `INCONCLUSIVE/DENY` according to owner policy.
- Evidence/currentness: graph size/depth/fan-out, resource budget, requested capabilities/network/secrets, material trust evidence, effective `Enterprise → Station → Role → Person` authority.
- Recovery/reconciliation: terminate/fence partial outputs, reduce/review graph, re-admit dependencies/steps under owners, rotate secrets if concrete exposure occurred.
- Blast radius: runner → enterprise/supply chain/external parties. Severity: CRITICAL. Confidence: strongly supported. Detectability: static/pre-build/runtime/audit. Reversibility: resource effects bounded; credential/supply-chain effects may be difficult. Time-to-harm: immediate/cumulative. Misuse likelihood: likely accidental and plausible adversarial. False-positive risk: medium for intentionally large but bounded builds.
- Proof obligation: `BUILD-ADV-PROOF-006` — scale pressure or generated composition cannot weaken provenance, sandbox, authority or supply-chain qualification.

## Cross-capability material scenarios — Build × Artifact/Release × Deployment × Runtime

### G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-001 — build output identity is silently collapsed into release, deployment and runtime-effective identity
- Activation: one digest/tag/version label is reused across build output, release, deployment intent and observed runtime without explicit transitions/evidence.
- Incompatible claims: build produced bytes; release admitted/promoted an artifact; deployment selected a release; runtime fleet actually executes a workload. These may each be valid at different revisions/times.
- Safe behavior: preserve distinct identities/lineage and qualify each adjacent transition; runtime-effective truth requires observed workload evidence.
- Forbidden behavior: build success proves release; release digest proves all replicas run it; deployment ACK proves runtime-effective convergence.
- Owners: Build + Artifact/Release + Deployment/Runtime + Observability/Lifecycle.
- Effect/failure disposition: missing transition evidence → `INCONCLUSIVE`; mixed fleet → `PARTIAL`.
- Evidence/currentness: build output/material vector, release identity/admission, deployment revision, runtime cohort/workload identity and observation horizon.
- Recovery/reconciliation: trace lineage end-to-end, inventory runtime cohorts, fence/drain mismatches before declaring convergence.
- Blast radius: deployment → system/enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-deploy/runtime/audit. Reversibility: usually bounded. Time-to-harm: immediate. Misuse likelihood: likely operationally. False-positive risk: low where identities are genuinely collapsed.
- Proof: `XBUILD-ADV-PROOF-001`.

### G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-002 — retained artifact is reproducible/historically valid but rollback dependencies are no longer eligible
- Activation: rollback selects a retained release/build whose dependency, schema, config, secret, trust, provider or runtime support state changed since original deployment.
- Incompatible claims: historical artifact integrity/reproducibility is true while current runtime eligibility is false or unknown.
- Safe behavior: recoverability and historical validity remain distinct from current rollback eligibility; current dependency/config/schema/provider/trust compatibility is requalified before activation.
- Forbidden behavior: retained digest means safe rollback; successful old build proof overrides current revocation/incompatibility.
- Owners: Lifecycle + Deployment/Runtime + Build + Artifact/Release + affected dependency owners.
- Effect/failure disposition: retained but unqualified → `INCONCLUSIVE`; incompatible/revoked dependency → block/fence.
- Evidence/currentness: historical producing vector, current compatibility/trust/support, deployment target state and residual cohort inventory.
- Recovery/reconciliation: qualify or migrate dependencies, choose another eligible target, preserve historical lineage without asserting current safety.
- Blast radius: runtime fleet. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-rollback/post-deploy. Reversibility: potentially difficult after effects. Time-to-harm: immediate. Misuse likelihood: plausible during incident response. False-positive risk: low when current incompatibility is evidenced.
- Proof: `XBUILD-ADV-PROOF-002`.

### G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-003 — rollout contains residual old build/runtime cohorts after nominal deployment success
- Activation: deployment partially updates replicas/regions/workers or reconnecting/offline runtimes continue old release/build closure after control plane declares success.
- Incompatible claims: desired deployment revision is locally applied while actual authoritative consumers execute multiple incompatible closures.
- Safe behavior: convergence remains `PARTIAL/INCONCLUSIVE` until authoritative cohorts are inventoried and compatibility/drainage is qualified.
- Forbidden behavior: deployment controller ACK or healthy majority proves fleet convergence; old cohort is ignored because no new placement is intended there.
- Owners: Deployment/Runtime + Artifact/Release + Build + Observability/Lifecycle.
- Effect/failure disposition: desired mutation `APPLIED`; fleet convergence `PARTIAL/INCONCLUSIVE` until observed.
- Evidence/currentness: deployment intent/revision, runtime cohort artifact/build identity, workload-effective observations, compatibility vector and drain status.
- Recovery/reconciliation: inventory/fence/drain or explicitly qualify coexistence; re-observe before closure.
- Blast radius: request → system. Severity: CRITICAL. Confidence: strongly supported. Detectability: runtime/audit. Reversibility: bounded if cohorts can be fenced. Time-to-harm: immediate/cumulative. Misuse likelihood: likely in rolling/disconnected environments. False-positive risk: medium for intentionally compatible coexistence.
- Proof: `XBUILD-ADV-PROOF-003`.

### G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-004 — runner/toolchain/provider substitution preserves nominal build interface but changes runtime semantics
- Activation: old/new build provider, compiler, linker, package resolver, image builder or runner both accept the same build intent yet produce semantically different output or runtime closure.
- Incompatible claims: provider feature/API support is locally true for both; canonical reproducibility/runtime-equivalence requirement is not proven.
- Safe behavior: provider IDs remain non-canonical; substitution is qualified by semantic support plus differential/rebuild/runtime evidence; unsupported differences surface as `DEGRADED/INCONCLUSIVE`.
- Forbidden behavior: command-line compatibility or matching filenames/tags prove equivalent runtime behavior; provider cutover silently changes canonical build identity.
- Owners: Build + Provider/Binding + Artifact/Release + Deployment/Runtime + Standards where interface conformance matters.
- Effect/failure disposition: nominal support with unproven semantic equivalence → `INCONCLUSIVE`; observed incompatible output → unsupported/degraded for that profile.
- Evidence/currentness: old/new provider support vectors, toolchain/runner revisions, material closure, output comparison, runtime behavioral proof and observation horizon.
- Recovery/reconciliation: differential rebuild/proof, pin/fence incompatible provider, qualify migration/coexistence before authoritative cutover.
- Blast radius: build population → runtime fleet. Severity: HIGH–CRITICAL. Confidence: strongly supported. Detectability: pre-cutover/post-build/runtime. Reversibility: bounded before broad promotion. Time-to-harm: delayed/immediate. Misuse likelihood: plausible during provider migration. False-positive risk: medium because different outputs may be intentionally semantically equivalent under a declared profile.
- Proof: `XBUILD-ADV-PROOF-004`.

## Reusable processual / semantic conflict patterns

### G2-CONFLICT-PATTERN-BUILD-PROVENANCE-001 — declared build identity conflicts with effective material closure
- Family: semantic ownership + data/consistency + supply-chain.
- Narrative: the declared source/lockfile/recipe is internally valid, but ambient/generated/cache-fetched material changes the effective build while provenance continues to describe only the declared graph.
- Preconditions / activation conditions: any output-influencing material is absent from the applicable closure/controlled-impurity evidence or provenance subject does not correspond to the actual producing vector.
- Incompatible claims/actions/states: `declared closure complete` versus `effective closure contains additional/different material`.
- Why local validation may miss it: source graph, runner and provenance document can each validate independently; only cross-checking execution observations against declared closure exposes the mismatch.
- Detection candidates: static dependency/material scan; sandbox/egress observation; reproducibility differential; provenance-to-effective-material reconciliation.
- Owner set: Build primary; Artifact/Release provenance packaging; Security/Supply-chain; Provider/Binding for runner semantics.
- Severity: CRITICAL. Confidence: strongly supported. Detectability: static/runtime/post-build/audit. Blast radius: artifact → enterprise/external consumers. Reversibility: bounded before release, potentially difficult after distribution. Time-to-harm: latent/immediate. Misuse likelihood: likely accidental, adversarial plausible. Evidence currentness: attempt-specific/current producing vector. False-positive risk: medium for declared controlled impurity.
- Future remediation disposition: require evidence/reconciliation; reject stronger reproducibility/admission claim when closure is unqualified; route concrete mismatch to build/release/security owners.
- Proof obligation: `BUILD-CONFLICT-PROOF-001`.
- Saturation status: MATERIAL / streak reset.

### G2-CONFLICT-PATTERN-EFFECTIVE-IDENTITY-001 — adjacent lifecycle identities are locally valid but silently treated as one effective state
- Family: semantic ownership + state-transition + version/coexistence.
- Narrative: Build, Artifact/Release, Deployment and Runtime each hold a valid subject/revision, but an integration path treats one identifier as proof that all later stages have converged.
- Preconditions / activation conditions: reused tag/digest/version or missing transition evidence across build → release → deployment → runtime-effective lineage.
- Incompatible claims/actions/states: `artifact X exists/admitted/desired` versus `authoritative runtime cohort actually executes X`.
- Why local validation may miss it: each owner can validate its own record; conflict appears only when a downstream claim is inferred from upstream identity without current evidence.
- Detection candidates: lineage-stage typing; deployment/runtime cohort inventory; post-effect currentness comparison; revision-vector mismatch detection.
- Owner set: Build + Artifact/Release + Deployment/Runtime + Lifecycle/Observability.
- Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-deploy/runtime/audit. Blast radius: system/enterprise. Reversibility: bounded if caught before incompatible effects. Time-to-harm: immediate. Misuse likelihood: likely operationally. Evidence currentness: per-stage and runtime-current. False-positive risk: low where stage identities/evidence are absent or disagree.
- Future remediation disposition: classify as incomplete/false convergence; require transition/currentness evidence; reconcile/fence residual cohorts rather than rewriting history.
- Proof obligation: `BUILD-CONFLICT-PROOF-002`.
- Saturation status: MATERIAL / streak reset.

### G2-CONFLICT-PATTERN-SUPPLY-CHAIN-001 — individually authorized build primitives compose into unqualified supply-chain authority
- Family: authority + AI/low-code composition + provider/supply-chain.
- Narrative: a user/AI may be authorized to edit dependencies, configure a runner, use a cache and trigger a build separately, yet the composition can introduce a new executable dependency/build step or access path whose trust/secret/network authority was never jointly admitted.
- Preconditions / activation conditions: multiple individually permitted build actions jointly expand material provenance, executable code, network/filesystem/secret reach or signing/admission influence.
- Incompatible claims/actions/states: `each action authorized in isolation` versus `composed build path exceeds effective delegated authority/trust envelope`.
- Why local validation may miss it: action-level authorization and syntactic low-code validation do not evaluate transitive material execution or composite privilege.
- Detection candidates: pre-build action/material dependency analysis; effective authority calculation over `Enterprise → Station → Role → Person`; secret/network capability diff; provenance/trust admission check.
- Owner set: Authorization/Governance + Build + Security/Supply-chain + AGWS/AI + Provider/Binding.
- Severity: CRITICAL. Confidence: supported. Detectability: static/pre-build/runtime/audit. Blast radius: runner → enterprise/external supply chain. Reversibility: potentially difficult after credential/code exfiltration or artifact distribution. Time-to-harm: immediate/latent. Misuse likelihood: plausible accidental and adversarial. Evidence currentness: current authority, trust, material and runner capabilities. False-positive risk: medium because legitimate broad build pipelines may require explicit higher-scope admission.
- Future remediation disposition: catalogue/detect and route to authority/build/security owners; require explicit higher-scope evidence where concrete activation is observed; do not invent a blanket ban on generated build composition.
- Proof obligation: `BUILD-CONFLICT-PROOF-003`.
- Saturation status: MATERIAL / streak reset.

Existing `G2-CONFLICT-PATTERN-VERSION-001`, `G2-CONFLICT-PATTERN-MIGRATION-001`, `G2-CONFLICT-PATTERN-RECOVERY-001`, `G2-CONFLICT-PATTERN-SUPPORT-001`, `G2-CONFLICT-PATTERN-CURRENTNESS-001` and `G2-CONFLICT-PATTERN-AI-LOWCODE-001` also apply and are reused rather than duplicated.

## Visit disposition

- Local capability challenged in Full Pass 1: yes.
- Mandatory cluster challenged: yes — cluster 5.
- Material local edge findings: 6.
- Material cross-capability findings: 4.
- New reusable conflict patterns: 3.
- HIGH/CRITICAL without owner/detection/proof route: 0.
- Local no-material streak: 0.
- Cluster no-material streak: 0.
- Full pass count: unchanged; Full Pass 1 is not complete until all 28 capabilities and all 12 mandatory clusters are challenged.
