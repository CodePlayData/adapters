// @filename: Fetch.test.ts
import test from "node:test";
import assert from "node:assert";
import { Fetch } from "./Fetch.js";

test('Testando o retorno de uma requisicao GET.', async() => {
    const httpclient = new Fetch();
    const request =  new Request('https://httpstat.us/200');
    assert.strictEqual((await httpclient.fetch(request)).status, 200);
})