// @filename: Collection.ts

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

import { 
    Collection, 
    DeleteResult, 
    Flatten, 
    IndexDescription, 
    IndexSpecification, 
    InsertManyResult, 
    InsertOneResult, 
    ModifyResult, 
    OptionalUnlessRequiredId, 
    UpdateResult, 
    WithId 
} from "mongodb";
import { Document } from "../Document.js";
import { MongoDB } from "./Database.js";
import { MongoDBServer } from "./Server.js";
import { MongoAggregateCouldNotCompleted } from "./error/AggregateCouldNotCompleted.js";
import { MongoIndexOperationCouldNotCompleted } from "./error/IndexOperationCouldNotCompleted.js";
import { MongoQueryOperationCouldNotCompleted } from "./error/QueryOperationCouldNotCompleted.js";
import { SingleOpDocumentMongoQuery, SingleOpDocumentMongoQueryOptions } from "./queries/document/SingleOp.js";
import { DoubleOpDocumentMongoQuery, DoubleOpDocumentMongoQueryOptions } from "./queries/document/DoubleOp.js";
import { MeasureMongoQuery, MeasureMongoQueryOptions } from "./queries/Mesuare.js";
import { SubsetMongoQuery, SubsetMongoQueryOptions } from "./queries/Subset.js";
import { SingleIndexMongoOp } from "./queries/index/Single.js";
import { MultipleIndexMongoOp } from "./queries/index/Multiple.js";
import { AggregationQuery } from "../AggregationQuery.js";
import { Connection } from "../../../Connection.js";

interface MongoDBCollection <T extends Document> extends Connection<
    Document[]
> {
    collection: Collection<T>;
    
    aggregate(descriptions: Document[]): Promise<Document[]>;
    
    index(op: SingleIndexMongoOp, indexspec?: IndexSpecification | string | string[]): Promise<string | Document | boolean>;
    index(op: MultipleIndexMongoOp, indexdescript?: IndexDescription[]): Promise<string[] | Document | Document[]>;
    index(op: SingleIndexMongoOp | MultipleIndexMongoOp, indexdescriptOrSpecification?: IndexSpecification | string | string[] | IndexDescription | IndexDescription[]): Promise<string | Document | boolean> | Promise<string[] | Document | Document[]>;
    
    query(query: SingleOpDocumentMongoQuery, data?: OptionalUnlessRequiredId<T>, key?: Partial<T>, options?: SingleOpDocumentMongoQueryOptions): Promise<Document | InsertOneResult<T> | WithId<T> | DeleteResult | UpdateResult | null>;
    query(query: DoubleOpDocumentMongoQuery, data?: OptionalUnlessRequiredId<T>, key?: Partial<T>, options?: DoubleOpDocumentMongoQuery):  Promise<ModifyResult<T>>;
    query(query: SubsetMongoQuery, data?:OptionalUnlessRequiredId<T>, key?: Partial<T>, options?: SubsetMongoQueryOptions): Promise<InsertManyResult<T> | DeleteResult | Document | UpdateResult>;
    query(query: MeasureMongoQuery, key?: Partial<T>, options?: MeasureMongoQueryOptions): Promise<number | Flatten<WithId<T>>[]>;
    query(query: SingleOpDocumentMongoQuery | DoubleOpDocumentMongoQuery | SubsetMongoQuery | MeasureMongoQuery, documentOrKey?: OptionalUnlessRequiredId<T> | OptionalUnlessRequiredId<T>[] | Partial<T>, keyoOrOptions?: Partial<T>| MeasureMongoQueryOptions, options?: SingleOpDocumentMongoQueryOptions | DoubleOpDocumentMongoQuery | SubsetMongoQueryOptions): Promise<Document | InsertOneResult<T> | WithId<T> | DeleteResult | UpdateResult | null> | Promise<ModifyResult<T>> | Promise<InsertManyResult<T> | DeleteResult | Document | UpdateResult> | Promise<number | Flatten<WithId<T>>[]>;
}

