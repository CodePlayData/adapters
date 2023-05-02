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

import { describe, it } from "node:test";
import { strictEqual } from "node:assert";
import { LocalStorageQuery } from "../../enums.js";
import { LocalStorage } from "./LocalStorage.js";
import 'mock-local-storage';

describe('Testando o LocalStorage com...', () => {
    const localstorage = new LocalStorage();

    it('um mock.', () => {
        strictEqual(localstorage.store, '');
    });

    it('o insert.', () => {
        localstorage.query(LocalStorageQuery.clear)
        localstorage.query(LocalStorageQuery.setItem, 'testing the first insert.', 'insert-1');
        
        strictEqual(localstorage.lenght, 1);

        localstorage.query(LocalStorageQuery.setItem, 'testing the second insert.', 'insert-2');
        
        strictEqual(localstorage.lenght, 2);
    });

    it('o getItem.', () => {
        const dbreturn = localstorage.query(LocalStorageQuery.getItem, undefined, 'insert-2') as string;
        const inserted = JSON.parse(dbreturn)[0];
        
        strictEqual(inserted.object, 'testing the second insert.');
    });

    it('o delete.', () => {
        localstorage.query(LocalStorageQuery.delete, undefined, 'insert-2');
        
        strictEqual(localstorage.lenght, 1);
    });

    it('a persistência de dados anteriores.', () => {
        const dbreturn = localstorage.query(LocalStorageQuery.getItem, undefined, 'insert-1') as string;
        const inserted = JSON.parse(dbreturn)[0];

        strictEqual(inserted.object, 'testing the first insert.');
    });

    it('a seleção pela key.', () => {
        strictEqual(localstorage.key(0), 'insert-1');
        strictEqual(localstorage.key(1), null);
    });

    it('o drop database.', () => {
        localstorage.query(LocalStorageQuery.clear);
        strictEqual(localstorage.lenght, 0);
    });
});
