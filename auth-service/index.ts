import dotenv from "dotenv";
import app from "./app";
import http from "http";
import { MongoDb } from "./db/mongo.db";

dotenv.config();

async function main()
{
    const port = process.env.SERVER_PORT || 5000;
    const server = http.createServer(app);

    console.log("\n");

    let db = new MongoDb("mongodb://127.0.0.1:27017");
    await db.connect();

    server.listen(port, () => {
        console.log('\x1b[32m%s\x1b[0m', `Server started at ${port}...`);
    })
}
main();