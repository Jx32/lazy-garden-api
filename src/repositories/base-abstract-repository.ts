import { FastifyMongoObject } from "@fastify/mongodb";

export abstract class BaseAbstractRepository {
    private mongoInstance: FastifyMongoObject;
    private collectionName: string;

    constructor( mongoInstance: FastifyMongoObject, collectionName: string ) {
        this.mongoInstance = mongoInstance;
        this.collectionName = collectionName;
    }

    protected buildCollection() {
        const coll = this.mongoInstance.db?.collection(this.collectionName);

        if (!coll) {
            throw new Error(`Collection ${this.collectionName} was not found`);
        }
        return coll;
    }
}