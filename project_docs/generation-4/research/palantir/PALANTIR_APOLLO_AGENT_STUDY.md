# Palantir Apollo / Agent Study

Date: 2026-09-23
Status: `RESEARCH / PUBLIC-DOC EVIDENCE`

## Findings

### P-A01 — Outbound-only agent communication
**Mechanism:** Apollo Agents in a managed Spoke execute Hub-provided Plans and return Reported State. Public docs state agent communication to Hub/artifact repositories uses encrypted outbound requests. Environment registration creates an environment-unique cryptographic key/certificate signed by the Hub.

**Problem:** operate remote environments without requiring inbound control-plane access.

**Primitive:** enrolled executor identity + outbound authenticated control channel.

**SB relation:** strong candidate for Host Agent enrollment/connectivity; avoids making inbound SSH/root the normal control mechanism.

**Trade-offs/failures:** outbound reachability, certificate lifecycle, artifact repository reachability, compromised-agent containment and revocation remain independent problems.

**Classification:** `ADOPT PRINCIPLE`.

### P-A02 — Plan is an explicit change artifact
**Mechanism:** Apollo generates Plans for install/config/version/uninstall/secret changes. Plans execute only when relevant Constraints pass; history, task status and failure output are visible.

**Problem:** prevent opaque background convergence from hiding why/when change occurs.

**Primitive:** proposed change + preconditions + execution evidence.

**SB relation:** candidate distinction `Desired intent != ChangePlan != Authorized execution != Reported result != Effective service`.

**Classification:** `ADOPT PRINCIPLE`.

### P-A03 — Constraints are first-class admission conditions
Maintenance windows, dependency/config conditions and suppression windows can block Plans. Break-glass can bypass some constraints explicitly.

**Primitive:** execution admission policy separate from plan payload.

**SB relation:** fits existing authority/currentness/effect-admissibility research. Constraint bypass must create stronger evidence, not silently weaken policy.

**Classification:** `ALREADY COVERED / ADAPT`.

### P-A04 — Failure suppresses further mutation locally
Failed Plans trigger Entity suppression; enough entity failures can trigger Environment suppression. Automatic rollback Plans may still pass automatic suppression, while human suppression remains authoritative.

**Primitive:** failure containment + bounded automated recovery + human override precedence.

**Failure warning:** rollback is not time reversal. External effects/schema migrations may be irreversible or only forward-repairable.

**SB relation:** preserve `Compensation != rollback`, `checkpoint != external effects settled`, and require rollback qualification per effect class.

**Classification:** `ADAPT`.

### P-A05 — Reported State is explicit observation
Agents report deployed version, config, liveness/readiness and metadata. Apollo uses Reported State in release promotion decisions.

**Primitive:** observed state separated from intended release/channel/config.

**SB relation:** direct reinforcement of `Desired != Observed != Effective` and `Running != Healthy != Ready != Effective`.

**Classification:** `ALREADY COVERED`.

### P-A06 — Connectivity expectation is modeled
Environment connection settings distinguish Connected, Intermittent, No connection expected and Relayed from another Hub. Intermittent state explicitly allows stale-last-reported operational views without treating expected gaps as outages.

**Primitive:** expected connectivity mode != instantaneous reachability != evidence freshness.

**SB relation:** Host/Agent state should not collapse `OFFLINE` into `BROKEN`. Currentness must accompany last observation.

**Classification:** `ADOPT PRINCIPLE`.

### P-A07 — Fleet rollout is bounded
Apollo supports release channels, health-based promotion/automatic recall and ramped rollouts. Ramped rollout staggers upgrades across a fleet.

**Primitive:** staged promotion + cohort exposure + health evidence + recall.

**SB relation:** candidate for Release/Deployment lifecycle, but health criteria cannot substitute for semantic compatibility or authority proof.

**Classification:** `ADAPT`.

## Adversarial implications for SB

- **Control-plane outage:** Host Agent must not become a runtime dependency; autonomous client runtime continues.
- **Agent disconnected:** last Reported State becomes stale evidence, never current truth.
- **Stale Plan:** plan admission must bind relevant revisions/security floors and be revalidated when horizons expire.
- **Version skew:** compatibility is a guarantee vector, not `agentVersion >= x` alone.
- **Compromised Agent:** environment identity does not prove truthful execution; attestation/evidence/least privilege/revocation remain open.
- **Network partition:** restored connectivity does not automatically reconcile authority or external effects.
- **Partial rollout:** fleet-level release identity must retain cohort and per-host evidence.
- **Rollback after schema/effect change:** rollback availability is capability/effect-specific.

## Important non-equivalence

Apollo public Spoke documentation is strongly Kubernetes-oriented. SB's Host Agent hypothesis is broader: Windows/Linux hosts, workstations, VPSs, service managers, container engines and potentially Kubernetes. Therefore `Apollo Agent pattern -> SB Host Agent` is an architectural analogy, not a deployment-model copy.

## Sources

Official Palantir docs accessed 2026-09-23: Apollo Agents; Plans and Constraints; How Apollo works; Environments; Configure Environment connection settings; Ramped rollouts; Release promotion pipeline; release recall/roll-off documentation.