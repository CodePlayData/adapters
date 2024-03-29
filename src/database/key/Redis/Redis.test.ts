// @filename: Redis.test.ts

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
import { ok } from "node:assert";
import { Redis } from "./Redis.js";
import dotenv from "dotenv";

describe('Testando a classe Redis com...', () => { 
    dotenv.config();

    const redis = new Redis(
        process.env.REDIS_HOST as string || '127.0.0.1',
        Number(process.env.REDIS_PORT) || 6379
    )
    
    it('um ping', async () => {
        ok(await redis.ping())
    });

 });