# ADR-0015 — Positive TLS server-identity verification for PostgreSQL transport

Status: Accepted

## Context

The PostgreSQL transport is the durable substrate for the System Builder factory
(Catalog, Release/Artifact, Deploy state, Runtime state) and for the autonomous
managed Runtime that a Deployment starts. Transport TLS is negotiated, but the
server's certificate identity is never positively verified.

In `packages/postgres/index.ts` the TLS connection is created with
`rejectUnauthorized: false`:

```
const secure = createTlsConnection({ socket, servername: config.host, rejectUnauthorized: false });
```

The same pattern is emitted into the rendered autonomous Runtime entrypoint in
`packages/runtime-core/postgres-state.ts`:

```
const secure = createPostgresTls({ socket, servername: config.host, rejectUnauthorized: false });
```

`sslmode` supports only `disable | prefer | require`. None of these verifies the
server certificate or hostname. `require` merely demands that some TLS session
be established; it does not bind the session to a trusted server identity. A
connection therefore remains vulnerable to a man-in-the-middle that terminates
the TLS session, and SCRAM-SHA-256 credentials (deployment/`deploy_auth`,
factory, and secret-resolved Runtime bindings) travel to whichever server answers
the connection string.

This is `TD-P8-02` in the P10 package, carried from the P9 Integration &
Technical Debt Review. It was escalated to ADR because changing TLS identity
verification is an L3/L4-adjacent security-policy change: it affects a shared
transport contract, the rendered Runtime behavior, and the failure modes of any
client system that depends on the Builder or a deployed Runtime. Per Sprint Mode,
the policy must be decided here and accepted by a human before any construction
Sprint.

The SecretResolver, built in Sprint `P10-PRODUCTION-SECRETRESOLVER-01`
(TASK-128/129/130, merged through PR #201), now resolves symbolic secret
references into the managed Runtime process environment. Those resolved values
include authenticated database bindings. Positive identity verification
therefore protects the exact material that SecretResolver makes available at
runtime.

## Options considered

| Option | Result |
| --- | --- |
| Keep `rejectUnauthorized: false` as the only behavior | Rejected. No deployment or Runtime authenticates the PostgreSQL server identity; SCRAM credentials are exposed to any TLS-terminating intermediary. |
| Remove `rejectUnauthorized: false` unconditionally and require identity verification everywhere | Rejected as the *default migration policy* for existing deployments: a hard switch could break currently-working authenticated transports where no CA/identity is configured. Compatibility before replacement (constitutional invariant 5). |
| Add a `verify-full` mode that requires a trusted CA and hostname match, defaulting to the existing lenient behavior, and make the Runtime adopt verification when the operating configuration proves it | Selected. New capability added; identity verification is opt-in for existing transports and becomes enforceable, while a deployed Runtime verifies the server identity it binds to. |
| Add only `verify-ca` (chain trust) without hostname binding | Considered. Chain trust is weaker than hostname binding; `verify-full` subsumes it. We expose the strictest mode and keep the mode set small. |
| Use a separately configured CA trust store | Selected as the identity source, via the connection string's standard `sslmode`/CA knobs rather than a new bespoke global config. |

## Decision

### Add a positive-verification mode

Extend the transport's `sslmode` set to support a positive identity verification
mode in addition to `disable | prefer | require`:

- `verify-ca` — the server's certificate chain must validate against a trusted
  CA; the hostname is not additionally bound.
- `verify-full` — the server's certificate chain must validate against a trusted
  CA **and** the certificate hostname/identity must match the target host.

`verify-full` is the authoritative positive-identity mode and is what `TD-P8-02`
calls for. `verify-ca` is provided for environments where hostname binding is
not meaningful but chain trust is still desired. Both modes are fail-closed: if
the server identity cannot be positively verified, the connection must fail with
a deterministic diagnostic and must not fall back to a lenient session.

### CA trust source

Trusted CA material is supplied through the standard PostgreSQL connection
parameter (e.g. a CA file/certificate option) so that the transport stays a
drop-in PostgreSQL client and secrets/CA never enter durable Release or
Deployment evidence. When `verify-ca`/`verify-full` is requested and no trusted
CA is available, the connection fails closed with an explicit diagnostic rather
than silently downgrading.

### Rendering into the autonomous Runtime

The rendered Runtime entrypoint in `packages/runtime-core/postgres-state.ts`
must honor the same identity mode and CA configuration so that a deployed
autonomous Runtime performs the same positive verification. The rendered
entrypoint continues to read connection configuration from its runtime
environment (resolved by SecretResolver), never embeds CA or credential material
in the artifact or in durable evidence.

### Backward compatibility

`disable | prefer | require` keep their existing semantics. Existing deployments
that do not request `verify-ca`/`verify-full` continue to work unchanged. The
positive modes are opt-in, satisfying compatibility-before-replacement. The
default for a connection string that specifies none of the positive modes remains
the current behavior; there is no silent downgrade of an explicitly requested
positive mode.

### Scope of the construction Sprint

The construction Sprint (P10 Sprint 2, TLS/server-identity hardening) is
authorized to change only the PostgreSQL transport and its rendered Runtime
counterpart and their tests/docs, to:

1. parse and validate `verify-ca`/`verify-full` (and reject unknown/malformed
   positive modes deterministically);
2. verify chain trust and, for `verify-full`, hostname binding using the trusted
   CA source;
3. fail closed with deterministic diagnostics when verification cannot be
   satisfied;
4. render the same behavior into the autonomous Runtime entrypoint;
5. prove positive, negative and identity-mismatch cases with tests, including a
   rendered-Runtime E2E and an authenticated (SCRAM) positive-verification E2E.

It must not change the public `sslmode` parsing contract for the existing three
modes, the canonical schemas, the SecretResolver no-leakage invariants, or any
other package boundary. A later Sprint/ADR may change the migration default; this
ADR does not flip any existing default.

## Threat model

The mode eliminates man-in-the-middle termination of the TLS session when a
positive mode is selected: a connection cannot be silently redirected to a
rogue server without the trusted CA and, for `verify-full`, a matching hostname.
This protects the SCRAM-SHA-256 credentials and secret-resolved bindings that the
transport authenticates with. The residual risk is confined to deployments that
choose not to enable a positive mode; those retain their prior behavior and are
not represented as more secure than they are.

## Consequences

- New `sslmode` values (`verify-ca`, `verify-full`) become available and are
  positively verified, fail-closed.
- Existing transports unchanged; no silent downgrade of an explicitly requested
  positive mode.
- The autonomous Runtime verifies the PostgreSQL server identity it binds to,
  under the same policy as the factory transport.
- CA and credential material remain outside durable Release/Deployment evidence
  and outside rendered artifacts.
- Deployment/`deploy_auth` and secret-resolved bindings gain transport-level
  server authentication when operators enable a positive mode.
- Operators must supply a trusted CA (and, for `verify-full`, a matching
  hostname) to use the positive modes; absent that, positive requests fail
  closed.

## Required downstream implementation boundary

The next construction Sprint implements only the transport/Runtime TLS identity
verification and its tests/docs as bounded above. It does not change the
SecretResolver, canonical schemas, other packages, the public parsing contract
for existing modes, or the migration defaults.

## Rollback

Revert the transport and rendered-Runtime identity verification changes. The
`sslmode` set returns to `disable | prefer | require`, and requests for
`verify-ca`/`verify-full` are rejected as unknown modes. Preserve the accepted
ADR as historical policy; a future ADR may reintroduce positive verification or
change the migration default.
