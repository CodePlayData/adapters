// @filename: MongoDB.ts

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

/**
 *  The MongoDB is NoSQL Document database that acts with Promisses and can perform simple queries and
 *  aggregate pipelines. To be less computational expensive is recommended to work with indexes, reference
 *  to https://www.mongodb.com/docs/manual/indexes/.
 * 
 *  The queries are: 1- insertOne; 2- deleteOne; 3- findOne; 4- countDocuments; 5- updateOne; 6- deleteMany;
 *  The indexes operations are: 1-createIndexes; 2- dropIndexes; 3- indexes;
 * 
 *  PS¹.: To test, it must have a mongod instance avaiable.
 */

import { Document, IndexDescription, MongoClient } from "mongodb";
import { MongoQuery, IndexOperations } from "../enums.js";
import { Connection } from "../Connection.js";
import { MongoAggregateCouldNotCompleted } from "../utils/errors/MongoAggregateCouldNotCompleted.js";
import { MongoOperationCouldNotCompleted } from "../utils/errors/MongoOperationCouldNotCompleted.js";

class MongoDB implements Connection {
    /**  @type { string } - An identifier. */
    name: string = 'MongoDB';
    /** @type { MongoClient }} - The mongodb client. */
    _client: MongoClient
    /** @type { string } - The name of the desired database to connect. */
    _db: string
    /** @type { string } - The collection to be worked. */
    _store: string

    /**
     *  To connect in some mongodb instance you only need the URI.
     *  @param uri @type { string } - The connection URI to connect in mongod.
     */
    constructor(readonly uri: string) {
        this._client = new MongoClient(uri);
        this._db = 'local';
        this._store = 'startup_log';
    }
    
    /**
     *  Set the name of the collection.
     */
    set store(store: string) {
        this._store = store;
    }

    /**
     *  Get the name of the collection.
     */
    get store() {
        return this._store
    }

    /**
     *  Set the database name.
     */
    set database(db: string) {
        this._db = db;
    }

    /**
     *  Get the database name.
     */
    get database() {
        return this._db
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
            await this._client.connect();
            const collection = this._client.db(this._db).collection(this._store);
            const cursor = collection.aggregate(descriptions);
            await cursor.forEach(doc => {
                result.push(doc)
            })
            return result
        } catch (error) {
            throw new MongoAggregateCouldNotCompleted(error);
        } finally {
            await this._client.close();
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
            await this._client.connect();
            const collection = this._client.db(this._db).collection(this._store);
            const indexreturn = op === IndexOperations.create && indexdescript ? await collection.createIndexes(indexdescript) :
                                op === IndexOperations.drop ? await collection.dropIndexes() : await collection.indexes();
            return indexreturn
        } catch (error) {
            throw new MongoOperationCouldNotCompleted('trouble in the index operation.')
        } finally {
            await this._client.close();
        }
    }

    /**
     * The main method that performs CRUD operations.
     * @param query @type { DatabaseQuery } - The only queries allowed are: create, delete, readone, count, update and clear.
     * @param object @type { unknown } - The data/object to be stored.
     * @param key @type { any } - The key to be used to search some data.
     * @returns @type { number | InsertOneResult<Document> | WithId<Document> | DeleteResult | UpdateResult | Error | null }
     */
    async query(query: MongoQuery, object?: unknown, key?: any) {
        const document = object as Document;
        try {
            await this._client.connect();
            const collection = this._client.db(this._db).collection(this._store);
            const request = object && !key ? await collection[query](document, key) : 
                            object && key ? await collection[query](key, document) : null;                        

            return request
        } catch (error) {
            throw new MongoOperationCouldNotCompleted();
        } finally {
            await this._client.close();
        }
    }
}

export {
    MongoDB
}