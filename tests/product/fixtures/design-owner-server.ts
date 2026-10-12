import { openConfiguredLocalDesignServer } from "../../../apps/station-gateway/local-server.js";
openConfiguredLocalDesignServer().then(instance=>{
  process.stdout.write(JSON.stringify({url:instance.url})+"\n");
  process.once("SIGTERM",()=>{void instance.close().then(()=>process.exit(0));});
}).catch(()=>{process.stderr.write("DESIGN_TEST_SERVER_START_FAILED\n");process.exitCode=1;});
