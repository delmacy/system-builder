import { randomUUID } from "node:crypto";
import { postgresQuery, sqlLiteral } from "@system-builder/postgres";
import type { CandidateReceipt, CandidateRecord } from "@system-builder/contracts/design-candidate";
import type { CandidateCommit, DesignCandidateRepository } from "./index.js";
const TABLE = "sb_design_candidate_v1";
const lit = sqlLiteral;
export class PostgresDesignCandidateRepository implements DesignCandidateRepository {
  private constructor(private readonly connectionString: string) {}
  static async open(connectionString: string): Promise<PostgresDesignCandidateRepository> {
    const repository = new PostgresDesignCandidateRepository(connectionString);
    await postgresQuery(connectionString, `BEGIN;
      SELECT pg_advisory_xact_lock(hashtextextended('${TABLE}',0));
      CREATE TABLE IF NOT EXISTS ${TABLE}_records (scope text NOT NULL, artifact text NOT NULL, version text NOT NULL, record jsonb NOT NULL, PRIMARY KEY(scope,artifact,version));
      CREATE TABLE IF NOT EXISTS ${TABLE}_heads (scope text NOT NULL, artifact text NOT NULL, revision text NOT NULL, PRIMARY KEY(scope,artifact));
      CREATE TABLE IF NOT EXISTS ${TABLE}_commands (scope text NOT NULL, actor text NOT NULL, command text NOT NULL, fingerprint text NOT NULL, receipt jsonb NOT NULL, PRIMARY KEY(scope,actor,command));
      COMMIT;`, "DESIGN");
    return repository;
  }
  async commit(input: CandidateCommit): Promise<CandidateReceipt> {
    const r = input.request, c = r.candidate;
    const scope=lit(r.scopeRef), actor=lit(r.actorRef), command=lit(r.commandRef), artifact=lit(c.artifactId), version=lit(c.artifactVersion), fingerprint=lit(input.fingerprint);
    const expected=r.expectedOwnerRevision===null ? "NULL" : lit(r.expectedOwnerRevision);
    const revision=lit("design-revision:"+randomUUID());
    const recordBase=lit(JSON.stringify({scopeRef:r.scopeRef,artifactId:c.artifactId,artifactVersion:c.artifactVersion,text:input.text,digest:input.digest,retainedAt:input.retainedAt}));
    // A transaction-level advisory lock serializes every Design writer across processes.
    // One transaction commits immutable bytes, head and command result together; reads use the ledger.
    const rows=await postgresQuery(this.connectionString,`BEGIN;
      SELECT pg_advisory_xact_lock(hashtextextended('${TABLE}',0));
      WITH old AS (SELECT * FROM ${TABLE}_commands WHERE scope=${scope} AND actor=${actor} AND command=${command}),
      head AS (SELECT revision FROM ${TABLE}_heads WHERE scope=${scope} AND artifact=${artifact}),
      decision AS (SELECT CASE WHEN EXISTS(SELECT 1 FROM ${TABLE}_records WHERE scope=${scope} AND artifact=${artifact} AND version=${version}) THEN 'immutable-conflict'
        WHEN (SELECT revision FROM head) IS DISTINCT FROM ${expected}::text THEN 'stale-owner-revision' ELSE NULL END AS reason),
      retained AS (INSERT INTO ${TABLE}_records(scope,artifact,version,record)
        SELECT ${scope},${artifact},${version},${recordBase}::jsonb || jsonb_build_object('ownerRevision',${revision},'predecessorOwnerRevision',(SELECT revision FROM head))
        FROM decision WHERE reason IS NULL AND NOT EXISTS(SELECT 1 FROM old) RETURNING record),
      advanced AS (INSERT INTO ${TABLE}_heads(scope,artifact,revision) SELECT ${scope},${artifact},record->>'ownerRevision' FROM retained
        ON CONFLICT(scope,artifact) DO UPDATE SET revision=EXCLUDED.revision RETURNING revision),
      result AS (SELECT CASE WHEN reason IS NULL THEN jsonb_build_object('status','retained','commandRef',${command},'record',(SELECT record FROM retained))
        ELSE jsonb_build_object('status','rejected','commandRef',${command},'reason',reason) END AS receipt
        FROM decision WHERE NOT EXISTS(SELECT 1 FROM old) AND (reason IS NOT NULL OR EXISTS(SELECT 1 FROM advanced))),
      logged AS (INSERT INTO ${TABLE}_commands(scope,actor,command,fingerprint,receipt)
        SELECT ${scope},${actor},${command},${fingerprint},receipt FROM result RETURNING receipt)
      SELECT receipt::text FROM logged UNION ALL SELECT CASE WHEN fingerprint=${fingerprint} THEN receipt
        ELSE jsonb_build_object('status','rejected','commandRef',${command},'reason','command-conflict') END::text FROM old;
      COMMIT;`, "DESIGN");
    const json=rows.find(row=>row[0]?.startsWith("{"))?.[0];
    if (!json) throw new Error("DESIGN_COMMIT_RESULT_MISSING");
    return JSON.parse(json) as CandidateReceipt;
  }
  private async value<T>(sql: string): Promise<T|null> { const rows=await postgresQuery(this.connectionString,sql,"DESIGN"); const value=rows[0]?.[0]; return value==null ? null : JSON.parse(value) as T; }
  async exact(scope: string, artifact: string, version: string): Promise<CandidateRecord|null> {
    return this.value(`SELECT record::text FROM ${TABLE}_records WHERE scope=${lit(scope)} AND artifact=${lit(artifact)} AND version=${lit(version)};`);
  }
  async head(scope: string, artifact: string): Promise<string|null> {
    const rows=await postgresQuery(this.connectionString,`SELECT revision FROM ${TABLE}_heads WHERE scope=${lit(scope)} AND artifact=${lit(artifact)};`,"DESIGN"); return rows[0]?.[0]??null;
  }
  async result(scope: string, actor: string, command: string): Promise<CandidateReceipt|null> {
    return this.value(`SELECT receipt::text FROM ${TABLE}_commands WHERE scope=${lit(scope)} AND actor=${lit(actor)} AND command=${lit(command)};`);
  }
}
