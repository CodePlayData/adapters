import { readFileSync } from "node:fs";

type WasmModule = {
    [key: string]: Function
}

interface WasmModuleSource {
    load: (path: string, imports: {[key: string]: any}) => WasmModule
}

class WasmModuleSource {
    constructor(readonly buffer: Buffer) {
    }

    static async load(path: string, imports?: {[key: string]: any}) {
        const buffer = readFileSync(path);
        const wasmModule = (await WebAssembly.instantiate(buffer, imports)).instance.exports;
        console.log('The imported functions are:')
        Object.keys(wasmModule).splice(1).map((i) => {
            console.log(`${i}`)
        })
        console.log('\n\n')
        return Object.fromEntries(Object.entries(wasmModule).splice(1)) as WasmModule
    }
}

export {
    WasmModuleSource
}