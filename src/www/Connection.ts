// @filename: Connection.ts
import { IndexOperations, IndexedDBQuery, LocalStorageQuery, MongoQuery } from "./enums.js";

type DatabaseQuery = MongoQuery | IndexedDBQuery | LocalStorageQuery

interface Connection {
    name: string;
    hasThisFeature?: boolean;
    database?: unknown;
    store: string;
    indexNames?: unknown;

    pipeline?(descriptions: unknown): any;
    index?(op: IndexOperations, indexdescript?: unknown): any;
    keysof?(prop: unknown, max?: number): any;
    query(query: DatabaseQuery | string, object?: unknown, key?: any): any;
}

export {
    Connection
}