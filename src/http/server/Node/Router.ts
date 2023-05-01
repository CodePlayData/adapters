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

import { Route } from "../Route.js";
import { Router } from "../Router.js";
import { createServer } from "node:http";


class NodeRouter implements Router {
    routes: Route[] = [];

    add(route: Route): void {
        this.routes.push(route);
    }

    handler() {
        return async (req: any, res: any) => {
            this.routes.map((route: Route) => {
                if(req.method === route.method && req.url === route.endpoint) {
                    route.callback(req, res);
                }
            });
        }
    }
}

export {
    NodeRouter
}