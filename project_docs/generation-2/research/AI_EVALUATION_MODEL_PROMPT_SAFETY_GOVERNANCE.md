# Generation 2 — AI Evaluation / Model / Prompt / Safety Governance

Status: STRUCTURAL GAP RESEARCH COMPLETE / MERGE INTO EXISTING OWNERS / NOT PROMOTED
Phase: RESEARCH_ELICITATION
Candidate: `G2-CAPABILITY-CANDIDATE-AI-EVALUATION-MODEL-PROMPT-SAFETY-GOVERNANCE`

## Research question
Does Generation 2 need a distinct top-level semantic owner for model/prompt/evaluation/safety governance, or can the required semantics be expressed without ownership collapse through AI-native Engineering, Governance/Compliance/Audit, Artifact/Provenance, Lifecycle, Observability and Provider Binding?

## Representatives and evidence ledger
1. **NIST AI RMF + Generative AI Profile / AIRC TEVV** — cross-sector risk/governance framing explicitly includes design, development, use, evaluation, testing/evaluation/verification/validation and lifecycle risk. Source: NIST AI 600-1 (2024, updated 2026) and AIRC TEVV.
2. **MLflow Prompt Registry + GenAI Evaluation** — provider-neutral/open-source implementation: versioned prompts, model configuration association, evaluation across models/datasets, experiment history and traces. Model configuration can be mutable for a prompt version, proving prompt text identity alone is insufficient for effective configuration identity.
3. **LangSmith Evaluation** — dataset + target + evaluator decomposition; datasets are versioned; experiments preserve model/prompt/tool metadata and permit baseline comparison. Demonstrates evaluation applicability depends on exact dataset/evaluator/target/configuration identity.
4. **Microsoft Foundry Evaluation** — evaluation runs expose dataset, task, prompt, parameters, sample-level metrics and human feedback; pass/fail depends on configured passing grade. Demonstrates score/result is policy-threshold-qualified rather than intrinsically passing.
5. **Google Vertex AI Model Evaluation** — evaluation binds trained/imported model, ground-truth test dataset and inference outputs. Demonstrates model existence/deployment does not imply evaluated qualification.

## Universal primitives
`AIArtifactIdentity` (model/prompt/instruction/tool-policy bundle), `EvaluationSuiteIdentity`, `DatasetRevision`, `EvaluatorRevision`, `EvaluationRun`, `EvaluationResult`, `QualificationPolicyRevision`, `SafetyPolicyRevision`, `EffectiveAIConfiguration`, `ProviderRealization`, `ApplicabilityEnvelope`, `EvidenceHorizon`, `RegressionBaseline`, `PromotionDecision`.

## Source of truth and ownership disposition
No new top-level owner is required. Ownership decomposes coherently:
- **AI-native Engineering / Agents / Approvals** owns agent/model/prompt/tool composition intent, execution context and authority-aware agentic behavior.
- **Artifact / Release / SBOM / Provenance** owns immutable identity/provenance of model/prompt/evaluation artifacts where packaged/released.
- **Lifecycle / Versioning / Evolution / Migration** owns transition, coexistence, promotion/rollback and cohort drainage.
- **Governance / Compliance / Audit** owns policy, approval, exception, evidence and accountable qualification decisions.
- **Observability / Operations / Incident** owns production observation and runtime evidence, not pre-release evaluation truth.
- **Provider / Binding / Capability Negotiation** owns provider/model realization selection and support vectors.
- **Security / Resilience / Failure Recovery** owns security-risk controls and containment/recovery, not generic AI quality scoring.

A dedicated **cross-cutting subcapability/contract family** for `AI Evaluation Qualification` is required across those owners, but promoting another top-level capability would duplicate ownership rather than resolve an ownerless semantic category.

## Identity, lifecycle and versioning
An evaluation claim MUST identify at least target artifact/configuration, model/provider realization, prompt/instruction revision, tool/binding set where relevant, dataset revision/split, evaluator/scorer revision, parameters, qualification threshold/policy, environment and evidence time/horizon. Lifecycle: `defined → runnable → executed → scored → reviewed → qualified/rejected → promoted/deferred → stale/superseded`. A change to any applicability-bearing dimension requires requalification or an explicit equivalence proof; a prior PASS is not inherited silently.

## Failure semantics
Evaluation execution failure, partial sample coverage, unavailable judge/provider, missing traces, stale dataset/evaluator, unknown model revision or ambiguous remote run completion produce explicit `INCONCLUSIVE`/`OUTCOME_UNKNOWN`, not PASS. Retry after ambiguous remote evaluation first reconciles run identity/results. Safety evaluator disagreement remains evidence requiring policy resolution; it is not silently collapsed to the most permissive result.

## Extensibility and provider boundaries
Evaluators, datasets, model providers and safety classifiers are pluggable realizations. Portability is a mixed support vector across deterministic/repeated execution, dataset portability, evaluator semantics, judge-model dependence, safety categories, trace export, offline execution, evidence retention, cost/latency and model-version pinning. Provider-native IDs never become canonical SB semantic identity.

## Governance, authority and AGWS boundary
`Enterprise → Station → Role → Person` only narrows delegated AI use/evaluation authority. A Station may select among admitted model/provider/evaluation profiles but cannot weaken mandatory enterprise safety/qualification thresholds. AGWS remains distinct from generic UI: AI is sole materializer of governed surface changes, yet this role does not grant model-admission, prompt-policy, evaluator-policy, provider-admin or canonical-domain authority. Requests crossing those boundaries escalate.

