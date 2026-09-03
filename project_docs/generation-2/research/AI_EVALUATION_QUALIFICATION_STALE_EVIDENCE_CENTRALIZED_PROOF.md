# Generation 2 — AI Evaluation Qualification / Stale-Evidence Rejection — Centralized Proof

Status: RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH_WITHOUT_NEW_PROMOTION
Phase: RESEARCH_ELICITATION
Proof junction: AI evaluation qualification and stale-evidence rejection
Parent disposition: `G2-CAPABILITY-CANDIDATE-AI-EVALUATION-MODEL-PROMPT-SAFETY-GOVERNANCE` remains MERGE_INTO_EXISTING_OWNERS / NOT_PROMOTED.

## Research question
Can Generation 2 prove, provider-neutrally, that an AI quality/safety PASS applies only to the exact effective AI configuration and evaluation evidence that produced it; that applicability-bearing changes invalidate inheritance of the PASS unless explicit equivalence evidence exists; that partial/unavailable evaluation is INCONCLUSIVE rather than permissive; and that qualification remains separate from governed promotion/admission authority?

## Representatives and evidence/source ledger
1. **MLflow Prompt Registry + GenAI Evaluation** — prompt versions, model configuration, evaluation across models/datasets, experiment history and traces. Model configuration associated with a prompt version can be updated independently, proving prompt text/version alone cannot identify effective execution configuration. Sources: `https://mlflow.org/docs/latest/genai/prompt-registry/`, `https://mlflow.org/docs/latest/genai/prompt-registry/evaluate-prompts/`, `https://mlflow.org/docs/latest/genai/concepts/evaluation-datasets/`.
2. **LangSmith Evaluation** — offline evaluation uses dataset + evaluators + experiment target; experiments can expose models, prompts and tools used; online evaluation applies evaluators to production traces with filters/sampling and therefore represents a distinct evidence population/horizon rather than a replacement for offline qualification. Sources: `https://docs.langchain.com/langsmith/evaluation`, `https://docs.langchain.com/langsmith/analyze-an-experiment`, `https://docs.langchain.com/langsmith/online-evaluations-llm-as-judge`, `https://docs.langchain.com/langsmith/online-evaluations-code`.
3. **Microsoft Foundry Evaluation** — safety/risk evaluators have explicit evaluator identities, required input mappings and hosted evaluation-model/service dependencies; some evaluation features are region-constrained. This demonstrates evaluator/provider realization is applicability-bearing and can be unavailable independently of the target workload. Sources: `https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/risk-safety-evaluators`, `https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent`.
4. **NIST AI RMF / TEVV** — evaluation/testing/verification/validation and ongoing monitoring are lifecycle risk-management activities, not a one-time scalar certification. Source family: NIST AI RMF / AIRC TEVV.
5. **Google Vertex AI evaluation family** — model evaluation binds target/model behavior to evaluation data/metrics/provider realization; provider-native evaluation is evidence, not canonical SB authority. Source family: Vertex AI model and generative-AI evaluation documentation.

## Source of truth / ownership
No new top-level owner is created. `AIQualificationClaim` is a cross-cutting proof contract composed by existing owners:
- AI-native Engineering owns effective agent/model/prompt/tool composition intent and execution context;
- Governance owns qualification policy, thresholds, mandatory safety conditions, approval/exception authority;
- Artifact/Provenance owns immutable identities and producing-revision lineage of packaged evaluation artifacts/results;
- Lifecycle owns promotion, substitution, supersession, rollback and cohort transition semantics;
- Provider Binding owns model/evaluator/provider realization and support-vector qualification;
- Observability owns production observations and sampled runtime evidence, not pre-release qualification policy.

## Typed identity and applicability envelope
A qualification claim MUST bind at minimum:
`AIConfigurationIdentity = {model identity/revision, provider realization, prompt/instruction revision, tool/binding set, runtime parameters}`;
`EvaluationSuiteIdentity = {dataset revision/split/population, evaluator/scorer revision, judge model/provider where used, sampling/repetition parameters}`;
`QualificationPolicyIdentity = {thresholds, mandatory dimensions, aggregation rule, exception/waiver policy, authority revision}`;
`EvidenceIdentity = {run/experiment, result artifacts, traces where required, environment, timestamp, retention/replay horizon}`.

Qualification applicability is the tuple of these revisions plus Station/authority scope. A scalar `PASS` detached from this envelope is invalid.

