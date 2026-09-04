# Generation 2 — Developer / Operator Experience / Self-hosting Edge-Case Register

Status: ACTIVE RESEARCH
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 1
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Canonical distinctions preserved: operator workflow state != underlying capability truth; installer/CLI success != runtime/business convergence; support bundle != complete/current evidence; backup existence != qualified recovery; self-hosted/local admin privilege != canonical authorization; docs/runbook revision != runtime/toolchain revision; provider/toolchain ID != canonical identity; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; `UNKNOWN -> reconcile-before-retry`; `Enterprise → Station → Role → Person`; AI/AGWS cannot amplify authority.

## Evidence ledger

1. Planning A defines Developer / Operator Experience / Self-hosting as the portable human-facing workflow owner over bootstrap, install, diagnostics, maintenance, upgrade, support, backup/restore, disconnected operation and provider/config portability. It explicitly denies this capability ownership of runtime, release, security, observability, recovery, provider or authorization truth.
2. Planning B on fresh main (`d8760c7f08757bb164a758ae0c3f0a4a1752464b`) evidences a disciplined versioned `FactoryOperatorBootstrap`, fail-closed prerequisites, canonical identity/provenance in progress, actionable diagnostics, local generated-runtime autonomy and startup/health diagnostics. It does not evidence generalized operational profiles, typed `PARTIAL/INCONCLUSIVE` evidence, `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN` administrative effects, support-bundle qualification, air-gap currentness, generalized upgrade/recovery UX or the complete Enterprise→Station→Role→Person administrative hierarchy.
3. Kubernetes documents explicit version-skew constraints and upgrade ordering across API server, kubelet, kube-proxy, controllers and kubectl. Portable consequence: individually supported component/tool versions do not imply that an arbitrary mixed operator/runtime revision vector is supported. Source: https://kubernetes.io/releases/version-skew-policy/ (accessed 2026-09-04).
4. NIST SP 800-34 Rev. 1 treats contingency recovery as a strategy requiring planning plus testing/training/exercises; backup/recovery mechanisms are not equivalent to a currently validated recovered service. Source: https://www.nist.gov/publications/contingency-planning-guide-federal-information-systems (accessed 2026-09-04).
5. GitLab self-managed diagnostics documentation warns that troubleshooting commands can cause data loss or other damage and should be used by experienced administrators. Portable consequence: diagnostic visibility/recommendation does not confer safe actuation authority. Sources: https://docs.gitlab.com/administration/troubleshooting/ and https://docs.gitlab.com/administration/troubleshooting/diagnostics_tools/ (accessed 2026-09-04).
6. Docker air-gapped container documentation shows that apparently isolated operation still depends on explicit policy coverage and configured image/runtime network paths; some traffic paths can remain outside a configured restriction unless included. Portable consequence: an air-gapped/self-hosted label is not proof of complete retained closure or policy coverage. Source: https://docs.docker.com/enterprise/security/hardened-desktop/air-gapped-containers (accessed 2026-09-04).

Portable conclusion: operator workflows can each be locally correct while the composed operational procedure is unsafe or misleading because tool/docs/runtime revisions, evidence coverage, authority, provider cohorts, offline horizons, recovery eligibility or mutation effects are misaligned.

## Local material edge cases

### G2-EDGE-DEVOPS-001 — bootstrap/install/upgrade/runbook revision skew presents an unsupported procedure as current
- Activation: CLI, installer, docs/runbook, runtime, release, schema/configuration, provider binding or trust material are on different revisions; each artifact is individually valid in some supported context.
- Expected safe behavior: operator workflow declares and checks a revision/support vector before mutation; unsupported or unknown combinations remain `INCONCLUSIVE` or blocked pending qualification.
- Forbidden behavior: latest docs or a successful CLI invocation is assumed compatible with the effective runtime/profile solely because each component is independently supported.
- Effect/failure disposition: `SUPPORTED | UNSUPPORTED | INCONCLUSIVE`; mutating transition remains unattempted when required compatibility is unknown.
- Owners: Developer/Operator Experience + Lifecycle + affected owner(s) + Provider/Binding where applicable.
- Evidence/currentness: workflow/runbook revision, CLI/installer version, runtime/release/schema/config/provider/trust revision vector, current support evidence.
- Recovery/future route: route concrete skew to version/support qualification; preserve producing revisions and do not rewrite history.
- Blast radius: host→system. Severity: HIGH. Confidence: strongly supported. Detectability: static/pre-execution. Reversibility: bounded if caught before mutation. Time-to-harm: immediate. Misuse likelihood: likely.
- Proof obligation: an operator procedure cannot claim current applicability without qualifying the revision vector it acts upon.

