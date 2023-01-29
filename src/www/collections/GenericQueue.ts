// @filename: GenericQueue.ts

/**
 *  A Generic queue to implement some like inbox&outbox pattern (https://event-driven.io/static/614379d9263d1b1395bf8ad305047ed3/5a190/2020-12-30-outbox.png).
 *  the only configuration needed is the database connection to send the queries in the dequeue method.
 */

import { Queue } from "./Queue.js";
import type { Connection } from "../Connection.js";
import { MongoQuery, IndexedDBQuery, LocalStorageQuery } from "../enums.js";

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
            throw new Error('You cannot insert any queries, the queue is full')
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
        if(this.storage.length === this.maxsize) {
            throw new Error('You cannot insert any queries, the queue is full')
        }
        this.storage.push({ query, object, key, store });
    }

    /**
     *  Calls the indexedDB adapter to the first element in the storage array and opens a spot to enter a new one.
     *  @returns @type { IDBRequest }
     */
    dequeue() {
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
     * @returns @type { boolean }
     */
    get isFull(): boolean {
        return this.storage.length === this.maxsize
    }    
}

export {
    GenericQueue,
    DatabaseQuery
}