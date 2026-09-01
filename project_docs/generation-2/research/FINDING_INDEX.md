# Generation 2 — Finding Index

## Universal Capability Architecture

- G2-FINDING-UCA-01 — Requirement/Capability Duality
- G2-FINDING-UCA-02 — Compatibility Before Binding
- G2-FINDING-UCA-03 — Qualified Provider Identity
- G2-FINDING-UCA-04 — Evidence-Bearing Binding
- G2-FINDING-UCA-05 — Desired/Observed Separation
- G2-FINDING-UCA-06 — Reconciliation Is Lifecycle
- G2-FINDING-UCA-07 — Multidimensional Versioning
- G2-FINDING-UCA-08 — External Fulfillment Without Ownership
- G2-FINDING-UCA-09 — Extension Authority Classes
- G2-FINDING-UCA-10 — Portable Semantics / Provider Isolation

## Process & Application Modeling

- G2-FINDING-PAM-01 — Model Is an Inspectable Artifact
- G2-FINDING-PAM-02 — Stable Semantic Identity Must Outlive Labels
- G2-FINDING-PAM-03 — Model Units Need Explicit Ownership
- G2-FINDING-PAM-04 — Typed Reference Graph Is Foundational
- G2-FINDING-PAM-05 — External Reference Must Not Imply Ownership
- G2-FINDING-PAM-06 — Publication Is a Lifecycle Boundary
- G2-FINDING-PAM-07 — Generated Implementation Must Remain Traceable
- G2-FINDING-PAM-08 — Governed Composition Beats Unbounded Extension
- G2-FINDING-PAM-09 — Metadata-Driven Does Not Mean Portable
- G2-FINDING-PAM-10 — Semantic Model and Provider Choice Should Be Orthogonal

## UI / Generated Experience / Low-code Builder

- G2-FINDING-UI-01 — Canvas Must Be a Projection, Not Authority
- G2-FINDING-UI-02 — Presentation Metadata Is a Separate Versioned Concern
- G2-FINDING-UI-03 — Design System Is Governance Infrastructure
- G2-FINDING-UI-04 — Component Contracts Need Stable Typed Interfaces
- G2-FINDING-UI-05 — State and Actions Are Not Styling
- G2-FINDING-UI-06 — Custom Code Is a Bounded Escape Hatch
- G2-FINDING-UI-07 — Preview, Publication and Runtime Evidence Are Distinct
- G2-FINDING-UI-08 — Generated Experience Needs Model-to-Runtime Lineage
- G2-FINDING-UI-09 — Inspectable Output Improves Exit Portability but Does Not Eliminate Coupling
- G2-FINDING-UI-10 — Renderer Choice Should Be Orthogonal to Business Semantics Where Economically Justified

## Workflow & Durable Execution

- G2-FINDING-WDE-01 — Definition/Execution Identity Separation
- G2-FINDING-WDE-02 — Durable Progress Is Execution Evidence
- G2-FINDING-WDE-03 — Effect Boundary Is Foundational
- G2-FINDING-WDE-04 — Execution Version Binding Must Be Explicit
- G2-FINDING-WDE-05 — Recovery Semantics Are Multidimensional
- G2-FINDING-WDE-06 — Durable Wait Is a First-Class Primitive
- G2-FINDING-WDE-07 — Operator Mutation Is Governed Lifecycle
- G2-FINDING-WDE-08 — Durability Level Is a Provider Capability
- G2-FINDING-WDE-09 — History Retention and Business State Retention Differ
- G2-FINDING-WDE-10 — Runtime Autonomy Must Include In-Flight Work

## Integration & Automation

- G2-FINDING-IA-01 — Integration, Connection and Invocation Identity Must Be Separate
- G2-FINDING-IA-02 — Operation Contract Is the Portable Integration Surface
- G2-FINDING-IA-03 — Connection Validation Is Runtime Lifecycle Evidence
- G2-FINDING-IA-04 — Typed Common Path Plus Bounded Escape Hatch
- G2-FINDING-IA-05 — Failure Taxonomy Must Outlive Transport Status Codes
- G2-FINDING-IA-06 — Side-Effect Boundary Determines Recoverability
- G2-FINDING-IA-07 — Retry Requires Definition and Side-Effect Context
- G2-FINDING-IA-08 — Connector-Level Observability Is a First-Class Dimension
- G2-FINDING-IA-09 — Governance Can Wrap External Ownership
- G2-FINDING-IA-10 — Automation Platform Must Not Become Business-Semantic Authority

## Identity / Authentication / Federation

- G2-FINDING-IAF-01 — External Subject Identity Must Be Issuer-Qualified
- G2-FINDING-IAF-02 — Local Identity Must Outlive Authentication Provider Choice
- G2-FINDING-IAF-03 — Authentication, Session and Token Are Separate Lifecycles
- G2-FINDING-IAF-04 — Organization/Tenant Context Is a Trust Boundary
- G2-FINDING-IAF-05 — Provider Configuration and Provider Binding Are Distinct
- G2-FINDING-IAF-06 — Federation Metadata and Key State Are Operational Evidence
- G2-FINDING-IAF-07 — Pending Authentication Requirements Need Explicit State
- G2-FINDING-IAF-08 — Delegated Identity Administration Must Not Imply Business Authority
- G2-FINDING-IAF-09 — Secret and Upstream Token Custody Must Be Outside Portable Semantics
- G2-FINDING-IAF-10 — Runtime Autonomy Includes Identity Validation and Session Continuity

