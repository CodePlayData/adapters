// @filename: HttpRouter.ts
interface HttpRouter {
    _router: any;
    router: any;
    routes: any;
    register(method: string, subpath: string, callback: Function): Promise<void>;
}

export {
    HttpRouter
}
