



export class Router extends Map {
    constructor() {
        super();
    }

    set(name, cb) {
        if (typeof name === "function") { cb = name; name = "";  }
        else if (typeof name !== "string") { throw new Error("Route name must be a string") }
        else if (typeof cb !== "function") { throw new Error("Route cb must be a function"); }

        if (this.has(name)) { throw new Error(`Route was already defined`); }
        super.set(name == null ? "" : name, cb);

        return ()=>{ this.delete(name); }
    }

    async run(name, body) {
        const route = this.get(name);
        if (!route) { return; }
        return route(body);
    }
}