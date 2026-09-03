# Generation 2 Deep Research — Threshold Independence & Common-Cause Authority Failure 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

When a policy requires `2-of-3`, dual control, four-eyes approval, multiple trust domains, multiple providers or multiple Stations, what evidence is sufficient to claim that the participating authorities are materially independent rather than merely distinct identifiers whose compromise/failure can be caused by one administrator, credential root, HSM/KMS, provider account, control plane, recovery path, software defect or infrastructure failure?

More precisely:

- does distinct key/user/provider identity imply independent authority;
- what independence dimensions matter for malicious compromise versus operational failure;
- when does threshold/quorum mathematics provide real protection and when does common-cause failure collapse it;
- can independence be represented by one boolean or must it be qualified by an explicit threat/failure model;
- how should Enterprise → Station → Role → Person and AGWS/AI approvals consume multi-party authority without counting aliases of the same controller as independent parties;
- how should provider substitution and offline/local operation affect an existing independence claim;
- whether Generation 2 needs a small cross-cutting independence/failure-domain qualification relation, while leaving actual threshold and authorization semantics capability-owned.

## Why this is architecturally material

`DR-ABRT-01` established that authority-bearing claims require an externally rooted, scoped, current and non-amplifying trust closure. It left one residual assumption implicit: if the closure requires multiple authorities, how do we know they are actually independent?

The distinction can change architecture. Consider four superficially valid policies:

```text
2-of-3 keys
2 human approvers
2 trust domains
2 providers
```

If all keys are exportable from one administrator workstation, both humans authenticate through one administrator-controlled IdP, both trust domains terminate in one root or recovery account, and both providers are governed through one cloud organization credential, the policy may have syntactic multiplicity but little protection against the common controller.

Conversely, requiring universal physical/organizational independence for every threshold would make simple systems unusably ceremonial and would reject legitimate thresholds whose purpose is only protection against accidental key loss or one compromised credential.

The architecture therefore needs to distinguish **what threat/failure the threshold is intended to tolerate** from the mere number of participants.

## Corpus of SB input

Mandatory Generation 2 corpus reviewed before external research:

