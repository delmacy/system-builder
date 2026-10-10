# Palantir Apollo / Agent Study

Date: 2026-09-23
Status: `RESEARCH / PUBLIC-DOC EVIDENCE`
Implementation state: `DEFERRED_IMPROVEMENT`

## Findings

### P-A01 — Outbound-only agent communication
**Mechanism:** Apollo Agents in a managed Spoke execute Hub-provided Plans and return Reported State. Public docs state agent communication to Hub/artifact repositories uses encrypted outbound requests. Environment registration creates an environment-unique cryptographic key/certificate signed by the Hub.

**Problem:** operate remote environments without requiring inbound control-plane access.

**Primitive:** enrolled executor identity + outbound authenticated control channel.

**SB relation:** strong candidate for Host Agent enrollment/connectivity; avoids making inbound SSH/root the normal control mechanism.

**Trade-offs/failures:** outbound reachability, certificate lifecycle, artifact repository reachability, compromised-agent containment and revocation remain independent problems.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-A02 — Plan is an explicit change artifact
**Mechanism:** Apollo generates Plans for install/config/version/uninstall/secret changes. Plans execute only when relevant Constraints pass; history, task status and failure output are visible.

**Problem:** prevent opaque background convergence from hiding why/when change occurs.

**Primitive:** proposed change + preconditions + execution evidence.

**SB relation:** candidate distinction `Desired intent != ChangePlan != Authorized execution != Reported result != Effective service`.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-A03 — Constraints are first-class admission conditions
Maintenance windows, dependency/config conditions and suppression windows can block Plans. Break-glass can bypass some constraints explicitly.

**Primitive:** execution admission policy separate from plan payload.

**SB relation:** fits existing authority/currentness/effect-admissibility research. Constraint bypass must create stronger evidence, not silently weaken policy.

