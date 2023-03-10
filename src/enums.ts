// @filename: enums.ts

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

enum MongoQuery {
    insertOne = 'insertOne',
    deleteOne = 'deleteOne',
    findOne = 'findOne',
    countDocuments = 'countDocuments',
    updateOne = 'updateOne',
    deleteMany = 'deleteMany'
}

enum LocalStorageQuery {
    getItem = 'getItem',
    clear = 'clear',
    setItem = 'setItem',
    delete = -1,
    readall = 0
}

enum IndexedDBQuery {
    add = 'add',
    delete = 'delete',
    readone = 'readone',
    count = 'count',
    put = 'put',
    clear = 'clear',
    getAll = 'getAll'
}

enum DatabasePermission { 
    read = 'readonly',
    readwrite = 'readwrite'
}

enum IndexOperations {
    create = 'create',
    drop = 'drop',
    get = 'get'
}

export {
    LocalStorageQuery,
    MongoQuery,
    IndexedDBQuery,
    IndexOperations,
    DatabasePermission
}