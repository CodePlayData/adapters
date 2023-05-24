// @filename: Axios.test.ts

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

import { describe, it } from "node:test";
import { strictEqual } from "node:assert";
import { Axios } from "./Axios.js";
import { RequestBuilder } from "../../RequestBuilder.js";
import dotenv from "dotenv";

describe('Testando a classe Axios com...', () => {
    dotenv.config();

    const httpclient = new Axios();
   
    it('uma Request.', async () => {
        const request =  new Request(process.env.HTTP_CLIENT_TEST_URL as string);
        strictEqual((await httpclient.send(request)).status, 200);
    });

    it('uma url.', async () => {
        strictEqual((await httpclient.send(process.env.HTTP_CLIENT_TEST_URL as string)).status, 200)
    });
});
   