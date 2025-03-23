import { FastifyMongoObject } from "@fastify/mongodb";
import { BaseAbstractRepository } from "./base-abstract-repository";
import { History } from "../interfaces/history";
import { buildObjectId } from "../utils/mongo.util";

export class HistoryRepository extends BaseAbstractRepository {
    constructor({ mongoInstance }:
                { mongoInstance: FastifyMongoObject }) {
        super(mongoInstance, "history");
    }

    public async postHistory(history: History) {
        return await this.buildCollection().insertOne({
            deviceId: buildObjectId(history.deviceId),
            key: history.key,
            description: history.description,
            createdOn: history.createdOn || new Date().toISOString(),
        });
    }
    

    dispose() {}
}