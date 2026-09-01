# Generation 2 Research Input — System Builder Station Creation & Topology Operations

Status: RESEARCH HYPOTHESIS / NOT ARCHITECTURE AUTHORITY

This note extends the System Builder Stations research input with candidate user-facing station creation, derivation and management dynamics. These concepts apply to System Builder stations themselves, not to generated client systems.

## Product-surface hypothesis

Research a dedicated global `Stations` or `Station Center` surface, distinct from ordinary workspaces. A station describes the effective administrative/development surface of one System Builder installation or terminal. A workspace describes project/client/business scope. Station configuration therefore sits above or alongside workspace selection and must not be modeled as merely the final workspace.

## Candidate `New Station` modes

### 1. Empty / Minimal Station
Create a new station from the smallest trusted management substrate, then explicitly add approved components/capabilities.

Research questions:
- what minimum local substrate is required to enroll, verify, install, remove, recover and audit components;
- whether the minimum station can operate fully offline;
- how its identity and trust bootstrap are established.

### 2. Specialized Station
Create from a role-oriented capability profile, for example:
- Workflow Engineering;
- Data Engineering;
- Integration Engineering;
- Operations;
- Security Administration;
- Release Management;
- Plugin Development;
- Architecture Review.

Templates must be treated as initial policy/composition inputs, not hard-coded product editions.

### 3. Split Station
Divide the effective capability surface of an existing station into two or more stations.

Candidate behavior to research:
1. Inspect installed components, bindings, dependencies, trust zones and authority.
2. Select or propose capability slices.
3. Detect components that must remain local, may be shared remotely, may be duplicated, or require provider rebinding.
4. Produce an impact/migration plan.
5. Materialize new station profiles and move/rebind state only when safe.
6. Preserve rollback and provenance.

A split must not silently duplicate high-privilege credentials, secrets, machine identity or deployment authority.

### 4. Copy Station
Create an equivalent station from another station's structural profile.

Candidate copy classes to validate:
- component/capability profile;
- approved providers and repositories;
- policy profile;
- UI/layout preferences;
- extension/plugin set;
- version/update channel.

Sensitive material should be separately governed and, by default, not copied automatically:
- secrets;
- credentials;
- machine identity;
- environment bindings;
- trust anchors where duplication is unsafe;
- local caches/runtime state.

Research must distinguish cloning configuration from cloning authority.

### 5. Derived Station / Profile Inheritance
Create a station from a reusable base profile plus an explicit delta.

Example:

`Engineering Standard` -> `Workflow Developer` by removing production deployment, monitoring administration and provider administration.

Questions to validate:
- whether inheritance is appropriate or whether immutable profile composition is safer;
- how upstream profile changes propagate;
- conflict/override semantics;
- deterministic effective-profile calculation;
- rollback when a base profile update makes the derived station invalid.

### 6. Terminal Station / Thin Client
Create a lightweight station that delegates most execution or administration to another System Builder station/service while retaining its own identity, policy and bounded authority.

A terminal station must not automatically inherit the full authority or capability surface of the remote/main station.

Research concerns:
- local versus remote capability discovery;
- offline/degraded behavior;
- session and delegation boundaries;
- local cache and sensitive-data policy;
- command/evidence provenance;
- remote station unavailability;
- ability to restrict a terminal to a subset such as workflow authoring only.

### 7. Managed Station
Enroll a station under another System Builder control station or management plane.

Candidate centrally managed concerns:
- approved station profiles;
- component install/remove policy;
- approved repositories/providers;
- health/version/drift inspection;
- staged upgrade waves;
- compliance/evidence collection;
- restricted capability distribution;
- offline artifact promotion.

This must remain compatible with the existing recursive-SB-management research constraint: no unrestricted circular authority.

### 8. Isolated / Restricted Station
Create a station whose security posture intentionally excludes capabilities, repositories, providers, network paths or production credentials.

