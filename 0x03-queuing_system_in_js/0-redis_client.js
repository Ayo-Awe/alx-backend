import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (e) => {
  console.log(`Redis client not connected to the server: ${e.message}`);
});

redisClient.on("connect", () => {
  console.log("Redis client connected to the server");
});
