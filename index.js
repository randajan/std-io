import slib, { argv } from "@randajan/simple-lib";

const { isBuild} = argv;

slib(isBuild, {
    mode: "node",
    lib:{
        minify:false,
        entries:["index.js"]
    },
    demo:{
        external:["chalk"],
        entries:["index.js", "client.js"]
    },
})