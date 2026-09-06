# Generation 2 — Build / Dependency Graph / Reproducibility — Full Pass 6 Revisit

Status: FULL PASS 6 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK CAPPED AT 2 / CLUSTER STREAK CAPPED AT 2
Capability: Build / Dependency Graph / Reproducibility
Paired cluster: Build × Artifact/Release × Deployment × Runtime
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. Research only. This dossier does not authorize target architecture, product implementation, Work Packages, TASKs, Construction or remediation. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`.

## 1. Priority hypotheses under challenge

This revisit carries the `Typed Semantic Graph`, autonomous-build and formal-assurance hypotheses into build semantics. The questioned composition is not merely whether a dependency graph can be built, but whether a build/release/runtime claim can be strengthened beyond the evidence that produced it.

The main propositions attacked were:

1. semantic graph closure proves effective build closure;
2. a reproducible byte result proves semantic/provenance equivalence;
3. provenance integrity proves complete effective-input capture;
4. a successful build proves release/deployment/runtime eligibility;
5. a current verifier can safely strengthen an older build claim;
6. autonomous builds observed through Fleet can be treated as a single authoritative effective graph;
7. an attested subject can stand in for workflow/process execution proof.

All seven are unsafe as universal implications. Their strongest counterexamples remain covered by the existing 123 `G2-CONFLICT-PATTERN-*` inventory, especially qualified identity/currentness, revision-vector, provider-support, compatibility-direction, residual-cohort, false-convergence, proof-claim-conflation, certificate-composition, authority-non-amplification, resource/capacity and semantic-ownership families. No distinct 124th reusable conflict pattern survived duplicate-screening.

`GraphDB` remains only a storage/provider hypothesis. None of the build proof questions requires graph-database technology; relational typed graph, JSONB, artifact/provenance records and optional graph projections remain compatible alternatives.

## 2. Technique rotation — materially different from Passes 1–5

Pass 6 emphasized proof falsification rather than repeating ordinary dependency/version matrices:

- **claim-lattice falsification:** attempt to derive `semantic closure -> build closure -> reproducible -> provenance-complete -> release-eligible -> deployed -> runtime-converged` and identify every unjustified strengthening edge;
- **witness subtraction:** remove one provenance/material/environment witness while preserving an apparently valid attestation or artifact digest and test which claims actually remain justified;
- **two-build relational metamorphism:** compare A/B builds under controlled changes in locale, file ordering, timezone, hostname, build path, concurrency, toolchain and provider resolution; classify byte equality/difference independently from semantic/provenance equality;
- **subject-identity permutation:** keep artifact bytes equal while changing graph revision, builder trust base, signer, build type, dependency evidence or policy qualification;
- **environmental perturbation under constant canonical graph:** change ambient effective inputs without changing graph topology, forcing analysis of hermeticity versus graph completeness;
- **proof-profile substitution:** verify the same build evidence under a different verifier/policy/currentness horizon and challenge retroactive claim strengthening;
- **concurrent cut interleavings:** build A and B from different qualified cuts, promote one, deploy the other partially, then observe mixed runtime cohorts;
- **autonomous/offline divergence:** permit a generated build to remain locally valid while central/Fleet evidence becomes stale or unavailable;
- **resource amplification metamorphism:** preserve local graph validity while multiplying target/platform/provider matrices until resource/cost bounds fail;
- **human/AI authority composition:** combine individually authorized dependency, builder, registry and promotion actions into a globally unauthorized supply-chain mutation.

## 3. Evidence refresh

Fresh external evidence continues to support existing classifications rather than a new conflict family.

### 3.1 SLSA provenance is a qualified production claim, not semantic completeness

SLSA v1.2 describes provenance around `buildDefinition`, `runDetails`, `builder`, `externalParameters`, `resolvedDependencies` and produced `subject`. Its requirements explicitly preserve a trust boundary: provenance accuracy/completeness depends on the build platform, external parameters must be captured at stronger levels, while resolved-dependency completeness remains best effort. The builder identity represents the transitive trust base that consumers care about; consumers must qualify signer/builder pairs.

Portable consequence: a signed/intact provenance statement can prove a bounded production/history claim under a builder profile without proving that the canonical semantic graph was complete, that every ambient input was captured, or that the artifact is currently release/deployment/runtime eligible.

Sources consulted 2026-09-05:
- https://slsa.dev/spec/v1.2/build-requirements
- https://slsa.dev/spec/v1.2/build-provenance
- https://slsa.dev/spec/v1.2/verification_summary

### 3.2 Reproducibility is relational and environment-qualified

Reproducible Builds documents that locale, timezone, filesystem ordering, build path, timestamps, hostname, CPU/load and other environment variation can affect outputs. `reprotest` intentionally varies such factors. Stable ordering and explicit environment definition are required where those dimensions influence output.

Portable consequence: `same bytes` is evidence of equality for a particular artifact digest under tested variation, not proof that the producing semantic graph, builder trust, authority, provenance or runtime behavior were equivalent. Conversely `different bytes` after an allowed target-specific variation is not automatically a semantic conflict.

Sources consulted 2026-09-05:
- https://reproducible-builds.org/docs/adding-build-variance/
- https://reproducible-builds.org/docs/stable-inputs/
- https://reproducible-builds.org/docs/locales/
- https://reproducible-builds.org/docs/deterministic-build-systems/

Provider/system mechanisms remain evidence examples only and are not promoted to canonical System Builder semantics.

## 4. Duplicate-screened material candidates

### 4.1 Provenance-valid but semantically under-specified build

**Activation conditions:** the produced subject and provenance are authentic, but effective semantic/build inputs are only partially represented or their completeness guarantee is weaker than a later consumer assumes.

**Incompatible claims/actions/states:** producer claims `artifact X was built by qualified builder Y from recorded build definition`; consumer upgrades this to `X realizes the complete/current canonical semantic graph and is deployable`.

**Detection candidate/stage:** static/pre-release proof-profile validation; compare declared semantic/build closure with provenance completeness guarantees and current policy. Missing evidence is a signal and yields bounded `UNKNOWN/INCONCLUSIVE`, not automatic conflict confirmation.

**Owners:** Build; Artifact/Release; Provider/Binding; Governance/Trust for verifier policy.

**Assessment:** HIGH potential severity; strongly supported; detectability static/pre-release/audit; blast radius build→system/external parties; potentially irreversible after deployment; immediate/delayed harm; plausible misuse; currentness must include builder/policy/graph cut; false-positive risk MEDIUM because incomplete provenance may be acceptable for a deliberately weaker claim.

**Disposition:** already covered by qualified-claim/proof-claim-conflation/currentness/provider-support families. Future route: require additional evidence or refuse claim strengthening. No remediation now.

### 4.2 Reproducible bytes with non-equivalent producing authority/trust

**Activation conditions:** two builds produce byte-identical subjects while builder identity, signer/trust base, graph revision, policy, provider binding or producing authority differ.

**Incompatible claims/actions/states:** digest equality versus an assertion that the builds are semantically/provenance/authority equivalent.

**Detection candidate/stage:** pre-release provenance/profile comparison; independent rebuild can be evidence for reproducibility while remaining distinct from authorization/trust qualification.

**Owners:** Build; Artifact/Release; Enterprise Trust/PKI; Governance.

**Assessment:** HIGH; strongly supported; static/pre-release; artifact/system blast radius; bounded to potentially irreversible; immediate/delayed; plausible; evidence currentness current/pinned; false-positive MEDIUM because byte equality is legitimately sufficient for narrow content-identity claims.

**Disposition:** existing proof-claim-conflation, qualified identity and authority/trust families. Future route: preserve separate claims rather than equating identities.

### 4.3 Effective-input perturbation hidden by canonical graph stability

**Activation conditions:** canonical typed graph and declared dependency closure remain unchanged while locale, filesystem ordering, build path, time, host state, network resolution, toolchain detail or another ambient input changes effective production semantics/output.

**Incompatible claims/actions/states:** graph says unchanged; effective build environment differs materially.

**Detection candidate/stage:** property/metamorphic rebuilds under controlled environmental perturbations; provenance/effective-input comparison; hermeticity qualification.

**Owners:** Build; Developer/Operator Experience; Provider/Binding where external resolution exists.

**Assessment:** MEDIUM–HIGH; strongly supported; pre-build/build/audit; artifact/system blast radius; usually bounded rebuild, potentially larger after release; delayed or immediate; accidental/plausible; evidence currentness current; false-positive MEDIUM because some variation is intentionally outside the reproducibility contract.

**Disposition:** existing hidden-input/effective-identity/currentness and resource families. Future route: qualify the build contract/environment rather than globally forbid variation.

### 4.4 Concurrent qualified cuts create a mixed effective runtime graph

**Activation conditions:** Build A and Build B are individually valid under distinct graph/toolchain/provider/policy cuts; release/promotion/deployment interleave and leave residual runtime cohorts.

**Incompatible claims/actions/states:** each pipeline stage locally reports success while the fleet/runtime population no longer shares one qualified effective graph.

**Detection candidate/stage:** pre-promotion cut identity check + runtime cohort reconciliation + directed compatibility analysis. Fleet evidence remains a signal/projection unless adopted by the semantic owner.

**Owners:** Build; Artifact/Release; Deployment/Runtime; Lifecycle; Provider/Binding.

**Assessment:** HIGH; strongly supported; runtime/audit; station/system blast radius; migration may be required; immediate/delayed; plausible; currentness bilateral/cohort-qualified; false-positive MEDIUM because mixed cohorts can be legitimate when compatibility is explicitly proven.

**Disposition:** existing residual-cohort, revision-vector, compatibility-direction and false-convergence patterns. Future route: qualify coexistence or reconcile; no implementation now.

### 4.5 Build proof imported into workflow completion proof

**Activation conditions:** artifact digest/provenance/verifier success is referenced by a `WorkflowCompletionCertificate`/`ProcessProofBundle` and treated as evidence that process execution/effects occurred correctly.

**Incompatible claims/actions/states:** `qualified artifact/build exists` versus `the workflow instance executed conformantly and required external effects occurred`.

**Detection candidate/stage:** certificate-profile/type checking in the independent verifier; explicit proof-domain lattice.

**Owners:** Build; Workflow & Durable Execution; Governance/Audit; effect semantic owners.

**Assessment:** HIGH; strongly supported; static/post-effect; workflow/system/external parties; potentially irreversible; immediate/delayed; plausible/likely if proof domains are collapsed; currentness graph/build/effect-qualified; false-positive LOW when the claim actually states process completion.

**Disposition:** directly absorbed by `G2-CONFLICT-PATTERN-PROOF-CLAIM-CONFLATION-001`. Future route: proof-domain non-strengthening. No new pattern.

## 5. Mandatory cluster — Build × Artifact/Release × Deployment × Runtime

The cluster was exercised explicitly, not inferred from the local capability.

Adversarial chain:

`Typed Semantic Graph revision -> qualified build definition/effective inputs -> produced subject + provenance -> release decision -> deployment cut -> autonomous runtime cohort -> observed/Fleet projection`.

No adjacent edge in that chain authorizes strengthening all downstream claims. In particular:

- semantic closure does not prove target build closure;
- build success does not prove release eligibility;
- release eligibility does not prove deployment success;
- deployment ACK does not prove runtime convergence;
- runtime health does not prove semantic/process correctness;
- Fleet visibility does not become canonical truth by aggregation;
- byte identity does not prove producing authority/trust/provenance equivalence;
- provenance integrity does not prove workflow/process execution completion.

All candidate conflicts remain within existing revision/currentness, qualified identity, ambiguous effect, residual cohort, compatibility, false convergence and proof-claim families. Cluster streak is already saturated at 2 and is not incremented.

## 6. Formal-assurance and detection candidates

Planning C/D/E and Architecture Reconciliation should consume these as proof obligations, not implementations:

1. **Build claim profile:** every build proof/attestation claim names graph/build definition, effective-input/completeness profile, builder/trust identity, target/platform/provider cut, subject and policy/currentness horizon.
2. **No proof-domain strengthening:** artifact digest, provenance integrity/authenticity, reproducibility, release approval, deployment evidence, runtime health and workflow completion remain separate proof domains.
3. **Relational reproducibility:** a reproducibility claim states which permitted environment variations were challenged and which effective inputs are assumed fixed.
4. **Independent verifier behavior:** missing/weak provenance, stale builder trust, unresolved provider/currentness or mixed runtime cohorts yield `UNKNOWN/INCONCLUSIVE` for stronger claims rather than `PROVEN`.
5. **Subject-set completeness:** where a build claims a capability subset, proof must bind the intended target subset and distinguish intentionally absent optional capability edges from missing required closure.
6. **Cohort-aware deployment proof:** a release/build proof cannot imply system-wide runtime convergence without qualified cohort evidence and directed compatibility.
7. **Autonomous/offline currentness:** locally valid autonomous builds retain local truth; central/Fleet evidence may age independently and cannot silently revoke or certify local semantic truth without an explicit authority contract.
8. **Property/metamorphic acceptance candidates for Planning E:** rebuild under bounded environment perturbations; same-bytes/different-provenance counterexample; different-bytes/allowed-target-variation counterexample; omitted provenance witness causing claim downgrade; mixed-cohort deployment preventing false convergence; build provenance refusing promotion to workflow `PROVEN_COMPLETED`.

These obligations complement, but do not replace, the workflow-focused Planning E obligations already carried forward for soundness, bounded loops/recursion, deadlock rejection, trace conformance, tamper detection, external `UNKNOWN`, child-proof composition and offline verification.

## 7. Preventive invariant candidate disposition

No new preventive invariant is elevated.

A global invariant such as `one semantic graph revision -> exactly one byte-identical artifact/environment/runtime closure` would reject legitimate multi-platform, conditional, provider-specific and autonomous builds. The material universal requirement is already represented by existing non-strengthening/qualification families: a claim must remain bounded to its subject, revision, target, provider, authority, trust and evidence profile.

## 8. Saturation disposition

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- New ConflictInstances: **0**.
- New preventive invariants: **0**.
- New proof obligations: **8 refinements**, all mapped to existing conflict families and future Planning C/D/E / Architecture Reconciliation.
- Build local no-material streak remains **2**, capped.
- Build × Artifact/Release × Deployment × Runtime cluster streak remains **2**, capped.
- Material inventory remains **284 edge scenarios + 123 ConflictPatterns = 407 material findings**.
- HIGH/CRITICAL findings without owner/proof/detection route remain **0**.
- Full Pass 6 advances to **7/28 capabilities + 7/12 mandatory clusters**.
- Completed full passes remain **5/8 minimum**; target **12**, no maximum.
- Negative-space remains `NOT_STARTED`; saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

Next eligible focus: **Artifact / Release / SBOM / Provenance**, explicitly exercising **Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution** with formal assurance and proof-profile falsification, after fresh head/state revalidation.