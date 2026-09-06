# Generation 2 — Authorization / Policy / Organization / Multitenancy — Full Pass 8 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Authorization / Policy / Organization / Multitenancy
Pass: 8

Research only. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, and `external provider state != canonical authority != actual physical/media access success`.

## 1. Technique rotation

This revisit uses a materially different attack from Pass 7: **decision/effect cut mutation + policy-revision crossing + evidence subtraction + operability-readiness fracture**. It carries Typed Semantic Graph/Execution, autonomous builds/Fleet, federation, control-flow, mathematical/vector/uncertainty semantics, soundness/proof, temporal/provenance/decision/unit/queue/graph-revision/causal research, Legacy Mirroring/Brownfield, bounded Physical/Peripheral integration-plane semantics, and Elicitation/System Understanding.

Probes:

1. pin versus omit policy/model revision while work remains in flight;
2. mutate subject/resource/tenant/site/context dimensions independently after a decision but before effect;
3. separate decision result, authorization evidence, provider grant state, propagated state, actual effect and later observation;
4. subtract evidence/currentness while preserving a superficially valid `allow` or external grant;
5. cross delegation, break-glass and SoD with temporal expiry, queue delay and residual sessions/credentials;
6. exercise policy evaluation under queue/admission/fairness pressure and stale/offline local caches;
7. treat Brownfield roles/groups/ACLs as observed claims rather than desired canonical authority;
8. constrain Physical/Peripheral grants to provisioning/brokering/reconciliation evidence, never implicit actuation;
9. falsify elicitation completeness by removing semantic owner, model revision, source-of-truth, failure/recovery, SLO/currentness or escalation answers;
10. compose AI/low-code individually allowed operations to test aggregate authority amplification;
11. keep causal/counterfactual evidence non-authoritative;
12. duplicate-screen all 124 reusable ConflictPatterns before admitting novelty.

Authorization and all 12 mandatory clusters already have no-material streak 2; streaks remain capped absent material novelty.

## 2. Comparative evidence

### OpenFGA model revision is part of decision context

OpenFGA authorization models are immutable revisions. Production guidance recommends explicitly passing/pinning `authorization_model_id`; otherwise evaluation uses the latest model. Model migrations can require coordinated tuple/application changes and progressive rollout/shadow checks.

Research inference: `allowed under model M != allowed under latest M+1 != effect authorized under the revision/context that owns an in-flight operation`. Policy revision is a first-class qualification candidate, but this does not itself prescribe OpenFGA or a canonical graph representation.

Sources:
- https://openfga.dev/docs/getting-started/immutable-models
- https://openfga.dev/docs/modeling/migrating/migrating-models
- https://openfga.dev/docs/modeling/testing

### SCIM role/group vocabulary is provider-owned

RFC 7643 provides `roles`, `entitlements` and groups but intentionally does not define a portable authorization model; authorization effects of group membership are provider-defined.

Research inference: `external role/group label != canonical permission semantics`. Provisioning success cannot silently establish semantic equivalence or stronger authority.

Source: https://www.rfc-editor.org/rfc/rfc7643

### Least privilege and separation of duties remain independent obligations

NIST access-control guidance treats account management, access enforcement, separation of duties and least privilege as distinct controls. A successful decision or provider mutation therefore does not collapse lifecycle, SoD, review, session termination or evidence obligations into one boolean.

Sources:
- https://csrc.nist.gov/projects/risk-management/about-rmf/assess-step/assessment-cases-download-page
- https://nvlpubs.nist.gov/nistpubs/SpecialPublications/800-171r3/NIST.SP.800-171r3.html

## 3. Adversarial candidates and duplicate-screen

No candidate survives as a new material scenario or 125th ConflictPattern.

| Candidate | Disposition |
| --- | --- |
| in-flight operation evaluated under M, effect occurs after M+1 changes authority | temporal/currentness + revision coexistence + authority/effect evidence — DUPLICATE |
| omitted model ID silently evaluates latest while another service remains pinned | version/profile mismatch + distributed truth + proof-claim qualification — DUPLICATE |
| provider grant ACK succeeds while tenant/site/resource dimension is semantically widened | provider semantic mismatch + authority non-amplification + no-silent-drop — DUPLICATE |
| break-glass expires canonically but queue delay/offline enforcement keeps access effective | authority currentness + residual cohort + resource/capacity + exception lifecycle — DUPLICATE |
| SoD-valid request path becomes SoD-invalid through delegated aggregate permissions | authority composition + semantic ownership + policy conflict — DUPLICATE |
| local autonomous cache continues a previously valid decision while Fleet/provider evidence is stale | currentness + local-first autonomy + distributed truth — DUPLICATE |
| Brownfield ACL is observed and AI promotes it directly to desired canonical policy | observed-vs-desired + assumption-to-fact + AI authority non-amplification — DUPLICATE |
| Physical/Peripheral provider role is treated as proof of actual camera/door/media access | provider state/effect fracture + physical integration-plane boundary + proof-claim conflation — DUPLICATE |
| policy evaluation queue reports healthy average while security-critical revokes starve | queue/fairness + objective conflict + scalarization loss + authority currentness — DUPLICATE |
| authorization elicitation marked resolved without owner/revision/currentness/recovery evidence | false completeness + evidence sufficiency + unresolved critical-gap family — DUPLICATE |
| causal correlation between grant and access event is promoted to authority/proof | causal non-strengthening + provenance non-authority — DUPLICATE |
| AI/low-code composes individually allowed read/provision/broker operations into stronger provider reach | confused deputy + aggregate authority amplification + provider boundary — DUPLICATE |

