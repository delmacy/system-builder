# WP16 owner/service readiness census
Fresh main92a3006735cf051d74ceddd8ed2d73f980f6c29f; WP15#1110 integrated after five closure workflows/95 Chromium journeys2.2m.
Sources read: ADR0016/0017/0009, Blueprint, remaining-scope WBS, actual SDK/Gateway/protocol, current
SystemDefinition exports, artifact-store and station-core-e2e. Repository is factual authority.

| Required capability | Existing evidence | Readiness |
|---|---|---|
| Versioned client/protocol | packages/station-sdk/index.ts and contracts/station-core/index.ts | ready bounded protocol |
| Delegating Gateway | apps/station-gateway/index.ts, injected StationCorePort | ready routing, not owner |
| Canonical ownership | ADR0016/Core/domain; Blueprint SB04 Design | existing responsibility, implementation gap |
| Candidate command/query service | only test InMemoryCorePort rename example found | missing production implementation |
| Durable candidate retention/restart | artifact-store handles ReleaseArtifact payloads only | missing Design candidate adapter |
| Network ingress/auth/session binding | no production Station HTTP implementation found in census | missing actual endpoint/qualification |
| Studio candidate chain | WP15 actual engine/UI/tests | ready local only |
| Browser/API/data/response |95 browser cases use local candidates | WP16 unproven |

Guessed apps/core/index.ts/core-runtime/core-server and packages/design/index.ts are not readiness evidence;
404 is only path evidence. StationCorePort search results point to interface, specs and test doubles.
No existing owner API is inferred from the generic protocol, compiler/runtime execution or schemas.
Gate O1: owner package supplies public typed operations/retention/currentness/result lookup/version/conflict.
Gate O2: actual durable provider, server schema/reference rules, authenticated actor/context eligibility.
Gate O3: Gateway network contract/deployment/TLS/config and complete process/restart/HTTP proof.
Gate O4: accepted owner architecture/contracts and explicit execution authority, fresh-main task revalidation.
All O1–O3 currently unmet. TASK718 prepared BLOCKED; no product implementation authorized.
Recommended next eligible baseline work: separate SB04 Design owner-service Planning, scope/ADR as needed.
Its package/task IDs and database choice are not pre-reserved by WP16; readiness is proved from real outputs.
