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
import { strictEqual, deepEqual, rejects } from "node:assert";
import { MongoDB } from "./MongoDB.js"
import { MongoQuery, IndexOperations } from "../enums.js";

describe('Testando a classe MongoDB com...', () => {

    const mongo = new MongoDB('mongodb://127.0.0.1:27017');

    it('a inicialização no local:startup_log.', () => {
        strictEqual(mongo._db, 'local');
        strictEqual(mongo._store, 'startup_log');    
    });

    it('o setter/getter da database.', () => {
        mongo.database = 'teste';
        strictEqual(mongo.database, 'teste');
    });

    it('o setter/getter da store/collection.', () => {
        mongo.store = 'collection1';
        strictEqual(mongo.store, 'collection1');
    });

    it('o insertOne.', async () => {
        mongo.database = 'test';
        mongo.store = 'collection1';

        await mongo.query(MongoQuery.insertOne, { name: 'subject-1'});
        const length = await mongo.query(MongoQuery.countDocuments, {});
        strictEqual(length, 1)
    });

    it('o create Index.', async () => {
        await mongo.index(IndexOperations.create, [ { key: { name: 'text' }, default_language: 'english', name: 'index_name'} ]);
        const indexes = await mongo.index(IndexOperations.get) as Array<any>;
        strictEqual(indexes[1].name, 'index_name');
    });

    it('o dropIndex.', async () => {
        await mongo.index(IndexOperations.drop);
        const indexes = await mongo.index(IndexOperations.get) as any[];
        strictEqual(indexes.length, 1);
    });

    it('o updateOne.', async () => {
        await mongo.query(MongoQuery.updateOne, { $set: { name: 'subject-2' } }, { name: 'subject-1'});
        const data = await mongo.query(MongoQuery.findOne, { name: 'subject-2'}) as { [key: string]: any };
        strictEqual(data.name, 'subject-2');
    });

    it('o delete.', async ()=> {
        let count = await mongo.query(MongoQuery.countDocuments, { name: 'subject-2'});
        strictEqual(count, 1);
        await mongo.query(MongoQuery.deleteOne, { name: 'subject-2' });
        count = await mongo.query(MongoQuery.countDocuments, { name: 'subject-2' });
        strictEqual(count, 0);
    });

    it('o aggregate.', async () => {
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
                strictEqual(error.message, 'The operation could not be completed due: a query error ocorred.');
                return true;
            }
        )
    });

    after(async () => {
        await mongo.query(MongoQuery.deleteMany, {});
    });
});