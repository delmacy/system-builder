# Generation 2 — Enterprise Trust / PKI / Certificate Lifecycle Edge-Case Register

Status: ACTIVE RESEARCH
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 1
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Canonical distinctions preserved: cryptographic validity != canonical identity != business authorization; issued != distributed != consumer-effective != currently trusted; provider acknowledgement != trust convergence; trust material possession != current path/revocation qualification; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; `UNKNOWN -> reconcile-before-retry`; provider IDs are non-canonical; AI/AGWS cannot amplify trust authority.

## Evidence ledger

1. RFC 5280 path validation is time-sensitive and trust-anchor-scoped; certificate validity includes `notBefore/notAfter`, revocation checking depends on current status evidence, and CRL freshness is policy/currentness-sensitive. RFC 5280 also notes revocation dissemination can lag CRL publication intervals. Source: RFC 5280, RFC Editor, accessed 2026-09-04.
2. RFC 9608 demonstrates that revocation availability itself is profile-dependent: some short-lived certificate profiles intentionally publish no revocation information. Therefore `no status response` cannot have one universal interpretation detached from certificate/profile semantics. Source: RFC 9608, RFC Editor, accessed 2026-09-04.
3. SPIFFE separates trust-domain identity, SVIDs and trust bundles. Trust bundles rotate over time; workloads retrieve refreshed bundles/credentials, and federation requires the latest available bundle for subsequent connections. Sources: SPIFFE Concepts, Trust Domain and Bundle, Federation, accessed 2026-09-04.
4. Planning A owns trust anchors/path/currentness/revocation, issuance/rotation, overlapping generations, consumer adoption, residual drainage and provider substitution while explicitly separating PKI trust from Identity and Authorization.
5. Planning B evidences only bounded PostgreSQL CA-backed server verification in current SB; generalized OCSP/CRL currentness, issuer rotation, provider-neutral PKI lifecycle, residual drainage and disconnected horizons are not currently evidenced.

Portable conclusion: a certificate or signature can be cryptographically valid for one path/time/profile while the enterprise trust claim is stale, inapplicable, revoked, not yet consumer-effective, or insufficient for business authorization.

## Local material edge cases

### G2-EDGE-TRUST-001 — path validates against stale or wrong trust-anchor generation
- Activation: anchor/bundle rotates, consumers update asynchronously, federation/provider substitution occurs, or a cached path uses a retired generation.
- Expected safe behavior: qualification binds path result to trust-domain, anchor/bundle revision, policy revision, relying population and evidence time; stale/unknown generations remain explicit.
- Forbidden behavior: any cryptographically valid chain is promoted to current enterprise trust.
- Effect disposition: `TRUSTED | DENIED | PARTIAL | INCONCLUSIVE` according to qualified policy/currentness, never silent trust.
- Owners: Enterprise Trust/PKI + Provider/Binding + relying runtime owner.
- Evidence/currentness: current bundle/anchor generation and consumer-effective adoption evidence.
- Recovery/future route: requalify path and residual consumers; do not prescribe mechanism.
- Blast radius: workload→enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-use/runtime. Reversibility: difficult after accepted effects. Time-to-harm: immediate. Misuse likelihood: plausible/adversarial.
- Proof obligation: stale/retired anchor acceptance cannot silently qualify as current trust.

### G2-EDGE-TRUST-002 — revocation/status evidence is stale, unavailable or semantically inapplicable
- Activation: CRL/OCSP/status source unavailable, `nextUpdate`/horizon exceeded, offline operation, responder lag, or profile explicitly has no revocation mechanism.
- Expected safe behavior: status evidence is interpreted under certificate/profile/policy semantics and freshness horizon; unavailable is not automatically good or revoked.
- Forbidden behavior: cached `good`, missing response, or transport success is treated as timeless non-revocation.
- Effect disposition: policy-qualified DENY/DEGRADE/INCONCLUSIVE.
- Owners: Enterprise Trust/PKI + policy owner + provider realization.
- Evidence/currentness: producing status generation, freshness/horizon, certificate/profile applicability.
- Recovery/future route: reacquire or explicitly operate inside a bounded authorized horizon.
- Blast radius: session→enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-use/runtime. Reversibility: mixed. Time-to-harm: immediate/latent. Misuse likelihood: likely.
- Proof obligation: stale/missing status cannot manufacture current trust, while profiles with intentionally absent revocation are not falsely rejected by a universal rule.

