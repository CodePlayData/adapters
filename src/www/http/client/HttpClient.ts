// @filename: HttpClient.ts
interface HttpClient {
    fetch(request: Request): Promise<Response>
}

export {
    HttpClient
}