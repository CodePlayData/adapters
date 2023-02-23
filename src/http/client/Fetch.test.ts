// @filename: Fetch.test.ts

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

import test from "node:test";
import assert from "node:assert";
import { Fetch } from "./Fetch.js";

test('Testando o retorno de uma requisicao GET.', async() => {
    const httpclient = new Fetch();
    const request =  new Request('https://httpstat.us/200');
    assert.strictEqual((await httpclient.fetch(request)).status, 200);
})