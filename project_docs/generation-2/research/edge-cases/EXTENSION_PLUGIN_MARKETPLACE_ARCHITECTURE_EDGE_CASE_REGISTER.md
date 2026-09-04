# Generation 2 — Extension / Plugin / Marketplace Architecture — Adversarial Edge-Case Register

Status: ACTIVE / MATERIAL FINDINGS
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 1
Capability: Extension / Plugin / Marketplace Architecture
Mandatory cluster: Extension/Plugin × authority × provider trust × lifecycle
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

This register is research, not remediation. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. All new conflict patterns below remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Evidence ledger

- VS Code extension runtime security: extensions execute with the same OS-level permissions as VS Code itself; publisher trust for an extension pack/dependency can transitively trust dependent publishers. This is strong evidence that package presence/trust and effective authority/containment are distinct and that transitive composition can enlarge blast radius.
  - https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security
- VS Code Marketplace: marketplace packages are signed and VS Code verifies signatures during install. Signature verification establishes package integrity/source evidence, not semantic safety or authorization.
  - https://code.visualstudio.com/docs/configure/extensions/extension-marketplace
- npm provenance/trusted publishing: provenance gives verifiable source/build lineage but npm explicitly states that provenance does not guarantee absence of malicious code. Trusted publishing also scopes publishing authority to configured workflows.
  - https://docs.npmjs.com/generating-provenance-statements/
  - https://docs.npmjs.com/trusted-publishers/
- Terraform dependency lock file: provider packages are pinned/verified with hashes and publisher signatures across supported platforms, showing that package/provider selection and integrity are revision/platform-qualified rather than nominal-name equivalence.
  - https://developer.hashicorp.com/terraform/language/files/dependency-lock
- Backstage plugin architecture: frontend/backend plugins have explicit plugin identity/package structure and backend plugins can be isolated as separate services; this supports treating plugin identity, host attachment and isolation topology as distinct facts rather than one universal mechanism.
  - https://backstage.io/docs/frontend-system/architecture/plugins/
  - https://backstage.io/docs/next/backend-system/architecture/plugins/
- Chrome extensions: API access is permission-declared, runtime messaging crosses extension/native boundaries, and extension lifecycle/update behavior can invalidate in-memory/persistent runtime assumptions. This supports explicit requested/granted/effective authority and lifecycle currentness.
  - https://developer.chrome.com/docs/extensions/reference/
  - https://developer.chrome.com/docs/extensions/reference/api/runtime

Portable conclusion: ecosystems converge on explicit package/revision metadata, permission declarations, trust/integrity evidence, host compatibility and lifecycle hooks, while materially diverging on sandbox strength, transitive trust, update semantics and runtime authority. Therefore `installed != admitted != authorized != effective`, and provider/marketplace IDs remain non-canonical unless explicitly adopted.

## 2. Local material edge cases

### G2-EDGE-EXTENSION-001 — provider/marketplace identity leaks into canonical extension identity
- Preconditions: extension is discovered through a registry/marketplace/provider; provider-native listing/package/runtime IDs exist.
- Trigger: import, migration or provider substitution reuses an external ID as the canonical extension subject.
- Affected subjects: canonical extension identity, extension revision lineage, provider binding.
- Expected safe behavior: preserve canonical extension identity independently from package digest, listing ID, provider ID and runtime instance ID; maintain governed aliases/mappings and revision lineage.
- Forbidden behavior: provider substitution silently creates a new canonical extension or merges unrelated extensions because external IDs match.
- Effect/failure disposition: `INCONCLUSIVE` on ambiguous identity mapping; no implicit adoption.
- Owners: Extension Architecture + Provider/Binding + Lifecycle; domain owners remain separate.
- Evidence/currentness: mapping provenance, current provider generation, extension revision and adoption authority must be current/applicable.
- Recovery/reconciliation: reconcile identity mapping and lineage before activation/migration.
- Blast radius: extension fleet, persisted extension-owned state, dependent workflows.
- Severity: HIGH–CRITICAL. Misuse likelihood: plausible accidental/import-driven.
- Proof obligation: `EXTENSION-ADV-PROOF-001` — provider/marketplace substitution preserves canonical identity and rejects ambiguous external-ID adoption.

