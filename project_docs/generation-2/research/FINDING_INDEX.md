# Generation 2 — Finding Index

Prior stable findings remain authoritative in their capability dossiers and pipeline history. Compacting this index does not revoke them.

## Cycle 6 authority through Architecture Reconciliation as a Capability
All previously indexed cycle-6 findings remain authoritative in their dossiers and prior index revisions.

### Developer / Operator Experience / Self-hosting — revisit 5
- **G2-FINDING-DOESH-39** — Self-hosting requires typed installation, instance, fleet-member, update-intent/material/attempt, recovery-point and diagnostic identities; a scalar deployment/version identity is insufficient.
- **G2-FINDING-DOESH-40** — Desired fleet intent and observed local realization are separate sources of truth; disconnected/local success cannot be overwritten by control-plane assumption, nor can local state silently redefine fleet intent.
- **G2-FINDING-DOESH-41** — Upgrade compatibility is path-relative and may require ordered intermediate stops plus migration completion; endpoint version compatibility alone is insufficient.
- **G2-FINDING-DOESH-42** — Air-gapped updateability requires a qualified local material-and-trust closure; possession of a binary/image alone does not establish an admissible update source.
- **G2-FINDING-DOESH-43** — Update/recovery mutation requires expected-base ownership and reconcile-before-retry semantics; interrupted or acknowledgement-lost operations are `OUTCOME_UNKNOWN`, not automatically retryable.
- **G2-FINDING-DOESH-44** — Update/restore mechanism success and semantic operational validity are distinct postconditions spanning configuration, secrets, data/schema, application behavior and protection posture.
- **G2-FINDING-DOESH-45** — Diagnostic/support evidence is privileged derived data with explicit collection scope, redaction, custody and recipient authority; diagnostic access must not imply secret/provider-admin access.
- **G2-FINDING-DOESH-46** — Fleet completion requires residual-realization disposition and reconnect requalification; stale/offline members cannot be silently counted as converged or allowed privileged mutation under obsolete trust/policy.

### Architecture Reconciliation as a Capability — revisit 5
- **G2-FINDING-ARC-39** — Architecture reconciliation requires typed, revision-qualified `Evidence → Finding → ProductTruth → Gap → Disposition → Proof` lineage; a finding, product observation, decision and proof are not interchangeable records.
- **G2-FINDING-ARC-40** — Architecture decisions require immutable historical identity plus explicit applicability/supersession lineage; a new accepted decision replaces applicability, not historical evidence, and documentation alone does not prove implementation compliance.
- **G2-FINDING-ARC-41** — Credible contradictory or stale evidence must remain provenance-preserving and yield `CONTRADICTED/INCONCLUSIVE/STALE`; last-writer-wins reconciliation is architecturally unsafe.
- **G2-FINDING-ARC-42** — Technical mutation ownership such as SSA field management is not semantic authority; forced conflict resolution or field re-acquisition requires a separately authorized ownership-transfer proof.
- **G2-FINDING-ARC-43** — Field delegation/relinquishment is a first-class reconciliation transition; convergence must support mixed ownership without treating delegated live values as drift requiring unconditional overwrite.
- **G2-FINDING-ARC-44** — Defaulting/late initialization is provenance-bearing normalization: provider-observed values may enrich desired representation without acquiring semantic/domain ownership or continuous enforcement authority.
- **G2-FINDING-ARC-45** — External/provider observation is epistemic evidence whose source, credentials/configuration, freshness and coverage qualify confidence; observation failure or misleading context cannot be flattened into authoritative absence.
- **G2-FINDING-ARC-46** — Architecture proof closure must bind executable conformance/inspection evidence to the tested revision, scope and implementation profile; documentation claims cannot substitute for behavior where executable proof is feasible.

## Cycle closures
Cycles 3, 4, 5 and 6 completed all 25 active capabilities. Every cycle-6 pass produced material architectural findings; no capability was SATURATED at cycle close. Cycle 7 is the next eligible research cycle; Enterprise Completeness / Negative-Space remains gated until seven full cycles complete.

## Historical authority
All prior findings, including cycle 1–6 findings compacted out of this view, remain authoritative in their dossiers and prior index revisions.