// @filename: MongoDB.test.ts
import test from "node:test";
import assert from "node:assert";
import { MongoDB } from "./MongoDB.js"
import { MongoQuery, IndexOperations } from "../enums.js";

test('Unit Test - Testing if the class exists.', async (context) => {
    const mongo = new MongoDB('mongodb://127.0.0.1:27017')
    assert.strictEqual(mongo._db, 'local');
    assert.strictEqual(mongo._store, 'startup_log');
    
    await context.test('Behavioural Test - Testing getters and setters.', () => {
        mongo.database = 'teste';
        assert.strictEqual(mongo.database, 'teste');
        mongo.store = 'collection1';
        assert.strictEqual(mongo.store, 'collection1');
    });

    await context.test('Behavioural Test - Testing all CRUD queries.', async (subcontext) => {
        mongo.database = 'admin';
        mongo.store = 'collection1';

        // deleting all things in the previous tests if exists
        await mongo.query(MongoQuery.deleteMany, undefined, { msg: 'testing 1, 2, 3...'});
        await mongo.query(MongoQuery.deleteMany, undefined, { msg: 'new message.'});
        await mongo.index(IndexOperations.drop);
        await mongo.query(MongoQuery.deleteOne, undefined, { scale: 2 });
        await mongo.query(MongoQuery.deleteMany, undefined, { scale: 4 });
        await mongo.query(MongoQuery.deleteOne, undefined, { scale: 0 });

        // creating or re-creating
        await mongo.query(MongoQuery.insertOne, { msg: 'testing 1, 2, 3...'});
        const data = await mongo.query(MongoQuery.findOne, { msg: 'testing 1, 2, 3...'}) as { [key: string]: any };
        assert.strictEqual(data.msg, 'testing 1, 2, 3...');

        await subcontext.test('Behavioural Test - Create a text index.', async(deepsubcontext) => {
            await mongo.index(IndexOperations.create, [ { key: { msg: 'text' }, default_language: 'english', name: 'msg_index'} ]);
            const indexes = await mongo.index(IndexOperations.get);
            assert.strictEqual(indexes[1].name, 'msg_index');
            
            await deepsubcontext.test('Behavioural Test - Search using the index.', async () => {
                const data = await mongo.query(MongoQuery.findOne, { $text: { $search: "testing" } }) as { [key: string]: any };
                assert.strictEqual(data.msg, 'testing 1, 2, 3...')
            });

            await deepsubcontext.test('Behavioural Test - Deleting a index.', async () => {
                await mongo.index(IndexOperations.drop);
                const indexes = await mongo.index(IndexOperations.get) as any[];
                assert.strictEqual(indexes.length, 1);
            });
        });

        await subcontext.test('Behavioural Test - Updating a document in the collection.', async () => {
            await mongo.query(MongoQuery.updateOne, { $set: { msg: 'new message.'} }, { msg: 'testing 1, 2, 3...'});
            const data = await mongo.query(MongoQuery.findOne, { msg: 'new message.'}) as { [key: string]: any };
            assert.strictEqual(data.msg, 'new message.');
        });

        await subcontext.test('Behavioural Test - Testing deleting.', async() => {
            let count = await mongo.query(MongoQuery.countDocuments, { msg: 'new message.'});
            assert.strictEqual(count, 1);
            await mongo.query(MongoQuery.deleteOne, { msg: 'new message.'});
            count = await mongo.query(MongoQuery.countDocuments, { msg: 'new message.'});
            assert.strictEqual(count, 0);
        });
    });

    await context.test('Behavioural Test - Testing aggregated queries.', async() => {
        await mongo.query(MongoQuery.insertOne, { scale: 2, receivers: ["admin", "public"], msg: "A warning for all." });
        await mongo.query(MongoQuery.insertOne, { scale: 4, receivers: ["admin"], msg: "Bug Report."});
        await mongo.query(MongoQuery.insertOne, { scale: 4, receivers: ["admin"], msg: "Upgrade needed."});
        await mongo.query(MongoQuery.insertOne, { scale: 0, receivers: [ "public"], msg: "Be cool, nothing is wrong!"});
        const aggregation = [
            { 
                $match: { 
                    receivers: "admin" 
                } 
            }, 
            { 
                $group: { 
                    _id: "$scale", 
                    count: { 
                        $sum: 1 
                    } 
                } 
            }
        ]
        const data = await mongo.pipeline(aggregation) as Document[];
        assert.deepEqual(Object.keys(data[0]), ['_id', 'count']);
    });

    await context.test('Error Test - Testing the null return in case the method dont exists.', async() => {
        const nullReturn = await mongo.query('error' as MongoQuery);
        assert.strictEqual(nullReturn, null);
    })

    await context.test('Error Test - Testing the unhandled error.', async() => {
        await assert.rejects(
            async() => {
                await mongo.query('' as MongoQuery, {}, {})
            },
            (error: Error) => {
                assert.strictEqual(error.name, 'Error');
                assert.strictEqual(error.message, 'The operation could not be completed.');
                return true;
            }
        )
    })

})