/** A MongoColletion where the query, index and aggregate ops occurs. */
class MongoDBCollection<T extends Document> implements Connection<Document[]> {
    /** A collection of something... */
    collection: Collection<T>;
    

    /**
     *  This initiates a bound to a collection in some MongoDB.
     *  @param database @type { MongoDB } - The collection always refers to a MongoDB.
     *  @param collection @type { string } - The collection name.
     */
    constructor(readonly database: MongoDB, collection: string) {
        this.collection = this.database.db.collection<T>(collection);
    }


    /**
     *  The function that performs the aggregate operations.
     *  @param descriptions @type { Document[] } - The Document type contains the mongo operators to be executed.
     *  for reference: https://www.mongodb.com/docs/manual/aggregation/.
     *  @returns @type { Document[] }
     */
    async aggregate(descriptions: AggregationQuery<Document>) {
        descriptions = descriptions as Document[];
        let result: Document[] = [];
        
        try {
            await this.database.server._client.connect();
            callback: {
                const cursor = this.collection.aggregate(descriptions);
                await cursor.forEach(doc => {
                    result.push(doc)
                })
                return result
            }
        } catch (error) {
            error: {
                throw new MongoAggregateCouldNotCompleted(error);
            }
        } finally {
            await this.database.server._client.close();
        }
    }


    /**
     *  Operations for a single index in a collection.
     *  @param op @type { SingleIndexMongoOp } - createIndex, dropIndex, indexExists and IndexInformation.
     *  @param indexspec @type { IndexSpecification } - The info about the index itself.
     *  @returns @type { Promise<string | Document | boolean> }
     */
    async index(op: SingleIndexMongoOp, indexspec?: IndexSpecification | string | string[]): Promise<string | Document | boolean>;
    /**
     *  Operations for multiple indexes in a collection.
     *  @param op @type { MultipleIndexMongoOp } - createIndexes, dropIndexes and indexes.
     *  @param indexdescript @type { IndexDescription[] } - The info about all indexes.
     *  @returns @type { Promise<string[] | Document | Document[]> }
     */
    async index(op: MultipleIndexMongoOp, indexdescript?: IndexDescription[]): Promise<string[] | Document | Document[]>;
    async index(
        op: SingleIndexMongoOp | MultipleIndexMongoOp,
        indexdescriptOrSpecification?: IndexSpecification | string | string[] | IndexDescription | IndexDescription[]
    ) {
        try {
            await this.database.server._client.connect();
            callback: {
                const indexMethod = this.collection[op] as (arg1?: IndexSpecification | string | string[] | IndexDescription | IndexDescription[]) => Promise<any>;
                const request = !indexdescriptOrSpecification ? await indexMethod.call(this.collection) : await indexMethod.call(this.collection, indexdescriptOrSpecification);
                return request
            }
        } catch (error) {
            error: {
                throw new MongoIndexOperationCouldNotCompleted(error)
            }
        } finally {
            await this.database.server._client.close();
        }
    }


