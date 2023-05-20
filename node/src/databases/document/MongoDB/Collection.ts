// @filename: Collection.ts

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

import { Collection, Filter, IndexDescription, OptionalUnlessRequiredId } from "mongodb";
import { Document } from "../Document.js";
import { IndexOperations } from "../IndexOperations.js";
import { MongoDatabase } from "./Database.js";
import { MongoServer } from "./Server.js";
import { MongoAggregateCouldNotCompleted } from "./error/AggregateCouldNotCompleted.js";
import { MongoIndexOperationCouldNotCompleted } from "./error/IndexOperationCouldNotCompleted.js";
import { MongoQueryOperationCouldNotCompleted } from "./error/QueryOperationCouldNotCompleted.js";
import { SingleOpDocumentMongoQuery } from "./queries/document/SingleOp.js";

/** A MongoColletion where the query, index and pipeline ops occurs. */
class MongoCollection<T extends Document> {
    /** A collection of something... */
    collection: Collection<T>;
    
    /**
     *  This initiates a bound to a collection in some MongoDatabase.
     *  @param database @type { MongoDatabase } - The collection always refers to a MongoDatabase.
     *  @param collection @type { string } - The collection name.
     */
    constructor(readonly database: MongoDatabase, collection: string) {
        this.collection = this.database.db.collection<T>(collection);
    }

    /**
     *  The function that performs the pipeline operations.
     *  @param descriptions @type { Document[] } - The Document type contains the mongo operators to be executed.
     *  for reference: https://www.mongodb.com/docs/manual/aggregation/.
     *  @returns @type { Document[] }
     */
    async pipeline(descriptions: Document[]) {
        let result: Document[] = [];
        try {
            await this.database.server._client.connect();
            const cursor = this.collection.aggregate(descriptions);
            await cursor.forEach(doc => {
                result.push(doc)
            })
            return result
        } catch (error) {
            throw new MongoAggregateCouldNotCompleted(error);
        } finally {
            await this.database.server._client.close();
        }
    }

    /**
     * Create indexes in some colletion. **Be carrefull that too many indexes can slow down queries.**
     * @param op @type { IndexOperations } - The allowed operations are: create, drop or get.
     * @param indexdescript @type { IndexDescription[] } - The description of the indexes to be created.
     * Check the test file to reference.
     * @returns @type { Document } - A document with summary.
     */
    async index(op: IndexOperations, indexdescript?: IndexDescription[]) {
        try {
            await this.database.server._client.connect();
            const indexreturn = op === 'create' && indexdescript ? await this.collection.createIndexes(indexdescript) :
                                op === 'drop' ? await this.collection.dropIndexes() : await this.collection.indexes();
            return indexreturn
        } catch (error) {
            throw new MongoIndexOperationCouldNotCompleted(error)
        } finally {
            await this.database.server._client.close();
        }
    }

    /**
     * The main method that performs CRUD operations.
     * @param query @type { DatabaseQuery } - The only queries allowed are: create, delete, readone, count, update and clear.
     * @param object @type { unknown } - The data/object to be stored.
     * @param key @type { any } - The key to be used to search some data.
     * @returns @type { number | InsertOneResult<T> | WithId<T> | DeleteResult | UpdateResult | Error | null }
     */
    async query(query: SingleOpDocumentMongoQuery, document?: OptionalUnlessRequiredId<T>, key?: Partial<T>) {
        try {
            await this.database.server._client.connect();
            const collectionMethod = this.collection[query] as (arg1: Partial<T> | OptionalUnlessRequiredId<T>, arg2?: OptionalUnlessRequiredId<T> | Partial<T>) => Promise<any>;
            const request = document && !key ? await collectionMethod.call(this.collection, document) : 
                            document && key ? await collectionMethod.call(this.collection, key, document) : await collectionMethod.call(this.collection, key!);
            return request
        } catch (error) {
            throw new MongoQueryOperationCouldNotCompleted();
        } finally {
            await this.database.server._client.close();
        }
    }
    

    /**
     *  The curryng method to instatiate in parts this class.
     *  @param uri @type { string } - The connection endpoint.
     *  @returns @type { (database: string) => (collection: string) => MongoCollection}
     */
    static init(uri: string) {
        return (database: string) => {
            return (collection: string) => {
                return new MongoCollection(
                    new MongoDatabase(
                        new MongoServer(uri),
                        database
                    ),
                    collection
                )
            }
        }
    }
}

export {
    MongoCollection
}