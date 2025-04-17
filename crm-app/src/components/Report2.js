import React, { useState } from "react";
import Layout from "../layout";
import "../layout.css";
import "./report1.css";


const Report2 = () => {
    const [clientId, setClientId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleExport = () => {
        alert(`Exporting report for Client ID: ${clientId} from ${startDate} to ${endDate}`);
    };



    return (
        <Layout>
            <h2>IB CDR</h2>
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

                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="input-box"
                        />
                    </div>

                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input-box"
                        />
                    </div>

                    <button onClick={handleExport} className="export-btn">
                        Export
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Report2;