### G2-EDGE-TRUST-003 — renewal/rotation race creates incompatible old/new relying cohorts
- Activation: new certificate/issuer/anchor is issued while consumers, trust stores, proxies or workloads adopt at different rates; old generation remains active.
- Expected safe behavior: overlap is explicit, generations are distinguishable, and retirement requires consumer-effective drainage or governed residual disposition.
- Forbidden behavior: issuer/provider ACK or new material presence declares rotation complete.
- Owners: Enterprise Trust/PKI + Deployment/Runtime + Provider/Binding.
- Evidence/currentness: consumer-effective generation inventory.
- Recovery/future route: reconcile cohorts and qualification; no universal rollout mechanism selected.
- Blast radius: workload fleet/system. Severity: HIGH/CRITICAL. Confidence: strongly supported. Detectability: runtime/post-effect. Reversibility: bounded but operationally costly. Time-to-harm: immediate. Misuse likelihood: likely.
- Proof obligation: overlapping generations cannot silently split trust semantics or permit premature retirement.

### G2-EDGE-TRUST-004 — key compromise and emergency rotation conflict with continuity
- Activation: key/issuer compromise requires urgent revocation/rotation while workloads still depend on old trust material or are offline.
- Expected safe behavior: containment authority and continuity objective remain distinct; emergency change cannot silently extend compromised trust, and residual cohorts remain visible.
- Forbidden behavior: availability pressure re-admits compromised material or lower scopes extend trust horizons.
- Owners: Enterprise Trust/PKI + Security/Resilience + Authorization/Governance.
- Evidence/currentness: compromise epoch, revocation/rotation generation, consumer adoption and authority envelope.
- Recovery/future route: owner-qualified containment/rotation/reconnection reconciliation.
- Blast radius: system→enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-action/runtime. Reversibility: potentially irreversible. Time-to-harm: immediate. Misuse likelihood: adversarial/likely.
- Proof obligation: emergency continuity cannot amplify authority or resurrect compromised trust.

### G2-EDGE-TRUST-005 — cryptographic validity is confused with identity or authorization
- Activation: certificate/SVID/provider credential validates cryptographically but maps ambiguously to canonical subject, tenant/Station, role or permitted business action.
- Expected safe behavior: PKI qualification contributes evidence; Identity resolves canonical subject and Authorization decides action under current policy.
- Forbidden behavior: valid certificate alone grants canonical Person identity, tenant membership or business permission.
- Owners: Enterprise Trust/PKI + Identity + Authorization.
- Evidence/currentness: identity mapping revision, authentication assurance, authorization policy revision.
- Recovery/future route: route ambiguity to native owners; no identity adoption by inference.
- Blast radius: account/tenant→enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-action/runtime. Reversibility: potentially irreversible. Time-to-harm: immediate. Misuse likelihood: adversarial.
- Proof obligation: `valid credential != canonical identity != authorization` across federation and provider substitution.

