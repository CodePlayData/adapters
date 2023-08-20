// @filename: Server.ts

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

import { HttpServer } from "../HttpServer.js";
import { FastifyRouter } from "./Router.js";
import Fastify from "fastify";

class FastifyServer implements HttpServer {
    readonly app;

    constructor(readonly routers?: FastifyRouter | FastifyRouter[]) {
        this.app = Fastify({ logger: true });

        if(routers instanceof Array<FastifyRouter>) {
            routers.map((i) => {
                i.routes.map((o) => {
                    o.url = `${i.routerPath}/${o.url}`;
                    this.app.route(o);
                });
            });
        } else {
            routers!.routes.map((i) => {
                this.app.route(i);
            });
        }
    }

    async listen(port: number) {
        try {
            await this.app.listen({ port });
        } catch (err) {
            this.app.log.error(err)
            process.exit(1)
        }
    }

    use(router: FastifyRouter): void {
        router?.routes.map((i) => {
            this.app.route(i);
        });
    }    
}

export { 
    FastifyServer
}

