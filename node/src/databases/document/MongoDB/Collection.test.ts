// @filename: MongoDB.test.ts

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

import { describe, it, after } from "node:test";
import { strictEqual, deepEqual, rejects, ok } from "node:assert";
import { MongoDBServer } from "./Server.js";
import { MongoDB } from "./Database.js";
import { MongoDBCollection } from "./Collection.js";
import dotenv from "dotenv";
import { SingleOpDocumentMongoQuery } from "./queries/document/SingleOp.js";


describe('Testando a classe MongoDBCollection com...', () => {
    dotenv.config()

    /** Testando o acesso da classe sem o curryng. */
    const server = new MongoDBServer( process.env.MONGO_URI as string);
    const db = new MongoDB(server, 'npm_adapters');
    const mongo = new MongoDBCollection(db, 'collection1')
    
    /** Testando o acesso com o curryng. */
    const database = MongoDBCollection.init(process.env.MONGO_URI as string ?? 'mongodb://127.0.0.1:27017')('npm_adapters');
    const collection1 = database('collection1');
    const collection2 = database('collection2');

    it('o insertOne.', async () => {
        const result = await mongo.query('insertOne', { name: 'subject-1'});
        ok(result?.acknowledged);
    });

    it('o createIndexes.', async () => {
        await mongo.index('createIndexes', [ { key: { name: 'text' }, default_language: 'english', name: 'index_name'} ]);
        const indexes = await mongo.index('indexes') as Array<any>;
        strictEqual(indexes[1].name, 'index_name');
    });

    it('o createIndex.', async () => {
        await mongo.index('createIndex', { age: 1 });
        const indexes = await mongo.index('indexes') as Array<any>;
        strictEqual(indexes[2].name, 'age_1');
    });

    it('o indexExists.', async() => {
        ok(await mongo.index('indexExists', 'age_1'));
    });

    it('o indexInformation.', async() => {
        const info = await mongo.index('indexInformation', 'age_1');
        deepEqual(info, { _id_: [ ['_id', 1] ], age_1: [ ['age', 1] ], index_name: [ ['_fts', 'text'], ['_ftsx', 1] ]});
    });

    it('o dropIndex.', async() => {
        await mongo.index('dropIndex', 'age_1');
        strictEqual(await mongo.index('indexExists', 'age_1'), false);
    });

    it('o dropIndexes.', async () => {
        await mongo.index('dropIndexes');
        const indexes = await mongo.index('indexes') as any[];
        strictEqual(indexes.length, 1);
    });

    it('o indexes.', async() => {
        const indexes = await mongo.index('indexes');
        deepEqual(indexes, [ { key: { _id: 1}, name: '_id_', v: 2 } ]);
    });

    it('o updateOne.', async () => {
        const result = await mongo.query('updateOne', { $set: { name: 'subject-2' } }, { name: 'subject-1'});
        ok(result?.acknowledged);
    });

    it('o findOne.', async() => {
        const data = await mongo.query('findOne', { name: 'subject-2'}) as { [key: string]: any };
        strictEqual(data.name, 'subject-2');
    });

    it('o replaceOne.', async() => {
        const result = await mongo.query('replaceOne', { name: 'subject-2' }, { name: 'subject-1' });
        ok(result?.acknowledged);
    });

    it('o findOneAndReplace.', async() => {
        const data = await mongo.query('findOneAndReplace', { name: 'subject-1' }, { name: 'subject-2' }) as { [key: string]: any };
        strictEqual(data.value.name, 'subject-2');
    });

    it('o findOneAndUpdate.', async() => {
        const data = await mongo.query('findOneAndUpdate', { $set: { name: 'subject-2' } }, { name: 'subject-1' }) as { [key: string]: any };
        strictEqual(data.value.name, 'subject-1');
    });

    it('o findOneAndDelete', async() => {
        const result = await mongo.query('findOneAndDelete', { name: 'subject-2' });
        ok(result.ok);
    });

    it('o deleteOne.', async ()=> {
        const result = await mongo.query('deleteOne', { name: 'subject-2' });
        ok(result?.acknowledged);
    });

    it('o insertMany', async() => {
        const docs = [
            { scale: 2, receivers: ["admin", "public"], msg: "A warning for all." },
            { scale: 4, receivers: ["admin"], msg: "Bug Report."},
            { scale: 4, receivers: ["admin"], msg: "Upgrade needed."},
            { scale: 0, receivers: [ "public"], msg: "Be cool, nothing is wrong!"}
        ]
        const result = await mongo.query('insertMany', docs);
        ok(result)
    });

    it('o updateMany', async() => {
        const result = await mongo.query('updateMany', { $set: { msg: 'Updated!'}}, { scale: 4 });
        ok(result?.acknowledged);
    });

    it('o aggregate.', async () => {
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
        deepEqual(Object.keys(data[0]), ['_id', 'count']);
    });

    it('o um erro de query.', async () => {
        await rejects(
            async() => {
                await mongo.query('' as SingleOpDocumentMongoQuery, {}, {})
            },
            (error: Error) => {
                strictEqual(error.name, 'Error');
                strictEqual(error.message, 'The query operation could not be completed.');
                return true;
            }
        )
    });

    it('o deleteMany.', async () => {
        await collection1.query('deleteMany', undefined, {});
        await collection2.query('deleteMany', undefined, {});
    });
});