### G2-EDGE-TRUST-006 — ambiguous issuance/enrollment/revocation effect is retried unsafely
- Activation: timeout/partition after CA/provider mutation leaves issuance, renewal or revocation outcome `UNKNOWN`.
- Expected safe behavior: reconcile canonical request/correlation and provider evidence before retry unless operation-specific idempotency is qualified.
- Forbidden behavior: transport timeout means `NOT_APPLIED`, causing duplicate credentials, conflicting generations or revocation gaps.
- Owners: Enterprise Trust/PKI + Provider/Binding + Integration.
- Evidence/currentness: request identity, provider operation identity, effect horizon and resulting credential/status generation.
- Recovery/future route: qualified reconciliation then retry/compensate/manual disposition.
- Blast radius: credential→system. Severity: CRITICAL. Confidence: strongly supported. Detectability: runtime/post-effect. Reversibility: mixed. Time-to-harm: immediate. Misuse likelihood: likely.
- Proof obligation: ambiguous mutating trust effects obey reconcile-before-retry.

### G2-EDGE-TRUST-007 — clock/resource/AI-low-code pathology manufactures trust confidence
- Activation: clock skew near `notBefore/notAfter`, huge path/bundle/revocation sets, provider quota/backlog, or generated automation skips checks/broadens anchor admission/rotation scope.
- Expected safe behavior: bounded evaluation exposes clock uncertainty, truncation, unavailable coverage and authority limits; AI/low-code may propose only within existing trust authority.
- Forbidden behavior: evaluator timeout, sampled status, green automation or syntactically valid trust workflow becomes proof of current trust.
- Owners: Enterprise Trust/PKI + Observability/Runtime + Authorization + AI/AGWS authority owner.
- Evidence/currentness: trusted time qualification, evaluation coverage, omitted cohorts, authority/postcondition diff.
- Recovery/future route: re-evaluate bounded scope with current evidence or route to human owner.
- Blast radius: workload→enterprise. Severity: HIGH/CRITICAL. Confidence: supported. Detectability: pre-use/runtime/post-effect. Reversibility: mixed. Time-to-harm: immediate/latent. Misuse likelihood: likely/adversarial.
- Proof obligation: pathological scale/time/generated composition cannot coerce incomplete trust evidence into PASS.

## Reusable processual / semantic conflict patterns

### G2-CONFLICT-PATTERN-TRUST-CURRENTNESS-001 — locally valid path conflicts with current enterprise trust generation
- Family: semantic ownership / temporal / version / provider.
- Activation conditions: path validates under a retained anchor while policy, bundle, revocation generation or relying-party effective generation has advanced.
- Incompatible claims/actions/states: crypto validator says valid; enterprise trust owner says stale/withdrawn/INCONCLUSIVE for current scope.
- Why local validation may miss it: path validation can be correct for its supplied inputs while those inputs are not the current qualified enterprise inputs.
- Detection stage/candidate: pre-use revision/evidence-vector qualification plus runtime residual-cohort observation.
- Owner set: Enterprise Trust/PKI + Provider/Binding + relying runtime owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-use/runtime; blast radius: workload→enterprise; reversibility: difficult; time-to-harm: immediate; misuse likelihood: plausible/adversarial; evidence currentness: current required.
- False-positive risk: historical verification is legitimate when explicitly evaluated against historical revisions and makes no current-trust claim.
- Future remediation disposition: catalogue, requalify against current owner truth, drain/route residual cohorts; no implementation selected.
- Proof obligation: valid historical/stale path cannot self-promote to current trust.

### G2-CONFLICT-PATTERN-TRUST-COHORT-001 — individually valid trust generations create incompatible relying populations
- Family: version/migration/coexistence / state-transition / provider.
- Activation conditions: old/new anchor, issuer or credential generations coexist during rotation/substitution and consumers adopt asynchronously.
- Incompatible claims/actions/states: each cohort validates correctly under its own generation while cross-cohort communication, revocation or retirement assumptions disagree.
- Why local validation may miss it: each endpoint can pass local trust checks without observing fleet-wide adoption/drainage.
- Detection stage/candidate: runtime consumer-generation inventory, compatibility matrix and residual-cohort convergence evidence.
- Owner set: Enterprise Trust/PKI + Deployment/Runtime + Provider/Binding.
- Severity: HIGH/CRITICAL; confidence: strongly supported; detectability: runtime/post-effect; blast radius: fleet/system; reversibility: bounded/difficult; time-to-harm: immediate; misuse likelihood: likely; evidence currentness: current.
- False-positive risk: deliberate overlap is legitimate when cross-generation compatibility and bounded retirement criteria are explicit.
- Future remediation disposition: preserve explicit overlap, reconcile adoption and route retirement eligibility to trust owner.
- Proof obligation: rotation/substitution cannot claim convergence while authoritative residual cohorts remain undispositioned.

