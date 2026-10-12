import { resolve } from "node:path";
import { DesignCandidateService } from "@system-builder/design";
import { PostgresDesignCandidateRepository } from "../../packages/design/postgres.js";
import { LocalDesignAuthorization, type LocalDesignPrincipal } from "../../packages/design/local-authorization.js";
import { startLocalDesignHttp } from "./http.js";
import type { DesignGatewayBinding } from "./design-owner.js";
export async function openConfiguredLocalDesignServer(env: Readonly<Record<string,string|undefined>> = process.env) {
  const required=(key:string)=>{const value=env[key];if(!value)throw new Error("DESIGN_LOCAL_CONFIG_MISSING:"+key);return value;};
  if(required("SYSTEM_BUILDER_DESIGN_PROFILE")!=="local-single-operator")throw new Error("DESIGN_LOCAL_PROFILE_REQUIRED");
  const principal:LocalDesignPrincipal={token:required("SYSTEM_BUILDER_DESIGN_TOKEN"),actorRef:required("SYSTEM_BUILDER_DESIGN_ACTOR"),actorRevisionRef:required("SYSTEM_BUILDER_DESIGN_ACTOR_REVISION"),scopeRef:required("SYSTEM_BUILDER_DESIGN_WORKSPACE"),expiresAt:required("SYSTEM_BUILDER_DESIGN_EXPIRES_AT"),revoked:env.SYSTEM_BUILDER_DESIGN_REVOKED==="true"};
  const coreRef=required("SYSTEM_BUILDER_DESIGN_CORE"),stationRef=required("SYSTEM_BUILDER_DESIGN_STATION");
  const binding:DesignGatewayBinding={coreRef,session:{coreRef,stationRef,sessionRef:required("SYSTEM_BUILDER_DESIGN_SESSION")},context:{coreRef,workspaceRef:principal.scopeRef}};
  const authorization=new LocalDesignAuthorization(principal);
  const repository=await PostgresDesignCandidateRepository.open(required("SYSTEM_BUILDER_DESIGN_POSTGRES_URL"));
  const owner=new DesignCandidateService(repository,authorization);
  const port=Number(env.SYSTEM_BUILDER_DESIGN_PORT??"0");
  if(!Number.isInteger(port)||port<0||port>65535)throw new Error("DESIGN_PORT_INVALID");
  const trustedBrowserOrigin=env.SYSTEM_BUILDER_DESIGN_BROWSER_ORIGIN;
  return startLocalDesignHttp({owner,authorization,binding,port,...(trustedBrowserOrigin===undefined?{}:{trustedBrowserOrigin})});
}

if (process.argv[1] && resolve(process.argv[1])===__filename) {
  openConfiguredLocalDesignServer().then(instance=>{
    console.log("Design local Gateway: "+instance.url);
    const stop=()=>{void instance.close().then(()=>process.exit(0));};
    process.once("SIGTERM",stop);process.once("SIGINT",stop);
  }).catch(()=>{console.error("DESIGN_LOCAL_START_FAILED: check explicit local profile/configuration");process.exitCode=1;});
}
