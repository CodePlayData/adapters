// @filename: LocalStorage.ts

/**
 *  The LocalStorage adapater is like a in memory storage in the browser, the only methods avaiable are:
 *  1-clear; 2-getItem; 3-removeItem; 4-setItem. And the auxiliary methods: 1-key; 2-lenght.
 */

import { LocalStorageQuery } from "../enums.js";
import { Connection } from "../Connection.js";

class LocalStorage implements Connection {
    /** @type { string } - An identifier. */
    name: string = 'LocalStorage';
    /** In this Adapter there is no store division. */
    store: string = '';
    /** A index as ID when there is no ID defined. */
    iterator = 0;

    /**
     * The main method that deal with the database.
     * @param query @type { DatabaseQuery } - The query that will be made in the database.
     * @param object @type { unknown } - What will be stored.
     * @param key @type { string | number } - The index key.
     * @returns 
     */
    query(query: LocalStorageQuery, object?: unknown, key?: string) {
        const time = new Date().toJSON();
        const payload = JSON.stringify([{ time, object }]);
        const Key = key ? key : String(this.iterator);
        const request = query < 0 ? delete localStorage[Key] :
                        query === 0 ? Object.entries(localStorage) :
                        key && object ? localStorage[query](Key, payload) :
                        !key && !object ? localStorage[query]() :
                        key ? localStorage[query](Key) : 
                        object ? localStorage[query](payload) : null;
        return request
    }

    /**
     *  A Getter to tell you the actual length of the database.
     */
    get lenght(): number {
        return localStorage.length
    }

    /**
     * A function that returns the keyname based in the index provided.
     * @param index @type { number } - The index position to get the keyname.
     * @returns @type { string } - The keyname.
     */
    key(index: number): string | null {
        return localStorage.key(index)
    }
}

export {
    LocalStorage
}