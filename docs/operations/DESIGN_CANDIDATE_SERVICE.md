# Design candidate owner — explicit local profile
ADR0018/Addendum017. Technical candidate retained != approved business knowledge/published definition/release.
A public codec/domain preserves full SystemDefinition1.0.0 envelope, nonedited metadata/extensions/array order. Owner revisions are opaque and separate from artifact versions. Exact query never selects latest. References upstream remain unresolved.
B reference provider uses operator-configured PostgreSQL and additive sb_design_candidate_v1_records/heads/commands. No DB creation/reset or destructive migration. Transaction-scoped lock serializes Design writers across processes; immutable tuple/text/digest + head + retained/rejected result ledger commit atomically. Global writer serialization is deliberate initial bounded throughput; no scale certification.
Same scoped actor command key and identical fingerprint replays original receipt, including stale rejection. Changed request rejects command-conflict. Immutable tuple rejects all new commands. Null expected revision works only for genuinely new artifact. Lost response is UNKNOWN; inspect same command-result key before retry.

## Configure and start
Use server-only environment/secret store, never exported artifacts or browser localStorage. No default credential/profile.
Required:
- SYSTEM_BUILDER_DESIGN_PROFILE=local-single-operator
- SYSTEM_BUILDER_DESIGN_POSTGRES_URL (existing operator-configured factory database)
- SYSTEM_BUILDER_DESIGN_TOKEN (random at least32 characters)
- SYSTEM_BUILDER_DESIGN_ACTOR and SYSTEM_BUILDER_DESIGN_ACTOR_REVISION
- SYSTEM_BUILDER_DESIGN_WORKSPACE
- SYSTEM_BUILDER_DESIGN_EXPIRES_AT (valid future UTC timestamp)
- SYSTEM_BUILDER_DESIGN_CORE, SYSTEM_BUILDER_DESIGN_STATION, SYSTEM_BUILDER_DESIGN_SESSION
Optional SYSTEM_BUILDER_DESIGN_PORT (0 chooses ephemeral; set fixed for Station), SYSTEM_BUILDER_DESIGN_BROWSER_ORIGIN (exact trusted loopback origin), SYSTEM_BUILDER_DESIGN_REVOKED=true.
Run npm run design:local. Server binds only127.0.0.1. Stop with Ctrl+C. Restart retains database candidates/results.
Changing/revoking principal configuration requires process restart; expiry evaluated every request/authorization. This is explicitly isolated single-operator local authentication, not production Keycloak/OpenFGA/multi-tenant certification. Remote/public deployment requires separate TLS/auth qualification; local HTTP listener does not provide remote exposure.

## Protocol
Existing Station protocol1.0.0 unchanged. POST application/json /station/handshake, /station/command, /station/query with Authorization Bearer token. Unknown routes/methods reject. Untrusted browser origins reject; configured origin alone permitted. JSON body max1MiB+16KiB envelope overhead, server deadlines/headers limits explicit.
Session and complete context must match configured binding; context.workspaceRef matches principal scope. Client actorRef/actorRevisionRef never grant authorization. Server normalizes actual identity/authentication/policy/evidence and verifies actor revision, scope, action, resource and currentness horizon.
Command actionRef design.candidate.submit, targetRef exact candidate.artifactId, expectedRevisionRef prior owner revision or null; payload.candidate full document.
Queries parameters.operation exact/head/result; exact also parameters.artifactVersion, resourceRef artifact ID; result resourceRef commandRef. Projection payload.result is explicit found/absent/denied/unavailable/invalid-request. CURRENT only means exact technical owner lookup, not upstream business currentness. No event subscription support in this bounded service.
Safe fixed HTTP diagnostics do not expose tokens/database URL. Test isolation uses unique scoped identities, no destructive cleanup.

## Integrated construction evidence
A#1113/B#1114 independently integrated after seven workflows each PASS. Actual heavy104 tests0skip include PostgreSQL/HTTP/child process restart and committed-before-loss result recovery;95 Chromium predecessors/builds preserved. Independent Review/Closure still required before owner readiness handoff. Limits above are qualifications, no production claim.

## Bounded closure / consumer handoff
Independent Review#1115 passed own five checks and integrated. DesignWP1 bounded CLOSED effective only on validated TASK723 integration; WP16 consumes existing owner contract/HTTP, creates no backend. All local-only/schema/currentness/scale limits above remain. Candidate record retained and independently readable is the supported fact; no business approval/publication.