### G2-EDGE-EXTENSION-002 — install/enable lifecycle races with revision or admission change
- Preconditions: extension revision A is being installed/enabled while trust, policy, host/API revision or requested permissions change to revision B/new qualification.
- Trigger: asynchronous install/activation completes after the qualifying evidence used to start it is stale.
- Expected safe behavior: activation is qualified against the intended extension revision plus current admission/authority/host compatibility; stale qualification yields `INCONCLUSIVE` or ineligible state rather than automatic enablement.
- Forbidden behavior: successful install ACK becomes proof of current admission/effective authority.
- Effect/failure disposition: install may be `APPLIED` while enablement/admission remains `PARTIAL/INCONCLUSIVE`.
- Owners: Extension Architecture + Authorization + Trust/PKI + Lifecycle + Runtime.
- Evidence/currentness: admission decision, grant revision, host/API support vector, artifact/provenance and trust evidence.
- Recovery/reconciliation: re-read effective installation/runtime state, then requalify before enable/retry.
- Blast radius: host/process/station.
- Severity: CRITICAL. Misuse likelihood: plausible through concurrent update or stale control plane.
- Proof obligation: `EXTENSION-ADV-PROOF-002` — no lifecycle transition can promote stale admission/grant evidence to effective authority.

### G2-EDGE-EXTENSION-003 — requested/granted/effective permission drift
- Preconditions: extension manifest requests capabilities; policy grants a bounded subset; host/runtime exposes a broader reachable surface or stale grant remains cached.
- Trigger: extension execution reaches a capability not in the current granted set, including through another extension or host API.
- Expected safe behavior: `effective ⊆ granted ⊆ applicable Enterprise → Station → Role → Person authority`; invocation re-evaluates current applicability where required.
- Forbidden behavior: manifest request, install status, publisher trust, marketplace purchase, UI visibility or host reachability implies permission.
- Effect/failure disposition: deny or `INCONCLUSIVE` for stale/ambiguous grant evidence; no authority amplification.
- Owners: Authorization (grant/deny) + Extension Architecture (requested/effective relation) + Runtime/Security.
- Evidence/currentness: grant revision, subject/scope, host/runtime exposure, revocation/currentness.
- Recovery/reconciliation: refresh/revoke effective capability mapping and residual credentials/sessions before claiming closure.
- Blast radius: station/system/enterprise depending exposed capability.
- Severity: CRITICAL. Misuse likelihood: likely in permissive plugin ecosystems; adversarially exploitable.
- Proof obligation: `EXTENSION-ADV-PROOF-003` — effective capability is provably bounded by current grant and inherited scope, including transitive extension calls.

### G2-EDGE-EXTENSION-004 — signature/provenance/trusted publisher evidence is promoted into safety or unrestricted trust
- Preconditions: package signature, provenance attestation or trusted publisher status verifies successfully.
- Trigger: admission treats that evidence as proof that code is semantically safe, compatible or authorized.
- Expected safe behavior: treat signature/provenance as one qualified evidence axis; independently evaluate compatibility, policy, requested permissions, containment profile and current trust/revocation.
- Forbidden behavior: `signed/provenanced/trusted publisher => safe/admitted/unrestricted`.
- Effect/failure disposition: evidence can PASS on authenticity while overall admission remains FAIL/INCONCLUSIVE.
- Owners: Artifact/Release/Provenance + Trust/PKI + Extension Architecture + Security/Governance.
- Evidence/currentness: signer/trust roots, attestation subject/digest, revocation/currentness, exact extension revision.
- Recovery/reconciliation: requalify admission; quarantine/disable via authorized route if later evidence invalidates trust.
- Blast radius: installed fleet and downstream data/authority.
- Severity: CRITICAL. Misuse likelihood: plausible accidental and adversarial.
- Proof obligation: `EXTENSION-ADV-PROOF-004` — admission evidence model cannot collapse authenticity, provenance, compatibility, authority and containment into one boolean.

### G2-EDGE-EXTENSION-005 — host/API/dependency skew preserves syntactic loadability but breaks semantic compatibility
- Preconditions: extension revision is valid against host/API/dependency vector H1; host or dependency moves to H2 while extension remains installed.
- Trigger: load/execute under a nominally compatible interface but changed behavior, capability support or data contract.
- Expected safe behavior: compatibility is qualified against an explicit revision/support vector and cohort; stale or partial support remains `PARTIAL/INCONCLUSIVE`.
- Forbidden behavior: load success, matching package name or same feature label proves semantic compatibility.
- Effect/failure disposition: load may be `APPLIED` while support/compatibility is `PARTIAL/INCONCLUSIVE`.
- Owners: Extension Architecture + Standards/API Contracts + Provider/Binding + Lifecycle.
- Evidence/currentness: host/API/dependency revisions and provider semantic support evidence.
- Recovery/reconciliation: pin/migrate/requalify or isolate incompatible cohort; no silent fallback.
- Blast radius: affected host cohorts, workflows and persisted state.
- Severity: HIGH–CRITICAL. Misuse likelihood: plausible during rolling upgrades/provider substitution.
- Proof obligation: `EXTENSION-ADV-PROOF-005` — compatibility currentness and cohort coverage are explicit and testable.