## Observability, evidence horizon, portability and offline behavior
Historical evaluation evidence remains valid only for its exact applicability envelope. Evidence retention loss can make later re-verification impossible without retroactively falsifying a historical decision. Offline/air-gapped operation requires locally resolvable model/artifact identities, evaluation datasets/evaluators/policies and bounded evidence freshness; reconnect triggers requalification when superior policy/model/provider state may have changed.

## Product-specific mechanism vs universal primitive
Prompt registries, hosted evaluation dashboards, LLM-as-judge products and provider safety scores are mechanisms. Universal primitives are typed identities, applicability-qualified evaluation claims, evidence lineage/currentness, qualification policy, explicit inconclusive states, promotion decisions and provider-neutral support vectors.

## Convergent/divergent patterns
Convergent: evaluation is relative to a dataset/suite and target configuration; version/metadata matter; results are inspectable/comparable; governance requires evidence. Divergent: scorer semantics, safety taxonomies, judge models, model pinning, dataset storage, trace retention, offline support and thresholding. Therefore SB must preserve semantic qualification while providerizing mechanics.

## Reconciliation hypotheses
- **KEEP** AI-native authority/approval boundaries.
- **HARDEN** typed model/prompt/instruction/evaluation identities and applicability envelopes.
- **GENERALIZE** qualification as evidence-bearing cross-cutting contract consumed by release/admission/governance.
- **PROVIDERIZE** evaluators, judge models, safety classifiers and hosted evaluation stores.
- **INTEGRATE** evaluation evidence with provenance, lifecycle, governance and runtime observation.
- **DO_NOT_BUILD** a bespoke foundation-model registry/evaluation cloud where provider-neutral contracts plus integrations suffice.

## Repo-validation questions
1. Does fresh `main` type model/prompt/instruction/evaluation-suite/result identities independently?
2. Can release/admission consume a revision-qualified evaluation result rather than a scalar PASS?
3. Is provider/model substitution forced to requalify instead of inheriting prior evidence?
4. Are evaluator/dataset revisions and thresholds part of evidence identity?
5. Can offline runtime prove the exact admitted AI configuration and evidence horizon?
6. Can AGWS AI materialization be denied/escalated when its effective AI qualification is stale/inapplicable?

## Symbiotic Proof
Given one canonical agent/surface intent, evaluate configuration A against suite S under policy P; change exactly one applicability-bearing dimension (model/provider, prompt/instruction, dataset/evaluator, safety policy or tool binding). The prior qualification MUST become stale/inapplicable unless an explicit equivalence proof exists. Re-evaluation yields a new lineage-linked result. A lower Station cannot waive a superior mandatory safety threshold, and an AGWS request cannot self-authorize that waiver.

## Stable findings
- **G2-FINDING-AIEG-01** — AI evaluation qualification is applicability-scoped; a scalar PASS is invalid without target/model/provider/prompt/instruction/tool/dataset/evaluator/policy/environment/evidence identity.
- **G2-FINDING-AIEG-02** — Prompt text identity is insufficient for effective AI configuration identity; model parameters/configuration and tool/binding context can change behavior independently.
- **G2-FINDING-AIEG-03** — Dataset, evaluator and threshold revisions are first-class evidence inputs; changing any can invalidate comparability or qualification without changing the model/prompt.
- **G2-FINDING-AIEG-04** — Safety/quality scores are evidence, not authority. Promotion/admission is a separate governed decision under an explicit policy revision.
- **G2-FINDING-AIEG-05** — Provider/model substitution requires fresh qualification or explicit equivalence evidence; provider reachability/API compatibility does not imply behavioral/safety equivalence.
- **G2-FINDING-AIEG-06** — Evaluation evidence has currentness/replay horizons; unavailable judge/provider, partial coverage or missing artifacts yields `INCONCLUSIVE`, not inherited PASS.
- **G2-FINDING-AIEG-07** — AI evaluation is structurally cross-cutting but does not require a new top-level capability: existing AI-native, Governance, Artifact, Lifecycle, Observability and Provider owners can compose without semantic-owner collapse when an explicit qualification contract family is added.
- **G2-FINDING-AIEG-08** — `Enterprise → Station → Role → Person` is monotonic for AI qualification: delegated layers may narrow admitted models/prompts/tools or demand stronger evidence but cannot weaken superior safety/qualification policy; AGWS/AI never amplifies that authority.

## Candidates
- `G2-CAPABILITY-CANDIDATE-AIEG-APPLICABILITY-SCOPED-AI-QUALIFICATION` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-AIEG-EVALUATION-EVIDENCE-REPLAY-HORIZON` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-AIEG-MIXED-EVALUATION-SAFETY-PROVIDER-SUPPORT-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-AIEG-AI-CONFIGURATION-COHORT-DRAINAGE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.

## Value / risk / priority / next question
Value: closes an ownerless-looking negative-space concern without duplicating architecture ownership. Risk if omitted: stale PASS inheritance across model/prompt/provider changes and unsafe delegated exceptions. Priority: HIGH architecture-proof backfill. Next question: Economic Governance / FinOps / Procurement remains the next queued structural gap; after its disposition, return to the Enterprise Completeness gate and workload-driven runtime proofs before synthesis.