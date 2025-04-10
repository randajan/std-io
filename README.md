# @randajan/std-io

[![NPM](https://img.shields.io/npm/v/@randajan/std-io.svg)](https://www.npmjs.com/package/@randajan/std-io) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A simple and efficient wrapper for **stdin/stdout communication** with **async message routing**.  
Supports **inter-process messaging**, **timeouts**, and **automatic JSON serialization**.

---

## **Installation**
```
npm install @randajan/std-io
```

---

## **Usage**
### **Basic Example**
#### **ESM**
```
import { StdIO } from "@randajan/std-io";

const stdio = new StdIO({ process });

stdio.rx("ping", (data, reply) => reply("pong"));

const response = await stdio.tx("ping", "Hello!");
console.log("Received:", response); // "pong"
```

#### **CommonJS**
```
const { StdIO } = require("@randajan/std-io");

const stdio = new StdIO({ process });
```

---

## **API Reference**
### **Create an Instance**
```
const stdio = new StdIO(config);
```
**Configuration options:**
- `process` (object) - A Node.js process to attach (`child_process` or `process`).
- `key` (string) - Prefix for JSON messages (default: `"$JSON:"`).
- `streamTx` / `streamRx` / `streamErr` - Custom input/output/error streams.  
  - **You can pass only selected streams, the rest will be inferred from `process` if available.**
- `encRx` / `encTx` (string) - Encoding (default: `"utf8"`).
- `timeout` (number) - Response timeout in milliseconds.

---

### **Send Messages**
```
const response = await stdio.tx("route_name", { foo: "bar" });
```
- **Sends a message** to a given route.
- **Waits for a response** asynchronously.
- Throws an error if **no response is received within the timeout**.

---

### **Listen for Messages**
```
stdio.rx("route_name", (data, reply) => {
    console.log("Received:", data);
    reply({ success: true });
});
```
- Registers a **callback function** that handles incoming messages.
- **`data`** contains the message body.
- **`reply(response)`** sends a response.

---

## **Inter-Process Communication Example**
You can use `std-io` to **communicate between Node.js processes**.

### **Parent Process (Client)**
```
import { spawn } from "child_process";
import { StdIO } from "@randajan/std-io";

const child = spawn("node", ["child.js"], { stdio: ["pipe", "pipe", "inherit"] });
const stdio = new StdIO({ process: child });

const response = await stdio.tx("greet", "Hello from parent!");
console.log("Child replied:", response);
```

### **Child Process (Server)**
```
import { StdIO } from "@randajan/std-io";

const stdio = new StdIO({ process });

stdio.rx("greet", (data, reply) => {
    console.log("Parent said:", data);
    reply("Hello from child!");
});
```

---

## **What to Expect**
✅ **Full-duplex stdin/stdout communication**  
✅ **Automatic JSON serialization & deserialization**  
✅ **Async request-response model**  
✅ **Timeout handling** for missing responses**  
✅ **Works in both ESM & CommonJS**  
✅ **Supports inter-process communication**  
✅ **Supports partial stream configuration (not all streams required)**  

---

## **Support**
If you have any questions or suggestions for improvements, feel free to open an issue in the repository.

---

## **License**
MIT © [randajan](https://github.com/randajan)
