# Governance / Compliance / Audit — Revisit 01

## Research question
What universal governance, compliance and audit primitives must Generation 2 preserve without collapsing business authorization, provider-specific enforcement, evidence collection, or core capability semantics into Governance?

## Representatives
1. NIST OSCAL Assessment Layer / Assessment Results / POA&M.
2. HashiCorp Sentinel enforcement levels and override semantics.
3. AWS CloudTrail log-file integrity validation and digest chaining.
4. Sigstore Rekor transparency log and verification model.
5. GitHub Enterprise audit log and retention/export surfaces.

## Evidence / source ledger
| Representative | Evidence | Architectural use |
|---|---|---|
| NIST OSCAL | https://pages.nist.gov/OSCAL/learn/concepts/layer/assessment/assessment-results/ ; https://pages.nist.gov/OSCAL/learn/concepts/layer/assessment/ | Assessment plan, subject/scope, observation, evidence, finding, risk and remediation/disposition are distinct structured objects; results are contextual and may represent snapshot or continuous assessment. |
| HashiCorp Sentinel | https://developer.hashicorp.com/sentinel/docs/concepts/enforcement-levels ; https://developer.hashicorp.com/nomad/docs/govern | Policy logic is separate from deployed enforcement level; advisory, soft-mandatory and hard-mandatory have different effect. Soft overrides require explicit privilege in Nomad and are logged. |
| AWS CloudTrail | https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-digest-file-structure.html ; https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html | Signed hourly digests hash delivered logs and chain to prior digests; validation can detect mutation/deletion, but gaps occur if validation/logging is disabled and delivery problems can temporarily break apparent continuity. |
| Sigstore Rekor | https://docs.sigstore.dev/about/security/ ; https://docs.sigstore.dev/logging/overview/ | Append-only Merkle transparency, signed tree heads and inclusion verification make tampering detectable; durable trust still requires monitoring and retained trust context. |
| GitHub Enterprise audit log | https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/accessing-the-audit-log-for-your-enterprise ; https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization | Audit visibility, event classes, query/export path and retention are provider-scoped; retention differs by event class and deployment model, so existence of an audit event is not equivalent to durable evidence custody. |

## Source of truth, identity and lifecycle
Governance policy/control identity must be stable independently from its revision, deployment scope and enforcement mode. A compliance assertion is a claim about a defined subject/control/scope/time context; an observation is evidence-bearing assessment output; a finding is a derived disposition; a risk/remediation item has its own lifecycle. Audit event occurrence, provider audit record, exported evidence object, retention/custody state and later verification result must remain distinguishable.

Approval and exception identity likewise must not be encoded as mutation of the policy itself. An override is a governed decision referencing policy/control revision, subject/scope, actor authority, reason and time; revocation/expiry affects future authority but must not erase historical evidence.

## Versioning and failure semantics
Policy revision, control/framework revision, enforcement configuration revision and evidence revision are independent axes. Assessment evidence is valid only for an explicit subject/scope/window and freshness claim. Missing evidence, stale evidence, failed collection, failed integrity verification and negative compliance finding are distinct outcomes.

Tamper-evident mechanisms prove only what their cryptographic chain covers. CloudTrail explicitly permits chain gaps when validation/logging is disabled; Rekor requires monitoring for long-term trust. Therefore `immutable` must not be a universal boolean claim detached from coverage interval, trust root, verifier and verification time.

## Extensibility and provider boundaries
Providers may supply policy engines, assessment collectors, audit stores, transparency logs or external auditors. Universal contracts should carry semantic policy/control identity, scope, evidence references, decision/disposition, custody/integrity claims and verification results. Provider-specific enforcement modes, log formats, retention limits, signatures and query APIs remain bindings.

Governance composes with Authorization but does not own business permission semantics. It can require that a decision be approved, audited or policy-conformant without becoming the source of truth for who may perform the business action.

## Governance, observability, portability and lock-in
Governance evidence needs actor/tenant/data/resource scope plus minimization/redaction policy. Redaction is itself evidence transformation and should preserve lineage sufficient to state what was removed and under what authority without leaking the removed content.

Portability requires exportable semantic evidence and verification context. Provider replacement cannot claim continuity merely because new audit storage is writable: custody, retention, integrity and verification lineage must be re-established. Offline/self-hosted verification is strongest when evidence packages retain hashes/signatures, trust-root revision and verification material rather than requiring the original SaaS query surface.

## Product-specific mechanisms vs universal primitives
**Universal:** policy/control identity+revision; effective scope; assessment subject/window; observation; evidence reference; finding/disposition; approval/override/exception decision; authority reference; audit occurrence; evidence custody lineage; retention claim; integrity claim; verification result; redaction/minimization transformation lineage.

**Provider-specific:** Sentinel enforcement-level names; CloudTrail digest/S3 layout; Rekor Merkle implementation; GitHub event taxonomy and retention durations; OSCAL serialization/model packaging.

