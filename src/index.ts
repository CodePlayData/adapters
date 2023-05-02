// @filename: index.ts

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

import { IndexedDB, IDBIndex, IDBRepo, IDBConfig } from "./databases/browser/IndexedDB.js";
import { LocalStorage } from "./databases/browser/LocalStorage.js";
import { MongoDB } from "./databases/document/MongoDB.js";
import { Fetch } from "./http/client/Fetch/Fetch.js";
import { HttpClient } from "./http/client/HttpClient.js";
import { Collection } from "./collections/Collection.js";
import { Queue } from "./collections/Queue.js";
import { GenericQueue, DatabaseQuery } from "./collections/GenericQueue.js";
import { ExpressServer } from "./http/server/Express/Server.js";
import { ExpressRouter } from "./http/server/Express/Router.js";
import { GPUDeviceAdapter } from "./gpu/GPUDeviceAdapter.js";
import { GPUCommandRepository } from "./gpu/GPUCommandRepository.js";
import { Connection } from "./Connection.js";
import { LocalStorageQuery, MongoQuery, IndexedDBQuery, IndexOperations, DatabasePermission } from "./enums.js";
import { WasmModuleSource } from "./webassembly/WasmModuleSource.js"

export {
    IndexedDB,
    IDBIndex,
    IDBRepo,
    IDBConfig,
    HttpClient,
    DatabaseQuery,
    Queue,
    Collection,
    LocalStorage,
    MongoDB,
    GenericQueue,
    GPUCommandRepository,
    Fetch,
    ExpressServer,
    ExpressRouter,
    Connection,
    GPUDeviceAdapter,
    LocalStorageQuery, 
    MongoQuery, 
    IndexedDBQuery, 
    IndexOperations, 
    DatabasePermission,
    WasmModuleSource
}