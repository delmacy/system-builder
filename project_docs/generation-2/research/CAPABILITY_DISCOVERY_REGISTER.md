# Generation 2 — Capability Discovery Register

Promotion requires multi-representative evidence or a clear structural System Builder need. Candidates are not architecture decisions.

Existing candidates through `G2-CAPABILITY-CANDIDATE-CONTROL-FRAMEWORK-MAPPING` remain CANDIDATE with their prior classifications and promotion conditions recorded in pipeline history and capability dossiers.

| Candidate | Class | Evidence origin | Status | Promotion condition |
|---|---|---|---|---|
| G2-CAPABILITY-CANDIDATE-SECRET-MATERIALIZATION-EVIDENCE | CROSS_CUTTING | Vault lease metadata + External Secrets sync status + deployment-local materialization boundary | CANDIDATE | Recur in Provider/Binding, Observability and Provenance with a stable disclosure-safe evidence envelope. |
| G2-CAPABILITY-CANDIDATE-DYNAMIC-CREDENTIAL-LEASE | CORE | Vault dynamic credentials/leases contrasted with static versioned secrets | CANDIDATE | Promote only if multiple providers/target architectures require renew/revoke semantics as a portable capability rather than an optional provider feature. |
| G2-CAPABILITY-CANDIDATE-SENSITIVE-TELEMETRY-REDACTION-CONTRACT | CROSS_CUTTING | Secret/config audit and telemetry must retain metadata while excluding material | CANDIDATE | Recur in Security, Observability, Governance and Provenance with common redaction-by-construction semantics. |

This compact register view does not revoke or supersede earlier candidates; `RESEARCH_PIPELINE_STATE.json` is the authoritative candidate inventory.
