// @filename: WasmModuleSource.ts

/* Copyright 2023 Pedro Paulo Teixeira dos Santos

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

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