## Lifecycle and versioning
`DEFINED → RUNNABLE → EXECUTED → SCORED → REVIEWED → QUALIFIED|REJECTED|INCONCLUSIVE → PROMOTED|DEFERRED → STALE|SUPERSEDED`.

A change to any applicability-bearing dimension does not mutate historical evidence. It creates a new effective configuration/evaluation context for which the prior qualification is `STALE` or `INAPPLICABLE` unless a separately governed `EquivalenceEvidence` explicitly proves the changed dimension irrelevant/equivalent for the required policy.

## Failure semantics and stale-evidence rejection
- missing target lineage, unknown provider/model revision, missing prompt/tool identity, unavailable evaluator/judge, partial dataset coverage, missing mandatory safety dimension or incomplete result artifacts => `INCONCLUSIVE`;
- ambiguous remote evaluation completion => `OUTCOME_UNKNOWN` and reconcile-before-retry using stable evaluation-run identity;
- evaluator disagreement => evidence conflict requiring policy resolution, never silent permissive collapse;
- stale dataset/evaluator/policy/provider evidence => prior PASS remains historically true for its producing envelope but is unusable for current admission;
- provider/model substitution without explicit equivalence or fresh evaluation => `REQUALIFICATION_REQUIRED`;
- sampled production evaluation can detect drift/regression, but an unsampled or differently filtered population cannot prove universal runtime quality.

## Promotion/admission boundary
`EvaluationResult` and `AIQualificationClaim` are evidence. `PromotionDecision`/`AdmissionDecision` are separate governed acts. A passing score never grants deployment, model admission, provider substitution, tool authority, safety waiver or domain mutation. Policies may require multiple dimensions and may deny promotion even when numerical quality scores pass.

## Production-observation boundary
Offline qualification proves a bounded pre-release claim. Online evaluation observes actual traffic under a declared filter/sampling/population. Production evidence may trigger requalification, incident handling or rollback, but it does not erase producing revisions or silently broaden the original applicability envelope. Conversely, lack of observed failure in sampled traffic is not proof that an unevaluated configuration is qualified.

## Provider portability / mixed support vector
Portability varies independently across model pinning, prompt/tool metadata capture, dataset portability, evaluator semantics, judge-model dependence, safety taxonomy, deterministic repeatability, offline execution, trace export, retention, sampling/filtering, region availability, cost/latency and evidence replay. Provider labels or API compatibility never imply evaluation equivalence.

## Enterprise → Station → Role → Person / AGWS boundary
Delegation is monotonic. Enterprise can mandate model/provider/evaluator classes, safety dimensions, thresholds and freshness horizons. Station may narrow admitted profiles or require stronger evidence; Role/Person may operate only inside delegated envelopes. No lower layer may weaken superior qualification policy. Adaptive Governed Work Surfaces remains distinct: AI may be the sole materializer for governed surface composition, but that role grants no model-admission, evaluator-policy, provider-admin, waiver, canonical-domain or deployment authority. A surface request whose required AI configuration is stale/inapplicable must deny/escalate rather than silently materialize.

## Universal primitive vs product-specific mechanism
Universal primitives: typed effective AI configuration identity, evaluation-suite identity, qualification-policy revision, applicability envelope, explicit PASS/FAIL/INCONCLUSIVE/STALE states, equivalence evidence, promotion decision, evidence horizon/replay, provider support vector.

Product-specific mechanisms: MLflow registries, LangSmith experiments/evaluators, Foundry hosted evaluators, Vertex dashboards, provider safety classifiers and LLM-as-judge implementations.

## Convergent / divergent patterns
Convergent: evaluation is relative to target/configuration + data/population + evaluator/metric + policy interpretation; metadata/lineage matter; offline and production evaluation serve different evidence roles; scores are inspectable evidence rather than authority.

Divergent: evaluator taxonomies, judge models, threshold mechanics, model-version pinning, prompt/tool metadata richness, trace retention, sampling, provider availability and offline support. Therefore Generation 2 must generalize qualification semantics and providerize mechanics.

## Reconciliation hypotheses
- KEEP authority separation from AI-native Engineering / Agents / Approvals.
- HARDEN typed effective-configuration, dataset, evaluator, policy and evidence identities.
- GENERALIZE `AIQualificationClaim` as a revision-qualified cross-cutting proof contract.
- PROVIDERIZE evaluators, judge models, safety classifiers and hosted stores.
- INTEGRATE release/admission with fresh applicability checks; production observations feed drift/regression evidence.
- DO_NOT_BUILD a bespoke universal model/evaluation hosting plane where provider-neutral contracts plus integrations suffice.

