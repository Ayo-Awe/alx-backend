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

function setHash() {
  const hash = {
    Portland: 50,
    Seattle: 80,
    "New York": 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };

  Object.entries(hash).map(([field, value]) => {
    redisClient.hset("HolbertonSchools", field, value, print);
  });
}

function getHash() {
  redisClient.hgetall("HolbertonSchools", (err, reply) => {
    console.log(reply);
  });
}

setHash();
getHash();
