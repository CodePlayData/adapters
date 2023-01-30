class MongoOperationCouldNotCompleted extends Error {
    constructor(error?: unknown) {
        super(error ? 
            `The operation could not be completed due: ${error}` :
            `The operation could not be completed.`
            )
    }
}

export {
    MongoOperationCouldNotCompleted
}