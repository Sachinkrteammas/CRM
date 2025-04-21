import React, { useState, useEffect } from "react";
import Layout from "../layout";
import "../layout.css";
import "./report1.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { BASE_URL } from "./config";
import * as XLSX from "xlsx";

const Report4 = () => {
  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectId, setSelectId] = useState("");
  const [tableData, setTableData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${BASE_URL}/active_companies`, {
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

  // ✅ Helper: Flatten nested API response
  const flattenData = (nestedData) => {
    const flattened = [];
    for (const date in nestedData) {
      for (const hour in nestedData[date]) {
        flattened.push({
          date,
          hour,
          ...nestedData[date][hour],
        });
      }
    }
    return flattened;
  };

  // ✅ View button click
  const handleView = async () => {
    if (!clientId || !startDate || !endDate) {
      alert("Please select client, start date and end date");
      return;
    }

    setLoading1(true);

    const formattedStart = startDate.toISOString().split("T")[0];
    const formattedEnd = endDate.toISOString().split("T")[0];
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
  `${BASE_URL}/api/reportprint?from_date=${formattedStart}&to_date=${formattedEnd}&clientId=${clientId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)
      const result = response.data;

      const flatData = flattenData(result.data);
      setTableData(flatData);
      setExcelData(flatData);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching table data:", error);
      alert("Failed to fetch data");
    } finally {
      setLoading1(false);
    }
  };

  // ✅ Excel download
  const downloadExcel = async () => {
  if (!clientId || !startDate || !endDate) {
    alert("Please select client, start date and end date");
    return;
  }

  setLoading1(true);

  const formattedStart = startDate.toISOString().split("T")[0];
  const formattedEnd = endDate.toISOString().split("T")[0];
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `${BASE_URL}/api/reportprint?from_date=${formattedStart}&to_date=${formattedEnd}&clientId=${clientId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const rawData = response.data;

    if (!rawData.data || Object.keys(rawData.data).length === 0) {
      alert("No data available to export.");
      return;
    }

    // Flatten nested object to an array of { Date, Hour, ...metrics }
    const formattedData = [];
    for (const [date, hours] of Object.entries(rawData.data)) {
      for (const [hour, metrics] of Object.entries(hours)) {
        formattedData.push({
          Date: date,
          Hour: hour,
          ...metrics,
        });
      }
    }

    setExcelData(formattedData);

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Call Data");
    XLSX.writeFile(workbook, "cdr_sla_data.xlsx");
  } catch (error) {
    console.error("Error fetching table data:", error);
    alert("Failed to fetch data");
  } finally {
    setLoading1(false);
  }
};




  return (
    <Layout>
      <div className={`${loading1 ? "blurred" : ""}`}>
        <h4>SLA</h4>
        <div className="report-form-container">
          <div className="report-form">
            {/* Client Dropdown */}
            <div className="form-group">
              <label>Client Name</label>
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

            {/* Select Type */}
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

            {/* Start Date */}
            <div className="form-group">
              <label>Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                className="input-box"
              />
            </div>

            {/* End Date */}
            <div className="form-group">
              <label>End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                className="input-box"
              />
            </div>

            {/* Buttons */}
            <button
              onClick={() => downloadExcel()}
              className="export-btn"
            >
              Export
            </button>
            <button onClick={handleView} className="view-btn">
              View
            </button>
          </div>
        </div>

        {/* Table Section */}
        {showTable && tableData.length > 0 && (
          <div className="report-table">
            <table className="data-table">
              <thead style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#fff",
                zIndex: 2,
                textTransform: "capitalize"
              }}>
                <tr>
                  {Object.keys(tableData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((val, idx) => (
                      <td key={idx}>{val !== null ? val.toString() : ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {loading1 && (
          <div className="loader-overlay">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Report4;
