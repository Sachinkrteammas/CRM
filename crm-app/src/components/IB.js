import React, { useState, useEffect } from "react";
import Layout from "../layout";
import "../layout.css";
import "./report1.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { BASE_URL } from "./config";

const Report2 = () => {
  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectId, setSelectId] = useState("");
  const [showTable, setShowTable] = useState(false);

  const handleExport = () => {
    alert(
      `Exporting report for Client ID: ${clientId} from ${startDate} to ${endDate}`
    );
  };

  const handleView = () => {
    setShowTable(true);
  };

  const tableData = [
    {
      id: 1,
      name: "John Doe",
      type: "HV",
      duration: "10 mins",
      date: "2025-04-15",
      status: "Completed",
      notes: "N/A",
    },
    {
      id: 2,
      name: "Jane Smith",
      type: "LV",
      duration: "8 mins",
      date: "2025-04-14",
      status: "Pending",
      notes: "Follow-up needed",
    },
    {
      id: 3,
      name: "John Doe",
      type: "HV",
      duration: "10 mins",
      date: "2025-04-15",
      status: "Completed",
      notes: "N/A",
    },
    {
      id: 4,
      name: "Jane Smith",
      type: "LV",
      duration: "8 mins",
      date: "2025-04-14",
      status: "Pending",
      notes: "Follow-up needed",
    },
    // add more rows as needed
  ];

  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem("token");

  axios
    .get("http://127.0.0.1:8080/active_companies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setCompanyList(res.data);
    })
    .catch((err) => {
      console.error("Failed to fetch companies", err);
    });
}, []);

  return (
    <Layout>
      <h4>IB CDR</h4>
      <div className="report-form-container">
        <div className="report-form">
          <div className="form-group">
            <label>Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="input-box-select"
            >
              <option value="">Select Client</option>
              {companyList.map((company) => (
                <option key={company.company_id} value={company.company_id}>
                  {company.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-select">
            <label>Select</label>
            <select
              value={selectId}
              onChange={(e) => setSelectId(e.target.value)}
              className="input-box-select"
            >
              <option value="">Select</option>
              <option value="all">All</option>
              <option value="hv">HV</option>
              <option value="lv">LV</option>
              <option value="mv">MV</option>
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              className="input-box"
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              className="input-box"
            />
          </div>

          <button onClick={handleExport} className="export-btn">
            Export
          </button>
          <button onClick={handleView} className="view-btn">
            View
          </button>
        </div>
      </div>
      {showTable && (
        <div className="report-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.type}</td>
                  <td>{row.duration}</td>
                  <td>{row.date}</td>
                  <td>{row.status}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Report2;
