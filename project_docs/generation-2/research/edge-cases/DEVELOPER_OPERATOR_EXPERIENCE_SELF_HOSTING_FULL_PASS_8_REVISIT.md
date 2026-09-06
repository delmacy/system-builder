# Generation 2 — Developer / Operator Experience / Self-hosting — Full Pass 8 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 8
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Scope and authority

This revisit follows `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, the Full-Pass-7 Developer/Operator revisit, the standing 124-ConflictPattern inventory, `OPERABILITY_ELICITATION_LENS_RESEARCH.md`, Elicitation/System Understanding research, Legacy Mirroring, Autonomous Builds/Fleet, temporal/uncertainty, queue/capacity, causality research-only and the Physical/Peripheral integration-plane boundary.

Research only. No product code, Work Package, TASK, Construction, remediation, target architecture or preventive guard is authorized.

Preserved distinctions include:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `feature completeness != Production Readiness Coverage != runtime health != business convergence`;
- `install success != operable system != recoverable system != supportable system`;
- `backup exists != restore eligible != restore executed != restored service != business convergence`;
- `runbook exists != runbook current != runbook applicable != action authorized`;
- `self-hosted != disconnected-operable`;
- `operator-visible health != effective/runtime truth`;
- `local evidence != exported telemetry != Fleet aggregate != control authority`;
- `external provider state != canonical authority != physical truth`;
- `observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`;
- `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` remain distinct.

## Full-Pass-8 techniques

This pass intentionally differs from Full Pass 7.

1. **Revision-vector cut analysis** — independently mutate application, data/schema, operator tooling, runtime, provider and external-system revisions while preserving individually valid components.
2. **Procedure precondition subtraction** — remove one hidden environmental/runbook precondition and test whether procedure success is still overclaimed.
3. **Recovery-set subtraction** — remove secrets, object/external stores, identity-origin constraints, provider data or topology from otherwise green backup evidence.
4. **Disconnected dependency graph closure** — cut internet/provider reachability and trace package/image/signature/schema/license/trust/update dependencies required for install, upgrade, recovery and ongoing operation.
5. **Maintenance-vs-business queue superposition** — overlay upgrade, mirror, restore, reindex, support capture and reconciliation work on business queues to test headroom/stability claims.
6. **Operator-state epistemic mutation** — vary what dashboard, local journal, support bundle and Fleet can see while runtime/effect truth changes independently.
7. **Ownership graph deletion** — keep alert/metric/runbook evidence but remove or conflict the responsible operator, provider owner, escalation or action authority.
8. **Readiness-dimension false-NA** — mark one Production Readiness dimension `NA/RESOLVED` without supporting scope/evidence and test publish-readiness claims.
9. **Brownfield procedure assimilation falsification** — treat an observed legacy install/recovery habit as approved/current procedure, then mutate provider/version/environment assumptions.
10. **Physical/Peripheral diagnostic boundary mutation** — expose VMS/BMS/access/PDV/device health and mappings while withholding remote actuation authority and physical-truth guarantees.
11. **Causal/AI non-strengthening** — allow correlation, operator notes and AI synthesis but prohibit promotion into causal proof, current authority or safe-action proof.
12. **Full 124-pattern duplicate screen** — candidate semantics were reduced against the complete reusable pattern authority before any new ID consideration.

## Fresh external evidence differential

### Upgrade support is a vector relation with ordering constraints

Kubernetes' current Version Skew Policy defines different allowed skews between API server, kubelet, kube-proxy and control-plane components, and derives supported upgrade order from those relations. A component may be supported individually while a composed revision vector or upgrade sequence is not. Portable consequence: operator elicitation needs the concrete revision vector, dependency topology, preconditions and ordering; `latest` or `supported` is insufficient as a scalar state.

Source: Kubernetes, `Version Skew Policy`, https://kubernetes.io/releases/version-skew-policy/ (accessed 2026-09-06).

### Backup success remains weaker than restore eligibility

GitLab requires restore to the exact same version/type, requires restoration of secrets, and notes object-storage/external handling that is not covered simply by a successful backup command. Its rollback procedure likewise requires version-qualified backup evidence because database schema must be reverted together with software. Portable consequence: recovery proof must qualify version, secrets/config, external stores, topology and post-restore convergence.

Sources: GitLab, `Restore GitLab`, https://docs.gitlab.com/administration/backup_restore/restore_gitlab/; `Back up GitLab`, https://docs.gitlab.com/administration/backup_restore/backup_gitlab/; `Roll back to earlier GitLab versions`, https://docs.gitlab.com/update/package/downgrade/ (accessed 2026-09-06).

### Disconnected operation requires explicit dependency closure and mirror availability

OpenShift disconnected-environment guidance requires mirroring required release/catalog content before installation and warns that the mirror registry must remain reachable/available for installation, update and normal operations such as workload relocation. It also notes that missing release signatures can block upgrade verification. Portable consequence: `self-hosted` or `locally deployed` cannot imply air-gap operability; artifact, signature, registry, update, recovery and operational dependencies must be elicited and qualified.

Source: Red Hat OpenShift Container Platform 4.21, `Disconnected environments`, https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html-single/disconnected_environments/index (accessed 2026-09-06).

### Production readiness is broader than functional installation

Google SRE production launch planning treats launch readiness as a maintained operational practice, scaled to risk and involving explicit launch/checklist concerns rather than mere feature completion. Portable consequence: the candidate `Production Readiness Coverage` remains a separate multidimensional projection, not a feature-completeness or installation-success score.

Source: Google SRE, `Creating a Production Launch Plan`, https://sre.google/resources/practices-and-processes/production-launch-planning/ (accessed 2026-09-06).

## Candidate findings — duplicate-screened

### Candidate A — supported components form an unsupported operational revision vector

Activation: application, runtime, operator tooling, schema or provider components are individually supported but their combination/order violates a qualified compatibility relation.

Conflict: local support claims versus composed upgrade/operation safety.

Detection candidates: revision-vector identity, compatibility direction, ordering/preconditions, residual cohorts, rollback eligibility and current runbook provenance.

Duplicate-screen: compatibility-direction, version/coexistence, currentness and human-procedure families. **No new ConflictPattern.**

### Candidate B — green backup/restore dashboard omits a required recovery set

Activation: backup succeeds while secrets, object/external stores, identity-origin/FQDN constraints, provider state, topology or exact target revision are absent or incompatible.

Conflict: backup presence versus recoverability/effect convergence.

Detection candidates: recovery-set manifest, restore eligibility relation, periodic executable restore proof, explicit missing/UNKNOWN components and post-restore business reconciliation.

Duplicate-screen: recovery false-safety, proof-claim conflation, presence, provider/external completeness and currentness families. **No new ConflictPattern.**

### Candidate C — self-hosted installation is falsely interpreted as disconnected operability

Activation: product runs on client infrastructure but install/update/recovery or normal relocation depends on external images, signatures, catalogs, registries, licenses, trust material or providers not closed inside the disconnected dependency graph.

Conflict: hosting location versus operational dependency closure.

Detection candidates: dependency graph with source/currentness/transport path, disconnected drill, mirrored-signature completeness, registry availability and explicit unsupported scope.

Duplicate-screen: environment portability, provider dependency/lock-in, evidence completeness, recovery and negative-space families. **No new ConflictPattern.**

### Candidate D — maintenance work consumes headroom needed by autonomous production workload

Activation: upgrade/mirror/restore/reindex/support/reconciliation bursts share CPU, I/O, network, storage or provider quota with business traffic.

Conflict: maintenance objective versus sustainable service capacity and stability margin.

Detection candidates: dimensioned pressure vectors, workload-class queues, backlog age, reserved headroom, peak assumptions, maintenance admission/abort conditions and after-change recovery evidence.

Duplicate-screen: resource/capacity, queue amplification, objective conflict, provider quota and temporal/currentness families. **No new ConflictPattern.**

### Candidate E — operator evidence is current but insufficient for the operational claim

Activation: local dashboard/support bundle is green/current but omits downstream queues, external effects, provider gaps, redacted dimensions or local-vs-Fleet disagreement needed to prove the claim.

Conflict: diagnostic/current evidence versus semantic/effect completeness.

Detection candidates: evidence profile, source/currentness/unit/context, missing/redacted markers, local journal cross-check and explicit `PARTIAL/UNKNOWN`.

Duplicate-screen: source-population completeness, proof-claim conflation, analytical-kind and currentness families. **No new ConflictPattern.**

### Candidate F — operational question is answered but nobody owns the action

Activation: alert, threshold or degradation evidence exists, but no current owner/on-call/escalation or authority-qualified runbook exists; alternatively owners conflict.

Conflict: observability versus actionable operational responsibility.

Detection candidates: alert→owner→runbook→authority→escalation graph with revision/currentness.

Duplicate-screen: ownership/responsibility, authority, human-procedure and currentness families. **No new ConflictPattern.**

### Candidate G — Physical/Peripheral diagnostics are promoted into central control authority

Activation: VMS/BMS/access/PDV/device/provider integration exposes health/mapping/state and an operator surface or AI recommendation infers direct actuation authority or physical truth.

Conflict: integration-plane observability/reconciliation versus specialized-system control plane and physical truth.

Detection candidates: explicit observe/control/change classification, site/client/provider/resource scope, source/currentness/confidence and authority proof.

Duplicate-screen: authority amplification, semantic ownership/provider-state conflation, cross-site/tenant boundary and physical-truth/currentness families. **No new ConflictPattern.**

### Candidate H — Production Readiness Coverage is green because an unsupported dimension was silently omitted

Activation: feature/install acceptance passes and one of `OBSERVABILITY`, `OWNERSHIP`, `FAILURE_HANDLING`, `RECOVERY`, `CAPACITY`, `CURRENTNESS`, `SECURITY`, `RECONCILIATION`, `CHANGE_SAFETY`, `COST`, `DOCUMENTATION` is omitted or marked `NA/RESOLVED` without evidence.

Conflict: feature completeness versus production-readiness completeness.

Detection candidates: dimension-specific state/evidence/source/owner/currentness, `NA` rationale and revision-aware invalidation; never a single authoritative scalar score.

Duplicate-screen: presence semantics, evidence/currentness, ownership, proof-claim and analytical-kind families. **No new ConflictPattern.**

## Operability Elicitation specialization

For Developer/Operator Experience and Self-hosting, candidate elicitation metadata should ask at least:

- How do we know bootstrap/install is working end-to-end rather than only that processes started?
- Which exact application/runtime/schema/provider/tool revision vector is supported, and in what upgrade order?
- Which runbook revision applies, what preconditions does it assume, and who owns it?
- What can remain `PARTIAL/UNKNOWN`, for how long, and who reconciles it?
- What is the expected and peak load during normal operation, maintenance, upgrade, backup, restore and reindex?
- Which queues/backlogs and resource dimensions expose overload before a scalar utilization average looks bad?
- Which dependencies must exist for disconnected install, update, security refresh, recovery and normal operation?
- What does backup actually cover; what exact restore target is eligible; what proves post-restore convergence?
- Which local evidence remains authoritative enough for autonomous operation when Fleet/Observe is unavailable?
- What support evidence is collected, how fresh/complete is it, what is redacted, and who may access it?
- Which alerts have an action owner, escalation and authority-qualified runbook?
- Which maintenance windows, rollback/abort gates and capacity reservations are required?
- Which actions are observe, control or change, and what client/site/provider scope applies?
- Which Physical/Peripheral diagnostics remain integration-plane only?
- How is Production Readiness Coverage represented per dimension without collapsing it into a health score?

## Duplicate-screen disposition

All eight candidates reduce into the existing 124 reusable ConflictPatterns. No material edge scenario, cross-capability scenario, ConflictPattern, ConflictInstance or preventive invariant is created in this revisit.

Inventory remains:

- material edge findings: **284**;
- reusable ConflictPatterns: **124**;
- combined material findings: **408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**.

Developer / Operator Experience / Self-hosting local no-material streak was already **2** and remains **capped at 2**; no streak inflation is allowed.

## Carry-forward

Planning C/D/E remains blocked until adversarial research reaches `CLOSED / SATURATED / PASS`. Carry forward only as research candidates: revision-vector/operator metadata, operational elicitation metadata, multidimensional Production Readiness Coverage, recovery-set/restore eligibility proof, disconnected dependency closure, queue/headroom/maintenance proofs, alert ownership/escalation, evidence currentness/completeness/privacy and explicit observe/control/change authority boundaries.

## Next rotation

Continue Full Pass 8 with **Provider / Binding / Capability Negotiation**. Challenge discovery→qualification→admission→binding, provider capability/support-scope drift, external identity/resource/grant mapping, pagination/event completeness, quota/rate-limit/backlog, bind/rebind/withdraw/cutover, residual provider cohorts, connector offline evidence, provider revision/currentness, unsupported semantic scope, cross-client/site leakage, Operability Elicitation ownership/reconciliation and Physical/Peripheral strictly as integration-observability/reconciliation plane. Duplicate-screen all 124 patterns and do not enter Planning C.
