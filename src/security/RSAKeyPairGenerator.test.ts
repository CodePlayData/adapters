// @filename: RSAKeyPairGenerator.test.ts

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

import { describe, it, before } from "node:test";
import { ok, strictEqual } from "node:assert";
import { RSAKeyPairGenerator } from "./RSAKeyPairGenerator.js";

describe('Testando o RSAKeyPairGenerator com...', () => {
    let keyPairGenerator: RSAKeyPairGenerator;
    
    before(() => {
        keyPairGenerator = RSAKeyPairGenerator.getInstance();
    });

    it('exportando como pem.', () => {
        const keyPair = keyPairGenerator.generateKeyPair();
        ok(keyPair.getPublic().toString().includes('BEGIN PUBLIC KEY'));
        ok(keyPair.getPrivate().toString().includes('BEGIN PRIVATE KEY'));
    });

    it('exportando como der.', () => {
        const keyPair = keyPairGenerator.generateKeyPair(undefined, 'der');
        strictEqual(keyPair.getPublic().byteLength, 550);
    });
});