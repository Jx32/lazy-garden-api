import { FastifyInstance, FastifySchema } from "fastify";

export const appRoutes = async (fastify: FastifyInstance) => {
    registerSchemas(fastify);

    fastify.put("/device", { schema: buildPutDeviceSchema() }, async (req, reply) => await fastify.diContainer.cradle.devicesController.upsertDevice(req, reply));
    fastify.patch("/device/:id", { schema: buildPatchDeviceSchema() }, async (req, reply) => await fastify.diContainer.cradle.devicesController.patchDevice(req, reply));
    fastify.get("/device/:id", { schema: buildGetDeviceSchema() }, async (req, reply) => await fastify.diContainer.cradle.devicesController.getDevice(req, reply));
}

const buildPutDeviceSchema = (): FastifySchema => {
    return {
        body: { $ref: "device#" }, 
        response: {
            "4xx": { $ref: "4xxGenericResponse#", description: "A validation error was ocurred" },
            "5xx": { $ref: "5xxGenericResponse#", description: "An internal error was ocurred" },
            "2xx": {
                type: "null",
                description: "Device registered"
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

const registerSchemas = (fastify: FastifyInstance) => {
    fastify.addSchema({
        $id: "patchDevice",
        type: "object",
        properties: {
            activationSeconds: { type: "number" },
            irrigateSeconds: { type: "number" },
            state: { type: "string", enum: ["CLOSED", "IRRIGATING", "ERROR"] },
            error: { type: "string" },
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
            state: { type: "string", enum: ["CLOSED", "IRRIGATING", "ERROR"] },
            error: { type: "string" },
            lastReceivedUpdate: { type: "string" },
        },
        required: [ "activationSeconds", "irrigateSeconds", "state" ],
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