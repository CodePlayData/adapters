// @filename: RSAKeyPairGenerator.ts

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

import { KeyPair } from "./KeyPair.js";
import { KeyPairGenerator } from "./KeyPairGenerator.js";
import { generateKeyPairSync } from "node:crypto";

export class RSAKeyPairGenerator extends KeyPairGenerator {
    private constructor(readonly modulusLength: number = 4096) {
        super('rsa');
    }

    generateKeyPair(secret?: { passphrase: string, cipher: string }, exportOption: 'pem' | 'der' = 'pem'): KeyPair {
        if(secret && exportOption === 'pem') { 
            const { publicKey, privateKey } = generateKeyPairSync(
                'rsa', 
                { 
                    modulusLength: this.modulusLength, 
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem',
                        cipher: secret.cipher,
                        passphrase: secret.passphrase
                    },
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
            });
            return KeyPair.set(Buffer.from(publicKey), Buffer.from(privateKey))
        } else if(secret && exportOption === 'der') {
            const { publicKey, privateKey } = generateKeyPairSync(
                'rsa', 
                { 
                    modulusLength: this.modulusLength, 
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'der',
                        cipher: secret.cipher,
                        passphrase: secret.passphrase
                    },
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'der'
                    },
            });
            return KeyPair.set(publicKey, privateKey)
        } else if(!secret && exportOption === 'der') {
            const { publicKey, privateKey } = generateKeyPairSync(
                'rsa', 
                { 
                    modulusLength: this.modulusLength, 
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'der'
                    },
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'der'
                    },
            });
            return KeyPair.set(publicKey, privateKey)
        } else {
            const { publicKey, privateKey } = generateKeyPairSync(
                'rsa', 
                { 
                    modulusLength: this.modulusLength, 
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    },
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
            });
            return KeyPair.set(Buffer.from(publicKey), Buffer.from(privateKey))
        }
    }

    static getInstance(modulusLength: number = 4096 ) {
        return new RSAKeyPairGenerator(modulusLength)
    }
}