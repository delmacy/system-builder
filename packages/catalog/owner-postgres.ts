import { randomUUID } from "node:crypto";
import { postgresQuery, sqlLiteral } from "@system-builder/postgres";
import type { CatalogFamily, CatalogList, CatalogPage, CatalogReceipt, CatalogRecord } from "@system-builder/contracts/catalog-owner";
import type { CatalogCommit, CatalogOwnerRepository } from "./owner-service.js";
const TABLE = "sb_catalog_owner_v1";
const lit = sqlLiteral;
export class PostgresCatalogOwnerRepository implements CatalogOwnerRepository {
  private constructor(private readonly connectionString: string) {}
  static async open(connectionString: string): Promise<PostgresCatalogOwnerRepository> {
    const repository = new PostgresCatalogOwnerRepository(connectionString);
    await postgresQuery(connectionString, `BEGIN;
      SELECT pg_advisory_xact_lock(hashtextextended('${TABLE}',0));
      CREATE TABLE IF NOT EXISTS ${TABLE}_records (scope text NOT NULL, family text NOT NULL, artifact text NOT NULL, version text NOT NULL, record jsonb NOT NULL, PRIMARY KEY(scope,family,artifact,version));
      CREATE TABLE IF NOT EXISTS ${TABLE}_heads (scope text NOT NULL, family text NOT NULL, artifact text NOT NULL, revision text NOT NULL, PRIMARY KEY(scope,family,artifact));
      CREATE TABLE IF NOT EXISTS ${TABLE}_commands (scope text NOT NULL, actor text NOT NULL, command text NOT NULL, fingerprint text NOT NULL, receipt jsonb NOT NULL, PRIMARY KEY(scope,actor,command));
      COMMIT;`, "CATALOG");
    return repository;
  }
  async commit(input: CatalogCommit): Promise<CatalogReceipt> {
    const r = input.request, c = r.entry;
    const scope=lit(r.scopeRef), actor=lit(r.actorRef), command=lit(r.commandRef), artifact=lit(c.id), version=lit(c.version), fingerprint=lit(input.fingerprint), family=lit(c.family);
    const expected=r.expectedOwnerRevision===null ? "NULL" : lit(r.expectedOwnerRevision);
    const revision=lit("catalog-revision:"+randomUUID());
    const recordBase=lit(JSON.stringify({scopeRef:r.scopeRef,family:c.family,id:c.id,version:c.version,text:input.text,digest:input.digest,retainedAt:input.retainedAt}));
    // A transaction-level advisory lock serializes every Catalog writer across processes.
    // One transaction commits immutable bytes, head and command result together; reads use the ledger.
    const rows=await postgresQuery(this.connectionString,`BEGIN;
      SELECT pg_advisory_xact_lock(hashtextextended('${TABLE}',0));
      WITH old AS (SELECT * FROM ${TABLE}_commands WHERE scope=${scope} AND actor=${actor} AND command=${command}),
      head AS (SELECT revision FROM ${TABLE}_heads WHERE scope=${scope} AND family=${family} AND artifact=${artifact}),
      decision AS (SELECT CASE WHEN EXISTS(SELECT 1 FROM ${TABLE}_records WHERE scope=${scope} AND family=${family} AND artifact=${artifact} AND version=${version}) THEN 'duplicate'
        WHEN (SELECT revision FROM head) IS DISTINCT FROM ${expected}::text THEN 'stale-owner-revision' ELSE NULL END AS reason),
      retained AS (INSERT INTO ${TABLE}_records(scope,family,artifact,version,record)
        SELECT ${scope},${family},${artifact},${version},${recordBase}::jsonb || jsonb_build_object('ownerRevision',${revision},'predecessorOwnerRevision',(SELECT revision FROM head))
        FROM decision WHERE reason IS NULL AND NOT EXISTS(SELECT 1 FROM old) RETURNING record),
      advanced AS (INSERT INTO ${TABLE}_heads(scope,family,artifact,revision) SELECT ${scope},${family},${artifact},record->>'ownerRevision' FROM retained
        ON CONFLICT(scope,family,artifact) DO UPDATE SET revision=EXCLUDED.revision RETURNING revision),
      result AS (SELECT CASE WHEN reason IS NULL THEN jsonb_build_object('status','retained','commandRef',${command},'record',(SELECT record FROM retained))
        ELSE jsonb_build_object('status','rejected','commandRef',${command},'reason',reason) END AS receipt
        FROM decision WHERE NOT EXISTS(SELECT 1 FROM old) AND (reason IS NOT NULL OR EXISTS(SELECT 1 FROM advanced))),
      logged AS (INSERT INTO ${TABLE}_commands(scope,actor,command,fingerprint,receipt)
        SELECT ${scope},${actor},${command},${fingerprint},receipt FROM result RETURNING receipt)
      SELECT receipt::text FROM logged UNION ALL SELECT CASE WHEN fingerprint=${fingerprint} THEN receipt
        ELSE jsonb_build_object('status','rejected','commandRef',${command},'reason','command-conflict') END::text FROM old;
      COMMIT;`, "CATALOG");
    const json=rows.find(row=>row[0]?.startsWith("{"))?.[0];
    if (!json) throw new Error("CATALOG_COMMIT_RESULT_MISSING");
    return JSON.parse(json) as CatalogReceipt;
  }
  private async value<T>(sql: string): Promise<T|null> { const rows=await postgresQuery(this.connectionString,sql,"CATALOG"); const value=rows[0]?.[0]; return value==null ? null : JSON.parse(value) as T; }
  async exact(scope:string,family:CatalogFamily,id:string,version:string):Promise<CatalogRecord|null> {
    return this.value(`SELECT record::text FROM ${TABLE}_records WHERE scope=${lit(scope)} AND family=${lit(family)} AND artifact=${lit(id)} AND version=${lit(version)};`);
  }
  async head(scope:string,family:CatalogFamily,id:string):Promise<string|null> {
    const rows=await postgresQuery(this.connectionString,`SELECT revision FROM ${TABLE}_heads WHERE scope=${lit(scope)} AND family=${lit(family)} AND artifact=${lit(id)};`,"CATALOG");return rows[0]?.[0]??null;
  }
  async list(input:CatalogList):Promise<CatalogPage> {
    const key="jsonb_build_array(artifact,version)::text";
    const cursor=input.after===null?"":` AND (${key}) COLLATE "C" > ${lit(input.after)} COLLATE "C"`;
    const rows=await postgresQuery(this.connectionString,`SELECT record::text,${key} FROM ${TABLE}_records WHERE scope=${lit(input.scopeRef)} AND family=${lit(input.family)}${cursor} ORDER BY (${key}) COLLATE "C" LIMIT ${input.limit+1};`,"CATALOG");
    const all=rows.map(r=>JSON.parse(r[0]!) as CatalogRecord),records=all.slice(0,input.limit);
    return {records,next:all.length>input.limit?rows[input.limit-1]![1]!:null};
  }
  async result(scope:string,actor:string,command:string):Promise<CatalogReceipt|null> {
    return this.value(`SELECT receipt::text FROM ${TABLE}_commands WHERE scope=${lit(scope)} AND actor=${lit(actor)} AND command=${lit(command)};`);
  }
}
