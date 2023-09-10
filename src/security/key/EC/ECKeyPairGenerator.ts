// @filename: ECKeyPairGenerator.ts

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
   
   export class ECKeyPairGenerator extends KeyPairGenerator {
       private constructor(readonly exportOption: 'pem' | 'der' = 'pem') {
           super('ec');
       }
   
       generateKeyPair(): KeyPair {
            if(this.exportOption === 'pem') {
                const { publicKey, privateKey } = generateKeyPairSync(
                    'ec',
                    {
                        namedCurve: 'secp256k1',
                        publicKeyEncoding: { type: 'spki', format: 'pem' },
                        privateKeyEncoding: {
                            type: 'sec1',
                            format: 'pem'
                        }
                    }
                );
                return KeyPair.set(Buffer.from(publicKey), Buffer.from(privateKey))
            } else {
                const { publicKey, privateKey } = generateKeyPairSync(
                    'ec',
                    {
                        namedCurve: 'secp256k1',
                        publicKeyEncoding: { type: 'spki', format: 'der' },
                        privateKeyEncoding: {
                            type: 'sec1',
                            format: 'der'
                        }
                    }
                );
                return KeyPair.set(Buffer.from(publicKey), Buffer.from(privateKey))
            }
       }
   
       static getInstance(exportOption: 'pem' | 'der' = 'pem') {
           return new ECKeyPairGenerator(exportOption)
       }
   }