### G2-CONFLICT-PATTERN-CRYPTO-AUTHORITY-001 — cryptographic acceptance conflicts with canonical identity/authorization
- Family: semantic ownership / authority / cross-capability.
- Activation conditions: credential/path is valid but subject mapping, tenant/Station scope, role or action authority is absent/stale/ambiguous.
- Incompatible claims/actions/states: PKI says credential/path valid; Identity/Authorization says subject or action is not established/allowed.
- Why local validation may miss it: crypto validation has no authority to infer business identity or permission.
- Detection stage/candidate: pre-action composition check across trust result, identity mapping and current authorization revision.
- Owner set: Enterprise Trust/PKI + Identity + Authorization/Organization.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-action/runtime; blast radius: tenant→enterprise; reversibility: potentially irreversible; time-to-harm: immediate; misuse likelihood: adversarial; evidence currentness: current.
- False-positive risk: certificate-bound machine identity may be canonical only after explicit governed identity adoption and authorization.
- Future remediation disposition: route each claim to its semantic owner; no universal identity mapping inferred.
- Preventive invariant candidate: cryptographic validity must not amplify canonical business authority; universal/material with clear owners and does not block explicit governed mappings.
- Proof obligation: trust evidence cannot directly manufacture identity membership or permission.

### G2-CONFLICT-PATTERN-TRUST-EMERGENCY-001 — emergency containment conflicts with continuity and offline trust
- Family: recovery / authority / objective / temporal / human-procedure.
- Activation conditions: compromise demands urgent revoke/rotate/anchor withdrawal while disconnected or critical workloads require continuity using retained evidence.
- Incompatible claims/actions/states: Security/Trust says old material must stop; continuity/local procedure says keep operating until replacement is reachable.
- Why local validation may miss it: each instruction is valid under a different objective/evidence horizon.
- Detection stage/candidate: pre-action compromise-epoch + authority-horizon qualification; runtime residual trust inventory; reconnect reconciliation.
- Owner set: Enterprise Trust/PKI + Security/Resilience + Authorization/Governance + affected runtime owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-action/runtime; blast radius: Station→enterprise; reversibility: difficult; time-to-harm: immediate; misuse likelihood: likely/adversarial; evidence currentness: central.
- False-positive risk: explicitly pre-authorized bounded offline continuity may remain legitimate when superior policy defines scope/horizon despite upstream unavailability.
- Future remediation disposition: route to owner-qualified emergency trust/continuity disposition; do not silently choose availability or security by rule order.
- Proof obligation: emergency/offline operation cannot extend revoked/compromised trust beyond authorized scope/horizon.

## Cross-capability deepening

No 13th mandatory cluster is added. This visit materially deepens `Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution`, `Provider/Binding × external realizations`, `Secrets/Config × Runtime × Provider substitution`, `Identity × Authorization × Station × AGWS × AI`, and `Observability × Security/Recovery × runtime truth`. Trust currentness and consumer-effective adoption remain distinct from artifact signature validity, provider ACK, identity mapping, authorization and runtime health.

## Saturation result

Material findings were discovered. Enterprise Trust / PKI / Certificate Lifecycle local streak is `0`; affected mandatory-cluster streaks remain `0`. No `ConflictInstance` is claimed and no remediation implementation is authorized. Full Pass 1 remains incomplete until all 28 capabilities are challenged.