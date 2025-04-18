import React, { useState, useEffect } from "react";
import Layout from "../layout";
import "../layout.css";
import "./report1.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const Report1 = () => {
  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectId, setSelectId] = useState("");

  const handleExport = () => {
    alert(
      `Exporting report for Client ID: ${clientId} from ${startDate} to ${endDate}`
    );
  };

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
      <h4>Abandan Report</h4>
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
              // dateFormat="dd/MM/yyyy"
              className="input-box"
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              // dateFormat="dd/MM/yyyy"
              className="input-box"
            />
          </div>

          <button onClick={handleExport} className="export-btn">
            Export
          </button>
          <button className="view-btn">View</button>
        </div>
      </div>
    </Layout>
  );
};

export default Report1;
