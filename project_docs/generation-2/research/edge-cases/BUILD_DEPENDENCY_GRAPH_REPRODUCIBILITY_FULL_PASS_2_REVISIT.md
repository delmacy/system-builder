# Generation 2 — Build / Dependency Graph / Reproducibility — Full Pass 2 Revisit

Status: FULL PASS 2 — MATERIAL FINDINGS / LOCAL STREAK 0 / CLUSTER STREAK 0
Capability: Build / Dependency Graph / Reproducibility
Paired cluster: Build × Artifact/Release × Deployment × Runtime
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No target architecture or remediation is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, provider IDs non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Technique rotation and evidence

This revisit used qualified-cut analysis across resolver/registry/platform/toolchain state, target-matrix differential analysis, cache-key semantic omission probes, provenance-versus-byte-equivalence comparison, concurrent promotion cuts, provider-differential resolution, stale/offline metadata and aggregate resource/authority composition. It duplicate-screened against the 115 reusable ConflictPatterns already indexed.

Portable evidence:

- SLSA v1.2 provenance treats every artifact fetched during build initialization/execution as a dependency and says control-plane/cache influence that changes the build definition should be represented in resolved dependencies. It also separates build definition from run details and artifact subject: https://slsa.dev/spec/v1.2-rc2/build-provenance
- SLSA requirements state dependency completeness is best effort at some levels; cryptographically authentic provenance therefore does not by itself prove complete effective closure: https://slsa.dev/spec/v1.0-rc2/requirements
- Reproducible Builds documents randomness as a source of nondeterminism; Nix reproducibility guidance notes that deterministic references and sandboxing are strong foundations but do not eliminate timestamp and other nondeterminism: https://reproducible-builds.org/docs/randomness/ and https://reproducible.nixos.org/

These sources support portable semantics only.

## New local material scenarios

### G2-EDGE-BUILD-007 — individually valid dependency selections do not share one qualified resolution cut

- Activation conditions: lockfile, registry metadata, platform markers, package-source mapping, resolver/toolchain revision and target platform are each valid/current within their own observation horizon, but were observed at different cuts; conditional/optional edges are evaluated from that mixed evidence.
- Incompatible claims/actions/states: every selected dependency is locally admissible, yet there is no evidence that the selected closure existed as one coherent qualified graph for the build attempt.
- Detection candidate: pre-build qualified-cut check over lock/material identities, resolver/toolchain revision, target dimensions, registry/source evidence and observation horizons; post-build provenance comparison.
- Owners: Build primary; Provider/Binding and Lifecycle for resolver/registry semantics.
- Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-build/post-build. Blast radius: artifact → release/runtime fleet. Reversibility: easy before promotion, difficult after distribution. Time-to-harm: immediate/latent. Misuse likelihood: likely accidental. Evidence currentness: mixed unless a common cut is proven. False-positive risk: medium where ecosystem semantics explicitly guarantee equivalence across the observed cuts.
- Expected safe behavior: closure is qualified as an attempt-specific set; inability to prove coherent resolution yields `INCONCLUSIVE` rather than a stronger reproducibility/eligibility claim.
- Forbidden behavior: lockfile presence or individually valid package versions are treated as proof that the aggregate dependency closure is coherent.
- Recovery: re-resolve against a qualified snapshot/cut, preserve the failed attempt evidence, rebuild and compare lineage.
- Proof obligation: `BUILD-ADV-PROOF-007` — aggregate closure qualification cannot be inferred solely from per-member validity.
- Conflict mapping: existing `G2-CONFLICT-PATTERN-QUALIFICATION-JOIN-001`, `G2-CONFLICT-PATTERN-REVISION-VECTOR-001`, `G2-CONFLICT-PATTERN-CURRENTNESS-001`; no duplicate pattern created.

### G2-EDGE-BUILD-008 — target-dependent effective graph changes without a canonical build-intent revision

