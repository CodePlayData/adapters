// @filename: Database.test.ts

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
import dotenv from "dotenv";
import { MongoDB } from "./Database.js";
import { MongoDBServer } from "./Server.js";

describe('Testando a classe MongoDB com...', () => {
    dotenv.config()

    it('um ping.', async () => {
        const server = new MongoDBServer(process.env.MONGO_URI as string || "mongodb://localhost:27017");
        const db = new MongoDB(server, 'npm_adapters');
        ok(await db.ping());
    });

    it('a criação pelo método init.', async () => {
        const db = MongoDB.init(process.env.MONGO_URI as string || "mongodb://localhost:27017")('npm_adapters')
        ok(await db.ping());
    });
});