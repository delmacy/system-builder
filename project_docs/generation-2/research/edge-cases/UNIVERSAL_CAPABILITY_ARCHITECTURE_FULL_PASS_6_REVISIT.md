# Generation 2 — Universal Capability Architecture — Full Pass 6 Revisit

Status: ACTIVE — MATERIAL FINDING / STREAK RESET
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Universal Capability Architecture (UCA)
Pass: 6
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `UNIVERSAL_CAPABILITY_ARCHITECTURE_EDGE_CASE_REGISTER.md`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, and `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`.

Research only. No product code, Work Package, TASK, Construction, GraphDB implementation, Fleet control plane, global IR implementation, automatic remediation or concrete conflict correction is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, and `Research != remediation`.

## 1. Revisit method

Full Pass 6 used techniques materially different from Passes 1–5 and carried all prioritized hypotheses plus the new research vectors into UCA:

1. temporal-slice substitution across valid-time, transaction-time, current, historical and planned graph cuts;
2. provenance-edge permutation and lineage Cartesian-product falsification;
3. decision/calculation/process kind substitution using DMN-style hit-policy/default semantics as an external witness;
4. quantity/unit and scalar/vector shape substitution;
5. exact/interval/distribution/model-confidence/UNKNOWN substitution;
6. queue stability versus point-utilization substitution under burst/retry/fan-out pressure;
7. graph-rewrite semantic-diff mutation across revision N -> N+1 with in-flight pinned instances;
8. causal/counterfactual claim strengthening from observational lineage/correlation;
9. generic-envelope weakening across revision/currentness, authority, proof domain and effect stage;
10. autonomous-build/Fleet identity and evidence permutations.

All 123 existing reusable ConflictPatterns were duplicate-screened before accepting novelty.

## 2. Evidence refresh

External evidence materially sharpens the provenance boundary.

- W3C PROV models provenance through entities, activities, agents, derivations and responsibility relations. Provenance can support assessments of quality, reliability or trustworthiness, but the existence of a provenance relation is not itself an authority or semantic-correctness claim.
- OpenLineage 1.53 distinguishes design-time Job/Dataset metadata from runtime Run events, gives each Run its own identity, and provides explicit lineage facets for exact dataset/job/field dependencies.
- OpenLineage explicitly warns against inferring every event input as a source of every output: the Lineage Job Facet exists to encode exact source-to-target edges and avoid false Cartesian-product lineage.
- DMN 1.5 demonstrates that decision semantics are not reducible to generic workflow or calculation: hit policy, rule ordering, aggregation and default/no-match behavior materially determine a decision result.
- IEEE 1788.1 demonstrates that interval arithmetic preserves interval-valued uncertainty and propagates computation properties rather than silently collapsing uncertain quantities to scalars.

Portable conclusion: a typed graph or universal envelope must preserve relation kind and evidence basis. A set of observed inputs/outputs is insufficient evidence for pairwise derivation; provenance edges require explicit producer/owner evidence or must remain `UNKNOWN/INCONCLUSIVE`.

## 3. Material finding

### G2-CONFLICT-PATTERN-PROVENANCE-EDGE-OVERATTRIBUTION-001 — Boundary observation is expanded into false lineage edges

- **Family:** data/consistency + semantic ownership + cross-process + temporal/currentness + AI/low-code composition.
- **Preconditions / activation conditions:** a job, workflow, federated handoff, build or calculation boundary exposes multiple candidate inputs and outputs, but exact source-to-target/field-to-field derivation is not fully declared or observed.
- **Incompatible claims/actions/states:** the evidence supports only `inputs observed at boundary` and `outputs observed at boundary`, while a projection/analyzer/AI infers that every input derived every output, then downstream impact, privacy, deletion, billing, proof or causal analysis consumes those invented edges as true lineage.
- **Why local validation can miss it:** every input and output identity can be individually valid, the graph remains structurally well-typed, and a transitive/Cartesian expansion is graph-valid even though the semantic derivation claims were never evidenced.
- **Detection candidates:** static lineage-claim provenance check; pre-analysis edge-evidence completeness; runtime producer-declared exact-edge capture; post-effect comparison between declared and observed lineage; flag inferred edges separately from asserted/observed edges.
- **Owner set:** producing semantic owner + Data/Schema/Provenance owner + consuming analyzer/decision owner; UCA owns only typed relation/evidence distinction and must not invent domain lineage.
- **Severity:** HIGH.
- **Confidence:** strongly supported by W3C PROV and explicit OpenLineage exact-lineage semantics.
- **Detectability:** static/pre-execution when exact mappings are declared; runtime/post-effect otherwise.
- **Blast radius:** field/dataset -> workflow/process -> privacy/compliance -> enterprise/federated dependency analysis.
- **Reversibility:** bounded when only analytical projections consumed the false edge; potentially migration/retraction when downstream retention, deletion, billing, proof or authority decisions adopted it.
- **Time-to-harm:** immediate for automated impact/policy decisions; latent for historical lineage and audit.
- **Misuse likelihood:** plausible accidental; elevated for generic graph explorers and AI-generated lineage.
- **Evidence currentness:** exact edge assertion/observation must be revision-, run-, subject- and time-qualified; historical lineage must not be silently reinterpreted under current definitions.
- **False-positive risks:** conservative coarse-grained lineage can intentionally say a job depends on a set of datasets without claiming field/output pairwise derivation. Detection must distinguish coarse dependency from exact derivation rather than require field-level detail universally.
- **Future remediation disposition:** catalogue and require future consumers to preserve `asserted/observed/inferred` lineage kind and evidence qualification; route concrete false-edge instances to the producing/consuming owners. No automatic graph rewrite or implementation is authorized here.
- **Proof obligation:** `UCA-ADV-PROOF-012` — adding unrelated inputs/outputs to the same execution boundary cannot manufacture exact derivation edges, causal claims, authority or downstream semantic dependencies without explicit evidence.
- **Saturation:** MATERIAL; UCA local no-material streak resets from 2 to 0.

