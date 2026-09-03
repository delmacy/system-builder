# Generation 2 Deep Research — Recovery Authority Root vs Steady-State Separation of Duties 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

If steady-state privileged authority is deliberately split across independent custodians, Stations, providers, trust domains or roles, but an emergency recovery path can reset, replace, re-enroll, re-root or bypass those authorities, how can Generation 2 preserve recoverability without making the recovery plane a hidden single common-cause super-root that nullifies separation of duties?

More precisely:

- when is recovery merely restoration of availability, and when is it authority-root mutation;
- may a recovery actor directly exercise normal business/admin authority, or only restore the ability of normal authorities to act;
- how should break-glass differ from root recovery, credential recovery, writer recovery and provider-control recovery;
- when must a recovery path itself satisfy threshold/independence requirements;
- what post-use fencing, re-root, rotation, revocation, quarantine and requalification are required after exceptional authority is exercised;
- how do Enterprise → Station → Role → Person, offline Stations, HSM/KMS recovery and provider-admin recovery interact with a superior recovery authority;
- when does a convenient emergency account have to be treated as the actual highest authority in the threat model rather than as a harmless contingency mechanism;
- whether G2 needs a small cross-cutting recovery-authority qualification relation, or whether existing authority, recovery, qualified-claim and independence primitives are sufficient.

## Why this is architecturally material

`DR-ABRT-01` established that authority-bearing claim consumption must terminate in externally admitted, scoped and non-amplifying roots. `DR-TICCAF-01` then established that a multi-party threshold is only as strong as the independence assumptions it can prove. The residual contradiction is a recovery path that can replace the very roots or participants whose independence was just proven.

Example:

```text
Steady state
  3-of-5 independent custodians
          ↓
  privileged root change

Emergency
  one recovery administrator
          ↓
  reset/re-enroll 3 custodians
```

The steady-state threshold is cryptographically and organizationally real, but it does not protect against compromise of the recovery administrator. If architecture reports `3-of-5 resistant to one custodian compromise` while omitting a single actor able to recreate three custodians, it overstates its actual authority closure.

The opposite extreme is also unsafe: eliminating all recovery authority can make a system permanently unavailable after credential loss, IdP outage, HSM failure, root-key loss or administrative corruption. Mature systems therefore deliberately create exceptional paths. The architectural question is not whether emergency paths exist; it is whether their **scope, effective power, independence, operating mode and post-use consequences are explicit**.

The selected question can change:

- the meaning of four-eyes and threshold assurance;
- Security/Recovery ownership;
- Identity/Authorization root lifecycle;
- Station constitutional boundaries;
- provider substitution and self-hosting requirements;
- trust-root rotation/recovery proofs;
- whether a recovered system is merely reachable or once again qualified for normal authority.

## Corpus of SB input

Mandatory Generation 2 corpus reviewed before external research:

- `RESEARCH_PIPELINE_STATE.json` — `phase=RESEARCH_ELICITATION`; six full cycles complete; cycle 7 active. This Deep Research does not increment `completed_full_cycles`, mark a capability revisited or declare saturation.
- `RESEARCH_EVIDENCE_METHOD.md` — universal primitives require structural necessity or multi-source corroboration; conflicts between standards, products and literature must remain visible.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md` — authority/security proof requires authentication ≠ authorization, decision authority ≠ mutation authority, delegated non-amplification, isolation/blast-radius evidence and executable falsification paths.
- `CAPABILITY_DISCOVERY_REGISTER.md`, `FINDING_INDEX.md`, `REPRESENTATIVE_COVERAGE.md`, `CAPABILITY_PROOF_MATRIX.md` — authoritative research inventories/input, not automatic architectural conclusions.
- Security / Resilience / Failure Recovery revisit 05 — recovery is staged; mutating recovery requires writer fencing; break-glass is scoped/expiring/auditable; restore ≠ semantic validation ≠ promotion ≠ reprotection; post-recovery requalification is mandatory.
- Authorization / Policy / Organization / Multitenancy research — effective authority is applicability scoped and `Enterprise → Station → Role → Person` is attenuation, not implicit amplification.
- `DR-ABRT-01` — recursive trust must terminate at externally admitted authority/trust roots; root mutation and break-glass are privileged lifecycle events.
- `DR-TICCAF-01` — distinct actors/keys/providers are not proof of independence; recovery-path common cause is an explicit residual threat.
- `DR-OSEA-01` / `DR-SRFE-01` — disconnected Stations may hold bounded local rights, but recovery/reclaim cannot duplicate rights or infer exclusion from silence.
- `DR-LGCE-01` — historical authority interpretation may remain pinned while future privileged actuation requires freshness/revision requalification.
- `DR-QDCE-01` — derived claims may carry provenance but do not acquire domain authority merely by being valid.

This document deepens the residual cross-cutting contradiction and does not advance breadth rotation.

## External evidence ledger

### E1 — The Update Framework (TUF): normal root rotation versus threshold-root compromise

Sources:

- https://theupdateframework.github.io/specification/v1.0.28/
- https://theupdateframework.github.io/specification/v1.0.26/

TUF treats root metadata as the authority that delegates trust to top-level roles. Normal root-key replacement preserves continuity: a new root metadata version must satisfy the threshold of the immediately previous root and the threshold of the new root. Clients can walk every intermediate root version to re-establish trust.

TUF explicitly treats compromise of fewer than the root threshold as a normal rotation/revocation case. Compromise of a threshold of root keys is qualitatively different: recovery should be out-of-band, is deliberately difficult, and may require assuming affected machines are compromised.

**Extraction:** root recovery is not just another administrative operation. Where continuity proof is still available, root evolution can remain inside the normal authority graph. Once the normal trust root is no longer trustworthy, recovery requires an independently admitted ceremony/channel and must not pretend the compromised graph validated its own replacement.

### E2 — NIST SP 800-57 Part 1 Rev. 5: recovery availability can increase compromise exposure

Sources:

- https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final
- https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-57pt1r5.pdf

NIST recognizes key recovery as a legitimate continuity mechanism but explicitly notes that avoiding backup can be preferable when re-keying/reconstruction can maintain operations, because stored recovery material increases compromise opportunity. Compromised keying material requires assessment and replacement with entirely new material.

NIST's key-archive table also distinguishes key purposes: private signature and private authentication keys are not normally archived, while decryption/key-management material may legitimately require recovery. This separation matters because recovering confidentiality access is not semantically identical to restoring the authority to sign or authenticate as a principal.

**Extraction:** `recoverability` is not a universal virtue with one mechanism. Recovery semantics depend on what capability the material confers. A recovery store that can reconstruct signing/authentication authority may create a stronger impersonation/super-root path than a store that can only recover encrypted data.

### E3 — Microsoft Entra emergency access accounts

Sources:

- https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/security-emergency-access
- https://learn.microsoft.com/en-us/entra/architecture/security-operations-privileged-accounts

Microsoft recommends at least two cloud-only emergency access accounts, independent of normal federated identity, with phishing-resistant authentication, separate secure credential/device storage, monitoring/alerts on every use and periodic validation. The accounts can be permanently assigned Global Administrator because their purpose is survivable administrative access when normal identity/control paths fail.

**Extraction:** production systems sometimes intentionally accept a highly privileged emergency path. This is useful operational evidence but also a falsifier: a break-glass account with Global Administrator authority **is** a real high-power root in the relevant threat model. Calling it `emergency` does not reduce its effective authority. Security comes from independence, custody, monitoring, restricted use and governance — not from the label.

### E4 — AWS break-glass and centralized root access

Sources:

- https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/design-principles-for-your-multi-account-strategy.html
- https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-enable-root-access.html
- https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/sec_permissions_emergency_process.html
- https://docs.aws.amazon.com/IAM/latest/UserGuide/enable-mfa-for-root.html

AWS recommends emergency access paths for IdP/Identity Center/team failure, with monitoring and tightly controlled long-lived emergency credentials. Its multi-account guidance describes two-person handling of break-glass password/MFA material as one possible custody pattern.

AWS Organizations can also centralize root access for member accounts: member root credentials may be removed, and the management/delegated administration plane can selectively enable privileged root actions or root-password recovery. This deliberately moves recovery power upward into another control plane.

**Extraction:** superior recovery authority can improve survivability and reduce dormant credentials in lower scopes, but it creates explicit dependency on the superior plane. If the management account can restore root access for a member account, the management/recovery plane belongs in the member account's effective authority ancestry for the corresponding threat model.

### E5 — HashiCorp Vault recovery keys, root regeneration and recovery mode

Sources:

- https://developer.hashicorp.com/vault/docs/concepts/seal
- https://developer.hashicorp.com/vault/docs/troubleshoot/generate-root-token
- https://developer.hashicorp.com/vault/docs/commands/operator/rekey
- https://developer.hashicorp.com/vault/docs/concepts/recovery-mode

Vault deliberately separates mechanisms. With HSM/KMS auto-unseal, recovery keys do not decrypt the root key and cannot recover a permanently lost seal mechanism; they authorize selected high-privilege recovery operations such as root-token generation. Root-token generation requires a threshold of current unseal/recovery key holders.

Vault recovery mode is even more explicit: normal subsystems do not run; access is limited to low-level `sys/raw`; integrated-storage recovery resizes the cluster to one node, and returning to normal service requires reforming the Raft cluster.

**Extraction:** exceptional recovery can be modeled as a **different operating mode with narrower/different semantics**, not as normal omnipotent administration. A recovered node/credential does not imply restored steady-state topology or authority qualification. Post-recovery reconstruction/requalification is a first-class closure obligation.

### E6 — Vault rekey as continuity-preserving authority change

Source:

- https://developer.hashicorp.com/vault/docs/commands/operator/rekey

Vault can generate a new set of unseal/recovery shares, but completing the change requires a quorum/threshold of the current shares. This resembles TUF root rotation: current authority participates in transition to new authority.

**Extraction:** when the existing authority closure is trustworthy and available, changing recovery/root membership should use continuity-preserving current-authority approval rather than invoking an exceptional override path.

### E7 — NIST key compromise recovery and independence of replacement material

Source:

- https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-57pt1r5.pdf

NIST states that compromised keying material affects continuity and that affected material must be replaced after assessment; archived/recovered material has its own protection requirements. Earlier NIST guidance also makes the useful security distinction that if a recovered key may have been compromised, protected data should be transitioned to independently generated replacement material.

**Extraction:** recovery from suspected compromise should normally advance an authority/key epoch. Restoring the same possibly compromised credential into normal service without re-root/re-key is weaker than recovery from mere accidental unavailability.

## Competing models

### Model A — Recovery authority is simply the highest administrator

```text
RecoveryAdmin
   ├── reset any identity
   ├── replace threshold custodians
   ├── mutate policy
   ├── mint root credentials
   └── directly actuate protected operations
