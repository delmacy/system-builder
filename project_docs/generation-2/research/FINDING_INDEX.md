# Generation 2 — Finding Index

Prior stable findings remain authoritative in their capability dossiers, earlier index revisions and pipeline history. Compacting this index does not revoke them.

## Cycle 7 — Standards / Interoperability / API Contracts revisit 6
- **G2-FINDING-SIAC-47** — Interoperability is an applicability-scoped layered claim across syntactic, structural, behavioral and semantic conformance; success at a lower layer does not imply consumer-effective semantic satisfaction.
- **G2-FINDING-SIAC-48** — Specification, dialect/profile, schema, operation, provider implementation, conformance result and consumer-effective state require separate typed identities and independent revision lineage.
- **G2-FINDING-SIAC-49** — Protocol-level idempotency/retryability is not a domain-effect guarantee; HTTP limits automatic retry of non-idempotent requests and gRPC retry commitment is a transport boundary, so mutating operations require explicit effect qualification.
- **G2-FINDING-SIAC-50** — Ambiguous remote mutation requires an explicit effect disposition and reconcile-before-retry; `Retry-After`, retryable status codes or transport retry configuration govern retry mechanics, not duplicate-effect safety.
- **G2-FINDING-SIAC-51** — Interoperability compatibility is revision-qualified across semantic contract, specification/dialect/profile, schema, provider/runtime, policy/trust/configuration and consumer cohort; latest-version compatibility cannot stand in for historical/transitive population compatibility.
- **G2-FINDING-SIAC-52** — API portability is a mixed support vector spanning syntax, structure, behavior, protocol features, limits, failure/retry/effect semantics, security, evidence, lifecycle/skew, offline behavior and administration; a portable description alone is insufficient.
- **G2-FINDING-SIAC-53** — Dual-version/dual-protocol coexistence is a first-class migration state; withdrawal closes only after target consumer-effective proof plus residual client/session/cache/subscription cohort drainage or explicit disposition.
- **G2-FINDING-SIAC-54** — Conformance evidence has an applicability and replay horizon independent of document validity; local/offline use and historical proofs must requalify after relevant contract/profile/provider/trust advancement, while `Enterprise → Station → Role → Person` and AGWS/AI cannot amplify contract/API/provider authority.

## Cycle 7 — Provider / Binding / Capability Negotiation revisit 6
- **G2-FINDING-PBCN-45** — Capability satisfaction is an applicability-scoped claim over requirement, offer, binding revision, provider realization, protocol/profile, policy, failure/evidence profile, target Station/consumer cohort, trust/config revision and observation horizon; provider `healthy` or `supports` alone is insufficient.
- **G2-FINDING-PBCN-46** — Requirement, offer, binding, provider realization and consumer-effective satisfaction need separate typed identities; collapsing them makes provider replacement and historical evidence ambiguous.
- **G2-FINDING-PBCN-47** — Provider readiness is supporting evidence, not consumer-effective satisfaction; effective proof must observe the qualified target population through the bound semantic contract.
- **G2-FINDING-PBCN-48** — Binding mutation requires single-writer ownership/fencing or an equivalent conflict rule; shadow/dual realization must not duplicate mutation authority merely because two providers are simultaneously reachable.
- **G2-FINDING-PBCN-49** — Cross-boundary consent/reference is a revocable, scoped grant with independent lineage/currentness; possession of an endpoint/reference does not grant canonical binding or provider-admin authority.
- **G2-FINDING-PBCN-50** — Bind/program/cutover timeout or lost acknowledgement yields an ambiguous actuation outcome and requires reconcile-before-retry; retrying blindly can create competing bindings or duplicate effects.
- **G2-FINDING-PBCN-51** — Provider portability is a mixed support vector spanning semantics, limits, failure/consistency guarantees, evidence, trust/security, lifecycle, offline behavior and administration; protocol/version compatibility is only one axis.
- **G2-FINDING-PBCN-52** — Provider migration closes only after target consumer-effective satisfaction plus residual route/session/cache/subscription/consumer-cohort drainage or explicit disposition; qualified offline closure is horizon-bounded and `Enterprise → Station → Role → Person` plus AGWS/AI cannot amplify binding/provider authority.

## Cycle 7 — Secrets / Configuration / Environment Portability revisit 6
Findings `G2-FINDING-SCEP-46..53` remain authoritative in the capability dossier and prior index revision.

## Cycle 7 — Governance / Compliance / Audit revisit 6
Findings `G2-FINDING-GCA-46..53` remain authoritative in the capability dossier and prior index revision.

## Cycle 7 — Extension / Plugin / Marketplace Architecture revisit 6
Findings `G2-FINDING-EPM-45..52` remain authoritative in the capability dossier and prior index revision.

## Cycle 7 — Observability / Operations / Incident revisit 6
Findings `G2-FINDING-OOI-47..54` remain authoritative in the capability dossier and prior index revision.

## Historical authority
Detailed findings for all other capabilities remain authoritative in their dossiers, earlier index revisions and pipeline history.