The strongest candidate is **policy-revision crossing between decision and effect**. Fresh OpenFGA evidence makes the failure mode concrete: immutable models, explicit model IDs, migration ordering and progressive rollout mean that `latest` is not a stable semantic identity. However, the repository already owns the necessary reusable families: temporal/currentness, version coexistence, authority/effect evidence, provider qualification and false convergence. No new stable pattern ID is justified.

## 4. Elicitation and operability lens

Authorization understanding is not complete merely because stakeholders can state roles or because a decision engine returns a boolean. Candidate lens questions include:

- Who owns canonical authority for subject, organization, tenant, site, resource and operation class?
- Which policy/model revision applies, and how are in-flight operations pinned or re-evaluated?
- What are the source, currentness and evidence requirements for identity, membership, contextual claims and provider state?
- Which delegations, SoD constraints, emergency grants, expiry and review obligations exist?
- Which states may be `PARTIAL/UNKNOWN`, and what happens during provider/Fleet/network outage?
- How quickly must grant/revoke/deprovision converge; what queue/backlog/headroom is acceptable?
- How is stale/offline authorization detected, reconciled and escalated?
- Which Brownfield roles/ACLs are facts about current behavior versus desired requirements?
- Which external Physical/Peripheral scopes support read/provision/broker/reconcile, and which explicitly do not imply actuation?
- What evidence proves decision, propagation, effect and later convergence separately?

Coverage remains multidimensional; no scalar completeness score is introduced. `answered != resolved != evidenced != production-ready`.

## 5. Standing-hypothesis disposition

- Typed Semantic Graph remains a candidate representation; no GraphDB requirement emerges.
- `CapabilityDefinition != CapabilityUse`; policy definition/revision, decision occurrence, execution state/journal and provider realization remain distinct.
- `semantic topology != deployment/runtime/provider topology != local evidence != Fleet aggregate != authority`.
- Federated systems remain autonomous contract domains; shared mutable authorization state is not required.
- Provenance records lineage but does not create authority or causal proof.
- Decision semantics remain distinct from workflow timing and calculation derivation.
- Queue/capacity and risk/currentness remain multidimensional; scalar green health cannot erase a security-critical dimension.
- Physical/Peripheral remains integration/governance plane by default; no generic actuation capability is inferred.
- AI inference remains candidate-only and cannot close critical authority/evidence gaps.

## 6. Carry-forward

Planning C must later decide authorization semantic ownership, temporal/revision/currentness model, decision versus effect representation, tenant/site qualification, delegation/SoD/break-glass semantics, external provider mapping, local autonomy/Fleet boundary, Elicitation Knowledge Base ownership and Physical/Peripheral non-actuation boundary. This is research input, not architecture selection.

Planning D must preserve coexistence of old/new policy revisions, residual accounts/sessions/provider grants, Brownfield mappings and staged connector/provider migration.

Planning E must prove revision-pinned decisions, negative/deny cases, delegation/SoD, expiry/revocation, `PARTIAL/UNKNOWN`, provider semantic-loss diagnostics, offline autonomy, reconciliation, cross-tenant/site isolation, no silent escalation into physical control, and no false elicitation/readiness completion.

## 7. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- ConflictInstances: **0**;
- preventive invariants: **0**;
- Planning-A backfill: **0**;
- Authorization streak: **2, preserved/capped**;
- mandatory-cluster streaks: **2, preserved/capped**;
- material inventory: **284 edge scenarios + 124 ConflictPatterns = 408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 8 capability coverage after this revisit: **17/28**;
- completed full passes: **7/8 minimum**;
- negative-space: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

## 8. Next rotation

Continue only Full Pass 8 with **Governance / Compliance / Audit**. Use materially different probes around temporal control applicability, control/evidence scope and revision, audit completeness versus provenance/authority/causal proof, waiver/exception expiry, policy-to-provider enforcement drift, remediation acknowledgement versus effective closure, privacy/retention of audit/access/event evidence, offline/residual noncompliance, pagination and omitted populations, tenant/site attribution, risk-vector scalarization, human vendor-console procedures, Elicitation/System Understanding and Production Readiness Coverage, Physical/Peripheral integration-plane controls, and AI/low-code control fabrication/bypass. Duplicate-screen all 124 ConflictPatterns. Governance streak is already 2 and remains capped absent material novelty. Do not enter Planning C.