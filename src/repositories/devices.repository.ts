import { FastifyMongoObject } from "@fastify/mongodb";
import fastifyMongodb = require("@fastify/mongodb");
import { Device } from "../interfaces/device";
import { BaseAbstractRepository } from "./base-abstract-repository";
import { buildObjectId } from "../utils/mongo.util";
import { DevicePatch } from "../interfaces/device-patch";

export class DevicesRepository extends BaseAbstractRepository {
    constructor({ mongoInstance }:
                { mongoInstance: FastifyMongoObject }) {
        super(mongoInstance, "devices");
    }

    public async upsertDevice(device: Device) {
        const filter: fastifyMongodb.mongodb.Filter<fastifyMongodb.mongodb.BSON.Document> = {
            _id: buildObjectId(device._id)
        }
        delete device._id; // Avoid id overwrite error by deleting it

        return await this.buildCollection().updateOne(filter, {$set: device}, { upsert: true });
    }

    public async patchDevice(id: fastifyMongodb.ObjectId, device: DevicePatch) {
        const filter: fastifyMongodb.mongodb.Filter<fastifyMongodb.mongodb.BSON.Document> = {
            _id: id
        }

        return await this.buildCollection().updateOne(filter, {$set: device}, { upsert: false });
    }

    public async getDevice(id: fastifyMongodb.ObjectId) {
        return await this.buildCollection().findOne({ _id: id }) as Device | null;
    }

    public async deleteDevice(id: fastifyMongodb.ObjectId) {
        return await this.buildCollection().deleteOne({ _id: id });
    }

    dispose() {}
}