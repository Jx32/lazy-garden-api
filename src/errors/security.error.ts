import { FastifyError } from "fastify";

const SECURITY_ERROR = "SecurityError";

export class SecurityError implements FastifyError {
    name: string;
    statusCode: number;
    code: string;
    error: string;
    message: string;

    constructor() {
        this.name = SECURITY_ERROR;
        this.statusCode = 401;
        this.code = "SE-1";
        this.error = "FORBIDDEN";
        this.message = "FORBIDDEN ACCESS";
    }
}