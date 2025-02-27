import { FastifyError } from "fastify";

const BAD_REQUEST_ERROR_NAME = "BadRequestError";

export class BadRequestError implements FastifyError {
    name: string;
    statusCode: number;
    code: string;
    error: string;
    message: string;

    constructor(code: string, error: string, message: string, statusCode: number = 400) {
        this.name = BAD_REQUEST_ERROR_NAME;
        this.statusCode = statusCode;
        this.code = code;
        this.error = error;
        this.message = message;
    }
}