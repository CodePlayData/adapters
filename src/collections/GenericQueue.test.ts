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

import test from "node:test";
import assert from "node:assert";
import { LocalStorage } from "../databases/LocalStorage.js";
import { GenericQueue } from "./GenericQueue.js";
import 'mock-local-storage';
import { LocalStorageQuery } from "../enums.js";

test('Testando se a classe Queue pode ser instanciada.', async (context) => {
    const localstorage = new LocalStorage();
    const queue = new GenericQueue(localstorage, 2);

    assert.strictEqual(queue.size, 0);
    assert.deepEqual(queue.storage, []);

    await context.test('Testando se a operacao de insercao funciona na fila mas nao vai para o banco de dados.', async(subcontext) => {
        queue.query(LocalStorageQuery.setItem, 'testing the first insert.', 'insert-1');
        assert.strictEqual(queue.size, 1);
        assert.strictEqual(localstorage.lenght, 0);
        assert.deepEqual(queue.storage, [{ key: 'insert-1', object: 'testing the first insert.', query: 'setItem', store: undefined }]);

        await subcontext.test('Testando se a operacao de insercao esta indo para o banco de dados.', () => {
            queue.dequeue();
            assert.strictEqual(queue.size, 0);
            assert.strictEqual(localstorage.lenght, 1);
            const dbreturn = localstorage.query(LocalStorageQuery.getItem, undefined, 'insert-1') as string;
            const inserted = JSON.parse(dbreturn)[0];
            assert.strictEqual(inserted.object, 'testing the first insert.');
        });
    });

    await context.test('Testando se a fila emite o erro quando a esta cheia.', () => {
        queue.query(LocalStorageQuery.setItem, 'testing the first insert.', 'insert-1');
        queue.query(LocalStorageQuery.setItem, 'testing the second insert.', 'insert-2');
        assert.throws(
            () => {
                queue.query(LocalStorageQuery.setItem, 'testing the third insert.', 'insert-3')
            },
            Error,
            'You cannot insert any queries, the queue is full'
        )
    });
})