### G2-EDGE-EXTENSION-006 — uninstall/rollback is reported successful while extension-created state/effects remain authoritative
- Preconditions: extension created schema/data, jobs, subscriptions, tokens, generated artifacts, caches, clients or external mutations.
- Trigger: disable/uninstall/rollback removes package/control-plane record but residual cohorts/effects remain.
- Expected safe behavior: lifecycle closure is qualified over residual cohort inventory and extension/domain-owner postconditions; rollback eligibility is current, not inferred from retained package availability.
- Forbidden behavior: package deletion, marketplace withdrawal or old artifact availability proves semantic removal or safe rollback.
- Effect/failure disposition: teardown may be `PARTIAL/UNKNOWN`; `UNKNOWN` requires reconcile-before-retry.
- Owners: Extension Architecture + Lifecycle + affected domain owners + Runtime/Integration/Data.
- Evidence/currentness: cohort inventory, persisted state lineage, external effect status, rollback eligibility.
- Recovery/reconciliation: fence/drain/reconcile residual authority and route state migration to its semantic owner.
- Blast radius: system/external parties; potentially irreversible data effects.
- Severity: CRITICAL. Misuse likelihood: plausible operationally.
- Proof obligation: `EXTENSION-ADV-PROOF-006` — uninstall/revoke/rollback cannot close while residual authoritative effects are unaccounted for.

### G2-EDGE-EXTENSION-007 — valid dependency/extension composition causes resource or authority explosion
- Preconditions: extension packs, transitive dependencies, event hooks or low-code/AI composition are individually allowed.
- Trigger: composition creates pathological dependency graph, recursive hooks, fan-out, privilege chaining, excessive network/process/data access or cost explosion.
- Expected safe behavior: detect/qualify graph size/cycles/resource envelope and effective transitive authority before activation; preserve AI/AGWS non-amplification.
- Forbidden behavior: each edge being locally valid is treated as proof the full composition is safe or bounded.
- Effect/failure disposition: admission `FAIL/INCONCLUSIVE` when closure/resource/authority proof is absent; runtime may degrade only within explicit bounds.
- Owners: Extension Architecture + Build/Dependency + Authorization + Security + Runtime + FinOps.
- Evidence/currentness: complete dependency/extension graph, authority closure, quotas/resource envelope, current host/provider limits.
- Recovery/reconciliation: isolate/quarantine offending composition and re-evaluate current graph; do not auto-expand limits/authority.
- Blast radius: host/system/enterprise and technology spend.
- Severity: CRITICAL. Misuse likelihood: likely accidental in low-code; adversarially exploitable.
- Proof obligation: `EXTENSION-ADV-PROOF-007` — N-wise composition cannot exceed declared current authority/resource envelopes without explicit qualified admission.

## 3. Mandatory cluster — Extension/Plugin × authority × provider trust × lifecycle

### G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001 — transitive publisher/dependency trust exceeds intended authority
- Scenario: trusted extension A depends on B/C; platform trust/install workflow transitively accepts dependency publishers, while B/C expose permissions not reviewed for A's intended scope.
- Expected safe behavior: trust of publisher/package identity and permission grant remain independent; dependency closure is evaluated against current grant and containment.
- Forbidden behavior: trusting A or its publisher implicitly grants B/C effective authority.
- Disposition: admission/effective authority `INCONCLUSIVE/DENY` until dependency identities, trust and grants are qualified.
- Owners: Extension + Authorization + Trust/PKI + Build/Dependency.
- Evidence/currentness: exact dependency closure, signer/publisher evidence, requested/granted/effective diff.
- Recovery: requalify dependency closure; revoke/drain residual dependent cohorts if authorization changed.
- Blast radius: station/system. Severity: CRITICAL. Misuse: plausible/adversarial.
- Proof: `XEXTENSION-ADV-PROOF-001`.

