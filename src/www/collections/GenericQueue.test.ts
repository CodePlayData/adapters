// @filename: GenericQueue.test.ts
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