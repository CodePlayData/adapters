// @filename: NodeRouterBuild.ts

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

interface NodeRouterBuilder {
    [index: string]: any;
}

class NodeRouterBuilder {
    router: Function[] = [];
    
    private _addRoute(method: string, path: string, callback: Function){
        const fn = (request: any, response: any) => {
            if(request.url === path && request.method === method) {
                return callback(request, response)
            }
        }

        this.router.push(fn);
        return this
    }

    private build() {
        const handler = (request: any, response: any) => {
            this.router.map((fn: Function) => {
                fn(request, response)
            })
        }
        return handler
    }

    get(endpoint: string, callback: Function) {
        this._addRoute('GET', endpoint, callback);
    }

    post(endpoint: string, callback: Function) {
        this._addRoute('POST', endpoint, callback);
    }

    put(endpoint: string, callback: Function) {
        this._addRoute('PUT', endpoint, callback);
    }

    delete(endpoint: string, callback: Function) {
        this._addRoute('DELETE', endpoint, callback);
    }

    head(endpoint: string, callback: Function) {
        this._addRoute('HEAD', endpoint, callback);
    }

    add(route: Route) {
        this[route.method](route.endpoint, route.callback);
    }

    callback(request: any, response: any) {
        const handler = this.build();
        return handler(request, response)
    }
}

export {
    NodeRouterBuilder
}