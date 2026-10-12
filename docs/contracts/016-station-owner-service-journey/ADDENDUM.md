# Addendum016 — Station real owner-service journey
Date2026-10-12 UTC
Status: ACCEPTED — Planning#1111 integrated; owner explicitly authorizes full WP16 execution after independently closed Design readiness #1116.
Provenance: owner requests a WP15 sample video then WP16 planning after bounded WP15 closure#1110.
Admits only a bounded L3 connection/transport/projection journey through existing ADR0016 responsibilities.
No new Core/Design semantic owner, schema, authority, database or service is created by this admission.

## Goal and unchanged authority
A WP15 technical definition candidate travels Station -> SDK -> Station Gateway -> actual Core/domain
owner API, is retained by that owner and reappears through an exact query/reopen in a fresh browser.
Station local candidate/history/store remain available independently. Browser draft revision, portable
artifactVersion, owner revision, projection revision and business approval are distinct concepts.
Retained/ACCEPTED is not published, executed, upstream-resolved or business-approved.
SystemDefinition artifactType/schema, ADR0009, BusinessRecipe != SystemDefinition and Runtime autonomy
remain unchanged. Compiler/runtime projection and Release artifact repository are not authoring services.

## Hard owner readiness gate
Current source census finds protocol/SDK/Gateway but no production SystemDefinition authoring Core port,
owner command/query service or deployed Station ingress. Existing StationCorePort implementations are
test FakeCorePort/InMemoryCorePort. Do not move those fixtures into product or report their responses
as real integration. Existing artifact-store owns ReleaseArtifact payloads, not Design candidates.
Remaining-scope WBS explicitly routes missing services to their owning package and blocks dependency.
Before A promotion, the SB04 Design capability owner must supply accepted public candidate command/query/
result lookup/currentness contracts, deterministic server validation, atomic expected-revision conflict
handling, retry/idempotency rules, durable retention/restart proof, authenticated actor/context/eligibility
and a tested reachable Gateway endpoint. Package/ADR/contract materialization belongs to that owner.
This is a separately gated prerequisite, not hidden Construction C or a new Station-owned Core.

## Connection admission
Reuse StationClient/StationTransport and StationGateway/StationCorePort with unchanged protocol1.0.0.
The first candidate transport profile is bounded HTTP(S) request/response; transport-agnostic semantics
remain unchanged. Final routes, authentication binding and action/projection/resource references come
from the actual ready service contract, never guessed or embedded in imported artifacts.
Endpoint configuration is trusted operator/source configuration; no arbitrary file-provided URL,
credential in artifact/localStorage, cross-Core redirection or browser authorization from actorRef.
Validate inert complete payload/size/compatibility and correlate request/command/context/source/revision.
Expose disconnected/unavailable/rejected/stale/partial/unknown distinctly; don't upgrade owner output.
A valid accepted receipt may be followed by exact readback only; completion requires confirmed retained
revision and the complete expected envelope. Lost receipt/timeout may follow successful retention:
reconcile by same command identity and actual owner result-query/idempotency contract; no blind new command.
Reject stale writes atomically. Preserve local draft/history when denial, quota, connection failure,
invalid response, incomplete projection, mismatch or context switch occurs. No fallback to latest.
Retry is explicit and owner-qualified; undo is still local editing, not server compensation.
No continuous polling, collaboration/auto-merge, federation, publish/compile/deploy/runtime execution.

## Growing proof
Actual WP15 create/edit/materialize -> actual SDK network transport -> actual Gateway -> real owner API/
durable adapter -> receipt/exact query -> byte/metadata comparison -> fresh browser query/reopen.
Browser reload is not backend durability: prove owner restart/readback from the same durable provider.
Negative chain includes malformed/oversized response, wrong source/request/context/revision, denied actor,
owner rejection, stale baseline, two writers, loss of response after commit, explicit reconciliation,
disconnect/reconnect and dirty open cancellation. No hand-authored successful downstream fixture.
Preserve all95 predecessor Chromium journeys and public protocol/Core autonomy proof.
Service absence keeps Construction A BLOCKED; Planning can integrate honestly without product claims.

## Actual owner / Construction A admission
DesignWP1 closed through #1113–#1116 after independent construction/review/closure gates; actual local authenticated PostgreSQL/Gateway/owner commands/query/result/restart proof. O1–O4 READY_LOCAL. TASK718 promoted on freshmain with13 exact paths/public actual contracts and no backend/schema changes. Owner full execution authorization covers A/B/eligibleReview/Closure. No production/currentness/business approval inference.
