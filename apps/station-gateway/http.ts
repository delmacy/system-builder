import { createServer, type Server } from "node:http";
import { LocalDesignAuthorization } from "../../packages/design/local-authorization.js";
import { DesignCandidateService } from "@system-builder/design";
import { DesignOwnerCorePort, type DesignGatewayBinding } from "./design-owner.js";
import { StationGateway } from "./index.js";
export interface LocalDesignHttpOptions {
  readonly owner: DesignCandidateService; readonly authorization: LocalDesignAuthorization; readonly binding: DesignGatewayBinding;
  readonly trustedBrowserOrigin?: string; readonly port?: number;
}
export interface LocalDesignHttpServer { readonly server: Server; readonly url: string; close(): Promise<void> }
const MAX_BODY=1_048_576+16_384;
export async function startLocalDesignHttp(options: LocalDesignHttpOptions): Promise<LocalDesignHttpServer> {
  if (options.trustedBrowserOrigin!==undefined) {
    const origin=new URL(options.trustedBrowserOrigin);
    if (!["localhost","127.0.0.1","[::1]"].includes(origin.hostname) || origin.origin!==options.trustedBrowserOrigin || !["http:","https:"].includes(origin.protocol)) throw new Error("DESIGN_LOCAL_ORIGIN_INVALID");
  }
  const server=createServer(async(req,res)=>{
    const send=(status:number,value:unknown)=>{if(!res.writableEnded){res.writeHead(status,{"content-type":"application/json","cache-control":"no-store","x-content-type-options":"nosniff"});res.end(JSON.stringify(value));}};
    const origin=req.headers.origin;
    if (origin!==undefined && origin!==options.trustedBrowserOrigin) {send(403,{error:"DESIGN_ORIGIN_DENIED"});return;}
    if(origin!==undefined){res.setHeader("access-control-allow-origin",origin);res.setHeader("vary","Origin");}
    if(req.method==="OPTIONS" && origin!==undefined){res.setHeader("access-control-allow-methods","POST");res.setHeader("access-control-allow-headers","authorization,content-type");res.writeHead(204);res.end();return;}
    if(req.method!=="POST" || !["/station/handshake","/station/command","/station/query"].includes(req.url??"")) {send(404,{error:"DESIGN_ROUTE_UNKNOWN"});return;}
    const header=req.headers.authorization, credential=header?.startsWith("Bearer ")?header.slice(7):undefined;
    const principal=options.authorization.authenticate(credential);
    if(!principal){send(401,{error:"DESIGN_AUTHENTICATION_REQUIRED"});return;}
    if(!req.headers["content-type"]?.startsWith("application/json")){send(415,{error:"DESIGN_JSON_REQUIRED"});return;}
    let bytes=0, oversized=false; const chunks:Buffer[]=[];
    try {
      for await(const chunk of req){const b=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);bytes+=b.length;if(bytes>MAX_BODY){oversized=true;chunks.length=0;}else if(!oversized)chunks.push(b);}
      if(oversized){send(413,{error:"DESIGN_BODY_LIMIT"});return;}
      const input=JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
      const gateway=new StationGateway({coreRef:options.binding.coreRef,coreVersion:"1.0.0",capabilityRefs:["design.candidate.submit","design.candidate.exact","design.candidate.head","design.candidate.result"]},new DesignOwnerCorePort(options.owner,credential,principal,options.binding));
      const result=req.url==="/station/handshake"?gateway.handshake(input):req.url==="/station/command"?await gateway.command(input):await gateway.query(input);
      send(200,result);
    } catch {send(400,{error:"DESIGN_REQUEST_INVALID"});}
  });
  server.requestTimeout=10_000; server.headersTimeout=10_000; server.timeout=15_000; server.maxHeadersCount=32;
  await new Promise<void>((resolve,reject)=>{server.once("error",reject);server.listen(options.port??0,"127.0.0.1",()=>{server.off("error",reject);resolve();});});
  const address=server.address();if(address===null||typeof address==="string")throw new Error("DESIGN_ADDRESS_INVALID");
  return {server,url:"http://127.0.0.1:"+address.port,close:()=>new Promise<void>((resolve,reject)=>{server.close(error=>error?reject(error):resolve());server.closeIdleConnections();})};
}
