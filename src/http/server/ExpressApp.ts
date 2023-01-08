// @filename: Express.ts
import { HttpServer } from "./HttpServer.js";
import { RouterApp } from "./RouterApp.js";

import express from "express";

class ExpressApp implements HttpServer {
    _app;

    constructor(readonly routers?: RouterApp[]) {
        this._app = express();
        routers?.map((router: RouterApp) => {
            this._app.use(router.path, router.router);
        })
    }

    async listen(port: number) {
        return this._app.listen(port);
    }

    get router() {
        return this._app._router
    }
}

export {
    ExpressApp
}
