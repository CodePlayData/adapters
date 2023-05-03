// @filename: GenericQueue.test.ts

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

import { describe, it } from "node:test";
import { strictEqual, deepEqual, throws } from "node:assert";
import { LocalStorage } from "../../databases/browser/LocalStorage/LocalStorage.js";
import { GenericQueue } from "./GenericQueue.js";
import 'mock-local-storage';
import { LocalStorageQuery } from "../../enums.js";

describe('Testando a GenericQueue...', async () => {
    const localstorage = new LocalStorage();
    const queue = new GenericQueue(localstorage, 2);
    
    it('com o localStorage.', () => {
        strictEqual(queue.size, 0);
        deepEqual(queue.storage, []);
    });

    it('com o insert em memória sem ir pro banco de dados.', () => {
        queue.query(LocalStorageQuery.setItem, 'testing the first insert.', 'insert-1');
        
        strictEqual(queue.size, 1);
        strictEqual(localstorage.lenght, 0);
        deepEqual(queue.storage, [{ key: 'insert-1', object: 'testing the first insert.', query: 'setItem', store: undefined }]);
    });

    it('com o dequeue enviando os dados para o banco de dados.', () => {
        queue.dequeue();

        strictEqual(queue.size, 0);
        strictEqual(localstorage.lenght, 1);
            
        const dbreturn = localstorage.query(LocalStorageQuery.getItem, undefined, 'insert-1') as string;
        const inserted = JSON.parse(dbreturn)[0];
            
        strictEqual(inserted.object, 'testing the first insert.');
    });

    it('com a fila cheia.', () => {
        queue.query(LocalStorageQuery.setItem, 'testing the first insert.', 'insert-1');
        queue.query(LocalStorageQuery.setItem, 'testing the second insert.', 'insert-2');
        
        throws(
            () => {
                queue.query(LocalStorageQuery.setItem, 'testing the third insert.', 'insert-3')
            },
            Error,
            'You cannot insert any queries, the queue is full'
        )
    });
});