import { FastifyInstance, RegisterOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import cors from "@fastify/cors";

const corsPlugin = async (fastify: FastifyInstance, options: RegisterOptions) => {
    fastify.register(cors, {
        origin: [
            "http://localhost:8100",
            "https://lazy-garden.vercel.app"
        ],
    });
}

export default fastifyPlugin(corsPlugin);