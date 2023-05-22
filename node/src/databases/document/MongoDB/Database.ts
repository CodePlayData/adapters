// @filename: MongoDB.ts

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

import { Db } from "mongodb";
import { MongoDBServer } from "./Server.js";
import { MongoDBUnavailable } from "./error/Unavailable.js";

/** A MongoDB database. */
class MongoDB {
    /** The database itself. */
    db: Db;

    /**
     *  This class is the classe thar represents some database in a MongoDB service deployment.
     *  @param server @type { MongoDBServer } - The server that this intance of database refers to.
     *  @param database @type { string } - The name of the database.
     */
    constructor(readonly server: MongoDBServer, database: string) {
        this.db = this.server._client.db(database)
    }

    /**
     *  A function to test connection with mongodb deployment.
     */
    async ping() {
        try {
            // Connect the client to the server.
            await this.server._client.connect();
            // Send a ping to confirm a connection
            await this.db.command({ ping: 1 });
            return true
        } catch {
            throw new MongoDBUnavailable()
        } finally {
            // Ensures that the client will close when you finish/error
            await this.server._client.close();
        }
    }

    /**
     *  This is the curryng method to initiate this class, defining the URI 
     *  and later the database name.
     *  @param uri @type { string } - The MongoDB endpoint.
     *  @returns @type { MongoDB }
     */
    static init(uri: string) {
        return (database: string) => {
            return new MongoDB(new MongoDBServer(uri), database)
        }
    }
}

export {
    MongoDB
}