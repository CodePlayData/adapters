// @filename: ExpressApp.test.ts
import test from "node:test";
import assert from "node:assert";
import { ExpressApp } from "./ExpressApp.js";
import { ExpressRouter } from "./ExpressRouter.js";

test('Testando se a aplicacao _express_ registra o roteador como um modulo.', async () => {
    const router = new ExpressRouter();

    await router.register('get', '/data', async function() {
        return;
    })

    const api = new ExpressApp([{ path: '/teste', router: router.router }]);
    const object = Object.entries(api.router.stack[2])[5][1] as Object;
    assert.strictEqual(object.toString(), '/^\\/teste\\/?(?=\\/|$)/i');
})