```

**Strongest evidence for:** common in real systems; operationally simple; Microsoft/AWS emergency access deliberately grants extremely high privilege to survivable accounts.

**Strongest evidence against:** any steady-state separation below this actor does not protect against compromise of the recovery actor. The system can still be valid if this is an accepted threat model, but calling lower-level approval `independent` without exposing the super-root is misleading.

**Disposition:** **SPECIALIZE / EXPOSE AS ACTUAL ROOT**, not portable default. Do not hide it behind an `emergency` label.

### Model B — Recovery may restore availability but can never mutate authority

Recovery can restore bytes/processes but never replace identities, trust roots, keys or policy participants.

**Strongest evidence for:** preserves steady-state authority assurance and avoids hidden super-root.

**Strongest evidence against:** impractical after loss/compromise of key material, IdP failure, root-key loss or administrative corruption. TUF, Vault, Azure/AWS all require some path to recover authority/control-plane usability.

**Disposition:** **REJECT as complete architecture**.

### Model C — Recovery is a separately governed constitutional authority with typed operations and mandatory requalification

Conceptual shape, not frozen IR:

```text
RecoveryIntent / Incident
+ protected scope
+ recovery-authority profile revision
+ admitted recovery participants
+ independence / custody evidence
+ preconditions / reason / incident binding
+ exceptional operation type
+ expected-base / recovery epoch / fencing
        ↓
RecoveryActuation
        ↓
provisional recovered authority/topology
        ↓
rotate / re-root / revoke exceptional material
+ semantic/security validation
+ re-form normal threshold / topology
+ requalify Stations/providers/consumers
        ↓
