// @filename: KeyPair.test.ts

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
import { deepEqual } from "node:assert";
import { KeyPair } from "./KeyPair.js";

describe('Testando o KeyPair com...', () => {
    it('dois buffers aleatórios como pubkey e privkey.', () => {
        const pub = Buffer.from('minha chave privada.');
        const prv = Buffer.from('minha chave pública.');

        const keyPair = KeyPair.set(pub, prv);

        deepEqual(keyPair.getPrivate(), prv);
        deepEqual(keyPair.getPublic(), pub)
    });
});