### G2-EDGE-DEVOPS-002 — partial, redacted, stale or failed diagnostics/support bundle is presented as complete evidence
- Activation: log/metric collection fails, privacy redaction removes fields, host is offline, collection scope is partial, provider API is stale/unavailable, or bundle generation truncates under size/resource pressure.
- Expected safe behavior: bundle records requested versus collected scope, failures, redactions/minimization, producing revisions, currentness horizon and `COMPLETE | PARTIAL | INCONCLUSIVE` disposition.
- Forbidden behavior: absence from a support bundle is interpreted as absence in the system, or a generated archive is treated as current/complete evidence by default.
- Effect/failure disposition: diagnostic claim inherits bundle coverage/currentness and may remain `PARTIAL/INCONCLUSIVE`.
- Owners: Developer/Operator Experience + Observability + Privacy/Data Governance + relevant evidence owner.
- Evidence/currentness: target population, collection timestamps, failures, redaction manifest, source revisions, bundle integrity/provenance.
- Recovery/future route: recollect/reconcile missing evidence under authority; route sensitive-data exposure separately.
- Blast radius: incident→enterprise/external support party. Severity: CRITICAL. Confidence: strongly supported. Detectability: collection/post-effect. Reversibility: disclosure may be irreversible. Time-to-harm: immediate/latent. Misuse likelihood: likely.
- Proof obligation: `support bundle exists != evidence complete/current/safe to disclose`.

### G2-EDGE-DEVOPS-003 — operator-visible health or successful command is promoted to runtime/business/security convergence
- Activation: installer exits 0, service process exists, readiness probe passes, dashboard is green, repair command returns success, or provider ACK is received while dependent domain/security/recovery postconditions are stale, partial or unknown.
- Expected safe behavior: UX displays owner-qualified claims separately and preserves `PARTIAL/UNKNOWN/INCONCLUSIVE` until effective/converged/validated postconditions are established.
- Forbidden behavior: command success, process existence, a single health probe or provider acknowledgement proves system-wide readiness, recovery, security or business convergence.
- Effect/failure disposition: operator workflow may be complete while underlying owner state remains non-converged.
- Owners: Developer/Operator Experience + Deployment/Runtime + Security/Recovery + relevant domain owner.
- Evidence/currentness: attempted/accepted/effective/converged lineage, monitored subject/revision, residual cohorts and owner-specific postconditions.
- Recovery/future route: reconcile owner-specific truth before declaring completion or resuming dependent work.
- Blast radius: service→enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: runtime/post-effect. Reversibility: potentially difficult after unsafe resumption. Time-to-harm: immediate. Misuse likelihood: likely.
- Proof obligation: operator-facing success cannot manufacture underlying semantic convergence.

### G2-EDGE-DEVOPS-004 — self-hosted or air-gapped profile outlives its qualified retained closure/currentness horizon
- Activation: disconnected operation continues after trust, policy, entitlement, artifact, dependency, revocation, provider-support or schema/config evidence expires or becomes unverifiable; hidden external/toolchain dependencies were not retained.
- Expected safe behavior: profile declares retained closure plus per-dependency currentness horizons and degrades/fails closed where superior constraints cannot be requalified; reconnection requires reconciliation before promotion to current enterprise truth.
- Forbidden behavior: `self-hosted`, `local`, or `air-gapped` implies indefinite autonomy, complete policy coverage or permission to bypass stale trust/authority/evidence.
- Effect/failure disposition: `QUALIFIED_OFFLINE | DEGRADED | INCONCLUSIVE | BLOCKED` based on explicit closure evidence.
- Owners: Developer/Operator Experience + Security/Recovery + Trust/PKI + Authorization/Governance + Build/Artifact + Provider/Binding.
- Evidence/currentness: retained dependency manifest, artifact/provenance/trust/policy revisions, expiry/revocation horizons, unresolved local mutations and external dependency inventory.
- Recovery/future route: reconcile imported/current enterprise evidence and residual local state before normal operation resumes.
- Blast radius: Station→enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-disconnect/runtime/reconnect. Reversibility: migration/reconciliation may be required. Time-to-harm: delayed/latent. Misuse likelihood: plausible.
- Proof obligation: offline autonomy is bounded by explicit retained closure and evidence/currentness, not topology labels.

