# G3 Proof Obligation Matrix

Status: FINAL / SATURATED.

## Transverse proof families

| Proof family | Required invariant |
|---|---|
| Identity Proof | Correlation, provider/resource IDs, clone operations and runtime observations cannot establish canonical identity without qualified identity evidence. |
| Semantic Qualification Proof | owner, revision, currentness, locality, provenance, classification and effective period cannot be silently strengthened. |
| Cross-Owner Composition Proof | a consumer cannot promote another semantic owner's qualified claim to stronger truth/authority/currentness/locality. |
| Authority Proof | role, hierarchy, visibility, workflow, AI inference or decision existence cannot manufacture action authority. Delegation cannot exceed its source. |
| Composition Proof | local correctness does not imply system correctness; assumptions/preconditions and guarantees/postconditions must remain explicit across boundaries and fail closed when unsatisfied/unknown. |
| Reality/Effect Proof | request/ACK/delivery is not business effect; desired/observed/effective remain distinct; possible mutation + UNKNOWN requires reconcile-before-retry. |
| Temporal Proof | as-of/effective/currentness semantics preserve historical truth and do not reinterpret old evidence under a new revision silently. |
| Isolation Proof | tenant/workspace/object/row/field/relation/action/export/search/AI boundaries cannot leak through projections, counts, backlinks, autocomplete or derived artifacts. |
| Failure Proof | partial failure, timeout, partition, version skew, stale evidence and provider degradation remain explicit and cannot become false success. |
| Portability Proof | data, semantics, definitions, providers/integrations, operational autonomy, evolution and evidence/history remain independently portable where promised. |
| Evolution Proof | change preserves or explicitly disposes identity, revision, lineage, authority, evidence, external effects and historical navigation. |
| Recovery Proof | backup existence alone is insufficient; restore and service recovery require observed proof. |

## Required adversarial obligations

### Identity and semantics
- relation-schema revision/history; rename vs semantic change; split/merge/migration mappings;
- provider replacement without canonical identity replacement;
- clone identity proof and false-correlation proof;
- telemetry spoof/stale binding; observed-resource identity != canonical identity;
- schema-compatible but semantically breaking change; syntactic compatibility != semantic compatibility;
- historical as-of interpretation against the governing revision.

### Governance
- conditional approval: X→A; Y→B+H; A AND B; A OR B; 2-of-N; veto; exception route;
- delegation expiry/revocation; SoD and dual control; stale evidence after a decision;
- approval/decision succeeds but execution fails; execution succeeds but observation is UNKNOWN;
- hidden/undiscoverable/read-only/export-denied distinctions;
- AI recommendation rejected with no canonical mutation.

### Execution and operations
- single/multi-unit deployment; invalid split; version skew; partial deploy;
- API/command/job ACK followed by absent/UNKNOWN effect;
- timeout after possible external mutation → reconciliation before retry;
- compensation as a new governed effect, not historical erasure;
- cohort drainage/update strategy; topology migration; state migration;
- external API/brownfield opaque resource without false configuration authority;
- autonomous runtime while Builder/Observe are unavailable.

### Evolution/recovery
- provider/technology replacement preserving semantic identity;
- rollback-with-effects and irreversible external-effect history;
- migration preservation of lineage/provenance/authority;
- transitional adapter/proxy with explicit exit/removal condition or governed permanent disposition;
- Safe Decommission: cleanup obligations UNKNOWN/PARTIAL/CONFLICTED block completion absent explicit authorized waiver/abandonment;
- Backup Exists != Restore Proven != Service Recoverable.

## Five sufficiency proofs

1. **Representational Sufficiency — SATURATED/PASS.** Heterogeneous domain entities/resources/relations compose without sector primitives in the kernel.
2. **Behavioral Sufficiency — SATURATED/PASS.** Events/actions/states/transitions/rules/calculations/retries/compensations/handoffs and conditional processes compose from existing contracts.
3. **Governance Sufficiency — SATURATED/PASS.** Conditional/multiple approvals, delegation, escalation, veto, SoD, obligations, exceptions/waivers and evidence/effective periods compose without hardcoded ApprovalFlow.
4. **Compositional Sufficiency — SATURATED/PASS.** Cross-owner assumption/guarantee qualification and conflict proofs prevent local validity from becoming false system validity.
5. **Evolutionary Sufficiency — SATURATED/PASS.** Versioning, clone, migration, provider replacement, integration, rollback, module retirement and decommission remain representable while preserving semantic continuity/history.

Stress cases included telecom/SIP, manufacturing, professional/administrative services, hospitality, physical maintenance, logistics, retail, distributed multiunit organizations, outsourcing, documents, intermittent/offline operation, long human processes, intense automation, brownfield/federation and regulated operation. These are proofs, not fronts.
