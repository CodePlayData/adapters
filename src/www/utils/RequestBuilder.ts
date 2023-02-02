// @filename: RequestBuilder.ts

// Copyright 2023 Pedro Paulo Teixeira dos Santos

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

interface RequestBuilder {
    header(header: string, value: string): this;
    get(): this;
    post(payload: unknown): this;
    patch(payload: unknown): this;
    put(payload: unknown): this;
    delete(): this;
    options(): this;
    build(): Request;
}

class RequestBuilder {
    /** @type { Headers } The headers from the request.*/
    #header = new Headers();
    /** The default method is GET. */
    #method: Request["method"] = "GET";
    /** Will be filled with the body request. */
    #body!: Request["body"] | string

    /**
     * If none of the parameters needs to be fullfiled then it will be a GET Request.
     * @param url @type { string } The url of the destination of the Resquest.
     */
    constructor(readonly url: string){
    }

    /**
     * Insert a header in the Request that will be builded.
     * @param header @type { string } The header key.
     * @param value @type { string } The header value.
     * @returns all this settings.
     */
    header(header: string, value: string) {
        this.#header.append(header, value);
        return this
    }

    /**
     * Define a GET Request, remember that this is the default option anyway.
     * @returns all this settings.
     */
    get() {
        this.#method = "GET";
        return this
    }

    /**
     * Define a POST Request.
     * @param payload @type { unknown } The payload of the http request.
     * @returns all this settings.
     */
    post(payload: unknown) {
        this.#method = "POST";
        this.#body = JSON.stringify(payload);
        return this
    }

    /**
     * A PATCH Request.
     * @param payload @type { unknown } The payload of the http request.
     * @returns all this settings.
     */
    patch(payload: unknown) {
        this.#method = "PATCH";
        this.#body = JSON.stringify(payload);
        return this

    }

    /**
     * A PUT Request.
     * @param payload @type { unknown } The payload of the http request.
     * @returns all this settings.
     */
    put(payload: unknown) {
        this.#method = "PUT";
        this.#body = JSON.stringify(payload);
        return this
    }
    
    /**
     * A DELETE Request for a specific endpoint.
     * @returns all this settings.
     */
    delete() {
        this.#method = "DELETE";
        return this
    }

    /**
     * A OPTIONS Request.
     * @returns all this settings.
     */
    options() {
        this.#method = "OPTIONS";
        return this
    }

    /**
     * Build the Request after all the options methods that was called.
     * @returns @type { Request } The Request itself.
     */
    build(): Request {    
        const request = new Request(this.url, {
            headers: this.#header,
            method: this.#method,
            body: this.#body
        })

        return request
    }
}

export {
    RequestBuilder
}