// @filename: Repository.test.ts

import { describe, it, after } from "node:test";
import { strictEqual, deepEqual, rejects, ok } from "node:assert";
import { Connection } from "../Connection.js";

type CrudInstructions = {
    insert: 'insertOne'
}

class GenericRepositoryDatabase<T extends CrudInstructions> {
    constructor(readonly storage: Connection) {
    }

    
}

describe('Testando as dbs com a implementação de um repositório genérico...' , () => {
    it('', () => {});
});