### G2-EDGE-DEVOPS-005 — backup/restore or rollback runbook is executable but no longer recovery-qualified
- Activation: backup exists but keys/secrets/trust/schema/release/provider compatibility changed; restore procedure targets obsolete topology; rollback code exists but data/config/provider state cannot be safely restored; recovery instructions are stale.
- Expected safe behavior: runbook distinguishes backup identity, restore eligibility, actuation, recovered-state validation and reprotection; eligibility is requalified immediately before action.
- Forbidden behavior: retained backup, old rollback instructions or a completed restore command proves recoverability or safe recovered service.
- Effect/failure disposition: `ELIGIBLE | INELIGIBLE | INCONCLUSIVE`; post-restore remains unvalidated until data/runtime/security owners qualify it.
- Owners: Developer/Operator Experience + Security/Recovery + Data/Schema + Storage + Artifact/Release + Deployment/Runtime + Secrets/Trust.
- Evidence/currentness: recovery point identity, compatibility vector, keys/trust/config availability, residual cohorts, validated restore evidence.
- Recovery/future route: route to recovery qualification and bounded reconciliation; no remediation implementation prescribed.
- Blast radius: system→enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-execution/post-effect. Reversibility: potentially irreversible if stale recovery overwrites newer truth. Time-to-harm: immediate. Misuse likelihood: likely.
- Proof obligation: `backup/runbook exists != recovery currently eligible or validated`.

### G2-EDGE-DEVOPS-006 — ambiguous administrative mutation is retried while maintenance/upgrade/recovery races continue
- Activation: timeout or transport failure follows a mutating admin action; operator or generated runbook retries while another actor upgrades, restores, rotates configuration, changes provider binding or changes authority.
- Expected safe behavior: effect is classified `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN`; `UNKNOWN` requires reconciliation and current authority/revision requalification before retry unless idempotency is explicitly qualified for the same semantic operation/revision.
- Forbidden behavior: transport failure implies `NOT_APPLIED`, or a previous safe retry policy survives changed revisions/authority/concurrent maintenance automatically.
- Effect/failure disposition: `UNKNOWN` blocks unsafe retry; concurrent state may require supersession or human reconciliation.
- Owners: Developer/Operator Experience + owning mutating capability + Lifecycle + Authorization + Provider/Binding.
- Evidence/currentness: operation identity/idempotency scope, target revision, provider receipts, observed postconditions, concurrent mutation lineage and current authority.
- Recovery/future route: reconcile effect first; then route to retry, supersede, compensate or human reconciliation based on owner semantics.
- Blast radius: host→enterprise/external systems. Severity: CRITICAL. Confidence: strongly supported. Detectability: runtime/post-effect. Reversibility: potentially irreversible. Time-to-harm: immediate. Misuse likelihood: likely.
- Proof obligation: ambiguous administrative mutation cannot be automatically retried across changed authority/revision/coexistence state.

