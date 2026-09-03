# AI-native Engineering / Agents / Approvals — Revisit 06 / Cycle 7

## Research question
How must Generation 2 qualify agent proposals, approvals, tool authority, durable resume and effective external effects so that model/harness substitution, long-lived approvals, offline Stations and recovery incidents cannot turn probabilistic judgment or stale provider state into canonical authority?

## Representatives and evidence/source ledger
1. **OpenAI Agents SDK HITL (2026)** — per-call approval identity, run-wide interruptions across nested agents, serializable `RunState`, sticky decisions scoped to a run/tool identity, malformed approval arguments fail closed, and optional pre-approval guardrails that are rechecked before execution. Official SDK: https://openai.github.io/openai-agents-python/human_in_the_loop/ and https://openai.github.io/openai-agents-js/guides/human-in-the-loop/
2. **LangGraph / LangChain HITL (2026)** — policy-driven approve/edit/reject, persistent checkpoint/thread identity, durable pause/resume, and explicit rule that interrupted nodes restart from the beginning; side effects before interrupt must therefore be idempotent. Official docs: https://docs.langchain.com/oss/python/langchain/human-in-the-loop and https://docs.langchain.com/oss/python/langgraph/interrupts
3. **Microsoft Agent Framework HITL (2026)** — approval-required functions return an approval request instead of executing; caller supplies approval/rejection in a subsequent run/session; workflow orchestration pauses on tool approval. Official docs: https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval and https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop
4. **OpenAI hosted MCP approval (2026)** — sensitive hosted MCP operations can require approval by tool, with approval identity bound to server label plus tool name for sticky decisions. Official SDK: https://openai.github.io/openai-agents-js/guides/mcp/
5. **Anthropic Claude Code permission architecture** — read-only/default bounded behavior and explicit permission for edits/commands provide adjacent evidence that model intent and actuation authority must remain distinct. Official docs: https://docs.anthropic.com/en/docs/claude-code/security
6. **Prior G2 AI/agent research + Security/Lifecycle/Provider findings** — authoritative internal evidence for resource/audience-bound tool authority, resume profiles, ambiguous effects, split-brain fencing, expiring break-glass, evidence horizons and residual-cohort drainage.

## Source of truth, identity and lifecycle
Semantic truth remains outside the model/provider. Minimum typed identities are `ModelRealizationRevision`, `AgentDefinitionRevision`, `AgentRunIdentity`, `ContextClosureRevision`, `SemanticProposalRevision`, `ApprovalRequirement`, `ApprovalDecision`, `ExecutionAuthorization`, `ToolCallCandidate`, `ActuationAttempt`, `ProviderReceipt`, `EffectivePostconditionEvidence`, `RecoveryDisposition` and `EvidenceBundleRevision`.

Canonical lifecycle: `intent → qualified context → proposal → deterministic validation → approval applicability → approval decision → execution authorization → attempt → provider observation → effective-state reconciliation → postcondition validation → closure/recovery`.

Approval, execution authorization and provider acceptance are different facts. An approval applies only to the exact candidate/effect and revision vector reviewed.

## Versioning, currentness and applicability
Agentic qualification is applicability-scoped over `{agent/model realization, proposal digest, context/provenance closure, tool schema/binding, effective authority, policy, trust root, provider/runtime, Station/Role/Person, target resource/audience, evidence horizon}`. A scalar `approved=true`, `safe=true` or `agentSucceeded=true` is insufficient.

Long-lived or sticky approval is convenience state, not durable constitutional authority. Material change to candidate/effect, authority, Station/Role, tool/binding, provider, trust or policy requires requalification before actuation.

## Failure semantics and durable resume
OpenAI and Microsoft pause before an approval-required call; LangGraph persists state but restarts an interrupted node on resume. These mechanisms converge on durable interruption but diverge in replay semantics. Generation 2 therefore requires an explicit resume/effect profile per runtime.

If an external effect may have succeeded but acknowledgement is lost, the attempt becomes `OUTCOME_UNKNOWN`; retry is forbidden until effective state is reconciled. Checkpoint existence proves resumability, not external-world consistency.

Security recovery adds a stronger boundary: agent orchestration may consume incident/recovery state but cannot self-create writer authority, bypass fencing, extend break-glass or infer that restored reachability means reprotection is complete.

## Extensibility and provider boundaries
Model, agent harness, checkpoint runtime, approval UI, tool transport and sandbox are providerizable. SB owns semantic intent, deterministic validation, authority projection, approval applicability, attempt/effect lineage and closure disposition.

Provider substitution is a mixed support vector across approval granularity, nested approval propagation, checkpoint/replay semantics, tool identity, guardrail coverage, containment, evidence export, offline behavior and recovery. Substitution creates fresh realization evidence even when semantic intent is unchanged.

