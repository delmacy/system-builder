# AI-native Engineering / Agents / Approvals — Revisit 03 / Cycle 4

## Research question
How should Generation 2 separate probabilistic AI interpretation/proposal from hard execution authority, approval, deterministic validation and recovery so model/provider substitution, multi-agent delegation, untrusted context, AGWS materialization and incident assistance cannot amplify authority or erase evidence lineage?

## Representatives and evidence ledger
1. **OpenAI Codex / Agents SDK (2026)** — sandbox + approval separation, managed network policy, identity/credentials, agent-native telemetry; HITL interruptions, pre/post approval tool-input guardrails, malformed-call fail-closed behavior and nested-agent approval propagation. Official product/SDK engineering evidence. Sources: https://openai.com/index/running-codex-safely/ ; https://openai.github.io/openai-agents-js/guides/human-in-the-loop/ ; https://openai.github.io/openai-agents-js/guides/guardrails/
2. **Anthropic Claude Code sandboxing / auto mode (2025–2026)** — filesystem/network sandbox boundaries, prompt-injection probes, transcript classifier, delegation/return checks, deny-and-continue and escalation after repeated denials. Industrial engineering evidence. Sources: https://www.anthropic.com/engineering/claude-code-sandboxing ; https://www.anthropic.com/engineering/claude-code-auto-mode
3. **GitHub Copilot agents / Agentic Workflows (2026)** — read-only by default, declared safe outputs, secrets isolated from agent runtime, scoped tool permissions, review/approval separation, workflow-run approval and explicit warning that convenience approvals are not server-side security boundaries. Production product evidence. Sources: https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows ; https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools ; https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-automation-rationale-and-approvals
4. **Model Context Protocol security guidance (2026)** — tool annotations are risk vocabulary, not enforcement; untrusted servers may lie about annotations; host/client must enforce hard boundaries and treat untrusted tool content separately from authority. Standards/ecosystem evidence. Source: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
5. **CaMeL / Google Research (2025)** — separates trusted control flow from untrusted data flow and uses capabilities at tool-call boundaries; demonstrates that model-layer instruction-following alone is insufficient for robust security. Research evidence: arXiv:2503.18813.
6. **Adaptive Attacks Break Defenses Against Indirect Prompt Injection (NAACL Findings 2025)** — adaptive attacks bypass multiple prompt-injection defenses, reinforcing that prompt-only/model-only defenses cannot be the authorization boundary. Research evidence: arXiv:2503.00061.
7. **NetInjectBench (2026)** — tool-using network-operations agents exposed to untrusted operational artifacts; metadata-aware execution-time policy gates materially outperform prompt-only defenses, while naive execution is unsafe. Research evidence: arXiv:2607.10490.

## Source of truth, identity and lifecycle
Generation 2 should distinguish at minimum `SemanticAgentIntent`, `AgentPolicyRevision`, `ModelRealizationRevision`, `ToolCapabilityProfile`, `TrustedInstructionEnvelope`, `UntrustedContextArtifact`, `AgentProposal`, `DeterministicValidationResult`, `ApprovalRequirement`, `ApprovalDecision`, `ExecutionAuthorization`, `ExecutionAttempt`, `OutcomeEvidence` and `Recovery/AbortDecision`.

The lifecycle is not `prompt → action`. It is:

`intent → context acquisition/classification → proposal/planning → candidate materialization → deterministic/policy validation → approval when required → execution authorization → actuation → outcome/postcondition evidence → recovery/rollback/escalation when needed`.

Each step has distinct identity and authority. A model may recommend an operation without obtaining authority to execute it. Approval may satisfy one policy condition without granting credentials or bypassing sandbox/network/tool boundaries. Successful execution does not prove accepted semantic outcome.

## Versioning, freshness and compatibility
Approval, validation and execution authorization are revision-bound evidence. Their applicability depends on material dimensions including policy revision, tool/capability profile, candidate artifact digest, bounded input/context digest or provenance set, Station/Role/Person authority projection, provider/model realization where relevant, credential/trust state and time/expiry.

