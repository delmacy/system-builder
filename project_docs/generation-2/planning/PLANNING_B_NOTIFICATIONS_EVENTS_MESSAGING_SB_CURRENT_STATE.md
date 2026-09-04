# Planning B — Notifications / Events / Messaging — SB Current State Reconciliation

Status: **PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED**

Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

## Scope

Repository archaeology only. This document records current product truth and gaps; it does not define target architecture or authorize implementation.

## Evidenced current state

1. The canonical blueprint says generated Runtime executes `jobs, events, integrations and files`, while Observe remains replaceable and non-required for runtime operation. This is architectural intent, not evidence of a general messaging implementation.
2. The current Notifications project documentation is explicit but planning-level: business notification intent should be independent of channel/provider; scope names recipient resolution, templates, channels, provider adapters, delivery/retry/status, preferences and correlation; WBS names versioned/localizable templates, retry/rate-limit/failure semantics and `sent/delivered/failed/read` evidence when available.
3. A concrete adjacent delivery primitive exists in `packages/observe/publish.ts`: callers provide an observer with `deliver(...)`; publication returns `not-configured`, `delivered`, `channel-failed`, `metadata-failed` or `findings-failed`; channel failure is fail-open with respect to deployment outcome. This proves a bounded callback delivery boundary and explicit local outcome vocabulary, not a canonical enterprise event/message/notification owner.

## Maturity assessment

**Bounded predecessor / planned capability, not a first-class general Notifications / Events / Messaging implementation.**

Fresh main does not evidence a canonical, durable owner spanning event/message/notification identities, subscriptions, fan-out cohorts, transport-independent delivery attempts, consumer acknowledgements/effective processing, ordering scopes, deduplication, replay/redrive/dead-letter, durable queues/topics, or provider substitution/drainage.

## Current strengths to preserve

- **KEEP** business notification intent separate from channel/provider realization.
- **KEEP** explicit delivery outcomes rather than treating invocation as success.
- **KEEP** fail-open behavior where an auxiliary Observe channel must not alter the authoritative deployment outcome.
- **KEEP** runtime autonomy and replaceable external observation/integration boundaries.
- **KEEP** correlation as an explicit planned concern rather than embedding business rules in templates/transports.

## Gaps and dispositions

### Identity and source of truth

**GENERALIZE / HARDEN.** No evidenced canonical identity model currently distinguishes producer intent, logical event/message/notification, delivery attempt, provider receipt, recipient/consumer cohort and consumer-effective processing. Provider IDs must not become canonical implicitly.

### Producer intent versus transport realization

**KEEP + GENERALIZE.** The Notifications scope already expresses the correct separation: a process says “notify X”; channel/provider can vary. Current Observe publication similarly separates caller payload from observer realization. The general capability is not implemented.

### Subscriptions, recipient resolution and fan-out

**INTEGRATE / HARDEN.** Recipient resolution/preferences are planned, but fresh main does not evidence durable subscriptions, revisioned recipient cohorts, fan-out lineage, per-recipient attempt identity, or re-resolution rules across retries/replay.

### Delivery attempt lineage and outcomes

**GENERALIZE / HARDEN.** Observe has bounded `delivered`/`channel-failed` outcomes, but there is no durable generic attempt ledger. Provider acknowledgement must remain distinct from delivery and consumer-effective processing.

### Ordering, deduplication and idempotency

**HARDEN.** No fresh-main evidence establishes ordering scope, sequence identity, duplicate detection, idempotent consumption or semantic deduplication for general messages/events.

### Retry, replay, redrive and dead-letter

**INTEGRATE / HARDEN.** Retry/rate-limit/failure semantics are planned in WBS. No implemented generic retry schedule, replay lineage, redrive authority, dead-letter identity or poison-message handling is evidenced.

### Acknowledgement and consumer-effective processing

**GENERALIZE.** Current bounded callback success proves only that `observer.deliver` returned. It does not prove downstream persistence, human receipt, business effect or consumer-effective processing. These states must remain separate.

### Provider/transport boundary and portability

**PROVIDERIZE where qualified; HARDEN portability.** Planning explicitly expects provider adapters and provider-independent business intent. Fresh main does not evidence a generic provider contract with semantic qualification, capability negotiation, replacement protocol or portable queue/topic/subscription state.

### Ambiguous effects and reconciliation

**HARDEN.** The Observe callback catches throws, but generic external transports can produce ambiguous outcomes after a remote mutation. No general persisted `UNKNOWN`/reconciliation mechanism is evidenced. Ambiguous mutation semantics therefore remain a gap: `UNKNOWN -> reconcile-before-retry` unless qualified idempotency proves safe retry.

### Residual cohorts and provider substitution

**HARDEN / DEFER implementation.** No current mechanism inventories/drains residual queues, subscriptions, delayed/retrying messages, dead letters, provider receipts, cached recipient cohorts or acknowledgements before provider retirement.

### Governance and authority

**INTEGRATE.** Notification sensitive-content/channel policy is planned. Fresh main does not evidence full hierarchical `Enterprise -> Station -> Role -> Person` authority for notification/event/messaging configuration. AI/AGWS must not create subscriptions, recipients, automations or delivery authority beyond effective inherited authority.

### Evidence qualification

**HARDEN.** Missing, stale or partial provider/consumer evidence must yield `PARTIAL/INCONCLUSIVE`, not inferred delivery or processing success. `sent`, provider accepted, delivered, read/acknowledged and consumer-effective processing are distinct claims.

## Boundaries preserved

- Workflow owns durable process progression; messaging transports signals/effects and does not become workflow truth.
- Integration & Automation owns external action/integration semantics; messaging does not silently own connector business effects.
- Authorization/Organization owns authority and recipient access; notification preferences do not amplify authority.
- Governance owns obligations/controls; notification audit evidence does not itself define policy.
- Data/Schema owns canonical data evolution; message payload schema does not become domain source of truth by transport.
- Provider/Binding owns provider selection/qualification; provider transport identity remains realization detail.
- Lifecycle owns compatibility/coexistence/deprecation semantics across revisions.
- Observability owns operational evidence/health; telemetry about delivery is not delivery truth itself.
- Architecture Reconciliation owns desired/observed truth reconciliation; messaging must expose evidence rather than invent convergence.
- UCA remains cross-cutting contract architecture, not a semantic god-object.

## Current-state disposition

Predominant disposition: **KEEP + HARDEN + GENERALIZE + INTEGRATE**, with **PROVIDERIZE** only for semantically qualified transport/channel realizations. No fresh-main evidence justifies `REPLACE`.

## Planning-B conclusion

`PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED`.

The SB has useful intent-level planning and a bounded Observe publication predecessor, but not a first-class general Notifications / Events / Messaging runtime owner. Target architecture must not be inferred in this phase.