## Governance, observability and evidence horizon
Reconstructable evidence should connect `actor → Enterprise/Station/Role/Person projection → agent/model realization → context closure → proposal digest → validator → approval → execution authorization → tool/binding/resource audience → attempt → provider observation → effective postcondition → closure/recovery`.

Evidence retention has its own horizon. Expired model traces, approval records, checkpoint history or tool receipts may make later exact requalification `INCONCLUSIVE` without retroactively falsifying a historically valid decision.

## Portability and lock-in
Portable semantics are governed intent, typed authority, proposal/effect identity, approval obligations, admitted capability/tool contract, resume/effect guarantees and measurable postconditions. Provider-internal reasoning traces or token-identical replay are not required.

A provider that cannot express a required approval, resource boundary, resume guarantee or evidence field yields `DEGRADED`, `UNSUPPORTED` or `INCONCLUSIVE`; policy is not weakened to fit it.

## Product-specific mechanisms vs universal primitives
**Product-specific:** OpenAI `RunState`/interruptions/sticky approvals; LangGraph checkpointer/thread/interrupt replay; Microsoft approval request/response sessions; Claude Code permission prompts.

**Universal:** applicability-scoped agentic qualification; exact candidate/effect-bound approval; proposer/approver/authorizer/actuator separation; non-amplifying context; resource/audience-bound tool authority; explicit resume semantics; reconcile-before-retry; effective postcondition evidence; mixed provider support vector; residual-cohort drainage; evidence horizon; qualified offline closure.

## Convergent and divergent patterns
Convergent: approval intercepts actuation rather than converting model output into authority; durable pause requires persisted run state; human decision and tool execution are distinct; provider state must survive or be requalified across resume.

Divergent: approval scope can be call/tool/run/server-specific; resume can replay a node or continue provider-managed state; edit-on-approval exists in some frameworks but not all; nested approval propagation and guardrail coverage vary materially.

## Subcapabilities
Typed agent/run/proposal identity; provenance-qualified cumulative context; deterministic validation; approval applicability/freshness; separation of duties; resource-bound tool admission; durable checkpoint/resume; ambiguous-effect reconciliation; provider substitution; evidence retention; residual-cohort drainage; qualified offline agent closure; incident/recovery integration; AGWS AI materialization.

## System Builder comparison — bounded evidence only
No fresh-main implementation claim is required for this revisit. Prior research remains research evidence only; repository-wide implementation reconciliation remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **GENERALIZE** applicability-scoped `Proposal → Approval → ExecutionAuthorization → Attempt → EffectivePostcondition` across AI, Workflow, Integration and Lifecycle.
- **HARDEN** approvals with exact candidate/effect digest, revision vector, expiry/revocation and requalification.
- **HARDEN** context as provenance-bearing evidence that cannot amplify authority.
- **GENERALIZE** reconcile-before-retry and residual-cohort drainage while AI retains agent-specific semantics.
- **PROVIDERIZE** model/harness/checkpoint/tool transport/approval UI without provider state becoming semantic truth.
- **INTEGRATE** Security fencing/break-glass and Provider/Binding resource audience constraints without transferring their ownership to AI.
- **KEEP** AI-only AGWS materialization under deterministic validation and delegated authority.
- **DO_NOT_BUILD** model-self-approval, blanket sticky constitutional approval, ambient credentials, AI-specific superuser authority or silent canonical domain/process/provider mutation.

## Repo-validation questions
1. Are proposal, approval, execution authorization, attempt and effective postcondition separately persisted?
2. Is approval bound to exact candidate/effect plus authority/policy/tool/provider/Station revision vector?
3. Can provider sticky approval be overridden by constitutional requalification?
4. Does every durable agent runtime declare replay/idempotency semantics?
5. Can acknowledgement loss become `OUTCOME_UNKNOWN` and block blind retry?
6. Are tool credentials target/resource/audience scoped?
7. Are proposer, approver, authorizer and actuator separable by policy?
8. Does provider/model substitution create fresh realization evidence and drain old sessions/approvals/checkpoints/tool bindings?
9. Do evidence retention rules distinguish historical validity from present replayability?
10. Can offline Station execution only use a declared local closure and require reconnect requalification?
11. Can incident/break-glass context be consumed without agent self-granting emergency authority?
12. Does AGWS escalate canonical domain/process/provider changes instead of silently materializing them?

## Adaptive Governed Work Surfaces / Station boundary
AGWS remains distinct from generic low-code and from AI-native Engineering. Effective authority resolves `Enterprise → Station → Role → Person`; lower layers may specialize only delegated dimensions. AI is the sole materializer of permitted surface composition but not the source of authority.

