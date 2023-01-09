// @filename: ExpressApp.test.ts
import test from "node:test";
import assert from "node:assert";
import { ExpressApp } from "./ExpressApp.js";
import { ExpressRouter } from "./ExpressRouter.js";

test('Testando se a aplicação _express_ registra o roteador como um módulo.', async () => {
    const router = new ExpressRouter();
    const testRoute = { method: 'get', endpoint: '/data' };

    await router.register(testRoute.method, testRoute.endpoint, async function() {
        return;
    })

    const api = new ExpressApp([{ path: '/teste', router: router.router }]);
    const object = Object.entries(api.router.stack[2])[5][1] as Object;
    assert.strictEqual(object.toString(), '/^\\/teste\\/?(?=\\/|$)/i');
})
