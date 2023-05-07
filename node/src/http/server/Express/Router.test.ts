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

import { describe, it } from "node:test";
import { strictEqual, deepEqual } from "node:assert";
import { ExpressRouter } from "./Router.js";
import { ExpressRoute } from "./Route.js";

describe('Testando a classe ExpressRouter com...', () => {
    const router = new ExpressRouter();

    it('nenhuma rota.', () => {
        deepEqual(router.routes, []);
    });

    it('uma rota GET no /data', async () => {
        const route = new ExpressRoute('get', '/data', async () => { return });
        router.add(route);
        strictEqual(router.routes[0].path, '/data');
        strictEqual(router.routes[0].methods['get'], true);
    });
});
