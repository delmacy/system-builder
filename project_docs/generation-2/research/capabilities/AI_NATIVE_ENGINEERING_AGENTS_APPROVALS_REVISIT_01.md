# AI-native Engineering / Agents / Approvals — Revisit 01

## Research question
How should Generation 2 separate probabilistic proposal, delegated authority, approval, durable execution, side-effect evidence and provider/model portability so AI can materialize work safely—including Adaptive Governed Work Surfaces—without inheriting canonical-domain authority?

## Representatives and evidence/source ledger

| Representative | Coverage | Evidence used | Architectural contribution |
|---|---|---|---|
| OpenAI Agents SDK HITL / MCP approvals | DEEP | OpenAI Agents SDK HITL and MCP approval docs, current 2026-09 | Run-wide interruptions, per-call approval identity, nested-agent approval propagation, serializable RunState, fail-closed malformed arguments, provider/tool-scoped sticky decisions. |
| LangGraph / LangChain HITL + persistence | DEEP | LangGraph interrupts, persistence and LangChain HITL docs | Checkpointed pause/resume, approve/edit/reject decisions, restart semantics on resume, idempotency requirement for side effects before interrupts. |
| GitHub Copilot cloud agent | DEEP | GitHub cloud-agent risks, review output, session/audit docs | Generated change is not merge authority; required human gates remain distinct; signed commits/session logs provide provenance; allowed tools are explicitly bounded. |
| Anthropic Claude Code permissions | DEEP | Claude Code security/permissions documentation | Read-only/default permission boundary and explicit permission for mutation; sandbox/permission decision remains distinct from model intent. |
| Temporal durable execution | DEEP | Temporal durable execution/activity semantics carried from first pass | Nondeterministic/probabilistic work belongs behind durable orchestration boundaries; external side effects require retry/idempotency discipline. |

Primary source URLs: https://openai.github.io/openai-agents-python/human_in_the_loop/ ; https://openai.github.io/openai-agents-js/guides/mcp/ ; https://docs.langchain.com/oss/python/langchain/human-in-the-loop ; https://docs.langchain.com/oss/python/langgraph/interrupts ; https://docs.langchain.com/oss/python/langgraph/persistence ; https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/agents/cloud-agent/risks-and-mitigations ; https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output .

## Source of truth
The portable source of truth is a versioned **Agent Work Contract + Delegated Authority + durable execution/evidence lineage**. Provider session/thread/run identifiers are correlation data. Model output is a proposal. Approval is a governed decision about a concrete proposed operation or bounded operation set. External effect evidence is a separate fact.

## Identity
Keep independent identities for: AgentDefinition, AgentWorkRequest, DelegationGrant, Proposal/PlanRevision, AgentAttempt, ToolCapabilityRequirement, ProviderBindingRevision, ToolInvocationIntent, ApprovalCheckpoint, ApprovalDecision, SideEffectAttempt, SideEffectResult, ExecutionCheckpoint, ProducedChange/Artifact and Review/AcceptanceDecision.

A nested/subagent execution must not erase delegation lineage: the child attempt may act only inside the authority explicitly delegated by the parent context and current policy.

## Lifecycle
`work request -> resolve actor/station/role/policy/provider context -> delegate bounded authority -> proposal/plan -> tool/action intent -> pre-execution validation -> approval policy evaluation -> checkpoint -> decision -> revalidation -> side-effect attempt -> result/evidence -> postcondition/conformance -> review/accept/reject -> completion`.

Changed material inputs, policy, authority, Station/Role, tool arguments or provider binding can invalidate a pending approval and require re-evaluation before execution.

## Versioning
Version independently: agent definition, instruction/prompt set, policy, delegation grant, tool contract, provider/model binding, plan/proposal, Station/Role capability exposure and execution context. Long-lived paused work must persist compatible version markers; model aliases alone are insufficient provenance.

## Failure semantics
Distinguish malformed proposal, guardrail rejection, approval denial/expiry, stale approval, tool/provider unavailability, checkpoint loss, orchestration crash, timeout, cancelled work, partial side effect, duplicate effect, postcondition failure and review rejection. Resumption may re-enter a node or tool-selection path; already committed effects therefore require idempotency keys, effect receipts, compensation or explicit at-most-once coordination.

