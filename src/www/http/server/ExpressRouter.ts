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

import { Router } from "express";
import { HttpRouter } from "./HttpRouter.js";

class ExpressRouter implements HttpRouter {
    _router: any;
    
    constructor(){
        this._router = Router();
    }

    async register(method: string, endpoint: string, callback: Function): Promise<void> {
        this._router[method](endpoint, async function (req: any, res: any) {
			const output = await callback(req.params, req.body);
			res.json(output);
		});
    }

    get router() {
        return this._router as Router;
    }

    get routes() {
        const router = this._router as Router;
        const routes = router.stack.map((i) => {
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