// @filename: WasmModuleSource.test.ts
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