- Activation conditions: optional/conditional dependencies, CPU features, OS/architecture, locale/toolchain capability or resolver provider alter the effective graph while the nominal build intent/lock identity remains unchanged.
- Incompatible claims/actions/states: canonical intent appears unchanged while two legitimate targets resolve materially different dependency/build-step closures and may therefore have different security, license, runtime or authority implications.
- Detection candidate: static/pre-build target-matrix expansion and effective-closure identity comparison; provenance must bind the selected target dimensions and resolved closure.
- Owners: Build primary; Standards/API Compatibility, Provider/Binding and Artifact/Release where target variants are admitted.
- Severity: HIGH. Confidence: strongly supported. Detectability: static/pre-build/post-build. Blast radius: artifact cohort/runtime target. Reversibility: bounded before release. Time-to-harm: immediate/latent. Misuse likelihood: likely accidental, plausible AI/low-code. Evidence currentness: current target/resolver/toolchain dimensions required. False-positive risk: medium because intentional target variants are legitimate when explicitly represented.
- Expected safe behavior: target-conditioned closure is explicit and separately qualified; target variance cannot be hidden behind one unqualified reproducibility claim.
- Forbidden behavior: same intent/lock label means same effective graph across targets; provider-specific target identity becomes canonical truth.
- Recovery: enumerate target-conditioned closures, reconcile variant identity/eligibility, rebuild affected targets if qualification is absent.
- Proof obligation: `BUILD-ADV-PROOF-008` — a material target-conditioned closure change must remain visible in build evidence even when the nominal intent revision is unchanged.
- Conflict mapping: existing `G2-CONFLICT-PATTERN-EFFECTIVE-IDENTITY-001`, `G2-CONFLICT-PATTERN-REVISION-VECTOR-001`, `G2-CONFLICT-PATTERN-PROVIDER-QUALIFICATION-001`; no duplicate pattern created.

## New cross-capability material scenario

### G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-005 — byte-reproducible output is admitted across incompatible producing authority/policy contexts

- Activation conditions: independent builds produce byte-identical artifact digests, but their producing builders, dependency qualification, authority envelope, policy revision, provenance completeness or trust state differ; release/deployment deduplicates solely by digest.
- Incompatible claims/actions/states: byte equivalence is true while eligibility/provenance/authority equivalence is false or unknown.
- Detection candidate: pre-release qualification join across artifact digest plus producing build/provenance/trust/policy/authority revision vector; runtime lineage audit for already-adopted cohorts.
- Owners: Build + Artifact/Release/SBOM/Provenance + Governance/Security/Trust; Deployment/Runtime consumes qualified release identity.
- Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-release/audit. Blast radius: release → runtime fleet/external consumers. Reversibility: bounded before deployment, potentially difficult after distribution. Time-to-harm: immediate/latent. Misuse likelihood: plausible operationally and adversarially. Evidence currentness: current admission policy/trust plus immutable producing evidence. False-positive risk: low when producing qualification vectors materially disagree; higher when an owner has explicitly declared equivalence.
- Expected safe behavior: byte identity may support artifact equivalence but cannot silently substitute for producing-context eligibility; adoption remains qualified by the owning policy/trust semantics.
- Forbidden behavior: matching digest automatically imports another build's authority, provenance completeness, trust or release eligibility.
- Recovery: reconcile producing lineages, retain digest equality as evidence only, select/adopt an explicitly qualified lineage or mark eligibility `INCONCLUSIVE`.
- Proof obligation: `XBUILD-ADV-PROOF-005` — reproducible bytes do not by themselves prove equivalent provenance, authority, policy or release eligibility.
- Conflict mapping: existing `G2-CONFLICT-PATTERN-ATTESTATION-QUALIFICATION-001`, `G2-CONFLICT-PATTERN-TRUST-AUTHORITY-001`, `G2-CONFLICT-PATTERN-QUALIFIED-CLAIM-001`; no duplicate pattern created.

## Duplicate-screened probes

Cache keys omitting semantic inputs map to `G2-EDGE-BUILD-003` plus revision-vector/currentness patterns; ambient locale/timezone/network/toolchain nondeterminism maps to `G2-EDGE-BUILD-001`; concurrent build/promotion cuts map to `G2-EDGE-BUILD-004`; remote cache/registry ambiguity maps to `G2-EDGE-BUILD-005` and provider-effect/idempotency patterns; pathological graph/resource/AI authority expansion maps to `G2-EDGE-BUILD-006` and existing automation/authority patterns. No redundant ConflictPattern was created.

## Saturation disposition

Material findings survived duplicate screening. Build local streak remains/resets **0**. Build × Artifact/Release × Deployment × Runtime cluster streak remains/resets **0**. All HIGH/CRITICAL findings have owners, detection routes and proof obligations. Planning C remains blocked.
