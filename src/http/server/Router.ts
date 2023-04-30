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

import { Route } from "./Route.js";

abstract class Router {

    constructor (readonly router: any, routes?: Route[], readonly routerPath: string = '/') {
        routes?.map((route: Route) => {
            this.add(route);
        })
    }
    
    add(route: Route) {
        this.router[route.method](route.endpoint, async (req: any, res: any) => {
            console.log('cheguei aqui?')
            const output = await route.callback(req.params, req.body);
            res.json(output);
        })
    }
}

export {
    Router
}