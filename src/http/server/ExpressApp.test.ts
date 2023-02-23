// @filename: ExpressApp.test.ts

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