## Convergent and divergent patterns
Convergence: policy/control definitions are not their evaluation results; assessment scope/time matter; overrides/exceptions require separate authority/evidence; audit durability and integrity need explicit mechanisms; evidence verification is an operation with its own result.

Divergence: systems differ sharply on enforcement vocabulary, retention, cryptographic guarantees, online/offline verification and whether compliance models are first-class structured documents or provider reports.

## Subcapabilities
Policy/control registry; enforcement configuration; approval/override/exception governance; assessment planning; evidence collection and custody; finding/risk/disposition lifecycle; audit recording/export; retention/legal custody; integrity/tamper-evidence verification; redaction/minimization; external auditor/provider portability.

## System Builder comparison — evidence bounded
A fresh-main GitHub code search for broad governance/audit/compliance terms and `AuditRecord` did not return a sufficiently specific contract for a defensible implementation comparison in this run. This is **not evidence of absence**. Repository archaeology is deferred to PLANNING_B; no product-code conclusion is drawn here.

## Reconciliation hypotheses
- **GENERALIZE:** represent policy/control identity, revision, effective scope and enforcement configuration separately.
- **HARDEN:** make compliance assertions evidence-, subject-, scope-, window- and freshness-bound.
- **GENERALIZE:** model approval/override/exception as durable decisions with authority and revocation/expiry semantics.
- **PROVIDERIZE:** keep audit storage, cryptographic transparency and external assessor mechanisms behind provider bindings while preserving portable evidence semantics.
- **INTEGRATE:** compose authorization, extension admission and remediation authority by reference; Governance must not absorb their semantic ownership.
- **DO_NOT_BUILD:** do not invent a universal regulatory framework engine or promise universal immutability/compliance certification.

## Repository-validation questions
1. Which existing contracts already distinguish policy revision, decision, evidence and enforcement result?
2. Are approval/exception records durable identities or incidental fields/events?
3. Can evidence carry tenant/data/actor/resource scope and observation/verification time independently?
4. Is audit retention/provider configuration separable from semantic audit-event identity?
5. Are redaction/minimization transformations lineage-preserving?
6. Can a generated runtime verify/export governance evidence without a live System Builder control plane?
7. Where are integrity/trust-root revisions represented, if at all?

## Symbiotic Proof
A native SB governance path and an external-provider path should be able to evaluate the same semantic control scope, emit portable decision/assessment evidence, preserve approval/exception lineage, export an audit package, and verify its integrity after provider replacement. The proof must demonstrate that business authorization remains owned by Authorization and that generated-runtime evidence remains usable without SB availability.

## Stable findings
- **G2-FINDING-GCA-11 — Policy/Control Identity, Enforcement Configuration and Decision Evidence Are Distinct.** A policy body does not uniquely determine deployed enforcement strength or a concrete decision.
- **G2-FINDING-GCA-12 — Compliance Assertion Is Subject-, Scope-, Window- and Freshness-bound Evidence.** A compliance label without assessment context cannot be a durable universal truth.
- **G2-FINDING-GCA-13 — Approval, Override and Exception Are Governed Decisions, Not Policy Mutation.** They require independent identity, authority, reason, scope, lifecycle and historical retention.
- **G2-FINDING-GCA-14 — Audit Event Occurrence, Retained Record, Custody and Integrity Verification Are Separate Evidence.** Provider retention or export cannot be conflated with occurrence or cryptographic verification.
- **G2-FINDING-GCA-15 — Tamper-evident Claims Require Coverage Interval and Trust/Verification Context.** Append-only/digest mechanisms can have gaps and trust dependencies; `immutable` alone is insufficient.
- **G2-FINDING-GCA-16 — Redaction/Minimization Is an Evidence Transformation Requiring Lineage.** Sanitized evidence must remain attributable to source evidence and governing authority without exposing removed material.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-COMPLIANCE-ASSERTION-FRESHNESS-EVIDENCE` — CROSS_CUTTING; promote only if Security/Provider/Lifecycle synthesis confirms reuse beyond Governance.
- `G2-CAPABILITY-CANDIDATE-EVIDENCE-CUSTODY-INTEGRITY-VERIFICATION-LINEAGE` — CROSS_CUTTING; promote only if Artifact/Storage/Observability synthesis confirms a common evidence primitive rather than Governance ownership.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-EXCEPTION-OVERRIDE-LIFECYCLE` — CROSS_CUTTING; promote only if Authorization/AI/Extension synthesis confirms shared exception semantics without duplicating authority ownership.

## Value / risk / priority / next question
**Value:** high — provides the evidence semantics needed for trustworthy autonomous generation and provider replacement. **Risk:** high if governance becomes a catch-all authorization/audit subsystem or if cryptographic/provider guarantees are overstated. **Priority:** foundational cross-cutting input to synthesis. **Next question:** how Secrets / Configuration / Environment Portability represents secret identity, binding, rotation, disclosure authority and evidence without leaking secret material into governance/audit records.

## Saturation assessment
Revisit 1 produced six material architectural findings. Principal representatives are `DEEP`, but `consecutive_no_material_finding = 0`; therefore this capability is **NOT SATURATED**.