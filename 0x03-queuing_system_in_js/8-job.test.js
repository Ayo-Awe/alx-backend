import { after, afterEach, before, describe, it } from "mocha";
import { createQueue } from "kue";
import { expect } from "chai";
import createPushNotificationsJobs from "./8-job";

const queue = createQueue();

describe("Test createPushNotificationsJobs", () => {
  before(() => {
    queue.testMode.enter();
  });

  afterEach(function () {
    queue.testMode.clear();
  });

  after(function () {
    queue.testMode.exit();
  });

  it("should throw error when jobs in not an array", () => {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw();
  });

  it("should successfully add jobs to queue", () => {
    const jobs = [
      {
        phoneNumber: "4153118782",
        message: "This is the code 4321 to verify your account",
      },
      {
        phoneNumber: "4153718781",
        message: "This is the code 4562 to verify your account",
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.length).to.eq(2);
    expect(queue.testMode.jobs[0].data.phoneNumber).eq(jobs[0].phoneNumber);
    expect(queue.testMode.jobs[0].data.message).eq(jobs[0].message);
    expect(queue.testMode.jobs[1].data.phoneNumber).eq(jobs[1].phoneNumber);
    expect(queue.testMode.jobs[1].data.message).eq(jobs[1].message);
  });
});
