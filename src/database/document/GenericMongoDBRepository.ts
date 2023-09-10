// @filanem: GenericMongoDBRepository.ts

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

import { DocumentDatabaseRepository } from "./DocumentDatabaseRepository.js"
import { MongoDBCollection } from "./MongoDB/Collection.js"
import { Document } from "./Document.js";

export class GenericMongoDBRepository extends DocumentDatabaseRepository {
    private constructor(readonly collection: MongoDBCollection) {
        super(collection)
    }

    async saveDoc(doc: Document) {
        return await this.collection.query('insertOne', doc)
    }

    async clear() {
        await this.collection.query('deleteMany', undefined, {})
    }

    static start(collection: MongoDBCollection) {
        return new GenericMongoDBRepository(collection)
    }
}
