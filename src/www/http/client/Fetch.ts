// @filename: Fetch.ts
/**
 *  This file the API implementation of the Web Standard Fecth. 
 */
 import { HttpClient } from "./HttpClient.js";
 
 class Fetch implements HttpClient {
    /**
     * An implementation of a httpClient from the FetchAPI.
     * @param request An object derived from Request constructor to be fetched.
     * @returns @type { Promise<Response> } The eventLoopIdentifier of the request. Be aware, is not the Response directly.
     */
    fetch(request: Request): Promise<Response> {
        return fetch(request)
    }
}
  
export {
    Fetch
}