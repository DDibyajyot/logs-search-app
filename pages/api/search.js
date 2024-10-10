import clickhouse from "../../src/lib/clickhouse";

export default async function handler(req, res) {
  const {
    query = "",
    message = "",
    metadata = "",
    level = "",
    date_on = "",
    date_from = "",
    date_to = "",
    adv_date_on = "",
    adv_date_from = "",
    adv_date_to = "",
    hours = "",
    minutes = "",
    seconds = "",
    page = 1,
    limit = 10,
  } = req.query;

  const pageNumber = parseInt(page, 10) || 1;
  const logsPerPage = parseInt(limit, 10) || 10;
  const offset = (pageNumber - 1) * logsPerPage;

  let whereClause = "WHERE 1 = 1";

  if (message) {
    whereClause += ` AND message ILIKE '%${message}%'`;
  }

  if (metadata) {
    whereClause += ` AND metadata ILIKE '%IP: ${metadata}%'`;
  }

  if (level) {
    whereClause += ` AND level = '${level}'`;
  }

  if (date_on) {
    whereClause += ` AND toDate(timestamp) = '${date_on}'`;
  }

  if (date_from && date_to) {
    whereClause +=
      date_from === date_to
        ? ` AND toDate(timestamp) = '${date_from}'`
        : ` AND timestamp BETWEEN '${date_from}' AND '${date_to}'`;
  }

  
  if (adv_date_on) {
    let timePart = ` ${hours || "00"}:${minutes || "00"}:${seconds || "00"}`;
    whereClause += ` AND timestamp = '${adv_date_on}${timePart}'`;
  }

  if (adv_date_from && adv_date_to) {
    let timePartFrom = ` ${hours || "00"}:${minutes || "00"}:${
      seconds || "00"
    }`;
    let timePartTo = ` ${hours || "23"}:${minutes || "59"}:${seconds || "59"}`;
    whereClause += ` AND timestamp BETWEEN '${adv_date_from}${timePartFrom}' AND '${adv_date_to}${timePartTo}'`;
  }

  try {
    const logsQuery = `
      SELECT timestamp, level, message, metadata
      FROM logs
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT ${logsPerPage} OFFSET ${offset}
    `;

    const result = await clickhouse.query({
      query: logsQuery,
      format: "JSONEachRow",
    });

    const logs = [];
    for await (const chunk of result.stream()) {
      if (Array.isArray(chunk)) {
        chunk.forEach((log) => {
          try {
            const parsedLog = JSON.parse(log.text);
            logs.push(parsedLog);
          } catch (err) {
            console.error("Error parsing log:", log.text, err);
          }
        });
      }
    }

    const countQuery = `
      SELECT count() as total
      FROM logs
      ${whereClause}
    `;

    const countResult = await clickhouse.query({
      query: countQuery,
      format: "TabSeparated",
    });

    let totalLogs = 0;
    for await (const row of countResult.stream()) {
      if (Array.isArray(row) && row[0] && row[0].text) {
        totalLogs = parseInt(row[0].text.trim(), 10);
      }
    }

    res.status(200).json({
      data: logs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalLogs / logsPerPage),
      totalLogs: totalLogs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Error fetching logs" });
  }
}
