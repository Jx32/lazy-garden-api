import { FastifyReply, FastifyRequest } from "fastify";
import { DevicePatch } from "../interfaces/device-patch";
import { HistoryService } from "../services/history.service";
import { History } from "../interfaces/history";
import { BadRequestError } from "../errors/bad-request.error";

export class HistoryController {
    private historyService: HistoryService;

    constructor({ historyService }:
                { historyService: HistoryService }) {
        this.historyService = historyService;
    }

    public async postHistory(req: FastifyRequest, reply: FastifyReply) {
        const entity: History = req.body as History;
        const { id } = req.params as { id: string };

        if (id !== entity.deviceId) {
            throw new BadRequestError("BR-1", "Path device Id does not match with the device Id from body", "Path device Id does not match with the device Id from body");
        }

        await this.historyService.postHistory(entity);

        reply.code(200);
    }

    public async getHistoryByDeviceId(req: FastifyRequest, reply: FastifyReply) {
        const { id } = req.params as { id: string };

        const result = await this.historyService.getHistoryByDeviceId(id);

        reply.send(result);
    }

    public dispose() {}
}