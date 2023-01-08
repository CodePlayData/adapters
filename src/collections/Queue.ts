// @filename: Queue.ts
import { Collection } from "./Collection.js";

interface Queue extends Collection {
    enqueue(...params: any[]): void;
    dequeue(): unknown;
}

export {
    Queue
}