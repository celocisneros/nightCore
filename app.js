import Fastify from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static"; // updated import

const fastify = Fastify({ logger: true });

// Serve static files from public/
fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), "public"),
  prefix: "/", // optional: serve at root
});

fastify.get("/api/hello", async () => {
  return { message: "Hello from Fastify!" };
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
