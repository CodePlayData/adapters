// @filename: ExpressRouter.test.ts
import test from "node:test";
import assert from "node:assert";
import { ExpressRouter } from "./ExpressRouter.js";

test('Testando se a classe ExpressRouter pode ser instanciada.', async (context) => {
    const router = new ExpressRouter();
    
    assert.deepEqual(router.routes, []);
    
    await context.test('Testando se o roteador pode de fato registrar rotas.', async () => {
        const route = { method: 'get', endpoint: '/data' };
    
        await router.register(route.method, route.endpoint, async function() {
            return;
        })
    
        assert.strictEqual(router.routes[0].path, route.endpoint);
        assert.strictEqual(router.routes[0].methods[route.method], true);
    })
});