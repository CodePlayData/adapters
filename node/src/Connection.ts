// @filename: Connection.ts

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

import { IndexOperations } from "./databases/document/MongoDB/IndexOperations.js";
import { IndexedDBQuery, LocalStorageQuery } from "./enums.js";

type DatabaseQuery = IndexedDBQuery | LocalStorageQuery

interface Connection {
    name: string;
    hasThisFeature?: boolean;
    database?: unknown;
    store?: string;
    collection?: string
    indexNames?: unknown;

    pipeline?(descriptions: unknown): any;
    index?(op: IndexOperations, indexdescript?: unknown): any;
    keysof?(prop: unknown, max?: number): any;
    query(query: DatabaseQuery | string, object?: unknown, key?: any): any;
}

export {
    Connection
}