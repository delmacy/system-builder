import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  canonicalJson, supervisorEventRecordSchema, supervisorLeaseSchema,
  type SupervisorEventRecord, type SupervisorLease, type SupervisorProjection,
} from "./supervisor-contracts.js";

const eventFilePattern = /^\d{12}-AFEVT-[0-9a-f]{64}\.json$/;

export class DurableSupervisorStore {
  constructor(private readonly root: string) {}

  listPipelineIds(): string[] {
    if (!existsSync(this.root)) return [];
    return readdirSync(this.root, { withFileTypes: true })
      .filter((item) => item.isDirectory() && !item.name.startsWith("."))
      .map((item) => item.name)
      .filter((pipelineId) => {
        const directory = this.eventsDirectory(pipelineId);
        return existsSync(directory) && readdirSync(directory).some((name) => eventFilePattern.test(name));
      })
      .sort();
  }

  readEvents(pipelineId: string): SupervisorEventRecord[] {
    const directory = this.eventsDirectory(pipelineId);
    if (!existsSync(directory)) return [];
    return readdirSync(directory).filter((name) => eventFilePattern.test(name)).sort()
      .map((name) => supervisorEventRecordSchema.parse(JSON.parse(readFileSync(resolve(directory, name), "utf8"))));
  }

  projection(pipelineId: string): SupervisorProjection | undefined {
    return this.readEvents(pipelineId).at(-1)?.projection;
  }

  append(recordInput: SupervisorEventRecord): { record: SupervisorEventRecord; appended: boolean } {
    const record = supervisorEventRecordSchema.parse(recordInput);
    if (record.event.pipeline_id !== record.projection.pipeline_id) throw new Error("SUPERVISOR_EVENT_PROJECTION_MISMATCH");
    const events = this.readEvents(record.event.pipeline_id);
    const duplicate = events.find((item) => item.event.event_id === record.event.event_id);
    if (duplicate) {
      if (canonicalJson(duplicate) !== canonicalJson(record)) throw new Error(`SUPERVISOR_EVENT_ID_DIVERGENCE:${record.event.event_id}`);
      return { record: duplicate, appended: false };
    }
    const sequence = events.length + 1;
    const target = resolve(this.eventsDirectory(record.event.pipeline_id), `${String(sequence).padStart(12, "0")}-${record.event.event_id}.json`);
    atomicWrite(target, `${JSON.stringify(record, null, 2)}\n`);
    return { record, appended: true };
  }

  acquireLease(pipelineId: string, owner: string, now: string, ttlSeconds: number): SupervisorLease | undefined {
    const directory = this.leaseDirectory(pipelineId);
    mkdirSync(dirname(directory), { recursive: true });
    const lease = supervisorLeaseSchema.parse({ schema_version: 1, pipeline_id: pipelineId, owner, acquired_at: now, expires_at: new Date(Date.parse(now) + ttlSeconds * 1000).toISOString() });
    try {
      mkdirSync(directory);
      atomicWrite(resolve(directory, "lease.json"), `${JSON.stringify(lease, null, 2)}\n`);
      return lease;
    } catch (error) {
      if (!existsSync(directory)) throw error;
    }
    const existing = this.readLease(pipelineId);
    if (existing && Date.parse(existing.expires_at) > Date.parse(now)) return undefined;
    const stale = `${directory}.stale-${owner}-${Date.parse(now)}`;
    try {
      renameSync(directory, stale);
      rmSync(stale, { recursive: true, force: true });
    } catch {
      return undefined;
    }
    return this.acquireLease(pipelineId, owner, now, ttlSeconds);
  }

  releaseLease(lease: SupervisorLease): void {
    const existing = this.readLease(lease.pipeline_id);
    if (!existing || existing.owner !== lease.owner || existing.acquired_at !== lease.acquired_at) return;
    rmSync(this.leaseDirectory(lease.pipeline_id), { recursive: true, force: true });
  }

  private readLease(pipelineId: string): SupervisorLease | undefined {
    const path = resolve(this.leaseDirectory(pipelineId), "lease.json");
    if (!existsSync(path)) return undefined;
    try { return supervisorLeaseSchema.parse(JSON.parse(readFileSync(path, "utf8"))); } catch { return undefined; }
  }

  private eventsDirectory(pipelineId: string): string { return resolve(this.root, safeId(pipelineId), "events"); }
  private leaseDirectory(pipelineId: string): string { return resolve(this.root, safeId(pipelineId), ".lease"); }
}

function safeId(value: string): string {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(value)) throw new Error("SUPERVISOR_PIPELINE_ID_INVALID");
  return value;
}

function atomicWrite(target: string, contents: string): void {
  mkdirSync(dirname(target), { recursive: true });
  const temporary = `${target}.tmp-${process.pid}-${Math.random().toString(16).slice(2)}`;
  const handle = openSync(temporary, "wx");
  try { writeFileSync(handle, contents, "utf8"); fsyncSync(handle); } finally { closeSync(handle); }
  try { renameSync(temporary, target); } catch (error) { rmSync(temporary, { force: true }); throw error; }
}
