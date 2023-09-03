// @filename: DocumentDatabaseRepository.test.ts

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

import { describe, it, before, after } from "node:test";
import { ok } from "node:assert";
import { MongoDBCollection } from "./MongoDB/Collection.js";
import { GenericMongoDBRepository } from "./GenericMongoDBRepository.js";

describe('Testando a implementação de um repositório com o MongoDB...', () => {
    let repo: GenericMongoDBRepository;

    before(() => {
        const mongo = MongoDBCollection.init
            (process.env.MONGO_URI as string || "mongodb://localhost:27017")
            ("npm_adapters")
            ("collection1");
        repo = GenericMongoDBRepository.start(mongo);
    });

    it('inserindo um documento.', () => {
        const doc = { name: 'subject-1'};

        const result = repo.saveDoc(doc);
        ok(result);
    });

    after(async () => {
        await repo.clear()
    });
});