An employee may request list/form/grid/layout or personal automation using admitted components and provider bindings. If fulfillment requires a new canonical entity/field/process, privileged provider binding, recovery authority or broader automation authority, AI emits an escalation/proposal. Mandatory inherited components remain non-removable. Station/Role change invalidates dependent approvals and revalidates the surface. Personal→Team/Role/System promotion requires independent governance/evidence.

## Symbiotic Proof obligations
1. Change proposal arguments after approval; old approval is rejected as stale.
2. Set provider sticky approval, then reduce Role/Station authority; constitutional policy blocks actuation.
3. Pause/resume equivalent work on call-resume and node-replay runtimes; side effect occurs at most once or is reconciled.
4. External effect succeeds while acknowledgement is lost; system records `OUTCOME_UNKNOWN` and reconciles before retry.
5. Substitute model/harness/tool provider after approval; old approval/context/tool-session cohorts are requalified/drained.
6. Expire approval/checkpoint/tool evidence; historical decision remains historical while current replay qualification becomes `INCONCLUSIVE`.
7. Give agent incident context plus expired break-glass; it cannot create writer/provider-admin authority or bypass fencing.
8. Disconnect a Station under declared local closure, change authority upstream, reconnect; queued privileged action remains blocked pending requalification.
9. Inject adversarial connector/tool content; proposal can observe it but effective authority cannot widen.
10. Ask AGWS AI for a surface requiring canonical schema/process change; it escalates instead of silently mutating domain truth.

## Stable findings
- **G2-FINDING-AIN-47 — Agentic Qualification Is Applicability-Scoped, Not a Scalar Approval or Success Flag.** Value HIGH; risk CRITICAL; priority P0. Qualification binds proposal/effect, context closure, model/harness, authority, policy, tool/binding, resource audience, Station and evidence horizon.
- **G2-FINDING-AIN-48 — Proposal, Approval, Execution Authorization, Attempt and Effective Postcondition Are Separate Typed Facts.** Value HIGH; risk CRITICAL; priority P0. Provider run state may correlate them but cannot safely collapse them.
- **G2-FINDING-AIN-49 — Approval Freshness Is Exact-Candidate-and-Revision Bound; Sticky Approval Cannot Survive Material Semantic or Authority Change.** Value HIGH; risk CRITICAL; priority P0.
- **G2-FINDING-AIN-50 — Durable Resume Requires Provider-Specific Replay Semantics and Reconcile-Before-Retry for Ambiguous External Effects.** Value HIGH; risk CRITICAL; priority P0. Checkpoint resumability is not external-world consistency.
- **G2-FINDING-AIN-51 — Agent Portability Is a Mixed Support Vector, Not Model/API Compatibility.** Value HIGH; risk HIGH; priority P1. Approval granularity, replay, tool identity, containment, evidence, offline and recovery semantics vary independently.
- **G2-FINDING-AIN-52 — Provider Substitution Closes Only After Fresh Qualification and Residual Approval/Checkpoint/Tool-Session Cohort Drainage.** Value HIGH; risk HIGH; priority P1.
- **G2-FINDING-AIN-53 — Agent Evidence Has a Replay/Retention Horizon Independent of Historical Decision Validity.** Value HIGH; risk HIGH; priority P1. Missing traces/approval/checkpoint evidence can make current requalification inconclusive without rewriting history.
- **G2-FINDING-AIN-54 — Emergency, Offline and AGWS Agent Authority Is Non-Amplifying Across Enterprise→Station→Role→Person.** Value HIGH; risk CRITICAL; priority P0. Agent context cannot mint break-glass, writer, provider-admin or canonical domain/process authority.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-AIN-APPLICABILITY-SCOPED-AGENTIC-QUALIFICATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with UCA applicability while AI retains proposal/approval/execution semantics.
- `G2-CAPABILITY-CANDIDATE-AIN-APPROVAL-EVIDENCE-REPLAY-HORIZON` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; preserve historical validity versus current replay/requalification capability.
- `G2-CAPABILITY-CANDIDATE-AIN-MIXED-AGENT-RUNTIME-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; approval/replay/tool/containment/evidence/offline axes remain independent.
- `G2-CAPABILITY-CANDIDATE-AIN-RESIDUAL-APPROVAL-CHECKPOINT-TOOL-SESSION-DRAINAGE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; Lifecycle owns generic drainage, AI owns agent-specific closure semantics.

No candidate is promoted in this revisit.

## Saturation assessment
Principal representatives are `DEEP`, but this revisit produced eight material architectural findings. `consecutive_no_material_finding=0`; **NOT SATURATED**. Next eligible revisit must test whether the applicability/evidence/support/drainage pattern converges without new AI-specific architecture.