- `RESEARCH_PIPELINE_STATE.json` — `phase=RESEARCH_ELICITATION`; six full cycles complete; cycle 7 active. This Deep Research does not increment cycle counters, mark any capability revisited or declare saturation.
- `RESEARCH_EVIDENCE_METHOD.md` — universal primitives require structural necessity or multi-source corroboration; scientific/standards/production conflicts must be preserved.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md` — authority/security proof requires decision/evaluation authority ≠ mutation authority, delegated authority non-amplification and explicit isolation/blast-radius proof.
- `CAPABILITY_DISCOVERY_REGISTER.md`, `FINDING_INDEX.md`, `REPRESENTATIVE_COVERAGE.md` and `CAPABILITY_PROOF_MATRIX.md` — input inventory, not automatic conclusions.
- Authorization / Policy / Organization / Multitenancy revisit 06 — effective authority is applicability-scoped; delegation and temporary grants are revision/freshness qualified; `Enterprise → Station → Role → Person` is an attenuation chain.
- Security / Resilience / Failure Recovery revisit 05 — recovery requires exclusive writer/fencing authority, break-glass is scoped, and reachability/failover cannot substitute for qualified recovery evidence.
- `SYSTEM_BUILDER_STATIONS_AND_ADMINISTRATIVE_SURFACES.md` — Station composition and recursive management are explicit hypotheses with circular-authority and privileged-administration risk.
- `DR-QDCE-01` — qualified derived claims preserve provenance without acquiring domain authority.
- `DR-ABRT-01` — authority-bearing claim consumption must terminate in externally admitted trust/authority roots; cycles and self-authorization are rejected.
- `DR-OSEA-01` / `DR-SRFE-01` — local/offline rights and reclamation require bounded authority plus exclusion/fencing evidence; duplicated-looking local rights are not automatically safe.

This document deepens the residual cross-cutting question and does not advance breadth rotation.

## External evidence ledger

### E1 — NIST SP 800-57 Part 1 Rev. 5: split knowledge

Sources:
- https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final
- https://csrc.nist.gov/glossary/term/split_knowledge

NIST defines split knowledge as dividing a cryptographic key into `n` shares so that fewer than the required `k` shares reveal no key information. This is a strong cryptographic property about shares and reconstruction.

**Extraction:** split knowledge proves that one share is insufficient to reconstruct/use the protected secret under the assumed mechanism. It does **not** by itself prove that the holders, storage devices, administrators or recovery channels of those shares are independent against a particular common cause.

### E2 — NIST SP 800-53 Rev. 5.1/5.2: separation of duties

Sources:
- https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final
- https://csrc.nist.gov/CSRC/media/Projects/risk-management/800-53%20Downloads/800-53r5/SP_800-53_v5_1-derived-OSCAL.pdf

AC-5 requires organizations to identify duties requiring separation and define access authorizations accordingly. Its discussion explicitly says separation of duties reduces abuse of authorized privileges **without collusion**, and notes that violations can span systems and application domains, so organizations must consider the integrity of the whole system/component context.

**Extraction:** distinct accounts or role labels are weaker than separation of effective control. Independence is an organizational/authority property spanning domains, not a count of IDs.

### E3 — NIST dual authorization / two-person control

Source:
- https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-172r3.ipd.pdf

NIST describes dual authorization as two-person control and notes that it reduces insider/credential-compromise risk; it also recommends rotating dual-authorization duties to reduce collusion risk.

**Extraction:** two-person approval is explicitly threat-modelled. It reduces selected risks but does not make collusion or common administrative compromise impossible. Rotation changes the common-cause/collusion profile and therefore belongs to qualification, not merely UI workflow.

### E4 — The Update Framework (TUF), current v1 specification

Source:
- https://theupdateframework.github.io/specification/latest/

TUF supports roles with multiple keys and signature thresholds so compromise of fewer than the threshold does not compromise the role. It requires unique `KEYID`s when counting signatures. Root private keys should be kept very secure/offline; if a threshold of root keys is compromised, recovery is out-of-band and extremely difficult. TUF explicitly says making it difficult for attackers to compromise all offline keys is important.

**Extraction:** threshold semantics count distinct authorized keys, but the security argument additionally depends on how those keys are protected. `unique key IDs` is necessary for the cryptographic threshold but not sufficient evidence that one common cause cannot compromise enough keys.

### E5 — HashiCorp Vault Shamir seal/recovery shares

Sources:
- https://developer.hashicorp.com/vault/docs/concepts/seal
- https://developer.hashicorp.com/vault/docs/internals/security
- https://developer.hashicorp.com/validated-designs/vault/installation-guide/vms/detailed-design

Vault splits its unseal/recovery key using Shamir Secret Sharing and requires a configured threshold. Documentation recommends distributing shares among trusted individuals and notes that shares can reside on distinct client machines for better security. Vault also describes the scheme as supporting a two-person/multi-person rule.

**Extraction:** the provider supplies threshold mechanics and recommends distribution, but actual organizational/device independence is a deployment/governance fact external to the Shamir math. Five shares stored in the same password vault controlled by one administrator satisfy `n=5` storage representation while defeating the intended separation.

### E6 — AWS CloudHSM quorum authentication

Sources:
- https://docs.aws.amazon.com/cloudhsm/latest/userguide/quorum-authentication.html
- https://docs.aws.amazon.com/cloudhsm/latest/userguide/key-quorum-auth-chsm-cli.html
- https://docs.aws.amazon.com/cloudhsm/latest/userguide/key-quorum-auth-chsm-cli-crypto-user.html
- https://docs.aws.amazon.com/cloudhsm/latest/userguide/bp-hsm-user-management.html

CloudHSM supports M-of-N approval by distinct HSM users/signing keys. AWS recommends multiple admins and separation of crypto-user responsibilities. However, the requesting user may sign their own quorum token as one approval, and approver signing keys are created/protected outside the HSM.

**Extraction:** provider quorum proves that enough registered signatures were supplied for the configured operation. It does not establish that private keys were held by different human controllers, different enterprise administrators, different endpoints, or different cloud-account recovery authorities. Provider conformance must not silently upgrade `M distinct users` into `M independent authorities`.

### E7 — NASA common-cause failure evidence

Sources:
- https://ntrs.nasa.gov/citations/20240013667
- https://swehb.nasa.gov/spaces/SITE/pages/215777456/R009%2B-%2BSoftware%2BCommon%2BCause%2BRisk

NASA's 2024/2025 technical material emphasizes that redundancy improves reliability when failures are independent, but common-cause failures can defeat an entire redundant set. It identifies shared design, manufacturing, operations, maintenance, control, power and location as possible common causes, and recommends diversity/separation where warranted.

**Extraction:** redundancy/threshold value is conditional on the dependence structure. A common cause creates a floor below which adding more nominally redundant units cannot drive risk.

### E8 — Knight & Leveson, IEEE TSE 1986

Source:
- https://doi.org/10.1109/TSE.1986.6312924

Twenty-seven independently developed program versions were tested across one million cases. Coincident failures occurred substantially more often than expected under a naïve independence assumption.

**Extraction:** even deliberate process-level independence does not guarantee statistically independent failures when participants share specification/problem structure. This is adversarial evidence against a universal `independent=true` based on organizational labels or separate implementations.

## Competing models

### Model A — Distinct participant identity implies independence

```text
unique principal/key/provider IDs >= threshold
        ↓
