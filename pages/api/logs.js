import clickhouse from "../../src/lib/clickhouse";

// Helper function to format the timestamp
function formatTimestamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { level, message, metadata } = req.body;

    if (!level || !message) {
      return res.status(400).json({ error: "Level and message are required" });
    }

    try {
      const logEntry = [
        {
          timestamp: formatTimestamp(),
          level: level,
          message: message,
          metadata: metadata || "",
        },
      ];

      await clickhouse.insert({
        table: "logs",
        values: logEntry,
        format: "JSONEachRow",
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to insert log" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
