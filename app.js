import Fastify from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";

const fastify = Fastify({ logger: true });

// Serve static files from the "public" folder
fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), "public"),
  prefix: "/", // Serve at root URL
});

// Debug hook: logs all incoming requests
fastify.addHook("onRequest", (request, reply, done) => {
  console.log("Incoming request:", request.url);
  done();
});

// Example API route
fastify.get("/api/hello", async () => {
  return { message: "Hello from Fastify!" };
});

// Start server on all interfaces
fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