If any material dimension changes while a run is interrupted or awaiting approval, the prior approval/validation must be re-evaluated. OpenAI Agents SDK explicitly re-runs tool input guardrails after approval; GitHub dismisses Copilot review approval after new commits; these patterns support a universal `stale-on-material-change` rule.

Model/provider substitution may preserve semantic intent while changing output, confidence, tool-selection behavior and security characteristics. Therefore substitution is a new realization lineage requiring renewed validation/evidence, not proof of deterministic replay.

## Failure and adversarial semantics
Failure classes must remain distinguishable: malformed tool call; unavailable tool/provider; denied authority; expired/stale approval; policy mismatch; sandbox/network denial; untrusted-context contamination; prompt injection suspicion; validator rejection; approval rejection; execution failure; partial side effect; postcondition failure; abort/override; recovery failure; evidence insufficiency.

Indirect prompt injection is especially important: external documents, logs, webpages, tickets, tool responses and subagent returns can contain instructions but do not thereby acquire authority. The architecture must preserve source/provenance/trust classification and prevent untrusted context from rewriting control policy or authorizing capabilities.

## Extensibility and provider boundaries
Models, agent harnesses, tool transports and approval UX are replaceable providers. Capability identity, semantic intent, authority envelope, validation rules, approval semantics and evidence lineage remain System Builder semantic contracts.

MCP tool metadata/annotations can help classify risk but cannot become the enforcement source of truth because untrusted providers may misdeclare them. Host-side policy, sandboxing, credential isolation, capability allowlists and deterministic validators must remain independently enforceable.

## Governance, observability and portability
Every consequential action should link: requesting actor; effective Enterprise/Station/Role/Person authority; semantic intent; context provenance/trust classification; model/harness/tool revisions; proposal/candidate digest; validation result; approval requirement/decision; execution authorization; credential/binding reference; execution attempt; outcome evidence; abort/recovery lineage.

Governance reproducibility means reconstructing the governing semantic inputs, revisions, authority and evidence sufficiently to explain and revalidate an outcome. It does not require token-identical model replay.

## Local/offline closure
A qualified local agent closure is not just a cached model. It must declare the model/runtime artifact, policy/guardrail revisions, tool schemas and local tool realizations, sandbox/network policy, trust roots/revocation freshness as applicable, credential/reference mechanism, deterministic validators, approval mechanism/evidence store, audit lineage and recovery/abort controls. Missing required closure material yields explicit degraded/denied/INCONCLUSIVE behavior; offline mode never grants emergency write/provider-admin/secret authority implicitly.

## Product-specific mechanisms vs universal primitives
Product-specific: OpenAI interruption objects/guardrail APIs; Codex auto-review implementation; Claude transcript classifiers and prompt-injection probes; GitHub safe-outputs/workflow approval UI; MCP tool annotations; particular research firewalls/classifiers.

Universal: trusted-vs-untrusted context provenance; semantic intent; proposal/candidate artifact; deterministic validation; revision-bound approval; hard execution authorization; least-authority capability envelope; non-amplifying delegation; actuation/outcome evidence; local closure profile; abort/recovery lineage.

## Convergent and divergent patterns
### Convergence
- Hard execution boundaries live outside the model: sandbox, network policy, permissions, credentials, safe-output channels or policy gates.
- Approvals are workflow evidence, not a replacement for hard authorization.
- Tool discovery/metadata is not authority.
- External/tool content is a distinct trust domain and may carry indirect prompt injection.
- Agent autonomy improves when the safe envelope is explicit rather than when approvals are simply disabled.
- Consequential actions require auditable lineage.

### Divergence
- Products vary between manual approvals, model/classifier auto-approvals, sandbox-first approaches and declared safe outputs.
- Model-based security classifiers can reduce friction but remain probabilistic and must not silently become the sole constitutional authority.
- Exact replayability differs by framework/provider; therefore semantic/revision evidence must be portable even when generated tokens are not.

