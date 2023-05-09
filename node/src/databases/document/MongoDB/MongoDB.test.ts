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
import { MongoDB } from "./MongoDB.js"
import dotenv from "dotenv";
import { MongoQuery } from "./Query.js";


describe('Testando a classe MongoDB com...', () => {
    dotenv.config()

    const mongo = new MongoDB(process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017');
    mongo.database = 'npm_adapters';
    mongo.collection = 'test';

    it('a database e a collection pré-definidas.', () => {
        strictEqual(mongo.database, 'npm_adapters');
        strictEqual(mongo.collection, 'test');
    });

    it('a database trocada.', () => {
        mongo.database = 'npm_adapters2';
        strictEqual(mongo.database, 'npm_adapters2');
    });

    it('a collection trocada.', () => {
        mongo.collection = 'collection1';
        strictEqual(mongo.collection, 'collection1');
    });

    it('um ping.', async () => {
        ok(await mongo.ping());
    });

    it('o insertOne.', async () => {
        mongo.database = 'npm_adapters';
        mongo.collection = 'collection1';

        await mongo.query('insertOne', { name: 'subject-1'});
        const length = await mongo.query('countDocuments', {});
        strictEqual(length, 1)
    });

    it('o create Index.', async () => {
        await mongo.index('create', [ { key: { name: 'text' }, default_language: 'english', name: 'index_name'} ]);
        const indexes = await mongo.index('get') as Array<any>;
        strictEqual(indexes[1].name, 'index_name');
    });

    it('o dropIndex.', async () => {
        await mongo.index('drop');
        const indexes = await mongo.index('get') as any[];
        strictEqual(indexes.length, 1);
    });

    it('o updateOne.', async () => {
        await mongo.query('updateOne', { $set: { name: 'subject-2' } }, { name: 'subject-1'});
        const data = await mongo.query('findOne', { name: 'subject-2'}) as { [key: string]: any };
        strictEqual(data.name, 'subject-2');
    });

    it('o delete.', async ()=> {
        let count = await mongo.query('countDocuments', { name: 'subject-2'});
        strictEqual(count, 1);
        await mongo.query('deleteOne', { name: 'subject-2' });
        count = await mongo.query('countDocuments', { name: 'subject-2' });
        strictEqual(count, 0);
    });

    it('o aggregate.', async () => {
        await mongo.query('insertOne', { scale: 2, receivers: ["admin", "public"], msg: "A warning for all." });
        await mongo.query('insertOne', { scale: 4, receivers: ["admin"], msg: "Bug Report."});
        await mongo.query('insertOne', { scale: 4, receivers: ["admin"], msg: "Upgrade needed."});
        await mongo.query('insertOne', { scale: 0, receivers: [ "public"], msg: "Be cool, nothing is wrong!"});

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

    it('o null como retorno de uma query vazia.', async () => {
        const nullReturn = await mongo.query('error' as MongoQuery);
        strictEqual(nullReturn, null);
    });

    it('o um erro de query.', async () => {
        await rejects(
            async() => {
                await mongo.query('' as MongoQuery, {}, {})
            },
            (error: Error) => {
                strictEqual(error.name, 'Error');
                strictEqual(error.message, 'The query operation could not be completed.');
                return true;
            }
        )
    });

    after(async () => {
        await mongo.query('deleteMany', {});
    });
});