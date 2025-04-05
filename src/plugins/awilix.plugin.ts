import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import { asClass, asValue, Lifetime } from "awilix";
import { FastifyBaseLogger, FastifyInstance, RegisterOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { FastifyMongoObject } from "@fastify/mongodb";
import { DevicesController } from "../controllers/devices.controller";
import { DevicesService } from "../services/devices.service";
import { DevicesRepository } from "../repositories/devices.repository";
import { HistoryRepository } from "../repositories/history.repository";
import { HistoryService } from "../services/history.service";
import { HistoryController } from "../controllers/history.controller";
import { UtilController } from "../controllers/util.controller";
import { UtilService } from "../services/util.service";

declare module "@fastify/awilix" {
    interface Cradle {
        logger: FastifyBaseLogger,
        mongoInstance: FastifyMongoObject,
        devicesController: DevicesController,
        devicesService: DevicesService,
        devicesRepository: DevicesRepository,
        historyRepository: HistoryRepository,
        historyService: HistoryService,
        historyController: HistoryController,
        utilController: UtilController,
        utilService: UtilService,
    }
}

const axilixPlugin = async (fastify: FastifyInstance, options: RegisterOptions) => {
    await fastify.register(fastifyAwilixPlugin, {
        disposeOnClose: true,
        disposeOnResponse: true,
        strictBooleanEnforced: true,
    });

    diContainer.register({
        // Controllers
        devicesController: asClass(DevicesController, {
            lifetime: Lifetime.SINGLETON,
            dispose: module => module.dispose()
        }),
        historyController: asClass(HistoryController, {
            lifetime: Lifetime.SINGLETON,
            dispose: module => module.dispose()
        }),
        utilController: asClass(UtilController, {
            lifetime: Lifetime.SINGLETON,
            dispose: module => module.dispose()
        }),
        // Services
        devicesService: asClass(DevicesService, {
            lifetime: Lifetime.SINGLETON,
            dispose: module => module.dispose()
        }),
        historyService: asClass(HistoryService, {
            lifetime: Lifetime.SINGLETON,
            dispose: module => module.dispose()
        }),
        utilService: asClass(UtilService, {
            lifetime: Lifetime.SINGLETON,
            dispose: module => module.dispose()
        }),
        // Repositories
        devicesRepository: asClass(DevicesRepository, {
            lifetime: Lifetime.SINGLETON,
            dispose: module => module.dispose()
        }),
        historyRepository: asClass(HistoryRepository, {
            lifetime: Lifetime.SINGLETON,
            dispose: module => module.dispose()
        }),
        // Utils
        // Fastify plugins and variables
        mongoInstance: asValue(fastify.mongo),
        logger: asValue(fastify.log),
    })
}

export default fastifyPlugin(axilixPlugin);