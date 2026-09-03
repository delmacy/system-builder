# Generation 2 — Deep Research Index

Status: ACTIVE RESEARCH INDEX / NOT TARGET-ARCHITECTURE AUTHORITY

Deep Research artifacts are primary **conciliation** inputs during Capability Synthesis, not primary factual authority. Their external claims remain traceable to original evidence; breadth dossiers/findings are hypotheses/input corpus and must not be double-counted as independent sources.

| ID | Topic / question | Affected capability / hypothesis | Status | Material impact | Artifact |
|---|---|---|---|---|---|
| DR-EOC-01 | Should workflows compose capability-owned semantic operations, and which workflow nodes are orchestration rather than operations? | Executable Capability Composition & Cumulative Context; Workflow & Durable Execution; Universal Capability Architecture; AGWS; Provider/Binding; Authorization; Integration | COMPLETE — RESEARCH RECOMMENDATION | Strengthens `CapabilityOperation`; falsifies “every WorkflowNode is an operation”; separates human handoff from semantic decision; strengthens typed cumulative context + minimum projection; rejects provider-native job/resource identity as canonical workflow semantics. Refines proof obligations DR-EOC-01..10. | `DEEP_RESEARCH_EXECUTABLE_OPERATION_COMPOSITION_01.md` |
| DR-TCE-01 | Across composed operations, what distinguishes attempted/acknowledged/local-commit/business-effective/observed/unknown outcomes, and when does an invariant require coordination? | Transaction / Consistency / Concurrency; Executable Composition; Workflow; Data; Integration; Messaging; Provider/Binding; Evidence | COMPLETE — RESEARCH RECOMMENDATION | Rejects generic `SUCCESS`, universal distributed ACID and provider-level exactly-once as business exactly-once; recommends evidence-qualified semantic outcomes, invariant-scoped consistency/coordination and semantic stage admission gates. Strengthens immutable outcome lineage and provider-compatibility proofs. Adds DR-TCE-01..12. | `DEEP_RESEARCH_TRANSACTION_COMMIT_EFFECT_01.md` |

## Next high-value deep question

Offline/edge bounded-resource coordination and Station authority: can the SB safely pre-allocate rights/escrow/leases/capability budgets to disconnected Stations so selected non-confluent invariants remain available without central coordination, while preserving non-amplifying authority, reconciliation evidence and provider-neutral semantics?