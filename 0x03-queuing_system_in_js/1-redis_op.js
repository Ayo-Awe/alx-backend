import { createClient, print } from "redis";

const redisClient = createClient();

redisClient.on("error", (e) => {
  console.log(`Redis client not connected to the server: ${e.message}`);
});

redisClient.on("connect", () => {
  console.log("Redis client connected to the server");
});

function setNewSchool(schoolName, value) {
  redisClient.set(schoolName, value, print);
}

function displaySchoolValue(schoolName) {
  redisClient.get(schoolName, function (err, value) {
    console.log(value);
  });
}

displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");
