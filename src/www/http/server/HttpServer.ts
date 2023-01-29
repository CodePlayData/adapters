// @filename: HttpServer.ts
import { HttpRouter } from "./HttpRouter";

interface HttpServer {
    _app: any;
    router: HttpRouter;
    listen(port: number): unknown;
}

export {
    HttpServer
}