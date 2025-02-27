import { FastifyError } from "fastify";

export const INTERNAL_SERVER_ERROR = "InternalServerError";

/**
 * Note: It's not adviced to directly throw this class, instead use:
 * <code>throw new Error(...);</code>
 * This will allow to have the full error stack of the root cause
 */
export class InternalServerError implements FastifyError {
    name: string;
    statusCode: number;
    code: string;
    error: string;
    message: string;

    constructor(code: string, error: string, message: string) {
        this.name = INTERNAL_SERVER_ERROR;
        this.statusCode = 500;
        this.code = code;
        this.error = error;
        this.message = message;
    }
}