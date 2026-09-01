# Generation 2 Research — Governance / Compliance / Audit

## Research question
What portable governance primitives should System Builder own so generated systems can express, enforce, inspect and export policy/control/audit evidence without confusing provider-specific enforcement, authorization, compliance frameworks or runtime authority?

## Representatives and evidence/source ledger

| Representative | Role in comparison | Source-of-truth evidence |
|---|---|---|
| Open Policy Agent / Gatekeeper model | Policy-as-code and externalized decision/enforcement boundary | OPA policy/data/decision model and decision-log architecture; enforcement remains an integration concern rather than policy evaluation itself. |
| Kyverno | Preventive admission plus detective/background policy evaluation | Current PolicyReport documentation distinguishes admission blocking from reports over current resources and documents background scans. |
| AWS CloudTrail + Audit Manager | Audit-event source plus control-to-evidence mapping | Audit Manager maps controls to CloudTrail/Config/Security Hub/API/manual evidence and explicitly has incomplete source coverage. |
| Azure Policy | Declarative governance, compliance state, remediation and exemptions | Azure Policy model separates assignment/evaluation/compliance/remediation and exemptions rather than treating compliance as authorization. |
| OpenFGA | Version-pinned policy/authorization authority contrast | Authorization models are immutable versions and production requests are recommended to pin model ID. |

## Source of truth and identity
Governance has multiple authorities, not one global truth. A policy/control definition and revision state what should be evaluated; an enforcement point owns whether a preventive action is actually blocked; an evidence source owns observed facts; a compliance assessment maps evidence to a control/framework; an exception/waiver changes applicable governance under explicit authority. These identities must remain distinct: `policy/control -> revision -> assignment/scope -> evaluation -> enforcement/evidence -> assessment -> exception`.

## Lifecycle and versioning
Policies and controls require immutable or reconstructable revision identity, explicit activation/assignment, supersession and retirement. OpenFGA is a useful strong contrast because models are immutable and clients can pin a model ID. Compliance frameworks and mappings evolve independently of runtime policy revisions, so framework version must not silently redefine historical evidence. Exceptions need their own issuer, scope, justification, validity interval and lifecycle.

## Failure semantics
Governance failure is not a single fail/pass. Evaluation can be PASS, FAIL, ERROR, UNKNOWN/INCONCLUSIVE or NOT_APPLICABLE; enforcement can separately ALLOW/BLOCK/WARN/MUTATE/REMEDIATE depending on the enforcement point. Missing evidence must not be interpreted as compliance. AWS Audit Manager explicitly documents inconclusive evidence and source limitations; Kyverno reports cover current resources while blocked admission requires separate evidence. Provider/evaluator outage therefore requires explicit fail-open/fail-closed/defer semantics owned by the enforcement contract.

## Extensibility and provider boundaries
System Builder should own portable policy/control/evidence contracts and provider bindings, not reproduce every policy engine or compliance catalog. OPA, Kyverno, Azure Policy and cloud audit systems are external/native providers with different enforcement and evidence capabilities. Provider-specific predicates, admission hooks, remediation actions and framework catalogs remain provider extensions unless a stable universal primitive emerges.

## Governance, observability and audit
Audit evidence must carry actor/authority context, operation/resource identity, policy/control revision where applicable, time, outcome and provenance. Audit is not ordinary telemetry: retention, tamper evidence, privacy/redaction, access and export obligations can be stronger. Observability can expose policy-engine health and evaluation metrics, but metrics do not replace durable audit evidence.

## Portability and lock-in
Portable governance requires provider-neutral logical policy/control identity, revision, scope, evaluation outcome, evidence reference/provenance, exception semantics and framework mapping. Provider-native rule language can remain bound behind a provider contract. A generated runtime must remain operable when the Builder is absent and must be able to retain/export governance evidence or rebind governance providers without changing logical governance identity.

## Product-specific mechanism vs universal primitive
Universal candidates: policy/control identity and revision; assignment/scope; evaluation result; enforcement mode; evidence reference with provenance; exception/waiver; control-to-framework mapping; retention/privacy classification; authority context. Product/provider-specific mechanisms: Kubernetes admission, Kyverno mutation/generation, Azure remediation jobs, CloudTrail event classes, Audit Manager framework catalogs and OpenFGA tuple/model storage.

## Convergent patterns
1. Policy definition and policy evaluation are distinct.
2. Preventive enforcement and detective assessment are distinct.
3. Evidence is scoped and provenance-bearing; evidence absence is meaningful.
4. Historical decisions require the policy/model revision that governed them.
5. Compliance is a mapping/assessment over controls and evidence, not equivalent to runtime authorization.
6. Exceptions are governed objects, not comments or disabled rules.

## Divergent patterns
OPA externalizes evaluation and leaves enforcement to hosts; Kyverno combines Kubernetes-native enforcement/reporting; Azure Policy couples governance to Azure resource state/remediation; AWS Audit Manager centers evidence collection and audit assessment; OpenFGA is authorization-specific and intentionally narrower than compliance governance. Generation 2 must preserve these differences rather than inventing a universal executable policy language.

