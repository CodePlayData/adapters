// @filename: Server.test.ts

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
import { deepEqual, strictEqual } from "node:assert";
import { IncomingMessage, ServerResponse } from "node:http";
import { FastifyRoute } from "./Route.js";
import { FastifyRouter } from "./Router.js";
import { FastifyServer } from "./Server.js";
import { RequestBuilder } from "../../RequestBuilder.js";

describe('Teste do NodeApp com...', () => {
    const callback1 = (req: any, rpl: any) => {
        rpl.send('hello world');
    }
    const dataRoute = new FastifyRoute('GET', '/data', callback1, {});

    const callback2 = (req: any, rpl: any) => {
        rpl.send(req.body)
    }
    const loginRoute = new FastifyRoute(
        'POST', 
        '/login', 
        callback2,
        {
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string' }
                }
            }
        });

    const router = new FastifyRouter();
    router.add(dataRoute);
    router.add(loginRoute);
    let server = new FastifyServer(router);
    
    before(async () => {
        await server.app.listen(3000);
    });

    it('a rota helloWold na /data.', async () => {
        const response = await fetch('http://127.0.0.1:3000/data');
        strictEqual(await response.text(), "hello world");
    });

    it('a rota POST no /login.', async () => {
        const request = new RequestBuilder('http://127.0.0.1:3000/login')
                             .header('Content-Type', 'application/json')
                             .post({ email: 'test@gmail.com' })
                             .build()

        const response = await fetch(request);
        deepEqual(await response.json(), { email: 'test@gmail.com'});
    })

    after(() => {
        server.app.close();
    });
});
