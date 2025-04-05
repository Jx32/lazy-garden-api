import { FastifyBaseLogger } from "fastify";
import { Device } from "../interfaces/device";
import { DevicesRepository } from "../repositories/devices.repository";
import { buildObjectId } from "../utils/mongo.util";
import { DevicePatch } from "../interfaces/device-patch";
import { HistoryService } from "./history.service";

export class DevicesService {
    private logger: FastifyBaseLogger;
    private devicesRepository: DevicesRepository;
    private historyService: HistoryService;

    constructor({ logger, devicesRepository, historyService }:
                { logger: FastifyBaseLogger, devicesRepository: DevicesRepository, historyService: HistoryService }) {
        this.logger = logger;
        this.devicesRepository = devicesRepository;
        this.historyService = historyService;
    }

    public async upsertDevice(device: Device) {
        this.logger.info(`Attempting to upsert device ID ${device._id}`);
        device.lastReceivedUpdate = new Date().toISOString();

        return await this.devicesRepository.upsertDevice(device);
    }

    public async patchDevice(id: string, device: DevicePatch) {
        this.logger.info(`Attempting to patch device ID ${id}`);
        device.lastReceivedUpdate = new Date().toISOString();

        return await this.devicesRepository.patchDevice(buildObjectId(id), device);
    }

    public async getDevice(id: string) {
        this.logger.info(`Attempting to get device ID ${id}`);

        return await this.devicesRepository.getDevice(buildObjectId(id));
    }

    public async deleteDevice(id: string) {
        await this.historyService.deleteHistoryByDeviceId(id);

        this.logger.info(`Attempting to delete device ID ${id}`);
        return await this.devicesRepository.deleteDevice(buildObjectId(id));
    }

    public async getDevices() {
        this.logger.info(`Attempting to get devices`);

        return await this.devicesRepository.getDevices();
    }

    dispose() {}
}