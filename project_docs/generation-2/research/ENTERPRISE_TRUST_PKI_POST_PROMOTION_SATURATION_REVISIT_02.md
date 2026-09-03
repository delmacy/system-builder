# Generation 2 — Enterprise Trust / PKI / Certificate Lifecycle — Post-Promotion Saturation Revisit 02

Status: ELIGIBLE_NO_MATERIAL_FINDING_REVISIT_2_OF_2 / SATURATED
Phase: RESEARCH_ELICITATION
Capability: `G2-CAPABILITY-CANDIDATE-ENTERPRISE-TRUST-PKI-CERTIFICATE-LIFECYCLE`
Classification: CROSS_CUTTING / PROMOTED / SATURATED
Method: research-by-exception against the promoted dossier and revisit 01. This revisit deliberately used alternate/current operational representatives and only treats a genuinely new primitive, semantic owner, authority boundary, failure class or portability dimension as material.

## Research question

Can current operational PKI evidence falsify the existing model of applicability-scoped trust qualification, independent issuer/anchor/bundle revisions, explicit issuance/revocation lifecycle, root/intermediate overlap, consumer-effective adoption, residual drainage, provider substitution and disconnected evidence horizons?

## Representatives and evidence ledger

| Representative | Exception tested | Evidence | Result |
|---|---|---|---|
| AWS Private CA revocation | Whether provider-side revoke success proves effective relying-party revocation | https://docs.aws.amazon.com/privateca/latest/userguide/PcaRevokeCert.html | No exception. AWS states that effective revocation depends on clients checking status; OCSP and CRL publication have propagation delays. Already represented by revocation evidence currentness plus consumer-effective trust. |
| AWS Private CA lifecycle | Whether CA succession can be treated as in-place replacement | https://docs.aws.amazon.com/privateca/latest/userguide/ca-lifecycle.html | No exception. AWS recommends a new CA generation and notes coexistence of unexpired generations. Already represented by issuer identity/revision, rollover window and residual consumer drainage. |
| Google Cloud CA Service rotation | Whether enabling a new CA is sufficient proof of cutover | https://docs.cloud.google.com/certificate-authority-service/docs/managing-ca-rotation | No exception. Google requires clients to receive the new certificates, allows old/new issuance overlap, then waits until clients stop using old certificates before deletion. This directly matches overlap → consumer observation → drainage → retirement. |
| Google Cloud CA Service settings/states | Whether trust-root change is merely provider metadata | https://docs.cloud.google.com/certificate-authority-service/docs/certificate-authority-settings and https://docs.cloud.google.com/certificate-authority-service/docs/certificate-authority-states | No exception. Root replacement requires relying-party trust-store change; staged/enabled lifecycle separates existence from effective issuance readiness. Already represented by trust-anchor distribution, provider state and consumer-effective qualification. |
| Kubernetes kubelet certificate rotation | Whether workload certificate renewal can collapse issuance and effective use | https://kubernetes.io/docs/tasks/tls/certificate-rotation/ | No exception. Kubelet requests a new certificate, retrieves it, then reconnects using the new certificate. This is a concrete realization of issuance → materialization → consumer-effective generation. |
| Kubernetes CA rotation | Whether all platforms offer equivalent CA rotation semantics | https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/ and https://kubernetes.io/docs/tasks/tls/manual-rotation-of-ca-certificates/ | No exception. kubeadm explicitly lacks automatic CA replacement out of the box and requires manual rotation procedures, reinforcing the existing mixed provider/tooling support vector rather than adding a new universal primitive. |

## Research-by-exception result

No material architectural finding was discovered.

The alternate representatives strengthen six already-authoritative conclusions:

1. **Revocation is not provider acknowledgement.** Revocation becomes effective only when relying consumers have sufficiently current status evidence.
2. **CA/root rotation is coexistence plus drainage.** New and old trust generations can coexist; retirement requires evidence that residual consumers no longer depend on the old generation.
3. **Existence is not effective trust.** A staged/enabled CA, downloaded bundle or newly issued certificate is not equivalent to consumer-effective trust qualification.
4. **Workload renewal preserves lifecycle boundaries.** Request, issuance, materialization and effective connection/use remain distinguishable even in automated rotation.
5. **Provider equivalence must be vector-qualified.** Kubernetes, AWS and Google expose materially different automation and rotation capabilities while still realizing the same portable trust semantics.
6. **Root changes are relying-party changes.** Provider-side root creation cannot substitute for distribution and acceptance by each applicable consumer population.

These are confirmations of `G2-FINDING-ETPKI-*` and `G2-FINDING-ETQP-01..08`, not new findings. No stable finding ID is minted merely to increase the index.

## Source of truth

No source-of-truth change is required. The existing split remains sufficient:

- portable trust intent and policy revision;
- provider issuer realization and issuer revision;
- trust-anchor/bundle revision and provenance;
- immutable certificate identity/profile/validity;
- revocation/currentness evidence with an explicit horizon;
- consumer-effective trust generation;
- residual consumer cohort/drainage state.

AWS propagation delays and Google client-distribution requirements specifically confirm why provider control-plane state cannot be promoted to canonical effective-trust truth.

## Identity, lifecycle and versioning

No new identity primitive is required beyond the promoted dossier's `TrustDomainId`, `TrustRelationshipId`, policy/anchor/issuer revisions, provider binding, certificate/order identities, revocation evidence, rollover window, consumer-effective generation and Station trust closure.

The lifecycle remains:

`request/authorize → issue → distribute/materialize → consumer-observe → qualify → renew/rotate with overlap → requalify → drain residual consumers → retire old issuance/anchor → retain evidence`.

