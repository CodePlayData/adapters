// @filename: Router.test.ts

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
import { NodeRoute } from "./Route.js";
import { NodeRouter } from "./Router.js";

describe('Testando a classe NodeRouter com...', () => {
    const router = new NodeRouter();

    it('nenhuma rota.', () => {
        deepEqual(router.routes, []);
    });

    it('uma rota GET no /data', async () => {
        const route = new NodeRoute('GET', '/data', async () => { return });
        router.add(route);
        strictEqual(router.routes[0].endpoint, '/data');
    });
});
   