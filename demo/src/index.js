import path from "path";
import { StdIO } from "../../dist/esm/index.mjs";

import { spawn } from "child_process";


const client = spawn("node", [path.join("demo/dist/client.js")], { stdio: ["pipe", "pipe", "inherit"] });

const stdio = new StdIO({process:client});

(async () => {
    const response = await stdio.tx("ping", "Hello Server!");
    console.log("Odpověď na ping:", response);
})();

stdio.rx("ping", (data) => {
    return "srv pong";
});

stdio.rx("error", msg=>{ { console.log("remoteError:", msg); } });
stdio.rx("log", msg=>{ console.log("remoteLog:", msg); });


// Ukončení po 5s
setTimeout(() => {
    console.log("Test dokončen, ukončuji server.");
    stdio.tx("stop");
    process.exit(0);
}, 3000);