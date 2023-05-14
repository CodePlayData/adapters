// @filename: FaunaDB.test.ts

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
import { strictEqual, deepEqual, rejects, ok } from "node:assert";
import { FaunaDB } from "./FaunaDB.js";
import dotenv from "dotenv";

describe('Testando a classe FaunaDB com...', () => {
    dotenv.config();

    /** Testando o acesso da classe sem o curryng. */
    const fauna = new FaunaDB('https://db.fauna.com', process.env.FAUNA_SECRET as string, 'collection1');
    let id: string;

    /** Testando o acesso da classe com o curryng. */
    const database = FaunaDB.init('https://db.fauna.com')(process.env.FAUNA_SECRET as string);
    const collection1 = database('collection1');

    it('um ping.', async () => {
        ok(await fauna.ping());
    });

    it('o Create.', async () => {
        const response = await fauna.query('Create', { name: 'subject-1'}) as {[key: string]: any};
        id = response.ref.value.id;
        strictEqual(response.data.name, 'subject-1');
    });

    it('o create Index.', async () => {
        ok(
            await fauna.index('create', {
                name: 'byName',
                terms: [ 
                    { field: ['data', 'name'] }
                ],
                values: [
                    { field: ['data', 'name'] }
                ]
            })
        )
    });

    it('o get Index.', async () => {
        const indexes = await fauna.index('get') as { data: Array<{[key:string]: any}> };
        strictEqual(indexes.data[0].id, 'byName');
    });

    it('o Update.', async () => {
        const response = await fauna.query('Update', {name: 'subject-5'}, id) as {[key: string]: any};
        strictEqual(response.data.name, 'subject-5');
    });

    it('o Get.', async () => {
        let response = await fauna.query('Get', undefined, id) as {[key: string]: any};
        strictEqual(response.data.name, 'subject-5');

        response = await collection1.query('Get', undefined, id) as {[key: string]: any};
        strictEqual(response.data.name, 'subject-5');
    });

    it('o Aggregate no Count.', async () => {
        let response = await fauna.aggregate('Count', 'byName');
        strictEqual(response, 1);
    });

    it('o Delete.', async() => {
        const response = await fauna.query('Delete', undefined, id) as {[key: string]: any};
        strictEqual(response.data.name, 'subject-5');
    });

    it('o drop Index.', async() => {
        ok(
            await fauna.index('drop')
        )
    });

});