// @filename: ExpressRouter.test.ts
import test from "node:test";
import assert from "node:assert";
import { ExpressRouter } from "./ExpressRouter.js";

test('Unit Test - Testing if the router indeed resgister routes in the ExpressApp', async (context) => {
    const router = new ExpressRouter();
    
    assert.deepEqual(router.routes, []);
    
    await context.test('Behavioural Test - Testing if the method register works in the ExpressApp class.', async () => {
        const route = { method: 'get', endpoint: '/data' };
    
        await router.register(route.method, route.endpoint, async function() {
            return;
        })
    
        assert.strictEqual(router.routes[0].path, route.endpoint);
        assert.strictEqual(router.routes[0].methods[route.method], true);
    })
});