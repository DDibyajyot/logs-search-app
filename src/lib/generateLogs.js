import { format } from "date-fns"; 
import clickhouse from "./clickhouse.js";


function generateLogEntry() {
  const levels = ["INFO", "WARN", "ERROR"];
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];

  const messages = [
    "User logged in",
    "File not found",
    "Database error",
    "Server crash",
    "User updated settings",
    "Payment processed",
    "Request timeout",
    "Invalid input data",
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  const randomMetadata = `IP: 192.168.${Math.floor(
    Math.random() * 255
  )}.${Math.floor(Math.random() * 255)}`;

 
  const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  return {
    timestamp: timestamp,
    level: randomLevel,
    message: randomMessage,
    metadata: randomMetadata,
  };
}


async function insertLogsBatch(batchSize, totalLogs) {
  for (let i = 0; i < totalLogs; i += batchSize) {
    const batch = [];

    for (let j = 0; j < batchSize && i + j < totalLogs; j++) {
      const logEntry = generateLogEntry();
      batch.push(logEntry); 
    }

    try {
      await clickhouse.insert({
        table: "logs",
        values: batch, 
        format: "JSONEachRow",
      });
      console.log(`Inserted ${batch.length} logs`);
    } catch (error) {
      console.error("Error inserting logs:", error);
    }
  }
}


insertLogsBatch(1000, 1000004).then(() => {
  console.log("Finished inserting logs");
  process.exit(0);
});
