# AI-native Engineering / Agents / Approvals

## Research question
What provider-neutral primitives let System Builder use probabilistic agents safely while preserving explicit authority, durable evidence, human approval, replay semantics, portability and generated-runtime autonomy?

## Representatives and evidence ledger

| Representative | Evidence | Architectural contribution |
|---|---|---|
| OpenAI Responses/Agents platform | OpenAI, “New tools for building agents”, 2025-03-11 | Separates model responses from tools and agent orchestration; tools are explicit capabilities rather than implicit model powers. |
| Anthropic Claude Code permission/auto-mode model | Anthropic Engineering, “How we built Claude Code auto mode”, 2026-03-25 | Default approval before commands/file mutation; sandboxing and classified permission decisions show authority is independent of model intent. |
| GitHub Copilot cloud/coding agents | GitHub Docs, current 2026-09-01 | Agent session is delegated work producing PR/commits; policy enables agents, security validation is separate, human review/merge remains distinct authority, session/audit logs preserve provenance. |
| LangGraph durable execution / human-in-the-loop | LangGraph documentation, current family | Durable graph state and interrupt/resume patterns separate execution checkpoint from human decision and permit resumable agent workflows. |
| Temporal durable execution | Temporal documentation/platform, current 2026-09-01 | Durable workflow history/replay demonstrates that deterministic orchestration should contain nondeterministic/probabilistic activities rather than pretend model calls are replay-deterministic. |

Sources consulted in this pass include official OpenAI, Anthropic, GitHub and Temporal material; LangGraph remains representative-level evidence to deepen on revisit.

## Source of truth and identity
The portable source of truth should be an **agent work contract**, not a transcript and not a model-specific assistant/thread object. Distinct identities are required for agent role/definition, model/provider binding, delegated work request, plan/revision, execution attempt/session, tool invocation, approval checkpoint/decision, produced artifact/change and evidence record. A provider conversation/session ID is correlation metadata, never universal identity.

## Lifecycle
`work request -> authority/binding resolution -> plan/proposal -> execution attempt -> tool request -> policy/approval decision -> tool execution -> observation/evidence -> checkpoint -> review/accept/reject/cancel -> completion`.

Approval is not a generic pause flag. It binds a decision-maker/authority to a concrete proposed operation or bounded operation set and revision. Changed material inputs invalidate or require renewal according to policy.

## Versioning
Agent definition, prompt/instruction set, tool contract, policy, model/provider binding and plan are independently versioned. Model aliases are insufficient provenance: evidence should preserve the strongest provider-exposed model/revision identifier plus portable binding identity. A resumed attempt must identify the checkpoint and relevant revisions under which it continues.

## Failure semantics
Probabilistic output failure, tool rejection, approval denial/expiry, provider failure, malformed tool arguments, partial side effect, timeout and orchestration crash are distinct. Retry safety depends on the invoked operation’s idempotency/compensation semantics. Replaying deterministic orchestration must not silently repeat an already committed external side effect or assume a model response can be reproduced byte-for-byte.

## Extensibility and provider boundaries
Model providers, agent frameworks and tool transports are providers behind portable contracts. Tool/capability definitions describe what may be requested; provider bindings describe how they are reached. Extension mechanisms may add agent/tool providers but cannot self-grant authority. MCP-like transport/discovery is useful interoperability, not the universal semantic authority model.

## Governance
Delegation must be explicit and bounded by actor, scope, capability/tool, resource, environment, operation class, time/revision and escalation rules. Agent intent never upgrades authority. Policy may auto-approve bounded low-risk operations, require a human for sensitive operations, or deny them. GitHub’s separation of agent enablement, generated work, validation, review and merge is strong evidence for this boundary.

## Observability and provenance
Evidence should correlate work request, agent definition revision, provider/model binding, plan revision, attempt, tool invocation, approval decision, external operation result and produced artifacts. Logs/transcripts are supporting evidence, not sufficient proof of side effects. Sensitive prompt/tool material requires redaction/retention policy.

## Portability and lock-in
Portable definitions must not depend on proprietary thread/session IDs, provider-specific tool names, hosted memory or one model’s prompt syntax. Provider-native features may be retained through capability negotiation and provider-specific extensions. Exportable work/checkpoint/evidence lineage is required for migration.

## Product-specific mechanism vs universal primitive
Product-specific: OpenAI Responses/tool invocation, Claude Code permission classifiers/sandbox, GitHub agent sessions/PR workflow, LangGraph interrupts, Temporal workflow/activity machinery.

Universal primitives: AgentDefinition/Role, AgentWorkRequest, DelegatedAuthority, ModelProviderBinding, ToolCapabilityRequirement, PlanRevision, AgentAttempt, ToolInvocation, ApprovalCheckpoint, ApprovalDecision, ExecutionCheckpoint, AgentEvidence, ProducedArtifact/Change lineage.

