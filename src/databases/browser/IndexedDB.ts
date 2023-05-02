// @filename: IndexedDatabaseAdapter.ts

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
 *  The IndexedDatabase is a browser V8's feature that acts as a Document Database Store, like MongoDB. 
 *  It acts by events and not Promisses, by transactions and has the following persistence operations:
 *  1- add; 2- clear; 3- count; 4- delete; 5- get; 6- getAll; 7-put. 
 * 
 *  It work with Indexes as well, they are methods that optimize that persistence operations: 
 *  1- createIndex; 2- deleteIndex; 3- getAllKeys; 4- getKey; 5- index; 6- indexNames; 
 *  7- openCursor; 8- OpenKeyCursor.
 *  
 *  PS¹: Sadly there is no valid fake to IndexedDB yet to be used in the Node, that's why there is no
 *  test file to this adapter.
 */

import { DatabasePermission, IndexedDBQuery } from "../../enums.js";
import type { Connection } from "../../Connection.js";
import { IndexedDBNoSupport } from "../../error/IndexedDBNoSupport.js";
import { IndexedDBDeleteDatabaseFailure } from "../../error/IndexedDBDeleteDatabaseFailure.js";

type IDBIndex = {
    indexName: string,
    keypath: string,
    options?: {
        [key: string]: any
    }
}

type IDBRepo = {
    name: string,
    id: string,
    indexes?: IDBIndex[]
}

type IDBConfig = {
    name: string,
    version: number,
    repositories: IDBRepo[]
}



class IndexedDB implements Connection {
    /** @type { string } - An identifier. */
    name: string = 'IndexedDB';
    /** @type { boolean } Check if the browser has this feature. */
    hasThisFeature: boolean;
    /** @type { IDBOpenDBRequest } The IndexDB is a event driven, so a connection must be opened before anything.*/
    #connection!: IDBOpenDBRequest;
    /** @type { IDBDatabase } The IndexDB database. */
    database!: IDBDatabase;
    /** @type { string } The store to conncect the transaction. */
    store!: string;
 
    /**
     * To instancing some database in the IndexDB browser feature you must provide this minimal info.
     * @param name @type { string } The name of the IndexDB database to be created or opened.
     * @param version @type { number } When some structure of the database changes this number must change to tell
     * the browser to get the new database instead the old one that it gets.
     * @param objectName @type { string[] } The "collections" or "tables" name.
     * @param indexes @type { DatabaseIndex[][] } A array of another array of indexes and values to be used in as "columns" of the "tables".
     */
    constructor(readonly idbConfig: IDBConfig, readonly permission: DatabasePermission) {
        /** Check if the browser supports this feature. */
        this.hasThisFeature = 'indexedDB' in navigator;
        if(!this.hasThisFeature)
            throw new IndexedDBNoSupport();   
        const database = this.#thisDatabaseAlreadyExists(idbConfig);
        database.then((result: string) => {
            if(result === 'empty' || result === 'exists') {
                this.#connection = indexedDB.open(idbConfig.name, idbConfig.version);
                this.#connection.onupgradeneeded = this.#setObjectStores();
                this.#connection.onsuccess = this.#setDatabase();
            } else {
                const request = indexedDB.deleteDatabase(idbConfig.name);
                request.onsuccess = () => {
                    this.#connection = indexedDB.open(idbConfig.name, idbConfig.version);
                    this.#connection.onupgradeneeded = this.#setObjectStores();
                    this.#connection.onsuccess = this.#setDatabase();
                }
                request.onerror = () => {
                    throw new IndexedDBDeleteDatabaseFailure();
                }
            }
        })
    }
 
    /**
     * It's a wrapper to not repear code, this simple returns the function that defines the object Stores.
     * @returns @type { Function }
     */
    #setObjectStores() {
        return () => {
            const db = this.#connection.result;
            this.idbConfig.repositories.map((object) => {
                const objectStore = db.createObjectStore(object.name, { keyPath: object.id });
                object.indexes?.map((index) => objectStore.createIndex(index.indexName, index.keypath, index.options));     
            })
        }
    }
 
    /**
     * Another wrapper thar returns the function that set the database.
     * @returns @type { Function }
     */
    #setDatabase() {
        return () => {
            this.database = this.#connection.result;
        }
    }
 
    /**
     * This checks if the database already exists before it initializes.
     * @param idbConfig @type { IDBConfig }
     * @returns 
     */
    async #thisDatabaseAlreadyExists(idbConfig: IDBConfig) {
        const alreadyExistsDatabase = (await window.indexedDB.databases()).filter(db => db.name === idbConfig.name);
        return  alreadyExistsDatabase.length < 1 ? 'empty' : 
                alreadyExistsDatabase[0].version !== idbConfig.version ? 'old' : 'exists'
    }
 
    /**
     * The main method of this class is to receive a query like any database software/feature, it is not the CQRS implementation of Command/Query.
     * @param query @type { DatabaseQuery } The indexDB basically has 5 operations: add, delete, update, get and getAll.
     * @param object @type { unknown } When the operation requires an object this is the field.
     * it need to trigger some Event? if so, use this array.
     */
    query(query: IndexedDBQuery, object?: unknown, key?: any): IDBRequest<any> | IDBRequest<IDBValidKey> | IDBRequest<undefined> | IDBRequest<any[]> {
        const transaction = this.database.transaction(this.store, this.permission);
        const store = transaction.objectStore(this.store);
        const request = query === 'add' ? store.add(object) :
                        query === 'delete' ? store.delete(key) :
                        query === 'readone' ? store.get(key) :
                        query === 'count' ? store.count(key) :
                        query === 'put' ? store.put(object, key) :
                        query === 'clear' ? store.clear() : store.getAll();
 
        return request
    }
 
     /**
      *  Return all indexNames of the database store.
      */
     get indexNames() {
         const transaction = this.database.transaction(this.store, this.permission);
         const store = transaction.objectStore(this.store);
         return store.indexNames
     }
 
    /**
     * Get all inserts keys that have the prop requested.
     * @param prop @type { IDBValidKey | IDBKeyRange } - The prop to be searched in all database inserts.
     * @param max @type { number } - The max number to return.
     * @returns @type { IDBRequest<IDBValidKey[]> }
     */
     keysof(prop: IDBValidKey | IDBKeyRange, max?: number) {
        const transaction = this.database.transaction(this.store, this.permission);
        const store = transaction.objectStore(this.store);
        return store.getAllKeys(prop, max)
    }
}
 
export {
    IndexedDB,
    IDBConfig,
    IDBRepo,
    IDBIndex
}