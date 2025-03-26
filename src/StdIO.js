import { Queue } from "./Queue";
import { bfrToStr, createReader, tryJson, write } from "./tool";
import { Router } from "./Router";

const _privs = new WeakMap();

export class StdIO extends Function {

    static create(config={}) { return new StdIO(config); }

    constructor(config={}) {
        super();

        const {
            key,
            streamTx,
            streamRx,
            streamErr,
            encRx,
            encTx,
            timeout
        } = config;

        const prc = config.process;
        const isSelf = prc === process;

        const _p = {
            state:true,
            prc,
            isSelf,
            key:key || "$JSON:",
            encRx:encRx || "utf8",
            encTx:encTx || "utf8",
            sTx: streamTx || (isSelf ? prc?.stdout : prc?.stdin),
            sRx: streamRx || (isSelf ? prc?.stdin : prc?.stdout),
            sErr: streamErr || (isSelf ? null : prc?.stderr),
            queue:new Queue(timeout),
            routes:new Router()
        };

        const parseRow = async (row)=>{
            const { sTx, key, routes, queue } = _p;
            if (!row.startsWith(key)) { return routes.run("log", row); }
            const json = tryJson(row.slice(key.length));
            if (!json) { return routes.run("error", new Error(`Invalid json: ${row}`), "rx", "warning"); }

            const { qid, isOk, reply, route, body } = json;

            if (reply) { return queue.end(qid, isOk, body); }

            try { write(sTx, key, {qid, isOk:true, reply:true, body:await routes.run(route, body)}); }
            catch(err) { write(sTx, key, {qid, isOk:false, reply:true, body:err}); }
        };

        _p.sRx?.on("data", createReader(parseRow, _p.encRx));
        _p.sErr?.on("data", err=>_p.routes.run("error", bfrToStr(err), "rx", "warning"));
        _p.sErr?.on("error", err=>_p.routes.run("error", bfrToStr(err), "rx", "warning"));
        _p.sRx?.on("error", err=>_p.routes.run("error", bfrToStr(err), "rx", "warning"));
        _p.sTx?.on("error", err=>_p.routes.run("error", bfrToStr(err), "tx", "warning"));

        _p.sTx.on("close", _=>{ delete _p.sTx; }); 
        if (!isSelf) { prc?.on("uncaughtException", err=>_p.routes.run("error", bfrToStr(err), "rx", "critical")); }

        const self = (route, body)=>this.tx(route, body);
        _privs.set(self, _p);

        return Object.setPrototypeOf(self, this);
    }

    async tx(route, body, timeout) {
        const _p = _privs.get(this);
        const { key, queue, sTx, encTx } = _p;

        if (!sTx?.writable) { throw new Error("Stream is not writable"); }

        return new Promise((res, rej) => {
            const qid = queue.reg(res, rej);
            write(sTx, key, {qid, route, body}, encTx);
            queue.start(qid, timeout);
        });
    }

    rx(route, cb) {
        return _privs.get(this).routes.set(route, cb);
    }


}