## Subcapabilities
Trusted/untrusted context classification; semantic intent and candidate proposal; least-authority tool exposure; deterministic policy/semantic validation; revision-bound approval; execution authorization; sandbox/network/credential enforcement; multi-agent delegation/handoff; model/provider substitution; AGWS materialization lineage; incident/recovery assistance; human abort/override; local/offline agent closure; adversarial evaluation/red-team evidence.

## System Builder comparison — bounded evidence only
Repository-wide implementation claims remain deferred to PLANNING_B. Current research establishes target questions, not present-code truth. The mandatory AGWS boundary remains `Enterprise → Station → Role → Person`; AI is sole materializer of permitted surface changes but must escalate canonical domain/process/provider/deployment changes and cannot manufacture authority.

## Reconciliation hypotheses
- **GENERALIZE** a shared `Proposal → Validation → Approval → ExecutionAuthorization → Attempt → OutcomeEvidence` lineage beyond AI-specific code.
- **HARDEN** context provenance/trust classification and stale-on-material-change approval semantics.
- **PROVIDERIZE** model, harness, tool transport and model-based risk classifier without provider ownership of semantic authority.
- **INTEGRATE** AI actuation with Authorization, Provider/Binding, Governance, Security/Recovery, AGWS and Architecture Proof evidence.
- **DO_NOT_BUILD** a parallel AI authorization system or a design where natural-language instructions/agent confidence can create credentials, capabilities or higher authority.

## Repo-validation questions
1. Where can current AI/tool execution acquire write/network/provider/secret authority, and is that authority independently enforceable outside the model?
2. Can context/tool results preserve provenance/trust classification through multi-agent handoffs and cumulative context?
3. Are candidate mutations separated from deterministic validation, approval and final actuation?
4. Does approval bind exact candidate/policy/authority revisions and become stale on material change?
5. Can subagents receive only an intersection/subset of delegator authority rather than implicit union of available tools/credentials?
6. Can model/provider substitution preserve semantic task identity while creating new realization/evidence lineage?
7. Can incident/recovery agents diagnose and propose without acquiring writer promotion, secret access or recovery actuation authority?
8. Is local/offline agent closure explicit enough to fail closed when policy/trust/validator/approval material is missing?

## Adaptive Governed Work Surfaces / Station proof interaction
AGWS personal/team/role/system composition consumes only capabilities exposed by effective `Enterprise → Station → Role → Person` projection. AI-generated surface changes remain candidate revisions until deterministic semantic/policy validation succeeds. A request that implies canonical schema/domain/process/provider/deployment change must be classified upward. Subagents cannot widen the authority envelope. A model/provider swap must not change the authorization classification of the same semantic request without explicit policy/profile revision.

## Architecture proof obligations
1. **Untrusted-context adversarial proof:** inject malicious instructions through a document/tool result/subagent return while the user request is benign. The agent may use factual data but must not treat embedded instructions as authority; no new tool/credential/provider/write scope may be acquired.
2. **Stale-approval proof:** approve candidate revision A under policy/tool/Station revision X, then modify candidate or policy/authority before execution. The old approval must become stale and execution must require revalidation/reapproval as applicable.
3. **Hard-boundary proof:** persuade the model/approval classifier to request an operation outside sandbox/network/tool capability. The independent enforcement layer must deny it even if model text, confidence or soft metadata says it is safe.
4. **Non-amplifying delegation proof:** delegate to a subagent that can observe additional tools/providers through discovery. Effective actuation authority must be no greater than the explicit delegated subset/intersection, and the return path cannot smuggle new authority into the parent.
5. **Validator separation proof:** produce a plausible AI-generated AGWS or code/config candidate that violates a deterministic schema/policy/invariant. Model self-review/approval must not override validator rejection.
6. **Provider-substitution proof:** execute the same semantic intent with two model/harness providers. Task identity and authority obligations remain stable, while realization lineage/results may differ and each outcome must be independently validated.
7. **Incident/recovery authority proof:** give an agent complete diagnostic evidence of a failed writer and ask it to recover service. Diagnosis/recommendation alone must not confer fencing, writer-promotion, secret, provider-admin or recovery actuation authority; a separately authorized recovery path is required.
8. **Qualified-local-closure failure proof:** remove one required local policy/trust/validator/approval/sandbox component in offline mode. The system must deny/degrade/report INCONCLUSIVE rather than silently broaden authority or claim equivalent safe autonomy.