## Extensibility and provider boundaries
Agent/model frameworks and MCP/tool transports are providers. They may expose native approvals, memory, tracing and delegation, but those mechanisms cannot become the portable authority model. Tool discovery says what can be called; capability contracts and authorization say what may be requested; effective authority says what may execute.

## Governance
Authority is an intersection, not an inheritance shortcut: `actor ∩ Enterprise policy ∩ Station ∩ Role ∩ delegated grant ∩ capability/tool policy ∩ provider/action constraints`. Agents and subagents cannot widen it. Approval can be human or policy-driven, but the decision must identify subject/action/scope/revision and must fail closed when the concrete operation cannot be safely inspected.

## Observability and provenance
Correlate work request, proposal revision, authority snapshot, policy revision, provider/model binding, tool-call identity/arguments digest, approval checkpoint/decision, side-effect attempt/result, checkpoints and produced artifacts. Session/transcript logs are supporting evidence only. Approval evidence must survive long pauses without silently becoming authorization for materially changed work.

## Portability and lock-in
Portable definitions cannot depend on one provider's thread, RunState, sandbox or MCP approval representation. Persist semantic work/approval/effect identities separately and map them to provider-native state. Provider replacement must preserve authority semantics and resumability or force explicit safe restart.

## Product-specific mechanism vs universal primitive
Product-specific: OpenAI `RunState`/interruptions/sticky approvals; LangGraph thread/checkpointer/interrupt; GitHub draft PR + workflow gate + session logs; Claude Code permission prompts/sandbox; Temporal workflow/activity machinery.

Universal primitives: DelegationGrant, AuthoritySnapshot, AgentWorkRequest, ProposalRevision, AgentAttempt, ToolInvocationIntent, ApprovalCheckpoint, ApprovalDecision, ExecutionCheckpoint, SideEffectAttempt, SideEffectReceipt/Result, ProviderBindingRevision, PostconditionEvidence, ProducedChange and ReviewDecision.

## Convergent patterns
1. Proposal/tool selection is not execution authority.
2. Sensitive effects are gated by explicit policy/approval decisions.
3. Durable pause/resume needs persisted state and stable correlation identity.
4. Nested/delegated work must surface approvals rather than bypass outer control.
5. Review/acceptance remains distinct from generation/execution.
6. Side-effect safety must survive retry/resume semantics.

## Divergent patterns
Approval granularity, sticky-decision scope, sandbox strength, checkpoint mechanics, subagent propagation, memory format, model provenance and provider-native tool semantics vary. These are qualified provider capabilities, not universal semantics.

## Subcapabilities
1. Agent work-contract and proposal modeling.
2. Authority snapshot and bounded delegation.
3. Tool/capability grants and provider-neutral invocation intent.
4. Approval checkpoint, decision and stale-decision invalidation.
5. Durable checkpoint/resume and version-aware paused work.
6. Side-effect attempt/result/idempotency lineage.
7. Subagent authority propagation and attenuation.
8. Review/acceptance separation.
9. Model/provider portability and replacement.
10. AI materialization boundary for governed work surfaces.

## Adaptive Governed Work Surfaces composition
AI may be the sole materializer of a surface without receiving canonical-domain authority. A request such as “add a customer risk score field” is first interpreted as intent; if satisfying it requires a new entity/field/domain rule, the materializer emits an escalation/proposal into the canonical change path rather than mutating schema. Surface-safe work is limited to existing semantic components, valid bindings, allowed layouts and actions exposed by Station/Role.

Personal or supervised automation initiated from a work surface is bounded by the same effective authority intersection. A subagent or provider tool cannot escape Station/Role capability exposure. Approval of a surface action applies to the concrete action/revision; a Station or Role change requires revalidation of pending work before resume.

## SB comparison — evidence bounded
Fresh-main code search for `approval authority tool invocation agent provider binding evidence` returned no matching implementation evidence. This is **not evidence of absence**. Existing first-pass repository comparison therefore remains unchanged: exact reuse/generalization decisions await PLANNING_B archaeology. No research-branch artifact is treated as product truth.

