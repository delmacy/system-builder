# Generation 2 — Lifecycle / Versioning / Evolution / Migration — Full Pass 5 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 5
Disposition: research-only; no remediation, Work Package, TASK, Construction or product-code authority.

## Authority and fresh baseline

This revisit followed `RESEARCH_PIPELINE_STATE.json` as the sole phase/current-focus/next-action authority and re-read before acting:

- `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`;
- `edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`;
- `edge-cases/ADVERSARIAL_SATURATION_STATE.json`;
- `edge-cases/EDGE_CASE_INDEX.md`;
- `LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_EDGE_CASE_REGISTER.md`;
- `LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_FULL_PASS_4_REVISIT.md`;
- `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`.

Fresh branch head immediately before persistence was `564f855e2e9d10b509c0c3ab66f9ffb57a497891`. Baseline: Full Pass 5 at 26/28 capabilities and 12/12 mandatory clusters; 284 material edge scenarios + 123 reusable ConflictPatterns = 407 material findings; Lifecycle local no-material streak 1; all mandatory cluster streaks capped at 2; 0 HIGH/CRITICAL findings without owner/proof/detection route; Planning C blocked.

Canonical distinctions preserved: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; definition/model soundness != execution conformance != journal integrity != external-effect proof; certificate cryptographic validity != semantic authority/currentness; migration/readiness != convergence; retained history != current rollback eligibility; `UNKNOWN mutating effect -> reconcile-before-retry` unless the exact qualified operation contract proves retry safety; Fleet remains non-authoritative by default; GraphDB remains optional/provider-level.

## Adversarial mission exercised

The revisit carried the Typed Semantic Graph / Workflow proof hypothesis into evolution and migration without adopting it as target architecture. The main probes were:

1. **Graph-revision fracture** — workflow graph, child workflow, schema, policy, formula, provider binding, runtime build, credentials and proof profile migrate at different cuts while one aggregate revision is advertised.
2. **Verifier/profile upgrade and downgrade** — old `ProcessProofBundle` is re-verified by a newer verifier/profile, or a new proof is consumed by an older verifier that ignores fields; test whether compatibility is incorrectly treated as symmetric or claim-strengthening.
3. **Certificate currentness drift** — signature/key/path remains cryptographically valid while authorization, policy, trust roots, workflow revision, external-effect evidence or verifier policy has changed.
4. **Historical proof reinterpretation** — current verifier semantics are applied retroactively to historical evidence without preserving the producing verifier/profile/policy revision.
5. **Federated bilateral migration** — producer and consumer autonomous systems migrate contract/proof profiles independently, including offline cohorts and no shared mutable state; test handoff responsibility when one side is upgraded and the other is not.
6. **Child→parent proof migration** — child proof/profile changes while a durable parent instance remains pinned to an earlier composition contract; test whether parent completion silently strengthens or rejects historical child claims.
7. **Tamper-evident journal continuity across migration** — hash-chain/Merkle/signature algorithms, roots or checkpoint formats evolve; test whether append-only/inclusion evidence is confused with semantic continuity.
8. **Rollback of verifier/trust/profile** — retained verifier binary/profile is used as evidence that a historical completion claim can be safely re-established after state, policy, trust or external effects changed.
9. **Proof data migration/privacy** — historical trace/proof bundles are transformed, minimized, redacted, re-encrypted or relocated; test whether integrity/verification succeeds while required semantic evidence or purpose/residency constraints no longer hold.
10. **AI/low-code migration plan** — generated evolution plan preserves local step validity but changes proof-profile mappings, child bindings, allowed `UNKNOWN`, authority or evidence horizons without an explicit semantic owner.
11. **Resource/cardinality pressure** — revision × cohort × verifier/profile × trust-root × child-proof × provider combinations become large enough that tooling collapses them into one scalar `compatible/verified` status.
12. **Formal-assurance boundary mutation** — a WF-net/control-flow fragment is sound under one pinned model revision, then migration adds data/time/resource/cancellation/provider constraints; test whether the old soundness result is reused as if it proved the evolved executable system.

## Result

**ELIGIBLE NO-NEW-MATERIAL REVISIT.**

- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable `G2-CONFLICT-PATTERN-*`: **0**.
- New `ConflictInstance`: **0**.
- New preventive-invariant candidates: **0**.

Duplicate-screen against all 123 reusable ConflictPatterns found no distinct 124th material family.

