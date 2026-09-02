# AI-native Engineering / Agents / Approvals — Revisit 02 / Cycle 3

## Research question
How should Generation 2 represent agent intent, tool/model/policy revisions, approvals, execution evidence and evolution so AI can materialize useful changes without self-authorizing higher-scope mutations or coupling semantic intent to one model/provider?

## Representatives and evidence ledger
1. OpenAI Agents/Workspace Agents — agents have configured instructions/tools, guardrails, tracing, sandboxed long-running work, and explicit approval/HITL checkpoints for sensitive actions. Source of truth: OpenAI product/academy documentation (2025–2026).
2. Model Context Protocol (MCP) 2025–2026 — tool/resource discovery, protocol capability negotiation, OAuth 2.1 resource-server boundary, enterprise-managed authorization and additive extensions. Source of truth: MCP specification ecosystem and official SDK/docs/blog.
3. Temporal durable execution/version coexistence — durable histories constrain code evolution and require compatibility/versioning discipline for in-flight work. Source of truth: Temporal documentation; retained as PARTIAL because agent-specific approval semantics are external to Temporal.
4. LangGraph durable execution/HITL — interrupt/resume and persisted execution state illustrate approval as a resumable execution boundary rather than an informal chat acknowledgement. Source of truth: LangChain/LangGraph documentation; PARTIAL pending deeper version-evolution evidence.
5. Google A2A — task/artifact-oriented agent interoperability is useful as a provider-neutral comparison, but authority semantics require independent policy; PARTIAL.

## Source of truth, identity and lifecycle
Universal identities should distinguish `SemanticAgentTask`, `AgentPolicyRevision`, `ToolCapabilityProfile`, `ModelRealization`, `AgentRun`, `CandidateMutationArtifact`, `ApprovalRequirement`, `ApprovalDecision`, `ExecutionAttempt` and `OutcomeEvidence`. A run binds exact effective revisions; changing model/tool/policy does not rewrite the semantic task identity.

Lifecycle: intent → capability/profile resolution → authority preflight → run → candidate artifact/tool request → validation → approval when required → separately authorized execution → evidence/conformance. Approval is not execution and execution is not proof of accepted outcome.

## Versioning and compatibility
LVEM-17..22 apply directly: desired agent/policy revision, effective realization and availability are separate facts; compatibility is profile/operation/direction/window scoped; in-flight runs need explicit coexistence/migration semantics; replay after recovery creates a new governed transition rather than erasing history. SIAC-17..22 constrain tool/profile discovery: advertised tools/extensions are claims, unknown features are profile-scoped, and offline operation needs interpretation closure.

## Failure semantics
Model nondeterminism, tool unavailability, stale policy, approval expiry, capability mismatch, interrupted execution and missing evidence must remain distinguishable. Missing evidence yields `UNKNOWN/INSUFFICIENT_EVIDENCE`, never implicit success. An approval against revision X becomes stale if material policy/tool/input scope changes before execution.

## Extensibility and provider boundaries
Semantic task intent must survive model/provider replacement. MCP demonstrates that tool transport/auth can be providerized and authorization can remain external to the tool server. Agent frameworks/harnesses are realizations, not semantic owners. Tool discovery never grants tool authority.

## Governance, observability and portability
Every consequential action needs lineage linking actor/agent, semantic intent, effective policy/model/tool revisions, inputs or bounded input digest, candidate artifact, approval decision, execution attempt and observed outcome. Exact token-for-token replay is not a universal requirement; governance requires sufficient reproducibility to reconstruct governing inputs/revisions and validate outcome/postconditions. Offline/self-hosted operation requires local model/tool/policy/trust/approval evidence closure; cached prompts alone are insufficient.

## Lock-in
Provider-specific conversation IDs, proprietary tool schemas, hidden memory and provider approval objects must not become canonical task identity. Portable definitions should retain semantic intent, capability requirements, authority class, evidence obligations and migration/coexistence constraints.

## Product-specific mechanisms vs universal primitives
Product-specific: OpenAI guardrail/handoff/sandbox APIs, MCP transports/extensions, LangGraph interrupt objects, Temporal versioning APIs, A2A task wire format. Universal: semantic task, capability requirement, effective revision binding, candidate mutation, approval requirement/decision, execution authority, evidence lineage, compatibility window and offline realization closure.

