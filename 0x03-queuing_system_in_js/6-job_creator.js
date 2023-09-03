const kue = require("kue");
const queue = kue.createQueue({});

const jobData = {
  phoneNumber: "+234000000000",
  message: "Touch Grass",
};

const job = queue.create("push_notification_code", jobData);

job.save((err) => {
  if (!err) {
    console.log(`Notification job created: ${job.id}`);
  }
});

job
  .on("complete", function () {
    console.log("Notification job completed");
  })
  .on("failed", function (errorMessage) {
    console.log("Notification job failed");
  });
