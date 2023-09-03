import express from "express";
import { createClient } from "redis";
import { promisify } from "util";
import { createQueue } from "kue";

const app = express();
const redisClient = createClient();
const queue = createQueue();
let reservationEnabled = true;

function reserveSeat(number) {
  redisClient.set("available_seats", number.toString());
}

async function getCurrentAvailableSeats() {
  const getAsync = promisify(redisClient.get);

  const reserved = await getAsync.call(redisClient, "available_seats");

  return reserved ? Number(reserved) : 0;
}

app.get("/available_seats", async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.status(200).json({ numberOfAvailableSeats });
});

app.get("/reserve_seat", async (req, res) => {
  try {
    if (!reservationEnabled) {
      return res.status(200).json({ status: "Reservation are blocked" });
    }

    const job = queue.create("reservations");

    const saveAsync = promisify(job.save);
    await saveAsync.call(job);

    job
      .on("complete", function () {
        console.log(`Seat reservation job ${job.id} completed`);
      })
      .on("failed", function (errorMessage) {
        console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
      });

    res.status(200).json({ status: "Reservation in process" });
  } catch (error) {
    res.status(500).json({ status: "Reservation failed" });
  }
});

app.get("/process", async (req, res) => {
  res.status(200).json({ status: "Queue processing" });

  queue.process("reservations", async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();
    const newAvailableSets = availableSeats - 1;

    if (newAvailableSets == 0) {
      reservationEnabled = false;
    }

    if (newAvailableSets < 0) {
      return done(Error("Not enough seats available"));
    }

    reserveSeat(newAvailableSets);
    done();
  });
});

app.listen(1245, () => {
  console.log("listening for requests on port 1245");
  redisClient.set("available_seats", 50);
});
