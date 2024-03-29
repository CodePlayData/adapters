// @filename: Redis.ts

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

import { createClient, RedisClientType } from "redis";
import { RedisOptions } from "./RedisOptions.js";
import { RedisServerUnavaiable } from "./error/RedisServerUnavaiable.js";

class Redis {
    _client!: RedisClientType;

    constructor(host: string, port: number, options?: RedisOptions) {
        this._client = createClient({
            username: options?.username,
            password: options?.password,
            socket: {
                tls: options?.tls ? true : false,
                key: options?.tls?.key,
                ca: options?.tls?.ca,
                cert: options?.tls?.cert,
                host,
                port
            }
        });
    }

    async ping() {
        try {
            await this._client.connect();
            const pong = await this._client.ping();
            return pong === 'PONG'
        } catch (error) {
            throw new RedisServerUnavaiable(error)
        } finally {
            this._client.disconnect();
        }
    }

    

}

export {
    Redis
}