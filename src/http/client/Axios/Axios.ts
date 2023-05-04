// @filename: Axios.ts

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
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { AxiosInvalidArgument } from "./error/AxiosInvalidArgument.js";

class Axios implements HttpClient {
    send(request: Request): Response | Promise<Response>;
    send(url: string, options?: AxiosRequestConfig | undefined): Promise<Response>;
    send(requestOrUrl: unknown, options?: AxiosRequestConfig): Response | Promise<Response> {
        if (requestOrUrl instanceof Request) {
            const { url, method, referrer, headers, body  } = requestOrUrl;
            let axiosHeaders = new AxiosHeaders();

            headers.forEach((value, key) => {
                axiosHeaders.set(key,value)
            })
            
            return axios(url, {
                method,
                baseURL: `${referrer}/${url}`,
                headers: axiosHeaders,
                data: body
            });
        } else if (typeof requestOrUrl === 'string') {
            return axios(requestOrUrl, options);
        } else {
            throw new AxiosInvalidArgument();
        }
    }
}

export { 
    Axios
}