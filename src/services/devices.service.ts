import { FastifyBaseLogger } from "fastify";
import { Device } from "../interfaces/device";
import { DevicesRepository } from "../repositories/devices.repository";
import { buildObjectId } from "../utils/mongo.util";
import { DevicePatch } from "../interfaces/device-patch";

export class DevicesService {
    private logger: FastifyBaseLogger;
    private devicesRepository: DevicesRepository;

    constructor({ logger, devicesRepository }:
                { logger: FastifyBaseLogger, devicesRepository: DevicesRepository }) {
        this.logger = logger;
        this.devicesRepository = devicesRepository;
    }

    public async upsertDevice(device: Device) {
        this.logger.info(`Attempting to upsert device ID ${device._id}`);

        return await this.devicesRepository.upsertDevice(device);
    }

    public async patchDevice(id: string, device: DevicePatch) {
        this.logger.info(`Attempting to patch device ID ${id}`);

        return await this.devicesRepository.patchDevice(buildObjectId(id), device);
    }

    dispose() {}
}