// @filename: FaunaDB.ts

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

import faunadb, { Client } from 'faunadb';
const { query: q } = faunadb;
import { FaunaDBUnavailable } from "./error/Unavailable.js";
import { SingleDocumentFaunaQuery } from "./queries/SingleDocument.js";
import { FaunaQueryOperationCouldNotCompleted } from './error/QueryOperationCouldNotComplete.js';

class FaunaDB {
    /**  @type { string } - An identifier. */
    name: string = 'FaunaDB';
    /** @type { Client } - The FaunaDB client. */
    _client: Client;
    /** @type { string } - The name of the desired database to connect. */
    _db!: string;
    /** @type { faunadb.Expr } - The collection to be worked. */
    _collection: faunadb.Expr;

    /**
     *  Set the name of the collection.
     */
    set collection(collection: string) {
        this._collection = q.Collection(collection);;
    }

    constructor(readonly uri: string, secret: string, collection: string) {
        this._client = new faunadb.Client({
            secret,
            endpoint: uri //https://db.fauna.com
        });
        this._collection = q.Collection(collection);
    }

    /**
     *  A function to test connection with FaunaDB deployment.
     */
    async ping() {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await this._client.ping()
            // Send a ping to confirm a successful connection
            return true
        } catch {
            throw new FaunaDBUnavailable()
        }
    }

    /**
     * The main method that performs CRUD operations.
     * @param query @type { SingleDocumentFaunaQuery } - The only queries allowed are: create, delete, readone, count, update and clear.
     * @param object @type { unknown } - The data/object to be stored.
     * @param key @type { any } - The key to be used to search some data.
     * @returns @type { number | Document | Error | null }
     */
    async query(query: SingleDocumentFaunaQuery, object?: unknown, key?: any) {
        try {
            const documentRef = q.Ref(this._collection, key);
            const request = object && !key ? q[query /** Create */](this._collection, { data: object }) : 
                            object && key ? q[query /** Update */](documentRef, { data: object }) : 
                            query === 'Get' ? q.Get(documentRef) : q.Delete(documentRef);
            const response = this._client.query(request);
            return response;
        } catch (error) {
            throw new FaunaQueryOperationCouldNotCompleted(error);
        }
    }
    
}

export {
    FaunaDB
}