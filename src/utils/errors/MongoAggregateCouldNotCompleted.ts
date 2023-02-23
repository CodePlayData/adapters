class MongoAggregateCouldNotCompleted extends Error {
    constructor(error: unknown) {
        super(`The aggregation could not be completed due: ${error}`);
    }
}

export {
    MongoAggregateCouldNotCompleted
}