## Repo-validation questions
1. Can fresh `main` represent model/provider/prompt/instruction/tool/dataset/evaluator/policy identities independently, or is AI evidence scalar/untyped?
2. Can an admission/release proof reject a historically PASS result when any applicability-bearing revision differs?
3. Can missing mandatory evaluator dimensions yield explicit `INCONCLUSIVE`?
4. Is promotion/admission represented separately from evaluation score/result?
5. Can model/provider substitution require fresh qualification/equivalence evidence?
6. Can historical qualification be replayed against the producing revisions after current policy/configuration changes?
7. Can AGWS materialization reject/escalate stale AI qualification without gaining policy/provider authority?

## Symbiotic Proof
Start with effective AI configuration `C1`, evaluation suite `S1`, qualification policy `P1`, and evidence `E1`; obtain `PASS(C1,S1,P1,E1)`. Change exactly one applicability-bearing dimension to produce `C2`, `S2` or `P2` (model/provider, prompt/instruction, tool binding, dataset, evaluator/judge, threshold/policy). The previous PASS MUST become `STALE/INAPPLICABLE` for the new context unless explicit `EquivalenceEvidence` authorized under current policy proves equivalence. Remove one mandatory evaluator result or lineage artifact and the current claim MUST become `INCONCLUSIVE`. Re-evaluation produces a new lineage-linked qualification. The historical `PASS(C1,S1,P1,E1)` remains replayable and is not rewritten. Promotion/admission remains a separately authorized decision. A lower Station cannot waive Enterprise qualification policy, and AGWS/AI cannot self-authorize the waiver.

## Stable findings
- **G2-FINDING-AIQP-01** — AI qualification is applicability-scoped over effective model/provider/prompt/instruction/tool/runtime configuration, evaluation dataset/population, evaluator/judge, qualification policy, authority scope and evidence horizon; scalar PASS is invalid.
- **G2-FINDING-AIQP-02** — Changing any applicability-bearing dimension makes prior PASS stale/inapplicable unless explicit current-policy equivalence evidence exists; historical evidence remains immutable for its producing envelope.
- **G2-FINDING-AIQP-03** — Prompt/version identity alone cannot prove effective AI configuration identity because model configuration and tool/binding context can change independently.
- **G2-FINDING-AIQP-04** — Missing mandatory evaluator dimensions, partial coverage, unavailable judge/provider, unknown lineage or stale evidence yields `INCONCLUSIVE`, never inherited PASS.
- **G2-FINDING-AIQP-05** — Evaluation score/qualification and promotion/admission are distinct authorities; PASS never self-grants deployment, provider substitution, tool authority, waiver or canonical mutation.
- **G2-FINDING-AIQP-06** — Offline evaluation and production online evaluation are different evidence populations/horizons; sampled live evidence cannot silently broaden pre-release qualification and lack of observed failure is not universal proof.
- **G2-FINDING-AIQP-07** — AI evaluation portability is a mixed support vector across evaluator semantics, judge/model pinning, safety taxonomy, dataset/trace portability, sampling, retention/replay, offline support and provider availability; API compatibility is insufficient equivalence evidence.
- **G2-FINDING-AIQP-08** — `Enterprise → Station → Role → Person` is monotonic for AI qualification, and AGWS/AI remains non-amplifying: lower layers may narrow admitted profiles but cannot weaken superior qualification or acquire policy/provider/canonical authority.

## Candidate disposition
No new capability candidate. Existing `G2-CAPABILITY-CANDIDATE-AI-EVALUATION-MODEL-PROMPT-SAFETY-GOVERNANCE` remains NOT_PROMOTED / MERGE_INTO_EXISTING_OWNERS. Existing consolidation candidates remain authoritative; this proof strengthens their synthesis inputs without changing taxonomy count.

## Gate conclusion
The centralized **AI evaluation qualification and stale-evidence-rejection** proof junction is `RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH_WITHOUT_NEW_PROMOTION`. It no longer blocks Enterprise Completeness by itself. Technology-economic centralized proofs and domain-composition/provider-identity proof remain open; do not enter `CAPABILITY_SYNTHESIS` yet.
