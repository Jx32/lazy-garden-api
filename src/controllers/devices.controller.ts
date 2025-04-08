import { FastifyReply, FastifyRequest } from "fastify";
import { Device } from "../interfaces/device";
import { DevicesService } from "../services/devices.service";
import { DevicePatch } from "../interfaces/device-patch";
import { HistoryService } from "../services/history.service";
import { UtilService } from "../services/util.service";

export class DevicesController {
    private devicesService: DevicesService;
    private historyService: HistoryService;
    private utilService: UtilService;

    constructor({ devicesService, historyService, utilService }:
                { devicesService: DevicesService, historyService: HistoryService, utilService: UtilService, }) {
        this.devicesService = devicesService;
        this.historyService = historyService;
        this.utilService = utilService;
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
        
        const xOrigin = req.headers["x-origin"] || "device";

        console.log(req.headers["x-origin"])

        // Devices should have the sync header as well as a new history
        if (xOrigin === "device") {
            const secondsSinceMidnight: number = this.utilService.getSecondsSinceMidnight();
            
            reply.header("sync", secondsSinceMidnight);

            await this.historyService.postHistory({
                deviceId: id,
                description: `Device synced. With ${Math.floor(secondsSinceMidnight / 3600)} hrs or ${secondsSinceMidnight} sec.`,
                key: "DEVICE_SYNC",
                createdOn: new Date().toISOString()
            });
        }

        reply
            .code(200)
            .send(device);
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