Candidate modes:
- approved internal repository only;
- no public marketplace/plugin source;
- no production deployment provider;
- no production secrets;
- restricted outbound network;
- offline/air-gapped operation;
- dedicated privileged administration station.

The absence of a component/capability is itself a valid security control and should not be reduced to UI hiding or RBAC alone.

### 9. Recovery / Maintenance Station
Research a minimal station or boot/recovery mode capable of inspecting and repairing System Builder installations without requiring the full normal capability surface.

Candidate responsibilities:
- verify installed component manifests/signatures;
- inspect station profile/effective capability surface;
- recover from failed install/upgrade;
- roll back component versions;
- restore a known-good station profile;
- remove quarantined/broken optional components;
- re-enroll/re-establish management trust under explicit authority.

Research must determine whether Recovery Station is a separate station type, a temporary execution mode, or merely a profile of the minimal trusted core.

## Station Center hypothesis

Research a global management surface capable of listing stations with at least:
- station identity;
- station type/profile;
- management relationship;
- effective capability count/surface;
- installed/enabled/blocked component state;
- health/drift/version;
- trust zone;
- remote/terminal relation;
- update policy/channel.

Possible operations to validate:
- Open;
- Manage;
- Split;
- Copy;
- Derive;
- Convert to/from managed mode where safe;
- Restrict/expand approved capability surface;
- Retire/decommission;
- Recover;
- inspect topology in Canvas.

## Topology and Canvas implications

The self-canvas should eventually be able to project both capability topology and station-management topology without confusing either with client-system topology.

Candidate relation types:
- `MANAGES`;
- `TERMINAL_OF` / remote execution relation;
- `DERIVED_FROM` / profile lineage;
- `SPLIT_FROM`;
- `SHARES_SERVICE_WITH`;
- `APPROVED_ARTIFACT_SOURCE`;
- `TRUSTS` / delegated trust where appropriate.

These relations require stable semantic identity and evidence; visual edge placement must not be the authority.

## Deterministic effective station surface

Research whether a station's effective capability surface can be computed from explicit inputs such as:

`installed components ∩ station profile/policy ∩ organization policy ∩ operator authorization ∩ trust-zone constraints ∩ provider/repository availability ∩ environment/network/secrets reachability`

The exact algebra is not decided here. The key requirement to test is that the effective surface be explainable, reproducible and auditable rather than emergent from UI state.

## Safety and migration requirements to validate

Station operations must be researched against:
- least privilege;
- separation of duties;
- privileged access workstation patterns;
- signed/verifiable component artifacts;
- dependency resolution;
- transactional install/remove/upgrade;
- rollback;
- state/config portability;
- no silent secret or authority duplication;
- identity/provenance preservation;
- management-cycle prevention;
- failure recovery;
- deterministic drift detection.

## Research cross-checks

Explicitly revisit these dynamics during:
- Integration & Automation where remote execution/control relationships become relevant;
- Identity / Authentication / Federation;
- Authorization / Policy / Organization / Multitenancy;
- Deployment / Environment / Runtime;
- Extension / Plugin / Marketplace Architecture;
- Governance / Compliance / Audit;
- Secrets / Configuration / Environment Portability;
- Provider / Binding / Capability Negotiation;
- Lifecycle / Versioning / Evolution / Migration;
- Security / Resilience / Failure Recovery;
- Developer / Operator Experience / Self-hosting;
- Architecture Reconciliation as a Capability.

## Promotion discipline

Do not promote `Split Station`, `Copy Station`, `Derived Station`, `Terminal Station`, `Managed Station`, `Restricted Station` or `Recovery Station` into final architecture merely because they are desirable product interactions. Research must determine which are:
- first-class architecture primitives;
- compositions of lower-level primitives;
- user-experience workflows over the same station/profile model;
- low-value variants that should not become separate concepts.

The objective is to preserve the product dynamics while allowing evidence to decide the smallest coherent architecture.