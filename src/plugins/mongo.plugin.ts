import fastifyMongodb = require("@fastify/mongodb");
import { FastifyInstance, RegisterOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";

const mongoPlugin = async (fastify: FastifyInstance, options: RegisterOptions) => {
    fastify.register(fastifyMongodb, {
        url: process.env.MONGO_URL || "mongodb://dev:dev1234@localhost:27099/",
        ssl:  (process.env.MONGO_SSL === "true") || false,
        database: process.env.MONGO_DB || "lazygarden",
    })
    .ready(() => fastify.log.info("MongoDb connected"));
}

export default fastifyPlugin(mongoPlugin);