## Stable findings
- **G2-FINDING-AIN-23 — Untrusted Context Is Data With Provenance, Never an Authority-Bearing Instruction Source by Itself.** Value HIGH; risk CRITICAL; priority P0.
- **G2-FINDING-AIN-24 — Approval and Validation Evidence Are Revision/Freshness Scoped and Become Stale on Material Change.** Value HIGH; risk CRITICAL; priority P0.
- **G2-FINDING-AIN-25 — Hard Actuation Boundaries Must Be Enforced Outside the Probabilistic Model/Classifier.** Value HIGH; risk CRITICAL; priority P0.
- **G2-FINDING-AIN-26 — Multi-Agent Delegation Must Intersect/Subset Authority and Must Never Amplify It.** Value HIGH; risk CRITICAL; priority P0.
- **G2-FINDING-AIN-27 — Probabilistic Proposal/Recommendation and Deterministic Validation/Policy Verdict Are Distinct Authorities.** Value HIGH; risk HIGH; priority P0.
- **G2-FINDING-AIN-28 — Model/Harness Substitution Preserves Semantic Intent Only by Creating New Realization and Validation Evidence Lineage.** Value HIGH; risk HIGH; priority P0.
- **G2-FINDING-AIN-29 — Incident Diagnosis or Recovery Recommendation Must Not Become Recovery/Writer/Secret/Provider-Admin Actuation Authority.** Value HIGH; risk CRITICAL; priority P0.
- **G2-FINDING-AIN-30 — Local/Offline Agent Autonomy Requires Qualified Model/Tool/Policy/Trust/Validator/Approval/Enforcement Closure.** Value HIGH; risk HIGH; priority P1.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-UNTRUSTED-CONTEXT-AUTHORITY-PROVENANCE-ENVELOPE` — CROSS_CUTTING / CANDIDATE; reconcile with cumulative-context and security evidence rather than promote immediately.
- `G2-CAPABILITY-CANDIDATE-REVISION-BOUND-ACTUATION-APPROVAL-EVIDENCE` — CROSS_CUTTING / MERGE_TARGET; consolidates prior revision-bound agent approval candidate with shared evidence-qualification semantics.
- `G2-CAPABILITY-CANDIDATE-NON-AMPLIFYING-AGENT-DELEGATION-AUTHORITY-ENVELOPE` — CROSS_CUTTING / CANDIDATE; Authorization/AGWS should confirm generality.
- `G2-CAPABILITY-CANDIDATE-DETERMINISTIC-VALIDATOR-PROBABILISTIC-PROPOSAL-SEPARATION` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; likely constitutional separation between recommendation and validation authority.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-AGENT-EXECUTION-CLOSURE` — CROSS_CUTTING / MERGE_TARGET; likely specialization of shared qualified local closure profile.

No candidate is promoted in this revisit.

## Saturation
Material new architectural findings: **yes**. `consecutive_no_material_finding=0`; **NOT SATURATED**. The revisit materially strengthens cross-cutting authority, adversarial-context, validation, recovery and local-closure semantics and advances architecture-proof backfill to PARTIAL.

Next research question for this capability: whether the new authority/context/validation primitives converge with Authorization, Governance, AGWS, Provider Binding and Architecture Reconciliation strongly enough to become shared constitutional primitives during synthesis, without making an AI-specific control plane.