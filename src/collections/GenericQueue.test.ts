// @filename: GenericQueue.test.ts
import test from "node:test";
import assert from "node:assert";
import { LocalStorage } from "../databases/LocalStorage.js";
import { GenericQueue } from "./GenericQueue.js";
import 'mock-local-storage';
import { LocalStorageQuery } from "../enums.js";

test('Unit Test - Testing if the queue exists.', async (context) => {
    const localstorage = new LocalStorage();
    const queue = new GenericQueue(localstorage, 2);

    assert.strictEqual(queue.size, 0);
    assert.deepEqual(queue.storage, []);

    await context.test('Behavioural Test - Testing insert one in the queue but not in the DB.', async(subcontext) => {
        queue.query(LocalStorageQuery.setItem, 'testing the first insert.', 'insert-1');
        assert.strictEqual(queue.size, 1);
        assert.strictEqual(localstorage.lenght, 0);
        assert.deepEqual(queue.storage, [{ key: 'insert-1', object: 'testing the first insert.', query: 'setItem', store: undefined }]);

        await subcontext.test('Behavioural Test - Testing if the inserted one now can go to the DB.', () => {
            queue.dequeue();
            assert.strictEqual(queue.size, 0);
            assert.strictEqual(localstorage.lenght, 1);
            const dbreturn = localstorage.query(LocalStorageQuery.getItem, undefined, 'insert-1') as string;
            const inserted = JSON.parse(dbreturn)[0];
            assert.strictEqual(inserted.object, 'testing the first insert.');
        });
    });

    await context.test('Behavioural Test - Testing if it emits an error when the queue is full', () => {
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