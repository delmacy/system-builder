# ADR-0018 — Design candidate owner service
Date2026-10-12 UTC
Status: PROPOSED — requires explicit owner acceptance before product construction.
Change level: L4-adjacent public owner/service materialization; no authority inferred from this proposal.
Predecessor ADR0016/0017/0009/0015, Blueprint SB04 Design and WP16 owner readiness.

## Context
Owner requests WP16 execution after its Planning#1111. WP16 TASK718 is blocked because no production
SystemDefinition candidate command/query/durable service exists. Addendum016 and remaining-scope WBS
explicitly exclude creating that owner service inside Station integration. The necessary dependency
must be materialized in the SB04 Design bounded context before WP16 can honestly satisfy its exit.
This decision must not promote the in-memory workflow.rename fixture or turn Gateway into canonical truth.

## Proposed decision
Implement packages/design as the reference SB04 owner for RECEIVED technical candidate revisions only.
It owns the authoritative fact that exact candidate bytes were retained, the candidate revision lineage,
expected-revision conflict decision and command result ledger. It does not approve recipe/analysis,
claim resolved upstream meaning, publish SystemDefinition/release, compile/deploy or execute Runtime.
Station owns drafts/history/presentation; existing business/Analysis/Validation/Release owners unchanged.
Public packages/contracts/design-candidate is provider-neutral; clients may replace this service with a
compatible implementation. Station -> SDK -> Gateway -> Design owner remains the only effecting path.
Core/domain validation uses public SystemDefinition schema/envelope and contract-owned validation,
never imports Station session/UI as a semantic authority. Share/extract pure candidate admission through
an explicitly reviewed public boundary; preserve all WP15 compatibility tests and complete envelopes.

### Durable adapter
Use existing packages/postgres query/escaping transport and a separately named Design namespace in an
operator-configured factory database. No new database created/reset, no destructive migration and no
Prisma/provider mandate. Existing tables/data and Runtime databases untouched.
Provider-neutral repository port; transactional PostgreSQL reference adapter qualifies actual durability.
Atomic transaction retains immutable artifact tuple+canonical text/digest, owner head and command ledger.
Expected owner revision is compared under lock; concurrent stale command rejects without writing.
No latest substitution for exact revision; rejected commands cannot advance head.
Same commandRef/scope/actor/content identity replays its durable result; reused key with changed payload
rejects. Successful retention and ledger entry commit together. Retry/result lookup handles lost receipt.
Database schema initialization is an explicit additive operation, with compatibility/restart proof.
Production DB identity verification retains ADR0015 policy; no new lenient default or secret in artifacts.

### Proposed public owner contract
SubmitCandidate: commandRef, verified server actor/context, full supported SystemDefinition envelope,
expectedOwnerRevision (null only for a genuinely absent artifact), requested immutable artifact tuple.
QueryCandidate: exact artifact tuple and verified actor/context.
QueryCandidateHead: scoped artifact identity, authoritative current owner revision/tuple.
QueryCommandResult: original commandRef and same verified actor/context.
Receipt statuses retained/rejected/unknown, explicit resulting owner revision/evidence on retained only.
Projection sourceAuthorityRef identifies Design; artifactVersion/projectionRevision/ownerRevision stay distinct.
Server validates complete shape/workflow references/inert JSON/limits and immutable-tuple conflicts;
receipt is retention, never business validation or publication. Unknown upstream state stays unresolved.
Bounds:1MiB candidate/depth32; stable public identifiers; no truncation or invented semantic approval.
All public wire shapes/diagnostics/version rules must be executable contracts before transport construction.

### Authorization and network adapter
Verified actor/actorRevision/context/eligibility come from a server authentication/authorization port.
actorRef strings in browser commands are assertions to check, never grants. Unknown/expired/revoked/
mismatched principal or missing configuration fail closed before candidate/revision/result reads or writes.
Existing authority contracts must be reused where applicable; no ad-hoc security policy hidden in UI.
Qualify an explicit isolated single-operator local profile first, with real authenticated requests and denied
cases; it does not certify Keycloak/OpenFGA integration, multi-tenant or public production deployment.
Gateway remains delegating, transport-agnostic protocol1.0.0 unchanged. Reference HTTP(S) ingress
uses configured/trusted origin, bounded payloads, timeouts, correlation and safe diagnostics.
Local HTTP only on loopback development/test; remote profile requires trusted TLS+qualified auth.
No credentials/DB URLs in exported candidates or browser localStorage; no arbitrary artifact-supplied endpoints.
Do not expose the service to the public internet under a test identity or default allow-all profile.

## Alternatives
| Option | Disposition |
|---|---|
| Reuse test InMemoryCorePort as product | rejected: fixture rename model, no durable owner or auth |
| Make Station localStorage canonical | rejected: second truth, incompatible with ADR0016 |
| Store candidates as Release artifact payloads | rejected: wrong lifecycle/owner |
| Implement Design service inside TASK718 | rejected: forbidden owner/backend scope |
| Separate SB04 reference owner with public contract and PostgreSQL adapter | proposed, bounded prerequisite |

## Proof and consequences
Actual WP15-authored candidate -> public contract -> actual Design transaction -> Gateway HTTP receipt ->
exact owner query -> byte/metadata equality -> owner process restart -> query -> same immutable revision.
Prove no write on invalid/denied/stale command, two writers, immutable conflict, idempotent retry and loss
of response after commit with durable command-result lookup. Memory tests are insufficient exit proof.
No new Station business authority or Runtime dependency. Design receives a replaceable real backend
slice; WP16 remains an integration package and becomes eligible only after independently reviewed O1–O4.
This proposal does not authorize code. Acceptance must name ADR0018/Addendum017 and service execution.
