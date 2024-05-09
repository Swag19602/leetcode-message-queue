import { createClient } from "redis";
const client = createClient();

async function processSubmission(submission: string) {
  const { problemId, code, language } = JSON.parse(submission);
  console.log(`Processing submission for problemId ${problemId}`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);
  // here to add the actual processing logic to check the coding logic
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Finished processing submission for problemId: ${problemId}`);
}

async function startWorker() {
  try {
    await client.connect();
    console.log("Worker connected to Redis");
    //Main loop
    while (true) {
      try {
        const submisson = await client.brPop("problems", 0);
        //@ts-ignore
        await processSubmission(submisson?.element);
      } catch (err) {
        console.log("error processing submission", err);
        // Implement your error handling logic here. For example, you might want to push
        // the submission back onto the queue or log the error to a file.
      }
    }
  } catch (error) {
    console.log("failed to connect to redis", error);
  }
}
startWorker();
