import { FastifyMongoObject } from "@fastify/mongodb";
import fastifyMongodb = require("@fastify/mongodb");
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

    public async deleteHistoryByDeviceId(deviceId: string) {
        return await this.buildCollection().deleteMany({
            deviceId: buildObjectId(deviceId),
        });
    }

    public async getHistoryByDeviceId(deviceId: string) {
        const cursor = this.buildCollection().find({ deviceId: buildObjectId(deviceId) }, {
            limit: 20,
            sort: { createdOn: -1 }
        });
        let result = [];

        while (await cursor.hasNext()) {
            result.push(await cursor.next());
        }

        if (result.length === 0) {
            return [];
        }

        return result.map((history) => {
            return {
                _id: history!._id.toString(),
                deviceId: history!.deviceId.toString(),
                key: history!.key,
                description: history!.description,
                createdOn: history!.createdOn,
            };
        }) as History[];
    }
    

    dispose() {}
}