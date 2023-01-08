// @filename: ExpressRouter.ts
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