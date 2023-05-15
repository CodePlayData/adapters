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
import { DocumentFaunaQuery as DocumentQuery } from "./queries/Document.js";
import { FaunaQueryOperationCouldNotCompleted } from './error/QueryOperationCouldNotComplete.js';
import { IndexOperations } from '../IndexOperations.js';
import { IndexDescription } from './IndexDescription.js';
import { FaunaIndexOperationCouldNotCompleted } from './error/IndexOperationCouldNotCompleted.js';
import { SubsetFaunaQuery as SubsetQuery } from './queries/Subset.js';
import { Document } from "../Document.js";

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

    /**
     *  The adapter to connect to some FaunaDB instance.
     *  @param uri @type { string } - The endpoint to connect with.
     *  @param secret @type { string } - All FaunaDB instances provide the database access with some
     *                                   secret that is used to authenticate and authorizes in that database.
     *  @param collection  @type { string } - The collection to works with.
     */
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
            // Connect the client to the server.
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
    async query(query: DocumentQuery, object?: Document, key?: any) {
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

    /**
     * Create indexes in some colletion.
     * @param op @type { IndexOperations } - The allowed operations are: create, drop or get.
     * @param indexdescript @type { IndexDescription[] } - The description of the indexes to be created.
     * Check the test file to reference.
     * @returns @type { Document } - A document with summary.
     */
    async index(op: IndexOperations, indexdescript?: IndexDescription) {
        if(indexdescript) {
            indexdescript.source = this._collection;
        }

        try {
            const indexReturn = op === 'create' && indexdescript ? this._client.query(q.CreateIndex(indexdescript)) :
                                op === 'get' ? this._client.query(q.Paginate(q.Indexes())) : this.dropIndexes();
            return indexReturn
        } catch (error) {
            throw new FaunaIndexOperationCouldNotCompleted(error)
        }
    }

    /**
     *  In FaunaDB the indexes are deleted one by one, however, in this implementation we need
     *  the MongoDB behavior that drops all indexes at once. This is why this methods exists.
     *  @returns @type { boolean }
     */
    private async dropIndexes() {
        try {
            const indexes = await this._client.query(q.Map(
                q.Paginate(q.Indexes()),
                q.Lambda('indexRef', q.Get(q.Var('indexRef')))
            )) as { [key: string]: any }
            
            Promise.all(
                indexes.data.map(async (index:any) => {
                    await this._client.query(q.Delete(q.Index(index.ref.id)));
                })
            )
            
            return true
        } catch (error) {
            throw new FaunaIndexOperationCouldNotCompleted(error)
        }
    }

    /**
     * The currying method to initialize one or more databases or collections in separeted references.
     * @param uri @type { string } - The database server address.
     * @returns @type { (string) => (string) => FaunaDB }
     */
    static init(uri: string) {
        return (secret: string) => {
            return (collection: string) => {
                return new FaunaDB(uri, secret, collection)
            }
        }
    }

    /**
     *  Operations that manipulates many documents at once.
     *  @param query @type { SubsetQuery } - 'Count' | 'Mean' | 'Max' | 'Min' | 'Distinct';
     *  @param indexName @type { string } - The index must be provided otherwise a error will occur.
     *  @param fieldName @type { string } - In the cases that are not count you must identify the fieldName.
     *  @returns 
     */
    async aggregate(query: SubsetQuery, indexName?: string, fieldName?: string) {
        const indexes = await this.index('get') as { data: Array<{[key:string]: any}> };
        let createdIndexes = indexes.data.filter((index: any) => index.id === indexName);
        let indexRef = q.Match(q.Index(indexName ?? ''));
        let request;
        
        if(createdIndexes.length < 1) {
            throw new Error('Index not exists.')
        }

        switch (query) {
            case 'Count':
                request = q.Count(q.Documents(this._collection));
                break;
            default:
                request = q[query](q.Map(indexRef, q.Lambda(['x'], q.Select([fieldName],q.Get(q.Var('x'))))));
                break;
        }

        try {
            const result = await this._client.query(request);
            return result    
        } catch (error) {
            throw new Error('The aggregate operation could conclude.')
        }

    }
}

export {
    FaunaDB
}