    /**
     *  A single operation based in a single document reference, _i.e._, insertOne, deleteOne etc.
     *  @param query @type { SingleOpDocumentMongoQuery } - insertOne, deleteOne, findOne, updateOne and replaceOne.
     *  @param data @type { OptionalUnlessRequiredId<T> } - The data to be stored. In that case is a single document.
     *  @param key @type { Partial<T> } - The key to be used to search some data. Must be a key thar exists in the document defined in generics type.
     *  @returns @type { Promise<Document | InsertOneResult<T> | WithId<T> | DeleteResult | UpdateResult | null> }
     */
    async query(query: SingleOpDocumentMongoQuery, data?: OptionalUnlessRequiredId<T>, key?: Partial<T>, options?: SingleOpDocumentMongoQueryOptions): Promise<Document | InsertOneResult<T> | WithId<T> | DeleteResult | UpdateResult | null>;
    /**
     *  Double operations based a single document reference, _i.e._, findOneAndDelete, findOneAndUpdate, etc.
     *  @param query @type { DoubleOpDocumentMongoQuery } - findOneAndDelete, findOneAndReplace and findOneAndUpdate.
     *  @param data @type { OptionalUnlessRequiredId<T> } - The data to be stored. In that case is a single document.
     *  @param key @type { Partial<T> } - The key to be used to search some data. Must be a key thar exists in the document defined in generics type.
     *  @returns @type { Promise<ModifyResult<t>> }
     */
    async query(query: DoubleOpDocumentMongoQuery, data?: OptionalUnlessRequiredId<T>, key?: Partial<T>, options?: DoubleOpDocumentMongoQueryOptions): Promise<ModifyResult<T>>;
    /**
     *  Operations that involves multiple documents. The data is provided as an array, while the key is still a single Partial<T>.
     *  @param query @type { SubsetMongoQuery } - insertMany, deleteMany and updateMany.
     *  @param data @type { OptionalUnlessRequiredId<T>[] } - The Array of data to ve stored.
     *  @param key @type { Partial<T> } - The key to be used to search some data. Must be a key thar exists in the document defined in generics type.
     *  @returns @type { Promise<InsertManyResult<T> | DeleteResult | Document | UpdateResult> }
     */
    async query(query: SubsetMongoQuery, data?:OptionalUnlessRequiredId<T>, key?: Partial<T>, options?: SubsetMongoQueryOptions): Promise<InsertManyResult<T> | DeleteResult | Document | UpdateResult>;
    /**
     *  The collections state summaries.
     *  @param query @type { MeasureMongoQuery } - countDocuments and distinct.
     *  @param key @type { Partial<T> } - The key to be used to search some data. Must be a key thar exists in the document defined in generics type.
     *  @returns @type { Promise<number | Flatten<WithId<T>>[]> }
     */
    async query(query: MeasureMongoQuery, key?: Partial<T>, options?: MeasureMongoQueryOptions): Promise<number | Flatten<WithId<T>>[]>;
    async query(
        query: SingleOpDocumentMongoQuery | DoubleOpDocumentMongoQuery | SubsetMongoQuery | MeasureMongoQuery, 
        documentOrKey?: OptionalUnlessRequiredId<T> | OptionalUnlessRequiredId<T>[] | Partial<T>, 
        keyoOrOptions?: Partial<T>| MeasureMongoQueryOptions | SingleOpDocumentMongoQueryOptions | DoubleOpDocumentMongoQueryOptions | SubsetMongoQueryOptions
    ) {
        try {
            await this.database.server._client.connect();
            callback: {
                const queryMethod = this.collection[query] as (arg1: Partial<T> | MeasureMongoQueryOptions | OptionalUnlessRequiredId<T> | OptionalUnlessRequiredId<T>[], arg2?: OptionalUnlessRequiredId<T> | Partial<T> | OptionalUnlessRequiredId<T>[]) => Promise<any>;
                const request = documentOrKey && !keyoOrOptions ? await queryMethod.call(this.collection, documentOrKey) : 
                                documentOrKey && keyoOrOptions ? await queryMethod.call(this.collection, keyoOrOptions, documentOrKey) : 
                                await queryMethod.call(this.collection, keyoOrOptions!);
                return request
            }
        } catch (error) {
            error: {
                throw new MongoQueryOperationCouldNotCompleted();
            }
        } finally {
            await this.database.server._client.close();
        }
    }
    
    /**
     *  The curryng method to instatiate in parts this class.
     *  @param uri @type { string } - The connection endpoint.
     *  @returns @type { (database: string) => (collection: string) => MongoDBCollection }
     */
    static init(uri: string) {
        return (database: string) => {
            return (collection: string) => {
                return new MongoDBCollection(
                    new MongoDB(
                        new MongoDBServer(uri),
                        database
                    ),
                    collection
                )
            }
        }
    }
}

export {
    MongoDBCollection
}