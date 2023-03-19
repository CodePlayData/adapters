// @filename: 

import { Route } from "../../Route.js";
import { ExpressRouter } from "../ExpressRouter.js";
import { ExpressApp } from "../ExpressApp.js";

const route = new Route('get', '/api', async () => {
    const msg = "hello world"
    return msg
})

const router = new ExpressRouter([route]);
const httpServer = new ExpressApp(router);

httpServer.listen(3001)
