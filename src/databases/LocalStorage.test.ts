// @filename: LocalStorage.test.ts
import test from "node:test";
import assert from "node:assert";
import { LocalStorageQuery } from "../enums.js";
import { LocalStorage } from "./LocalStorage.js";
import 'mock-local-storage';

test('Unit Test - Testing if the localstorage exists.', async (context) => {
    const localstorage = new LocalStorage();
    assert.strictEqual(localstorage.store, '');

    await context.test('Behavioural Test - Testing insert one.', async (subcontext) => {
        // already a cler test, but later will be repeated.
        localstorage.query(LocalStorageQuery.clear)
        localstorage.query(LocalStorageQuery.setItem, 'testing the first insert.', 'insert-1');
        assert.strictEqual(localstorage.lenght, 1);
        localstorage.query(LocalStorageQuery.setItem, 'testing the second insert.', 'insert-2');
        assert.strictEqual(localstorage.lenght, 2);
        const dbreturn = localstorage.query(LocalStorageQuery.getItem, undefined, 'insert-2') as string;
        const inserted = JSON.parse(dbreturn)[0];
        assert.strictEqual(inserted.object, 'testing the second insert.');

        await subcontext.test('Behavioral Test - Testing deleting one.', () => {
            localstorage.query(LocalStorageQuery.delete, undefined, 'insert-2');
            assert.strictEqual(localstorage.lenght, 1);
            const dbreturn = localstorage.query(LocalStorageQuery.getItem, undefined, 'insert-1') as string;
            const inserted = JSON.parse(dbreturn)[0];
            assert.strictEqual(inserted.object, 'testing the first insert.');
        });

        await subcontext.test('Behavioral Test - Testing the key parameter.', () => {
            assert.strictEqual(localstorage.key(0), 'insert-1');
            assert.strictEqual(localstorage.key(1), null);
        })

        await subcontext.test('Behavioural Test - Testing the clear method.', () => {
            localstorage.query(LocalStorageQuery.clear);
            assert.strictEqual(localstorage.lenght, 0);
        })
    })
});