**Classification:** `ALREADY COVERED / ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-A04 — Failure suppresses further mutation locally
Failed Plans trigger Entity suppression; enough entity failures can trigger Environment suppression. Automatic rollback Plans may still pass automatic suppression, while human suppression remains authoritative.

**Primitive:** failure containment + bounded automated recovery + human override precedence.

**Failure warning:** rollback is not time reversal. External effects/schema migrations may be irreversible or only forward-repairable.

**SB relation:** preserve `Compensation != rollback`, `checkpoint != external effects settled`, and require rollback qualification per effect class.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-A05 — Reported State is explicit observation
Agents report deployed version, config, liveness/readiness and metadata. Apollo uses Reported State in release promotion decisions.

**Primitive:** observed state separated from intended release/channel/config.

**SB relation:** direct reinforcement of `Desired != Observed != Effective` and `Running != Healthy != Ready != Effective`.

**Classification:** `ALREADY COVERED`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-A06 — Connectivity expectation is modeled
Environment connection settings distinguish Connected, Intermittent, No connection expected and Relayed from another Hub. Intermittent state explicitly allows stale-last-reported operational views without treating expected gaps as outages. `No connection expected` cannot receive Plans from that Hub and cannot participate in Release Channel promotion. `Relayed from another Hub` imports health/reported state through bundles for viewing; that Hub cannot issue Plans to the Environment.

**Primitive:** expected connectivity mode != instantaneous reachability != evidence freshness != mutation authority.

**SB relation:** Host/Agent state should not collapse `OFFLINE` into `BROKEN`; a Station view of relayed/imported state must not imply command authority. Currentness must accompany last observation.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-A07 — Fleet rollout is bounded
Apollo supports release channels, health-based promotion/automatic recall and ramped rollouts. Ramped rollout staggers upgrades across a fleet.

**Primitive:** staged promotion + cohort exposure + health evidence + recall.

**SB relation:** candidate for Release/Deployment lifecycle, but health criteria cannot substitute for semantic compatibility or authority proof.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-A08 — Air-gapped delivery is an explicit artifact flow
**Source/date:** Palantir Apollo public What's New, Payload Bundler entry (2022-06-10), accessed 2026-09-23.

**Mechanism:** Payload Bundler prepares bundles for remote namespaces in air-gapped secure networks; the documented bundle includes releases, settings and metadata needed to update tracked environments. Separately, Apollo connection settings distinguish live-connected state from state relayed/imported through bundles.

**Problem:** move release intent and operational evidence across a boundary where continuous control-plane connectivity does not exist.

**Universal primitive:** exportable signed/versioned control artifact + explicit transfer/import boundary + freshness provenance.

**Preconditions:** immutable artifact identities, dependency closure, destination identity, integrity/authenticity checks, import authorization and explicit currentness.

**Trade-offs/failure modes:** bundle age, omitted dependencies, replay, wrong destination, partial import, delayed revocation/security floor and false assumption that imported reported state is live. A bundle is transport, not authority by itself.

**Lock-in:** Apollo's bundle format and namespace/environment semantics are platform-specific.

**SB relation:** supports future disconnected Host/Core operation, but SB must keep `bundle possession != admission authority`, `imported state != current state`, and autonomous client runtime independent from Builder availability.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-A09 — Data Connection separates tunnel execution from local worker execution
**Source/date:** Palantir Data Connection Architecture, Core Concepts, Agent Proxy configuration and Agent Worker docs, accessed 2026-09-23.

**Mechanism:** current recommended agent-proxy/thin-mode keeps computation in isolated Foundry workers while the on-prem agent provides a websocket-backed network path. Legacy agent-worker mode executes capabilities on the agent host. Agent-proxy policies can constrain host/port; optional Foundry-side and host-local allowlists plus host firewall add independent layers. The local allowlist is required to be non-writable by the agent process.

**Problem:** private-network reachability without automatically granting the intermediary broad execution authority.

**Universal primitive:** independently grantable `CONNECTIVITY` and `EXECUTION` capabilities + defense-in-depth egress scope.

**Preconditions:** destination-scoped policy, independently protected local policy, authenticated channel, least-privilege process identity and auditable configuration authority.

**Trade-offs/failure modes:** tunnel compromise, policy drift between central/local controls, confused-deputy routing, destination rebinding, proxy exhaustion and over-privileged host. Multiple controls can disagree; central UI state is not proof that the host-local firewall/allowlist is effective.

**Lock-in:** Data Connection policy/resource model, worker runtime and managed websocket implementation are Palantir-specific.

**SB relation:** strengthens—but does not decide—the open question whether one Host Agent binary should expose separately authorized Connectivity/Tunnel and Execution capabilities. This is post-visual architecture work, not a reason to refactor Agent now.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-A10 — Agent software freshness is observable and upgrades are disruptive
**Source/date:** Palantir Data Connection Agent configuration reference, accessed 2026-09-23.

**Mechanism:** Data Connection exposes Agent/Agent Manager `version stale time`; automatic upgrades run only in configured weekly maintenance windows. Upgrade restarts terminate running jobs. Palantir recommends at least two agents per source and staggered upgrade windows so a partner agent can absorb work. Reinstallation is the documented recovery path when an agent remains unhealthy or fails to upgrade.

**Problem:** keep remote intermediary software patched while bounding operational disruption.

**Universal primitive:** software-freshness evidence + maintenance admission window + redundant executor cohort + staggered mutation.

**Preconditions:** redundant capacity, retry-safe work or explicit interrupted-work reconciliation, compatible versions, health/currentness telemetry and retained recovery identity/secrets where required.

**Trade-offs/failure modes:** update interrupts in-flight work; stale-version metric measures software age, not exploitability or semantic compatibility; both redundant agents may share a correlated defect; retries may duplicate external effects; reinstall can alter identity/secrets if continuity material is lost.

**Lock-in:** Palantir's coordinator, agent packaging, plugin/cache and upgrade mechanism are specific.

**SB relation:** future Host Agent upgrades must not equate `latest` with `admissible`; Station may eventually visualize version freshness separately from health/readiness. No backend work is promoted now.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-A11 — Local secret continuity creates a recovery boundary
**Source/date:** Palantir Data Connection Architecture and Agent configuration reference, accessed 2026-09-23.

**Mechanism:** in legacy agent-worker mode, encrypted source credentials are stored platform-side while encryption keys live on the agent. Host migration/reinstallation guidance explicitly preserves local source-encryption key files; using a fresh download without them can require credentials to be re-entered. In proxy mode, credentials remain platform-managed and computation occurs in Foundry workers.

**Problem:** protect source credentials while permitting remote execution and host recovery.

**Universal primitive:** secret custody location is part of execution/recovery architecture, not an implementation detail.

**Preconditions:** explicit key custody, backup/restore authority, rotation/revocation, host compromise model and recovery identity semantics.

**Trade-offs/failure modes:** lost local key destroys decryptability; copied key may clone authority; host compromise exposes a decryption boundary; platform-held secret path increases platform dependence. Backup availability and credential authority are distinct.

**Lock-in:** Palantir's encryption/key placement and agent-worker lifecycle are implementation-specific.

**SB relation:** Host Agent recovery must eventually distinguish `host identity != recoverable key material != provider credential != execution authority`; clone detection/re-enrollment remains open.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

## Adversarial implications for SB

- **Control-plane outage:** Host Agent must not become a runtime dependency; autonomous client runtime continues.
- **Agent disconnected:** last Reported State becomes stale evidence, never current truth.
- **Stale Plan/bundle:** admission binds relevant revisions/security floors and revalidates expired horizons.
- **Version skew:** software freshness is evidence, not compatibility proof; compatibility remains a guarantee vector.
- **Compromised Agent:** environment identity does not prove truthful execution; local immutable policy, least privilege, revocation and recovery remain separate defenses.
- **Network partition:** restored connectivity does not automatically reconcile authority or external effects.
- **Partial rollout:** fleet-level release identity retains cohort and per-host evidence.
- **Rollback after schema/effect change:** rollback availability is capability/effect-specific.
- **Upgrade kills in-flight work:** interruption must not silently convert a retry into a new business effect.
- **Relayed multi-Hub state:** visibility from Hub B does not imply mutation authority from Hub B.
- **Copied recovery keys:** recoverability must not silently create two simultaneously authoritative agent identities.

## Immediate Station-only implications

No Core/Agent/infra implementation is authorized by these findings. The only near-term visual constraints are representational: Station should preserve separate concepts for connectivity expectation, freshness, health/readiness, software-version freshness, reported/imported state and command authority. A read-only/relayed or stale surface must not visually imply live control.

## Important non-equivalence

Apollo public Spoke documentation is strongly Kubernetes-oriented. Data Connection agents are a separate product mechanism with thin-proxy and legacy local-worker modes. SB's Host Agent hypothesis is broader: Windows/Linux hosts, workstations, VPSs, service managers, container engines and potentially Kubernetes. Therefore these are architectural analogies, not evidence that the products have equivalent boundaries.

## Sources

Official Palantir documentation accessed 2026-09-23: Apollo Agents; Plans and Constraints; How Apollo works; Environments; Configure Environment connection settings; Payload Bundler announcement; Ramped rollouts; Release promotion/recall documentation; Data Connection Architecture; Core Concepts; Agent configuration reference; Agent proxy configuration reference; Agent worker configuration; Set up an agent.