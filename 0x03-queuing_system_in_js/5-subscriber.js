import { createClient, print } from "redis";
import { promisify } from "util";

const redisClient = createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);

redisClient.on("error", (e) => {
  console.log(`Redis client not connected to the server: ${e.message}`);
});

redisClient.on("connect", () => {
  console.log("Redis client connected to the server");
});

redisClient.subscribe("holberton school channel");
redisClient.on("message", (channel, message) => {
  if (channel !== "holberton school channel") return;

  console.log(message);

  if (message === "KILL_SERVER") {
    redisClient.unsubscribe("holberton school channel");
    process.exit();
  }
});
