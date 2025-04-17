import React, { useState } from "react";
import Layout from "../layout";
import "../layout.css";
import "./report1.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const Report3 = () => {
    const [clientId, setClientId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectId, setSelectId] = useState("");
    const [showTable, setShowTable] = useState(false);

    const handleExport = () => {
        alert(`Exporting report for Client ID: ${clientId} from ${startDate} to ${endDate}`);
    };

    const handleView = () => {
        setShowTable(true);
    };

    const tableData = [
        { id: 1, name: "John Doe", type: "HV", duration: "10 mins", date: "2025-04-15", status: "Completed", notes: "N/A" },
        { id: 2, name: "Jane Smith", type: "LV", duration: "8 mins", date: "2025-04-14", status: "Pending", notes: "Follow-up needed" },
        // add more rows as needed
    ];




    return (
        <Layout>
            <h4>OB CDR</h4>
            <div className="report-form-container">

                <div className="report-form">


                    <div className="form-group">
                        <label>Client ID</label>
                        <input
                            type="text"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            placeholder="Enter Client ID"
                            className="input-box"
                        />
                    </div>

                    {/* <div className="form-group">
                        <label>Select</label>
                        <input
                            type="text"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            placeholder="Select"
                            className="input-box"
                        />
                    </div> */}

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

                    <button onClick={handleExport} className="export-btn">Export</button>
                    <button onClick={handleView} className="view-btn">View</button>
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

export default Report3;
