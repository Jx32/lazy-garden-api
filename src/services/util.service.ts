import { FastifyBaseLogger } from "fastify";

export class UtilService {
    private logger: FastifyBaseLogger;
    private readonly TARGET_GMT_HOURS = -6; // GMT-06:00 Chihuahua, La Paz, Mazatlan

    constructor({ logger }:
                { logger: FastifyBaseLogger }) {
        this.logger = logger;
    }

    public getSecondsSinceMidnight (): number {
        const now = new Date();
        now.setHours((now.getUTCHours() + this.TARGET_GMT_HOURS));

        let secondsSinceMidnight = 0;

        secondsSinceMidnight += (now.getHours() * 3600);
        secondsSinceMidnight += now.getMinutes() * 60;
        secondsSinceMidnight += now.getSeconds();

        this.logger.info(`Got seconds since midnight: ${secondsSinceMidnight} and current time was ${now.toLocaleTimeString("en-US")}`);
        return secondsSinceMidnight;
    }

    dispose() {}
}