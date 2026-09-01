# Generation 2 Research Input — System Builder Stations & Administrative Surfaces

Status: RESEARCH HYPOTHESIS / NOT ARCHITECTURE AUTHORITY

## User-origin concept

A System Builder installation should not imply that every System Builder capability is physically present, enabled, discoverable or administratively reachable on every workstation/instance. Different System Builder stations may be intentionally composed with different subsets of System Builder capabilities, independent from the capabilities of generated client systems.

Examples:

- Station A: workflow authoring + related model inspection, without operations monitoring.
- Station B: data/application modeling + integration design, without production deployment authority.
- Stations C/D/E: broader or full engineering/administrative compositions where policy allows.
- Restricted administrative stations: selected high-privilege capabilities only.

This is stronger than user-level RBAC alone: a capability may be absent from the installation or unavailable from the station's approved source, reducing administrative attack surface under least-privilege / privileged-administration principles.

## Distinctions to preserve

1. Platform capability known by the System Builder ecosystem != capability installed on one System Builder station.
2. Installed != enabled != bound != exposed to a user/workspace.
3. User authorization != station composition. Both may constrain access independently.
4. System Builder station capabilities != capabilities of systems generated or managed by that station.
5. Canvas visibility must be a projection of actual capability/component state, not an authority that invents availability.

## Candidate lifecycle vocabulary to research

A possible non-authoritative state model to test against external systems and repository truth:

KNOWN -> AVAILABLE -> INSTALLED -> ENABLED -> BOUND -> EXPOSED

Additional states/policies may be required for BLOCKED_BY_POLICY, APPROVED_SOURCE_ONLY, QUARANTINED, DEGRADED, RETIRED or similar concepts. Research must determine whether these belong to lifecycle, governance, package management or provider/binding semantics.

## Station composition hypothesis

Treat a System Builder station as a composable administrative/development surface whose effective capability set may derive from:

- physically installed modules/components;
- allowed artifact/provider repositories;
- station policy/profile;
- organization/workspace policy;
- operator authorization;
- environment/network reachability;
- secrets and credential availability;
- runtime/deployment trust zone.

Do not assume a single monolithic "full System Builder" installation is the normal topology.

## Self-modification hypothesis

System Builder should be researched as potentially able to install/uninstall its own optional components through controlled product surfaces, including Canvas projections, provided the final architecture proves:

- signed/verifiable artifacts;
- declarative manifests and dependencies;
- bounded installation authority;
- transactional apply/rollback;
- impact analysis before removal;
- audit/evidence/provenance;
- recovery when a component installation fails;
- prevention of arbitrary privileged install scripts bypassing policy.

A minimal trusted management core may be necessary, but its exact contents are not decided here.

## Recursive System Builder management hypothesis

Research whether one System Builder instance/station can manage another System Builder installation as a managed target, without confusing that relationship with generated client systems.

Potential topology:

System Builder Control Station -> manages configuration/lifecycle of -> System Builder Station(s)

Possible uses:

- centrally approve station capability profiles;
- distribute/remove optional modules;
- enforce approved repositories/providers;
- inspect health/version/drift;
- manage upgrade waves;
- keep privileged capabilities off ordinary developer stations;
- operate offline/restricted stations through staged artifact promotion.

This creates a recursive control-plane problem that must be bounded. Research must specifically test identity, authority, delegation, provenance, trust bootstrap, circular-management prevention, failure recovery and whether hierarchy/federation is preferable to unrestricted recursion.

## Canvas implications

The System Builder self-canvas should be able to project per-station topology and distinguish at least conceptually:

- installed capability/module;
- available but not installed;
- known but unavailable in this station/trust zone;
- blocked by policy;
- provider binding;
- external resource;
- management relationship to another System Builder station.

A workflow developer should not need a monitoring/operations component merely because the platform ecosystem supports it.

## Research questions

1. Which mature platforms support modular administrative workstations, feature/plugin installation or restricted management-plane surfaces?
2. What patterns exist for privileged access workstations, management-plane segmentation, extension catalogs and offline/approved artifact promotion?
3. What is the minimum management substrate needed for safe self-modification?
4. How should module lifecycle differ from provider lifecycle and from user authorization?
5. How can an SB station prove its effective capability surface deterministically?
6. Can one SB manage another without creating circular authority, hidden coupling or a mandatory central controller?
7. What data/configuration should remain portable when a station is rebuilt with a different capability slice?
8. Which aspects belong to Security, Extension/Plugin Architecture, Governance, Deployment, Developer/Operator Experience and Architecture Reconciliation?

## Promotion targets

The hypotheses in this note should be revisited during at least:

- Extension / Plugin / Marketplace Architecture
- Governance / Compliance / Audit
- Security / Resilience / Failure Recovery
- Deployment / Environment / Runtime
- Developer / Operator Experience / Self-hosting
- Provider / Binding / Capability Negotiation
- Architecture Reconciliation as a Capability

No candidate from this note should be promoted solely from user intent. Promotion requires multi-representative evidence or a demonstrated structural System Builder need during repository reconciliation.
