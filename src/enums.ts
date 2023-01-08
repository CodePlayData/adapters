// @filename: enums.ts
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