independent quorum satisfied
```

**Strongest evidence for:** simple, deterministic and directly supported by TUF/CloudHSM/Vault mechanics.

**Evidence against:** TUF's own threat discussion requires secure/offline protection of keys; Vault recommends distribution; NIST separation of duties spans effective responsibilities; CloudHSM signing keys are protected outside the HSM; NASA and Knight/Leveson show common-cause/correlated failures defeat nominal redundancy.

**Disposition:** **DO_NOT_BUILD** as portable semantics.

### Model B — Independence requires universal physical/organizational separation

Every participant must use a distinct organization, cloud, HSM, IdP, administrator, geography, software stack and recovery path.

**Strongest evidence for:** maximizes diversity and minimizes many common causes.

**Evidence against:** excessive and often irrelevant. A two-person approval intended only to prevent accidental destructive action does not necessarily need multi-cloud independence. Different clouds can still share one enterprise IdP or operator; different organizations can share one vulnerable software implementation. Absolute independence is not achievable and is not required by every threat model.

**Disposition:** **REJECT as universal requirement**.

### Model C — Independence is a qualified relation relative to a declared threat/failure model

Conceptual shape, not frozen IR:

```text
Threshold / MultiPartyRequirement
    + protected operation/resource
    + tolerated threat/failure classes
    + required independence dimensions
    + participant set
    + participant-control/failure-domain evidence
    + freshness / revision / coverage
          ↓
Qualified Independence Claim
          ↓
