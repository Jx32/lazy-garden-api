import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import { asClass, asValue, Lifetime } from "awilix";
import { FastifyBaseLogger, FastifyInstance, RegisterOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { FastifyMongoObject } from "@fastify/mongodb";
import { DevicesController } from "../controllers/devices.controller";
import { DevicesService } from "../services/devices.service";
import { DevicesRepository } from "../repositories/devices.repository";

declare module "@fastify/awilix" {
    interface Cradle {
        logger: FastifyBaseLogger,
        mongoInstance: FastifyMongoObject,
        devicesController: DevicesController,
        devicesService: DevicesService,
        devicesRepository: DevicesRepository,
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
        // Services
        devicesService: asClass(DevicesService, {
            lifetime: Lifetime.SINGLETON,
            dispose: module => module.dispose()
        }),
        // Repositories
        devicesRepository: asClass(DevicesRepository, {
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