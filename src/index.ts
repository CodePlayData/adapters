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

import { IndexedDB, IDBIndex, IDBRepo, IDBConfig } from "./databases/browser/IndexedDB/IndexedDB.js";
import { LocalStorage } from "./databases/browser/LocalStorage/LocalStorage.js"
import { MongoDBCollection } from "./databases/document/MongoDB/Collection.js";
import { MongoDB } from "./databases/document/MongoDB/Database.js";
import { MongoDBServer } from "./databases/document/MongoDB/Server.js";

import { Fetch } from "./http/client/Fetch/Fetch.js";
import { HttpClient } from "./http/client/HttpClient.js";

import { ExpressServer } from "./http/server/Express/Server.js";
import { ExpressRouter } from "./http/server/Express/Router.js";
import { ExpressRoute } from "./http/server/Express/Route.js";

import { FastifyRoute } from "./http/server/Fastify/Route.js";
import { FastifyRouter } from "./http/server/Fastify/Router.js";
import { FastifyServer } from "./http/server/Fastify/Server.js";

import { NodeRoute } from "./http/server/Node/Route.js";
import { NodeRouter } from "./http/server/Node/Router.js";
import { NodeServer } from "./http/server/Node/Server.js";

const http = {
    server: {
        express: {
            server: ExpressServer,
            router: ExpressRouter,
            route: ExpressRoute
        },
        fastify: {
            server: FastifyRoute,
            router: FastifyRouter,
            route: FastifyRoute
        },
        node: {
            server: NodeServer,
            router: NodeRouter,
            route: NodeRoute
        }
    }
}

import { Queue } from "./queue/memory/Queue.js";
import { GenericQueue, DatabaseQuery } from "./queue/memory/GenericQueue.js";
import { GPUDeviceAdapter } from "./gpu/GPUDeviceAdapter.js";
import { GPUCommandRepository } from "./gpu/GPUCommandRepository.js";

import { WasmModuleSource } from "./webassembly/WasmModuleSource.js"

import { Collection } from "./Collection.js";
import { Connection } from "./Connection.js";
import { LocalStorageQuery, IndexedDBQuery, DatabasePermission } from "./enums.js";

export {
    FastifyRoute,
    FastifyRouter,
    FastifyServer,
    NodeRoute,
    NodeRouter,
    NodeServer,
    ExpressServer,
    ExpressRouter,
    ExpressRoute,
    MongoDBCollection,
    MongoDB,
    MongoDBServer,
    IndexedDB,
    IDBIndex,
    IDBRepo,
    IDBConfig,
    HttpClient,
    DatabaseQuery,
    Queue,
    Collection,
    LocalStorage,
    GenericQueue,
    GPUCommandRepository,
    Fetch,
    Connection,
    GPUDeviceAdapter,
    LocalStorageQuery, 
    IndexedDBQuery, 
    DatabasePermission,
    WasmModuleSource,
    http
}