The strongest candidate was **proof/verifier migration claim strengthening**: a proof bundle that was valid under profile P1 is accepted by verifier/profile P2 and then treated as if P2 had proved stronger/current semantics. This is material as a scenario class but is already covered by the composition of:

- `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001` — compatibility is role/operation/direction/revision qualified and must not be inverted or globalized;
- `G2-CONFLICT-PATTERN-PROOF-CLAIM-CONFLATION-001` — cryptographic/integrity/trace/model/effect claims must remain distinct;
- `G2-CONFLICT-PATTERN-CERTIFICATE-COMPOSITION-001` — a consuming verifier/parent may not strengthen a child/source proof beyond its qualified profile;
- `G2-CONFLICT-PATTERN-MIGRATION-READINESS-001` — successful prior validation does not establish current readiness after dependent revisions change;
- `G2-CONFLICT-PATTERN-SUPERSESSION-LINEAGE-001` — historical producing verifier/profile/policy lineage must remain distinguishable from current semantics;
- trust/currentness, residual-cohort, presence-semantics, federated-continuity and rollback-eligibility families.

No new semantic owner is required. No remediation is authorized.

## Formal-assurance findings and boundaries

### 1. Model-proof migration is not execution-proof migration

A workflow model that satisfied classical Workflow-Net soundness under revision R1 does not automatically retain that proof after an evolution to R2 that adds cancellation, priority, data guards, time, resource constraints, recursion or external effects. Classical soundness checks option-to-complete, proper completion and dead-transition freedom for the selected formal semantics; it does not establish that an evolved runtime execution occurred correctly or that external effects happened.

Portable consequence candidate: any reusable soundness result must bind the exact model/revision and formal semantics/assumptions for which it was established. Reuse outside that domain becomes `UNKNOWN/NOT_PROVED_BY_THIS_RESULT`, not `PROVEN_COMPLETED`.

### 2. Proof-profile migration is directional

SLSA Verification Summary Attestation explicitly carries verifier identity/version, policy URI+digest, input attestations, result and SLSA version; its parsing rules distinguish major incompatible changes from minor monotonic/backward-compatible ones and require consumers to accept specific signer/verifier pairs. This supports a portable principle: proof-profile compatibility is an explicit relation, not equality of JSON shape or signature validity.

A newer verifier accepting an older bundle proves only the claims defined by the applicable compatibility/profile rules. It cannot retroactively add obligations that were absent from the producing profile. Likewise an older verifier ignoring unknown fields must not be treated as having checked them.

### 3. Anti-rollback/freeze semantics apply to proof metadata too

The Update Framework requires version monotonicity for trusted metadata and rejects expired metadata, explicitly defending against rollback/freeze attacks. This is portable evidence that `previously trusted` is not equivalent to `currently eligible`: proof/verifier/policy/trust metadata needs revision/currentness qualification if used to authorize evolution or completion claims.

This does not make TUF a universal SB mechanism; it is evidence for anti-rollback/currentness semantics.

### 4. Tamper-evident continuity is narrower than semantic continuity

Merkle inclusion/consistency proofs establish inclusion and append-only consistency between committed trees. They do not prove that migrated records preserve the same workflow semantics, that omitted/redacted evidence was permissible, or that an external effect occurred. A journal format/hash/signature migration can therefore preserve cryptographic continuity while semantic proof continuity remains `UNKNOWN` unless separately qualified.

### 5. Federated migration cannot invent a shared cut

Two autonomous systems may migrate contract, workflow and verifier/profile revisions at different times. A bilateral handoff remains safe only if producer and consumer each bind the exact contract/proof/effect semantics they claim, and responsibility for `PARTIAL/UNKNOWN` remains explicit. A single Fleet/control-plane `migrated` flag cannot become authoritative local truth.

## Proof-obligation refinements carried to Planning C/D/E and Architecture Reconciliation

These are research handoff candidates, not implementation requirements yet:

