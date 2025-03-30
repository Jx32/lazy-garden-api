import { FastifyBaseLogger } from "fastify";
import { HistoryRepository } from "../repositories/history.repository";
import { History } from "../interfaces/history";

export class HistoryService {
    private logger: FastifyBaseLogger;
    private historyRepository: HistoryRepository;

    constructor({ logger, historyRepository }:
                { logger: FastifyBaseLogger, historyRepository: HistoryRepository }) {
        this.logger = logger;
        this.historyRepository = historyRepository;
    }

    public async postHistory(history: History) {
        this.logger.info(`Attempting to post new history with key ${history.key}`);
        
        return await this.historyRepository.postHistory(history);
    }

    public async deleteHistoryByDeviceId(deviceId: string) {
        this.logger.info(`Attempting to delete histories by device ID ${deviceId}`);
        
        return await this.historyRepository.deleteHistoryByDeviceId(deviceId);
    }

    dispose() {}
}