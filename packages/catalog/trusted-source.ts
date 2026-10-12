import {readFile,stat} from "node:fs/promises";
import {isAbsolute} from "node:path";
import {createHash} from "node:crypto";
import {assertCatalogJson,catalogCanonicalText,catalogRef} from "@system-builder/contracts/catalog-owner";
import {admitCatalogProcessRevision,projectCatalogProcessRevisionLineage,type CatalogProcessRevisionAdmissionInput} from "./index.js";
import type {CatalogTrustedSourcePort} from "./owner-service.js";
interface SourceSnapshot {readonly contractVersion:"1.0.0";readonly scopeRef:string;readonly sourceAuthorityRef:string;readonly revisions:readonly Readonly<{sourceRef:string;input:CatalogProcessRevisionAdmissionInput}>[]}
function decode(text:string):SourceSnapshot {
 const v:unknown=JSON.parse(text);assertCatalogJson(v);
 if(!v||typeof v!=="object"||Array.isArray(v))throw Error("CATALOG_SOURCE_INVALID");
 const s=v as SourceSnapshot;
 if(Object.keys(s).sort().join(",")!=="contractVersion,revisions,scopeRef,sourceAuthorityRef"||s.contractVersion!=="1.0.0"||!catalogRef(s.scopeRef)||!catalogRef(s.sourceAuthorityRef)||!Array.isArray(s.revisions)||s.revisions.length>128)throw Error("CATALOG_SOURCE_INVALID");
 const seen=new Set<string>(),groups=new Map<string,CatalogProcessRevisionAdmissionInput[]>();
 for(const row of s.revisions){if(!row||Object.keys(row).sort().join(",")!=="input,sourceRef"||!catalogRef(row.sourceRef)||seen.has(row.sourceRef))throw Error("CATALOG_SOURCE_INVALID");seen.add(row.sourceRef);const admission=admitCatalogProcessRevision(row.input);const group=groups.get(admission.artifactRef)??[];group.push(row.input);groups.set(admission.artifactRef,group);}
 for(const group of groups.values())projectCatalogProcessRevisionLineage(group);
 return s;
}
/** Explicit operator-attested pre-existing publication metadata. Never a publisher or client-proof importer. */
export class LocalCatalogTrustedSource implements CatalogTrustedSourcePort {
 private constructor(private readonly path:string,readonly scopeRef:string,readonly sourceAuthorityRef:string,private readonly digest:string){}
 static async open(path:string,scopeRef:string):Promise<LocalCatalogTrustedSource>{
  if(!isAbsolute(path))throw Error("CATALOG_SOURCE_ABSOLUTE_PATH_REQUIRED");
  const meta=await stat(path);if(!meta.isFile()||meta.size>1048576)throw Error("CATALOG_SOURCE_LIMIT");
  const text=await readFile(path,"utf8");if(Buffer.byteLength(text)>1048576)throw Error("CATALOG_SOURCE_LIMIT");
  const s=decode(text);if(s.scopeRef!==scopeRef)throw Error("CATALOG_SOURCE_SCOPE_DENIED");
  return new LocalCatalogTrustedSource(path,scopeRef,s.sourceAuthorityRef,createHash("sha256").update(catalogCanonicalText(s)).digest("hex"));
 }
 async resolve(scopeRef:string,sourceRef:string):Promise<CatalogProcessRevisionAdmissionInput|null>{
  if(scopeRef!==this.scopeRef)return null;
  const meta=await stat(this.path);if(!meta.isFile()||meta.size>1048576)return null;
  const text=await readFile(this.path,"utf8");if(Buffer.byteLength(text)>1048576)return null;
  const s=decode(text),hash=createHash("sha256").update(catalogCanonicalText(s)).digest("hex");
  if(s.scopeRef!==scopeRef||s.sourceAuthorityRef!==this.sourceAuthorityRef||hash!==this.digest)return null;
  return s.revisions.find(r=>r.sourceRef===sourceRef)?.input??null;
 }
}