This is a reusable ConflictPattern, not a ConflictInstance. No current product defect is asserted.

## 4. Other mandatory-vector results

### Temporal / dynamic graph semantics

Valid-time versus transaction-time, future-effective rules, retroactive correction, overlapping validity windows and in-flight pinned revisions all produced material pressure but duplicate-screened into existing currentness, revision-vector, compatibility-direction, historical-recomputation and residual-cohort families. No separate temporal pattern is claimed in this round.

### Decision semantics

Substituting a workflow branch, deterministic calculation, DMN-style decision, statistical estimate, optimization result or AI recommendation reproduced `ANALYTICAL-KIND-CONFLATION-001`, semantic ownership and proof-claim-conflation. Decision hit policy/default/priority remain candidate cross-cutting semantics for Planning C classification, not an automatically promoted capability.

### Units / dimensional analysis

Quantity-kind/unit mismatches remain material but are already represented by mathematical semantics, qualified claims and analytical-kind boundaries. UCA must not normalize `money`, `rate`, `duration`, `count`, probability or affine quantities into an unqualified scalar. No new UCA-owned primitive is concluded.

### Uncertainty propagation

Exact fact, interval, distribution, confidence/model score and `UNKNOWN` are not substitutable. Silent determinization duplicate-screens into analytical-kind conflation, qualified-claim weakening and proof-claim conflation. IEEE interval arithmetic supports preserving uncertainty-bearing result semantics.

### Queueing / flow / capacity

Instantaneous utilization is not proof of sustainable capacity or queue stability. Burstiness, retries, priorities, fan-out and shared bottlenecks can invalidate point estimates. This maps to existing resource/capacity, metric temporality/spatial aggregation and qualified-claim families; no universal queue formula is adopted.

### Graph transformation / revision semantics

A graph edit N -> N+1 can preserve syntax while invalidating proofs, reachability, lineage, compatibility or in-flight assumptions. Existing revision-vector, compatibility-direction, certificate-composition and residual-cohort patterns cover the failure class. Planning C must decide semantic-diff/invalidation ownership; UCA does not automatically own all revalidation.

### Causal / counterfactual analysis

Lineage and temporal precedence do not establish causation. Strengthening provenance/correlation into causal authority maps to proof-claim conflation and analytical-kind conflation. Causal analysis remains research-only and requires explicit assumptions/owner/proof obligations before any authoritative use.

## 5. Prioritized architecture-hypothesis disposition

The Typed Semantic Graph + ExecutionEnvelope/State/Journal, Autonomous Builds × Fleet, Inter-System/Federated Graph, control-flow, mathematical/vector, soundness/proof and new temporal/provenance/decision/unit/uncertainty/queue/rewrite/causal vectors all remain **architecture hypotheses or cross-cutting research semantics**, not adopted target architecture.

Surviving constraints for Planning C include:

- `CapabilityDefinition != CapabilityUse/Invocation`;
- `WorkflowDefinition != WorkflowInstance`;
- `GraphDefinition != runtime state`;
- `ExecutionState != ExecutionJournal`;
- semantic topology != build/deployment/runtime topology;
- runtime truth != local evidence != exported telemetry != Fleet aggregate != control authority;
- lineage relation kind must distinguish exact asserted/observed edges from inferred/coarse dependency;
- temporal/currentness and producing revisions qualify graph edges and proofs;
- provenance != authority != causal proof;
- multidimensional/uncertain quantities cannot be silently scalarized/determinized;
- GraphDB remains optional/provider-level; PostgreSQL relational graph remains a baseline hypothesis, not a decision;
- Canvas/Graph Explorer and Fleet remain projections and non-authoritative by default.

No new canonical capability is promoted. The new provenance pattern is cross-cutting and has explicit owner/detection/proof routes, so no bounded Planning-A taxonomy backfill is required.

## 6. Saturation disposition

- new local edge IDs: **0**;
- new cross-edge IDs: **0**;
- new reusable ConflictPatterns: **1** (`G2-CONFLICT-PATTERN-PROVENANCE-EDGE-OVERATTRIBUTION-001`);
- new ConflictInstances: **0**;
- new preventive invariants: **0**;
- material findings inventory: **408 = 284 edge scenarios + 124 ConflictPatterns**;
- UCA local no-material streak: **2 -> 0**;
- mandatory cluster streaks: unchanged/capped at **2**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: **BLOCKED**.

## 7. Next rotation

Continue only Full Pass 6 with **UI / Generated Experience / Low-code Builder** using materially different techniques from Passes 1–5. Explicitly challenge the new provenance-edge-overattribution pattern through Canvas/Graph Explorer: inferred versus asserted edges, temporal graph slices, stale projections, semantic-diff previews, decision/calculation/workflow kind rendering, unit/vector/uncertainty visualization without false scalarization, queue/capacity views without false stability claims, causal overlays without causal authority, explicit client/workspace context, Fleet aggregate versus concrete client truth, and AI/low-code composition that manufactures lineage or strengthens weak evidence. Duplicate-screen all **124 ConflictPatterns**. UI streak is already 2 and must not be inflated absent material novelty. Do not enter Planning C.