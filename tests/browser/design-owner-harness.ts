import { execFile, spawn, type ChildProcess } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
const repositoryRoot=resolve(__dirname,"../..");
import { postgresQuery } from "../../packages/postgres/index.js";
const execute=promisify(execFile);
export interface DesignOwnerHarness {
  readonly url:string;readonly token:string;readonly fields:Readonly<{coreRef:string;stationRef:string;sessionRef:string;scopeRef:string;actorRef:string;actorRevisionRef:string}>;
  restart():Promise<void>; stopOwner():Promise<void>; stop():Promise<void>;
}
export async function startDesignOwnerHarness(origin:string):Promise<DesignOwnerHarness>{
  const token=randomUUID()+randomUUID(),fields={coreRef:"core:browser",stationRef:"station:browser",sessionRef:"session:"+randomUUID(),scopeRef:"workspace:"+randomUUID(),actorRef:"actor:browser",actorRevisionRef:"identity:browser:1"};
  let connectionString=process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL,container:string|undefined,child:ChildProcess|undefined,url="";
  const docker=async(args:string[])=>{try{return(await execute("docker",args,{timeout:60000,maxBuffer:1048576})).stdout.trim();}catch{throw new Error("WP16_ISOLATED_POSTGRES_FIXTURE_FAILED");}};
  const stopOwner=async()=>{const worker=child;child=undefined;if(!worker||worker.exitCode!==null||worker.signalCode!==null)return;await new Promise<void>(resolve=>{const timer=setTimeout(()=>worker.kill("SIGKILL"),5000);worker.once("exit",()=>{clearTimeout(timer);resolve();});worker.kill("SIGTERM");});};
  const stop=async()=>{await stopOwner();if(container){const name=container;container=undefined;await docker(["rm","-f",name]);}};
  try{
    if(!connectionString){
      container="wp16-browser-"+randomUUID();
      const password=randomUUID()+randomUUID();
      await docker(["run","--rm","-d","--name",container,"-e","POSTGRES_PASSWORD="+password,"-p","127.0.0.1::5432","postgres:17.6-alpine"]);
      const port=await docker(["inspect","--format",'{{(index (index .NetworkSettings.Ports "5432/tcp") 0).HostPort}}',container]);
      if(!/^[0-9]+$/.test(port))throw new Error("WP16_POSTGRES_PORT_INVALID");
      connectionString="postgres://postgres:"+password+"@127.0.0.1:"+port+"/postgres?sslmode=disable";
    }
    let ready=false;for(let attempt=0;attempt<30;attempt++){try{await postgresQuery(connectionString,"SELECT 1;","WP16_BROWSER");ready=true;break;}catch{await new Promise(resolve=>setTimeout(resolve,200));}}
    if(!ready)throw new Error("WP16_POSTGRES_NOT_READY");
    const start=async()=>{
      const worker=spawn(process.execPath,["--import","tsx","tests/product/fixtures/design-owner-server.ts"],{cwd:repositoryRoot,env:{...process.env,SYSTEM_BUILDER_DESIGN_PROFILE:"local-single-operator",SYSTEM_BUILDER_DESIGN_POSTGRES_URL:connectionString,SYSTEM_BUILDER_DESIGN_TOKEN:token,SYSTEM_BUILDER_DESIGN_ACTOR:fields.actorRef,SYSTEM_BUILDER_DESIGN_ACTOR_REVISION:fields.actorRevisionRef,SYSTEM_BUILDER_DESIGN_WORKSPACE:fields.scopeRef,SYSTEM_BUILDER_DESIGN_EXPIRES_AT:new Date(Date.now()+3600000).toISOString(),SYSTEM_BUILDER_DESIGN_CORE:fields.coreRef,SYSTEM_BUILDER_DESIGN_STATION:fields.stationRef,SYSTEM_BUILDER_DESIGN_SESSION:fields.sessionRef,SYSTEM_BUILDER_DESIGN_PORT:url?new URL(url).port:"0",SYSTEM_BUILDER_DESIGN_BROWSER_ORIGIN:origin},stdio:["ignore","pipe","pipe"]});child=worker;
      url=await new Promise<string>((resolve,reject)=>{let output="";const timer=setTimeout(()=>{worker.kill();reject(new Error("WP16_OWNER_START_TIMEOUT"));},15000);worker.once("exit",()=>{clearTimeout(timer);reject(new Error("WP16_OWNER_EXIT"));});worker.stdout!.on("data",(bytes:Buffer)=>{output+=bytes.toString();if(output.includes("\n")){clearTimeout(timer);try{resolve((JSON.parse(output.split("\n")[0]!) as {url:string}).url);}catch{reject(new Error("WP16_OWNER_MESSAGE_INVALID"));}}});});
    };
    await start();
    return{get url(){return url;},token,fields,stopOwner,stop,restart:async()=>{await stopOwner();await start();}};
  }catch(error){await stop();throw error;}
}
