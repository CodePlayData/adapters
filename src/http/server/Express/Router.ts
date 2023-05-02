// @filename: ExpressRouter.ts

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

import { Router as ExpressRouterBase, Request, Response } from "express";
import { Router } from "../Router.js";
import { Route } from "../Route.js";

type RouterBase = ExpressRouterBase & {
    [key: string]: any
}

class ExpressRouter implements Router  {
    router!: RouterBase;

    constructor(routes?: Route[], readonly routerPath: string = '/') {
        this.router = ExpressRouterBase();
        routes?.map((route: Route) => {
            this.add(route);
        });
    }

    add(route: Route): void {
        this.router[route.method](route.endpoint, async (req: Request, res: Response) => {
            return route.callback(req, res);
        });
    }

    get routes() {
        const routes = this.router.stack.map((i:any) => {
            return {
                path: i.route.path,
                methods: i.route.methods,
            }
        })
        return routes
    }
};

export {
    ExpressRouter
}