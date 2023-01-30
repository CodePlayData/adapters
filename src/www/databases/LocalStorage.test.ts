// @filename: LocalStorage.test.ts

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
import { LocalStorageQuery } from "../enums.js";
import { LocalStorage } from "./LocalStorage.js";
import 'mock-local-storage';

test('Testando se a classe LocalStorage pode ser instanciada.', async (context) => {
    const localstorage = new LocalStorage();
    assert.strictEqual(localstorage.store, '');

    await context.test('Testando a insercao de dados.', async (subcontext) => {
        // already a cler test, but later will be repeated.
        localstorage.query(LocalStorageQuery.clear)
        localstorage.query(LocalStorageQuery.setItem, 'testing the first insert.', 'insert-1');
        assert.strictEqual(localstorage.lenght, 1);
        localstorage.query(LocalStorageQuery.setItem, 'testing the second insert.', 'insert-2');
        assert.strictEqual(localstorage.lenght, 2);
        const dbreturn = localstorage.query(LocalStorageQuery.getItem, undefined, 'insert-2') as string;
        const inserted = JSON.parse(dbreturn)[0];
        assert.strictEqual(inserted.object, 'testing the second insert.');

        await subcontext.test('Testando a delecao de dados.', () => {
            localstorage.query(LocalStorageQuery.delete, undefined, 'insert-2');
            assert.strictEqual(localstorage.lenght, 1);
            const dbreturn = localstorage.query(LocalStorageQuery.getItem, undefined, 'insert-1') as string;
            const inserted = JSON.parse(dbreturn)[0];
            assert.strictEqual(inserted.object, 'testing the first insert.');
        });

        await subcontext.test('Testando o parametro de chave que se refira ao valor do seu dado inserido.', () => {
            assert.strictEqual(localstorage.key(0), 'insert-1');
            assert.strictEqual(localstorage.key(1), null);
        })

        await subcontext.test('Testando a delecao de todos os bancos de dados.', () => {
            localstorage.query(LocalStorageQuery.clear);
            assert.strictEqual(localstorage.lenght, 0);
        })
    })
});