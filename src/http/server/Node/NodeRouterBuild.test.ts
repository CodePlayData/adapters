// @filename: NodeRouterBuild.test.ts

import { describe, it } from "node:test";
import { strictEqual, throws } from "node:assert";
import { NodeRouterBuilder } from "./NodeRouterBuild.js";
import { Route } from "../Route.js";

describe('Testando a classe NodeRouterBuild com...', () => {
    const router = new NodeRouterBuilder();
    it('o método GET.', async () => {
        const route = new Route('get', '/data', async () => { 
        })
        router.add(route);
        strictEqual(router.router.length, 1);
    });

    it('a função armazenada dando erro sem os parâmetros passados pelo método callback.', () => {
        throws(
            () => {
                router.router[0]()
            },
            Error
        )
    });
})