1. **Proof-domain binding:** every `WorkflowCompletionCertificate` / `ProcessProofBundle` records the exact graph/workflow revision, build/deployment, verifier profile/version, policy/trust inputs and effect-evidence profile used for each asserted claim.
2. **No retroactive strengthening:** migration/re-verification may preserve or weaken a historical claim only according to explicit compatibility semantics; it must not strengthen a claim merely because a newer verifier can parse or authenticate the old artifact.
3. **Verifier/profile compatibility direction:** Planning E should test old-proof→new-verifier and new-proof→old-verifier separately, including unknown-field behavior and rejected/inconclusive mappings.
4. **Currentness/anti-rollback:** stale/expired/superseded verifier, policy, trust or proof metadata must not silently authorize current `PROVEN_COMPLETED`, rollback or migration readiness.
5. **Historical producing lineage:** offline verification of historical completion must preserve the producing model/build/profile/policy semantics rather than reinterpret the bundle solely under current rules.
6. **Child-proof migration:** parent completion must bind the child proof/profile expected by the parent revision; child profile upgrades/downgrades require explicit compatibility mapping and cannot silently strengthen parent status.
7. **Federated bilateral proof handoff:** each autonomous side proves only its own obligations and explicit handoff contract; no shared-state or shared-cut assumption is inferred.
8. **Journal-algorithm migration:** hash/Merkle/signature algorithm or commitment-format evolution must prove integrity continuity separately from semantic/effect continuity.
9. **UNKNOWN preservation:** missing external evidence, incompatible verifier/profile, unverifiable historical trust or incomplete migrated evidence must force `UNKNOWN/INCONCLUSIVE` rather than false `PROVEN_COMPLETED`.
10. **Planning E lifecycle cases:** add proof-profile forward/backward-compatibility tests; stale verifier/policy rejection; historical-proof offline verification under pinned semantics; child-profile migration; federated version-skew handoff; and integrity-continuity-with-semantic-UNKNOWN cases, in addition to the already required sound workflow, bounded loop/recursion, invalid/deadlocking rejection, trace conformance, tamper detection, external UNKNOWN blocking false completion and child-proof composition.

## Evidence checked 2026-09-05

- Workflow-net soundness literature continues to define classical soundness using option-to-complete, proper completion and no dead transitions; this is model-semantics evidence, not execution/effect proof.
- SLSA Verification Summary Attestation v1.2 identifies verifier/version, policy digest, input attestations, verification result and SLSA version, and documents version/parsing compatibility semantics. This supports explicit verifier/profile lineage and non-strengthening consumption.
- The Update Framework specification requires trusted metadata not to roll back to lower versions and rejects expired metadata as a potential freeze attack. This supports currentness/anti-rollback qualification for proof/control metadata.
- RFC 9162/RFC 6962-style Certificate Transparency Merkle consistency concepts establish append-only/inclusion relations; they do not establish workflow semantic correctness or external-effect truth.

External systems/standards are portable semantic witnesses only. Their exact formats and algorithms are not promoted into universal target architecture.

## Conflict-family coverage

The revisit deliberately challenged structural graph, state-transition, semantic ownership, rule/formula/condition, temporal/ordering, resource/capacity, authority/responsibility/separation-of-duty, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure/instruction, cross-process, objective/optimization and AI/low-code composition conflicts.

All surviving candidates map to existing authoritative ConflictPatterns that already carry activation conditions, incompatible claims/actions/states, detection stage/candidate, owners, severity, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive risk and future remediation disposition. No signal is promoted to confirmed conflict.

## Saturation disposition

- Lifecycle / Versioning / Evolution / Migration local eligible no-material streak: **1 -> 2**.
- Mandatory cluster streaks: **unchanged at 2**, capped.
- Material totals remain **284 edge scenarios + 123 ConflictPatterns = 407 material findings**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- Full Pass 5 capability coverage: **26/28 -> 27/28**.
- Full Pass 5 mandatory-cluster coverage: **12/12**.
- Completed full passes remain **4/8 minimum**.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- `PLANNING_C_TARGET_ARCHITECTURE` remains **BLOCKED**.

## Next-action candidate

Subject to fresh head/state revalidation before the next persistence, continue only Full Pass 5 with **Architecture Reconciliation as a Capability**, the 28th and final capability of the pass. Duplicate-screen all 123 ConflictPatterns. Carry Typed Semantic Graph/Federation/Workflow formal assurance into desired/declared/model versus observed/effective/execution-proof reconciliation; soundness proof revision binding; reference-graph versus journal conformance; split-view and truncated journals; stale/wrong build/deployment; cross-tenant evidence; child/federated proof composition; verifier/profile drift; external-effect `UNKNOWN`; conflicting evidence sources; `PARTIAL/INCONCLUSIVE` promoted to conformant; residual/offline cohorts; supersession lineage; authority/SoD for accepting deviations; resource/cardinality exhaustion; contradictory human reconciliation procedures; and AI/low-code reconciliation that erases dimensions or strengthens claims. Architecture Reconciliation local streak is already 2 and must not be inflated. Completing that capability would complete Full Pass 5, but Planning C must still remain blocked because the minimum is 8 full passes and final negative-space/saturation closure has not occurred.