SteadyStateReentryClaim
```

Recovery authority may be more powerful than any single steady-state participant, but its power is explicit, typed and scoped. It either:

1. **restores normal authority machinery** without directly exercising downstream business authority; or
2. performs an explicit **override** whose stronger authority and residual risk are declared rather than disguised.

**Disposition:** **KEEP / GENERALIZE as a pattern**, with capability-owned operation semantics.

## Strongest synthesis

The evidence does not support a universal rule that recovery authority must always be weaker than steady-state authority. Real systems sometimes require the emergency path to be stronger.

The portable requirement is instead:

> **Recovery authority must be included in the effective authority closure at the power it can actually exercise. If it can reset or recreate enough steady-state authorities, it is a root for that threat model. If that concentration is unacceptable, the recovery path itself must be thresholded/independent or constrained to restore authority machinery without direct actuation.**

This resolves the apparent contradiction between survivability and separation of duties without pretending either side disappears.

## Distinguish five recovery families

These are analytical categories, not frozen capability names.

### 1. Availability recovery

Restores infrastructure/data/runtime accessibility without changing who is authorized.

Examples: restore a node, recover a snapshot, restart a control plane.

Authority consequence: usually no new semantic authority should be minted. Normal authority must still validate against the recovered generation/epoch.

### 2. Credential/material recovery

Restores access to decryption or key-management material.

Authority consequence depends on key purpose. Recovery of a data-decryption key is not equivalent to recovery of a signing/authentication key.

### 3. Authority membership recovery

Re-enrolls/replaces lost custodians, administrators, Stations or role holders.

Authority consequence: can collapse threshold assurance if one recovery actor may install enough members. Must be visible in common-control ancestry.

### 4. Trust-root recovery / re-root

Changes the root that validates future authority.

Authority consequence: constitutional. When continuity proof from the old root is unavailable/untrusted, this requires an externally admitted recovery ceremony and creates a new trust epoch.

### 5. Emergency override / break-glass actuation

Directly bypasses or supersedes normal policy for an emergency operation.

Authority consequence: the override path is itself an authority root for the allowed scope. It must not be described as merely `recovery material` if it can directly actuate protected effects.

## Invariants

### I1 — Effective power, not label, determines authority ancestry

`break-glass`, `recovery`, `support`, `management`, `owner` and `root` labels are irrelevant if the principal can recreate or bypass protected authority. Model what it can actually do.

### I2 — A recovery path that can install threshold participants is part of threshold threat closure

If one actor can replace `k` members of a `k-of-n` policy, the policy does not provide `k`-party resistance against compromise of that actor.

### I3 — Recovery purpose and key/authority purpose remain typed

Recovering confidentiality material, authentication authority, signing authority, policy authority and writer authority are different operations with different risks.

### I4 — Prefer continuity-preserving root rotation when current authority is trustworthy

Normal root/member evolution should require the old/current authority plus the new authority where possible. Exceptional recovery is reserved for loss/compromise of normal continuity, not routine administration convenience.

### I5 — Recovery after suspected compromise advances an epoch

A recovered/re-rooted system must not silently reuse stale authority assumptions. Credentials, grants, writer generations, Station delegations and trust bindings affected by the incident require revocation, rotation or explicit requalification.

### I6 — Emergency authority does not prove steady-state qualification

`RECOVERY_ACTUATION_SUCCEEDED` does not mean `NORMAL_AUTHORITY_RESTORED`. Reachability, root creation, topology restoration, semantic validation, independence re-establishment and protection posture are separate evidence states.

### I7 — Recovery mode should minimize live normal semantics

Where feasible, exceptional recovery should expose only operations needed to regain a qualified normal state. Vault recovery mode is strong production evidence for a deliberately different/narrow mode.

### I8 — Recovery authority itself requires an independence profile when the threat model demands it

If compromise of one emergency actor is unacceptable, recovery must use thresholded/independent custodians, separated credentials/devices/control planes, or another externally governed ceremony. A single omnipotent recovery account cannot be declared multi-party safe.

### I9 — Offline/local Station recovery cannot silently create a sovereign root

A disconnected Station may recover within its delegated local closure, but cannot create authority exceeding Enterprise-granted bounds or duplicate exclusive rights. If Enterprise itself is unavailable, any local constitutional recovery profile must have been explicitly pre-authorized and later requalified.

### I10 — Post-use exceptional authority must be fenced/revoked

Emergency credentials/tokens, temporary roots, recovery writer epochs, raw-mode access and bypass grants must not remain silently valid after normal service resumes.

### I11 — Re-entry to steady state is an explicit Gate

Normal actuation resumes only after required root/custodian membership, independence assumptions, policy revisions, topology, providers, Stations, credentials, writer epochs and security posture have been requalified.

### I12 — Historical evidence preserves the exceptional path

Recovery must not rewrite the event as if normal policy approved it. The incident, invoked recovery authority, reason, participants, effect, old/new roots/epochs, residual exceptions and requalification lineage remain auditable.

## Recovery authority strength classes

Not frozen enums; analytical distinctions for synthesis.

### Restorative-only

Can restore system material or re-enable already-authorized machinery but cannot mint new authority or bypass normal policy.

### Membership-restoring

Can replace/re-enroll named authority participants but not directly exercise their downstream permissions. This is still powerful: if it can install a threshold, it is a threshold root for that threat model.

### Root-restoring / re-rooting

Can establish new trust roots or credential roots. This is constitutional authority and should create an explicit new authority epoch.

### Override-actuating

Can directly execute protected operations despite normal policy. This is a true emergency super-root for that scope and must be governed/assessed as such.

A system may legitimately choose any class, but proof/assurance cannot claim a weaker class than the actual provider/control-plane capability.

## Failure and adversarial analysis

### Hidden super-root via identity recovery

Two independent approvers use unrelated credentials, but one IdP administrator can reset both identities. Steady-state human separation is true; resistance to IdP-admin compromise is false. Recovery ancestry must be included in the independence claim.

### Hidden super-root via provider organization

Two member accounts have separate root credentials removed, but a management account can selectively restore root-password recovery. The member roots are not independent from management-plane compromise for this threat.

### Break-glass compromise before incident

An emergency Global Administrator credential is stolen months before an outage. The attacker waits until monitoring is degraded and uses it. Dormancy is not a security property. The emergency account must have independent custody, continuous detection and periodic validation; if compromise of one is intolerable, require multi-party activation.

### Recovery authority creates replacement approvers

A `3-of-5` approval system loses two custodians. One recovery operator creates three replacements, who immediately approve a sensitive change. Operational threshold passed, but the recovery operator effectively controlled the quorum. A stronger independence policy must reject or flag this cohort until re-established under an independent ceremony.

### Root compromise disguised as normal rotation

A threshold of current root keys is suspected compromised. New root metadata is signed by those same keys and accepted as normal evolution. This does not restore trust; an external recovery anchor/ceremony is required.

### Recovery mode left enabled

Low-level raw recovery access remains reachable after the incident. Normal policy enforcement can now be bypassed. Steady-state re-entry must fail until exceptional mode/credentials are disabled and post-recovery topology/policy are validated.

### Recovered signing key versus new signing key

Restoring an old signing/authentication private key after suspected compromise preserves availability but may permit undetectable impersonation. NIST's purpose-specific recovery guidance supports preferring new authority material and preserving old public verification material for historical interpretation.

### Station clone after Enterprise recovery

Enterprise re-roots a Station after losing contact, while the old Station later reconnects with old local authority/rights. Without epoch/fencing/requalification, two logical descendants may both claim valid delegated authority. Existing Station reclaim/fencing obligations remain mandatory.

### Emergency provider substitution

Primary IdP/KMS/provider fails; emergency provider is activated. If the emergency provider offers weaker root custody/revocation/evidence semantics, recovery availability may succeed while authority assurance is degraded. Re-entry must preserve the weaker state explicitly or remain `INCONCLUSIVE`.

### Recovery path unavailable

Over-constraining recovery with dependencies on the same failed IdP/HSM/control plane defeats survivability. Recovery independence must include the failure domain it is designed to survive; Microsoft/AWS cloud-only or alternative-factor emergency patterns are production evidence for avoiding common dependency on the normal identity path.

## Provider-specific versus portable semantics

### Portable SB-owned / cross-cutting semantics

- identity/revision of recovery intent/incident and protected scope;
- type/class of recovery authority actually exercised;
- root/participant/recovery-authority ancestry relevant to the threat model;
- recovery participant threshold/independence evidence where required;
- old/new trust/authority/writer epoch lineage;
- exceptional actuation and effective-state evidence;
- explicit distinction between recovered reachability and qualified steady-state authority;
- post-use fencing/revocation/rotation/re-root/requalification closure;
- `PARTIAL/INCONCLUSIVE` when mandatory recovery ancestry or post-use closure is unavailable.

### Capability-owned semantics

- Security/Recovery owns incident/recovery policy, recovery-mode admission and residual risk.
- Identity owns credential/root authentication lifecycle and identity recovery semantics.
- Authorization/Governance owns role replacement, break-glass authority, four-eyes and separation-of-duties policy.
- Artifact/Release owns signing-root/functionary recovery.
- Data/Deployment/Transaction own writer epochs, fencing and recovered consistency where applicable.
- AGWS/Station owns Enterprise → Station delegated-administration re-root and reconnect qualification.
- AI-native Engineering owns whether AI may propose/validate recovery; AI does not gain root/override authority by materializing the plan.

### Providerized mechanics

- Microsoft Entra emergency Global Administrator accounts;
- AWS emergency IAM/root/Organizations recovery controls;
- Vault recovery shares, generate-root, rekey and recovery mode;
- HSM/KMS key backup/recovery/quorum mechanisms;
- TUF root-key rotation and out-of-band root recovery;
- cloud-specific account/credential recovery workflows.

No provider's `root`, `break-glass`, `recovery key` or `Global Administrator` object becomes the portable SB semantic model.

## Consequences for existing findings/candidates/hypotheses

### `DR-TICCAF-01`

**HARDEN.** Recovery ancestry is not merely one optional independence dimension. Whenever a policy claims resistance to compromise of steady-state participants, any actor/control plane that can replace enough participants must be included in effective common-control analysis.

### `DR-ABRT-01`

**HARDEN.** External root termination must include root-lifecycle/recovery provenance. A new root cannot derive authority solely from a graph whose root is declared compromised. Out-of-band recovery requires a separately admitted recovery root/ceremony.

### Security / Resilience / Failure Recovery

**KEEP / HARDEN.** Existing staged recovery model is strongly supported. Add explicit distinction between `recovery actuation`, `authority/root restoration`, `exceptional authority revocation`, `steady-state authority requalification` and final `reprotected` state.

### Authorization / Policy / Organization

**SPECIALIZE.** Break-glass/four-eyes policy must describe whether emergency authority can only restore participants or can directly override protected decisions. If it can override, that authority is part of the constitutional policy surface.

### Identity / Federation

**HARDEN.** Account/credential recovery must be modelled as a credential-root authority path, not merely user-support workflow. Recovery factors and admins can be common roots across apparently independent identities.

### AGWS / Station authority

**HARDEN.** Enterprise may constitutionally re-root/reassign Station delegates, but this means Station independence is threat-relative. Old Station generations/rights must be fenced, and the re-rooted Station must requalify before privileged synchronization. A local offline recovery profile cannot amplify beyond pre-authorized Enterprise bounds.

### Provider / Binding

**GENERALIZE.** Provider replacement or emergency provider activation must expose recovery/root semantics, not just functional capability support. A provider that cannot preserve required recovery independence or post-use evidence may satisfy runtime availability while failing the security profile.

### Qualified derived claims / UCA

**MERGE, do not create a mega-object.** `SteadyStateReentryClaim` or equivalent can use the established qualified-derived-claim envelope: recovered subject revision + recovery/security profile revision + evidence closure + freshness/applicability → capability-owned result. Recovery authority itself remains Security/Identity/Authorization owned.

### AI-native Engineering / AGWS

**DO_NOT_BUILD** AI self-recovery authority amplification. AI may diagnose, assemble evidence, propose a ceremony, validate closure and assist operators, but may not convert its own recommendation into root/reset/break-glass authority unless an independent policy explicitly grants that narrow role.

### Candidate disposition

No new top-level capability is warranted. At synthesis, reconcile a small **recovery-authority/root-transition qualification** pattern into Security/Recovery + UCA qualified evidence + authority/independence relations. Exact identity names remain deferred.

## Proposed research dispositions

| Disposition | Recommendation |
|---|---|
| **KEEP** | Capability-owned recovery, authority, identity, Station and writer-fencing semantics. |
| **HARDEN** | Multi-party independence proofs with recovery ancestry; recursive trust with explicit root-recovery lifecycle; staged recovery with steady-state re-entry qualification. |
| **GENERALIZE** | Small relation for `recovery scope + recovery-authority profile + participants/independence + old/new authority epoch + evidence closure → qualified recovery/re-entry claim`. |
| **MERGE** | Reuse qualified-derived-claim, revision vector, historical interpretation, fencing and independence machinery rather than create a universal recovery framework. |
| **SPECIALIZE** | Break-glass override, root re-key/re-root, credential recovery, key recovery, Station re-root and provider-admin recovery remain domain profiles. |
| **PROVIDERIZE** | Entra/AWS emergency accounts, Vault recovery mode/rekey, TUF root mechanics, HSM/KMS recovery and cloud account recovery. |
| **DEFER** | A universal taxonomy of every emergency operation and quantitative recovery-root risk score. |
| **DO_NOT_BUILD** | Hidden `emergency=true` super-root; `break-glass == safe`; recovery success == restored normal authority; same compromised root validating its replacement; AI/provider self-granting recovery authority. |

## Proof obligations / falsification paths

### DR-RARSOD-01 — Hidden threshold collapse
Configure steady-state `3-of-5` custodians but one recovery principal can re-enroll three. A threat profile claiming resistance to one administrative compromise must fail/return `INCONCLUSIVE` even though normal threshold configuration is correct.

### DR-RARSOD-02 — Restorative-only recovery
Provide a recovery actor that can restore an unavailable service but cannot change identities, roots, grants or directly actuate protected operations. Prove availability recovery does not become authority amplification.

### DR-RARSOD-03 — Membership recovery without direct actuation
Allow a recovery ceremony to replace one lost custodian but prohibit the ceremony from exercising the custodian's protected action. Prove replacement lineage and subsequent normal threshold approval remain distinct.

### DR-RARSOD-04 — Root continuity rotation
Change a healthy root using both old/current and new threshold authorization, TUF/Vault-style. Historical old-root evidence remains interpretable; new actions use the new epoch.

### DR-RARSOD-05 — Compromised root cannot self-heal
Mark the current root threshold compromised, then present a new root signed only through that compromised closure. Expected result: not sufficient for restored trust; require independently admitted recovery ceremony/root.

### DR-RARSOD-06 — Out-of-band root recovery
Use a separately governed recovery root/ceremony to establish a new root after compromise. Prove old root is revoked/fenced, new epoch is explicit, and dependent credentials/Stations/providers are requalified.

### DR-RARSOD-07 — Emergency super-root declared honestly
Model a Global-Administrator-style emergency account capable of direct protected actuation. Architecture must report it as an authority root for that scope; lower four-eyes assurance cannot claim resistance to compromise of that account.

### DR-RARSOD-08 — Thresholded emergency activation
Require two independently controlled emergency factors/custodians before override activation. Inject compromise of one custodian; emergency authority remains unavailable while recoverability survives loss of a different non-required participant according to policy.

### DR-RARSOD-09 — Shared emergency credential store
Store password and MFA/recovery factors under one administrator-controlled vault. A two-factor/two-person claim requiring independent custody must fail despite multiple credential artifacts.

### DR-RARSOD-10 — Normal IdP outage
Fail the normal federated IdP. Emergency accounts deliberately independent of the IdP remain usable. Prove recovery survivability without granting permanent dependence on the failed IdP.

### DR-RARSOD-11 — Recovery mode isolation
Enter a Vault-like low-level recovery mode. Normal application/write/policy subsystems must not be treated as active. Re-entry is blocked until exceptional mode is exited and normal topology/authority are re-established.

### DR-RARSOD-12 — Exceptional token revocation
Generate temporary recovery/root token, use it, then complete recovery. Prove token/lease/bypass authority is revoked/fenced and cannot later actuate normal privileged operations.

### DR-RARSOD-13 — Compromise versus accidental loss
Recover credential material after benign loss and after suspected compromise. The compromise case must require rotation/re-root/revocation according to policy rather than silently restoring the old authority epoch.

### DR-RARSOD-14 — Key-purpose distinction
Recover a data-decryption key and separately attempt to recover a private signing/authentication key. Prove policy can allow the former while requiring replacement/new key issuance for the latter.

### DR-RARSOD-15 — Enterprise re-roots Station
Enterprise replaces a Station authority after loss/contact failure. Old Station reconnects later. Old generation/delegation must be fenced and cannot coexist as another valid writer/authority without explicit reconciliation.

### DR-RARSOD-16 — Offline Station local recovery
Station loses a local credential while disconnected. A pre-authorized local recovery profile may restore bounded local operation, but cannot enlarge Enterprise-granted scope or mint new global authority; reconnect requires Enterprise requalification.

### DR-RARSOD-17 — Emergency provider downgrade
Switch to a recovery IdP/KMS/provider whose custody/evidence guarantees are weaker. Availability can recover, but normal high-assurance authority re-entry must remain degraded/`INCONCLUSIVE` until the required profile is satisfied.

### DR-RARSOD-18 — Recovery outcome unknown
Recovery/root-change request times out after possible actuation. Retry is forbidden until effective root/participant state is reconciled, preserving existing ambiguous-actuation semantics.

### DR-RARSOD-19 — Re-entry Gate
After successful recovery, deliberately leave one mandatory item unresolved: root rotation, Station fencing, independence evidence, provider rebind, credential revocation or reprotection. System may be reachable, but steady-state privileged authority must not be reported fully restored.

### DR-RARSOD-20 — Historical exceptional-path evidence
Complete break-glass recovery. Audit must show incident/reason, recovery-policy revision, participants, independence evidence, operations, old/new root/epoch, exceptional grants, revocations and requalification rather than rewriting history as a normal approval.

### DR-RARSOD-21 — Recovery actor cannot rewrite evidence
The actor authorized to re-root/restore must not automatically have authority to delete or rewrite the evidence proving its own exceptional actuation. If the product provider couples these permissions, the coupling must be surfaced as residual risk/provider limitation.

### DR-RARSOD-22 — Simple-system ergonomics
A low-risk single-user/self-hosted system may explicitly accept one owner as both normal and recovery root. The model should record the weaker threat assumption without forcing enterprise ceremonies. Simplicity is allowed; hidden assurance inflation is not.

## Contradictions resolved

### “A recovery super-root always invalidates separation of duties”

**Resolved as too absolute.** It invalidates claims against compromise of that root, but lower-level separation can still protect against ordinary participant mistakes/compromise. Assurance must name the threat model.

### “Recovery authority must never be stronger than normal authority”

**Resolved as impractical/unnecessary.** Mature systems intentionally use stronger emergency authority. The architectural requirement is explicit power, scope, independent governance where required and post-use closure.

### “Break-glass is just another role”

**Rejected as portable semantics.** A break-glass mechanism may be a role, a root account, a multi-party ceremony, a hardware recovery mechanism or a provider-specific support/control path. Portable semantics concern effective authority and lifecycle, not UI/object type.

### “Root recovery is just root rotation”

**Rejected.** Rotation under a trustworthy current root preserves continuity; recovery after root compromise/loss may require an external trust ceremony and new authority epoch.

### “Once emergency access works, the system is recovered”

**Rejected.** Emergency reachability can coexist with degraded topology, stale credentials, unrevoked bypass authority, weak provider binding and unqualified Station state.

## Unresolved questions

1. What is the minimum portable vocabulary for recovery-authority classes without overfitting Entra/AWS/Vault/TUF?
2. Should a `SteadyStateReentryClaim` be a named Security/Recovery result or simply a profile-specific qualified derived claim?
3. Which operations require mandatory thresholded recovery versus allowing a declared single-owner risk profile?
4. How should external/manual/legal ceremonies be represented when machine-verifiable independence evidence is incomplete?
5. Can an Enterprise legitimately remain an override super-root for every Station, or should selected high-assurance Station profiles make some roots locally non-overridable except through a separate constitutional ceremony?
6. How should provider support personnel/account-recovery channels be represented when their effective recovery authority is opaque?
7. What historical validation material must survive after emergency root rotation so pre-incident signatures/evidence remain interpretable without allowing old roots to authorize new work?
8. Should post-recovery qualification require a minimum observation/quarantine window for selected threat classes, or remain capability/profile-specific?

## Confidence

**High** on:

- recovery paths that can recreate/bypass steady-state participants are part of effective authority ancestry;
- root rotation under a healthy root and root recovery after compromise are materially different;
- emergency/break-glass success does not establish restored steady-state authority;
- exceptional authority must be scoped, observable, revocable/fenceable and followed by requalification;
- recoverability and separation of duties can coexist only when the actual recovery power and threat assumptions are explicit.

**Medium-high** that G2 should generalize a small recovery-authority/root-transition qualification pattern using existing qualified-claim, independence, revision and fencing machinery rather than invent a top-level capability.

**Medium/DEFER** on exact authority-class vocabulary, mandatory quarantine periods and machine-verifiable representation of external/manual recovery ceremonies.

## Research recommendation

The strongest synthesis is:

> **Recovery is constitutional when it can change who is trusted or who may act. Treat every recovery path at its effective power: if it can recreate or bypass enough steady-state authority, it is a root for that threat model. Preserve survivability with separately governed, scoped and independently qualified recovery paths where necessary, then advance authority epochs, revoke exceptional access and explicitly requalify the system before returning to normal privileged actuation.**

Portable conceptual flow:

```text
Incident / RecoveryIntent
+ RecoveryAuthorityProfile revision
+ protected scope
+ participants / custody / independence evidence
+ old authority/trust/writer epoch
       ↓
Exceptional Recovery Actuation
       ↓
Provisional recovered state / new authority epoch
       ↓
rotate / re-root / fence / revoke
+ validate semantics/security
+ rebuild normal thresholds/topology
+ requalify Stations/providers/consumers
       ↓
Qualified Steady-State Re-entry
```

This should **HARDEN** `DR-ABRT` and `DR-TICCAF`, **MERGE** with existing qualified-derived-claim/recovery/fencing/revision machinery, **SPECIALIZE** concrete break-glass/root/key/Station recovery semantics, and **PROVIDERIZE** Azure/AWS/Vault/TUF/HSM mechanisms.

Do **not** create a hidden universal recovery super-user, infer safety from an `emergency` label, or report normal authority restored from provider/recovery success alone.

## Recommended next deep question

**Recovery Root Rotation & Historical Verification Continuity.** After emergency re-root/credential rotation, what minimum old-root/public verification/trust metadata must remain available so historical signatures, approvals, provenance and long-lived workflow evidence remain interpretable, while guaranteeing that retired/compromised roots cannot authorize any new actuation? Reconcile historical interpretation closure, trust revocation, long-lived Gate evidence, offline Stations and provider substitution.