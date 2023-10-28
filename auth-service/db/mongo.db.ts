import mongoose, { MongooseError } from "mongoose";

export class MongoDb {
    constructor(private readonly connectionURL: string) { }

    async connect()
    {
        try {
            let connection = await mongoose.connect(this.connectionURL);
            console.log('\x1b[32m%s\x1b[0m', `Mongo DB connected on ${this.connectionURL}`);
        } catch (error: any) {
            console.log('\x1b[31m%s\x1b[0m', "ERROR:", (error as MongooseError).message);
        }
    }
}