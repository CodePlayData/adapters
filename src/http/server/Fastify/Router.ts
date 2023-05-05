// @filename: Router.ts

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
import { Router } from "../Router.js";
import Fastify from "fastify";
import { FastifyRoute } from "./Route.js";
const fastify = Fastify({ logger: true });

class FastifyRouter implements Router {
    routes: any[] = [];

    constructor(routes?: FastifyRoute[], readonly routerPath: string = '/') {
        routes?.map((route: FastifyRoute) => {
            this.add(route);
        });
    }

    add(route: FastifyRoute): void {
        
        let fastifyRoute = fastify.route({
            method: route.method,
            url: route.endpoint,
            schema: route.schema,
            handler: route.callback
        })

        this.routes.push(fastifyRoute);
    }
}

export {
    FastifyRouter
}