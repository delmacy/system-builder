# Generation 2 — Capability Discovery Register

Promotion requires multi-representative evidence or a clear structural System Builder need. Candidates are not architecture decisions.

| Candidate | Class | Evidence origin | Status | Promotion condition |
|---|---|---|---|---|
| G2-CAPABILITY-CANDIDATE-COMPATIBILITY-NEGOTIATION | CROSS_CUTTING | TOSCA + Terraform | CANDIDATE | Recur materially in Provider/Binding plus at least one domain capability. |
| G2-CAPABILITY-CANDIDATE-RECONCILIATION-CONTROL | CROSS_CUTTING | Kubernetes + universal provider lifecycle | CANDIDATE | Recur materially in Lifecycle and Architecture Reconciliation research. |
| G2-CAPABILITY-CANDIDATE-BINDING-PROVENANCE | CROSS_CUTTING | Terraform + reproducible binding model | CANDIDATE | Recur materially in Artifact/Provenance and Provider/Binding research. |
| G2-CAPABILITY-CANDIDATE-MODEL-PUBLICATION-LIFECYCLE | CROSS_CUTTING | Mendix + Power Apps + Salesforce + ServiceNow; reinforced by UI preview/template/generation lifecycle | CANDIDATE | Recur materially in Lifecycle/Versioning and Deployment research; distinguish from generic release lifecycle. |
| G2-CAPABILITY-CANDIDATE-EXTERNAL-SEMANTIC-REFERENCE | CROSS_CUTTING | Mendix external entities + ServiceNow integration actions + universal external fulfillment; reinforced by external/virtual data ownership research | CANDIDATE | Recur materially in Data, Integration and Provider/Binding while preserving external ownership semantics. |
| G2-CAPABILITY-CANDIDATE-DESIGN-SYSTEM-GOVERNANCE | CROSS_CUTTING | Mendix Atlas + OutSystems Style Guide/UI + FlutterFlow design-system reuse | CANDIDATE | Recur materially in Governance and Developer/Operator Experience and show a structural SB requirement beyond styling. |
| G2-CAPABILITY-CANDIDATE-GENERATED-EXPERIENCE-LINEAGE | CROSS_CUTTING | FlutterFlow generated Widget/Model structure + SB Canvas deterministic/round-trip intent | CANDIDATE | Recur materially in Artifact/Provenance, Observability and Lifecycle with end-to-end semantic-to-runtime traceability value. |
| G2-CAPABILITY-CANDIDATE-SB-STATION-COMPOSITION | CROSS_CUTTING | User-origin System Builder station composition hypothesis | CANDIDATE | Confirm structural value across Developer/Operator Experience, Extension/Plugin, Deployment and Security research. |
| G2-CAPABILITY-CANDIDATE-ADMINISTRATIVE-SURFACE-SEGMENTATION | CROSS_CUTTING | User-origin least-privilege / restricted administrative station hypothesis; reinforced by Keycloak organization-scoped delegated administration and authorization-plane separation | CANDIDATE | Recur materially in Security, Governance and privileged-management-plane patterns. |
| G2-CAPABILITY-CANDIDATE-COMPONENT-AVAILABILITY-LIFECYCLE | CROSS_CUTTING | User-origin install/uninstall/self-modification hypothesis | CANDIDATE | Recur materially in Extension/Plugin, Artifact/Provenance, Deployment and Lifecycle research. |
| G2-CAPABILITY-CANDIDATE-RECURSIVE-SB-MANAGEMENT | CROSS_CUTTING | User-origin hypothesis that one System Builder may manage other System Builder stations; authorization research reinforces delegated authority boundaries | CANDIDATE | Find mature precedents for management-plane federation/hierarchy and prove trust, cycle prevention and autonomy constraints. |
| G2-CAPABILITY-CANDIDATE-EXECUTION-DEFINITION-BINDING | CROSS_CUTTING | Step Functions + Durable Task + Camunda | CANDIDATE | Recur in Lifecycle/Versioning and Provider/Binding. |
| G2-CAPABILITY-CANDIDATE-DURABLE-EXECUTION-EVIDENCE | CROSS_CUTTING | Restate + Step Functions + replay-oriented runtimes | CANDIDATE | Recur in Observability and Artifact/Provenance. |
| G2-CAPABILITY-CANDIDATE-RECOVERY-SEMANTICS | CROSS_CUTTING | Camunda + Step Functions + Restate + Durable Task | CANDIDATE | Recur in Security/Resilience/Failure Recovery and Lifecycle. |
| G2-CAPABILITY-CANDIDATE-CONNECTION-VALIDATION-HEALTH | CROSS_CUTTING | Make + Zapier + external binding lifecycle + identity provider lifecycle | CANDIDATE | Recur in Secrets, Provider/Binding and Observability. |
| G2-CAPABILITY-CANDIDATE-INTEGRATION-OPERATION-CONTRACT | CROSS_CUTTING | Zapier + Make + MuleSoft + Camel | CANDIDATE | Recur in Standards/API Contracts and Provider/Binding. |
| G2-CAPABILITY-CANDIDATE-SIDE-EFFECT-SEMANTICS | CROSS_CUTTING | Make + Camel + workflow/messaging retry evidence | CANDIDATE | Recur in Workflow, Security/Recovery and Lifecycle. |
| G2-CAPABILITY-CANDIDATE-FEDERATION-TRUST-LIFECYCLE | CROSS_CUTTING | Entra + Keycloak + ZITADEL | CANDIDATE | Recur in Secrets, Lifecycle, Provider/Binding and Security. |
| G2-CAPABILITY-CANDIDATE-QUALIFIED-EXTERNAL-IDENTITY | CROSS_CUTTING | Entra + Keycloak + authorization evidence | CANDIDATE | Recur in Data/Provenance; decide whether it remains an Identity subcapability. |
| G2-CAPABILITY-CANDIDATE-DELEGATED-IDENTITY-ADMINISTRATION | CROSS_CUTTING | Keycloak + Auth0 + ZITADEL + authorization research | CANDIDATE | Recur in Governance, Security and SB station composition. |
| G2-CAPABILITY-CANDIDATE-AUTHORIZATION-DECISION-EVIDENCE | CROSS_CUTTING | OPA + authorization auditability | CANDIDATE | Recur in Observability, Governance and Artifact/Provenance. |
| G2-CAPABILITY-CANDIDATE-POLICY-MODEL-VERSION-BINDING | CROSS_CUTTING | OPA + OpenFGA + Cedar | CANDIDATE | Recur in Lifecycle, Artifact/Provenance and Provider/Binding. |
| G2-CAPABILITY-CANDIDATE-TENANT-AUTHORITY-CONTEXT | CROSS_CUTTING | OpenFGA + Cedar + Keycloak + Azure + data research | CANDIDATE | Recur in Secrets, Deployment and Security. |
| G2-CAPABILITY-CANDIDATE-SCHEMA-MIGRATION-PROVENANCE | CROSS_CUTTING | Flyway/Liquibase + Prisma + SB migration evidence | CANDIDATE | Recur in Artifact/Provenance, Deployment and Lifecycle. |
| G2-CAPABILITY-CANDIDATE-SCHEMA-COMPATIBILITY-WINDOW | CROSS_CUTTING | Prisma expand-contract + rolling evolution constraints | CANDIDATE | Recur in Deployment and Lifecycle. |
| G2-CAPABILITY-CANDIDATE-DATA-OWNERSHIP-BOUNDARY | CROSS_CUTTING | Hasura + external data ownership + SB reference principles | CANDIDATE | Recur in Provider/Binding, Governance and Multitenancy. |
| G2-CAPABILITY-CANDIDATE-CONTENT-INTEGRITY-PROVENANCE | CROSS_CUTTING | S3 + GCS + ADR-0009 | CANDIDATE | Recur in Artifact/Provenance, Security/Recovery and provider replacement. |
| G2-CAPABILITY-CANDIDATE-CONTENT-LIFECYCLE-GOVERNANCE | CROSS_CUTTING | S3/MinIO + Azure + GCS + SharePoint/Purview | CANDIDATE | Recur in Governance and Lifecycle. |
| G2-CAPABILITY-CANDIDATE-LOGICAL-PHYSICAL-CONTENT-LINEAGE | CROSS_CUTTING | S3/GCS/Azure/MinIO + ADR-0009 | CANDIDATE | Recur in Artifact/Provenance and Observability. |
| G2-CAPABILITY-CANDIDATE-MESSAGE-DELIVERY-EVIDENCE | CROSS_CUTTING | Kafka + JetStream + SNS/SQS + Novu | CANDIDATE | Recur in Observability and Artifact/Provenance. |
| G2-CAPABILITY-CANDIDATE-DELIVERY-GUARANTEE-CONTRACT | CROSS_CUTTING | Kafka + JetStream + SNS/SQS | CANDIDATE | Recur in Provider/Binding and Security/Recovery. |
| G2-CAPABILITY-CANDIDATE-NOTIFICATION-INTENT-PREFERENCE-POLICY | DOMAIN | Novu + SB Notifications planning intent | CANDIDATE | Recur in Governance and Identity/Organization. |
| G2-CAPABILITY-CANDIDATE-BUILD-ACTION-IDENTITY | CROSS_CUTTING | Bazel actions + Nix derivations + BuildKit build graph | CANDIDATE | Recur in Artifact/Provenance and Deployment; prove stable action identity useful across build providers without becoming engine-specific. |
| G2-CAPABILITY-CANDIDATE-REPRODUCIBILITY-QUALIFICATION | CROSS_CUTTING | Bazel hermetic/cache model + Nix explicit derivation inputs + BuildKit provenance | CANDIDATE | Recur in Artifact/Provenance, Security and Product Proof; define measurable qualification dimensions rather than a boolean claim. |
| G2-CAPABILITY-CANDIDATE-BUILD-INPUT-PROVENANCE | CROSS_CUTTING | Nix derivation inputs/flake lock graph + BuildKit SLSA materials + GitHub attestations | CANDIDATE | Recur in Artifact/Release/SBOM/Provenance and remain distinct from generic artifact provenance by capturing declared build inputs/toolchain/environment. |
