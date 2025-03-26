import { StdIO } from "../../dist/esm/index.mjs";
import process from "process";

const stdio = new StdIO({process});

(async () => {
    const response = await stdio.tx("ping", "Hello Server!");
    console.log("Odpověď na ping:", response);
})();

stdio.rx("ping", (data) => {
    return "cli pong";
});

stdio.rx("stop", _=>{
    process.exit(0);
});

// stdio.rx("echo", (data, reply) => {
//     console.log("[SERVER] Přijal:", data);
//     reply(`ECHO: ${data}`);
// });

// // Zachytávání chyb
// stdio.rx("error", (err) => {
//     console.error("[SERVER] Chyba:", err);
// });

// console.log("[SERVER] Server běží...");

// Udržení procesu aktivního
//setInterval(() => {}, 1000);