### G2-EDGE-DEVOPS-007 — residual agents/toolchains plus generated operational guidance amplify authority, leak data or exhaust resources
- Activation: provider/toolchain substitution leaves old agents/daemons/configurations active; broad local/root credentials remain; AI/low-code generates repair loops or support collection with unbounded fan-out/log volume; two valid instructions conflict or suppress a mandatory control.
- Expected safe behavior: residual cohorts remain explicit until drained/withdrawn; actuation re-evaluates `Enterprise → Station → Role → Person`; generated guidance is recommendation, not authority; collection/action graphs have bounded scope/resource and privacy qualification.
- Forbidden behavior: local root/provider credential equals canonical business authority; stale agent can still produce authoritative effects silently; AI/runbook loops retry/collect indefinitely or suppress mandatory controls for convenience.
- Effect/failure disposition: `DENY | PARTIAL | INCONCLUSIVE` where authority/privacy/resource qualification is insufficient; ambiguous mutation remains `UNKNOWN` until reconciled.
- Owners: Developer/Operator Experience + Provider/Binding + Authorization + Security + Privacy + Observability + FinOps + AI/AGWS authority owner.
- Evidence/currentness: active agent/toolchain/provider cohort inventory, credential scope, current grants/policy, generated instruction graph, collection scope/cardinality/resource budget and effect ledger.
- Recovery/future route: route residual cohorts to controlled withdrawal; route concrete instruction conflict to owner reconciliation; quarantine/stop unsafe automation when observed under authorized operational controls.
- Blast radius: host→enterprise/external parties. Severity: CRITICAL. Confidence: strongly supported. Detectability: design-time/pre-execution/runtime. Reversibility: disclosure/external actuation may be irreversible. Time-to-harm: immediate/cumulative. Misuse likelihood: likely/adversarial.
- Proof obligation: operational convenience, provider credentials and AI-generated procedures cannot create broader authority or silently preserve obsolete authoritative cohorts.

## Reusable processual / semantic conflict patterns

### G2-CONFLICT-PATTERN-OPERATOR-REVISION-001 — individually valid operator artifacts form an unsupported revision vector
- Family: version/migration / temporal / human-procedure / provider.
- Activation conditions: docs/runbook, CLI/installer, runtime, schema/config, provider binding or trust material are individually valid but not jointly qualified.
- Incompatible claims/actions/states: each component claims local support; the composed procedure assumes compatibility/order that the joint support contract does not establish.
- Why local validation may miss it: each artifact validates only its own version/interface and cannot prove the N-wise operational vector.
- Detection candidate: static/pre-execution revision-vector and support-vector qualification before operator mutation.
- Owner set: Developer/Operator Experience + Lifecycle + affected semantic owners + Provider/Binding.
- Severity: HIGH; confidence: strongly supported; detectability: static/pre-execution; blast radius: host→system; reversibility: bounded before mutation, migration may be required after; time-to-harm: immediate; misuse likelihood: likely; evidence currentness: current support evidence required.
- False-positive risk: explicitly supported skew/coexistence is legitimate; detector must test declared compatibility rather than require exact version equality.
- Future remediation disposition: catalogue and route observed vectors to pin/upgrade/migrate/acknowledge only under owner-qualified support; no universal version lockstep imposed.
- Proof obligation: locally supported revisions cannot be assumed compositionally supported.

### G2-CONFLICT-PATTERN-OPERATOR-EVIDENCE-001 — valid diagnostic/support evidence conflicts with a broader completeness/currentness claim
- Family: data/consistency / semantic ownership / privacy / observability.
- Activation conditions: bundle/query is correctly generated from available sources while collection failure, redaction, stale provider evidence, offline host or truncation excludes a material cohort.
- Incompatible claims/actions/states: diagnostic subsystem truthfully reports collected evidence; operator/business conclusion assumes complete/current evidence for a larger scope.
- Why local validation may miss it: bundle generator can prove archive integrity without proving source completeness or safe disclosure.
- Detection candidate: collection/post-effect comparison of requested population, collected population, failures/redactions/currentness and claim scope.
- Owner set: Developer/Operator Experience + Observability + Privacy + source semantic owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: runtime/post-effect; blast radius: incident→enterprise/external parties; reversibility: bounded for false diagnosis, disclosure may be irreversible; time-to-harm: immediate/latent; misuse likelihood: likely; evidence currentness: current/explicit horizon required.
- False-positive risk: deliberately scoped/redacted bundles are valid when the downstream claim preserves that scope; detector must not demand universal completeness.
- Future remediation disposition: catalogue and route to recollection, narrower claim, authorized disclosure or human reconciliation.
- Proof obligation: archive integrity and successful collection cannot self-promote to completeness/currentness.

