import { FastifyReply, FastifyRequest } from "fastify";
import { Device } from "../interfaces/device";
import { DevicesService } from "../services/devices.service";
import { DevicePatch } from "../interfaces/device-patch";

export class DevicesController {
    private devicesService: DevicesService;

    constructor({ devicesService }:
                { devicesService: DevicesService }) {
        this.devicesService = devicesService;
    }

    public async upsertDevice(req: FastifyRequest, reply: FastifyReply) {
        const entity: Device = req.body as Device;

        const res = await this.devicesService.upsertDevice(entity);
        
        entity._id = res.upsertedId?.toString();

        reply.code(200).send(entity);
    }

    public async patchDevice(req: FastifyRequest, reply: FastifyReply) {
        const entity: DevicePatch = req.body as DevicePatch;
        const { id } = req.params as { id: string };

        await this.devicesService.patchDevice(id, entity);

        reply.code(200);
    }

    public async getDevice(req: FastifyRequest, reply: FastifyReply) {
        const { id } = req.params as { id: string };

        const device = await this.devicesService.getDevice(id);

        if (!device) {
            reply.code(404);
            return;
        }

        reply.code(200).send(device);
    }

    public async deleteDevice(req: FastifyRequest, reply: FastifyReply) {
        const { id } = req.params as { id: string };

        const result = await this.devicesService.deleteDevice(id);

        if (result.deletedCount === 0) {
            reply.code(404);
            return;
        }

        reply.code(200);
    }

    public async getDevices(req: FastifyRequest, reply: FastifyReply) {
        const devices = await this.devicesService.getDevices();

        if (!devices || devices.length === 0) {
            reply.code(404);
            return;
        }

        reply.code(200).send(devices);
    }

    public dispose() {

    }
}