## Authorization / Policy / Organization / Multitenancy

- G2-FINDING-AUTH-01 — Authentication Is Authorization Input, Not Authority
- G2-FINDING-AUTH-02 — Authorization Request Shape Must Be Explicit
- G2-FINDING-AUTH-03 — Decision and Enforcement Are Separate Boundaries
- G2-FINDING-AUTH-04 — Decision Must Bind to Policy/Model Revision
- G2-FINDING-AUTH-05 — Durable Relationships and Ephemeral Context Must Stay Distinct
- G2-FINDING-AUTH-06 — RBAC/ABAC/ReBAC Are Composable Semantics
- G2-FINDING-AUTH-07 — Conflict/Default/Failure Semantics Must Be Explicit
- G2-FINDING-AUTH-08 — Delegated Administration Is a Separate Authority Plane
- G2-FINDING-AUTH-09 — Authorization Decision Evidence Is First-Class
- G2-FINDING-AUTH-10 — Tenant Isolation Exceeds Authorization Context

## Data / Schema / Migrations

- G2-FINDING-DATA-01 — Current Schema and Migration History Are Distinct Authorities
- G2-FINDING-DATA-02 — Migration Identity Must Be Immutable and Content-Bound
- G2-FINDING-DATA-03 — Applied Migration State Is Durable Execution Evidence
- G2-FINDING-DATA-04 — Safe Schema Evolution Requires Explicit Compatibility Windows
- G2-FINDING-DATA-05 — Rollback Is a Bounded Capability, Not a Universal Guarantee
- G2-FINDING-DATA-06 — Physical Schema Semantics Belong to the Data Provider Boundary
- G2-FINDING-DATA-07 — Drift Is a First-Class Governance Condition
- G2-FINDING-DATA-08 — External Data Reference Must Not Imply Migration Ownership
- G2-FINDING-DATA-09 — Data Contract, Physical Schema and Exposure Metadata Are Separate Concerns
- G2-FINDING-DATA-10 — Runtime Autonomy Requires Evolution Evidence, Not Just Initial Schema Creation

## Storage / Documents / Media

- G2-FINDING-STORAGE-01 — Logical Content Identity Must Be Provider-Neutral
- G2-FINDING-STORAGE-02 — Logical Revision and Physical Storage Version Are Distinct
- G2-FINDING-STORAGE-03 — Integrity Must Be Algorithm-Qualified First-Class Evidence
- G2-FINDING-STORAGE-04 — Upload Session and Committed Content Are Separate Lifecycles
- G2-FINDING-STORAGE-05 — Versioning, Soft Delete, Retention and Legal Hold Are Orthogonal Capabilities
- G2-FINDING-STORAGE-06 — Deletion Is a Governed State Transition, Not Necessarily Immediate Destruction
- G2-FINDING-STORAGE-07 — S3 Compatibility Is Interface Portability, Not Semantic Equivalence
- G2-FINDING-STORAGE-08 — Document Lifecycle Is a Semantic Layer Above Blob Storage
- G2-FINDING-STORAGE-09 — Storage Binding Evidence Must Preserve Logical-to-Physical Lineage
- G2-FINDING-STORAGE-10 — Runtime Autonomy Requires Runtime-Resolvable Storage Bindings

## Notifications / Events / Messaging

- G2-FINDING-NEM-01 — Event Identity and Delivery Identity Must Be Separate
- G2-FINDING-NEM-02 — Event Is Fact; Message Is Delivery Vehicle
- G2-FINDING-NEM-03 — Delivery Guarantees Are Scoped Capabilities, Not Universal Booleans
- G2-FINDING-NEM-04 — Subscription/Consumer State Is a Separate Lifecycle
- G2-FINDING-NEM-05 — Deduplication Requires Qualified Identity Plus Scope/Window
- G2-FINDING-NEM-06 — Retry, Dead-Letter, Redrive and Replay Are Distinct Recovery Semantics
- G2-FINDING-NEM-07 — Delivery Evidence Must Preserve Semantic-to-Provider Lineage
- G2-FINDING-NEM-08 — Notification Intent and Notification Delivery Must Be Separate
- G2-FINDING-NEM-09 — Preference and Mandatory-Delivery Policy Need Explicit Precedence
- G2-FINDING-NEM-10 — Runtime Autonomy Includes Messaging and Notification Continuity

## Build / Dependency Graph / Reproducibility

- G2-FINDING-BUILD-01 — Build Target, Action and Execution Attempt Are Separate Identities
- G2-FINDING-BUILD-02 — Dependency Graph and Execution Provider Must Be Separate Authorities
- G2-FINDING-BUILD-03 — Cache Correctness Depends on Complete Qualified Action Inputs
- G2-FINDING-BUILD-04 — Cache Is an Optimization/Evidence Source, Never Build Authority
- G2-FINDING-BUILD-05 — Reproducibility Is a Qualified Property, Not a Boolean Claim
- G2-FINDING-BUILD-06 — Dependency Lock Graph Is Versioned Build Input Evidence
- G2-FINDING-BUILD-07 — Toolchain and Platform Are First-Class Build Inputs
- G2-FINDING-BUILD-08 — Generated-Code Lineage Must Cross the Build Boundary
- G2-FINDING-BUILD-09 — Build Provenance Is Distinct from Artifact Identity and CI Logs
- G2-FINDING-BUILD-10 — Runtime/Artifact Autonomy Requires Rebuildability Outside the SB Control Plane

Authoritative rationale and evidence are in the corresponding documents under `research/capabilities/`.