### G2-CONFLICT-PATTERN-ADMIN-EFFECT-001 — safe local retry guidance conflicts with ambiguous or concurrently changed administrative state
- Family: state-transition / temporal / recovery / authority / provider.
- Activation conditions: admin mutation returns transport error/timeout or partial evidence; meanwhile upgrade, recovery, provider cutover, config change or authority revision occurs.
- Incompatible claims/actions/states: operator/runbook says retry is safe based on original request; current owner state no longer proves original effect disposition, idempotency scope or authority.
- Why local validation may miss it: command wrapper can validate syntax and retry policy but not whether the first mutation applied or whether the semantic target changed.
- Detection candidate: runtime/post-effect reconciliation of operation identity, provider receipts, target postconditions, revision vector and current authorization before retry.
- Owner set: Developer/Operator Experience + mutating capability owner + Lifecycle + Authorization + Provider/Binding.
- Severity: CRITICAL; confidence: strongly supported; detectability: runtime/post-effect; blast radius: system→external parties; reversibility: potentially irreversible; time-to-harm: immediate; misuse likelihood: likely; evidence currentness: current required.
- False-positive risk: explicitly qualified idempotent operations within unchanged semantic/revision scope can be retried safely; detector must preserve those legitimate contracts.
- Future remediation disposition: `UNKNOWN -> reconcile-before-retry`; then route to retry/supersede/compensate/human reconciliation according to owner semantics.
- Proof obligation: retry safety is scoped to effect evidence, identity, revision and authority—not transport behavior alone.

### G2-CONFLICT-PATTERN-LOCAL-ADMIN-AUTHORITY-001 — effective host/provider privilege conflicts with canonical organizational authority
- Family: authority/responsibility/SoD / human-procedure / AI-low-code / provider.
- Activation conditions: self-hosted operator holds root/admin/provider credentials, residual old agent remains privileged, or AI/generated runbook proposes an administratively possible action after enterprise/station/role policy changed.
- Incompatible claims/actions/states: host/provider says action is technically permitted; canonical authorization/governance says actor/automation lacks current business authority or required separation-of-duty.
- Why local validation may miss it: operating system/provider authorization sees local credentials, not the complete organizational authority/policy chain.
- Detection candidate: pre-actuation `Enterprise → Station → Role → Person` re-evaluation plus residual-cohort/provider-credential classification and SoD check.
- Owner set: Authorization/Policy + Developer/Operator Experience + Security + Provider/Binding + Governance; AI/AGWS authority owner where generated guidance exists.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-execution/runtime/audit; blast radius: Station→enterprise/external parties; reversibility: potentially irreversible; time-to-harm: immediate; misuse likelihood: likely/adversarial; evidence currentness: current authority mandatory.
- False-positive risk: some emergency/break-glass procedures intentionally elevate local capabilities; detector must recognize explicit authorized exception scope rather than reject all privileged administration.
- Future remediation disposition: catalogue and route observed conflict to current authority/exception qualification; generated guidance remains recommendation until authorized actuation.
- Proof obligation: `technically possible/local admin == canonical authorized` is forbidden without explicit governed authority.

## Cluster deepening

No 13th mandatory cluster is introduced. Findings materially deepen:

- Build × Artifact/Release × Deployment × Runtime — revision-vector and operator-procedure skew can make an otherwise valid rollout path unsupported.
- Provider/Binding × external realizations — self-hosted/provider tooling, residual agents and ambiguous administrative effects must preserve provider identity/cohort/effect qualification.
- Secrets/Config × Runtime × Provider substitution — offline/currentness, residual configuration/agents and recovery procedures cross credential/config/provider epochs.
- Observability × Security/Recovery × runtime truth — support evidence and operator-visible health cannot replace protected/runtime/domain convergence or recovery qualification.
- Identity × Authorization × Station × AGWS × AI — local/root/provider privilege and generated instructions cannot amplify canonical authority.

All affected mandatory-cluster no-material streaks remain `0` because this visit produced material findings.

## Saturation disposition

- local material findings this visit: 7 edge scenarios + 4 reusable ConflictPatterns;
- local no-material streak: 0;
- HIGH/CRITICAL without owner, proof obligation or detection route: 0;
- no `ConflictInstance` asserted;
- no preventive implementation or Work Package created;
- no bounded Planning-A backfill required: all findings have existing semantic owners and reusable primitives;
- Full Pass 1 remains incomplete until all 28 capabilities are challenged;
- Planning C remains blocked until adversarial status is `CLOSED / SATURATED / PASS`.
