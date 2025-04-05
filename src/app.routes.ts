import { FastifyInstance, FastifySchema } from "fastify";

export const appRoutes = async (fastify: FastifyInstance) => {
    registerSchemas(fastify);

    fastify.get("/device", { schema: buildGetDevicesSchema() }, async (req, reply) => await fastify.diContainer.cradle.devicesController.getDevices(req, reply));
    fastify.put("/device", { schema: buildPutDeviceSchema() }, async (req, reply) => await fastify.diContainer.cradle.devicesController.upsertDevice(req, reply));
    fastify.patch("/device/:id", { schema: buildPatchDeviceSchema() }, async (req, reply) => await fastify.diContainer.cradle.devicesController.patchDevice(req, reply));
    fastify.get("/device/:id", { schema: buildGetDeviceSchema() }, async (req, reply) => await fastify.diContainer.cradle.devicesController.getDevice(req, reply));
    fastify.delete("/device/:id", { schema: buildDeleteDeviceSchema() }, async (req, reply) => await fastify.diContainer.cradle.devicesController.deleteDevice(req, reply));

    fastify.post("/device/:id/history", { schema: buildPostHistorySchema() }, async (req, reply) => await fastify.diContainer.cradle.historyController.postHistory(req, reply));
    fastify.get("/device/:id/history", { schema: buildGetHistoryByDeviceSchema() }, async (req, reply) => await fastify.diContainer.cradle.historyController.getHistoryByDeviceId(req, reply));

    fastify.get("/sync-time", { schema: buildSyncDeviceTimeSchema() }, async (req, reply) => await fastify.diContainer.cradle.utilController.getSecondsSinceMidnight(req, reply));
}

const buildPutDeviceSchema = (): FastifySchema => {
    return {
        body: { $ref: "device#" }, 
        response: {
            "4xx": { $ref: "4xxGenericResponse#", description: "A validation error was ocurred" },
            "5xx": { $ref: "5xxGenericResponse#", description: "An internal error was ocurred" },
            "2xx": {
                description: "Device registered",
                content: {
                    "application/json": {
                        schema: { $ref: "device#" }
                    }
                }
            }
        }
    } as FastifySchema;
}
const buildPatchDeviceSchema = (): FastifySchema => {
    return {
        body: { $ref: "patchDevice#" }, 
        response: {
            "4xx": { $ref: "4xxGenericResponse#", description: "A validation error was ocurred" },
            "5xx": { $ref: "5xxGenericResponse#", description: "An internal error was ocurred" },
            "2xx": {
                type: "null",
                description: "Device patched"
            }
        }
    } as FastifySchema;
}
const buildGetDeviceSchema = (): FastifySchema => {
    return {
        response: {
            "4xx": { $ref: "4xxGenericResponse#", description: "A validation error was ocurred" },
            "5xx": { $ref: "5xxGenericResponse#", description: "An internal error was ocurred" },
            "2xx": {
                description: "Device",
                content: {
                    "application/json": {
                        schema: { $ref: "device#" }
                    }
                }
            }
        }
    } as FastifySchema;
}
const buildDeleteDeviceSchema = (): FastifySchema => {
    return {
        response: {
            "4xx": { $ref: "4xxGenericResponse#", description: "A validation error was ocurred" },
            "5xx": { $ref: "5xxGenericResponse#", description: "An internal error was ocurred" },
            "2xx": {
                type: "null",
                description: "History deleted"
            }
        }
    } as FastifySchema;
}
const buildGetDevicesSchema = (): FastifySchema => {
    return {
        response: {
            "4xx": { $ref: "4xxGenericResponse#", description: "A validation error was ocurred" },
            "5xx": { $ref: "5xxGenericResponse#", description: "An internal error was ocurred" },
            "2xx": {
                description: "Devices",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: { $ref: "device#" },
                        }
                    }
                }
            }
        }
    } as FastifySchema;
}
const buildPostHistorySchema = (): FastifySchema => {
    return {
        body: { $ref: "history#" }, 
        response: {
            "4xx": { $ref: "4xxGenericResponse#", description: "A validation error was ocurred" },
            "5xx": { $ref: "5xxGenericResponse#", description: "An internal error was ocurred" },
            "2xx": {
                type: "null",
                description: "History posted"
            }
        }
    } as FastifySchema;
}
const buildGetHistoryByDeviceSchema = (): FastifySchema => {
    return {
        response: {
            "4xx": { $ref: "4xxGenericResponse#", description: "A validation error was ocurred" },
            "5xx": { $ref: "5xxGenericResponse#", description: "An internal error was ocurred" },
            "2xx": {
                description: "Histories",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: { $ref: "history#" },
                        }
                    }
                }
            }
        }
    } as FastifySchema;
}
const buildSyncDeviceTimeSchema = (): FastifySchema => {
    return {
        response: {
            "4xx": { $ref: "4xxGenericResponse#", description: "A validation error was ocurred" },
            "5xx": { $ref: "5xxGenericResponse#", description: "An internal error was ocurred" },
            "2xx": {
                type: "object",
                properties: {
                    seconds: { type: "number" }
                }
            }
        }
    } as FastifySchema;
}

const registerSchemas = (fastify: FastifyInstance) => {
    fastify.addSchema({
        $id: "patchDevice",
        type: "object",
        properties: {
            activationSeconds: { type: "number" },
            irrigateSeconds: { type: "number" },
            name: { type: "string" },
            lastReceivedUpdate: { type: "string" },
        },
    });
    fastify.addSchema({
        $id: "device",
        type: "object",
        properties: {
            _id: { $ref: "id#" },
            activationSeconds: { type: "number" },
            irrigateSeconds: { type: "number" },
            name: { type: "string" },
            lastReceivedUpdate: { type: "string" },
        },
        required: [ "activationSeconds", "irrigateSeconds", "name" ],
    });
    fastify.addSchema({
        $id: "history",
        type: "object",
        properties: {
            _id: { $ref: "id#" },
            deviceId: { $ref: "id#" },
            key: { type: "string" },
            description: { type: "string" },
            createdOn: { type: "string" },
        },
        required: [ "deviceId", "key", "description" ],
    });

    fastify.addSchema({
        $id: "4xxGenericResponse",
        type: "object",
        properties: {
            statusCode: { type: "number" },
            code: { type: "string" },
            error: { type: "string" },
            message: { type: "string" },
        },
        required: [ "statusCode", "code", "error", "message" ],
    });

    fastify.addSchema({
        $id: "5xxGenericResponse",
        type: "object",
        properties: {
            statusCode: { type: "number" },
            code: { type: "string" },
            error: { type: "string" },
            message: { type: "string" },
        },
        required: [ "statusCode", "code", "error", "message" ],
    });

    fastify.addSchema({
        $id: "id",
        type: "string",
        pattern: "^[0-9a-z]{24}$"
    });
}