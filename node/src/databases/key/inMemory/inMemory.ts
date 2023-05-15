// @filename: Memcached.ts

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

import { Value } from "../Value.js"
import { InMemoryQuery } from "./Query.js"

class InMemory {
    _store!: Map<string, Value>

    constructor() {
    }

    query(query: InMemoryQuery, value?: Value , key?: string) {
        let response;
        
        switch (query) {
            case 'set':
                response = this._store.set(key!, value!);
                break;
            case 'delete':
                this._store.delete(key!);
                response = true
                break;
            case 'get':
                response = this._store.get(key!);
                break;
            case 'has':
                response = this._store.has(key!);
                break;
            case 'clear':
                this._store.clear();
                response = true
                break;
        }

        return response
    }
}

export {
    InMemory
}