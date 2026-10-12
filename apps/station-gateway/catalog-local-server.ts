import { LocalCatalogTrustedSource } from "../../packages/catalog/trusted-source.js";
import { resolve } from "node:path";
import { CatalogOwnerService } from "@system-builder/catalog/owner";
import { PostgresCatalogOwnerRepository } from "@system-builder/catalog/owner-postgres";
import { LocalCatalogAuthorization, type LocalCatalogPrincipal } from "../../packages/catalog/local-authorization.js";
import { startLocalCatalogHttp } from "./catalog-http.js";
import type { CatalogGatewayBinding } from "./catalog-owner.js";
export async function openConfiguredLocalCatalogServer(env: Readonly<Record<string,string|undefined>> = process.env) {
  const required=(key:string)=>{const value=env[key];if(!value)throw new Error("CATALOG_LOCAL_CONFIG_MISSING:"+key);return value;};
  if(required("SYSTEM_BUILDER_CATALOG_PROFILE")!=="local-single-operator")throw new Error("CATALOG_LOCAL_PROFILE_REQUIRED");
  const principal:LocalCatalogPrincipal={token:required("SYSTEM_BUILDER_CATALOG_TOKEN"),actorRef:required("SYSTEM_BUILDER_CATALOG_ACTOR"),actorRevisionRef:required("SYSTEM_BUILDER_CATALOG_ACTOR_REVISION"),scopeRef:required("SYSTEM_BUILDER_CATALOG_WORKSPACE"),expiresAt:required("SYSTEM_BUILDER_CATALOG_EXPIRES_AT"),revoked:env.SYSTEM_BUILDER_CATALOG_REVOKED==="true",grants:JSON.parse(required("SYSTEM_BUILDER_CATALOG_GRANTS")) as LocalCatalogPrincipal["grants"]};
  const coreRef=required("SYSTEM_BUILDER_CATALOG_CORE"),stationRef=required("SYSTEM_BUILDER_CATALOG_STATION");
  const binding:CatalogGatewayBinding={coreRef,session:{coreRef,stationRef,sessionRef:required("SYSTEM_BUILDER_CATALOG_SESSION")},context:{coreRef,workspaceRef:principal.scopeRef}};
  const authorization=new LocalCatalogAuthorization(principal);
  const source=await LocalCatalogTrustedSource.open(required("SYSTEM_BUILDER_CATALOG_SOURCE_FILE"),principal.scopeRef);
  const repository=await PostgresCatalogOwnerRepository.open(required("SYSTEM_BUILDER_CATALOG_POSTGRES_URL"));
  const owner=new CatalogOwnerService(repository,authorization,source);
  const port=Number(env.SYSTEM_BUILDER_CATALOG_PORT??"0");
  if(!Number.isInteger(port)||port<0||port>65535)throw new Error("CATALOG_PORT_INVALID");
  const trustedBrowserOrigin=env.SYSTEM_BUILDER_CATALOG_BROWSER_ORIGIN;
  return startLocalCatalogHttp({owner,authorization,binding,port,...(trustedBrowserOrigin===undefined?{}:{trustedBrowserOrigin})});
}

if (process.argv[1] && resolve(process.argv[1])===__filename) {
  openConfiguredLocalCatalogServer().then(instance=>{
    console.log("Catalog local Gateway: "+instance.url);
    const stop=()=>{void instance.close().then(()=>process.exit(0));};
    process.once("SIGTERM",stop);process.once("SIGINT",stop);
  }).catch(()=>{console.error("CATALOG_LOCAL_START_FAILED: check explicit local profile/configuration");process.exitCode=1;});
}
