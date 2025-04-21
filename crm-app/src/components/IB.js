import React, { useState, useEffect } from "react";
import Layout from "../layout";
import "../layout.css";
import "./report1.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { BASE_URL } from "./config";
import * as XLSX from "xlsx";

const Report2 = () => {
  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectId, setSelectId] = useState("");
  const [tableData, setTableData] = useState([]);
  const [ExcelData, setExcelData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading1, setLoading1] = useState(false);

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
  `${BASE_URL}/api/call_cdr_in?from_date=${formattedStart}&to_date=${formattedEnd}&clientId=${clientId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)
      const result = response.data;

      setTableData(result.data);
      setExcelData(result.data);

      setShowTable(true);
    } catch (error) {
      console.error("Error fetching table data:", error);
      alert("Failed to fetch data");

    }
    finally {
      setLoading1(false);
    }
  };

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

  const downloadExcel = async () => {
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
  `${BASE_URL}/api/call_cdr_in?from_date=${formattedStart}&to_date=${formattedEnd}&clientId=${clientId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)
    const result = response.data;

    if (!result.data || result.data.length === 0) {
      alert("No data available to export.");
      return;
    }

    setExcelData(result.data);


    const worksheet = XLSX.utils.json_to_sheet(result.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Call Data");
    XLSX.writeFile(workbook, "cdr_ib_data.xlsx");
  } catch (error) {
    console.error("Error fetching table data:", error);
    alert("Failed to fetch data");
  }
  finally {
    setLoading1(false);
  }

};

  return (
    <Layout>
      <div className={`${loading1 ? "blurred" : ""}`}>
        <h4>IB CDR</h4>
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

            {/* Select Type (All, HV, LV, MV) */}
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

            {/* Action Buttons */}
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
        {showTable && (
          <div className="report-table">
            {showTable && tableData.length > 0 && (
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
            )}
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

export default Report2;
