


export const createReader = (cb, enc = "utf8")=>{
    let buffer = "";
    return (input)=>{
        buffer += input.toString(enc);
        const parts = buffer.split("\n");
        buffer = parts.pop();
    
        for (let part of parts) {
            part = part.trim();
            if (part) { cb(part); }
        }
    }
}

export const tryJson = s=>{ try { return JSON.parse(s); } catch{} }


export const write = (stream, key, body, enc)=>{
    if (stream?.writable) { stream.write(key+JSON.stringify(body)+"\n", enc); }
}

export const sleep = async (ms)=>new Promise(res=>setTimeout(res, ms));