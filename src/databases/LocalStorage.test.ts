// @filename: LocalStorage.test.ts
import test from "node:test";
import assert from "node:assert";
import { LocalStorageQuery } from "../enums.js";
import { LocalStorage } from "./LocalStorage.js";
import 'mock-local-storage';

test('Testando se a classe LocalStorage pode ser instanciada.', async (context) => {
    const localstorage = new LocalStorage();
    assert.strictEqual(localstorage.store, '');

    await context.test('Testando a inserção de dados.', async (subcontext) => {
        // already a cler test, but later will be repeated.
        localstorage.query(LocalStorageQuery.clear)
        localstorage.query(LocalStorageQuery.setItem, 'testing the first insert.', 'insert-1');
        assert.strictEqual(localstorage.lenght, 1);
        localstorage.query(LocalStorageQuery.setItem, 'testing the second insert.', 'insert-2');
        assert.strictEqual(localstorage.lenght, 2);
        const dbreturn = localstorage.query(LocalStorageQuery.getItem, undefined, 'insert-2') as string;
        const inserted = JSON.parse(dbreturn)[0];
        assert.strictEqual(inserted.object, 'testing the second insert.');

        await subcontext.test('Testando a deleção de dados.', () => {
            localstorage.query(LocalStorageQuery.delete, undefined, 'insert-2');
            assert.strictEqual(localstorage.lenght, 1);
            const dbreturn = localstorage.query(LocalStorageQuery.getItem, undefined, 'insert-1') as string;
            const inserted = JSON.parse(dbreturn)[0];
            assert.strictEqual(inserted.object, 'testing the first insert.');
        });

        await subcontext.test('Testando o parâmetro de chave que se refira ao valor do seu dado inserido.', () => {
            assert.strictEqual(localstorage.key(0), 'insert-1');
            assert.strictEqual(localstorage.key(1), null);
        })

        await subcontext.test('Testando a deleção de todos os bancos de dados.', () => {
            localstorage.query(LocalStorageQuery.clear);
            assert.strictEqual(localstorage.lenght, 0);
        })
    })
});