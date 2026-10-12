import { normalizeStationCommandReceipt, normalizeStationDiagnostic, normalizeStationProjection, assertMonotonicStationEvents, negotiateStationProtocol, type StationCommand, type StationDiagnostic, type StationHello, type StationQuery, type StationSubscription } from "@system-builder/contracts/station-core";
import type { StationTransport, StationTransportResult } from "./index.js";
export interface StationHttpOptions { readonly baseUrl: string; readonly token: string; readonly timeoutMs?: number; readonly fetch?: typeof fetch }
const MAX_RESPONSE=1_048_576+65_536;
const object=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const unavailable=():StationDiagnostic=>({code:"STATION_CORE_UNAVAILABLE",detail:"Owner connection unavailable or response invalid",retryable:true,reconcileRequired:true});
export class StationHttpTransport implements StationTransport {
  readonly #baseUrl:string; readonly #token:string; readonly #fetch:typeof fetch; readonly #timeout:number;
  readonly #active=new Set<AbortController>();
  constructor(options:StationHttpOptions){
    const url=new URL(options.baseUrl);
    if(url.username||url.password||url.search||url.hash||url.pathname!=="/"||!(url.protocol==="https:"||url.protocol==="http:"&&["127.0.0.1","localhost","[::1]"].includes(url.hostname)))throw new Error("STATION_TRUSTED_ENDPOINT_INVALID");
    if(!options.token || options.token.length>4096 || [...options.token].some(c=>c.charCodeAt(0)<32))throw new Error("STATION_CREDENTIAL_INVALID");
    this.#baseUrl=url.origin;this.#token=options.token;this.#fetch=options.fetch??fetch;this.#timeout=options.timeoutMs??10000;
    if(!Number.isInteger(this.#timeout)||this.#timeout<100||this.#timeout>30000)throw new Error("STATION_TIMEOUT_INVALID");
  }
  cancel():void{for(const controller of this.#active)controller.abort();this.#active.clear();}
  async #post(route:string,input:unknown):Promise<unknown>{
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),this.#timeout);this.#active.add(controller);
    try{
      const response=await this.#fetch(this.#baseUrl+"/station/"+route,{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+this.#token},body:JSON.stringify(input),signal:controller.signal,redirect:"error",cache:"no-store"});
      if(!response.ok||!response.headers.get("content-type")?.includes("application/json"))throw new Error("STATION_HTTP_REJECTED");
      const reader=response.body?.getReader();if(!reader)throw new Error("STATION_RESPONSE_MISSING");
      const parts:Uint8Array[]=[];let bytes=0;
      try{for(;;){const next=await reader.read();if(next.done)break;bytes+=next.value.byteLength;if(bytes>MAX_RESPONSE)throw new Error("STATION_RESPONSE_LIMIT");parts.push(next.value);}}finally{await reader.cancel();}
      const buffer=new Uint8Array(bytes);let offset=0;for(const part of parts){buffer.set(part,offset);offset+=part.length;}
      return JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(buffer)) as unknown;
    }finally{clearTimeout(timer);this.#active.delete(controller);}
  }
  async #result<T>(route:string,input:unknown,normalize:(v:unknown)=>T):Promise<StationTransportResult<T>>{
    try{const r=await this.#post(route,input);if(!object(r)||typeof r.ok!=="boolean")throw new Error("STATION_RESPONSE_INVALID");
      if(!r.ok){if(Object.keys(r).sort().join(",")!=="diagnostic,ok")throw new Error("STATION_RESPONSE_INVALID");return{ok:false,diagnostic:normalizeStationDiagnostic(r.diagnostic)};}
      if(Object.keys(r).sort().join(",")!=="ok,value")throw new Error("STATION_RESPONSE_INVALID");return{ok:true,value:normalize(r.value)};
    }catch{return{ok:false,diagnostic:unavailable()};}
  }
  async handshake(hello:StationHello){
    try{const r=await this.#post("handshake",hello);if(!object(r)||typeof r.ok!=="boolean")throw new Error("STATION_RESPONSE_INVALID");
      if(!r.ok){if(Object.keys(r).sort().join(",")!=="diagnostic,ok")throw new Error("STATION_RESPONSE_INVALID");return{ok:false as const,diagnostic:normalizeStationDiagnostic(r.diagnostic)};}
      if(Object.keys(r).sort().join(",")!=="hello,ok")throw new Error("STATION_RESPONSE_INVALID");
      const h=r.hello;if(!object(h)||Object.keys(h).sort().join(",")!=="capabilityRefs,coreRef,coreVersion,protocolVersion"||h.protocolVersion!=="1.0.0"||typeof h.coreRef!=="string"||typeof h.coreVersion!=="string"||!Array.isArray(h.capabilityRefs)||!h.capabilityRefs.every(x=>typeof x==="string"))throw new Error("STATION_HANDSHAKE_INVALID");
      return negotiateStationProtocol({hello,coreRef:h.coreRef,coreVersion:h.coreVersion,capabilityRefs:h.capabilityRefs as string[]});
    }catch{return{ok:false as const,diagnostic:unavailable()};}
  }
  query(input:StationQuery){return this.#result("query",input,value=>normalizeStationProjection(value,input));}
  command(input:StationCommand){return this.#result("command",input,value=>normalizeStationCommandReceipt(value,input.commandRef));}
  subscribe(input:StationSubscription){return this.#result("subscribe",input,value=>{if(!Array.isArray(value))throw new Error("STATION_EVENTS_INVALID");return assertMonotonicStationEvents(value,input.subscriptionRef,input.afterSequence);});}
}