capability-owned threshold / authority decision
```

The threshold owner still decides `2-of-3`, veto, unanimity, role composition, etc. A small cross-cutting relation can describe whether candidate participants satisfy the independence assumptions needed by that policy.

**Disposition:** **KEEP / GENERALIZE**, exact schema deferred to synthesis.

## Strongest evidence for and against a cross-cutting primitive

### For

The same problem recurs across:

- authorization four-eyes / dual control;
- TUF/release signing thresholds;
- HSM/KMS recovery/quorum;
- recovery and break-glass ceremonies;
- provider diversity and failover;
- Station/Enterprise joint approval;
- AI/human or multi-agent approval chains;
- multi-party Gate progression;
- replicated/fenced infrastructure where quorum assumptions depend on failure domains.

The recurring structure is not the domain decision itself; it is the qualification of **whether multiple evidence producers/authorities share disallowed common-control/common-failure ancestry**.

### Against

Independence dimensions are threat-specific and can become an unbounded ontology. Authorization, reliability, cryptographic thresholding and organizational governance use different models. A universal `IndependencePolicy` mega-object could erase semantic ownership and create false precision.

### Reconciliation

Generalize only the small relation:

> **a claim that a participant set satisfies a named, revisioned independence requirement for a specific scope/threat model, backed by evidence about relevant common-control/failure domains.**

Do not generalize threshold algorithms, risk weights, role semantics or the full failure ontology.

## Invariants

### I1 — Multiplicity is not independence

`distinct IDs`, `distinct keys`, `distinct credentials`, `distinct providers`, `distinct regions` and `distinct people` are evidence dimensions, not automatic proof of independence.

### I2 — Independence is relative

There is no useful universal claim `A independent_of B` without saying **with respect to what cause/threat/failure class and scope**.

### I3 — Threshold strength cannot exceed independence coverage

A `2-of-3` rule protects against one participant compromise only if the admitted threat model rules out one common cause controlling two required participants, or reports that risk as uncovered/residual.

### I4 — Cryptographic threshold and governance threshold are separate

Shamir/M-of-N/threshold signatures establish cryptographic contribution requirements. Organizational separation, device custody, IdP/account recovery and control-plane independence need separate evidence where required.

### I5 — Common roots must be visible

If two apparent authorities ultimately depend on the same root administrator, recovery account, signing service, KMS/HSM, IdP, policy administrator or provider control plane relevant to the threat model, the join must expose that common ancestry rather than count them as independent.

### I6 — Independence claims are revision/freshness scoped

Changing account ownership, key custody, provider binding, IdP, Station management, recovery path or infrastructure topology can invalidate prior independence evidence without rewriting its historical validity.

### I7 — Unknown ancestry is not independence

Where a mandatory independence dimension cannot be established, the correct result is `INCONCLUSIVE/PARTIAL`, not presumed diversity.

### I8 — More participants may improve availability while not improving compromise resistance

Adding signers/providers under the same control plane can increase operational availability but add little or no resistance to compromise of that control plane. Availability diversity and authority-compromise diversity must remain distinguishable.

### I9 — Provider claims cannot define SB independence truth

A provider may prove registered users, regions, availability zones, HSM partitions or quorum signatures. SB policy owns whether those facts satisfy the portable threat/failure requirement.

### I10 — AI/AGWS cannot manufacture independence

Two agents, two model calls, two personas or AI + AI-review do not count as independent authorities merely because their outputs differ. Human + AI is also not automatically two-party authority when the AI is not an admitted authority root.

## Candidate independence dimensions

These are research dimensions, not a frozen canonical enum:

1. **principal/custodian** — same human/service controller;
2. **organizational administration** — same administrative authority/team or superior override;
3. **credential/root** — same root key, CA, IdP, recovery credential or secret store;
4. **device/runtime** — same endpoint, HSM partition, host or privileged runtime;
5. **control plane/account** — same cloud/provider account, organization root or management API authority;
6. **infrastructure/fault domain** — shared region, zone, power, network, cluster, storage or physical site;
7. **software/supply-chain** — same implementation, build pipeline, dependency/signing root or vulnerable component;
8. **policy/evaluator** — same policy administrator/evaluator code or configuration source;
9. **recovery path** — one recovery/break-glass actor can replace/reset enough participants;
10. **information/specification** — shared requirements/model/input that can induce correlated error even with separate implementations.

Different policies select only the dimensions relevant to their threat/failure model.

## Failure and adversarial analysis

### Shared administrator, different keys

Three keys are stored in different HSM slots, but one administrator can reset credentials or authorize export/replacement for all three. A key-count threshold is cryptographically true; administrative independence is false.

### Separate humans, shared IdP recovery

Two employees separately approve an operation, but one IdP administrator can impersonate/reset both. Human distinctness is true; credential-root independence against IdP-admin compromise is false.

### Separate cloud providers, shared operator endpoint

Provider A and Provider B are independently operated companies, but both production credentials live on one privileged workstation. Provider diversity is true; operator-device compromise can affect both.

### Separate Stations, shared Enterprise override

Two Stations are distinct failure/runtime surfaces, but one Enterprise authority is constitutionally allowed to replace both local delegates. They may be independent against Station-local compromise yet not independent against Enterprise-root compromise. The claim must name the threat scope.

### Same implementation in multiple regions

Regional failure independence may be strong, while software/supply-chain common-cause independence is weak. A global bad release can defeat all regions.

### AI ensemble

Two models/providers agree on a dangerous privileged action. Their consensus may improve epistemic confidence, but unless each is independently authorized to approve the action, consensus does not create authority. If both share the same poisoned context/specification, model diversity may not even provide independent correctness evidence.

### Recovery path collapse

A production policy requires 3-of-5 custodians, but a single recovery administrator can re-enroll five replacement custodians. Day-to-day quorum is not the effective root authority against compromise of recovery administration.

## Provider-specific versus portable semantics

### Portable SB-owned semantics

- identity of the protected operation/scope;
- threshold/multi-party requirement identity and revision;
- declared threat/failure assumptions that require independence;
- participant authority identities and relevant ancestry/failure-domain references;
- qualified independence result with coverage, freshness and residual gaps;
- non-amplifying authority consumption and `INCONCLUSIVE` propagation;
- historical lineage when independence assumptions change.

### Capability-owned semantics

- Authorization owns role/person/delegation/four-eyes/break-glass meaning.
- Artifact/Release owns functionary/signing/release admission policy.
- Security/Recovery owns recovery ceremony and threat/residual-risk disposition.
- Station/AGWS owns Enterprise/Station delegated-administration boundaries.
- Transaction/Deployment own quorum/fencing/failure-domain requirements where needed for consistency/availability.
- AI-native Engineering owns whether an AI result is advisory, evidence-producing or an explicitly admitted authority role.

### Providerized mechanics

- Shamir secret sharing and Vault recovery shares;
- CloudHSM M-of-N tokens/signatures;
- TUF role/key thresholds;
- KMS/HSM custody mechanisms;
- cloud AZ/region/fault-domain metadata;
- IdP/MFA/recovery implementations;
- provider-specific approval workflows.

No provider object becomes canonical independence truth.

## Consequences for existing findings/candidates/hypotheses

### `DR-ABRT-01`

**HARDEN.** Externally rooted trust closure is necessary but insufficient for a multi-root/multi-party policy. When the policy claims tolerance of one compromised authority or common fault, the closure must additionally prove the required independence assumptions among the roots/participants.

### Qualified derived claims / UCA

**GENERALIZE cautiously.** Independence qualification fits the existing qualified-derived-claim pattern: subject participant set + requirement/profile revision + evidence closure + applicability/freshness → derived claim. This argues against inventing a separate universal evaluator.

### Authorization / Policy / Organization

**KEEP/SPECIALIZE.** Four-eyes, dual control, separation of duties and collusion policy remain authorization/governance-owned. The cross-cutting relation only prevents counting aliases/common controllers as independent where policy requires independence.

### Security / Recovery

**HARDEN.** Break-glass/recovery thresholds must account for recovery-path common cause. A recovery administrator able to replace enough participants is part of the effective trust closure and residual-risk model.

### AGWS / Station authority

**HARDEN.** Multiple Station approvals do not prove constitutional independence if a common Enterprise root may control/impersonate all Stations for the threat under analysis. Conversely, they can still be validly independent against a Station-local failure; the scope must be explicit.

### Provider/Binding

**GENERALIZE.** `provider_count > 1` does not prove provider independence. Provider support vectors should be able to expose shared control/failure dependencies relevant to a portable requirement.

### AI-native Engineering

**DO_NOT_BUILD** `two-model approval = four-eyes`. Model ensembles are epistemic mechanisms unless explicit independent authority grants exist. Shared prompt/context/toolchain/provider ancestry can create common-cause correctness failure even when model IDs differ.

### Candidate disposition

No new top-level capability is warranted. At synthesis, consider a small cross-cutting **qualified independence/common-cause relation** merged with UCA qualified-derived-claim/evidence structures. Exact naming and dimensional vocabulary remain deferred.

## Proposed research dispositions

| Disposition | Recommendation |
|---|---|
| **KEEP** | Capability-owned threshold/quorum/four-eyes semantics and authority decisions. |
| **HARDEN** | `DR-ABRT` trust closure with common-control/common-failure qualification whenever the policy claims multi-party independence. |
| **GENERALIZE** | Small relation for `participant set + independence requirement/threat model + evidence closure + applicability → qualified independence claim`. |
| **MERGE** | Reuse qualified-derived-claim provenance/freshness/evidence machinery rather than create an independent mega-framework. |
| **SPECIALIZE** | Organizational separation of duty, cryptographic key custody, recovery ceremonies, infrastructure diversity and software diversity remain domain profiles. |
| **PROVIDERIZE** | TUF/Vault/CloudHSM/KMS/HSM/quorum implementations and cloud fault-domain mechanics. |
| **DEFER** | A universal taxonomy/quantitative probability model for dependence until synthesis proves it necessary. |
| **DO_NOT_BUILD** | `independent=true`; `distinct IDs == independent`; `different provider/region == independent`; `2 models == 2 authorities`; a universal scalar independence score. |

## Proof obligations / falsification paths

### DR-TICCAF-01 — Same-controller keys
Configure `2-of-3` distinct keys whose custody/recovery all resolves to one administrator. Cryptographic threshold is satisfied as configured, but an independence policy requiring separate administrative control must fail/return `INCONCLUSIVE`.

### DR-TICCAF-02 — True dual custody
Use two independently authenticated custodians with separately controlled credentials/devices and no single allowed recovery authority under the declared threat model. The dual-control requirement should qualify while preserving evidence of scope and assumptions.

### DR-TICCAF-03 — Shared IdP administrator
Two human approvers use separate accounts but one IdP administrator can reset/impersonate both. A requirement resistant to one IdP-admin compromise must reject their independence.

### DR-TICCAF-04 — Threat-relative result
The same two approvers may qualify as independent against accidental individual action but fail independence against IdP-admin compromise. Prove no global boolean result is reused across threat profiles.

### DR-TICCAF-05 — TUF unique-key threshold
Provide valid threshold signatures from unique TUF-style key IDs whose private keys are all controlled by one compromised signer service. Signature threshold verifies; stronger custody-independence claim must not automatically PASS.

### DR-TICCAF-06 — Vault Shamir co-location
Create multiple Shamir shares but place enough shares under one common credential/device. Secret-sharing mechanics remain correct while governance-independence proof fails.

### DR-TICCAF-07 — CloudHSM quorum external-key custody
Satisfy CloudHSM quorum with distinct HSM users whose approver private keys are independently controlled, then repeat with keys retrievable by one admin. Provider quorum success is identical; SB independence qualification differs.

### DR-TICCAF-08 — Multi-provider/shared account root
Bind two providers whose operational credentials are controlled through one organization/root recovery account. Provider diversity cannot satisfy a control-plane-independence requirement.

### DR-TICCAF-09 — Multi-region/common software
Deploy in separate regions but inject one signed defective release to all regions. Availability-zone diversity must not be reported as software/common-release independence.

### DR-TICCAF-10 — Common infrastructure failure
Place nominally redundant authorities behind one network/power/control component and fail it. A requirement for infrastructure failure independence must detect insufficient diversity.

### DR-TICCAF-11 — Recovery authority collapse
Day-to-day `3-of-5` custodians exist, but one recovery principal can replace/re-enroll three. A compromise-resistance proof must include recovery ancestry and fail the claimed threshold resistance.

### DR-TICCAF-12 — Root/administration revision invalidation
Qualify a participant set, then change IdP/root/account ownership so two members share a common controller. Historical claim remains valid for its original revision; current applicability must become stale/re-evaluated.

### DR-TICCAF-13 — Missing ancestry
Hide required custody/control-plane evidence for one participant. Expected result is `INCONCLUSIVE/PARTIAL`, not assumed independence.

### DR-TICCAF-14 — Station-local versus Enterprise threat
Two Stations independently approve an operation. Prove they may qualify against a Station-local compromise profile while failing a profile that assumes compromise of their shared Enterprise root.

### DR-TICCAF-15 — AI ensemble non-authority
Two model providers independently recommend approval. Without explicit authority grants, threshold authority remains unsatisfied regardless of agreement.

### DR-TICCAF-16 — AI/common-context correlation
Two distinct models consume the same poisoned evidence/context and agree incorrectly. Model/provider diversity must not be represented as proven epistemic independence without a corresponding evidence/threat profile.

### DR-TICCAF-17 — Collusion versus common-cause distinction
Two genuinely separate human controllers intentionally collude. Technical/control-plane independence can still be true while the policy's collusion-resistance objective fails. Prove result dimensions are not conflated.

### DR-TICCAF-18 — Availability versus compromise diversity
Add three replicas/signers under one control plane. Demonstrate availability improves under individual-node failure while compromise-resistance against control-plane takeover does not automatically increase.

### DR-TICCAF-19 — Provider substitution
Replace one participant provider with another that shares a previously independent recovery/control root. The threshold policy remains unchanged but the prior independence claim becomes inapplicable until requalified.

### DR-TICCAF-20 — Simple-system ergonomics
A low-risk single-runtime system with no declared multi-party independence requirement must not require enterprise dependency graphs or quorum ceremonies. The richer qualification machinery activates only when a requirement depends on independence.

### DR-TICCAF-21 — Common-specification correlated defect
Run two independently implemented validators from one flawed semantic specification. Demonstrate that implementation diversity alone does not establish independence from specification error, preserving Knight/Leveson-style correlated-failure risk.

### DR-TICCAF-22 — Independence evidence cannot authorize
Produce a valid `QualifiedIndependenceClaim` for two actors but omit the capability-owned authorization/grant for the protected action. Independence evidence alone must never confer actuation authority.

## Unresolved questions

1. What is the minimum portable vocabulary for common-control/failure-domain references without creating a universal risk ontology?
2. Should independence requirements reference named threat/failure profiles owned by Security/Governance, or can each authority policy define its own dimensions?
3. How should probabilistic/correlated risk be represented, if at all, versus categorical `satisfies / partial / inconclusive / fails` qualification?
4. How should organizational/legal independence be evidenced in machine-verifiable form without pretending HR/governance facts are cryptographic facts?
5. When provider internals are opaque, what minimum attestation/conformance evidence is enough to claim distinct failure domains?
6. Does a common Enterprise root intentionally override Station independence, or should some high-assurance Station profiles prohibit such superior override for selected operations?
7. How should break-glass preserve recoverability without making one recovery path a universal common cause that nullifies every steady-state threshold?
8. Can commercial/SLA requirements consume independence evidence without creating pressure to game topology labels or provider counts?

## Confidence

**High** on the following:

- threshold/multiplicity is not equivalent to independence;
- independence is relative to an explicit threat/failure model;
- common administrative, credential, recovery, software and infrastructure roots can defeat nominal redundancy;
- provider quorum success must not be promoted to portable independence truth;
- independence evidence must not itself confer authorization.

**Medium-high** that G2 benefits from a small cross-cutting qualified-independence relation merged with qualified-derived-claim/evidence machinery.

**Medium/DEFER** on the final dimension vocabulary and whether any quantitative dependence/risk model belongs in portable architecture.

## Research recommendation

The strongest synthesis is:

> **A multi-party/threshold authority claim is only as strong as the independence assumptions it can prove for the threat/failure model it claims to tolerate. Count identities for cryptographic mechanics; qualify common control and common failure separately for semantic assurance.**

Portable conceptual relation:

```text
participant set
+ threshold/multi-party requirement revision
+ protected scope
+ threat/failure profile
+ required independence dimensions
+ participant-control/failure-domain evidence closure
+ freshness/applicability
       ↓
Qualified Independence Claim
       ↓
capability-owned authority/admission/consistency decision
```

This should **GENERALIZE only as a small qualified relation**, **MERGE** with UCA qualified-derived-claim/evidence machinery, and remain **SPECIALIZED** for Authorization, Security/Recovery, Station, Artifact/Release, Provider/Binding and distributed-consistency owners.

Do **not** create a universal threshold engine, universal scalar independence score or provider-derived `independent=true` fact.

## Recommended next deep question

**Recovery Authority Root vs Steady-State Separation of Duties.** If day-to-day authority is deliberately split across independent custodians/providers but emergency recovery can reset, replace or re-root those authorities, how can G2 preserve recoverability without making the recovery plane a hidden single common-cause super-root? Research should reconcile break-glass, root rotation/recovery, offline Stations, HSM/KMS recovery, enterprise superior authority, survivable administration and post-emergency requalification.