## Convergent/divergent patterns
Convergence: tool access is explicit; sensitive operations need bounded authority/HITL; durable work needs persisted state/evidence; provider discovery is not authority. Divergence: frameworks vary on where approval lives, how strongly execution is replayable, and whether model/tool state is portable. Therefore SB must own semantic authority/evidence contracts while providerizing harness/model/tool realization.

## Subcapabilities
Agent task definition; tool capability negotiation; authority preflight; candidate-artifact materialization; approval orchestration; run/evidence lineage; provider/model substitution; durable/in-flight evolution; offline/self-hosted agent closure; Station-scoped agent capability exposure.

## SB comparison — bounded evidence only
A directed fresh-main code search for `approval agent authority tool model policy` returned no result. This is negative evidence for that query only and is not repository-wide proof of absence. Repository archaeology remains deferred to PLANNING_B.

## Reconciliation hypotheses
- GENERALIZE semantic agent intent away from model/provider realization.
- HARDEN approval as revision-bound evidence with expiry/staleness semantics.
- PROVIDERIZE model, harness and tool transport.
- INTEGRATE agent candidate mutations with existing artifact/provenance, authorization, lifecycle and provider-binding capabilities.
- DO_NOT_BUILD an AI-specific parallel authorization system.

## Repo-validation questions
Where are agent/task identities currently represented? Are tool calls bound to capability/authority contracts? Can an approval be proven against exact policy/tool/input revisions? Are candidate mutations separated from execution? Can model/provider replacement preserve task intent? What local closure is required for self-hosted/offline agent operation?

## Adaptive Governed Work Surfaces / Symbiotic Proof
AGWS remains distinct. `Enterprise → Station → Role → Person` projects only delegated agent/tool capabilities. A Person may ask AI to reorganize a governed surface; AI may produce a candidate surface revision. If the request implies canonical schema/domain/process/provider/extension/deployment change, the candidate must be classified upward and separately approved/executed. The AI cannot grant itself a tool, credential, provider, extension or higher Station authority. Proof: the same semantic request under two model providers yields provider-specific runs but the same authority classification/evidence obligations; a stale approval after policy revision is rejected; a domain-changing request is escalated rather than silently materialized.

## Stable findings
- **G2-FINDING-AIN-17 — Semantic Agent Task Identity Must Be Independent of Model, Harness and Tool Realization.** Value HIGH; risk HIGH; priority P0.
- **G2-FINDING-AIN-18 — Approval Must Bind Exact Effective Policy, Tool, Input-Scope and Candidate-Artifact Revisions and Become Stale on Material Change.** Value HIGH; risk CRITICAL; priority P0.
- **G2-FINDING-AIN-19 — Agent-Produced Mutations Are Candidate Artifacts; Materialization Authority, Approval Authority and Execution Authority Are Distinct.** Value HIGH; risk CRITICAL; priority P0.
- **G2-FINDING-AIN-20 — Tool Discovery/Negotiation Is a Capability Claim and Never Grants Execution Authority or Credentials.** Value HIGH; risk CRITICAL; priority P0.
- **G2-FINDING-AIN-21 — Governance Reproducibility Requires Revision-Bound Reconstruction and Postcondition Evidence, Not Deterministic Model Token Replay.** Value HIGH; risk HIGH; priority P0.
- **G2-FINDING-AIN-22 — In-flight and Offline Agent Autonomy Require Qualified Local Policy/Tool/Model/Trust/Approval Closure With Explicit Compatibility Windows.** Value HIGH; risk HIGH; priority P1.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-REVISION-BOUND-AGENT-APPROVAL-EVIDENCE` — CROSS_CUTTING / CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-AGENT-CANDIDATE-MUTATION-AUTHORITY-SEPARATION` — CORE / CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-PORTABLE-AGENT-EXECUTION-EVIDENCE-CLOSURE` — CROSS_CUTTING / CANDIDATE.

## Saturation
Material new architectural findings: yes. `consecutive_no_material_finding=0`; NOT SATURATED. Next research question for this capability: whether approval/evidence primitives converge sufficiently across autonomous code agents, business agents and physical/edge agents to become universal primitives rather than AI-specific contracts.