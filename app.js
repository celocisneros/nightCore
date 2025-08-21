// Import Fastify
import Fastify from "fastify"; 

// Import Node.js path module to work with file/folder paths
import path from "path"; 

// Import Fastify static plugin to serve HTML/CSS/JS files
import fastifyStatic from "fastify-static"; 

// Create a Fastify instance with logging enabled
const fastify = Fastify({ logger: true }); 

// Register the static plugin to serve files from the "public" folder
fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), "public"), // Folder where your index.html lives
  prefix: "/", // Serve files at the root URL (http://localhost:3000/)
});

// Example API route
fastify.get("/api/hello", async () => {
  // When someone visits /api/hello, return JSON
  return { message: "Hello from Fastify!" }; 
});

// Start the server on port 3000
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    // Log errors and exit if server fails to start
    fastify.log.error(err); 
    process.exit(1);
  }
  // Log the URL where the server is running
  console.log(`Server running at ${address}`); 
});
