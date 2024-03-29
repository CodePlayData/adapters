// @filename: Fetch.ts

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

import { HttpClient } from "../HttpClient.js";
import { FetchInvalidArgument } from "./error/FetchInvalidArgument.js";
 
class Fetch implements HttpClient {
    /**
     * An implementation of a httpClient from the FetchAPI.
     * @param request An object derived from Request constructor to be fetched.
     * @returns @type { Promise<Response> } The eventLoopIdentifier of the request. Be aware, is not the Response directly.
     */
    send(request: Request): Promise<Response>;
    /**
     * An implementation of a httpClient from the FetchAPI.
     * @param url @type { string }
     * @param options @type {{ [key: string]: any }}
     */
    send(url: string, options?: { [key: string]: any }): Promise<Response>;
    send(requestOrUrl: Request | string, options?: { [key: string]: any }): Promise<Response> {
        if (requestOrUrl instanceof Request) {
            return fetch(requestOrUrl);
        } else if (typeof requestOrUrl === 'string') {
            return fetch(requestOrUrl, options);
        } else {
            throw new FetchInvalidArgument();
        }
    }
}
  
export {
    Fetch
}