Google's documented sequence for CA rotation is an especially direct operational instance of this lifecycle. Kubernetes kubelet rotation provides an independent workload-level realization of the same separation.

## Failure semantics and evidence horizons

No new failure class is required. AWS documents delay between revocation and OCSP/CRL visibility; this is already representable as currentness-qualified evidence and `REVOCATION_STATUS_UNDETERMINED`/stale evidence rather than an immediate global `REVOKED` claim. Root/CA replacement that has not reached all consumers remains `ROTATION_PARTIALLY_CONVERGED` or consumer-generation unknown.

Disconnected/offline semantics remain unchanged: locally retained anchor/bundle/status evidence is usable only inside its declared policy horizon. The reviewed provider material adds no basis for extending that horizon implicitly.

## Extensibility, provider boundaries and portability

No boundary correction is required. CA cryptography, signing, CRL/OCSP serving, native lifecycle mechanics and provider IDs remain provider responsibilities. System Builder's portable responsibility remains trust intent, typed lineage, support requirements, qualification and proof obligations.

The reviewed evidence reinforces the mixed support vector already defined: CA hierarchy, rotation automation, revocation mechanism/freshness, bundle/trust-store distribution, workload integration, delegated authority, offline behavior, evidence export/replay and coexistence/drainage behavior.

Provider substitution therefore remains a fresh qualification event. `supports X.509` or `supports CA rotation` is not a sufficient equivalence claim.

## Governance and authority

No new authority primitive is required. Trust-policy, trust-anchor, issuer, issuance, revocation, rotation, provider binding and delegated Station authority remain distinct. AWS cross-account revocation permissions further reinforce that issuance/use access does not imply revocation authority.

`Enterprise → Station → Role → Person` remains monotonic. A Station can narrow only explicitly delegated trust scope and cannot introduce an unapproved root, weaken revocation/currentness, extend an offline horizon or acquire provider administration by composition.

Adaptive Governed Work Surfaces remains separate and CORE. AGWS/AI can consume qualified trust bindings but cannot manufacture trust evidence, mutate canonical trust policy, acquire CA administration or transform stale/unknown evidence into PASS.

## Observability

The current evidence model remains sufficient: desired/observed issuer revision, anchor/bundle revision, certificate identity/validity, rotation attempt, revocation publication/currentness, consumer-effective generation, residual old-generation consumers, provider health and offline horizon.

AWS revocation publication latency and Google client-drainage guidance reinforce the need to observe both provider state and relying-party adoption rather than conflate them.

## Product-specific mechanisms versus universal primitives

AWS Private CA CRL/OCSP publication, Google CA pools/states and Kubernetes CSR/kubelet/kubeadm rotation are provider/product mechanisms. None requires a new universal primitive beyond trust relationship, anchor/bundle revision, issuer lifecycle, certificate profile/identity, revocation currentness, overlap/drainage, consumer-effective trust, provider binding and evidence provenance.

## Current System Builder comparison

No new repository claim is made. The bounded current-SB evidence remains ADR-0015: PostgreSQL transport-level `verify-ca`/`verify-full`, fail-closed positive verification, external CA material and rendered autonomous Runtime parity. It does not prove the promoted enterprise trust capability. Repository-validation questions about where portable trust identities and effective-consumer evidence fit remain intentionally deferred to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Hypothesis disposition

- **KEEP** existing proven transport identity verification.
- **HARDEN** consumer-effective/currentness evidence.
- **GENERALIZE** trust intent, identity, lifecycle and qualification above provider mechanics.
- **PROVIDERIZE** CA/enrollment/revocation/bundle/key-custody implementations.
- **INTEGRATE** with Identity, Secrets, Security, Deployment, Provider Binding and Observability while preserving ownership.
- **REPLACE**: unsupported.
- **DEFER / DO_NOT_BUILD** bespoke CA cryptographic implementation absent later product evidence.

## Symbiotic Proof

An Enterprise declares portable trust intent. A Station binds it to an authorized provider realization and consumes a revisioned anchor/bundle and issuer generation. During provider or CA rotation, old and new generations coexist while consumer-effective adoption is observed. The old generation is retired only after residual consumers are drained or explicitly dispositioned. Revocation is qualified by current status evidence at the applicable relying population, not merely by provider API acknowledgement. Offline operation remains bounded by declared evidence horizons. AGWS and AI can use the resulting qualified trust relationship without obtaining trust-policy or provider-admin authority. The model therefore remains portable, governable and non-amplifying across AWS, Google and Kubernetes realizations.

## Saturation decision

**No new material architectural finding. No new candidate. Principal representative coverage remains sufficient.**

This is the second consecutive eligible no-material-finding revisit after `ENTERPRISE_TRUST_PKI_POST_PROMOTION_SATURATION_REVISIT_01.md`. Under the authoritative saturation rule, `G2-CAPABILITY-CANDIDATE-ENTERPRISE-TRUST-PKI-CERTIFICATE-LIFECYCLE` is therefore **SATURATED**.

This decision applies only to Enterprise Trust / PKI / Certificate Lifecycle. It does not close RESEARCH_ELICITATION, waive saturation for another capability or authorize CAPABILITY_SYNTHESIS.

## Value / risk / priority / next question

Value: closes the promoted PKI capability under the normal, non-waived saturation rule with independent operational evidence.
Risk: treating provider-side state as effective trust remains the dominant implementation hazard and must be protected during later reconciliation/planning.
Priority: rotate to the next promoted capability still at eligible streak 1/2 according to the authoritative state.
Next question: none externally material for PKI; remaining questions are repository reconciliation questions for Planning B.
