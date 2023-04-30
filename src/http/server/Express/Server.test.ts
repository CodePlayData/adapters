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

import { after, before, describe, it } from "node:test";
import { strictEqual } from "node:assert";
import { ExpressRouter } from "./Router.js";
import { ExpressApp } from "./Server.js";
import { Route } from "../Route.js";
import { Express } from "express";

describe('Teste do ExpressApp com...', () => {
    const route = new Route('get', '/data', async () => 'hello world' );
    const router = new ExpressRouter();
    router.add(route);

    let server: Express = new ExpressApp(router).app;
    let serverApp = server.listen(3000);

    before(async () => {
        await new Promise(resolve => {
            serverApp.once('listening', resolve);
        });
    });

    it('a rota helloWold na /data.', async () => {
        const response = await fetch('http://127.0.0.1:3000/data')
        strictEqual(await response.json(), "hello world");
    });

    after(() => {
        serverApp.close();
    });
});

