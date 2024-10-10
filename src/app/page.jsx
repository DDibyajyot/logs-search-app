"use client";

import { useState, useEffect } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queryMessage, setQueryMessage] = useState(""); 
  const [queryMetadata, setQueryMetadata] = useState("");
  const [debouncedQueryMessage, setDebouncedQueryMessage] = useState("");
  const [debouncedQueryMetadata, setDebouncedQueryMetadata] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalLogs, setTotalLogs] = useState(0);
  const [logsPerPage, setLogsPerPage] = useState(10);

  const [searchMessageChecked, setSearchMessageChecked] = useState(false);
  const [searchMetadataChecked, setSearchMetadataChecked] = useState(false);
  const [searchLevelChecked, setSearchLevelChecked] = useState(false);

  // for timeframe
  const [dateFilterChecked, setDateFilterChecked] = useState(false);
  const [dateFilterType, setDateFilterType] = useState("none");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // advanced timeframe
  const [advancedDateFilterChecked, setAdvancedDateFilterChecked] =
    useState(false);
  const [advancedStartDate, setAdvancedStartDate] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  const [gotoPage, setGotoPage] = useState("");

  useEffect(() => {
    const handlerMessage = setTimeout(() => {
      setDebouncedQueryMessage(queryMessage);
    }, 300);
    const handlerMetadata = setTimeout(() => {
      setDebouncedQueryMetadata(queryMetadata);
    }, 300);

    return () => {
      clearTimeout(handlerMessage);
      clearTimeout(handlerMetadata);
    };
  }, [queryMessage, queryMetadata]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      let queryParams = `/api/search?page=${page}&limit=${logsPerPage}`;

      if (searchMessageChecked && debouncedQueryMessage) {
        queryParams += `&message=${debouncedQueryMessage}`;
      }
      if (searchMetadataChecked && debouncedQueryMetadata) {
        queryParams += `&metadata=${debouncedQueryMetadata}`;
      }
      if (searchLevelChecked && level) {
        queryParams += `&level=${level}`;
      }

      if (dateFilterChecked && dateFilterType === "on" && startDate) {
        queryParams += `&date_on=${startDate}`;
      }
      if (
        dateFilterChecked &&
        dateFilterType === "between" &&
        startDate &&
        endDate
      ) {
        queryParams += `&date_from=${startDate}&date_to=${endDate}`;
      }


      
      if (advancedDateFilterChecked && advancedStartDate) {
        queryParams += `&adv_date_on=${advancedStartDate}&hours=${hours}&minutes=${minutes}&seconds=${seconds}`;
      }

      try {
        const res = await fetch(queryParams);
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        setLogs(data.data);
        setTotalPages(data.totalPages);
        setTotalLogs(data.totalLogs);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [
    page,
    debouncedQueryMessage,
    debouncedQueryMetadata,
    level,
    logsPerPage,
    startDate,
    endDate,
    dateFilterType,
    advancedDateFilterChecked,
    hours,
    minutes,
    seconds,
  ]);

  const handleMessageChange = (e) => setQueryMessage(e.target.value);
  const handleMetadataChange = (e) => setQueryMetadata(e.target.value);
  const handleLevelChange = (e) => setLevel(e.target.value);
  const handleDateFilterTypeChange = (e) => setDateFilterType(e.target.value);
  const handleHoursChange = (e) => setHours(e.target.value);
  const handleMinutesChange = (e) => setMinutes(e.target.value);
  const handleSecondsChange = (e) => setSeconds(e.target.value);

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);
  const handleGotoPageChange = (e) => setGotoPage(e.target.value);
  const handleGotoPageSubmit = () => {
    const targetPage = parseInt(gotoPage, 10);
    if (targetPage >= 1 && targetPage <= totalPages) {
      setPage(targetPage);
      setGotoPage("");
    } else {
      alert("Invalid page number.");
    }
  };

  return (
    <div className="container">
      <h1>Logs Search</h1>
      <h2 className="search-options-title">Search Options</h2>
      <div className="filter-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={searchMessageChecked}
            onChange={(e) => setSearchMessageChecked(e.target.checked)}
          />
          Message
          <input
            type="text"
            placeholder="Search logs by message"
            value={queryMessage}
            onChange={handleMessageChange}
            disabled={!searchMessageChecked}
            className="search-input"
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={searchMetadataChecked}
            onChange={(e) => setSearchMetadataChecked(e.target.checked)}
          />
          Metadata (IP)
          <input
            type="text"
            placeholder="Enter IP part"
            value={queryMetadata}
            onChange={handleMetadataChange}
            disabled={!searchMetadataChecked}
            className="search-input"
          />
        </label>


        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={searchLevelChecked}
            onChange={(e) => setSearchLevelChecked(e.target.checked)}
          />
          Level
          <select
            value={level}
            onChange={handleLevelChange}
            disabled={!searchLevelChecked}
            className="level-select"
          >
            <option value="">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>
        </label>


        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={dateFilterChecked}
            onChange={(e) => setDateFilterChecked(e.target.checked)}
          />
          Timeframe
          <select
            value={dateFilterType}
            onChange={handleDateFilterTypeChange}
            disabled={!dateFilterChecked}
            className="date-filter-dropdown"
          >
            <option value="none">None</option>
            <option value="on">ON</option>
            <option value="between">BETWEEN</option>
          </select>
          {dateFilterType === "on" && (
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={!dateFilterChecked}
            />
          )}
          {dateFilterType === "between" && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={!dateFilterChecked}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={!dateFilterChecked}
              />
            </>
          )}
        </label>


        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={advancedDateFilterChecked}
            onChange={(e) => setAdvancedDateFilterChecked(e.target.checked)}
          />
          Advanced Timeframe
          <div>
            <input
              type="date"
              value={advancedStartDate}
              onChange={(e) => setAdvancedStartDate(e.target.value)}
              disabled={!advancedDateFilterChecked}
            />
            <div className="time-inputs">
              <label>Hours:</label>
              <input
                type="number"
                value={hours}
                onChange={handleHoursChange}
                min="0"
                max="23"
                disabled={!advancedDateFilterChecked}
              />
              <label>Minutes:</label>
              <input
                type="number"
                value={minutes}
                onChange={handleMinutesChange}
                min="0"
                max="59"
                disabled={!advancedDateFilterChecked || !hours}
              />
              <label>Seconds:</label>
              <input
                type="number"
                value={seconds}
                onChange={handleSecondsChange}
                min="0"
                max="59"
                disabled={!advancedDateFilterChecked || !minutes}
              />
            </div>
          </div>
        </label>
      </div>

      <div className="slider-section">
        <p className="slider-label">Logs per page:</p>
        <input
          type="range"
          min="5"
          max="100"
          step="5"
          value={logsPerPage}
          onChange={(e) => setLogsPerPage(parseInt(e.target.value, 10))}
          className="logs-per-page-slider"
        />
        <p>Showing {logsPerPage} logs per page</p>
      </div>


      <table className="logs-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Level</th>
            <th>Message</th>
            <th>Metadata</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.level}</td>
                <td>{log.message}</td>
                <td>{log.metadata}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No logs found</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
        <div className="goto-page">
          <input
            type="number"
            value={gotoPage}
            onChange={handleGotoPageChange}
            placeholder="Enter page number"
            className="goto-page-input"
          />
          <button onClick={handleGotoPageSubmit} className="goto-page-button">
            Go
          </button>
        </div>
        <p>
          Page {page} of {totalPages} (Total Logs: {totalLogs})
        </p>
      </div>
    </div>
  );
}
