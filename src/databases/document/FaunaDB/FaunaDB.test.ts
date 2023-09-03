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
import { strictEqual, ok } from "node:assert";
import { FaunaDB } from "./FaunaDB.js";
import dotenv from "dotenv";

describe('Testando a classe FaunaDB com...', () => {
    dotenv.config();

    /** Testando o acesso da classe sem o curryng. */
    const fauna = FaunaDB.init
        (process.env.FAUNA_HOST as string || "http://localhost:8443")
        (process.env.FAUNA_SECRET as string)
        (process.env.FAUNA_COLLECTION as string  || "teste")
    
    let id: string;

    /** Testando o acesso da classe com o curryng. */
    const database = FaunaDB.init(process.env.FAUNA_HOST as string || "http://localhost:8443")(process.env.FAUNA_SECRET as string);
    const collection1 = database(process.env.FAUNA_COLLECTION as string || "teste");

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
        let response = await fauna.aggregate({ query: 'Count', index: 'byName'});
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