## Subcapabilities
- Policy/control definition and revision
- Assignment/scope and delegated governance
- Preventive enforcement contract
- Detective evaluation/compliance state
- Audit-event/evidence capture and provenance
- Control/evidence/framework mapping
- Exception/waiver lifecycle
- Remediation authorization/evidence
- Retention/privacy/tamper-evidence policy
- Governance provider binding and capability negotiation

## Bounded comparison with fresh main
A bounded default-branch search for governance/audit/compliance/policy evidence did not establish a dedicated governance/compliance/audit subsystem in this pass. Existing Generation 2 findings already identify authorization-decision evidence and policy-model version binding as candidates, but research-branch artifacts are not product truth. Therefore no implementation claim is made. Repository archaeology must later inspect contracts/tests for authority/evidence primitives and distinguish generic provenance from governance-specific evidence.

## Reconciliation hypotheses
- **KEEP** existing provider-neutral authority/provenance primitives where fresh-main archaeology proves them.
- **HARDEN** decision/evidence records with governing revision, actor/authority, completeness and failure semantics.
- **GENERALIZE** policy/control/evidence identity only where multiple domains share semantics.
- **PROVIDERIZE** executable policy languages, enforcement hooks, compliance catalogs and remediation engines.
- **INTEGRATE** mature external governance/audit providers rather than cloning them.
- **DO_NOT_BUILD** a universal compliance certification oracle or universal executable policy DSL.
- **DEFER** framework-specific control libraries until product/domain demand exists.

## Questions for repository validation
1. Which current contracts already carry actor, authority, decision and provenance identity?
2. Are policy revisions pinned in authorization/deployment evidence or inferred from mutable latest state?
3. Is audit evidence durable and exportable, or only logs/telemetry?
4. Can provider bindings express enforcement mode and fail-open/fail-closed behavior?
5. Are exception/waiver semantics present anywhere in current governance flows?
6. Does runtime autonomy preserve evidence when the Builder/control plane is unavailable?

## Symbiotic Proof
A Generation 2 proof should bind the same logical control to at least one native path and one external policy/evidence provider; evaluate it under a pinned revision; show preventive and detective outcomes as distinct evidence; introduce a time-bounded waiver; replace the external provider without changing logical control identity; export the resulting evidence package; and continue runtime enforcement/evidence generation without the Builder online.

## Stable findings
- **G2-FINDING-GOV-01 — Policy/Control Identity, Revision, Assignment and Evaluation Are Distinct Identities.** Value HIGH; risk HIGH; priority P0. Next: prove current SB revision binding.
- **G2-FINDING-GOV-02 — Preventive Enforcement and Detective Compliance Are Distinct Capabilities.** Value HIGH; risk HIGH; priority P0. Next: model enforcement/evaluation boundary.
- **G2-FINDING-GOV-03 — Evidence Absence or Inconclusive Evidence Must Never Imply Compliance.** Value HIGH; risk HIGH; priority P0. Next: define evidence completeness semantics.
- **G2-FINDING-GOV-04 — Audit Evidence Requires Actor, Authority, Operation, Outcome and Provenance Context.** Value HIGH; risk HIGH; priority P0. Next: compare with current evidence envelopes.
- **G2-FINDING-GOV-05 — Compliance Framework Mapping Is Separate from Runtime Policy Authority.** Value HIGH; risk MEDIUM; priority P1. Next: keep framework mappings versioned and externalizable.
- **G2-FINDING-GOV-06 — Exceptions/Waivers Are First-Class Governed Objects with Scope and Expiry.** Value HIGH; risk HIGH; priority P0. Next: validate absence/presence in repo.
- **G2-FINDING-GOV-07 — Enforcement Failure Semantics Must Be Explicit and Provider-Bound.** Value HIGH; risk HIGH; priority P0. Next: qualify fail-open/fail-closed/defer behavior.
- **G2-FINDING-GOV-08 — Remediation Authority Is Separate from Detection Evidence.** Value HIGH; risk HIGH; priority P1. Next: align with operator/action authority findings.
- **G2-FINDING-GOV-09 — Audit Retention, Privacy and Tamper Evidence Are Governance Properties, Not Generic Logging Defaults.** Value HIGH; risk HIGH; priority P1. Next: reconcile storage/security lifecycle.
- **G2-FINDING-GOV-10 — Runtime Autonomy Requires Portable Governance Bindings and Exportable Governance Evidence.** Value HIGH; risk HIGH; priority P0. Next: include in symbiotic runtime proof.

## Saturation status
First deep pass complete; **NOT SATURATED**. Revisit after Secrets, Provider/Binding, Lifecycle and Security passes. Remaining material questions include policy-language portability limits, delegated governance, evidence tamper models, waiver authority, privacy/retention and concrete SB archaeology.