## Convergent and divergent patterns
Convergent: tools are explicit; mutation authority is separate from model reasoning; durable/auditable work needs attempt/session identity; humans/policies can gate sensitive effects; evidence/provenance matters; provider/model selection is configurable.

Divergent: approval granularity, sandbox strength, checkpoint implementation, memory model, retry/replay guarantees and provider-hosted session semantics differ substantially. These must remain qualified capabilities rather than be flattened into one agent engine.

## Subcapabilities
1. Agent role/work-contract modeling.
2. Model/provider binding and capability negotiation.
3. Tool capability declaration and authority enforcement.
4. Delegation and approval checkpoints.
5. Durable attempts/checkpoints and resumability.
6. Probabilistic/deterministic boundary management.
7. Tool-side-effect idempotency/compensation evidence.
8. Agent provenance, audit and sensitive-data governance.
9. Human override/cancel/escalation.
10. Provider replacement and portable execution evidence.

## SB comparison — evidence bounded
Fresh-main code search in this pass did not yield evidence for a general agent/approval subsystem under the searched terms. Therefore no claim is made that SB already owns these primitives. Existing Generation-2 findings about operation evidence, authorization, provider bindings, durable execution and governance are adjacent hypotheses only; exact implementation ownership remains a PLANNING_B repository-archaeology question.

## Reconciliation hypotheses
- **GENERALIZE** existing authority/evidence/provider primitives where fresh-main archaeology proves reusable contracts.
- **INTEGRATE** agent work with workflow/durable execution rather than create a second universal workflow engine.
- **PROVIDERIZE** model/agent-framework bindings and provider-native memory/session features.
- **HARDEN** operation authority so tool invocation cannot inherit authority from model intent.
- **DO_NOT_BUILD** a universal autonomous-agent runtime that hides provider/framework semantics.
- **DEFER** concrete model SDK/runtime choice until target architecture and repository archaeology.

## Repo-validation questions
1. Which current contracts already identify actor, operation, authority and evidence strongly enough for AgentAttempt/ToolInvocation reuse?
2. Can workflow execution own durable agent checkpoints without coupling workflow semantics to an AI provider?
3. Where are provider binding revisions and external-operation idempotency represented today?
4. Is there an existing approval/decision primitive under terminology not found by this pass?
5. Can generated runtimes resolve model/tool providers and continue approved work without Builder availability?
6. Which current audit/provenance records can bind human decisions to exact proposed mutations?

## Symbiotic Proof
A generated system defines one portable agent work contract and tool requirement; runs it with provider A; pauses a mutation at an approval checkpoint; records human/policy decision and exact operation revision; completes with correlated evidence; then replaces the model/agent provider with provider B without changing semantic work identity or tool authority. During ordinary runtime operation the Builder may be unavailable. A denied/expired approval causes no protected side effect, and retry/recovery cannot duplicate a previously committed non-idempotent operation.

## Stable findings
- **G2-FINDING-AIAA-01** — Agent identity, model/provider identity, work-request identity and execution-attempt identity are distinct.
- **G2-FINDING-AIAA-02** — Model intent or tool selection never constitutes tool/mutation authority.
- **G2-FINDING-AIAA-03** — Approval checkpoint and approval decision require independent identity, scope, revision and evidence.
- **G2-FINDING-AIAA-04** — Delegated authority must be bounded and cannot be expanded by an agent or extension at runtime.
- **G2-FINDING-AIAA-05** — Deterministic orchestration may contain probabilistic activities; probabilistic outputs must not be treated as replay-deterministic state transitions.
- **G2-FINDING-AIAA-06** — Retry/replay safety for agent work is governed by tool-side-effect idempotency/compensation, not by the model call alone.
- **G2-FINDING-AIAA-07** — Prompt/instruction, agent definition, policy, model binding and plan are independently versioned provenance inputs.
- **G2-FINDING-AIAA-08** — Transcript/session logs are supporting evidence but do not by themselves prove authorization or external side effects.
- **G2-FINDING-AIAA-09** — Human review, automated validation and execution authority are separate gates and must not be collapsed into one “approved by AI” state.
- **G2-FINDING-AIAA-10** — Generated-runtime autonomy requires deployment-local resolution of agent/model/tool bindings plus exportable checkpoints/evidence without ordinary Builder dependence.

## Value / risk / priority / next question
Value: HIGH — AI-native engineering is central to safe autonomous construction and generated-system augmentation. Risk: VERY HIGH if probabilistic intent is confused with authority or replay semantics. Priority: HIGH, cross-cutting with Workflow, Authorization, Provider, Governance, Observability and Resilience. Next question: after first-pass rotation, revisit concrete durable checkpoint/approval semantics and map them to SB repository truth.