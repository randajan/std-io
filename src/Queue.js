


export class Queue extends Map {
    constructor(timeout = 3000) {
        super();
        this.lastId = 1;
        this.timeout = timeout || 3000;
    }

    reg(res, rej) {
        const id = this.lastId++;
        this.set(id, {res, rej});
        return id;
    }

    start(id) {
        if (!(this.timeout > 0)) { return false; }
        const q = this.get(id);
        if (!q) { return false; }
        q.tid = setTimeout(_=>this.end(id, false, new Error("Timeout")), this.timeout);
    }

    end(id, isOk, data) {
        const q = this.get(id);
        if (!q) { return false; }
        this.delete(id);
        const { tid, res, rej } = q;
        if (tid) { clearTimeout(tid); }
        if (isOk) { res(data); } else { rej(data); }
        return true;
    }

}