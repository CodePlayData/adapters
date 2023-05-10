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

import faunadb from "faunadb";
import { FaunaDBUnavailable } from "./error/Unavailable.js";
const { Paginate } = faunadb.query

class FaunaDB {
    name: string = 'FaunaDB';
    _client: faunadb.Client;
    _collection: string;

    set collection(collection: string) {
        this._collection = collection;
    }

    get collection() {
        return this._collection
    }
    
    constructor(readonly uri: string, secret: string, collection: string) {
        this._client = new faunadb.Client({
            secret,
            endpoint: uri //https://db.fauna.com
        });
        this._collection = collection;
    }

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

    async query() {
        this._client.query(
            faunadb.query.Create(
                faunadb.query.Collection(this._collection),
                { data: {
                    name: 'subject-2'
                }}
            )
        )
        return true
    }

}

export {
    FaunaDB
}