import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { INTERNAL_SERVER_ERROR, InternalServerError } from "./internal-server-error.error";

const securityErrorCodes = [401, 403];

export const handleRequestError = (fastify: FastifyInstance, error: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
    fastify.log.error(`An an error was ocurred. Serialized error: ${JSON.stringify(error)} - ToString: ${error} - Stack: ${error.stack}`);

    const statusCode = error.statusCode || 500;

    if (statusCode >= 400 && statusCode < 500 && !securityErrorCodes.includes(statusCode)) {
        handleBadRequestError(statusCode, error, req, reply);
    } else if (securityErrorCodes.includes(statusCode)) {
        handleSecurityError(statusCode, reply);
    } else {
        handleInternalServerError(statusCode, reply);
    }
}

const handleBadRequestError = (statusCode: number, error: Error, req: FastifyRequest, reply: FastifyReply): void => {
    // Send as it is, trust that bad request errors doesn't expose sensitive data
    reply
        .code(statusCode)
        .send(error);
}

const handleInternalServerError = (statusCode: number, reply: FastifyReply): void => {
    const errorPayload: InternalServerError = {
        code: "IS-0",
        error: INTERNAL_SERVER_ERROR,
        message: "An internal error was ocurred, we're working on it. Sorry :(",
        name: INTERNAL_SERVER_ERROR,
        statusCode: statusCode
    }

    reply
        .code(statusCode)
        .send(errorPayload);
}

const handleSecurityError = (statusCode: number, reply: FastifyReply): void => {
    reply
        .code(statusCode)
        .send();
}