// @filename: ExpressRouter.test.ts

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