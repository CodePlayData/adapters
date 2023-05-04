// @filename: GenericQueue.ts

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
 *  A Generic queue to implement some like inbox&outbox pattern (https://event-driven.io/static/614379d9263d1b1395bf8ad305047ed3/5a190/2020-12-30-outbox.png).
 *  the only configuration needed is the database connection to send the queries in the dequeue method.
 */

import { Queue } from "./Queue.js";
import type { Connection } from "../../Connection.js";
import { MongoQuery, IndexedDBQuery, LocalStorageQuery } from "../../enums.js";
import { QueueIsFull } from "./error/QueueIsFull.js";
import { QueueIsEmpty } from "./error/QueueIsEmpty.js";

type DatabaseQuery = MongoQuery | IndexedDBQuery | LocalStorageQuery;

class GenericQueue implements Queue, Connection {
    /** @type { string } - An identification. */
    name: string = 'GenericQueue';
    /** @type { Array<{ query: DatabaseQuery, object: unknown, key: any, store: string }> } - The queries storage. */
    storage: { query: DatabaseQuery, object?: unknown, key?: any, store: string }[] = [];
    /** @type { string } - The connection store name. */
    store!: string;

    /**
     * The only parameter needed to instantiate this queue is the database connection itself.
     * @param indexeddbadapter @type { Connection }
     * @param maxsize @type { number }
     */
    constructor(readonly indexeddbadapter: Connection, readonly maxsize: number = Infinity) {
    }

    /**
     * The same method that the Connection adapter has, to plug in classes that already use this adapter.
     * @param query @type { DatabaseQuery }
     * @param object @type { unknown }
     * @param key @type { any }
     */
    query(query: DatabaseQuery, object?: unknown, key?: any) {
        if(this.storage.length === this.maxsize) {
            throw new QueueIsFull();
        }
        this.enqueue(query, this.store, object, key);
    }

    /**
     *  The method that should be called if the class know that it is a queue. This method calls the main 
     *  method of the IndexDB adapter.
     * @param query 
     * @param object 
     * @param key 
     */
    enqueue(query: DatabaseQuery, store: string, object?: unknown, key?: any): void {
        if(this.isFull) {
            throw new QueueIsFull();
        }
        this.storage.push({ query, object, key, store });
    }

    /**
     *  Calls the indexedDB adapter to the first element in the storage array and opens a spot to enter a new one.
     *  @returns @type { IDBRequest }
     */
    dequeue() {
        if(this.isEmpty) {
            throw new QueueIsEmpty();
        }
        const element = this.storage.shift() as { query: DatabaseQuery, object?: unknown, key?: any, store: string };
        this.indexeddbadapter.store = element.store;
        const query = this.indexeddbadapter.query(element.query, element.object, element.key);
        return query
    }

    /**
     * Returns the actual size of the queue.
     * @returns @type { number }
     */
    get size(): number {
        return this.storage.length
    }
    
    /**
     *  Returns if the queue is already full.
     *  @returns @type { boolean }
     */
    get isFull(): boolean {
        return this.storage.length === this.maxsize
    }

    /**
     *  Returns true if the queue is empty.
     *  @returns @type { boolean }
     */
    get isEmpty(): boolean {
        return this.storage.length === 0
    }
}

export {
    GenericQueue,
    DatabaseQuery
}