### G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-002 — revocation/disablement conflicts with residual runtime authority
- Scenario: extension becomes revoked/disabled under current trust/policy, but workers, sessions, tokens, subscriptions or browser/client bundles continue to act.
- Expected safe behavior: revocation prevents new eligibility and closure remains `PARTIAL/INCONCLUSIVE` until residual effect capability is fenced/drained/dispositioned.
- Forbidden behavior: catalog visibility or control-plane lifecycle state is treated as runtime-effective convergence.
- Disposition: control-plane mutation may be `APPLIED`; system convergence remains `PARTIAL`.
- Owners: Extension + Authorization + Runtime + Secrets + Integration + Lifecycle.
- Evidence/currentness: cohort inventory, current token/credential validity, observed effect capability.
- Recovery: fence/drain/revoke residual authority; reconcile ambiguous external effects.
- Blast radius: system/external parties. Severity: CRITICAL. Misuse: plausible.
- Proof: `XEXTENSION-ADV-PROOF-002`.

### G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-003 — provider/marketplace substitution changes semantics while canonical extension appears unchanged
- Scenario: provider P1 and P2 expose nominally equivalent extension/plugin feature, but differ in permissions, isolation, API semantics, update guarantees or distribution trust.
- Expected safe behavior: preserve canonical extension identity while requalifying provider support, trust, permissions, compatibility and residual P1 cohorts.
- Forbidden behavior: same listing name/API label or successful P2 install proves semantic equivalence/convergence.
- Disposition: support may be `PARTIAL/INCONCLUSIVE`; cutover remains partial while residual P1 can act.
- Owners: Provider/Binding + Extension + Trust + Standards + Lifecycle.
- Evidence/currentness: support vector, provider generation, trust/admission, old/new cohort inventory.
- Recovery: bounded coexistence or rollback only if currently eligible; reconcile residual effects.
- Blast radius: extension fleet/system. Severity: HIGH–CRITICAL. Misuse: plausible.
- Proof: `XEXTENSION-ADV-PROOF-003`.

### G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-004 — AI/low-code chains individually allowed extensions into a confused-deputy authority path
- Scenario: AI/AGWS or low-code user composes allowed extension calls A→B→C; each call passes local policy but the chain causes an effect the initiating Person/Role/Station could not directly authorize.
- Expected safe behavior: end-to-end effective authority and semantic ownership remain bounded by inherited authority; delegated service/extension authority cannot be borrowed as user authority.
- Forbidden behavior: local success of each action proves global authorization.
- Disposition: deny/`INCONCLUSIVE` at the first point where initiating/delegated authority cannot prove the intended effect; no AI/AGWS amplification.
- Owners: Authorization + Extension + AGWS/AI + affected semantic owner.
- Evidence/currentness: initiating subject, delegated authority chain, action/effect lineage, current role/station.
- Recovery: stop further actions; reconcile any prior `UNKNOWN/PARTIAL` effects before retry/compensation.
- Blast radius: station/system/enterprise. Severity: CRITICAL. Misuse: likely accidental and adversarial.
- Proof: `XEXTENSION-ADV-PROOF-004`.

## 4. New reusable processual/semantic conflict patterns

### G2-CONFLICT-PATTERN-EXTENSION-IDENTITY-001 — realization identity conflicts with canonical extension identity
- Family: semantic ownership + provider/version/coexistence.
- Activation conditions: registry/marketplace/provider/runtime identity is imported or reused during migration/substitution; canonical mapping is absent, stale or ambiguous.
- Incompatible claims/actions/states: external realization claims "same extension" while canonical lineage indicates different/unknown subject, or vice versa.
- Detection candidates: identity-provenance graph, alias/adoption evidence, provider-generation diff, duplicate/collision analysis.
- Owners: Extension Architecture + Provider/Binding + Lifecycle.
- Severity: HIGH–CRITICAL; confidence: strongly supported by multi-ecosystem identity/version separation; detectability: static + pre-execution + audit.
- Blast radius: extension fleet/system; reversibility: migration may be required; time-to-harm: delayed/cumulative; misuse likelihood: plausible accidental.
- Evidence currentness: current provider generation plus canonical adoption record; false-positive risk: legitimate alias/registry move without semantic change.
- Future remediation disposition: require explicit identity reconciliation/adoption or quarantine ambiguous mapping.
- Proof candidate: `EXTENSION-CONFLICT-PROOF-001`.

