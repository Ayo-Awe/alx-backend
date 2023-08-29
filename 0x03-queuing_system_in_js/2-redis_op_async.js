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

function setNewSchool(schoolName, value) {
  redisClient.set(schoolName, value, print);
}

async function displaySchoolValue(schoolName) {
  const value = await getAsync(schoolName);
  console.log(value);
}

displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");
