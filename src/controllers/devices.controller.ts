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

        await this.devicesService.upsertDevice(entity);

        reply.code(200);
    }

    public async patchDevice(req: FastifyRequest, reply: FastifyReply) {
        const entity: DevicePatch = req.body as DevicePatch;
        const { id } = req.params as { id: string };

        await this.devicesService.patchDevice(id, entity);

        reply.code(200);
    }

    public dispose() {

    }
}