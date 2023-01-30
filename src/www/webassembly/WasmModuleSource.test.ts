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

import test from "node:test";
import assert from "node:assert";
import { WasmModuleSource } from "./WasmModuleSource.js";

test('Testando se a classe WasmModuleSource pode ser instanciada.', async(context) => {
    const wasmModule = await WasmModuleSource.load('./assets/program.wasm');
    assert.ok(wasmModule);

    await context.test('Testando se as funcoes importadadas de fato funcionam', () => {
        const f1 = wasmModule['main'];
        const f2 = wasmModule['main2'];
        assert.strictEqual(f1(), 42);
        assert.strictEqual(f2(), 44);
    })
})