### G2-CONFLICT-PATTERN-PERMISSION-COMPOSITION-001 — locally valid extension permissions compose into excessive effective authority
- Family: authority/responsibility + AI/low-code + cross-process.
- Activation conditions: multiple extensions/services/dependencies have individually valid grants; composition lets one borrow another's broader authority or exposes transitive capability not visible in local manifests.
- Incompatible claims/actions/states: each local call is allowed, but the composite effect exceeds initiating subject/scope or violates separation-of-duty.
- Detection candidates: transitive requested/granted/effective graph, confused-deputy path analysis, N-wise capability closure, commit-time authority revalidation.
- Owners: Authorization + Extension + affected semantic owners.
- Severity: CRITICAL; confidence: strongly supported; detectability: design-time + runtime; blast radius: station→enterprise; reversibility: potentially bounded compensation only; time-to-harm: immediate; misuse likelihood: likely/adversarial.
- Evidence currentness: current Role/Station/Person authority, extension grants and delegation chain; false-positive risk: intentional service delegation with explicit policy.
- Future remediation disposition: require explicit delegation/effect authorization or reject/quarantine unsafe composition.
- Proof candidate: `EXTENSION-CONFLICT-PROOF-002`.

### G2-CONFLICT-PATTERN-EXTENSION-LIFECYCLE-001 — control-plane lifecycle state conflicts with residual effective extension state
- Family: state-transition + lifecycle/recovery + data/integration.
- Activation conditions: enable/disable/revoke/uninstall/update/rollback is asynchronous/distributed or leaves persisted state, jobs, credentials, subscriptions, clients or external effects.
- Incompatible claims/actions/states: canonical/control-plane says disabled/removed/rolled back while residual cohort remains capable of authoritative effects.
- Detection candidates: cohort inventory, runtime/effect lineage, token/subscription/job activity, postcondition reconciliation.
- Owners: Extension + Lifecycle + Runtime/Integration/Secrets + affected domain owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: runtime/post-effect; blast radius: system/external parties; reversibility: bounded to potentially irreversible; time-to-harm: immediate/delayed; misuse likelihood: plausible.
- Evidence currentness: current cohort/effect evidence; false-positive risk: intentionally tolerated read-only residual cohort explicitly dispositioned.
- Future remediation disposition: fence/drain/reconcile; do not claim closure until qualified.
- Proof candidate: `EXTENSION-CONFLICT-PROOF-003`.

### G2-CONFLICT-PATTERN-TRUST-PROVENANCE-001 — authentic/provenanced artifact conflicts with admission/safety/authority requirements
- Family: trust/policy + artifact/provenance + extension admission.
- Activation conditions: signature/provenance/publisher trust passes while permissions, compatibility, containment, policy or current trust applicability does not.
- Incompatible claims/actions/states: artifact is authentically sourced yet not currently safe/eligible/authorized for the host/scope.
- Detection candidates: multidimensional admission profile; subject/digest-to-extension-revision binding; trust/currentness + permission/compatibility diff.
- Owners: Artifact/Release/Provenance + Trust/PKI + Extension + Security/Governance/Authorization.
- Severity: HIGH–CRITICAL; confidence: strongly supported, including npm's explicit provenance limitation; detectability: pre-execution + audit; blast radius: fleet/system; reversibility: depends on executed effects; time-to-harm: immediate/latent; misuse likelihood: plausible/adversarial.
- Evidence currentness: exact artifact digest, signer/trust state, policy/host revision and grant; false-positive risk: benign artifact that is simply unsupported in current host.
- Future remediation disposition: preserve axis-specific evidence; require additional qualification rather than upgrading provenance to global trust.
- Proof candidate: `EXTENSION-CONFLICT-PROOF-004`.

## 5. Saturation result

This first-pass visit produced material findings. Therefore:
- local no-material streak for `Extension / Plugin / Marketplace Architecture` = **0**;
- cluster no-material streak for `Extension/Plugin × authority × provider trust × lifecycle` = **0**;
- no HIGH/CRITICAL scenario is left without an owner set and proof obligation;
- no remediation is authorized by this register;
- Planning C remains blocked.

## 6. Index/matrix linkage

Material scenario ranges to be indexed by the campaign:
- `G2-EDGE-EXTENSION-001..007`;
- `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001..004`;
- `G2-CONFLICT-PATTERN-EXTENSION-IDENTITY-001`;
- `G2-CONFLICT-PATTERN-PERMISSION-COMPOSITION-001`;
- `G2-CONFLICT-PATTERN-EXTENSION-LIFECYCLE-001`;
- `G2-CONFLICT-PATTERN-TRUST-PROVENANCE-001`.

The register is the authoritative detailed record for this visit. `EDGE_CASE_INDEX.md` and `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md` should reference these IDs without converting patterns into instances.
