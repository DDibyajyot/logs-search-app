# **Logs Search Application**

## Overview
The Logs Search App is a powerful tool designed for developers and system administrators to search, filter, and analyze system logs in real-time. The app offers advanced search capabilities, filtering by various parameters like log level, message content, metadata, and even timestamps down to the second. It's a vital tool for anyone looking to monitor, diagnose, and troubleshoot system behaviors efficiently.

## Features

1. **Search and Filter**
   - Search logs by **message**, **metadata (IP)**, **log level**, and **timeframe**.
   - **Advanced Timeframe Search**: Search logs based on exact timestamps, including hours, minutes, and seconds for precise log investigation.

2. **Pagination & Custom Logs Per Page**
   - Navigate through thousands of logs using **pagination**.
   - Adjust how many logs are displayed per page with a customizable slider.

3. **Visualization** *(Planned)*
   - Gain insights from logs with visual charts like bar graphs and pie charts.
   - **Geo-location visualization** of log origin using IP addresses.

4. **Smart Search** *(Planned)*
   - Save frequently used search configurations with custom templates.

5. **Advanced Filtering**
   - Use filters for custom date ranges, log severity, and metadata to narrow down the logs you're interested in.

6. **Export Logs** *(Planned)*
   - Export search results in **CSV**, **JSON**, or **PDF** formats for offline use.



## Getting Started

### Installation

To install and run the app, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/username/logs-search-app.git
    cd logs-search-app
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Visit `http://localhost:3000` in your browser to access the app.

### Backend Setup

1. Ensure you have **ClickHouse** installed and running.

2. Configure the connection in `clickhouse.js` with your ClickHouse credentials:
    ```javascript
    const clickhouse = new ClickHouse({
      url: 'http://localhost',
      port: 8123,
      debug: false,
      basicAuth: {
        username: 'default',
        password: '',
      },
      isUseGzip: false,
      format: "json", // "json" || "csv" || "tsv"
      raw: false,
      config: {
        session_timeout: 60,
        output_format_json_quote_64bit_integers: 0,
        enable_http_compression: 0,
      },
    });
    ```

## Features

1. **Search by Message**
   - Search logs by entering keywords in the message field.
   
2. **Search by Metadata**
   - Filter logs based on IP parts or other metadata information.
   
3. **Level Filtering**
   - Filter logs by **INFO**, **WARN**, and **ERROR** levels.
   
4. **Date Filtering**
   - Search logs by date **ON** or **BETWEEN** specified dates.

5. **Advanced Timeframe Search**
   - Specify hours, minutes, and seconds to perform a more granular search.

6. **Pagination**
   - View logs with paginated results and control the number of logs per page.

7. **Custom Alerts** *(Planned)*
   - Set **threshold alerts** to notify you via email or SMS when critical logs appear.

## Roadmap

- [ ] Add user-defined alerts
- [ ] Save Search Templates used repeatedly
- [ ] Implement visual dashboards
