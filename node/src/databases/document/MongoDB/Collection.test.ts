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
import { MongoServer } from "./Server.js";
import { MongoDatabase } from "./Database.js";
import { MongoCollection } from "./Collection.js";
import dotenv from "dotenv";
import { SingleOpDocumentMongoQuery } from "./queries/document/SingleOp.js";


describe('Testando a classe MongoCollection com...', () => {
    dotenv.config()

    /** Testando o acesso da classe sem o curryng. */
    const server = new MongoServer( process.env.MONGO_URI as string);
    const db = new MongoDatabase(server, 'npm_adapters');
    const mongo = new MongoCollection(db, 'collection1')
    
    /** Testando o acesso com o curryng. */
    const database = MongoCollection.init(process.env.MONGO_URI as string ?? 'mongodb://127.0.0.1:27017')('npm_adapters');
    const collection1 = database('collection1');
    const collection2 = database('collection2');

    it('o insertOne.', async () => {
        const result = await mongo.query('insertOne', { name: 'subject-1'});
        strictEqual(result?.acknowledged, true);
    });

    it('o create Index.', async () => {
        await mongo.index('createIndexes', [ { key: { name: 'text' }, default_language: 'english', name: 'index_name'} ]);
        const indexes = await mongo.index('indexes') as Array<any>;
        strictEqual(indexes[1].name, 'index_name');
    });

    it('o dropIndex.', async () => {
        await mongo.index('dropIndexes');
        const indexes = await mongo.index('indexes') as any[];
        strictEqual(indexes.length, 1);
    });

    it('o updateOne.', async () => {
        await mongo.query('updateOne', { $set: { name: 'subject-2' } }, { name: 'subject-1'});
        const data = await mongo.query('findOne', { name: 'subject-2'}) as { [key: string]: any };
        strictEqual(data.name, 'subject-2');
    });

    it('o delete.', async ()=> {
        const result = await mongo.query('deleteOne', { name: 'subject-2' });
        strictEqual(result?.acknowledged, true);
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

    after(async () => {
        await collection1.query('deleteMany', undefined, {});
        await collection2.query('deleteMany', undefined, {});
    });
});