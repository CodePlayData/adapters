// @filename: Express.ts

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
import { ExpressRouter } from "./Router.js";
import express, { Express } from "express";

class ExpressServer implements HttpServer {
    readonly app!: Express;
    
    constructor(readonly router?: ExpressRouter) {
        this.app = express();
        if(router) {
            this.app.use(router.routerPath, router.router)
        }
    }

    listen(port: number): void {
        this.app.listen(port, () => {
            console.log(`Listening on: ${port}`)
        })
    }

    use(): void {
        const expressApp = this.app as Express;
        expressApp.use(this.router!.routerPath, this.router!.router)
    }
}

export {
    ExpressServer
}