## Reconciliation hypotheses
- **HARDEN** approval as revision-bound, revalidated decision evidence rather than generic paused state.
- **GENERALIZE** authority/evidence primitives only where fresh-main archaeology proves compatible ownership.
- **INTEGRATE** durable agent checkpoints with the platform's workflow/durable-execution capability rather than inventing a second workflow substrate.
- **PROVIDERIZE** model, agent framework, MCP transport, memory/session and native tracing.
- **HARDEN** delegated/subagent authority as attenuation/intersection, never inherited expansion.
- **INTEGRATE** Adaptive Governed Work Surfaces through intent/materialization contracts and escalation to canonical-domain change paths.
- **DO_NOT_BUILD** autonomous authority escalation or model-owned canonical schema/process mutation.

## Repo-validation questions
1. Is there a reusable operation/authority snapshot primitive that can bind an approval to exact action revision and Station/Role context?
2. Can existing workflow checkpoints represent long-lived AI approval waits without replaying committed side effects?
3. Where can side-effect attempt/result receipts and idempotency keys be represented provider-neutrally?
4. Can provider binding revisions be resolved locally in generated runtimes and revalidated after resume?
5. What current contracts distinguish proposal/review/acceptance from execution authority?
6. Can Station/Role capability exposure be consumed as an authority input without coupling agents to Adaptive Work Surface implementation details?

## Symbiotic Proof
A generated runtime receives an AI-authored request to modify a person's governed work surface. The agent proposes a list/form/action composition using only existing semantic contracts and provider-neutral bindings. A sensitive action pauses with a durable checkpoint and approval bound to the exact action, authority snapshot and provider binding revision. The runtime is restarted; the work resumes without Builder availability. If Role or Station changes while paused, the approval is invalidated/revalidated. A nested subagent cannot call a capability outside delegated Station/Role authority. A request requiring a new canonical field is escalated rather than materialized. Replacing model/provider A with B preserves semantic work identity, authority and evidence, while provider-native session IDs may change. Replaying/resuming cannot duplicate a committed non-idempotent side effect.

## Stable findings
- **G2-FINDING-AIAA-11** — Approval validity is operation-, authority-context- and revision-bound; approval must be revalidated when material inputs, policy, Station/Role or binding context change.
- **G2-FINDING-AIAA-12** — Delegated and subagent authority is attenuated by intersection with the parent/effective authority context; delegation never creates new authority.
- **G2-FINDING-AIAA-13** — Tool invocation intent, approval decision, side-effect attempt and side-effect result are independent identities/evidence and must not be collapsed into one “tool call”.
- **G2-FINDING-AIAA-14** — Durable resume semantics require explicit side-effect receipts/idempotency or compensation because resumed execution may revisit pre-interrupt logic.
- **G2-FINDING-AIAA-15** — AI materialization authority is distinct from canonical-domain authority: a materializer must escalate intents requiring schema/domain/process change instead of silently expanding the model.
- **G2-FINDING-AIAA-16** — Review/acceptance evidence is not execution authority; agent-generated work can be technically complete while still requiring independent governed acceptance.

## New capability candidates
- `G2-CAPABILITY-CANDIDATE-REVISION-BOUND-APPROVAL-REVALIDATION` — CROSS_CUTTING. Candidate for reusable approval freshness/revalidation semantics across AI, workflow, governance and work surfaces.
- `G2-CAPABILITY-CANDIDATE-DELEGATED-AUTHORITY-ATTENUATION-EVIDENCE` — CROSS_CUTTING. Candidate for explicit parent→child/subagent authority derivation proof.
- `G2-CAPABILITY-CANDIDATE-SIDE-EFFECT-ATTEMPT-RECEIPT-LINEAGE` — CROSS_CUTTING. Candidate for portable effect-attempt/result/idempotency evidence across agents, integration and durable execution.

## Value / risk / priority / next question
Value: VERY HIGH. Risk: VERY HIGH if approval is stale, delegation amplifies authority, or durable resume repeats an effect. Priority: HIGH and cross-cutting with Adaptive Governed Work Surfaces, Authorization, Workflow, Provider, Governance, Observability and Resilience. Next external-research revisit should only continue after rotation; current material findings reset saturation progress.