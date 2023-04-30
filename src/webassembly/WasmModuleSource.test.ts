// @filename: WasmModuleSource.test.ts

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

import { describe, it, before } from "node:test";
import { strictEqual, ok } from "node:assert";
import { WasmModuleSource } from "./WasmModuleSource.js";

describe('Testando o WasmModuleSource com...', async () => {
    let wasmModule: any;

    before(async () => {
        wasmModule = await WasmModuleSource.load('./assets/program.wasm');
    })
    
    it('o módulo carregado.', () => {
        ok(wasmModule);
    });

    it('com a função main funcionando.', () => {
        const f1 = wasmModule['main'];
        strictEqual(f1(), 42);
    });

    it('com a função main2 funcionando.', () => {
        const f2 = wasmModule['main2'];
        strictEqual(f2(), 44);
    });
});
