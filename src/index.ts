import fastify, { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { handleRequestError } from "./errors/error.handler";
import corsPlugin from "./plugins/cors.plugin";
import mongoPlugin from "./plugins/mongo.plugin";
import awilixPlugin from "./plugins/awilix.plugin";
import { appRoutes } from "./app.routes";

const server: FastifyInstance = fastify({
    logger: {
        enabled: true,
        level: "DEBUG"
    },
    requestIdHeader: "req-id",
});

server.setErrorHandler((err, req, reply) => handleRequestError(server, err, req, reply));

// Register plugins
server.register(corsPlugin);
server.register(mongoPlugin);
server.register(awilixPlugin);

server.register(appRoutes, { prefix: "api/v1" });

const startServer = async () => {
    try {
        const port: number = parseInt(process.env.PORT || "8080");

        await server.listen({
            port,
            host: "0.0.0.0",
        });

        server.log.info(`Server started at port ${port}`);
    } catch (error) {
        server.log.error(`Error while starting server: ${error}`);
        process.exit(1);
    }
}

// Gracefully shutown listeners
const listeners = ["SIGINT", "SIGTERM"];
listeners.forEach(signal => {
    process.on(signal, async () => {
        await server.close();
        process.exit(0);
    });
})

startServer();