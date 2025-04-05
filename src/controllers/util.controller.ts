import { FastifyReply, FastifyRequest } from "fastify";
import { UtilService } from "../services/util.service";

export class UtilController {

    private utilService: UtilService;

    constructor({ utilService }:
                { utilService: UtilService }) {
        this.utilService = utilService;
    }

    public async getSecondsSinceMidnight(req: FastifyRequest, reply: FastifyReply) {
        reply.send({ seconds: this.utilService.getSecondsSinceMidnight() });
    }

    public dispose() {}
}